import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as readOpenClawAgentDatabaseIdentity, n as createOpenClawAgentDatabaseClaim } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { _ as retainAgentDatabase, u as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { i as getOpenClawAgentDatabaseIfOpen, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions, n as resolveSqliteAgentId } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as bindPreparedSessionEntryPublication } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { n as emitSessionLifecycleEvent, t as emitSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
import { a as publishCommittedSessionEntryRemoval } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { i as assertModelSelectionUnlocked } from "./model-overrides-CgHG3YVT.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as resolveSqliteStoreScope, r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { l as runExclusiveSqliteSessionWrite, n as captureLifecycleDatabaseScope, o as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { p as withSqliteTranscriptArchiveSession, r as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-archive-C60vk-we.mjs";
import { S as runSqliteSessionDeletionTransaction, T as withSqliteSessionDeletions, h as readLifecycleTargetSnapshot, y as captureNativeSessionWorkerDeletion } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { l as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { a as prepareHistoricalGenerationDeletions, c as resolveSessionReclamationDatabaseOptions, i as expectedEntryMismatchResult, l as runExclusiveSqliteSessionReclamation, o as prepareReclamationDeleteParams } from "./session-accessor.sqlite-reclamation-CdzHU4X_.mjs";
import { a as isAgentHarnessSessionKey, c as isValidAgentHarnessSessionStoreEntry, d as resolveAgentHarnessSessionStoreEntryError, i as MODEL_SELECTION_LOCK_REMOVAL_MESSAGE } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { n as collectReclamationDeletionEntries } from "./session-accessor.sqlite-reclamation-publication-Cd995rIj.mjs";
import { n as runSessionNativeBindingWorkerOperation } from "./session-native-binding-CM20NNGU.mjs";
import { d as runSessionDeletionPlanning, f as runSqliteSessionReclamation, i as kickSessionHistoryDiskBudgetMaintenance, l as publishSessionStateArchives } from "./session-history-eviction-DcKJmUSb.mjs";
import { t as emitArchivedTranscriptUpdates } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { t as applySessionResetInDatabase } from "./session-reset.kernel-CvcTFYIm.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/config/sessions/session-accessor.memory-lifecycle.ts
function resetMemorySessionEntryLifecycle(params) {
	const scope = {
		...params,
		sessionKey: params.target.canonicalKey
	};
	const assertCurrent = () => params.commitGuard?.();
	const authority = {
		assertCurrent,
		authorize() {}
	};
	if (!captureSessionActorStorageOwner(scope, authority)) return;
	return withSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		create: true
	}, async (memory) => {
		const owner = captureSessionActorStorageOwner({ sessionActor: memory }).owner;
		const expected = await memory.actor.storage.read({
			type: "session.entry.read",
			input: {}
		}, memory.authority);
		const nextEntry = await params.buildNextEntry({
			currentEntry: expected && structuredClone(expected),
			primaryKey: scope.sessionKey
		});
		const { progressCardReset: _progressCardReset, ...mutation } = readSessionActorStorageResult(await memory.actor.storage.mutate({
			type: "session.lifecycle.reset",
			input: {
				expected,
				nextEntry: structuredClone(nextEntry),
				resetBoundary: params.resetBoundary
			}
		}, memory.authority));
		const target = captureSessionTranscriptTargetBinding({
			agentId: memory.agentId,
			storePath: memory.path
		});
		await params.afterEntryMutation?.(mutation, {
			env: Object.freeze(target.env),
			source: {
				agentId: memory.agentId,
				path: memory.path
			},
			assertCurrent: () => owner.assertCurrent()
		});
		return mutation;
	}).then((result) => {
		if (!result) throw new Error("Memory session reset lost its selected owner");
		return result;
	});
}
function deleteMemorySessionEntryLifecycle(params, allowLocked = false) {
	const scope = {
		...params,
		sessionKey: params.target.canonicalKey
	};
	const assertCurrent = () => params.commitGuard?.();
	const authority = {
		assertCurrent,
		authorize() {}
	};
	const captured = captureSessionActorStorageOwner(scope, authority);
	if (!captured) return;
	const absent = {
		deleted: false,
		archivedTranscripts: [],
		...params.expectedEntry || params.expectedSessionId != null || params.expectedLifecycleRevision !== void 0 || params.expectedUpdatedAt !== void 0 ? { expectedEntryMismatch: true } : {}
	};
	return withSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		}
	}, async (memory) => {
		const entry = await memory.actor.storage.read({
			type: "session.entry.read",
			input: {}
		}, memory.authority);
		if (!entry) return absent;
		const owner = captured.owner;
		const target = captureSessionTranscriptTargetBinding({
			agentId: memory.agentId,
			storePath: memory.path,
			env: params.env
		});
		return withSqliteSessionDeletions({
			agentId: memory.agentId,
			path: memory.path,
			env: target.env,
			ownerStorePath: params.storePath
		}, [{
			sessionKey: scope.sessionKey,
			entry
		}], async (assertDeletionCurrent, capture, settleReceipts) => {
			let authorityError;
			const companions = {};
			const outcome = await memory.actor.storage.mutate({
				type: "session.lifecycle.delete",
				input: {
					expectedEntry: params.expectedEntry,
					expectedSessionId: params.expectedSessionId === void 0 ? entry.sessionId : params.expectedSessionId,
					expectedLifecycleRevision: params.expectedLifecycleRevision ?? entry.lifecycleRevision,
					expectedUpdatedAt: params.expectedUpdatedAt
				}
			}, {
				assertCurrent() {
					try {
						memory.authority.assertCurrent();
						assertDeletionCurrent();
					} catch (error) {
						authorityError = error;
						throw error;
					}
				},
				authorize(stage, facts, publication) {
					memory.authority.authorize(stage, facts, publication);
					if (!allowLocked && facts.entry) assertModelSelectionUnlocked(facts.entry, MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
				}
			}, { beforeCommit(receipt) {
				if (receipt.value.deleted && receipt.value.deletedEntry) {
					companions.settlement = capture([{
						sessionKey: scope.sessionKey,
						entry: receipt.value.deletedEntry
					}]);
					companions.settlement.beforeCommit();
				}
			} });
			companions.settlement?.settle(outcome.kind);
			if (outcome.kind === "rolled-back") {
				if (authorityError) throw toErrorObject(authorityError, "Session deletion authority rejected the operation");
			} else if (outcome.value.deleted) await settleReceipts(() => owner.assertCurrent());
			return readSessionActorStorageResult(outcome);
		}, {
			memory: owner,
			receiptsOnCommit: { generations: [{
				agentId: memory.agentId,
				sessionKey: scope.sessionKey,
				sessionId: entry.sessionId,
				lifecycleRevision: entry.lifecycleRevision ?? null
			}] }
		});
	}).then((result) => result ?? absent);
}
//#endregion
//#region src/config/sessions/session-entry-deletion.ts
function deleteSessionEntryInWorker(plan, execution, assertCurrent, onResult) {
	const entries = collectReclamationDeletionEntries(plan);
	const captured = captureNativeSessionWorkerDeletion(entries);
	const operation = {
		database: plan.databaseOptions,
		agentId: plan.databaseOptions.agentId,
		retainedExecution: execution,
		assertCurrent,
		candidateKind: "session-entry-deletion",
		onCommitted(candidate, _published, identity) {
			onResult?.(candidate.result, identity);
			return candidate.result;
		}
	};
	return captured ? runSessionNativeBindingWorkerOperation({
		...operation,
		captured,
		entries,
		execute: (worker, nativeBindings) => worker.execute({
			type: "session.lifecycle.delete",
			input: {
				plan,
				nativeBindings
			}
		})
	}) : runSessionEntryWorkerOperation({
		...operation,
		run: (worker, commit) => commit(() => worker.execute({
			type: "session.lifecycle.delete",
			input: { plan }
		}))
	});
}
//#endregion
//#region src/config/sessions/session-reset.ts
function resetSessionEntryInWorker(params, database, agentId, markCommitted) {
	let preparedTarget;
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
				preparedTarget = await execution.runExisting(source, (worker) => worker.execute({
					type: "session.entry.patch.prepare",
					input: {
						kind: "target",
						target: params.target
					}
				}));
				source.assertCurrent();
				const sessionId = preparedTarget?.[0]?.entry.sessionId;
				if (sessionId) {
					const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
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
			const prepared = preparedTarget ?? await worker.execute({
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
		async onCommitted(candidate, published, databaseIdentity, context) {
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
			await params.afterEntryMutation?.(structuredClone(mutation), {
				...context,
				source: {
					agentId: database.agentId ?? agentId,
					path: database.path
				}
			});
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
async function resetSessionEntryLifecycle(params) {
	const memory = resetMemorySessionEntryLifecycle(params);
	if (memory) return memory;
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
	return resetSessionEntryLifecycleForMaintenance(params, resolved);
}
async function resetSessionEntryLifecycleForMaintenance(params, resolved) {
	if (params.resetBoundary) {
		params.commitGuard?.();
		const source = withOpenClawAgentDatabaseReadOnly((database) => readLifecycleTargetSnapshot(database, params.target)[0]?.entry.sessionId, toDatabaseOptions(resolved));
		if (source.found && source.value) {
			const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
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
		const identity = readOpenClawAgentDatabaseIdentity(database);
		const claim = createOpenClawAgentDatabaseClaim(database, retainAgentDatabase(database.db));
		try {
			await params.afterEntryMutation?.(mutation, {
				env: Object.freeze({ ...resolved.env }),
				source: {
					agentId: resolved.agentId,
					path: database.path
				},
				assertCurrent() {
					claim.assertCurrent();
					if (typeof identity.identity === "string") assertExistingDatabaseIdentity(database.path, `file:${identity.identity}`, identity.birthtime);
				}
			});
		} finally {
			claim.release();
		}
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
	const preparedScope = expectedIdentity ? {
		...requestedScope,
		path: expectedIdentity.nativeLocation
	} : requestedScope;
	const reclamationOptions = useWorker ? resolveSessionReclamationDatabaseOptions(toDatabaseOptions(preparedScope)) : void 0;
	const execution = reclamationOptions ? captureOpenClawAgentDatabaseExecution(reclamationOptions, expectedIdentity ? { expectedIdentity } : {}) : void 0;
	const assertSourceCurrent = () => {
		execution?.assertCurrent();
		params.commitGuard?.();
	};
	try {
		const { commitGuard: _commitGuard, env: _env, expectedDatabaseIdentity: _expectedDatabaseIdentity, ...deleteParams } = params;
		const preparation = await runSessionDeletionPlanning(preparedScope, params, {
			operation: "entry",
			input: {
				deleteParams,
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(preparedScope),
				admissionIdentities: [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []],
				allowLockedEntryRemoval,
				expectedPluginOwnerId
			}
		}, assertSourceCurrent);
		if (preparation.operation !== "entry") throw new Error(`SQLite session deletion planning returned ${preparation.operation} for entry`);
		if (preparation.value.kind === "missing") {
			await publishSessionStateArchives(preparedScope, []);
			return {
				archivedTranscripts: [],
				deleted: false
			};
		}
		if (preparation.value.kind === "expected-entry-mismatch") {
			await publishSessionStateArchives(preparedScope, []);
			return expectedEntryMismatchResult([]);
		}
		const prepared = preparation.value.value;
		let resolved = preparedScope;
		if (execution) {
			const native = execution.fileIdentity;
			if (!native) throw new Error("Session deletion planning lost its admitted database identity");
			resolved = {
				...preparedScope,
				path: native.nativeLocation
			};
		}
		const databaseOptions = toDatabaseOptions(resolved);
		return await withSqliteTranscriptArchiveSession(databaseOptions, async () => {
			return await withSqliteSessionDeletions(resolved, prepared.targetSnapshot, async (assertCurrent, _capture, settleReceipts) => {
				const assertDeletionCurrent = () => {
					assertSourceCurrent();
					assertCurrent();
				};
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
					const { commitGuard: _generationGuard, env: _generationEnv, expectedDatabaseIdentity: _generationIdentity, ...generationParams } = generation.deleteParams;
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
						const reclamationPlan = {
							databaseOptions: resolveSessionReclamationDatabaseOptions(databaseOptions),
							deleteParams: prepareReclamationDeleteParams(generation.deleteParams),
							kind: "historical-generation",
							materializedPlans: materializedGeneration,
							preparedTargetSnapshot: prepared.targetSnapshot,
							protectedSessionIds: [...new Set(checked.value.protectedSessionIds)],
							sessionId
						};
						const reclaimed = await runSqliteSessionReclamation({
							diagnostics,
							assertCommitAllowed: assertDeletionCurrent,
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
					const reclamationPlan = {
						databaseOptions: resolveSessionReclamationDatabaseOptions(databaseOptions),
						deleteParams: prepareReclamationDeleteParams(params),
						kind: "entry",
						materializedPlans,
						preparedTargetSnapshot: prepared.targetSnapshot
					};
					const onWorkerResult = (_result, databaseIdentity) => {
						committedDatabaseIdentity = databaseIdentity;
					};
					const reclaimed = execution && materializedPlans.every(({ snapshot }) => snapshot.lastSeq === null && snapshot.trajectoryLastSeq === null && snapshot.acpParentStreamEventCount === 0) ? await deleteSessionEntryInWorker(reclamationPlan, execution, assertDeletionCurrent, onWorkerResult) : await runSqliteSessionReclamation({
						diagnostics,
						assertCommitAllowed: assertDeletionCurrent,
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
					await settleReceipts(execution ? () => execution.assertCurrent() : void 0);
				}
				result.archivedTranscripts = await publishSessionStateArchives(resolved, result.archivedTranscripts);
				emitArchivedTranscriptUpdates(result.archivedTranscripts);
				result.archivedTranscripts.push(...historicalArchivedTranscripts);
				return result;
			}, {
				additionalIdentities: prepared.historicalGenerationIds,
				receiptsOnCommit: { generations: [.../* @__PURE__ */ new Set([
					params.target.canonicalKey,
					...params.target.storeKeys,
					...prepared.targetSnapshot.map((row) => row.sessionKey)
				])].map((sessionKey) => {
					const entry = prepared.targetSnapshot.find((row) => row.sessionKey === sessionKey)?.entry ?? prepared.current.entry;
					return {
						agentId: resolved.agentId,
						sessionKey,
						sessionId: entry.sessionId,
						lifecycleRevision: entry.lifecycleRevision ?? null
					};
				}) }
			});
		});
	} finally {
		await execution?.release();
	}
}
async function deleteSessionEntryLifecycle(params) {
	return deleteMemorySessionEntryLifecycle(params) ?? deleteSqliteSessionEntryLifecycleInternal(params, false);
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
	return deleteMemorySessionEntryLifecycle(params, true) ?? deleteSqliteSessionEntryLifecycleInternal(params, true);
}
/** Rolls back one exact locked CLI row created by a failed plugin initializer. */
async function rollbackPluginOwnedSessionEntryLifecycle(params) {
	const expectedEntry = params.expectedEntry;
	const validPluginOwner = normalizeOptionalString(expectedEntry.pluginOwnerId);
	const expectedPluginOwner = normalizeOptionalString(params.expectedPluginOwnerId);
	if (isAgentHarnessSessionKey(params.target.canonicalKey) || expectedEntry.agentHarnessId !== void 0 || expectedEntry.modelSelectionLocked !== true || !validPluginOwner || validPluginOwner !== expectedPluginOwner) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
	return deleteMemorySessionEntryLifecycle(params, true) ?? deleteSqliteSessionEntryLifecycleInternal(params, true, expectedPluginOwner);
}
//#endregion
export { rollbackPluginOwnedSessionEntryLifecycle as a, rollbackAgentHarnessSessionEntryLifecycle as i, deleteSessionEntryLifecycle as n, resetSessionEntryLifecycle as r, deleteDiskBudgetSessionEntryLifecycle as t };
