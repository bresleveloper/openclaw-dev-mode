import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { t as registerQrCli } from "./qr-cli-rXX6J2Fb.mjs";
//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	const clawbot = program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => formatDocsHelp("/cli/clawbot"));
	registerQrCli(clawbot);
}
//#endregion
export { registerClawbotCli };
