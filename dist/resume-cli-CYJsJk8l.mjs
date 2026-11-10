import { r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { t as addTuiOptions } from "./tui-cli-options-DeIDq01-.mjs";
//#region src/cli/resume-cli.ts
function registerResumeCli(program) {
	const command = program.command("resume").description("Resume a recent Gateway session in the TUI").argument("[query]", "Session key, display name, or label").option("--handoff <payload>", "Opaque session handoff copied from the Control UI");
	addTuiOptions(command).addHelpText("after", () => formatDocsHelp("/cli/resume")).action(async (query, opts) => {
		try {
			const { runResumeCommand } = await import("./resume-cli.runtime.js");
			await runResumeCommand(query, opts);
		} catch (error) {
			if (error instanceof ExitError) throw error;
			defaultRuntime.error(formatErrorMessage(error));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerResumeCli };
