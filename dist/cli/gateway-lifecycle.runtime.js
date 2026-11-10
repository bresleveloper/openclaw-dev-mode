import { c as isWindowsTaskSupervisorChildArgument, l as readWindowsTaskSupervisorRestartExitCode } from "../windows-task-supervisor-contract-DlaAkrWJ.mjs";
import { a as rewritePnpmVersionedOpenClawEntryPath } from "../openclaw-root-CPodxfi3.mjs";
import { n as isTruthyEnvValue } from "../env-DbG527wb.mjs";
import { t as formatErrorMessage } from "../errors-DPfGDWk1.mjs";
import { x as rotateAgentEventLifecycleGeneration } from "../agent-events-Bf3Js0D3.mjs";
import { g as markGatewayRestartDraining } from "../gateway-work-admission-FWbk4b3p.mjs";
import { t as isContainerEnvironment } from "../container-environment-e2wGNmXf.mjs";
import { O as resetCronActiveJobs, k as waitForActiveCronJobs, t as advanceCronActiveJobGeneration } from "../active-jobs-CqHAjCGh.mjs";
import { o as getDiagnosticSessionActivitySnapshot } from "../diagnostic-run-activity-CaoGYSHp.mjs";
import { r as listActiveEmbeddedRunSessionIds } from "../active-run-projections-Crpg2l0z.mjs";
import { s as writeDiagnosticStabilityBundleForFailureSync } from "../diagnostic-stability-bundle-D_m8clVu.mjs";
import { n as abortEmbeddedAgentRun } from "../runs-Czr-I6_B.mjs";
import { i as retireActiveCronTaskRunTracking, o as waitForActiveCronTaskRuns, t as abortActiveCronTaskRuns } from "../active-run-cancellation-BecFApIY.mjs";
import { m as resetAllLanes } from "../command-queue-Dvag6gVL.mjs";
import { r as waitForGatewayActiveWork, t as createGatewayActiveWorkSnapshot } from "../gateway-active-work-_DX5iUkP.mjs";
import { c as resetGatewaySuspendCoordinatorForLifecycleRestart } from "../gateway-suspend-coordinator-DPGYs58l.mjs";
import { o as writeGatewayRestartHandoff } from "../restart-handoff-DGK45tDN.mjs";
import { a as markGatewayRestartHandled, c as resetGatewayRestartStateForInProcessRestart, g as abortPendingChannelReloads, i as isGatewayRestartExternallyAllowed, l as rollbackGatewayRestartSignalAdmission, n as consumeGatewayRestartIntent, o as peekGatewayRestartReason, p as triggerOpenClawRestart, s as requestGatewayRestartWithSignalAdmission, t as consumeGatewayRestartAuthorization, u as scheduleGatewayRestart } from "../restart-B5lVkjlo.mjs";
import { n as resolveGatewayRestartDrainTimeoutMs } from "../restart-budget-ByD9hEIN.mjs";
import { n as prepareGatewayRestartIntentConsumption } from "../restart-intent-Boqzox86.mjs";
import { a as stopActiveManagedProviderLocalServices } from "../provider-runtime-lifecycle-fpszViWt.mjs";
import { E as writeRestartSentinelIfUnchanged, g as readRestartSentinelReadOnly, m as markUpdateRestartSentinelFailure } from "../restart-sentinel-BPoW-ukG.mjs";
import { n as detectGatewayRespawnSupervisor, r as detectGatewayRespawnSupervisorIdentity } from "../supervisor-markers-D4rfU3wJ.mjs";
import { n as scheduleDetachedLaunchdRestartHandoff } from "../launchd-restart-handoff-CDoIPIxg.mjs";
import { i as waitForSystemServiceUpdateHandoffs } from "../update-managed-service-handoff-current-DZkgiu_S.mjs";
import { a as commitManagedServiceUpdateHandoff, c as isForegroundUpdateHandoff, i as claimManagedServiceUpdateHandoff, n as cancelManagedServiceUpdateHandoff, o as completeForegroundUpdateHandoffAfterClose, r as captureForegroundUpdateHandoffStop, u as requestManagedServiceUpdateHandoffPark } from "../update-managed-service-handoff-CB9cuaXQ.mjs";
import { n as waitForGatewayHealthyRestart } from "../restart-health-D3oE2IOJ.mjs";
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
export { abortActiveCronTaskRuns, abortEmbeddedAgentRun, abortPendingChannelReloads, advanceCronActiveJobGeneration, cancelManagedServiceUpdateHandoff, captureForegroundUpdateHandoffStop, claimManagedServiceUpdateHandoff, commitManagedServiceUpdateHandoff, completeForegroundUpdateHandoffAfterClose, consumeGatewayRestartAuthorization, consumeGatewayRestartIntent, createGatewayActiveWorkSnapshot, detectGatewayRespawnSupervisorIdentity, getDiagnosticSessionActivitySnapshot, isForegroundUpdateHandoff, isGatewayRestartExternallyAllowed, listActiveEmbeddedRunSessionIds, markGatewayRestartDraining as markGatewayDraining, markGatewayRestartHandled, markUpdateRestartSentinelFailure, peekGatewayRestartReason, prepareGatewayRestartIntentConsumption, readRestartSentinelReadOnly, requestGatewayRestartWithSignalAdmission, requestManagedServiceUpdateHandoffPark, resetAllLanes, resetCronActiveJobs, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, resolveGatewayRestartDecision, resolveGatewayRestartDrainTimeoutMs, respawnGatewayProcessForUpdate, restartGatewayProcessWithFreshPid, retireActiveCronTaskRunTracking, rollbackGatewayRestartSignalAdmission, rotateAgentEventLifecycleGeneration, scheduleGatewayRestart, stopActiveManagedProviderLocalServices, waitForActiveCronJobs, waitForActiveCronTaskRuns, waitForGatewayActiveWork, waitForGatewayHealthyRestart, waitForSystemServiceUpdateHandoffs, writeDiagnosticStabilityBundleForFailureSync, writeGatewayRestartHandoff, writeRestartSentinelIfUnchanged };
