import { s as splitCommandParts } from "./command-line-CPBLOiZM.mjs";
import { createRequire } from "node:module";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatPluginConfigIssue } from "openclaw/plugin-sdk/extension-shared";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/acpx/src/config-schema.ts
/**
* ACPX plugin configuration schema and public config types. Runtime setup uses
* this file as the single source of truth for validation and defaulting.
*/
const ACPX_NATIVE_AGENT_IDS = [
	"opencode",
	"qwen",
	"pi",
	"kilocode",
	"copilot"
];
const AcpxNativeAgentsSchema = z.strictObject({
	opencode: z.boolean().optional(),
	qwen: z.boolean().optional(),
	pi: z.boolean().optional(),
	kilocode: z.boolean().optional(),
	copilot: z.boolean().optional()
}).optional();
const ACPX_PERMISSION_MODES = [
	"approve-all",
	"approve-reads",
	"deny-all"
];
const ACPX_NON_INTERACTIVE_POLICIES = ["deny", "fail"];
const nonEmptyTrimmedString = (message) => z.string({ error: message }).trim().min(1, { error: message });
const McpServerConfigSchema = z.object({
	command: nonEmptyTrimmedString("command must be a non-empty string").describe("Command to run the MCP server"),
	args: z.array(z.string({ error: "args must be an array of strings" }), { error: "args must be an array of strings" }).optional().describe("Arguments to pass to the command"),
	env: z.record(z.string(), z.string({ error: "env values must be strings" }), { error: "env must be an object of strings" }).optional().describe("Environment variables for the MCP server")
});
/** Zod schema for validating raw ACPX plugin config from OpenClaw config. */
const AcpxPluginConfigSchema = z.strictObject({
	nativeAgents: AcpxNativeAgentsSchema,
	cwd: nonEmptyTrimmedString("cwd must be a non-empty string").optional(),
	stateDir: nonEmptyTrimmedString("stateDir must be a non-empty string").optional(),
	probeAgent: nonEmptyTrimmedString("probeAgent must be a non-empty string").optional(),
	permissionMode: z.enum(ACPX_PERMISSION_MODES, { error: `permissionMode must be one of: ${ACPX_PERMISSION_MODES.join(", ")}` }).optional(),
	nonInteractivePermissions: z.enum(ACPX_NON_INTERACTIVE_POLICIES, { error: `nonInteractivePermissions must be one of: ${ACPX_NON_INTERACTIVE_POLICIES.join(", ")}` }).optional(),
	pluginToolsMcpBridge: z.boolean({ error: "pluginToolsMcpBridge must be a boolean" }).optional(),
	openClawToolsMcpBridge: z.boolean({ error: "openClawToolsMcpBridge must be a boolean" }).optional(),
	timeoutSeconds: z.number({ error: "timeoutSeconds must be a number >= 0.001" }).min(.001, { error: "timeoutSeconds must be a number >= 0.001" }).default(120),
	piSessionCatalog: z.strictObject({ enabled: z.boolean({ error: "piSessionCatalog.enabled must be a boolean" }).default(true) }).optional(),
	mcpServers: z.record(z.string(), McpServerConfigSchema).optional(),
	agents: z.record(z.string(), z.strictObject({
		command: nonEmptyTrimmedString("agents.<id>.command must be a non-empty string"),
		args: z.array(z.string({ error: "args must be an array of strings" })).optional()
	})).optional()
});
//#endregion
//#region extensions/acpx/src/config.ts
/**
* Resolves ACPX plugin config from raw user configuration. It locates the
* plugin root, injects optional MCP bridge servers, and applies runtime defaults.
*/
const ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME = "openclaw-plugin-tools";
const ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME = "openclaw-tools";
const requireFromHere = createRequire(import.meta.url);
function isAcpxPluginRoot(dir) {
	return fs.existsSync(path.join(dir, "openclaw.plugin.json")) && fs.existsSync(path.join(dir, "package.json"));
}
function resolveNearestAcpxPluginRoot(moduleUrl) {
	let cursor = path.dirname(fileURLToPath(moduleUrl));
	for (let i = 0; i < 3; i += 1) {
		if (isAcpxPluginRoot(cursor)) return cursor;
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	return path.resolve(path.dirname(fileURLToPath(moduleUrl)), "..");
}
function resolveWorkspaceAcpxPluginRoot(currentRoot) {
	if (path.basename(currentRoot) !== "acpx" || path.basename(path.dirname(currentRoot)) !== "extensions" || path.basename(path.dirname(path.dirname(currentRoot))) !== "dist") return null;
	const workspaceRoot = path.resolve(currentRoot, "..", "..", "..", "extensions", "acpx");
	return isAcpxPluginRoot(workspaceRoot) ? workspaceRoot : null;
}
function resolveRepoAcpxPluginRoot(currentRoot) {
	const workspaceRoot = path.join(currentRoot, "extensions", "acpx");
	return isAcpxPluginRoot(workspaceRoot) ? workspaceRoot : null;
}
function resolveAcpxPluginRootFromOpenClawLayout(moduleUrl) {
	let cursor = path.dirname(fileURLToPath(moduleUrl));
	for (let i = 0; i < 5; i += 1) {
		const candidates = [
			path.join(cursor, "extensions", "acpx"),
			path.join(cursor, "dist", "extensions", "acpx"),
			path.join(cursor, "dist-runtime", "extensions", "acpx")
		];
		for (const candidate of candidates) if (isAcpxPluginRoot(candidate)) return candidate;
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	return null;
}
/** Resolve the ACPX plugin root across source, dist, and dist-runtime layouts. */
function resolveAcpxPluginRoot(moduleUrl = import.meta.url) {
	const resolvedRoot = resolveNearestAcpxPluginRoot(moduleUrl);
	return resolveWorkspaceAcpxPluginRoot(resolvedRoot) ?? resolveRepoAcpxPluginRoot(resolvedRoot) ?? resolveAcpxPluginRootFromOpenClawLayout(moduleUrl) ?? resolvedRoot;
}
const DEFAULT_PERMISSION_MODE = "approve-reads";
const DEFAULT_NON_INTERACTIVE_POLICY = "fail";
function resolveOpenClawRoot(currentRoot) {
	if (path.basename(currentRoot) === "acpx" && path.basename(path.dirname(currentRoot)) === "extensions") {
		const parent = path.dirname(path.dirname(currentRoot));
		if (path.basename(parent) === "dist") return path.dirname(parent);
		return parent;
	}
	return path.resolve(currentRoot, "..");
}
function resolveTsxImportSpecifier() {
	try {
		return requireFromHere.resolve("tsx");
	} catch {
		return "tsx";
	}
}
function resolveManagedToolsMcpServerConfig(entryPoint, moduleUrl = import.meta.url) {
	const openClawRoot = resolveOpenClawRoot(resolveAcpxPluginRoot(moduleUrl));
	const distEntry = path.join(openClawRoot, "dist", "mcp", `${entryPoint}.js`);
	if (fs.existsSync(distEntry)) return {
		command: process.execPath,
		args: [distEntry]
	};
	const sourceEntry = path.join(openClawRoot, "src", "mcp", `${entryPoint}.ts`);
	return {
		command: process.execPath,
		args: [
			"--import",
			resolveTsxImportSpecifier(),
			sourceEntry
		]
	};
}
function resolveConfiguredMcpServers(params) {
	const resolved = { ...params.mcpServers };
	if (params.pluginToolsMcpBridge && resolved[ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME]) throw new Error(`mcpServers.${ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME} is reserved when pluginToolsMcpBridge=true`);
	if (params.openClawToolsMcpBridge && resolved[ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME]) throw new Error(`mcpServers.${ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME} is reserved when openClawToolsMcpBridge=true`);
	if (params.pluginToolsMcpBridge) resolved[ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME] = resolveManagedToolsMcpServerConfig("plugin-tools-serve", params.moduleUrl);
	if (params.openClawToolsMcpBridge) resolved[ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME] = resolveManagedToolsMcpServerConfig("openclaw-tools-serve", params.moduleUrl);
	return resolved;
}
/** Convert OpenClaw MCP server config into ACPX runtime MCP server entries. */
function toAcpMcpServers(mcpServers) {
	return Object.entries(mcpServers).map(([name, server]) => ({
		name,
		command: server.command,
		args: [...server.args ?? []],
		env: Object.entries(server.env ?? {}).map(([envName, value]) => ({
			name: envName,
			value
		}))
	}));
}
/** Validate and normalize raw ACPX plugin config for runtime startup. */
function resolveAcpxPluginConfig(params) {
	const { rawConfig } = params;
	const parsed = AcpxPluginConfigSchema.safeParse(rawConfig === void 0 ? {} : rawConfig);
	if (!parsed.success) throw new Error(formatPluginConfigIssue(parsed.error.issues[0]));
	const normalized = parsed.data;
	const workspaceDir = params.workspaceDir?.trim() || process.cwd();
	const cwd = path.resolve(normalized.cwd?.trim() || workspaceDir);
	const stateDir = path.resolve(normalized.stateDir?.trim() || path.join(workspaceDir, "state"));
	const pluginToolsMcpBridge = normalized.pluginToolsMcpBridge === true;
	const openClawToolsMcpBridge = normalized.openClawToolsMcpBridge === true;
	const mcpServers = resolveConfiguredMcpServers({
		mcpServers: normalized.mcpServers,
		pluginToolsMcpBridge,
		openClawToolsMcpBridge,
		moduleUrl: params.moduleUrl
	});
	const agents = Object.fromEntries(Object.entries(normalized.agents ?? {}).map(([name, entry]) => {
		const cmd = entry.command.trim();
		const command = path.isAbsolute(cmd) && fs.existsSync(cmd) ? [cmd] : splitCommandParts(cmd);
		return [normalizeLowercaseStringOrEmpty(name), [...command, ...entry.args ?? []]];
	}));
	return {
		cwd,
		stateDir,
		probeAgent: normalized.probeAgent,
		permissionMode: normalized.permissionMode ?? DEFAULT_PERMISSION_MODE,
		nonInteractivePermissions: normalized.nonInteractivePermissions ?? DEFAULT_NON_INTERACTIVE_POLICY,
		pluginToolsMcpBridge,
		openClawToolsMcpBridge,
		timeoutSeconds: normalized.timeoutSeconds,
		mcpServers,
		agents
	};
}
//#endregion
export { ACPX_NATIVE_AGENT_IDS as a, toAcpMcpServers as i, resolveAcpxPluginRoot as n, AcpxNativeAgentsSchema as o, resolveOpenClawRoot as r, resolveAcpxPluginConfig as t };
