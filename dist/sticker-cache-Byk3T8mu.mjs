import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { t as resolveAutoImageModel } from "./media-runtime-CmxLZuo1.mjs";
import "./agent-runtime-DkCKSFV_.mjs";
import { n as getTelegramRuntime } from "./runtime-DafGL1dY.mjs";
//#region extensions/telegram/src/sticker-cache-store.ts
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
async function readStickerCacheStore(operation, read, fallback) {
	try {
		return await read(getTelegramRuntime().state.openKeyedStore({
			namespace: TELEGRAM_STICKER_CACHE_NAMESPACE,
			maxEntries: TELEGRAM_STICKER_CACHE_MAX_ENTRIES
		}));
	} catch (err) {
		logVerbose(`telegram sticker cache ${operation} failed: ${String(err)}`);
		return fallback;
	}
}
async function getCachedSticker(fileUniqueId) {
	return readStickerCacheStore("lookup", async (store) => await store.lookup(fileUniqueId) ?? null, null);
}
async function cacheSticker(sticker) {
	await readStickerCacheStore("register", (store) => store.register(sticker.fileUniqueId, normalizeCachedStickerForStore(sticker)), void 0);
}
async function searchStickers(query, limit = 10) {
	const queryLower = normalizeLowercaseStringOrEmpty(query);
	const queryWords = queryLower.split(/\s+/).filter(Boolean);
	const results = [];
	for (const sticker of await getAllCachedStickers()) {
		const descLower = normalizeLowercaseStringOrEmpty(sticker.description);
		let score = descLower.includes(queryLower) ? 10 : 0;
		const descWords = descLower.split(/\s+/);
		for (const qWord of queryWords) if (descWords.some((dWord) => dWord.includes(qWord))) score += 5;
		score += sticker.emoji && query.includes(sticker.emoji) ? 8 : 0;
		score += normalizeLowercaseStringOrEmpty(sticker.setName).includes(queryLower) ? 3 : 0;
		if (score > 0) results.push({
			sticker,
			score
		});
	}
	return results.toSorted((a, b) => b.score - a.score).slice(0, limit).map((r) => r.sticker);
}
async function getAllCachedStickers() {
	return readStickerCacheStore("entries", async (store) => (await store.entries()).map((entry) => entry.value), []);
}
async function getCacheStats() {
	const stickers = await getAllCachedStickers();
	if (stickers.length === 0) return { count: 0 };
	const sorted = stickers.toSorted((a, b) => new Date(a.cachedAt).getTime() - new Date(b.cachedAt).getTime());
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
	if (cfg.tools?.media?.image?.enabled === false) {
		logVerbose("telegram: image understanding disabled; skipping sticker description");
		return null;
	}
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
