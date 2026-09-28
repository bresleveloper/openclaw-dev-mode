import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
//#region src/gateway/control-ui-shared.ts
/** Normalizes a Control UI base path to either "" or a leading-slash path without trailing slash. */
function normalizeControlUiBasePath(basePath) {
	const value = basePath?.trim() ?? "";
	if (!value || value === "/") return "";
	const withSlash = value.startsWith("/") ? value : `/${value}`;
	return withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}
/** Keeps push navigation in the receiving PWA while selecting its originating Gateway. */
function resolveControlUiWebPushUrl(cfg, relativePath) {
	const publicOrigin = resolveGatewayPublicOrigin(cfg);
	if (!publicOrigin) return relativePath;
	const basePath = normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath);
	const gatewayUrl = `${publicOrigin.replace(/^https:/u, "wss:").replace(/^http:/u, "ws:")}${basePath}`;
	return `${relativePath}#${new URLSearchParams({ gatewayUrl })}`;
}
//#endregion
export { resolveControlUiWebPushUrl as n, normalizeControlUiBasePath as t };
