import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { t as registerQrCli } from "./qr-cli-rskK3j31.mjs";
//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	const clawbot = program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`);
	registerQrCli(clawbot);
}
//#endregion
export { registerClawbotCli };
