import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./provider-model-shared-DwrT_ZjA.mjs";
//#region extensions/ollama/src/model-id.ts
const OLLAMA_PROVIDER_ID = "ollama";
function uniqueModelPrefixCandidates(providerId) {
	const candidates = [
		providerId,
		normalizeProviderId(providerId ?? ""),
		OLLAMA_PROVIDER_ID
	].map((candidate) => candidate?.trim()).filter((candidate) => Boolean(candidate));
	return uniqueStrings(candidates);
}
function normalizeOllamaWireModelId(modelId, providerId) {
	const trimmed = modelId.trim();
	if (!trimmed) return trimmed;
	for (const candidate of uniqueModelPrefixCandidates(providerId)) {
		const prefix = `${candidate}/`;
		if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
	}
	return trimmed;
}
//#endregion
export { normalizeOllamaWireModelId as t };
