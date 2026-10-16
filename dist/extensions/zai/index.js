import { d as openclaw_plugin_default, l as buildZaiModelDefinition, u as resolveZaiBaseUrl } from "./.setup/model-definitions-DjGQ-3Uy.mjs";
import { detectZaiEndpoint } from "./detect.js";
import { zaiMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { applyZaiConnectionConfig, applyZaiProviderConnectionConfig, resolveZaiModelId } from "./onboard.js";
import { resolveThinkingProfile, resolveZaiReasoningEffort } from "./provider-policy-api.js";
import { buildZaiVideoGenerationProvider } from "./video-generation-provider.js";
import { applyAuthProfileConfig, buildApiKeyCredential, captureProviderApiKey, normalizeOptionalSecretInput, persistProviderApiKey } from "openclaw/plugin-sdk/provider-auth-api-key";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks, resolveFamilyForwardCompatModel } from "openclaw/plugin-sdk/provider-model-shared";
import { createPayloadPatchStreamWrapper, createToolStreamWrapper, defaultToolStreamExtraParams } from "openclaw/plugin-sdk/provider-stream-shared";
import { fetchZaiUsage } from "openclaw/plugin-sdk/provider-usage";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/zai/index.ts
const PROVIDER_ID = "zai";
const GLM5_TEMPLATE_MODEL_ID = "glm-4.7";
const PROFILE_ID = "zai:default";
function resolveGlm5ForwardCompatModel(ctx) {
	return resolveFamilyForwardCompatModel({
		providerId: PROVIDER_ID,
		ctx,
		cases: [{
			match: (id) => id.startsWith("glm-5"),
			templateIds: [GLM5_TEMPLATE_MODEL_ID],
			patch: ({ modelId, template }) => {
				const def = buildZaiModelDefinition({ id: modelId });
				return {
					name: def.name,
					baseUrl: ctx.providerConfig?.baseUrl ?? template?.baseUrl ?? resolveZaiBaseUrl(),
					api: "openai-completions",
					provider: PROVIDER_ID,
					reasoning: def.reasoning,
					input: def.input,
					cost: def.cost,
					contextWindow: def.contextWindow,
					maxTokens: def.maxTokens
				};
			}
		}],
		preserveExisting: true,
		synthesize: true
	});
}
function wrapZaiStreamFn(ctx) {
	const streamFn = createToolStreamWrapper(ctx.streamFn, ctx.extraParams?.tool_stream !== false);
	const preserveThinking = ctx.extraParams?.preserveThinking === true || ctx.extraParams?.preserve_thinking === true;
	const reasoningEffort = resolveZaiReasoningEffort(ctx.modelId, ctx.thinkingLevel);
	const disableThinking = ctx.thinkingLevel === "off" && !reasoningEffort;
	if (!disableThinking && !preserveThinking && !reasoningEffort) return streamFn;
	return createPayloadPatchStreamWrapper(streamFn, ({ payload, model }) => {
		if (model.api !== "openai-completions" || model.provider !== PROVIDER_ID) return;
		if (disableThinking) {
			payload.thinking = { type: "disabled" };
			return;
		}
		if (reasoningEffort) payload.reasoning_effort = reasoningEffort;
		if (preserveThinking) payload.thinking = {
			type: "enabled",
			clear_thinking: false
		};
	});
}
async function promptForZaiEndpoint(ctx) {
	return await ctx.prompter.select({
		message: "Select Z.AI endpoint",
		initialValue: "global",
		options: [
			{
				value: "global",
				label: "Global",
				hint: "Z.AI Global (api.z.ai)"
			},
			{
				value: "cn",
				label: "CN",
				hint: "Z.AI CN (open.bigmodel.cn)"
			},
			{
				value: "coding-global",
				label: "Coding-Plan-Global",
				hint: "GLM Coding Plan Global (api.z.ai)"
			},
			{
				value: "coding-cn",
				label: "Coding-Plan-CN",
				hint: "GLM Coding Plan CN (open.bigmodel.cn)"
			}
		]
	});
}
async function runZaiApiKeyAuth(ctx, endpoint) {
	const { apiKey, input, mode } = await captureProviderApiKey(ctx, {
		token: normalizeOptionalSecretInput(ctx.opts?.zaiApiKey) ?? normalizeOptionalSecretInput(ctx.opts?.token),
		tokenProvider: normalizeOptionalSecretInput(ctx.opts?.zaiApiKey) ? PROVIDER_ID : normalizeOptionalSecretInput(ctx.opts?.tokenProvider),
		expectedProviders: [PROVIDER_ID, "z-ai"],
		provider: PROVIDER_ID,
		envLabel: "ZAI_API_KEY",
		promptMessage: "Enter Z.AI API key",
		missingInputMessage: "Missing Z.AI API key."
	});
	const detected = await detectZaiEndpoint({
		apiKey,
		...endpoint ? { endpoint } : {}
	});
	const modelIdOverride = detected?.modelId;
	const nextEndpoint = detected?.endpoint ?? endpoint ?? await promptForZaiEndpoint(ctx);
	const preset = {
		...nextEndpoint ? { endpoint: nextEndpoint } : {},
		...modelIdOverride ? { modelId: modelIdOverride } : {}
	};
	return {
		profiles: [{
			profileId: PROFILE_ID,
			credential: buildApiKeyCredential(PROVIDER_ID, input, void 0, mode ? { secretInputMode: mode } : void 0)
		}],
		configPatch: applyZaiProviderConnectionConfig(ctx.config, preset),
		defaultModel: `zai/${resolveZaiModelId(preset)}`,
		...detected?.note ? { notes: [detected.note] } : {}
	};
}
async function runZaiApiKeyAuthNonInteractive(ctx, endpoint) {
	const resolved = await ctx.resolveApiKey({
		provider: PROVIDER_ID,
		flagValue: normalizeOptionalSecretInput(ctx.opts.zaiApiKey),
		flagName: "--zai-api-key",
		envVar: "ZAI_API_KEY"
	});
	if (!resolved) return null;
	const detected = await detectZaiEndpoint({
		apiKey: resolved.key,
		...endpoint ? { endpoint } : {}
	});
	const modelIdOverride = detected?.modelId;
	const nextEndpoint = detected?.endpoint ?? endpoint;
	if (!await persistProviderApiKey(ctx, PROFILE_ID, {
		provider: PROVIDER_ID,
		resolved
	})) return null;
	const next = applyAuthProfileConfig(ctx.config, {
		profileId: PROFILE_ID,
		provider: PROVIDER_ID,
		mode: "api_key"
	});
	return applyZaiConnectionConfig(next, {
		...nextEndpoint ? { endpoint: nextEndpoint } : {},
		...modelIdOverride ? { modelId: modelIdOverride } : {}
	});
}
function buildZaiApiKeyMethod(choice) {
	const endpoint = [
		"global",
		"cn",
		"coding-global",
		"coding-cn"
	].find((id) => id === choice.method);
	return {
		id: choice.method,
		label: choice.choiceLabel,
		hint: choice.choiceHint,
		kind: "api_key",
		wizard: {
			choiceId: choice.choiceId,
			choiceLabel: choice.choiceLabel,
			...choice.choiceHint ? { choiceHint: choice.choiceHint } : {},
			groupId: choice.groupId,
			groupLabel: choice.groupLabel,
			groupHint: choice.groupHint
		},
		run: async (ctx) => await runZaiApiKeyAuth(ctx, endpoint),
		runNonInteractive: async (ctx) => await runZaiApiKeyAuthNonInteractive(ctx, endpoint)
	};
}
var zai_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Z.AI Provider",
	description: "Bundled Z.AI provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Z.AI",
		aliases: ["z-ai", "z.ai"],
		docsPath: "/providers/models",
		envVars: ["ZAI_API_KEY", "Z_AI_API_KEY"],
		auth: [],
		extraAuth: openclaw_plugin_default.providerAuthChoices.map(buildZaiApiKeyMethod),
		catalog: {
			allowExplicitBaseUrl: true,
			liveModelDiscovery: true,
			discoveryMode: "strict"
		},
		resolveDynamicModel: resolveGlm5ForwardCompatModel,
		matchesContextOverflowError: ({ errorMessage }) => /\b(?:tokens? in request more than max tokens? allowed|prompt exceeds max(?:imum)? length)\b/i.test(errorMessage),
		...buildProviderReplayFamilyHooks({
			family: "openai-compatible",
			dropReasoningFromHistory: false
		}),
		prepareExtraParams: (ctx) => defaultToolStreamExtraParams(ctx.extraParams),
		wrapStreamFn: wrapZaiStreamFn,
		resolveThinkingProfile,
		isModernModelRef: ({ modelId }) => {
			const lower = normalizeLowercaseStringOrEmpty(modelId);
			return lower.startsWith("glm-5") || lower.startsWith("glm-4.7");
		},
		resolveUsageAuth: async (ctx) => {
			const apiKey = ctx.resolveApiKeyFromConfigAndStore({
				providerIds: [PROVIDER_ID, "z-ai"],
				envDirect: [ctx.env.ZAI_API_KEY, ctx.env.Z_AI_API_KEY]
			});
			return apiKey ? { token: apiKey } : null;
		},
		fetchUsageSnapshot: async (ctx) => await fetchZaiUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn),
		isCacheTtlEligible: () => true
	},
	register(api) {
		api.registerMediaUnderstandingProvider(zaiMediaUnderstandingProvider);
		api.registerVideoGenerationProvider(buildZaiVideoGenerationProvider());
	}
});
//#endregion
export { zai_default as default };
