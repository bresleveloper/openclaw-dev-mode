import{t as OAUTH_PAGE_STYLES}from"./oauth-page-11tnaQi5.mjs";import{createHash}from"node:crypto";
//!src/infra/oauth-page-csp.ts
const OAUTH_PAGE_CSP=`default-src 'none'; style-src 'sha256-${createHash(`sha256`).update(OAUTH_PAGE_STYLES).digest(`base64`)}'; frame-ancestors 'none'`;export{OAUTH_PAGE_CSP as t};