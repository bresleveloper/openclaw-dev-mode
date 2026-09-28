import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
//#region src/auto-reply/reply/queue-policy.ts
/** Separates waiting messages from the queued turn that already owns execution. */
function resolveReplyQueueAdmissionState(queue, activeOperation) {
	if (!queue) return "empty";
	const queuedTurnOwnsExecution = activeOperation?.turnKind === "queued_followup" && activeOperation.result === null;
	return queue.items.some((item) => !item.steerPending && !(queuedTurnOwnsExecution && queue.inFlight.has(item))) || !queuedTurnOwnsExecution && queue.inFlight.size > 0 || queue.droppedCount > 0 ? "ready" : "steering";
}
/** Resolves whether an active session should run, queue, or drop a new inbound turn. */
function resolveActiveRunQueueAction(params) {
	if (!params.isActive && (!params.queueAdmissionState || params.queueAdmissionState === "empty")) return "run-now";
	if (params.isHeartbeat) return "drop";
	if (params.resetTriggered) return "run-now";
	if (params.queueAdmissionState && params.queueAdmissionState !== "empty") return "enqueue-followup";
	if (params.shouldFollowup) return "enqueue-followup";
	return "run-now";
}
//#endregion
//#region src/auto-reply/reply/typing-mode.ts
/** Group chats default to message-triggered typing to avoid noisy indicators. */
const DEFAULT_GROUP_TYPING_MODE = "message";
/** Resolves the effective typing mode for the current auto-reply turn. */
function resolveTypingMode({ configured, isGroupChat, wasMentioned, isHeartbeat, typingPolicy, suppressTyping, sourceReplyDeliveryMode }) {
	if (isHeartbeat || typingPolicy === "heartbeat" || typingPolicy === "system_event" || typingPolicy === "internal_webchat" || suppressTyping) return "never";
	if (configured) return configured;
	if (sourceReplyDeliveryMode === "message_tool_only") return "instant";
	if (!isGroupChat || wasMentioned) return "instant";
	return DEFAULT_GROUP_TYPING_MODE;
}
/** Creates a typing signaler that starts or refreshes typing from stream events. */
function createTypingSignaler(params) {
	const { typing, mode, isHeartbeat } = params;
	const shouldStartImmediately = mode === "instant";
	const shouldStartOnMessageStart = mode === "message";
	const shouldStartOnText = mode === "message" || mode === "instant";
	const shouldStartOnReasoning = mode === "thinking";
	const disabled = isHeartbeat || mode === "never";
	let hasRenderableText = false;
	const isRenderableText = (text) => {
		const trimmed = normalizeOptionalString(text);
		if (!trimmed) return false;
		return !isSilentReplyText(trimmed, SILENT_REPLY_TOKEN);
	};
	const signalRunStart = async () => {
		if (disabled || !shouldStartImmediately) return;
		await typing.startTypingLoop();
	};
	const signalMessageStart = async () => {
		if (disabled || !shouldStartOnMessageStart) return;
		if (!hasRenderableText) return;
		await typing.startTypingLoop();
	};
	const signalTextDelta = async (text) => {
		if (disabled) return;
		if (!isRenderableText(text)) return;
		hasRenderableText = true;
		if (shouldStartOnText) {
			await typing.startTypingOnText(text);
			return;
		}
		if (shouldStartOnReasoning) {
			if (!typing.isActive()) await typing.startTypingLoop();
			typing.refreshTypingTtl();
		}
	};
	const signalReasoningDelta = async () => {
		if (disabled || !shouldStartOnReasoning) return;
		await typing.startTypingLoop();
		typing.refreshTypingTtl();
	};
	const signalToolStart = async () => {
		if (disabled) return;
		if (!typing.isActive()) {
			if (shouldStartOnMessageStart && !hasRenderableText) return;
			await typing.startTypingLoop();
			typing.refreshTypingTtl();
			return;
		}
		typing.refreshTypingTtl();
	};
	const signalExecutionActivity = async () => {
		if (disabled) return;
		if (!typing.isActive()) await typing.startTypingLoop();
		typing.refreshTypingTtl();
	};
	return {
		mode,
		shouldStartImmediately,
		shouldStartOnMessageStart,
		shouldStartOnText,
		shouldStartOnReasoning,
		signalRunStart,
		signalMessageStart,
		signalTextDelta,
		signalReasoningDelta,
		signalToolStart,
		signalExecutionActivity
	};
}
//#endregion
export { resolveReplyQueueAdmissionState as i, resolveTypingMode as n, resolveActiveRunQueueAction as r, createTypingSignaler as t };
