import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { t as SqliteJsonlReadBudgetExceededError } from "./sqlite-jsonl-budget-xL35jxX5.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-DfxRHzep.mjs";
//#region src/config/sessions/session-history-worker-errors.ts
/** A later display reset may leave this failed visibility lookup unconsumed. */
var SessionHistoryDeltaPreparationError = class extends Error {
	constructor(partial, cause) {
		super("Session history visibility preparation failed", { cause });
		this.partial = partial;
	}
};
function encodeSessionTranscriptWorkerError(error) {
	if (error instanceof SqliteJsonlReadBudgetExceededError) return {
		kind: "jsonl-budget",
		message: error.message
	};
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
		sessionId: error.sessionId,
		...error.reason === "window-changed" ? { reason: error.reason } : {}
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
function encodeSessionTranscriptRequestError(error, request) {
	if (error instanceof SessionHistoryDeltaPreparationError && request.kind === "history-page" && request.request.kind === "delta") return {
		kind: "delta-visibility",
		partial: error.partial
	};
	if (error instanceof SyntaxError && request.kind === "history-page" && (request.request.kind === "message-lookup" || request.request.kind === "message-by-id" || request.request.kind === "message-count" || request.request.kind === "artifacts" || request.request.kind === "message-page" || request.request.kind === "around-id" || request.request.kind === "source-messages" || request.request.kind === "recent-page")) return {
		kind: "syntax",
		message: error.message
	};
	return encodeSessionTranscriptWorkerError(error);
}
function unwrapSessionTranscriptWorkerReply(reply) {
	if (reply.ok) return reply.value;
	if (reply.error.kind === "delta-visibility") throw new SessionHistoryDeltaPreparationError(reply.error.partial);
	throw decodeSessionTranscriptWorkerReadError(reply.error);
}
/** Decode a positively identified domain failure without classifying transport rejections. */
function decodeSessionTranscriptWorkerReadError(failure) {
	if (failure.kind === "jsonl-budget") return new SqliteJsonlReadBudgetExceededError(failure.message);
	if (failure.kind === "read-error") {
		const error = new Error(failure.message);
		retainOpenClawStateWorkerErrorPayload(error, failure.payload);
		return hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
	}
	if (failure.kind === "storage") return new SessionTranscriptStorageUnavailableError(failure.reason);
	if (failure.kind === "cold") return new SessionTranscriptColdError(failure.sessionId);
	if (failure.kind === "projection") return new SessionTranscriptProjectionUnavailableError(failure.sessionId, failure.reason);
	if (failure.kind === "syntax") return new SyntaxError(failure.message);
	return new SessionTranscriptReadFenceError(failure.message);
}
/** Keep read and cleanup failures together through the worker error graph. */
function sessionHistoryCleanupError(error, cleanupError, stage) {
	return new AggregateError([error, cleanupError], `${coerceErrorMessage(error)}; ${stage} failed: ${coerceErrorMessage(cleanupError)}`, { cause: cleanupError });
}
//#endregion
export { sessionHistoryCleanupError as a, encodeSessionTranscriptWorkerError as i, decodeSessionTranscriptWorkerReadError as n, unwrapSessionTranscriptWorkerReply as o, encodeSessionTranscriptRequestError as r, SessionHistoryDeltaPreparationError as t };
