import { s as waitForHttpRequestRejection } from "./http-request-lifecycle-JdoSg2uH.mjs";
import { k as tryBeginGatewayRootWorkAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { i as getGatewayInstallationReplacement } from "./stale-install-BTpQ40eq.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
import { a as resolvePluginRoutePathContext, i as isProtectedPluginRoutePathFromContext, t as findMatchingPluginHttpRoutes } from "./route-match-3ODu6iRN.mjs";
//#region src/gateway/server/http-work-admission.ts
async function runWithGatewayBoundaryWorkAdmission(origin, reject, run) {
	const admission = tryBeginGatewayRootWorkAdmission(origin);
	if (!admission) {
		reject();
		return true;
	}
	try {
		return await admission.run(async () => await run());
	} finally {
		admission.release();
	}
}
/** Runs one HTTP user-work route under the same root fence as Gateway RPCs. */
async function runWithGatewayHttpWorkAdmission(res, run) {
	return await runWithGatewayBoundaryWorkAdmission("http:request", () => {
		res.statusCode = 503;
		res.setHeader("Content-Type", "application/json; charset=utf-8");
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Retry-After", "1");
		res.end(JSON.stringify({ error: {
			message: "Gateway is temporarily unavailable while suspending or restarting",
			type: "service_unavailable",
			code: "gateway_unavailable"
		} }));
	}, async () => {
		try {
			return await run();
		} finally {
			await waitForHttpRequestRejection(res.req);
		}
	});
}
function rejectGatewayUpgradeServiceUnavailable(socket, body) {
	const replacement = getGatewayInstallationReplacement();
	rejectWebSocketUpgrade(socket, {
		status: 503,
		body: {
			contentType: "text/plain; charset=utf-8",
			text: replacement ? `${body}. ${replacement.message}` : body
		}
	});
}
/** Holds upgrade admission until one plugin handler owns or declines the socket. */
async function runWithGatewayUpgradeWorkAdmission(socket, run) {
	return await runWithGatewayBoundaryWorkAdmission("http:upgrade", () => {
		rejectGatewayUpgradeServiceUnavailable(socket, "Gateway websocket admission closed");
	}, run);
}
//#endregion
//#region src/gateway/server/plugins-http/route-auth.ts
/**
* Gateway-auth decisions for plugin HTTP routes.
*/
function matchedPluginRoutesRequireGatewayAuth(routes) {
	return routes.some((route) => route.auth === "gateway");
}
/** Returns true when a plugin path must pass gateway auth before routing. */
function shouldEnforceGatewayAuthForPluginPath(registry, pathnameOrContext) {
	const pathContext = typeof pathnameOrContext === "string" ? resolvePluginRoutePathContext(pathnameOrContext) : pathnameOrContext;
	if (pathContext.malformedEncoding || pathContext.decodePassLimitReached) return true;
	if (isProtectedPluginRoutePathFromContext(pathContext)) return true;
	return matchedPluginRoutesRequireGatewayAuth(findMatchingPluginHttpRoutes(registry, pathContext));
}
/** Returns true only when an existing route owns authentication entirely inside its plugin. */
function isPluginAuthenticatedRoutePath(registry, pathnameOrContext) {
	const pathContext = typeof pathnameOrContext === "string" ? resolvePluginRoutePathContext(pathnameOrContext) : pathnameOrContext;
	if (pathContext.malformedEncoding || pathContext.decodePassLimitReached || isProtectedPluginRoutePathFromContext(pathContext)) return false;
	const matchedRoutes = findMatchingPluginHttpRoutes(registry, pathContext);
	return matchedRoutes.length > 0 && matchedRoutes.every((route) => route.auth === "plugin");
}
//#endregion
export { runWithGatewayHttpWorkAdmission as a, rejectGatewayUpgradeServiceUnavailable as i, matchedPluginRoutesRequireGatewayAuth as n, runWithGatewayUpgradeWorkAdmission as o, shouldEnforceGatewayAuthForPluginPath as r, isPluginAuthenticatedRoutePath as t };
