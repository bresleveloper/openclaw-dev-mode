import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { u as transcriptEventNavigationSql } from "./transcript-payload-qsg5dB6v.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/sessions/user-turn-transcript-admission.ts
const admissionOwners = /* @__PURE__ */ new WeakMap();
function registerUserTurnTranscriptAdmissionOwner(recorder, owner) {
	admissionOwners.set(recorder, owner);
}
function getUserTurnTranscriptAdmissionOwner(recorder) {
	return admissionOwners.get(recorder);
}
/** Snapshot only the factory-owned input that has not crossed its foreground model boundary. */
function readPendingUserTurnTranscriptAdmission(recorder) {
	const owner = recorder ? admissionOwners.get(recorder) : void 0;
	if (!owner || owner.blocked() || owner.sentToProvider()) return;
	const receipt = owner.receipt();
	return receipt ? { ...receipt } : void 0;
}
function resolveUserTurnTranscriptAdmission(params) {
	return "logicalTurnId" in params.receipt ? params.receipt : {
		...params.receipt,
		logicalTurnId: params.logicalTurnId,
		role: "user"
	};
}
//#endregion
//#region src/config/sessions/session-transcript-read-fence.ts
const transcriptReadFenceStorage = new AsyncLocalStorage();
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
		if (original && input && !creator?.blocked() && input.agentId === original.agentId && input.sessionId === original.sessionId && input.sessionKey === original.sessionKey && input.storePath === original.storePath && input.generation === original.generation) scope.inputs.set(input.entryId, input);
	}));
}
function resolveSessionTranscriptQuestionAnswer(database, sessionId, entryId, admittedUserId) {
	const scope = questionAnswerStorage.getStore();
	const input = scope?.inputs.get(entryId);
	if (!scope || !input || input.storePath !== database.path || input.sessionId !== sessionId) return;
	scope.assertActive();
	const creator = scope.recorder && getUserTurnTranscriptAdmissionOwner(scope.recorder);
	const original = creator?.receipt();
	return original && !creator?.blocked() && original.agentId === input.agentId && original.sessionId === input.sessionId && original.sessionKey === input.sessionKey && original.storePath === input.storePath && original.generation === input.generation && (admittedUserId === void 0 || original.entryId === admittedUserId) ? input : void 0;
}
var SessionTranscriptReadFenceError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SessionTranscriptReadFenceError";
	}
};
function runWithSessionTranscriptReadFence(receipt, run) {
	return receipt ? transcriptReadFenceStorage.run(receipt, run) : run();
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
	if (params.database.path !== receipt.storePath) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different transcript store");
	if (params.sessionKey !== void 0 && params.sessionKey !== receipt.sessionKey) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different session key");
	const db = getNodeSqliteKysely(params.database.db);
	const boundary = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).select([
		"identity.seq",
		"identity.parent_id",
		"active.message_position",
		"rewrite.generation",
		sql`json_extract(${transcriptEventNavigationSql("event")}, '$.type')`.as("event_type"),
		sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.role')`.as("message_role")
	]).where("identity.session_id", "=", params.sessionId).where("identity.event_id", "=", receipt.entryId).limit(1));
	if (boundary?.message_position === null || boundary?.message_position === void 0) throw new SessionTranscriptReadFenceError(`Current-turn transcript admission is no longer a visible message: ${receipt.entryId}`);
	if (boundary.generation !== receipt.generation || boundary.seq !== receipt.rawSeq || boundary.parent_id !== receipt.effectiveParentId || boundary.message_position !== receipt.activeMessagePosition) throw new SessionTranscriptReadFenceError(`Current-turn transcript admission identity changed: ${receipt.entryId}`);
	if (boundary.event_type !== "message" || boundary.message_role !== "user") throw new SessionTranscriptReadFenceError(`Current-turn transcript admission is not a user message: ${receipt.entryId}`);
	return {
		admission: receipt,
		beforeActiveMessagePosition: boundary.message_position,
		beforeRawSeq: boundary.seq
	};
}
//#endregion
export { runWithSessionTranscriptReadFence as a, getUserTurnTranscriptAdmissionOwner as c, resolveUserTurnTranscriptAdmission as d, resolveSqliteSessionTranscriptReadFence as i, readPendingUserTurnTranscriptAdmission as l, resolveSessionTranscriptQuestionAnswer as n, withSessionContextAdmission as o, resolveSessionTranscriptReadFence as r, withSessionTranscriptQuestionAnswers as s, SessionTranscriptReadFenceError as t, registerUserTurnTranscriptAdmissionOwner as u };
