import { m as theme } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import "./subsystem-D-lLN9nd.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-gyYFUuWS.js";
import "./agent-scope-Cp0IkEKB.js";
import "./utils-DMInpDZe.js";
import "./openclaw-root-D_NGSHjv.js";
import "./logger-lJby90xW.js";
import "./exec-9-lXnoNH.js";
import "./github-copilot-token-CcBrBN3h.js";
import "./host-env-security-BnQcDbLl.js";
import "./version-Bxx5bg6l.js";
import "./runtime-overrides-BrDRV8AG.js";
import "./registry-XwiWGUVE.js";
import "./manifest-registry-DpwUhr6x.js";
import "./message-channel-CBxyiPG1.js";
import "./tailnet-_7OomAtX.js";
import "./ws-skc9U6x4.js";
import "./client-x1tOQWHk.js";
import "./call-CT_1cdY_.js";
import "./pairing-token-B2YLkyDu.js";
import "./runtime-config-collectors-jWlsdfoA.js";
import "./command-secret-targets-CJcKbZna.js";
import { t as formatDocsLink } from "./links-CPpbuTOP.js";
import { n as registerQrCli } from "./qr-cli-ChmlxG3D.js";
//#region src/cli/clawbot-cli.ts
function registerClawbotCli(program) {
	registerQrCli(program.command("clawbot").description("Legacy clawbot command aliases").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`));
}
//#endregion
export { registerClawbotCli };
