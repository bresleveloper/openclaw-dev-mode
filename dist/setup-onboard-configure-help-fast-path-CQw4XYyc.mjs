import { f as isSimpleCommandHelpInvocation, n as getCommandPathWithRootOptions } from "./argv-C7hqFLn5.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { t as configureProgramHelp } from "./help-CARbRKBi.mjs";
import { Command, CommanderError } from "commander";
//#region src/cli/setup-onboard-configure-help-fast-path.ts
const SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"setup",
	"onboard",
	"configure"
]);
async function tryOutputSetupOnboardConfigureHelp(argv) {
	if (!isSimpleCommandHelpInvocation(argv, SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS)) return false;
	const program = new Command();
	program.enablePositionalOptions();
	program.exitOverride();
	configureProgramHelp(program, { programVersion: VERSION });
	const [command] = getCommandPathWithRootOptions(argv, 1);
	if (command === "setup") {
		const { registerSetupCommand } = await import("./register.setup-B1XLTIbj.mjs");
		registerSetupCommand(program);
	} else if (command === "onboard") {
		const { registerOnboardCommand } = await import("./register.onboard-CC3sQb1s.mjs");
		registerOnboardCommand(program);
	} else {
		const { registerConfigureCommand } = await import("./register.configure-CUcvVRK3.mjs");
		registerConfigureCommand(program);
	}
	try {
		await program.parseAsync(argv);
	} catch (error) {
		if (!(error instanceof CommanderError)) throw error;
		process.exitCode = error.exitCode;
	}
	return true;
}
//#endregion
export { tryOutputSetupOnboardConfigureHelp };
