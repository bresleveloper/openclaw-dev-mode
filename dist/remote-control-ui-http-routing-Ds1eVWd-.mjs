import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { d as matchesControlUiBootstrapConfigPath } from "./zod-schema.gateway-DYzs4yT2.mjs";
import { n as resolvePluginRoutePathContext } from "./path-context-B0Rya5D6.mjs";
import { n as findRegisteredPluginHttpRoute } from "./route-match-BMEx2Cif.mjs";
import { a as classifyMcpAppStandalonePath, c as classifyWorkerBootstrapArtifactTransferPath, i as classifyGatewayProbePath, l as classifyWorkerGatewayPath, o as classifyNodeWorkerBundleTransferPath, s as classifyNodeWorkspaceTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { l as controlUiPluginAssetRoot, r as listControlUiPluginTabAuthGrants } from "./control-ui-plugin-tabs-y8H4PDI0.mjs";
import { a as parseControlUiUserAvatarPath, i as parseControlUiResourcePath, o as resolveAssistantMediaRoutePath } from "./control-ui-resource-routes-B42sqIG-.mjs";
import { a as isControlUiVersionedPublicAsset, i as isControlUiRootPublicAsset } from "./control-ui-root-assets-DS7D1PNh.mjs";
import "./artifact-download-CXaDlLGk.mjs";
import { t as parseControlUiUserBackgroundPath } from "./control-ui-user-background-route-eOz68x04.mjs";
import { r as isControlUiPluginManagerRequest, t as classifyControlUiRequest } from "./control-ui-routing-uAI8BQgZ.mjs";
//#region src/gateway/remote-control-ui-http-routing.ts
/** Selects the permitted owner, never a permissive prefilter before arbitrary plugin dispatch. */
function resolveRemoteControlUiHttpRoute(req, basePath, scopes) {
	const raw = req.url ?? "";
	const url = URL.parse(raw, "http://openclaw.invalid");
	if (req.headers["service-worker"] !== void 0 || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || !url || `${url.pathname}${url.search}` !== raw) return;
	const pathname = url.pathname;
	const pathContext = resolvePluginRoutePathContext(pathname);
	if (pathContext.malformedEncoding || pathContext.decodePassLimitReached || pathContext.candidates.some((candidate) => /(?:^|\/)\.\.?($|\/)|\\|\0/.test(candidate))) return;
	const relative = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`)) ? pathname.slice(basePath.length) || "/" : pathname;
	const read = req.method === "GET" || req.method === "HEAD";
	if (pathname === resolveAssistantMediaRoutePath(basePath)) return read || req.method === "POST" && url.searchParams.get("meta") === "1" && url.searchParams.get("allow") === "1" ? "assistant-media" : void 0;
	if (!read) return;
	if (pathname === "/healthz") return "liveness";
	for (const candidate of [
		pathname,
		relative,
		...pathContext.candidates
	]) if (candidate.includes("/.well-known/") || candidate === "/sw.js" || candidate.endsWith("/sw.js") || classifyGatewayProbePath(candidate) !== "outside" || classifyMcpAppStandalonePath(candidate) !== "outside" || classifyWorkerGatewayPath(candidate) !== "outside" || classifyNodeWorkerBundleTransferPath(candidate) !== "outside" || classifyNodeWorkspaceTransferPath(candidate) !== "outside" || classifyWorkerBootstrapArtifactTransferPath(candidate) !== "outside") return;
	if (relative.startsWith("/api/artifacts/download/")) return "artifact";
	if (relative.startsWith("/api/chat/media/outgoing/")) return "outgoing-media";
	if (pathname.startsWith("/__openclaw__/board/")) return "board";
	if (pathname.startsWith(controlUiPluginAssetRoot(basePath))) return "native-assets";
	if (parseControlUiUserAvatarPath(pathname, basePath).matched || parseControlUiUserBackgroundPath(pathname, basePath).matched || [
		"agentAvatar",
		"catalogIcon",
		"channelAvatar",
		"linkFavicon",
		"pluginIcon",
		"pluginActivityIcon",
		"pluginThemeArt",
		"workspaceIcon"
	].some((route) => parseControlUiResourcePath(route, pathname, basePath).matched)) return "resource";
	if (isControlUiPluginManagerRequest({
		basePath,
		pathname,
		method: req.method
	})) return "document";
	if (matchesControlUiBootstrapConfigPath(pathname, basePath)) return "document";
	const registry = getPluginRegistryForContext();
	const pluginRoute = registry ? findRegisteredPluginHttpRoute(registry, pathname) : void 0;
	if (pluginRoute) return listControlUiPluginTabAuthGrants(scopes).some((grant) => grant.pluginId === pluginRoute.pluginId && grant.path === pluginRoute.path && grant.match === pluginRoute.match) ? "plugin-panel" : void 0;
	const reserved = [
		"/api",
		"/v1",
		"/j",
		"/tools",
		"/sessions",
		"/hooks",
		"/oauth",
		"/browser",
		"/desktop",
		"/__openclaw__"
	];
	if ([relative, ...pathContext.candidates.map((candidate) => basePath && candidate.startsWith(`${basePath.toLowerCase()}/`) ? candidate.slice(basePath.length) : candidate)].some((candidate) => reserved.some((root) => candidate === root || candidate.startsWith(`${root}/`)))) return;
	const asset = relative.slice(1);
	if (relative.startsWith("/assets/") || isControlUiRootPublicAsset(asset) || isControlUiVersionedPublicAsset(asset)) return "document";
	const classification = classifyControlUiRequest({
		basePath,
		pathname,
		search: url.search,
		method: req.method,
		accept: req.headers.accept
	});
	return classification.kind === "serve" || classification.kind === "redirect" ? "document" : void 0;
}
//#endregion
export { resolveRemoteControlUiHttpRoute as t };
