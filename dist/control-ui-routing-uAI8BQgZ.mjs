import { a as classifyMcpAppStandalonePath, i as classifyGatewayProbePath, l as classifyWorkerGatewayPath, s as classifyNodeWorkspaceTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { n as isReadHttpMethod, t as acceptsControlUiHtmlResponse } from "./control-ui-http-utils-CpDIFFwm.mjs";
import { u as resolvePluginDiscoveryIdentity } from "./catalog-discovery-CSbNyDUD.mjs";
//#region src/gateway/control-ui-routing.ts
const CONTROL_UI_PLUGIN_MANAGER_PATH = "/settings/plugins";
/** Keep the plugin recovery surface ahead of plugin-owned HTTP routes. */
function isControlUiPluginManagerRequest(params) {
	if (!isReadHttpMethod(params.method)) return false;
	const path = `${params.basePath}${CONTROL_UI_PLUGIN_MANAGER_PATH}`;
	return params.pathname === path || params.pathname === `${path}/`;
}
/** Core-owned standalone approval document namespace, before plugin routing. */
function isControlUiApprovalDocumentPath(params) {
	const root = `${params.basePath}/approve`;
	if (params.pathname === root || params.pathname === `${root}/`) return true;
	const prefix = `${root}/`;
	if (!params.pathname.startsWith(prefix)) return false;
	const encodedId = params.pathname.slice(prefix.length);
	return encodedId.length > 0 && !encodedId.includes("/");
}
/** Classify an HTTP request as Control UI serving, redirect, 404, or non-Control-UI. */
function classifyControlUiRequest(params) {
	const { basePath, pathname, search, method } = params;
	const spaFallback = isControlUiPluginManagerRequest(params) || acceptsControlUiHtmlResponse(params.accept);
	if (!basePath) {
		if (pathname === "/ui" || pathname.startsWith("/ui/")) return { kind: "not-found" };
		if (classifyGatewayProbePath(pathname) !== "outside" || classifyMcpAppStandalonePath(pathname) !== "outside" || classifyWorkerGatewayPath(pathname) !== "outside" || classifyNodeWorkspaceTransferPath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (pathname === "/plugins" || pathname.startsWith("/plugins/")) {
			if (!(pathname === "/plugins" || pathname === "/plugins/" || resolvePluginDiscoveryIdentity(pathname.slice(9)) !== void 0) || !isReadHttpMethod(method) || !spaFallback) return { kind: "not-control-ui" };
		}
		if ([
			"/api",
			"/j",
			"/v1"
		].some((root) => pathname === root || pathname.startsWith(`${root}/`))) return { kind: "not-control-ui" };
	} else if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath) return { kind: "not-control-ui" };
	if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
	if (basePath && pathname === basePath) return {
		kind: "redirect",
		location: `${basePath}/${search}`
	};
	return {
		kind: "serve",
		spaFallback
	};
}
//#endregion
export { isControlUiApprovalDocumentPath as n, isControlUiPluginManagerRequest as r, classifyControlUiRequest as t };
