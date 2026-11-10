import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as runCommandWithRuntime, t as resolveOptionFromCommand } from "./cli-utils-C0bJ9VIR.mjs";
//#region src/cli/models-cli.runtime.ts
function runModelsCommand(action) {
	return runCommandWithRuntime(defaultRuntime, action);
}
function resolveModelAgentOption(command) {
	return resolveOptionFromCommand(command, "agent");
}
function rejectAgentScopedModelCommand(command, commandName) {
	if (resolveOptionFromCommand(command, "agent") === void 0) return;
	throw new Error(`openclaw models ${commandName} does not support --agent; it is global and never agent-scoped. Remove --agent, or run ${formatCliCommand("openclaw agents list")} and set the per-agent model in agent config.`);
}
//#endregion
export { defaultRuntime, rejectAgentScopedModelCommand, resolveModelAgentOption, runModelsCommand };
