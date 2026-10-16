import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { T as resolveOpenAICodexReasoningEfforts, c as OPENAI_GPT_54_NANO_MODEL_ID, d as OPENAI_GPT_55_PRO_MODEL_ID, i as OPENAI_GPT_53_CODEX_SPARK_MODEL_ID, l as OPENAI_GPT_54_PRO_MODEL_ID, o as OPENAI_GPT_54_MINI_MODEL_ID, p as OPENAI_GPT_56_MODEL_ID, s as OPENAI_GPT_54_MODEL_ID, u as OPENAI_GPT_55_MODEL_ID, v as OPENAI_GPT_6_MODEL_IDS } from "./model-route-contract-hw5lQEww.mjs";
import { t as modelCatalog } from "./openclaw.plugin-_vm__Dty.mjs";
//#region extensions/openai/thinking-policy.ts
const OPENAI_THINKING_BASE_LEVELS = [
	{ id: "off" },
	{ id: "minimal" },
	{ id: "low" },
	{ id: "medium" },
	{ id: "high" }
];
const OPENAI_THINKING_LEVEL_ORDER = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultra"
];
const OPENAI_UNIFIED_XHIGH_MODEL_IDS = [
	OPENAI_GPT_56_MODEL_ID,
	OPENAI_GPT_55_MODEL_ID,
	OPENAI_GPT_55_PRO_MODEL_ID,
	OPENAI_GPT_54_MODEL_ID,
	OPENAI_GPT_54_PRO_MODEL_ID,
	OPENAI_GPT_53_CODEX_SPARK_MODEL_ID,
	OPENAI_GPT_54_MINI_MODEL_ID,
	OPENAI_GPT_54_NANO_MODEL_ID
];
function normalizeCodexReasoningEffort(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (normalized === "none") return "off";
	return OPENAI_THINKING_LEVEL_ORDER.find((level) => level === normalized);
}
function buildCodexLevels(efforts) {
	const supported = /* @__PURE__ */ new Set();
	for (const effort of efforts) {
		const level = normalizeCodexReasoningEffort(effort);
		if (level) supported.add(level);
	}
	return OPENAI_THINKING_LEVEL_ORDER.filter((level) => supported.has(level)).map((id) => ({ id }));
}
function resolveUnifiedOpenAIThinkingProfile(rawModelId, rawAgentRuntime, compat, api, thinkingLevelMap) {
	const modelId = normalizeLowercaseStringOrEmpty(rawModelId);
	const agentRuntime = normalizeLowercaseStringOrEmpty(rawAgentRuntime ?? "");
	const codexEfforts = compat?.supportedReasoningEfforts?.map(normalizeLowercaseStringOrEmpty);
	if (compat?.supportsReasoningEffort === false || codexEfforts?.length === 0) return { levels: api === "openai-completions" && (!agentRuntime || agentRuntime === "auto" || agentRuntime === "openclaw") && [
		"qwen",
		"qwen-chat-template",
		"zai",
		"deepseek",
		"together"
	].includes(compat?.thinkingFormat ?? "") ? OPENAI_THINKING_BASE_LEVELS : [] };
	const canSynthesizeUltra = thinkingLevelMap?.max !== null;
	const knownCodexEfforts = resolveOpenAICodexReasoningEfforts(modelId, void 0);
	const fallbackEfforts = modelCatalog.providers.openai.models.find((model) => model.id === modelId)?.compat?.supportedReasoningEfforts;
	if (OPENAI_GPT_6_MODEL_IDS.some((id) => id === modelId) || (agentRuntime !== "codex" || knownCodexEfforts === void 0) && (codexEfforts ?? fallbackEfforts) !== void 0) {
		const efforts = codexEfforts ?? (agentRuntime === "codex" ? (fallbackEfforts ?? []).filter((effort) => effort !== "none") : fallbackEfforts ?? []);
		const supportsUltra = [
			"openclaw",
			"codex",
			"auto"
		].includes(agentRuntime) && efforts.includes("max") && (agentRuntime === "codex" ? modelId === "gpt-6-astra" || efforts.includes("ultra") : canSynthesizeUltra);
		const defaultLevel = efforts.includes("medium") ? "medium" : efforts.includes("low") ? "low" : void 0;
		return {
			levels: buildCodexLevels(supportsUltra ? [...efforts, "ultra"] : efforts),
			...defaultLevel ? { defaultLevel } : {}
		};
	}
	const resolvedCodexEfforts = api === void 0 || api === "openai-chatgpt-responses" ? resolveOpenAICodexReasoningEfforts(modelId, codexEfforts) : void 0;
	const isGpt56Variant = knownCodexEfforts !== void 0;
	const codexSupportsMax = (resolvedCodexEfforts ?? knownCodexEfforts)?.includes("max");
	const supportsMax = modelId.startsWith("gpt-5.6") && (agentRuntime !== "codex" || codexSupportsMax);
	const codexSupportsUltra = (resolvedCodexEfforts ?? knownCodexEfforts)?.includes("ultra");
	const supportsXHigh = OPENAI_UNIFIED_XHIGH_MODEL_IDS.some((prefix) => modelId.startsWith(prefix));
	const supportsUltra = (modelId === "gpt-5.6" || isGpt56Variant) && ((agentRuntime === "openclaw" || agentRuntime === "auto") && (canSynthesizeUltra || codexEfforts?.includes("ultra")) || agentRuntime === "codex" && codexSupportsUltra);
	const nativeCodexNeedsAccountEffortValidation = agentRuntime === "codex" && compat?.supportedReasoningEfforts === void 0 && (api === void 0 || api === "openai-chatgpt-responses") && !supportsXHigh && !modelId.startsWith("gpt-5.6");
	const defaultLevel = isGpt56Variant ? "medium" : void 0;
	const fallbackLevels = [
		...OPENAI_THINKING_BASE_LEVELS,
		...supportsXHigh ? [{ id: "xhigh" }] : [],
		...supportsMax ? [{ id: "max" }] : [],
		...supportsUltra ? [{ id: "ultra" }] : [],
		...nativeCodexNeedsAccountEffortValidation ? [{ id: "xhigh" }, { id: "max" }] : []
	];
	const levels = agentRuntime === "codex" && resolvedCodexEfforts !== void 0 ? buildCodexLevels(resolvedCodexEfforts) : fallbackLevels;
	return {
		levels,
		...defaultLevel && levels.some((level) => level.id === defaultLevel) ? { defaultLevel } : {}
	};
}
//#endregion
export { resolveUnifiedOpenAIThinkingProfile as t };
