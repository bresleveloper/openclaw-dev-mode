import { r as cloneEnvWithPlatformSemantics } from "../../config-env-vars-BHneg24Q.mjs";
import { c as withSqliteReaderOwner } from "../../sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { r as decodeAgentDatabaseReaderRequest } from "../../agent-database-readers-DSwi8tar.mjs";
import { a as sessionHistoryCleanupError, i as encodeSessionTranscriptWorkerError, r as encodeSessionTranscriptRequestError } from "../../session-history-worker-errors-D75quOgT.mjs";
import { r as withSessionTranscriptProjectionReceipt } from "../../session-transcript-projection-facts-scope-Cx0-0Ubn.mjs";
import { t as serveOwnedWorkerTasks } from "../../worker-task-server-sMsYUF1K.mjs";
//#region src/config/sessions/session-transcript-worker-scopes.ts
const MAX_RETAINED_HISTORY_DATABASES = 64;
const historyDatabaseScopes = /* @__PURE__ */ new Map();
async function withHistoryDatabase(database, operationLabel, operation, validation) {
	const key = JSON.stringify(database);
	let retained = historyDatabaseScopes.get(key);
	if (!retained) {
		const { OpenClawAgentDatabaseReadOnlyScope } = await import("../../openclaw-agent-db-readonly-scope-Bbk34iwF.mjs");
		retained = {
			database,
			scope: new OpenClawAgentDatabaseReadOnlyScope()
		};
	}
	const { scope } = retained;
	try {
		const value = await withSqliteReaderOwner({
			operation: `sessions.${operationLabel}`,
			ownerKind: "worker"
		}, () => scope.run({
			...database,
			validation
		}, operation));
		historyDatabaseScopes.delete(key);
		if (!scope.hasRetainedConnection) return {
			ok: true,
			value,
			closedHistoryDatabase: database
		};
		historyDatabaseScopes.set(key, retained);
		if (historyDatabaseScopes.size > MAX_RETAINED_HISTORY_DATABASES) {
			const oldest = historyDatabaseScopes.entries().next().value;
			oldest[1].scope.close();
			historyDatabaseScopes.delete(oldest[0]);
			return {
				ok: true,
				value,
				closedHistoryDatabase: oldest[1].database
			};
		}
		return {
			ok: true,
			value
		};
	} catch (error) {
		try {
			scope.close();
		} catch (cleanupError) {
			throw sessionHistoryCleanupError(error, cleanupError, "database close");
		}
		throw error;
	}
}
function pruneClosedHistoryDatabaseScopes() {
	for (const [identity, retained] of historyDatabaseScopes) if (!retained.scope.hasRetainedConnection) historyDatabaseScopes.delete(identity);
}
//#endregion
//#region src/config/sessions/session-transcript.worker.ts
let releaseReadValidation;
serveOwnedWorkerTasks(async (input, channel, control) => {
	releaseReadValidation ??= (await import("../../openclaw-agent-db-validation-cache-BhYMGMni.mjs")).releaseOpenClawAgentDatabaseReadValidation;
	const request = input;
	if (request.kind === "cli-process-history") {
		if (!channel) throw new Error("Process-held history requires its host reader channel");
		const { readProcessHeldCliHistoryInWorker } = await import("../../cli-session-history.process-held-BbKL5hkR.mjs");
		return {
			ok: true,
			value: await readProcessHeldCliHistoryInWorker(request.request, channel)
		};
	}
	if (request.kind === "sqlite-target") {
		const { resolveSqliteTargetFromSessionStorePath } = await import("../../session-sqlite-target-CNVqHS9w.mjs");
		return {
			ok: true,
			value: { target: resolveSqliteTargetFromSessionStorePath(request.storePath, request) }
		};
	}
	if (request.kind === "usage-cost") {
		const { executeUsageCostWorker, usageCostWorkerFailure } = await import("../../session-cost-usage-worker-DS1s9VXj.mjs");
		try {
			if (!channel) throw new Error("Usage cost worker requires its host channel");
			const closed = /* @__PURE__ */ new Map();
			return {
				ok: true,
				value: await executeUsageCostWorker(request, channel, control, async (database, read) => {
					closed.delete(JSON.stringify(database));
					const result = await withHistoryDatabase(database, request.kind, read);
					if (result.closedHistoryDatabase) closed.set(JSON.stringify(result.closedHistoryDatabase), result.closedHistoryDatabase);
					return result.value;
				}),
				closedDatabases: [...closed.values()]
			};
		} catch (error) {
			return usageCostWorkerFailure(error);
		}
	}
	const [{ isSessionHistoryReadOperation, prepareSessionHistoryReadOperation }, { runWithSessionTranscriptReadFence }] = await Promise.all([import("../../session-history-read-operation.worker-BCRNP7Us.mjs"), import("../../session-transcript-read-fence-CgU0nt8y.mjs")]);
	const readRequest = async () => {
		if (request.kind === "transcript-search") {
			if (!channel) throw new Error("Transcript search requires its host status channel");
			const { searchSessionTranscriptsReadOnlySync } = await import("../../session-transcript-search-62wA7DV0.mjs");
			const options = {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.params.env ?? process.env)
			};
			const { found, ...result } = searchSessionTranscriptsReadOnlySync(request.params, options);
			let indexing = false;
			if (found) {
				const status = await channel.request("transcript-index-status");
				try {
					if (typeof status.input !== "boolean") throw new Error("Invalid transcript search index status");
					indexing = status.input;
				} finally {
					status.consumed();
				}
			}
			return {
				kind: request.kind,
				result: {
					...result,
					indexing
				}
			};
		}
		if (isSessionHistoryReadOperation(request)) return (await prepareSessionHistoryReadOperation(request))();
		if (request.kind === "session-cleanup") {
			const { readSessionCleanupSnapshot } = await import("../../cleanup-service-read.worker-BDpwyu23.mjs");
			return readSessionCleanupSnapshot(request);
		}
		if (request.kind === "lifecycle-artifact-plan") {
			const { readSessionLifecycleArtifactCleanup } = await import("../../session-accessor.sqlite-lifecycle-artifacts-Lk6Ml-Nb.mjs");
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionLifecycleArtifactCleanup(database, request.input, request.expectedSource), {
				...request.database,
				env: request.env
			});
			return {
				kind: request.kind,
				plan: result.found ? result.value : {
					entries: [],
					deletePlans: []
				},
				diagnostics: request.input.diagnostics
			};
		}
		if (request.kind === "prewarm") {
			if (request.history) await Promise.all([
				import("../../session-history-worker-reader-gLdgKYFE.mjs"),
				import("../../chat-history-page-kernel-DajE3kom.mjs"),
				import("../../chat-history-response-page-TPj-5Xyi.mjs"),
				import("../../session-history-snapshot-lB-qzyYG.mjs")
			]);
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const opened = withOpenClawAgentDatabaseReadOnly(() => void 0, {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.env)
			});
			if (!opened.found && opened.reason !== "database-missing") throw new Error(`Session history prewarm admission unavailable: ${opened.reason}`);
			return { kind: "prewarm" };
		}
		if (request.kind === "historical-eviction-candidates") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { runSqliteDeferredTransactionSync } = await import("../../sqlite-transaction-DwC_Ee5i.mjs");
			const { readHistoricalSessionIdsInDatabase, readDiskEvictableArchivedSessionBatchInDatabase } = await import("../../session-history-eviction-candidates-XW9wwteJ.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => "archived" in request ? { batch: readDiskEvictableArchivedSessionBatchInDatabase(database, request.archived) } : { sessionIds: readHistoricalSessionIdsInDatabase({
				...request,
				database
			}) }), {
				...request.database,
				env: request.env
			});
			if (!result.found) {
				if ("archived" in request && result.reason === "database-missing") return {
					kind: "historical-eviction-candidates",
					batch: {
						candidates: [],
						exhausted: true
					}
				};
				throw new Error(`SQLite history eviction cannot read its database: ${result.reason}`);
			}
			return {
				kind: "historical-eviction-candidates",
				...result.value
			};
		}
		if (request.kind === "session-pending-archives") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { hasPendingSessionTranscriptArchives } = await import("../../session-accessor.sqlite-archive-store-kernel-gK1kWZBW.mjs");
			const result = withOpenClawAgentDatabaseReadOnly(hasPendingSessionTranscriptArchives, {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.env)
			});
			return {
				kind: "session-pending-archives",
				pending: result.found && result.value
			};
		}
		if (request.kind === "transcript-stats-batch") {
			const { readTranscriptStatsBatchReadOnlySync } = await import("../../session-accessor.sqlite-transcript-stats-read-BpT4mz7l.mjs");
			return {
				kind: request.kind,
				stats: readTranscriptStatsBatchReadOnlySync(request.sessionIds.map((sessionId) => ({
					...request.database,
					storePath: request.database.path,
					sessionId,
					env: request.env
				})))
			};
		}
		if (request.kind === "session-transcript-instances") {
			const { listSessionTranscriptInstances } = await import("../../session-history-B8o6pvU9.mjs");
			return {
				kind: request.kind,
				instances: listSessionTranscriptInstances({
					...request.scope,
					storePath: request.database.path,
					env: cloneEnvWithPlatformSemantics(request.scope.env ?? process.env)
				}, request.options, request.continuation)
			};
		}
		if (request.kind === "memory-session-targets") {
			const { readMemorySessionTargets } = await import("../../session-memory-targets-BkpoyZCD.mjs");
			return {
				kind: request.kind,
				targets: readMemorySessionTargets({
					...request.params,
					env: cloneEnvWithPlatformSemantics(request.params.env)
				}, request.continuation)
			};
		}
		if (request.kind === "session-archive-inventory") {
			const { listSessionTranscriptArchivesReadOnly } = await import("../../session-accessor.sqlite-history-C4yNXB35.mjs");
			return {
				kind: request.kind,
				archives: listSessionTranscriptArchivesReadOnly({
					...request,
					env: cloneEnvWithPlatformSemantics(request.env ?? process.env)
				})
			};
		}
		if (request.kind === "session-corpus-inventory") {
			const { readSessionTranscriptCorpusInventory } = await import("../../session-transcript-corpus-BYNQ8oBD.mjs");
			return {
				kind: request.kind,
				entries: readSessionTranscriptCorpusInventory({
					...request.scope,
					env: cloneEnvWithPlatformSemantics(request.scope.env)
				}, request.options, request.artifacts, request.database.path, request.continuation)
			};
		}
		if (request.kind === "session-archive-presence") {
			const { readTranscriptArchivePresenceInWorker } = await import("../../session-accessor.sqlite-archive-read-CSaOy6G3.mjs");
			return {
				kind: "session-archive-presence",
				registered: readTranscriptArchivePresenceInWorker({
					...request,
					env: cloneEnvWithPlatformSemantics(request.env)
				})
			};
		}
		if (request.kind === "session-archive-pruning") {
			const { readSessionArchivePruningInWorker } = await import("../../session-history-archive-pruning.worker-B9Ahif9p.mjs");
			return {
				kind: "session-archive-pruning",
				result: readSessionArchivePruningInWorker(request)
			};
		}
		if (request.kind === "cold-metadata" || request.kind === "cold-storage-inventory") {
			const cold = await import("../../session-cold-storage-worker-BfyDy4H0.mjs");
			const options = {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.env)
			};
			return request.kind === "cold-metadata" ? {
				kind: request.kind,
				archive: cold.readSessionColdMetadataInWorker(options, request.sessionId)
			} : {
				kind: request.kind,
				...cold.readSessionColdStorageInventoryInWorker(options)
			};
		}
		if (request.kind === "session-store-target") {
			const { readSessionStoreTargetResult } = await import("../../session-store-target-inventory-Uke4iEwG.mjs");
			request.request.env = cloneEnvWithPlatformSemantics(request.request.env);
			const read = readSessionStoreTargetResult(request.request);
			if (!read.ok) {
				const readError = encodeSessionTranscriptWorkerError(read.error);
				if (!readError) throw read.error;
				return {
					kind: "session-store-target",
					readError
				};
			}
			return read.value;
		}
		if (request.kind === "session-retirement-read") {
			const { readSessionRetirementInWorker } = await import("../../session-retirement-read.worker-CrTWgfQg.mjs");
			return {
				kind: request.kind,
				result: readSessionRetirementInWorker(request)
			};
		}
		if (request.kind === "session-exact-entries") {
			const { readExactSessionEntriesWithLifecycle } = await import("../../session-entry-read.worker-BuW35d-b.mjs");
			request.env = cloneEnvWithPlatformSemantics(request.env);
			return readExactSessionEntriesWithLifecycle(request);
		}
		if (request.kind === "session-row-facts") {
			const { readSessionRowDatabaseFacts } = await import("../../session-entry-read.worker-BuW35d-b.mjs");
			return readSessionRowDatabaseFacts(request);
		}
		if (request.kind === "session-entry-current") {
			const { readSessionEntryCurrentFacts } = await import("../../session-entry-current-admission.worker-Bdh8P7UG.mjs");
			return readSessionEntryCurrentFacts(request);
		}
		if (request.kind === "session-target-inventory") {
			const { readSessionStoreTargetInventory } = await import("../../session-store-target-inventory-Uke4iEwG.mjs");
			return readSessionStoreTargetInventory(request.request);
		}
		if (request.kind === "combined-store-topology") {
			const { readCombinedSessionStoreTopology } = await import("../../combined-store-topology.worker-CSnTi_1d.mjs");
			return readCombinedSessionStoreTopology(request.request);
		}
		if (request.kind === "session-identity-evidence") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { readSessionIdentityEvidenceInDatabase } = await import("../../session-accessor.sqlite-entry-availability-BRxK3mLO.mjs");
			const { readWithCanonicalSessionReaderContinuation } = await import("../../session-canonical-key-dylvEyT1.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => readSessionIdentityEvidenceInDatabase(database, request.identities)), {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.env)
			});
			return {
				kind: "session-identity-evidence",
				evidence: result.found ? result.value : request.identities.map(() => result.reason === "database-missing" ? { status: "absent" } : {
					status: "unknown",
					reason: result.reason
				})
			};
		}
		if (request.kind === "session-entry-read") {
			const { readSessionEntryResult } = await import("../../session-entry-read-result.worker-C2oVKxPO.mjs");
			return readSessionEntryResult(request);
		}
		if (request.kind === "session-runtime-target") {
			const { readSessionRuntimeTargetWorkerRequest } = await import("../../session-runtime-target-read.worker-CaZjfLEb.mjs");
			return readSessionRuntimeTargetWorkerRequest(request);
		}
		if (request.kind === "session-entry-list") {
			const { readSessionEntryList } = await import("../../session-entry-list.worker-BmO2HFBN.mjs");
			return {
				kind: "session-entry-list",
				...readSessionEntryList(request)
			};
		}
		if (request.kind === "session-store-projection") {
			const { readSessionStoreProjection } = await import("../../session-entry-read.worker-BuW35d-b.mjs");
			return readSessionStoreProjection(request);
		}
		if (request.kind === "session-store-summary") {
			const { readSessionStoreSummaryReadOnly } = await import("../../session-accessor.sqlite-summary-CCjlWO-m.mjs");
			return {
				kind: "session-store-summary",
				summary: readSessionStoreSummaryReadOnly({
					agentId: request.database.agentId,
					storePath: request.database.path,
					env: cloneEnvWithPlatformSemantics(request.env)
				}, request)
			};
		}
		if (request.kind === "voice-sessions") {
			const { readOpenVoiceSessions } = await import("../../client-voice-session-lookup.worker-BL95dyeW.mjs");
			return readOpenVoiceSessions({
				...request.database,
				env: request.env
			}, request.request);
		}
		if (request.kind === "session-membership-facts") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { readSessionMembershipFactsInDatabase } = await import("../../session-membership-facts-DcMK68Ez.mjs");
			const { readWithCanonicalSessionReaderContinuation } = await import("../../session-canonical-key-dylvEyT1.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => readSessionMembershipFactsInDatabase(database, request.sessionKeys)), {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.env)
			});
			if (!result.found && result.reason !== "database-missing") throw new Error(`Session membership read unavailable: ${result.reason}`);
			return result.found ? result.value : {
				kind: "session-membership-facts",
				facts: []
			};
		}
		if (request.kind === "projection-status") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { runSqliteDeferredTransactionSync } = await import("../../sqlite-transaction-DwC_Ee5i.mjs");
			const { sessionTranscriptIndexNeedsReconcile } = await import("../../session-transcript-index-_D2DoPWl.mjs");
			const result = withOpenClawAgentDatabaseReadOnly(({ db }) => runSqliteDeferredTransactionSync(db, () => sessionTranscriptIndexNeedsReconcile(db, request.sessionId)), {
				...request.database,
				env: request.env
			});
			return result.found && result.value;
		}
		if (request.kind === "session-members") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { readSessionMembersInDatabase } = await import("../../session-sharing-store.kernel-BmIygxDC.mjs");
			const { readWithCanonicalSessionReaderContinuation } = await import("../../session-canonical-key-dylvEyT1.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => readSessionMembersInDatabase(database, request.sessionKey)), {
				...request.database,
				env: request.env
			});
			return {
				kind: "session-members",
				...result.found ? result.value : {
					entry: void 0,
					members: []
				}
			};
		}
		if (request.kind === "session-reactions") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { listSessionReactionsInDatabase } = await import("../../session-reaction-store.read-Cx6NH_c5.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => listSessionReactionsInDatabase(database, request.sessionKey, request), {
				...request.database,
				env: request.env
			});
			return {
				kind: "session-reactions",
				reactions: result.found ? result.value : {}
			};
		}
		if (request.kind === "session-suggestions") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { listSessionSuggestionsInDatabase } = await import("../../session-suggestion-store.kernel-BOKeQdh9.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => listSessionSuggestionsInDatabase(database, request.sessionKey, request.params), {
				...request.database,
				env: request.env
			});
			return {
				kind: "session-suggestions",
				suggestions: result.found ? result.value : []
			};
		}
		if (request.kind === "session-pending-input-history") {
			const { readPendingInputHistoryInWorker } = await import("../../session-pending-input-history-read.worker-caMtknoX.mjs");
			return {
				kind: "session-pending-input-history",
				snapshot: readPendingInputHistoryInWorker(request)
			};
		}
		if (request.kind === "conversation-rows") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { selectConversationRowsFromDatabase } = await import("../../session-accessor.sqlite-conversation-read-CxJds8G7.mjs");
			const read = withOpenClawAgentDatabaseReadOnly((database) => selectConversationRowsFromDatabase(database, request.query), {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.env)
			});
			return {
				kind: "conversation-rows",
				rows: read.found ? read.value : []
			};
		}
		if (request.kind === "conversation-delivery") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { readConversationDeliveryInDatabase } = await import("../../conversation-delivery-store.kernel-DjsSNlVT.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => readConversationDeliveryInDatabase(database, request.lookup), {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.env)
			});
			return {
				kind: "conversation-delivery",
				record: result.found ? result.value : void 0
			};
		}
		if (request.kind === "goal-operation-receipt") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { readSessionGoalOperationInDatabase, SessionGoalOperationError } = await import("../../goals-operations-lQ-96rbK.mjs");
			const { assertSessionGoalOperationTime } = await import("../../goals-operation-policy-Ds1eJadM.mjs");
			try {
				assertSessionGoalOperationTime(request.operation, Date.now());
				const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionGoalOperationInDatabase(database, request), {
					...request.database,
					env: cloneEnvWithPlatformSemantics(request.env)
				});
				return {
					kind: "goal-operation-receipt",
					result: { receipt: result.found ? result.value : void 0 }
				};
			} catch (error) {
				if (!(error instanceof SessionGoalOperationError)) throw error;
				return {
					kind: "goal-operation-receipt",
					result: { error: {
						code: error.code,
						message: error.message
					} }
				};
			}
		}
		if (request.kind === "session-progress-card") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-_dhEf4ci.mjs");
			const { readSessionProgressCard } = await import("../../progress-card-store-CRSBfNX4.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionProgressCard(database.db, request.sessionKey), {
				...request.database,
				env: request.env
			});
			return {
				kind: "session-progress-card",
				card: result.found ? result.value : null
			};
		}
		if (request.kind === "session-row-presence") {
			const { loadSessionEntryReadOnlyInScope } = await import("../../session-accessor.sqlite-exact-read-CY6qT2ls.mjs");
			return loadSessionEntryReadOnlyInScope({
				...request.scope,
				projection: "list"
			}) !== void 0;
		}
		if (request.kind === "session-entries") {
			const { deliverSessionMemoryEntries } = await import("../../session-memory-entry.worker-CRE4mX0I.mjs");
			return await deliverSessionMemoryEntries(request.entries, channel, control);
		}
		return await runWithSessionTranscriptReadFence(request.admission, async () => {
			if (request.kind === "session-activity-summary-source") {
				const { readActivitySummaryBatch } = await import("../../session-activity-summary-source.worker-BvzznuRR.mjs");
				return {
					kind: "session-activity-summary-source",
					source: readActivitySummaryBatch(request)
				};
			}
			if (request.kind === "transcript-hydration" || request.kind === "transcript-maintenance" || request.kind === "current-turn-entry" || request.kind === "recent-active-events" || request.kind === "latest-active-message") {
				const { readSessionTranscriptHydrationRequest } = await import("../../session-transcript-hydration-read.worker-BiNW6HtV.mjs");
				return readSessionTranscriptHydrationRequest(request, channel, control);
			}
			if (request.kind === "history-page") {
				const { readSessionHistoryRequest } = await import("../../session-history-worker-reader-gLdgKYFE.mjs");
				return readSessionHistoryRequest(request.request, {
					...request.target,
					database: request.database
				});
			}
			if (request.kind === "session-reset-recall") {
				const { readSessionResetRecallCutoffInProcess } = await import("../../session-reset-recall-read-DrlbawIV.mjs");
				return { cutoff: readSessionResetRecallCutoffInProcess(request.scope) };
			}
			if (request.mode === "snapshot") {
				const { readSessionEntrySnapshotRequest } = await import("../../session-transcript-hydration-read.worker-BiNW6HtV.mjs");
				return readSessionEntrySnapshotRequest(request);
			}
			const { prepareSessionMemoryEntry } = await import("../../session-memory-entry.worker-CRE4mX0I.mjs");
			return prepareSessionMemoryEntry(request);
		});
	};
	try {
		return "database" in request ? await withHistoryDatabase(request.database, request.kind === "history-page" ? request.request.kind === "summary" ? `history.${request.request.params.query.kind}` : `history.${request.request.kind}` : request.kind, () => withSessionTranscriptProjectionReceipt(request.projectionReceipt, readRequest), request.validation) : {
			ok: true,
			value: await readRequest()
		};
	} catch (error) {
		const encoded = encodeSessionTranscriptRequestError(error, request);
		if (encoded) return {
			ok: false,
			error: encoded
		};
		throw error;
	}
}, {
	transferList(reply) {
		if (!reply.ok) return [];
		const value = reply.value;
		if (typeof value !== "object" || value === null || !("kind" in value)) return [];
		const body = value.kind === "rpc" ? value.page.encodedResponse?.messages : value.kind === "artifacts" && value.result.kind === "download-response" ? value.result.response?.body : void 0;
		return body ? [body.buffer] : [];
	},
	closeResource: (key) => {
		const request = decodeAgentDatabaseReaderRequest(key);
		if (request?.kind !== "close") throw new Error("Session reader cleanup requires captured physical paths");
		releaseReadValidation?.(request.candidates, request.deleted ? void 0 : request.retainedPaths);
		pruneClosedHistoryDatabaseScopes();
	}
});
//#endregion
export {};
