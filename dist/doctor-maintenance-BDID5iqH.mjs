import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { o as isDefaultInstallIdentity } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { o as registerSignalExitGate } from "./signal-exit-barrier-BFniU76K.mjs";
import { a as admitOpenClawMaintenanceLiveAuthorityReads, l as getOpenClawDatabaseMaintenanceScope, n as createOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { t as GatewayStateOwnerContentionError, u as resolveGatewayStateOwnerPath } from "./gateway-state-owner-DmHycK5o.mjs";
import { r as createSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { n as openDoctorStateSchemaReadAdmission } from "./openclaw-state-db-doctor-schema-BlUz8kWR.mjs";
import { t as DoctorUnreadableStateDatabaseError } from "./state-repair-message-B5Bu99oR.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { l as withCommandProcessScope, n as resolveCommandProcessSignal } from "./exec-spawn-IxJJNQFo.mjs";
import { n as GatewayServiceAuthorityError } from "./service-update-authority-CoX8GMUL.mjs";
import { c as hasGatewayServiceStopUnsafeError, o as findServiceOwnershipRefusal } from "./service-inspection-error-Bsltcpi4.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-Cg4widap.mjs";
import { s as closeOpenClawStateDatabaseByPathAsync } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { n as recordUpdateDoctorRefusal, r as resolveUpdateDoctorGitRecovery, t as formatUpdateDoctorServiceStopRefusal } from "./doctor-update-refusal-CuBUilWt.mjs";
import { c as readStateLeaseProcessOwnerStatus } from "./openclaw-state-lease-store-gySh31JU.mjs";
import { o as acquireWithWait } from "./startup-migration-checkpoint-Bkqf-Qf8.mjs";
import { a as UpdateDoctorError, d as createUpdateDoctorDatabaseWriteCapture, t as DoctorMaintenanceRefusalError } from "./update-doctor-result-yVslo54h.mjs";
import { r as readGatewayOwnerLease } from "./gateway-owner-lease-0RgOZO_d.mjs";
import { n as GatewayLockError, o as readActiveGatewayLockIdentity, r as acquireGatewayLock } from "./gateway-lock-B6mKYs2x.mjs";
import { i as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS, r as GATEWAY_SHUTDOWN_RESERVE_MS } from "./gateway-shutdown-budget-v-vGFkEN.mjs";
import { n as probePortUsage } from "./ports-probe-DMGtt9dg.mjs";
import { n as resolveGatewayService } from "./service-Cw6bpVrf.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-C6PCt2me.mjs";
import { p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-VzuhDrTH.mjs";
import { n as sanitizeDoctorNote } from "./emit-notes-CPyL1dzc.mjs";
import { s as inspectGatewayRestart } from "./restart-health-DD8z78x0.mjs";
import { s as TICK_INTERVAL_MS } from "./server-constants-BH_EolwD.mjs";
import { n as readLegacyGatewayLockIdentity, t as assertLegacyGatewayStoppedForMaintenance } from "./gateway-lock-legacy-j9m2CmSY.mjs";
import { c as resolveUpdateParentGatewayActivation, l as shouldManageGatewayService, n as assertDoctorServiceSelection, o as isServiceRepairExternallyManaged } from "./doctor-service-repair-policy-D8FKJEDH.mjs";
import { a as readOfflineAppOwnedDoctorInspection, i as readDoctorGatewayOwnerLease, r as classifyDoctorMaintenanceRefusal, t as assertDoctorMaintenanceInspection } from "./doctor-maintenance-inspection-BNmfevyj.mjs";
import { t as resolveDoctorUpdateAdmission } from "./doctor-maintenance-admission-DjemgY-t.mjs";
import { n as resolveDoctorRepairMode, t as isDoctorUpdateRepairMode } from "./doctor-repair-mode-W3I4YQ3X.mjs";
import path from "node:path";
//#region src/commands/doctor-agent-lease-refusal.ts
function createDoctorAgentLeaseRefusal(env, cause) {
	const message = "Doctor could not enter maintenance. An agent database is in use. Stop other OpenClaw processes using this state, then retry the update.";
	return new DoctorMaintenanceRefusalError(message, {
		kind: "deferred",
		reason: "agent-database-in-use"
	}, {
		cause,
		failureFacts: [createUpdateFailureFact({
			check: "doctor",
			code: "agent-database-lease-active",
			message
		}, env)]
	});
}
async function preflightExternalDoctorAgentLease(env) {
	const { readActiveOpenClawAgentDatabaseLeasesReadOnly } = await import("./openclaw-agent-db-lease-DPdUAF5J.mjs");
	let activeAgentLease = false;
	try {
		activeAgentLease = readActiveOpenClawAgentDatabaseLeasesReadOnly({ env }, openDoctorStateSchemaReadAdmission).length > 0;
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
	}
	if (activeAgentLease) throw createDoctorAgentLeaseRefusal(env);
}
/** The caller holds both lifecycle coordinators; this check never opens a state writer. */
async function assertDoctorAgentLeaseAdmission(env) {
	const { assertNoOpenClawAgentDatabaseLeasesReadOnly, OpenClawAgentDatabaseLeaseActiveError } = await import("./openclaw-agent-db-lease-DPdUAF5J.mjs");
	try {
		assertNoOpenClawAgentDatabaseLeasesReadOnly({ env }, openDoctorStateSchemaReadAdmission);
	} catch (error) {
		if (error instanceof OpenClawAgentDatabaseLeaseActiveError) throw createDoctorAgentLeaseRefusal(env, error);
		const { preflightOpenClawDatabaseSchemas } = await import("./openclaw-database-preflight-ClnnU5e8.mjs");
		const unreadable = (await preflightOpenClawDatabaseSchemas({
			env,
			scope: "state",
			openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission
		})).indeterminate.find((database) => database.kind === "state");
		if (unreadable) throw new DoctorUnreadableStateDatabaseError(unreadable.path, unreadable.reason);
		throw error;
	}
}
//#endregion
//#region src/commands/doctor-maintenance-exit.ts
/** Let admitted repair work settle before restoring the service and exiting. */
function holdDoctorMaintenanceExit(reportInterruption) {
	const controller = new AbortController();
	const finished = createDeferredCore();
	finished.promise.catch(() => void 0);
	const unregister = registerSignalExitGate(finished.promise, (signal) => {
		if (controller.signal.aborted) return;
		const message = `Doctor interrupted${signal ? ` by ${signal}` : ""}; cancelling inspections and settling admitted repairs before exit.`;
		controller.abort(new Error(message));
		try {
			reportInterruption?.(message);
		} catch {}
	});
	let active = true;
	const release = (failed = false) => {
		if (!active) return;
		active = false;
		unregister();
		if (failed) finished.reject(/* @__PURE__ */ new Error("Doctor maintenance did not complete."));
		else finished.resolve();
	};
	return {
		signal: controller.signal,
		release
	};
}
//#endregion
//#region src/commands/doctor-maintenance-stale-service.ts
function doctorGatewayMaintenanceError(params) {
	const restart = formatCliCommand("openclaw gateway restart", params.env);
	const next = `Run ${formatCliCommand("openclaw gateway status --deep", params.env)}; resolve the reported failure, then ${formatCliCommand("openclaw doctor --fix", params.env)} and ${restart}.`;
	const message = `Doctor ${params.phase} failed. ${params.detail} ${next}`;
	const failureFacts = [createUpdateFailureFact({
		check: params.phase,
		code: params.code,
		message: params.detail
	}, params.env), createUpdateFailureFact({
		check: params.phase,
		code: "stale-gateway-recovery-command",
		message: next
	}, params.env)];
	return params.phase === "gateway-stop" ? new DoctorMaintenanceRefusalError(message, {
		kind: "data-at-risk",
		reason: "gateway-state-unverified"
	}, {
		cause: params.cause,
		failureFacts
	}) : new UpdateDoctorError(message, failureFacts, { cause: params.cause });
}
/** Identify predecessor code without requiring startup before offline migrations. */
async function inspectStaleDoctorGateway(params) {
	const { before, root, env } = params;
	const legacy = await readLegacyGatewayLockIdentity(env);
	if (!before.running && !legacy) return;
	const serviceEnv = before.serviceEnv ?? env;
	const service = resolveGatewayService();
	const [version, buildId, serviceCommand] = await Promise.all([
		readPackageVersion(root),
		readBuiltGatewayBuildId(root),
		service.readCommand(serviceEnv).catch(() => null)
	]);
	params.assertCurrent?.();
	if ((!version || !buildId) && !legacy) return;
	const port = await resolveUpdatedGatewayRestartPort({
		serviceEnv,
		serviceCommand
	});
	const health = legacy ? void 0 : await inspectGatewayRestart({
		service,
		port,
		env: serviceEnv,
		expectedVersion: version,
		expectedBuildId: buildId,
		openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission,
		requirePluginHealth: false
	});
	params.assertCurrent?.();
	if (!(legacy || health?.buildIdMismatch?.actual != null || health?.versionMismatch || health?.staleConnection !== void 0)) return;
	const pid = legacy?.pid ?? before.servicePid ?? health?.runtime.pid;
	if (before.serviceUpdateVerdict?.kind !== "owned" || !before.serviceEnv || !before.running || legacy && (legacy.state !== "alive" || legacy.pid !== before.servicePid)) throw doctorGatewayMaintenanceError({
		env,
		phase: "gateway-stop",
		code: "stale-gateway-service-unverified",
		detail: `Gateway PID ${pid ?? "unknown"} is stale, but its managed service ownership is unverified. ${before.blockMessage ?? before.serviceMutationSkipMessage ?? ""}`
	});
	if (!version || !buildId) throw doctorGatewayMaintenanceError({
		env,
		phase: "gateway-stop",
		code: "stale-gateway-identity-unavailable",
		detail: "The installed candidate's build identity is unavailable."
	});
	return {
		version,
		buildId,
		pid,
		port
	};
}
async function assertStaleDoctorGatewayStopped(params) {
	const runtime = await resolveGatewayService().readRuntime(params.env);
	const port = await probePortUsage(params.stale.port);
	const legacy = await readLegacyGatewayLockIdentity(params.env);
	params.assertCurrent?.();
	if (runtime.status !== "stopped" || (runtime.pid ?? 0) > 0 || port !== "free" || legacy) throw new Error(`Stale Gateway PID ${params.stale.pid ?? "unknown"} did not stop: service=${runtime.status}, PID=${runtime.pid ?? "none"}, port ${params.stale.port}=${port}, legacy lock owner=${legacy?.pid ?? "none"}.`);
}
//#endregion
//#region src/commands/doctor-maintenance-foreground.ts
async function acquireDoctorGatewayMaintenanceOwner(databasePath, env, params) {
	const updateRepair = isDoctorUpdateRepairMode(resolveDoctorRepairMode(params.options));
	let foreground;
	let ownerlessDeadlineMs;
	return await acquireWithWait({
		acquire: async () => {
			try {
				const owner = await acquireGatewayLock({
					env,
					role: "sqlite-maintenance",
					allowInTests: true,
					lifecycleDeadlineMs: params.deadlineMs,
					assertCurrent: params.assertCurrent,
					onWait: params.runtime.log,
					relocatedMaintenanceOwner: params.relocatedMaintenanceOwner
				});
				if (!owner) throw new Error(`Doctor could not acquire maintenance ownership for ${databasePath}`);
				return owner;
			} catch (error) {
				if (error instanceof GatewayLockError && error.cause instanceof GatewayStateOwnerContentionError) throw error.cause;
				throw error;
			}
		},
		shouldRetry: (error) => {
			if (!updateRepair || !params.assertCurrent || !(error instanceof GatewayStateOwnerContentionError)) return false;
			params.assertCurrent();
			const current = readGatewayOwnerLease({
				env,
				current: true,
				openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission
			});
			if (!foreground) {
				if (!current) {
					if (ownerlessDeadlineMs === void 0) {
						ownerlessDeadlineMs = performance.now() + GATEWAY_SHUTDOWN_RESERVE_MS;
						params.runtime.log("Waiting for Gateway state ownership cleanup to finish.");
					}
					return performance.now() < ownerlessDeadlineMs;
				}
				if (ownerlessDeadlineMs !== void 0) return false;
				if (current.state !== "live" || current.mode !== "foreground") return false;
				foreground = current;
				params.runtime.log("Waiting for the previous foreground Gateway to release state.");
			} else if (current && (current.owner !== foreground.owner || current.pid !== foreground.pid || current.startedAt !== foreground.startedAt || current.host !== foreground.host || current.mode !== "foreground")) return false;
			return readStateLeaseProcessOwnerStatus(foreground) === "live";
		},
		deadlineMs: Math.min(params.deadlineMs ?? Infinity, performance.now() + TICK_INTERVAL_MS + resolveGatewayRestartDeferralTimeoutMs() + GATEWAY_SERVICE_STOP_TIMEOUT_MS),
		pollIntervalMs: 100,
		maxPollIntervalMs: 1e3,
		sleep: (ms) => sleep(ownerlessDeadlineMs === void 0 ? ms : Math.min(ms, Math.max(0, ownerlessDeadlineMs - performance.now())))
	});
}
//#endregion
//#region src/commands/doctor-maintenance-state.ts
/** Database custody can change paths while stopped-service custody remains with Doctor. */
function createDoctorMaintenanceState(options) {
	const { params, env, settle } = options;
	let resources;
	let resourcesParent;
	let inspections;
	let owner;
	let selectedEnv = env;
	let captureAdmitted = false;
	let liveAuthorityReadsAdmitted = false;
	const capture = createUpdateDoctorDatabaseWriteCapture(params.databaseGenerations, {
		env,
		root: params.root ?? void 0,
		signal: options.signal,
		assertCurrent: () => owner.assertCurrent(options.assertCurrent),
		warn: options.warn
	});
	const closeResources = async (agentRoot) => {
		const drainRoot = agentRoot === null ? void 0 : agentRoot ?? (resourcesParent ? void 0 : resolveStateDir(selectedEnv));
		const failures = [];
		const closeScope = async (close, clear) => {
			try {
				await close();
				clear();
			} catch (error) {
				try {
					await close();
					clear();
					failures.push(error);
				} catch (retryError) {
					failures.push(new AggregateError([error, retryError], "Doctor maintenance resource cleanup failed.", { cause: retryError }));
				}
			}
		};
		const currentResources = resources;
		let resourcesClosed = currentResources === void 0;
		if (currentResources) await closeScope(() => currentResources.close(drainRoot === void 0 ? void 0 : async () => {
			const { closeOpenClawAgentDatabasesAsync } = await import("./openclaw-agent-db-lifecycle-CxGnM_Lx.mjs");
			await closeOpenClawAgentDatabasesAsync(drainRoot);
		}), () => {
			resourcesClosed = true;
		});
		if (inspections) {
			const current = inspections;
			await closeScope(() => current.close(), () => {
				inspections = void 0;
			});
		}
		await closeScope(async () => {
			const { closeAuthProfileReadPool } = await import("./sqlite-read-pool-B1wqThEa.mjs");
			closeAuthProfileReadPool({
				kind: "root",
				rootPath: resolveStateDir(selectedEnv)
			});
		}, () => {
			if (resourcesClosed) {
				resources = void 0;
				resourcesParent = void 0;
			}
		});
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, "Doctor maintenance resource cleanup failed.");
	};
	const settleCapture = async () => {
		if (owner && capture && captureAdmitted) {
			await settle(() => capture.settle());
			captureAdmitted = false;
		}
	};
	const enterResources = async (acquired) => {
		owner = acquired;
		try {
			acquired.assertCurrent(options.assertCurrent);
			resourcesParent = getOpenClawDatabaseMaintenanceScope();
			resources = createOpenClawDatabaseMaintenanceScope({
				schemaMaintenance: true,
				assertDatabaseAccess: acquired.assertDatabaseAccess,
				assertOwnerCurrent: (access) => {
					acquired.assertCurrent(() => {
						options.assertCurrent?.();
						options.assertReadCurrent();
					}, access);
				}
			});
			if (liveAuthorityReadsAdmitted) resources.run(() => admitOpenClawMaintenanceLiveAuthorityReads(resolveOpenClawStateSqlitePath(selectedEnv)));
			inspections = createSqliteReadOnlyWorkerScope({
				signal: options.signal,
				deadlineOwnedByCaller: false
			});
		} catch (error) {
			await acquired.release();
			owner = void 0;
			throw error;
		}
		if (capture && !captureAdmitted) {
			await settle(() => resources.run(() => capture.admit()));
			captureAdmitted = true;
		}
	};
	const assertOwnerCurrent = (databasePath) => {
		const assertCurrent = () => {
			owner.assertCurrent(options.assertCurrent);
			if (databasePath !== void 0) owner.assertDatabaseAccess(databasePath);
		};
		if (resources) resources.run(assertCurrent);
		else owner.run(assertCurrent);
	};
	const state = {
		get owner() {
			return owner;
		},
		get resources() {
			return resources;
		},
		get hasOpenResources() {
			return Boolean(resources || inspections);
		},
		get receipt() {
			return owner ? void 0 : capture?.receipt;
		},
		run(operation) {
			return resources.run(() => inspections.run(operation));
		},
		async acquire(relocatedMaintenanceOwner) {
			if (resources) return;
			const assertCurrent = relocatedMaintenanceOwner ? () => relocatedMaintenanceOwner.assertCurrent(options.assertCurrent) : options.assertCurrent;
			const acquired = await acquireDoctorGatewayMaintenanceOwner(path.resolve(resolveOpenClawStateSqlitePath(selectedEnv)), selectedEnv, {
				...params,
				assertCurrent,
				deadlineMs: options.deadline(),
				relocatedMaintenanceOwner
			});
			await enterResources(acquired);
		},
		async prepareRepair() {
			const beforeStateMutation = params.beforeStateMutation;
			if (beforeStateMutation) {
				await resources.run(() => beforeStateMutation({
					env: selectedEnv,
					signal: options.signal
				}));
				resources.assertAdmission();
			}
			resources.run(() => admitOpenClawMaintenanceLiveAuthorityReads(resolveOpenClawStateSqlitePath(selectedEnv)));
			liveAuthorityReadsAdmitted = true;
			const { resolvePendingLegacyStateDirMigrationPaths, prepareLegacyStateDirMigration } = await import("./state-migrations.state-dir-CJiqfH00.mjs");
			const pending = resolvePendingLegacyStateDirMigrationPaths({ env });
			const sourceDir = resolveStateDir(env);
			if (!pending || path.resolve(sourceDir) !== path.resolve(pending.source)) return;
			owner.assertCurrent(options.assertCurrent);
			const sourceDatabase = resolveOpenClawStateSqlitePath(env);
			await closeResources(sourceDir);
			await closeOpenClawStateDatabaseByPathAsync(sourceDatabase);
			await settleCapture();
			const migration = owner.run(() => {
				options.assertCurrent?.();
				owner.assertCurrent();
				return prepareLegacyStateDirMigration({ env });
			});
			selectedEnv = {
				...env,
				OPENCLAW_STATE_DIR: migration?.stateDir ?? sourceDir
			};
			if (resolveGatewayStateOwnerPath(resolveOpenClawStateSqlitePath(selectedEnv)) !== owner.lockPath) await state.acquire(owner);
			else await enterResources(owner);
			if (migration) {
				const result = migration.result;
				for (const change of [...result.changes, ...result.notices ?? []]) params.runtime.log(sanitizeDoctorNote(change));
				for (const warning of result.warnings) options.warn(sanitizeDoctorNote(warning));
			}
		},
		async repairSqliteNoCow(paths) {
			if (paths.length === 0) return {
				changes: [],
				warnings: []
			};
			const { repairDoctorSqliteNoCow } = await import("./doctor-sqlite-nocow-BXYxRWfs.mjs");
			const stateDir = resolveStateDir(selectedEnv);
			const databasePath = resolveOpenClawStateSqlitePath(selectedEnv);
			assertOwnerCurrent();
			await closeResources(stateDir);
			try {
				return await owner.run(async () => {
					await closeOpenClawStateDatabaseByPathAsync(databasePath);
					await assertDoctorAgentLeaseAdmission(selectedEnv);
					return repairDoctorSqliteNoCow({
						paths,
						stateDir,
						assertCurrent: () => assertOwnerCurrent(databasePath)
					});
				});
			} finally {
				await enterResources(owner);
			}
		},
		async enableSqliteReclamation(agents) {
			const { enableDoctorSqliteReclamation } = await import("./doctor-sqlite-reclamation-BziR_LyO.mjs");
			const { closeOpenClawAgentDatabaseByPathAsync } = await import("./openclaw-agent-db-lifecycle-CxGnM_Lx.mjs");
			const databasePath = resolveOpenClawStateSqlitePath(selectedEnv);
			options.signal.throwIfAborted();
			assertOwnerCurrent();
			await resources.run(async () => {
				for (const agent of agents) await closeOpenClawAgentDatabaseByPathAsync(agent.path, agent.agentId);
			});
			await closeResources(null);
			let operationError;
			let result;
			try {
				result = await owner.run(async () => {
					await closeOpenClawStateDatabaseByPathAsync(databasePath);
					await assertDoctorAgentLeaseAdmission(selectedEnv);
					return enableDoctorSqliteReclamation({
						env: selectedEnv,
						agents,
						signal: options.signal,
						assertCurrent: () => assertOwnerCurrent(databasePath),
						log: params.runtime.log
					});
				});
			} catch (error) {
				operationError = toErrorObject(error, "SQLite reclamation failed.");
			}
			try {
				await enterResources(owner);
			} catch (error) {
				if (operationError !== void 0) throw new AggregateError([operationError, error], "SQLite reclamation and maintenance scope restoration failed.", { cause: error });
				throw error;
			}
			if (operationError !== void 0) throw operationError;
			return result;
		},
		async cleanupRetainedRuntimes(inspectService) {
			const { captureRetainedNativeWorkerSource } = await import("./worker-native-lifecycle-B7QmGwq_.mjs");
			const { retireIdleOpenClawStateReadWorkers } = await import("./openclaw-state-read-worker-jDU7OqV_.mjs");
			const { prepareRetainedUpdateRuntimeCleanup } = await import("./doctor-retained-runtime-ClGIUh-T.mjs");
			assertOwnerCurrent();
			const cleanup = await state.run(() => prepareRetainedUpdateRuntimeCleanup(selectedEnv, { inspectService }));
			const nativeSource = captureRetainedNativeWorkerSource();
			let readersRetired;
			let brokerRetired;
			try {
				await closeResources();
				readersRetired = await retireIdleOpenClawStateReadWorkers(nativeSource);
				brokerRetired = await nativeSource.retireIdleBroker();
			} catch (cause) {
				throw new DoctorMaintenanceRefusalError(`Doctor inspection resource cleanup failed: ${formatErrorMessage(cause)}. Resolve this cleanup failure before restarting the Gateway or rerunning openclaw doctor --fix.`, {
					kind: "data-at-risk",
					reason: "active-mutation"
				}, { cause });
			}
			try {
				await owner.run(() => cleanup(true, {
					assertCurrent() {
						assertOwnerCurrent();
						owner.assertDatabaseAccess(resolveOpenClawStateSqlitePath(selectedEnv));
					},
					assertResourcesSettled() {
						if (!readersRetired || !brokerRetired || nativeSource.hasActiveWorkers) throw new Error(`independent native work in this process (PID: ${process.pid}); let these holders finish, then rerun openclaw doctor --fix`);
					}
				}));
			} finally {
				await enterResources(owner);
			}
		},
		async release() {
			const failures = [];
			try {
				await closeResources();
			} catch (error) {
				if (hasCommandProcessCleanupError(error) || state.hasOpenResources) throw error;
				failures.push(error);
			}
			try {
				await settleCapture();
			} catch (error) {
				if (hasCommandProcessCleanupError(error)) throw error;
				failures.push(error);
			}
			try {
				await owner?.release();
				owner = void 0;
			} catch (error) {
				failures.push(error);
			}
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Doctor maintenance state cleanup failed.");
		}
	};
	return state;
}
//#endregion
//#region src/commands/doctor-maintenance.ts
async function beginDoctorMaintenance(params) {
	if (!(params.options.repair === true || params.options.yes === true)) return;
	const env = {
		...process.env,
		...params.runId ? { [UPDATE_RUN_ID_ENV]: params.runId } : {}
	};
	const parentActivation = isDoctorUpdateRepairMode(resolveDoctorRepairMode(params.options)) ? resolveUpdateParentGatewayActivation(env) : void 0;
	let stopped;
	let serviceUpdateVerdict;
	let stopDeadline;
	const warnings = [];
	const warn = (message) => {
		warnings.push(message);
		params.runtime.log(message);
	};
	const failureFacts = [];
	let repairStoresMayBeOpen = false;
	let retainStoppedInstallation = false;
	let inspectingActivation = false;
	let staleReplacement;
	let assertUpdateAdmissionReadCurrent;
	let assertUpdateAdmissionCurrent;
	let authorityRefused = false;
	const assertAuthority = (assertion) => {
		try {
			assertion();
		} catch (error) {
			authorityRefused = true;
			throw error;
		}
	};
	const callerAssertCurrent = params.assertCurrent;
	const assertCallerCurrent = callerAssertCurrent ? () => assertAuthority(callerAssertCurrent) : void 0;
	let cleanupFailure;
	const settle = async (operation) => {
		if (cleanupFailure) throw cleanupFailure.error;
		try {
			return await withCommandProcessScope(operation);
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) cleanupFailure ??= { error };
			throw error;
		}
	};
	const acquireStoppedMaintenanceResources = () => acquireWithWait({
		acquire: () => state.acquire(),
		shouldRetry: (error) => stopped?.stopped === true && error instanceof GatewayStateOwnerContentionError,
		deadlineMs: stopDeadline ?? performance.now(),
		pollIntervalMs: 250,
		maxPollIntervalMs: 2e3
	});
	const releaseState = async () => {
		if (cleanupFailure) throw cleanupFailure.error;
		await state.release();
		repairStoresMayBeOpen = false;
	};
	let deferredStateReleaseFailure;
	const throwDeferredStateReleaseFailure = () => {
		if (deferredStateReleaseFailure !== void 0) throw deferredStateReleaseFailure;
	};
	const release = async (assertCustody) => {
		await settle(async () => {
			try {
				await releaseState();
			} catch (error) {
				if (hasCommandProcessCleanupError(error) || state.hasOpenResources) throw error;
				deferredStateReleaseFailure ??= toErrorObject(error, "Doctor state release failed.");
			}
			const recovery = stopped?.windowsTaskAutoStartRecovery;
			try {
				assertCustody?.();
				if (!retainStoppedInstallation) await settle(async () => {
					await recovery?.restore(true);
				});
			} finally {
				if (!cleanupFailure) await settle(async () => recovery?.complete(!retainStoppedInstallation));
			}
		});
	};
	const finish = async (cfg, assertCustody, writeConfig, assertRestoreAdmission = assertUpdateAdmissionCurrent) => {
		await release(assertCustody);
		assertCustody?.();
		const before = stopped;
		const root = params.root;
		if (!before?.serviceEnv || !root) return;
		if (!before.stopped) {
			const verdict = before.serviceUpdateVerdict;
			if (verdict?.kind === "owned" && verdict.requiresInstallRootRefresh) {
				const { inspectGatewayServiceInstallationDrift } = await import("./service-layout-B33QDzfj.mjs");
				const drift = await inspectGatewayServiceInstallationDrift({ packageRootReal: verdict.root }, root);
				if (drift) {
					const { formatGatewayServiceInstallationDrift } = await import("./shared-Df9HUM_-.mjs");
					const message = formatGatewayServiceInstallationDrift(drift, void 0, before.serviceEnv, {
						stopped: true,
						port: before.servicePort
					});
					warn(message);
					return;
				}
			}
			if (resolveDoctorRepairMode(params.options).updateInProgress || before.offline !== true || verdict?.kind !== "owned" || verdict.requiresInstallRootRefresh) return;
		}
		try {
			const serviceEnv = before.serviceEnv;
			const [{ restoreDoctorGatewayService }, { resolveUpdatedGatewayRestartPort }, { renderRestartDiagnostics, waitForGatewayHealthyRestart }] = await Promise.all([
				import("./doctor-maintenance-restoration-B7qrLSvA.mjs"),
				import("./update-command-service-plan-DhvGRHPO.mjs"),
				import("./restart-health-CMSaWMPL.mjs")
			]);
			const { service, state, cfg: restoredConfig } = await restoreDoctorGatewayService({
				before,
				serviceEnv,
				root,
				env,
				cfg,
				writeConfig,
				options: params.options,
				runtime: params.runtime,
				signal: exit.signal,
				warnings,
				settle,
				assertCustody,
				assertRestoreAdmission,
				assertInstallationAdmission: assertUpdateAdmissionCurrent
			});
			if (!state) return;
			const port = await resolveUpdatedGatewayRestartPort({
				config: restoredConfig,
				serviceEnv: state.env,
				serviceCommand: state.command
			});
			const health = await settle(() => waitForGatewayHealthyRestart({
				service,
				port,
				env: state.env,
				requireRunningService: true,
				...staleReplacement ? {
					expectedVersion: staleReplacement.version,
					expectedBuildId: staleReplacement.buildId,
					requirePluginHealth: false
				} : {}
			}));
			if (health.outcome === "starting") {
				warn(`Warning: Doctor repair complete; Gateway is still starting — check \`${formatCliCommand("openclaw gateway status", state.env)}\` in a minute.`);
				return;
			}
			if (health.outcome !== "ready") throw doctorGatewayMaintenanceError({
				env,
				phase: "gateway-restoration",
				code: "doctor-gateway-rpc-verification-failed",
				detail: `Doctor repaired state, but the managed Gateway did not become ready: ${renderRestartDiagnostics(health).join(" ")}.`
			});
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) {
				cleanupFailure ??= { error };
				throw error;
			}
			if (error instanceof GatewayServiceAuthorityError) {
				const { formatDaemonServiceInstallCommand } = await import("./shared-Df9HUM_-.mjs");
				const serviceEnv = before.serviceEnv;
				const outcome = error.outcome ?? "recovery-pending";
				const message = `Doctor could not finish Gateway installation or activation under its maintenance authority (${outcome}). ${outcome === "unchanged" ? "The previous service definition was left unchanged." : outcome === "restored" ? "The previous service definition was restored from its captured backup." : "Restoration was not verified; inspect the current service before replacing it."} Run \`${formatCliCommand("openclaw gateway status --deep", serviceEnv)}\`; after the active maintenance or update finishes, run \`${formatDaemonServiceInstallCommand(serviceEnv, before.servicePort)}\` from the active CLI. Reason: ${error.message}`;
				failureFacts.push(createUpdateFailureFact({
					check: "gateway-restoration",
					code: `${error.code}-${outcome}`,
					message
				}, serviceEnv));
				warnings.push(message);
				params.runtime.error(message);
				if (outcome === "recovery-pending") throw new UpdateDoctorError(message, failureFacts, { cause: error });
				return;
			}
			if (error instanceof UpdateDoctorError) throw error;
			throw doctorGatewayMaintenanceError({
				env,
				phase: "gateway-restoration",
				code: findServiceOwnershipRefusal(error)?.reason ?? "doctor-gateway-restoration-failed",
				detail: `The managed Gateway could not be restored after Doctor maintenance: ${String(error)}`,
				cause: error
			});
		}
		params.runtime.log("Gateway restarted and verified after Doctor repair.");
		if (staleReplacement) {
			const warning = `Warning: Replaced stale Gateway PID ${staleReplacement.pid ?? "unknown"} through its service manager; verified ${staleReplacement.version} build ${staleReplacement.buildId} after Doctor maintenance.`;
			warn(warning);
		}
	};
	const admitRepair = async () => {
		inspectingActivation = false;
		await assertLegacyGatewayStoppedForMaintenance(env);
		await acquireStoppedMaintenanceResources();
		assertUpdateAdmissionCurrent?.();
		await assertDoctorAgentLeaseAdmission(env);
		repairStoresMayBeOpen = true;
	};
	let admissionFailureHandled = false;
	const failAdmission = async (error, assertStopCustody) => {
		admissionFailureHandled = true;
		if (hasCommandProcessCleanupError(error)) throw error;
		try {
			if (stopped?.stopped) {
				try {
					await acquireStoppedMaintenanceResources();
				} catch (ownershipError) {
					const warning = ownershipError instanceof GatewayStateOwnerContentionError ? `Warning: The stopped Gateway still holds state ownership after the service stop deadline. Shared-state repair is unsafe while that writer remains active. Restoring its service; run ${formatCliCommand("openclaw gateway status --deep", env)}, then retry ${formatCliCommand("openclaw doctor --fix", env)} after shutdown completes.` : `Warning: Doctor could not reacquire maintenance ownership: ${String(ownershipError)} Restoring its service without repairing shared state.`;
					warn(warning);
				}
				const { readConfigFileSnapshot } = await import("./config/config.js");
				await finish((await readConfigFileSnapshot({
					skipPluginValidation: true,
					observe: false
				})).config, assertStopCustody, void 0, assertStopCustody ?? assertUpdateAdmissionCurrent);
				throwDeferredStateReleaseFailure();
			} else {
				await release();
				throwDeferredStateReleaseFailure();
			}
		} catch (restoreError) {
			throw new AggregateError([error, restoreError], `${String(error)} ${String(restoreError)}`, { cause: restoreError });
		}
		resolveCommandProcessSignal()?.throwIfAborted();
		if (authorityRefused || error instanceof DoctorUnreadableStateDatabaseError) throw error;
		const refusal = error instanceof DoctorMaintenanceRefusalError ? error : new DoctorMaintenanceRefusalError(`Doctor could not enter maintenance. ${String(error)}${hasGatewayServiceStopUnsafeError(error) ? "" : ` Stop the Gateway service and other OpenClaw processes using this state, then run ${formatCliCommand("openclaw doctor --fix", env)} from an independent shell.`}`, classifyDoctorMaintenanceRefusal(error), {
			cause: error,
			...error instanceof UpdateDoctorError ? { failureFacts: error.failureFacts } : {}
		});
		const recovery = inspectingActivation ? await resolveUpdateDoctorGitRecovery({ root: params.root }) : void 0;
		if (recovery) {
			refusal.message += `\n${recovery.message}`;
			recordUpdateDoctorRefusal(refusal.message);
		}
		throw refusal;
	};
	const exit = holdDoctorMaintenanceExit((message) => {
		warnings.push(message);
		params.runtime.error(message);
	});
	const state = createDoctorMaintenanceState({
		params,
		env,
		signal: exit.signal,
		deadline: () => stopDeadline,
		assertCurrent: assertCallerCurrent,
		assertReadCurrent: () => assertUpdateAdmissionReadCurrent?.(),
		settle,
		warn
	});
	try {
		await settle(async () => {
			const externallyManaged = isServiceRepairExternallyManaged();
			if (externallyManaged) await preflightExternalDoctorAgentLease(env);
			if (params.root && isDefaultInstallIdentity(env) && !externallyManaged && await shouldManageGatewayService(env)) {
				const { maybeStopManagedServiceBeforeMutableUpdate } = await import("./update-command-service-maintenance-BOokBhnH.mjs");
				inspectingActivation = true;
				let inspection;
				try {
					inspection = await maybeStopManagedServiceBeforeMutableUpdate({
						updateInstallKind: "package",
						root: params.root,
						shouldRestart: true,
						jsonMode: true,
						phase: "inspect"
					});
				} catch (error) {
					const offlineApp = await readOfflineAppOwnedDoctorInspection(error, env);
					if (!offlineApp) throw error;
					inspection = offlineApp;
					warn(offlineApp.serviceMutationSkipMessage);
				}
				assertDoctorMaintenanceInspection(inspection, env);
				serviceUpdateVerdict = inspection.serviceUpdateVerdict;
				if (inspection.serviceUpdateVerdict?.kind !== "absent" && inspection.offline !== true) assertAuthority(() => {
					const admitted = resolveDoctorUpdateAdmission(env);
					assertUpdateAdmissionReadCurrent = () => assertAuthority(admitted.assertCurrent);
					const checkAndRecord = () => assertAuthority(admitted.recordContinuation);
					assertUpdateAdmissionCurrent = () => state.owner ? state.owner.run(checkAndRecord) : checkAndRecord();
				});
				if (inspection.serviceUpdateVerdict?.kind === "owned" && inspection.serviceEnv) assertDoctorServiceSelection(env, inspection.serviceEnv);
				staleReplacement = await inspectStaleDoctorGateway({
					root: params.root,
					env,
					before: inspection,
					assertCurrent: assertUpdateAdmissionCurrent
				});
				if (parentActivation !== void 0 && !staleReplacement && inspection.serviceUpdateVerdict?.kind === "owned" && inspection.offline !== true) throw new DoctorMaintenanceRefusalError(`Doctor could not enter maintenance. Error: ${await formatUpdateDoctorServiceStopRefusal(inspection.serviceEnv ?? env)}`, {
					kind: "data-at-risk",
					reason: "gateway-state-unverified"
				});
				try {
					await state.acquire();
				} catch (error) {
					if (hasCommandProcessCleanupError(error)) throw error;
					const observationSignal = resolveCommandProcessSignal(exit.signal) ?? exit.signal;
					const servingOwner = await readDoctorGatewayOwnerLease(env, observationSignal);
					const legacyGatewayLock = servingOwner ? void 0 : await readActiveGatewayLockIdentity({
						env: inspection.serviceEnv ?? env,
						requireInspection: true
					});
					observationSignal.throwIfAborted();
					assertCallerCurrent?.();
					assertUpdateAdmissionReadCurrent?.();
					if (!inspection.running || !(servingOwner?.state === "live" && servingOwner.mode === "supervised" || inspection.servicePid !== void 0 && legacyGatewayLock?.pid === inspection.servicePid)) throw error;
				}
				if (inspection.serviceUpdateVerdict?.kind === "owned") {
					inspectingActivation = false;
					if (inspection.serviceEnv) assertDoctorServiceSelection(env, inspection.serviceEnv);
					if (parentActivation === void 0 || staleReplacement) {
						inspection.serviceUpdateVerdict.refreshDefinition = inspection.serviceUpdateVerdict.requiresInstallRootRefresh === true;
						const root = params.root;
						const { withGatewayServiceOperationLock } = await import("./service-operation-lock-Bpt5AZmN.mjs");
						await withGatewayServiceOperationLock(inspection.serviceEnv ?? env, async (assertStopCustody) => {
							let assertServiceCurrent = assertUpdateAdmissionCurrent;
							try {
								await settle(async () => {
									try {
										stopDeadline = performance.now() + GATEWAY_SERVICE_STOP_TIMEOUT_MS;
										const stopService = () => maybeStopManagedServiceBeforeMutableUpdate({
											updateInstallKind: "package",
											root,
											shouldRestart: true,
											jsonMode: true,
											expectedService: inspection,
											retainNativeIdentity: true,
											assertCurrent: () => assertServiceCurrent?.(),
											warn,
											onStopped: (before) => {
												stopped = before;
											}
										});
										stopped = await (state.resources ? state.resources.run(stopService) : stopService());
										assertDoctorMaintenanceInspection(stopped, env);
										if (stopped.serviceUpdateVerdict?.kind === "unavailable") warn(stopped.serviceUpdateVerdict.message);
										if (staleReplacement && stopped.serviceEnv) await assertStaleDoctorGatewayStopped({
											stale: staleReplacement,
											env: stopped.serviceEnv,
											assertCurrent: assertUpdateAdmissionCurrent
										});
									} catch (error) {
										if (!staleReplacement || hasCommandProcessCleanupError(error)) throw error;
										throw doctorGatewayMaintenanceError({
											env,
											phase: "gateway-stop",
											code: "stale-gateway-stop-failed",
											detail: String(error),
											cause: error
										});
									}
									if (stopped?.stopped) params.runtime.log("Stopped the managed Gateway for Doctor repair.");
									await admitRepair();
									assertStopCustody();
								});
							} catch (error) {
								assertServiceCurrent = assertStopCustody;
								await failAdmission(error, assertStopCustody);
							}
						});
					}
				} else if (inspection.serviceUpdateVerdict?.kind === "unavailable") warn(inspection.serviceUpdateVerdict.message);
				else if (inspection.serviceUpdateVerdict?.kind !== "absent") params.runtime.log("The stopped Gateway service was left unchanged; repairing Doctor's selected state only.");
			}
			if (!repairStoresMayBeOpen) await admitRepair();
			stopped?.windowsTaskAutoStartRecovery?.beginMutation();
			retainStoppedInstallation = stopped?.serviceUpdateVerdict?.kind === "owned" && stopped.serviceUpdateVerdict.requiresInstallRootRefresh === true;
			await state.prepareRepair();
		});
	} catch (error) {
		try {
			if (admissionFailureHandled) throw error;
			await failAdmission(error);
		} finally {
			exit.release(true);
		}
	}
	let custody = "held";
	const maintenance = {
		signal: exit.signal,
		serviceUpdateVerdict,
		warnings,
		failureFacts,
		get databaseWrites() {
			return state.receipt;
		},
		run: (operation) => state.run(operation),
		releaseState: () => settle(releaseState),
		async repairSqliteNoCow(paths) {
			if (this !== maintenance || custody !== "held") throw new Error("SQLite NOCOW repair requires its original live maintenance owner.");
			const result = await settle(() => state.repairSqliteNoCow(paths));
			for (const message of result.changes) params.runtime.log(message);
			for (const message of result.warnings) warn(message);
		},
		async enableSqliteReclamation(agents) {
			if (this !== maintenance || custody !== "held") throw new Error("SQLite reclamation requires its original live maintenance owner.");
			const result = await settle(() => state.enableSqliteReclamation(agents));
			for (const message of result.warnings) warn(message);
		},
		async cleanupRetainedRuntimes() {
			if (this !== maintenance || custody !== "held") throw new Error("Updater runtime cleanup requires its original live maintenance owner.");
			await settle(() => state.cleanupRetainedRuntimes(serviceUpdateVerdict !== void 0));
		},
		async release() {
			if (this !== maintenance) throw new Error("Gateway restoration requires its original live maintenance owner.");
			custody = "released";
			try {
				await release();
				throwDeferredStateReleaseFailure();
			} catch (error) {
				exit.release(true);
				throw error;
			} finally {
				exit.release();
			}
		},
		async finish(initialConfig, writeConfig, failure) {
			let cfg = initialConfig;
			if (cleanupFailure) throw cleanupFailure.error;
			const assertCustody = (expected = "restoring") => {
				if (this !== maintenance || custody !== expected) throw new Error("Gateway restoration requires its original live maintenance owner.");
			};
			assertCustody("held");
			custody = "restoring";
			let failed = failure !== void 0;
			try {
				if (!cfg && !stopped?.stopped) {
					await release(assertCustody);
					throwDeferredStateReleaseFailure();
					return;
				}
				if (!cfg) try {
					const { readConfigFileSnapshot } = await import("./config/config.js");
					cfg = (await readConfigFileSnapshot({
						skipPluginValidation: true,
						observe: false
					})).config;
				} catch (error) {
					throw new DoctorMaintenanceRefusalError(`Doctor could not restore the Gateway because persisted repair state is not ready: ${formatErrorMessage(error)}`, {
						kind: "data-at-risk",
						reason: "incomplete-migration"
					}, { cause: error });
				}
				await finish(cfg, assertCustody, writeConfig);
				throwDeferredStateReleaseFailure();
			} catch (restoreError) {
				failed = true;
				if (failure !== void 0) throw new AggregateError([failure, restoreError], `${formatErrorMessage(failure)} ${formatErrorMessage(restoreError)}`, { cause: restoreError });
				throw restoreError;
			} finally {
				custody = "released";
				exit.release(failed);
			}
		}
	};
	return maintenance;
}
//#endregion
export { beginDoctorMaintenance };
