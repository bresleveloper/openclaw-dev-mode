import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-DQmvZkAl.mjs";
import { i as loadEnabledBundleMcpConfig } from "./bundle-mcp-B0gcrw-D.mjs";
import { a as partitionMcpServersByConnectionScope } from "./mcp-connection-resolver-B2DfpfVe.mjs";
import fs from "node:fs";
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
	const bundleMcp = loadEnabledBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry
	});
	const configuredMcp = normalizeConfiguredMcpServers(params.cfg?.mcp?.servers);
	const serverOverrides = params.toolOverrides?.mcpServers;
	const readServerOverride = (name) => serverOverrides && Object.hasOwn(serverOverrides, name) ? serverOverrides[name] : void 0;
	const disabledConfiguredNames = new Set(Object.entries(configuredMcp).filter(([name, server]) => readServerOverride(name) !== true && server.enabled === false).map(([name]) => name));
	const enabledConfiguredMcp = Object.fromEntries(Object.entries(configuredMcp).filter(([name, server]) => readServerOverride(name) !== false && (readServerOverride(name) === true || server.enabled !== false)));
	const enabledBundleMcp = Object.fromEntries(Object.entries(bundleMcp.config.mcpServers).filter(([name]) => readServerOverride(name) !== false && !disabledConfiguredNames.has(name)));
	const prepareDataDirsByServer = Object.fromEntries(Object.entries(bundleMcp.prepareDataDirsByServer ?? {}).filter(([name]) => Object.hasOwn(enabledBundleMcp, name) && !Object.hasOwn(enabledConfiguredMcp, name)));
	return {
		config: { mcpServers: {
			...enabledBundleMcp,
			...enabledConfiguredMcp
		} },
		diagnostics: bundleMcp.diagnostics,
		pluginIdsByServer: Object.fromEntries(Object.entries(bundleMcp.pluginIdsByServer).filter(([name]) => Object.hasOwn(enabledBundleMcp, name) && !Object.hasOwn(enabledConfiguredMcp, name))),
		prepareDataDirsByServer
	};
}
//#endregion
export { toCliBundleMcpServerConfig as i, loadStaticBundleMcpConfig as n, prepareOwnedBundleMcpDataDirs as r, loadMergedBundleMcpConfig as t };
