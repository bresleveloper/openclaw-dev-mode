import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { i as readPendingUserTurnTranscriptAdmission, n as getUserTurnTranscriptAdmissionOwner } from "./user-turn-transcript-admission-BZunVvZI.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-transcript-read-fence.ts
const transcriptReadFenceStorage = new AsyncLocalStorage();
function isSameTranscriptStore(left, right) {
	return left === right || isSameOpenClawAgentDatabasePath(left, right);
}
const questionAnswerStorage = new AsyncLocalStorage();
/** Answer custody outlives question registration, but never the creator's admitted run. */
function withSessionTranscriptQuestionAnswers(recorder, assertActive, run) {
	const scope = {
		recorder,
		assertActive,
		inputs: /* @__PURE__ */ new Map()
	};
	return questionAnswerStorage.run(scope, () => run((source) => {
		scope.assertActive();
		const creator = scope.recorder && getUserTurnTranscriptAdmissionOwner(scope.recorder);
		const original = creator?.receipt();
		const input = readPendingUserTurnTranscriptAdmission(source);
		if (original && input && !creator?.blocked() && input.agentId === original.agentId && input.sessionId === original.sessionId && input.sessionKey === original.sessionKey && isSameTranscriptStore(input.storePath, original.storePath) && input.generation === original.generation) scope.inputs.set(input.entryId, input);
	}));
}
function captureSessionTranscriptQuestionAnswers(database, sessionId, admittedUserId) {
	const scope = questionAnswerStorage.getStore();
	const answers = [...scope?.inputs.values() ?? []].filter((input) => isSameTranscriptStore(input.storePath, database.path) && input.sessionId === sessionId);
	if (!scope || answers.length === 0) return;
	const assertCurrent = () => {
		scope.assertActive();
		const creator = scope.recorder && getUserTurnTranscriptAdmissionOwner(scope.recorder);
		const original = creator?.receipt();
		if (!original || creator?.blocked() || !answers.every((input) => original.agentId === input.agentId && original.sessionId === input.sessionId && original.sessionKey === input.sessionKey && isSameTranscriptStore(original.storePath, input.storePath) && original.generation === input.generation && (admittedUserId === void 0 || original.entryId === admittedUserId))) throw new SqliteTranscriptMutationConflictError(sessionId);
	};
	assertCurrent();
	return {
		answers,
		assertCurrent
	};
}
function runWithSessionTranscriptReadFence(receipt, run) {
	return receipt ? transcriptReadFenceStorage.run(receipt, run) : run();
}
function withoutSessionTranscriptReadFence(run) {
	return transcriptReadFenceStorage.exit(run);
}
function withSessionContextAdmission(target, admission, read) {
	if (admission && (target.agentId !== admission.agentId || target.sessionId !== admission.sessionId || target.sessionKey !== admission.sessionKey)) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different transcript target");
	return runWithSessionTranscriptReadFence(admission, read);
}
function resolveSessionTranscriptReadFence(session) {
	const receipt = transcriptReadFenceStorage.getStore();
	return receipt?.agentId === session.agentId && receipt.sessionId === session.sessionId ? receipt : void 0;
}
function resolveSqliteSessionTranscriptReadFence(params) {
	const receipt = resolveSessionTranscriptReadFence(params);
	if (!receipt) return;
	if (receipt.role !== "user") throw new SessionTranscriptReadFenceError(`Current-turn transcript admission is not a user message: ${receipt.entryId}`);
	if (!isSameTranscriptStore(params.database.path, receipt.storePath)) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different transcript store");
	if (params.sessionKey !== void 0 && params.sessionKey !== receipt.sessionKey) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different session key");
	return {
		admission: receipt,
		beforeActiveMessagePosition: receipt.activeMessagePosition,
		beforeRawSeq: receipt.rawSeq
	};
}
//#endregion
export { withSessionContextAdmission as a, runWithSessionTranscriptReadFence as i, resolveSessionTranscriptReadFence as n, withSessionTranscriptQuestionAnswers as o, resolveSqliteSessionTranscriptReadFence as r, withoutSessionTranscriptReadFence as s, captureSessionTranscriptQuestionAnswers as t };
