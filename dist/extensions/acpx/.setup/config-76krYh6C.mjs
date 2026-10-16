import { createRequire } from "node:module";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatPluginConfigIssue } from "openclaw/plugin-sdk/extension-shared";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
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
//#region extensions/acpx/src/codex-adapter.ts
const CODEX_ACP_PACKAGE = "@agentclientprotocol/codex-acp";
const CODEX_ACP_BIN = "codex-acp";
const LEGACY_CODEX_ACP_PACKAGE = "@zed-industries/codex-acp";
const OPENCLAW_CODEX_CONFIG_ARG = "--openclaw-codex-config";
//#endregion
//#region extensions/acpx/src/command-line.ts
/** Match ACPX's persisted argv identity; scalar records keep their original bytes. */
function renderAgentCommand(command) {
	return typeof command === "string" ? command : command.map((part) => /^[A-Za-z0-9_@%+=:,./^~-]+$/.test(part) ? part : JSON.stringify(part)).join(" ");
}
/** Split a command string into argv-like parts using simple quote/backslash rules. */
function splitCommandParts(value) {
	if (Array.isArray(value)) return value;
	const windows = process.platform === "win32";
	const parts = [];
	let current = "";
	let quote = null;
	let escaping = false;
	let hasPart = false;
	for (const ch of value) {
		if (escaping) {
			current += ch;
			escaping = false;
			hasPart = true;
			continue;
		}
		if (ch === "\\" && quote !== "'" && !windows) {
			escaping = true;
			hasPart = true;
			continue;
		}
		if (windows && ch === "\"" && quote !== "'") {
			const backslashes = current.match(/\\+$/)?.[0].length ?? 0;
			current = current.slice(0, current.length - backslashes) + "\\".repeat(Math.floor(backslashes / 2));
			if (backslashes % 2 === 1) {
				current += "\"";
				continue;
			}
		}
		if (quote) {
			if (ch === quote) quote = null;
			else current += ch;
			continue;
		}
		if (ch === "'" || ch === "\"") {
			quote = ch;
			hasPart = true;
			continue;
		}
		if (/\s/.test(ch)) {
			if (hasPart) {
				parts.push(current);
				current = "";
				hasPart = false;
			}
			continue;
		}
		current += ch;
		hasPart = true;
	}
	if (escaping) current += "\\";
	if (quote) throw new Error("Invalid agent command: unterminated quote");
	if (hasPart) parts.push(current);
	return parts;
}
function basename(value) {
	return value.split(/[\\/]/).pop() ?? value;
}
function isEnvAssignment(value) {
	return /^[A-Za-z_][A-Za-z0-9_]*=/.test(value);
}
function unwrapEnvCommand(parts) {
	const command = parts.at(0);
	if (!command || basename(command) !== "env") return parts;
	let index = 1;
	while (true) {
		const part = parts.at(index);
		if (!part || !isEnvAssignment(part)) break;
		index += 1;
	}
	return parts.slice(index);
}
function matchesExecutableName(value, executableName) {
	const normalized = basename(value).toLowerCase();
	return normalized === executableName || normalized === `${executableName}.exe`;
}
function matchesPackageSpec(value, packageName) {
	const normalized = value.trim().toLowerCase();
	return normalized === packageName || normalized.startsWith(`${packageName}@`);
}
function stripModuleExtension(value) {
	return value.replace(/\.[cm]?js$/i, "").toLowerCase();
}
function isAcpCommand(command, params) {
	if (!command) return false;
	const parts = unwrapEnvCommand(splitCommandParts(command));
	if (!parts.length) return false;
	if (parts.some((part) => matchesPackageSpec(part, params.packageName))) return true;
	const commandName = basename(parts[0] ?? "");
	if (matchesExecutableName(commandName, params.executableName)) return true;
	if (!matchesExecutableName(commandName, "node")) return false;
	const scriptName = stripModuleExtension(basename(parts[1] ?? ""));
	return scriptName === params.executableName || scriptName === `${params.executableName}-wrapper`;
}
function isOpenClawBridgeCommand(command) {
	const [executable = "", ...args] = command ? unwrapEnvCommand(splitCommandParts(command)) : [];
	const runtime = basename(executable) !== "openclaw" && (executable === process.execPath || /^(?:node|bun)(?:\.exe)?$/i.test(basename(executable)));
	const scriptName = basename(runtime ? args[0] ?? "" : executable);
	return (runtime ? /^openclaw(?:\.[cm]?js)?$/i.test(scriptName) : scriptName === "openclaw") && args[runtime ? 1 : 0] === "acp";
}
function isCodexAcpCommand(command) {
	return isAcpCommand(command, {
		packageName: CODEX_ACP_PACKAGE,
		executableName: "codex-acp"
	});
}
function isClaudeAcpCommand(command) {
	return isAcpCommand(command, {
		packageName: "@agentclientprotocol/claude-agent-acp",
		executableName: "claude-agent-acp"
	});
}
function resolveAgentCommand(params) {
	const normalizedAgentName = normalizeOptionalLowercaseString(params.agentName);
	if (!normalizedAgentName) return;
	return splitCommandParts(params.agentRegistry.resolve(normalizedAgentName));
}
//#endregion
//#region extensions/acpx/src/config.ts
const MANAGED_MCP_BRIDGES = [[
	"pluginToolsMcpBridge",
	"openclaw-plugin-tools",
	"plugin-tools-serve"
], [
	"openClawToolsMcpBridge",
	"openclaw-tools",
	"openclaw-tools-serve"
]];
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
	for (const [flag, name] of MANAGED_MCP_BRIDGES) if (params[flag] && resolved[name]) throw new Error(`mcpServers.${name} is reserved when ${flag}=true`);
	for (const [flag, name, entryPoint] of MANAGED_MCP_BRIDGES) if (params[flag]) resolved[name] = resolveManagedToolsMcpServerConfig(entryPoint, params.moduleUrl);
	return resolved;
}
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
function resolveAcpxPluginConfig(params) {
	const { rawConfig } = params;
	const parsed = AcpxPluginConfigSchema.safeParse(rawConfig === void 0 ? {} : rawConfig);
	if (!parsed.success) throw new Error(formatPluginConfigIssue(parsed.error.issues[0]));
	const normalized = parsed.data;
	const workspaceDir = params.workspaceDir?.trim() || process.cwd();
	const cwd = path.resolve(normalized.cwd ?? workspaceDir);
	const stateDir = path.resolve(normalized.stateDir ?? path.join(params.stateDir ?? resolveStateDir(), "acpx"));
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
export { isClaudeAcpCommand as a, renderAgentCommand as c, CODEX_ACP_BIN as d, CODEX_ACP_PACKAGE as f, AcpxNativeAgentsSchema as g, ACPX_NATIVE_AGENT_IDS as h, toAcpMcpServers as i, resolveAgentCommand as l, OPENCLAW_CODEX_CONFIG_ARG as m, resolveAcpxPluginRoot as n, isCodexAcpCommand as o, LEGACY_CODEX_ACP_PACKAGE as p, resolveOpenClawRoot as r, isOpenClawBridgeCommand as s, resolveAcpxPluginConfig as t, splitCommandParts as u };
