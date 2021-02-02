import * as React from "react";

export type Location = {
  query?: string;
  shouldBait: boolean;
  referrer: string;
};

const BAIT_HOSTS = ["balaan", "trenbe"];

export const useLocation = (): Location => {
  return React.useMemo(() => {
    const referrer = document.referrer || "";

    const shouldBait = BAIT_HOSTS.some((host) => referrer.includes(host));

    return {
      shouldBait,
      referrer: document.referrer,
    };
  }, []);
};
