import { v as requireActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import { t as listRegisteredPluginCommands } from "./plugin-command-registry-DJl3dxiE.mjs";
import "./command-registry-state-BssLGv4I.mjs";
import "./command-registration-Dh_lH4ph.mjs";
import { t as executeRegisteredPluginCommand } from "./plugin-command-execution-D9JVXZVZ.mjs";
import { t as matchRegisteredPluginCommand } from "./plugin-command-matcher-BAtE_6-D.mjs";
//#region src/plugins/commands.ts
/** Match one compatibility command invocation against the current command registry. */
function matchPluginCommand(commandBody, options = {}) {
	const registry = requireActivePluginRegistry();
	return matchRegisteredPluginCommand({
		commands: listRegisteredPluginCommands(registry),
		commandBody,
		channel: options.channel,
		aliasScope: { kind: "all" }
	});
}
async function executePluginCommand(params) {
	return await executeRegisteredPluginCommand(requireActivePluginRegistry(), params);
}
/** List registered plugin commands for help and command discovery. */
function listPluginCommands() {
	return listRegisteredPluginCommands(requireActivePluginRegistry()).map((command) => ({
		name: command.name,
		description: command.description,
		pluginId: command.pluginId,
		acceptsArgs: command.acceptsArgs ?? false
	}));
}
//#endregion
export { listPluginCommands as n, matchPluginCommand as r, executePluginCommand as t };
