import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { a as runWithSessionTranscriptReadFence, o as withSessionContextAdmission, r as resolveSessionTranscriptReadFence, t as SessionTranscriptReadFenceError } from "../session-transcript-read-fence-Crjo4FKU.mjs";
import { a as validateSessionTranscriptContextVersion, r as validateSessionTranscriptContextAdmission, t as readSessionTranscriptContextMessages } from "../session-accessor.sqlite-model-context-Dxi3aFzy.mjs";
//#region src/plugin-sdk/codex-session-transcript-runtime.ts
/** The native evidence consumer remains lazy inside one readonly transcript snapshot. */
function readCodexSessionContext(target, read, admission) {
	return withSessionContextAdmission(target, admission, () => readSessionTranscriptContextMessages(target, read));
}
/** Reads the bundled Codex mirror strictly before one admitted user row. */
async function readCodexSessionTranscriptEventsBeforeAdmission(params, admission) {
	const { readSessionTranscriptEvents, resolveSessionTranscriptIdentity } = await import("./session-transcript-runtime.js");
	const target = await resolveSessionTranscriptIdentity(params);
	if (target.agentId !== admission.agentId || target.sessionId !== admission.sessionId || target.sessionKey !== admission.sessionKey) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different transcript target");
	return await runWithSessionTranscriptReadFence(admission, async () => await readSessionTranscriptEvents(params));
}
/** Runs the bundled Codex mirror under the transcript writer lock. */
async function withCodexSessionTranscriptMirrorWriteLock(params, run) {
	const { withProjectedSessionTranscriptWriteLock } = await import("../session-transcript-lock-runtime-CynOeq45.mjs");
	return await withProjectedSessionTranscriptWriteLock(params, run, (context, locked) => ({
		...context,
		appendMessageWithMessageSequence: (options) => locked.appendMessageWithMessageSequence({
			...options,
			...params.config !== void 0 ? { config: params.config } : {}
		}),
		readMessageFacts: async (factParams) => {
			const facts = await locked.readMessageFacts(factParams);
			const messagesByIdempotencyKey = /* @__PURE__ */ new Map();
			for (const [idempotencyKey, message] of facts.messagesByIdempotencyKey) if (isAgentMessageRecord(message)) messagesByIdempotencyKey.set(idempotencyKey, message);
			return {
				...facts,
				messagesByIdempotencyKey
			};
		}
	}));
}
function isAgentMessageRecord(value) {
	return isRecord(value) && typeof value.role === "string" && value.role.trim().length > 0;
}
//#endregion
export { SessionTranscriptReadFenceError, resolveSessionTranscriptReadFence as captureCodexSessionTranscriptReadAdmission, readCodexSessionContext, readCodexSessionTranscriptEventsBeforeAdmission, validateSessionTranscriptContextVersion as validateCodexSessionTranscriptContextVersion, validateSessionTranscriptContextAdmission as validateCodexSessionTranscriptReadAdmission, withCodexSessionTranscriptMirrorWriteLock };
