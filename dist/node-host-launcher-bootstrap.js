import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { parse } from "dotenv";
import "@openclaw/fs-safe/config";
import { readRegularFileSync } from "@openclaw/fs-safe/advanced";
import { compareBuild, parse as parse$1 } from "semver";
import "@openclaw/fs-safe/path";
//#region packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region src/daemon/constants.ts
/** Cross-platform daemon service names, labels, and profile-aware descriptions. */
const GATEWAY_LAUNCH_AGENT_LABEL = "ai.openclaw.gateway";
const GATEWAY_SYSTEMD_SERVICE_NAME = "openclaw-gateway";
const GATEWAY_WINDOWS_TASK_NAME = "OpenClaw Gateway";
const GATEWAY_SERVICE_SELECTOR_ENV_KEYS = [
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_PROFILE",
	"OPENCLAW_GATEWAY_PORT",
	"OPENCLAW_LAUNCHD_LABEL",
	"OPENCLAW_SYSTEMD_UNIT",
	"OPENCLAW_WINDOWS_TASK_NAME"
];
function isGatewayServiceEnv(env) {
	if (env.OPENCLAW_SERVICE_MARKER?.trim() !== "openclaw") return false;
	const serviceKind = env.OPENCLAW_SERVICE_KIND?.trim();
	return !serviceKind || serviceKind === "gateway";
}
function normalizeGatewayProfile(profile) {
	const trimmed = profile?.trim();
	if (!trimmed || normalizeLowercaseStringOrEmpty(trimmed) === "default") return null;
	return trimmed;
}
function resolveGatewayProfileSuffix(profile) {
	const normalized = normalizeGatewayProfile(profile);
	return normalized ? `-${normalized}` : "";
}
function resolveGatewayLaunchAgentLabel(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return GATEWAY_LAUNCH_AGENT_LABEL;
	return `ai.openclaw.${normalized}`;
}
function resolveGatewaySystemdServiceName(profile) {
	const suffix = resolveGatewayProfileSuffix(profile);
	if (!suffix) return GATEWAY_SYSTEMD_SERVICE_NAME;
	return `openclaw-gateway${suffix}`;
}
function resolveGatewayWindowsTaskName(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return GATEWAY_WINDOWS_TASK_NAME;
	return `OpenClaw Gateway (${normalized})`;
}
//#endregion
//#region packages/normalization-core/src/home-dir.ts
function normalizeHomeDirValue(value) {
	const trimmed = value?.trim();
	return trimmed && trimmed !== "undefined" && trimmed !== "null" ? trimmed : void 0;
}
function normalizeSafe(homedir) {
	try {
		return normalizeHomeDirValue(homedir());
	} catch {
		return;
	}
}
function resolveTermuxHome(env) {
	const prefix = normalizeHomeDirValue(env.PREFIX);
	if (!prefix || !normalizeHomeDirValue(env.ANDROID_DATA)) return;
	if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) return;
	return path.resolve(prefix, "..", "home");
}
function resolveRawOsHomeDir(env, homedir) {
	return normalizeHomeDirValue(env.HOME) ?? normalizeHomeDirValue(env.USERPROFILE) ?? resolveTermuxHome(env) ?? normalizeSafe(homedir);
}
function resolveOsHomeDir(env = process.env, homedir = os.homedir) {
	const raw = resolveRawOsHomeDir(env, homedir);
	return raw ? path.resolve(raw) : void 0;
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir, options) {
	const explicitHome = normalizeHomeDirValue(env.OPENCLAW_HOME);
	if (!explicitHome) return resolveOsHomeDir(env, homedir);
	if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) {
		const osHome = resolveRawOsHomeDir(env, homedir);
		if (!osHome) return options?.preserveUnresolvedTilde ? path.resolve(explicitHome) : void 0;
		return path.resolve(explicitHome.replace(/^~(?=$|[\\/])/, () => osHome));
	}
	return path.resolve(explicitHome);
}
//#endregion
//#region src/infra/safe-cwd.ts
function tryProcessCwd() {
	try {
		return process.cwd();
	} catch {
		return;
	}
}
//#endregion
//#region src/infra/home-dir.ts
/** Resolves the effective home or falls back to cwd when no home source exists. */
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory.");
}
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
function expandHomePrefix(input, opts) {
	if (!input.startsWith("~")) return input;
	const home = normalizeHomeDirValue(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
	if (!home) return input;
	return input.replace(/^~(?=$|[\\/])/, () => home);
}
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
function resolveHomeRelativePath(input, opts) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	if (trimmed.startsWith("~")) {
		const expanded = expandHomePrefix(trimmed, {
			home: resolveRequiredHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
			env: opts?.env,
			homedir: opts?.homedir
		});
		return path.resolve(expanded);
	}
	return path.resolve(trimmed);
}
/** Resolves a user path against the effective home, preserving an empty input. */
function resolveUserPath$1(input, env = process.env, homedir = os.homedir) {
	if (!input) return "";
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
//#endregion
//#region src/claws/experimental.ts
const EXPERIMENTAL_CLAWS_ENV = "OPENCLAW_EXPERIMENTAL_CLAWS";
function isExperimentalClawsEnabled(env = process.env) {
	const value = env[EXPERIMENTAL_CLAWS_ENV]?.trim().toLowerCase();
	return value === "1" || value === "true";
}
const ROOT_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["--dev", "--no-color"]);
const ROOT_VALUE_FLAGS = /* @__PURE__ */ new Set([
	"--profile",
	"--log-level",
	"--container"
]);
/** Returns whether a token can be consumed as a root option value. */
function isValueToken(arg) {
	if (!arg || arg === "--") return false;
	if (!arg.startsWith("-")) return true;
	return /^-\d+(?:\.\d+)?$/.test(arg);
}
/** Count root-option tokens conservatively for route matching. */
function consumeRootOptionToken(args, index) {
	const arg = args[index];
	if (!arg) return 0;
	if (ROOT_BOOLEAN_FLAGS.has(arg)) return 1;
	if (arg.startsWith("--profile=") || arg.startsWith("--log-level=") || arg.startsWith("--container=")) return 1;
	if (ROOT_VALUE_FLAGS.has(arg)) return isValueToken(args[index + 1]) ? 2 : 1;
	return 0;
}
/** Consume required root values by their Commander role before startup policy is selected. */
function consumeRootCommandOptionToken(args, index) {
	return consumeKnownOptionToken(args, index, ROOT_BOOLEAN_FLAGS, ROOT_VALUE_FLAGS, "command-path");
}
/** Read positional command tokens while accepting root options at any pre-terminator position. */
function getRootOptionAwareCommandPath(argv, depth) {
	const args = argv.slice(2);
	const path = [];
	let literal = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg) break;
		if (!literal && arg === "--") {
			if (path.length > 0) break;
			literal = true;
			continue;
		}
		const consumed = literal ? 0 : consumeRootCommandOptionToken(args, index);
		if (consumed > 0) {
			index += consumed - 1;
			continue;
		}
		if (!literal && arg.startsWith("-")) continue;
		path.push(arg);
		if (path.length >= depth) break;
	}
	return path;
}
function consumeKnownOptionToken(args, index, booleanFlags, valueFlags, mode) {
	const arg = args[index];
	if (!arg || arg === "--" || !arg.startsWith("-")) return 0;
	const equalsIndex = arg.indexOf("=");
	const flag = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
	if (booleanFlags.has(flag)) return equalsIndex === -1 ? 1 : 0;
	if (!valueFlags.has(flag)) return 0;
	if (equalsIndex !== -1) return mode === "command-path" || arg.slice(equalsIndex + 1).trim() ? 1 : 0;
	if (mode === "command-path") return args[index + 1] !== void 0 ? 2 : 0;
	return isValueToken(args[index + 1]) ? 2 : 0;
}
/** Parse command positionals while consuming known root and command options. */
function getCommandPositionalsWithRootOptions(argv, options) {
	return parseCommandArgsWithRootOptions(argv, options, false);
}
function parseCommandArgsWithRootOptions(argv, options, returnTail) {
	const args = argv.slice(2);
	const booleanFlags = new Set(options.booleanFlags ?? []);
	const valueFlags = new Set(options.valueFlags ?? []);
	const positionals = [];
	let commandIndex = 0;
	let literal = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (arg === void 0) break;
		if (!literal && arg === "--") {
			if (options.mode !== "command-path") break;
			literal = true;
			continue;
		}
		const rootConsumed = literal ? 0 : options.mode === "command-path" ? consumeRootCommandOptionToken(args, index) : consumeRootOptionToken(args, index);
		if (rootConsumed > 0) {
			index += rootConsumed - 1;
			continue;
		}
		if (!literal && arg.startsWith("-")) {
			const optionConsumed = consumeKnownOptionToken(args, index, booleanFlags, valueFlags, options.mode);
			if (optionConsumed === 0 || commandIndex === 0) return null;
			index += optionConsumed - 1;
			continue;
		}
		if (commandIndex < options.commandPath.length) {
			if (arg !== options.commandPath[commandIndex]) return null;
			commandIndex += 1;
			if (returnTail && commandIndex === options.commandPath.length) {
				const tail = args.slice(index + 1);
				return literal ? ["--", ...tail] : tail;
			}
			continue;
		}
		positionals.push(arg);
		if (positionals.length === options.maxPositionals) return positionals;
	}
	return commandIndex < options.commandPath.length ? null : positionals;
}
//#endregion
//#region src/cli/update-option-specs.ts
const UPDATE_OPTION_SPECS = [
	[
		"--json",
		"Output result as JSON",
		false
	],
	["--no-restart", "Skip restarting the gateway service after a successful update"],
	[
		"--dry-run",
		"Preview update actions without making changes",
		false
	],
	["--channel <stable|extended-stable|beta|dev>", "Persist update channel (git + npm)"],
	["--tag <dist-tag|version|spec>", "Override the package target for this update (dist-tag, version, or package spec)"],
	["--timeout <seconds>", "Timeout for each update step in seconds (default: 1800)"],
	[
		"--yes",
		"Skip confirmation prompts (non-interactive)",
		false
	],
	[
		"--reapply-local-overrides",
		"Replay trusted packaged dist edits when the target baseline is unchanged",
		false
	],
	[
		"--accept-capabilities",
		"Accept widened plugin capabilities",
		false
	]
];
//#endregion
//#region src/cli/parent-command-path.ts
const AGENT_PARENT_BOOLEAN_FLAGS = [
	"--local",
	"--deliver",
	"--json"
];
const AGENT_PARENT_VALUE_FLAGS = [
	"-m",
	"--message",
	"--message-file",
	"-t",
	"--to",
	"--session-key",
	"--session-id",
	"--agent",
	"--model",
	"--thinking",
	"--verbose",
	"--channel",
	"--reply-to",
	"--reply-channel",
	"--reply-account",
	"--timeout"
];
const MODELS_PARENT_BOOLEAN_FLAGS = [
	"--json",
	"--status-json",
	"--status-plain"
];
const MODELS_PARENT_VALUE_FLAGS = ["--agent"];
const UPDATE_PARENT_BOOLEAN_FLAGS = UPDATE_OPTION_SPECS.filter(([flags]) => !flags.includes("<")).map(([flags]) => flags);
const UPDATE_PARENT_VALUE_FLAGS = UPDATE_OPTION_SPECS.filter(([flags]) => flags.includes("<")).map(([flags]) => flags.slice(0, flags.indexOf(" ")));
const PARENT_COMMAND_FLAGS = /* @__PURE__ */ new Map([
	["agent", [AGENT_PARENT_BOOLEAN_FLAGS, AGENT_PARENT_VALUE_FLAGS]],
	["models", [MODELS_PARENT_BOOLEAN_FLAGS, MODELS_PARENT_VALUE_FLAGS]],
	["config", [[], ["--section"]]],
	["skills", [["--json"], ["--agent"]]],
	["channels", [[], ["--agent"]]],
	["update", [UPDATE_PARENT_BOOLEAN_FLAGS, UPDATE_PARENT_VALUE_FLAGS]]
]);
/** Resolve the parent commands whose options may precede a child command. */
function resolveCliParentCommandPath(argv, expectedParent) {
	const [command] = getRootOptionAwareCommandPath(argv, 1);
	if (!command || expectedParent && command !== expectedParent) return null;
	const flags = PARENT_COMMAND_FLAGS.get(command);
	if (!flags) return null;
	const [booleanFlags, valueFlags] = flags;
	const child = getCommandPositionalsWithRootOptions(argv, {
		commandPath: [command],
		booleanFlags,
		valueFlags,
		maxPositionals: 1,
		mode: "command-path"
	})?.[0];
	return child ? [command, child] : [command];
}
//#endregion
//#region src/cli/config-output-mode.ts
/** Config values, paths, and schemas reserve stdout for machine-consumed output. */
function isConfigMachineOutput(argv) {
	const subcommand = resolveCliParentCommandPath(argv, "config")?.[1];
	return subcommand === "get" || subcommand === "file" || subcommand === "schema";
}
//#endregion
//#region src/cli/program/commander-parse-facts.ts
function getCommandHierarchy(command) {
	const hierarchy = [];
	for (let current = command; current; current = current.parent ?? null) hierarchy.unshift(current);
	return hierarchy;
}
function requiresFollowingValue(token, options) {
	if (token.includes("=")) return false;
	const exact = options.find((option) => option.short === token || option.long === token);
	if (exact) return exact.required;
	if (!token.startsWith("-") || token.startsWith("--")) return false;
	const shortGroup = token.slice(1);
	for (let index = 0; index < shortGroup.length; index += 1) {
		const option = options.find((candidate) => candidate.short === `-${shortGroup[index]}`);
		if (!option) return false;
		if (option.required || option.optional) return option.required && index === shortGroup.length - 1;
	}
	return false;
}
/** Match an argv token in its actual Commander role rather than its spelling alone. */
function hasCommanderOptionToken(command, argv, tokens, kind) {
	const hierarchy = getCommandHierarchy(command);
	const args = argv.slice(2);
	let commandIndex = 0;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (arg === void 0 || arg === "--") break;
		const nextCommand = hierarchy[commandIndex + 1];
		if (nextCommand && (arg === nextCommand.name() || nextCommand.aliases().includes(arg))) {
			commandIndex += 1;
			continue;
		}
		if (requiresFollowingValue(arg, hierarchy[commandIndex]?.options ?? [])) {
			const value = args[index + 1];
			if (kind === "value" && value && tokens.has(value)) return true;
			index += 1;
			continue;
		}
		if (kind === "flag" && tokens.has(arg.split("=")[0] ?? arg)) return true;
	}
	return false;
}
//#endregion
//#region src/cli/machine-output-argv.ts
/** Read positional command tokens after supported root options, without importing CLI catalogs. */
function getMachineOutputCommandPath(argv, depth) {
	return getRootOptionAwareCommandPath(argv, depth);
}
/** Prefer registered option roles; early discovery falls back to literal option spellings. */
function hasMachineOutputOption(argv, flag, command) {
	if (command) return hasCommanderOptionToken(command, argv, /* @__PURE__ */ new Set([flag]), "flag");
	for (const arg of argv.slice(2)) {
		if (arg === "--") return false;
		if (arg === flag || arg.startsWith(`${flag}=`)) return true;
	}
	return false;
}
//#endregion
//#region src/cli/doctor-output-mode.ts
/** Bare doctor JSON and non-TTY lint runs own machine-readable stdout. */
function isDoctorMachineOutput(params) {
	if (hasMachineOutputOption(params.argv, "--lint")) return hasMachineOutputOption(params.argv, "--json") || !params.stdoutIsTTY;
	const existingMachineMode = hasMachineOutputOption(params.argv, "--post-upgrade") || hasMachineOutputOption(params.argv, "--state-sqlite") || hasMachineOutputOption(params.argv, "--session-sqlite");
	return hasMachineOutputOption(params.argv, "--json") && !existingMachineMode;
}
//#endregion
//#region src/cli/program/core-command-descriptors.ts
/** Static root-command descriptors for the core CLI surface. */
const CORE_CLI_COMMAND_DESCRIPTORS = [
	{
		name: "setup",
		description: "Chat with OpenClaw; onboard when setup is incomplete",
		hasSubcommands: false
	},
	{
		name: "crestodian",
		description: "Deprecated: use openclaw setup",
		hasSubcommands: false,
		hidden: true
	},
	{
		name: "onboard",
		description: "Guided setup for auth, models, Gateway, workspace, channels, and skills",
		hasSubcommands: true
	},
	{
		name: "configure",
		description: "Interactive configuration for credentials, channels, gateway, and agent defaults",
		hasSubcommands: false
	},
	{
		name: "config",
		description: "Non-interactive config helpers (get/set/patch/unset/file/schema/validate). Run without subcommand for guided setup.",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isConfigMachineOutput(argv)
	},
	{
		name: "claws",
		description: "Inspect and add experimental OpenClaw Claws",
		hasSubcommands: true,
		parentDefaultHelp: true
	},
	{
		name: "backup",
		description: "Create, verify, and restore backup archives and SQLite snapshots",
		hasSubcommands: true
	},
	{
		name: "database",
		description: "Inspect database schema compatibility and shared-state write ownership",
		hasSubcommands: true,
		parentDefaultHelp: true
	},
	{
		name: "migrate",
		description: "Import state from another agent system",
		hasSubcommands: true
	},
	{
		name: "doctor",
		description: "Health checks + quick fixes for the gateway and channels",
		hasSubcommands: false,
		machineOutput: isDoctorMachineOutput
	},
	{
		name: "triage",
		description: "Collect sanitized diagnostics and open a local coding agent for repair",
		hasSubcommands: false,
		machineOutput: ({ argv }) => hasMachineOutputOption(argv, "--json")
	},
	{
		name: "dashboard",
		description: "Open the Control UI with your current token",
		hasSubcommands: false
	},
	{
		name: "reset",
		description: "Reset local config/state (keeps the CLI installed)",
		hasSubcommands: false
	},
	{
		name: "uninstall",
		description: "Uninstall the gateway service + local data",
		hasSubcommands: false
	},
	{
		name: "message",
		description: "Send, read, and manage messages and channel actions",
		hasSubcommands: true
	},
	{
		name: "mcp",
		description: "Manage OpenClaw mcp.servers config and channel bridge",
		hasSubcommands: true,
		parentDefaultHelp: true
	},
	{
		name: "transcripts",
		description: "Inspect stored transcripts",
		hasSubcommands: true
	},
	{
		name: "agent",
		description: "Run an agent turn via the Gateway (use --local for embedded)",
		hasSubcommands: true
	},
	{
		name: "agents",
		description: "Manage isolated agents (workspaces + auth + routing)",
		hasSubcommands: true
	},
	{
		name: "status",
		description: "Show channel health and recent session recipients",
		hasSubcommands: false
	},
	{
		name: "health",
		description: "Fetch health from the running gateway",
		hasSubcommands: false
	},
	{
		name: "audit",
		description: "Inspect activity records and exact-run identity context",
		hasSubcommands: false
	},
	{
		name: "sessions",
		description: "List stored conversation sessions",
		hasSubcommands: true
	},
	{
		name: "tasks",
		description: "Inspect durable background tasks and TaskFlow state",
		hasSubcommands: true
	}
];
const CRON_GATEWAY_VALUE_FLAGS = [
	"url",
	"port",
	"token",
	"password",
	"timeout",
	"expectFinal"
].filter((name) => name !== "expectFinal").map((name) => `--${name}`);
const CRON_OUTPUT_COMMANDS = {
	status: {
		aliases: [],
		alwaysJson: true
	},
	add: {
		aliases: ["create"],
		alwaysJson: true
	},
	rm: {
		aliases: ["remove", "delete"],
		alwaysJson: true
	},
	enable: {
		aliases: [],
		alwaysJson: true
	},
	disable: {
		aliases: [],
		alwaysJson: true
	},
	get: {
		aliases: [],
		alwaysJson: true
	},
	runs: {
		aliases: [],
		alwaysJson: true
	},
	run: {
		aliases: [],
		alwaysJson: true
	},
	edit: {
		aliases: [],
		alwaysJson: true
	},
	scratch: {
		aliases: [],
		alwaysJson: false
	}
};
const MACHINE_OUTPUT_COMMANDS$1 = /* @__PURE__ */ new Set();
for (const [name, definition] of Object.entries(CRON_OUTPUT_COMMANDS)) {
	MACHINE_OUTPUT_COMMANDS$1.add(name);
	for (const alias of definition.aliases) MACHINE_OUTPUT_COMMANDS$1.add(alias);
}
function isCronMachineOutput(argv) {
	const [root] = getMachineOutputCommandPath(argv, 1);
	if (!root) return false;
	const [command] = getCommandPositionalsWithRootOptions(argv, {
		commandPath: [root],
		booleanFlags: ["--expect-final"],
		valueFlags: CRON_GATEWAY_VALUE_FLAGS,
		maxPositionals: 1
	}) ?? [];
	return command !== void 0 && MACHINE_OUTPUT_COMMANDS$1.has(command);
}
//#endregion
//#region src/cli/devices-output-mode.ts
function isDevicesMachineOutput(argv) {
	const [, command] = getMachineOutputCommandPath(argv, 2);
	return command === "rotate" || command === "revoke";
}
//#endregion
//#region gateway-run-argv.mjs
const GATEWAY_RUN_VALUE_FLAGS = /* @__PURE__ */ new Set([
	"--port",
	"--bind",
	"--token",
	"--token-file",
	"--auth",
	"--password",
	"--password-file",
	"--tailscale",
	"--ws-log",
	"--raw-stream-path"
]);
const GATEWAY_RUN_BOOLEAN_FLAGS = /* @__PURE__ */ new Set([
	"--tailscale-reset-on-exit",
	"--allow-unconfigured",
	"--dev",
	"--ambient-channels",
	"--dev-ambient-channels",
	"--reset",
	"--update-canary",
	"--force",
	"--verbose",
	"--cli-backend-logs",
	"--claude-cli-logs",
	"--compact",
	"--raw-stream"
]);
//#endregion
//#region src/daemon/windows-task-supervisor-contract.ts
/** Internal argument used by generated Windows Gateway service launchers. */
const WINDOWS_TASK_SUPERVISOR_FLAG = "--task-supervisor";
/** Internal argument marking the Gateway child owned by the task supervisor. */
const WINDOWS_TASK_SUPERVISOR_CHILD_FLAG = "--task-supervisor-child";
//#endregion
//#region src/cli/gateway-run-argv.ts
/** Resolve the gateway command path from raw argv without full Commander registration. */
function resolveGatewayCommandPath(argv, depth = 2) {
	const positionals = getCommandPositionalsWithRootOptions(argv, {
		commandPath: ["gateway"],
		booleanFlags: [...GATEWAY_RUN_BOOLEAN_FLAGS, WINDOWS_TASK_SUPERVISOR_FLAG],
		valueFlags: [...GATEWAY_RUN_VALUE_FLAGS, WINDOWS_TASK_SUPERVISOR_CHILD_FLAG],
		maxPositionals: depth - 1,
		mode: "command-path"
	});
	return positionals ? ["gateway", ...positionals] : null;
}
/** Resolve the gateway command path used by catalog and startup-policy lookups. */
function resolveGatewayCatalogCommandPath(argv) {
	return resolveGatewayCommandPath(argv, 2);
}
//#endregion
//#region src/cli/gateway-cli/output-mode.ts
function isGatewayMachineOutput(argv) {
	const [, command, action] = resolveGatewayCommandPath([...argv], 3) ?? [];
	return command === "restart-handoff" && (action === "capabilities" || action === "consume");
}
//#endregion
//#region src/cli/models-output-mode.ts
/** Resolve the parent-command alias for `models status --json`. */
function isModelsStatusJsonOutput(argv, command) {
	return hasMachineOutputOption(argv, "--json", command) || resolveCliParentCommandPath(argv, "models")?.length === 1 && hasMachineOutputOption(argv, "--status-json", command);
}
function isModelsPlainMachineOutput(argv, command) {
	const commandPath = resolveCliParentCommandPath(argv, "models");
	return commandPath !== null && (hasMachineOutputOption(argv, "--plain", command) || commandPath.length === 1 && hasMachineOutputOption(argv, "--status-plain", command));
}
//#endregion
//#region src/cli/nodes-cli/output-mode.ts
function isNodesMachineOutput(argv) {
	const [, command] = getMachineOutputCommandPath(argv, 2);
	return command === "invoke" || command === "approve" || command === "reject";
}
//#endregion
//#region src/cli/proxy-output-mode.ts
const MACHINE_OUTPUT_COMMANDS = /* @__PURE__ */ new Set([
	"blob",
	"coverage",
	"purge",
	"query",
	"sessions"
]);
/** Proxy inspection commands reserve stdout for JSON or raw captured content. */
function isProxyMachineOutput(argv) {
	const [, command] = getMachineOutputCommandPath(argv, 2);
	return MACHINE_OUTPUT_COMMANDS.has(command ?? "");
}
//#endregion
//#region src/cli/skills-output-mode.ts
/** Skill verification emits JSON unless the caller explicitly requests the Markdown card. */
function isSkillsMachineOutput(argv, command) {
	return resolveCliParentCommandPath(argv, "skills")?.[1] === "verify" && !hasMachineOutputOption(argv, "--card", command);
}
//#endregion
//#region src/cli/system-output-mode.ts
const DEFAULT_JSON_PATHS = /* @__PURE__ */ new Set([
	"heartbeat disable",
	"heartbeat enable",
	"heartbeat last",
	"presence"
]);
/** System query/control commands emit JSON even when `--json` is omitted. */
function isSystemMachineOutput(argv) {
	return DEFAULT_JSON_PATHS.has(getMachineOutputCommandPath(argv, 3).slice(1).join(" "));
}
//#endregion
//#region src/shared/global-singleton.ts
/**
* Process-local singleton helpers for registries, caches, and SDK-visible shared state.
* Keys must be symbols so unrelated modules cannot collide on `globalThis` property names.
*/
const GLOBAL_SINGLETON_RESETS_KEY = Symbol.for("openclaw.globalSingletonLifecycleResets");
function resolveGlobalSingletonResetRegistry() {
	const globalStore = globalThis;
	const existing = globalStore[GLOBAL_SINGLETON_RESETS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[GLOBAL_SINGLETON_RESETS_KEY] = created;
	return created;
}
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
function resolveGlobalSingleton(key, create, reset, lifecycle = "close-and-restart") {
	const globalStore = globalThis;
	let value;
	if (Object.hasOwn(globalStore, key)) value = globalStore[key];
	else {
		value = create();
		globalStore[key] = value;
	}
	if (reset) resolveGlobalSingletonResetRegistry().set(key, {
		lifecycle,
		reset: () => reset(value)
	});
	return value;
}
resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScope"), () => new AsyncLocalStorage());
resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScopeAncestry"), () => new AsyncLocalStorage());
resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new AsyncResource("openclaw.detached-async-context"));
//#endregion
//#region src/plugins/plugin-instance-invocation.ts
var InvocationFrame = class InvocationFrame {
	constructor(scopes) {
		this.invocation = scopes.invocation;
		this.metadataScope = scopes.metadataScope;
		this.cacheScope = scopes.cacheScope;
	}
	withScopes(scopes) {
		return new InvocationFrame(scopes);
	}
};
/** Copy core scopes through the current owner so runtime-only fields survive. */
function createPluginExecutionFrame(scopes, current) {
	return current ? current.withScopes(scopes) : new InvocationFrame(scopes);
}
const pluginExecutionContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceInvocation"), () => {
	const frames = new AsyncLocalStorage();
	return {
		invocation: {
			getStore() {
				return frames.getStore()?.invocation;
			},
			run(invocation, run) {
				const current = frames.getStore();
				return frames.run(current?.invocation === invocation ? current : createPluginExecutionFrame({
					...current,
					invocation
				}, current), run);
			},
			exit(run) {
				const current = frames.getStore();
				return current?.invocation ? frames.run(current.withScopes({
					...current,
					invocation: void 0
				}), run) : run();
			}
		},
		getFrame() {
			return frames.getStore();
		},
		runFrame(frame, run) {
			return frames.run(frame, run);
		}
	};
});
pluginExecutionContext.invocation;
pluginExecutionContext.getFrame;
pluginExecutionContext.runFrame;
resolveGlobalSingleton(Symbol.for("openclaw.pluginCache"), () => ({
	snapshotOwners: /* @__PURE__ */ new WeakMap(),
	retirements: []
}));
resolveGlobalSingleton(Symbol.for("openclaw.pluginCacheRetainers"), () => /* @__PURE__ */ new WeakMap());
resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceCacheOwners"), () => /* @__PURE__ */ new WeakMap());
path.join("dist", "plugin-sdk", "qa-lab.js");
/** Return true when private QA CLI routes should be exposed. */
function isPrivateQaCliEnabled(env = process.env) {
	return env.OPENCLAW_ENABLE_PRIVATE_QA_CLI === "1";
}
//#endregion
//#region src/cli/program/subcli-descriptors.ts
const subCliCommandDescriptors = [
	{
		name: "acp",
		description: "Run an ACP bridge backed by the Gateway",
		hasSubcommands: true
	},
	{
		name: "gateway",
		description: "Run, inspect, and query the WebSocket Gateway",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isGatewayMachineOutput(argv)
	},
	{
		name: "daemon",
		description: "Manage the Gateway service (launchd/systemd/schtasks)",
		hasSubcommands: true
	},
	{
		name: "logs",
		description: "Tail gateway file logs via RPC",
		hasSubcommands: false
	},
	{
		name: "system",
		description: "System tools (events, heartbeat, presence)",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isSystemMachineOutput(argv)
	},
	{
		name: "models",
		description: "Model discovery, scanning, and configuration",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isModelsStatusJsonOutput(argv) || isModelsPlainMachineOutput(argv)
	},
	{
		name: "promos",
		description: "Discover and claim promotional model offers from ClawHub",
		hasSubcommands: true
	},
	{
		name: "telemetry",
		description: "Inspect and manage anonymous usage telemetry",
		hasSubcommands: true,
		parentDefaultHelp: true
	},
	{
		name: "infer",
		description: "Run provider-backed inference commands through a stable CLI surface",
		hasSubcommands: true
	},
	{
		name: "capability",
		description: "Run provider capability commands (fallback alias: infer)",
		hasSubcommands: true
	},
	{
		name: "approvals",
		description: "Manage approval policy and pending requests",
		hasSubcommands: true,
		parentDefaultHelp: true
	},
	{
		name: "exec-approvals",
		description: "Manage exec approvals (alias for approvals)",
		hasSubcommands: true
	},
	{
		name: "exec-policy",
		description: "Show or synchronize requested exec policy with host approvals",
		hasSubcommands: true
	},
	{
		name: "nodes",
		description: "Manage gateway-owned nodes (pairing, status, invoke, and media)",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isNodesMachineOutput(argv)
	},
	{
		name: "devices",
		description: "Device pairing and auth tokens (for mobile app setup codes, use `openclaw qr` instead)",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isDevicesMachineOutput(argv),
		parentDefaultHelp: true
	},
	{
		name: "users",
		description: "Manage durable user profiles and email aliases",
		hasSubcommands: true,
		parentDefaultHelp: true
	},
	{
		name: "node",
		description: "Run and manage the headless node host service",
		hasSubcommands: true
	},
	{
		name: "connect",
		description: "Connect this machine to an OpenClaw Gateway as a node",
		hasSubcommands: false
	},
	{
		name: "worker",
		description: "Run the restricted cloud worker runtime",
		hasSubcommands: false
	},
	{
		name: "sandbox",
		description: "Manage sandbox containers (Docker-based agent isolation)",
		hasSubcommands: true
	},
	{
		name: "fleet",
		description: "Provision and manage isolated tenant cells (experimental)",
		hasSubcommands: true
	},
	{
		name: "worktrees",
		description: "Create, inspect, restore, and clean up managed worktrees",
		hasSubcommands: true,
		parentDefaultHelp: true
	},
	{
		name: "attach",
		description: "Attach Claude Code to a gateway session with scoped MCP tools",
		hasSubcommands: false
	},
	{
		name: "tui",
		description: "Open a terminal UI connected to the Gateway",
		hasSubcommands: false
	},
	{
		name: "resume",
		description: "Resume a recent Gateway session in the TUI",
		hasSubcommands: false
	},
	{
		name: "terminal",
		description: "Open a local terminal UI (alias for tui --local)",
		hasSubcommands: false
	},
	{
		name: "chat",
		description: "Open a local terminal UI (alias for tui --local)",
		hasSubcommands: false
	},
	{
		name: "cron",
		description: "Manage automations (via Gateway)",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isCronMachineOutput(argv),
		parentDefaultHelp: true
	},
	{
		name: "automations",
		description: "Manage automations (alias for cron)",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isCronMachineOutput(argv),
		parentDefaultHelp: true
	},
	{
		name: "dns",
		description: "DNS helpers for wide-area discovery (Tailscale + CoreDNS)",
		hasSubcommands: true
	},
	{
		name: "docs",
		description: "Search the live OpenClaw docs",
		hasSubcommands: false
	},
	{
		name: "qa",
		description: "Run QA scenarios and launch the private QA debugger UI",
		hasSubcommands: true
	},
	{
		name: "proxy",
		description: "Run the OpenClaw debug proxy and inspect captured traffic",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isProxyMachineOutput(argv)
	},
	{
		name: "hooks",
		description: "Manage internal agent hooks",
		hasSubcommands: true
	},
	{
		name: "webhooks",
		description: "Webhook helpers and integrations",
		hasSubcommands: true
	},
	{
		name: "qr",
		description: "Generate a mobile pairing QR code and setup code",
		hasSubcommands: false
	},
	{
		name: "clawbot",
		description: "Legacy clawbot command aliases",
		hasSubcommands: true
	},
	{
		name: "pairing",
		description: "Secure DM pairing (approve inbound requests)",
		hasSubcommands: true
	},
	{
		name: "plugins",
		description: "Manage OpenClaw plugins and extensions",
		hasSubcommands: true,
		parentDefaultHelp: true
	},
	{
		name: "channels",
		description: "Manage connected chat channels and accounts",
		hasSubcommands: true,
		parentDefaultHelp: true
	},
	{
		name: "directory",
		description: "Lookup contact and group IDs (self, peers, groups) for supported chat channels",
		hasSubcommands: true
	},
	{
		name: "security",
		description: "Audit local config and state for common security foot-guns",
		hasSubcommands: true
	},
	{
		name: "secrets",
		description: "Secrets runtime controls",
		hasSubcommands: true
	},
	{
		name: "skills",
		description: "List and inspect available skills",
		hasSubcommands: true,
		machineOutput: ({ argv }) => isSkillsMachineOutput(argv)
	},
	{
		name: "update",
		description: "Update OpenClaw and inspect update channel status",
		hasSubcommands: true
	},
	{
		name: "completion",
		description: "Generate shell completion script",
		hasSubcommands: false
	}
];
/** Visible sub-CLI descriptors after private QA gating. */
const SUB_CLI_DESCRIPTORS = getSubCliEntriesCore();
/** Return visible sub-CLI descriptors in help/registration order. */
function getSubCliEntriesCore() {
	return isPrivateQaCliEnabled() ? subCliCommandDescriptors : subCliCommandDescriptors.filter((descriptor) => descriptor.name !== "qa");
}
//#endregion
//#region src/cli/argv.ts
const HELP_FLAGS = /* @__PURE__ */ new Set(["-h", "--help"]);
const VERSION_FLAGS = /* @__PURE__ */ new Set([
	"-V",
	"--version",
	.../* @__PURE__ */ new Set(["-v"])
]);
const ROOT_COMMAND_DESCRIPTORS = [...CORE_CLI_COMMAND_DESCRIPTORS.filter((descriptor) => descriptor.name !== "claws" || isExperimentalClawsEnabled()), ...SUB_CLI_DESCRIPTORS];
const KNOWN_ROOT_COMMANDS = new Set(ROOT_COMMAND_DESCRIPTORS.map((descriptor) => descriptor.name));
const ROOT_COMMANDS_WITH_SUBCOMMANDS = new Set(ROOT_COMMAND_DESCRIPTORS.filter((descriptor) => descriptor.hasSubcommands).map((descriptor) => descriptor.name));
function isHelpOrVersionInvocation(argv) {
	if (isRootVersionInvocation(argv)) return true;
	const args = argv.slice(2);
	let sawCommandOption = false;
	let literal = false;
	const positionals = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (!arg) break;
		if (!literal && arg === "--") {
			literal = true;
			continue;
		}
		const rootConsumed = literal ? 0 : consumeRootOptionToken(args, i);
		if (rootConsumed > 0) {
			i += rootConsumed - 1;
			continue;
		}
		if (!literal && HELP_FLAGS.has(arg)) return true;
		if (!literal && arg.startsWith("-")) {
			sawCommandOption = true;
			continue;
		}
		positionals.push(arg);
		if (arg !== "help") continue;
		if (sawCommandOption) return false;
		if (positionals.length === 1) return true;
		const [primary] = positionals;
		if (!primary || !KNOWN_ROOT_COMMANDS.has(primary)) return true;
		if (positionals.length === 2 && ROOT_COMMANDS_WITH_SUBCOMMANDS.has(primary)) return true;
		return false;
	}
	return false;
}
function isRootVersionInvocation(argv) {
	return isRootInvocationForFlags(argv, VERSION_FLAGS);
}
function isRootInvocationForFlags(argv, targetFlags) {
	const args = argv.slice(2);
	let hasTarget = false;
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (!arg) continue;
		if (arg === "--") break;
		if (targetFlags.has(arg)) {
			hasTarget = true;
			continue;
		}
		const consumed = consumeRootOptionToken(args, i);
		if (consumed > 0) {
			i += consumed - 1;
			continue;
		}
		return false;
	}
	return hasTarget;
}
function isRootHelpInvocation(argv) {
	return isRootInvocationForFlags(argv, HELP_FLAGS);
}
function getCommandPathWithRootOptions(argv, depth = 2) {
	return getRootOptionAwareCommandPath(argv, depth);
}
function getPrimaryCommand(argv) {
	const [primary] = getCommandPathWithRootOptions(argv, 1);
	return primary ?? null;
}
//#endregion
//#region src/cli/argv-invocation.ts
/** Resolves command path and help/version mode from a raw process argv array. */
function resolveCliArgvInvocation(argv) {
	return {
		argv,
		commandPath: resolveGatewayCatalogCommandPath(argv) ?? resolveCliParentCommandPath(argv) ?? getCommandPathWithRootOptions(argv, 2),
		primary: getPrimaryCommand(argv),
		hasHelpOrVersion: isHelpOrVersionInvocation(argv),
		isRootHelpInvocation: isRootHelpInvocation(argv)
	};
}
//#endregion
//#region src/cli/profile-utils.ts
const PROFILE_NAME_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
function isValidProfileName(value) {
	if (!value) return false;
	return PROFILE_NAME_RE.test(value);
}
/** Resolve the canonical home-scoped state root for a validated CLI profile. */
function resolveProfileStateDir(profile, env, homedir) {
	const trimmed = profile.trim();
	if (!isValidProfileName(trimmed)) throw new Error(`Invalid profile name: ${JSON.stringify(profile)}`);
	const suffix = normalizeLowercaseStringOrEmpty(trimmed) === "default" ? "" : `-${trimmed}`;
	return path.join(resolveRequiredHomeDir(env, homedir), `.openclaw${suffix}`);
}
//#endregion
//#region src/cli/root-option-scan.ts
/** Walk argv once, letting callers consume custom flags before forwarding root options. */
function scanCliRootOptions(argv, visit) {
	if (argv.length < 2) return {
		ok: true,
		argv
	};
	const out = argv.slice(0, 2);
	const args = argv.slice(2);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === void 0) continue;
		if (arg === "--") {
			out.push(arg, ...args.slice(i + 1));
			break;
		}
		const visited = visit({
			arg,
			args,
			index: i,
			out
		});
		if (visited.kind === "error") return {
			ok: false,
			error: visited.error
		};
		if (visited.kind === "handled") {
			if (visited.consumedNext) i += 1;
			continue;
		}
		const consumedRootOption = consumeRootOptionToken(args, i);
		if (consumedRootOption > 0) {
			for (let offset = 0; offset < consumedRootOption; offset += 1) {
				const token = args[i + offset];
				if (token !== void 0) out.push(token);
			}
			i += consumedRootOption - 1;
			continue;
		}
		out.push(arg);
	}
	return {
		ok: true,
		argv: out
	};
}
//#endregion
//#region src/infra/inline-option-token.ts
/** Splits one CLI-style option token into its flag name and optional inline value. */
function parseInlineOptionToken(token) {
	const separatorIndex = token.indexOf("=");
	if (separatorIndex < 0) return {
		name: token,
		hasInlineValue: false
	};
	return {
		name: token.slice(0, separatorIndex),
		hasInlineValue: true,
		inlineValue: token.slice(separatorIndex + 1)
	};
}
//#endregion
//#region src/cli/root-option-value.ts
/** Return the normalized option value and whether the next argv token was consumed. */
function takeCliRootOptionValue(raw, next) {
	const parsed = parseInlineOptionToken(raw);
	if (parsed.hasInlineValue) return {
		value: (parsed.inlineValue ?? "").trim() || null,
		consumedNext: false
	};
	const consumedNext = isValueToken(next);
	return {
		value: (consumedNext ? next.trim() : "") || null,
		consumedNext
	};
}
//#endregion
//#region src/cli/profile.ts
function parseCliProfileArgs(argv) {
	let profile = null;
	let sawDev = false;
	const scanned = scanCliRootOptions(argv, ({ arg, args, index, out }) => {
		if (arg === "--dev") {
			if (resolveCliArgvInvocation(out).primary === "gateway") {
				out.push(arg);
				return { kind: "handled" };
			}
			if (profile && profile !== "dev") return {
				kind: "error",
				error: "Cannot combine --dev with --profile"
			};
			sawDev = true;
			profile = "dev";
			return { kind: "handled" };
		}
		if (arg === "--profile" || arg.startsWith("--profile=")) {
			const next = args[index + 1];
			const { value, consumedNext } = takeCliRootOptionValue(arg, next);
			const [primary, secondary] = resolveCliArgvInvocation(out).commandPath;
			if (primary === "qa" && secondary === "matrix") {
				out.push(arg);
				if (consumedNext && next !== void 0) out.push(next);
				return {
					kind: "handled",
					consumedNext
				};
			}
			if (sawDev) return {
				kind: "error",
				error: "Cannot combine --dev with --profile"
			};
			if (!value) return {
				kind: "error",
				error: "--profile requires a value"
			};
			if (!isValidProfileName(value)) return {
				kind: "error",
				error: "Invalid --profile (use letters, numbers, \"_\", \"-\" only)"
			};
			profile = value;
			return {
				kind: "handled",
				consumedNext
			};
		}
		return { kind: "pass" };
	});
	if (!scanned.ok) return scanned;
	return {
		ok: true,
		profile,
		argv: scanned.argv
	};
}
function applyCliProfileEnv(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const profile = params.profile.trim();
	if (!profile) return;
	const inheritedProfile = normalizeOptionalString(env.OPENCLAW_PROFILE) ?? "default";
	const existingStateDir = normalizeOptionalString(env.OPENCLAW_STATE_DIR);
	const existingConfigPath = normalizeOptionalString(env.OPENCLAW_CONFIG_PATH);
	const profileEnv = env;
	const inheritedProfileStateDir = resolveProfileStateDir(inheritedProfile, profileEnv, homedir);
	const selectedProfileStateDir = resolveProfileStateDir(profile, profileEnv, homedir);
	const switchesInheritedProfile = inheritedProfileStateDir !== selectedProfileStateDir;
	const inheritedSystemdServiceName = resolveGatewaySystemdServiceName(inheritedProfile);
	const inheritedServiceSelectors = {
		OPENCLAW_LAUNCHD_LABEL: [resolveGatewayLaunchAgentLabel(inheritedProfile)],
		OPENCLAW_SYSTEMD_UNIT: [inheritedSystemdServiceName, `${inheritedSystemdServiceName}.service`],
		OPENCLAW_WINDOWS_TASK_NAME: [resolveGatewayWindowsTaskName(inheritedProfile)]
	};
	const switchesInheritedProfileState = Boolean(existingStateDir && switchesInheritedProfile && resolveHomeRelativePath(existingStateDir, {
		env,
		homedir
	}) === inheritedProfileStateDir);
	const replacesInheritedProfileConfig = Boolean(switchesInheritedProfile && (!existingStateDir || switchesInheritedProfileState) && existingConfigPath && resolveHomeRelativePath(existingConfigPath, {
		env,
		homedir
	}) === path.join(inheritedProfileStateDir, "openclaw.json"));
	const inheritedManagedServiceSelectors = switchesInheritedProfile && isGatewayServiceEnv(env) && switchesInheritedProfileState && replacesInheritedProfileConfig;
	if (inheritedManagedServiceSelectors) for (const key of GATEWAY_SERVICE_SELECTOR_ENV_KEYS) delete env[key];
	env.OPENCLAW_PROFILE = profile;
	const retainedStateDir = inheritedManagedServiceSelectors ? void 0 : existingStateDir;
	const stateDir = retainedStateDir && !switchesInheritedProfileState ? retainedStateDir : selectedProfileStateDir;
	if (!retainedStateDir || switchesInheritedProfileState) env.OPENCLAW_STATE_DIR = stateDir;
	if (!inheritedManagedServiceSelectors && (!existingConfigPath || replacesInheritedProfileConfig)) env.OPENCLAW_CONFIG_PATH = path.join(stateDir, "openclaw.json");
	if (switchesInheritedProfile && !inheritedManagedServiceSelectors) for (const [key, inheritedValues] of Object.entries(inheritedServiceSelectors)) {
		const activeValue = normalizeOptionalString(env[key]);
		if (activeValue && inheritedValues.includes(activeValue)) delete env[key];
	}
	if (profile === "dev" && !env.OPENCLAW_GATEWAY_PORT?.trim()) env.OPENCLAW_GATEWAY_PORT = "19001";
}
//#endregion
//#region src/infra/test-runtime-env.ts
/** Detects Vitest/test execution from the env shape used by local and worker processes. */
function isVitestRuntimeEnv(env = process.env) {
	const vitest = env.VITEST;
	return vitest === "true" || vitest === "1" || env.VITEST_POOL_ID !== void 0 || env.VITEST_WORKER_ID !== void 0 || env.NODE_ENV === "test";
}
/** Enables the shared fast-test shortcuts only inside a detected test runtime. */
function isFastTestRuntimeEnv(env = process.env) {
	return env.OPENCLAW_TEST_FAST === "1" && (isVitestRuntimeEnv(env) || env !== process.env && isVitestRuntimeEnv(process.env));
}
//#endregion
//#region src/config/state-dir.ts
const LEGACY_STATE_DIRNAMES = [".clawdbot"];
const NEW_STATE_DIRNAME = ".openclaw";
function resolveDefaultHomeDir() {
	return resolveRequiredHomeDir(process.env, os.homedir);
}
function resolveLegacyStateDirs(homedir = resolveDefaultHomeDir) {
	return LEGACY_STATE_DIRNAMES.map((dir) => path.join(homedir(), dir));
}
function resolveNewStateDir(homedir = resolveDefaultHomeDir) {
	return path.join(homedir(), NEW_STATE_DIRNAME);
}
/**
* State directory for mutable data (sessions, logs, caches).
* Can be overridden via OPENCLAW_STATE_DIR.
* Default: ~/.openclaw
*/
function resolveStateDir(env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveHomeRelativePath(override, {
		env,
		homedir: effectiveHomedir
	});
	return resolveStateDirFromHome(env, effectiveHomedir);
}
/** Select a default state directory from the caller's already resolved home. */
function resolveStateDirFromHome(env, effectiveHomedir) {
	const newDir = resolveNewStateDir(effectiveHomedir);
	if (isFastTestRuntimeEnv(env)) return newDir;
	if (fs.existsSync(newDir)) return newDir;
	const existingLegacy = resolveLegacyStateDirs(effectiveHomedir).find((dir) => {
		try {
			return fs.existsSync(dir);
		} catch {
			return false;
		}
	});
	if (existingLegacy) return existingLegacy;
	return newDir;
}
//#endregion
//#region src/infra/config-dir.ts
/** Resolves the OpenClaw config directory from state/config env overrides or home. */
function resolveConfigDir(env = process.env, homedir = os.homedir) {
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveUserPath$1(override, env, homedir);
	const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
	if (configPath) return path.dirname(resolveUserPath$1(configPath, env, homedir));
	return path.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
}
//#endregion
//#region src/infra/host-env-security-policy.json
var host_env_security_policy_default = {
	blockedEverywhereKeys: [
		"NODE_OPTIONS",
		"NODE_PATH",
		"NODE_REDIRECT_WARNINGS",
		"NODE_REPL_EXTERNAL_MODULE",
		"NODE_REPL_HISTORY",
		"NODE_V8_COVERAGE",
		"PYTHONHOME",
		"PYTHONPATH",
		"PERL5LIB",
		"PERL5OPT",
		"RUBYLIB",
		"RUBYOPT",
		"BASHOPTS",
		"BASH_ENV",
		"ENV",
		"KSH_ENV",
		"BROWSER",
		"GIT_ALLOW_PROTOCOL",
		"GIT_EDITOR",
		"GIT_EXTERNAL_DIFF",
		"GIT_DIR",
		"GIT_WORK_TREE",
		"GIT_COMMON_DIR",
		"GIT_EXEC_PATH",
		"GIT_INDEX_FILE",
		"GIT_OBJECT_DIRECTORY",
		"GIT_ALTERNATE_OBJECT_DIRECTORIES",
		"GIT_NAMESPACE",
		"GIT_PROTOCOL_FROM_USER",
		"GIT_SEQUENCE_EDITOR",
		"GIT_TEMPLATE_DIR",
		"GIT_SSL_NO_VERIFY",
		"GIT_SSL_CAINFO",
		"GIT_SSL_CAPATH",
		"CC",
		"CPP",
		"CXX",
		"CXXCPP",
		"CARGO_BUILD_RUSTC",
		"CARGO_BUILD_RUSTC_WRAPPER",
		"CARGO_BUILD_RUSTC_WORKSPACE_WRAPPER",
		"CARGO_BUILD_RUSTDOC",
		"RUSTC",
		"RUSTC_WRAPPER",
		"RUSTC_WORKSPACE_WRAPPER",
		"RUSTDOC",
		"CMAKE_C_COMPILER",
		"CMAKE_CXX_COMPILER",
		"SHELL",
		"SHELLOPTS",
		"PS4",
		"GCONV_PATH",
		"IFS",
		"SSLKEYLOGFILE",
		"JAVA_OPTS",
		"JAVA_TOOL_OPTIONS",
		"_JAVA_OPTIONS",
		"JDK_JAVA_OPTIONS",
		"PYTHONBREAKPOINT",
		"DOTNET_STARTUP_HOOKS",
		"DOTNET_ADDITIONAL_DEPS",
		"FPATH",
		"GLIBC_TUNABLES",
		"MAVEN_OPTS",
		"MAKE",
		"MAKEFLAGS",
		"MFLAGS",
		"SBT_OPTS",
		"GRADLE_OPTS",
		"ANT_OPTS",
		"HGRCPATH",
		"HGEDITOR",
		"HGMERGE",
		"EXINIT",
		"VIMINIT",
		"MYVIMRC",
		"GVIMINIT",
		"LUA_INIT",
		"LUA_INIT_5_1",
		"LUA_INIT_5_2",
		"LUA_INIT_5_3",
		"LUA_INIT_5_4",
		"EMACSLOADPATH",
		"RUBYSHELL",
		"GIT_HOOK_PATH",
		"SVN_EDITOR",
		"SVN_SSH",
		"BZR_EDITOR",
		"BZR_SSH",
		"BZR_PLUGIN_PATH",
		"SUDO_ASKPASS",
		"JULIA_EDITOR",
		"CONFIG_SITE",
		"CONFIG_SHELL",
		"CMAKE_TOOLCHAIN_FILE",
		"CATALINA_OPTS",
		"CORECLR_PROFILER",
		"HELM_PLUGINS",
		"PACKER_PLUGIN_PATH",
		"VAGRANT_VAGRANTFILE",
		"ERL_AFLAGS",
		"ERL_FLAGS",
		"ERL_ZFLAGS",
		"ELIXIR_ERL_OPTIONS",
		"R_ENVIRON",
		"R_PROFILE",
		"R_ENVIRON_USER",
		"R_PROFILE_USER",
		"TCLLIBPATH",
		"HOSTALIASES"
	],
	blockedOverrideOnlyKeys: [
		"HOME",
		"GRADLE_USER_HOME",
		"ZDOTDIR",
		"GIT_DIR",
		"GIT_WORK_TREE",
		"GIT_COMMON_DIR",
		"GIT_INDEX_FILE",
		"GIT_OBJECT_DIRECTORY",
		"GIT_ALTERNATE_OBJECT_DIRECTORIES",
		"GIT_NAMESPACE",
		"GIT_SSH_COMMAND",
		"GIT_SSH",
		"GIT_PROXY_COMMAND",
		"GIT_ASKPASS",
		"GIT_SSL_NO_VERIFY",
		"GIT_SSL_CAINFO",
		"GIT_SSL_CAPATH",
		"SSH_ASKPASS",
		"LESSOPEN",
		"LESSCLOSE",
		"PAGER",
		"MANPAGER",
		"GIT_PAGER",
		"EDITOR",
		"VISUAL",
		"FCEDIT",
		"SUDO_EDITOR",
		"PROMPT_COMMAND",
		"HISTFILE",
		"PERL5DB",
		"PERL5DBCMD",
		"OPENSSL_CONF",
		"OPENSSL_ENGINES",
		"PYTHONSTARTUP",
		"WGETRC",
		"CURL_HOME",
		"CLASSPATH",
		"CFLAGS",
		"CGO_CFLAGS",
		"CGO_LDFLAGS",
		"GOFLAGS",
		"MAKEFLAGS",
		"MFLAGS",
		"CORECLR_PROFILER_PATH",
		"PHPRC",
		"PHP_INI_SCAN_DIR",
		"DENO_DIR",
		"BUN_CONFIG_REGISTRY",
		"YARN_RC_FILENAME",
		"HTTP_PROXY",
		"HTTPS_PROXY",
		"ALL_PROXY",
		"NO_PROXY",
		"NODE_TLS_REJECT_UNAUTHORIZED",
		"NODE_EXTRA_CA_CERTS",
		"SSL_CERT_FILE",
		"SSL_CERT_DIR",
		"REQUESTS_CA_BUNDLE",
		"CURL_CA_BUNDLE",
		"DOCKER_HOST",
		"DOCKER_TLS_VERIFY",
		"DOCKER_CERT_PATH",
		"PIP_INDEX_URL",
		"PIP_PYPI_URL",
		"PIP_EXTRA_INDEX_URL",
		"PIP_CONFIG_FILE",
		"PIP_FIND_LINKS",
		"PIP_TRUSTED_HOST",
		"UV_INDEX",
		"UV_INDEX_URL",
		"UV_PYTHON",
		"UV_EXTRA_INDEX_URL",
		"UV_DEFAULT_INDEX",
		"DOCKER_CONTEXT",
		"LIBRARY_PATH",
		"LDFLAGS",
		"CPATH",
		"C_INCLUDE_PATH",
		"CPLUS_INCLUDE_PATH",
		"OBJC_INCLUDE_PATH",
		"GOPROXY",
		"GONOSUMCHECK",
		"GONOSUMDB",
		"GONOPROXY",
		"GOPRIVATE",
		"GOENV",
		"GOPATH",
		"HGRCPATH",
		"PYTHONUSERBASE",
		"RUSTC_WRAPPER",
		"RUSTFLAGS",
		"RUSTUP_DIST_ROOT",
		"RUSTUP_DIST_SERVER",
		"RUSTUP_HOME",
		"RUSTUP_TOOLCHAIN",
		"RUSTUP_UPDATE_ROOT",
		"CARGO_HOME",
		"VIRTUAL_ENV",
		"LUA_PATH",
		"LUA_CPATH",
		"GEM_HOME",
		"GEM_PATH",
		"BUNDLE_GEMFILE",
		"COMPOSER_HOME",
		"CONDA_DEFAULT_ENV",
		"CONDA_PREFIX",
		"CARGO_BUILD_RUSTC_WRAPPER",
		"XDG_CACHE_HOME",
		"XDG_CONFIG_DIRS",
		"XDG_CONFIG_HOME",
		"XDG_DATA_DIRS",
		"XDG_DATA_HOME",
		"XDG_RUNTIME_DIR",
		"XDG_STATE_HOME",
		"AWS_CONFIG_FILE",
		"KUBECONFIG",
		"GOOGLE_APPLICATION_CREDENTIALS",
		"AWS_SHARED_CREDENTIALS_FILE",
		"AWS_WEB_IDENTITY_TOKEN_FILE",
		"AZURE_AUTH_LOCATION",
		"HELM_HOME",
		"ANSIBLE_CONFIG",
		"ANSIBLE_LIBRARY",
		"ANSIBLE_CALLBACK_PLUGINS",
		"ANSIBLE_COLLECTIONS_PATH",
		"ANSIBLE_CONNECTION_PLUGINS",
		"ANSIBLE_FILTER_PLUGINS",
		"ANSIBLE_INVENTORY_PLUGINS",
		"ANSIBLE_LOOKUP_PLUGINS",
		"ANSIBLE_MODULE_UTILS",
		"ANSIBLE_REMOTE_TEMP",
		"ANSIBLE_ROLES_PATH",
		"ANSIBLE_STRATEGY_PLUGINS",
		"R_LIBS_USER",
		"TF_CLI_CONFIG_FILE",
		"TF_PLUGIN_CACHE_DIR",
		"AMQP_URL",
		"AWS_ACCESS_KEY_ID",
		"AWS_CONTAINER_CREDENTIALS_FULL_URI",
		"AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
		"AWS_SECRET_ACCESS_KEY",
		"AWS_SECURITY_TOKEN",
		"AWS_SESSION_TOKEN",
		"AZURE_CLIENT_ID",
		"AZURE_CLIENT_SECRET",
		"DATABASE_URL",
		"GH_TOKEN",
		"GITHUB_TOKEN",
		"GITLAB_TOKEN",
		"MONGODB_URI",
		"NODE_AUTH_TOKEN",
		"NPM_TOKEN",
		"REDIS_URL",
		"SSH_AUTH_SOCK",
		"SYSTEMROOT",
		"WINDIR"
	],
	allowedInheritedOverrideOnlyKeys: [
		"ALL_PROXY",
		"AWS_CONFIG_FILE",
		"AWS_SHARED_CREDENTIALS_FILE",
		"AWS_WEB_IDENTITY_TOKEN_FILE",
		"AZURE_AUTH_LOCATION",
		"CURL_CA_BUNDLE",
		"DOCKER_CERT_PATH",
		"DOCKER_CONTEXT",
		"DOCKER_HOST",
		"DOCKER_TLS_VERIFY",
		"GIT_PAGER",
		"GOOGLE_APPLICATION_CREDENTIALS",
		"GRADLE_USER_HOME",
		"HISTFILE",
		"HOME",
		"HTTPS_PROXY",
		"HTTP_PROXY",
		"KUBECONFIG",
		"MANPAGER",
		"NODE_EXTRA_CA_CERTS",
		"NODE_TLS_REJECT_UNAUTHORIZED",
		"NO_PROXY",
		"PAGER",
		"REQUESTS_CA_BUNDLE",
		"RUSTUP_DIST_ROOT",
		"RUSTUP_DIST_SERVER",
		"RUSTUP_HOME",
		"RUSTUP_TOOLCHAIN",
		"RUSTUP_UPDATE_ROOT",
		"SSH_AUTH_SOCK",
		"SSL_CERT_DIR",
		"SSL_CERT_FILE",
		"SYSTEMROOT",
		"WINDIR",
		"XDG_CACHE_HOME",
		"XDG_CONFIG_DIRS",
		"XDG_CONFIG_HOME",
		"XDG_DATA_DIRS",
		"XDG_DATA_HOME",
		"XDG_RUNTIME_DIR",
		"XDG_STATE_HOME",
		"ZDOTDIR"
	],
	blockedOverridePrefixes: [
		"GIT_CONFIG_",
		"NPM_CONFIG_",
		"CARGO_REGISTRIES_",
		"TF_VAR_"
	],
	blockedPrefixes: [
		"DYLD_",
		"LD_",
		"BASH_FUNC_"
	]
};
//#endregion
//#region src/infra/host-env-security-policy.js
function sortUniqueUppercase(values) {
	return Object.freeze(Array.from(new Set(values.map((value) => value.toUpperCase()))).toSorted((left, right) => left < right ? -1 : left > right ? 1 : 0));
}
function derivePolicyArrays(policy) {
	const blockedEverywhereKeys = policy.blockedEverywhereKeys ?? [];
	const blockedOverrideOnlyKeys = policy.blockedOverrideOnlyKeys ?? [];
	const allowedInheritedOverrideOnlyKeys = policy.allowedInheritedOverrideOnlyKeys ?? [];
	const allowedInheritedOverrideOnlyUpper = new Set(allowedInheritedOverrideOnlyKeys.map((value) => value.toUpperCase()));
	const blockedPrefixes = policy.blockedPrefixes ?? [];
	const blockedOverridePrefixes = policy.blockedOverridePrefixes ?? [];
	const blockedInheritedPrefixes = policy.blockedInheritedPrefixes ?? blockedPrefixes;
	return {
		blockedInheritedKeys: sortUniqueUppercase([...blockedEverywhereKeys, ...blockedOverrideOnlyKeys.filter((value) => !allowedInheritedOverrideOnlyUpper.has(value.toUpperCase()))]),
		blockedInheritedPrefixes: sortUniqueUppercase(blockedInheritedPrefixes),
		blockedKeys: sortUniqueUppercase(blockedEverywhereKeys),
		blockedOverrideKeys: sortUniqueUppercase(blockedOverrideOnlyKeys),
		blockedPrefixes: sortUniqueUppercase(blockedPrefixes),
		blockedOverridePrefixes: sortUniqueUppercase(blockedOverridePrefixes)
	};
}
/**
* Normalizes raw host environment policy JSON into immutable lookup arrays.
*/
function loadHostEnvSecurityPolicy(rawPolicy = host_env_security_policy_default) {
	const derived = derivePolicyArrays(rawPolicy);
	return Object.freeze({
		blockedEverywhereKeys: Object.freeze(rawPolicy.blockedEverywhereKeys ?? []),
		blockedOverrideOnlyKeys: Object.freeze(rawPolicy.blockedOverrideOnlyKeys ?? []),
		allowedInheritedOverrideOnlyKeys: Object.freeze(rawPolicy.allowedInheritedOverrideOnlyKeys ?? []),
		blockedInheritedKeys: derived.blockedInheritedKeys,
		blockedInheritedPrefixes: derived.blockedInheritedPrefixes,
		blockedPrefixes: derived.blockedPrefixes,
		blockedOverridePrefixes: derived.blockedOverridePrefixes,
		blockedKeys: derived.blockedKeys,
		blockedOverrideKeys: derived.blockedOverrideKeys
	});
}
/**
* Process-wide host environment security policy derived from generated JSON.
*/
const HOST_ENV_SECURITY_POLICY = loadHostEnvSecurityPolicy();
//#endregion
//#region src/infra/openclaw-exec-env.ts
/** Child-shell routing hint; it does not authenticate or authorize a Gateway caller. */
const SUBAGENT_EXEC_ENV_VAR = "OPENCLAW_SUBAGENT_EXEC";
//#endregion
//#region src/infra/host-env-security.ts
const PORTABLE_ENV_VAR_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;
const HOST_DANGEROUS_ENV_KEY_VALUES = Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedKeys]);
Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedPrefixes]);
const HOST_DANGEROUS_INHERITED_ENV_KEY_VALUES = Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedInheritedKeys]);
Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedInheritedPrefixes]);
const HOST_DANGEROUS_OVERRIDE_ENV_KEY_VALUES = Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedOverrideKeys]);
Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedOverridePrefixes]);
const HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEY_VALUES = Object.freeze([
	"TERM",
	"LANG",
	"LC_ALL",
	"LC_CTYPE",
	"LC_MESSAGES",
	"COLORTERM",
	"NO_COLOR",
	"FORCE_COLOR",
	SUBAGENT_EXEC_ENV_VAR
]);
Object.freeze(["LC_"]);
new Set(HOST_DANGEROUS_ENV_KEY_VALUES);
new Set(HOST_DANGEROUS_INHERITED_ENV_KEY_VALUES);
new Set(HOST_DANGEROUS_OVERRIDE_ENV_KEY_VALUES);
new Set(HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEY_VALUES);
new AsyncLocalStorage();
function normalizeEnvVarKey(rawKey, options) {
	const key = rawKey.trim();
	if (!key) return null;
	if (options?.portable && !PORTABLE_ENV_VAR_KEY.test(key)) return null;
	return key;
}
//#endregion
//#region src/infra/dotenv-global-core.ts
/** Maximum bytes to read from any dotenv file. */
const MAX_DOTENV_FILE_BYTES = 1048576;
function reportDotEnvReadError(params, error) {
	if (params.quiet) return;
	if ((error && typeof error === "object" && "code" in error ? String(error.code) : void 0) !== "ENOENT") params.onWarning?.(`Failed to read ${params.filePath}: ${String(error)}`, { error });
	if (error instanceof Error && error.message?.startsWith("File exceeds")) params.onWarning?.(`skipping oversized .env file (max ${MAX_DOTENV_FILE_BYTES} bytes): ${params.filePath}`);
}
function parseDotEnvFile(params, content) {
	const entries = [];
	for (const [rawKey, value] of Object.entries(parse(content))) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (key && (params.entryFilter?.(key, value) ?? true)) entries.push({
			key,
			value
		});
	}
	return {
		filePath: params.filePath,
		entries
	};
}
function readDotEnvFileCore(params) {
	let content;
	try {
		const resolved = fs.realpathSync(params.filePath);
		const { buffer } = readRegularFileSync({
			filePath: resolved,
			maxBytes: MAX_DOTENV_FILE_BYTES
		});
		content = buffer;
	} catch (error) {
		reportDotEnvReadError(params, error);
		return null;
	}
	return parseDotEnvFile(params, content);
}
function loadParsedDotEnvFiles(files, env, overrideKeys, onWarning) {
	const preExistingKeys = new Set(Object.keys(env));
	const canonicalizeKey = (key) => normalizeEnvVarKey(key, { portable: true })?.toUpperCase() ?? null;
	const normalizedOverrideKeys = new Set([...overrideKeys ?? []].flatMap((key) => {
		const normalized = canonicalizeKey(key);
		return normalized ? [normalized] : [];
	}));
	const conflicts = /* @__PURE__ */ new Map();
	const firstSeen = /* @__PURE__ */ new Map();
	const appliedKeysByFile = /* @__PURE__ */ new Map();
	for (const file of files) for (const { key, value } of file.entries) {
		const canonicalKey = canonicalizeKey(key);
		const mayOverride = canonicalKey !== null && normalizedOverrideKeys.has(canonicalKey);
		const precedenceKey = mayOverride && canonicalKey ? canonicalKey : key;
		if (preExistingKeys.has(key) && !mayOverride) continue;
		const previous = firstSeen.get(precedenceKey);
		if (previous) {
			if (previous.value !== value) {
				const conflictKey = `${previous.filePath}\u0000${file.filePath}`;
				const existing = conflicts.get(conflictKey);
				if (existing) existing.keys.add(key);
				else conflicts.set(conflictKey, {
					keptPath: previous.filePath,
					ignoredPath: file.filePath,
					keys: /* @__PURE__ */ new Set([key])
				});
			}
			continue;
		}
		firstSeen.set(precedenceKey, {
			value,
			filePath: file.filePath
		});
		if (env[key] === void 0 || mayOverride) {
			if (mayOverride) {
				for (const inheritedKey of preExistingKeys) if (canonicalizeKey(inheritedKey) === canonicalKey) env[inheritedKey] = value;
			}
			env[key] = value;
			const appliedKeys = appliedKeysByFile.get(file.filePath);
			if (appliedKeys) appliedKeys.push(key);
			else appliedKeysByFile.set(file.filePath, [key]);
		}
	}
	for (const conflict of conflicts.values()) {
		const keys = [...conflict.keys].toSorted();
		if (keys.length === 0) continue;
		onWarning?.(`Conflicting values in ${conflict.keptPath} and ${conflict.ignoredPath} for ${keys.join(", ")}; keeping ${conflict.keptPath}.`, {
			keptPath: conflict.keptPath,
			ignoredPath: conflict.ignoredPath,
			keys
		});
	}
	return appliedKeysByFile;
}
function resolveGlobalDotEnvPaths(opts, env) {
	const stateEnvPath = opts.stateEnvPath ?? path.join(resolveConfigDir(env), ".env");
	const globalEnvPaths = [.../* @__PURE__ */ new Set([stateEnvPath, ...opts.additionalEnvPaths ?? []])];
	const home = resolveRequiredHomeDir(env, os.homedir);
	const defaultStateEnvPath = path.join(home, ".openclaw", ".env");
	return {
		globalEnvPaths,
		gatewayEnvPath: env.OPENCLAW_STATE_DIR?.trim() !== void 0 && path.resolve(stateEnvPath) !== path.resolve(defaultStateEnvPath) ? void 0 : path.join(home, ".config", "openclaw", "gateway.env")
	};
}
function applyGlobalDotEnvFiles(globalEnvs, gatewayEnv, env, overrideKeys, onWarning) {
	const parsed = [...globalEnvs, gatewayEnv].filter((file) => file !== null);
	const appliedKeysByFile = loadParsedDotEnvFiles(parsed, env, overrideKeys, onWarning);
	return {
		dotenvPresentKeys: [...new Set(parsed.flatMap((file) => file.entries.map(({ key }) => key)))],
		stateEnvAppliedKeys: globalEnvs.flatMap((file) => file ? appliedKeysByFile.get(file.filePath) ?? [] : []),
		gatewayEnvAppliedKeys: gatewayEnv ? appliedKeysByFile.get(gatewayEnv.filePath) ?? [] : []
	};
}
/** Load global runtime dotenv files with first-wins precedence, defaulting to `process.env`. */
function loadGlobalRuntimeDotEnvFilesCore(opts = {}) {
	const env = opts.env ?? process.env;
	const { globalEnvPaths, gatewayEnvPath } = resolveGlobalDotEnvPaths(opts, env);
	const readOptions = {
		entryFilter: opts.entryFilter,
		quiet: opts.quiet ?? true,
		onWarning: opts.onWarning
	};
	return applyGlobalDotEnvFiles(globalEnvPaths.map((filePath) => readDotEnvFileCore({
		...readOptions,
		filePath
	})), gatewayEnvPath ? readDotEnvFileCore({
		...readOptions,
		filePath: gatewayEnvPath
	}) : null, env, opts.overrideKeys, opts.onWarning);
}
//#endregion
//#region src/infra/semver.ts
function isOpenClawCorrectionSemver(version) {
	return version.prerelease.length === 1 && typeof version.prerelease[0] === "number";
}
function toOpenClawComparableVersion(version) {
	if (isOpenClawCorrectionSemver(version)) return `${version.major}.${version.minor}.${version.patch}+${version.prerelease[0]}`;
	return version.version;
}
/** Compares prereleases, stable releases, then OpenClaw numeric corrections. */
function compareOpenClawSemver(left, right) {
	return compareBuild(toOpenClawComparableVersion(left), toOpenClawComparableVersion(right));
}
//#endregion
//#region src/infra/npm-registry-spec.ts
const OPENCLAW_RELEASE_PREFIX_RE = /^\d{4}\./;
/** Parses OpenClaw's monthly patch stable/alpha/beta/correction version format. */
function parseOpenClawReleaseVersion(value) {
	const trimmed = value.trim();
	const parsed = OPENCLAW_RELEASE_PREFIX_RE.test(trimmed) ? parse$1(trimmed) : null;
	if (!parsed || parsed.build.length > 0) return null;
	if (parsed.minor < 1 || parsed.minor > 12 || parsed.patch < 1) return null;
	const [label, sequence] = parsed.prerelease;
	const isStable = parsed.prerelease.length === 0;
	const isCorrection = isOpenClawCorrectionSemver(parsed) && typeof label === "number" && label > 0;
	const isAlpha = parsed.prerelease.length === 2 && label === "alpha" && typeof sequence === "number" && sequence > 0;
	const isBeta = parsed.prerelease.length === 2 && label === "beta" && typeof sequence === "number" && sequence > 0;
	if (!isStable && !isCorrection && !isAlpha && !isBeta) return null;
	return parsed;
}
/** Compares OpenClaw monthly patch release versions across alpha, beta, stable, and corrections. */
function compareOpenClawReleaseVersions(left, right) {
	const parsedLeft = parseOpenClawReleaseVersion(left);
	const parsedRight = parseOpenClawReleaseVersion(right);
	return parsedLeft && parsedRight ? compareOpenClawSemver(parsedLeft, parsedRight) : null;
}
//#endregion
//#region src/config/paths.ts
/**
* Nix mode detection: When OPENCLAW_NIX_MODE=1, the gateway is running under Nix.
* In this mode:
* - No auto-install flows should be attempted
* - Missing dependencies should produce actionable Nix-specific error messages
* - Config is managed externally (read-only from Nix perspective)
*/
function resolveIsNixMode(env = process.env) {
	return env.OPENCLAW_NIX_MODE === "1";
}
resolveIsNixMode();
const CONFIG_FILENAME = "openclaw.json";
const LEGACY_CONFIG_FILENAMES = ["clawdbot.json"];
/** Build a homedir thunk that respects OPENCLAW_HOME for the given env. */
function envHomedir(env) {
	return () => resolveRequiredHomeDir(env, os.homedir);
}
function resolveUserPath(input, env = process.env, homedir = envHomedir(env)) {
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
resolveStateDir();
/**
* Config file path (JSON or JSON5).
* Can be overridden via OPENCLAW_CONFIG_PATH.
* Default: ~/.openclaw/openclaw.json (or $OPENCLAW_STATE_DIR/openclaw.json)
*/
function resolveCanonicalConfigPath(env = process.env, stateDir) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, envHomedir(env));
	return path.join(stateDir ?? resolveStateDir(env, envHomedir(env)), CONFIG_FILENAME);
}
/**
* Resolve the active config path by preferring existing config candidates
* before falling back to the canonical path.
*/
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	if (isFastTestRuntimeEnv(env)) return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
	const existing = resolveDefaultConfigCandidates(env, homedir).find((candidate) => {
		try {
			return fs.existsSync(candidate);
		} catch {
			return false;
		}
	});
	if (existing) return existing;
	return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}
resolveConfigPathCandidate();
/**
* Resolve default config path candidates across default locations.
* Order: explicit config path → state-dir-derived paths → new default.
*/
function resolveDefaultConfigCandidates(env = process.env, homedir = envHomedir(env)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
	if (explicit) return [resolveUserPath(explicit, env, effectiveHomedir)];
	const candidates = [];
	const openclawStateDir = env.OPENCLAW_STATE_DIR?.trim();
	if (openclawStateDir) {
		const resolved = resolveUserPath(openclawStateDir, env, effectiveHomedir);
		candidates.push(path.join(resolved, CONFIG_FILENAME));
		candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(resolved, name)));
	}
	const defaultDirs = [resolveNewStateDir(effectiveHomedir), ...resolveLegacyStateDirs(effectiveHomedir)];
	for (const dir of defaultDirs) {
		candidates.push(path.join(dir, CONFIG_FILENAME));
		candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(dir, name)));
	}
	return candidates;
}
//#endregion
//#region src/state/openclaw-state-db.paths.ts
/** Resolve the shared state SQLite file path. */
function resolveOpenClawStateSqlitePath(env = process.env) {
	return path.join(resolveStateDir(env), "state", "openclaw.sqlite");
}
//#endregion
//#region src/node-host/launcher-client.ts
/** A companion retains stdin's write end; EOF also retires the node after an app crash. */
function watchNodeHostParentStdin(onClose) {
	const input = process.stdin;
	let closed = false;
	const close = () => {
		if (!closed) {
			closed = true;
			onClose();
		}
	};
	input.once("end", close);
	input.once("error", close);
	input.once("close", close);
	input.resume();
	if (input.readableEnded || input.destroyed) queueMicrotask(close);
	return () => {
		closed = true;
		input.off("end", close);
		input.off("error", close);
		input.off("close", close);
		input.pause();
	};
}
//#endregion
//#region src/node-host/launcher-bootstrap.ts
function resolveNodeHostLauncherStateDir(argv, inheritedEnv) {
	const parsed = parseCliProfileArgs(argv);
	if (!parsed.ok) return null;
	const env = { ...inheritedEnv };
	if (parsed.profile) applyCliProfileEnv({
		profile: parsed.profile,
		env
	});
	loadGlobalRuntimeDotEnvFilesCore({
		env,
		stateEnvPath: path.join(resolveStateDir(env), ".env"),
		quiet: true,
		onWarning: (message) => process.stderr.write(`openclaw: ${message}\n`)
	});
	return resolveStateDir(env);
}
//#endregion
export { compareOpenClawReleaseVersions, resolveNodeHostLauncherStateDir, resolveOpenClawStateSqlitePath, watchNodeHostParentStdin };
