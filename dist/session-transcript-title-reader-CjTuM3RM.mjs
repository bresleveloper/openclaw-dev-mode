import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-BT22ajgI.mjs";
//#region src/gateway/session-transcript-title-reader.ts
const EMPTY_SESSION_TITLE_FIELDS = {
	firstUserMessage: null,
	lastMessagePreview: null
};
/** Reuse the bounded title cache in the existing history worker without transporting session metadata. */
async function readSessionTitleFieldsFromTranscriptAsync(scope, opts) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) return memory.missing ? { ...EMPTY_SESSION_TITLE_FIELDS } : (await memory.read("session.history.title", { includeInterSession: opts?.includeInterSession })).fields;
	const target = prepareSessionTranscriptReadTargetCore(scope);
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
	const admission = resolveSessionTranscriptReadFence(resolved);
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-D7sVp2qp.mjs");
	try {
		return await withSessionHistoryWorkerDatabase(options, (owner) => owner.readTitleFields({
			scope: {
				...readScope,
				storePath: databasePath
			},
			...opts?.includeInterSession ? { includeInterSession: true } : {},
			...admission ? { admission: { ...admission } } : {}
		}));
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error)) {
			startSessionTranscriptIndexReconcile({
				...options,
				preferredSessionId: resolved.sessionId
			});
			return { ...EMPTY_SESSION_TITLE_FIELDS };
		}
		throw error;
	}
}
//#endregion
export { readSessionTitleFieldsFromTranscriptAsync as t };
