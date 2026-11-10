import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { i as formatCliOperatorError } from "./failure-output-CpIKhMiV.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-C0bJ9VIR.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
//#region src/cli/program/register.storage.ts
function reportStorageError(error) {
	defaultRuntime.error(sanitizeTerminalText(formatCliOperatorError(error)));
	defaultRuntime.exit(1);
}
function registerStorageCommand(program) {
	const storage = program.command("storage").description("List, initialize, and test configured storage locations").option("--json", "Output JSON", false).addHelpText("after", `\nDocs: ${formatDocsLink("/cli/storage", "docs.openclaw.ai/cli/storage")}\n`);
	applyParentDefaultHelpAction(storage);
	storage.command("list").description("List storage locations and check their availability").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { storageListCommand } = await import("./storage-R-eH7fGS.mjs");
			await storageListCommand(defaultRuntime, { json: (inheritOptionFromParent(command, "json") ?? opts.json) === true });
		}, reportStorageError);
	});
	for (const [operation, description, handler] of [[
		"init",
		"Initialize a new location or verify its existing marker and encryption key",
		"storageInitCommand"
	], [
		"test",
		"Write, read, verify, and delete a temporary check object",
		"storageTestCommand"
	]]) storage.command(`${operation} <name>`).description(description).option("--json", "Output JSON", false).action((name, opts, command) => runCommandWithRuntime(defaultRuntime, async () => {
		await (await import("./storage-R-eH7fGS.mjs"))[handler](defaultRuntime, name, { json: (inheritOptionFromParent(command, "json") ?? opts.json) === true });
	}, reportStorageError));
}
//#endregion
export { registerStorageCommand };
