import { n as ENV_SECRET_REF_ID_RE } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { c as withSqlitePostCommitPublications, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, f as sqliteStringSetEntries, i as executeSqliteQuerySync, m as expressionBuilder, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { p as isOpenClawStateDatabaseOpen } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { l as SecretStoreValidationError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as createWorkspaceStateIdentity } from "./workspace-state-identity-hZ7UINpz.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import "./openclaw-state-db-integrity-admission-BHpYd_s7.mjs";
import { i as readConfigMachineStateRowInDatabase } from "./config-machine-state-row-BRr4hJIX.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { w as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import "./openclaw-state-db-read-connection-D53a_-IZ.mjs";
import "./config-machine-state-DdwUh_Ff.mjs";
import "./session-key-CSDERtm3.mjs";
import { _ as ensureSecretStoreSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { a as agentProvenancePublication } from "./agent-provenance-Bj5CtKpW.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as assertAgentDeletionRecoveryHoldPredicate } from "./agent-deletion-journal-recovery.kernel-BaXrQW7-.mjs";
import { n as runExistingOpenClawStateWriteTransaction, t as openExistingOpenClawStateWriter } from "./openclaw-state-db-existing-write-C_pcNU2t.mjs";
import { a as writeConfigMachineState, r as updateConfigMachineState } from "./config-machine-state-write-CmW-lLFq.mjs";
import { t as patchConfigHealthEntryInDatabase } from "./io.health-state.kernel-1qR4sAaQ.mjs";
import { a as normalizeOptionalSqliteNumber, c as recordSessionStateEventInDatabase, i as isSessionStateUpstreamCurrentInDatabase, n as hasSessionStateWatchersInDatabase, o as pruneSessionStateEventsInDatabase, r as isAmbientGroupWatchCursor, s as readCursor, t as getSessionStateKysely, u as upsertSeedCursor } from "./session-state-events.kernel-CcXwdtfX.mjs";
import { n as sessionStateWatchAgentId, t as isSessionStateWatchAddress } from "./session-state-events.watch-address-B3UBo-NE.mjs";
import { a as upsertSessionUpstreamLinkInDatabase, i as sessionUpstreamLinkSourceMatches, n as listWatchedSessionUpstreamLinksInDatabase, r as readSessionUpstreamLinkInDatabase, t as deleteSessionUpstreamLinkInDatabase } from "./session-upstream-links.kernel-BXNiVVh8.mjs";
import { a as updatesGitCoauthorPreference, n as ensureUserPreferencesSchema, o as writeUserPreferences } from "./user-preferences.store-BkUaBz4r.mjs";
import { D as ensureUserProfilesSchema, h as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-CBUpoSHj.mjs";
import { n as requestSessionEntriesCurrentAdmission, r as requestSessionEntryCurrentAdmission } from "./session-entry-current-admission.worker-DSV3cklJ.mjs";
import { r as readSessionReceiptDeletionIdentitiesInDatabase, t as deletePersonalGitHubSessionReceiptsInDatabase } from "./github-personal-publication-lifecycle-D-79X9Ce.mjs";
import "./subagent-registry.store.codec-D57MwX5M.mjs";
import { a as classifyHiddenGitHubStoreName } from "./secret-store-value-B2wKejcx.mjs";
import { t as withMissingSecretStoreFallback } from "./secret-store-sqlite-Bm3BSwuM.mjs";
import { a as normalizeSecretAllowedHosts, c as purgeExpiredSecretStoreEntriesInDatabase, i as assertSecretStoreWriteShape, n as assertSecretStoreMutationName, t as assertSecretStoreEnvName } from "./secret-store-validation-DdnAIClg.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-D3xn0u2j.mjs";
import { a as resolveSelectedCronJobsStorePath } from "./paths-C7jZRDkL.mjs";
import { r as withSandboxRegistryWorkerReceipt } from "./registry-publication-fWdyCoIh.mjs";
import { a as deleteWorkspaceStateRowsInDatabase, d as registerWorkspaceStateAliasIdentitiesInTransaction, g as captureWorkspaceStateReceipt, i as assertCanonicalTimestamp, l as readWorkspaceStateSnapshotFromDatabase, m as resolveWorkspaceIdentityFromDatabase, o as hasRecentWorkspaceSetupState, p as replaceWorkspaceAttestationInDatabase, r as assertCanonicalIntegerTimestamp, u as recentWorkspaceAttestation, v as workspaceStateFactKey, y as workspaceStatePublication } from "./workspace-state-store.kernel-BcjpAYye.mjs";
import "./update-run-legacy-expiry-BU1v4N5g.mjs";
import { t as finishUpdateRunRecord } from "./update-run-record-Chv9kKnY.mjs";
import { i as inspectUpdateRunAbandonment, n as inspectNewerRecoveryHistory, s as needsPostCoreRepair } from "./update-run-activity-B_OeQT4u.mjs";
import { t as upsertStep } from "./update-run-step-upsert-CoZScFzu.mjs";
import { a as applyUpdateRunStep, f as updateRunLedgerSchema, i as applyUpdateRunPhase, l as mutateRunInTransaction, m as recordUpdateRunVerificationRecord, n as applyFinishUpdateRun, r as applyUpdateRunDiagnostics, s as isRequiredUpdateRunStep, t as UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS, u as persistRun } from "./update-run-write-Dd5ORe9V.mjs";
import { i as resolveUpdateRunCodecEnv } from "./update-run-codec-Guyb20ob.mjs";
import { c as readUpdateRunRecord, r as hasStoredUpdateRecovery, t as canReconcileUpdateRunCandidates, u as readUpdateRuns } from "./update-run-read.kernel-C7evz-Ne.mjs";
import { r as createUpdateRun } from "./update-run-ledger-C3oL-g8r.mjs";
import { r as readRecovery } from "./update-run-recovery-store-DWInjVEC.mjs";
import { n as serializeCronLoadError } from "./load-error-CO2Pg-SG.mjs";
import { u as readCronStoreFingerprints } from "./row-codec-Cnnqjh5r.mjs";
import { t as loadCronStoreFromDatabase } from "./load.kernel-DOA7lYMT.mjs";
import { i as recordCronRunInDatabase } from "./run-history.kernel-BxXbzyDp.mjs";
import { n as assertAgentDeletionWorkerPredicate, r as ensureAgentProvenanceSchema } from "./agent-deletion.worker-Bp9lB6Sk.mjs";
import { t as mutateSessionGroupCatalogInDatabase } from "./session-group-catalog.kernel-CnGzKY3A.mjs";
import { r as persistInterruptedUpdateObservation } from "./update-run-interruption-store-DTC8bXfS.mjs";
import { i as writeSubagentRunValuesInDatabase } from "./subagent-registry.store.sqlite-C94KteHI.mjs";
import { c as writeSandboxRegistryInDatabase, i as reserveSandboxRegistryInDatabase, n as beginSandboxRegistryRemovalInDatabase, r as insertSandboxRegistryRowIfMissingInDatabase } from "./registry.kernel-DbYv0cl_.mjs";
import { d as readStoredTranscriptNotes, f as readTranscriptEntry, l as queryTranscriptReadEntries, p as readTranscriptLibraryEntry, r as TranscriptLibraryError, t as createPreparedTranscriptDateReader, u as readLatestTranscriptEntry } from "./store-date-preparation-B2niPXMn.mjs";
import { c as readTranscriptSummaryInputRevision, o as readRecentStoppedTranscriptSession } from "./store-sqlite-DPxaUsRY.mjs";
import { t as readCronJobNamesInDatabase } from "./job-name.kernel-A6aOQAeD.mjs";
import { r as serializeCronSaveError } from "./save-error-BrzBbDk8.mjs";
import { i as saveCronStoreInDatabase, o as registerCronQuarantineInDatabase, r as saveCronStoreChangesInDatabase } from "./save.kernel-Cq5V3z2e.mjs";
import { r as ensureCronRunReceiptSchema } from "./run-receipt-store-Bik3uOzB.mjs";
import { t as readAcpSessionControlInWorker } from "./session-meta-source.worker-Bm2sbUvG.mjs";
import { i as resolveBackupRunTarget, n as parseBackupRun, r as resolveBackupRunNamespace } from "./backup-run-records.contract.js";
import { t as ensureMeetingTranscriptsSchema } from "./sqlite-schema-CrUrQvVo.mjs";
import { t as TUI_LAST_SESSION_STATE_KEY_PREFIX } from "./tui-last-session.contract.js";
import { n as readPendingRepositoryGitHubPublicationInDatabase } from "./github-repository-publication-read.worker-C5ryAbPm.mjs";
import { n as retrySqliteWorkerAdmission, t as SQLITE_WORKER_ADMISSION_DEADLINE_MS } from "./sqlite-worker-admission-retry-hDohN83F.mjs";
import { a as readTranscriptExportPathOwners, c as readTranscriptSessionEntries, d as readTranscriptUtterances, i as readTranscriptExportPathCollisions, l as readTranscriptSessionMatches, n as readTranscriptCanonicalSessionRow, o as readTranscriptJsonlDigest, r as readTranscriptExportOwnership, s as readTranscriptSessionByIdentity, t as readStoredTranscriptSummary, u as readTranscriptSummarySnapshot } from "./store-sqlite-read-BTMDaIGC.mjs";
import { randomBytes } from "node:crypto";
//#region src/agents/sandbox/registry-import.worker.ts
function importSandboxRegistryRow(row, options) {
	runOpenClawStateWriteTransaction(({ db }) => withSandboxRegistryWorkerReceipt(db, () => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		insertSandboxRegistryRowIfMissingInDatabase(db, row);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
	}), options);
}
//#endregion
//#region src/agents/sandbox/registry-write.worker.ts
function executeSandboxRegistryCommand(command, options) {
	return runOpenClawStateWriteTransaction(({ db }) => withSandboxRegistryWorkerReceipt(db, () => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = command.type === "sandboxRegistry.reserve" ? reserveSandboxRegistryInDatabase(db, command.input) : command.type === "sandboxRegistry.beginRemoval" ? beginSandboxRegistryRemovalInDatabase(db, command.input) : writeSandboxRegistryInDatabase(db, command.type === "sandboxRegistry.finishRemoval" ? {
			operation: "removeGeneration",
			kind: "container",
			entry: command.input
		} : command.input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}), options, { operationLabel: command.type });
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry.store.worker.ts
const log = createSubsystemLogger("state/worker");
/** The row owner's worker adapter commits FIFO-planned rows and terminal signals together. */
function persistSubagentRunChangesInWorker(input, writeOptions) {
	const { writeId, values, deleteRunIds, terminalEvents = [] } = input;
	let committedReceipt;
	try {
		return runOpenClawStateWriteTransaction((writer) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: writeId
			});
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
function deleteWorkspace(database, plan) {
	const { lexicalAlias, currentCanonicalIdentity } = plan;
	const kysely = getNodeSqliteKysely(database.db);
	const storedAlias = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("alias_key", "=", lexicalAlias.workspaceKey));
	if (storedAlias && storedAlias.alias_path !== lexicalAlias.workspacePath) throw new Error("workspace path alias key collision");
	let storedIdentity = storedAlias ? createWorkspaceStateIdentity(storedAlias.workspace_path) : void 0;
	if (storedIdentity && storedIdentity.workspaceKey !== storedAlias?.workspace_key) throw new Error("workspace path alias target is invalid");
	if (storedIdentity && plan.pathEntryExisted && storedIdentity.workspaceKey !== currentCanonicalIdentity.workspaceKey) {
		executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_path_aliases").where("alias_key", "=", lexicalAlias.workspaceKey));
		workspaceStatePublication.stageDeletions(database.db, [workspaceStateFactKey("alias", lexicalAlias.workspaceKey)]);
		storedIdentity = void 0;
	}
	const identity = storedIdentity ?? (!storedAlias && lexicalAlias.workspaceKey === currentCanonicalIdentity.workspaceKey ? currentCanonicalIdentity : resolveWorkspaceIdentityFromDatabase({
		workspaceDir: currentCanonicalIdentity.workspacePath,
		database
	}).identity);
	deleteWorkspaceStateRowsInDatabase(database, identity);
	return {
		kind: "workspace-deleted",
		workspacePath: identity.workspacePath
	};
}
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
	const values = {
		workspace_path: identity.workspacePath,
		version: 1,
		bootstrap_seeded_at: merged.bootstrapSeededAt ?? null,
		setup_completed_at: merged.setupCompletedAt ?? null,
		updated_at: nowMs
	};
	const setup = executeSqliteQueryTakeFirstSync(database.db, kysely.insertInto("workspace_setup_state").values({
		workspace_key: identity.workspaceKey,
		...values
	}).onConflict((conflict) => conflict.column("workspace_key").doUpdateSet(values)).returningAll());
	if (setup) workspaceStatePublication.stagePostimages(database.db, [{
		kind: "setup",
		row: setup
	}]);
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
	if (recentWorkspaceAttestation(snapshot.attestation, nowMs) || hasRecentWorkspaceSetupState(snapshot, nowMs)) {
		registerWorkspaceStateAliasIdentitiesInTransaction({
			database,
			identity,
			aliases: resolution.aliases,
			updatedAtMs: nowMs
		});
		return false;
	}
	deleteWorkspaceStateRowsInDatabase(database, identity);
	return identity.workspacePath;
}
function executeWorkspaceStateCommand(command, database, options) {
	if (command.type === "workspace.delete") return runOpenClawStateWriteTransaction((writer) => captureWorkspaceStateReceipt(writer.db, () => {
		const deletion = command.input.deletion;
		const assertCurrent = (stage) => {
			if (deletion) {
				assertOpenClawStateLeaseWorkerOwnedInTransaction(writer.db, deletion.lease, "write", stage);
				assertAgentDeletionWorkerPredicate(writer, deletion.predicate);
			} else requestSqliteWorkerOperationAdmission({
				stage,
				facts: void 0
			});
		};
		assertCurrent("transaction");
		const result = deleteWorkspace(writer, command.input.plan);
		assertCurrent("commit");
		return result;
	}), options);
	if (command.type === "workspace.snapshotAndRegister") {
		const initial = withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => captureWorkspaceStateReceipt(database.db, () => {
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
		})));
		if (initial.resolution.missingAliasKeys.length === 0 || !initial.snapshot.setupExists && !initial.snapshot.attestation) return initial.snapshot;
		return runOpenClawStateWriteTransaction((writer) => captureWorkspaceStateReceipt(writer.db, () => {
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
		}), options);
	}
	return runOpenClawStateWriteTransaction((writer) => captureWorkspaceStateReceipt(writer.db, () => {
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
		return result;
	}), options);
}
//#endregion
//#region src/claws/provenance-runtime-read.kernel.ts
function readClawInstallSchemaVersionRows(db) {
	if (!tableExists(db, "claw_installs")) return [];
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("claw_installs").select([
		"agent_id as agentId",
		"schema_version as schemaVersion",
		"agent_config_digest as agentConfigDigest"
	])).rows;
}
//#endregion
//#region src/cron/store/load.worker.ts
function resolveDefaultCronStoreKey(database) {
	const row = readConfigMachineStateRowInDatabase(database.db, "cron.store");
	const value = row ? JSON.parse(row.value_json) : void 0;
	return resolveSelectedCronJobsStorePath(typeof value === "string" ? value.trim() : void 0, getSqliteWorkerStateContext().environment);
}
function loadMutableCronStoreInWorker(database, selectedStoreKey) {
	const storeKey = selectedStoreKey ?? resolveDefaultCronStoreKey(database);
	let repairCommits = 0;
	try {
		return {
			ok: true,
			storeKey,
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
			storeKey,
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
const loadQueue = createLazyRuntimeModule(() => import("./run-queue.worker-DdCCjfS9.mjs"));
let queue;
const loadReceipts = createLazyRuntimeModule(() => import("./run-receipt.worker-BJj1gdgD.mjs"));
let receipts;
const loadFinalization = createLazyRuntimeModule(() => import("./run-finalization.worker-CFfKgQka.mjs"));
let finalization;
const loadRecovery = createLazyRuntimeModule(() => import("./run-recovery.worker-BHf6-zNH.mjs"));
let recovery;
const loadMaintenance = createLazyRuntimeModule(() => import("./runtime-maintenance.worker-DFegLEsu.mjs"));
let maintenance;
const loadMutation = createLazyRuntimeModule(() => import("./guarded-mutation.worker-CCSkd0Ir.mjs"));
let mutation;
const loadScratch = createLazyRuntimeModule(() => import("./scratch.worker-C7QBF-5E.mjs"));
let scratch;
const loadExternalState = createLazyRuntimeModule(() => import("./external-state.worker-CWoq_T6a.mjs"));
let externalState;
const loadScheduler = createLazyRuntimeModule(() => import("./scheduler-state.worker-DI-Y1x7Q.mjs"));
let scheduler;
const loadSchedulerActor = createLazyRuntimeModule(() => import("./scheduler-actor.worker-BxCPM3KM.mjs"));
let schedulerActor;
const loadJobMutations = createLazyRuntimeModule(() => import("./job-mutations.worker-WxdDbt_i.mjs"));
let jobMutations;
function prepareCronStateWorkerCommand(type) {
	if (String(type).startsWith("cron.scheduler") && !schedulerActor) return loadSchedulerActor().then((loaded) => {
		schedulerActor = loaded;
	});
	if (type === "cron.prepareJobMutation" && !jobMutations) return loadJobMutations().then((loaded) => {
		jobMutations = loaded;
	});
	if ([
		"cron.requestRuns",
		"cron.drainQueue",
		"cron.cancelRequests"
	].includes(String(type)) && !queue) return loadQueue().then((loaded) => {
		queue = loaded;
	});
	if (type === "cron.finalizeRuns" && !finalization) return loadFinalization().then((loaded) => {
		finalization = loaded;
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
		"cron.markDeliveryStarted",
		"cron.removeStaleFamily",
		"cron.bindReceiptExecution"
	].includes(String(type)) && !receipts) return loadReceipts().then((loaded) => {
		receipts = loaded;
	});
	if ((type === "cron.scheduleUnowned" || type === "cron.recordFailureAlertOutcome" || type === "cron.recordFailureRepairSettlement" || type === "cron.maintainHistory") && !maintenance) return loadMaintenance().then((loaded) => {
		maintenance = loaded;
	});
	if (type !== "cron.recoverRuns" || recovery) return;
	return loadRecovery().then((loaded) => {
		recovery = loaded;
	});
}
function isCronStateWorkerCommand(command) {
	switch (command.type) {
		case "cron.schedulerStart":
		case "cron.schedulerTick":
		case "cron.schedulerRefresh":
		case "cron.schedulerStop":
		case "cron.prepareJobMutation":
		case "cron.requestRuns":
		case "cron.drainQueue":
		case "cron.cancelRequests":
		case "cron.recordSkippedRuns":
		case "cron.mutateExternalState":
		case "cron.writeScratch":
		case "cron.mutateJobs":
		case "cron.recordRun":
		case "cron.markDeliveryStarted":
		case "cron.bindReceiptExecution":
		case "cron.finalizeRuns":
		case "cron.removeStaleFamily":
		case "cron.loadMutable":
		case "cron.initializeRunReceipts":
		case "cron.recoverRuns":
		case "cron.scheduleUnowned":
		case "cron.maintainHistory":
		case "cron.recordFailureAlertOutcome":
		case "cron.recordFailureRepairSettlement":
		case "cron.save":
		case "cron.saveChanges":
		case "cron.registerQuarantine": return true;
		default: return false;
	}
}
function executeCronStateCommand(command, database) {
	switch (command.type) {
		case "cron.schedulerStart":
		case "cron.schedulerTick":
		case "cron.schedulerRefresh":
		case "cron.schedulerStop":
			if (!schedulerActor) throw new Error("Cron scheduler actor is not prepared");
			if (command.type === "cron.schedulerStop") return schedulerActor.stopCronSchedulerInWorker(command.input);
			return schedulerActor.runCronSchedulerInWorker(database, command);
		case "cron.prepareJobMutation":
			if (!jobMutations) throw new Error("Cron job mutation worker is not prepared");
			return jobMutations.prepareCronJobMutationInWorker(database, command.input);
		case "cron.requestRuns":
		case "cron.drainQueue":
		case "cron.cancelRequests":
			if (!queue) throw new Error("Cron queue worker is not prepared");
			switch (command.type) {
				case "cron.requestRuns": return queue.requestCronRunsInWorker(database, command.input);
				case "cron.drainQueue": return queue.drainCronQueueInWorker(database, command.input);
				case "cron.cancelRequests": return queue.cancelCronRequestsInWorker(database, command.input);
			}
		case "cron.registerQuarantine": return runOpenClawStateWriteTransaction(({ db }) => registerCronQuarantineInDatabase(db, command.input), {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: command.type });
		case "cron.recordSkippedRuns":
			if (!scheduler) throw new Error("Cron scheduler worker is not prepared");
			return scheduler.recordSkippedCronRunsInWorker(database, command.input);
		case "cron.mutateExternalState":
			if (!externalState) throw new Error("Cron external-state worker is not prepared");
			return externalState.mutateCronExternalStateInWorker(database, command.input);
		case "cron.writeScratch":
			if (!scratch) throw new Error("Cron scratch worker is not prepared");
			return scratch.writeCronScratchInWorker(database, command.input);
		case "cron.mutateJobs":
			if (!mutation) throw new Error("Cron mutation worker is not prepared");
			return mutation.mutateCronJobsInWorker(database, command.input);
		case "cron.recordRun": return runOpenClawStateWriteTransaction(({ db }) => recordCronRunInDatabase(db, command.input), {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: command.type });
		case "cron.finalizeRuns":
			if (!finalization) throw new Error("Cron finalization worker is not prepared");
			return finalization.finalizeCronRunsInWorker(database, command.input);
		case "cron.markDeliveryStarted":
		case "cron.bindReceiptExecution":
		case "cron.removeStaleFamily":
			if (!receipts) throw new Error("Cron receipts worker is not prepared");
			switch (command.type) {
				case "cron.bindReceiptExecution": return receipts.bindCronRunReceiptExecutionInWorker(database, command.input);
				case "cron.markDeliveryStarted": return receipts.markCronDeliveryStartedInWorker(database, command.input);
				case "cron.removeStaleFamily": return receipts.removeStaleCronFamilyInWorker(database, command.input);
			}
		case "cron.loadMutable": return loadMutableCronStoreInWorker(database, command.input.storeKey);
		case "cron.recoverRuns":
			if (!recovery) throw new Error("Cron recovery worker is not prepared");
			return recovery.recoverCronRunsInWorker(database, command.input);
		case "cron.scheduleUnowned":
		case "cron.maintainHistory":
		case "cron.recordFailureAlertOutcome":
		case "cron.recordFailureRepairSettlement":
			if (!maintenance) throw new Error("Cron maintenance worker is not prepared");
			if (command.type === "cron.maintainHistory") return maintenance.maintainCronRunHistoryInWorker(database, command.input);
			if (command.type === "cron.recordFailureRepairSettlement") return maintenance.recordCronFailureRepairSettlementInWorker(database, command.input);
			return command.type === "cron.scheduleUnowned" ? maintenance.scheduleUnownedCronJobsInWorker(database, command.input) : maintenance.recordCronFailureAlertOutcomeInWorker(database, command.input);
		case "cron.initializeRunReceipts": return runOpenClawStateWriteTransaction(({ db }) => ensureCronRunReceiptSchema(db), {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "cron.run-receipt.initialize" });
		case "cron.save":
		case "cron.saveChanges": return executeCronStoreSaveCommand(command, database);
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
		...stage === "commit" ? { deadlineMs: SQLITE_WORKER_ADMISSION_DEADLINE_MS } : {}
	});
	return retrySqliteWorkerAdmission(() => operation(assertCurrent), { maxAttempts: Infinity });
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
	if (command.type === "updateRuns.create") return {
		kind: "recorded",
		record: createUpdateRun(command.input.run, codecOptions, assertCurrent)
	};
	let entered = false;
	try {
		assertCurrent("transaction");
		return writer().run(({ db }) => {
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
				else if (command.type === "updateRuns.recordStep") applyUpdateRunStep(current, command.input.step);
				else if (command.type === "updateRuns.finish") applyFinishUpdateRun(current, command.input.result);
				else if (command.type === "updateRuns.recordVerification") recordUpdateRunVerificationRecord(current, command.input.verification, command.input);
				else {
					const diagnostics = command.input.diagnostics;
					applyUpdateRunDiagnostics(current, command.input.preserveRecovery ? {
						...diagnostics,
						recovery: current.verification.recovery ?? diagnostics.recovery,
						rollbackOutcome: current.verification.rollbackOutcome ?? diagnostics.rollbackOutcome
					} : diagnostics);
				}
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
		for (const [index, { record, rule }] of selected.entries()) {
			if (!rule || input.legacyOnly && rule !== "legacy-driver-expired") continue;
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
			current[index] = saved;
			reconciled.push(saved);
		}
		assertCurrent("commit");
		return {
			current,
			reconciled
		};
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
			]).where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", entry.name).where("deleted_at_ms", "is", null)) : void 0;
			if (repair && previous?.value !== entry.expectedValue) throw new SecretStoreValidationError("SECRET_STORE_VALUE_CHANGED", `Secret store entry "${entry.name}" changed before repair; its current value was preserved. Run openclaw doctor again.`);
			const storedKind = previous?.kind === "secret" || previous?.kind === "env" ? previous.kind : void 0;
			const kind = repair || inheritExistingKind ? storedKind ?? entry.kind : entry.kind;
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
			const values = {
				value: entry.value,
				updated_at_ms: now,
				updated_by: params.updatedBy,
				deleted_at_ms: null
			};
			executeSqliteQuerySync(sqlite, db.insertInto("secret_store_entries").values({
				scope_kind: "team",
				scope_id: "",
				name: entry.name,
				...values,
				kind,
				created_at_ms: now,
				allowed_hosts: allowedHostsJson
			}).onConflict((conflict) => conflict.columns([
				"scope_kind",
				"scope_id",
				"name"
			]).doUpdateSet({
				...values,
				...repair ? {} : { kind },
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
	const { now } = params;
	return withMissingSecretStoreFallback(() => {
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
			}).where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name).where("updated_by", "=", params.expectedUpdatedBy).where("deleted_at_ms", "is", null);
			const result = executeSqliteQuerySync(sqlite, query);
			admit("commit");
			return Number(result.numAffectedRows ?? 0n) === 1;
		}, params.database, { operationLabel: "secrets.store.rollback-write" });
	}, false);
}
function deleteSecretStoreEntryInDatabase(params, admit) {
	assertSecretStoreMutationName(params.name);
	const state = openOpenClawStateDatabase(params.database);
	const { now } = params;
	return withMissingSecretStoreFallback(() => {
		runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			admit("transaction");
			const db = getNodeSqliteKysely(sqlite);
			const entry = expressionBuilder().and({
				scope_kind: "team",
				scope_id: "",
				name: params.name
			});
			const query = classifyHiddenGitHubStoreName(params.name) === "setup" ? db.deleteFrom("secret_store_entries").where(entry) : db.updateTable("secret_store_entries").set({
				deleted_at_ms: now,
				updated_at_ms: now
			}).where("deleted_at_ms", "is", null).where(entry);
			executeSqliteQuerySync(sqlite, query);
			admit("commit");
		}, {
			...params.database,
			database: state
		}, { operationLabel: "secrets.store.delete" });
	}, void 0);
}
function updateSecretStoreAllowedHostsInDatabase(params, admit) {
	assertSecretStoreEnvName(params.name);
	const allowedHosts = normalizeSecretAllowedHosts(params.allowedHosts);
	const { now } = params;
	runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		admit("transaction");
		const db = getNodeSqliteKysely(sqlite);
		const updated = executeSqliteQuerySync(sqlite, db.updateTable("secret_store_entries").set({
			allowed_hosts: allowedHosts.length ? JSON.stringify(allowedHosts) : null,
			updated_at_ms: now,
			updated_by: params.updatedBy
		}).where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name).where("kind", "=", "secret").where("deleted_at_ms", "is", null));
		if (Number(updated.numAffectedRows ?? 0n) !== 1) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", `Secret store entry "${params.name}" is missing or is not a secret entry.`);
		admit("commit");
	}, params.database, { operationLabel: "secrets.store.allowed-hosts" });
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
	if (command.type === "sessionState.cleanup") {
		const input = command.input;
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const kysely = getSessionStateKysely(db);
			if (input.kind === "delete") {
				deleteSessionUpstreamLinkInDatabase(db, input.sessionKey, input.agentId);
				for (const table of ["session_state_events", "session_state_heads"]) executeSqliteQuerySync(db, kysely.deleteFrom(table).where("session_key", "=", input.sessionKey).where("agent_id", "=", input.agentId));
			}
			const cursorOwner = sessionStateWatchAgentId(input.sessionKey);
			const cursors = cursorOwner && (input.kind === "reset" || cursorOwner === input.agentId) ? executeSqliteQuerySync(db, kysely.selectFrom("session_watch_cursors").select(["watcher_session_key", "target_session_key"]).where((eb) => input.kind === "reset" ? eb("watcher_session_key", "=", input.sessionKey) : eb.or([eb("watcher_session_key", "=", input.sessionKey), eb("target_session_key", "=", input.sessionKey)]))).rows : [];
			for (const cursor of cursors) {
				if (!isSessionStateWatchAddress({
					watcherSessionKey: cursor.watcher_session_key,
					targetSessionKey: cursor.target_session_key
				})) continue;
				executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where("watcher_session_key", "=", cursor.watcher_session_key).where("target_session_key", "=", cursor.target_session_key));
			}
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
		}, options);
	}
	if (command.type === "sessionState.sweep") {
		const { cursors, now } = command.input;
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const notices = [];
			for (const { watcherSessionKey, targetSessionKey, watcherStorePath } of cursors) {
				const row = readCursor(db, watcherSessionKey, targetSessionKey);
				if (!row || (row.watcher_store_path ?? null) !== watcherStorePath) continue;
				const material = normalizeSqliteNumber(row.material_sequence) ?? 0;
				const lastSeen = normalizeSqliteNumber(row.last_seen_sequence) ?? 0;
				if (material <= lastSeen) continue;
				executeSqliteQuerySync(db, getSessionStateKysely(db).updateTable("session_watch_cursors").set({
					notified_sequence: material,
					updated_at: now
				}).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", targetSessionKey));
				notices.push({
					watcherSessionKey,
					watcherStorePath,
					targetSessionKey,
					lastSeenSequence: lastSeen,
					queueOnly: isAmbientGroupWatchCursor(row)
				});
			}
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return notices;
		}, options);
	}
	if (command.type === "sessionState.registerWatch") {
		const input = command.input;
		if (!isSessionStateWatchAddress(input)) return false;
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
	if (command.type === "sessionUpstream.upsert" || command.type === "sessionUpstream.delete") return runOpenClawStateWriteTransaction(({ db }) => {
		const assertSource = () => {
			const source = command.type === "sessionUpstream.upsert" ? command.input.source : void 0;
			if (!source) return;
			if (!sessionUpstreamLinkSourceMatches(readSessionUpstreamLinkInDatabase(db, source.sessionKey, source.agentId), source)) throw new Error("Session upstream source changed during initialization");
		};
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		assertSource();
		return command.type === "sessionUpstream.upsert" ? upsertSessionUpstreamLinkInDatabase(db, command.input.link, command.input.now, command.input.ifAbsent) : deleteSessionUpstreamLinkInDatabase(db, command.input.sessionKey, command.input.agentId, command.input.expected);
	}, options);
	const { expected, settlement, sessionEntryCurrentSource } = command.input;
	return runOpenClawStateWriteTransaction(({ db }) => {
		requestSessionEntryCurrentAdmission(sessionEntryCurrentSource, {
			stage: "transaction",
			facts: void 0
		});
		if (!isSessionStateUpstreamCurrentInDatabase(db, expected)) return false;
		const query = getNodeSqliteKysely(db);
		if (settlement.kind === "missing") executeSqliteQuerySync(db, query.deleteFrom("session_upstream_links").where("session_key", "=", expected.sessionKey).where("agent_id", "=", expected.agentId));
		else executeSqliteQuerySync(db, query.updateTable("session_upstream_links").set({
			last_marker_json: JSON.stringify(settlement.marker),
			last_scanned_at: settlement.now,
			updated_at: settlement.now
		}).where("session_key", "=", expected.sessionKey).where("agent_id", "=", expected.agentId));
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
//#region src/state/agent-provenance.kernel.ts
function recordAgentProvenanceInDatabase(database, provenance) {
	const db = getNodeSqliteKysely(database);
	const values = {
		agent_id: provenance.agentId,
		created_via: provenance.createdVia,
		creator_agent_id: provenance.creatorAgentId,
		created_at_ms: provenance.createdAtMs
	};
	executeSqliteQuerySync(database, db.insertInto("agent_provenance").values(values).onConflict((conflict) => conflict.column("agent_id").doUpdateSet({
		created_via: values.created_via,
		creator_agent_id: values.creator_agent_id,
		created_at_ms: values.created_at_ms
	})));
	agentProvenancePublication.stagePostimages(database, [provenance]);
}
function agentProvenanceFromRow(row) {
	if (row.created_via !== "operator" && row.created_via !== "agent" && row.created_via !== "claw") throw new Error(`Invalid agent provenance created_via: ${row.created_via}`);
	return {
		agentId: row.agent_id,
		createdVia: row.created_via,
		creatorAgentId: row.creator_agent_id,
		createdAtMs: row.created_at_ms
	};
}
function listAgentProvenanceInDatabase(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("agent_provenance").selectAll().orderBy("agent_id", "asc")).rows.map(agentProvenanceFromRow);
}
/** Decode only requested provenance, in the caller's order, including its first error. */
function readAgentProvenanceBatchInDatabase(database, agentIds) {
	if (agentIds.length === 0) return [];
	const db = getNodeSqliteKysely(database);
	const requestedIds = JSON.stringify(agentIds.map(normalizeAgentId));
	const query = db.selectFrom(sqliteStringSetEntries(requestedIds).as("requested")).innerJoin("agent_provenance", "agent_provenance.agent_id", "requested.value").selectAll("agent_provenance").orderBy("requested.key", "asc");
	const records = [];
	for (const row of iterateSqliteQuerySync(database, query)) records.push(agentProvenanceFromRow(row));
	return records;
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
//#region src/state/user-preferences.worker.ts
function executeUserPreferenceCommand(command, options) {
	ensureUserProfilesSchema(options);
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
//#endregion
//#region src/state/openclaw-state-worker-runtime.ts
function executeSharedStateCommand(command, context, open, write, updateRunWriter) {
	const stateOptions = () => ({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (command.type === "updateRuns.recordStep" || command.type === "updateRuns.recordPhase" || command.type === "updateRuns.create" || command.type === "updateRuns.finish" || command.type === "updateRuns.recordVerification" || command.type === "updateRuns.recordDiagnostics") return withUpdateRunWriteAdmission((assertCurrent) => recordUpdateRunMutationInWorker(command, stateOptions(), assertCurrent, updateRunWriter));
	if (command.type === "updateRuns.reconcile") return withUpdateRunWriteAdmission((assertCurrent) => reconcileUpdateRunCandidatesInWorker(command.input, stateOptions(), assertCurrent));
	if (command.type === "updateRuns.reconcileInterrupted") return withUpdateRunWriteAdmission((assertCurrent) => persistInterruptedUpdateObservation(command.input, stateOptions(), assertCurrent));
	if (command.type === "claws.install-schema-versions") return (command.input.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly : withExistingOpenClawStateDatabaseReadOnly)(({ db, path: pathname }) => {
		assertOpenClawStateDatabaseOwner(db, { pathname });
		return readClawInstallSchemaVersionRows(db);
	}, stateOptions());
	if (command.type === "userPreferences.write") return executeUserPreferenceCommand(command, {
		database: open(),
		...stateOptions()
	});
	if (command.type === "tui.lastSession.clear") return clearRetiredTuiPointers(new Set(command.input.retiredSessionKeys), stateOptions(), open);
	if (command.type === "backup.recordOutcome") {
		if (!isOpenClawStateDatabaseOpen(context.databasePath)) {
			if (!withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
				assertOpenClawStateDatabaseOwner(db, { pathname: context.databasePath });
				return true;
			}, stateOptions())) return;
		}
		return write(({ db }) => recordBackupRunInDatabase(db, command.input));
	}
	const database = open();
	if (command.type === "githubPublication.prepareSessionReceiptDeletion") return readSessionReceiptDeletionIdentitiesInDatabase(database, command.input);
	if (command.type === "githubPublication.deleteSessionReceipts") return deletePersonalGitHubSessionReceiptsInDatabase(database, command.input);
	if (command.type === "githubRepository.personalPending") return readPendingRepositoryGitHubPublicationInDatabase(database.db, command.input);
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
	if (command.type === "tui.lastSession.write") return writeConfigMachineState(`${TUI_LAST_SESSION_STATE_KEY_PREFIX}${command.input.scopeKey}`, command.input.sessionKey, writeOptions);
	if (command.type === "sandboxRegistry.insertIfMissing") return importSandboxRegistryRow(command.input, writeOptions);
	if (command.type === "workspace.replaceAttestation") return runOpenClawStateWriteTransaction((writer) => captureWorkspaceStateReceipt(writer.db, () => {
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
	}), writeOptions);
	if (command.type === "workspace.snapshotAndRegister" || command.type === "workspace.mergeSetup" || command.type === "workspace.expire" || command.type === "workspace.delete") return executeWorkspaceStateCommand(command, database, writeOptions);
	if (command.type === "sandboxRegistry.write" || command.type === "sandboxRegistry.reserve" || command.type === "sandboxRegistry.beginRemoval" || command.type === "sandboxRegistry.finishRemoval") return executeSandboxRegistryCommand(command, writeOptions);
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
	if (command.type === "secrets.allowedHosts") return updateSecretStoreAllowedHostsInDatabase({
		...command.input,
		database: writeOptions
	}, (stage) => requestSqliteWorkerOperationAdmission({
		stage,
		facts: void 0
	}));
	if (command.type === "secrets.purge") return purgeExpiredSecretStoreEntriesInDatabase(command.input, writeOptions);
	if (command.type === "secrets.writeForConfigRef") return writeSecretStoreEntryForConfigRefInDatabase(command.input, writeOptions, (stage) => requestSqliteWorkerOperationAdmission({
		stage,
		facts: void 0
	}));
	if (command.type === "sessionGroups.mutate") return mutateSessionGroupCatalogInDatabase(database, command.input, writeOptions.env);
	if (command.type === "agentProvenance.readBatch" || command.type === "agentProvenance.list") {
		ensureAgentProvenanceSchema(writeOptions);
		return command.type === "agentProvenance.readBatch" ? readAgentProvenanceBatchInDatabase(database.db, command.input.agentIds) : listAgentProvenanceInDatabase(database.db);
	}
	if (command.type === "agentProvenance.record") {
		ensureAgentProvenanceSchema(writeOptions);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const { receipt } = agentProvenancePublication.capture(db, () => recordAgentProvenanceInDatabase(db, command.input));
			deferSqliteWorkerCommitReceipt(db, { provenanceAuthority: agentProvenancePublication.bound(receipt) });
		}, writeOptions, { operationLabel: "agent-provenance.record" });
	}
	if (command.type === "sessionUpstream.settle" || command.type === "sessionUpstream.upsert" || command.type === "sessionUpstream.delete") return executeSessionUpstreamCommand(command, writeOptions);
	if (command.type === "sessionState.sweep" || command.type === "sessionState.cleanup" || command.type === "sessionState.record" || command.type === "sessionState.prune" || command.type === "sessionState.registerWatch" || command.type === "sessionState.acknowledge") return executeSessionStateCommand(command, writeOptions);
	if (command.type === "subagents.persistChanges") return persistSubagentRunChangesInWorker(command.input, writeOptions);
	if (command.type === "config.health.patch") {
		const { configPath, patch, expected, updatedAtMs } = command.input;
		return runOpenClawStateWriteTransaction(({ db }) => {
			return patchConfigHealthEntryInDatabase(db, configPath, patch, expected, updatedAtMs);
		}, writeOptions);
	}
	throw new Error("Unknown shared-state SQLite command");
}
//#endregion
export { executeSharedStateCommand, openUpdateRunWriter, prepareCronStateWorkerCommand as prepareSharedStateCommand };
