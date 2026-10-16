import { y as OPENAI_PROVIDER_MODERN_MODEL_IDS } from "./model-route-contract-hw5lQEww.mjs";
//#region extensions/openai/account-models.ts
const OPENAI_UNKNOWN_MODEL_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const OPENAI_CHAT_FAMILY_MODEL_ID_PATTERN = /^(?:gpt-(?:4o|4\.1|[5-9](?:\.\d+)?|[1-9]\d(?:\.\d+)?)|o[1-9])(?:-[a-z0-9.]+)*$/;
const OPENAI_UNADMITTED_MODEL_ID_PATTERN = /(?:^|-)(?:audio|realtime|live|transcribe|diarize|tts|image|search|deep-research|instruct|translate|exp|preview|alpha|beta|treatment|chat-latest|codex|cyber|\d{4}(?:-\d{2}-\d{2})?)(?:-|$)/;
/** Conservative rows for account-listed chat models that no catalog row describes. */
function buildOpenAIAccountOnlyModels(params) {
	const knownIds = /* @__PURE__ */ new Set([...OPENAI_PROVIDER_MODERN_MODEL_IDS, ...params.catalogModels.map((model) => model.id)]);
	return [...params.discoveredIds].filter((id) => !knownIds.has(id) && OPENAI_CHAT_FAMILY_MODEL_ID_PATTERN.test(id) && !OPENAI_UNADMITTED_MODEL_ID_PATTERN.test(id)).toSorted().map((id) => ({
		id,
		name: id,
		api: "openai-responses",
		baseUrl: params.baseUrl,
		reasoning: /^(?:gpt-(?:[5-9]|\d{2})|o\d)/.test(id),
		input: ["text"],
		cost: OPENAI_UNKNOWN_MODEL_COST,
		contextWindow: 128e3,
		maxTokens: 16384
	}));
}
//#endregion
export { buildOpenAIAccountOnlyModels as n, OPENAI_UNKNOWN_MODEL_COST as t };
