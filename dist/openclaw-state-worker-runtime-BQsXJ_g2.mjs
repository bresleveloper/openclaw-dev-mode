import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { n as ENV_SECRET_REF_ID_RE } from "./ref-contract-D0kWy5jy.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { n as SecretStoreValidationError } from "./secret-store-validation-error-Bu8SnJkb.mjs";
import { x as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { i as sameSqliteFileGeneration, r as readStableSqliteFileGeneration } from "./sqlite-file-generation-C_XgOkXx.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { s as SqliteWorkerAdmissionTimeoutError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { g as ensureSecretStoreSchema } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import "./update-run-legacy-expiry-BU1v4N5g.mjs";
import { t as finishUpdateRunRecord } from "./update-run-record-Cu3LgwJt.mjs";
import "./config-machine-state-DR7LQrw2.mjs";
import { r as readConfigHealthSnapshotInDatabase, t as patchConfigHealthEntryInDatabase } from "./io.health-state.kernel-BtZhYoQH.mjs";
import { a as writeConfigMachineState, r as updateConfigMachineState } from "./config-machine-state-write-pMcF7uIi.mjs";
import { n as runExistingOpenClawStateWriteTransaction, t as openExistingOpenClawStateWriter } from "./openclaw-state-db-existing-write-ClzrehCM.mjs";
import { i as inspectUpdateRunAbandonment, n as inspectNewerRecoveryHistory, s as needsPostCoreRepair } from "./update-run-activity-CykyDahG.mjs";
import { i as resolveUpdateRunCodecEnv } from "./update-run-codec-DCsNX4NZ.mjs";
import { c as readUpdateRunRecord, r as hasStoredUpdateRecovery, t as canReconcileUpdateRunCandidates, u as readUpdateRuns } from "./update-run-read.kernel-D2osBKAZ.mjs";
import { r as readRecovery } from "./update-run-recovery-store-CS8wUkZx.mjs";
import { a as isRequiredUpdateRunStep, c as persistRun, d as upsertStep, n as applyUpdateRunPhase, r as applyUpdateRunStep, s as mutateRunInTransaction, t as UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS, u as updateRunLedgerSchema } from "./update-run-write-DdGOnqyV.mjs";
import { n as assertAgentDeletionRecoveryHoldPredicate } from "./agent-deletion-journal-recovery.kernel-NYQbfJsi.mjs";
import { c as readAgentProvenanceBatchInDatabase, o as ensureAgentProvenanceSchema, s as listAgentProvenanceInDatabase } from "./agent-provenance-H6O0H8k6.mjs";
import { D as ensureUserProfilesSchema, h as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-DlO1LBbo.mjs";
import { a as updatesGitCoauthorPreference, i as readUserPreferences, n as ensureUserPreferencesSchema, o as writeUserPreferences } from "./user-preferences.store-B-q7i2eZ.mjs";
import { a as assertCanonicalTimestamp, d as recentWorkspaceAttestation, f as registerWorkspaceStateAliasIdentitiesInTransaction, h as resolveWorkspaceIdentityFromDatabase, i as assertCanonicalIntegerTimestamp, m as replaceWorkspaceAttestationInDatabase, o as deleteWorkspaceStateRowsInDatabase, s as hasRecentWorkspaceSetupState, u as readWorkspaceStateSnapshotFromDatabase } from "./workspace-state-store.kernel-0RlWLaF0.mjs";
import { t as readClawInstallSchemaVersionRows } from "./provenance-runtime-read.kernel-DtpsvnkX.mjs";
import { n as serializeCronLoadError } from "./load-error-DymNKrHv.mjs";
import { u as readCronStoreFingerprints } from "./row-codec-DgIrj0Uv.mjs";
import { t as loadCronStoreFromDatabase } from "./load.kernel-Dy8tLTqI.mjs";
import { i as recordCronRunInDatabase } from "./run-history.kernel-DBs5pEGz.mjs";
import { t as createWorkerOperationRegistry } from "./worker-operation-registry-DhUe8rTN.mjs";
import { t as mutateSessionGroupCatalogInDatabase } from "./session-group-catalog.kernel-5Y9zUvVe.mjs";
import { i as requestSessionEntryCurrentAdmission, r as requestSessionEntriesCurrentAdmission } from "./session-entry-current-admission.worker-DStXV6pd.mjs";
import { r as readSessionReceiptDeletionIdentitiesInDatabase, t as deletePersonalGitHubSessionReceiptsInDatabase } from "./github-personal-publication-lifecycle-BnuNz0yU.mjs";
import { r as persistInterruptedUpdateObservation } from "./update-run-interruption-store-Z6G-CWc8.mjs";
import { a as readDeviceAuthTokensFromDatabase, c as storeOriginDeviceTokenInDatabase, i as readDeviceAuthTokenObservationFromDatabase, n as clearOriginDeviceTokenInDatabase, o as readOriginDeviceTokenObservationFromDatabase, s as storeDeviceAuthTokenInDatabase, t as clearDeviceAuthTokenFromDatabase } from "./device-auth-store.kernel-BoMg89oU.mjs";
import { d as isMissingSecretStoreTableError, i as classifyHiddenGitHubStoreName } from "./secret-store-hidden-github-D9HzXdxU.mjs";
import { a as normalizeScope, i as assertSecretStoreWriteShape, l as purgeExpiredSecretStoreEntriesInDatabase, n as assertSecretStoreMutationName, o as normalizeSecretAllowedHosts } from "./secret-store-validation-4kXS6fgx.mjs";
import { a as writeSubagentRunValuesInDatabase, o as subagentRunRowVersion, t as conflictingSubagentRunVersions } from "./subagent-registry.store.kernel-5Rc86AOU.mjs";
import { a as isSessionStateUpstreamCurrentInDatabase, c as readCursor, d as upsertSeedCursor, l as recordSessionStateEventInDatabase, n as hasSessionStateWatchersInDatabase, o as normalizeOptionalSqliteNumber, r as isAmbientGroupWatchCursor, s as pruneSessionStateEventsInDatabase, t as getSessionStateKysely } from "./session-state-events.kernel-CXzdFJ4D.mjs";
import { t as listWatchedSessionUpstreamLinksInDatabase } from "./session-upstream-links.kernel-C5eUuqC0.mjs";
import { i as insertSandboxRegistryRowIfMissingInDatabase, u as writeSandboxRegistryInDatabase } from "./registry.kernel-CjtYly-h.mjs";
import { c as readTranscriptSummaryInputRevision, m as ensureMeetingTranscriptsSchema, o as readRecentStoppedTranscriptSession } from "./store-sqlite-BeM5GyX_.mjs";
import { d as queryTranscriptReadEntries, f as readLatestTranscriptEntry, h as readTranscriptLibraryEntry, m as readTranscriptEntry, p as readStoredTranscriptNotes, r as TranscriptLibraryError, t as createPreparedTranscriptDateReader } from "./store-date-preparation-BTqVnjZg.mjs";
import { t as readCronJobNamesInDatabase } from "./job-name.kernel-Cdg79CvF.mjs";
import { t as prepareCronRunReceiptWriteSchema } from "./run-receipt-write-admission-BU6jc44f.mjs";
import { a as saveCronStoreInDatabase, i as saveCronStoreChangesInDatabase, s as registerCronQuarantineInDatabase, u as serializeCronSaveError } from "./save.kernel-DXaa8SoK.mjs";
import { f as ensureCronRunReceiptSchema, l as bindCronRunReceiptExecutionInDatabase } from "./run-receipt-store-BI8RC7qi.mjs";
import { t as readAcpSessionControlInWorker } from "./session-meta-source.worker-BvhogCuh.mjs";
import { i as resolveBackupRunTarget, n as parseBackupRun, r as resolveBackupRunNamespace } from "./backup-run-records.contract.js";
import { t as TUI_LAST_SESSION_STATE_KEY_PREFIX } from "./tui-last-session.contract.js";
import { r as readPendingRepositoryGitHubPublicationInDatabase } from "./github-repository-publication.kernel-pqfSn5w4.mjs";
import { a as readTranscriptExportPathOwners, c as readTranscriptSessionEntries, d as readTranscriptUtterances, i as readTranscriptExportPathCollisions, l as readTranscriptSessionMatches, n as readTranscriptCanonicalSessionRow, o as readTranscriptJsonlDigest, r as readTranscriptExportOwnership, s as readTranscriptSessionByIdentity, t as readStoredTranscriptSummary, u as readTranscriptSummarySnapshot } from "./store-sqlite-read-BdWiODCu.mjs";
import { randomBytes } from "node:crypto";
//#region src/agents/sandbox/registry-import.worker.ts
function importSandboxRegistryRow(row, options) {
	runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		insertSandboxRegistryRowIfMissingInDatabase(db, row);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
	}, options);
}
//#endregion
//#region src/agents/sandbox/registry-write.worker.ts
function writeSandboxRegistry(write, options) {
	runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		writeSandboxRegistryInDatabase(db, write);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
	}, options, { operationLabel: `sandbox.registry.${write.operation}` });
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry.store.worker.ts
const log = createSubsystemLogger("state/worker");
/** The row owner's worker adapter commits selected versions and terminal signals together. */
function persistSubagentRunChangesInWorker(input, writeOptions) {
	const { writeId, values, deleteRunIds, versions, terminalEvents = [] } = input;
	const admittedRunIds = new Set(versions.map(({ runId }) => runId));
	if ([...values.map((row) => row.run_id), ...deleteRunIds].some((runId) => !admittedRunIds.has(runId))) throw new Error("Subagent registry write is missing a row version");
	let committedReceipt;
	try {
		return runOpenClawStateWriteTransaction((writer) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: writeId
			});
			const conflictRunIds = conflictingSubagentRunVersions(writer, versions);
			if (conflictRunIds.length > 0) return {
				writeId,
				conflictRunIds
			};
			const admitEvents = (stage) => {
				for (const [eventIndex, event] of terminalEvents.entries()) {
					requestSessionEntryCurrentAdmission(event.sessionEntryCurrentSource, {
						stage,
						facts: {
							writeId,
							eventIndex
						}
					});
					if (event.acpControl && !readAcpSessionControlInWorker(writer, event.acpControl).row) throw new Error("ACP task owner could not be verified.");
				}
			};
			admitEvents("transaction");
			writeSubagentRunValuesInDatabase(writer, values, deleteRunIds);
			const notices = [];
			for (const { event, now } of terminalEvents) notices.push(...recordSessionStateEventInDatabase(writer.db, event, now).notices);
			admitEvents("commit");
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: writeId
			});
			const receipt = {
				writeId,
				versions: new Map([...values.map((row) => [row.run_id, subagentRunRowVersion(row)]), ...deleteRunIds.map((runId) => [runId, null])]),
				notices
			};
			deferSqliteWorkerCommitReceipt(writer.db, receipt);
			deferSqlitePostCommitPublication(writer.db, () => {
				committedReceipt = receipt;
			});
			return receipt;
		}, writeOptions);
	} catch (error) {
		if (!committedReceipt) throw error;
		log.warn("Subagent registry write committed before cleanup failed", { error });
		return committedReceipt;
	}
}
//#endregion
//#region src/agents/workspace-state-store.worker.ts
function mergeSetup(database, workspaceDir, next, nowMs) {
	assertCanonicalIntegerTimestamp(nowMs, "setup update");
	if (next.bootstrapSeededAt) assertCanonicalTimestamp(next.bootstrapSeededAt, "bootstrap seeded");
	if (next.setupCompletedAt) assertCanonicalTimestamp(next.setupCompletedAt, "setup completed");
	const resolution = resolveWorkspaceIdentityFromDatabase({
		workspaceDir,
		database
	});
	const identity = resolution.identity;
	const snapshot = readWorkspaceStateSnapshotFromDatabase({
		identity,
		database
	});
	const bootstrapSeededAt = snapshot.setup.bootstrapSeededAt ?? next.bootstrapSeededAt;
	const setupCompletedAt = snapshot.setup.setupCompletedAt ?? next.setupCompletedAt;
	const merged = {
		version: 1,
		...bootstrapSeededAt ? { bootstrapSeededAt } : {},
		...setupCompletedAt ? { setupCompletedAt } : {}
	};
	const kysely = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, kysely.insertInto("workspace_setup_state").values({
		workspace_key: identity.workspaceKey,
		workspace_path: identity.workspacePath,
		version: 1,
		bootstrap_seeded_at: merged.bootstrapSeededAt ?? null,
		setup_completed_at: merged.setupCompletedAt ?? null,
		updated_at: nowMs
	}).onConflict((conflict) => conflict.column("workspace_key").doUpdateSet({
		workspace_path: identity.workspacePath,
		version: 1,
		bootstrap_seeded_at: merged.bootstrapSeededAt ?? null,
		setup_completed_at: merged.setupCompletedAt ?? null,
		updated_at: nowMs
	})));
	registerWorkspaceStateAliasIdentitiesInTransaction({
		database,
		identity,
		aliases: resolution.aliases,
		updatedAtMs: nowMs
	});
	return merged;
}
function expire(database, workspaceDir, nowMs) {
	assertCanonicalIntegerTimestamp(nowMs, "workspace expiry check");
	const resolution = resolveWorkspaceIdentityFromDatabase({
		workspaceDir,
		database
	});
	const identity = resolution.identity;
	const snapshot = readWorkspaceStateSnapshotFromDatabase({
		identity,
		database
	});
	const preserveRecentState = () => {
		registerWorkspaceStateAliasIdentitiesInTransaction({
			database,
			identity,
			aliases: resolution.aliases,
			updatedAtMs: nowMs
		});
		return false;
	};
	if (recentWorkspaceAttestation(snapshot.attestation, nowMs) || hasRecentWorkspaceSetupState(snapshot, nowMs)) return preserveRecentState();
	deleteWorkspaceStateRowsInDatabase(database, identity);
	return identity.workspacePath;
}
function executeWorkspaceStateCommand(command, database, options) {
	if (command.type === "workspace.snapshotAndRegister") {
		const initial = runSqliteDeferredTransactionSync(database.db, () => {
			assertAgentDeletionRecoveryHoldPredicate(database, command.input.recoveryHoldPredicate);
			const resolution = resolveWorkspaceIdentityFromDatabase({
				workspaceDir: command.input.workspaceDir,
				database
			});
			return {
				resolution,
				snapshot: readWorkspaceStateSnapshotFromDatabase({
					identity: resolution.identity,
					database
				})
			};
		});
		if (initial.resolution.missingAliasKeys.length === 0 || !initial.snapshot.setupExists && !initial.snapshot.attestation) return initial.snapshot;
		return runOpenClawStateWriteTransaction((writer) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const resolution = resolveWorkspaceIdentityFromDatabase({
				workspaceDir: command.input.workspaceDir,
				database: writer
			});
			if (resolution.identity.workspaceKey !== initial.resolution.identity.workspaceKey) throw new Error("Workspace state identity changed before alias registration");
			const snapshot = readWorkspaceStateSnapshotFromDatabase({
				identity: resolution.identity,
				database: writer
			});
			if (snapshot.setupExists || snapshot.attestation) registerWorkspaceStateAliasIdentitiesInTransaction({
				database: writer,
				identity: resolution.identity,
				aliases: resolution.aliases,
				updatedAtMs: Date.now()
			});
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			assertAgentDeletionRecoveryHoldPredicate(writer, command.input.recoveryHoldPredicate);
			return snapshot;
		}, options);
	}
	return runOpenClawStateWriteTransaction((writer) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = command.type === "workspace.mergeSetup" ? mergeSetup(writer, command.input.workspaceDir, command.input.next, command.input.nowMs) : expire(writer, command.input.workspaceDir, command.input.nowMs);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: command.type === "workspace.expire" ? result : void 0
		});
		assertAgentDeletionRecoveryHoldPredicate(writer, command.input.recoveryHoldPredicate);
		if (command.type === "workspace.expire") deferSqliteWorkerCommitReceipt(writer.db, result);
		return result;
	}, options);
}
//#endregion
//#region src/cron/store/load.worker.ts
function loadMutableCronStoreInWorker(database, storeKey) {
	let repairCommits = 0;
	try {
		return {
			ok: true,
			loaded: loadCronStoreFromDatabase(database.db, storeKey, {
				write: (operation, operationLabel) => runOpenClawStateWriteTransaction(({ db }) => operation(db), {
					database,
					env: getSqliteWorkerStateContext().environment
				}, { operationLabel }),
				committed: () => {
					repairCommits += 1;
				}
			}),
			repairCommits
		};
	} catch (error) {
		return {
			ok: false,
			error: serializeCronLoadError(error),
			repairCommits
		};
	}
}
//#endregion
//#region src/cron/store/save.worker.ts
function executeCronStoreSaveCommand(command, database) {
	let committed = false;
	try {
		return {
			ok: true,
			...runOpenClawStateWriteTransaction(({ db }) => {
				let value;
				if (command.type === "cron.saveChanges") value = saveCronStoreChangesInDatabase(db, command.input.storeKey, command.input.storeKey, command.input.changes, command.input.options);
				else saveCronStoreInDatabase(database, command.input.storeKey, command.input.store, command.input.options);
				deferSqlitePostCommitPublication(db, () => {
					committed = true;
				});
				return {
					value,
					names: readCronJobNamesInDatabase(db, void 0, command.input.storeKey),
					...readCronStoreFingerprints(db, command.input.storeKey)
				};
			}, {
				database,
				env: getSqliteWorkerStateContext().environment
			}, command.type === "cron.saveChanges" ? { operationLabel: "cron.config-mutation" } : void 0),
			committed
		};
	} catch (error) {
		return {
			ok: false,
			error: serializeCronSaveError(error, command.input.storeKey),
			committed
		};
	}
}
//#endregion
//#region src/cron/store/dispatch.worker.ts
const loadAdmission = createLazyRuntimeModule(() => import("./run-admission.worker-KYCA_6lV.mjs"));
let admission;
const loadRecovery = createLazyRuntimeModule(() => import("./run-recovery.worker-B_66X05c.mjs"));
let recovery;
const loadMaintenance = createLazyRuntimeModule(() => import("./runtime-maintenance.worker-Dp_Dw693.mjs"));
let maintenance;
const loadMutation = createLazyRuntimeModule(() => import("./guarded-mutation.worker-D0DlqvHb.mjs"));
let mutation;
const loadScratch = createLazyRuntimeModule(() => import("./scratch.worker-DtpkxP9e.mjs"));
let scratch;
const loadExternalState = createLazyRuntimeModule(() => import("./external-state.worker-Da9gz39m.mjs"));
let externalState;
const loadScheduler = createLazyRuntimeModule(() => import("./scheduler-state.worker-COPM8nyW.mjs"));
let scheduler;
const loadStartup = createLazyRuntimeModule(() => import("./startup-plan.worker-9YRiXVd0.mjs"));
let startup;
function prepareCronStateWorkerCommand(type) {
	if (type === "cron.planStartup" && !startup) return loadStartup().then((loaded) => {
		startup = loaded;
	});
	if (type === "cron.recordSkippedRuns" && !scheduler) return loadScheduler().then((loaded) => {
		scheduler = loaded;
	});
	if (type === "cron.mutateExternalState" && !externalState) return loadExternalState().then((loaded) => {
		externalState = loaded;
	});
	if (type === "cron.writeScratch" && !scratch) return loadScratch().then((loaded) => {
		scratch = loaded;
	});
	if (type === "cron.mutateJobs" && !mutation) return loadMutation().then((loaded) => {
		mutation = loaded;
	});
	if ([
		"cron.reserveRuns",
		"cron.activateRun",
		"cron.releaseReservations",
		"cron.markDeliveryStarted",
		"cron.finishReceipt",
		"cron.finalizeRuns",
		"cron.removeStaleFamily"
	].includes(String(type)) && !admission) return loadAdmission().then((loaded) => {
		admission = loaded;
	});
	if ((type === "cron.scheduleUnowned" || type === "cron.recordFailureAlertOutcome" || type === "cron.maintainHistory") && !maintenance) return loadMaintenance().then((loaded) => {
		maintenance = loaded;
	});
	if (type !== "cron.repairRun" || recovery) return;
	return loadRecovery().then((loaded) => {
		recovery = loaded;
	});
}
function isCronStateWorkerCommand(command) {
	switch (command.type) {
		case "cron.recordSkippedRuns":
		case "cron.planStartup":
		case "cron.mutateExternalState":
		case "cron.writeScratch":
		case "cron.mutateJobs":
		case "cron.reserveRuns":
		case "cron.recordRun":
		case "cron.activateRun":
		case "cron.releaseReservations":
		case "cron.markDeliveryStarted":
		case "cron.finishReceipt":
		case "cron.finalizeRuns":
		case "cron.removeStaleFamily":
		case "cron.loadMutable":
		case "cron.initializeRunReceipts":
		case "cron.repairRun":
		case "cron.scheduleUnowned":
		case "cron.maintainHistory":
		case "cron.recordFailureAlertOutcome":
		case "cron.save":
		case "cron.saveChanges":
		case "cron.registerQuarantine":
		case "cron.bindReceiptExecution": return true;
		default: return false;
	}
}
function executeCronStateCommand(command, database) {
	switch (command.type) {
		case "cron.registerQuarantine": return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			registerCronQuarantineInDatabase(db, command.input);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: command.type });
		case "cron.recordSkippedRuns":
			if (!scheduler) throw new Error("Cron scheduler worker is not prepared");
			return scheduler.recordSkippedCronRunsInWorker(database, command.input);
		case "cron.planStartup":
			if (!startup) throw new Error("Cron startup worker is not prepared");
			return startup.planCronStartupInWorker(database, command.input);
		case "cron.mutateExternalState":
			if (!externalState) throw new Error("Cron external-state worker is not prepared");
			return externalState.mutateCronExternalStateInWorker(database, command.input);
		case "cron.writeScratch":
			if (!scratch) throw new Error("Cron scratch worker is not prepared");
			return scratch.writeCronScratchInWorker(database, command.input);
		case "cron.mutateJobs":
			if (!mutation) throw new Error("Cron mutation worker is not prepared");
			return mutation.mutateCronJobsInWorker(database, command.input);
		case "cron.recordRun": return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const result = recordCronRunInDatabase(db, command.input);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return result;
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: command.type });
		case "cron.reserveRuns":
		case "cron.activateRun":
		case "cron.releaseReservations":
		case "cron.markDeliveryStarted":
		case "cron.finishReceipt":
		case "cron.finalizeRuns":
		case "cron.removeStaleFamily":
			if (!admission) throw new Error("Cron admission worker is not prepared");
			switch (command.type) {
				case "cron.reserveRuns": return admission.reserveCronRunsInWorker(database, command.input);
				case "cron.activateRun": return admission.activateCronRunInWorker(database, command.input);
				case "cron.releaseReservations": return admission.releaseCronReservationsInWorker(database, command.input);
				case "cron.markDeliveryStarted": return admission.markCronDeliveryStartedInWorker(database, command.input);
				case "cron.finishReceipt": return admission.finishCronReceiptInWorker(database, command.input);
				case "cron.finalizeRuns": return admission.finalizeCronRunsInWorker(database, command.input);
				case "cron.removeStaleFamily": return admission.removeStaleCronFamilyInWorker(database, command.input);
			}
		case "cron.loadMutable": return loadMutableCronStoreInWorker(database, command.input.storeKey);
		case "cron.repairRun":
			if (!recovery) throw new Error("Cron recovery worker is not prepared");
			return recovery.repairCronRunInWorker(database, command.input);
		case "cron.scheduleUnowned":
		case "cron.maintainHistory":
		case "cron.recordFailureAlertOutcome":
			if (!maintenance) throw new Error("Cron maintenance worker is not prepared");
			if (command.type === "cron.maintainHistory") return maintenance.maintainCronRunHistoryInWorker(database, command.input);
			return command.type === "cron.scheduleUnowned" ? maintenance.scheduleUnownedCronJobsInWorker(database, command.input) : maintenance.recordCronFailureAlertOutcomeInWorker(database, command.input);
		case "cron.initializeRunReceipts": return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			ensureCronRunReceiptSchema(db);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "cron.run-receipt.initialize" });
		case "cron.save":
		case "cron.saveChanges": return executeCronStoreSaveCommand(command, database);
		case "cron.bindReceiptExecution": return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const result = bindCronRunReceiptExecutionInDatabase(db, command.input.handle, command.input.binding, prepareCronRunReceiptWriteSchema(db));
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return result;
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "cron.run-receipt.execution-binding" });
		default: throw new Error("Unknown Cron shared-state worker command");
	}
}
//#endregion
//#region src/infra/update-run-mutation.worker.ts
function openUpdateRunWriter(options) {
	return openExistingOpenClawStateWriter(options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run"
	});
}
/** Retry only a rolled-back attempt, without giving later worker commands its FIFO slot. */
function withUpdateRunWriteAdmission(operation) {
	const assertCurrent = (stage) => requestSqliteWorkerOperationAdmission({
		stage,
		facts: void 0,
		...stage === "commit" ? { deadlineMs: 1e3 } : {}
	});
	for (;;) try {
		return operation(assertCurrent);
	} catch (error) {
		if (!(error instanceof SqliteWorkerAdmissionTimeoutError)) throw error;
	}
}
function recordUpdateRunMutationInWorker(command, stateOptions, assertCurrent, writer) {
	const { input } = command;
	const bookkeeping = command.type === "updateRuns.recordStep" && !input.requireNoRecovery && !isRequiredUpdateRunStep(command.input.step);
	const busyTimeoutMs = Math.min(input.busyTimeoutMs ?? 5e3, bookkeeping ? UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS : Infinity);
	const options = {
		...stateOptions,
		busyTimeoutMs,
		redactPaths: input.redactPaths
	};
	const codecOptions = {
		...options,
		env: resolveUpdateRunCodecEnv(options.env, input.redactionFacts)
	};
	let entered = false;
	try {
		assertCurrent("transaction");
		return writer.run(({ db }) => {
			entered = true;
			if (busyTimeoutMs > 5e3) setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
			if (input.requireNoRecovery) {
				const recovery = readRecovery(db, input.runId);
				if (recovery) {
					assertCurrent("commit");
					return {
						kind: "recovery-required",
						recovery
					};
				}
			}
			const record = mutateRunInTransaction(db, input.runId, (current) => {
				if (command.type === "updateRuns.recordPhase") applyUpdateRunPhase(current, command.input.phase, command.input.patch);
				else applyUpdateRunStep(current, command.input.step);
			}, codecOptions);
			assertCurrent("commit");
			return {
				kind: "recorded",
				record
			};
		}, options);
	} catch (cause) {
		if (entered || !isSqliteLockError(cause)) throw cause;
		if (bookkeeping) return { kind: "bookkeeping-skipped" };
		throw new Error("Update history database is locked; required recovery evidence was not recorded. Wait for the writer to finish, then retry `openclaw update`.", { cause });
	}
}
//#endregion
//#region src/infra/update-run-reconciliation.read.ts
function inspectUpdateRunReconciliation(db, record, input) {
	return {
		record,
		rule: hasStoredUpdateRecovery(db, record.runId) ? void 0 : inspectUpdateRunAbandonment(record, input)
	};
}
//#endregion
//#region src/infra/update-run-reconciliation.worker.ts
function reconcileUpdateRunCandidatesInWorker(command, stateOptions, assertCurrent) {
	const { candidates, selection: input, busyTimeoutMs, redactPaths } = command;
	const options = {
		...stateOptions,
		busyTimeoutMs,
		redactPaths
	};
	assertCurrent("transaction");
	return runExistingOpenClawStateWriteTransaction(({ db }) => {
		const selected = candidates.flatMap(({ record }) => {
			const current = readUpdateRunRecord(db, record.runId);
			return current ? [inspectUpdateRunReconciliation(db, current, input)] : [];
		});
		const current = selected.map(({ record }) => record);
		if (input.repairHistorySinceMs !== void 0) {
			const history = inspectNewerRecoveryHistory(input.repairHistorySinceMs, readUpdateRuns(db, { limit: 100 }));
			if (current.some((record) => record.status === "running" && needsPostCoreRepair(record)) || history.postCoreRuns.length || history.incomplete) throw new Error("Update history changed during inspection and now needs post-core maintenance. Retry openclaw update repair; if the managed Gateway cannot stop, run openclaw gateway stop first.");
		}
		if (!canReconcileUpdateRunCandidates(selected, input) || input.requireAllActive && executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("update_runs").select("run_id").where("status", "=", "running").where("run_id", "not in", candidates.map(({ record }) => record.runId)).limit(1))) {
			assertCurrent("commit");
			return {
				current,
				reconciled: []
			};
		}
		const reconciled = [];
		const result = {
			current: selected.map(({ record, rule }) => {
				if (!rule || input.legacyOnly && rule !== "legacy-driver-expired") return record;
				upsertStep(record, {
					step: "reconcile:abandoned",
					status: "failed",
					endedAtMs: Date.now(),
					detail: rule
				});
				finishUpdateRunRecord(record, {
					status: "failed",
					reason: rule === "legacy-driver-expired" ? rule : "abandoned"
				});
				const saved = persistRun(db, record, options);
				reconciled.push(saved);
				return saved;
			}),
			reconciled
		};
		assertCurrent("commit");
		return result;
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run",
		busyTimeoutMs: options.busyTimeoutMs
	});
}
//#endregion
//#region src/secrets/store/secret-store-config-ref.kernel.ts
const TEAM_SCOPE = {
	scopeKind: "team",
	scopeId: ""
};
/** 16 hex characters (64 random bits) after `_` still fit the 128-character name limit. */
const CONFIG_REF_NAME_BASE_MAX = 111;
const CONFIG_REF_NAME_MINT_ATTEMPTS = 4;
/**
* Saves a chat-provided secret for one config key under a freshly minted name,
* `NAME_<16 random hex>`. A predictable name could match a stale SecretRef
* whose entry was removed and purged, handing that consumer this key; a random
* suffix never names an entry anything already points at. No existing row is
* touched. `admit` fences the write with the requester's live authority at
* transaction and commit.
*/
function writeSecretStoreEntryForConfigRefInDatabase(input, databaseOptions, admit) {
	const base = input.baseName.slice(0, CONFIG_REF_NAME_BASE_MAX);
	if (!ENV_SECRET_REF_ID_RE.test(base)) throw new Error(`Secret store name "${base}" is invalid.`);
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		admit?.("transaction");
		ensureSecretStoreSchema(sqlite);
		const db = getNodeSqliteKysely(sqlite);
		for (let attempt = 0; attempt < CONFIG_REF_NAME_MINT_ATTEMPTS; attempt += 1) {
			const name = `${base}_${randomBytes(8).toString("hex").toUpperCase()}`;
			if (executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select("name").where("scope_kind", "=", TEAM_SCOPE.scopeKind).where("scope_id", "=", TEAM_SCOPE.scopeId).where("name", "=", name))) continue;
			executeSqliteQuerySync(sqlite, db.insertInto("secret_store_entries").values({
				scope_kind: TEAM_SCOPE.scopeKind,
				scope_id: TEAM_SCOPE.scopeId,
				name,
				value: input.value,
				kind: "secret",
				created_at_ms: input.now,
				updated_at_ms: input.now,
				updated_by: input.writer,
				deleted_at_ms: null,
				allowed_hosts: null
			}));
			admit?.("commit");
			return { name };
		}
		throw new Error("Could not mint an unused secret store name; try again.");
	}, databaseOptions, { operationLabel: "secrets.store.write-config-ref" });
}
//#endregion
//#region src/secrets/store/secret-store-write.ts
function writeSecretStoreEntriesInDatabase(params, capturePrevious, admit) {
	const inheritExistingKind = params.inheritExistingKind === true;
	for (const entry of params.entries) {
		assertSecretStoreMutationName(entry.name);
		if (!inheritExistingKind && entry.expectedValue === void 0) assertSecretStoreWriteShape(entry.value, entry.kind, entry.name, entry.allowedHosts);
	}
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const { now } = params;
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		admit("transaction");
		const db = getNodeSqliteKysely(sqlite);
		const resolved = params.entries.map((entry) => {
			const repair = entry.expectedValue !== void 0;
			const previous = capturePrevious || inheritExistingKind || repair ? executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select([
				"value",
				"kind",
				"allowed_hosts",
				"updated_by"
			]).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", entry.name).where("deleted_at_ms", "is", null)) : void 0;
			if (repair && previous?.value !== entry.expectedValue) throw new SecretStoreValidationError("SECRET_STORE_VALUE_CHANGED", `Secret store entry "${entry.name}" changed before repair; its current value was preserved. Run openclaw doctor again.`);
			const storedKind = previous?.kind === "secret" || previous?.kind === "env" ? previous.kind : void 0;
			const kind = repair ? storedKind ?? entry.kind : inheritExistingKind && storedKind !== void 0 ? storedKind : entry.kind;
			if (entry.valueSource === "argv" && kind === "secret") throw new SecretStoreValidationError("SECRET_STORE_VALUE_IN_ARGV", "--value is refused for secret entries. Use a stdin pipe, --value-file, or the interactive no-echo prompt.");
			if (inheritExistingKind || repair) assertSecretStoreWriteShape(entry.value, kind, entry.name, entry.allowedHosts);
			return {
				entry,
				previous,
				kind,
				allowedHosts: kind === "secret" && entry.allowedHosts !== void 0 ? normalizeSecretAllowedHosts(entry.allowedHosts) : void 0,
				repair
			};
		});
		for (const { entry, kind, allowedHosts, repair } of resolved) {
			const allowedHostsJson = allowedHosts?.length ? JSON.stringify(allowedHosts) : null;
			executeSqliteQuerySync(sqlite, db.insertInto("secret_store_entries").values({
				scope_kind: scopeKind,
				scope_id: scopeId,
				name: entry.name,
				value: entry.value,
				kind,
				created_at_ms: now,
				updated_at_ms: now,
				updated_by: params.updatedBy,
				deleted_at_ms: null,
				allowed_hosts: allowedHostsJson
			}).onConflict((conflict) => conflict.columns([
				"scope_kind",
				"scope_id",
				"name"
			]).doUpdateSet({
				value: entry.value,
				...repair ? {} : { kind },
				updated_at_ms: now,
				updated_by: params.updatedBy,
				deleted_at_ms: null,
				...repair ? {} : kind === "env" ? { allowed_hosts: null } : allowedHosts !== void 0 ? { allowed_hosts: allowedHostsJson } : {}
			})));
		}
		admit("commit");
		return resolved.map(({ previous, kind }) => ({
			kind,
			previous: capturePrevious && previous ? {
				value: previous.value,
				kind: previous.kind,
				allowedHosts: previous.allowed_hosts,
				updatedBy: previous.updated_by
			} : void 0
		}));
	}, params.database, { operationLabel: "secrets.store.write" });
}
function rollbackSecretStoreEntryWriteInDatabase(params, admit) {
	assertSecretStoreMutationName(params.name);
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const { now } = params;
	try {
		return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			admit("transaction");
			const query = getNodeSqliteKysely(sqlite).updateTable("secret_store_entries").set(params.previous === void 0 ? {
				deleted_at_ms: now,
				updated_at_ms: now
			} : {
				value: params.previous.value,
				kind: params.previous.kind,
				allowed_hosts: params.previous.allowedHosts,
				updated_at_ms: now,
				updated_by: params.previous.updatedBy,
				deleted_at_ms: null
			}).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("updated_by", "=", params.expectedUpdatedBy).where("deleted_at_ms", "is", null);
			const result = executeSqliteQuerySync(sqlite, query);
			admit("commit");
			return Number(result.numAffectedRows ?? 0n) === 1;
		}, params.database, { operationLabel: "secrets.store.rollback-write" });
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return false;
		throw error;
	}
}
function deleteSecretStoreEntryInDatabase(params, admit) {
	assertSecretStoreMutationName(params.name);
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const state = openOpenClawStateDatabase(params.database);
	const { now } = params;
	try {
		runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			admit("transaction");
			const db = getNodeSqliteKysely(sqlite);
			const query = classifyHiddenGitHubStoreName(params.name) === "setup" ? db.deleteFrom("secret_store_entries").where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name) : db.updateTable("secret_store_entries").set({
				deleted_at_ms: now,
				updated_at_ms: now
			}).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("deleted_at_ms", "is", null);
			executeSqliteQuerySync(sqlite, query);
			admit("commit");
		}, {
			...params.database,
			database: state
		}, { operationLabel: "secrets.store.delete" });
	} catch (error) {
		if (!isMissingSecretStoreTableError(error)) throw error;
	}
}
//#endregion
//#region src/sessions/session-state-events.read.worker.ts
function readSessionStateSequence(db, sessionKey, agentId) {
	const row = executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
	return normalizeOptionalSqliteNumber(row?.last_sequence) ?? 0;
}
//#endregion
//#region src/sessions/session-state-events.worker.ts
function executeSessionStateCommand(command, options) {
	if (command.type === "sessionState.registerWatch") {
		const input = command.input;
		const admit = (stage) => requestSessionEntriesCurrentAdmission(input.sessionEntryCurrentSources, {
			stage,
			facts: void 0
		});
		const current = readCursor(options.database.db, input.watcherSessionKey, input.targetSessionKey);
		if (current?.watcher_store_path === input.watcherStorePath && (input.provenance !== "explicit" || current.provenance === input.provenance)) {
			if (input.sessionEntryCurrentSources?.length) admit("prepare");
			return true;
		}
		return runOpenClawStateWriteTransaction(({ db }) => {
			admit("transaction");
			const existing = readCursor(db, input.watcherSessionKey, input.targetSessionKey);
			if (existing?.watcher_store_path === input.watcherStorePath) {
				if (input.provenance === "explicit" && existing.provenance !== input.provenance) executeSqliteQuerySync(db, getSessionStateKysely(db).updateTable("session_watch_cursors").set({ provenance: input.provenance }).where("watcher_session_key", "=", input.watcherSessionKey).where("target_session_key", "=", input.targetSessionKey));
			} else upsertSeedCursor({
				db,
				...input,
				sequence: readSessionStateSequence(db, input.targetSessionKey, input.targetAgentId)
			});
			admit("commit");
			return true;
		}, options);
	}
	if (command.type === "sessionState.acknowledge") {
		const { watcherSessionKey, cursors, now } = command.input;
		const admit = (stage) => requestSessionEntriesCurrentAdmission(command.input.sessionEntryCurrentSources, {
			stage,
			facts: void 0
		});
		return runOpenClawStateWriteTransaction(({ db }) => {
			admit("transaction");
			const followups = [];
			for (const { targetSessionKey, watcherStorePath } of cursors) {
				const row = readCursor(db, watcherSessionKey, targetSessionKey);
				if (!row || row.watcher_store_path !== watcherStorePath) continue;
				const notified = normalizeSqliteNumber(row.notified_sequence) ?? 0;
				const material = normalizeSqliteNumber(row.material_sequence) ?? 0;
				executeSqliteQuerySync(db, getSessionStateKysely(db).updateTable("session_watch_cursors").set({
					last_seen_sequence: notified,
					notified_sequence: Math.max(material, notified),
					updated_at: now
				}).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", targetSessionKey));
				if (material > notified) followups.push({
					watcherSessionKey,
					watcherStorePath,
					targetSessionKey,
					lastSeenSequence: notified,
					queueOnly: isAmbientGroupWatchCursor(row)
				});
			}
			admit("commit");
			return followups;
		}, options);
	}
	const admit = (stage) => requestSessionEntryCurrentAdmission(command.input.sessionEntryCurrentSource, {
		stage,
		facts: void 0
	});
	if (command.type === "sessionState.prune") return runOpenClawStateWriteTransaction(({ db }) => {
		admit("transaction");
		pruneSessionStateEventsInDatabase(db, command.input.now);
		admit("commit");
	}, options);
	const { event, now, onlyIfWatched, expectedUpstream, acpControl } = command.input;
	const assertAcpControl = () => {
		if (acpControl && !readAcpSessionControlInWorker(options.database, acpControl).row) throw new Error("ACP task owner could not be verified.");
	};
	const current = (db) => (!onlyIfWatched || hasSessionStateWatchersInDatabase(db, event.sessionKey)) && (!expectedUpstream || isSessionStateUpstreamCurrentInDatabase(db, expectedUpstream));
	if (!current(options.database.db)) return { notices: [] };
	return runOpenClawStateWriteTransaction(({ db }) => {
		admit("transaction");
		assertAcpControl();
		if (!current(db)) return { notices: [] };
		const recorded = recordSessionStateEventInDatabase(db, event, now);
		admit("commit");
		assertAcpControl();
		return recorded;
	}, options);
}
//#endregion
//#region src/sessions/session-upstream-links.worker.ts
function executeSessionUpstreamCommand(command, options) {
	if (command.type === "sessionUpstream.current") return isSessionStateUpstreamCurrentInDatabase(options.database.db, command.input);
	const { expected, settlement, sessionEntryCurrentSource } = command.input;
	const admit = (stage) => requestSessionEntryCurrentAdmission(sessionEntryCurrentSource, {
		stage,
		facts: void 0
	});
	return runOpenClawStateWriteTransaction(({ db }) => {
		admit("transaction");
		if (!isSessionStateUpstreamCurrentInDatabase(db, expected)) return false;
		const query = getNodeSqliteKysely(db);
		if (settlement.kind === "missing") executeSqliteQuerySync(db, query.deleteFrom("session_upstream_links").where("session_key", "=", expected.sessionKey).where("agent_id", "=", expected.agentId));
		else executeSqliteQuerySync(db, query.updateTable("session_upstream_links").set({
			last_marker_json: JSON.stringify(settlement.marker),
			last_scanned_at: settlement.now,
			updated_at: settlement.now
		}).where("session_key", "=", expected.sessionKey).where("agent_id", "=", expected.agentId));
		admit("commit");
		return true;
	}, options);
}
//#endregion
//#region src/transcripts/store-worker-read.ts
/** Expected reader refusals retain their domain type; native failures use the shared codec. */
function executeTranscriptRead(target, command) {
	ensureMeetingTranscriptsSchema({
		...target,
		env: getSqliteWorkerStateContext().environment,
		readOnly: command.input.readOnly
	});
	const database = target.database.db;
	try {
		switch (command.type) {
			case "transcripts.canonicalSessionRow": return ok(readTranscriptCanonicalSessionRow(database, command.input.params.selector));
			case "transcripts.readEntries": return ok(queryTranscriptReadEntries(database, command.input.params, createPreparedTranscriptDateReader()));
			case "transcripts.exportOwnership": return ok(readTranscriptExportOwnership(database, command.input.params.session));
			case "transcripts.exportPathCollisions": return ok(readTranscriptExportPathCollisions(database, command.input.params.exportKey));
			case "transcripts.exportPathOwners": return ok(readTranscriptExportPathOwners(database, command.input.params.exportKey));
			case "transcripts.summarySnapshot": return ok(runSqliteDeferredTransactionSync(database, () => readTranscriptSummarySnapshot(database, command.input.params.session, command.input.params.maxUtterances)));
			case "transcripts.sessionEntries": return ok(runSqliteDeferredTransactionSync(database, () => readTranscriptSessionEntries(database)));
			case "transcripts.matches": return ok(runSqliteDeferredTransactionSync(database, () => readTranscriptSessionMatches(database, command.input.params.value)));
			case "transcripts.session": return ok(readTranscriptSessionByIdentity(database, command.input.params.session));
			case "transcripts.entry": return ok(readTranscriptEntry(database, command.input.params.selector, command.input.params.purpose));
			case "transcripts.latest": return ok(readLatestTranscriptEntry(database));
			case "transcripts.notes": return ok(readStoredTranscriptNotes(database, command.input.params.session, command.input.params.purpose));
			case "transcripts.libraryEntry": return ok(runSqliteDeferredTransactionSync(database, () => readTranscriptLibraryEntry(database, command.input.params)));
			case "transcripts.recentStopped": return ok(readRecentStoppedTranscriptSession(database, command.input.params.source, command.input.params.stoppedAfter, command.input.params.stoppedBefore));
			case "transcripts.summaryRevision": return ok(readTranscriptSummaryInputRevision(database, command.input.params.session));
			case "transcripts.utterances": return ok(readTranscriptUtterances(database, command.input.params.session, command.input.params.maxUtterances));
			case "transcripts.summary": return ok(readStoredTranscriptSummary(database, command.input.params.session));
			case "transcripts.exportDigest": return ok(readTranscriptJsonlDigest(database, command.input.params.session));
			default: throw new Error("Unknown transcript SQLite command");
		}
	} catch (error) {
		if (!(error instanceof TranscriptLibraryError)) throw error;
		return {
			ok: false,
			error: {
				type: error.type,
				message: error.message,
				maxBytes: error.maxBytes
			}
		};
	}
}
//#endregion
//#region src/tui/tui-last-session.kernel.ts
function listRetiredTuiPointersInDatabase(database, retiredSessionKeys) {
	return executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", "like", `${TUI_LAST_SESSION_STATE_KEY_PREFIX}%`)).rows.flatMap((row) => {
		const sessionKey = JSON.parse(row.value_json);
		return typeof sessionKey === "string" && retiredSessionKeys.has(sessionKey) ? [row.state_key] : [];
	});
}
function clearRetiredTuiPointers(retiredSessionKeys, options, open) {
	const stateKeys = withExistingOpenClawStateDatabaseReadOnly(({ db }) => listRetiredTuiPointersInDatabase(db, retiredSessionKeys), options);
	if (!stateKeys?.length) return 0;
	const writeOptions = {
		...options,
		database: open()
	};
	let cleared = 0;
	for (const stateKey of stateKeys) updateConfigMachineState(stateKey, (current) => {
		if (typeof current === "string" && retiredSessionKeys.has(current)) {
			cleared += 1;
			return;
		}
		return current;
	}, writeOptions);
	return cleared;
}
//#endregion
//#region src/state/backup-run-records.kernel.ts
/** The caller owns one transaction for both insertion and retention. */
function recordBackupRunInDatabase(db, row) {
	const kysely = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, kysely.insertInto("backup_runs").values(row));
	const runs = readBackupRunsInDatabase(db);
	const retainedIds = new Set(runs.slice(0, 200).map((run) => run.id));
	const latestTargets = /* @__PURE__ */ new Set();
	const latestOkTargets = /* @__PURE__ */ new Set();
	for (const run of runs) {
		const target = JSON.stringify([
			run.kind,
			run.location?.name ?? resolveBackupRunTarget(run),
			resolveBackupRunNamespace(run)
		]);
		if (!latestTargets.has(target)) {
			latestTargets.add(target);
			retainedIds.add(run.id);
		}
		if (run.status === "ok" && !latestOkTargets.has(target)) {
			latestOkTargets.add(target);
			retainedIds.add(run.id);
		}
	}
	executeSqliteQuerySync(db, kysely.deleteFrom("backup_runs").where("id", "not in", sqliteStringSet([...retainedIds])));
}
/** Reads only the bounded ledger, using facts captured by database admission. */
function readBackupRunsInDatabase(db) {
	if (!getAdmittedSqliteSchemaFacts(db)?.tables.has("backup_runs")) return [];
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("backup_runs").selectAll().orderBy("created_at", "desc").orderBy("id", "desc")).rows.flatMap((row) => {
		const record = parseBackupRun(row);
		return record ? [record] : [];
	});
}
//#endregion
//#region src/state/openclaw-state-worker-registry.ts
const stateWorkerRegistry = createWorkerOperationRegistry({
	gatewayBoot: () => import("./gateway-boot-lifecycle.worker-BSSl1hT1.mjs").then((m) => m.gatewayBootOperations),
	generatedHtmlProvenance: () => import("./generated-html-provenance.worker-Hajq7XAH.mjs").then((m) => m.generatedHtmlProvenanceOperations),
	mentions: () => import("./mention-inbox.worker-FmOGgvhw.mjs").then((m) => m.mentionWorkerOperations),
	config: () => import("./config-journal-snapshot.worker-BI1A3VNJ.mjs").then((m) => m.configSnapshotOperations),
	diagnostic: () => import("./sqlite-audit-record.worker-g9cH9xzW.mjs").then((m) => m.diagnosticOperations),
	restartSentinel: () => import("./restart-sentinel.worker-CHAUb-oX.mjs").then((m) => m.restartSentinelOperations),
	preparedPoolPresence: () => import("./prepared-pool-presence.worker-SLxGiqnm.mjs").then((m) => m.preparedPoolPresenceOperations),
	clawProvenance: () => import("./provenance-write.worker-UJmq6m9W.mjs").then((m) => m.clawProvenanceOperations),
	projects: () => import("./project-registry.worker-CXPjIbDo.mjs").then((m) => m.projectRegistryOperations),
	operatorApprovals: () => import("./operator-approval-store.operations-DXQuhxgP.mjs").then((m) => m.operatorApprovalOperations),
	execApprovals: () => import("./exec-approvals-authorization.worker-Bx_SolKS.mjs").then((m) => m.execAuthorizationOperations),
	userProfiles: () => import("./user-profiles.worker-DZkBqt2g.mjs").then((m) => m.userProfileOperations),
	authProfiles: () => import("./store.worker-Be9JAjEr.mjs").then((m) => m.authProfileOperations),
	pluginModelCatalogCredentials: () => import("./plugin-model-catalog-read.worker-Sjhb-I0X.mjs").then((m) => m.pluginModelCatalogCredentialReadOperations),
	plugins: () => import("./state.worker-DqcLDB1F.mjs").then((m) => m.pluginRuntimeOperations),
	acp: () => import("./session-meta-write.worker-mEtAjZhe.mjs").then((m) => m.acpSessionOperations),
	skillLibrary: () => import("./store.worker-Bnfpvs1-.mjs").then((m) => m.skillLibraryOperations),
	skillUploads: () => import("./upload-store.worker-Cq5cLg6G.mjs").then((m) => m.skillUploadOperations),
	workshop: () => import("./store.worker-Dl3ykrRv.mjs").then((m) => m.skillWorkshopOperations),
	skills: () => import("./store.worker-Dl3ykrRv.mjs").then((m) => m.skillCuratorOperations),
	transcripts: () => import("./store-worker-write-KJlRrS-o.mjs").then((m) => m.transcriptWriteOperations),
	webPush: () => import("./push-web-store.worker-DXVKStqD.mjs").then((m) => m.webPushOperations),
	apns: () => import("./push-apns-store.worker-CioF3jCg.mjs").then((m) => m.apnsOperations),
	worktrees: () => import("./dispatch.worker-Di3qpit8.mjs").then((m) => m.worktreeOperations),
	fleet: () => import("./registry.worker-CufAbWMS.mjs").then((m) => m.fleetOperations),
	mcpOAuth: () => import("./mcp-oauth-store.worker-CxI-U94t.mjs").then((m) => m.mcpOAuthOperations),
	legacyMcpOAuth: () => import("./state-migrations.mcp-oauth.worker-CpMfaoNC.mjs").then((m) => m.legacyMcpOAuthOperations),
	nativeHookRelay: () => import("./native-hook-relay-store.worker-B2k_kWef.mjs").then((m) => m.nativeHookRelayOperations),
	audit: () => import("./audit-event-writer.worker-r-eDGB1x.mjs").then((m) => m.auditOperations),
	promotions: () => import("./promotions-feed.worker-CCKPuKDQ.mjs").then((m) => m.promotionOperations),
	telemetry: () => import("./telemetry-store.worker-8BseYr4_.mjs").then((m) => m.telemetryOperations),
	doctor: () => import("./doctor-state.worker-BOBHuSqA.mjs").then((m) => m.doctorOperations),
	modelCatalog: () => import("./remote-store.worker-D9vx8uwU.mjs").then((m) => m.modelCatalogOperations),
	managedImages: () => import("./managed-image-record-store.kernel-n2uF5liH.mjs").then((m) => m.managedImageRecordOperations),
	pluginBlob: () => import("./plugin-blob-store.worker-_VD-OMga.mjs").then((m) => m.pluginBlobOperations),
	onboardingRecommendations: () => import("./onboarding-recommendations.kernel-CDuMwi3P.mjs").then((m) => m.onboardingRecommendationOperations),
	nodeWorker: () => import("./node-worker-journal.worker-D70qv2x7.mjs").then((m) => m.nodeWorkerJournalOperations),
	channelIngress: () => import("./ingress-queue.worker-CSqFUBtt.mjs").then((m) => m.channelIngressOperations),
	devicePairing: () => import("./device-pairing-core.worker-bpWWIkia.mjs").then((m) => m.devicePairingOperations),
	node: () => import("./device-pairing-node.worker-D5X_8fg0.mjs").then((m) => m.nodePairingOperations),
	bootstrap: () => import("./device-bootstrap.worker-kernel-oDLMo0e1.mjs").then((m) => m.deviceBootstrapOperations),
	deliveryQueue: () => import("./delivery-queue.worker-BlSptj6R.mjs").then((m) => m.deliveryQueueOperations),
	sessionDelivery: () => import("./session-delivery-queue.worker-BJkQ4q7v.mjs").then((m) => m.sessionDeliveryOperations),
	conversationBindings: () => import("./current-conversation-bindings.worker-BMhYOvRw.mjs").then((m) => m.conversationBindingOperations),
	workerInference: () => import("./inference-store.worker-Bw_gAxaF.mjs").then((m) => m.workerInferenceOperations),
	workerPlacements: () => import("./placement-dispatch-store.worker-BJc_tiPT.mjs").then((m) => m.workerPlacementOperations),
	placementTools: () => import("./placement-session-tool-operations.worker-CrbmUPvR.mjs").then((m) => m.placementSessionToolOperations),
	placementTurns: () => import("./placement-turn-claims.worker-3R-O6DU-.mjs").then((m) => m.placementTurnClaimOperations),
	placementJournals: () => import("./placement-workspace-journal.worker-Cbv_CSyl.mjs").then((m) => m.workspaceJournalOperations),
	placementTranscript: () => import("./transcript-commit-store.worker-Ciw8_WNf.mjs").then((m) => m.workerTranscriptCommitOperations),
	workerEnvironments: () => import("./store.worker-Ik9d9wgg.mjs").then((m) => m.workerEnvironmentOperations),
	repositoryWorkspaces: () => import("./session-repository-workspaces.worker-Dsp86PeV.mjs").then((m) => m.repositoryWorkspaceOperations)
});
//#endregion
//#region src/state/user-preferences.worker.ts
function executeUserPreferenceCommand(command, options) {
	ensureUserProfilesSchema(options);
	if (command.type === "userPreferences.write") {
		const { update } = command.input;
		if (update.serialized.length === 0 && update.deletionKeys.length === 0 && update.expected.length === 0) {
			const profile = selectResolvedUserProfileMetadataById(openOpenClawStateDatabase(options).db, command.input.profileId);
			return profile ? ok({ profileId: profile.id }) : void 0;
		}
		ensureUserPreferencesSchema(options);
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const profile = selectResolvedUserProfileMetadataById(db, command.input.profileId);
			if (!profile) return;
			const result = writeUserPreferences(db, profile.id, command.input.update);
			const facts = result.ok && updatesGitCoauthorPreference(update) ? {
				kind: "user-preference-coauthor",
				profileId: profile.id
			} : void 0;
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts
			});
			if (facts) deferSqliteWorkerCommitReceipt(db, facts);
			return result.ok ? ok({ profileId: profile.id }) : result;
		}, options, { operationLabel: "users.preferences.set" });
	}
	if (command.input.keys?.length !== 0) ensureUserPreferencesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return runSqliteDeferredTransactionSync(db, () => {
		const profile = selectResolvedUserProfileMetadataById(db, command.input.profileId);
		return profile ? {
			profileId: profile.id,
			entries: readUserPreferences(db, profile.id, command.input.keys)
		} : void 0;
	});
}
//#endregion
//#region src/state/openclaw-state-worker-runtime.ts
function prepareSharedStateCommand(type) {
	return stateWorkerRegistry.prepare(type) ?? prepareCronStateWorkerCommand(type);
}
function executeSharedStateCommand(command, context, open, updateRunWriter) {
	if (command.type === "deviceAuth.prepare") return;
	const stateOptions = () => ({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (stateWorkerRegistry.has(command)) return stateWorkerRegistry.execute(command, {
		open,
		stateOptions
	});
	if (command.type === "updateRuns.recordStep" || command.type === "updateRuns.recordPhase") return withUpdateRunWriteAdmission((assertCurrent) => recordUpdateRunMutationInWorker(command, stateOptions(), assertCurrent, updateRunWriter()));
	if (command.type === "updateRuns.reconcile") return withUpdateRunWriteAdmission((assertCurrent) => reconcileUpdateRunCandidatesInWorker(command.input, stateOptions(), assertCurrent));
	if (command.type === "updateRuns.reconcileInterrupted") return withUpdateRunWriteAdmission((assertCurrent) => persistInterruptedUpdateObservation(command.input, stateOptions(), assertCurrent));
	if (command.type === "claws.install-schema-versions") return (command.input.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly : withExistingOpenClawStateDatabaseReadOnly)(({ db, path: pathname }) => {
		assertOpenClawStateDatabaseOwner(db, { pathname });
		return readClawInstallSchemaVersionRows(db);
	}, stateOptions());
	if (command.type === "database.generationMatches") return sameSqliteFileGeneration(command.input.generation, readStableSqliteFileGeneration(context.databasePath));
	if (command.type === "userPreferences.read" || command.type === "userPreferences.write") return executeUserPreferenceCommand(command, {
		database: open(),
		...stateOptions()
	});
	if (command.type === "config.health.read") return (command.input.artifactPreserving ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly : withExistingOpenClawStateDatabaseReadOnly)(({ db }) => readConfigHealthSnapshotInDatabase(db), stateOptions()) ?? {
		state: {},
		basis: {}
	};
	if (command.type === "deviceAuth.read" || command.type === "deviceAuth.readOrigin") {
		const read = (db) => command.type === "deviceAuth.read" ? readDeviceAuthTokenObservationFromDatabase(db, command.input) : readOriginDeviceTokenObservationFromDatabase(db, command.input);
		return command.input.readOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => read(db), stateOptions()) ?? {
			entry: null,
			expectedToken: null
		} : read(open().db);
	}
	if (command.type === "tui.lastSession.clear") return clearRetiredTuiPointers(new Set(command.input.retiredSessionKeys), stateOptions(), open);
	const database = open();
	if (command.type === "githubPublication.prepareSessionReceiptDeletion") return readSessionReceiptDeletionIdentitiesInDatabase(database, command.input);
	if (command.type === "githubPublication.deleteSessionReceipts") return deletePersonalGitHubSessionReceiptsInDatabase(database, command.input);
	if (command.type === "githubRepository.personalPending") return readPendingRepositoryGitHubPublicationInDatabase(database.db, command.input);
	if (command.type === "deviceAuth.list") return readDeviceAuthTokensFromDatabase(database.db, command.input);
	switch (command.type) {
		case "transcripts.canonicalSessionRow":
		case "transcripts.readEntries":
		case "transcripts.exportOwnership":
		case "transcripts.exportPathCollisions":
		case "transcripts.exportPathOwners":
		case "transcripts.sessionEntries":
		case "transcripts.matches":
		case "transcripts.session":
		case "transcripts.entry":
		case "transcripts.latest":
		case "transcripts.notes":
		case "transcripts.libraryEntry":
		case "transcripts.recentStopped":
		case "transcripts.summaryRevision":
		case "transcripts.summarySnapshot":
		case "transcripts.utterances":
		case "transcripts.exportDigest":
		case "transcripts.summary": return executeTranscriptRead({
			database,
			path: context.databasePath
		}, command);
	}
	if (command.type === "sessionUpstream.listWatched") return listWatchedSessionUpstreamLinksInDatabase(database.db);
	if (isCronStateWorkerCommand(command)) return executeCronStateCommand(command, database);
	const writeOptions = {
		database,
		...stateOptions()
	};
	if (command.type === "tui.lastSession.write") return writeConfigMachineState(command.input.stateKey, command.input.sessionKey, writeOptions);
	if (command.type === "sandboxRegistry.insertIfMissing") return importSandboxRegistryRow(command.input, writeOptions);
	if (command.type === "workspace.replaceAttestation") return runOpenClawStateWriteTransaction((writer) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = replaceWorkspaceAttestationInDatabase(writer, command.input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		assertAgentDeletionRecoveryHoldPredicate(writer, command.input.recoveryHoldPredicate);
		return result;
	}, writeOptions);
	if (command.type === "workspace.snapshotAndRegister" || command.type === "workspace.mergeSetup" || command.type === "workspace.expire") return executeWorkspaceStateCommand(command, database, writeOptions);
	if (command.type === "sandboxRegistry.write") return writeSandboxRegistry(command.input, writeOptions);
	if (command.type === "secrets.write") return writeSecretStoreEntriesInDatabase({
		...command.input,
		database: writeOptions
	}, command.input.capturePrevious, (stage) => requestSqliteWorkerOperationAdmission({
		stage,
		facts: void 0
	}));
	if (command.type === "secrets.rollback" || command.type === "secrets.delete") {
		const admit = (stage) => requestSqliteWorkerOperationAdmission({
			stage,
			facts: void 0
		});
		return command.type === "secrets.rollback" ? rollbackSecretStoreEntryWriteInDatabase({
			...command.input,
			database: writeOptions
		}, admit) : deleteSecretStoreEntryInDatabase({
			...command.input,
			database: writeOptions
		}, admit);
	}
	if (command.type === "secrets.purge") return purgeExpiredSecretStoreEntriesInDatabase(command.input, writeOptions);
	if (command.type === "secrets.writeForConfigRef") return writeSecretStoreEntryForConfigRefInDatabase(command.input, writeOptions, (stage) => requestSqliteWorkerOperationAdmission({
		stage,
		facts: void 0
	}));
	if (command.type === "sessionGroups.mutate") return mutateSessionGroupCatalogInDatabase(database, command.input, writeOptions.env);
	if (command.type === "deviceAuth.store" || command.type === "deviceAuth.storeOrigin" || command.type === "deviceAuth.clear" || command.type === "deviceAuth.clearOrigin") return runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = command.type === "deviceAuth.store" ? storeDeviceAuthTokenInDatabase(db, command.input) : command.type === "deviceAuth.storeOrigin" ? storeOriginDeviceTokenInDatabase(db, command.input) : command.type === "deviceAuth.clear" ? clearDeviceAuthTokenFromDatabase(db, command.input) : clearOriginDeviceTokenInDatabase(db, command.input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, writeOptions);
	if (command.type === "agentProvenance.readBatch" || command.type === "agentProvenance.list") {
		ensureAgentProvenanceSchema(writeOptions);
		return command.type === "agentProvenance.readBatch" ? readAgentProvenanceBatchInDatabase(database.db, command.input.agentIds) : listAgentProvenanceInDatabase(database.db);
	}
	if (command.type === "sessionUpstream.current" || command.type === "sessionUpstream.settle") return executeSessionUpstreamCommand(command, writeOptions);
	if (command.type === "sessionState.record" || command.type === "sessionState.prune" || command.type === "sessionState.registerWatch" || command.type === "sessionState.acknowledge") return executeSessionStateCommand(command, writeOptions);
	if (command.type === "subagents.persistChanges") return persistSubagentRunChangesInWorker(command.input, writeOptions);
	if (command.type === "backup.recordOutcome") return runOpenClawStateWriteTransaction(({ db }) => recordBackupRunInDatabase(db, command.input), writeOptions);
	if (command.type === "config.health.patch") {
		const { configPath, patch, expected, updatedAtMs } = command.input;
		return runOpenClawStateWriteTransaction(({ db }) => {
			return patchConfigHealthEntryInDatabase(db, configPath, patch, expected, updatedAtMs);
		}, writeOptions);
	}
	throw new Error("Unknown shared-state SQLite command");
}
//#endregion
export { executeSharedStateCommand, openUpdateRunWriter, prepareSharedStateCommand };
