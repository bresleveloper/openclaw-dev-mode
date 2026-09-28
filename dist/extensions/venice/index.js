import { a as openclaw_plugin_default, i as VENICE_MODEL_DISCOVERY_OPTIONS } from "./.setup/models-CX--kzd2.mjs";
import { applyVeniceConfig } from "./onboard.js";
import { buildStaticVeniceProvider } from "./provider-catalog.js";
import { createVeniceStreamWrapper } from "./stream.js";
import { fetchVeniceUsage } from "./usage.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { applyModelCompatPatch } from "openclaw/plugin-sdk/provider-model-shared";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/venice/index.ts
const PROVIDER_ID = "venice";
const XAI_UNSUPPORTED_SCHEMA_KEYWORDS = [
	"minLength",
	"maxLength",
	"minItems",
	"maxItems",
	"minContains",
	"maxContains"
];
function applyXaiModelCompat(model) {
	return applyModelCompatPatch(model, {
		toolSchemaProfile: "xai",
		unsupportedToolSchemaKeywords: [...XAI_UNSUPPORTED_SCHEMA_KEYWORDS],
		toolCallArgumentsEncoding: "html-entities"
	});
}
function isXaiBackedVeniceModel(modelId) {
	return normalizeLowercaseStringOrEmpty(modelId).includes("grok");
}
var venice_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Venice Provider",
	description: "Bundled Venice provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Venice",
		docsPath: "/providers/venice",
		manifestAuth: {
			applyConfig: applyVeniceConfig,
			noteMessage: [
				"Venice AI provides privacy-focused inference with uncensored models.",
				"Get your API key at: https://venice.ai/settings/api",
				"Supports 'private' (fully private) and 'anonymized' (proxy) modes."
			].join("\n"),
			noteTitle: "Venice AI"
		},
		catalog: {
			discoveryMode: "strict",
			buildProvider: buildStaticVeniceProvider,
			liveModelDiscovery: VENICE_MODEL_DISCOVERY_OPTIONS
		},
		normalizeResolvedModel: ({ modelId, model }) => isXaiBackedVeniceModel(modelId) ? applyXaiModelCompat(model) : void 0,
		wrapStreamFn: (ctx) => createVeniceStreamWrapper(ctx.streamFn, ctx.thinkingLevel),
		resolveUsageAuth: async (ctx) => {
			const apiKey = ctx.resolveApiKeyFromConfigAndStore({ envDirect: [ctx.env.VENICE_API_KEY] });
			return apiKey ? { token: apiKey } : null;
		},
		fetchUsageSnapshot: async (ctx) => await fetchVeniceUsage({
			token: ctx.token,
			timeoutMs: ctx.timeoutMs,
			fetchFn: ctx.fetchFn
		})
	}
});
//#endregion
export { venice_default as default };
