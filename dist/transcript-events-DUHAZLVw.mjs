import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { a as resolveGlobalSingleton, i as resolveGlobalSet } from "./global-singleton-0m-JziJW.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
//#region src/sessions/transcript-events.ts
/** Persists authoritative run ownership on assistant and tool-result rows. */
function attachSessionTranscriptRunId(message, runId) {
	const normalizedRunId = normalizeOptionalString(runId);
	if (!normalizedRunId || !isRecord(message) || message.role !== "assistant" && message.role !== "toolResult") return message;
	const metadata = isRecord(message["__openclaw"]) ? message["__openclaw"] : {};
	if (metadata.runId === normalizedRunId) return message;
	return {
		...message,
		__openclaw: {
			...metadata,
			runId: normalizedRunId
		}
	};
}
/** Reads the run identity persisted on a transcript row, when one was attached. */
function readSessionTranscriptRunId(message) {
	return isRecord(message) ? normalizeOptionalString((asOptionalRecord(message["__openclaw"]) ?? {}).runId) : void 0;
}
/** Failure receipts precede assistant rows and carry their run identity in report details. */
function readSessionTranscriptFailureRunId(entry) {
	if (!isRecord(entry) || entry.type !== "custom_message" && entry.role !== "custom" || entry.customType !== "run-failed-before-reply" || !isRecord(entry.details)) return;
	return normalizeOptionalString(entry.details.runId);
}
/** Correlates only terminal assistant rows with the run that actually produced them. */
function resolveTerminalAssistantTranscriptRunId(message, runId) {
	const normalizedRunId = normalizeOptionalString(runId);
	if (!normalizedRunId || !isRecord(message) || message.role !== "assistant") return;
	if (message.stopReason === "toolUse" || Array.isArray(message.content) && message.content.some((block) => isRecord(block) && (block.type === "toolCall" || block.type === "toolUse" || block.type === "functionCall"))) return;
	return normalizedRunId;
}
const SESSION_TRANSCRIPT_LISTENERS = resolveGlobalSet(Symbol.for("openclaw.sessionTranscriptListeners"), "close-and-restart");
const INTERNAL_SESSION_TRANSCRIPT_LISTENERS = resolveGlobalSet(Symbol.for("openclaw.internalSessionTranscriptListeners"), "close-and-restart");
const SESSION_TRANSCRIPT_UPDATE_STATE = resolveGlobalSingleton(Symbol.for("openclaw.sessionTranscriptUpdateState"), () => ({ version: 0 }));
/** Monotonic fence for projections that embed transcript-derived fields (previews, titles). */
function readSessionTranscriptUpdateVersion() {
	return SESSION_TRANSCRIPT_UPDATE_STATE.version;
}
/** Registers a listener for normalized session transcript updates. */
function onSessionTranscriptUpdate(listener) {
	return registerListener(SESSION_TRANSCRIPT_LISTENERS, listener);
}
/** Registers an internal listener for identity-only or file-backed transcript updates. */
function onInternalSessionTranscriptUpdate(listener) {
	return registerListener(INTERNAL_SESSION_TRANSCRIPT_LISTENERS, listener);
}
/** Emits a normalized transcript update to all registered listeners. */
function emitSessionTranscriptUpdate(update) {
	const nextUpdate = normalizeSessionTranscriptUpdate(update);
	if (!nextUpdate) return;
	SESSION_TRANSCRIPT_UPDATE_STATE.version += 1;
	const publicUpdate = projectPublicSessionTranscriptUpdate(nextUpdate);
	if (publicUpdate) notifyListeners(SESSION_TRANSCRIPT_LISTENERS, publicUpdate);
	notifyListeners(INTERNAL_SESSION_TRANSCRIPT_LISTENERS, nextUpdate);
}
function normalizeSessionTranscriptUpdate(update) {
	const trimmed = normalizeOptionalString(update.sessionFile);
	const target = normalizeUpdateTarget(update);
	if (!trimmed && !target) return;
	const messageSeq = asPositiveSafeInteger(update.messageSeq);
	const sessionKey = normalizeOptionalString(update.sessionKey) ?? target?.sessionKey;
	const agentId = normalizeOptionalString(update.agentId) ?? target?.agentId;
	const sessionId = normalizeOptionalString(update.sessionId) ?? target?.sessionId;
	const lifecycleRevision = normalizeOptionalString(update.lifecycleRevision);
	const messageId = normalizeOptionalString(update.messageId);
	const runId = normalizeOptionalString(update.runId);
	return {
		...trimmed ? { sessionFile: trimmed } : {},
		...target ? { target } : {},
		...sessionKey ? { sessionKey } : {},
		...agentId ? { agentId } : {},
		...sessionId ? { sessionId } : {},
		...lifecycleRevision ? { lifecycleRevision } : {},
		...update.message !== void 0 ? { message: update.message } : {},
		...messageId ? { messageId } : {},
		...messageSeq !== void 0 ? { messageSeq } : {},
		...runId ? { runId } : {}
	};
}
function projectPublicSessionTranscriptUpdate(update) {
	const target = update.target;
	if (!target) return;
	return {
		target: {
			agentId: target.agentId,
			sessionId: target.sessionId,
			sessionKey: target.sessionKey
		},
		...update.sessionKey ? { sessionKey: update.sessionKey } : {},
		...update.agentId ? { agentId: update.agentId } : {},
		...update.sessionId ? { sessionId: update.sessionId } : {},
		...update.message !== void 0 ? { message: projectPublicSessionTranscriptMessage(update.message) } : {},
		...update.messageId ? { messageId: update.messageId } : {},
		...update.messageSeq !== void 0 ? { messageSeq: update.messageSeq } : {},
		...update.runId ? { runId: update.runId } : {}
	};
}
function projectPublicSessionTranscriptMessage(message) {
	if (!isRecord(message) || !Object.hasOwn(message, "providerReplay")) return message;
	const publicMessage = { ...message };
	delete publicMessage.providerReplay;
	return publicMessage;
}
function normalizeUpdateTarget(update) {
	const sessionKey = normalizeOptionalString(update.target?.sessionKey) ?? normalizeOptionalString(update.sessionKey);
	const agentId = normalizeOptionalString(update.target?.agentId) ?? normalizeOptionalString(update.agentId) ?? (sessionKey ? parseAgentSessionKey(sessionKey)?.agentId : void 0);
	const sessionId = normalizeOptionalString(update.target?.sessionId) ?? normalizeOptionalString(update.sessionId);
	const storePath = normalizeOptionalString(update.target?.storePath);
	if (!agentId || !sessionId || !sessionKey) return;
	return {
		agentId,
		sessionId,
		sessionKey,
		...storePath ? { storePath } : {}
	};
}
//#endregion
export { readSessionTranscriptFailureRunId as a, resolveTerminalAssistantTranscriptRunId as c, onSessionTranscriptUpdate as i, emitSessionTranscriptUpdate as n, readSessionTranscriptRunId as o, onInternalSessionTranscriptUpdate as r, readSessionTranscriptUpdateVersion as s, attachSessionTranscriptRunId as t };
