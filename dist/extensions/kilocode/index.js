import { f as openclaw_plugin_default, s as KILOCODE_DEFAULT_MODEL_REF } from "./.setup/provider-models-BMrrUkX_.mjs";
import { buildKilocodeProvider, buildKilocodeProviderWithDiscovery } from "./provider-catalog.js";
import { applyKilocodeConfig } from "./onboard.js";
import { readConfiguredProviderCatalogEntries } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { resolveProviderRequestHeaders } from "openclaw/plugin-sdk/provider-http";
import { buildProviderReplayFamilyHooks, isProxyReasoningUnsupportedModelHint } from "openclaw/plugin-sdk/provider-model-shared";
import { normalizeOpenAICompatibleReasoningPayload, wrapProviderPayloadHook } from "openclaw/plugin-sdk/provider-stream-shared";
import { asOptionalRecord, normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/kilocode/index.ts
const PROVIDER_ID = "kilocode";
function normalizeKilocodeStopAfterCaller(value, fallbackPayload) {
	const payload = asOptionalRecord(value) ?? fallbackPayload;
	if (typeof payload?.stop === "string") payload.stop = [payload.stop];
	return value;
}
var kilocode_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Kilo Gateway Provider",
	description: "Bundled Kilo Gateway provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Kilo Gateway",
		docsPath: "/providers/kilocode",
		manifestAuth: {
			defaultModel: KILOCODE_DEFAULT_MODEL_REF,
			applyConfig: applyKilocodeConfig
		},
		catalog: {
			discoveryMode: "strict",
			buildProvider: () => buildKilocodeProviderWithDiscovery({ discoveryMode: "strict" }),
			buildStaticProvider: buildKilocodeProvider
		},
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		...buildProviderReplayFamilyHooks({ family: "passthrough-gemini" }),
		wrapStreamFn(ctx) {
			if (normalizeOptionalLowercaseString(ctx.provider) !== "kilocode" || !ctx.streamFn) return;
			const underlying = ctx.streamFn;
			const thinkingLevel = ctx.modelId === "kilo-auto/balanced" || isProxyReasoningUnsupportedModelHint(ctx.modelId) ? void 0 : ctx.thinkingLevel;
			return (model, context, options) => {
				const headers = resolveProviderRequestHeaders({
					provider: model.provider,
					api: model.api,
					baseUrl: model.baseUrl,
					capability: "llm",
					transport: "stream",
					callerHeaders: options?.headers,
					defaultHeaders: { "X-KILOCODE-FEATURE": process.env.KILOCODE_FEATURE?.trim() || "openclaw" },
					precedence: "defaults-win"
				});
				return underlying(model, context, {
					...options,
					headers,
					onPayload: wrapProviderPayloadHook(options?.onPayload, (payload, result) => normalizeKilocodeStopAfterCaller(result, asOptionalRecord(payload)), (payload) => {
						const payloadObj = asOptionalRecord(payload);
						if (payloadObj) normalizeOpenAICompatibleReasoningPayload(payloadObj, thinkingLevel);
					})
				});
			};
		},
		isCacheTtlEligible: (ctx) => ctx.modelId.startsWith("anthropic/")
	}
});
export { kilocode_default as default };
