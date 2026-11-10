import { m as SessionPendingInputCustodyError, s as ModelSelectionLockedError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { n as SessionGoalOperationError, t as SESSION_GOAL_OPERATION_ERROR_CODES } from "./goals-operations.types-DnxMqPtA.mjs";
import { n as SqliteSessionMutationConflictError, r as SqliteTranscriptMutationConflictError, t as SessionEntryLifecycleUpsertConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { i as SessionWorkStartChangedError } from "./work-start-error-BI-UhSB2.mjs";
//#region src/config/sessions/session-actor-storage-result.ts
/** The write settled; callers must not retry it as a rolled-back operation. */
var SessionActorStorageCommittedError = class extends Error {
	constructor(outcome) {
		super(outcome.failure?.message ?? "Session actor publication failed after commit");
		this.outcome = outcome;
		this.name = "SessionActorStorageCommittedError";
	}
};
function readSessionActorStorageResult(outcome) {
	if (outcome.kind === "committed") {
		if (outcome.failure) throw new SessionActorStorageCommittedError(outcome);
		return outcome.value;
	}
	const error = outcome.error;
	switch (error.name) {
		case "SessionWorkStartChangedError": throw new SessionWorkStartChangedError(error.message);
		case "ModelSelectionLockedError": throw new ModelSelectionLockedError(error.message);
		case "SqliteTranscriptMutationConflictError": throw new SqliteTranscriptMutationConflictError(error.sessionId ?? "");
		case "SqliteSessionMutationConflictError": throw new SqliteSessionMutationConflictError(error.operationLabel ?? "");
		case "SessionEntryLifecycleUpsertConflictError": throw new SessionEntryLifecycleUpsertConflictError(error.sessionKey ?? "");
		case "SessionTranscriptWriterClaimReboundError": throw new SessionTranscriptWriterClaimReboundError(error.refusal);
		case "SessionPendingInputCustodyError": throw new SessionPendingInputCustodyError(error.message);
		case "SessionTranscriptReadFenceError": throw new SessionTranscriptReadFenceError(error.message);
		case "BoardValidationError":
			if (error.code === "conflict" || error.code === "invalid_operation" || error.code === "not_found") throw new BoardValidationError(error.code, error.message);
			break;
		case "SessionGoalOperationError":
			for (const code of SESSION_GOAL_OPERATION_ERROR_CODES) if (error.code === code) throw new SessionGoalOperationError(code, error.message);
			break;
		case "SyntaxError": throw new SyntaxError(error.message);
		case "RangeError": throw new RangeError(error.message);
		case "TypeError": throw new TypeError(error.message);
	}
	throw Object.assign(new Error(error.message), { name: error.name });
}
//#endregion
export { readSessionActorStorageResult as t };
