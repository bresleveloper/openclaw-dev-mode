import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region packages/memory-host-sdk/src/host/embedding-provider-adapter-utils.ts
/** Detect missing API key errors from provider auth resolution. */
function isMissingEmbeddingApiKeyError(err) {
	return err instanceof Error && err.message.includes("No API key found for provider");
}
/** Return stable cache headers after removing adapter-declared secret headers. */
function sanitizeEmbeddingCacheHeaders(headers, excludedHeaderNames) {
	const excluded = new Set(excludedHeaderNames.map((name) => normalizeLowercaseStringOrEmpty(name)));
	return Object.entries(headers).filter(([key]) => !excluded.has(normalizeLowercaseStringOrEmpty(key))).toSorted(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, value]);
}
/** Convert custom-id keyed batch embeddings back to request-index order. */
function mapBatchEmbeddingsByIndex(byCustomId, count) {
	const embeddings = [];
	for (let index = 0; index < count; index += 1) embeddings.push(byCustomId.get(String(index)) ?? []);
	return embeddings;
}
//#endregion
export { mapBatchEmbeddingsByIndex as n, sanitizeEmbeddingCacheHeaders as r, isMissingEmbeddingApiKeyError as t };
