import { getRootOptionAwareCommandPath } from "openclaw/plugin-sdk/cli-argv";
//#region extensions/memory-lancedb/cli-output-mode.ts
/** LanceDB inspection commands emit JSON as their only presentation. */
function isMemoryMachineOutput(params) {
	const [, command] = getRootOptionAwareCommandPath(params.argv, 2);
	return [
		"list",
		"query",
		"search"
	].includes(command ?? "");
}
//#endregion
export { isMemoryMachineOutput };
