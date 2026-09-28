import { t as loadJsonFile } from "./json-store-EnZiK23B.mjs";
//#region extensions/telegram/src/sticker-cache-store.legacy-state.ts
const CACHE_VERSION = 1;
const TELEGRAM_STICKER_CACHE_NAMESPACE = "telegram.sticker-cache";
const TELEGRAM_STICKER_CACHE_MAX_ENTRIES = 1e4;
function normalizeCachedStickerForStore(sticker) {
	return {
		fileId: sticker.fileId,
		fileUniqueId: sticker.fileUniqueId,
		description: sticker.description,
		cachedAt: sticker.cachedAt,
		...sticker.emoji !== void 0 ? { emoji: sticker.emoji } : {},
		...sticker.setName !== void 0 ? { setName: sticker.setName } : {},
		...sticker.receivedFrom !== void 0 ? { receivedFrom: sticker.receivedFrom } : {}
	};
}
function loadCacheFile(filePath) {
	const data = loadJsonFile(filePath);
	if (!data || typeof data !== "object") return {
		version: CACHE_VERSION,
		stickers: {}
	};
	const cache = data;
	if (cache.version !== CACHE_VERSION) return {
		version: CACHE_VERSION,
		stickers: {}
	};
	return cache;
}
function listTelegramLegacyStickerCacheEntries(params) {
	const cache = loadCacheFile(params.persistedPath);
	return Object.entries(cache.stickers).map(([key, value]) => ({
		key,
		value: normalizeCachedStickerForStore(value)
	}));
}
//#endregion
export { normalizeCachedStickerForStore as i, TELEGRAM_STICKER_CACHE_NAMESPACE as n, listTelegramLegacyStickerCacheEntries as r, TELEGRAM_STICKER_CACHE_MAX_ENTRIES as t };
