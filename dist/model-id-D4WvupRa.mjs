import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./provider-model-metadata-fSBArSt7.mjs";
//#region extensions/ollama/src/model-id.ts
const OLLAMA_PROVIDER_ID = "ollama";
function normalizeOllamaWireModelId(modelId, providerId) {
	const trimmed = modelId.trim();
	if (!trimmed) return trimmed;
	for (const candidate of normalizeUniqueTrimmedStringList([
		providerId,
		normalizeProviderId(providerId ?? ""),
		OLLAMA_PROVIDER_ID
	])) {
		const prefix = `${candidate}/`;
		if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
	}
	return trimmed;
}
//#endregion
export { normalizeOllamaWireModelId as t };
