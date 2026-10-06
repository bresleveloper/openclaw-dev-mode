import { r as theme } from "../theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "../links-B3qXeqz-.mjs";
import { t as addGatewayServiceCommands } from "../register-service-commands-DqxJEPTn.mjs";
import { t as finishUpdateRun } from "../update-run-write-LHXvyI9z.mjs";
import { d as recordUpdateRunDiagnostic, g as recordUpdateRunVerification, h as recordUpdateRunStep, n as adoptUpdateRun } from "../update-run-ledger-BsP8HD11.mjs";
import { r as getUpdateRun } from "../update-run-reader-B17V1KuC.mjs";
import { n as runDaemonInstall } from "../install-CErCcLnQ.mjs";
import { i as prepareManagedUpdateRequesterIdentity, n as createManagedUpdateRequesterAuthority } from "../update-requester-authority-DyrWcayv.mjs";
import { a as isManagedUpdateRequesterOwner, i as runDaemonUninstall, n as runDaemonStart, o as waitForGatewayUpdateRecovery, r as runDaemonStop, t as runDaemonRestart } from "../lifecycle-CGaIvIps.mjs";
import { t as runDaemonStatus } from "../status-7sYp7tbn.mjs";
import { t as assertForegroundUpdateOrigin } from "../update-managed-service-handoff-7nmoIh-f.mjs";
//#region src/cli/daemon-cli/register.ts
/** Register the legacy daemon command group. */
function registerDaemonCli(program) {
	const daemon = program.command("daemon").description("Manage the Gateway service (launchd/systemd/schtasks)").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.openclaw.ai/cli/gateway")}\n`);
	addGatewayServiceCommands(daemon, { statusDescription: "Show service install status + probe connectivity/capability" });
}
//#endregion
export { addGatewayServiceCommands, adoptUpdateRun, assertForegroundUpdateOrigin, createManagedUpdateRequesterAuthority, finishUpdateRun, getUpdateRun, isManagedUpdateRequesterOwner, prepareManagedUpdateRequesterIdentity, recordUpdateRunDiagnostic, recordUpdateRunStep, recordUpdateRunVerification, registerDaemonCli, runDaemonInstall, runDaemonRestart, runDaemonStart, runDaemonStatus, runDaemonStop, runDaemonUninstall, waitForGatewayUpdateRecovery };
