import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { n as isExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { n as isNodeRuntime, t as isBunRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { a as getCommandPositionalsWithRootOptions, i as getCommandArgsWithRootOptions, n as consumeRootCommandOptionToken, o as getRootOptionAwareCommandPath, r as consumeRootOptionToken, s as isValueToken } from "./cli-root-options-vGuJ5JgW.mjs";
import { a as resolveCliParentCommandPath, t as isConfigMachineOutput } from "./config-output-mode-DrhJ7F5x.mjs";
import { n as GATEWAY_RUN_VALUE_FLAGS, t as GATEWAY_RUN_BOOLEAN_FLAGS } from "./gateway-run-argv-L1ml5gbH.mjs";
import { i as WINDOWS_TASK_SUPERVISOR_FLAG, r as WINDOWS_TASK_SUPERVISOR_CHILD_FLAG } from "./windows-task-supervisor-contract-DlaAkrWJ.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
//#region src/cli/program/commander-parse-facts.ts
const activeErrorCommandByRoot = /* @__PURE__ */ new WeakMap();
const lazyCommands = /* @__PURE__ */ new WeakSet();
function markCommanderLazyCommand(command) {
	lazyCommands.add(command);
}
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
/** Return the registered command path for the exact Commander node handling an error or action. */
function getCommanderCommandPath(command) {
	const commandPath = [];
	for (let current = command; current?.parent; current = current.parent) commandPath.unshift(current.name());
	return commandPath;
}
function getRootCommand(command) {
	let root = command;
	while (root.parent) root = root.parent;
	return root;
}
/** Resolve lazy help before classifying a possible child on Commander's active command node. */
function getCommanderSubcommandFact(command, args) {
	if ((args.includes("-h") || args.includes("--help")) && lazyCommands.has(command)) return { kind: "defer" };
	const firstArgument = command.args[0];
	const matchesChild = command.commands.some((child) => child.name() === firstArgument || child.aliases().includes(firstArgument ?? ""));
	if (command.registeredArguments.length > 0 || firstArgument === void 0 || firstArgument.startsWith("-") || matchesChild) return;
	return command.commands.length > 0 ? {
		kind: "unknown",
		name: firstArgument
	} : void 0;
}
/** Scope the exact Commander node synchronously emitting an error. */
function setCommanderErrorCommand(command) {
	const root = getRootCommand(command);
	const previous = activeErrorCommandByRoot.get(root);
	activeErrorCommandByRoot.set(root, command);
	return () => {
		if (previous) activeErrorCommandByRoot.set(root, previous);
		else activeErrorCommandByRoot.delete(root);
	};
}
/** Return the active parse-error path without replacing Commander's configured output handler. */
function getCommanderErrorCommandPath(program) {
	const command = activeErrorCommandByRoot.get(getRootCommand(program));
	return command ? getCommanderCommandPath(command) : void 0;
}
/** Return visible children of the non-root command synchronously emitting a parse error. */
function getCommanderErrorCommandNames(program) {
	const command = activeErrorCommandByRoot.get(getRootCommand(program));
	return command && getCommanderCommandPath(command).length ? command.createHelp().visibleCommands(command).flatMap((child) => child.aliases().concat(child.name())) : void 0;
}
//#endregion
//#region src/cli/machine-output-argv.ts
const MACHINE_OUTPUT_JSON_OPTION_DESCRIPTION = "Explicit machine-output spelling (command results are JSON by default)";
/** Normalize Node's absent `isTTY` property to the public resolver's boolean contract. */
function isMachineOutputStdoutTTY(stdout = process.stdout) {
	return stdout.isTTY === true;
}
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
/** Return core root-command descriptors in help/registration order. */
function getCoreCliCommandDescriptors() {
	return isExperimentalClawsEnabled() ? CORE_CLI_COMMAND_DESCRIPTORS : CORE_CLI_COMMAND_DESCRIPTORS.filter((descriptor) => descriptor.name !== "claws");
}
/** Return names for all core root commands. */
function getCoreCliCommandNamesCore() {
	return getCoreCliCommandDescriptors().map((descriptor) => descriptor.name);
}
/** Return core root commands that own child subcommands. */
function getCoreCliCommandsWithSubcommands() {
	return getCoreCliCommandDescriptors().filter((descriptor) => descriptor.hasSubcommands).map((descriptor) => descriptor.name);
}
/** Return core root commands whose parent action should default to help. */
function getCoreCliParentDefaultHelpCommands() {
	return getCoreCliCommandDescriptors().filter((descriptor) => descriptor.parentDefaultHelp).map((descriptor) => descriptor.name);
}
//#endregion
//#region src/cli/cron-cli/output-mode.ts
const CRON_GATEWAY_OPTION_NAMES = [
	"url",
	"port",
	"token",
	"password",
	"timeout",
	"expectFinal"
];
const CRON_GATEWAY_VALUE_FLAGS = CRON_GATEWAY_OPTION_NAMES.filter((name) => name !== "expectFinal").map((name) => `--${name}`);
const CRON_SCRATCH_JSON_OPTION_DESCRIPTION = "Output scratch plus revision metadata as JSON; writes return JSON by default";
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
function createCronOutputCommand(parent, name) {
	const definition = CRON_OUTPUT_COMMANDS[name];
	const command = parent.command(name);
	for (const alias of definition.aliases) command.alias(alias);
	return definition.alwaysJson ? command.option("--json", MACHINE_OUTPUT_JSON_OPTION_DESCRIPTION) : command.option("--json", CRON_SCRATCH_JSON_OPTION_DESCRIPTION);
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
//#region src/cli/gateway-run-argv.ts
/** Return how many argv tokens a gateway-run option consumes, or 0 when not recognized. */
function consumeGatewayRunOptionToken(args, index) {
	const arg = args[index];
	if (!arg || arg === "--" || !arg.startsWith("-")) return 0;
	const equalsIndex = arg.indexOf("=");
	const flag = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
	if (GATEWAY_RUN_BOOLEAN_FLAGS.has(flag)) return equalsIndex === -1 ? 1 : 0;
	if (!GATEWAY_RUN_VALUE_FLAGS.has(flag)) return 0;
	if (equalsIndex !== -1) return arg.slice(equalsIndex + 1).trim() ? 1 : 0;
	return isValueToken(args[index + 1]) ? 2 : 0;
}
function consumeGatewayRunPreBootstrapOptionToken(args, index) {
	const rootConsumed = consumeRootCommandOptionToken(args, index);
	if (rootConsumed > 0) return rootConsumed;
	const consumed = consumeGatewayRunOptionToken(args, index);
	if (consumed > 0) return consumed;
	const arg = args[index];
	if (arg && GATEWAY_RUN_VALUE_FLAGS.has(arg) && args[index + 1] !== void 0) return 2;
	return 0;
}
/** Return how many root fast-path tokens are consumed before the `gateway` command. */
function consumeGatewayFastPathRootOptionToken(args, index) {
	const arg = args[index];
	if (!arg || arg === "--") return 0;
	if (arg === "--no-color") return 1;
	if (arg.startsWith("--profile=")) return arg.slice(10).trim() ? 1 : 0;
	if (arg === "--profile") return isValueToken(args[index + 1]) ? 2 : 0;
	return 0;
}
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
/** Resolve destructive gateway-run flags before Commander registration. */
function resolveGatewayRunPreBootstrapOptions(argv) {
	const args = getCommandArgsWithRootOptions(argv, {
		commandPath: ["gateway"],
		mode: "command-path"
	});
	if (!args) return null;
	let force = false;
	let reset = false;
	let sawRun = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") break;
		if (!sawRun && arg === "run") {
			sawRun = true;
			continue;
		}
		const consumed = consumeGatewayRunPreBootstrapOptionToken(args, index);
		if (consumed > 0) {
			if (arg === "--force") force = true;
			else if (arg === "--reset") reset = true;
			index += consumed - 1;
			continue;
		}
		if (!arg.startsWith("-")) return null;
	}
	return {
		force,
		reset
	};
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
//#region src/cli/program/private-qa-cli.ts
const PRIVATE_QA_DIST_RELATIVE_PATH = path.join("dist", "plugin-sdk", "qa-lab.js");
const SOURCE_CHECKOUT_MARKER_RELATIVE_PATHS = [".git", "pnpm-workspace.yaml"];
/** Return true when private QA CLI routes should be exposed. */
function isPrivateQaCliEnabled(env = process.env) {
	return env.OPENCLAW_ENABLE_PRIVATE_QA_CLI === "1";
}
function resolvePrivateQaSourceModuleSpecifier(params) {
	if (!isPrivateQaCliEnabled(params?.env ?? process.env)) return null;
	const packageRoot = (params?.resolvePackageRootSync ?? resolveOpenClawPackageRootSync)({
		argv1: params?.argv1 ?? process.argv[1],
		cwd: params?.cwd ?? process.cwd(),
		moduleUrl: params?.moduleUrl ?? import.meta.url
	});
	if (!packageRoot) return null;
	const existsSync = params?.existsSync ?? fs.existsSync;
	const sourceModulePath = path.join(packageRoot, PRIVATE_QA_DIST_RELATIVE_PATH);
	if (!SOURCE_CHECKOUT_MARKER_RELATIVE_PATHS.some((relativePath) => existsSync(path.join(packageRoot, relativePath))) || !existsSync(path.join(packageRoot, "src")) || !existsSync(sourceModulePath)) return null;
	return pathToFileURL(sourceModulePath).href;
}
async function dynamicImportPrivateQaCliModule(specifier) {
	return await import(specifier);
}
/** Load the private QA module from a source checkout or throw a user-facing availability error. */
function loadPrivateQaCliModule(params) {
	const specifier = resolvePrivateQaSourceModuleSpecifier(params);
	if (!specifier) throw new Error("Private QA CLI is only available from an OpenClaw source checkout.");
	return (params?.importModule ?? dynamicImportPrivateQaCliModule)(specifier);
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
/** Return visible sub-CLI names that own child subcommands. */
function getSubCliCommandsWithSubcommands() {
	return getSubCliEntriesCore().filter((descriptor) => descriptor.hasSubcommands).map((descriptor) => descriptor.name);
}
/** Return visible sub-CLI names whose parent command should show help by default. */
function getSubCliParentDefaultHelpCommands() {
	return getSubCliEntriesCore().filter((descriptor) => descriptor.parentDefaultHelp).map((descriptor) => descriptor.name);
}
//#endregion
//#region src/cli/argv.ts
const HELP_FLAGS = /* @__PURE__ */ new Set(["-h", "--help"]);
const ROOT_VERSION_ALIAS_FLAGS = /* @__PURE__ */ new Set(["-v"]);
const VERSION_FLAGS = /* @__PURE__ */ new Set([
	"-V",
	"--version",
	...ROOT_VERSION_ALIAS_FLAGS
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
function hasFlag(argv, name) {
	const args = argv.slice(2);
	for (const arg of args) {
		if (arg === "--") break;
		if (arg === name) return true;
	}
	return false;
}
function hasRootVersionAlias(argv) {
	return isRootInvocationForFlags(argv, ROOT_VERSION_ALIAS_FLAGS);
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
/** Match fast-path command help only when no command option can own the help token as a value. */
function isSimpleCommandHelpInvocation(argv, commandNames) {
	const args = argv.slice(2);
	let commandSeen = false;
	let helpSeen = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") return false;
		const rootConsumed = commandSeen ? 0 : consumeRootOptionToken(args, index);
		if (rootConsumed > 0) {
			index += rootConsumed - 1;
			continue;
		}
		if (HELP_FLAGS.has(arg)) {
			if (!commandSeen) return false;
			helpSeen = true;
			continue;
		}
		if (arg.startsWith("-") || commandSeen) return false;
		if (!commandNames.has(arg)) return false;
		commandSeen = true;
	}
	return commandSeen && helpSeen;
}
function scanHelpNormalizationArgv(argv) {
	const positionals = [];
	const rootOptions = [];
	let helpFlagIndex = null;
	for (let index = 2; index < argv.length; index += 1) {
		const arg = argv[index];
		if (!arg || arg === "--") break;
		const consumed = consumeRootOptionToken(argv, index);
		if (consumed > 0) {
			rootOptions.push(...argv.slice(index, index + consumed));
			index += consumed - 1;
			continue;
		}
		if (HELP_FLAGS.has(arg)) {
			helpFlagIndex = index;
			continue;
		}
		if (arg.startsWith("-")) return { ok: false };
		positionals.push({
			value: arg,
			index
		});
	}
	return {
		ok: true,
		positionals,
		rootOptions,
		helpFlagIndex
	};
}
function normalizeGeneratedHelpCommandArgv(argv) {
	const scan = scanHelpNormalizationArgv(argv);
	if (!scan.ok) return argv;
	const { positionals, rootOptions, helpFlagIndex } = scan;
	const [primary, secondary, target] = positionals;
	if (!primary || secondary?.value !== "help" || KNOWN_ROOT_COMMANDS.has(primary.value) && !ROOT_COMMANDS_WITH_SUBCOMMANDS.has(primary.value)) return argv;
	if (positionals.length === 2 && helpFlagIndex === secondary.index + 1) return argv.toSpliced(helpFlagIndex, 1);
	if (!target || positionals.length !== 3 || helpFlagIndex !== null && helpFlagIndex !== target.index + 1) return argv;
	const [runtimePath, entryPath] = argv;
	if (runtimePath === void 0 || entryPath === void 0) return argv;
	return [
		runtimePath,
		entryPath,
		...rootOptions,
		primary.value,
		target.value,
		"--help"
	];
}
function normalizeRootHelpTargetArgv(argv) {
	const scan = scanHelpNormalizationArgv(argv);
	if (!scan.ok) return argv;
	const { positionals, rootOptions, helpFlagIndex } = scan;
	const [help, target] = positionals;
	const lastPositional = positionals.at(-1);
	if (help?.value !== "help" || !target || !lastPositional || helpFlagIndex !== null && helpFlagIndex !== lastPositional.index + 1) return argv;
	const [runtimePath, entryPath] = argv;
	if (runtimePath === void 0 || entryPath === void 0) return argv;
	const targetPath = positionals.slice(1).map((positional) => positional.value);
	return [
		runtimePath,
		entryPath,
		...rootOptions,
		...targetPath,
		"--help"
	];
}
function isPossibleCommandOptionValue(remainingArgs, optionIndex) {
	const previous = remainingArgs[optionIndex - 1];
	if (!previous?.startsWith("-") || previous === "--") return false;
	return !previous.includes("=");
}
function consumeRootLogLevelToken(args, index) {
	const arg = args[index];
	if (!arg || arg === "--") return 0;
	if (arg.startsWith("--log-level=")) return arg.slice(12).trim() ? 1 : 0;
	if (arg === "--log-level") return isValueToken(args[index + 1]) ? 2 : 0;
	return 0;
}
function normalizeRootOptionArgv(argv, consumeOption, shouldPreserve) {
	const prefix = argv.slice(0, 2);
	const args = argv.slice(2);
	let rootPrefixEnd = 0;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") break;
		const consumed = consumeRootOptionToken(args, index);
		if (consumed <= 0) break;
		rootPrefixEnd = index + consumed;
		index += consumed - 1;
	}
	const rootPrefix = args.slice(0, rootPrefixEnd);
	const remainingArgs = args.slice(rootPrefixEnd);
	const movedArgs = [];
	const nextArgs = [];
	for (let index = 0; index < remainingArgs.length; index += 1) {
		const arg = remainingArgs.at(index);
		if (arg === void 0) break;
		if (arg === "--") {
			nextArgs.push(...remainingArgs.slice(index));
			break;
		}
		const consumed = consumeOption(remainingArgs, index);
		if (consumed > 0) {
			const preserve = shouldPreserve(remainingArgs, index, consumed) ?? isPossibleCommandOptionValue(remainingArgs, index);
			const tokens = remainingArgs.slice(index, index + consumed);
			if (preserve) nextArgs.push(...tokens);
			else movedArgs.push(...tokens);
			index += consumed - 1;
			continue;
		}
		nextArgs.push(arg);
	}
	if (movedArgs.length === 0) return argv;
	return [
		...prefix,
		...rootPrefix,
		...movedArgs,
		...nextArgs
	];
}
function normalizeRootNoColorArgv(argv, options = {}) {
	return normalizeRootOptionArgv(argv, (args, index) => args[index] === "--no-color" ? 1 : 0, (remainingArgs, noColorIndex) => options.shouldPreserveNoColor?.({
		remainingArgs,
		noColorIndex
	}));
}
function normalizeRootLogLevelArgv(argv, options = {}) {
	return normalizeRootOptionArgv(argv, consumeRootLogLevelToken, (remainingArgs, logLevelIndex, consumed) => options.shouldPreserveLogLevel?.({
		remainingArgs,
		logLevelIndex,
		consumed
	}));
}
function getFlagValue(argv, name) {
	const args = argv.slice(2);
	let value;
	for (let i = 0; i < args.length; i += 1) {
		const arg = args.at(i);
		if (arg === void 0) break;
		if (arg === "--") break;
		if (arg === name) {
			const next = args[i + 1];
			if (!isValueToken(next)) return null;
			value = next;
			i += 1;
			continue;
		}
		if (arg.startsWith(`${name}=`)) {
			const assigned = arg.slice(name.length + 1);
			if (!assigned) return null;
			value = assigned;
		}
	}
	return value;
}
function getVerboseFlag(argv, options) {
	if (hasFlag(argv, "--verbose")) return true;
	if (options?.includeDebug && hasFlag(argv, "--debug")) return true;
	return false;
}
function getPositiveIntFlagValue(argv, name) {
	const raw = getFlagValue(argv, name);
	if (raw === null || raw === void 0) return raw;
	return parseStrictPositiveInteger(raw) ?? null;
}
function getCommandPathWithRootOptions(argv, depth = 2) {
	return getRootOptionAwareCommandPath(argv, depth);
}
function getPrimaryCommand(argv) {
	const [primary] = getCommandPathWithRootOptions(argv, 1);
	return primary ?? null;
}
function buildParseArgv(rawArgs, programName = "openclaw") {
	const normalizedArgv = rawArgs[0] === programName ? rawArgs.slice(1) : rawArgs[0]?.endsWith("openclaw") ? rawArgs.slice(1) : rawArgs;
	if (normalizedArgv.length >= 2 && (isNodeRuntime(normalizedArgv[0] ?? "") || isBunRuntime(normalizedArgv[0] ?? ""))) return normalizedArgv;
	return [
		"node",
		programName,
		...normalizedArgv
	];
}
//#endregion
export { resolveGatewayCatalogCommandPath as A, isDoctorMachineOutput as B, isProxyMachineOutput as C, isGatewayMachineOutput as D, isModelsStatusJsonOutput as E, isCronMachineOutput as F, getCommanderErrorCommandPath as G, isMachineOutputStdoutTTY as H, getCoreCliCommandDescriptors as I, markCommanderLazyCommand as J, getCommanderSubcommandFact as K, getCoreCliCommandNamesCore as L, isDevicesMachineOutput as M, CRON_GATEWAY_OPTION_NAMES as N, consumeGatewayFastPathRootOptionToken as O, createCronOutputCommand as P, getCoreCliCommandsWithSubcommands as R, isSkillsMachineOutput as S, isModelsPlainMachineOutput as T, getCommanderCommandPath as U, MACHINE_OUTPUT_JSON_OPTION_DESCRIPTION as V, getCommanderErrorCommandNames as W, setCommanderErrorCommand as Y, getSubCliCommandsWithSubcommands as _, getPrimaryCommand as a, loadPrivateQaCliModule as b, hasRootVersionAlias as c, isRootVersionInvocation as d, isSimpleCommandHelpInvocation as f, normalizeRootNoColorArgv as g, normalizeRootLogLevelArgv as h, getPositiveIntFlagValue as i, resolveGatewayRunPreBootstrapOptions as j, consumeGatewayRunOptionToken as k, isHelpOrVersionInvocation as l, normalizeRootHelpTargetArgv as m, getCommandPathWithRootOptions as n, getVerboseFlag as o, normalizeGeneratedHelpCommandArgv as p, hasCommanderOptionToken as q, getFlagValue as r, hasFlag as s, buildParseArgv as t, isRootHelpInvocation as u, getSubCliEntriesCore as v, isNodesMachineOutput as w, isSystemMachineOutput as x, getSubCliParentDefaultHelpCommands as y, getCoreCliParentDefaultHelpCommands as z };
