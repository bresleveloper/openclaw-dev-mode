import { a as getCommandPositionalsWithRootOptions, o as getRootOptionAwareCommandPath } from "./cli-root-options-DGcy1qRg.mjs";
//#region src/cli/update-option-specs.ts
const UPDATE_OPTION_SPECS = [
	[
		"--json",
		"Output result as JSON",
		false
	],
	["--no-restart", "Skip updater restart (package Gateways may restart themselves)"],
	[
		"--dry-run",
		"Preview update actions without making changes",
		false
	],
	["--admission <auto|installed>", "Select candidate or installed admission checks (default: auto)"],
	["--channel <stable|extended-stable|beta|dev>", "Persist update channel (git + npm)"],
	["--tag <dist-tag|version|spec>", "Override the package target for this update (dist-tag, version, or package spec)"],
	["--timeout <seconds>", "Set a per-step deadline in seconds"],
	["--drain-timeout <seconds>", "Set the immutable activation drain budget before interruption"],
	["--sha <commit>", "Prepare an exact official commit for an adopted immutable installation"],
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
/** Config set uses --json as a parser alias except when dry-run emits a JSON report. */
function isConfigSetJsonParseOnly(argv) {
	const terminator = argv.indexOf("--", 2);
	const options = new Set(argv.slice(2, terminator < 0 ? void 0 : terminator));
	return options.has("--json") && !options.has("--dry-run");
}
//#endregion
export { resolveCliParentCommandPath as a, MODELS_PARENT_VALUE_FLAGS as i, isConfigSetJsonParseOnly as n, UPDATE_OPTION_SPECS as o, MODELS_PARENT_BOOLEAN_FLAGS as r, isConfigMachineOutput as t };
