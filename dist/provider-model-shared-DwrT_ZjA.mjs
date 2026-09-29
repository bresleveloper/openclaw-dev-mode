import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import "./model-selection-normalize-Dij_chYC.mjs";
import "./provider-attribution-DUtJJsHV.mjs";
import "./src-BpANEEBH.mjs";
import "./gpt5-prompt-overlay-BWi_VFCL.mjs";
import { i as normalizeModelCompat } from "./provider-model-compat-D1iLDbYW.mjs";
import { a as buildOpenAICompatibleReplayPolicy, c as resolveTaggedReasoningOutputMode, i as buildNativeAnthropicReplayPolicyForModel, l as sanitizeGoogleGeminiReplayHistory, n as buildGoogleGeminiReplayPolicy, o as buildPassthroughGeminiSanitizingReplayPolicy, r as buildHybridAnthropicOrOpenAIReplayPolicy, t as buildAnthropicReplayPolicyForModel } from "./provider-replay-helpers-CXnvOz8t.mjs";
import "./moonshot-thinking-WDULA5E2.mjs";
import { t as definePluginEntry } from "./plugin-entry-BOulgRcx.mjs";
import { n as buildFamilyForwardCompatModel, r as buildFirstTemplateModel } from "./provider-model-id-match-D2_RDP_w.mjs";
//#region src/plugins/provider-model-helpers.ts
function cloneFirstTemplateModel(params) {
	return buildFirstTemplateModel(params, normalizeModelCompat);
}
function resolveFamilyForwardCompatModel(params) {
	return buildFamilyForwardCompatModel(params, normalizeModelCompat);
}
//#endregion
//#region src/plugin-sdk/provider-model-shared.ts
/** Defines the canonical setup, discovery, and wizard flow for one self-hosted OpenAI endpoint. */
function defineSelfHostedOpenAICompatibleProvider(options) {
	const loadProviderSetup = async () => await import("./plugin-sdk/provider-setup.js");
	return definePluginEntry({
		id: options.id,
		name: `${options.label} Provider`,
		description: `Bundled ${options.label} provider plugin`,
		register(api) {
			api.registerProvider({
				...options.overrides,
				id: options.id,
				label: options.label,
				docsPath: `/providers/${options.id}`,
				envVars: [options.apiKeyEnvVar],
				auth: [{
					id: "custom",
					label: options.label,
					hint: options.hint,
					kind: "custom",
					run: async (ctx) => {
						return await (await loadProviderSetup()).promptAndConfigureOpenAICompatibleSelfHostedProviderAuth({
							cfg: ctx.config,
							prompter: ctx.prompter,
							providerId: options.id,
							providerLabel: options.label,
							defaultBaseUrl: options.defaultBaseUrl,
							defaultApiKeyEnvVar: options.apiKeyEnvVar,
							modelPlaceholder: options.modelPlaceholder
						});
					},
					runNonInteractive: async (ctx) => {
						return await (await loadProviderSetup()).configureOpenAICompatibleSelfHostedProviderNonInteractive({
							ctx,
							providerId: options.id,
							providerLabel: options.label,
							defaultBaseUrl: options.defaultBaseUrl,
							defaultApiKeyEnvVar: options.apiKeyEnvVar,
							modelPlaceholder: options.modelPlaceholder
						});
					}
				}],
				catalog: {
					order: "late",
					run: async (ctx) => {
						const setup = await loadProviderSetup();
						return await setup.discoverOpenAICompatibleSelfHostedProvider({
							ctx,
							providerId: options.id,
							buildProvider: async (params) => {
								const baseUrl = (params?.baseUrl?.trim() || options.defaultBaseUrl).replace(/\/+$/, "");
								return {
									baseUrl,
									api: "openai-completions",
									models: await setup.discoverOpenAICompatibleLocalModels({
										baseUrl,
										apiKey: params?.apiKey,
										label: options.label,
										discoverRuntimeContext: false
									})
								};
							}
						});
					}
				},
				wizard: {
					setup: {
						choiceId: options.id,
						choiceLabel: options.label,
						choiceHint: options.hint,
						groupId: options.id,
						groupLabel: options.label,
						groupHint: options.groupHint,
						methodId: "custom"
					},
					modelPicker: {
						label: `${options.label} (custom)`,
						hint: `Enter ${options.label} URL + API key + model`,
						methodId: "custom"
					}
				}
			});
		}
	});
}
/** Compare canonical flat rates without assuming display-only models include cost metadata. */
function modelCostsEqual(current, expected) {
	return current?.input === expected.input && current?.output === expected.output && current?.cacheRead === expected.cacheRead && current?.cacheWrite === expected.cacheWrite;
}
const LOCAL_MODEL_FAMILY_PREFERENCES = [
	/gemma[-_.]?4(?!\d)/,
	/qwen[-_.]?3[._]5(?!\d)/,
	/qwen[-_.]?3(?!\d)/,
	/gpt[-_.]?oss/,
	/gemma[-_.]?3(?!\d)/,
	/llama[-_.]?4(?!\d)/,
	/llama[-_.]?3(?!\d)/,
	/phi[-_.]?4(?!\d)/,
	/mistral/,
	/deepseek/
];
const LOCAL_MODEL_SPECIALIST_PATTERN = /embed|rerank|whisper|-vl\b|vision|omni|guard/;
/**
* Setup-assistant preference for agentic tool-calling quality in current BFCL-class results.
* Heuristic contract; safe to retune as local model families improve.
*/
function selectPreferredLocalModelId(modelIds) {
	const familyCount = LOCAL_MODEL_FAMILY_PREFERENCES.length;
	let preferred;
	let preferredRank = Number.POSITIVE_INFINITY;
	for (const rawId of modelIds) {
		const id = rawId.trim();
		if (!id) continue;
		const normalized = id.toLowerCase();
		const familyRank = LOCAL_MODEL_FAMILY_PREFERENCES.findIndex((pattern) => pattern.test(normalized));
		const rank = LOCAL_MODEL_SPECIALIST_PATTERN.test(normalized) ? familyCount * 3 : familyRank >= 0 ? familyRank + (normalized.includes("coder") ? familyCount : 0) : familyCount * 2 + (normalized.includes("coder") ? 1 : 0);
		if (rank < preferredRank) {
			preferred = id;
			preferredRank = rank;
		}
	}
	return preferred;
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
		case "anthropic-by-model": return { buildReplayPolicy: ({ modelId, model }) => buildAnthropicReplayPolicyForModel(modelId, model) };
		case "native-anthropic-by-model": return { buildReplayPolicy: ({ modelId, model }) => buildNativeAnthropicReplayPolicyForModel(modelId, model) };
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
export { buildProviderReplayFamilyHooks as a, modelCostsEqual as c, resolveFamilyForwardCompatModel as d, PASSTHROUGH_GEMINI_REPLAY_HOOKS as i, selectPreferredLocalModelId as l, NATIVE_ANTHROPIC_REPLAY_HOOKS as n, defineSelfHostedOpenAICompatibleProvider as o, OPENAI_COMPATIBLE_REPLAY_HOOKS as r, isProxyReasoningUnsupportedModelHint as s, ANTHROPIC_BY_MODEL_REPLAY_HOOKS as t, cloneFirstTemplateModel as u };
