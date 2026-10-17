import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord, s as filterStringRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-DQmvZkAl.mjs";
import { i as resolveProjectedMcpCodexToolApprovalMode } from "./mcp-codex-tool-approval-DQZI_si1.mjs";
import { i as loadEnabledBundleMcpConfig } from "./bundle-mcp-B0gcrw-D.mjs";
import { a as partitionMcpServersByConnectionScope } from "./mcp-connection-resolver-PVt0mIew.mjs";
import { r as prepareOwnedBundleMcpDataDirs } from "./bundle-mcp-config-DT5qX6XV.mjs";
import { a as shouldCreateBundleMcpRuntimeForAttempt } from "./attempt-tool-construction-plan-7h3_PwTS.mjs";
import { t as loadMcpToolGrants } from "./exec-approvals-mcp-D6hZUAyq.mjs";
import { n as normalizeBundleMcpServerConfig, t as decodeHeaderEnvPlaceholder } from "./bundle-mcp-adapter-DfH5O5-o.mjs";
import crypto from "node:crypto";
//#region src/agents/codex-mcp-config.ts
/**
* Projects enabled bundle MCP servers into Codex app-server thread config.
* The projection keeps loopback approval defaults and header env placeholders
* compatible with Codex's MCP config shape.
*/
function assertCodexExactToolFilters(serverName, fieldName, patterns) {
	const wildcard = patterns.find((pattern) => pattern.includes("*"));
	if (!wildcard) return;
	throw new Error(`Cannot project mcp.servers.${serverName}.toolFilter.${fieldName} pattern "${wildcard}" into Codex ${fieldName === "include" ? "enabled_tools" : "disabled_tools"}: Codex MCP projection only supports exact tool names.`);
}
function applyCodexToolFilter(next, name, server) {
	if (!isRecord(server.toolFilter)) return;
	const include = normalizeTrimmedStringList(server.toolFilter.include);
	const exclude = normalizeTrimmedStringList(server.toolFilter.exclude);
	assertCodexExactToolFilters(name, "include", include);
	assertCodexExactToolFilters(name, "exclude", exclude);
	if (include.length > 0) next.enabled_tools = include;
	if (exclude.length > 0) next.disabled_tools = exclude;
}
/** Adds exact session denials to a server's configured filter before Codex projection. */
function applyCodexSessionMcpToolDenials(name, server, toolOverrides) {
	const denialMap = toolOverrides?.mcpToolsDeny;
	const denied = denialMap && Object.hasOwn(denialMap, name) ? denialMap[name] : void 0;
	if (!denied?.length) return server;
	const toolFilter = isRecord(server.toolFilter) ? server.toolFilter : {};
	const existing = normalizeTrimmedStringList(toolFilter.exclude);
	return {
		...server,
		toolFilter: {
			...toolFilter,
			exclude: [.../* @__PURE__ */ new Set([...existing, ...denied])].toSorted()
		}
	};
}
/** Normalizes one bundle MCP server into Codex's mcp_servers shape. */
function normalizeCodexMcpServerConfig(name, server, grants = []) {
	const next = normalizeBundleMcpServerConfig(server);
	const connectionTimeoutMs = clampPositiveTimerTimeoutMs(server.connectionTimeoutMs);
	const requestTimeoutMs = clampPositiveTimerTimeoutMs(server.requestTimeoutMs);
	if (connectionTimeoutMs !== void 0) next.startup_timeout_sec = connectionTimeoutMs / 1e3;
	if (requestTimeoutMs !== void 0) next.tool_timeout_sec = requestTimeoutMs / 1e3;
	if (typeof server.supportsParallelToolCalls === "boolean") next.supports_parallel_tool_calls = server.supportsParallelToolCalls;
	applyCodexToolFilter(next, name, server);
	const defaultToolsApprovalMode = resolveProjectedMcpCodexToolApprovalMode(name, server);
	if (defaultToolsApprovalMode) next.default_tools_approval_mode = defaultToolsApprovalMode;
	if (defaultToolsApprovalMode === void 0 || defaultToolsApprovalMode === "auto") {
		const tools = grants.filter((grant) => grant.server === name).map((grant) => [grant.tool, { approval_mode: "approve" }]).toSorted(([left], [right]) => left.localeCompare(right));
		if (tools.length > 0) next.tools = Object.fromEntries(tools);
	}
	const httpHeaders = filterStringRecord(server.headers);
	if (httpHeaders) {
		const staticHeaders = {};
		const envHeaders = {};
		for (const [nameLocal, value] of Object.entries(httpHeaders)) {
			const decoded = decodeHeaderEnvPlaceholder(value);
			if (!decoded) {
				staticHeaders[nameLocal] = value;
				continue;
			}
			if (decoded.bearer && normalizeOptionalLowercaseString(nameLocal) === "authorization") {
				next.bearer_token_env_var = decoded.envVar;
				continue;
			}
			envHeaders[nameLocal] = decoded.envVar;
		}
		if (Object.keys(staticHeaders).length > 0) next.http_headers = staticHeaders;
		if (Object.keys(envHeaders).length > 0) next.env_http_headers = envHeaders;
	}
	return next;
}
/**
* Build Codex `mcp_servers` config from normalized bundle MCP config.
* Requester-scoped servers are excluded: harness-native MCP clients are
* session-shared and must never dial placeholder or requester-bound URLs.
*/
function buildCodexMcpServersConfig(config, grants = []) {
	const { staticServers } = partitionMcpServersByConnectionScope(config.mcpServers);
	return Object.fromEntries(Object.entries(staticServers).map(([name, server]) => [name, normalizeCodexMcpServerConfig(name, server, grants)]));
}
/** Side questions need bundle policy without provisioning transports or plugin data directories. */
function loadCodexBundleMcpApprovalConfig(params) {
	const { config } = loadEnabledBundleMcpConfig(params);
	const configuredMcp = normalizeConfiguredMcpServers(params.cfg?.mcp?.servers);
	const selected = selectCodexBundleMcpConfig({ mcpServers: {
		...config.mcpServers,
		...configuredMcp
	} }, configuredMcp, params.toolOverrides);
	const { staticServers } = partitionMcpServersByConnectionScope(selected.mcpServers);
	return Object.fromEntries(Object.keys(staticServers).map((name) => [name, { default_tools_approval_mode: resolveProjectedMcpCodexToolApprovalMode(name, configuredMcp[name] ?? {}) ?? resolveProjectedMcpCodexToolApprovalMode(name, config.mcpServers[name] ?? {}) }]));
}
function selectCodexBundleMcpConfig(config, configuredMcp, toolOverrides) {
	const serverOverrides = toolOverrides?.mcpServers;
	return { mcpServers: Object.fromEntries(Object.entries(config.mcpServers).filter(([name]) => {
		const override = serverOverrides && Object.hasOwn(serverOverrides, name) ? serverOverrides[name] : void 0;
		return override !== false && (override === true || configuredMcp[name]?.enabled !== false);
	}).map(([name, server]) => [name, applyCodexSessionMcpToolDenials(name, server, toolOverrides)])) };
}
function stableJsonValue(value) {
	if (Array.isArray(value)) return value.map(stableJsonValue);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, child]) => [key, stableJsonValue(child)]));
}
function fingerprintCodexMcpServersConfig(config) {
	return crypto.createHash("sha256").update(JSON.stringify(stableJsonValue(config))).digest("hex");
}
/** Load bundle MCP config for one Codex app-server thread. */
async function loadCodexBundleMcpThreadConfigCore(params) {
	if (!shouldCreateBundleMcpRuntimeForAttempt({
		toolsEnabled: params.toolsEnabled ?? true,
		disableTools: params.disableTools,
		toolsAllow: params.toolsAllow
	})) return {
		diagnostics: [],
		evaluated: true,
		staticServerNames: [],
		userStaticServerNames: []
	};
	const bundleMcp = loadEnabledBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry
	});
	const configuredMcp = normalizeConfiguredMcpServers(params.cfg?.mcp?.servers);
	const serverOverrides = params.toolOverrides?.mcpServers;
	const effectiveConfig = selectCodexBundleMcpConfig(bundleMcp.config, configuredMcp, params.toolOverrides);
	const enabledConfiguredMcp = Object.fromEntries(Object.entries(configuredMcp).filter(([name, server]) => {
		const override = serverOverrides && Object.hasOwn(serverOverrides, name) ? serverOverrides[name] : void 0;
		return override !== false && (override === true || server.enabled !== false);
	}));
	const { staticServers: configuredStaticServers } = partitionMcpServersByConnectionScope({
		...effectiveConfig.mcpServers,
		...enabledConfiguredMcp
	});
	const { staticServers: userStaticServers } = partitionMcpServersByConnectionScope(enabledConfiguredMcp);
	const staticServerNames = Object.keys(configuredStaticServers).toSorted((left, right) => left.localeCompare(right));
	const userStaticServerNames = Object.keys(userStaticServers).toSorted((left, right) => left.localeCompare(right));
	if (params.preparationOnly && Object.keys(bundleMcp.prepareDataDirsByServer ?? {}).length) throw new Error("Native fork preparation cannot provision plugin data directories. Complete plugin setup before retrying.");
	const preparedDataDirs = prepareOwnedBundleMcpDataDirs({
		config: effectiveConfig,
		prepareDataDirsByServer: bundleMcp.prepareDataDirsByServer ?? {}
	});
	const diagnostics = [...bundleMcp.diagnostics, ...preparedDataDirs.diagnostics];
	const configuredGrants = (params.agentId ? await loadMcpToolGrants(params.agentId) : []).filter((grant) => {
		const server = Object.hasOwn(configuredMcp, grant.server) ? configuredMcp[grant.server] : void 0;
		if (!server) return false;
		const mode = resolveProjectedMcpCodexToolApprovalMode(grant.server, server);
		return mode === void 0 || mode === "auto";
	});
	const mcpServers = buildCodexMcpServersConfig(preparedDataDirs.config, configuredGrants);
	if (Object.keys(mcpServers).length === 0) return {
		diagnostics,
		evaluated: true,
		staticServerNames,
		userStaticServerNames
	};
	return {
		configPatch: { mcp_servers: mcpServers },
		diagnostics,
		evaluated: true,
		fingerprint: fingerprintCodexMcpServersConfig(mcpServers),
		staticServerNames,
		userStaticServerNames
	};
}
//#endregion
export { normalizeCodexMcpServerConfig as a, loadCodexBundleMcpThreadConfigCore as i, buildCodexMcpServersConfig as n, loadCodexBundleMcpApprovalConfig as r, applyCodexSessionMcpToolDenials as t };
