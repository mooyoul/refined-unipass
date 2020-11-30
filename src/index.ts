import { Namespace, Parameter, Route, Router, StandardError, ValidationError } from "@serverless-seoul/corgi";
import { Type } from "@serverless-seoul/typebox";

import { CargoClearanceProgress } from "unipass";

const cargoClearanceProgress = new CargoClearanceProgress(process.env.CARGO_CLEARANCE_PROGRESS_API_KEY!);

const CORS_ALLOWED_ORIGINS = new Set<string>(
  (process.env.CORS_ALLOWED_ORIGINS || "*").split(/\s+/g),
);

const CORS_MAX_AGE = parseInt(process.env.CORS_MAX_AGE!, 10) || 300;

const MAX_BODY_SIZE = Math.floor(1024 * 1024 * 5.5); // 5.5MByte

const router = new Router([
  new Namespace("/api", {}, {
    async before() {
      const isAllowedOrigin = (() => {
        const { origin } = this.headers;

        return origin
          ? CORS_ALLOWED_ORIGINS.has(origin) || CORS_ALLOWED_ORIGINS.has("*")
          : true;
      })();

      if (!isAllowedOrigin) {
        throw new StandardError(403, {
          code: "FORBIDDEN",
          message: "Forbidden",
        });
      }
    },
    async exceptionHandler(error) {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Max-Age": "60",
      };

      if (error instanceof ValidationError) {
        return this.json({
          error: {
            code: "INVALID_PARAMETER",
            message: error.message,
          },
        }, 422, headers);
      }

      if (error instanceof StandardError) {
        return this.json({
          error: {
            code: error.options.code,
            message: error.options.message,
          },
        }, error.statusCode || 500, headers);
      }

      return this.json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal Server Error",
        },
      }, 500, headers);
    },
    children: [
      Route.GET("/cargo-clearance-progress", {
        desc: "Query Clearance Progress of given cargo",
        operationId: "queryCargoClearanceProgress",
      }, {
        ref: Parameter.Query(Type.Optional(Type.String())),
        master_bl: Parameter.Query(Type.Optional(Type.String())),
        house_bl: Parameter.Query(Type.Optional(Type.String())),
        year: Parameter.Query(Type.Optional(Type.Integer({ minimum: 1900 }))),
      },async function() {
        const {
          ref,
          master_bl: masterBL,
          house_bl: houseBL,
          year,
        } = this.params;

        const data = await (async () => {
          try {
            if (ref) {
              return await cargoClearanceProgress.findByRef(ref);
            }

            if (masterBL && houseBL) {
              return await cargoClearanceProgress.findByFullBL(masterBL, houseBL, year);
            }

            if (masterBL) {
              return await cargoClearanceProgress.findByMasterBL(masterBL, year);
            }

            if (houseBL) {
              return await cargoClearanceProgress.findByHouseBL(houseBL, year);
            }
          } catch (e) {
            throw new StandardError(422, {
              code: "QUERY_FAILURE",
              message: e.message,
            });
          }

          throw new StandardError(422, {
            code: "INVALID_QUERY",
            message: "There are no parameters to query",
          });
        })();

        const bodyBytes = Buffer.byteLength(JSON.stringify(data));
        if (bodyBytes > MAX_BODY_SIZE) {
          throw new StandardError(413, {
            code: "RESPONSE_SIZE_EXCEEDED",
            message: "The size of requested resource exceeds our limit",
          });
        }

        const headers = (() => {
          const { origin } = this.headers;

          if (origin) {
            return {
              "Access-Control-Allow-Origin": origin,
              "Access-Control-Max-Age": CORS_MAX_AGE.toString(),
            };
          }

          return {};
        })() as { [key: string]: string };

        return this.json({ data }, 200, headers);
      }),
    ],
  }),
]);

export const handler = router.handler();
