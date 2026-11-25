import { classifyQwenFailoverReason } from "./failover.js";
import { B as isQwenStandardOnlyModelId, D as QWEN_TOKEN_PLAN_LEGACY_PROVIDER_ID, G as resolveQwenTokenPlanBaseUrl, H as isQwenTokenPlanGlmModelId, K as supportsQwenTokenPlanGlmMaxThinking, R as isQwen38ModelId, S as QWEN_STANDARD_GLOBAL_BASE_URL, T as QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF, V as isQwenTokenPlanDeepSeekV4ModelId, W as isQwenTokenPlanThinkingOnlyModelId, h as QWEN_CN_BASE_URL, k as QWEN_TOKEN_PLAN_PROVIDER_ID, v as QWEN_DEFAULT_MODEL_REF, x as QWEN_STANDARD_CN_BASE_URL, y as QWEN_GLOBAL_BASE_URL, z as isQwenCodingPlanBaseUrl } from "./.setup/models-BHyvoc6Y.mjs";
import { buildQwenProvider, buildQwenTokenPlanProvider } from "./provider-catalog.js";
import { wrapQwenProviderStream } from "./stream.js";
import { qwenVideoGenerationProvider } from "./video-generation-provider.js";
import { describeOpenAiCompatibleVideo } from "openclaw/plugin-sdk/media-understanding";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { buildOpenAICompatibleLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/qwen/index.ts
const PROVIDER_ID = "qwen";
const LEGACY_PROVIDER_ID = "modelstudio";
const DEFAULT_QWEN_MEDIA_MODEL = "qwen3.6-plus";
const DEFAULT_QWEN_VIDEO_PROMPT = "Describe the video in detail.";
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
const qwenPresetAppliers = createProviderConnectionPresetAppliers({
	primaryModelRef: QWEN_DEFAULT_MODEL_REF,
	resolveParams: (_cfg, baseUrl) => {
		const provider = buildQwenProvider({ baseUrl });
		return {
			providerId: "qwen",
			api: provider.api ?? "openai-completions",
			baseUrl,
			catalogModels: provider.models,
			aliases: [...provider.models.flatMap((model) => [`qwen/${model.id}`, `modelstudio/${model.id}`]), {
				modelRef: QWEN_DEFAULT_MODEL_REF,
				alias: "Qwen"
			}]
		};
	}
});
const qwenTokenPlanPresetAppliers = createProviderConnectionPresetAppliers({
	primaryModelRef: QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF,
	resolveParams: (_cfg, baseUrl) => {
		const provider = buildQwenTokenPlanProvider({ baseUrl });
		return {
			providerId: QWEN_TOKEN_PLAN_PROVIDER_ID,
			api: provider.api ?? "openai-completions",
			baseUrl,
			catalogModels: provider.models,
			aliases: [...provider.models.map((model) => `${QWEN_TOKEN_PLAN_PROVIDER_ID}/${model.id}`), {
				modelRef: QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF,
				alias: "Qwen Token Plan"
			}]
		};
	}
});
function resolveConfiguredQwenBaseUrl(config, providerIds) {
	for (const [providerId, provider] of Object.entries(config?.models?.providers ?? {})) {
		if (!providerIds.includes(normalizeLowercaseStringOrEmpty(providerId))) continue;
		const baseUrl = provider?.baseUrl?.trim();
		if (baseUrl) return baseUrl;
	}
}
async function resolveQwenCatalog(ctx, providerId) {
	const auth = ctx.resolveProviderApiKey(providerId);
	if (!auth.apiKey) return null;
	const baseUrl = resolveConfiguredQwenBaseUrl(ctx.config, providerId === PROVIDER_ID ? [PROVIDER_ID, LEGACY_PROVIDER_ID] : [providerId]);
	return await buildOpenAICompatibleLiveProviderCatalog({
		discoveryMode: "strict",
		providerId,
		providerConfig: (providerId === PROVIDER_ID ? buildQwenProvider : buildQwenTokenPlanProvider)({ baseUrl }),
		apiKey: auth.apiKey,
		discoveryApiKey: auth.discoveryApiKey,
		profileId: auth.profileId
	});
}
function createQwenAuthMethod(plan, region) {
	const isStandard = plan === "standard";
	const isCn = region === "cn";
	const regionLabel = isCn ? "China" : "Global/Intl";
	const planLabel = isStandard ? "Standard" : "Coding Plan";
	const host = isStandard ? isCn ? "dashscope.aliyuncs.com" : "dashscope-intl.aliyuncs.com" : isCn ? "coding.dashscope.aliyuncs.com" : "coding-intl.dashscope.aliyuncs.com";
	const standardKey = isStandard ? "Standard" : "";
	const standardFlag = isStandard ? "standard-" : "";
	return {
		methodId: `${standardFlag}api-key${isCn ? "-cn" : ""}`,
		label: `${planLabel} API Key for ${regionLabel} (${isStandard ? "pay-as-you-go" : "subscription"})`,
		hint: `Endpoint: ${host}`,
		optionKey: `modelstudio${standardKey}ApiKey${isCn ? "Cn" : ""}`,
		flagName: `--modelstudio-${standardFlag}api-key${isCn ? "-cn" : ""}`,
		envVar: "QWEN_API_KEY",
		promptMessage: isStandard ? `Enter Qwen Cloud API key (${regionLabel} standard endpoint)` : `Enter Qwen Cloud Coding Plan API key (${regionLabel})`,
		defaultModel: QWEN_DEFAULT_MODEL_REF,
		applyConfig: (cfg) => qwenPresetAppliers.applyConfig(cfg, isStandard ? isCn ? QWEN_STANDARD_CN_BASE_URL : QWEN_STANDARD_GLOBAL_BASE_URL : isCn ? QWEN_CN_BASE_URL : QWEN_GLOBAL_BASE_URL),
		noteMessage: [
			"Manage API keys: https://home.qwencloud.com/api-keys",
			"Docs: https://docs.qwencloud.com/",
			`Endpoint: ${host}${isStandard ? "/compatible-mode/v1" : ""}`,
			isStandard ? "Models: qwen3.8-max, qwen3.8-flash, qwen3.7-plus, and other discovered models." : "Models: qwen3.5-plus, glm-5, kimi-k2.5, MiniMax-M2.5, etc."
		].join("\n"),
		noteTitle: `Qwen Cloud ${planLabel} (${regionLabel})`,
		wizard: {
			choiceHint: `Endpoint: ${host}`,
			groupLabel: "Qwen Cloud",
			groupHint: "Standard / Coding Plan (CN / Global) + multimodal roadmap"
		}
	};
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
		applyConfig: (cfg) => qwenTokenPlanPresetAppliers.applyConfig(cfg, resolveQwenTokenPlanBaseUrl(region)),
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
		hookAliases: ["dashscope", "modelstudio-native"],
		auth: [
			createQwenAuthMethod("standard", "cn"),
			createQwenAuthMethod("standard", "global"),
			createQwenAuthMethod("coding", "cn"),
			createQwenAuthMethod("coding", "global")
		],
		catalog: {
			run: (ctx) => resolveQwenCatalog(ctx, PROVIDER_ID),
			staticRun: async () => ({ provider: buildQwenProvider() })
		},
		wrapStreamFn: wrapQwenProviderStream,
		wrapSimpleCompletionStreamFn: wrapQwenProviderStream,
		classifyFailoverReason: classifyQwenFailoverReason,
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
				run: (ctx) => resolveQwenCatalog(ctx, QWEN_TOKEN_PLAN_PROVIDER_ID)
			},
			staticCatalog: {
				order: "simple",
				run: async () => ({ provider: buildQwenTokenPlanProvider() })
			},
			wrapStreamFn: wrapQwenProviderStream,
			wrapSimpleCompletionStreamFn: wrapQwenProviderStream,
			classifyFailoverReason: classifyQwenFailoverReason,
			resolveThinkingProfile: ({ modelId }) => resolveQwenTokenPlanThinkingProfile(modelId)
		});
		api.registerProvider({
			id: QWEN_TOKEN_PLAN_LEGACY_PROVIDER_ID,
			label: "Alibaba Token Plan (legacy custom config)",
			docsPath: "/providers/qwen",
			auth: [],
			wrapStreamFn: wrapQwenProviderStream,
			wrapSimpleCompletionStreamFn: wrapQwenProviderStream,
			classifyFailoverReason: classifyQwenFailoverReason
		});
		api.registerMediaUnderstandingProvider({
			id: "qwen",
			capabilities: ["image", "video"],
			defaultModels: {
				image: DEFAULT_QWEN_MEDIA_MODEL,
				video: DEFAULT_QWEN_MEDIA_MODEL
			},
			autoPriority: { video: 15 },
			describeImage: void 0,
			describeImages: void 0,
			describeVideo: (params) => describeOpenAiCompatibleVideo({
				...params,
				defaultBaseUrl: QWEN_STANDARD_GLOBAL_BASE_URL,
				defaultModel: DEFAULT_QWEN_MEDIA_MODEL,
				defaultPrompt: DEFAULT_QWEN_VIDEO_PROMPT,
				provider: "qwen",
				providerLabel: "Qwen"
			})
		});
		api.registerVideoGenerationProvider(qwenVideoGenerationProvider);
	}
});
export { qwen_default as default };
