import { r as normalizeDirectChatIdentifier } from "./chat-context-fTfJVqAi.mjs";
import { n as createIMessageRpcClient } from "./client-Be3-fl6b.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { parseStrictInteger } from "openclaw/plugin-sdk/number-runtime";
// extensions/imessage/src/chat-lookup.ts
const CHAT_LIST_CACHE_TTL_MS = 3e4;
const chatListCache = /* @__PURE__ */ new Map();
function numberFromUnknown(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : parseStrictInteger(value);
}
function findChat(chats, target) {
	if (target.kind === "chat_id") return chats.find((chat) => chat.id === target.chatId) ?? null;
	if (target.kind === "chat_guid") return chats.find((chat) => chat.guid === target.chatGuid) ?? null;
	const wanted = normalizeDirectChatIdentifier(target.chatIdentifier);
	for (const chat of chats) {
		const { identifier, guid } = chat;
		if (identifier === target.chatIdentifier || guid === target.chatIdentifier || identifier && normalizeDirectChatIdentifier(identifier) === wanted || normalizeDirectChatIdentifier(guid) === wanted) return chat;
	}
	return null;
}
async function resolveIMessageChat(params) {
	const { cliPath, dbPath, remoteHost } = params.options;
	const key = `${cliPath}\0${dbPath ?? ""}\0${remoteHost ?? ""}`;
	const cached = chatListCache.get(key);
	if (cached && cached.expiresAt > Date.now()) return findChat(cached.list, params.target);
	chatListCache.delete(key);
	const client = await createIMessageRpcClient(params.options);
	try {
		const result = await client.request("chats.list", { limit: 1e3 }, { timeoutMs: params.options.timeoutMs });
		const list = [];
		for (const chat of isRecord(result) && Array.isArray(result.chats) ? result.chats : []) {
			if (!isRecord(chat)) continue;
			const id = numberFromUnknown(chat.id);
			const guid = normalizeOptionalString(chat.guid);
			if (id !== void 0 && guid) list.push({
				id,
				guid,
				identifier: normalizeOptionalString(chat.identifier)
			});
		}
		chatListCache.set(key, {
			list,
			expiresAt: Date.now() + CHAT_LIST_CACHE_TTL_MS
		});
		return findChat(list, params.target);
	} finally {
		await client.stop();
	}
}
export { resolveIMessageChat };
