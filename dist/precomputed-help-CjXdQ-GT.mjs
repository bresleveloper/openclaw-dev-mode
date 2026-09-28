import { r as consumeRootOptionToken } from "./cli-root-options-vGuJ5JgW.mjs";
import { f as isSimpleCommandHelpInvocation, n as getCommandPathWithRootOptions } from "./argv-IYTsfFsq.mjs";
//#region src/cli/precomputed-help.ts
const PRECOMPUTED_COMMAND_HELP_NAMES = /* @__PURE__ */ new Set([
	"browser",
	"secrets",
	"nodes"
]);
const PRECOMPUTED_SUBCOMMAND_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"config",
	"doctor",
	"gateway",
	"models",
	"plugins",
	"sessions",
	"tasks"
]);
const HELP_FLAGS = /* @__PURE__ */ new Set(["-h", "--help"]);
const VERSION_FLAGS = /* @__PURE__ */ new Set(["-V", "--version"]);
const loadRootHelpLiveConfigModule = async () => await import("./root-help-live-config-DLFpCf-w.mjs");
const loadRootHelpMetadataModule = async () => await import("./root-help-metadata-DoWAQ8F9.mjs");
function isPrecomputedSubcommandHelpName(value) {
	return PRECOMPUTED_SUBCOMMAND_HELP_COMMANDS.has(value);
}
function resolvePrecomputedSubcommandHelpCommand(argv) {
	const args = argv.slice(2);
	let commandName = null;
	let sawHelp = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") return null;
		if (VERSION_FLAGS.has(arg)) return null;
		if (!commandName) {
			const consumed = consumeRootOptionToken(args, index);
			if (consumed > 0) {
				index += consumed - 1;
				continue;
			}
			if (arg.startsWith("-") || !isPrecomputedSubcommandHelpName(arg)) return null;
			commandName = arg;
			continue;
		}
		if (HELP_FLAGS.has(arg)) {
			sawHelp = true;
			continue;
		}
		return null;
	}
	return commandName && sawHelp ? commandName : null;
}
function resolvePrecomputedCommandHelpName(argv) {
	if (!isSimpleCommandHelpInvocation(argv, PRECOMPUTED_COMMAND_HELP_NAMES)) return null;
	const commandPath = getCommandPathWithRootOptions(argv, 2);
	if (commandPath.length !== 1) return null;
	const [commandName] = commandPath;
	return commandName === "browser" || commandName === "secrets" || commandName === "nodes" ? commandName : null;
}
async function tryOutputPrecomputedCommandHelp(argv, deps = {}) {
	const env = deps.env ?? process.env;
	if (env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1") return false;
	const commandName = resolvePrecomputedCommandHelpName(argv);
	const subcommandName = commandName ? null : resolvePrecomputedSubcommandHelpCommand(argv);
	if (subcommandName) return (deps.outputPrecomputedSubcommandHelpText ?? (await loadRootHelpMetadataModule()).outputPrecomputedSubcommandHelpText)(subcommandName);
	if (!commandName) return false;
	if (commandName === "nodes") {
		if (await (deps.loadRootHelpRenderOptionsForConfigSensitivePlugins ?? (await loadRootHelpLiveConfigModule()).loadRootHelpRenderOptionsForConfigSensitivePlugins)(env)) return false;
	}
	if (commandName === "browser") return (deps.outputPrecomputedBrowserHelpText ?? (await loadRootHelpMetadataModule()).outputPrecomputedBrowserHelpText)();
	if (commandName === "secrets") return (deps.outputPrecomputedSecretsHelpText ?? (await loadRootHelpMetadataModule()).outputPrecomputedSecretsHelpText)();
	return (deps.outputPrecomputedNodesHelpText ?? (await loadRootHelpMetadataModule()).outputPrecomputedNodesHelpText)();
}
//#endregion
export { tryOutputPrecomputedCommandHelp as t };
