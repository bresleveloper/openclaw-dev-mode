//#region extensions/oc-path/cli-registration.ts
function hasCliFlag(argv, flag) {
	for (const arg of argv.slice(2)) {
		if (arg === "--") return false;
		if (arg === flag) return true;
	}
	return false;
}
function isPathMachineOutput(params) {
	if (hasCliFlag(params.argv, "--json")) return true;
	return !hasCliFlag(params.argv, "--human") && !params.stdoutIsTTY;
}
function registerOcPathCli(api) {
	api.registerCli(async ({ program }) => {
		const { registerPathCli } = await import("./cli-pfXjHOvq.mjs");
		registerPathCli(program);
	}, { descriptors: [{
		name: "path",
		description: "Inspect and edit workspace files via oc:// paths",
		hasSubcommands: true,
		machineOutput: isPathMachineOutput
	}] });
}
//#endregion
export { registerOcPathCli as t };
