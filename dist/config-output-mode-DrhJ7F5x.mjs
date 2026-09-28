import { a as getCommandPositionalsWithRootOptions, o as getRootOptionAwareCommandPath } from "./cli-root-options-vGuJ5JgW.mjs";
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
function hasFlag(argv, flag) {
	for (const arg of argv.slice(2)) {
		if (arg === "--") return false;
		if (arg === flag) return true;
	}
	return false;
}
/** Config values, paths, and schemas reserve stdout for machine-consumed output. */
function isConfigMachineOutput(argv) {
	const subcommand = resolveCliParentCommandPath(argv, "config")?.[1];
	return subcommand === "get" || subcommand === "file" || subcommand === "schema";
}
/** Config set uses --json as a parser alias except when dry-run emits a JSON report. */
function isConfigSetJsonParseOnly(argv) {
	return hasFlag(argv, "--json") && !hasFlag(argv, "--dry-run");
}
//#endregion
export { resolveCliParentCommandPath as a, MODELS_PARENT_VALUE_FLAGS as i, isConfigSetJsonParseOnly as n, UPDATE_OPTION_SPECS as o, MODELS_PARENT_BOOLEAN_FLAGS as r, isConfigMachineOutput as t };
