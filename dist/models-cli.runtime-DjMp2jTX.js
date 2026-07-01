import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { n as runCommandWithRuntime, t as resolveOptionFromCommand } from "./cli-utils-ht0sKPTG.js";
//#region src/cli/models-cli.runtime.ts
function runModelsCommand(action) {
	return runCommandWithRuntime(defaultRuntime, action);
}
function resolveModelAgentOption(command, opts) {
	return resolveOptionFromCommand(command, "agent") ?? (typeof opts?.agent === "string" ? opts.agent : void 0);
}
function rejectAgentScopedModelWrite(command, commandName) {
	if (!resolveOptionFromCommand(command, "agent")) return;
	throw new Error(`openclaw models ${commandName} does not support --agent; it only updates global model defaults. Remove --agent, or run ${formatCliCommand("openclaw agents list")} and set the per-agent model in agent config.`);
}
//#endregion
export { defaultRuntime, rejectAgentScopedModelWrite, resolveModelAgentOption, runModelsCommand };
