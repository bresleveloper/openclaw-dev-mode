import { n as cloneEnvWithPlatformSemantics } from "../../config-env-vars-BHI12YH5.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-CwtaNZgU.mjs";
import { a as runWithSessionTranscriptReadFence } from "../../session-transcript-read-fence-Crjo4FKU.mjs";
import { n as encodeSessionTranscriptWorkerError, r as sessionHistoryCleanupError, t as SessionHistoryDeltaPreparationError } from "../../session-history-worker-errors-DS6WgDIN.mjs";
//#region src/config/sessions/session-transcript.worker.ts
const MAX_RETAINED_HISTORY_DATABASES = 64;
const historyDatabaseScopes = /* @__PURE__ */ new Map();
async function withHistoryDatabase(database, operation) {
	const key = JSON.stringify(database);
	let retained = historyDatabaseScopes.get(key);
	if (!retained) {
		const { OpenClawAgentDatabaseReadOnlyScope } = await import("../../openclaw-agent-db-readonly-scope-B4qyxiDQ.mjs");
		retained = {
			database,
			scope: new OpenClawAgentDatabaseReadOnlyScope()
		};
	}
	const { scope } = retained;
	try {
		const value = await scope.run(database, operation);
		historyDatabaseScopes.delete(key);
		if (!scope.hasRetainedConnection) return {
			value,
			closedHistoryDatabase: database
		};
		historyDatabaseScopes.set(key, retained);
		if (historyDatabaseScopes.size > MAX_RETAINED_HISTORY_DATABASES) {
			const oldest = historyDatabaseScopes.entries().next().value;
			oldest[1].scope.close();
			historyDatabaseScopes.delete(oldest[0]);
			return {
				value,
				closedHistoryDatabase: oldest[1].database
			};
		}
		return { value };
	} catch (error) {
		try {
			scope.close();
		} catch (cleanupError) {
			throw sessionHistoryCleanupError(error, cleanupError, "database close");
		}
		throw error;
	}
}
serveWorkerTasks(async (input, channel, control) => {
	const request = input;
	if (request.kind === "sqlite-target") {
		const { resolveSqliteTargetFromSessionStorePath } = await import("../../session-sqlite-target-4o3sO9A1.mjs");
		return {
			ok: true,
			value: { target: resolveSqliteTargetFromSessionStorePath(request.storePath, request) }
		};
	}
	if (request.kind === "usage-cost") {
		const { executeUsageCostWorker, usageCostWorkerFailure } = await import("../../session-cost-usage-worker-BFpnz0nm.mjs");
		try {
			if (!channel) throw new Error("Usage cost worker requires its host channel");
			const closed = /* @__PURE__ */ new Map();
			return {
				ok: true,
				value: await executeUsageCostWorker(request, channel, control, async (database, read) => {
					closed.delete(JSON.stringify(database));
					const result = await withHistoryDatabase(database, read);
					if (result.closedHistoryDatabase) closed.set(JSON.stringify(result.closedHistoryDatabase), result.closedHistoryDatabase);
					return result.value;
				}),
				closedDatabases: [...closed.values()]
			};
		} catch (error) {
			return usageCostWorkerFailure(error);
		}
	}
	try {
		if (request.kind === "transcript-search") {
			const { searchSessionTranscriptsReadOnlySync } = await import("../../session-transcript-search-BjoUcOmt.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => ({
					kind: "transcript-search",
					result: searchSessionTranscriptsReadOnlySync(request.params, {
						...request.database,
						env: cloneEnvWithPlatformSemantics(request.params.env ?? process.env)
					})
				}))
			};
		}
		if (request.kind === "session-store-target") {
			const { readSessionStoreTarget } = await import("../../session-store-target-inventory-DjhW2iwB.mjs");
			return {
				ok: true,
				value: readSessionStoreTarget(request.request)
			};
		}
		if (request.kind === "session-exact-entries") {
			const { readExactSessionEntriesWithLifecycle } = await import("../../session-entry-read.worker-DPI--ee5.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => readExactSessionEntriesWithLifecycle(request))
			};
		}
		if (request.kind === "session-row-facts") {
			const { readSessionRowDatabaseFacts } = await import("../../session-entry-read.worker-DPI--ee5.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => readSessionRowDatabaseFacts(request))
			};
		}
		if (request.kind === "session-target-inventory") {
			const { readSessionStoreTargetInventory } = await import("../../session-store-target-inventory-DjhW2iwB.mjs");
			return {
				ok: true,
				value: readSessionStoreTargetInventory(request.request)
			};
		}
		if (request.kind === "session-identity-evidence") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-B0YVDehL.mjs");
			const { readSessionIdentityEvidenceInDatabase } = await import("../../session-accessor.sqlite-entry-availability-DYWnhqlM.mjs");
			const { readWithCanonicalSessionReaderContinuation } = await import("../../session-canonical-key-zI3qud6z.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => {
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
				})
			};
		}
		if (request.kind === "session-entry-list") {
			const { listSessionEntriesReadOnly } = await import("../../session-accessor.sqlite-entry-DVlqaBEB.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => ({
					kind: "session-entry-list",
					entries: listSessionEntriesReadOnly({
						...request.scope,
						env: cloneEnvWithPlatformSemantics(request.scope.env ?? process.env)
					})
				}))
			};
		}
		if (request.kind === "usage-cache") {
			const { readSessionCostUsageCache } = await import("../../session-cost-usage-cache-read-pvn3DZ0B.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => readSessionCostUsageCache({
					...request.database,
					env: request.env
				}, request.request))
			};
		}
		if (request.kind === "branch-summaries") {
			const { readSessionBranchSummariesInWorker } = await import("../../session-accessor.sqlite-branches-l2o30ylS.mjs");
			return {
				ok: true,
				value: readSessionBranchSummariesInWorker(request.request)
			};
		}
		if (request.kind === "session-membership-facts") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-B0YVDehL.mjs");
			const { readSessionMembershipFactsInDatabase } = await import("../../session-membership-facts-CzdUk4gI.mjs");
			const { readWithCanonicalSessionReaderContinuation } = await import("../../session-canonical-key-zI3qud6z.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => {
					const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => readSessionMembershipFactsInDatabase(database, request.sessionKeys)), {
						...request.database,
						env: cloneEnvWithPlatformSemantics(request.env)
					});
					if (!result.found && result.reason !== "database-missing") throw new Error(`Session membership read unavailable: ${result.reason}`);
					return result.found ? result.value : {
						kind: "session-membership-facts",
						facts: []
					};
				})
			};
		}
		if (request.kind === "session-members") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-B0YVDehL.mjs");
			const { listSessionMembersInDatabase } = await import("../../session-sharing-store.kernel-Om53bYpF.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => {
					const result = withOpenClawAgentDatabaseReadOnly((database) => listSessionMembersInDatabase(database, request.sessionKey), {
						...request.database,
						env: request.env
					});
					return result.found ? result.value : [];
				})
			};
		}
		if (request.kind === "session-progress-card") {
			const { withOpenClawAgentDatabaseReadOnly } = await import("../../openclaw-agent-db-readonly-B0YVDehL.mjs");
			const { readSessionProgressCard } = await import("../../progress-card-store-DsYbFQBm.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => {
					const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionProgressCard(database.db, request.sessionKey), {
						...request.database,
						env: request.env
					});
					return {
						kind: "session-progress-card",
						card: result.found ? result.value : null
					};
				})
			};
		}
		if (request.kind === "session-row-presence") {
			const { loadSessionEntryReadOnlyInScope } = await import("../../session-accessor.sqlite-entry-DVlqaBEB.mjs");
			return {
				ok: true,
				...await withHistoryDatabase(request.database, () => loadSessionEntryReadOnlyInScope({
					...request.scope,
					projection: "list"
				}) !== void 0)
			};
		}
		return await runWithSessionTranscriptReadFence(request.admission, async () => {
			if (request.kind === "session-title-fields") {
				const { readSessionTitleFieldsFromTranscript } = await import("../../session-transcript-title-reader-BzP7IS-w.mjs");
				return {
					ok: true,
					...await withHistoryDatabase(request.database, () => ({
						kind: "session-title-fields",
						fields: readSessionTitleFieldsFromTranscript(request.scope, {
							includeInterSession: request.includeInterSession,
							readOnly: true
						})
					}))
				};
			}
			if (request.kind === "session-preview") {
				const { readSessionPreviewItemsReadOnly } = await import("../../session-transcript-preview-reader-CZO4ukw_.mjs");
				return {
					ok: true,
					...await withHistoryDatabase(request.database, () => ({
						kind: "session-preview",
						items: readSessionPreviewItemsReadOnly(request)
					}))
				};
			}
			if (request.kind === "transcript-hydration" || request.kind === "current-turn-entry") {
				const { readOpenClawDatabaseQuarantineFailure } = await import("../../openclaw-quarantine-store-DAfgDica.mjs");
				const quarantine = readOpenClawDatabaseQuarantineFailure("agent", request.database.path, { env: request.target.env });
				if (quarantine) throw quarantine;
				if (request.kind === "current-turn-entry") {
					const { readSessionTranscriptCurrentTurnEntry } = await import("../../session-accessor.sqlite-current-turn-BWATCH8U.mjs");
					return {
						ok: true,
						...await withHistoryDatabase(request.database, () => readSessionTranscriptCurrentTurnEntry(request.target, {
							entryId: request.entryId,
							version: request.version,
							includeEntry: request.includeEntry,
							readOnly: true,
							resolvedScope: request.resolvedScope
						}))
					};
				}
				const { readSessionTranscriptBoundedActiveContextCore } = await import("../../session-accessor.sqlite-active-context-9vZE8MvL.mjs");
				const { streamSessionTranscriptHydration } = await import("../../session-transcript-hydration.worker-Dea3h54g.mjs");
				return {
					ok: true,
					...await withHistoryDatabase(request.database, () => {
						if (request.limits) return {
							kind: "bounded",
							snapshot: readSessionTranscriptBoundedActiveContextCore(request.target, {
								...request.limits,
								readOnly: true,
								resolvedScope: request.resolvedScope
							})
						};
						if (!channel) throw new Error("Full transcript hydration requires its host channel");
						return streamSessionTranscriptHydration(request, channel, control);
					})
				};
			}
			if (request.kind === "model-context") {
				const { readSessionTranscriptModelContext } = await import("../../session-accessor.sqlite-model-context-CU0nJ_x0.mjs");
				return {
					ok: true,
					value: readSessionTranscriptModelContext(request.target, request.through, request.limits)
				};
			}
			if (request.kind === "history-page") return {
				ok: true,
				...await withHistoryDatabase(request.database, async () => {
					const { createReadonlySessionHistoryReader } = await import("../../session-history-readonly-reader-CjN-1P3j.mjs");
					const options = {
						readers: createReadonlySessionHistoryReader({
							...request.target,
							database: request.database
						}),
						readOnly: true,
						deferProfileDisplay: true,
						resolveCronJobName: () => void 0
					};
					if (request.request.kind === "message-lookup") return {
						kind: "message-lookup",
						messages: await options.readers.readSessionMessagesMatchingIdAsync(request.request.params.target, request.request.params.messageId)
					};
					if (request.request.kind === "delta") {
						const { prepareSessionHistoryDelta } = await import("../../session-history-delta-visibility-BKXyE5wU.mjs");
						return {
							kind: "delta",
							...prepareSessionHistoryDelta(options.readers.readTranscriptDisplayDelta(request.request.params.limits), options.readers.subagentCoordination)
						};
					}
					if (request.request.kind === "rpc") {
						const { readChatHistoryPageKernel } = await import("../../chat-history-page-kernel-BuUeQvP8.mjs");
						return {
							kind: "rpc",
							page: await readChatHistoryPageKernel(request.request.params, options)
						};
					}
					const { readSessionHistorySnapshotKernel } = await import("../../session-history-snapshot-BMrJw9lf.mjs");
					return {
						kind: "http",
						snapshot: await readSessionHistorySnapshotKernel(request.request.params, options)
					};
				})
			};
			const { buildSessionEntryInProcess, readSessionEntryResetRecallCutoff } = await import("../../session-files-DcX2EDvm.mjs");
			const { createSensitiveTextRedactor } = await import("../../redact-omZQGwDV.mjs");
			const entry = await buildSessionEntryInProcess(request.absPath, request.options, createSensitiveTextRedactor(request.redaction));
			return {
				ok: true,
				value: {
					entry,
					resetRecallCutoff: entry ? readSessionEntryResetRecallCutoff(entry) : { state: "absent" }
				}
			};
		});
	} catch (error) {
		if (error instanceof SessionHistoryDeltaPreparationError && request.kind === "history-page" && request.request.kind === "delta") return {
			ok: false,
			error: {
				kind: "delta-visibility",
				partial: error.partial
			}
		};
		if (error instanceof SyntaxError && request.kind === "history-page" && request.request.kind === "message-lookup") return {
			ok: false,
			error: {
				kind: "syntax",
				message: error.message
			}
		};
		const encoded = encodeSessionTranscriptWorkerError(error);
		if (encoded) return {
			ok: false,
			error: encoded
		};
		throw error;
	}
});
//#endregion
export {};
