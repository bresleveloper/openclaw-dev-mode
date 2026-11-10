import { s as isLoopbackHost, y as resolveHostName } from "./net-CjQwRK-V.mjs";
import { TLSSocket } from "node:tls";
//#region src/gateway/control-ui-public-session-ingress.ts
/** Transport provenance only. Proxy identity headers on public paths prove no user authority. */
function isSecurePublicSessionIngress(req, ingress, publicOrigin) {
	const advertisedHttps = publicOrigin?.startsWith("https://") === true;
	const proto = req.headers["x-forwarded-proto"];
	return req.socket instanceof TLSSocket || ingress.kind === "direct-local" && isLoopbackHost(resolveHostName(req.headers.host)) || ingress.kind === "trusted-proxy" && advertisedHttps && typeof proto === "string" && proto.trim().toLowerCase() === "https" || (ingress.kind === "tailscale-serve" || ingress.kind === "tailscale-funnel") && advertisedHttps;
}
//#endregion
export { isSecurePublicSessionIngress as t };
