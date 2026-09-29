import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-CqmhHNa_.mjs";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-Cotag45I.mjs";
import { r as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import { n as toTranscriptReadScope } from "./session-transcript-read-target-Cmb7QmaZ.mjs";
import { t as buildSessionPreviewItems } from "./session-display-projection-bZOY074i.mjs";
import { t as readRecentSessionTranscriptHistoryEvents } from "./session-accessor.sqlite-history-events-CxKlqhz3.mjs";
import { t as SessionManager } from "./session-manager-ezhBV3sx.mjs";
import { n as readBoundedSessionPreviewItemsAsync, t as readBoundedSessionPreviewItems } from "./session-transcript-preview-reader-DOGLKp96.mjs";
//#region src/gateway/session-transcript-preview.ts
/** Durable previews share the history reader; incognito SQLite stays with its process owner. */
async function readSessionPreviewItemsFromTranscriptAsync(scope, maxItems, maxChars, view = "display") {
	const target = prepareSessionTranscriptReadTargetCore(scope);
	if (view === "model-context") {
		const { agentId, sessionKey, storePath } = target;
		const sessionId = scope.sessionId;
		if (!agentId || !sessionKey || !storePath) throw new Error("Model-context preview requires an exact session target");
		const modelTarget = captureSessionTranscriptTargetBinding({
			agentId,
			sessionId,
			sessionKey,
			storePath,
			...scope.env ? { env: scope.env } : {}
		});
		return await readBoundedSessionPreviewItemsAsync(maxItems, async (maxEvents, maxBytes) => {
			let truncated = false;
			const manager = await SessionManager.openBoundedAsync(modelTarget, {
				maxEvents,
				maxBytes,
				onTruncated: () => {
					truncated = true;
				}
			});
			return {
				items: buildSessionPreviewItems(manager.buildSessionContext().messages, maxItems, maxChars, view),
				hasOlderEvents: truncated
			};
		});
	}
	const readScope = {
		agentId: target.agentId,
		sessionId: scope.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath,
		...scope.env ? { env: scope.env } : {},
		...scope.sessionEntry ? { sessionEntry: { sessionId: scope.sessionEntry.sessionId } } : {}
	};
	const resolved = resolveSqliteTranscriptReadScope(readScope);
	const options = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(options);
	if (isIncognitoOpenClawAgentSqlitePath(databasePath, options)) return readSessionDisplayPreviewItems(readScope, maxItems, maxChars);
	const entryValidationKey = target.entryValidationScope ? resolveSqliteScope({
		agentId: resolved.agentId,
		sessionKey: target.entryValidationScope.sessionKey
	}).sessionKey : void 0;
	const admission = resolveSessionTranscriptReadFence(resolved);
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-BQnc6XRX.mjs");
	try {
		return await withSessionHistoryWorkerDatabase(options, (owner) => owner.readPreview({
			target: {
				agentId: resolved.agentId,
				sessionId: resolved.sessionId,
				sessionKey: entryValidationKey ?? resolved.sessionKey,
				...entryValidationKey !== void 0 ? { entryValidationKey } : {}
			},
			...scope.env ? { env: scope.env } : {},
			maxItems,
			maxChars,
			...admission ? { admission: { ...admission } } : {}
		}));
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error)) startSessionTranscriptIndexReconcile({
			...options,
			preferredSessionId: resolved.sessionId
		});
		throw error;
	}
}
function readSessionDisplayPreviewItems(scope, maxItems, maxChars) {
	const target = resolveSessionTranscriptReadTarget(scope);
	return readBoundedSessionPreviewItems(maxItems, (maxEvents, maxBytes) => {
		const page = readRecentSessionTranscriptHistoryEvents(toTranscriptReadScope(target), {
			maxBytes,
			maxLines: maxEvents,
			maxMessages: maxEvents
		});
		return {
			items: buildSessionPreviewItems(page.events.map((entry) => asOptionalRecord(entry.event)?.message), maxItems, maxChars),
			hasOlderEvents: page.totalMessages > page.events.length
		};
	});
}
//#endregion
export { readSessionPreviewItemsFromTranscriptAsync as t };
