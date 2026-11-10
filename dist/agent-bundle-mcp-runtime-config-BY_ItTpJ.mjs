import { t as assignSafeServerNames } from "./agent-bundle-mcp-names-CFVETBL6.mjs";
import { t as createMcpServerToolDenyMatcher } from "./tool-policy-match--5jlhAPZ.mjs";
import { n as normalizeMcpToolDenials } from "./session-tool-overrides-B6c6gJaM.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { d as redactMcpServersForFingerprint, t as loadMergedBundleMcpConfig, u as partitionMcpServersByConnectionScope } from "./bundle-mcp-config-BEIeeWHy.mjs";
import crypto from "node:crypto";
//#region src/agents/embedded-agent-mcp.ts
function loadEmbeddedAgentMcpConfig(params) {
	const { config, ...metadata } = loadMergedBundleMcpConfig(params);
	return {
		...config,
		...metadata
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
export { resolveSessionMcpConfigSummary as n, loadEmbeddedAgentMcpConfig as r, loadSessionMcpConfig as t };
