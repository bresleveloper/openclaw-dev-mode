import { Command, InvalidArgumentError } from "commander";
//#region src/cli/node-cli/command-options.ts
function createNodeWorkerCommand() {
	return new Command("worker").description("Run the private macOS app node-host worker").option("--desktop-sharing", "Enable the app's desktop viewer capability").option("--no-desktop-sharing", "Disable the app's desktop viewer capability");
}
/** Collect repeatable, comma-separated exact node command ids without treating patterns as globs. */
function collectNodeCommandIds(value, previous = []) {
	const ids = value.split(",").map((id) => id.trim());
	if (ids.some((id) => !id)) throw new InvalidArgumentError("--commands requires comma-separated non-empty command ids");
	return [.../* @__PURE__ */ new Set([...previous, ...ids])].toSorted();
}
function addNodeCommandOptions(command) {
	return command.option("--commands <ids>", "Advertise only these exact command ids (comma-separated; repeatable)", collectNodeCommandIds).option("--all-commands", "Advertise the full default command surface and forget any saved --commands allowlist").hook("preAction", (_command, actionCommand) => {
		const opts = actionCommand.optsWithGlobals();
		if (opts.allCommands && opts.commands !== void 0) actionCommand.error("--all-commands cannot be combined with --commands", { code: "commander.conflictingOption" });
	});
}
//#endregion
export { createNodeWorkerCommand as n, addNodeCommandOptions as t };
