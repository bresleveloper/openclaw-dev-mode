import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { c as isGatewayServiceEnv } from "./constants-BLghGsId.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { a as isPidAlive } from "./pid-alive-CPS_shDt.mjs";
import { r as parseTcpPortFromArgs } from "./tcp-port-8uSpDbMY.mjs";
import { i as registerSignalExitBarrier, l as waitForSignalExitBarriers, o as registerSignalExitGate } from "./signal-exit-barrier-BFniU76K.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { f as createUpdatePreflightFailure, o as findServiceOwnershipRefusal, r as ServiceInspectionError } from "./service-inspection-error-Bsltcpi4.mjs";
import { t as createNullWriter } from "./null-writer-Bd3sgUAj.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-BquD107I.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-DH-onosx.mjs";
import { t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-C2LEup70.mjs";
import { i as inspectSelfAndAncestorPidsSync } from "./restart-stale-pids-BSJ5Iyx5.mjs";
import { f as recordUpdateRunStep } from "./update-run-ledger-jBhhLo0P.mjs";
import { i as finishUpdateRun } from "./update-run-write-DdGOnqyV.mjs";
import { i as resolveInstallationTarget } from "./installation-target-context-BOfhXm_n.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { p as UpdateCommandRecoveryPendingError, s as releaseUpdateCommandPreflightForHandoff } from "./update-command-executor-C94Zye_E.mjs";
import { c as readControlPlaneUpdateSentinelMeta, t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON, u as writeControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { a as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CRhfnUxj.mjs";
import { n as UpdatePreMutationError } from "./shared-CiAI6uii.mjs";
import { g as ScheduledTaskInspectionError } from "./schtasks-layout-BWyDzx-H.mjs";
import { T as ScheduledTaskAutoStartRecoveryError, d as suspendScheduledTaskAutoStartForUpdate, s as resumeScheduledTaskAutoStartAfterUpdate } from "./schtasks-BZ33FXAo.mjs";
import { o as resolveManagedGatewayServiceCommand } from "./service-types-CPk6CBn6.mjs";
import { a as resolveManagedServiceNodeRunner } from "./service-layout-BNLNn9Ng.mjs";
import { S as captureSystemdServiceIdentity, c as resolveSystemdServiceName, r as readSystemdServiceExecStart } from "./systemd-service-files-BXSBYnK_.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-Dnqiud_w.mjs";
import { n as resolveGatewayService } from "./service-CCUynFdj.mjs";
import { t as inspectServiceProcessMembershipSync } from "./service-process-membership-CUvHuMvA.mjs";
import { i as detectRespawnSupervisor } from "./supervisor-markers-Cab7F5S1.mjs";
import { n as isCurrentManagedServiceUpdateHandoffProcess } from "./update-managed-service-handoff-current-D8FZX18i.mjs";
import { t as formatInstallationTargetCommand } from "./installation-target-format-DdNjHxEC.mjs";
import { n as resolveOwnedManagedUpdateEnv } from "./update-command-service-env-lR0aWgPL.mjs";
import { _ as admitSystemdUpdate, c as isCurrentForegroundUpdateHandoffProcess, f as startManagedServiceUpdateHandoff, p as transferManagedServiceUpdateHandoff, r as cancelManagedServiceUpdateHandoff, u as parkForegroundUpdateHandoff } from "./update-managed-service-handoff-Ch-l8xRx.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-C6PCt2me.mjs";
import { n as printResult } from "./progress-BdyrcKI6.mjs";
import { c as observedSystemdManagerUid, d as resolveGatewayServiceManagementBlockMessageForUpdate, l as readGatewayServiceStateForUpdate, n as GatewayServiceUpdateOwnershipError, r as assertGatewayServiceAdmissionUnchanged, t as GATEWAY_SERVICE_INSPECTION_WARNING } from "./update-command-service-plan-_baZk9PF.mjs";
import { i as revalidateManagedGatewayServiceAfterUpdate, t as isManagedGatewayServiceOffline } from "./update-command-service-publication-CRHfFdIc.mjs";
//#region src/cli/update-cli/update-command-handoff.ts
function parsePositivePid(value) {
	if (typeof value === "number") return Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
	const trimmed = typeof value === "string" ? value.trim() : "";
	return /^\d+$/u.test(trimmed) ? parseStrictPositiveInteger(trimmed) ?? null : null;
}
/** EX_TEMPFAIL: ownership transferred successfully, but the update is not terminal yet. */
const UPDATE_HANDOFF_IN_PROGRESS_EXIT_CODE = 75;
const GATEWAY_ANCESTRY_SHELL_GUIDANCE = "Run this command from a shell outside the gateway service.";
function gatewayServiceMembershipBlock(pid, ancestry = inspectSelfAndAncestorPidsSync(void 0, { requireVerifiedParent: true }), systemdControlGroup, onAbsentSource) {
	const gatewayPid = parsePositivePid(pid);
	if (gatewayPid === null) return process.platform === "win32" ? void 0 : createUpdatePreflightFailure("service-membership-unverified", void 0, "managed-service-preflight");
	if (!ancestry.pids.has(gatewayPid)) {
		const membership = process.platform === "win32" ? "outside" : inspectServiceProcessMembershipSync(gatewayPid, process.platform, systemdControlGroup);
		if (membership === "inside") return createUpdatePreflightFailure("inside-gateway-service", void 0, "managed-service-preflight");
		if (membership === "unknown") return createUpdatePreflightFailure("service-membership-unverified", void 0, "managed-service-preflight");
		const unverified = !ancestry.complete && (process.platform !== "win32" || isGatewayServiceEnv(process.env) && parsePositivePid(process.env["OPENCLAW_GATEWAY_SERVICE_PID"]) === gatewayPid && isPidAlive(gatewayPid));
		if (!unverified && membership === "absent") onAbsentSource?.();
		return unverified ? createUpdatePreflightFailure("service-ancestry-unverified", void 0, "managed-service-preflight") : void 0;
	}
	return {
		...createUpdatePreflightFailure("inside-gateway-process-tree", void 0, "managed-service-preflight"),
		message: `This command is running inside the gateway process tree (gateway PID ${gatewayPid}).
Stopping or restarting the gateway from here would kill this command, so it cannot safely manage the gateway that owns it.
${GATEWAY_ANCESTRY_SHELL_GUIDANCE}`
	};
}
const ANCESTRY_BLOCK_MARKER = "inside the gateway process tree";
const UPDATE_CHAT_HANDOFF_GUIDANCE = "From chat, the OpenClaw owner can start the update with the gateway update action or /update, which hands it to a managed helper.";
/** Update-specific follow-up for an ancestry block: the chat path hands off to the managed helper. */
function formatUpdateAncestryBlockMessage(blockMessage) {
	if (!blockMessage.includes(ANCESTRY_BLOCK_MARKER)) return blockMessage;
	const updateBlockMessage = blockMessage.split("\n").filter((line) => line !== GATEWAY_ANCESTRY_SHELL_GUIDANCE).join("\n");
	return updateBlockMessage.includes(UPDATE_CHAT_HANDOFF_GUIDANCE) ? updateBlockMessage : `${updateBlockMessage}\n${UPDATE_CHAT_HANDOFF_GUIDANCE}`;
}
function gatewayMaintenanceBlock(state, root, operation = "stop", onAbsentSource) {
	const ancestry = inspectSelfAndAncestorPidsSync(void 0, { requireVerifiedParent: true });
	const store = createManagedHandoffLeaseStore();
	const claim = store.read(resolveUpdateInstallRoot(root));
	const lease = claim.kind === "current" ? claim.lease : void 0;
	if (lease?.action.kind === "triage" && lease.action.phase === "running" && lease.action.lifetime.kind === "native" && lease.action.lifetime.placement.kind === "attached" && lease.action.lifetime.unit === `${resolveSystemdServiceName(state.env)}.service` && [lease.executor, lease.helper].every((owner) => ancestry.pids.has(owner.pid) && isPidAlive(owner.pid) && store.readProcessStartIdentity(owner.pid) === owner.startIdentity)) return createUpdatePreflightFailure("inside-triage-process-tree", void 0, "managed-service-preflight");
	return operation === "handoff" || !state.running && parsePositivePid(state.runtime?.pid) === null ? void 0 : gatewayServiceMembershipBlock(state.runtime?.pid, ancestry, state.runtime?.systemd?.controlGroup, onAbsentSource);
}
async function handoffUpdateFromGateway(params) {
	if (process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" || process.platform !== "linux" && process.platform !== "darwin") return false;
	const parentPid = parsePositivePid(params.state.runtime?.pid);
	if (!parentPid || !inspectSelfAndAncestorPidsSync(void 0, { requireVerifiedParent: true }).pids.has(parentPid)) return false;
	const supervisor = detectRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true }) ?? (process.platform === "linux" ? "systemd" : "launchd");
	params.stopProgress();
	const env = resolveOwnedManagedUpdateEnv({
		serviceEnv: params.state.env,
		serviceDefinitionEnv: resolveManagedGatewayServiceCommand(params.state.command)?.environment,
		invocationCwd: params.invocationCwd
	});
	const argv1 = await resolveGatewayInstallEntrypoint(params.root);
	if (!argv1) throw new UpdatePreMutationError("managed-service-handoff-failed", "Cannot locate the installed updater; run `openclaw doctor` before retrying.");
	if (params.opts.run?.executorFence) {
		releaseUpdateCommandPreflightForHandoff(params.opts.run.executorFence);
		delete params.opts.run.executorFence;
	}
	const started = await startManagedServiceUpdateHandoff({
		runId: params.opts.run?.runId,
		root: params.root,
		invocationCwd: params.invocationCwd,
		parentPid,
		supervisor,
		env,
		execPath: params.nodeRunner ?? resolveNodeRunner(),
		argv1,
		timeoutMs: params.timeoutMs,
		restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(),
		channel: normalizeUpdateChannel(params.opts.channel) ?? void 0,
		tag: params.tag,
		devTarget: params.devTarget,
		acceptCapabilities: params.opts.acceptCapabilities,
		admission: params.opts.admission,
		reapplyLocalOverrides: params.opts.reapplyLocalOverrides,
		meta: { runId: params.opts.run?.runId }
	});
	if (started.status === "joined") throw new UpdatePreMutationError("managed-service-handoff-already-running", "Another managed update is already running. Check progress with `openclaw update status`.");
	const identity = {
		kind: "managed-update-handoff",
		handoffId: started.handoffId,
		installRoot: started.installRoot
	};
	const target = resolveInstallationTarget(env);
	const statusCommand = formatInstallationTargetCommand([
		"openclaw",
		"update",
		"status"
	], target, { env });
	const healthCommand = formatInstallationTargetCommand([
		"openclaw",
		"gateway",
		"status",
		"--deep"
	], target, { env });
	const guidance = `Update is not finished. It will continue in the background so it can restart the Gateway.\nLog: ${started.logPath}\nCheck progress: ${statusCommand}`;
	const result = {
		runId: params.opts.run?.runId,
		status: "skipped",
		mode: params.mode,
		root: started.installRoot,
		reason: CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON,
		steps: [{
			name: "managed-service update handoff",
			command: started.command,
			cwd: started.installRoot,
			durationMs: 0,
			exitCode: null,
			stdoutTail: guidance
		}],
		durationMs: 0
	};
	try {
		await writeControlPlaneUpdateRestartSentinel({
			result,
			meta: {
				runId: params.opts.run?.runId,
				handoffId: started.handoffId,
				root: started.installRoot
			}
		}, env);
		if (!await transferManagedServiceUpdateHandoff(identity)) throw new Error(`Managed update ownership transfer failed. Inspect ${started.logPath} and run ${healthCommand} before retrying.`);
	} catch (error) {
		await cancelManagedServiceUpdateHandoff(identity);
		throw error;
	}
	if (params.opts.run) recordUpdateRunStep(params.opts.run.runId, {
		step: "managed-service update handoff",
		status: "completed",
		endedAtMs: Date.now()
	}, { env: params.opts.run.env });
	await printResult(result, params.opts, { nextAction: guidance });
	process.exitCode = UPDATE_HANDOFF_IN_PROGRESS_EXIT_CODE;
	return true;
}
async function parkForegroundUpdateForActivation(params, assertCurrent) {
	assertCurrent();
	const run = params.opts.run;
	if (run?.completionOwner === "gateway-restart" && !run.gatewayRestartRequired) {
		await parkForegroundUpdateHandoff({
			root: params.root,
			run
		});
		assertCurrent();
	}
}
/** Invalid handoff metadata may not fall back to another native owner. */
async function resolveForegroundUpdateAdmission(params) {
	const env = params.env ?? process.env;
	const meta = params.meta === void 0 ? await readControlPlaneUpdateSentinelMeta(env) : params.meta;
	const claimed = meta?.completionOwner === "gateway-restart";
	if (!claimed && !params.expectedForeground && !meta?.foregroundOrigin && !(env["OPENCLAW_CONTROL_PLANE_UPDATE_SENTINEL_META"]?.trim() && meta === null)) return false;
	if (!claimed || !params.root || !await isCurrentForegroundUpdateHandoffProcess({
		root: params.root,
		runId: env["OPENCLAW_UPDATE_RUN_ID"],
		env
	})) throw new UpdatePreMutationError("managed-service-preflight", "The update handoff metadata or this Gateway's current ownership could not be verified. Retry the update from its current owner.", createUpdatePreflightFailure("foreground-handoff-unverified", void 0, "managed-service-preflight"));
	return true;
}
//#endregion
//#region src/cli/update-cli/update-command-windows-task.ts
var UpdateCommandAbort = class extends Error {
	constructor() {
		super("openclaw-update-abort");
		this.name = "UpdateCommandAbort";
	}
};
function createWindowsTaskAutoStartRecovery(params) {
	let guard = params.assertCurrentService;
	let restorePromise;
	let settlement;
	let restoreAllowed = !params.alreadySuspended;
	let restorationAttempted = false;
	let restorationFailed = false;
	let delegated = false;
	let closed = false;
	let interrupted = false;
	let unregisterSignalExitBarrier = () => {};
	let finishUpdate;
	const assertCurrentService = async (phase) => {
		params.assertCurrent?.(phase);
		await guard?.();
		params.assertCurrent?.(phase);
	};
	const updateFinished = new Promise((resolve) => {
		finishUpdate = resolve;
	});
	const unregisterSignalExitGate = registerSignalExitGate(updateFinished);
	const onSignal = (exitCode) => {
		interrupted = true;
		waitForSignalExitBarriers().catch((error) => {
			defaultRuntime.error(`Failed to complete update shutdown cleanup: ${String(error)}`);
		}).finally(() => process.exit(exitCode));
	};
	const onSigint = () => onSignal(130);
	const onSigterm = () => onSignal(143);
	const onSigbreak = () => onSignal(130);
	const removeSignalHandlers = () => {
		process.off("SIGINT", onSigint);
		process.off("SIGTERM", onSigterm);
		process.off("SIGBREAK", onSigbreak);
		unregisterSignalExitBarrier();
	};
	const restore = (restartSafe, currentGuard, assertCurrent) => {
		if (closed || delegated) return Promise.resolve();
		if (restartSafe === true) restoreAllowed = true;
		guard = currentGuard ?? guard;
		restorePromise ??= suspensionPromise.then(async (suspended) => {
			if (!suspended || !restoreAllowed || closed) return;
			await resumeScheduledTaskAutoStartAfterUpdate(params.serviceEnv, {
				assertCurrent: () => params.assertCurrent?.("restore"),
				beforeMutation: async () => {
					await assertCurrentService("restore");
					assertCurrent?.();
					if (closed || !restoreAllowed) throw new Error("Windows task restoration authority has closed.");
					restorationAttempted = true;
				}
			});
		}).catch((error) => {
			restorationFailed = true;
			throw error;
		});
		return restorePromise;
	};
	const complete = (restartSafe = true, options) => {
		if (settlement) return settlement.catch(() => void 0);
		const recordInterruption = !options?.preserveState && interrupted && (restoreAllowed || restorationFailed);
		closed = true;
		restoreAllowed = false;
		settlement = (async () => {
			let failure;
			try {
				if (options?.preserveState) await restorePromise;
				else await restorePromise?.catch(() => void 0);
				if (!options?.preserveState && !restartSafe && restorationAttempted && await suspensionPromise.catch(() => false)) await suspendScheduledTaskAutoStartForUpdate(params.serviceEnv, {
					assertCurrent: () => params.assertCurrent?.("restore"),
					beforeMutation: () => assertCurrentService("restore"),
					restoreOnFailure: false
				});
			} catch (cause) {
				failure = cause instanceof Error ? cause : new Error("Windows native recovery failed", { cause });
			}
			try {
				if (finishUpdate && recordInterruption && params.updateRun) {
					params.assertCurrent?.("restore");
					const failed = restorationFailed || !restartSafe;
					finishUpdateRun(params.updateRun.runId, {
						status: failed ? "failed" : "skipped",
						reason: restorationFailed ? "windows-task-autostart-restore-failed" : failed ? "update-failed" : "cancelled"
					}, { env: params.updateRun.env });
				}
			} catch (cause) {
				const settlementFailure = cause instanceof Error ? cause : new Error("Windows recovery settlement failed", { cause });
				failure = failure ? new AggregateError([failure, settlementFailure], "Windows recovery failed and executor settlement could not be confirmed", { cause }) : settlementFailure;
			} finally {
				removeSignalHandlers();
				finishUpdate?.();
				finishUpdate = void 0;
				unregisterSignalExitGate();
			}
			if (failure) throw failure;
		})();
		return settlement;
	};
	process.on("SIGINT", onSigint);
	process.on("SIGTERM", onSigterm);
	process.on("SIGBREAK", onSigbreak);
	unregisterSignalExitBarrier = registerSignalExitBarrier(restore);
	const suspensionPromise = params.alreadySuspended ? Promise.resolve(true) : suspendScheduledTaskAutoStartForUpdate(params.serviceEnv, {
		assertCurrent: params.assertCurrent,
		beforeMutation: assertCurrentService
	});
	return {
		suspended: suspensionPromise,
		assertRecoveryCurrent: () => {
			params.assertCurrent?.("restore");
			if (closed || delegated) throw new Error("Windows task recovery authority has closed or transferred.");
		},
		beginMutation: () => {
			params.assertCurrent?.();
			if (interrupted || closed || delegated) throw new UpdateCommandAbort();
			restoreAllowed = false;
		},
		restore,
		handoff: (guardianGuard) => {
			params.assertCurrent?.();
			if (closed || delegated) throw new Error("Windows task recovery cannot transfer after settlement.");
			guard = guardianGuard;
			delegated = true;
			restoreAllowed = false;
			restorationAttempted = true;
		},
		complete,
		interrupted: () => interrupted
	};
}
//#endregion
//#region src/cli/update-cli/update-command-service-maintenance.ts
const JSON_MODE_SERVICE_STDOUT = createNullWriter();
function createWindowsTaskAutoStartGuard(params) {
	const before = params.before;
	return async () => {
		const state = await readGatewayServiceStateForUpdate(resolveGatewayService(), before.serviceEnv, params.timeoutMs);
		const verdict = await revalidateManagedGatewayServiceAfterUpdate({
			state,
			root: params.root,
			preManagedServiceStop: before,
			allowInstallRootChange: true
		});
		if (verdict.kind !== "owned" && verdict.kind !== "unresolved") throw new GatewayServiceUpdateOwnershipError("Windows task ownership could not be verified; inspect its autostart state manually.", void 0, void 0, "task-ownership-unverified");
	};
}
async function maybeSuspendWindowsTaskAutoStartForUpdate(params) {
	if (process.platform !== "win32" || !params.serviceEnv) return;
	const recovery = createWindowsTaskAutoStartRecovery({
		...params,
		serviceEnv: params.serviceEnv
	});
	let suspended;
	try {
		suspended = await recovery.suspended;
	} catch (err) {
		await recovery.restore().catch(() => void 0);
		await recovery.complete(!(err instanceof ScheduledTaskAutoStartRecoveryError));
		throw err;
	}
	await abortWindowsTaskUpdateIfInterrupted(recovery);
	if (!suspended) {
		try {
			await recovery.restore();
		} finally {
			await recovery.complete();
		}
		return;
	}
	return recovery;
}
async function abortWindowsTaskUpdateIfInterrupted(recovery) {
	if (!recovery.interrupted()) return;
	try {
		await recovery.restore();
	} finally {
		await recovery.complete();
	}
	throw new UpdateCommandAbort();
}
function unavailableServiceState(verdict) {
	return {
		stopped: false,
		inspected: false,
		runtimeInspected: false,
		running: false,
		serviceMutationAllowed: false,
		serviceUpdateVerdict: verdict,
		serviceMutationSkipMessage: verdict.message
	};
}
async function maybeStopManagedServiceBeforeMutableUpdate(params) {
	if (params.recovery) throw new UpdateCommandRecoveryPendingError("Full-state checkpoint recovery is deferred; retained state was left unchanged.");
	const expected = params.expectedService?.serviceUpdateVerdict;
	if (expected?.kind === "unavailable") return unavailableServiceState(expected);
	try {
		if (params.phase === "inspect") return await stopManagedServiceBeforeMutableUpdate(params);
		return await withGatewayServiceOperationLock(params.expectedService?.serviceEnv ?? process.env, (assertNative) => stopManagedServiceBeforeMutableUpdate(params, assertNative));
	} catch (error) {
		if (error instanceof ServiceInspectionError && (error.reason === "service-membership-unverified" || error.reason === "service-ancestry-unverified")) throw new UpdatePreMutationError("managed-service-preflight", error.message, createUpdatePreflightFailure(error.reason, void 0, "managed-service-preflight"));
		throw error;
	}
}
async function stopManagedServiceBeforeMutableUpdate(params, assertNative) {
	const updateRun = params.updateRun;
	const recordPhase = params.recordPhase;
	const executorFence = updateRun?.executorFence;
	const assertExecutor = () => {
		if (params.updateRun !== updateRun || updateRun?.executorFence !== executorFence) throw new Error("Native preparation lost its original update executor.");
		executorFence?.assertCurrent();
	};
	const assertCurrent = (phase) => {
		params.assertCurrent?.(phase);
		assertNative?.();
		assertExecutor();
	};
	let warningIndex = 0;
	const warn = (message) => {
		assertCurrent();
		(params.warn ?? defaultRuntime.error)(message);
		const runId = updateRun?.runId ?? process.env["OPENCLAW_UPDATE_RUN_ID"];
		if (runId) try {
			recordUpdateRunStep(runId, {
				step: `warning:gateway-maintenance:${Date.now()}:${warningIndex++}`,
				status: "completed",
				endedAtMs: Date.now(),
				detail: message
			}, { env: updateRun?.env });
		} catch {
			(params.warn ?? defaultRuntime.error)("Could not record the Gateway maintenance warning in update history.");
		}
	};
	const resolveAncestryBlock = async (state) => {
		delete inspected.serviceMembershipSourceAbsent;
		const block = gatewayMaintenanceBlock(state, params.root, "stop", () => {
			inspected.serviceMembershipSourceAbsent = true;
		});
		if (!block || await isCurrentManagedServiceUpdateHandoffProcess({
			root: params.handoffRoot ?? params.root,
			runId: params.updateRun?.runId ?? process.env["OPENCLAW_UPDATE_RUN_ID"]
		})) return;
		return {
			blockMessage: block.message,
			blockFailureFacts: block.failureFacts
		};
	};
	assertCurrent();
	const uninspected = {
		stopped: false,
		inspected: false,
		runtimeInspected: false,
		running: false
	};
	const serviceEnv = params.expectedService?.serviceEnv ?? process.env;
	const serviceMutationSkipMessage = resolveGatewayServiceManagementBlockMessageForUpdate(serviceEnv);
	if (serviceMutationSkipMessage) return {
		...uninspected,
		serviceMutationAllowed: false,
		serviceMutationSkipMessage
	};
	let service;
	let serviceState;
	try {
		const inspectedService = resolveGatewayService();
		service = inspectedService;
		for (let attempt = 0;; attempt++) {
			const retryTimeout = process.platform === "win32" && attempt === 0;
			try {
				serviceState = await withCommandProcessScope(() => readGatewayServiceStateForUpdate(inspectedService, serviceEnv, params.timeoutMs, params.phase === "inspect" && !params.assertCurrent ? void 0 : {
					managerUid: params.expectedService?.serviceManagerUid,
					assertCurrent
				}));
			} catch (error) {
				if (retryTimeout && error instanceof ScheduledTaskInspectionError && error.timeoutMs !== void 0) continue;
				throw error;
			}
			if (!retryTimeout || serviceState.runtime?.inspectionFailure?.timeoutMs === void 0) break;
		}
	} catch (err) {
		if (hasCommandProcessCleanupError(err)) throw err;
		assertCurrent();
		if (err instanceof GatewayServiceUpdateOwnershipError && service) {
			const inspectedService = service;
			const available = await withCommandProcessScope(() => inspectedService.isLoaded({
				env: serviceEnv,
				timeoutMs: params.timeoutMs
			})).then(() => true, (error) => {
				if (hasCommandProcessCleanupError(error)) throw error;
				return false;
			});
			assertCurrent();
			if (available) return {
				...uninspected,
				serviceMutationAllowed: false,
				blockMessage: err.message,
				blockFailureFacts: err.failureFacts
			};
		}
		return unavailableServiceState({
			kind: "unavailable",
			message: err instanceof ServiceInspectionError && err.reason === "windows-task-inspection-failed" ? `${err.message} ${GATEWAY_SERVICE_INSPECTION_WARNING}` : err instanceof ServiceInspectionError || err instanceof GatewayServiceUpdateOwnershipError ? `${GATEWAY_SERVICE_INSPECTION_WARNING} ${err.message}` : GATEWAY_SERVICE_INSPECTION_WARNING,
			...err instanceof ServiceInspectionError ? { inspectionReason: err.reason } : {}
		});
	}
	assertCurrent();
	const serviceUpdateVerdict = await withCommandProcessScope(() => revalidateManagedGatewayServiceAfterUpdate({
		root: params.root,
		state: serviceState,
		preManagedServiceStop: params.expectedService,
		allowInstallRootChange: params.allowInstallRootChange ?? params.updateInstallKind === "package"
	}));
	assertCurrent();
	if (params.phase) assertGatewayServiceAdmissionUnchanged(params.expectedService, serviceUpdateVerdict);
	if (serviceUpdateVerdict.kind === "unavailable") return unavailableServiceState(serviceUpdateVerdict);
	const inspected = {
		stopped: false,
		inspected: true,
		runtimeInspected: ["running", "stopped"].includes(serviceState.runtime?.status ?? ""),
		running: serviceState.running,
		...typeof serviceState.runtime?.pid === "number" ? { servicePid: serviceState.runtime.pid } : {},
		serviceControlGroup: serviceState.runtime?.systemd?.controlGroup,
		offline: await withCommandProcessScope(() => isManagedGatewayServiceOffline(serviceState)),
		serviceEnv: serviceState.env,
		serviceDefinitionEnv: resolveManagedGatewayServiceCommand(serviceState.command)?.environment ?? {},
		serviceNodeRunner: resolveManagedServiceNodeRunner(serviceState.command),
		servicePort: parseTcpPortFromArgs(serviceState.command?.programArguments) ?? void 0,
		...process.platform === "linux" ? { serviceManagerUid: observedSystemdManagerUid(serviceState) } : {},
		serviceUpdateVerdict
	};
	assertCurrent();
	if (serviceUpdateVerdict.kind === "foreign" || serviceUpdateVerdict.kind === "absent") return {
		...inspected,
		serviceMutationAllowed: false,
		serviceMutationSkipMessage: serviceUpdateVerdict.kind === "foreign" ? "Gateway service management skipped: the service belongs to a different OpenClaw installation and was left untouched." : "Gateway restart skipped: no Gateway service or listener is running."
	};
	const operatorRestartWarning = process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" && serviceUpdateVerdict.kind === "owned" ? await admitSystemdUpdate(params.root, serviceState.env, serviceState.systemdInstallation ?? null) : void 0;
	assertCurrent();
	if (params.shouldRestart && serviceState.running && params.handoffFromGateway) {
		const block = gatewayMaintenanceBlock(serviceState, params.root, "handoff");
		if (block) return {
			...inspected,
			blockMessage: block.message,
			blockFailureFacts: block.failureFacts
		};
		if (await params.handoffFromGateway(serviceState)) throw new UpdateCommandAbort();
	}
	if (operatorRestartWarning) return {
		...inspected,
		serviceMutationAllowed: false,
		serviceMutationSkipMessage: operatorRestartWarning
	};
	if (params.phase === "inspect") {
		const block = params.handoffFromGateway ? await resolveAncestryBlock(serviceState) : void 0;
		return {
			...inspected,
			...block
		};
	}
	const suspendTask = async () => {
		return await maybeSuspendWindowsTaskAutoStartForUpdate({
			serviceEnv: serviceState.env,
			updateRun,
			assertCurrentService: createWindowsTaskAutoStartGuard({
				root: params.root,
				before: inspected,
				timeoutMs: params.timeoutMs
			}),
			assertCurrent: (phase) => {
				params.assertCurrent?.(phase);
				assertExecutor();
			}
		});
	};
	const supervisorMayRespawn = params.shouldRestart && serviceState.loadState.status === "loaded" && (process.platform === "darwin" ? await service.isEnabled?.({
		env: serviceState.env,
		timeoutMs: params.timeoutMs
	}) === true : process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1");
	assertCurrent();
	if (params.phase === "refresh" || !params.shouldRestart || !serviceState.running && !supervisorMayRespawn) {
		if (process.platform === "linux" && serviceUpdateVerdict.kind === "owned") {
			const { prepareSystemdGatewayMaintenance } = await import("./systemd-maintenance-COyU66JM.mjs");
			await prepareSystemdGatewayMaintenance({
				state: serviceState,
				root: params.root,
				stopping: false,
				assertCurrent,
				warn
			});
		}
		if (params.phase === "refresh") return inspected;
		if (!params.shouldRestart && !params.jsonMode && serviceState.running) {
			const warning = `--no-restart is set while the managed gateway service is running; the ${params.updateInstallKind} update will not stop or restart that process.`;
			defaultRuntime.log(theme.warn(warning));
		}
		const windowsTaskAutoStartRecovery = !params.shouldRestart && isGatewayServiceEnv(process.env) ? void 0 : await suspendTask();
		return {
			...inspected,
			...windowsTaskAutoStartRecovery ? { windowsTaskAutoStartRecovery } : {}
		};
	}
	const block = await resolveAncestryBlock(serviceState);
	if (block) return {
		...inspected,
		...block
	};
	if (!params.jsonMode) {
		const message = `Stopping managed gateway service before ${params.updateInstallKind} update...`;
		defaultRuntime.log(theme.muted(message));
	}
	const windowsTaskAutoStartRecovery = await suspendTask();
	let stoppedAtMs;
	try {
		const readCurrentService = async (env) => {
			const state = await readGatewayServiceStateForUpdate(service, env, params.timeoutMs, {
				managerUid: inspected.serviceManagerUid,
				assertCurrent
			});
			const verdict = await revalidateManagedGatewayServiceAfterUpdate({
				state,
				root: params.root,
				preManagedServiceStop: inspected,
				allowInstallRootChange: params.allowInstallRootChange
			});
			assertGatewayServiceAdmissionUnchanged(inspected, verdict);
			assertCurrent();
			return state;
		};
		let currentState = await readCurrentService(serviceState.env);
		const currentBlock = await resolveAncestryBlock(currentState);
		if (currentBlock) throw new UpdatePreMutationError("managed-service-preflight", currentBlock.blockMessage, { failureFacts: currentBlock.blockFailureFacts });
		if (process.platform === "linux") {
			const { prepareSystemdGatewayMaintenance } = await import("./systemd-maintenance-COyU66JM.mjs");
			if (await prepareSystemdGatewayMaintenance({
				state: currentState,
				root: params.root,
				stopping: true,
				assertCurrent,
				warn
			})) currentState = await readCurrentService(currentState.env);
		}
		if (params.retainNativeIdentity && process.platform === "linux" && service.readCommand === readSystemdServiceExecStart) {
			const installation = currentState.systemdInstallation;
			const target = installation?.kind === "system" ? installation.system : installation?.kind === "user" || installation?.kind === "dueling" ? installation.user : void 0;
			if (!target) throw new Error("The systemd service identity could not be captured before stopping.");
			try {
				inspected.serviceSystemdIdentity = await captureSystemdServiceIdentity({
					env: currentState.env,
					target: {
						...target,
						unitPath: currentState.command?.sourcePath ?? target.unitPath
					},
					managerUid: observedSystemdManagerUid(currentState),
					timeoutMs: params.timeoutMs
				});
			} catch (error) {
				assertCurrent();
				if (hasCommandProcessCleanupError(error) || findServiceOwnershipRefusal(error)) throw error;
				const message = `Gateway restoration identity could not be inspected; the managed service was not stopped. ${error instanceof ServiceInspectionError ? error.message : "Run openclaw gateway status --deep to inspect the native service manager."}`;
				return {
					...inspected,
					serviceMutationAllowed: false,
					serviceMutationSkipMessage: message,
					serviceUpdateVerdict: {
						kind: "unavailable",
						message
					}
				};
			}
			assertCurrent();
		}
		const stop = async () => {
			assertCurrent();
			if (process.platform === "linux") {
				const beforeStop = await readCurrentService(currentState.env);
				if (beforeStop.runtime?.pid !== currentState.runtime?.pid) throw new GatewayServiceUpdateOwnershipError("Gateway process changed during maintenance drain; inspect its service before retrying.", void 0, void 0, "service-process-changed");
				const membershipBlock = await resolveAncestryBlock(beforeStop);
				if (membershipBlock) throw new UpdatePreMutationError("managed-service-preflight", membershipBlock.blockMessage, { failureFacts: membershipBlock.blockFailureFacts });
			}
			assertCurrent();
			if (updateRun) {
				if (!recordPhase) throw new Error("Update service preparation has no phase persistence owner.");
				await recordPhase("activating");
				assertCurrent();
			}
			stoppedAtMs = Date.now();
			await service.stop({
				env: currentState.env,
				stdout: params.jsonMode ? JSON_MODE_SERVICE_STDOUT : process.stdout,
				assertCurrent,
				...updateRun ? { updateHandoff: {
					root: params.handoffRoot ?? params.root,
					runId: updateRun.runId
				} } : {},
				onMutation: () => params.onStopped?.({
					...inspected,
					stopped: true,
					stoppedAtMs
				})
			});
		};
		if (process.platform === "linux") {
			const { withGatewayMaintenanceDrain } = await import("./update-command-service-drain-CU1hnJiC.mjs");
			await withGatewayMaintenanceDrain({
				state: currentState,
				timeoutMs: params.timeoutMs ?? updateRun?.defaultStepTimeoutMs,
				assertCurrent,
				warn
			}, stop);
		} else await stop();
		assertCurrent();
		if (windowsTaskAutoStartRecovery) await abortWindowsTaskUpdateIfInterrupted(windowsTaskAutoStartRecovery);
	} catch (err) {
		try {
			assertCurrent("restore");
		} catch (cause) {
			const failures = [err, cause];
			try {
				await windowsTaskAutoStartRecovery?.complete(false);
			} catch (settlementError) {
				failures.push(settlementError);
			}
			throw new AggregateError(failures, "Update executor was lost during native preparation", { cause });
		}
		if (err instanceof UpdateCommandAbort) throw err;
		if (windowsTaskAutoStartRecovery) {
			let autostartRestored = false;
			try {
				await windowsTaskAutoStartRecovery.restore();
				autostartRestored = true;
			} catch (resumeErr) {
				throw new ScheduledTaskAutoStartRecoveryError([err, resumeErr], `Failed to stop the managed gateway (${String(err)}) and restore Windows Scheduled Task autostart (${String(resumeErr)})`, serviceState.env);
			} finally {
				await windowsTaskAutoStartRecovery.complete(autostartRestored);
			}
			if (windowsTaskAutoStartRecovery.interrupted()) throw new UpdateCommandAbort();
		}
		throw err;
	}
	return {
		...inspected,
		stopped: true,
		stoppedAtMs,
		...windowsTaskAutoStartRecovery ? { windowsTaskAutoStartRecovery } : {}
	};
}
async function mutableUpdateGatewayServiceBlock(params) {
	const stopState = params.preManagedServiceStop;
	const ancestry = inspectSelfAndAncestorPidsSync(void 0, { requireVerifiedParent: true });
	const inheritedPid = isGatewayServiceEnv(process.env) ? parseStrictPositiveInteger(process.env["OPENCLAW_GATEWAY_SERVICE_PID"] ?? "") : void 0;
	const block = (inheritedPid && (ancestry.pids.has(inheritedPid) || isPidAlive(inheritedPid)) ? gatewayServiceMembershipBlock(inheritedPid, ancestry, inheritedPid === stopState?.servicePid ? stopState.serviceControlGroup : void 0) : void 0) ?? (stopState?.running && !stopState.stopped ? gatewayServiceMembershipBlock(stopState.servicePid, ancestry, stopState.serviceControlGroup) : void 0);
	return block && !await isCurrentManagedServiceUpdateHandoffProcess({
		root: params.root,
		runId: params.runId,
		env: process.env
	}) ? block : void 0;
}
//#endregion
export { createWindowsTaskAutoStartRecovery as a, parkForegroundUpdateForActivation as c, UpdateCommandAbort as i, resolveForegroundUpdateAdmission as l, maybeStopManagedServiceBeforeMutableUpdate as n, formatUpdateAncestryBlockMessage as o, mutableUpdateGatewayServiceBlock as r, handoffUpdateFromGateway as s, createWindowsTaskAutoStartGuard as t };
