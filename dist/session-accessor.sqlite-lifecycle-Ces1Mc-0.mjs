import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { a as isAgentHarnessSessionKey, c as isValidAgentHarnessSessionStoreEntry, d as resolveAgentHarnessSessionStoreEntryError, i as MODEL_SELECTION_LOCK_REMOVAL_MESSAGE } from "./agent-harness-session-key-D8EQIzja.mjs";
import { i as toDatabaseOptions, n as resolveSqliteAgentId } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { c as resolveSqliteStoreScope, l as resolveSqliteTranscriptArchiveDirectory, n as captureLifecycleDatabaseScope, p as runExclusiveSqliteSessionWrite, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-DP2BCaGd.mjs";
import { u as bindPreparedSessionEntryPublication } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { n as emitSessionLifecycleEvent, t as emitSessionIdentityMutation } from "./session-lifecycle-events-qdejgRzS.mjs";
import { D as withSqliteSessionDeletions, S as hasPreparedNativeSessionDeletion, a as readLifecycleTargetSnapshot, w as runSqliteSessionDeletionTransaction } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { o as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { n as preparePersonalGitHubSessionReceiptDeletion } from "./github-personal-publication-lifecycle-BnuNz0yU.mjs";
import { f as withSqliteTranscriptArchiveSession, n as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-archive-B_Nn5x_K.mjs";
import { i as publishCommittedSessionEntryRemoval } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
import { d as runSqliteSessionReclamation, f as emitArchivedTranscriptUpdates, i as kickSessionHistoryDiskBudgetMaintenance, l as publishSessionStateArchives, u as runSessionDeletionPlanning } from "./session-history-eviction-D6jaTF6N.mjs";
import { c as expectedEntryMismatchResult, d as resolveSessionReclamationDatabaseOptions, f as runExclusiveSqliteSessionReclamation, i as createSessionEntryReclamationPlan, l as prepareHistoricalGenerationDeletions, t as createHistoricalGenerationReclamationPlan } from "./session-accessor.sqlite-reclamation-CiWnC9OH.mjs";
import { r as prepareSessionEntryReplacementDatabase } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-geetJjjX.mjs";
import { t as applySessionResetInDatabase } from "./session-reset.kernel-Z6zcgB3b.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/config/sessions/session-reset.ts
function resetSessionEntryInWorker(params, database, agentId, markCommitted) {
	return runSessionEntryWorkerOperation({
		database,
		agentId,
		assertCurrent: () => params.commitGuard?.(),
		candidateKind: "session-reset",
		onAcknowledged(candidate) {
			markCommitted();
			if (candidate.projectionNeedsReconcile && candidate.mutation.previousSessionId) startSessionTranscriptIndexReconcile({
				...database,
				preferredSessionId: candidate.mutation.previousSessionId
			});
		},
		prepareWorker: params.resetBoundary ? (execution, source) => ({
			async prepare() {
				const snapshot = await execution.runExisting(source, (worker) => worker.execute({
					type: "session.entry.patch.prepare",
					input: {
						kind: "target",
						target: params.target
					}
				}));
				source.assertCurrent();
				const sessionId = snapshot?.[0]?.entry.sessionId;
				if (sessionId) {
					const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
					source.assertCurrent();
					await restoreSessionColdTranscript({
						agentId,
						env: database.env,
						storePath: database.path,
						sessionId
					}, () => source.assertCurrent());
					source.assertCurrent();
				}
			},
			beforeWrite: () => source.assertCurrent(),
			release: async () => {}
		}) : void 0,
		async run(worker, commit) {
			const prepared = await worker.execute({
				type: "session.entry.patch.prepare",
				input: {
					kind: "target",
					target: params.target
				}
			});
			params.commitGuard?.();
			const nextEntry = await params.buildNextEntry({
				currentEntry: prepared[0] ? structuredClone(prepared[0].entry) : void 0,
				primaryKey: params.target.canonicalKey
			});
			params.commitGuard?.();
			return commit(() => worker.execute({
				type: "session.lifecycle.reset",
				input: {
					agentId,
					target: params.target,
					prepared,
					nextEntry,
					resetBoundary: params.resetBoundary
				}
			}));
		},
		async onCommitted(candidate, published, databaseIdentity) {
			if (candidate.progressCardReset) emitSessionLifecycleEvent({
				agentId,
				sessionKey: candidate.previousSessionKeys[0] ?? params.target.canonicalKey,
				reason: "progress-card-reset"
			});
			const mutation = candidate.mutation;
			const event = {
				agentId,
				databaseIdentity,
				kind: mutation.previousEntry ? "reset" : "create",
				previous: {
					...mutation.previousSessionId ? { sessionId: mutation.previousSessionId } : {},
					sessionKeys: candidate.previousSessionKeys
				},
				current: {
					...mutation.nextEntry.sessionId ? { sessionId: mutation.nextEntry.sessionId } : {},
					sessionKeys: [params.target.canonicalKey]
				}
			};
			if (published?.prepared) bindPreparedSessionEntryPublication(event, {
				kind: "metadata",
				sharingChange: "changed",
				prepared: published.prepared
			});
			emitSessionIdentityMutation(event);
			await params.afterEntryMutation?.(structuredClone(mutation));
			return {
				...mutation,
				archivedTranscripts: []
			};
		}
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-lifecycle.ts
async function withCommittedHistoryMaintenance({ agentId, env, storePath }, run, options = {}) {
	let committed = false;
	try {
		return await run((database) => {
			deferOpenClawAgentPostCommitPublication(database, () => {
				committed = true;
			});
		}, () => {
			committed = true;
		});
	} finally {
		if (committed && options.scheduleNext !== false) kickSessionHistoryDiskBudgetMaintenance({
			agentId,
			env,
			storePath,
			force: true
		});
	}
}
/** Resets one persisted session entry using SQLite session rows. */
async function resetSessionEntryLifecycle(params) {
	const agentId = params.agentId ?? parseAgentSessionKey(params.target.canonicalKey)?.agentId;
	const resolved = captureLifecycleDatabaseScope(resolveSqliteStoreScope(params.storePath, { agentId }));
	const databaseOptions = {
		...toDatabaseOptions(resolved),
		path: resolved.path
	};
	if (isMainThread && supportsOpenClawAgentDatabaseExecution(databaseOptions)) return withCommittedHistoryMaintenance({
		agentId: resolved.agentId,
		env: resolved.env,
		storePath: params.storePath
	}, (_recordCommit, markCommitted) => resetSessionEntryInWorker(params, databaseOptions, resolved.agentId, markCommitted));
	if (params.resetBoundary) {
		params.commitGuard?.();
		const source = withOpenClawAgentDatabaseReadOnly((database) => readLifecycleTargetSnapshot(database, params.target)[0]?.entry.sessionId, toDatabaseOptions(resolved));
		if (source.found && source.value) {
			const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
			await restoreSessionColdTranscript({
				agentId: resolved.agentId,
				env: resolved.env,
				storePath: params.storePath,
				sessionId: source.value
			});
		}
	}
	return await withCommittedHistoryMaintenance({
		agentId: resolved.agentId,
		storePath: params.storePath
	}, async (recordCommit) => runExclusiveSqliteSessionWrite(resolved, async () => {
		params.commitGuard?.();
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const targetSnapshot = readLifecycleTargetSnapshot(database, params.target);
		const current = targetSnapshot[0];
		const nextEntry = await params.buildNextEntry({
			currentEntry: current ? structuredClone(current.entry) : void 0,
			primaryKey: params.target.canonicalKey
		});
		const mutation = {
			nextEntry: structuredClone(nextEntry),
			...current ? { previousEntry: structuredClone(current.entry) } : {},
			...current?.entry.sessionId ? { previousSessionId: current.entry.sessionId } : {}
		};
		const databaseIdentity = runSqliteSessionDeletionTransaction((transactionDb) => {
			params.commitGuard?.();
			applySessionResetInDatabase(transactionDb, {
				agentId: resolved.agentId,
				target: params.target,
				prepared: targetSnapshot,
				nextEntry,
				resetBoundary: params.resetBoundary
			});
			recordCommit(transactionDb);
			return readOpenClawAgentDatabaseIdentity(transactionDb).identity;
		}, toDatabaseOptions(resolved), { operationLabel: "session.lifecycle.reset" });
		emitSessionIdentityMutation({
			agentId: resolved.agentId,
			databaseIdentity,
			kind: current ? "reset" : "create",
			previous: current ? {
				...current.entry.sessionId ? { sessionId: current.entry.sessionId } : {},
				sessionKeys: targetSnapshot.map((row) => row.sessionKey)
			} : { sessionKeys: [] },
			current: {
				...nextEntry.sessionId ? { sessionId: nextEntry.sessionId } : {},
				sessionKeys: [params.target.canonicalKey]
			}
		});
		await params.afterEntryMutation?.(mutation);
		return {
			...mutation,
			archivedTranscripts: []
		};
	}, "session.lifecycle.reset"));
}
async function deleteSqliteSessionEntryLifecycleInternal(params, allowLockedEntryRemoval, expectedPluginOwnerId) {
	const agentId = params.agentId ?? parseAgentSessionKey(params.target.canonicalKey)?.agentId;
	const resolved = captureLifecycleDatabaseScope(resolveSqliteScope({
		agentId,
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	}));
	return await withCommittedHistoryMaintenance({
		...params,
		env: resolved.env
	}, async (recordCommit, markCommitted) => deleteSqliteSessionEntryLifecycleLocked(resolved, params, allowLockedEntryRemoval, expectedPluginOwnerId, recordCommit, markCommitted));
}
const DELETE_EXPECTED_ENTRY_MISMATCH = Symbol("delete-expected-entry-mismatch");
async function deleteSqliteSessionEntryLifecycleLocked(requestedScope, params, allowLockedEntryRemoval, expectedPluginOwnerId, recordCommit, markCommitted) {
	const requestedDatabaseOptions = toDatabaseOptions(requestedScope);
	const useWorker = isMainThread && params.expectedDatabaseIdentity === void 0 && supportsOpenClawAgentDatabaseExecution(requestedDatabaseOptions);
	const opened = useWorker ? getOpenClawAgentDatabaseIfOpen(requestedDatabaseOptions) : void 0;
	const openedIdentity = opened ? readOpenClawAgentDatabaseIdentity(opened) : void 0;
	const expectedIdentity = openedIdentity && typeof openedIdentity.identity === "string" ? {
		kind: "file",
		physicalIdentity: openedIdentity.identity,
		birthtime: openedIdentity.birthtime,
		nativeLocation: openedIdentity.filename
	} : void 0;
	const resolved = expectedIdentity ? {
		...requestedScope,
		path: expectedIdentity.nativeLocation
	} : requestedScope;
	const databaseOptions = toDatabaseOptions(resolved);
	const reclamationOptions = useWorker ? resolveSessionReclamationDatabaseOptions(databaseOptions) : void 0;
	const execution = reclamationOptions ? captureOpenClawAgentDatabaseExecution(reclamationOptions, expectedIdentity ? { expectedIdentity } : {}) : void 0;
	const assertSourceCurrent = () => {
		execution?.assertCurrent();
		params.commitGuard?.();
	};
	try {
		return await withSqliteTranscriptArchiveSession(databaseOptions, async () => {
			if (reclamationOptions) await prepareSessionEntryReplacementDatabase(reclamationOptions, assertSourceCurrent, execution);
			const { commitGuard: _commitGuard, env: _env, expectedDatabaseIdentity: _expectedDatabaseIdentity, descendantRunBasis: _descendantRunBasis, ...deleteParams } = params;
			const preparation = await runSessionDeletionPlanning(resolved, params, {
				operation: "entry",
				input: {
					deleteParams,
					archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
					admissionIdentities: [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []],
					allowLockedEntryRemoval,
					expectedPluginOwnerId
				}
			}, assertSourceCurrent);
			if (preparation.operation !== "entry") throw new Error(`SQLite session deletion planning returned ${preparation.operation} for entry`);
			if (preparation.value.kind === "missing") {
				await publishSessionStateArchives(resolved, []);
				return {
					archivedTranscripts: [],
					deleted: false
				};
			}
			if (preparation.value.kind === "expected-entry-mismatch") {
				await publishSessionStateArchives(resolved, []);
				return expectedEntryMismatchResult([]);
			}
			const prepared = preparation.value.value;
			return await withSqliteSessionDeletions(resolved, prepared.targetSnapshot, async (assertCurrent) => {
				const assertDeletionCurrent = () => {
					assertSourceCurrent();
					assertCurrent();
				};
				const deleteReceipts = await preparePersonalGitHubSessionReceiptDeletion({
					agentId: resolved.agentId,
					env: resolved.env,
					generations: [.../* @__PURE__ */ new Set([
						params.target.canonicalKey,
						...params.target.storeKeys,
						...prepared.targetSnapshot.map((row) => row.sessionKey)
					])].map((sessionKey) => {
						const entry = prepared.targetSnapshot.find((row) => row.sessionKey === sessionKey)?.entry ?? prepared.current.entry;
						return {
							sessionKey,
							sessionId: entry.sessionId,
							lifecycleRevision: entry.lifecycleRevision ?? null
						};
					}),
					assertCurrent: assertDeletionCurrent
				});
				const validation = {
					deleteParams: params,
					preparedTargetSnapshot: prepared.targetSnapshot
				};
				const historicalArchivedTranscripts = [];
				for (const generation of prepareHistoricalGenerationDeletions({
					...validation,
					sessionIds: prepared.historicalGenerationIds
				})) {
					const { sessionId } = generation;
					const { commitGuard: _generationGuard, env: _generationEnv, expectedDatabaseIdentity: _generationIdentity, descendantRunBasis: _generationBasis, ...generationParams } = generation.deleteParams;
					const generationValidation = {
						deleteParams: generationParams,
						preparedTargetSnapshot: prepared.targetSnapshot,
						scope: generation.scope
					};
					const planning = await runSessionDeletionPlanning(resolved, params, {
						operation: "history",
						input: {
							validation: generationValidation,
							sessionId,
							archiveDirectory: prepared.archiveDirectory,
							archiveTranscript: params.archiveTranscript,
							admissionIdentities: [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []]
						}
					}, assertDeletionCurrent);
					if (planning.operation !== "history") throw new Error(`SQLite session deletion planning returned ${planning.operation} for history`);
					if (planning.value.kind === "expected-entry-mismatch") return expectedEntryMismatchResult(historicalArchivedTranscripts);
					if (planning.value.kind === "skip") continue;
					const plan = planning.value.plan;
					const archivedGeneration = await runExclusiveSqliteSessionReclamation(async () => {
						const materializedGeneration = await materializeSessionStateDeletePlans([plan]);
						const diagnostics = {};
						const checked = await runSessionDeletionPlanning(resolved, params, {
							operation: "check",
							input: {
								validation: generationValidation,
								sessionId,
								admissionIdentities: [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []]
							}
						}, assertDeletionCurrent, diagnostics);
						if (checked.operation !== "check") throw new Error(`SQLite session deletion planning returned ${checked.operation} for check`);
						if (checked.value.kind === "expected-entry-mismatch") return DELETE_EXPECTED_ENTRY_MISMATCH;
						const reclamationPlan = createHistoricalGenerationReclamationPlan({
							databaseOptions,
							deleteParams: generation.deleteParams,
							materializedPlans: materializedGeneration,
							preparedTargetSnapshot: prepared.targetSnapshot,
							protectedSessionIds: new Set(checked.value.protectedSessionIds),
							sessionId
						});
						const reclaimed = await runSqliteSessionReclamation({
							diagnostics,
							assertCommitAllowed: assertDeletionCurrent,
							forceInProcess: typeof params.expectedDatabaseIdentity === "symbol" || hasPreparedNativeSessionDeletion(),
							onInProcessCommit: recordCommit,
							plan: reclamationPlan
						});
						if (reclaimed.kind !== reclamationPlan.kind) throw new Error(`SQLite session reclamation returned ${reclaimed.kind} for ${reclamationPlan.kind}`);
						return reclaimed.value;
					});
					if (archivedGeneration === DELETE_EXPECTED_ENTRY_MISMATCH) return expectedEntryMismatchResult(historicalArchivedTranscripts);
					if (archivedGeneration.expectedEntryMismatch) return expectedEntryMismatchResult(historicalArchivedTranscripts);
					if (archivedGeneration.deleted) markCommitted();
					const publishedGeneration = await publishSessionStateArchives(resolved, archivedGeneration.archivedTranscripts);
					emitArchivedTranscriptUpdates(publishedGeneration);
					historicalArchivedTranscripts.push(...publishedGeneration);
				}
				let committedDatabaseIdentity;
				const result = await runExclusiveSqliteSessionReclamation(async () => {
					const materializedPlans = await materializeSessionStateDeletePlans(prepared.entryPlans);
					const diagnostics = {};
					const reclamationPlan = createSessionEntryReclamationPlan({
						databaseOptions,
						deleteParams: params,
						materializedPlans,
						preparedTargetSnapshot: prepared.targetSnapshot
					});
					const reclaimed = await runSqliteSessionReclamation({
						diagnostics,
						assertCommitAllowed: assertDeletionCurrent,
						forceInProcess: typeof params.expectedDatabaseIdentity === "symbol" || hasPreparedNativeSessionDeletion(),
						onInProcessCommit: (database) => {
							committedDatabaseIdentity = readOpenClawAgentDatabaseIdentity(database).identity;
							recordCommit(database);
						},
						onWorkerResult: (_result, databaseIdentity) => {
							committedDatabaseIdentity = databaseIdentity;
						},
						plan: reclamationPlan
					});
					if (reclaimed.kind !== reclamationPlan.kind) throw new Error(`SQLite session reclamation returned ${reclaimed.kind} for ${reclamationPlan.kind}`);
					return reclaimed.value;
				});
				if (result.deleted) {
					markCommitted();
					if (committedDatabaseIdentity === void 0) throw new Error("Committed session deletion omitted its database identity");
					publishCommittedSessionEntryRemoval(resolved.agentId, committedDatabaseIdentity, prepared.current.entry.sessionId, prepared.targetSnapshot.map((row) => row.sessionKey));
					await deleteReceipts(execution ? () => execution.assertCurrent() : void 0);
				}
				result.archivedTranscripts = await publishSessionStateArchives(resolved, result.archivedTranscripts);
				emitArchivedTranscriptUpdates(result.archivedTranscripts);
				result.archivedTranscripts.push(...historicalArchivedTranscripts);
				return result;
			}, { additionalIdentities: prepared.historicalGenerationIds });
		});
	} finally {
		await execution?.release();
	}
}
/** Deletes one persisted session entry using SQLite session rows. */
async function deleteSessionEntryLifecycle(params) {
	return await deleteSqliteSessionEntryLifecycleInternal(params, false);
}
/** Disk-budget owner: delete one exact archived row without recursively scheduling another pass. */
async function deleteDiskBudgetSessionEntryLifecycle(params, resolved) {
	const targetScope = captureLifecycleDatabaseScope({
		...resolved,
		agentId: resolveSqliteAgentId({
			scopedAgentId: params.agentId ?? parseAgentSessionKey(params.target.canonicalKey)?.agentId,
			storeAgentId: resolved.databaseAgentId ?? resolved.agentId,
			storeShared: resolved.databaseAgentId !== void 0
		})
	});
	return await withCommittedHistoryMaintenance({
		...params,
		env: targetScope.env
	}, async (recordCommit, markCommitted) => await deleteSqliteSessionEntryLifecycleLocked(targetScope, params, false, void 0, recordCommit, markCommitted), { scheduleNext: false });
}
/** Rolls back one exact locked row created by failed trusted harness initialization. */
async function rollbackAgentHarnessSessionEntryLifecycle(params) {
	const hasExactTarget = params.target.storeKeys.length === 1 && params.target.storeKeys[0] === params.target.canonicalKey;
	const expectedEntryError = resolveAgentHarnessSessionStoreEntryError(params.target.canonicalKey, params.expectedEntry);
	if (!hasExactTarget || expectedEntryError || !isValidAgentHarnessSessionStoreEntry(params.target.canonicalKey, params.expectedEntry)) throw new Error(expectedEntryError ?? "Model-selection-locked sessions cannot be removed, unlocked, or reassigned.");
	return await deleteSqliteSessionEntryLifecycleInternal(params, true);
}
/** Rolls back one exact locked CLI row created by a failed plugin initializer. */
async function rollbackPluginOwnedSessionEntryLifecycle(params) {
	const expectedEntry = params.expectedEntry;
	const validPluginOwner = normalizeOptionalString(expectedEntry.pluginOwnerId);
	const expectedPluginOwner = normalizeOptionalString(params.expectedPluginOwnerId);
	if (isAgentHarnessSessionKey(params.target.canonicalKey) || expectedEntry.agentHarnessId !== void 0 || expectedEntry.modelSelectionLocked !== true || !validPluginOwner || validPluginOwner !== expectedPluginOwner) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
	return await deleteSqliteSessionEntryLifecycleInternal(params, true, expectedPluginOwner);
}
//#endregion
export { rollbackPluginOwnedSessionEntryLifecycle as a, rollbackAgentHarnessSessionEntryLifecycle as i, deleteSessionEntryLifecycle as n, resetSessionEntryLifecycle as r, deleteDiskBudgetSessionEntryLifecycle as t };
