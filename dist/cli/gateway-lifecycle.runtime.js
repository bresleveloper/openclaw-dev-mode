import { s as normalizeOptionalLowercaseString } from "../string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "../errors-sMD712F3.js";
import { t as isContainerEnvironment } from "../container-environment-CNsJSTpY.js";
import { i as getRuntimeConfig } from "../io-DxnOT4sF.js";
import "../config-Cc93keN1.js";
import { a as consumeGatewaySigusr1RestartIntent, c as isGatewaySigusr1RestartExternallyAllowed, d as resetGatewayRestartStateForInProcessRestart, f as resolveGatewayRestartDeferralTimeoutMs, g as triggerOpenClawRestart, i as consumeGatewaySigusr1RestartAuthorization, l as markGatewaySigusr1RestartHandled, n as consumeGatewayRestartIntentPayloadSync, p as scheduleGatewaySigusr1Restart, r as consumeGatewayRestartIntentSync, u as peekGatewaySigusr1RestartReason } from "../restart-BsXKx-Ww.js";
import { r as writeGatewayRestartHandoffSync } from "../restart-handoff-Bee8oN7M.js";
import { b as rotateAgentEventLifecycleGeneration } from "../agent-events-CRggPZCM.js";
import { C as reloadTaskRegistryFromStore, Y as abortActiveCronTaskRuns, Z as retireActiveCronTaskRunTracking, et as waitForActiveCronTaskRuns } from "../task-registry-Bv5-Vohd.js";
import "../runtime-internal-OiU0x_qm.js";
import { l as writeDiagnosticStabilityBundleForFailureSync } from "../diagnostic-stability-bundle-CxZKW-bk.js";
import { d as getActiveEmbeddedRunCount, f as listActiveEmbeddedRunSessionIds, p as listActiveEmbeddedRunSessionKeys } from "../run-state-BZSsRYCZ.js";
import { n as abortEmbeddedAgentRun, w as waitForActiveEmbeddedRuns } from "../runs-CGcPGyzc.js";
import { t as markRestartAbortedMainSessions } from "../main-session-restart-recovery-n_9jScO2.js";
import { n as detectRespawnSupervisor } from "../supervisor-markers-BnpKGoUs.js";
import { s as markUpdateRestartSentinelFailure } from "../restart-sentinel-CXPZNLye.js";
import { c as resetCronActiveJobs, l as waitForActiveCronJobs, t as advanceCronActiveJobGeneration } from "../active-jobs-DCucn-SJ.js";
import { _ as waitForActiveTasks, a as getActiveTaskCount, m as resetAllLanes, p as markGatewayDraining } from "../command-queue-DqzpsN4m.js";
import { n as getInspectableActiveTaskRestartBlockers } from "../task-registry.maintenance-CfHkKR-M.js";
import { t as abortPendingChannelReloads } from "../server-reload-handlers-C95ASa_D.js";
import { spawn } from "node:child_process";
//#region src/infra/process-respawn.ts
function isTruthy(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}
const PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN = /^(.*?)([\\/])node_modules\2\.pnpm\2openclaw@[^\\/]+\2node_modules\2openclaw\2.+$/;
function rewritePnpmVersionedOpenClawEntryPath(entryPath) {
	return entryPath.replace(PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN, "$1$2node_modules$2openclaw$2openclaw.mjs");
}
function spawnDetachedGatewayProcess(opts = {}) {
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
		child,
		pid: child.pid ?? void 0
	};
}
/**
* Attempt to restart this process with a fresh PID.
* - supervised environments (launchd/systemd/schtasks): caller should exit and let supervisor restart
* - OPENCLAW_NO_RESPAWN=1: caller should keep in-process restart behavior (tests/dev)
* - unmanaged environments: caller should keep in-process restart behavior so
*   custom supervisors keep tracking the same gateway PID
*/
function restartGatewayProcessWithFreshPid(_opts = {}) {
	if (isTruthy(process.env.OPENCLAW_NO_RESPAWN)) return { mode: "disabled" };
	const supervisor = detectRespawnSupervisor(process.env);
	if (supervisor) {
		if (supervisor === "schtasks") {
			const restart = triggerOpenClawRestart();
			if (!restart.ok) return {
				mode: "failed",
				detail: restart.detail ?? `${restart.method} restart failed`
			};
		}
		return { mode: "supervised" };
	}
	if (process.platform === "win32") return {
		mode: "disabled",
		detail: "win32: detached respawn unsupported without Scheduled Task markers"
	};
	if (isContainerEnvironment()) return {
		mode: "disabled",
		detail: "container: use in-process restart to keep PID 1 alive"
	};
	return {
		mode: "disabled",
		detail: "unmanaged: use in-process restart to keep custom supervisor PID tracking stable"
	};
}
/**
* Update restarts must replace the OS process so the new code runs from a
* fresh module graph after package files have changed on disk.
*
* Unlike the generic restart path, update mode allows detached respawn on
* unmanaged Windows installs because there is no safe in-process fallback once
* the installed package contents have been replaced.
*/
function respawnGatewayProcessForUpdate(opts = {}) {
	const supervisor = detectRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	if (supervisor) {
		if (supervisor === "schtasks") {
			const restart = triggerOpenClawRestart();
			if (!restart.ok) return {
				mode: "failed",
				detail: restart.detail ?? `${restart.method} restart failed`
			};
		}
		return { mode: "supervised" };
	}
	if (isTruthy(process.env.OPENCLAW_NO_RESPAWN)) return {
		mode: "disabled",
		detail: "OPENCLAW_NO_RESPAWN"
	};
	try {
		const { child, pid } = spawnDetachedGatewayProcess(opts);
		return {
			mode: "spawned",
			pid,
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
export { abortActiveCronTaskRuns, abortEmbeddedAgentRun, abortPendingChannelReloads, advanceCronActiveJobGeneration, consumeGatewayRestartIntentPayloadSync, consumeGatewayRestartIntentSync, consumeGatewaySigusr1RestartAuthorization, consumeGatewaySigusr1RestartIntent, detectRespawnSupervisor, getActiveEmbeddedRunCount, getActiveTaskCount, getInspectableActiveTaskRestartBlockers, getRuntimeConfig, isGatewaySigusr1RestartExternallyAllowed, listActiveEmbeddedRunSessionIds, listActiveEmbeddedRunSessionKeys, markGatewayDraining, markGatewaySigusr1RestartHandled, markRestartAbortedMainSessions, markUpdateRestartSentinelFailure, peekGatewaySigusr1RestartReason, reloadTaskRegistryFromStore, resetAllLanes, resetCronActiveJobs, resetGatewayRestartStateForInProcessRestart, resolveGatewayRestartDeferralTimeoutMs, respawnGatewayProcessForUpdate, restartGatewayProcessWithFreshPid, retireActiveCronTaskRunTracking, rotateAgentEventLifecycleGeneration, scheduleGatewaySigusr1Restart, waitForActiveCronJobs, waitForActiveCronTaskRuns, waitForActiveEmbeddedRuns, waitForActiveTasks, writeDiagnosticStabilityBundleForFailureSync, writeGatewayRestartHandoffSync };
