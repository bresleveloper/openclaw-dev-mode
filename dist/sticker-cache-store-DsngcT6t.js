import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { i as logVerbose } from "./globals-BWmHKFNH.js";
import "./runtime-env-oOti2yy7.js";
import { t as loadJsonFile } from "./json-store-CWaMsrLM.js";
import "./state-paths-DshOQl4X.js";
import { n as getTelegramRuntime } from "./runtime-B_f_VNpK.js";
import path from "node:path";
//#region extensions/telegram/src/sticker-cache-store.ts
const CACHE_VERSION = 1;
const TELEGRAM_STICKER_CACHE_NAMESPACE = "telegram.sticker-cache";
const TELEGRAM_STICKER_CACHE_MAX_ENTRIES = 1e4;
function getCacheFile() {
	return path.join(resolveStateDir(), "telegram", "sticker-cache.json");
}
function openStickerCacheStore() {
	return getTelegramRuntime().state.openSyncKeyedStore({
		namespace: "telegram.sticker-cache",
		maxEntries: 1e4
	});
}
function loadCache() {
	return loadCacheFile(getCacheFile());
}
function normalizeStickerSearchText(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : "";
}
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
function readStickerCacheStore(operation, read, fallback) {
	try {
		return read(openStickerCacheStore());
	} catch (err) {
		logVerbose(`telegram sticker cache ${operation} failed: ${String(err)}`);
		return fallback;
	}
}
/**
* Get a cached sticker by its unique ID.
*/
function getCachedSticker(fileUniqueId) {
	return readStickerCacheStore("lookup", (store) => store.lookup(fileUniqueId) ?? null, null);
}
/**
* Add or update a sticker in the cache.
*/
function cacheSticker(sticker) {
	readStickerCacheStore("register", (store) => {
		store.register(sticker.fileUniqueId, normalizeCachedStickerForStore(sticker));
	}, void 0);
}
/**
* Search cached stickers by text query (fuzzy match on description + emoji + setName).
*/
function searchStickers(query, limit = 10) {
	const queryLower = normalizeStickerSearchText(query);
	const results = [];
	for (const { value: sticker } of readStickerCacheStore("entries", (store) => store.entries(), [])) {
		let score = 0;
		const descLower = normalizeStickerSearchText(sticker.description);
		if (descLower.includes(queryLower)) score += 10;
		const queryWords = queryLower.split(/\s+/).filter(Boolean);
		const descWords = descLower.split(/\s+/);
		for (const qWord of queryWords) if (descWords.some((dWord) => dWord.includes(qWord))) score += 5;
		if (sticker.emoji && query.includes(sticker.emoji)) score += 8;
		if (normalizeStickerSearchText(sticker.setName).includes(queryLower)) score += 3;
		if (score > 0) results.push({
			sticker,
			score
		});
	}
	return results.toSorted((a, b) => b.score - a.score).slice(0, limit).map((r) => r.sticker);
}
/**
* Get all cached stickers (for debugging/listing).
*/
function getAllCachedStickers() {
	return readStickerCacheStore("entries", (store) => store.entries().map((entry) => entry.value), []);
}
/**
* Get cache statistics.
*/
function getCacheStats() {
	const stickers = getAllCachedStickers();
	if (stickers.length === 0) return { count: 0 };
	const sorted = [...stickers].toSorted((a, b) => new Date(a.cachedAt).getTime() - new Date(b.cachedAt).getTime());
	return {
		count: stickers.length,
		oldestAt: sorted[0]?.cachedAt,
		newestAt: sorted[sorted.length - 1]?.cachedAt
	};
}
function listTelegramLegacyStickerCacheEntries(params = {}) {
	const cache = params.persistedPath ? loadCacheFile(params.persistedPath) : loadCache();
	return Object.entries(cache.stickers).map(([key, value]) => ({
		key,
		value: normalizeCachedStickerForStore(value)
	}));
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
//#endregion
export { getCacheStats as a, searchStickers as c, getAllCachedStickers as i, TELEGRAM_STICKER_CACHE_NAMESPACE as n, getCachedSticker as o, cacheSticker as r, listTelegramLegacyStickerCacheEntries as s, TELEGRAM_STICKER_CACHE_MAX_ENTRIES as t };
