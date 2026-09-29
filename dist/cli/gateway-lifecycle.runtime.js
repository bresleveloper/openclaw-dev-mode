import { c as isWindowsTaskSupervisorChildArgument, l as readWindowsTaskSupervisorRestartExitCode } from "../windows-task-supervisor-contract-DlaAkrWJ.mjs";
import { a as rewritePnpmVersionedOpenClawEntryPath } from "../openclaw-root-Cur9Uhkp.mjs";
import { n as isTruthyEnvValue } from "../env-C4a8LL2I.mjs";
import { t as formatErrorMessage } from "../errors-DnjwnOju.mjs";
import { i as detectRespawnSupervisor, n as detectGatewayRespawnSupervisor, r as detectGatewayRespawnSupervisorIdentity } from "../supervisor-markers-DL2AtFkv.mjs";
import { t as isContainerEnvironment } from "../container-environment-CNsJSTpY.mjs";
import { E as writeRestartSentinelIfUnchanged, g as readRestartSentinelReadOnly, m as markUpdateRestartSentinelFailure } from "../restart-sentinel-KM6PPxhT.mjs";
import { n as scheduleDetachedLaunchdRestartHandoff } from "../launchd-restart-handoff-_boJ24Gr.mjs";
import { n as resolveGatewayRestartDrainTimeoutMs } from "../restart-budget-4VeKpJhh.mjs";
import { n as waitForGatewayHealthyRestart } from "../restart-health-By4lclzW.mjs";
import { n as consumeGatewayRestartIntentPayloadSync, r as consumeGatewayRestartIntentSync } from "../restart-intent-hiIYFAg0.mjs";
import { i as writeGatewayRestartHandoffSync } from "../restart-handoff-Cb-qLJTf.mjs";
import { a as claimManagedServiceUpdateHandoff, f as requestManagedServiceUpdateHandoffPark, i as captureForegroundUpdateHandoffStop, o as commitManagedServiceUpdateHandoff, r as cancelManagedServiceUpdateHandoff, s as completeForegroundUpdateHandoffAfterClose, u as isForegroundUpdateHandoff } from "../update-managed-service-handoff-DYKI1y2T.mjs";
import { _ as rotateAgentEventLifecycleGeneration } from "../agent-events-BOSJcayE.mjs";
import { r as reloadTaskRuntimeStateFromStore } from "../runtime-internal-BQjc0KPP.mjs";
import { a as getDiagnosticSessionActivitySnapshot } from "../diagnostic-run-activity-DTzzZJ-S.mjs";
import { s as writeDiagnosticStabilityBundleForFailureSync } from "../diagnostic-stability-bundle-CqpC4la9.mjs";
import { n as abortEmbeddedAgentRun } from "../runs-Cjzxx3Pg.mjs";
import { n as listActiveEmbeddedRunSessionIds } from "../active-run-projections-BHX_SDCX.mjs";
import { a as markGatewayRestartHandled, c as resetGatewayRestartStateForInProcessRestart, g as abortPendingChannelReloads, i as isGatewayRestartExternallyAllowed, l as rollbackGatewayRestartSignalAdmission, n as consumeGatewayRestartIntent, o as peekGatewayRestartReason, p as triggerOpenClawRestart, s as requestGatewayRestartWithSignalAdmission, t as consumeGatewayRestartAuthorization, u as scheduleGatewayRestart } from "../restart-Bb4QxGMO.mjs";
import { E as waitForActiveCronJobs, T as resetCronActiveJobs, t as advanceCronActiveJobGeneration } from "../active-jobs-BdNx3YyC.mjs";
import { a as retireActiveCronTaskRunTracking, s as waitForActiveCronTaskRuns, t as abortActiveCronTaskRuns } from "../active-run-cancellation-BIgTNPfC.mjs";
import { f as markGatewayDraining, m as resetAllLanes } from "../command-queue-CaY517ob.mjs";
import { r as waitForGatewayActiveWork, t as createGatewayActiveWorkSnapshot } from "../gateway-active-work-DTnRXeHJ.mjs";
import { o as resetGatewaySuspendCoordinatorForLifecycleRestart } from "../gateway-suspend-coordinator-DU88ad_C.mjs";
import { spawn } from "node:child_process";
//#region src/infra/process-respawn.ts
function resolveGatewayRestartDecision() {
	if (isTruthyEnvValue(process.env.OPENCLAW_NO_RESPAWN)) return {
		mode: "disabled",
		reason: "no-respawn"
	};
	const supervisor = detectGatewayRespawnSupervisor(process.env);
	if (supervisor) return {
		mode: "supervised",
		supervisor
	};
	return {
		mode: "disabled",
		reason: "unmanaged",
		detail: process.platform === "win32" ? "win32: detached respawn unsupported without Scheduled Task markers" : isContainerEnvironment() ? "container: use in-process restart to keep PID 1 alive" : "unmanaged: use in-process restart to keep custom supervisor PID tracking stable"
	};
}
/**
* Attempt to restart this process with a fresh PID.
* - supervised environments (launchd/systemd/schtasks): caller should exit and let supervisor restart
* - OPENCLAW_NO_RESPAWN=1: caller should keep in-process restart behavior (tests/dev)
* - unmanaged environments: caller should keep in-process restart behavior so
*   custom supervisors keep tracking the same gateway PID
*/
function restartGatewayProcessWithFreshPid(opts = {}) {
	const decision = opts.decision ?? resolveGatewayRestartDecision();
	if (decision.mode === "disabled") return decision.reason === "no-respawn" ? { mode: "disabled" } : {
		mode: "disabled",
		detail: decision.detail
	};
	const { supervisor } = decision;
	if (supervisor === "launchd") {
		const handoff = scheduleDetachedLaunchdRestartHandoff({
			mode: "start-after-exit",
			waitForPid: process.pid
		});
		return handoff.ok ? {
			mode: "supervised",
			handoffSpawned: handoff.value
		} : {
			mode: "failed",
			detail: handoff.error
		};
	}
	if (supervisor === "schtasks") {
		if (process.argv.some(isWindowsTaskSupervisorChildArgument)) {
			const exitCode = readWindowsTaskSupervisorRestartExitCode(process.argv);
			if (exitCode === void 0) return {
				mode: "failed",
				detail: "Windows task supervisor restart marker is missing or invalid"
			};
			return {
				mode: "supervised",
				exitCode
			};
		}
		const restart = triggerOpenClawRestart();
		if (!restart.ok) return {
			mode: "failed",
			detail: restart.detail ?? `${restart.method} restart failed`
		};
	}
	return { mode: "supervised" };
}
/**
* Update restarts must replace the OS process so the new code runs from a
* fresh module graph after package files have changed on disk.
*
* The caller resolves supervisor ownership first; this path is only for an
* unmanaged process whose installed package contents have been replaced.
*/
function respawnGatewayProcessForUpdate(opts = {}) {
	const decision = opts.decision ?? resolveGatewayRestartDecision();
	if (decision.mode === "disabled" && decision.reason === "no-respawn") return {
		mode: "disabled",
		detail: "OPENCLAW_NO_RESPAWN"
	};
	try {
		const [entryArg, ...entryArgs] = process.argv.slice(1);
		const args = [
			...process.execArgv,
			...entryArg ? [rewritePnpmVersionedOpenClawEntryPath(entryArg)] : [],
			...entryArgs
		];
		const child = spawn(process.execPath, args, {
			env: opts.env ? {
				...process.env,
				...opts.env
			} : process.env,
			detached: true,
			stdio: "inherit"
		});
		child.on("error", () => {});
		child.unref();
		return {
			mode: "spawned",
			pid: child.pid ?? void 0,
			child
		};
	} catch (err) {
		return {
			mode: "failed",
			detail: formatErrorMessage(err)
		};
	}
}
//#endregion
//#region src/cli/gateway-cli/lifecycle.runtime.ts
async function stopGatewayManagedProviderLocalServices() {
	const { hasManagedProviderLocalServices } = await import("../provider-runtime-lifecycle-B_VEgtSV.mjs");
	if (!hasManagedProviderLocalServices()) return;
	const { stopManagedProviderLocalServices } = await import("../provider-local-service-q1tyyCxV.mjs");
	await stopManagedProviderLocalServices();
}
//#endregion
export { abortActiveCronTaskRuns, abortEmbeddedAgentRun, abortPendingChannelReloads, advanceCronActiveJobGeneration, cancelManagedServiceUpdateHandoff, captureForegroundUpdateHandoffStop, claimManagedServiceUpdateHandoff, commitManagedServiceUpdateHandoff, completeForegroundUpdateHandoffAfterClose, consumeGatewayRestartAuthorization, consumeGatewayRestartIntent, consumeGatewayRestartIntentPayloadSync, consumeGatewayRestartIntentSync, createGatewayActiveWorkSnapshot, detectGatewayRespawnSupervisor, detectGatewayRespawnSupervisorIdentity, detectRespawnSupervisor, getDiagnosticSessionActivitySnapshot, isForegroundUpdateHandoff, isGatewayRestartExternallyAllowed, listActiveEmbeddedRunSessionIds, markGatewayDraining, markGatewayRestartHandled, markUpdateRestartSentinelFailure, peekGatewayRestartReason, readRestartSentinelReadOnly, reloadTaskRuntimeStateFromStore, requestGatewayRestartWithSignalAdmission, requestManagedServiceUpdateHandoffPark, resetAllLanes, resetCronActiveJobs, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, resolveGatewayRestartDecision, resolveGatewayRestartDrainTimeoutMs, respawnGatewayProcessForUpdate, restartGatewayProcessWithFreshPid, retireActiveCronTaskRunTracking, rollbackGatewayRestartSignalAdmission, rotateAgentEventLifecycleGeneration, scheduleGatewayRestart, stopGatewayManagedProviderLocalServices, waitForActiveCronJobs, waitForActiveCronTaskRuns, waitForGatewayActiveWork, waitForGatewayHealthyRestart, writeDiagnosticStabilityBundleForFailureSync, writeGatewayRestartHandoffSync, writeRestartSentinelIfUnchanged };
