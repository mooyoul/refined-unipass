import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cf from "@aws-cdk/aws-cloudfront";
import * as route53 from "@aws-cdk/aws-route53";
import * as route53Targets from "@aws-cdk/aws-route53-targets";
import * as cdk from "@aws-cdk/core";

export type APIOrigin = {
  readonly domain: string;
  readonly path: string;
};

export interface CDNStackProps extends cdk.StackProps {
  readonly domainName: string;
  readonly zoneName: string;
  readonly api: APIOrigin;
}

export class CDNStack extends cdk.Stack {
  public readonly domainName: string;
  public readonly zoneName: string;
  public readonly api: APIOrigin;

  public constructor(scope: cdk.App, id: string, props: CDNStackProps) {
    super(scope, id, props);

    this.domainName = props.domainName;
    this.zoneName = props.zoneName;
    this.api = props.api;

    // Lookup Hosted Zone
    const zone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: this.zoneName,
    });

    // Create ACM Certificate
    const certificate = new acm.DnsValidatedCertificate(this, "Certificate", {
      domainName: this.domainName,
      hostedZone: zone,
    });

    // Create CF Distribution
    const distribution = new cf.CloudFrontWebDistribution(this, "Distribution", {
      viewerCertificate: cf.ViewerCertificate.fromAcmCertificate(certificate, {
        sslMethod: cf.SSLMethod.SNI,
        securityPolicy: cf.SecurityPolicyProtocol.TLS_V1_2016,
        aliases: [this.domainName],
      }),
      viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      originConfigs: [{
        behaviors: [{
          isDefaultBehavior: true,
          allowedMethods: cf.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
          cachedMethods: cf.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
          forwardedValues: {
            headers: [
              "Origin",
            ],
            queryString: false,
            cookies: {
              forward: "none",
            },
          },
          compress: true,
          defaultTtl: cdk.Duration.days(365 * 100), // 100 years
          minTtl: cdk.Duration.days(365 * 100), // 100 years
          maxTtl: cdk.Duration.days(365 * 100), // 100 years
        }],
        customOriginSource: {
          domainName: "www.lvh.me",
          originProtocolPolicy: cf.OriginProtocolPolicy.HTTP_ONLY,
        },
      }, {
        behaviors: [{
          pathPattern: "/api/*",
          allowedMethods: cf.CloudFrontAllowedMethods.ALL,
          cachedMethods: cf.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
          forwardedValues: {
            headers: [
              "Origin",
            ],
            queryString: true,
            cookies: {
              forward: "none",
            },
          },
          compress: true,
          defaultTtl: cdk.Duration.seconds(0), // none
          minTtl: cdk.Duration.seconds(0), // none
          maxTtl: cdk.Duration.seconds(0), // none
        }],
        originPath: this.api.path,
        customOriginSource: {
          domainName: this.api.domain,
          originKeepaliveTimeout: cdk.Duration.seconds(30),
          originProtocolPolicy: cf.OriginProtocolPolicy.HTTPS_ONLY,
        },
      }],
      enableIpV6: true,
      priceClass: cf.PriceClass.PRICE_CLASS_ALL,
    });

    // Create DNS Record
    const cloudfrontTarget = new route53Targets.CloudFrontTarget(distribution);
    const recordName = this.domainName.slice(0, this.domainName.indexOf(this.zoneName) - 1);
    const ipv4Record = new route53.ARecord(this, "IPv4Record", {
      recordName,
      zone,
      target: {
        aliasTarget: cloudfrontTarget,
      },
    });
    const ipv6Record = new route53.AaaaRecord(this, "IPv6Record", {
      recordName,
      zone,
      target: {
        aliasTarget: cloudfrontTarget,
      },
    });
  }
}
