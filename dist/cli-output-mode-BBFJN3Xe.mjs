import { o as getRootOptionAwareCommandPath } from "./cli-root-options-DGcy1qRg.mjs";
//#region extensions/policy/src/cli-output-mode.ts
/** Policy commands follow Unix convention and switch to JSON when stdout is not a terminal. */
function isPolicyMachineOutput(params) {
	const [, command] = getRootOptionAwareCommandPath(params.argv, 2);
	return [
		"check",
		"compare",
		"watch"
	].includes(command ?? "") && !params.stdoutIsTTY;
}
const POLICY_CLI_DESCRIPTOR = {
	name: "policy",
	description: "Check policy requirements and emit audit evidence",
	hasSubcommands: true,
	machineOutput: isPolicyMachineOutput
};
//#endregion
export { POLICY_CLI_DESCRIPTOR as t };
