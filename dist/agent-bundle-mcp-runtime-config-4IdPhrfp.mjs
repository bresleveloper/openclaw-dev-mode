import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as assignSafeServerNames } from "./agent-bundle-mcp-names-BHnv55Pk.mjs";
import { t as createMcpServerToolDenyMatcher } from "./tool-policy-match-Dn8gpf-E.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { a as partitionMcpServersByConnectionScope, o as redactMcpServersForFingerprint } from "./mcp-connection-resolver-B2DfpfVe.mjs";
import { t as loadMergedBundleMcpConfig } from "./bundle-mcp-config-CNRt7XB0.mjs";
import crypto from "node:crypto";
//#region src/config/sessions/session-tool-overrides.ts
function normalizeMcpToolDenials(value) {
	const entries = Object.entries(value ?? {}).map(([serverName, toolNames]) => [serverName, [...new Set(toolNames)].toSorted((left, right) => left.localeCompare(right))]).filter(([, toolNames]) => toolNames.length > 0).toSorted(([left], [right]) => left.localeCompare(right));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function normalizeSessionToolOverrides(raw) {
	if (!raw) return;
	const normalizeBooleanMap = (value) => {
		const entries = Object.entries(value ?? {}).toSorted(([left], [right]) => left.localeCompare(right));
		return entries.length > 0 ? Object.fromEntries(entries) : void 0;
	};
	const mcpToolsDeny = normalizeMcpToolDenials(raw.mcpToolsDeny);
	const mcpServers = normalizeBooleanMap(raw.mcpServers);
	const skills = normalizeBooleanMap(raw.skills);
	const normalized = {
		...mcpServers ? { mcpServers } : {},
		...mcpToolsDeny ? { mcpToolsDeny } : {},
		...skills ? { skills } : {},
		...raw.webSearch === false ? { webSearch: false } : {}
	};
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Compare sparse tool policy overlays by their canonical stored meaning. */
function sessionToolOverridesEqual(left, right) {
	return stableStringify(normalizeSessionToolOverrides(left)) === stableStringify(normalizeSessionToolOverrides(right));
}
//#endregion
//#region src/agents/embedded-agent-mcp.ts
/** Loads merged MCP server config for an embedded agent workspace. */
function loadEmbeddedAgentMcpConfig(params) {
	const bundleMcp = loadMergedBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides
	});
	return {
		mcpServers: bundleMcp.config.mcpServers,
		diagnostics: bundleMcp.diagnostics,
		pluginIdsByServer: bundleMcp.pluginIdsByServer,
		prepareDataDirsByServer: bundleMcp.prepareDataDirsByServer
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-runtime-config.ts
function digestSafeServerNameAssignments(safeServerNamesByServer) {
	if (!safeServerNamesByServer || safeServerNamesByServer.size === 0) return;
	return Object.fromEntries([...safeServerNamesByServer.entries()].toSorted(([a], [b]) => a.localeCompare(b)));
}
function createCatalogFingerprint(params) {
	return crypto.createHash("sha256").update(JSON.stringify(params)).digest("hex");
}
function filterMcpServers(mcpServers, options) {
	if (!options.includeServerNames && !options.excludeServerNames && !options.toolDenylist?.length) return mcpServers;
	const filtered = {};
	const isDenied = createMcpServerToolDenyMatcher(options.toolDenylist);
	for (const [serverName, rawServer] of Object.entries(mcpServers)) {
		if (options.includeServerNames && !options.includeServerNames.has(serverName)) continue;
		if (options.excludeServerNames?.has(serverName)) continue;
		if (isDenied(options.safeServerNamesByServer.get(serverName) ?? serverName)) continue;
		filtered[serverName] = rawServer;
	}
	return filtered;
}
function loadSessionMcpConfig(params) {
	const loaded = params.loaded ?? loadEmbeddedAgentMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides
	});
	if (params.logDiagnostics !== false) for (const diagnostic of loaded.diagnostics) logWarn(`bundle-mcp: ${diagnostic.pluginId}: ${diagnostic.message}`);
	const safeServerNamesByServer = params.safeServerNamesByServer ?? assignSafeServerNames(Object.keys(loaded.mcpServers));
	const safeServerNames = digestSafeServerNameAssignments(safeServerNamesByServer);
	const mcpAppsEnabled = params.cfg?.mcp?.apps?.enabled === true;
	const mcpToolsDeny = normalizeMcpToolDenials(params.toolOverrides?.mcpToolsDeny);
	const mcpServers = filterMcpServers(loaded.mcpServers, {
		includeServerNames: params.includeServerNames,
		excludeServerNames: params.excludeServerNames,
		safeServerNamesByServer,
		toolDenylist: params.toolDenylist
	});
	const prepareDataDirsByServer = Object.fromEntries(Object.entries(loaded.prepareDataDirsByServer ?? {}).filter(([serverName]) => Object.hasOwn(mcpServers, serverName)));
	const fingerprintServers = params.redactConnectionServerNames?.size ? redactMcpServersForFingerprint(mcpServers, params.redactConnectionServerNames) : mcpServers;
	const result = {
		safeServerNamesByServer,
		loaded: {
			...loaded,
			mcpServers,
			prepareDataDirsByServer
		},
		fingerprint: createCatalogFingerprint({
			servers: fingerprintServers,
			mcpAppsEnabled,
			...safeServerNames ? { safeServerNames } : {},
			mcpToolsDeny
		})
	};
	return structuredClone(result);
}
/**
* Loads enabled MCP config metadata for a session without creating runtimes,
* connecting transports, or issuing MCP tools/list requests.
*/
function resolveSessionMcpConfigSummary(params) {
	const { loaded, safeServerNamesByServer } = loadSessionMcpConfig({
		...params,
		logDiagnostics: false
	});
	const serverNames = Object.keys(loaded.mcpServers).toSorted((a, b) => a.localeCompare(b));
	const { requesterScopedServerNames } = partitionMcpServersByConnectionScope(loaded.mcpServers);
	const { fingerprint } = loadSessionMcpConfig({
		...params,
		loaded,
		logDiagnostics: false,
		...requesterScopedServerNames.length > 0 ? { excludeServerNames: new Set(requesterScopedServerNames) } : {},
		safeServerNamesByServer
	});
	return {
		fingerprint,
		serverNames
	};
}
//#endregion
export { sessionToolOverridesEqual as a, normalizeSessionToolOverrides as i, resolveSessionMcpConfigSummary as n, loadEmbeddedAgentMcpConfig as r, loadSessionMcpConfig as t };
