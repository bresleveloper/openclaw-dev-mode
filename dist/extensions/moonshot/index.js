import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-CZNy9Kfm.mjs";
import { isMoonshotAlwaysThinkingModelId, isMoonshotK3NativeVideoRoute, resolveThinkingProfile } from "./provider-policy-api.js";
import { MOONSHOT_DEFAULT_MODEL_REF, buildMoonshotProvider } from "./provider-catalog.js";
import { moonshotMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { wrapMoonshotStream } from "./native-video.js";
import { applyMoonshotConfig, applyMoonshotConfigCn } from "./onboard.js";
import { t as createKimiWebSearchProvider } from "./.setup/kimi-web-search-provider-c6i-_MVz.mjs";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildOpenAICompatibleReplayPolicy } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/moonshot/index.ts
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
		manifestAuth: { applyConfig: applyMoonshotConfig },
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
			applyConfig: applyMoonshotConfigCn,
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
		wrapStreamFn: (ctx) => wrapMoonshotStream(ctx),
		wrapSimpleCompletionStreamFn: (ctx) => wrapMoonshotStream(ctx, true),
		resolveThinkingProfile,
		isModernModelRef: ({ modelId }) => isMoonshotAlwaysThinkingModelId(modelId)
	},
	register(api) {
		api.registerMediaUnderstandingProvider(moonshotMediaUnderstandingProvider);
		api.registerWebSearchProvider(createKimiWebSearchProvider());
	}
});
//#endregion
export { moonshot_default as default };
