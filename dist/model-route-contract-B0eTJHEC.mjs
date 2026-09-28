//#region extensions/openai/model-route-contract.ts
const OPENAI_CHAT_LATEST_MODEL_ID = "chat-latest";
const OPENAI_GPT_6_ASTRA_MODEL_ID = "gpt-6-astra";
const OPENAI_GPT_6_MODEL_IDS = [
	OPENAI_GPT_6_ASTRA_MODEL_ID,
	"gpt-6-sol",
	"gpt-6-luna"
];
const OPENAI_GPT_56_MODEL_ID = "gpt-5.6";
const OPENAI_GPT_56_SOL_MODEL_ID = "gpt-5.6-sol";
const OPENAI_GPT_56_TERRA_MODEL_ID = "gpt-5.6-terra";
const OPENAI_GPT_56_LUNA_MODEL_ID = "gpt-5.6-luna";
const OPENAI_GPT_55_MODEL_ID = "gpt-5.5";
const OPENAI_GPT_55_PRO_MODEL_ID = "gpt-5.5-pro";
const OPENAI_GPT_54_MODEL_ID = "gpt-5.4";
const OPENAI_GPT_54_LEGACY_MODEL_ID = "gpt-5.4-codex";
const OPENAI_GPT_54_PRO_MODEL_ID = "gpt-5.4-pro";
const OPENAI_GPT_54_MINI_MODEL_ID = "gpt-5.4-mini";
const OPENAI_GPT_54_NANO_MODEL_ID = "gpt-5.4-nano";
const OPENAI_GPT_53_CODEX_SPARK_MODEL_ID = "gpt-5.3-codex-spark";
const OPENAI_GPT_56_VARIANT_MODEL_IDS = [
	OPENAI_GPT_56_SOL_MODEL_ID,
	OPENAI_GPT_56_TERRA_MODEL_ID,
	OPENAI_GPT_56_LUNA_MODEL_ID
];
const OPENAI_CODEX_REASONING_EFFORT_ORDER = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultra"
];
const OPENAI_CODEX_REASONING_EFFORTS_BY_MODEL = /* @__PURE__ */ new Map([
	[OPENAI_GPT_56_SOL_MODEL_ID, OPENAI_CODEX_REASONING_EFFORT_ORDER],
	[OPENAI_GPT_56_TERRA_MODEL_ID, OPENAI_CODEX_REASONING_EFFORT_ORDER],
	[OPENAI_GPT_56_LUNA_MODEL_ID, OPENAI_CODEX_REASONING_EFFORT_ORDER.slice(0, -1)]
]);
/** Models with known first-party Platform and ChatGPT transports. */
const OPENAI_DUAL_ROUTE_MODEL_IDS = [
	...OPENAI_GPT_6_MODEL_IDS,
	...OPENAI_GPT_56_VARIANT_MODEL_IDS,
	OPENAI_GPT_55_MODEL_ID,
	OPENAI_GPT_55_PRO_MODEL_ID,
	OPENAI_GPT_54_MODEL_ID,
	OPENAI_GPT_54_PRO_MODEL_ID,
	OPENAI_GPT_54_MINI_MODEL_ID
];
/** Direct aliases excluded from the ChatGPT catalog. */
const OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS = [OPENAI_CHAT_LATEST_MODEL_ID, OPENAI_GPT_56_MODEL_ID];
const OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS = [OPENAI_GPT_53_CODEX_SPARK_MODEL_ID];
/** Modern model refs recognized by the unified OpenAI provider surface. */
const OPENAI_PROVIDER_MODERN_MODEL_IDS = [
	...OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS,
	...OPENAI_DUAL_ROUTE_MODEL_IDS,
	OPENAI_GPT_54_NANO_MODEL_ID,
	...OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS
];
const OPENAI_CHATGPT_MODERN_MODEL_IDS = [...OPENAI_DUAL_ROUTE_MODEL_IDS, ...OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS];
const openAIDualRouteModelIds = new Set(OPENAI_DUAL_ROUTE_MODEL_IDS);
const openAIPlatformOnlyRouteModelIds = new Set(OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS);
const openAISubscriptionOnlyRouteModelIds = new Set(OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS);
function normalizeOpenAIModelRouteId(value) {
	const modelId = value?.trim() ?? "";
	const normalized = modelId.toLowerCase();
	return normalized === "gpt-5.4-codex" || normalized === `openai/gpt-5.4-codex` ? OPENAI_GPT_54_MODEL_ID : modelId;
}
function normalizeOpenAIRouteMembershipId(value) {
	return normalizeOpenAIModelRouteId(value).toLowerCase();
}
/**
* Merge live Codex observations with first-party model capabilities.
* An explicit empty list remains authoritative; partial non-empty observations
* cannot erase capabilities known by every other OpenAI model surface.
*/
function resolveOpenAICodexReasoningEfforts(modelId, observed) {
	const known = OPENAI_CODEX_REASONING_EFFORTS_BY_MODEL.get(normalizeOpenAIRouteMembershipId(modelId));
	if (!known) return observed ? [...observed] : void 0;
	if (observed === void 0 || observed.length === 0) return observed ? [] : [...known];
	const normalizedObserved = observed.map((effort) => effort.trim().toLowerCase()).filter(Boolean);
	const supported = /* @__PURE__ */ new Set([...known, ...normalizedObserved]);
	const knownSet = new Set(known);
	for (const effort of OPENAI_CODEX_REASONING_EFFORT_ORDER) if (!knownSet.has(effort)) supported.delete(effort);
	return [...OPENAI_CODEX_REASONING_EFFORT_ORDER.filter((effort) => supported.delete(effort)), ...supported];
}
function isOpenAIDualRouteModelId(value) {
	return openAIDualRouteModelIds.has(normalizeOpenAIRouteMembershipId(value));
}
function isOpenAIPlatformOnlyRouteModelId(value) {
	return openAIPlatformOnlyRouteModelIds.has(normalizeOpenAIRouteMembershipId(value));
}
function isOpenAISubscriptionOnlyRouteModelId(value) {
	return openAISubscriptionOnlyRouteModelIds.has(normalizeOpenAIRouteMembershipId(value));
}
//#endregion
export { resolveOpenAICodexReasoningEfforts as C, normalizeOpenAIModelRouteId as S, OPENAI_GPT_6_MODEL_IDS as _, OPENAI_GPT_54_MINI_MODEL_ID as a, isOpenAIPlatformOnlyRouteModelId as b, OPENAI_GPT_54_PRO_MODEL_ID as c, OPENAI_GPT_56_LUNA_MODEL_ID as d, OPENAI_GPT_56_MODEL_ID as f, OPENAI_GPT_6_ASTRA_MODEL_ID as g, OPENAI_GPT_56_VARIANT_MODEL_IDS as h, OPENAI_GPT_54_LEGACY_MODEL_ID as i, OPENAI_GPT_55_MODEL_ID as l, OPENAI_GPT_56_TERRA_MODEL_ID as m, OPENAI_CHAT_LATEST_MODEL_ID as n, OPENAI_GPT_54_MODEL_ID as o, OPENAI_GPT_56_SOL_MODEL_ID as p, OPENAI_GPT_53_CODEX_SPARK_MODEL_ID as r, OPENAI_GPT_54_NANO_MODEL_ID as s, OPENAI_CHATGPT_MODERN_MODEL_IDS as t, OPENAI_GPT_55_PRO_MODEL_ID as u, OPENAI_PROVIDER_MODERN_MODEL_IDS as v, isOpenAISubscriptionOnlyRouteModelId as x, isOpenAIDualRouteModelId as y };
