import { c as isRecord, l as isStringRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { l as pluginCacheRealpathSync, s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { r as resolveActivePluginInstallRoots } from "./install-root-context-DEOzYnOP.mjs";
import { c as normalizeBundlePathList, i as CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH, n as CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH, r as CODEX_BUNDLE_MANIFEST_RELATIVE_PATH, s as mergeBundlePathLists, t as AGENT_BUNDLE_MANIFEST_RELATIVE_PATH } from "./bundle-manifest-n8JdxRJp.mjs";
import { t as encodePluginInstallDirName } from "./install-paths-DnOgVB7K.mjs";
import { t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-ByV7kR1W.mjs";
import { i as resolveBundleJsonOpenFailure, n as loadEnabledBundleConfig, r as readBundleJsonObject } from "./bundle-config-shared-CZ-homIu.mjs";
import path from "node:path";
//#region src/plugins/bundle-mcp.ts
const MANIFEST_PATH_BY_FORMAT = {
	agent: AGENT_BUNDLE_MANIFEST_RELATIVE_PATH,
	claude: CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH,
	codex: CODEX_BUNDLE_MANIFEST_RELATIVE_PATH,
	cursor: CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH
};
const CLAUDE_PLUGIN_ROOT_PLACEHOLDER = "${CLAUDE_PLUGIN_ROOT}";
const AGENT_PLUGIN_ROOT_PLACEHOLDER = "${PLUGIN_ROOT}";
const AGENT_PLUGIN_DATA_PLACEHOLDER = "${PLUGIN_DATA}";
const AGENT_MCP_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json";
const BUNDLE_PLACEHOLDER_PATTERN = /\$\{(?:CLAUDE_PLUGIN_ROOT|PLUGIN_ROOT|PLUGIN_DATA)\}/g;
const AGENT_MCP_TOP_LEVEL_KEYS = /* @__PURE__ */ new Set(["$schema", "mcpServers"]);
const AGENT_STDIO_KEYS = /* @__PURE__ */ new Set([
	"type",
	"command",
	"args",
	"env",
	"cwd"
]);
const AGENT_HTTP_KEYS = /* @__PURE__ */ new Set([
	"type",
	"url",
	"headers"
]);
function resolveBundleMcpConfigPaths(params) {
	if (params.bundleFormat === "agent") return pluginCacheExistsSync(path.join(params.rootDir, "mcp.json")) ? ["mcp.json"] : [];
	const declared = normalizeBundlePathList(params.raw.mcpServers);
	const defaults = pluginCacheExistsSync(path.join(params.rootDir, ".mcp.json")) ? [".mcp.json"] : [];
	return mergeBundlePathLists(defaults, declared);
}
function extractMcpServerMap(raw) {
	if (!isRecord(raw)) return {};
	const nested = isRecord(raw.mcpServers) ? raw.mcpServers : isRecord(raw.servers) ? raw.servers : raw;
	if (!isRecord(nested)) return {};
	const result = {};
	for (const [serverName, serverRaw] of Object.entries(nested)) {
		if (!isRecord(serverRaw)) continue;
		result[serverName] = { ...serverRaw };
	}
	return result;
}
function isExplicitRelativePath(value) {
	return value === "." || value === ".." || value.startsWith("./") || value.startsWith("../");
}
function expandBundleRootPlaceholders(params) {
	return params.value.replace(BUNDLE_PLACEHOLDER_PATTERN, (placeholder) => {
		if (placeholder === CLAUDE_PLUGIN_ROOT_PLACEHOLDER || placeholder === AGENT_PLUGIN_ROOT_PLACEHOLDER && params.pluginDataDir) return params.rootDir;
		return params.pluginDataDir ?? placeholder;
	});
}
function normalizeBundlePath(targetPath) {
	return path.normalize(path.resolve(targetPath));
}
function normalizeExpandedAbsolutePath(value) {
	return path.isAbsolute(value) ? path.normalize(value) : value;
}
function absolutizeBundleMcpServer(params) {
	const next = { ...params.server };
	if (typeof next.cwd !== "string" && typeof next.workingDirectory !== "string" && (!params.agentFormat || typeof next.command === "string")) next.cwd = params.baseDir;
	const command = next.command;
	if (typeof command === "string") {
		const expanded = expandBundleRootPlaceholders({
			value: command,
			rootDir: params.rootDir,
			pluginDataDir: params.pluginDataDir
		});
		next.command = isExplicitRelativePath(expanded) ? path.resolve(params.baseDir, expanded) : normalizeExpandedAbsolutePath(expanded);
	}
	const cwd = next.cwd;
	if (typeof cwd === "string") {
		const expanded = expandBundleRootPlaceholders({
			value: cwd,
			rootDir: params.rootDir,
			pluginDataDir: params.pluginDataDir
		});
		next.cwd = path.isAbsolute(expanded) ? expanded : path.resolve(params.baseDir, expanded);
	}
	const workingDirectory = next.workingDirectory;
	if (typeof workingDirectory === "string") {
		const expanded = expandBundleRootPlaceholders({
			value: workingDirectory,
			rootDir: params.rootDir,
			pluginDataDir: params.pluginDataDir
		});
		next.workingDirectory = path.isAbsolute(expanded) ? path.normalize(expanded) : path.resolve(params.baseDir, expanded);
	}
	if (Array.isArray(next.args)) next.args = next.args.map((entry) => {
		if (typeof entry !== "string") return entry;
		const expanded = expandBundleRootPlaceholders({
			value: entry,
			rootDir: params.rootDir,
			pluginDataDir: params.pluginDataDir
		});
		if (!isExplicitRelativePath(expanded)) return normalizeExpandedAbsolutePath(expanded);
		return path.resolve(params.baseDir, expanded);
	});
	if (isRecord(next.env)) next.env = Object.fromEntries(Object.entries(next.env).map(([key, value]) => [key, typeof value === "string" ? normalizeExpandedAbsolutePath(expandBundleRootPlaceholders({
		value,
		rootDir: params.rootDir,
		pluginDataDir: params.pluginDataDir
	})) : value]));
	if (params.pluginDataDir && typeof next.command === "string") next.env = {
		...isRecord(next.env) ? next.env : {},
		PLUGIN_ROOT: params.rootDir,
		PLUGIN_DATA: params.pluginDataDir
	};
	return next;
}
function hasOnlyKeys(raw, allowed) {
	return Object.keys(raw).every((key) => allowed.has(key));
}
function isValidAgentCommand(command, rootDir) {
	if (typeof command !== "string" || command.length === 0) return false;
	if (command.startsWith("./")) return command.length > 2 && isPathInside(rootDir, path.resolve(rootDir, command));
	return !/[\s/\\]/.test(command);
}
function isValidAgentCwd(cwd, rootDir, pluginDataDir) {
	if (typeof cwd !== "string") return false;
	let baseDir;
	if (cwd.startsWith("./")) baseDir = rootDir;
	else if (cwd === AGENT_PLUGIN_ROOT_PLACEHOLDER || cwd.startsWith(`${AGENT_PLUGIN_ROOT_PLACEHOLDER}/`)) baseDir = rootDir;
	else if (cwd === AGENT_PLUGIN_DATA_PLACEHOLDER || cwd.startsWith(`${AGENT_PLUGIN_DATA_PLACEHOLDER}/`)) baseDir = pluginDataDir;
	else return false;
	const expanded = expandBundleRootPlaceholders({
		value: cwd,
		rootDir,
		pluginDataDir
	});
	return isPathInside(baseDir, path.resolve(baseDir, expanded));
}
function validateAgentMcpServer(params) {
	if (!isRecord(params.raw) || typeof params.raw.type !== "string") return {
		ok: false,
		error: "configuration must be an object with a supported type"
	};
	const type = params.raw.type;
	if (type === "stdio") {
		if (!hasOnlyKeys(params.raw, AGENT_STDIO_KEYS)) return {
			ok: false,
			error: "stdio configuration contains unknown fields"
		};
		if (!isValidAgentCommand(params.raw.command, params.rootDir)) return {
			ok: false,
			error: "stdio command must be a bare name or ./-relative path"
		};
		if (params.raw.args !== void 0 && (!Array.isArray(params.raw.args) || !params.raw.args.every((entry) => typeof entry === "string"))) return {
			ok: false,
			error: "stdio args must be an array of strings"
		};
		if (params.raw.env !== void 0 && !isStringRecord(params.raw.env)) return {
			ok: false,
			error: "stdio env must contain only string values"
		};
		if (isRecord(params.raw.env) && (Object.hasOwn(params.raw.env, "PLUGIN_ROOT") || Object.hasOwn(params.raw.env, "PLUGIN_DATA"))) return {
			ok: false,
			error: "stdio env must not define PLUGIN_ROOT or PLUGIN_DATA"
		};
		if (params.raw.cwd !== void 0 && !isValidAgentCwd(params.raw.cwd, params.rootDir, params.pluginDataDir)) return {
			ok: false,
			error: "stdio cwd must remain within PLUGIN_ROOT or PLUGIN_DATA"
		};
	} else if (type === "streamable-http" || type === "sse") {
		if (!hasOnlyKeys(params.raw, AGENT_HTTP_KEYS)) return {
			ok: false,
			error: `${type} configuration contains unknown fields`
		};
		if (typeof params.raw.url !== "string" || params.raw.url.length === 0) return {
			ok: false,
			error: `${type} url must be a non-empty string`
		};
		if (params.raw.headers !== void 0 && !isStringRecord(params.raw.headers)) return {
			ok: false,
			error: `${type} headers must contain only string values`
		};
	} else return {
		ok: false,
		error: `unsupported type: ${type}`
	};
	const server = {
		...params.raw,
		transport: type
	};
	delete server.type;
	return {
		ok: true,
		server
	};
}
function resolveAgentPluginDataDir(pluginId) {
	return path.join(resolveActivePluginInstallRoots().stateDir, "plugin-data", encodePluginInstallDirName(pluginId));
}
function extractAgentMcpServerMap(params) {
	if (params.raw.$schema !== AGENT_MCP_SCHEMA || !hasOnlyKeys(params.raw, AGENT_MCP_TOP_LEVEL_KEYS) || !isRecord(params.raw.mcpServers)) return {
		servers: {},
		diagnostics: [`invalid mcp.json: expected only $schema=${AGENT_MCP_SCHEMA} and object mcpServers`]
	};
	const pluginDataDir = resolveAgentPluginDataDir(params.pluginId);
	const servers = {};
	const diagnostics = [];
	for (const [serverName, raw] of Object.entries(params.raw.mcpServers)) {
		const validated = validateAgentMcpServer({
			raw,
			rootDir: params.rootDir,
			pluginDataDir
		});
		if (!validated.ok) {
			diagnostics.push(`invalid MCP server "${serverName}" in mcp.json: ${validated.error}`);
			continue;
		}
		servers[serverName] = validated.server;
	}
	if (!Object.values(servers).some((server) => server.transport === "stdio")) return {
		servers,
		diagnostics
	};
	return {
		servers,
		diagnostics,
		pluginDataDir
	};
}
function loadBundleFileBackedMcpConfig(params) {
	const rootDir = params.bundleFormat === "agent" ? pluginCacheRealpathSync(params.rootDir) : normalizeBundlePath(params.rootDir);
	const absolutePath = path.resolve(rootDir, params.relativePath);
	const result = readBundleJsonObject({
		rootDir,
		relativePath: params.relativePath,
		onOpenFailure: (failure) => resolveBundleJsonOpenFailure({
			failure,
			relativePath: params.relativePath,
			allowMissing: params.bundleFormat !== "agent"
		})
	});
	if (!result.ok) return {
		config: {
			mcpServers: {},
			prepareDataDirsByServer: {}
		},
		diagnostics: [result.reason === "open" ? result.error : `unable to read ${params.relativePath}: ${result.error}`]
	};
	const agentLoaded = params.bundleFormat === "agent" ? extractAgentMcpServerMap({
		raw: result.raw,
		pluginId: params.pluginId,
		rootDir
	}) : void 0;
	const servers = agentLoaded?.servers ?? extractMcpServerMap(result.raw);
	const baseDir = normalizeBundlePath(path.dirname(absolutePath));
	return {
		config: {
			mcpServers: Object.fromEntries(Object.entries(servers).map(([serverName, server]) => [serverName, absolutizeBundleMcpServer({
				rootDir,
				baseDir,
				server,
				pluginDataDir: agentLoaded?.pluginDataDir,
				agentFormat: params.bundleFormat === "agent"
			})])),
			prepareDataDirsByServer: Object.fromEntries(Object.entries(servers).map(([serverName, server]) => [serverName, agentLoaded?.pluginDataDir && server.transport === "stdio" ? {
				pluginId: params.pluginId,
				dataDir: agentLoaded.pluginDataDir
			} : null]))
		},
		diagnostics: agentLoaded?.diagnostics ?? []
	};
}
function loadRootRelativeMcpConfig(params) {
	const rootDir = normalizeBundlePath(params.rootDir);
	return {
		config: {
			mcpServers: Object.fromEntries(Object.entries(params.mcpServers).map(([serverName, server]) => [serverName, absolutizeBundleMcpServer({
				rootDir,
				baseDir: rootDir,
				server
			})])),
			prepareDataDirsByServer: Object.fromEntries(Object.keys(params.mcpServers).map((serverName) => [serverName, null]))
		},
		diagnostics: []
	};
}
function loadBundleMcpConfig(params) {
	const manifestRelativePath = MANIFEST_PATH_BY_FORMAT[params.bundleFormat];
	const manifestLoaded = readBundleJsonObject({
		rootDir: params.rootDir,
		relativePath: manifestRelativePath,
		onOpenFailure: (failure) => resolveBundleJsonOpenFailure({
			failure,
			relativePath: manifestRelativePath,
			allowMissing: params.bundleFormat === "claude"
		})
	});
	if (!manifestLoaded.ok) return {
		config: {
			mcpServers: {},
			prepareDataDirsByServer: {}
		},
		diagnostics: [manifestLoaded.error]
	};
	let merged = {
		mcpServers: {},
		prepareDataDirsByServer: {}
	};
	const filePaths = resolveBundleMcpConfigPaths({
		raw: manifestLoaded.raw,
		rootDir: params.rootDir,
		bundleFormat: params.bundleFormat
	});
	const diagnostics = [];
	for (const relativePath of filePaths) {
		const loaded = loadBundleFileBackedMcpConfig({
			pluginId: params.pluginId,
			rootDir: params.rootDir,
			relativePath,
			bundleFormat: params.bundleFormat
		});
		diagnostics.push(...loaded.diagnostics);
		merged = applyMergePatch(merged, loaded.config);
	}
	if (params.bundleFormat !== "agent") merged = applyMergePatch(merged, loadRootRelativeMcpConfig({
		rootDir: params.rootDir,
		mcpServers: extractMcpServerMap(manifestLoaded.raw.mcpServers)
	}).config);
	return {
		config: merged,
		diagnostics
	};
}
function inspectBundleMcpRuntimeSupport(params) {
	return inspectMcpServerRuntimeSupport(loadBundleMcpConfig(params));
}
function inspectNativePluginMcpRuntimeSupport(params) {
	return inspectMcpServerRuntimeSupport(loadRootRelativeMcpConfig(params));
}
function inspectMcpServerRuntimeSupport(loaded) {
	const supportedServerNames = [];
	const stdioServerNames = [];
	const unsupportedServerNames = [];
	for (const [serverName, server] of Object.entries(loaded.config.mcpServers)) {
		const transport = resolveMcpTransportConfig(serverName, server, { logWarnings: false });
		if (transport?.kind === "stdio") {
			supportedServerNames.push(serverName);
			stdioServerNames.push(serverName);
			continue;
		}
		if (transport?.kind === "http") {
			supportedServerNames.push(serverName);
			continue;
		}
		unsupportedServerNames.push(serverName);
	}
	return {
		hasSupportedStdioServer: stdioServerNames.length > 0,
		supportedServerNames,
		stdioServerNames,
		unsupportedServerNames,
		diagnostics: loaded.diagnostics
	};
}
function loadEnabledBundleMcpConfig(params) {
	const loaded = loadEnabledBundleConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		createEmptyConfig: () => ({
			mcpServers: {},
			prepareDataDirsByServer: {}
		}),
		loadBundleConfig: loadBundleMcpConfig,
		loadNativePluginConfig: ({ record }) => record.mcpServers ? loadRootRelativeMcpConfig({
			rootDir: record.rootDir,
			mcpServers: record.mcpServers
		}) : void 0,
		createDiagnostic: (pluginId, message) => ({
			pluginId,
			message
		})
	});
	return {
		config: { mcpServers: loaded.config.mcpServers },
		diagnostics: loaded.diagnostics,
		prepareDataDirsByServer: Object.fromEntries(Object.entries(loaded.config.prepareDataDirsByServer).filter((entry) => entry[1] !== null))
	};
}
//#endregion
export { loadEnabledBundleMcpConfig as i, inspectBundleMcpRuntimeSupport as n, inspectNativePluginMcpRuntimeSupport as r, extractMcpServerMap as t };
