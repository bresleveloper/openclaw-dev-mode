import { a as hasNonTextEmbeddingParts, c as splitTextToUtf8ByteLimit, s as estimateUtf8Bytes } from "./markdown-chunks-DYWd0D11.mjs";
import { t as hashText } from "./hash-Di28TYtu.mjs";
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
		if (hasNonTextEmbeddingParts(chunk.embeddingInput)) {
			out.push(chunk);
			continue;
		}
		if (estimateUtf8Bytes(chunk.text) <= maxInputTokens) {
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
export { enforceEmbeddingMaxInputTokens as t };
