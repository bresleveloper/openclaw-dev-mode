import { t as assignSafeServerNames } from "./agent-bundle-mcp-names-38ksiKnf.mjs";
import { t as createMcpServerToolDenyMatcher } from "./tool-policy-match-Bv2XOvEF.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { t as loadMergedBundleMcpConfig } from "./bundle-mcp-config-CbhTP1Cm.mjs";
import { a as partitionMcpServersByConnectionScope, o as redactMcpServersForFingerprint } from "./mcp-connection-resolver-DZ9VYF6v.mjs";
import crypto from "node:crypto";
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
		prepareDataDirsByServer: bundleMcp.prepareDataDirsByServer
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-runtime-config.ts
/** Session MCP config loading, filtering, and catalog fingerprints. */
function digestSafeServerNameAssignments(safeServerNamesByServer) {
	if (!safeServerNamesByServer || safeServerNamesByServer.size === 0) return;
	return Object.fromEntries([...safeServerNamesByServer.entries()].toSorted(([a], [b]) => a.localeCompare(b)));
}
function digestMcpToolDenials(value) {
	const entries = Object.entries(value ?? {}).map(([serverName, toolNames]) => [serverName, [...new Set(toolNames)].toSorted((left, right) => left.localeCompare(right))]).filter(([, toolNames]) => toolNames.length > 0).toSorted(([left], [right]) => left.localeCompare(right));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
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
	const mcpToolsDeny = digestMcpToolDenials(params.toolOverrides?.mcpToolsDeny);
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
/** Reads the enabled static MCP server set without opening transports or listing tools. */
function resolveStaticSessionMcpServerNames(params) {
	const { loaded } = loadSessionMcpConfig({
		...params,
		logDiagnostics: false
	});
	const { staticServers } = partitionMcpServersByConnectionScope(loaded.mcpServers);
	return Object.keys(staticServers).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { loadEmbeddedAgentMcpConfig as i, resolveSessionMcpConfigSummary as n, resolveStaticSessionMcpServerNames as r, loadSessionMcpConfig as t };
