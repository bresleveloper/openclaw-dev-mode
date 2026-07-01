import { L as buildCodexAppInventoryCacheKey } from "./thread-lifecycle-DXf3feud.js";
import { b as resolveCodexAppServerHomeDir } from "./shared-client-CuiK7Xrr.js";
import { createHash } from "node:crypto";
//#region extensions/codex/src/app-server/plugin-app-cache-key.ts
/**
* Builds stable Codex plugin/app inventory cache keys from app-server startup,
* auth, account, and version inputs without storing secret material.
*/
/** Builds the full app inventory cache key for Codex plugin/app discovery. */
function buildCodexPluginAppCacheKey(params) {
	return buildCodexAppInventoryCacheKey({
		codexHome: params.runtimeIdentity?.codexHome ?? resolveCodexPluginAppCacheCodexHome(params.appServer, params.agentDir),
		endpoint: resolveCodexPluginAppCacheEndpoint(params.appServer),
		authProfileId: params.authProfileId,
		accountId: params.accountId,
		envApiKeyFingerprint: params.envApiKeyFingerprint,
		appServerVersion: params.appServerVersion ?? params.runtimeIdentity?.serverVersion,
		runtimeIdentity: params.runtimeIdentity
	});
}
/** Builds a durable thread-binding fingerprint for one initialized app-server runtime. */
function buildCodexAppServerRuntimeFingerprint(params) {
	return JSON.stringify({
		endpoint: resolveCodexPluginAppCacheEndpoint(params.appServer),
		connectionClass: params.appServer.connectionClass,
		remoteWorkspaceRoot: params.appServer.remoteWorkspaceRoot ?? null,
		appServerVersion: params.appServerVersion ?? params.runtimeIdentity?.serverVersion ?? null,
		runtimeIdentity: params.runtimeIdentity ?? null
	});
}
/** Serializes app-server endpoint identity, including credential fingerprints. */
function resolveCodexPluginAppCacheEndpoint(appServer) {
	return JSON.stringify({
		transport: appServer.start.transport,
		command: appServer.start.command,
		args: appServer.start.args,
		url: appServer.start.url ?? null,
		credentialFingerprint: fingerprintCodexPluginAppCacheCredentials(appServer.start)
	});
}
/** Resolves the CODEX_HOME value that scopes local app-server inventory. */
function resolveCodexPluginAppCacheCodexHome(appServer, agentDir) {
	const configuredCodexHome = appServer.start.env?.CODEX_HOME?.trim();
	if (configuredCodexHome) return configuredCodexHome;
	return appServer.start.transport === "stdio" && agentDir ? resolveCodexAppServerHomeDir(agentDir) : void 0;
}
function fingerprintCodexPluginAppCacheCredentials(startOptions) {
	const authToken = startOptions.authToken ?? "";
	const headers = Object.entries(startOptions.headers).map(([key, value]) => [key.toLowerCase(), value]).toSorted(([left], [right]) => left.localeCompare(right));
	if (!authToken && headers.length === 0) return null;
	const hash = createHash("sha256");
	hash.update("openclaw:codex:plugin-app-cache-credentials:v1");
	hash.update("\0");
	hash.update(authToken);
	for (const [key, value] of headers) {
		hash.update("\0");
		hash.update(key);
		hash.update("\0");
		hash.update(value);
	}
	return `sha256:${hash.digest("hex")}`;
}
//#endregion
export { buildCodexPluginAppCacheKey as n, buildCodexAppServerRuntimeFingerprint as t };
