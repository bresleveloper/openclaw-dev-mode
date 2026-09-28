import { a as FEATHERLESS_DEFAULT_MODEL_REF, c as FEATHERLESS_DYNAMIC_MAX_TOKENS, d as openclaw_plugin_default, i as FEATHERLESS_DEFAULT_MODEL_ID, o as FEATHERLESS_DYNAMIC_COMPAT, s as FEATHERLESS_DYNAMIC_CONTEXT_WINDOW, t as FEATHERLESS_BASE_URL, u as isFeatherlessCatalogModelId } from "./.setup/models-J3WOft2N.mjs";
import { applyFeatherlessConnectionConfig } from "./onboard.js";
import "./provider-catalog.js";
import { readConfiguredProviderCatalogEntries } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks, resolveFamilyForwardCompatModel } from "openclaw/plugin-sdk/provider-model-shared";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
//#region extensions/featherless/index.ts
const PROVIDER_ID = "featherless";
function resolveFeatherlessDynamicModel(ctx) {
	const modelId = ctx.modelId.trim();
	if (!modelId || isFeatherlessCatalogModelId(modelId)) return;
	return resolveFamilyForwardCompatModel({
		providerId: PROVIDER_ID,
		modelId,
		ctx,
		cases: [{
			match: () => true,
			templateIds: [FEATHERLESS_DEFAULT_MODEL_ID],
			patch: ({ template }) => template ? void 0 : {
				api: "openai-completions",
				baseUrl: FEATHERLESS_BASE_URL
			}
		}],
		patch: {
			provider: PROVIDER_ID,
			reasoning: false,
			input: ["text"],
			contextWindow: FEATHERLESS_DYNAMIC_CONTEXT_WINDOW,
			maxTokens: FEATHERLESS_DYNAMIC_MAX_TOKENS,
			compat: FEATHERLESS_DYNAMIC_COMPAT
		},
		synthesize: true
	});
}
function normalizeFeatherlessResolvedModel(model) {
	return {
		...model,
		compat: {
			...FEATHERLESS_DYNAMIC_COMPAT,
			...model.compat
		}
	};
}
var featherless_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Featherless AI Provider",
	description: "Featherless AI provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Featherless AI",
		docsPath: "/providers/featherless",
		manifestAuth: {
			defaultModel: FEATHERLESS_DEFAULT_MODEL_REF,
			applyConfig: applyFeatherlessConnectionConfig,
			noteTitle: "Featherless AI",
			noteMessage: ["Featherless AI serves open models through an OpenAI-compatible API.", "Create an API key at: https://featherless.ai/account/api-keys"].join("\n")
		},
		catalog: {
			discoveryMode: "strict",
			allowExplicitBaseUrl: true,
			liveModelDiscovery: {
				endpointPath: "models?capabilities=chat",
				buildRequestHeaders: ({ apiKey }) => ({
					Accept: "application/json",
					"User-Agent": "openclaw",
					...apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
				})
			}
		},
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		normalizeResolvedModel: ({ model }) => normalizeFeatherlessResolvedModel(model),
		...buildProviderReplayFamilyHooks({
			family: "openai-compatible",
			dropReasoningFromHistory: false
		}),
		...buildProviderToolCompatFamilyHooks("openai"),
		resolveDynamicModel: (ctx) => resolveFeatherlessDynamicModel(ctx),
		isModernModelRef: () => true
	}
});
//#endregion
export { featherless_default as default };
