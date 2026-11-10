import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { i as runWithSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
//#region src/config/sessions/session-history-read-operation.worker.ts
const historyReadKindSet = /* @__PURE__ */ new Set([
	"trajectory-events",
	"trajectory-retention",
	"board-snapshot",
	"board-widget-document",
	"transcript-match",
	"branch-summaries",
	"session-title-fields",
	"session-preview",
	"model-context",
	"context-messages",
	"transcript-watermark",
	"transcript-stats",
	"transcript-message-presence",
	"transcript-anchors",
	"transcript-raw-delta",
	"transcript-visible-delta",
	"transcript-latest-assistant",
	"session-memory-capture",
	"session-pending-input-receipts",
	"session-pending-input-source",
	"session-harness-completion-source"
]);
function isSessionHistoryReadOperation(request) {
	return historyReadKindSet.has(request.kind);
}
async function prepareSessionHistoryReadOperation(request, retainedDatabase) {
	const execute = await prepareHistoryRead(request, retainedDatabase);
	return () => {
		if ("expectedIdentity" in request && request.expectedIdentity && request.kind !== "transcript-anchors" && request.kind !== "context-messages") assertExistingDatabaseIdentity(request.kind === "model-context" ? request.target.storePath : request.database.path, request.expectedIdentity.key, request.expectedIdentity.birthtime);
		return execute();
	};
}
async function prepareHistoryRead(request, retainedDatabase) {
	switch (request.kind) {
		case "trajectory-events": {
			const { loadSqliteTrajectoryRuntimeEventRowsSync } = await import("./runtime-store.sqlite-DVyUR2Ki.mjs");
			return () => ({
				kind: request.kind,
				events: loadSqliteTrajectoryRuntimeEventRowsSync({
					...request.scope,
					agentId: request.database.agentId,
					storePath: request.database.path
				}).map((row) => row.event)
			});
		}
		case "trajectory-retention": {
			const [{ assertOpenClawAgentDatabaseIdentity }, { prepareTrajectoryRuntimeRetention }] = await Promise.all([import("./openclaw-agent-db-identity-DAfxZOOh.mjs"), import("./runtime-retention.sqlite-BIWx0LVH.mjs")]);
			const read = await prepareDatabaseRead({
				...request.database,
				env: request.env
			}, (database) => {
				assertOpenClawAgentDatabaseIdentity(database, request.expectedIdentity);
				const plan = prepareTrajectoryRuntimeRetention(database.db, request.input, request.now);
				assertOpenClawAgentDatabaseIdentity(database, request.expectedIdentity);
				return plan;
			}, (reason) => {
				throw new Error(`Trajectory retention cannot read its database: ${reason}`);
			});
			return () => ({
				kind: request.kind,
				plan: read()
			});
		}
		case "session-memory-capture": {
			const { readSessionMemoryCapture } = await import("./capture.worker-CxC3t63k.mjs");
			return () => runWithSessionTranscriptReadFence(request.admission, () => ({
				kind: request.kind,
				result: readSessionMemoryCapture({
					scope: request.scope,
					resolvedScope: request.resolved,
					messageCount: request.messageCount
				})
			}));
		}
		case "transcript-latest-assistant": {
			const { readLatestAssistantTextFromDatabase } = await import("./session-accessor.sqlite-transcript-metadata-read-DZSh8YKP.mjs");
			const read = await prepareDatabaseRead({
				...request.database,
				env: request.scope.env
			}, (database) => readLatestAssistantTextFromDatabase(database, request.resolved), () => void 0, {
				snapshot: true,
				admission: request.admission
			});
			return () => ({
				kind: request.kind,
				result: read()
			});
		}
		case "transcript-raw-delta": {
			const { readTranscriptRawDeltaInDatabase } = await import("./session-accessor.sqlite-delta-DwedOiuj.mjs");
			const read = await prepareDatabaseRead({
				...request.database,
				env: request.scope.env
			}, (database) => readTranscriptRawDeltaInDatabase(database, request.resolved, request.limits), () => ({ kind: "missing" }), {
				snapshot: true,
				admission: request.admission
			});
			return () => ({
				kind: request.kind,
				result: read()
			});
		}
		case "transcript-visible-delta": {
			const { readSessionTranscriptVisibleMessageDeltaCore } = await import("./session-accessor.sqlite-active-events-CL963ovG.mjs");
			return () => runWithSessionTranscriptReadFence(request.admission, () => ({
				kind: request.kind,
				result: readSessionTranscriptVisibleMessageDeltaCore(request.scope, request.limits, {
					readOnly: true,
					resolvedScope: request.resolved
				})
			}));
		}
		case "board-snapshot":
		case "board-widget-document": {
			const [{ withScopedOpenClawAgentDatabaseReadOnly }, { runSqliteDeferredTransactionSync }, { readBoardSnapshotWithHtmlViewMetadata, readBoardWidgetDocument }] = await Promise.all([
				import("./openclaw-agent-db-readonly-scope-Bbk34iwF.mjs"),
				import("./sqlite-transaction-DwC_Ee5i.mjs"),
				import("./sqlite-board-store.kernel-BTgSF2wy.mjs")
			]);
			return () => {
				const read = withScopedOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => request.kind === "board-snapshot" ? {
					kind: request.kind,
					value: readBoardSnapshotWithHtmlViewMetadata(database, request.sessionKey)
				} : {
					kind: request.kind,
					value: readBoardWidgetDocument(database, request.sessionKey, request.name, request.contentKind)
				}), {
					...request.database,
					env: request.env
				});
				return read.found ? read.value : {
					kind: request.kind,
					value: void 0
				};
			};
		}
		case "transcript-anchors": {
			const { readSessionTranscriptAnchorFactsInDatabase, prepareSessionTranscriptAnchorMessageReader } = await import("./session-transcript-anchor-read.kernel-BYxbiERy.mjs");
			const readMessage = await prepareSessionTranscriptAnchorMessageReader(request.selection);
			const read = await prepareDatabaseRead({
				...request.database,
				env: request.resolved.env
			}, (database) => readSessionTranscriptAnchorFactsInDatabase(database, request.resolved, request.selection, readMessage, void 0, request.preparedEntry), () => ({ anchors: [] }));
			return () => {
				assertExistingDatabaseIdentity(request.database.path, request.expectedIdentity.key, request.expectedIdentity.birthtime);
				return {
					kind: request.kind,
					facts: read()
				};
			};
		}
		case "session-harness-completion-source": {
			const [{ assertCapturedSessionEntryReadSource }, { readHarnessCompletionSourceInDatabase }] = await Promise.all([import("./session-entry-read-source-BFPMoTtV.mjs"), import("./session-harness-completion-source.kernel-48H4ZCw5.mjs")]);
			const read = await prepareDatabaseRead({
				...request.database,
				env: request.env
			}, (database) => {
				assertCapturedSessionEntryReadSource(request.source, database);
				return runWithSessionTranscriptReadFence(request.admission, () => readHarnessCompletionSourceInDatabase(database, request.claim, request.mode));
			}, () => ({ validInput: false }));
			return () => ({
				kind: request.kind,
				snapshot: read()
			});
		}
		case "session-pending-input-source": {
			const [{ assertCapturedSessionEntryReadSource }, { readPendingInputSourceInDatabase }] = await Promise.all([import("./session-entry-read-source-BFPMoTtV.mjs"), import("./session-pending-input-source.kernel-CQImlgVE.mjs")]);
			const read = await prepareDatabaseRead({
				...request.database,
				env: request.env
			}, (database) => {
				assertCapturedSessionEntryReadSource(request.source, database);
				return readPendingInputSourceInDatabase(database, request.input);
			}, () => ({
				kind: "source",
				current: false
			}));
			return () => ({
				kind: request.kind,
				snapshot: read()
			});
		}
		case "transcript-match": {
			const [{ findTranscriptEventMatchingInDatabase }, { withOpenClawAgentDatabaseReadOnly }] = await Promise.all([import("./session-transcript-match-7r3QC_No.mjs"), import("./openclaw-agent-db-readonly-_dhEf4ci.mjs")]);
			return () => {
				if (retainedDatabase) return {
					kind: request.kind,
					result: findTranscriptEventMatchingInDatabase(retainedDatabase, request.request)
				};
				const opened = withOpenClawAgentDatabaseReadOnly((database) => findTranscriptEventMatchingInDatabase(database, request.request), {
					...request.database,
					env: cloneEnvWithPlatformSemantics(request.request.target.env ?? process.env)
				});
				return {
					kind: request.kind,
					result: opened.found ? opened.value : void 0
				};
			};
		}
		case "branch-summaries": {
			const { readSessionBranchSnapshot, readSessionBranchSummariesInWorker } = await import("./session-accessor.sqlite-branches.worker-BNOWeg8a.mjs");
			if (retainedDatabase) return () => ({
				kind: request.kind,
				result: readSessionBranchSnapshot(retainedDatabase, {
					sessionKey: request.request.sessionKey,
					previous: request.request.previous
				})
			});
			return () => ({
				kind: request.kind,
				result: readSessionBranchSummariesInWorker({
					...request.request,
					database: request.database
				})
			});
		}
		case "session-title-fields": {
			const { readSessionTitleFieldsFromTranscript } = await import("./session-transcript-title-reader.worker-CeawwxO-.mjs");
			return () => runWithSessionTranscriptReadFence(request.admission, () => ({
				kind: request.kind,
				fields: readSessionTitleFieldsFromTranscript(request.scope, {
					includeInterSession: request.includeInterSession,
					readOnly: true
				})
			}));
		}
		case "session-preview": {
			const { readSessionPreviewItemsReadOnly } = await import("./session-transcript-preview-reader-CX3YsaDj.mjs");
			return () => runWithSessionTranscriptReadFence(request.admission, () => ({
				kind: request.kind,
				items: readSessionPreviewItemsReadOnly(request, retainedDatabase)
			}));
		}
		case "context-messages": {
			const [{ readSessionTranscriptContextMessages }, { resolveSqliteTranscriptReadScope, toDatabaseOptions }, { resolveOpenClawAgentSqlitePath }, { readDatabasePathIdentitySync }] = await Promise.all([
				import("./session-accessor.sqlite-model-context-DrfJjzgn.mjs"),
				import("./session-accessor.sqlite-scope-CGGAwxzb.mjs"),
				import("./openclaw-agent-db.paths-CIJftpgq.mjs"),
				import("./sqlite-worker-identity-DHmkARqT.mjs")
			]);
			return () => runWithSessionTranscriptReadFence(request.admission, () => {
				const databasePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteTranscriptReadScope(request.target)));
				if (request.expectedIdentity) assertExistingDatabaseIdentity(databasePath, request.expectedIdentity.key, request.expectedIdentity.birthtime);
				else if (readDatabasePathIdentitySync(databasePath).key.startsWith("file:")) throw new Error("Session context changed its captured database owner");
				return readSessionTranscriptContextMessages(request.target, (messages, header, version) => ({
					messages: [...messages],
					header,
					version
				}));
			});
		}
		case "model-context": {
			const { readSessionTranscriptModelContext } = await import("./session-accessor.sqlite-model-context-DrfJjzgn.mjs");
			return () => runWithSessionTranscriptReadFence(request.admission, () => readSessionTranscriptModelContext(request.target, request.through, request.limits));
		}
		case "transcript-watermark": {
			const { readSessionTranscriptWatermark } = await import("./session-accessor.sqlite-transcript-watermark-C90z9Qkv.mjs");
			return () => {
				return {
					kind: request.kind,
					watermark: readSessionTranscriptWatermark(request.scope)
				};
			};
		}
		case "transcript-stats": {
			const { readTranscriptStatsFromDatabase } = await import("./session-accessor.sqlite-transcript-stats-BkCSo56Y.mjs");
			const read = await prepareDatabaseRead({
				...request.database,
				env: request.scope.env
			}, (database) => readTranscriptStatsFromDatabase(database, request.scope.sessionId), () => ({
				eventCount: 0,
				maxSeq: 0,
				sizeBytes: 0
			}));
			return () => ({
				kind: request.kind,
				stats: read()
			});
		}
		case "transcript-message-presence": {
			const { hasSessionTranscriptMessageInDatabase } = await import("./session-accessor.sqlite-transcript-metadata-read-DZSh8YKP.mjs");
			const read = await prepareDatabaseRead({
				...request.database,
				env: request.scope.env
			}, (database) => hasSessionTranscriptMessageInDatabase(database, request.scope.sessionId), () => false);
			return () => ({
				kind: request.kind,
				present: read()
			});
		}
		case "session-pending-input-receipts": {
			const { listSessionPendingInputReceipts } = await import("./session-accessor.sqlite-pending-input-receipts-DX6fzU4O.mjs");
			return () => ({
				kind: request.kind,
				receipts: listSessionPendingInputReceipts({
					agentId: request.agentId,
					sessionKey: request.sessionKey,
					sessionId: request.sessionId,
					storePath: request.database.path,
					env: cloneEnvWithPlatformSemantics(request.env)
				}, { runIds: request.runIds })
			});
		}
	}
	throw new Error("Unsupported session history read operation");
}
async function prepareDatabaseRead(databaseOptions, read, missing, options) {
	const { withOpenClawAgentDatabaseReadOnly } = await import("./openclaw-agent-db-readonly-_dhEf4ci.mjs");
	return () => runWithSessionTranscriptReadFence(options?.admission, () => {
		const result = withOpenClawAgentDatabaseReadOnly(read, databaseOptions, options);
		return result.found ? result.value : missing(result.reason);
	});
}
//#endregion
export { isSessionHistoryReadOperation, prepareSessionHistoryReadOperation };
