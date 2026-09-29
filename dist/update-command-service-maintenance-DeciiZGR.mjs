import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { i as registerSignalExitGate, n as registerSignalExitBarrier, o as waitForSignalExitBarriers } from "./signal-exit-barrier-BG0KH3HC.mjs";
import { c as isGatewayServiceEnv, d as resolveGatewayProfileSuffix } from "./constants-CJCmIHb-.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { a as acquireGatewayLifecycleCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { a as findServiceOwnershipRefusal, r as ServiceInspectionError } from "./service-inspection-error-axo4k_qi.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-CYjRlApN.mjs";
import { i as readSystemdServiceExecStart, s as resolveSystemdServiceName } from "./systemd-service-files-tGuARbbA.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { a as resolveManagedGatewayServiceCommand } from "./service-types-d44oynyj.mjs";
import { i as resolveManagedServiceNodeRunner, s as summarizeGatewayServiceLayout } from "./service-layout-DuzmQnH1.mjs";
import { u as resolveTaskName } from "./schtasks-layout-ZxN1sGLi.mjs";
import "./update-control-plane-sentinel-D6ewFI99.mjs";
import { t as finishUpdateRun } from "./update-run-write-rAL063vt.mjs";
import { f as recordUpdateRunPhase, h as recordUpdateRunStep } from "./update-run-ledger-CwAEg-5V.mjs";
import { r as getUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import { n as probePortUsage } from "./ports-probe-DxY7uEcU.mjs";
import { _ as readWindowsStartupFallbackRuntimeForUpdate, d as suspendScheduledTaskAutoStartForUpdate, f as ScheduledTaskAutoStartRecoveryError, p as isScheduledTaskDefinitelyNotRunning, s as resumeScheduledTaskAutoStartAfterUpdate } from "./schtasks-D2U0K9JA.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-De6Bb79N.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-BCULlL85.mjs";
import { u as captureSystemdServiceIdentity } from "./systemd-j8mO8n69.mjs";
import { l as isCurrentManagedServiceUpdateHandoffProcess } from "./update-managed-service-handoff-DYKI1y2T.mjs";
import { d as UpdateCommandRecoveryPendingError } from "./update-command-executor-DDhDn9_F.mjs";
import { n as UpdatePreMutationError } from "./shared-Ca2ebFXK.mjs";
import { n as gatewayMaintenanceBlockMessage } from "./update-command-handoff-DDmZ8LRL.mjs";
import { c as observedSystemdManagerUid, i as assertGatewayServiceManagementAllowedForUpdate, n as GatewayServiceUpdateOwnershipError, o as inspectManagedGatewayServiceBeforeUpdate, p as resolveUpdatedGatewayRestartPort, r as assertGatewayServiceAdmissionUnchanged, t as GATEWAY_SERVICE_INSPECTION_WARNING, u as resolveGatewayServiceManagementBlockMessageForUpdate } from "./update-command-service-plan-B89pDfz8.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { Writable } from "node:stream";
//#region src/cli/update-cli/update-command-service-publication.ts
async function isManagedGatewayServiceOffline(state) {
	return state.runtime?.status === "stopped" && (process.platform === "darwin" ? state.loadState.status === "not-loaded" : process.platform === "win32" ? isScheduledTaskDefinitelyNotRunning(resolveTaskName(state.env)) || (await readWindowsStartupFallbackRuntimeForUpdate(state.env).catch(() => null))?.status === "stopped" : process.platform === "linux");
}
/** Changed runtime artifacts require an offline physical target, not logical
* ownership of a deployment's current/releases namespace. No service is stopped here. */
async function withGatewayRuntimeArtifactPublication(params, publish) {
	const assertCaller = params.assertCurrent;
	assertCaller();
	return await withGatewayServiceOperationLock(params.env, async (assertNative) => {
		const assertCurrent = () => {
			assertCaller();
			assertNative();
		};
		const refuse = (cause) => {
			throw new UpdatePreMutationError("runtime-artifact-publication", `Runtime artifacts changed, but the affected Gateway is running or its offline state could not be verified. Run \`${formatCliCommand("openclaw gateway status --deep", params.env)}\`, stop the affected Gateway with \`${formatCliCommand("openclaw gateway stop", params.env)}\`, and retry the update.`, { cause });
		};
		const service = resolveGatewayService();
		const identity = async (file) => {
			const real = await fs.realpath(file);
			assertCurrent();
			const stat = await fs.stat(file);
			assertCurrent();
			return {
				real,
				stat
			};
		};
		const outputIdentity = async (file) => {
			try {
				return await identity(file);
			} catch (error) {
				assertCurrent();
				if (!hasNodeErrorCode(error, "ENOENT")) throw error;
				const present = await fs.lstat(file).catch((statError) => {
					if (!hasNodeErrorCode(statError, "ENOENT")) throw statError;
				});
				assertCurrent();
				if (present) throw error;
				const parent = await outputIdentity(path.dirname(file));
				assertCurrent();
				return { real: path.join(parent.real, path.basename(file)) };
			}
		};
		const same = (a, b) => a.real === b.real || Boolean(a.stat && b.stat && a.stat.dev === b.stat.dev && a.stat.ino === b.stat.ino);
		const outputPaths = ["dist-runtime", path.join("dist", "extensions", "node_modules", "openclaw")];
		const readInspection = async () => {
			assertCurrent();
			const parents = await Promise.all([
				"",
				"dist",
				path.join("dist", "extensions"),
				path.join("dist", "extensions", "node_modules")
			].map((relative) => relative ? outputIdentity(path.join(params.root, relative)) : identity(params.root)));
			assertCurrent();
			if (parents.some((parent) => parent.stat && !parent.stat.isDirectory())) refuse();
			const target = parents[0];
			const destinations = await Promise.all(outputPaths.map((output) => outputIdentity(path.join(params.root, output))));
			assertCurrent();
			const state = await readGatewayServiceState(service, {
				env: params.env,
				requireEffective: true,
				requireLoadedCommand: true,
				timeoutMs: params.timeoutMs
			});
			assertCurrent();
			const layout = await summarizeGatewayServiceLayout(state.command);
			assertCurrent();
			const database = await outputIdentity(resolveOpenClawStateSqlitePath(state.env));
			assertCurrent();
			const serviceName = process.platform === "darwin" ? resolveLaunchAgentLabel(state.env) : process.platform === "win32" ? resolveTaskName(state.env) : resolveSystemdServiceName(state.env);
			const nativeIdentity = stableStringify({
				command: state.command,
				serviceName,
				profile: resolveGatewayProfileSuffix(state.env.OPENCLAW_PROFILE),
				managerUid: observedSystemdManagerUid(state)
			});
			let serving;
			let disjoint = false;
			if (layout?.packageRootReal && layout.entrypointReal) {
				const [installed, entrypoint] = await Promise.all([identity(layout.packageRootReal), outputIdentity(layout.entrypointReal)]);
				assertCurrent();
				serving = {
					root: installed,
					entrypoint
				};
				const servingOutputs = await Promise.all(outputPaths.map((output) => outputIdentity(path.join(installed.real, output))));
				assertCurrent();
				disjoint = !same(target, installed) && !destinations.some((destination) => same(destination, installed) || isPathInside(destination.real, entrypoint.real) || servingOutputs.some((output) => same(destination, output) || isPathInside(destination.real, output.real) || isPathInside(output.real, destination.real)));
			} else if (state.command || state.installed || state.loadState.status !== "not-loaded" || !state.runtime?.missingUnit) refuse();
			const absent = !state.command && !state.installed && state.loadState.status === "not-loaded" && state.runtime?.missingUnit === true;
			if (!disjoint && (state.running || !absent && (state.loadState.status === "unknown" || process.platform === "linux" && observedSystemdManagerUid(state) === void 0 || !await isManagedGatewayServiceOffline(state)))) refuse();
			assertCurrent();
			if (!disjoint) {
				const activeLock = await readActiveGatewayLockIdentity({
					env: state.env,
					requireInspection: true
				});
				assertCurrent();
				if (activeLock) refuse();
				const port = await resolveUpdatedGatewayRestartPort({
					serviceEnv: state.env,
					serviceCommand: state.command
				});
				assertCurrent();
				const usage = await probePortUsage(port);
				assertCurrent();
				if (usage !== "free") refuse();
			}
			return {
				state,
				disjoint,
				parents,
				destinations,
				database,
				nativeIdentity,
				serving
			};
		};
		const inspect = async () => {
			try {
				return await readInspection();
			} catch (error) {
				assertCurrent();
				if (error instanceof UpdatePreMutationError) throw error;
				return refuse(error);
			}
		};
		const before = await inspect();
		assertCurrent();
		if (before.serving && !before.serving.entrypoint.stat) refuse();
		const assertPublicationCurrent = async () => {
			const current = await inspect();
			assertCurrent();
			const changedIdentity = (previous, next) => previous.real !== next.real || Boolean(previous.stat && (!next.stat || previous.stat.dev !== next.stat.dev || previous.stat.ino !== next.stat.ino));
			if (before.disjoint !== current.disjoint || before.database.real !== current.database.real || before.nativeIdentity !== current.nativeIdentity || before.parents.some((parent, index) => changedIdentity(parent, current.parents[index])) || before.destinations.some((destination, index) => destination.real !== current.destinations[index].real) || before.serving && (!current.serving || changedIdentity(before.serving.root, current.serving.root) || before.serving.entrypoint.real !== current.serving.entrypoint.real || !before.destinations.some((destination) => isPathInside(destination.real, current.serving.entrypoint.real)) && changedIdentity(before.serving.entrypoint, current.serving.entrypoint))) refuse();
			assertCurrent();
		};
		let coordinator;
		try {
			try {
				assertCurrent();
				if (!before.disjoint) coordinator = acquireGatewayLifecycleCoordinator({
					databasePath: before.database.real,
					busyTimeoutMs: 0
				});
				await assertPublicationCurrent();
				assertCurrent();
			} catch (error) {
				assertCurrent();
				if (error instanceof UpdatePreMutationError) throw error;
				refuse(error);
			}
			assertCurrent();
			const result = await publish(assertPublicationCurrent);
			assertCurrent();
			return result;
		} finally {
			coordinator?.release();
		}
	});
}
//#endregion
//#region src/cli/update-cli/update-command-service-revalidation.ts
function matchesStoppedService(before, state, inspection, allowIncompleteInspection = false) {
	const verdict = before.serviceUpdateVerdict;
	const refreshDefinition = verdict?.kind === "owned" && verdict.refreshDefinition;
	const resolveName = process.platform === "darwin" ? resolveLaunchAgentLabel : process.platform === "win32" ? resolveTaskName : resolveSystemdServiceName;
	return Boolean(before.serviceEnv && state.command && verdict && "fingerprint" in verdict && resolveGatewayProfileSuffix(before.serviceEnv.OPENCLAW_PROFILE) === resolveGatewayProfileSuffix(state.env.OPENCLAW_PROFILE) && resolveName(before.serviceEnv) === resolveName(state.env) && (process.platform !== "linux" || before.serviceManagerUid === void 0 || allowIncompleteInspection && observedSystemdManagerUid(state) === void 0 || before.serviceManagerUid === observedSystemdManagerUid(state)) && (refreshDefinition || "fingerprint" in inspection && inspection.fingerprint === verdict.fingerprint));
}
async function revalidateManagedGatewayServiceAfterUpdate(params) {
	const before = params.preManagedServiceStop;
	const verdict = before?.serviceUpdateVerdict;
	assertGatewayServiceManagementAllowedForUpdate(params.state.env);
	const managerUid = observedSystemdManagerUid(params.state);
	if (params.allowIncompleteInspection && before?.serviceManagerUid !== void 0 && managerUid !== void 0 && managerUid !== before.serviceManagerUid) throw new GatewayServiceUpdateOwnershipError("Gateway service ownership or manager identity changed; inspect it before restarting manually.", void 0);
	const inspection = await inspectManagedGatewayServiceBeforeUpdate({
		...params,
		retainedCommand: verdict?.kind === "owned" || verdict?.kind === "unresolved",
		allowInstallRootChange: params.allowInstallRootChange && !verdict
	});
	if ((params.allowInstallRootChange || verdict?.kind === "owned" && verdict.requiresInstallRootRefresh) && before && verdict?.kind === "owned" && verdict.refreshDefinition && (inspection.kind === "foreign" || inspection.kind === "unresolved") && (params.state.definitionMutationCapability?.kind ?? "writable") === "writable") {
		const retained = await inspectManagedGatewayServiceBeforeUpdate({
			state: params.state,
			root: verdict.root,
			retainedCommand: true,
			allowIncompleteInspection: params.allowIncompleteInspection
		});
		if (matchesStoppedService({
			...before,
			serviceUpdateVerdict: {
				...verdict,
				refreshDefinition: false
			}
		}, params.state, retained, params.allowIncompleteInspection)) return {
			...verdict,
			requiresInstallRootRefresh: true
		};
	}
	if (before && verdict && (verdict.kind === "owned" || verdict.kind === "unresolved") && !(params.allowIncompleteInspection && inspection.kind === "unavailable") && (inspection.kind !== verdict.kind || !matchesStoppedService(before, params.state, inspection, params.allowIncompleteInspection))) throw new GatewayServiceUpdateOwnershipError(inspection.kind === "unavailable" ? params.state.runtime?.inspectionFailure?.timeoutMs !== void 0 ? inspection.message : "Gateway service ownership could not be verified because inspection is unavailable. Run `openclaw gateway status --deep` and retry." : "Gateway service ownership or manager identity changed; inspect it before restarting manually.", void 0, inspection.kind === "unavailable" ? inspection.inspectionReason : void 0);
	return inspection.kind === "owned" && verdict?.kind === "owned" && !verdict.refreshDefinition ? {
		...inspection,
		refreshDefinition: false
	} : inspection;
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
				assertCurrent: params.assertCurrent,
				beforeMutation: async () => {
					params.assertCurrent?.();
					await guard?.();
					params.assertCurrent?.();
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
	const complete = (restartSafe = true) => {
		if (settlement) return settlement.catch(() => void 0);
		const recordInterruption = interrupted && (restoreAllowed || restorationFailed);
		closed = true;
		restoreAllowed = false;
		settlement = (async () => {
			let failure;
			try {
				await restorePromise?.catch(() => void 0);
				if (!restartSafe && restorationAttempted && await suspensionPromise.catch(() => false)) await suspendScheduledTaskAutoStartForUpdate(params.serviceEnv, {
					assertCurrent: params.assertCurrent,
					beforeMutation: async () => {
						params.assertCurrent?.();
						await guard?.();
						params.assertCurrent?.();
					},
					restoreOnFailure: false
				});
			} catch (cause) {
				failure = cause instanceof Error ? cause : new Error("Windows native recovery failed", { cause });
			}
			try {
				if (finishUpdate && recordInterruption && params.updateRun) {
					params.assertCurrent?.();
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
		beforeMutation: async () => {
			params.assertCurrent?.();
			await guard?.();
			params.assertCurrent?.();
		}
	});
	return {
		suspended: suspensionPromise,
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
const JSON_MODE_SERVICE_STDOUT = new Writable({ write(_chunk, _encoding, callback) {
	callback();
} });
function createWindowsTaskAutoStartGuard(params) {
	const before = params.before;
	return async () => {
		const verdict = await revalidateManagedGatewayServiceAfterUpdate({
			state: await readGatewayServiceState(resolveGatewayService(), {
				env: before.serviceEnv,
				requireEffective: true,
				requireLoadedCommand: true,
				validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
				timeoutMs: params.timeoutMs
			}),
			root: params.root,
			preManagedServiceStop: before,
			allowInstallRootChange: true
		});
		if (verdict.kind !== "owned" && verdict.kind !== "unresolved") throw new GatewayServiceUpdateOwnershipError("Windows task ownership could not be verified; inspect its autostart state manually.", void 0);
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
async function maybeResumeWindowsTaskAutoStartAfterPackageUpdate(stopState, restartSafe, guard, assertCurrent) {
	if (!stopState?.windowsTaskAutoStartRecovery) return;
	await stopState.windowsTaskAutoStartRecovery.restore(restartSafe, guard, assertCurrent);
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
	if (params.phase === "inspect") return await stopManagedServiceBeforeMutableUpdate(params);
	return await withGatewayServiceOperationLock(params.expectedService?.serviceEnv ?? process.env, (assertNative) => stopManagedServiceBeforeMutableUpdate(params, assertNative));
}
async function stopManagedServiceBeforeMutableUpdate(params, assertNative) {
	const updateRun = params.updateRun;
	const executorFence = updateRun?.executorFence;
	const assertExecutor = () => {
		if (params.updateRun !== updateRun || updateRun?.executorFence !== executorFence) throw new Error("Native preparation lost its original update executor.");
		executorFence?.assertCurrent();
	};
	const assertCurrent = () => {
		params.assertCurrent?.();
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
		const blockMessage = gatewayMaintenanceBlockMessage(state, params.root);
		if (!blockMessage || await isCurrentManagedServiceUpdateHandoffProcess({
			root: params.handoffRoot ?? params.root,
			runId: params.updateRun?.runId
		})) return;
		return blockMessage;
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
		serviceState = await withCommandProcessScope(() => readGatewayServiceState(inspectedService, {
			env: serviceEnv,
			requireEffective: true,
			requireLoadedCommand: true,
			validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
			timeoutMs: params.timeoutMs
		}));
		if (process.platform === "win32" && serviceState.runtime?.inspectionFailure?.timeoutMs !== void 0) serviceState = await withCommandProcessScope(() => readGatewayServiceState(inspectedService, {
			env: serviceEnv,
			requireEffective: true,
			validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
			timeoutMs: params.timeoutMs
		}));
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
				blockMessage: err.message
			};
		}
		return unavailableServiceState({
			kind: "unavailable",
			message: err instanceof ServiceInspectionError || err instanceof GatewayServiceUpdateOwnershipError ? `${GATEWAY_SERVICE_INSPECTION_WARNING} ${err.message}` : GATEWAY_SERVICE_INSPECTION_WARNING,
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
		offline: await withCommandProcessScope(() => isManagedGatewayServiceOffline(serviceState)),
		serviceEnv: serviceState.env,
		serviceDefinitionEnv: resolveManagedGatewayServiceCommand(serviceState.command)?.environment ?? {},
		serviceNodeRunner: resolveManagedServiceNodeRunner(serviceState.command),
		servicePort: parseTcpPortFromArgs(serviceState.command?.programArguments) ?? void 0,
		...process.platform === "linux" ? { serviceManagerUid: observedSystemdManagerUid(serviceState) } : {},
		serviceUpdateVerdict
	};
	assertCurrent();
	if (serviceUpdateVerdict.kind === "foreign") return {
		...inspected,
		serviceMutationAllowed: false,
		serviceMutationSkipMessage: "Gateway service management skipped: the service belongs to a different OpenClaw installation and was left untouched."
	};
	if (serviceUpdateVerdict.kind === "absent") return {
		...inspected,
		serviceMutationAllowed: false,
		serviceMutationSkipMessage: "Gateway restart skipped: no Gateway service or listener is running."
	};
	if (params.shouldRestart && serviceState.running && params.handoffFromGateway) {
		const blockMessage = gatewayMaintenanceBlockMessage(serviceState, params.root, "handoff");
		if (blockMessage) return {
			...inspected,
			blockMessage
		};
		if (await params.handoffFromGateway(serviceState)) throw new UpdateCommandAbort();
	}
	if (params.phase === "inspect") {
		const blockMessage = params.handoffFromGateway ? await resolveAncestryBlock(serviceState) : void 0;
		return blockMessage ? {
			...inspected,
			blockMessage
		} : inspected;
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
			assertCurrent: () => {
				params.assertCurrent?.();
				assertExecutor();
				if (updateRun && getUpdateRun(updateRun.runId, { env: updateRun.env })?.status !== "running") throw new Error("Update run no longer owns Windows task activation.");
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
			const { prepareSystemdGatewayMaintenance } = await import("./systemd-maintenance-BM3Jtosg.mjs");
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
	const blockMessage = await resolveAncestryBlock(serviceState);
	if (blockMessage) return {
		...inspected,
		blockMessage
	};
	if (!params.jsonMode) {
		const message = `Stopping managed gateway service before ${params.updateInstallKind} update...`;
		defaultRuntime.log(theme.muted(message));
	}
	const windowsTaskAutoStartRecovery = await suspendTask();
	let stoppedAtMs;
	try {
		const readCurrentService = async (env) => {
			const state = await readGatewayServiceState(service, {
				env,
				requireEffective: true,
				requireLoadedCommand: true,
				validateEnvBeforeStatusRead: assertGatewayServiceManagementAllowedForUpdate,
				timeoutMs: params.timeoutMs
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
		const currentBlockMessage = await resolveAncestryBlock(currentState);
		if (currentBlockMessage) throw new UpdatePreMutationError("managed-service-preflight", currentBlockMessage);
		if (process.platform === "linux") {
			const { prepareSystemdGatewayMaintenance } = await import("./systemd-maintenance-BM3Jtosg.mjs");
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
				if ((await readCurrentService(currentState.env)).runtime?.pid !== currentState.runtime?.pid) throw new GatewayServiceUpdateOwnershipError("Gateway process changed during maintenance drain; inspect its service before retrying.", void 0);
			}
			stoppedAtMs = Date.now();
			if (params.updateRun) recordUpdateRunPhase(params.updateRun.runId, "activating", void 0, { env: params.updateRun.env });
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
			const { withGatewayMaintenanceDrain } = await import("./update-command-service-drain-BWfrWoc0.mjs");
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
			assertCurrent();
		} catch (cause) {
			throw new AggregateError([err, cause], "Update executor was lost during native preparation", { cause });
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
function shouldBlockMutableUpdateFromGatewayServiceEnv(params) {
	const stopState = params.preManagedServiceStop;
	return stopState?.serviceUpdateVerdict?.kind !== "unavailable" && isGatewayServiceEnv(process.env) && (!stopState?.inspected || !stopState.stopped && (!stopState.runtimeInspected || stopState.running && !stopState.blockMessage));
}
//#endregion
export { UpdateCommandAbort as a, withGatewayRuntimeArtifactPublication as c, shouldBlockMutableUpdateFromGatewayServiceEnv as i, maybeResumeWindowsTaskAutoStartAfterPackageUpdate as n, createWindowsTaskAutoStartRecovery as o, maybeStopManagedServiceBeforeMutableUpdate as r, revalidateManagedGatewayServiceAfterUpdate as s, createWindowsTaskAutoStartGuard as t };
