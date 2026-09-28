import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { i as resolveOpenClawMcpTransportAlias } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import crypto from "node:crypto";
//#region src/agents/mcp-connection-resolver.ts
/**
* Plugin-registered MCP connection resolvers: lookup and per-requester resolve.
* Resolved url/headers are credentials — never log, fingerprint, or persist them.
*/
/** Per-server bound on plugin resolve(); stalled providers must not hang getOrCreate. */
const MCP_CONNECTION_RESOLVER_TIMEOUT_MS = 1e4;
/**
* How long a full-set requester runtime may skip re-resolve while active.
* Revocation/rotation takes effect within this window even for continuously active requesters.
*/
const MCP_CONNECTION_REVALIDATE_MS = 3e5;
/**
* Ephemeral per-process HMAC key for connection digests. Never exported, logged,
* or persisted — dies with the process so digests are not offline-guessable.
*/
let connectionDigestKey;
function getConnectionDigestKey() {
	connectionDigestKey ??= crypto.randomBytes(32);
	return connectionDigestKey;
}
/**
* Ephemeral keyed digest of resolved connection material for rotation detection.
* HMAC-SHA256 with a process-local random key — not a plain hash of credentials.
* Never log or persist the preimage (urls/headers) or the key.
*/
function hashMcpResolvedConnections(connections) {
	const tuples = [...connections.entries()].toSorted(([a], [b]) => a.localeCompare(b)).map(([serverName, connection]) => {
		const headers = connection.headers ? Object.entries(connection.headers).toSorted(([a], [b]) => a.localeCompare(b)) : [];
		return [
			serverName,
			connection.url,
			headers
		];
	});
	return crypto.createHmac("sha256", getConnectionDigestKey()).update(JSON.stringify(tuples)).digest("hex");
}
var McpResolverTimeoutError = class extends Error {
	constructor() {
		super("mcp connection resolver timed out");
		this.name = "McpResolverTimeoutError";
	}
};
function raceWithTimeout(promise, timeoutMs) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new McpResolverTimeoutError());
		}, timeoutMs);
		timer.unref?.();
		promise.then((value) => {
			clearTimeout(timer);
			resolve(value);
		}, (error) => {
			clearTimeout(timer);
			reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
}
/** Returns registered connection resolvers keyed by server name (deterministic order). */
function listMcpServerConnectionResolversByServerName() {
	const byName = /* @__PURE__ */ new Map();
	const registry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry();
	for (const entry of registry?.mcpServerConnectionResolvers ?? []) {
		const serverName = normalizeOptionalString(entry.resolver.serverName);
		if (!serverName || typeof entry.resolver.resolve !== "function" || byName.has(serverName)) continue;
		byName.set(serverName, {
			pluginId: entry.pluginId,
			serverName,
			resolve: entry.resolver.resolve
		});
	}
	return new Map([...byName.entries()].toSorted(([a], [b]) => a.localeCompare(b)));
}
/** Partition loaded MCP servers into static vs requester-scoped connections. */
function partitionMcpServersByConnectionScope(mcpServers) {
	const resolvers = listMcpServerConnectionResolversByServerName();
	const staticServerEntries = [];
	const requesterScopedServerNames = [];
	const oauthRequesterServerNames = [];
	const resolverRequesterServerNames = [];
	for (const [serverName, rawServer] of Object.entries(mcpServers).toSorted(([a], [b]) => a.localeCompare(b))) {
		const oauth = isRecord(rawServer) && isRecord(rawServer.oauth) ? rawServer.oauth : void 0;
		if (isRecord(rawServer) && rawServer.auth === "oauth" && oauth?.identity === "per-requester") {
			requesterScopedServerNames.push(serverName);
			oauthRequesterServerNames.push(serverName);
			continue;
		}
		if (resolvers.has(serverName)) {
			requesterScopedServerNames.push(serverName);
			resolverRequesterServerNames.push(serverName);
			continue;
		}
		staticServerEntries.push([serverName, rawServer]);
	}
	return {
		staticServers: Object.fromEntries(staticServerEntries),
		requesterScopedServerNames,
		oauthRequesterServerNames,
		resolverRequesterServerNames
	};
}
/**
* Debug-proxy capture and log redaction match registered exact values, not
* header names alone. Resolver output is credential material (auth headers,
* signed-URL query tokens), so register it before it can reach any transport.
*/
function registerResolvedConnectionSecrets(connection) {
	for (const value of Object.values(connection.headers ?? {})) {
		registerSecretValueForRedaction(value);
		const bareToken = value.trim().split(/\s+/).at(-1);
		if (bareToken && bareToken !== value) registerSecretValueForRedaction(bareToken);
	}
	registerSecretValueForRedaction(connection.url);
	try {
		const url = new URL(connection.url);
		for (const queryValue of url.searchParams.values()) registerSecretValueForRedaction(queryValue);
		if (url.password) registerSecretValueForRedaction(url.password);
	} catch {}
}
/**
* Resolve requester-scoped server connections. Fail closed without requesterSenderId:
* returns an empty map (no shared-connection fallback). Per-server resolve errors and
* timeouts are logged generically and omitted so one plugin cannot block static MCP.
* Servers resolve concurrently (each individually bounded).
*/
async function resolveRequesterScopedMcpConnections(params) {
	const requesterSenderId = normalizeOptionalString(params.requesterSenderId);
	const resolved = /* @__PURE__ */ new Map();
	if (!requesterSenderId || params.serverNames.length === 0) return resolved;
	const resolvers = listMcpServerConnectionResolversByServerName();
	const ctx = {
		requesterSenderId,
		...normalizeOptionalString(params.agentAccountId) ? { agentAccountId: normalizeOptionalString(params.agentAccountId) } : {},
		...normalizeOptionalString(params.messageChannel) ? { messageChannel: normalizeOptionalString(params.messageChannel) } : {}
	};
	const timeoutMs = MCP_CONNECTION_RESOLVER_TIMEOUT_MS;
	const sortedNames = [...params.serverNames].toSorted((a, b) => a.localeCompare(b));
	const settled = await Promise.all(sortedNames.map(async (serverName) => {
		const entry = resolvers.get(serverName);
		if (!entry) return null;
		try {
			const result = await raceWithTimeout(Promise.resolve(entry.resolve(ctx)), timeoutMs);
			if (!result || typeof result.url !== "string" || result.url.trim().length === 0) return null;
			const headers = result.headers && isRecord(result.headers) ? Object.fromEntries(Object.entries(result.headers).filter((headerEntry) => typeof headerEntry[1] === "string").toSorted(([a], [b]) => a.localeCompare(b))) : void 0;
			const connection = {
				url: result.url.trim(),
				...headers && Object.keys(headers).length > 0 ? { headers } : {}
			};
			registerResolvedConnectionSecrets(connection);
			return {
				serverName,
				connection
			};
		} catch (error) {
			const kind = error instanceof McpResolverTimeoutError ? "resolver timeout" : "resolver error";
			logWarn(`bundle-mcp: connection resolver for server "${serverName}" (plugin "${entry.pluginId}") failed with ${kind}`);
			return null;
		}
	}));
	for (const entry of settled) if (entry) resolved.set(entry.serverName, entry.connection);
	return resolved;
}
/**
* Apply resolved connection fields for transport construction only.
* Does not mutate the original static config object.
*/
function applyMcpConnectionOverride(rawServer, override) {
	const base = isRecord(rawServer) ? { ...rawServer } : {};
	base.url = override.url;
	if (override.headers) base.headers = { ...override.headers };
	else delete base.headers;
	const fromTransport = typeof base.transport === "string" ? resolveOpenClawMcpTransportAlias(base.transport) : void 0;
	const fromType = resolveOpenClawMcpTransportAlias(base.type);
	base.transport = fromTransport ?? fromType ?? "streamable-http";
	delete base.auth;
	delete base.oauth;
	delete base.type;
	delete base.command;
	delete base.args;
	return base;
}
/**
* Fingerprint shape for requester-scoped servers: identity + filters only.
* Never includes resolved or static url/headers credentials.
*/
function redactMcpServersForFingerprint(mcpServers, requesterScopedServerNames) {
	const redacted = {};
	for (const [serverName, rawServer] of Object.entries(mcpServers).toSorted(([a], [b]) => a.localeCompare(b))) {
		if (!requesterScopedServerNames.has(serverName)) {
			redacted[serverName] = rawServer;
			continue;
		}
		if (!isRecord(rawServer)) {
			redacted[serverName] = { connection: "requester-scoped" };
			continue;
		}
		const { url: _url, headers: _headers, command: _command, args: _args, env: _env, ...rest } = rawServer;
		redacted[serverName] = {
			...rest,
			connection: "requester-scoped"
		};
	}
	return redacted;
}
function buildMcpRequesterRuntimeCacheKey(params) {
	return JSON.stringify({
		sessionId: params.sessionId,
		messageChannel: normalizeOptionalString(params.messageChannel) ?? "",
		agentAccountId: normalizeOptionalString(params.agentAccountId) ?? "",
		requesterSenderId: params.requesterSenderId
	});
}
//#endregion
export { partitionMcpServersByConnectionScope as a, hashMcpResolvedConnections as i, applyMcpConnectionOverride as n, redactMcpServersForFingerprint as o, buildMcpRequesterRuntimeCacheKey as r, resolveRequesterScopedMcpConnections as s, MCP_CONNECTION_REVALIDATE_MS as t };
