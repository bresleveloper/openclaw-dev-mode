import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, s as filterStringRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { t as AuthProfileAuthorizationError } from "./authorization-contract-BOF8YHOo.mjs";
import { i as resolveConfiguredMcpTransport, r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-BD-xidlv.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { i as loadEnabledBundleMcpConfig } from "./bundle-mcp-dtpQHFMr.mjs";
import fs from "node:fs";
import crypto from "node:crypto";
//#region src/agents/mcp-connection-resolver.ts
/**
* Plugin-registered MCP connection resolvers: lookup and per-requester resolve.
* Resolved url/headers are credentials — never log, fingerprint, or persist them.
*/
function isLiveConnectionAuthority(value) {
	return isRecord(value) && typeof value.authorizationId === "string" && value.authorizationId.length > 0 && value.authorizationId.length <= 2048 && typeof value.assertCurrent === "function" && typeof value.revalidate === "function" && typeof value.dispose === "function";
}
function retainResolverObservation(authority, issuer) {
	const authorizationId = authority.authorizationId;
	let disposed = false;
	const assertCurrent = () => {
		if (disposed || authority.authorizationId !== authorizationId) throw new AuthProfileAuthorizationError("retired");
		try {
			authority.assertCurrent();
		} catch (error) {
			throw new AuthProfileAuthorizationError(isRecord(error) && error.code === "MCP_AUTHORIZATION_RETIRED" ? "retired" : "unavailable");
		}
	};
	return {
		authorizationId: JSON.stringify([
			issuer.pluginId,
			issuer.serverName,
			authorizationId
		]),
		assertCurrent,
		revalidate: async () => {
			if (disposed || authority.authorizationId !== authorizationId) throw new AuthProfileAuthorizationError("retired");
			try {
				await raceWithTimeout(Promise.resolve(authority.revalidate()), MCP_CONNECTION_RESOLVER_TIMEOUT_MS, () => {
					throw new McpResolverTimeoutError();
				}, { ref: false });
				assertCurrent();
			} catch (error) {
				throw new AuthProfileAuthorizationError(isRecord(error) && error.code === "MCP_AUTHORIZATION_RETIRED" ? "retired" : "unavailable");
			}
		},
		dispose: () => {
			if (!disposed) {
				disposed = true;
				authority.dispose();
			}
		}
	};
}
function releaseResolverObservation(value) {
	if (typeof value?.authority?.dispose === "function") value.authority.dispose();
}
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
	return crypto.createHmac("sha256", connectionDigestKey ??= crypto.randomBytes(32)).update(JSON.stringify(tuples)).digest("hex");
}
var McpResolverTimeoutError = class extends Error {
	constructor() {
		super("mcp connection resolver timed out");
		this.name = "McpResolverTimeoutError";
	}
};
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
	if (params.retainAuthority && params.serverNames.length !== 1) throw new Error("Live MCP authority must resolve one exact server");
	const requesterSenderId = normalizeOptionalString(params.requesterSenderId);
	const resolved = /* @__PURE__ */ new Map();
	if (!requesterSenderId || params.serverNames.length === 0) return resolved;
	const resolvers = listMcpServerConnectionResolversByServerName();
	const agentAccountId = normalizeOptionalString(params.agentAccountId);
	const messageChannel = normalizeOptionalString(params.messageChannel);
	const ctx = {
		requesterSenderId,
		...agentAccountId ? { agentAccountId } : {},
		...messageChannel ? { messageChannel } : {},
		...params.retainAuthority ? { requireLiveAuthority: true } : {}
	};
	const timeoutMs = MCP_CONNECTION_RESOLVER_TIMEOUT_MS;
	const sortedNames = [...params.serverNames].toSorted((a, b) => a.localeCompare(b));
	const settled = await Promise.all(sortedNames.map(async (serverName) => {
		const entry = resolvers.get(serverName);
		if (!entry) {
			if (params.retainAuthority) throw new AuthProfileAuthorizationError("unavailable");
			return null;
		}
		let result = null;
		let transferred = false;
		try {
			const resolving = Promise.resolve(entry.resolve(ctx));
			try {
				result = await raceWithTimeout(resolving, timeoutMs, () => {
					throw new McpResolverTimeoutError();
				}, { ref: false });
			} catch (error) {
				if (error instanceof McpResolverTimeoutError) resolving.then(releaseResolverObservation).catch(() => {
					logWarn("bundle-mcp: late resolver authority cleanup failed");
				});
				throw error;
			}
			if (!result || typeof result.url !== "string" || result.url.trim().length === 0) {
				if (params.retainAuthority) throw new AuthProfileAuthorizationError(result === null ? "retired" : "unavailable");
				return null;
			}
			const authority = params.retainAuthority ? result.authority : void 0;
			if (params.retainAuthority && !isLiveConnectionAuthority(authority)) throw new AuthProfileAuthorizationError("unavailable");
			authority?.assertCurrent();
			const filteredHeaders = filterStringRecord(result.headers);
			const headers = filteredHeaders ? Object.fromEntries(Object.entries(filteredHeaders).toSorted(([a], [b]) => a.localeCompare(b))) : void 0;
			const connection = {
				url: result.url.trim(),
				...headers ? { headers } : {},
				...authority ? { authority: retainResolverObservation(authority, entry) } : {}
			};
			registerResolvedConnectionSecrets(connection);
			transferred = Boolean(authority);
			return {
				serverName,
				connection
			};
		} catch (error) {
			if (params.retainAuthority) throw new AuthProfileAuthorizationError(isRecord(error) && error.code === "MCP_AUTHORIZATION_RETIRED" ? "retired" : "unavailable");
			const kind = error instanceof McpResolverTimeoutError ? "resolver timeout" : "resolver error";
			logWarn(`bundle-mcp: connection resolver for server "${serverName}" (plugin "${entry.pluginId}") failed with ${kind}`);
			return null;
		} finally {
			if (!transferred) try {
				releaseResolverObservation(result);
			} catch {
				logWarn("bundle-mcp: resolver authority cleanup failed");
			}
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
	const transport = resolveConfiguredMcpTransport(base);
	base.transport = !transport || transport === "stdio" ? "streamable-http" : transport;
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
//#region src/agents/bundle-mcp-config.ts
/**
* Merges bundled plugin MCP servers with user-configured MCP servers for agent
* runtimes.
*/
const OPENCLAW_TRANSPORT_TO_CLI_BUNDLE_TYPE = {
	"streamable-http": "http",
	http: "http",
	sse: "sse",
	stdio: "stdio"
};
/** Session-shared harness connections must exclude requester-owned credentials. */
function loadStaticBundleMcpConfig(params) {
	const loaded = loadMergedBundleMcpConfig(params);
	const { staticServers, requesterScopedServerNames } = partitionMcpServersByConnectionScope(loaded.config.mcpServers);
	return {
		...loaded,
		config: { mcpServers: staticServers },
		prepareDataDirsByServer: Object.fromEntries(Object.entries(loaded.prepareDataDirsByServer).filter(([name]) => Object.hasOwn(staticServers, name))),
		requesterScopedServerNames
	};
}
function prepareOwnedBundleMcpDataDirs(params) {
	const mcpServers = { ...params.config.mcpServers };
	const prepareDataDirsByServer = {};
	const diagnostics = [];
	for (const [serverName, ownership] of Object.entries(params.prepareDataDirsByServer)) {
		if (!Object.hasOwn(mcpServers, serverName)) continue;
		try {
			fs.mkdirSync(ownership.dataDir, { recursive: true });
			prepareDataDirsByServer[serverName] = ownership;
		} catch (error) {
			delete mcpServers[serverName];
			diagnostics.push({
				pluginId: ownership.pluginId,
				message: `unable to prepare PLUGIN_DATA directory "${ownership.dataDir}" for MCP server "${serverName}": ${formatErrorMessage(error)}`
			});
		}
	}
	return {
		config: { mcpServers },
		diagnostics,
		prepareDataDirsByServer
	};
}
/**
* User config stores OpenClaw MCP transport names, while CLI backends such as
* Claude Code and Gemini expect a downstream `type` field. Keep this adapter
* at the output boundary so OAuth and runtime policy keep canonical transport.
*/
function toCliBundleMcpServerConfig(server) {
	const next = { ...server };
	const rawTransport = next.transport;
	delete next.transport;
	if (typeof rawTransport === "string") {
		const mapped = OPENCLAW_TRANSPORT_TO_CLI_BUNDLE_TYPE[rawTransport];
		if (mapped) next.type = mapped;
	}
	return next;
}
/** Loads enabled bundled MCP servers and overlays user config by server name. */
function loadMergedBundleMcpConfig(params) {
	return mergeConfiguredBundleMcpServers(loadEnabledBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry
	}), params);
}
/** Apply the same operator overrides to prepared runtime and account-setup declarations. */
function mergeConfiguredBundleMcpServers(bundleMcp, params) {
	const configuredMcp = normalizeConfiguredMcpServers(params.cfg?.mcp?.servers);
	const serverOverrides = params.toolOverrides?.mcpServers;
	const mcpServers = Object.fromEntries(Object.entries({
		...bundleMcp.config.mcpServers,
		...configuredMcp
	}).filter(([name]) => {
		const override = serverOverrides && Object.hasOwn(serverOverrides, name) ? serverOverrides[name] : void 0;
		return override !== false && (override === true || configuredMcp[name]?.enabled !== false);
	}));
	const isUnshadowedBundleServer = ([name]) => Object.hasOwn(mcpServers, name) && !Object.hasOwn(configuredMcp, name);
	const prepareDataDirsByServer = Object.fromEntries(Object.entries(bundleMcp.prepareDataDirsByServer ?? {}).filter(isUnshadowedBundleServer));
	return {
		config: { mcpServers },
		diagnostics: bundleMcp.diagnostics,
		pluginIdsByServer: Object.fromEntries(Object.entries(bundleMcp.pluginIdsByServer).filter(isUnshadowedBundleServer)),
		prepareDataDirsByServer
	};
}
//#endregion
export { toCliBundleMcpServerConfig as a, buildMcpRequesterRuntimeCacheKey as c, redactMcpServersForFingerprint as d, resolveRequesterScopedMcpConnections as f, prepareOwnedBundleMcpDataDirs as i, hashMcpResolvedConnections as l, loadStaticBundleMcpConfig as n, MCP_CONNECTION_REVALIDATE_MS as o, mergeConfiguredBundleMcpServers as r, applyMcpConnectionOverride as s, loadMergedBundleMcpConfig as t, partitionMcpServersByConnectionScope as u };
