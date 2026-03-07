import "./paths-BJV7vkaX.js";
import { m as theme } from "./globals-BozXJ-QJ.js";
import "./utils-BzWe_IKB.js";
import "./agent-scope-BJ-A8vSB.js";
import "./subsystem-DEHxNIeh.js";
import "./openclaw-root-pxEnyCPl.js";
import "./logger-CybQ0xau.js";
import "./exec-BpxsjP05.js";
import "./model-selection-CX4C7NZp.js";
import "./github-copilot-token-BQoM_VEX.js";
import "./boolean-D8Ha5nYV.js";
import "./env-ZTsIDHVm.js";
import "./host-env-security-8lfqCQOD.js";
import "./runtime-overrides-CzZbXh6c.js";
import "./registry-CAMKAMjq.js";
import "./manifest-registry-CWvKZnOp.js";
import "./message-channel-DQep2kbh.js";
import "./tailnet-CjKuOt5U.js";
import "./ws-BeoXlzsZ.js";
import "./client-CaaDgxx2.js";
import "./call-Ch1eylWu.js";
import "./pairing-token-BiCaqjaN.js";
import "./runtime-config-collectors-BgRo9iWt.js";
import "./command-secret-targets-B22Udz2k.js";
import { t as formatDocsLink } from "./links-D4VD_bBP.js";
import { n as registerQrCli } from "./qr-cli-B7Spd7nH.js";
//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	registerQrCli(program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`));
}
//#endregion
export { registerClawbotCli };
