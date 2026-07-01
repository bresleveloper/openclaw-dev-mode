import { r as theme } from "./theme-vjDs9tao.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { t as runCrestodian } from "./crestodian-BIbiFwlh.js";
import { n as runCommandWithRuntime } from "./cli-utils-ht0sKPTG.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
//#region src/cli/program/register.crestodian.ts
/** Register the Crestodian helper command and its one-shot request flags. */
function registerCrestodianCommand(program) {
	program.command("crestodian").description("Open the ring-zero setup and repair helper").option("-m, --message <text>", "Run one Crestodian request").option("--yes", "Approve persistent config writes for this request", false).option("--json", "Output startup overview as JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw", "Start Crestodian."],
		["openclaw crestodian", "Start Crestodian explicitly."],
		["openclaw crestodian -m \"status\"", "Run one status request."],
		["openclaw crestodian -m \"set default model openai/gpt-5.2\" --yes", "Apply a typed config write."]
	])}`).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await runCrestodian({
				message: opts.message,
				yes: Boolean(opts.yes),
				json: Boolean(opts.json)
			});
		});
	});
}
//#endregion
export { registerCrestodianCommand };
