import { i as logVerbose } from "./globals-BElpud1m.js";
import { d as resolveStorePath } from "./paths-C2C4lJH6.js";
import "./runtime-env-Ds0QYZS5.js";
import "./session-store-runtime-DhRD848I.js";
import { h as resolveTelegramMessageCacheScope, u as createTelegramMessageCache } from "./sent-message-cache-Dq5nnMnr.js";
//#region extensions/telegram/src/outbound-message-context.ts
function resolveTelegramPromptContextTimestampMs(payload) {
	const timestamp = (payload.channelData?.telegram)?.promptContextTimestampMs;
	return typeof timestamp === "number" && Number.isFinite(timestamp) ? timestamp : void 0;
}
function withTelegramPromptContextTimestampMs(payload, timestampMs) {
	if (timestampMs === void 0) return payload;
	const telegramData = payload.channelData?.telegram;
	return {
		...payload,
		channelData: {
			...payload.channelData,
			telegram: {
				...telegramData,
				promptContextTimestampMs: timestampMs
			}
		}
	};
}
const outboundGroupHistoryRecorders = /* @__PURE__ */ new Map();
function registerTelegramOutboundGroupHistoryRecorder(params) {
	outboundGroupHistoryRecorders.set(params.accountId, params.recorder);
	return () => {
		if (outboundGroupHistoryRecorders.get(params.accountId) === params.recorder) outboundGroupHistoryRecorders.delete(params.accountId);
	};
}
function resolveOutboundCacheMessageTimestamp(msg) {
	if (typeof msg.openclaw_prompt_context_timestamp_ms === "number" && Number.isFinite(msg.openclaw_prompt_context_timestamp_ms)) return msg.openclaw_prompt_context_timestamp_ms;
	return typeof msg.date === "number" && Number.isFinite(msg.date) ? msg.date * 1e3 : void 0;
}
function inferTelegramChatType(chatId) {
	return String(chatId).startsWith("-") ? "supergroup" : "private";
}
function buildOutboundCacheMessage(params) {
	const chat = params.message.chat ?? {};
	const text = params.message.text ?? params.message.caption ?? params.text;
	return {
		...params.message,
		message_id: params.messageId,
		...params.promptContextTimestampMs !== void 0 ? { openclaw_prompt_context_timestamp_ms: params.promptContextTimestampMs } : {},
		date: typeof params.message.date === "number" && Number.isFinite(params.message.date) ? params.message.date : Math.floor(Date.now() / 1e3),
		chat: {
			id: chat.id ?? params.chatId,
			type: chat.type ?? inferTelegramChatType(params.chatId),
			...chat.title ? { title: chat.title } : {},
			...chat.username ? { username: chat.username } : {}
		},
		from: params.message.from ?? {
			id: 0,
			is_bot: true,
			first_name: params.account.name ?? "OpenClaw"
		},
		...text ? { text } : {},
		...params.messageThreadId !== void 0 ? { message_thread_id: params.messageThreadId } : {}
	};
}
async function recordOutboundMessageForPromptContext(params) {
	try {
		const cacheMessage = buildOutboundCacheMessage(params);
		await createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveStorePath(params.cfg.session?.store)) }).record({
			accountId: params.account.accountId,
			chatId: params.chatId,
			msg: cacheMessage,
			...params.messageThreadId !== void 0 ? { threadId: params.messageThreadId } : {}
		});
		const timestamp = resolveOutboundCacheMessageTimestamp(cacheMessage);
		outboundGroupHistoryRecorders.get(params.account.accountId)?.({
			chatId: params.chatId,
			messageId: params.messageId,
			text: params.text ?? cacheMessage.text ?? cacheMessage.caption,
			...params.messageThreadId !== void 0 ? { messageThreadId: params.messageThreadId } : {},
			...timestamp !== void 0 ? { timestamp } : {}
		});
	} catch (error) {
		logVerbose(`telegram: failed to record outbound message context: ${String(error)}`);
	}
}
//#endregion
export { withTelegramPromptContextTimestampMs as i, registerTelegramOutboundGroupHistoryRecorder as n, resolveTelegramPromptContextTimestampMs as r, recordOutboundMessageForPromptContext as t };
