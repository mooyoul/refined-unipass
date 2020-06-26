# refined-unipass

[![Build Status](https://github.com/mooyoul/refined-unipass/workflows/workflow/badge.svg)](https://github.com/mooyoul/refined-unipass/actions)
[![Infra Status](https://github.com/mooyoul/refined-unipass/workflows/infra/badge.svg)](https://github.com/mooyoul/refined-unipass/actions)
[![Github Pages Status](https://github.com/mooyoul/refined-unipass/workflows/gh-pages/badge.svg)](https://github.com/mooyoul/refined-unipass/actions)
[![Semantic Release enabled](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](http://mooyoul.mit-license.org/)

Yet another Web App that simplifies the [Unipass (Korean Customs Service)](https://unipass.customs.go.kr/) and adds useful features.

## Screenshots

| ![Screenshot](/assets/refined-unipass-1.png) | ![Screenshot](/assets/refined-unipass-2.png) |
| ![Screenshot](/assets/refined-unipass-3.png) | ![Screenshot](/assets/refined-unipass-4.png) |
| ![Screenshot](/assets/refined-unipass-5.png) | ![Screenshot](/assets/refined-unipass-6.png) |

## Key Features

- Compact & Simple UI for mobile devices
- Quick cargo query without supplying "Arrival Year".
- *WIP - Event Notifications via Telegram, PushBullet, and Slack.*  


## API

#### Getting Started

You'll need to prepare below resources:

- Pre-configured AWS Credentials
- API Key for accessing Unipass API - [Docs](https://unipass.customs.go.kr/csp/myc/custsppt/cmmn/NtarBrkdMtCtr/openMYC0605014Q.do?ntarId=20160424260)

```bash
$ git clone https://github.com/mooyoul/refined-unipass.git
$ cd refined-unipass
$ npm ci
``` 

#### Deploying your own API service

```bash
$ env \
    CARGO_CLEARANCE_PROGRESS_API_KEY=YOUR_API_KEY \
    CORS_ALLOWED_ORIGINS='https://mooyoul.github.io http://www.lvh.me:8080' \
    CORS_MAX_AGE='3600' \
    npm run deploy:prod
```

#### (Optional) Deploying CDN

```bash
$ cd infra
$ npm ci
$ env \
    CDK_DEFAULT_REGION=us-east-1 \
    CDK_DEFAULT_ACCOUNT=YOUR_AWS_ACCOUNT_ID \
    CDN_DOMAIN_NAME=refined-unipass.example.com \
    CDN_ZONE_NAME=example.com \
    API_DOMAIN_NAME=xxxx.execute-api.region.amazonaws.com \
    API_PATH=/stage \
    npm run cdk -- deploy
```

#### Testing

Test Suites are not available at this moment.


## Web Client

#### Getting Started

```bash
$ cd client
$ npm ci
```

#### Running web client locally

```bash
$ cd client
$ npm run dev
```

then, Navigate to http://www.lvh.me:8080.

#### Testing

Test Suites are not available at this moment.
 
## Related

- [node-unipass](https://github.com/mooyoul/node-unipass) Node.js Library for accessing Unipass API.

## License
[MIT](LICENSE)

See full license on [mooyoul.mit-license.org](http://mooyoul.mit-license.org/)

