import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-ClVfZRCr.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
//#region src/cli/program/register.storage.ts
function registerStorageCommand(program) {
	const storage = program.command("storage").description("List, initialize, and test configured storage locations").option("--json", "Output JSON", false).addHelpText("after", `\nDocs: ${formatDocsLink("/cli/storage", "docs.openclaw.ai/cli/storage")}\n`);
	applyParentDefaultHelpAction(storage);
	storage.command("list").description("List storage locations and probe their availability").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { storageListCommand } = await import("./storage-DfHaUimg.mjs");
			await storageListCommand(defaultRuntime, { json: (inheritOptionFromParent(command, "json") ?? opts.json) === true });
		});
	});
	for (const [operation, description, handler] of [[
		"init",
		"Initialize a new location or verify its existing marker and encryption key",
		"storageInitCommand"
	], [
		"test",
		"Write, read, verify, and delete a temporary probe object",
		"storageTestCommand"
	]]) storage.command(`${operation} <name>`).description(description).option("--json", "Output JSON", false).action((name, opts, command) => runCommandWithRuntime(defaultRuntime, async () => {
		await (await import("./storage-DfHaUimg.mjs"))[handler](defaultRuntime, name, { json: (inheritOptionFromParent(command, "json") ?? opts.json) === true });
	}));
}
//#endregion
export { registerStorageCommand };
