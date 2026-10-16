import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { o as runSqliteReadOperationSync } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { a as withSqlitePostCommitPublications, i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { a as runWithSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { t as resolveIncognitoSessionExpiresAt } from "./incognito-session-key-B0aO5PSy.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { a as incognitoSideDataKeys, c as isIncognitoLifecycleCommand, d as isIncognitoComputeWrite, i as isIncognitoTranscriptWrite, l as isIncognitoLifecycleWrite, o as isIncognitoSideDataWrite, r as isIncognitoTranscriptCommand, s as incognitoLifecycleKeys, u as isIncognitoComputeCommand } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { i as sqliteSessionFileMarkerMatchesTarget } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { r as formatLegacySqliteSessionMarkerForScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { s as createMemoryTranscriptProjectionSource } from "./session-transcript-reconcile-Dv1lK4ND.mjs";
import { g as deletePreparedSessionTranscriptProjectionChunkInTransaction } from "./session-transcript-index-FbEuN6S5.mjs";
import { r as participantRecordsBySessionKey } from "./internal-session-key-CPayZwJR.mjs";
import { F as projectSessionSharingEntry } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-D1TSJMmX.mjs";
import { a as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { r as listSessionMembersInDatabase } from "./session-sharing-store.kernel-BCRJJ2WM.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { a as runWithSessionTranscriptReadFence, t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { g as loadUsageCacheOperations, u as loadAgentReactionOperations, y as createAgentDatabaseDomainOwner } from "./openclaw-agent-execution-operations-CtJayanR.mjs";
import { t as createWorkerOperationRegistry } from "./worker-operation-registry-DhUe8rTN.mjs";
import { r as readSessionProgressCard } from "./progress-card-store-CRs-FKxG.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-7UlL8HUK.mjs";
import { d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { t as readSessionGroupCategoryKeys } from "./session-group-categories.read-D10j5H75.mjs";
import { t as readClosedTranscriptTurnInDatabase } from "./session-accessor.transcript-range-Bz2uFTHG.mjs";
import { n as prepareSessionHistoryReadOperation } from "./session-history-read-operation.worker-DKAySX5X.mjs";
import { h as prepareSessionDeletionInDatabase, u as reclaimSqliteSessionInTransaction } from "./session-accessor.sqlite-reclamation-D4V0zaef.mjs";
import { n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { s as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { D as readTranscriptStatsFromDatabase, c as loadTranscriptEventsFromDatabase, d as loadTranscriptReadSnapshotSync, y as readTranscriptExportSnapshotReadOnlySync } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { t as ensureTranscriptHeader } from "./session-accessor.sqlite-transcript-header-DXW9UGub.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-Daj5_oBL.mjs";
import { t as assertSessionCreationLabelAvailable } from "./session-accessor.sqlite-creation-read-DO8QFtG0.mjs";
import { t as planSessionLifecycleArtifactCleanup } from "./session-accessor.sqlite-lifecycle-artifacts-DNHnjjzH.mjs";
import { n as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE, o as assertModelSelectionUnlocked } from "./model-overrides-uZFvcSRc.mjs";
import { i as resolveParentForkSourceTranscript, t as buildForkedChildTranscriptEvents } from "./session-accessor.sqlite-parent-fork-Bar2swWj.mjs";
import { t as readSessionTranscriptBoundedActiveContextCore } from "./session-accessor.sqlite-active-context-BG2hVt5Z.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-DoBG3JQd.mjs";
import { i as resolveTranscriptAppendRefusal } from "./session-accessor.sqlite-transcript-write-guard-zwgi538F.mjs";
import { t as listSessionReactionsInDatabase } from "./session-reaction-store.read-T2ans2sm.mjs";
import { n as selectSessionTranscriptProjection } from "./session-transcript-read-kernel-CycNXxcw.mjs";
import { a as readSessionCostUsageRollupBodyInDatabase, i as readSessionCostUsageRefreshLockInDatabase, o as readSessionCostUsageRollupByteRowsInDatabase } from "./session-cost-usage-cache.kernel-B9i4w4X5.mjs";
import { n as readSessionMembershipRowsInDatabase } from "./session-membership-facts-DpWsZovd.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-incognito-compute.worker.ts
/** Sources retain framing state, not a FIFO reservation or an open SQL transaction. */
function createIncognitoComputeWorker(database, env, admit) {
	const sources = /* @__PURE__ */ new Map();
	let keys = [];
	const options = {
		agentId: database.agentId,
		path: database.path,
		env
	};
	let projection;
	const cache = createWorkerOperationRegistry({ usageCache: loadUsageCacheOperations });
	const context = {
		open: () => database,
		options,
		admit: (stage) => admit(stage, keys),
		writeTransaction: (operationLabel, _owner, write) => runOpenClawAgentWriteTransaction((current) => {
			if (current.db !== database.db) throw new Error("Incognito usage cache lost its native owner");
			admit("transaction", keys);
			return write(current);
		}, options, { operationLabel })
	};
	const sourceFor = (input, rebuild = false) => {
		const held = sources.get(input.sourceId);
		if (!held || held.target.sessionKey !== input.sessionKey || held.target.sessionId !== input.sessionId || held.target.lifecycleRevision !== input.lifecycleRevision) throw new Error("Incognito compute source belongs to another session generation");
		if (rebuild && !held.projection) throw new Error("A bounded usage source cannot publish a transcript projection");
		return held;
	};
	const assertCacheKey = (key, input) => {
		if (!sqliteSessionFileMarkerMatchesTarget(key, {
			agentId: database.agentId,
			sessionId: input.sessionId,
			storePath: database.path
		})) throw new Error("Incognito usage cache row belongs to another transcript");
	};
	return {
		async prepare(command) {
			if (command.type.startsWith("session.compute.projection.") && !projection) {
				const { bindSqliteWorkerBackend } = await import("./config/sessions/session-transcript-projection-publication.worker.js");
				projection = bindSqliteWorkerBackend(void 0, {
					databasePath: database.path,
					database: database.db,
					admit: (stage) => admit(stage, keys)
				});
			} else if (command.type.startsWith("session.compute.usage.")) await cache.prepare(command.type.replace("session.compute.usage.", "usageCache."));
		},
		execute(command) {
			const input = command.input;
			keys = [input.sessionKey];
			const executeProjection = (inner) => {
				if (!projection) throw new Error("Incognito projection domain was not prepared");
				return projection.execute(inner);
			};
			try {
				if (command.type === "session.compute.source.release") {
					const held = sources.get(command.input.sourceId);
					const value = context.writeTransaction("sessions.transcript-index.delete-chunk", "Incognito source cleanup", () => {
						if (held) sourceFor(command.input);
						const more = held?.claimId !== void 0 && deletePreparedSessionTranscriptProjectionChunkInTransaction(database.db, {
							sessionId: input.sessionId,
							claimId: held.claimId,
							maxRowsPerTable: 512
						}).hasMore;
						admit("commit", keys);
						return more;
					});
					if (!value) {
						held?.source.clear();
						sources.delete(command.input.sourceId);
					}
					return {
						value,
						keys
					};
				}
				if (command.type === "session.compute.usage.releaseLock") return {
					value: cache.execute({
						type: "usageCache.releaseLock",
						input: command.input.request
					}, context),
					keys
				};
				const entry = readExactSessionEntryRow(database, input.sessionKey)?.entry;
				if (!entry || entry.sessionId !== input.sessionId || entry.lifecycleRevision !== input.lifecycleRevision) throw new Error("Incognito compute session generation is no longer current");
				return {
					value: withSqlitePostCommitPublications(database.db, () => {
						switch (command.type) {
							case "session.compute.source.open":
								if (sources.has(command.input.sourceId)) throw new Error("Incognito compute source is already open");
								sources.set(command.input.sourceId, {
									target: {
										sessionKey: input.sessionKey,
										sessionId: input.sessionId,
										lifecycleRevision: input.lifecycleRevision
									},
									projection: command.input.range === void 0,
									source: createMemoryTranscriptProjectionSource(database, options, command.input.range)
								});
								return;
							case "session.compute.source.read": return sourceFor(command.input).source.read(input.sessionId);
							case "session.compute.usage.stats": return readTranscriptStatsFromDatabase(database, input.sessionId);
							case "session.compute.usage.cache":
								command.input.request.filePaths.forEach((key) => assertCacheKey(key, input));
								return readSessionCostUsageRollupByteRowsInDatabase(database.db, command.input.request.filePaths);
							case "session.compute.usage.cacheBody": {
								assertCacheKey(command.input.request.key, input);
								const row = readSessionCostUsageRollupBodyInDatabase(database.db, command.input.request);
								return row ? { blob: row.blob ? Uint8Array.from(row.blob) : null } : void 0;
							}
							case "session.compute.usage.refreshLock": return readSessionCostUsageRefreshLockInDatabase(database.db);
							case "session.compute.usage.writeRollup":
								assertCacheKey(command.input.request.rollupId, input);
								return cache.execute({
									type: "usageCache.writeRollup",
									input: command.input.request
								}, context);
							case "session.compute.usage.prune":
								command.input.request.forEach((row) => assertCacheKey(row.key, input));
								return cache.execute({
									type: "usageCache.prune",
									input: command.input.request
								}, context);
							case "session.compute.usage.acquireLock": return cache.execute({
								type: "usageCache.acquireLock",
								input: command.input.request
							}, context);
							case "session.compute.projection.claim":
							case "session.compute.projection.finalize": {
								const { request } = command.input;
								if (request.plan.sessionId !== input.sessionId) throw new Error("Incognito projection plan belongs to another transcript");
								const held = sourceFor(command.input, true);
								if (!held.source.isCurrentPlan(request.plan)) return context.writeTransaction(command.type === "session.compute.projection.claim" ? "sessions.transcript-index.claim" : "sessions.transcript-index.finalize", "Incognito projection", () => {
									admit("commit", keys);
									return command.type === "session.compute.projection.claim" ? false : { finalized: false };
								});
								if (command.type === "session.compute.projection.claim") {
									const claimed = executeProjection({
										type: "claim",
										input: request
									});
									if (claimed) held.claimId = request.claimId;
									return claimed;
								}
								if (held.claimId !== request.claimId) throw new Error("Incognito projection claim belongs to another source");
								return executeProjection({
									type: "finalize",
									input: request
								});
							}
							case "session.compute.projection.deleteChunk":
							case "session.compute.projection.appendChunk": {
								const { request } = command.input;
								if (sourceFor(command.input, true).claimId !== request.claimId || request.sessionId !== input.sessionId) throw new Error("Incognito projection chunk belongs to another transcript");
								return command.type === "session.compute.projection.deleteChunk" ? executeProjection({
									type: "deleteChunk",
									input: command.input.request
								}) : executeProjection({
									type: "appendChunk",
									input: command.input.request
								});
							}
						}
						throw new Error("Unsupported incognito compute operation");
					}),
					keys
				};
			} finally {
				projection?.assertSettled();
			}
		},
		assertSettled() {
			projection?.assertSettled();
		},
		close() {
			for (const { source } of sources.values()) source.clear();
			sources.clear();
			projection?.close();
		}
	};
}
//#endregion
//#region src/config/sessions/session-incognito-history-contract.ts
function isIncognitoHistoryCommand(command) {
	return command.type.startsWith("session.history.");
}
//#endregion
//#region src/config/sessions/session-incognito-history.worker.ts
function prepareHistoryRead(type, read) {
	return {
		type,
		read: (facts) => ({
			value: read(),
			facts
		})
	};
}
/** Reuse durable reader kernels on the actor's admitted connection, never its sentinel opener. */
function createIncognitoHistoryWorker(database, env) {
	let prepared;
	const prepare = async (command) => {
		const { sessionKey, sessionId, admission } = command.input;
		const target = {
			agentId: database.agentId,
			storePath: database.path,
			sessionKey,
			sessionId,
			env
		};
		const resolvedScope = {
			agentId: database.agentId,
			path: database.path,
			sessionKey,
			sessionId,
			env
		};
		const physical = {
			agentId: database.agentId,
			path: database.path
		};
		const selection = historySelection(command);
		if (selection) {
			prepared = prepareHistoryRead(command.type, () => runWithSessionTranscriptReadFence(admission, () => {
				const snapshot = readCurrentProjectionSnapshot(database, resolvedScope, (projection) => selectSessionTranscriptProjection(projection, selection, sessionKey));
				if (snapshot.kind === "unavailable") throw new SessionTranscriptProjectionUnavailableError(sessionId);
				return snapshot.value;
			}));
			return;
		}
		let request;
		switch (command.type) {
			case "session.history.title":
				request = {
					kind: "session-title-fields",
					database: physical,
					scope: target,
					admission,
					includeInterSession: command.input.includeInterSession
				};
				break;
			case "session.history.preview":
				request = {
					kind: "session-preview",
					database: physical,
					target,
					env,
					admission,
					maxItems: command.input.maxItems,
					maxChars: command.input.maxChars
				};
				break;
			case "session.history.branches":
				request = {
					kind: "branch-summaries",
					request: {
						database: physical,
						sessionKey,
						sessionId,
						lifecycleRevision: command.input.lifecycleRevision
					}
				};
				break;
			case "session.history.context":
				request = {
					kind: "model-context",
					target,
					admission,
					through: command.input.through,
					limits: command.input.limits
				};
				break;
			case "session.history.match":
				request = {
					kind: "transcript-match",
					database: physical,
					request: {
						target: resolvedScope,
						match: command.input.match
					}
				};
				break;
			case "session.history.search": {
				const { query, limit, match, role, order } = command.input;
				request = {
					kind: "transcript-search",
					database: physical,
					params: {
						...target,
						sessionKeys: [sessionKey],
						query,
						limit,
						match,
						role,
						order
					}
				};
				break;
			}
			case "session.history.watermark":
				request = {
					kind: "transcript-watermark",
					database: physical,
					scope: target
				};
				break;
			case "session.history.receipts":
				request = {
					kind: "session-pending-input-receipts",
					database: physical,
					...target,
					runIds: command.input.runIds
				};
				break;
			case "session.history.hydrate": {
				const { limits, maxEventBytes } = command.input;
				prepared = prepareHistoryRead(command.type, () => runWithSessionTranscriptReadFence(admission, () => limits ? {
					kind: "bounded",
					snapshot: readSessionTranscriptBoundedActiveContextCore(target, {
						...limits,
						readOnly: true,
						resolvedScope
					})
				} : {
					kind: "full",
					snapshot: loadTranscriptReadSnapshotSync({
						...target,
						maxEventBytes
					}, {
						readOnly: true,
						resolvedScope
					})
				}));
				return;
			}
			case "session.history.stats":
				prepared = prepareHistoryRead(command.type, () => readTranscriptStatsFromDatabase(database, sessionId));
				return;
			case "session.history.memory-entry": {
				const { projectSessionEntryRecord } = await import("./session-entry-projection-CZwfKxU5.mjs");
				prepared = prepareHistoryRead(command.type, () => runWithSessionTranscriptReadFence(admission, () => {
					const snapshot = readTranscriptExportSnapshotReadOnlySync(target, { projectEvent: projectSessionEntryRecord });
					if (!snapshot) throw new Error("Incognito actor transcript snapshot is unavailable");
					return snapshot;
				}));
				return;
			}
			case "session.history.memory-reset-recall": {
				const { readSessionResetRecallCutoffInProcess } = await import("./session-reset-recall-read-Cz3ySfUf.mjs");
				prepared = prepareHistoryRead(command.type, () => runWithSessionTranscriptReadFence(admission, () => readSessionResetRecallCutoffInProcess(target)));
				return;
			}
			case "session.history.native-context":
			case "session.history.native-context-current": {
				const { readSessionTranscriptContextMessages, validateSessionTranscriptContextAdmission, validateSessionTranscriptContextVersion } = await import("./session-accessor.sqlite-model-context-PafSfNaJ.mjs");
				prepared = prepareHistoryRead(command.type, () => runWithSessionTranscriptReadFence(admission, () => {
					try {
						if (command.type === "session.history.native-context-current") {
							if (admission) validateSessionTranscriptContextAdmission(target, admission);
							else validateSessionTranscriptContextVersion(target, command.input.version);
							return {
								ok: true,
								value: void 0
							};
						}
						return {
							ok: true,
							value: readSessionTranscriptContextMessages(target, (messages, header, version) => ({
								messages: [...messages],
								header,
								version
							}))
						};
					} catch (error) {
						if (error instanceof SessionTranscriptReadFenceError) return {
							ok: false,
							message: error.message
						};
						throw error;
					}
				}));
				return;
			}
			default: throw new Error("Unsupported incognito history operation");
		}
		const read = await prepareSessionHistoryReadOperation(request, database);
		prepared = prepareHistoryRead(command.type, read);
	};
	return {
		prepare,
		execute(command, facts) {
			const target = command.input;
			const entry = readExactSessionEntryRow(database, target.sessionKey)?.entry;
			if (!entry || entry.sessionId !== target.sessionId || entry.lifecycleRevision !== target.lifecycleRevision) throw new Error("Incognito history session generation is no longer current");
			if (!prepared || prepared.type !== command.type) throw new Error("Incognito history read was not prepared");
			try {
				return prepared.read(facts);
			} finally {
				prepared = void 0;
			}
		},
		assertSettled() {
			prepared = void 0;
		}
	};
}
function historySelection(command) {
	switch (command.type) {
		case "session.history.delta": return {
			kind: "delta",
			options: command.input.options
		};
		case "session.history.count": return { kind: "count" };
		case "session.history.recent": return {
			kind: "recent",
			options: command.input.options
		};
		case "session.history.page": return {
			kind: "page",
			options: command.input.options
		};
		case "session.history.around-id": return {
			kind: "around-id",
			options: command.input.options
		};
		case "session.history.source": return {
			kind: "source",
			options: command.input.options
		};
		case "session.history.by-id": return {
			kind: "by-id",
			messageId: command.input.messageId,
			options: command.input.options
		};
		case "session.history.lookup": return {
			kind: "lookup",
			messageId: command.input.messageId
		};
		default: return;
	}
}
//#endregion
//#region src/config/sessions/session-incognito-lifecycle.worker.ts
/** Uses the admitted actor connection; archive materialization is never an incognito operation. */
function createIncognitoLifecycleWorker(database, identity, env, admit) {
	const databaseOptions = {
		agentId: database.agentId,
		path: database.path,
		env
	};
	const assertEntry = (target) => {
		const entry = readExactSessionEntryRow(database, target.sessionKey)?.entry;
		if (!sqliteSessionEntriesEqual(entry, target.entry)) throw new Error("Incognito lifecycle session changed before mutation");
		return target.entry;
	};
	const materialize = (plans, reason) => plans.map((plan) => {
		if (plan.agentId !== database.agentId || plan.databasePath !== database.path || plan.archiveTranscript) throw new Error("Incognito reclamation cannot change its actor or create an archive");
		return {
			...plan,
			reason: reason ?? plan.reason,
			archive: null,
			archivedTranscript: null
		};
	});
	const write = (keys, operation) => withSqlitePostCommitPublications(database.db, () => runOpenClawAgentWriteTransaction((current) => {
		if (current.db !== database.db) throw new Error("Incognito lifecycle lost its native owner");
		admit("transaction", keys);
		const value = operation();
		admit("commit", keys);
		return value;
	}, databaseOptions, { operationLabel: "session.incognito.lifecycle" }));
	return { execute(command) {
		const keys = incognitoLifecycleKeys(command, identity);
		switch (command.type) {
			case "session.lifecycle.delete": {
				const { target, reason, admissionIdentities } = command.input;
				assertEntry(target);
				const deleteParams = {
					storePath: database.path,
					target: {
						canonicalKey: target.sessionKey,
						storeKeys: [target.sessionKey]
					},
					expectedEntry: target.entry,
					archiveTranscript: false,
					deleteTranscriptWithoutArchive: true,
					deleteDeliveryArtifacts: true
				};
				const planned = prepareSessionDeletionInDatabase(database, {
					operation: "entry",
					input: {
						deleteParams,
						archiveDirectory: "",
						admissionIdentities,
						allowLockedEntryRemoval: false
					}
				});
				if (planned.operation !== "entry" || planned.value.kind !== "ready") throw new Error("Incognito deletion lost its prepared session");
				const prepared = planned.value.value;
				const plans = [...prepared.entryPlans];
				for (const sessionId of prepared.historicalGenerationIds) {
					const history = prepareSessionDeletionInDatabase(database, {
						operation: "history",
						input: {
							validation: {
								deleteParams,
								preparedTargetSnapshot: prepared.targetSnapshot,
								scope: {
									kind: "historical-generation",
									phase: "plan",
									sessionId
								}
							},
							sessionId,
							admissionIdentities,
							archiveDirectory: "",
							archiveTranscript: false
						}
					});
					if (history.operation !== "history" || history.value.kind === "expected-entry-mismatch") throw new Error("Incognito history changed before deletion");
					if (history.value.kind === "ready") plans.push(history.value.plan);
				}
				const materializedPlans = materialize(plans, reason);
				return {
					value: write(keys, () => {
						assertEntry(target);
						const result = reclaimSqliteSessionInTransaction({
							kind: "entry",
							databaseOptions,
							deleteParams,
							preparedTargetSnapshot: prepared.targetSnapshot,
							materializedPlans
						});
						if (result.kind !== "entry" || !result.value.deleted) throw new Error("Incognito deletion did not remove its checked session");
						return result.value;
					}),
					keys
				};
			}
			case "session.lifecycle.reclaim.prepare": {
				const value = planSessionLifecycleArtifactCleanup(database, {
					...command.input,
					agentId: database.agentId,
					archiveDirectory: "",
					archiveRemovedEntryTranscripts: false
				});
				return {
					value: {
						...value,
						identity
					},
					keys: value.entries.map(({ sessionKey }) => sessionKey)
				};
			}
			case "session.lifecycle.reclaim": {
				const { plan } = command.input;
				if (!isDeepStrictEqual(plan.identity, identity)) throw new Error("Incognito reclamation belongs to another actor");
				const materializedPlans = materialize(plan.deletePlans);
				return {
					value: write(keys, () => {
						const result = reclaimSqliteSessionInTransaction({
							kind: "lifecycle-artifacts",
							agentId: database.agentId,
							databaseOptions,
							entries: plan.entries,
							materializedPlans
						});
						if (result.kind !== "lifecycle-artifacts") throw new Error("Incognito reclamation returned another operation");
						return result.value;
					}),
					keys
				};
			}
			case "session.lifecycle.fork.prepare": {
				const { parent, forkFrom } = command.input;
				const entry = assertEntry(parent);
				assertModelSelectionUnlocked(entry, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
				const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(database, entry.sessionId), forkFrom);
				return {
					value: source ? {
						...parent,
						identity,
						source,
						version: readTranscriptContextVersionInTransaction(database, entry.sessionId),
						parentSessionFile: formatLegacySqliteSessionMarkerForScope({
							...databaseOptions,
							sessionKey: parent.sessionKey,
							sessionId: entry.sessionId
						})
					} : void 0,
					keys
				};
			}
			case "session.lifecycle.fork": {
				const { parent, child } = command.input;
				if (parent.sessionKey === child.sessionKey || parent.entry.sessionId === child.entry.sessionId) throw new Error("Incognito fork requires a distinct child session");
				const events = buildForkedChildTranscriptEvents({
					parentSessionFile: parent.parentSessionFile,
					source: parent.source,
					targetSessionId: child.entry.sessionId
				});
				return {
					value: write(keys, () => {
						if (isDeepStrictEqual(parent.identity, identity)) {
							assertEntry(parent);
							const version = readTranscriptContextVersionInTransaction(database, parent.entry.sessionId);
							if (!isDeepStrictEqual({ ...version }, { ...parent.version })) throw new Error("Incognito fork source transcript changed before mutation");
						}
						const previous = readExactSessionEntryRow(database, child.sessionKey)?.entry;
						if (!sqliteSessionEntriesEqual(previous, child.expectedEntry)) throw new Error("Incognito fork child changed before mutation");
						const entry = writeSessionEntry(database, child.sessionKey, {
							...child.entry,
							incognito: true,
							forkSource: {
								sessionKey: parent.sessionKey,
								sessionId: parent.entry.sessionId
							},
							forkedFromParent: true,
							lifecycleRunId: void 0,
							lastRunId: void 0,
							totalTokens: void 0,
							totalTokensFresh: false,
							totalTokensVersion: void 0,
							cliSessionBindings: command.input.cliSessionBindings,
							cliSessionIds: void 0,
							claudeCliSessionId: void 0
						}, { previousEntry: previous ?? null });
						appendTranscriptEventsInTransaction(database, {
							...databaseOptions,
							sessionKey: child.sessionKey,
							sessionId: entry.sessionId
						}, events);
						return entry;
					}),
					keys
				};
			}
		}
		throw new Error("Unsupported incognito lifecycle operation");
	} };
}
//#endregion
//#region src/config/sessions/session-incognito-outbox-contract.ts
const commandTypes = /* @__PURE__ */ new Set([
	"session.outbox.prepareRun",
	"session.outbox.listPendingSessions",
	"session.outbox.readNextPending",
	"session.outbox.complete",
	"session.outbox.recordFailure",
	"session.outbox.hasPending",
	"session.outbox.enqueueIntent",
	"session.outbox.acceptIntent",
	"session.outbox.publishClosedTurn",
	"session.outbox.discardIntent"
]);
function isIncognitoOutboxCommand(command) {
	return commandTypes.has(command.type);
}
//#endregion
//#region src/config/sessions/session-incognito-outbox.worker.ts
/** The existing outbox domain owns all transitions on the actor's retained connection. */
function createIncognitoOutboxWorker(database, admit) {
	let active;
	const validateTarget = (command) => {
		const { sessionKey, sessionId } = command.input;
		const entry = readExactSessionEntryRow(database, sessionKey)?.entry;
		if (!entry || entry.sessionId !== sessionId) throw new Error("Incognito outbox session generation is no longer current");
		const assertAnchor = (anchor) => {
			if (anchor.agentId !== database.agentId || anchor.storePath !== database.path || anchor.sessionKey !== sessionKey || anchor.sessionId !== sessionId) throw new Error("Incognito outbox anchor belongs to another session");
		};
		let advancementKey;
		switch (command.type) {
			case "session.outbox.acceptIntent":
			case "session.outbox.publishClosedTurn":
				assertAnchor(command.input.boundary.admission);
				assertAnchor(command.input.boundary.terminal);
				advancementKey = command.input.boundary.admission.logicalTurnId;
				break;
			case "session.outbox.prepareRun":
			case "session.outbox.enqueueIntent":
			case "session.outbox.discardIntent":
				if (command.input.admission) {
					assertAnchor(command.input.admission);
					advancementKey = command.input.admission.logicalTurnId;
				}
				break;
			case "session.outbox.complete":
			case "session.outbox.recordFailure": advancementKey = command.input.advancementKey;
		}
		if (advancementKey !== void 0) {
			const row = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("context_engine_turn_outbox").select("session_id").where("advancement_key", "=", advancementKey));
			if (row && row.session_id !== sessionId) throw new Error("Incognito outbox advancement belongs to another session");
		}
	};
	const domain = createAgentDatabaseDomainOwner({
		databasePath: database.path,
		assertCurrent: () => database.db,
		assertCleanupCurrent() {},
		admit(stage) {
			if (!active) throw new Error("Incognito outbox has no admitted command");
			validateTarget(active);
			admit(stage, [active.input.sessionKey]);
		}
	});
	let binding;
	return {
		async prepare(_command) {
			binding = {
				id: randomUUID(),
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.contextEngineTurnOutbox).href,
				input: void 0
			};
			await domain.prepare({
				type: "database.domain.bind",
				input: binding
			});
		},
		execute(command) {
			const bound = binding;
			if (!bound) throw new Error("Incognito outbox domain was not prepared");
			const executeDomain = (inner) => {
				return {
					value: domain.execute({
						type: "database.domain.execute",
						input: {
							id: bound.id,
							command: inner
						}
					}),
					keys: [command.input.sessionKey]
				};
			};
			active = command;
			try {
				domain.execute({
					type: "database.domain.bind",
					input: bound
				});
				return withSqlitePostCommitPublications(database.db, () => {
					switch (command.type) {
						case "session.outbox.prepareRun": return executeDomain({
							type: "prepareRun",
							input: command.input
						});
						case "session.outbox.listPendingSessions": return executeDomain({
							type: "listPendingSessions",
							input: command.input
						});
						case "session.outbox.readNextPending": return executeDomain({
							type: "readNextPending",
							input: command.input
						});
						case "session.outbox.complete": return executeDomain({
							type: "complete",
							input: command.input
						});
						case "session.outbox.recordFailure": return executeDomain({
							type: "recordFailure",
							input: command.input
						});
						case "session.outbox.hasPending": return executeDomain({
							type: "hasPending",
							input: command.input
						});
						case "session.outbox.enqueueIntent": return executeDomain({
							type: "enqueueIntent",
							input: command.input
						});
						case "session.outbox.acceptIntent": return executeDomain({
							type: "acceptIntent",
							input: command.input
						});
						case "session.outbox.publishClosedTurn": return executeDomain({
							type: "publishClosedTurn",
							input: command.input
						});
						case "session.outbox.discardIntent": return executeDomain({
							type: "discardIntent",
							input: command.input
						});
					}
					throw new Error("Unsupported incognito outbox operation");
				});
			} finally {
				domain.assertSettled();
				domain.execute({
					type: "database.domain.close",
					input: { id: bound.id }
				});
				binding = void 0;
				active = void 0;
			}
		},
		assertSettled() {
			domain.assertSettled();
			binding = void 0;
			active = void 0;
		},
		close: () => domain.close()
	};
}
//#endregion
//#region src/config/sessions/session-incognito-side-data.worker.ts
/** Adapters borrow the actor connection; domain kernels still own their transactions. */
function createIncognitoSideDataWorker(database, env, admit) {
	let keys = [];
	const domain = createAgentDatabaseDomainOwner({
		databasePath: database.path,
		assertCurrent: () => database.db,
		assertCleanupCurrent() {},
		admit: (stage) => admit(stage, keys)
	});
	let binding;
	const reactions = createWorkerOperationRegistry({ "session.reaction.set": loadAgentReactionOperations });
	const scope = (sessionKey) => ({
		agentId: database.agentId,
		storePath: database.path,
		sessionKey,
		env
	});
	const context = {
		open: () => database,
		options: {
			agentId: database.agentId,
			path: database.path,
			env
		},
		admit: (stage) => admit(stage, keys),
		writeTransaction: (operationLabel, _owner, write) => runOpenClawAgentWriteTransaction((current) => {
			if (current.db !== database.db) throw new Error("Incognito reaction lost its native owner");
			admit("transaction", keys);
			return write(current);
		}, {
			agentId: database.agentId,
			path: database.path,
			env
		}, { operationLabel })
	};
	return {
		async prepare(command) {
			const module = command.type.startsWith("session.sharing.") || command.type === "session.category.apply" ? runtimeProcessEntrypoints.sessionSharingStore : command.type.startsWith("session.heartbeat.") ? runtimeProcessEntrypoints.heartbeatOutcomeStore : void 0;
			if (module) {
				binding = {
					id: randomUUID(),
					moduleUrl: resolveRuntimeWorkerUrl(module).href,
					input: void 0
				};
				await domain.prepare({
					type: "database.domain.bind",
					input: binding
				});
			}
			await reactions.prepare(command.type);
		},
		execute(command, selectedKeys) {
			keys = selectedKeys;
			const bound = binding;
			const executeDomain = (inner) => {
				if (!bound) throw new Error("Incognito side-data domain was not prepared");
				return domain.execute({
					type: "database.domain.execute",
					input: {
						id: bound.id,
						command: inner
					}
				});
			};
			try {
				if (bound) domain.execute({
					type: "database.domain.bind",
					input: bound
				});
				return {
					value: withSqlitePostCommitPublications(database.db, () => {
						switch (command.type) {
							case "session.sharing.add": return executeDomain({
								type: "add",
								input: {
									...command.input,
									scope: scope(command.input.sessionKey)
								}
							});
							case "session.sharing.remove": return executeDomain({
								type: "remove",
								input: {
									...command.input,
									scope: scope(command.input.sessionKey)
								}
							});
							case "session.sharing.participant": return executeDomain({
								type: "participant",
								input: {
									...command.input,
									scope: scope(command.input.sessionKey)
								}
							});
							case "session.category.apply": {
								const input = {
									...command.input,
									scope: scope("")
								};
								keys = executeDomain({
									type: "category.prepare",
									input
								});
								return executeDomain({
									type: "category.apply",
									input
								});
							}
							case "session.heartbeat.persist": return executeDomain({
								type: "persist",
								input: command.input
							});
							case "session.heartbeat.claim": return executeDomain({
								type: "claim",
								input: command.input
							});
							case "session.reaction.set": return reactions.execute(command, context);
							case "session.category.keys": return readSessionGroupCategoryKeys(database, command.input.name);
							case "session.members.read": return listSessionMembersInDatabase(database, command.input.sessionKey);
							case "session.participants.read": return participantRecordsBySessionKey(database.db, keys).get(command.input.sessionKey) ?? [];
							case "session.catalog.read": {
								const rows = readSessionMembershipRowsInDatabase(database, command.input.sessionKeys);
								keys = rows.map(([key]) => key);
								return rows;
							}
							case "session.reactions.read": return listSessionReactionsInDatabase(database, command.input.sessionKey, command.input);
							case "session.progressCard.get": return readSessionProgressCard(database.db, command.input.sessionKey);
						}
						throw new Error("Unsupported incognito side-data operation");
					}),
					keys
				};
			} finally {
				if (bound) {
					domain.assertSettled();
					domain.execute({
						type: "database.domain.close",
						input: { id: bound.id }
					});
					binding = void 0;
				}
			}
		},
		assertSettled() {
			domain.assertSettled();
			binding = void 0;
		},
		close: () => domain.close()
	};
}
//#endregion
//#region src/config/sessions/session-incognito-transcript.worker.ts
/** Report preparation is detached; every append rebinds and validates its captured revision. */
function createIncognitoTranscriptWorker(database, env, admit) {
	let keys = [];
	const domain = createAgentDatabaseDomainOwner({
		databasePath: database.path,
		assertCurrent: () => database.db,
		assertCleanupCurrent() {},
		admit: (stage) => admit(stage, keys)
	});
	let binding;
	const resolved = (input) => ({
		agentId: database.agentId,
		path: database.path,
		sessionKey: input.sessionKey,
		sessionId: input.sessionId,
		env
	});
	const write = (operation) => runOpenClawAgentWriteTransaction((current) => {
		if (current.db !== database.db) throw new Error("Incognito transcript lost its native owner");
		admit("transaction", keys);
		const result = operation();
		admit("commit", keys);
		return result;
	}, {
		agentId: database.agentId,
		path: database.path,
		env
	}, { operationLabel: "session.incognito.transcript" });
	return {
		async prepare(command) {
			if (command.type.startsWith("session.report.")) {
				binding = {
					id: randomUUID(),
					moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptReports).href,
					input: {
						resolved: resolved(command.input),
						fence: command.input.fence
					}
				};
				await domain.prepare({
					type: "database.domain.bind",
					input: binding
				});
			}
		},
		execute(command) {
			keys = [command.input.sessionKey];
			const bound = binding;
			const executeReport = (inner) => {
				if (!bound) throw new Error("Incognito report domain was not prepared");
				return domain.execute({
					type: "database.domain.execute",
					input: {
						id: bound.id,
						command: inner
					}
				});
			};
			try {
				if (bound) runWithSqliteWorkerStateContext({ environment: env }, () => domain.execute({
					type: "database.domain.bind",
					input: bound
				}));
				const reply = (value) => ({
					value,
					keys
				});
				return withSqlitePostCommitPublications(database.db, () => {
					const target = resolved(command.input);
					switch (command.type) {
						case "session.report.latestCustomReport": {
							const result = executeReport({
								type: "prepare",
								input: {
									kind: "custom",
									customTypes: command.input.customTypes
								}
							});
							return reply(result.ok ? ok(result.value.latest) : result);
						}
						case "session.report.prepare": {
							const result = executeReport({
								type: "prepare",
								input: command.input.selection
							});
							return reply(result.ok ? ok({
								facts: result.value,
								prepared: {
									selection: command.input.selection,
									version: readTranscriptContextVersionInTransaction(database, target.sessionId)
								}
							}) : result);
						}
						case "session.report.append": {
							const prepared = executeReport({
								type: "prepare",
								input: command.input.prepared.selection
							});
							const version = readTranscriptContextVersionInTransaction(database, target.sessionId);
							const expected = command.input.prepared.version;
							if (!prepared.ok || prepared.value.suppressed || version.generation !== expected.generation || version.rawSeq !== expected.rawSeq || version.updatedAt !== expected.updatedAt) return reply(write(() => prepared.ok ? ok({
								committed: false,
								projectionNeedsReconcile: false
							}) : prepared));
							return reply(executeReport({
								type: "append",
								input: command.input.report
							}));
						}
						case "session.report.assistant": return reply(executeReport({
							type: "assistant",
							input: command.input.report
						}));
						case "session.report.abortedPartial": return reply(executeReport({
							type: "abortedPartial",
							input: command.input.report
						}));
						case "session.message.append": return reply(write(() => {
							const refusal = resolveTranscriptAppendRefusal(readExactSessionEntryRow(database, target.sessionKey)?.entry, target, {
								...target,
								...command.input.fence
							});
							if (refusal) return err(refusal);
							let projectionNeedsReconcile = false;
							const append = appendTranscriptMessageInTransaction(database, target, {
								message: command.input.message,
								parentId: command.input.parentId
							}, void 0, {
								scheduleProjectionReconcile: false,
								onProjectionReconcileNeeded: () => {
									projectionNeedsReconcile = true;
								}
							});
							return ok({
								append,
								projectionNeedsReconcile
							});
						}));
						case "session.turn.read": {
							for (const anchor of [command.input.boundary.admission, command.input.boundary.terminal]) if (anchor.agentId !== database.agentId || anchor.storePath !== database.path || anchor.sessionKey !== target.sessionKey || anchor.sessionId !== target.sessionId) throw new Error("Incognito transcript turn changed its actor target");
							const refusal = resolveTranscriptAppendRefusal(readExactSessionEntryRow(database, target.sessionKey)?.entry, target, {
								...target,
								...command.input.fence
							});
							return reply(refusal ? { kind: "session-rebound" } : readClosedTranscriptTurnInDatabase(database.db, command.input));
						}
					}
					throw new Error("Unsupported incognito transcript operation");
				});
			} finally {
				if (bound) {
					domain.assertSettled();
					domain.execute({
						type: "database.domain.close",
						input: { id: bound.id }
					});
					binding = void 0;
				}
			}
		},
		assertSettled() {
			domain.assertSettled();
			binding = void 0;
		},
		close: () => domain.close()
	};
}
//#endregion
//#region src/config/sessions/session-incognito.worker.ts
/** Connection-bound kernels: no namespace lookup, second connection, or shared-state write. */
function createIncognitoSessionWorker(database, identity, env) {
	let revision = 0;
	const read = (sessionKey) => {
		const entry = readExactSessionEntryRow(database, sessionKey)?.entry;
		return {
			entry,
			facts: [{
				identity,
				sessionKey,
				revision,
				sharing: entry ? {
					entry: projectSessionSharingEntry(entry),
					membership: new Set(listSessionMembersInDatabase(database, sessionKey).map((member) => member.identityId))
				} : void 0,
				expiresAt: entry ? resolveIncognitoSessionExpiresAt(entry) : void 0
			}]
		};
	};
	const assertKey = (sessionKey) => {
		assertCanonicalSessionKeyWrite(sessionKey, database.agentId);
		if (!isIncognitoSessionKey(sessionKey)) throw new Error("Incognito actor requires an incognito session key");
	};
	const admit = (stage, keys) => {
		keys.forEach(assertKey);
		const facts = keys.flatMap((key) => read(key).facts);
		if (stage === "commit") {
			const nextRevision = revision + 1;
			facts.forEach((fact) => {
				fact.revision = nextRevision;
			});
			stageSqliteTransactionState(database.db, {
				stage() {},
				rollback() {},
				commit() {
					revision = nextRevision;
				}
			});
			deferSqliteWorkerCommitReceipt(database.db, facts);
		}
		requestSqliteWorkerOperationAdmission({
			stage,
			facts: {
				identity,
				sessions: facts
			}
		});
	};
	const sideData = createIncognitoSideDataWorker(database, env, admit);
	const transcript = createIncognitoTranscriptWorker(database, env, admit);
	const outbox = createIncognitoOutboxWorker(database, admit);
	const lifecycle = createIncognitoLifecycleWorker(database, identity, env, admit);
	const history = createIncognitoHistoryWorker(database, env);
	const compute = createIncognitoComputeWorker(database, env, admit);
	const readOnly = (operation) => {
		database.db.exec("PRAGMA query_only = ON");
		try {
			return runSqliteReadOperationSync(database.db, operation);
		} finally {
			database.db.exec("PRAGMA query_only = OFF");
		}
	};
	return {
		async prepare(command) {
			if (isIncognitoComputeCommand(command)) await compute.prepare(command);
			else if (isIncognitoHistoryCommand(command)) await history.prepare(command);
			else if (isIncognitoTranscriptCommand(command)) await transcript.prepare(command);
			else if (isIncognitoOutboxCommand(command)) await outbox.prepare(command);
			else if (!isIncognitoLifecycleCommand(command) && command.type !== "session.entry.create" && command.type !== "session.entry.read") await sideData.prepare(command);
		},
		execute(command) {
			if (isIncognitoComputeCommand(command)) {
				assertKey(command.input.sessionKey);
				const execute = () => {
					const { value, keys } = compute.execute(command);
					return {
						value,
						facts: keys.flatMap((key) => read(key).facts)
					};
				};
				if (isIncognitoComputeWrite(command.type)) return execute();
				return readOnly(() => {
					const facts = read(command.input.sessionKey).facts;
					requestSqliteWorkerOperationAdmission({
						stage: "prepare",
						facts: {
							identity,
							sessions: facts
						}
					});
					return execute();
				});
			}
			if (isIncognitoHistoryCommand(command)) {
				assertKey(command.input.sessionKey);
				return readOnly(() => {
					const facts = read(command.input.sessionKey).facts;
					requestSqliteWorkerOperationAdmission({
						stage: "prepare",
						facts: {
							identity,
							sessions: facts
						}
					});
					return history.execute(command, facts);
				});
			}
			if (isIncognitoLifecycleCommand(command)) {
				incognitoLifecycleKeys(command, identity).forEach(assertKey);
				const execute = () => {
					const { value, keys } = lifecycle.execute(command);
					keys.forEach(assertKey);
					return {
						value,
						facts: keys.flatMap((key) => read(key).facts)
					};
				};
				return isIncognitoLifecycleWrite(command.type) ? execute() : readOnly(execute);
			}
			if (isIncognitoTranscriptCommand(command) || isIncognitoOutboxCommand(command)) {
				assertKey(command.input.sessionKey);
				const execute = () => {
					const { keys, ...result } = isIncognitoTranscriptCommand(command) ? transcript.execute(command) : outbox.execute(command);
					return {
						...result,
						facts: keys.flatMap((key) => read(key).facts)
					};
				};
				return isIncognitoTranscriptCommand(command) && !isIncognitoTranscriptWrite(command.type) ? readOnly(execute) : execute();
			}
			if (command.type !== "session.entry.create" && command.type !== "session.entry.read") {
				const keys = incognitoSideDataKeys(command);
				keys.forEach(assertKey);
				const execute = () => {
					const result = sideData.execute(command, keys);
					return {
						value: result.value,
						facts: result.keys.flatMap((key) => read(key).facts)
					};
				};
				return isIncognitoSideDataWrite(command.type) ? execute() : readOnly(execute);
			}
			const { sessionKey } = command.input;
			assertKey(sessionKey);
			if (command.type === "session.entry.read") return readOnly(() => {
				const snapshot = read(sessionKey);
				const expected = command.input.expected;
				if (expected && (snapshot.entry?.sessionId !== expected.sessionId || snapshot.entry.lifecycleRevision !== expected.lifecycleRevision)) throw new Error("Incognito session generation is no longer current");
				return snapshot;
			});
			const result = runOpenClawAgentWriteTransaction((current) => {
				if (current.db !== database.db) throw new Error("Incognito creation lost its native owner");
				const before = read(sessionKey);
				admit("transaction", [sessionKey]);
				if (before.entry) {
					if (before.entry.sessionId !== command.input.entry.sessionId || before.entry.lifecycleRevision !== command.input.entry.lifecycleRevision) throw new Error("Incognito session already exists with another generation");
				} else {
					assertSessionCreationLabelAvailable(database, sessionKey, command.input.entry.label);
					const entry = writeSessionEntry(database, sessionKey, {
						...command.input.entry,
						incognito: true
					});
					ensureTranscriptHeader(database, {
						agentId: database.agentId,
						path: database.path,
						sessionKey,
						sessionId: entry.sessionId
					}, command.input.cwd);
				}
				admit("commit", [sessionKey]);
				return read(sessionKey);
			}, {
				agentId: database.agentId,
				path: database.path,
				env
			}, { operationLabel: "session.entry.create-with-transcript" });
			result.facts.forEach((fact) => {
				fact.revision = revision;
			});
			return result;
		},
		assertSettled() {
			compute.assertSettled();
			history.assertSettled();
			sideData.assertSettled();
			transcript.assertSettled();
			outbox.assertSettled();
		},
		close() {
			compute.close();
			sideData.close();
			transcript.close();
			outbox.close();
		}
	};
}
//#endregion
export { createIncognitoSessionWorker };
