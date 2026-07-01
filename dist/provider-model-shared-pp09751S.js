import { a as normalizeLowercaseStringOrEmpty, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { i as normalizeProviderId$1 } from "./provider-id-Dq06Bcx6.js";
import { n as normalizeGooglePreviewModelId$1, t as normalizeAntigravityPreviewModelId$1 } from "./provider-model-id-normalize-CkG5GiL_.js";
import "./src-M7TBQdDX.js";
import "./provider-claude-thinking-s2PAP2Wu.js";
import "./gpt5-prompt-overlay-BdGuIGEH.js";
import "./provider-attribution-8gdGyO--.js";
import { a as normalizeModelCompat } from "./provider-model-compat-DAJmt9jr.js";
import "./moonshot-thinking-CJBD7Bdh.js";
import { a as buildOpenAICompatibleReplayPolicy, c as resolveTaggedReasoningOutputMode, i as buildNativeAnthropicReplayPolicyForModel, l as sanitizeGoogleGeminiReplayHistory, n as buildGoogleGeminiReplayPolicy, o as buildPassthroughGeminiSanitizingReplayPolicy, r as buildHybridAnthropicOrOpenAIReplayPolicy, t as buildAnthropicReplayPolicyForModel } from "./provider-replay-helpers-DtVD32X4.js";
//#region src/plugins/provider-model-helpers.ts
/** True when an id matches a normalized exact value or value prefix. */
function matchesExactOrPrefix(id, values) {
	const normalizedId = normalizeLowercaseStringOrEmpty(id);
	return values.some((value) => {
		const normalizedValue = normalizeLowercaseStringOrEmpty(value);
		return normalizedId === normalizedValue || normalizedId.startsWith(normalizedValue);
	});
}
/** Clones the first available template model and patches it for a dynamic model id. */
function cloneFirstTemplateModel(params) {
	const trimmedModelId = params.modelId.trim();
	for (const templateId of uniqueStrings(params.templateIds).filter(Boolean)) {
		const template = params.ctx.modelRegistry.find(params.providerId, templateId);
		if (!template) continue;
		return normalizeModelCompat({
			...template,
			id: trimmedModelId,
			name: trimmedModelId,
			...params.patch
		});
	}
}
//#endregion
//#region src/plugin-sdk/provider-model-shared.ts
/**
* Normalizes provider ids for config, catalog, and plugin-registry matching.
*/
function normalizeProviderId(provider) {
	return normalizeProviderId$1(provider);
}
function getModelProviderHint(modelId) {
	const trimmed = normalizeOptionalLowercaseString(modelId);
	if (!trimmed) return null;
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0) return null;
	return trimmed.slice(0, slashIndex) || null;
}
/** @deprecated Proxy provider-owned model helper; do not use from third-party plugins. */
function isProxyReasoningUnsupportedModelHint(modelId) {
	return getModelProviderHint(modelId) === "x-ai";
}
/**
* Normalizes Antigravity preview model ids to the canonical provider catalog form.
*/
function normalizeAntigravityPreviewModelId(id) {
	return normalizeAntigravityPreviewModelId$1(id);
}
/**
* Normalizes Google preview model ids to the canonical provider catalog form.
*/
function normalizeGooglePreviewModelId(id) {
	return normalizeGooglePreviewModelId$1(id);
}
/**
* Builds provider replay hooks for a known transcript/reasoning compatibility family.
*/
function buildProviderReplayFamilyHooks(options) {
	switch (options.family) {
		case "openai-compatible": {
			const policyOptions = {
				sanitizeToolCallIds: options.sanitizeToolCallIds,
				duplicateToolCallIdStyle: options.duplicateToolCallIdStyle,
				dropReasoningFromHistory: options.dropReasoningFromHistory
			};
			return { buildReplayPolicy: (ctx) => buildOpenAICompatibleReplayPolicy(ctx.modelApi, {
				...policyOptions,
				modelId: ctx.modelId
			}) };
		}
		case "anthropic-by-model": return { buildReplayPolicy: ({ modelId }) => buildAnthropicReplayPolicyForModel(modelId) };
		case "native-anthropic-by-model": return { buildReplayPolicy: ({ modelId }) => buildNativeAnthropicReplayPolicyForModel(modelId) };
		case "google-gemini": return {
			buildReplayPolicy: () => buildGoogleGeminiReplayPolicy(),
			sanitizeReplayHistory: (ctx) => sanitizeGoogleGeminiReplayHistory(ctx),
			resolveReasoningOutputMode: (_ctx) => resolveTaggedReasoningOutputMode()
		};
		case "passthrough-gemini": return { buildReplayPolicy: ({ modelId }) => buildPassthroughGeminiSanitizingReplayPolicy(modelId) };
		case "hybrid-anthropic-openai": return { buildReplayPolicy: (ctx) => buildHybridAnthropicOrOpenAIReplayPolicy(ctx, { anthropicModelDropThinkingBlocks: options.anthropicModelDropThinkingBlocks }) };
	}
	throw new Error("Unsupported provider replay family");
}
/** @deprecated Provider-owned replay hook shortcut; use local provider hooks instead. */
const OPENAI_COMPATIBLE_REPLAY_HOOKS = buildProviderReplayFamilyHooks({ family: "openai-compatible" });
/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
const ANTHROPIC_BY_MODEL_REPLAY_HOOKS = buildProviderReplayFamilyHooks({ family: "anthropic-by-model" });
/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
const NATIVE_ANTHROPIC_REPLAY_HOOKS = buildProviderReplayFamilyHooks({ family: "native-anthropic-by-model" });
/** @deprecated Google provider-owned replay hook shortcut; use local provider hooks instead. */
const PASSTHROUGH_GEMINI_REPLAY_HOOKS = buildProviderReplayFamilyHooks({ family: "passthrough-gemini" });
//#endregion
export { buildProviderReplayFamilyHooks as a, normalizeGooglePreviewModelId as c, matchesExactOrPrefix as d, PASSTHROUGH_GEMINI_REPLAY_HOOKS as i, normalizeProviderId as l, NATIVE_ANTHROPIC_REPLAY_HOOKS as n, isProxyReasoningUnsupportedModelHint as o, OPENAI_COMPATIBLE_REPLAY_HOOKS as r, normalizeAntigravityPreviewModelId as s, ANTHROPIC_BY_MODEL_REPLAY_HOOKS as t, cloneFirstTemplateModel as u };
