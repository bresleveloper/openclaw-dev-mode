import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { t as UserProfileIdentity } from "./user-profiles.types-ysUz1C8K.js";
import { IncomingMessage } from "node:http";
//#region src/gateway/server/client-identity-types.d.ts
/** Server-attested identity facts shared by RPC and transport client records. */
type GatewayWsBrowserOrigin = {
  requestHost?: string;
  origin?: string;
  isLocalClient?: boolean;
};
type PreparedSessionProfile = UserProfileIdentity;
//#endregion
//#region src/gateway/origin-check.d.ts
/** Return the request Origin only when the Gateway's canonical browser policy accepts it. */
declare function resolveAcceptedBrowserOrigin(params: {
  req: IncomingMessage;
  cfg?: OpenClawConfig;
}): string | undefined;
//#endregion
export { GatewayWsBrowserOrigin as n, PreparedSessionProfile as r, resolveAcceptedBrowserOrigin as t };