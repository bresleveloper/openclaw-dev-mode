import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import { i as loadEnabledBundleMcpConfig } from "./bundle-mcp-BCbIrwKD.mjs";
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
* out of the generic merge path because embedded OpenClaw still consumes the raw
* OpenClaw `transport` shape directly.
*/
function toCliBundleMcpServerConfig(server) {
	const next = { ...server };
	const rawTransport = next.transport;
	delete next.transport;
	if (typeof next.type === "string") return next;
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
	const mapConfiguredServer = params.mapConfiguredServer ?? ((server) => server);
	const prepareDataDirsByServer = Object.fromEntries(Object.entries(bundleMcp.prepareDataDirsByServer ?? {}).filter(([name]) => Object.hasOwn(enabledBundleMcp, name) && !Object.hasOwn(enabledConfiguredMcp, name)));
	return {
		config: { mcpServers: {
			...Object.fromEntries(Object.entries(enabledBundleMcp).map(([name, server]) => [name, mapConfiguredServer(server, name)])),
			...Object.fromEntries(Object.entries(enabledConfiguredMcp).map(([name, server]) => [name, mapConfiguredServer(server, name)]))
		} },
		diagnostics: bundleMcp.diagnostics,
		prepareDataDirsByServer
	};
}
//#endregion
export { prepareOwnedBundleMcpDataDirs as n, toCliBundleMcpServerConfig as r, loadMergedBundleMcpConfig as t };
