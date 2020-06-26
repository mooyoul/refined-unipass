import * as Joi from "joi";
import { Namespace, Parameter, Route, Router, StandardError } from "vingle-corgi";

import { CargoClearanceProgress } from "unipass";

const cargoClearanceProgress = new CargoClearanceProgress(process.env.CARGO_CLEARANCE_PROGRESS_API_KEY!);

const MAX_BODY_SIZE = Math.floor(1024 * 1024 * 5.5); // 5.5MByte

const router = new Router([
  new Namespace("", {
    async exceptionHandler(error) {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Max-Age": "60",
      };

      if (error.name === "ValidationError") {
        const validationError = error as Joi.ValidationError;

        return this.json({
          error: {
            code: "INVALID_PARAMETER",
            message: validationError.message,
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
        ref: Parameter.Query(Joi.string().optional()),
        master_bl: Parameter.Query(Joi.string().optional()),
        house_bl: Parameter.Query(Joi.string().optional()),
        year: Parameter.Query(Joi.number().integer().positive().optional()),
      },async function() {
        const ref = this.params.ref as string | undefined;
        const masterBL = this.params.master_bl as string | undefined;
        const houseBL = this.params.house_bl as string | undefined;
        const year = this.params.year as number | undefined;

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

        return this.json({ data }, 200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Max-Age": "60",
        });
      }),
    ],
  }),
]);

export const handler = router.handler();
