import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton, r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
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
	if (!isRecord(message)) return;
	const metadata = isRecord(message["__openclaw"]) ? message["__openclaw"] : {};
	return normalizeOptionalString(metadata["runId"]);
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
	SESSION_TRANSCRIPT_LISTENERS.add(listener);
	return () => {
		SESSION_TRANSCRIPT_LISTENERS.delete(listener);
	};
}
/** Registers an internal listener for identity-only or file-backed transcript updates. */
function onInternalSessionTranscriptUpdate(listener) {
	INTERNAL_SESSION_TRANSCRIPT_LISTENERS.add(listener);
	return () => {
		INTERNAL_SESSION_TRANSCRIPT_LISTENERS.delete(listener);
	};
}
/** Emits a normalized transcript update to all registered listeners. */
function emitSessionTranscriptUpdate(update) {
	const nextUpdate = normalizeSessionTranscriptUpdate(update);
	if (!nextUpdate) return;
	SESSION_TRANSCRIPT_UPDATE_STATE.version += 1;
	const publicUpdate = projectPublicSessionTranscriptUpdate(nextUpdate);
	if (publicUpdate) emitPublicSessionTranscriptUpdate(publicUpdate);
	emitInternalTranscriptUpdate(nextUpdate);
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
function emitPublicSessionTranscriptUpdate(nextUpdate) {
	for (const listener of SESSION_TRANSCRIPT_LISTENERS) try {
		listener(nextUpdate);
	} catch {}
}
function emitInternalTranscriptUpdate(nextUpdate) {
	for (const listener of INTERNAL_SESSION_TRANSCRIPT_LISTENERS) try {
		listener(nextUpdate);
	} catch {}
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
export { readSessionTranscriptRunId as a, onSessionTranscriptUpdate as i, emitSessionTranscriptUpdate as n, readSessionTranscriptUpdateVersion as o, onInternalSessionTranscriptUpdate as r, resolveTerminalAssistantTranscriptRunId as s, attachSessionTranscriptRunId as t };
