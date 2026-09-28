import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./session-store-paths-C0kAfy_y.mjs";
import { t as resolveTelegramAccountOwnerAgentId } from "./account-owner-CELLJV4K.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/message-cache-persistence.ts
const TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES = 3e3;
const TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE = "telegram.message-cache";
const TELEGRAM_MEDIA_KINDS = /* @__PURE__ */ new Set([
	"audio",
	"document",
	"image",
	"sticker",
	"video"
]);
function isTelegramMediaKind(value) {
	return typeof value === "string" && TELEGRAM_MEDIA_KINDS.has(value);
}
function parseStickerMetadata(value) {
	if (!isRecord(value)) return;
	return {
		...typeof value.emoji === "string" ? { emoji: value.emoji } : {},
		...typeof value.setName === "string" ? { setName: value.setName } : {},
		...typeof value.fileId === "string" ? { fileId: value.fileId } : {},
		...typeof value.fileUniqueId === "string" ? { fileUniqueId: value.fileUniqueId } : {},
		...typeof value.cachedDescription === "string" ? { cachedDescription: value.cachedDescription } : {}
	};
}
function parseTelegramResolvedMedia(value) {
	if (!isRecord(value) || typeof value.id !== "string" || !value.id || value.id.includes("/") || value.id.includes("\\") || value.id.includes("\0") || typeof value.fileUniqueId !== "string" || !value.fileUniqueId || typeof value.size !== "number" || !Number.isFinite(value.size) || value.size < 0 || typeof value.savedAt !== "number" || !Number.isFinite(value.savedAt) || !isTelegramMediaKind(value.kind)) return;
	const stickerMetadata = parseStickerMetadata(value.stickerMetadata);
	return {
		id: value.id,
		fileUniqueId: value.fileUniqueId,
		size: value.size,
		savedAt: value.savedAt,
		kind: value.kind,
		...typeof value.contentType === "string" ? { contentType: value.contentType } : {},
		...stickerMetadata ? { stickerMetadata } : {}
	};
}
function resolveTelegramMessageCachePath(storePath) {
	return `${storePath}.telegram-messages.json`;
}
function resolveTelegramMessageCacheScope(storePath) {
	return resolveTelegramMessageCachePath(storePath);
}
function resolveTelegramMessageCachePersistentScopeKey(scope) {
	return createHash("sha256").update(scope).digest("hex").slice(0, 24);
}
function isTelegramMessageCacheSourceMessage(value) {
	return isRecord(value) && typeof value.message_id === "number" && Number.isFinite(value.message_id) && typeof value.date === "number" && Number.isFinite(value.date);
}
//#endregion
//#region extensions/telegram/src/sent-message-cache.legacy-state.ts
const TTL_MS = 864e5;
const TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE = "telegram.sent-messages";
const TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES = 1e4;
function resolveSentMessageAgentId(cfg, owner) {
	return owner?.agentId?.trim() || (cfg ? resolveTelegramAccountOwnerAgentId({
		cfg,
		accountId: owner?.accountId
	}) : "main");
}
function sentMessageScopeKeyForStorePath(storePath) {
	return createHash("sha256").update(storePath, "utf8").digest("hex").slice(0, 24);
}
function resolveSentMessageScopeKey(cfg, owner) {
	return sentMessageScopeKeyForStorePath(resolveSessionStorePathCore(cfg?.session?.store, { agentId: resolveSentMessageAgentId(cfg, owner) }));
}
function sentMessageEntryKey(scopeKey, chatId, messageId) {
	return createHash("sha256").update(`${scopeKey}\0${chatId}\0${messageId}`, "utf8").digest("hex").slice(0, 32);
}
function resolveSentMessageStorePath(cfg, owner) {
	return `${resolveSessionStorePathCore(cfg?.session?.store, { agentId: resolveSentMessageAgentId(cfg, owner) })}.telegram-sent-messages.json`;
}
function readLegacySentMessages(filePath) {
	const store = /* @__PURE__ */ new Map();
	let parsed;
	try {
		parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	} catch {
		return store;
	}
	const now = Date.now();
	for (const [chatId, entry] of Object.entries(parsed)) {
		const messages = /* @__PURE__ */ new Map();
		for (const [messageId, timestamp] of Object.entries(entry)) if (typeof timestamp === "number" && Number.isFinite(timestamp) && now - timestamp < 864e5) messages.set(messageId, timestamp);
		if (messages.size > 0) store.set(chatId, messages);
	}
	return store;
}
function listTelegramLegacySentMessageCacheEntries(params) {
	const scopeKey = params.targetStorePath ? sentMessageScopeKeyForStorePath(params.targetStorePath) : resolveSentMessageScopeKey(params.cfg, { agentId: params.agentId });
	const filePath = params.persistedPath ?? resolveSentMessageStorePath(params.cfg, { agentId: params.agentId });
	return [...(fs.existsSync(filePath) ? readLegacySentMessages(filePath) : /* @__PURE__ */ new Map()).entries()].flatMap(([chatId, messages]) => [...messages.entries()].flatMap(([messageId, timestamp]) => {
		const ttlMs = TTL_MS - Math.max(0, Date.now() - timestamp);
		return ttlMs > 0 ? [{
			key: sentMessageEntryKey(scopeKey, chatId, messageId),
			value: {
				scopeKey,
				chatId,
				messageId,
				timestamp
			},
			ttlMs,
			timestamp
		}] : [];
	}));
}
//#endregion
export { resolveSentMessageScopeKey as a, TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE as c, resolveTelegramMessageCachePath as d, resolveTelegramMessageCachePersistentScopeKey as f, listTelegramLegacySentMessageCacheEntries as i, isTelegramMessageCacheSourceMessage as l, TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE as n, sentMessageEntryKey as o, resolveTelegramMessageCacheScope as p, TTL_MS as r, TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES as s, TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES as t, parseTelegramResolvedMedia as u };
