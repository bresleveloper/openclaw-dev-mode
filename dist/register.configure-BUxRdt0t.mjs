import { n as runCommandWithRuntime } from "./cli-utils-ClVfZRCr.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { t as collectOption } from "./helpers-Bbrcmhji.mjs";
import { n as CONFIGURE_WIZARD_SECTIONS } from "./configure.shared-BQl13HhB.mjs";
//#region src/cli/program/register.configure.ts
function registerConfigureCommand(program) {
	program.command("configure").description("Interactive configuration for credentials, channels, gateway, and agent defaults").addHelpText("after", () => formatDocsHelp("/cli/configure")).option("--section <section>", `Configuration sections (repeatable). Options: ${CONFIGURE_WIZARD_SECTIONS.join(", ")}`, collectOption, []).action(async (opts) => {
		const { defaultRuntime } = await import("./runtime-C3rISTtF.mjs");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { configureCommandFromSectionsArg } = await import("./configure.commands-CbTa7THd.mjs");
			await configureCommandFromSectionsArg(opts.section, defaultRuntime);
		});
	});
}
//#endregion
export { registerConfigureCommand };
