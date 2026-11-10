import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { o as isDefaultInstallIdentity } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as registerSignalExitGate } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { a as admitOpenClawMaintenanceLiveAuthorityReads, l as getOpenClawDatabaseMaintenanceScope, n as createOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import "./gateway-state-owner-X3EqhtYx.mjs";
import "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as createSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-context-DNk9aB7C.mjs";
import { l as closeOpenClawStateDatabaseByPathAsync } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as findStartupMaintenanceRequiredError } from "./startup-maintenance-required-D0mOtveg.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as acquireWithWait } from "./acquire-with-wait-JZafJKyw.mjs";
import { n as openDoctorStateSchemaReadAdmission } from "./openclaw-state-db-doctor-schema-l6CS6yvq.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { l as hasGatewayServiceStopUnsafeError, s as findServiceOwnershipRefusal } from "./service-inspection-error-ozNMOrIE.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { f as createUpdateDoctorDatabaseWriteCapture, o as UpdateDoctorError, t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
import { d as withCommandProcessScope, r as resolveCommandProcessSignal } from "./exec-spawn-Cn2m7YAI.mjs";
import { t as DoctorUnreadableStateDatabaseError } from "./state-repair-message-BvQp5mZ3.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-Drh-C246.mjs";
import "./gateway-shutdown-budget-c8dOC7fR.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { n as GatewayServiceAuthorityError } from "./service-update-authority-Ddw1lcTH.mjs";
import { n as GatewayLockError, o as readActiveGatewayLockIdentity } from "./gateway-lock-OT1e72lx.mjs";
import { n as probePortUsage } from "./ports-probe-FuJ7VYyD.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-S2Kgafdv.mjs";
import { n as recordUpdateDoctorRefusal, r as resolveUpdateDoctorGitRecovery, t as formatUpdateDoctorServiceStopRefusal } from "./doctor-update-refusal-oTYIgCV_.mjs";
import { i as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
import { m as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { t as createDoctorServiceInspectionBudget } from "./update-doctor-deadline-CYXeKJpA.mjs";
import { n as sanitizeDoctorNote } from "./emit-notes-4SxaFD1H.mjs";
import { c as inspectGatewayRestart } from "./restart-health-D3oE2IOJ.mjs";
import { a as readOfflineAppOwnedDoctorInspection, i as readDoctorGatewayOwnerLease, r as classifyDoctorMaintenanceRefusal, t as assertDoctorMaintenanceInspection } from "./doctor-maintenance-inspection-D2Lw5Rm3.mjs";
import { t as formatGatewayLockFailure } from "./gateway-lock-diagnostics--1HU333e.mjs";
import { c as resolveUpdateParentGatewayActivation, l as shouldManageGatewayService, n as assertDoctorServiceSelection, o as isServiceRepairExternallyManaged } from "./doctor-service-repair-policy-BmU6tTrJ.mjs";
import { n as resolveDoctorRepairMode, t as isDoctorUpdateRepairMode } from "./doctor-repair-mode-CGb0a8nw.mjs";
import { n as readLegacyGatewayLockIdentity, t as assertLegacyGatewayStoppedForMaintenance } from "./gateway-lock-legacy-C1sj9d6g.mjs";
import { t as acquireDoctorGatewayMaintenanceOwner } from "./doctor-maintenance-foreground-DXZTu4iv.mjs";
import { t as resolveDoctorUpdateAdmission } from "./doctor-maintenance-admission-BoQKV4I7.mjs";
import fs from "node:fs";
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
	const { readActiveOpenClawAgentDatabaseLeasesReadOnly } = await import("./openclaw-agent-db-lease-CyrQQFTG.mjs");
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
	const { assertNoOpenClawAgentDatabaseLeasesReadOnly, OpenClawAgentDatabaseLeaseActiveError } = await import("./openclaw-agent-db-lease-CyrQQFTG.mjs");
	try {
		assertNoOpenClawAgentDatabaseLeasesReadOnly({ env }, openDoctorStateSchemaReadAdmission);
	} catch (error) {
		if (error instanceof OpenClawAgentDatabaseLeaseActiveError) throw createDoctorAgentLeaseRefusal(env, error);
		const { preflightOpenClawDatabaseSchemas } = await import("./openclaw-database-preflight-D3lTU13W.mjs");
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
	const failureFacts = [{
		code: params.code,
		message: params.detail
	}, {
		code: "stale-gateway-recovery-command",
		message: next
	}].map((fact) => createUpdateFailureFact({
		check: params.phase,
		...fact
	}, params.env));
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
//#region src/commands/doctor-maintenance-state.ts
/** Database custody can change paths while stopped-service custody remains with Doctor. */
async function createDoctorMaintenanceState(options) {
	const { params, env, settle } = options;
	const { resolveLegacyStateConfigPath, resolvePendingLegacyStateDirMigrationPaths } = await import("./state-migrations.state-dir-UfQKyj03.mjs");
	let resources;
	let resourcesParent;
	let inspections;
	let owner;
	const legacy = resolvePendingLegacyStateDirMigrationPaths({ env });
	let selectedEnv = legacy ? {
		...env,
		OPENCLAW_STATE_DIR: legacy.source,
		OPENCLAW_CONFIG_PATH: resolveLegacyStateConfigPath(legacy.source)
	} : env;
	let captureAdmitted = false;
	let liveAuthorityReadsAdmitted = false;
	const capture = params.databaseWriteCapture ?? createUpdateDoctorDatabaseWriteCapture(params.databaseGenerations, {
		env: selectedEnv,
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
			const { closeOpenClawAgentDatabasesAsync } = await import("./openclaw-agent-db-lifecycle-DHWIzMVG.mjs");
			await closeOpenClawAgentDatabasesAsync(drainRoot);
		}), () => {
			resourcesClosed = true;
		});
		const currentInspections = inspections;
		if (currentInspections) await closeScope(() => currentInspections.close(), () => {
			inspections = void 0;
		});
		await closeScope(async () => {
			const { closeAuthProfileReadPool } = await import("./sqlite-read-pool-BaNGDOX8.mjs");
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
		if (failures.length > 0) throw failures.length === 1 ? failures[0] : new AggregateError(failures, "Doctor maintenance resource cleanup failed.");
	};
	const settleCapture = async () => {
		if (owner && capture && captureAdmitted) {
			owner.assertCurrent(options.assertCurrent);
			await settle(() => capture.settle());
			owner.assertCurrent(options.assertCurrent);
			captureAdmitted = false;
		}
	};
	const enterResources = async (acquired, assertAdmission) => {
		owner = acquired;
		try {
			acquired.assertCurrent(options.assertCurrent);
			assertAdmission?.();
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
			acquired.assertCurrent(options.assertCurrent);
			await settle(() => resources.run(() => capture.admit()));
			acquired.assertCurrent(options.assertCurrent);
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
		get env() {
			return selectedEnv;
		},
		get owner() {
			return owner;
		},
		get resources() {
			return resources;
		},
		get receipt() {
			return owner ? void 0 : capture?.receipt;
		},
		run(operation) {
			return resources.run(() => inspections.run(operation));
		},
		async acquire(assertAdmission) {
			assertAdmission?.();
			if (resources) return;
			if (legacy && selectedEnv !== env && !fs.lstatSync(legacy.source).isDirectory()) throw new Error(`Legacy state path is not a directory: ${legacy.source}; move it manually before rerunning Doctor.`);
			const acquired = await acquireDoctorGatewayMaintenanceOwner(path.resolve(resolveOpenClawStateSqlitePath(selectedEnv)), selectedEnv, {
				...params,
				assertCurrent: options.assertCurrent,
				assertAdmission,
				deadlineMs: options.deadline()
			});
			await enterResources(acquired, assertAdmission);
		},
		async prepareRepair(assertAdmission) {
			assertAdmission?.();
			const beforeStateMutation = params.beforeStateMutation;
			if (beforeStateMutation) {
				await resources.run(() => beforeStateMutation({
					env: selectedEnv,
					signal: options.signal
				}));
				assertAdmission?.();
				resources.assertAdmission();
			}
			resources.run(() => admitOpenClawMaintenanceLiveAuthorityReads(resolveOpenClawStateSqlitePath(selectedEnv)));
			liveAuthorityReadsAdmitted = true;
			const { prepareLegacyStateDirMigration } = await import("./state-migrations.state-dir-UfQKyj03.mjs");
			const pending = resolvePendingLegacyStateDirMigrationPaths({ env });
			const sourceDir = resolveStateDir(selectedEnv);
			if (!legacy) return;
			if (!pending || path.resolve(sourceDir) !== path.resolve(pending.source)) throw new Error(`State directory selection changed before moving ${legacy.source} to ${legacy.target}; leave both paths unchanged and reconcile them manually before rerunning Doctor.`);
			owner.assertCurrent(options.assertCurrent);
			const sourceDatabase = resolveOpenClawStateSqlitePath(selectedEnv);
			await closeResources(sourceDir);
			await owner.run(() => closeOpenClawStateDatabaseByPathAsync(sourceDatabase));
			await settleCapture();
			await owner.release();
			owner = void 0;
			options.assertCurrent?.();
			assertAdmission?.();
			const migration = prepareLegacyStateDirMigration({ env });
			if (migration && !migration.result.migrated) throw new Error(migration.result.warnings.join("\n"));
			selectedEnv = env;
			await state.acquire(assertAdmission);
			if (migration) {
				const { loadDotEnv } = await import("./dotenv-C8CWM4Us.mjs");
				loadDotEnv({ quiet: true });
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
			const { repairDoctorSqliteNoCow } = await import("./doctor-sqlite-nocow-Dkwyfd3K.mjs");
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
						env: selectedEnv,
						assertCurrent: () => assertOwnerCurrent(databasePath)
					});
				});
			} finally {
				await enterResources(owner);
			}
		},
		async enableSqliteReclamation(agents) {
			const { enableDoctorSqliteReclamation } = await import("./doctor-sqlite-reclamation-DcaEUIUF.mjs");
			const { closeOpenClawAgentDatabaseByPathAsync } = await import("./openclaw-agent-db-lifecycle-DHWIzMVG.mjs");
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
			const { captureRetainedNativeWorkerSource } = await import("./worker-native-lifecycle-CdF-oH9b.mjs");
			const { retireIdleOpenClawStateReadWorkers } = await import("./openclaw-state-read-worker-B9_NrpKS.mjs");
			const { prepareRetainedUpdateRuntimeCleanup } = await import("./doctor-retained-runtime-BFw-TQMQ.mjs");
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
		/** Returns a settled cleanup failure; throws only while Doctor must retain custody. */
		async release() {
			const failures = [];
			try {
				await closeResources();
			} catch (error) {
				if (hasCommandProcessCleanupError(error) || resources || inspections) throw error;
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
			if (failures.length === 0) return;
			return failures.length === 1 ? toErrorObject(failures[0], "Doctor maintenance state cleanup failed.") : new AggregateError(failures, "Doctor maintenance state cleanup failed.");
		}
	};
	return state;
}
//#endregion
//#region src/commands/doctor-maintenance.ts
async function beginDoctorMaintenance(params) {
	if (!(params.options.repair === true || params.options.yes === true || params.interactiveRepair)) return;
	const remainingServiceInspectionMs = createDoctorServiceInspectionBudget(params.serviceInspectionDeadlineAtMs);
	const assertDeadline = params.serviceInspectionDeadlineAtMs === void 0 ? void 0 : remainingServiceInspectionMs;
	assertDeadline?.();
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
	const acquireStoppedMaintenanceResources = (assertAdmission) => acquireWithWait({
		acquire: () => state.acquire(assertAdmission),
		shouldRetry: (error) => stopped?.stopped === true && error instanceof GatewayStateOwnerContentionError,
		deadlineMs: stopDeadline ?? performance.now(),
		pollIntervalMs: 250,
		maxPollIntervalMs: 2e3
	});
	const throwSettledFailure = (failure) => {
		if (failure !== void 0) throw failure;
	};
	const releaseAndRestoreAutoStart = (assertCustody) => settle(async () => {
		const settledFailure = await state.release();
		const recovery = stopped?.windowsTaskAutoStartRecovery;
		try {
			assertCustody?.();
			if (!retainStoppedInstallation) await settle(async () => {
				await recovery?.restore(true);
			});
		} finally {
			if (!cleanupFailure) await settle(async () => recovery?.complete(!retainStoppedInstallation));
		}
		return settledFailure;
	});
	const release = async (assertCustody) => throwSettledFailure(await releaseAndRestoreAutoStart(assertCustody));
	const restoreGateway = async (cfg, assertCustody, writeConfig, assertRestoreAdmission = assertUpdateAdmissionCurrent) => {
		assertCustody?.();
		const before = stopped;
		const root = params.root;
		if (!before?.serviceEnv || !root) return;
		if (!before.stopped) {
			const verdict = before.serviceUpdateVerdict;
			if (verdict?.kind === "owned" && verdict.requiresInstallRootRefresh) {
				const { inspectGatewayServiceInstallationDrift } = await import("./service-layout-Dr6dKWIt.mjs");
				const drift = await inspectGatewayServiceInstallationDrift({ packageRootReal: verdict.root }, root);
				if (drift) {
					const { formatGatewayServiceInstallationDrift } = await import("./shared-widQJixd.mjs");
					const message = formatGatewayServiceInstallationDrift(drift, void 0, before.serviceEnv, {
						stopped: true,
						port: before.servicePort
					});
					warn(message);
					return;
				}
			}
			if (params.interactiveRepair && params.options.repair !== true && params.options.yes !== true || resolveDoctorRepairMode(params.options).updateInProgress || before.offline !== true || verdict?.kind !== "owned" || verdict.requiresInstallRootRefresh) return;
		}
		try {
			const serviceEnv = before.serviceEnv;
			const [{ restoreDoctorGatewayService }, { resolveUpdatedGatewayRestartPort }, { renderRestartDiagnostics, waitForGatewayHealthyRestart }] = await Promise.all([
				import("./doctor-maintenance-restoration-CNPPkhm_.mjs"),
				import("./update-command-service-plan-DEiv-x4w.mjs"),
				import("./restart-health-Kq1hDjYh.mjs")
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
			if (health.outcome === "starting" || health.outcome !== "ready" && health.runtime.status === "running") {
				warn(`Warning: Doctor repair complete; Gateway started but readiness was not verified. ${renderRestartDiagnostics(health).join(" ")} Run \`${formatCliCommand("openclaw gateway status --deep", state.env)}\` or \`${formatCliCommand("openclaw gateway diagnostics export", state.env)}\`.`);
				return;
			}
			if (health.outcome !== "ready") throw doctorGatewayMaintenanceError({
				env,
				phase: "gateway-restoration",
				code: "doctor-gateway-rpc-verification-failed",
				detail: `Doctor repaired state, but the managed Gateway did not become ready: ${renderRestartDiagnostics(health).join(" ")}.`
			});
		} catch (error) {
			params.runtime.error(`Warning: Doctor could not complete Gateway restoration: ${formatErrorMessage(error)}. After Doctor exits, run ${formatCliCommand("openclaw gateway status --deep", env)}; resolve the reported failure, then run ${formatCliCommand("openclaw gateway start", env)}.`);
			if (hasCommandProcessCleanupError(error)) {
				cleanupFailure ??= { error };
				throw error;
			}
			if (error instanceof GatewayServiceAuthorityError) {
				const { recordDoctorGatewayRestorationRefusal } = await import("./doctor-maintenance-restoration-CNPPkhm_.mjs");
				await recordDoctorGatewayRestorationRefusal({
					serviceEnv: before.serviceEnv,
					error,
					before,
					warnings,
					failureFacts,
					runtime: params.runtime
				});
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
	const finish = async (initialConfig, assertCustody, writeConfig, assertRestoreAdmission) => {
		let cfg = initialConfig;
		const settledFailure = await releaseAndRestoreAutoStart(assertCustody);
		if (!cfg && !stopped?.stopped) {
			throwSettledFailure(settledFailure);
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
		await restoreGateway(cfg, assertCustody, writeConfig, assertRestoreAdmission);
		throwSettledFailure(settledFailure);
	};
	const admitRepair = async () => {
		inspectingActivation = false;
		await assertLegacyGatewayStoppedForMaintenance(state.env);
		await acquireStoppedMaintenanceResources(assertDeadline);
		assertUpdateAdmissionCurrent?.();
		assertDeadline?.();
		await assertDoctorAgentLeaseAdmission(state.env);
		assertDeadline?.();
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
				await finish(void 0, assertStopCustody, void 0, assertStopCustody ?? assertUpdateAdmissionCurrent);
			} else await release();
		} catch (restoreError) {
			throw new AggregateError([error, restoreError], `${String(error)} ${String(restoreError)}`, { cause: restoreError });
		}
		resolveCommandProcessSignal()?.throwIfAborted();
		if (authorityRefused || error instanceof DoctorUnreadableStateDatabaseError) throw error;
		const newerSchema = findStartupMaintenanceRequiredError(error)?.kind === "newer-schema";
		const refusal = error instanceof DoctorMaintenanceRefusalError ? error : new DoctorMaintenanceRefusalError(`Doctor could not enter maintenance. ${error instanceof GatewayLockError ? formatGatewayLockFailure(error) : String(error)}${newerSchema || hasGatewayServiceStopUnsafeError(error) ? "" : ` Stop the Gateway service and other OpenClaw processes using this state, then run ${formatCliCommand("openclaw doctor --fix", env)} from an independent shell.`}`, classifyDoctorMaintenanceRefusal(error), {
			cause: error,
			...error instanceof UpdateDoctorError ? { failureFacts: error.failureFacts } : {}
		});
		const recovery = inspectingActivation && !newerSchema ? await resolveUpdateDoctorGitRecovery({ root: params.root }) : void 0;
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
	const state = await createDoctorMaintenanceState({
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
				const { maybeStopManagedServiceBeforeMutableUpdate } = await import("./update-command-service-maintenance-CBVmXtPq.mjs");
				inspectingActivation = true;
				let inspection;
				try {
					inspection = await maybeStopManagedServiceBeforeMutableUpdate({
						updateInstallKind: "package",
						root: params.root,
						shouldRestart: true,
						jsonMode: true,
						phase: "inspect",
						timeoutMs: remainingServiceInspectionMs()
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
					assertUpdateAdmissionCurrent = () => state.resources ? state.run(checkAndRecord) : checkAndRecord();
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
					await state.acquire(assertDeadline);
				} catch (error) {
					if (hasCommandProcessCleanupError(error)) throw error;
					const observationSignal = resolveCommandProcessSignal(exit.signal) ?? exit.signal;
					const servingOwner = await readDoctorGatewayOwnerLease(state.env, observationSignal);
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
						const { withGatewayServiceOperationLock } = await import("./service-operation-lock-Bg3Sgkmg.mjs");
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
											timeoutMs: remainingServiceInspectionMs(),
											assertCurrent: () => assertServiceCurrent?.(),
											assertDeadline,
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
			await state.prepareRepair(assertDeadline);
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
	const assertHeld = (receiver, operation) => {
		if (receiver !== maintenance || custody !== "held") throw new Error(`${operation} requires its original live maintenance owner.`);
	};
	const maintenance = {
		signal: exit.signal,
		serviceUpdateVerdict,
		warnings,
		failureFacts,
		get databaseWrites() {
			return state.receipt;
		},
		run: (operation) => state.run(operation),
		releaseState: async () => throwSettledFailure(await settle(() => state.release())),
		async repairSqliteNoCow(paths) {
			assertHeld(this, "SQLite NOCOW repair");
			const result = await settle(() => state.repairSqliteNoCow(paths));
			for (const message of result.changes) params.runtime.log(message);
			for (const message of result.warnings) warn(message);
		},
		async enableSqliteReclamation(agents) {
			assertHeld(this, "SQLite reclamation");
			const result = await settle(() => state.enableSqliteReclamation(agents));
			for (const message of result.warnings) warn(message);
		},
		async cleanupRetainedRuntimes() {
			assertHeld(this, "Updater runtime cleanup");
			await settle(() => state.cleanupRetainedRuntimes(serviceUpdateVerdict !== void 0));
		},
		async release() {
			if (this !== maintenance) throw new Error("Gateway restoration requires its original live maintenance owner.");
			custody = "released";
			try {
				await release();
			} catch (error) {
				exit.release(true);
				throw error;
			} finally {
				exit.release();
			}
		},
		async finish(initialConfig, writeConfig, failure) {
			if (cleanupFailure) throw cleanupFailure.error;
			const assertCustody = (expected = "restoring") => {
				if (this !== maintenance || custody !== expected) throw new Error("Gateway restoration requires its original live maintenance owner.");
			};
			assertCustody("held");
			custody = "restoring";
			let failed = failure !== void 0;
			try {
				await finish(initialConfig, assertCustody, writeConfig);
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
