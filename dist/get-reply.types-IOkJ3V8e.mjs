import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as SILENT_REPLY_TOKEN, s as isSilentReplyText } from "./tokens-D4ghQG_g.mjs";
import { d as getCommandOwnerAuthority } from "./command-auth-DyjyIT4u.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
//#region src/auto-reply/reply/queue-policy.ts
/** Resolves whether an active session should run, queue, or drop a new inbound turn. */
function resolveActiveRunQueueAction(params) {
	if (!params.isActive && !params.hasQueuedFollowups) return "run-now";
	if (params.isHeartbeat) return "drop";
	if (params.resetTriggered) return "run-now";
	return params.hasQueuedFollowups || params.shouldFollowup ? "enqueue-followup" : "run-now";
}
//#endregion
//#region src/auto-reply/reply/typing-mode.ts
/** Resolves the effective typing mode for the current auto-reply turn. */
function resolveTypingMode({ configured, isGroupChat, wasMentioned, isHeartbeat, typingPolicy, suppressTyping, sourceReplyDeliveryMode }) {
	if (isHeartbeat || typingPolicy === "heartbeat" || typingPolicy === "system_event" || typingPolicy === "internal_webchat" || suppressTyping) return "never";
	if (configured) return configured;
	if (sourceReplyDeliveryMode === "message_tool_only") return "instant";
	if (!isGroupChat || wasMentioned) return "instant";
	return "message";
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
	const refreshTyping = async (allowStart) => {
		if (!typing.isActive()) {
			if (!allowStart) return;
			await typing.startTypingLoop();
		}
		typing.refreshTypingTtl();
	};
	const isRenderableText = (text) => {
		const trimmed = normalizeOptionalString(text);
		if (!trimmed) return false;
		return !isSilentReplyText(trimmed, SILENT_REPLY_TOKEN);
	};
	return {
		mode,
		shouldStartImmediately,
		shouldStartOnMessageStart,
		shouldStartOnText,
		shouldStartOnReasoning,
		async signalRunStart() {
			if (!disabled && shouldStartImmediately) await typing.startTypingLoop();
		},
		async signalMessageStart() {
			if (!disabled && shouldStartOnMessageStart && hasRenderableText) await typing.startTypingLoop();
		},
		async signalTextDelta(text) {
			if (disabled || !isRenderableText(text)) return;
			hasRenderableText = true;
			if (shouldStartOnText) await typing.startTypingOnText(text);
			else if (shouldStartOnReasoning) await refreshTyping(true);
		},
		async signalReasoningDelta() {
			if (disabled || !shouldStartOnReasoning) return;
			await typing.startTypingLoop();
			typing.refreshTypingTtl();
		},
		async signalToolStart() {
			if (!disabled) await refreshTyping(!shouldStartOnMessageStart || hasRenderableText);
		},
		async signalExecutionActivity() {
			if (!disabled) await refreshTyping(true);
		}
	};
}
//#endregion
//#region src/auto-reply/reply/get-reply.types.ts
/** Pin the host-issued source before public options cross asynchronous preparation. */
function prepareInternalGetReplyOptions(opts, context) {
	const channelAuthority = context && getCommandOwnerAuthority(context)?.operatorAuthority;
	if (!opts && !channelAuthority) return;
	const { operatorAuthority = channelAuthority, ...options } = opts ?? {};
	if (operatorAuthority !== void 0) {
		assertAdmittedRunOperatorAuthority(operatorAuthority);
		operatorAuthority.assertCurrent();
	}
	return {
		...options,
		operatorAuthority
	};
}
function withExtractedFileImages(opts, extractedFileImages) {
	if (!extractedFileImages || extractedFileImages.length === 0) return opts;
	return {
		...opts,
		extractedFileImages: [...opts?.extractedFileImages ?? [], ...extractedFileImages]
	};
}
function shouldBridgeCliPreambleEvents(opts) {
	return opts?.commentaryProgressEnabled === true || opts?.progressPreambleEnabled === true;
}
//#endregion
export { resolveTypingMode as a, createTypingSignaler as i, shouldBridgeCliPreambleEvents as n, resolveActiveRunQueueAction as o, withExtractedFileImages as r, prepareInternalGetReplyOptions as t };
