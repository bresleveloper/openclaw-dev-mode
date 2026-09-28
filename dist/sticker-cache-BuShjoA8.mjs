import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import { t as resolveAutoImageModel } from "./media-runtime-CPk2kXLr.mjs";
import "./agent-runtime-vMVS3kbD.mjs";
import { n as getTelegramRuntime } from "./runtime-DiTlx7dk.mjs";
import { i as normalizeCachedStickerForStore, n as TELEGRAM_STICKER_CACHE_NAMESPACE, t as TELEGRAM_STICKER_CACHE_MAX_ENTRIES } from "./sticker-cache-store.legacy-state-DV-1hOQr.mjs";
//#region extensions/telegram/src/sticker-cache-store.ts
function openStickerCacheStore() {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_STICKER_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_STICKER_CACHE_MAX_ENTRIES
	});
}
async function readStickerCacheStore(operation, read, fallback) {
	try {
		return await read(openStickerCacheStore());
	} catch (err) {
		logVerbose(`telegram sticker cache ${operation} failed: ${String(err)}`);
		return fallback;
	}
}
/**
* Get a cached sticker by its unique ID.
*/
async function getCachedSticker(fileUniqueId) {
	return readStickerCacheStore("lookup", async (store) => await store.lookup(fileUniqueId) ?? null, null);
}
/**
* Add or update a sticker in the cache.
*/
async function cacheSticker(sticker) {
	await readStickerCacheStore("register", (store) => store.register(sticker.fileUniqueId, normalizeCachedStickerForStore(sticker)), void 0);
}
/**
* Search cached stickers by text query (fuzzy match on description + emoji + setName).
*/
async function searchStickers(query, limit = 10) {
	const queryLower = normalizeLowercaseStringOrEmpty(query);
	const results = [];
	for (const { value: sticker } of await readStickerCacheStore("entries", (store) => store.entries(), [])) {
		let score = 0;
		const descLower = normalizeLowercaseStringOrEmpty(sticker.description);
		if (descLower.includes(queryLower)) score += 10;
		const queryWords = queryLower.split(/\s+/).filter(Boolean);
		const descWords = descLower.split(/\s+/);
		for (const qWord of queryWords) if (descWords.some((dWord) => dWord.includes(qWord))) score += 5;
		if (sticker.emoji && query.includes(sticker.emoji)) score += 8;
		if (normalizeLowercaseStringOrEmpty(sticker.setName).includes(queryLower)) score += 3;
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
async function getAllCachedStickers() {
	return readStickerCacheStore("entries", async (store) => (await store.entries()).map((entry) => entry.value), []);
}
/**
* Get cache statistics.
*/
async function getCacheStats() {
	const stickers = await getAllCachedStickers();
	if (stickers.length === 0) return { count: 0 };
	const sorted = [...stickers].toSorted((a, b) => new Date(a.cachedAt).getTime() - new Date(b.cachedAt).getTime());
	return {
		count: stickers.length,
		oldestAt: sorted[0]?.cachedAt,
		newestAt: sorted[sorted.length - 1]?.cachedAt
	};
}
//#endregion
//#region extensions/telegram/src/sticker-cache.ts
const STICKER_DESCRIPTION_PROMPT = "Describe this sticker image in 1-2 sentences. Focus on what the sticker depicts (character, object, action, emotion). Be concise and objective.";
/**
* Describe a sticker image using vision API.
* Uses the shared image-model policy, then describes the sticker once.
* Returns null if no model is selected or description fails.
*/
async function describeStickerImage(params) {
	const { imagePath, cfg, agentDir, agentId } = params;
	const scopedAgentDir = agentDir ?? (agentId ? resolveAgentDir(cfg, agentId) : void 0);
	const activeModel = resolveDefaultModelForAgent({
		cfg,
		agentId
	});
	const resolved = await resolveAutoImageModel({
		cfg,
		agentId,
		agentDir: scopedAgentDir,
		activeModel
	});
	if (!resolved?.model) {
		logVerbose("telegram: no vision provider available for sticker description");
		return null;
	}
	const { provider, model } = resolved;
	logVerbose(`telegram: describing sticker with ${provider}/${model}`);
	try {
		return (await getTelegramRuntime().mediaUnderstanding.describeImageFileWithModel({
			filePath: imagePath,
			mime: "image/webp",
			cfg,
			agentDir: scopedAgentDir,
			provider,
			model,
			prompt: STICKER_DESCRIPTION_PROMPT,
			maxTokens: 150,
			timeoutMs: 3e4
		})).text ?? null;
	} catch (err) {
		logVerbose(`telegram: failed to describe sticker: ${String(err)}`);
		return null;
	}
}
//#endregion
export { getCachedSticker as a, getCacheStats as i, cacheSticker as n, searchStickers as o, getAllCachedStickers as r, describeStickerImage as t };
