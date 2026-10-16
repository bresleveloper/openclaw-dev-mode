import { t as OAUTH_PAGE_STYLES } from "./oauth-page-CdAMKCs_.mjs";
import { createHash } from "node:crypto";
//#region src/infra/oauth-page-csp.ts
const OAUTH_PAGE_CSP = `default-src 'none'; style-src 'sha256-${createHash("sha256").update(OAUTH_PAGE_STYLES).digest("base64")}'; frame-ancestors 'none'`;
//#endregion
export { OAUTH_PAGE_CSP as t };
