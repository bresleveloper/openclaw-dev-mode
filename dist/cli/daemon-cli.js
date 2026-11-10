import { t as formatErrorMessage } from "../errors-DPfGDWk1.mjs";
import { r as theme } from "../theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "../links-4Bgsoz0M.mjs";
import { t as addGatewayServiceCommands } from "../register-service-commands-BoSvCY52.mjs";
import { o as finishUpdateRun } from "../update-run-write-Dd5ORe9V.mjs";
import { c as recordUpdateRunDiagnostic, f as recordUpdateRunStep, n as adoptUpdateRun, p as recordUpdateRunVerification } from "../update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun, l as listUpdateRuns } from "../update-run-reader-BOC3s3Sk.mjs";
import { o as refreshUpdateRunReportArtifact } from "../update-failure-report-artifact-ZpnzvCW7.mjs";
import { a as prepareManagedUpdateRequesterIdentity, r as createManagedUpdateRequesterAuthority } from "../update-requester-authority-BP771TSP.mjs";
//#region src/cli/daemon-cli/register.ts
/** Register the legacy daemon command group. */
function registerDaemonCli(program) {
	const daemon = program.command("daemon").description("Manage the Gateway service (launchd/systemd/schtasks)").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.openclaw.ai/cli/gateway")}\n`);
	addGatewayServiceCommands(daemon, { statusDescription: "Show service install status + check connectivity/capability" });
}
//#endregion
//#region src/cli/daemon-cli/update-run.ts
/** Stable recovery entry used by installed managed-update drivers. */
async function finishDaemonUpdateRun(runId, result, options = {}) {
	const run = finishUpdateRun(runId, result, options);
	try {
		await refreshUpdateRunReportArtifact(run, options);
	} catch (error) {
		console.warn(`Update report could not be saved: ${formatErrorMessage(error)}`);
	}
	return run;
}
//#endregion
//#region src/cli/daemon-cli.ts
const loadInstallRuntime = () => import("../install-CXX2qd-f.mjs");
const loadLifecycleRuntime = () => import("../lifecycle-BErCSKbH.mjs");
const loadStatusRuntime = () => import("../status-CL-pgx7L.mjs");
const loadLifecycleContextRuntime = () => import("../lifecycle-context-BN6_tkGC.mjs");
const loadServiceHandoffRuntime = () => import("../update-managed-service-handoff-BSESNMoK.mjs");
async function runDaemonInstall(opts) {
	return (await loadInstallRuntime()).runDaemonInstall(opts);
}
async function runDaemonRestart(opts = {}) {
	return (await loadLifecycleRuntime()).runDaemonRestart(opts);
}
async function runDaemonStart(opts = {}) {
	return (await loadLifecycleRuntime()).runDaemonStart(opts);
}
async function runDaemonStop(opts = {}) {
	return (await loadLifecycleRuntime()).runDaemonStop(opts);
}
async function runDaemonUninstall(opts = {}) {
	return (await loadLifecycleRuntime()).runDaemonUninstall(opts);
}
async function runDaemonStatus(opts) {
	return (await loadStatusRuntime()).runDaemonStatus(opts);
}
async function isManagedUpdateRequesterOwner(...args) {
	return (await loadLifecycleContextRuntime()).isManagedUpdateRequesterOwner(...args);
}
async function waitForGatewayUpdateRecovery(...args) {
	return (await loadLifecycleContextRuntime()).waitForGatewayUpdateRecovery(...args);
}
async function assertForegroundUpdateOrigin(...args) {
	return (await loadServiceHandoffRuntime()).assertForegroundUpdateOrigin(...args);
}
//#endregion
export { addGatewayServiceCommands, adoptUpdateRun, assertForegroundUpdateOrigin, createManagedUpdateRequesterAuthority, finishDaemonUpdateRun as finishUpdateRun, getUpdateRun, isManagedUpdateRequesterOwner, listUpdateRuns, prepareManagedUpdateRequesterIdentity, recordUpdateRunDiagnostic, recordUpdateRunStep, recordUpdateRunVerification, registerDaemonCli, runDaemonInstall, runDaemonRestart, runDaemonStart, runDaemonStatus, runDaemonStop, runDaemonUninstall, waitForGatewayUpdateRecovery };
