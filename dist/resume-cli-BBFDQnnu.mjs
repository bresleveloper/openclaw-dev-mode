import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { t as addTuiOptions } from "./tui-cli-options-5C6_KTVs.mjs";
//#region src/cli/resume-cli.ts
/** Register the Gateway-backed session resume command. */
function registerResumeCli(program) {
	const command = program.command("resume").description("Resume a recent Gateway session in the TUI").argument("[query]", "Session key, display name, or label").option("--handoff <payload>", "Opaque session handoff copied from the Control UI");
	addTuiOptions(command).addHelpText("after", () => formatDocsHelp("/cli/resume")).action(async (query, opts) => {
		try {
			const { runResumeCommand } = await import("./resume-cli.runtime.js");
			await runResumeCommand(query, opts);
		} catch (error) {
			defaultRuntime.error(formatErrorMessage(error));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerResumeCli };
