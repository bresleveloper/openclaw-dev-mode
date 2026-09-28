import { c as resolveBasetenDynamicModel, s as projectBasetenLiveModels, u as openclaw_plugin_default } from "./.setup/models-CwKDnNIj.mjs";
import { applyBasetenSetupConfig } from "./onboard.js";
import { buildStaticBasetenProvider } from "./provider-catalog.js";
import { createBasetenThinkingWrapper } from "./stream.js";
import { resolveBasetenThinkingProfile } from "./thinking.js";
import { buildOpenAICompatibleLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/baseten/index.ts
/** Baseten provider plugin entrypoint. */
const PROVIDER_ID = "baseten";
var baseten_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Baseten Provider",
	description: "Official Baseten Model APIs provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Baseten",
		docsPath: "/providers/baseten",
		manifestAuth: {
			applyConfig: applyBasetenSetupConfig,
			noteTitle: "Baseten",
			noteMessage: ["Baseten hosts Thinking Machines Lab's Inkling and other frontier models behind one OpenAI-compatible API.", "Get your API key at: https://app.baseten.co/settings/api_keys"].join("\n")
		},
		catalog: {
			order: "simple",
			run: async (ctx) => {
				const { apiKey, discoveryApiKey, profileId } = ctx.resolveProviderAuth(PROVIDER_ID);
				if (!apiKey) return null;
				if (!discoveryApiKey) return { provider: {
					...buildStaticBasetenProvider(),
					apiKey
				} };
				return await buildOpenAICompatibleLiveProviderCatalog({
					discoveryMode: "strict",
					providerId: PROVIDER_ID,
					providerConfig: buildStaticBasetenProvider(),
					apiKey,
					discoveryApiKey,
					profileId,
					modelDiscovery: {
						timeoutMs: 1e4,
						ttlMs: 3e5,
						projectRows: projectBasetenLiveModels
					}
				});
			},
			staticRun: async () => ({ provider: buildStaticBasetenProvider() })
		},
		resolveDynamicModel: ({ modelId }) => resolveBasetenDynamicModel(modelId),
		...buildProviderReplayFamilyHooks({
			family: "openai-compatible",
			dropReasoningFromHistory: false
		}),
		wrapStreamFn: createBasetenThinkingWrapper,
		wrapSimpleCompletionStreamFn: createBasetenThinkingWrapper,
		resolveThinkingProfile: ({ modelId }) => resolveBasetenThinkingProfile(modelId),
		isModernModelRef: () => true
	}
});
//#endregion
export { baseten_default as default };
