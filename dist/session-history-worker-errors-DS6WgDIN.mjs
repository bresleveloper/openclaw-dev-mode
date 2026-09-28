import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-Crjo4FKU.mjs";
//#region src/config/sessions/session-history-worker-errors.ts
/** A later display reset may leave this failed visibility lookup unconsumed. */
var SessionHistoryDeltaPreparationError = class extends Error {
	constructor(partial, cause) {
		super("Session history visibility preparation failed", { cause });
		this.partial = partial;
	}
};
function encodeSessionTranscriptWorkerError(error) {
	if (error instanceof SessionTranscriptStorageUnavailableError) return {
		kind: "storage",
		reason: error.reason
	};
	if (error instanceof SessionTranscriptColdError) return {
		kind: "cold",
		sessionId: error.sessionId
	};
	if (error instanceof SessionTranscriptProjectionUnavailableError) return {
		kind: "projection",
		sessionId: error.sessionId
	};
	if (error instanceof SessionTranscriptReadFenceError) return {
		kind: "fence",
		message: error.message
	};
	const payload = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
	return payload ? {
		kind: "read-error",
		message: coerceErrorMessage(error),
		payload
	} : void 0;
}
function unwrapSessionTranscriptWorkerReply(reply) {
	if (reply.ok) return reply.value;
	if (reply.error.kind === "delta-visibility") throw new SessionHistoryDeltaPreparationError(reply.error.partial);
	if (reply.error.kind === "read-error") {
		const error = new Error(reply.error.message);
		retainOpenClawStateWorkerErrorPayload(error, reply.error.payload);
		throw hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
	}
	if (reply.error.kind === "storage") throw new SessionTranscriptStorageUnavailableError(reply.error.reason);
	if (reply.error.kind === "cold") throw new SessionTranscriptColdError(reply.error.sessionId);
	if (reply.error.kind === "projection") throw new SessionTranscriptProjectionUnavailableError(reply.error.sessionId);
	if (reply.error.kind === "syntax") throw new SyntaxError(reply.error.message);
	throw new SessionTranscriptReadFenceError(reply.error.message);
}
/** Keep read and cleanup failures together through the worker error graph. */
function sessionHistoryCleanupError(error, cleanupError, stage) {
	return new AggregateError([error, cleanupError], `${coerceErrorMessage(error)}; ${stage} failed: ${coerceErrorMessage(cleanupError)}`, { cause: cleanupError });
}
//#endregion
export { unwrapSessionTranscriptWorkerReply as i, encodeSessionTranscriptWorkerError as n, sessionHistoryCleanupError as r, SessionHistoryDeltaPreparationError as t };
