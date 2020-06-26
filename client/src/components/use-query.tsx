// eslint-disable-next-line no-unused-vars
import axios, { AxiosError } from 'axios';
import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import { TrackingInput, TrackingInputType } from './tracking-form';

export type QueryData = {
  data: any;
  observable: boolean;
};

export type QueryError = {
  code: string;
  message: string;
};

export type QueryResult = {
  data: QueryData;
  error: null | QueryError;
};

type QueryParameter = {
  [key: string]: any;
};

const isAxiosError = (e: any): e is AxiosError => e.isAxiosError;

const normalizeReference = (input: string) => input.toUpperCase().replace(/[-_\s]/g, '').trim();
async function query(params: QueryParameter) {
  try {
    const res = await axios({
      method: 'GET',
      url: `${process.env.API_BASE_URL}/cargo-clearance-progress`,
      params,
    });

    const { data } = res.data;

    return {
      data: {
        data,
        observable: true,
      },
      error: null,
    };
  } catch (e) {
    return {
      data: {
        data: null,
        observable: false,
      },
      error: e.response?.data?.error ?? {
        code: isAxiosError(e) ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR',
        message: e.message,
      },
    };
  }
}

async function automaticQuery(input: string): Promise<QueryResult> {
  const year = new Date().getFullYear();

  const results = await Promise.all([
    query({
      ref: normalizeReference(input),
    }),
    query({
      master_bl: input,
      year,
    }),
    query({
      house_bl: input,
      year,
    }),
  ]);

  const lastResult = results[results.length - 1];
  return results.find((res) => res.data.data) ?? {
    error: lastResult.error,
    data: {
      data: lastResult.data.data,
      observable: results.some((res) => res.data.observable),
    },
  };
}

function referenceQuery(input: string): Promise<QueryResult> {
  return query({
    ref: normalizeReference(input),
  });
}

async function billOfLandingQuery(input: {
  masterBL: string;
  houseBL: string;
  year: number;
}): Promise<QueryResult> {
  const { masterBL, houseBL, year } = input;
  if (masterBL && houseBL) {
    return query({
      master_bl: masterBL,
      house_bl: houseBL,
      year,
    });
  }

  if (masterBL) {
    return query({
      master_bl: masterBL,
      year,
    });
  }

  return query({
    house_bl: houseBL,
    year,
  });
}

export function useQuery(input: TrackingInput | null) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<null | QueryData>(null);
  const [error, setError] = React.useState<null | QueryError>(null);

  React.useEffect(() => {
    setData(null);
    setError(null);

    if (input === null) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const promise: Promise<QueryResult> = (() => {
      switch (input.type) {
        case TrackingInputType.Automatic:
          return automaticQuery(input.value);
        case TrackingInputType.Reference:
          return referenceQuery(input.value);
        case TrackingInputType.BL:
          return billOfLandingQuery(input.value);
        default:
          return Promise.reject(new TypeError('Unexpected TrackingInput Type'));
      }
    })();

    promise.then((res) => {
      if (res.error) {
        setError(res.error);
      } else {
        setData(res.data);
      }

      setIsLoading(false);
    }).catch((e: Error) => {
      setError({
        code: 'UNKNOWN_ERROR',
        message: e.message,
      });

      setIsLoading(false);
    });
  }, [input]);

  return {
    isLoading,
    data,
    error,
  };
}
