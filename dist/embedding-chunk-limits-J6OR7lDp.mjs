import { n as estimateUtf8Bytes, r as splitTextToUtf8ByteLimit } from "./embedding-input-limits-Dzm_zeQC.mjs";
import { t as hashText } from "./hash-BOTtT1fO.mjs";
//#region packages/memory-host-sdk/src/host/embedding-inputs.ts
/** Return true when a chunk needs structured provider handling, not text splitting. */
function hasNonTextEmbeddingParts(input) {
	return input?.parts?.some((part) => part.type === "inline-data") ?? false;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-model-limits.ts
const DEFAULT_EMBEDDING_MAX_INPUT_TOKENS = 8192;
const DEFAULT_LOCAL_EMBEDDING_MAX_INPUT_TOKENS = 2048;
/** Resolve the effective embedding input limit for a provider. */
function resolveEmbeddingMaxInputTokens(provider) {
	if (typeof provider.maxInputTokens === "number") return provider.maxInputTokens;
	if (provider.id === "local") return DEFAULT_LOCAL_EMBEDDING_MAX_INPUT_TOKENS;
	return DEFAULT_EMBEDDING_MAX_INPUT_TOKENS;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-chunk-limits.ts
/**
* Split text-only chunks to the provider's effective input limit.
*
* Structured multimodal chunks are preserved because only the provider can decide how to count
* non-text parts.
*/
function enforceEmbeddingMaxInputTokens(provider, chunks, hardMaxInputTokens) {
	const providerMaxInputTokens = resolveEmbeddingMaxInputTokens(provider);
	const maxInputTokens = typeof hardMaxInputTokens === "number" && hardMaxInputTokens > 0 ? Math.min(providerMaxInputTokens, hardMaxInputTokens) : providerMaxInputTokens;
	const out = [];
	for (const chunk of chunks) {
		if (hasNonTextEmbeddingParts(chunk.embeddingInput) || estimateUtf8Bytes(chunk.text) <= maxInputTokens) {
			out.push(chunk);
			continue;
		}
		for (const text of splitTextToUtf8ByteLimit(chunk.text, maxInputTokens)) out.push({
			startLine: chunk.startLine,
			endLine: chunk.endLine,
			...chunk.entryStartLine !== void 0 ? {
				entryStartLine: chunk.entryStartLine,
				entryEndLine: chunk.entryEndLine
			} : {},
			text,
			hash: hashText(text),
			embeddingInput: { text },
			...chunk.provenance ? { provenance: chunk.provenance } : {}
		});
	}
	return out;
}
//#endregion
export { hasNonTextEmbeddingParts as n, enforceEmbeddingMaxInputTokens as t };
