import { r as theme } from "../theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "../links-B3qXeqz-.mjs";
import { t as addGatewayServiceCommands } from "../register-service-commands-BZkYt2Ks.mjs";
import { t as finishUpdateRun } from "../update-run-write-cd5VZ7fL.mjs";
import { d as recordUpdateRunDiagnostic, g as recordUpdateRunVerification, h as recordUpdateRunStep, n as adoptUpdateRun } from "../update-run-ledger-DE3m4CLB.mjs";
import { r as getUpdateRun } from "../update-run-reader-B17V1KuC.mjs";
import { n as runDaemonInstall } from "../install-BnFC52Yq.mjs";
import { i as prepareManagedUpdateRequesterIdentity, n as createManagedUpdateRequesterAuthority } from "../update-requester-authority-DM9cJimf.mjs";
import { a as isManagedUpdateRequesterOwner, i as runDaemonUninstall, n as runDaemonStart, o as waitForGatewayUpdateRecovery, r as runDaemonStop, t as runDaemonRestart } from "../lifecycle-BcNM_y3G.mjs";
import { t as runDaemonStatus } from "../status-2_Nq0jCR.mjs";
import { t as assertForegroundUpdateOrigin } from "../update-managed-service-handoff-BdMa8sfK.mjs";
//#region src/cli/daemon-cli/register.ts
/** Register the legacy daemon command group. */
function registerDaemonCli(program) {
	const daemon = program.command("daemon").description("Manage the Gateway service (launchd/systemd/schtasks)").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.openclaw.ai/cli/gateway")}\n`);
	addGatewayServiceCommands(daemon, { statusDescription: "Show service install status + probe connectivity/capability" });
}
//#endregion
export { addGatewayServiceCommands, adoptUpdateRun, assertForegroundUpdateOrigin, createManagedUpdateRequesterAuthority, finishUpdateRun, getUpdateRun, isManagedUpdateRequesterOwner, prepareManagedUpdateRequesterIdentity, recordUpdateRunDiagnostic, recordUpdateRunStep, recordUpdateRunVerification, registerDaemonCli, runDaemonInstall, runDaemonRestart, runDaemonStart, runDaemonStatus, runDaemonStop, runDaemonUninstall, waitForGatewayUpdateRecovery };
