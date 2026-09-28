import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { a as bindsClaudeThinkingPrefix, l as resolveClaudeModelIdentity, p as resolveClaudeOpus5ModelIdentity } from "./anthropic-Cy4mTngV.mjs";
import "./src-BpANEEBH.mjs";
import { t as sanitizeGoogleAssistantFirstOrdering } from "./google-turn-ordering-CAKKJfPd.mjs";
//#region src/plugins/provider-replay-helpers.ts
/** @deprecated Provider replay helper; prefer provider-local replay hooks. */
function buildOpenAICompatibleReplayPolicy(modelApi, options = {}) {
	if (modelApi !== "openai-completions" && modelApi !== "openai-responses" && modelApi !== "openai-chatgpt-responses" && modelApi !== "azure-openai-responses") return;
	const sanitizeToolCallIds = options.sanitizeToolCallIds ?? true;
	const dropReasoningFromHistory = options.dropReasoningFromHistory ?? true;
	const isResponsesFamily = modelApi === "openai-responses" || modelApi === "openai-chatgpt-responses" || modelApi === "azure-openai-responses";
	return {
		...sanitizeToolCallIds ? {
			sanitizeToolCallIds: true,
			toolCallIdMode: "strict",
			...options.duplicateToolCallIdStyle ? { duplicateToolCallIdStyle: options.duplicateToolCallIdStyle } : {}
		} : {},
		...isResponsesFamily ? { allowSyntheticToolResults: true } : {},
		...modelApi === "openai-completions" ? {
			applyAssistantFirstOrderingFix: true,
			validateGeminiTurns: true,
			validateAnthropicTurns: true
		} : {
			applyAssistantFirstOrderingFix: false,
			validateGeminiTurns: false,
			validateAnthropicTurns: false
		},
		...modelApi === "openai-completions" && dropReasoningFromHistory ? { dropReasoningFromHistory: true } : {}
	};
}
/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
function buildStrictAnthropicReplayPolicy(options = {}) {
	return {
		sanitizeMode: "full",
		...options.sanitizeToolCallIds ?? true ? {
			sanitizeToolCallIds: true,
			toolCallIdMode: "strict",
			...options.preserveNativeAnthropicToolUseIds ? { preserveNativeAnthropicToolUseIds: true } : {}
		} : {},
		preserveSignatures: true,
		appendOnlyRuntimeContext: options.appendOnlyRuntimeContext ?? false,
		repairToolUseResultPairing: true,
		validateAnthropicTurns: true,
		allowSyntheticToolResults: true,
		...options.dropThinkingBlocks ? { dropThinkingBlocks: true } : {}
	};
}
/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
function shouldDropClaudeThinkingBlocks(modelId, model) {
	const ref = {
		id: modelId,
		params: model?.params
	};
	const canonicalId = resolveClaudeModelIdentity(ref);
	const isClaude = canonicalId.startsWith("claude-") || resolveClaudeOpus5ModelIdentity(ref) !== void 0;
	const preservesThinking = resolveClaudeOpus5ModelIdentity(ref) !== void 0 || /(?:^|-)claude-(?:fable-5|mythos-(?:5|preview)|opus-4-(?:5|6|7|8)|sonnet-(?:5|4-6))(?=$|[^a-z0-9])/.test(canonicalId);
	return isClaude && !preservesThinking;
}
/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
function buildAnthropicReplayPolicyForModel(modelId, model) {
	return buildStrictAnthropicReplayPolicy({
		dropThinkingBlocks: shouldDropClaudeThinkingBlocks(modelId, model),
		appendOnlyRuntimeContext: bindsClaudeThinkingPrefix({
			id: modelId,
			params: model?.params
		})
	});
}
/** @deprecated Anthropic-family provider replay helper; prefer provider-local replay hooks. */
function buildNativeAnthropicReplayPolicyForModel(modelId, model) {
	return {
		...buildAnthropicReplayPolicyForModel(modelId, model),
		preserveNativeAnthropicToolUseIds: true
	};
}
/** @deprecated Provider replay helper; prefer provider-local replay hooks. */
function buildHybridAnthropicOrOpenAIReplayPolicy(ctx, options = {}) {
	if (ctx.modelApi === "anthropic-messages" || ctx.modelApi === "bedrock-converse-stream") return buildStrictAnthropicReplayPolicy({
		appendOnlyRuntimeContext: bindsClaudeThinkingPrefix({
			id: ctx.modelId,
			params: ctx.model?.params
		}),
		dropThinkingBlocks: options.anthropicModelDropThinkingBlocks && shouldDropClaudeThinkingBlocks(ctx.modelId, ctx.model)
	});
	return buildOpenAICompatibleReplayPolicy(ctx.modelApi, { modelId: ctx.modelId });
}
const GOOGLE_TURN_ORDERING_CUSTOM_TYPE = "google-turn-ordering-bootstrap";
function hasGoogleTurnOrderingMarker(sessionState) {
	return sessionState.getCustomEntries().some((entry) => entry.customType === GOOGLE_TURN_ORDERING_CUSTOM_TYPE);
}
function markGoogleTurnOrderingMarker(sessionState) {
	sessionState.appendCustomEntry(GOOGLE_TURN_ORDERING_CUSTOM_TYPE, { timestamp: Date.now() });
}
/** @deprecated Google provider replay helper; prefer provider-local replay hooks. */
function buildGoogleGeminiReplayPolicy() {
	return {
		appendOnlyRuntimeContext: false,
		sanitizeMode: "full",
		sanitizeToolCallIds: true,
		toolCallIdMode: "strict",
		sanitizeThoughtSignatures: {
			allowBase64Only: true,
			includeCamelCase: true
		},
		repairToolUseResultPairing: true,
		applyAssistantFirstOrderingFix: true,
		validateGeminiTurns: true,
		validateAnthropicTurns: false,
		allowSyntheticToolResults: true
	};
}
/** @deprecated Google provider replay helper; prefer provider-local replay hooks. */
function buildPassthroughGeminiSanitizingReplayPolicy(modelId) {
	return {
		applyAssistantFirstOrderingFix: false,
		validateGeminiTurns: false,
		validateAnthropicTurns: false,
		...normalizeLowercaseStringOrEmpty(modelId).includes("gemini") ? { sanitizeThoughtSignatures: {
			allowBase64Only: true,
			includeCamelCase: true
		} } : {}
	};
}
/** @deprecated Google provider replay helper; prefer provider-local replay hooks. */
function sanitizeGoogleGeminiReplayHistory(ctx) {
	const messages = sanitizeGoogleAssistantFirstOrdering(ctx.messages);
	if (messages !== ctx.messages && ctx.sessionState && !hasGoogleTurnOrderingMarker(ctx.sessionState)) markGoogleTurnOrderingMarker(ctx.sessionState);
	return messages;
}
/** @deprecated Provider replay helper; prefer provider-local replay hooks. */
function resolveTaggedReasoningOutputMode() {
	return "tagged";
}
//#endregion
export { buildOpenAICompatibleReplayPolicy as a, resolveTaggedReasoningOutputMode as c, buildNativeAnthropicReplayPolicyForModel as i, sanitizeGoogleGeminiReplayHistory as l, buildGoogleGeminiReplayPolicy as n, buildPassthroughGeminiSanitizingReplayPolicy as o, buildHybridAnthropicOrOpenAIReplayPolicy as r, buildStrictAnthropicReplayPolicy as s, buildAnthropicReplayPolicyForModel as t, shouldDropClaudeThinkingBlocks as u };
