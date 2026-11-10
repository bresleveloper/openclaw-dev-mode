import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./provider-model-metadata-DkObn07R.mjs";
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
function getOllamaLatestDedupeKey(name) {
	const normalized = name.trim().toLowerCase();
	return normalized.endsWith(":latest") ? normalized.slice(0, -7) : normalized;
}
function findAvailableOllamaModelName(modelName, availableModelNames) {
	const wantedKey = getOllamaLatestDedupeKey(modelName);
	for (const available of availableModelNames) if (getOllamaLatestDedupeKey(available) === wantedKey) return available;
}
//#endregion
export { getOllamaLatestDedupeKey as n, normalizeOllamaWireModelId as r, findAvailableOllamaModelName as t };
