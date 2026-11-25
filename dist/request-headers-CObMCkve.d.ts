import { f as ModelRequestHeaders } from "./types-B1zI2CfC.js";
/** Materialize merged overrides for HTTP clients that cannot consume SDK deletion sentinels. */
declare function omitNullRequestHeaders(headers: ModelRequestHeaders | undefined): Record<string, string> | undefined;
export { omitNullRequestHeaders as t };