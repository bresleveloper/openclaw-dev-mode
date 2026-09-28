import { B as isQwen38ModelId, D as QWEN_TOKEN_PLAN_LEGACY_PROVIDER_ID, H as isQwenStandardOnlyModelId, J as supportsQwenTokenPlanGlmMaxThinking, K as isQwenTokenPlanThinkingOnlyModelId, T as QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF, U as isQwenTokenPlanDeepSeekV4ModelId, V as isQwenCodingPlanBaseUrl, W as isQwenTokenPlanGlmModelId, k as QWEN_TOKEN_PLAN_PROVIDER_ID, v as QWEN_DEFAULT_MODEL_REF } from "./.setup/models-DIZ7f-Lx.mjs";
import { buildQwenMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { buildQwenProvider, buildQwenTokenPlanProvider } from "./provider-catalog.js";
import { applyQwenConfig, applyQwenConfigCn, applyQwenStandardConfig, applyQwenStandardConfigCn, applyQwenTokenPlanConfig } from "./onboard.js";
import { wrapQwenProviderStream } from "./stream.js";
import { qwenVideoGenerationProvider } from "./video-generation-provider.js";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { buildOpenAICompatibleLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/qwen/index.ts
const PROVIDER_ID = "qwen";
const LEGACY_PROVIDER_ID = "modelstudio";
const QWEN_TOKEN_PLAN_THINKING_LEVEL_IDS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const QWEN_TOKEN_PLAN_GLM_NO_MAX_THINKING_LEVEL_IDS = QWEN_TOKEN_PLAN_THINKING_LEVEL_IDS.filter((id) => id !== "max");
function resolveConfiguredQwenBaseUrl(config) {
	const providers = config?.models?.providers;
	if (!providers) return;
	for (const [providerId, provider] of Object.entries(providers)) {
		const normalized = normalizeLowercaseStringOrEmpty(providerId);
		if (normalized !== PROVIDER_ID && normalized !== LEGACY_PROVIDER_ID) continue;
		const baseUrl = provider?.baseUrl?.trim();
		if (baseUrl) return baseUrl;
	}
}
function resolveConfiguredQwenTokenPlanBaseUrl(config) {
	const providers = config?.models?.providers;
	if (!providers) return;
	for (const [providerId, provider] of Object.entries(providers)) {
		if (normalizeLowercaseStringOrEmpty(providerId) !== "qwen-token-plan") continue;
		const baseUrl = provider?.baseUrl?.trim();
		if (baseUrl) return baseUrl;
	}
}
function createQwenTokenPlanAuthMethod(region) {
	const isCn = region === "cn";
	const regionLabel = isCn ? "China" : "Global/Intl";
	const host = isCn ? "token-plan.cn-beijing.maas.aliyuncs.com" : "token-plan.ap-southeast-1.maas.aliyuncs.com";
	return createProviderApiKeyAuthMethod({
		providerId: QWEN_TOKEN_PLAN_PROVIDER_ID,
		methodId: isCn ? "api-key-cn" : "api-key",
		label: `Qwen Token Plan API Key for ${regionLabel} (subscription)`,
		hint: `Endpoint: ${host}`,
		optionKey: isCn ? "qwenTokenPlanApiKeyCn" : "qwenTokenPlanApiKey",
		flagName: isCn ? "--qwen-token-plan-api-key-cn" : "--qwen-token-plan-api-key",
		envVar: "QWEN_TOKEN_PLAN_API_KEY",
		promptMessage: `Enter Alibaba Qwen Token Plan API key (${regionLabel}, sk-sp-...)`,
		defaultModel: QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF,
		applyConfig: (cfg) => applyQwenTokenPlanConfig(cfg, region),
		wizard: {
			choiceId: isCn ? "qwen-token-plan-cn" : "qwen-token-plan",
			choiceLabel: `Qwen Token Plan (${regionLabel})`,
			choiceHint: `Endpoint: ${host}`,
			groupId: "qwen",
			groupLabel: "Qwen Cloud",
			groupHint: "Standard / Coding Plan / Token Plan"
		}
	});
}
function resolveQwenTokenPlanThinkingProfile(modelId) {
	const qwenProfile = resolveQwenThinkingProfile(modelId);
	if (qwenProfile) return qwenProfile;
	if (isQwenTokenPlanThinkingOnlyModelId(modelId)) return {
		levels: [{
			id: "low",
			label: "on"
		}],
		defaultLevel: "low",
		preserveWhenCatalogReasoningFalse: true
	};
	if (isQwenTokenPlanDeepSeekV4ModelId(modelId)) return {
		levels: QWEN_TOKEN_PLAN_THINKING_LEVEL_IDS.map((id) => ({ id })),
		defaultLevel: "high"
	};
	if (isQwenTokenPlanGlmModelId(modelId)) return {
		levels: (supportsQwenTokenPlanGlmMaxThinking(modelId) ? QWEN_TOKEN_PLAN_THINKING_LEVEL_IDS : QWEN_TOKEN_PLAN_GLM_NO_MAX_THINKING_LEVEL_IDS).map((id) => ({ id })),
		defaultLevel: "high"
	};
}
function resolveQwenThinkingProfile(modelId) {
	return isQwen38ModelId(modelId) ? {
		levels: [
			"off",
			"low",
			"medium",
			"xhigh"
		].map((id) => ({ id })),
		defaultLevel: "xhigh"
	} : void 0;
}
var qwen_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Qwen Provider",
	description: "Bundled Qwen Cloud provider plugin",
	provider: {
		label: "Qwen Cloud",
		docsPath: "/providers/qwen",
		aliases: ["modelstudio", "qwencloud"],
		auth: [
			{
				methodId: "standard-api-key-cn",
				label: "Standard API Key for China (pay-as-you-go)",
				hint: "Endpoint: dashscope.aliyuncs.com",
				optionKey: "modelstudioStandardApiKeyCn",
				flagName: "--modelstudio-standard-api-key-cn",
				envVar: "QWEN_API_KEY",
				promptMessage: "Enter Qwen Cloud API key (China standard endpoint)",
				defaultModel: QWEN_DEFAULT_MODEL_REF,
				applyConfig: (cfg) => applyQwenStandardConfigCn(cfg),
				noteMessage: [
					"Manage API keys: https://home.qwencloud.com/api-keys",
					"Docs: https://docs.qwencloud.com/",
					"Endpoint: dashscope.aliyuncs.com/compatible-mode/v1",
					"Models: qwen3.8-max, qwen3.8-flash, qwen3.7-plus, and other discovered models."
				].join("\n"),
				noteTitle: "Qwen Cloud Standard (China)",
				wizard: {
					choiceHint: "Endpoint: dashscope.aliyuncs.com",
					groupLabel: "Qwen Cloud",
					groupHint: "Standard / Coding Plan (CN / Global) + multimodal roadmap"
				}
			},
			{
				methodId: "standard-api-key",
				label: "Standard API Key for Global/Intl (pay-as-you-go)",
				hint: "Endpoint: dashscope-intl.aliyuncs.com",
				optionKey: "modelstudioStandardApiKey",
				flagName: "--modelstudio-standard-api-key",
				envVar: "QWEN_API_KEY",
				promptMessage: "Enter Qwen Cloud API key (Global/Intl standard endpoint)",
				defaultModel: QWEN_DEFAULT_MODEL_REF,
				applyConfig: (cfg) => applyQwenStandardConfig(cfg),
				noteMessage: [
					"Manage API keys: https://home.qwencloud.com/api-keys",
					"Docs: https://docs.qwencloud.com/",
					"Endpoint: dashscope-intl.aliyuncs.com/compatible-mode/v1",
					"Models: qwen3.8-max, qwen3.8-flash, qwen3.7-plus, and other discovered models."
				].join("\n"),
				noteTitle: "Qwen Cloud Standard (Global/Intl)",
				wizard: {
					choiceHint: "Endpoint: dashscope-intl.aliyuncs.com",
					groupLabel: "Qwen Cloud",
					groupHint: "Standard / Coding Plan (CN / Global) + multimodal roadmap"
				}
			},
			{
				methodId: "api-key-cn",
				label: "Coding Plan API Key for China (subscription)",
				hint: "Endpoint: coding.dashscope.aliyuncs.com",
				optionKey: "modelstudioApiKeyCn",
				flagName: "--modelstudio-api-key-cn",
				envVar: "QWEN_API_KEY",
				promptMessage: "Enter Qwen Cloud Coding Plan API key (China)",
				defaultModel: QWEN_DEFAULT_MODEL_REF,
				applyConfig: (cfg) => applyQwenConfigCn(cfg),
				noteMessage: [
					"Manage API keys: https://home.qwencloud.com/api-keys",
					"Docs: https://docs.qwencloud.com/",
					"Endpoint: coding.dashscope.aliyuncs.com",
					"Models: qwen3.5-plus, glm-5, kimi-k2.5, MiniMax-M2.5, etc."
				].join("\n"),
				noteTitle: "Qwen Cloud Coding Plan (China)",
				wizard: {
					choiceHint: "Endpoint: coding.dashscope.aliyuncs.com",
					groupLabel: "Qwen Cloud",
					groupHint: "Standard / Coding Plan (CN / Global) + multimodal roadmap"
				}
			},
			{
				methodId: "api-key",
				label: "Coding Plan API Key for Global/Intl (subscription)",
				hint: "Endpoint: coding-intl.dashscope.aliyuncs.com",
				optionKey: "modelstudioApiKey",
				flagName: "--modelstudio-api-key",
				envVar: "QWEN_API_KEY",
				promptMessage: "Enter Qwen Cloud Coding Plan API key (Global/Intl)",
				defaultModel: QWEN_DEFAULT_MODEL_REF,
				applyConfig: (cfg) => applyQwenConfig(cfg),
				noteMessage: [
					"Manage API keys: https://home.qwencloud.com/api-keys",
					"Docs: https://docs.qwencloud.com/",
					"Endpoint: coding-intl.dashscope.aliyuncs.com",
					"Models: qwen3.5-plus, glm-5, kimi-k2.5, MiniMax-M2.5, etc."
				].join("\n"),
				noteTitle: "Qwen Cloud Coding Plan (Global/Intl)",
				wizard: {
					choiceHint: "Endpoint: coding-intl.dashscope.aliyuncs.com",
					groupLabel: "Qwen Cloud",
					groupHint: "Standard / Coding Plan (CN / Global) + multimodal roadmap"
				}
			}
		],
		catalog: {
			run: async (ctx) => {
				const auth = ctx.resolveProviderApiKey(PROVIDER_ID);
				if (!auth.apiKey) return null;
				const baseUrl = resolveConfiguredQwenBaseUrl(ctx.config) ?? "https://coding-intl.dashscope.aliyuncs.com/v1";
				return await buildOpenAICompatibleLiveProviderCatalog({
					discoveryMode: "strict",
					providerId: PROVIDER_ID,
					providerConfig: buildQwenProvider({ baseUrl }),
					apiKey: auth.apiKey,
					discoveryApiKey: auth.discoveryApiKey,
					profileId: auth.profileId
				});
			},
			staticRun: async () => ({ provider: buildQwenProvider() })
		},
		wrapStreamFn: wrapQwenProviderStream,
		wrapSimpleCompletionStreamFn: wrapQwenProviderStream,
		resolveThinkingProfile: ({ modelId }) => resolveQwenThinkingProfile(modelId),
		normalizeConfig: ({ providerConfig }) => {
			if (!isQwenCodingPlanBaseUrl(providerConfig.baseUrl)) return;
			const models = providerConfig.models?.filter((model) => !isQwenStandardOnlyModelId(model.id));
			return models && models.length !== providerConfig.models?.length ? {
				...providerConfig,
				models
			} : void 0;
		}
	},
	register(api) {
		api.registerProvider({
			id: QWEN_TOKEN_PLAN_PROVIDER_ID,
			label: "Qwen Token Plan",
			docsPath: "/providers/qwen",
			envVars: ["QWEN_TOKEN_PLAN_API_KEY"],
			auth: [createQwenTokenPlanAuthMethod("global"), createQwenTokenPlanAuthMethod("cn")],
			catalog: {
				order: "simple",
				run: async (ctx) => {
					const auth = ctx.resolveProviderApiKey(QWEN_TOKEN_PLAN_PROVIDER_ID);
					if (!auth.apiKey) return null;
					const baseUrl = resolveConfiguredQwenTokenPlanBaseUrl(ctx.config);
					return await buildOpenAICompatibleLiveProviderCatalog({
						discoveryMode: "strict",
						providerId: QWEN_TOKEN_PLAN_PROVIDER_ID,
						providerConfig: buildQwenTokenPlanProvider({ baseUrl }),
						apiKey: auth.apiKey,
						discoveryApiKey: auth.discoveryApiKey,
						profileId: auth.profileId
					});
				}
			},
			staticCatalog: {
				order: "simple",
				run: async () => ({ provider: buildQwenTokenPlanProvider() })
			},
			wrapStreamFn: wrapQwenProviderStream,
			wrapSimpleCompletionStreamFn: wrapQwenProviderStream,
			resolveThinkingProfile: ({ modelId }) => resolveQwenTokenPlanThinkingProfile(modelId)
		});
		api.registerProvider({
			id: QWEN_TOKEN_PLAN_LEGACY_PROVIDER_ID,
			label: "Alibaba Token Plan (legacy custom config)",
			docsPath: "/providers/qwen",
			auth: [],
			wrapStreamFn: wrapQwenProviderStream,
			wrapSimpleCompletionStreamFn: wrapQwenProviderStream
		});
		api.registerMediaUnderstandingProvider(buildQwenMediaUnderstandingProvider());
		api.registerVideoGenerationProvider(qwenVideoGenerationProvider);
	}
});
//#endregion
export { qwen_default as default };
