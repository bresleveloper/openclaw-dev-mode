import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { c as SqliteWorkerError, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { t as captureSessionMessageAdmission } from "./session-manager-message-admission-EoHliJb3.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { n as SessionManagerActorCommittedError } from "./session-manager-persistence-error-uXrnbG-q.mjs";
import { n as unwrapSessionManagerPublication } from "./session-manager-publication-vZ305gn3.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/sessions/session-manager-actor-append.ts
/** One prepared append, with native commit evidence retained before caller publication. */
async function appendSessionManagerActor(input) {
	const { actor, assertCurrent } = input;
	const admission = captureSessionMessageAdmission(assertCurrent, input);
	const append = input.append.kind === "message" ? {
		...input.append,
		input: {
			...input.append.input,
			...admission.control
		}
	} : {
		...input.append,
		input: {
			...input.append.input,
			...input.append.input.message ? { message: {
				...input.append.input.message,
				...admission.control
			} } : {}
		}
	};
	const authority = {
		assertCurrent,
		authorize: (stage, _facts, nativeFacts) => {
			assertCurrent();
			admission.assertAdmission(unwrapSessionManagerPublication({
				stage,
				facts: nativeFacts
			}));
			assertCurrent();
		}
	};
	assertCurrent();
	let captured;
	let outcome;
	try {
		const observer = { committed: (value) => {
			captured = value;
			if (value.receipt.transcript.append) input.onCommitted?.(value.receipt.transcript.append);
		} };
		const command = {
			commandId: randomUUID(),
			phaseId: "session-manager.append",
			append
		};
		outcome = input.toolResult ? await actor.appendToolResult(command, authority, observer) : await actor.appendTranscriptEvent(command, authority, observer);
	} catch (cause) {
		if (!captured) {
			if (hasSqliteWorkerOutcomeUnknown(cause)) {
				const error = cause instanceof Error ? cause : new Error("Session actor append outcome is unknown", { cause });
				recordModelFallbackStop(error);
				throw error;
			}
			throw cause;
		}
		return finish(captured, cause);
	}
	if (captured && outcome.kind !== "committed") return finish(captured, /* @__PURE__ */ new Error("Session actor reply contradicted its captured commit"));
	if (outcome.kind === "unknown") {
		const error = new SqliteWorkerError(outcome.error.message, "outcome-unknown");
		recordModelFallbackStop(error);
		throw error;
	}
	if (outcome.kind === "rolled-back" || outcome.kind === "stale-version") {
		if (outcome.error.name === "SessionTranscriptWriterClaimReboundError") throw new SessionTranscriptWriterClaimReboundError();
		if (outcome.error.name === "SqliteTranscriptMutationConflictError") throw new SqliteTranscriptMutationConflictError(append.input.scope.sessionId);
		throw Object.assign(new Error(outcome.error.message), { name: outcome.error.name });
	}
	return finish(outcome, outcome.failure && Object.assign(new Error(outcome.failure.message), { name: outcome.failure.name }));
	function finish(committedOutcome, cause) {
		const committed = committedOutcome.receipt.transcript.append;
		if (!committed) {
			const error = new SqliteWorkerError("Session actor omitted its committed append snapshot", "outcome-unknown");
			recordModelFallbackStop(error);
			throw error;
		}
		let failure = cause;
		try {
			admission.publish(committed.value.pendingInputReceipt);
		} catch (error) {
			failure = failure === void 0 ? error : new AggregateError([failure, error], "Committed append publication failed", { cause: failure });
		}
		return {
			committed,
			...failure !== void 0 ? { failure: new SessionManagerActorCommittedError(committed.kind === "metadata" ? "session.metadata.append" : "session.transcript.appendMessage", {
				ok: true,
				value: committed.value
			}, failure) } : {}
		};
	}
}
//#endregion
export { appendSessionManagerActor as t };
