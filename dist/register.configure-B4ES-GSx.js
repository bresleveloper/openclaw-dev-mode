import { t as formatDocsLink } from "./links-CsLBrRff.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { n as runCommandWithRuntime } from "./cli-utils-ht0sKPTG.js";
import { n as CONFIGURE_WIZARD_SECTIONS } from "./configure.shared-D5WUAw_U.js";
//#region src/cli/program/register.configure.ts
/** Register the interactive `configure` command and section filter flag. */
function registerConfigureCommand(program) {
	program.command("configure").description("Interactive configuration for credentials, channels, gateway, and agent defaults").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/configure", "docs.openclaw.ai/cli/configure")}\n`).option("--section <section>", `Configuration sections (repeatable). Options: ${CONFIGURE_WIZARD_SECTIONS.join(", ")}`, (value, previous) => [...previous, value], []).action(async (opts) => {
		const { defaultRuntime } = await import("./runtime-Dc6wmxIA.js");
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { configureCommandFromSectionsArg } = await import("./configure.commands-BZOWP8Wo.js");
			await configureCommandFromSectionsArg(opts.section, defaultRuntime);
		});
	});
}
//#endregion
export { registerConfigureCommand };
