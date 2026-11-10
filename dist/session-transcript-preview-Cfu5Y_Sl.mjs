import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as buildSessionPreviewItems } from "./session-display-projection-DDhSj356.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { a as resolveSqliteTranscriptReadScope, r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-BT22ajgI.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { t as readBoundedSessionPreviewItemsAsync } from "./session-transcript-preview-reader-KQUUf6-W.mjs";
//#region src/gateway/session-transcript-preview.ts
/** Previews use the selected history backend and retain the existing model-context projection. */
async function readSessionPreviewItemsFromTranscriptAsync(scope, maxItems, maxChars, view = "display") {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		if (memory.missing) return [];
		return view === "display" ? (await memory.read("session.history.preview", {
			maxItems,
			maxChars
		})).items : readSessionModelPreviewItems(memory.target, maxItems, maxChars);
	}
	const target = prepareSessionTranscriptReadTargetCore(scope);
	if (view === "model-context") {
		const { agentId, sessionKey, storePath } = target;
		const sessionId = scope.sessionId;
		if (!agentId || !sessionKey || !storePath) throw new Error("Model-context preview requires an exact session target");
		return readSessionModelPreviewItems(captureSessionTranscriptTargetBinding({
			agentId,
			sessionId,
			sessionKey,
			storePath,
			...scope.env ? { env: scope.env } : {}
		}), maxItems, maxChars);
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
	const entryValidationKey = target.entryValidationScope ? resolveSqliteScope({
		agentId: resolved.agentId,
		sessionKey: target.entryValidationScope.sessionKey
	}).sessionKey : void 0;
	const admission = resolveSessionTranscriptReadFence(resolved);
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-D7sVp2qp.mjs");
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
function readSessionModelPreviewItems(target, maxItems, maxChars) {
	return readBoundedSessionPreviewItemsAsync(maxItems, async (maxEvents, maxBytes) => {
		let truncated = false;
		const manager = await SessionManager.openBoundedAsync(target, {
			maxEvents,
			maxBytes,
			onTruncated: () => {
				truncated = true;
			}
		});
		return {
			items: buildSessionPreviewItems(manager.buildSessionContext().messages, maxItems, maxChars, "model-context"),
			hasOlderEvents: truncated
		};
	});
}
//#endregion
export { readSessionPreviewItemsFromTranscriptAsync as t };
