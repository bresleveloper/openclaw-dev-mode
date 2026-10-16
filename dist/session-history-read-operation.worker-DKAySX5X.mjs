import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { a as runWithSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
//#region src/config/sessions/session-history-read-operation.worker.ts
function isSessionHistoryReadOperation(request) {
	switch (request.kind) {
		case "transcript-match":
		case "transcript-search":
		case "branch-summaries":
		case "session-title-fields":
		case "session-preview":
		case "model-context":
		case "transcript-watermark":
		case "session-pending-input-receipts":
		case "session-pending-input-source": return true;
		default: return false;
	}
}
async function prepareSessionHistoryReadOperation(request, retainedDatabase) {
	switch (request.kind) {
		case "session-pending-input-source": {
			const [{ withOpenClawAgentDatabaseReadOnly }, { assertCapturedSessionEntryReadSource }, { readPendingInputSourceInDatabase }] = await Promise.all([
				import("./openclaw-agent-db-readonly-CaIroy8A.mjs"),
				import("./session-accessor.sqlite-exact-read-CUiGYS00.mjs"),
				import("./session-pending-input-source.kernel-BpuFl8RY.mjs")
			]);
			return () => {
				const read = withOpenClawAgentDatabaseReadOnly((database) => {
					assertCapturedSessionEntryReadSource(request.source, database);
					return readPendingInputSourceInDatabase(database, request.input);
				}, {
					...request.database,
					env: request.env
				});
				return {
					kind: request.kind,
					snapshot: read.found ? read.value : {
						kind: "source",
						current: false
					}
				};
			};
		}
		case "transcript-match": {
			const [{ findTranscriptEventMatchingInDatabase }, { withOpenClawAgentDatabaseReadOnly }] = await Promise.all([import("./session-transcript-match-CfUDlpQF.mjs"), import("./openclaw-agent-db-readonly-CaIroy8A.mjs")]);
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
		case "transcript-search": {
			const { searchSessionTranscriptsReadOnlySync } = await import("./session-transcript-search-DfVQE-8p.mjs");
			return () => ({
				kind: request.kind,
				result: searchSessionTranscriptsReadOnlySync(request.params, {
					...request.database,
					env: cloneEnvWithPlatformSemantics(request.params.env ?? process.env)
				})
			});
		}
		case "branch-summaries": {
			const { readSessionBranchSnapshot, readSessionBranchSummariesInWorker } = await import("./session-accessor.sqlite-branches-BDe6XX18.mjs");
			if (retainedDatabase) return () => readSessionBranchSnapshot(retainedDatabase, {
				sessionKey: request.request.sessionKey,
				sessionId: request.request.sessionId,
				lifecycleRevision: request.request.lifecycleRevision
			});
			const databaseIdentity = request.request.databaseIdentity;
			if (databaseIdentity === void 0) throw new Error("Durable branch reads require their captured database identity");
			return () => readSessionBranchSummariesInWorker({
				...request.request,
				databaseIdentity
			});
		}
		case "session-title-fields": {
			const { readSessionTitleFieldsFromTranscript } = await import("./session-transcript-title-reader-gGdQ42du.mjs");
			return () => runWithSessionTranscriptReadFence(request.admission, () => ({
				kind: request.kind,
				fields: readSessionTitleFieldsFromTranscript(request.scope, {
					includeInterSession: request.includeInterSession,
					readOnly: true
				})
			}));
		}
		case "session-preview": {
			const { readSessionPreviewItemsReadOnly } = await import("./session-transcript-preview-reader-LbxkDh7I.mjs");
			return () => runWithSessionTranscriptReadFence(request.admission, () => ({
				kind: request.kind,
				items: readSessionPreviewItemsReadOnly(request, retainedDatabase)
			}));
		}
		case "model-context": {
			const { readSessionTranscriptModelContext } = await import("./session-accessor.sqlite-model-context-PafSfNaJ.mjs");
			return () => runWithSessionTranscriptReadFence(request.admission, () => readSessionTranscriptModelContext(request.target, request.through, request.limits));
		}
		case "transcript-watermark": {
			const { readSessionTranscriptWatermark } = await import("./session-accessor.sqlite-transcript-watermark-Do7f0Vrt.mjs");
			return () => ({
				kind: request.kind,
				watermark: readSessionTranscriptWatermark(request.scope)
			});
		}
		case "session-pending-input-receipts": {
			const { listSessionPendingInputReceipts } = await import("./session-accessor.sqlite-pending-input-receipts-ByGTLgFb.mjs");
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
//#endregion
export { prepareSessionHistoryReadOperation as n, isSessionHistoryReadOperation as t };
