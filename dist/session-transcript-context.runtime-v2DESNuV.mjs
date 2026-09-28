import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { s as stripInlineDirectiveTagsForDelivery } from "./directive-tags-D9uZSb5h.mjs";
import { i as isSessionBoundaryCommandText } from "./command-detection-CzqdezWl.mjs";
import { i as readRecentUserAssistantTextForSession } from "./transcript-DEj31pAK.mjs";
//#region src/channels/inbound-event/session-transcript-context.runtime.ts
function messageKeys(message) {
	const id = typeof message.message_id === "string" ? message.message_id.trim() : "";
	const body = typeof message.body === "string" ? message.body.trim() : "";
	const timestamp = message.timestamp_ms;
	return [id ? `id:${id}` : "", body && typeof timestamp === "number" ? `text:${timestamp}:${body}` : ""].filter(Boolean);
}
function historyMessage(entry) {
	return {
		...entry.messageId ? { message_id: entry.messageId } : {},
		sender: entry.sender,
		...entry.timestamp !== void 0 ? { timestamp_ms: entry.timestamp } : {},
		body: entry.body
	};
}
function compareMessages(left, right) {
	return (typeof left.timestamp_ms === "number" ? left.timestamp_ms : 0) - (typeof right.timestamp_ms === "number" ? right.timestamp_ms : 0);
}
function mergeMessages(params) {
	const seen = new Set(params.existing.flatMap(messageKeys));
	const seenTranscript = /* @__PURE__ */ new Set();
	const added = [];
	for (const item of params.transcript) {
		if (item.transcriptId && params.dedupeTranscriptIds.has(item.transcriptId)) continue;
		const message = historyMessage(item.entry);
		const keys = messageKeys(message);
		const assistantTextKeys = item.role === "assistant" ? messageKeys({
			...message,
			body: stripInlineDirectiveTagsForDelivery(item.entry.body).text
		}) : keys;
		if (keys.some((key) => seenTranscript.has(key)) || item.role === "assistant" && assistantTextKeys.some((key) => params.dedupeAssistantTextKeys.has(key)) || item.role === "user" && keys.some((key) => seen.has(key))) continue;
		keys.forEach((key) => seenTranscript.add(key));
		added.push(message);
	}
	const sorted = [...added, ...params.existing].toSorted(compareMessages);
	if (sorted.length <= params.limit) return {
		added: added.length,
		messages: sorted
	};
	const pinned = sorted.filter((message) => message.is_reply_target === true);
	const available = Math.max(0, params.limit - pinned.length);
	const recent = available === 0 ? [] : sorted.filter((message) => message.is_reply_target !== true).slice(-available);
	return {
		added: added.length,
		messages: [...pinned.slice(-params.limit), ...recent].toSorted(compareMessages)
	};
}
function mergeableChatWindowEntries(ctx) {
	return (ctx.ChannelStructuredContext ?? []).filter((entry) => entry.type === "chat_window" && entry.sessionTranscriptMode !== "preserve" && Boolean(entry.payload) && typeof entry.payload === "object" && !Array.isArray(entry.payload));
}
/** Merges active canonical transcript turns into the prepared channel history in place. */
async function mergeSessionTranscriptContext(params) {
	const options = params.ctx.SessionTranscriptContext;
	const limit = Math.max(0, Math.floor(options?.historyLimit ?? 0));
	if (options?.historyKind === "recent" || limit === 0 || isSessionBoundaryCommandText(params.ctx.CommandBody ?? params.ctx.RawBody, { botUsername: params.ctx.BotUsername })) return;
	const agentId = params.agentId?.trim() || parseAgentSessionKey(params.sessionKey)?.agentId;
	if (!agentId) throw new Error("Session transcript context requires an agent owner.");
	const windows = mergeableChatWindowEntries(params.ctx);
	const turns = await readRecentUserAssistantTextForSession({
		agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		limit,
		...windows.length === 0 && options?.chatWindow === true ? { includeCronDirectDeliveryContext: true } : {},
		...(options?.beforeTimestampMs ?? params.ctx.Timestamp) !== void 0 ? { beforeTimestampMs: options?.beforeTimestampMs ?? params.ctx.Timestamp } : {},
		...options?.minTimestampMs !== void 0 ? { minTimestampMs: options.minTimestampMs } : {}
	});
	const labels = options?.senderLabels ?? {
		assistant: "Assistant",
		user: "User"
	};
	const transcript = turns.map((turn) => {
		const item = {
			entry: {
				sender: `${labels[turn.role]}${turn.sourceChannel ? ` (${turn.sourceChannel})` : ""}`,
				body: turn.text
			},
			role: turn.role
		};
		if (turn.id) {
			item.transcriptId = turn.id;
			item.entry.messageId = `session:${turn.id}`;
		}
		if (turn.timestamp !== void 0) item.entry.timestamp = turn.timestamp;
		return item;
	});
	if (transcript.length === 0) return;
	if (windows.length === 0 && options?.chatWindow) {
		params.ctx.ChannelStructuredContext = [...params.ctx.ChannelStructuredContext ?? [], {
			label: "Conversation context",
			source: "session",
			type: "chat_window",
			payload: {
				order: "chronological",
				relation: "selected_for_current_message",
				messages: transcript.map(({ entry }) => historyMessage(entry)).slice(-limit)
			}
		}];
		return;
	}
	if (windows.length === 0) {
		const existing = params.ctx.InboundHistory ?? [];
		const seen = new Set(existing.flatMap((entry) => messageKeys(historyMessage(entry))));
		const added = transcript.flatMap(({ entry }) => {
			const keys = messageKeys(historyMessage(entry));
			if (keys.some((key) => seen.has(key))) return [];
			keys.forEach((key) => seen.add(key));
			return [entry];
		});
		params.ctx.InboundHistory = [...existing, ...added].toSorted((left, right) => (left.timestamp ?? 0) - (right.timestamp ?? 0)).slice(-limit);
		return;
	}
	for (const window of windows) {
		const existing = Array.isArray(window.payload.messages) ? window.payload.messages.filter((message) => Boolean(message) && typeof message === "object" && !Array.isArray(message)) : [];
		const dedupeIds = window.sessionTranscriptDedupeMessageIds;
		const assistantTextKeys = window.sessionTranscriptAssistantTextDedupeKeys;
		const merged = mergeMessages({
			existing,
			transcript,
			dedupeTranscriptIds: Array.isArray(dedupeIds) ? new Set(dedupeIds.filter((id) => typeof id === "string")) : /* @__PURE__ */ new Set(),
			dedupeAssistantTextKeys: new Set(assistantTextKeys ?? []),
			limit
		});
		window.payload = {
			...window.payload,
			messages: merged.messages
		};
		if (merged.added > 0) window.source = "session";
	}
}
//#endregion
export { mergeSessionTranscriptContext };
