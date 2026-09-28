import { a as normalizeKimiCodingModelId, i as buildKimiCodingProvider, o as openclaw_plugin_default } from "./.setup/provider-catalog-CTBTXcRa.mjs";
import { KIMI_CODING_MODEL_REF, applyKimiCodeConfig } from "./onboard.js";
import { isKimiK3ModelId, resolveThinkingProfile } from "./provider-policy-api.js";
import { KIMI_REPLAY_POLICY } from "./replay-policy.js";
import { wrapKimiProviderStream } from "./stream.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/kimi-coding/index.ts
const PLUGIN_ID = "kimi";
const PROVIDER_ID = "kimi";
const PROVIDER_ALIASES = ["kimi-code", "kimi-coding"];
function findExplicitProviderConfig(providers, providerId) {
	if (!providers) return;
	const normalizedProviderId = normalizeProviderId(providerId);
	const match = Object.entries(providers).find(([configuredProviderId]) => normalizeProviderId(configuredProviderId) === normalizedProviderId);
	return isRecord(match?.[1]) ? match[1] : void 0;
}
var kimi_coding_default = defineSingleProviderPluginEntry({
	id: PLUGIN_ID,
	name: "Kimi Provider",
	description: "Bundled Kimi provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		id: PROVIDER_ID,
		label: "Kimi",
		aliases: PROVIDER_ALIASES,
		docsPath: "/providers/moonshot",
		envVars: ["KIMI_API_KEY", "KIMICODE_API_KEY"],
		manifestAuth: {
			promptMessage: "Enter Kimi API key",
			defaultModel: KIMI_CODING_MODEL_REF,
			expectedProviders: [
				"kimi",
				"kimi-code",
				"kimi-coding"
			],
			applyConfig: applyKimiCodeConfig,
			noteMessage: ["Kimi uses a dedicated coding endpoint and API key.", "Get your API key at: https://www.kimi.com/code/console"].join("\n"),
			noteTitle: "Kimi"
		},
		catalog: {
			order: "simple",
			run: async (ctx) => {
				const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
				if (!apiKey) return null;
				const explicitProvider = findExplicitProviderConfig(ctx.config.models?.providers, PROVIDER_ID);
				const builtInProvider = buildKimiCodingProvider();
				const explicitBaseUrl = normalizeOptionalString(explicitProvider?.baseUrl) ?? "";
				const explicitHeaders = isRecord(explicitProvider?.headers) ? explicitProvider.headers : void 0;
				return { provider: {
					...builtInProvider,
					...explicitBaseUrl ? { baseUrl: explicitBaseUrl } : {},
					...explicitHeaders ? { headers: {
						...builtInProvider.headers,
						...explicitHeaders
					} } : {},
					apiKey
				} };
			}
		},
		classifyFailoverReason: ({ provider, status, errorMessage }) => {
			if (!provider || status !== 403) return;
			const providerId = normalizeProviderId(provider);
			if (providerId !== PROVIDER_ID && !PROVIDER_ALIASES.includes(providerId)) return;
			return /\b(?:weekly(?:\s+\(7-day\))?|(?:7|seven)[ -]day)\s+(?:usage\s+)?limit\b/i.test(errorMessage) || /\bquota\s+will\s+reset\b/i.test(errorMessage) ? "rate_limit" : void 0;
		},
		buildReplayPolicy: () => KIMI_REPLAY_POLICY,
		normalizeResolvedModel: ({ model }) => {
			const normalizedId = normalizeKimiCodingModelId(model.id);
			return normalizedId === model.id ? void 0 : {
				...model,
				id: normalizedId
			};
		},
		normalizeModelId: ({ modelId }) => normalizeKimiCodingModelId(modelId),
		resolveThinkingProfile,
		wrapSimpleCompletionStreamFn: (ctx) => isKimiK3ModelId(ctx.modelId) ? wrapKimiProviderStream(ctx) : ctx.streamFn,
		wrapStreamFn: wrapKimiProviderStream
	}
});
//#endregion
export { kimi_coding_default as default };
