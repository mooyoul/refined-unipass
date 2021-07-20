import * as React from "react";

export type Location = {
  query?: string;
  shouldBait: boolean;
  referrer: string;
};

const BAIT_HOSTS = ["balaan", "trenbe"];

export const useLocation = (): Location => {
  return React.useMemo(() => {
    const url = (() => {
      try {
        return new URL(globalThis.location.href);
      } catch (e) {
        // unsupported browser
        return null;
      }
    })();

    const referrer = document.referrer || "";

    const shouldBait = BAIT_HOSTS.some((host) => referrer.includes(host));

    return {
      query: url?.searchParams.get("query")?.replace(/[^a-z0-9]/i, ""),
      shouldBait,
      referrer: document.referrer,
    };
  }, []);
};
