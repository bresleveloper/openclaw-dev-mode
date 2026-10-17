import { s as withSqliteReaderOwner } from "../../sqlite-reader-lifecycle-CYQdd96B.mjs";
import { r as decodeAgentDatabaseReaderRequest } from "../../agent-database-readers-DAuOtcuZ.mjs";
import { r as cloneEnvWithPlatformSemantics } from "../../config-env-vars-DjPHKieF.mjs";
import { t as serveOwnedWorkerTasks } from "../../worker-task-server-BC_7U18u.mjs";
import { a as runWithSessionTranscriptReadFence } from "../../session-transcript-read-fence-DfxRHzep.mjs";
import { a as sessionHistoryCleanupError, i as encodeSessionTranscriptWorkerError, r as encodeSessionTranscriptRequestError } from "../../session-history-worker-errors-NH8_8u1W.mjs";
import { n as prepareSessionHistoryReadOperation, t as isSessionHistoryReadOperation } from "../../session-history-read-operation.worker-Ddb-X95l.mjs";
//#region src/config/sessions/session-transcript-worker-scopes.ts
const MAX_RETAINED_HISTORY_DATABASES = 64;
const historyDatabaseScopes = /* @__PURE__ */ new Map();
async function withHistoryDatabase(database, operationLabel, operation) {
	const key = JSON.stringify(database);
	let retained = historyDatabaseScopes.get(key);
	if (!retained) {
		const { OpenClawAgentDatabaseReadOnlyScope } = await import("../../openclaw-agent-db-readonly-scope-CnmwAPUy.mjs");
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
		}, () => scope.run(database, operation));
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
	releaseReadValidation ??= (await import("../../openclaw-agent-db-validation-cache-BNZmdJcF.mjs")).releaseOpenClawAgentDatabaseReadValidation;
	const request = input;
	if (request.kind === "cli-process-history") {
		if (!channel) throw new Error("Process-held history requires its host reader channel");
		const { readProcessHeldCliHistoryInWorker } = await import("../../cli-session-history.process-held-DIlnCme3.mjs");
		return {
			ok: true,
			value: {
				kind: "rpc",
				page: await readProcessHeldCliHistoryInWorker(request.params, channel)
			}
		};
	}
	if (request.kind === "sqlite-target") {
		const { resolveSqliteTargetFromSessionStorePath } = await import("../../session-sqlite-target-D7Gj74mk.mjs");
		return {
			ok: true,
			value: { target: resolveSqliteTargetFromSessionStorePath(request.storePath, request) }
		};
	}
	if (request.kind === "usage-cost") {
		const { executeUsageCostWorker, usageCostWorkerFailure } = await import("../../session-cost-usage-worker-DINZDrla.mjs");
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
	const readRequest = async () => {
		if (isSessionHistoryReadOperation(request)) return (await prepareSessionHistoryReadOperation(request))();
		if (request.kind === "lifecycle-artifact-plan") {
			const { readSessionLifecycleArtifactCleanup } = await import("../../session-accessor.sqlite-lifecycle-artifacts-B8RJcfUB.mjs");
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
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
			await Promise.all([
				import("../../session-history-worker-reader-CDir-yrc.mjs"),
				import("../../chat-history-page-kernel-CSHhmCUJ.mjs"),
				import("../../chat-history-response-page-fKVbbSAu.mjs"),
				import("../../session-history-snapshot-CzIvW-DJ.mjs")
			]);
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const opened = withOpenClawAgentDatabaseReadOnly(() => void 0, {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.env)
			});
			if (!opened.found && opened.reason !== "database-missing") throw new Error(`Session history prewarm admission unavailable: ${opened.reason}`);
			return { kind: "prewarm" };
		}
		if (request.kind === "historical-eviction-candidates") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { runSqliteDeferredTransactionSync } = await import("../../sqlite-transaction-DGdmlejc.mjs");
			const { readHistoricalSessionIdsInDatabase, readDiskEvictableArchivedSessionBatchInDatabase } = await import("../../session-history-eviction-candidates-eCmpOEfO.mjs");
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
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { runSqliteDeferredTransactionSync } = await import("../../sqlite-transaction-DGdmlejc.mjs");
			const { hasPendingSessionTranscriptArchives } = await import("../../session-accessor.sqlite-archive-store-kernel-DAnmYtZU.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => hasPendingSessionTranscriptArchives(database)), {
				...request.database,
				env: cloneEnvWithPlatformSemantics(request.env)
			});
			return {
				kind: "session-pending-archives",
				pending: result.found && result.value
			};
		}
		if (request.kind === "memory-session-targets") {
			const { readMemorySessionTargets } = await import("../../session-memory-targets-BNbb3ndb.mjs");
			return {
				kind: request.kind,
				targets: readMemorySessionTargets({
					...request.params,
					env: cloneEnvWithPlatformSemantics(request.params.env)
				}, request.continuation)
			};
		}
		if (request.kind === "session-archive-inventory") {
			const { listSessionTranscriptArchivesReadOnly } = await import("../../session-accessor.sqlite-history-B9w5HpJ3.mjs");
			return {
				kind: request.kind,
				archives: listSessionTranscriptArchivesReadOnly({
					...request,
					env: cloneEnvWithPlatformSemantics(request.env ?? process.env)
				})
			};
		}
		if (request.kind === "session-corpus-inventory") {
			const { readSessionTranscriptCorpusInventory } = await import("../../session-transcript-corpus-DneGneZ2.mjs");
			return {
				kind: request.kind,
				entries: readSessionTranscriptCorpusInventory({
					...request.scope,
					env: cloneEnvWithPlatformSemantics(request.scope.env)
				}, request.options, request.artifacts, request.database.path, request.continuation)
			};
		}
		if (request.kind === "session-archive-presence") {
			const { readTranscriptArchivePresenceInWorker } = await import("../../session-accessor.sqlite-archive-read-BnAhW65A.mjs");
			return {
				kind: "session-archive-presence",
				registered: readTranscriptArchivePresenceInWorker({
					...request,
					env: cloneEnvWithPlatformSemantics(request.env)
				})
			};
		}
		if (request.kind === "session-archive-pruning") {
			const { readSessionArchivePruningInWorker } = await import("../../session-history-archive-pruning.worker-CtbX6A-0.mjs");
			return {
				kind: "session-archive-pruning",
				result: readSessionArchivePruningInWorker(request)
			};
		}
		if (request.kind === "cold-metadata" || request.kind === "cold-storage-inventory") {
			const cold = await import("../../session-cold-storage-worker-BGLwMA4f.mjs");
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
			const { readSessionStoreTargetResult } = await import("../../session-store-target-inventory-BHIv0Vew.mjs");
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
		if (request.kind === "session-exact-entries") {
			const { readExactSessionEntriesWithLifecycle } = await import("../../session-entry-read.worker-C7D_OsD2.mjs");
			request.env = cloneEnvWithPlatformSemantics(request.env);
			return readExactSessionEntriesWithLifecycle(request);
		}
		if (request.kind === "session-row-facts") {
			const { readSessionRowDatabaseFacts } = await import("../../session-entry-read.worker-C7D_OsD2.mjs");
			return readSessionRowDatabaseFacts(request);
		}
		if (request.kind === "session-entry-current") {
			const { readSessionEntryCurrentFacts } = await import("../../session-entry-read.worker-C7D_OsD2.mjs");
			return readSessionEntryCurrentFacts(request);
		}
		if (request.kind === "session-row-backfill") {
			const { readSessionRowTranscriptFields } = await import("../../session-row-transcript-backfill.kernel-CmKlM1wH.mjs");
			return {
				kind: "session-row-backfill",
				fields: readSessionRowTranscriptFields(request.params)
			};
		}
		if (request.kind === "session-target-inventory") {
			const { readSessionStoreTargetInventory } = await import("../../session-store-target-inventory-BHIv0Vew.mjs");
			return readSessionStoreTargetInventory(request.request);
		}
		if (request.kind === "session-identity-evidence") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { readSessionIdentityEvidenceInDatabase } = await import("../../session-accessor.sqlite-entry-availability-f21XB-BK.mjs");
			const { readWithCanonicalSessionReaderContinuation } = await import("../../session-canonical-key-DYObZ8GD.mjs");
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
		if (request.kind === "session-diagnostic-text") {
			const { readSessionDiagnosticText } = await import("../../session-entry-read.worker-C7D_OsD2.mjs");
			return readSessionDiagnosticText(request);
		}
		if (request.kind === "session-entry-read" || request.kind === "session-runtime-target") {
			const { readSessionEntryWorkerRequest } = await import("../../session-entry-read.worker-C7D_OsD2.mjs");
			return readSessionEntryWorkerRequest(request);
		}
		if (request.kind === "session-entry-list") {
			const { readSessionEntryList } = await import("../../session-entry-read.worker-C7D_OsD2.mjs");
			return {
				kind: "session-entry-list",
				entries: readSessionEntryList(request)
			};
		}
		if (request.kind === "session-store-summary") {
			const { readSessionStoreSummaryReadOnly } = await import("../../session-accessor.sqlite-summary-DIpD7BYL.mjs");
			return {
				kind: "session-store-summary",
				summary: readSessionStoreSummaryReadOnly({
					agentId: request.database.agentId,
					storePath: request.database.path,
					env: cloneEnvWithPlatformSemantics(request.env)
				}, request)
			};
		}
		if (request.kind === "usage-cache") {
			const { readSessionCostUsageCache } = await import("../../session-cost-usage-cache-read-cifcG34S.mjs");
			return readSessionCostUsageCache({
				...request.database,
				env: request.env
			}, request.request);
		}
		if (request.kind === "session-membership-facts") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { readSessionMembershipFactsInDatabase } = await import("../../session-membership-facts-CcT19VPA.mjs");
			const { readWithCanonicalSessionReaderContinuation } = await import("../../session-canonical-key-DYObZ8GD.mjs");
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
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { runSqliteDeferredTransactionSync } = await import("../../sqlite-transaction-DGdmlejc.mjs");
			const { hasSessionsNeedingTranscriptIndexReconcile, hasOrphanedTranscriptIndexRows, sessionTranscriptIndexNeedsReconcile } = await import("../../session-transcript-index-BlooBxa_.mjs");
			const result = withOpenClawAgentDatabaseReadOnly(({ db }) => runSqliteDeferredTransactionSync(db, () => request.sessionId !== void 0 ? sessionTranscriptIndexNeedsReconcile(db, request.sessionId) : hasSessionsNeedingTranscriptIndexReconcile(db) || hasOrphanedTranscriptIndexRows(db)), {
				...request.database,
				env: request.env
			});
			return result.found ? result.value : request.sessionId === void 0 && result.reason === "schema-missing";
		}
		if (request.kind === "session-members") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { listSessionMembersInDatabase } = await import("../../session-sharing-store.kernel-DflrHjlo.mjs");
			const result = withOpenClawAgentDatabaseReadOnly((database) => listSessionMembersInDatabase(database, request.sessionKey), {
				...request.database,
				env: request.env
			});
			return result.found ? result.value : [];
		}
		if (request.kind === "session-suggestions") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { listSessionSuggestionsInDatabase } = await import("../../session-suggestion-store.kernel-DTW3AJC0.mjs");
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
			const { readPendingInputHistoryInWorker } = await import("../../session-pending-input-history-read.worker-DjD3mbeP.mjs");
			return {
				kind: "session-pending-input-history",
				snapshot: readPendingInputHistoryInWorker(request)
			};
		}
		if (request.kind === "conversation-rows") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { selectConversationRowsFromDatabase } = await import("../../session-accessor.sqlite-conversation-read-BCxMJ1QG.mjs");
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
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { readConversationDeliveryInDatabase } = await import("../../conversation-delivery-store.kernel-YgNWpSiF.mjs");
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
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { assertSessionGoalOperationTime, readSessionGoalOperationInDatabase, SessionGoalOperationError } = await import("../../goals-operations-Dfw0X9q9.mjs");
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
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-CaIroy8A.mjs");
			const { readSessionProgressCard } = await import("../../progress-card-store-CLY5ePm7.mjs");
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
			const { loadSessionEntryReadOnlyInScope } = await import("../../session-accessor.sqlite-exact-read-CUiGYS00.mjs");
			return loadSessionEntryReadOnlyInScope({
				...request.scope,
				projection: "list"
			}) !== void 0;
		}
		return await runWithSessionTranscriptReadFence(request.admission, async () => {
			if (request.kind === "session-activity-summary-source") {
				const { readActivitySummaryBatch } = await import("../../session-activity-summary-source-BjjC_aUX.mjs");
				return {
					kind: "session-activity-summary-source",
					source: readActivitySummaryBatch(request)
				};
			}
			if (request.kind === "transcript-hydration" || request.kind === "transcript-maintenance" || request.kind === "current-turn-entry" || request.kind === "recent-active-events" || request.kind === "latest-active-message") {
				const { readSessionTranscriptHydrationRequest } = await import("../../session-transcript-hydration-read.worker-C6hzGSiD.mjs");
				return readSessionTranscriptHydrationRequest(request, channel, control);
			}
			if (request.kind === "history-page") {
				const { readSessionHistoryRequest } = await import("../../session-history-worker-reader-CDir-yrc.mjs");
				return readSessionHistoryRequest(request.request, {
					...request.target,
					database: request.database
				});
			}
			if (request.kind === "session-reset-recall") {
				const { readSessionResetRecallCutoffInProcess } = await import("../../session-reset-recall-read-h_GiVvc5.mjs");
				return { cutoff: readSessionResetRecallCutoffInProcess(request.scope) };
			}
			const { buildSessionEntryInProcess, readSessionEntryResetRecallCutoff } = await import("../../session-files-CURj1ZCP.mjs");
			const { createSensitiveTextRedactor } = await import("../../redact-BkOlsSgX.mjs");
			const entry = await buildSessionEntryInProcess(request.absPath, request.options, createSensitiveTextRedactor(request.redaction));
			return {
				entry,
				resetRecallCutoff: entry ? readSessionEntryResetRecallCutoff(entry) : { state: "absent" }
			};
		});
	};
	try {
		return "database" in request ? await withHistoryDatabase(request.database, request.kind === "history-page" ? request.request.kind === "summary" ? `history.${request.request.params.query.kind}` : `history.${request.request.kind}` : request.kind, readRequest) : {
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
		releaseReadValidation?.(request.candidates);
		pruneClosedHistoryDatabaseScopes();
	}
});
//#endregion
export {};
