import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-Bi0KIJRp.mjs";
import { MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL, isMoonshotAlwaysThinkingModelId, isMoonshotK3NativeVideoRoute, resolveThinkingProfile } from "./provider-policy-api.js";
import { wrapMoonshotStream } from "./native-video.js";
import { MOONSHOT_DEFAULT_MODEL_ID, MOONSHOT_DEFAULT_MODEL_REF, buildMoonshotProvider } from "./provider-catalog.js";
import { t as createKimiWebSearchProvider } from "./.setup/kimi-web-search-provider-FmjLef0K.mjs";
import { describeOpenAiCompatibleVideo } from "openclaw/plugin-sdk/media-understanding";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildOpenAICompatibleReplayPolicy } from "openclaw/plugin-sdk/provider-model-shared";
import { createDefaultModelsPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
// extensions/moonshot/index.ts
const moonshotPresetAppliers = createDefaultModelsPresetAppliers({
	primaryModelRef: MOONSHOT_DEFAULT_MODEL_REF,
	resolveParams: (cfg, baseUrl) => {
		const defaultModel = buildMoonshotProvider().models.find(({ id }) => id === MOONSHOT_DEFAULT_MODEL_ID);
		return defaultModel ? {
			providerId: "moonshot",
			api: "openai-completions",
			baseUrl,
			defaultModels: cfg.models?.mode === "replace" ? [defaultModel] : [],
			defaultModelId: MOONSHOT_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: MOONSHOT_DEFAULT_MODEL_REF,
				alias: "Kimi"
			}]
		} : null;
	}
});
const PROVIDER_ID = "moonshot";
var moonshot_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Moonshot Provider",
	description: "Bundled Moonshot provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Moonshot",
		docsPath: "/providers/moonshot",
		aliases: ["moonshotai", "moonshot-ai"],
		manifestAuth: { applyConfig: (cfg) => moonshotPresetAppliers.applyConfig(cfg, MOONSHOT_BASE_URL) },
		extraAuth: [createProviderApiKeyAuthMethod({
			providerId: PROVIDER_ID,
			methodId: "api-key-cn",
			label: "Kimi API key (.cn)",
			hint: "Kimi API models · https://platform.kimi.ai/docs/pricing/chat",
			optionKey: "moonshotApiKey",
			flagName: "--moonshot-api-key",
			envVar: "MOONSHOT_API_KEY",
			promptMessage: "Enter Moonshot API key (.cn)",
			defaultModel: MOONSHOT_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => moonshotPresetAppliers.applyConfig(cfg, MOONSHOT_CN_BASE_URL),
			wizard: { groupLabel: "Moonshot AI (Kimi)" }
		})],
		catalog: {
			discoveryMode: "strict",
			buildProvider: buildMoonshotProvider,
			buildStaticProvider: buildMoonshotProvider,
			allowExplicitBaseUrl: true,
			liveModelDiscovery: true
		},
		normalizeResolvedModel: (ctx) => ({
			...ctx.model,
			input: ctx.model.input.filter((type) => type !== "video").concat(isMoonshotK3NativeVideoRoute({
				...ctx.model,
				provider: ctx.provider,
				modelId: ctx.modelId
			}) ? "video" : [])
		}),
		buildReplayPolicy: ({ modelApi, modelId }) => buildOpenAICompatibleReplayPolicy(modelApi, {
			modelId,
			sanitizeToolCallIds: modelApi === "openai-completions",
			duplicateToolCallIdStyle: "openai",
			dropReasoningFromHistory: false
		}),
		wrapStreamFn: wrapMoonshotStream,
		wrapSimpleCompletionStreamFn: (ctx) => wrapMoonshotStream(ctx, true),
		resolveThinkingProfile,
		isModernModelRef: ({ modelId }) => isMoonshotAlwaysThinkingModelId(modelId)
	},
	register(api) {
		api.registerMediaUnderstandingProvider({
			id: "moonshot",
			capabilities: ["image", "video"],
			defaultModels: {
				image: openclaw_plugin_default.mediaUnderstandingProviderMetadata.moonshot.defaultModels.image,
				video: openclaw_plugin_default.mediaUnderstandingProviderMetadata.moonshot.defaultModels.video
			},
			autoPriority: { video: 20 },
			describeImage: void 0,
			describeImages: void 0,
			describeVideo: async (params) => describeOpenAiCompatibleVideo({
				...params,
				defaultBaseUrl: MOONSHOT_BASE_URL,
				defaultModel: openclaw_plugin_default.mediaUnderstandingProviderMetadata.moonshot.defaultModels.video,
				defaultPrompt: "Describe the video.",
				provider: "moonshot",
				providerLabel: "Moonshot"
			})
		});
		api.registerWebSearchProvider(createKimiWebSearchProvider());
	}
});
export { moonshot_default as default };
