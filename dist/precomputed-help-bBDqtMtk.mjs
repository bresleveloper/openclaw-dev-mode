import { f as isSimpleCommandHelpInvocation, n as getCommandPathWithRootOptions } from "./argv-D_Nxd_3s.mjs";
import { t as PRECOMPUTED_SUBCOMMAND_HELP_NAMES } from "./precomputed-help-commands-DCmogzXw.mjs";
//#region src/cli/precomputed-help.ts
const PRECOMPUTED_COMMAND_HELP_NAMES = /* @__PURE__ */ new Set([
	"browser",
	"secrets",
	"nodes"
]);
const PRECOMPUTED_SUBCOMMAND_HELP_COMMANDS = new Set(PRECOMPUTED_SUBCOMMAND_HELP_NAMES);
function resolvePrecomputedCommandHelpName(argv, commandNames) {
	if (!isSimpleCommandHelpInvocation(argv, commandNames)) return null;
	const [commandName, extra] = getCommandPathWithRootOptions(argv, 2);
	return extra === void 0 ? [...commandNames].find((name) => name === commandName) ?? null : null;
}
async function tryOutputPrecomputedCommandHelp(argv) {
	const env = process.env;
	if (env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1") return false;
	const commandName = resolvePrecomputedCommandHelpName(argv, PRECOMPUTED_COMMAND_HELP_NAMES);
	const subcommandName = commandName ? null : resolvePrecomputedCommandHelpName(argv, PRECOMPUTED_SUBCOMMAND_HELP_COMMANDS);
	if (subcommandName) {
		const { outputPrecomputedSubcommandHelpText } = await import("./root-help-metadata-DJawK_mA.mjs");
		return outputPrecomputedSubcommandHelpText(subcommandName);
	}
	if (!commandName) return false;
	if (commandName === "nodes") {
		const { loadRootHelpRenderOptionsForConfigSensitivePlugins } = await import("./root-help-live-config-DLFpCf-w.mjs");
		if (await loadRootHelpRenderOptionsForConfigSensitivePlugins(env)) return false;
	}
	const output = (await import("./root-help-metadata-DJawK_mA.mjs"))[{
		browser: "outputPrecomputedBrowserHelpText",
		secrets: "outputPrecomputedSecretsHelpText",
		nodes: "outputPrecomputedNodesHelpText"
	}[commandName]];
	return output();
}
//#endregion
export { tryOutputPrecomputedCommandHelp as t };
