import { s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import "./version-CwNT1gaY.mjs";
import { N as onUserProfilesChanged } from "./user-profiles-internal-BxQLnWfo.mjs";
import { a as runPluginHttpRoute } from "./http-route-owner-CyFsFlZs.mjs";
import { i as hasCurrentGatewayOperatorAccess } from "./operator-access-policy-D8OrWXWF.mjs";
import { r as prepareGatewayRecipientProfile } from "./expected-profile-D7DCE30e.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
import { a as resolvePluginRoutePathContext, i as isProtectedPluginRoutePathFromContext, n as findRegisteredPluginHttpRoute, r as isRegisteredPluginHttpRoutePath, t as findMatchingPluginHttpRoutes } from "./route-match-3ODu6iRN.mjs";
import { _ as respondControlUiPluginAuthCookieProbe } from "./http-auth-utils-DnAyBVQj.mjs";
import { n as finishFailedGatewayHttpResponse } from "./http-common-oJ4rIoMl.mjs";
import { a as runWithGatewayHttpWorkAdmission, n as matchedPluginRoutesRequireGatewayAuth, o as runWithGatewayUpgradeWorkAdmission, r as shouldEnforceGatewayAuthForPluginPath, t as isPluginAuthenticatedRoutePath } from "./route-auth-JLczms7i.mjs";
import { t as resolvePluginRouteRuntimeOperatorScopes } from "./plugin-route-runtime-scopes-BtSCKSkU.mjs";
//#region src/gateway/server/plugins-http.ts
function resolvePluginRoutePathContextForRequest(req, providedPathContext) {
	if (providedPathContext) return providedPathContext;
	const url = new URL(req.url ?? "/", "http://localhost");
	return resolvePluginRoutePathContext(url.pathname);
}
function createPluginRouteRuntimeClient(scopes, clientIp, requestAuth) {
	const authenticatedUserProfile = requestAuth?.authenticatedUserProfile;
	const operatorRoleActor = requestAuth?.operatorRoleActor;
	const operatorAccessAuthority = requestAuth?.operatorAccessAuthority;
	const client = {
		connId: `plugin-http:${clientIp ?? "unknown"}`,
		...clientIp ? { clientIp } : {},
		...authenticatedUserProfile ? { authenticatedUserProfile } : {},
		...operatorRoleActor || operatorAccessAuthority !== void 0 ? { internal: {
			...operatorRoleActor ? { operatorRoleActor } : {},
			...operatorAccessAuthority !== void 0 ? { operatorAccessAuthority } : {}
		} } : {},
		connect: {
			minProtocol: 4,
			maxProtocol: 4,
			client: {
				id: GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
				version: "internal",
				platform: "node",
				mode: GATEWAY_CLIENT_MODES.BACKEND
			},
			role: "operator",
			scopes: [...scopes]
		}
	};
	prepareGatewayRecipientProfile(client);
	return client;
}
async function withPluginRouteRuntimeScope(scope, run) {
	if (scope.hasCurrentClientAuthority?.() === false) throw new Error("HTTP request authority expired");
	const client = scope.client;
	const stop = client?.authenticatedUserProfile ? onUserProfilesChanged(() => prepareGatewayRecipientProfile(client)) : void 0;
	try {
		return await withPluginRuntimeGatewayRequestScope(scope, run);
	} finally {
		stop?.();
	}
}
function getMissingPluginRouteRuntimeContext(route, context) {
	if (route.auth !== "gateway") return;
	if (route.gatewayRuntimeScopeSurface === "trusted-operator") return context.gatewayRequestAuth ? void 0 : "caller auth context";
	return context.gatewayRequestOperatorScopes === void 0 ? "caller scope context" : void 0;
}
function canRunPluginHttpRouteWithoutAdmission(route) {
	return route.auth === "gateway" && route.gatewayRuntimeScopeSurface === "trusted-operator" && route.gatewayMethodDispatchAllowed === true;
}
function createPluginRouteRuntimeScope(params) {
	const runtimeClient = createPluginRouteRuntimeClient(params.route.auth !== "gateway" ? [] : params.gatewayRequestAuth?.controlUiPluginGrant ? params.gatewayRequestOperatorScopes : params.route.gatewayRuntimeScopeSurface === "trusted-operator" ? resolvePluginRouteRuntimeOperatorScopes(params.req, params.gatewayRequestAuth, "trusted-operator") : params.gatewayRequestOperatorScopes, params.gatewayRequestClientIp, params.route.auth === "gateway" ? params.gatewayRequestAuth : void 0);
	const operatorAccessAuthority = runtimeClient?.internal?.operatorAccessAuthority;
	operatorAccessAuthority?.assertCurrent();
	const hasCurrentClientAuthority = params.route.auth === "gateway" ? params.gatewayRequestAuth?.hasCurrentClientAuthority : void 0;
	return {
		pluginRegistry: params.registry,
		...params.route.auth === "gateway" && params.gatewayRequestAuth?.revalidate ? { revalidate: params.gatewayRequestAuth.revalidate } : {},
		...hasCurrentClientAuthority || operatorAccessAuthority ? { hasCurrentClientAuthority: () => hasCurrentClientAuthority?.() !== false && hasCurrentGatewayOperatorAccess(operatorAccessAuthority) } : {},
		...params.gatewayRequestContext ? { context: params.gatewayRequestContext } : {},
		client: runtimeClient,
		...operatorAccessAuthority ? { signal: operatorAccessAuthority.signal } : {},
		isWebchatConnect: () => false,
		...params.route.pluginId ? { pluginId: params.route.pluginId } : {},
		...params.route.source ? { pluginSource: params.route.source } : {},
		...params.route.gatewayMethodDispatchAllowed === true ? { gatewayMethodDispatchAllowed: true } : {}
	};
}
function createGatewayPluginRequestHandler(params) {
	const { log } = params;
	return async (req, res, providedPathContext, dispatchContext) => {
		const registry = params.getRouteRegistry?.() ?? params.registry;
		const gatewayRequestContext = params.getGatewayRequestContext?.();
		if ((registry.httpRoutes ?? []).length === 0) return false;
		const pathContext = resolvePluginRoutePathContextForRequest(req, providedPathContext);
		const matchedRoutes = findMatchingPluginHttpRoutes(registry, pathContext);
		if (matchedRoutes.length === 0) return false;
		if (matchedPluginRoutesRequireGatewayAuth(matchedRoutes) && dispatchContext?.gatewayAuthSatisfied !== true) {
			log.warn(`plugin http route blocked without gateway auth (${pathContext.canonicalPath})`);
			return false;
		}
		const firstGatewayRoute = matchedRoutes.find((route) => route.auth === "gateway");
		const presentedGatewayRequestAuth = dispatchContext?.gatewayRequestAuth;
		const presentedControlUiPluginGrants = presentedGatewayRequestAuth?.controlUiPluginGrants;
		const controlUiPluginGrant = presentedControlUiPluginGrants?.find((grant) => grant.pluginId === firstGatewayRoute?.pluginId);
		if (presentedControlUiPluginGrants && (!firstGatewayRoute || !controlUiPluginGrant)) {
			log.warn(`plugin http route blocked for mismatched control ui grant (${pathContext.canonicalPath})`);
			res.statusCode = 401;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Unauthorized");
			return true;
		}
		const gatewayRequestAuth = controlUiPluginGrant ? {
			...presentedGatewayRequestAuth,
			controlUiPluginGrant
		} : presentedGatewayRequestAuth;
		const gatewayRequestOperatorScopes = controlUiPluginGrant ? controlUiPluginGrant.scopes : dispatchContext?.gatewayRequestOperatorScopes;
		for (const route of matchedRoutes) {
			if (controlUiPluginGrant && route.auth === "gateway" && route.pluginId !== controlUiPluginGrant.pluginId) continue;
			const missingRuntimeContext = getMissingPluginRouteRuntimeContext(route, {
				gatewayRequestAuth,
				gatewayRequestOperatorScopes
			});
			if (missingRuntimeContext) {
				log.warn(`plugin http route blocked without ${missingRuntimeContext} (${pathContext.canonicalPath})`);
				return false;
			}
		}
		if (controlUiPluginGrant && respondControlUiPluginAuthCookieProbe(req, res)) return true;
		for (const route of matchedRoutes) {
			if (controlUiPluginGrant && route.auth === "gateway" && route.pluginId !== controlUiPluginGrant.pluginId) continue;
			try {
				const runRoute = async () => await withPluginRouteRuntimeScope(createPluginRouteRuntimeScope({
					registry,
					route,
					req,
					gatewayRequestContext,
					gatewayRequestAuth,
					gatewayRequestOperatorScopes,
					gatewayRequestClientIp: dispatchContext?.gatewayRequestClientIp
				}), async () => runPluginHttpRoute(registry, route, route.handler, () => route.handler(req, res))) !== false;
				if (canRunPluginHttpRouteWithoutAdmission(route) ? await runRoute() : await runWithGatewayHttpWorkAdmission(res, runRoute)) return true;
			} catch (err) {
				log.warn(`plugin http route failed (${route.pluginId ?? "unknown"}): ${String(err)}`);
				finishFailedGatewayHttpResponse(res);
				return true;
			}
		}
		return false;
	};
}
function createGatewayPluginUpgradeHandler(params) {
	const { log } = params;
	return async (req, socket, head, providedPathContext, dispatchContext) => {
		const registry = params.getRouteRegistry?.() ?? params.registry;
		const gatewayRequestContext = params.getGatewayRequestContext?.();
		if ((registry.httpRoutes ?? []).length === 0) return false;
		const pathContext = resolvePluginRoutePathContextForRequest(req, providedPathContext);
		const matchedRoutes = findMatchingPluginHttpRoutes(registry, pathContext).filter((route) => typeof route.handleUpgrade === "function");
		if (matchedRoutes.length === 0) return false;
		const requiresGatewayAuth = matchedPluginRoutesRequireGatewayAuth(matchedRoutes);
		if (requiresGatewayAuth && dispatchContext?.gatewayAuthSatisfied !== true) {
			log.warn(`plugin http upgrade blocked without gateway auth (${pathContext.canonicalPath})`);
			rejectWebSocketUpgrade(socket, { status: 401 });
			return true;
		}
		const gatewayRequestAuth = dispatchContext?.gatewayRequestAuth;
		const gatewayRequestOperatorScopes = dispatchContext?.gatewayRequestOperatorScopes;
		for (const route of matchedRoutes) {
			const missingRuntimeContext = getMissingPluginRouteRuntimeContext(route, {
				gatewayRequestAuth,
				gatewayRequestOperatorScopes
			});
			if (missingRuntimeContext) {
				log.warn(`plugin http upgrade blocked without ${missingRuntimeContext} (${pathContext.canonicalPath})`);
				rejectWebSocketUpgrade(socket, { status: 401 });
				return true;
			}
		}
		const operatorAccessAuthority = requiresGatewayAuth ? gatewayRequestAuth?.operatorAccessAuthority : void 0;
		if (!hasCurrentGatewayOperatorAccess(operatorAccessAuthority)) {
			rejectWebSocketUpgrade(socket, { status: 401 });
			return true;
		}
		const releaseAccessListener = () => {
			operatorAccessAuthority?.signal.removeEventListener("abort", revokeAccess);
			socket.off("close", releaseAccessListener);
		};
		const revokeAccess = () => {
			releaseAccessListener();
			socket.destroy();
		};
		if (operatorAccessAuthority) {
			operatorAccessAuthority.signal.addEventListener("abort", revokeAccess, { once: true });
			socket.once("close", releaseAccessListener);
		}
		for (const route of matchedRoutes) try {
			if (await runWithGatewayUpgradeWorkAdmission(socket, async () => await withPluginRouteRuntimeScope(createPluginRouteRuntimeScope({
				registry,
				route,
				req,
				gatewayRequestContext,
				gatewayRequestAuth,
				gatewayRequestOperatorScopes,
				gatewayRequestClientIp: dispatchContext?.gatewayRequestClientIp
			}), async () => {
				const handleUpgrade = route.handleUpgrade;
				return runPluginHttpRoute(registry, route, handleUpgrade, () => handleUpgrade(req, socket, head));
			}) !== false)) return true;
		} catch (err) {
			log.warn(`plugin http upgrade failed (${route.pluginId ?? "unknown"}): ${String(err)}`);
			releaseAccessListener();
			socket.destroy();
			return true;
		}
		releaseAccessListener();
		return false;
	};
}
//#endregion
export { createGatewayPluginRequestHandler, createGatewayPluginUpgradeHandler, findRegisteredPluginHttpRoute, isPluginAuthenticatedRoutePath, isProtectedPluginRoutePathFromContext, isRegisteredPluginHttpRoutePath, resolvePluginRoutePathContext, shouldEnforceGatewayAuthForPluginPath };
