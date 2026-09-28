import { c as isRecord, s as filterStringRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as createLazyRuntimeMethod } from "./lazy-runtime-BPNHa36e.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-ByV7kR1W.mjs";
import { n as withSameOriginMcpHttpHeaders, r as withoutMcpAuthorizationHeader, t as buildMcpHttpFetch } from "./mcp-http-fetch-CXlFHx86.mjs";
import crypto from "node:crypto";
//#region src/agents/mcp-auth-profile.ts
/**
* Auth-profile backed bearer injection for remote MCP servers.
*/
/** Returns the refresh-capable auth profile selected for one MCP server. */
function resolveMcpAuthProfileId(rawServer) {
	if (!isRecord(rawServer) || rawServer.auth !== "oauth" || !isRecord(rawServer.oauth)) return;
	const authProfileId = rawServer.oauth.authProfileId;
	return typeof authProfileId === "string" && authProfileId.trim().length > 0 ? authProfileId.trim() : void 0;
}
/** Returns whether a server needs an OpenClaw-managed bearer projected externally. */
function requiresMcpBearerProjection(rawServer) {
	if (!isRecord(rawServer) || rawServer.auth !== "oauth") return false;
	return Boolean(resolveMcpAuthProfileId(rawServer) || typeof rawServer.url === "string");
}
const resolveMcpAuthProfileBearerToken = createLazyRuntimeMethod(() => import("./agents/mcp-auth-profile.runtime.js"), (runtime) => runtime.resolveMcpAuthProfileBearerToken);
async function resolveMcpBearerToken(params) {
	const authProfileId = resolveMcpAuthProfileId(params.server);
	if (authProfileId) return await resolveMcpAuthProfileBearerToken({
		serverName: params.serverName,
		profileId: authProfileId,
		cfg: params.cfg,
		agentDir: params.agentDir
	});
	if (params.server.auth !== "oauth") return;
	const resolved = resolveMcpTransportConfig(params.serverName, params.server);
	if (!resolved || resolved.kind !== "http") return;
	const [{ operatorMcpOAuthIdentity }, { resolveMcpOAuthAccessToken }] = await Promise.all([import("./mcp-oauth-identity-DB8Q-p21.mjs"), import("./mcp-oauth-Dt9_5Q12.mjs")]);
	const fetchFn = withSameOriginMcpHttpHeaders({
		fetchFn: buildMcpHttpFetch({
			sslVerify: resolved.sslVerify,
			clientCert: resolved.clientCert,
			clientKey: resolved.clientKey,
			resourceUrl: resolved.url,
			timeoutMs: resolved.requestTimeoutMs
		}),
		headers: withoutMcpAuthorizationHeader(resolved.headers),
		resourceUrl: resolved.url
	});
	return await resolveMcpOAuthAccessToken({
		identity: operatorMcpOAuthIdentity(params.serverName, resolved.url),
		config: resolved.oauth,
		fetchFn
	});
}
/** Wraps HTTP MCP fetch with same-origin, refreshed bearer injection. */
function withMcpAuthProfileBearer(params) {
	const resourceOrigin = new URL(params.resourceUrl).origin;
	const configuredHeaders = withoutMcpAuthorizationHeader(params.headers);
	return async (url, init) => {
		if (new URL(url).origin !== resourceOrigin) return params.fetchFn(url, init);
		const headers = new Headers(configuredHeaders);
		for (const [key, value] of new Headers(init?.headers)) if (key.toLowerCase() !== "authorization") headers.set(key, value);
		const token = await resolveMcpAuthProfileBearerToken({
			serverName: params.serverName,
			profileId: params.authProfileId,
			cfg: params.cfg,
			agentDir: params.agentDir
		});
		headers.set("authorization", `Bearer ${token}`);
		return params.fetchFn(url, {
			...init,
			headers
		});
	};
}
function buildTokenEnvVarName(serverName) {
	return `OPENCLAW_MCP_AUTH_${crypto.createHash("sha256").update(serverName).digest("hex").slice(0, 12).toUpperCase()}_TOKEN`;
}
function stripOpenClawOnlyOAuthConfig(server) {
	const next = { ...server };
	delete next.auth;
	delete next.oauth;
	return next;
}
/** Resolves OAuth-backed MCP servers into bearer headers for external runtimes. */
async function resolveMcpBearerBundleConfig(params) {
	let nextServers;
	let nextEnv = params.env;
	const tokenProjection = params.tokenProjection ?? "env";
	for (const [serverName, server] of Object.entries(params.config.mcpServers)) {
		let token;
		try {
			token = await resolveMcpBearerToken({
				serverName,
				server,
				cfg: params.cfg,
				agentDir: params.agentDir
			});
		} catch (error) {
			if (!params.omitUnavailableOAuthServers || !requiresMcpBearerProjection(server)) throw error;
			nextServers ??= { ...params.config.mcpServers };
			delete nextServers[serverName];
			params.onServerUnavailable?.(serverName, error);
			continue;
		}
		if (!token) continue;
		let authorization;
		if (tokenProjection === "literal") authorization = `Bearer ${token}`;
		else {
			const envVar = buildTokenEnvVarName(serverName);
			if (!nextEnv || nextEnv === params.env) nextEnv = { ...params.env };
			nextEnv[envVar] = token;
			authorization = `Bearer \${${envVar}}`;
		}
		const headers = withoutMcpAuthorizationHeader(filterStringRecord(server.headers));
		nextServers ??= { ...params.config.mcpServers };
		nextServers[serverName] = stripOpenClawOnlyOAuthConfig({
			...server,
			headers: {
				...headers,
				Authorization: authorization
			}
		});
	}
	return {
		config: nextServers ? { mcpServers: nextServers } : params.config,
		env: nextEnv
	};
}
//#endregion
export { withMcpAuthProfileBearer as i, resolveMcpAuthProfileId as n, resolveMcpBearerBundleConfig as r, requiresMcpBearerProjection as t };
