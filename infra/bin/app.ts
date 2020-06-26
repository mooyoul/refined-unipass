#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { CDNStack } from "../lib/cdn-stack";

const app = new cdk.App();

// tslint:disable-next-line
new CDNStack(app, "RefinedUnipassCDN", {
  domainName: process.env.CDN_DOMAIN_NAME!,
  zoneName: process.env.CDN_ZONE_NAME!,
  env: {
    region: "us-east-1",
    account: process.env.CDK_DEFAULT_ACCOUNT!,
  },
  api: {
    domain: process.env.API_DOMAIN_NAME!,
    path: process.env.API_PATH!,
  },
});
