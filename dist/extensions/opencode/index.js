import { a as normalizeLowercaseStringOrEmpty } from "../../string-coerce-DW4mBlAt.js";
import { n as resolveClaudeThinkingProfile } from "../../provider-claude-thinking-CBtIU9e4.js";
import "../../string-coerce-runtime-ZbuYDJgZ.js";
import { t as definePluginEntry } from "../../plugin-entry-CM_XK0Yw.js";
import { d as matchesExactOrPrefix, i as PASSTHROUGH_GEMINI_REPLAY_HOOKS } from "../../provider-model-shared-CcfAdtmN.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-D1y9mweV.js";
import { t as OPENCODE_ZEN_DEFAULT_MODEL } from "../../provider-onboard-D9NRtC_7.js";
import "../../provider-auth-api-key-BOUlq9ab.js";
import { n as applyOpencodeZenConfig } from "../../onboard-BDybcsFB.js";
import "../../api-DcgTSEFm.js";
import { t as opencodeMediaUnderstandingProvider } from "../../media-understanding-provider-DSwGJQL-.js";
import { a as resolveOpencodeZenModel, i as normalizeOpencodeZenBaseUrl, n as buildStaticOpencodeZenProviderConfig, r as listOpencodeZenModelCatalogEntries, t as buildOpencodeZenLiveProviderConfig } from "../../provider-catalog-BXU9O6zt.js";
//#region extensions/opencode/index.ts
const PROVIDER_ID = "opencode";
const MINIMAX_MODERN_MODEL_MATCHERS = ["minimax-m2.7"];
const OPENCODE_SHARED_PROFILE_IDS = ["opencode:default", "opencode-go:default"];
const OPENCODE_SHARED_HINT = "Shared API key for Zen + Go catalogs";
const OPENCODE_SHARED_WIZARD_GROUP = {
	groupId: "opencode",
	groupLabel: "OpenCode",
	groupHint: OPENCODE_SHARED_HINT
};
function hasCatalogAuth(auth) {
	return Boolean(auth.apiKey || auth.discoveryApiKey);
}
function resolveOpencodeZenCatalogAuth(resolveProviderApiKey) {
	const opencodeAuth = resolveProviderApiKey(PROVIDER_ID);
	if (hasCatalogAuth(opencodeAuth)) return opencodeAuth;
	const sharedOpencodeGoAuth = resolveProviderApiKey("opencode-go");
	return hasCatalogAuth(sharedOpencodeGoAuth) ? sharedOpencodeGoAuth : void 0;
}
function isModernOpencodeModel(modelId) {
	const lower = normalizeLowercaseStringOrEmpty(modelId);
	if (lower.endsWith("-free") || lower === "alpha-glm-4.7") return false;
	return !matchesExactOrPrefix(lower, MINIMAX_MODERN_MODEL_MATCHERS);
}
var opencode_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "OpenCode Zen Provider",
	description: "Bundled OpenCode Zen provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "OpenCode Zen",
			docsPath: "/providers/models",
			envVars: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: PROVIDER_ID,
				methodId: "api-key",
				label: "OpenCode Zen catalog",
				hint: OPENCODE_SHARED_HINT,
				optionKey: "opencodeZenApiKey",
				flagName: "--opencode-zen-api-key",
				envVar: "OPENCODE_API_KEY",
				promptMessage: "Enter OpenCode API key",
				profileIds: [...OPENCODE_SHARED_PROFILE_IDS],
				defaultModel: OPENCODE_ZEN_DEFAULT_MODEL,
				applyConfig: (cfg) => applyOpencodeZenConfig(cfg),
				expectedProviders: ["opencode", "opencode-go"],
				noteMessage: [
					"OpenCode uses one API key across the Zen and Go catalogs.",
					"Zen provides access to Claude, GPT, Gemini, and more models.",
					"Get your API key at: https://opencode.ai/auth",
					"Choose the Zen catalog when you want the curated multi-model proxy."
				].join("\n"),
				noteTitle: "OpenCode",
				wizard: {
					choiceId: "opencode-zen",
					choiceLabel: "OpenCode Zen catalog",
					...OPENCODE_SHARED_WIZARD_GROUP
				}
			})],
			normalizeConfig: ({ providerConfig }) => {
				const normalizedBaseUrl = normalizeOpencodeZenBaseUrl({
					api: providerConfig.api,
					baseUrl: providerConfig.baseUrl
				});
				return normalizedBaseUrl && normalizedBaseUrl !== providerConfig.baseUrl ? {
					...providerConfig,
					baseUrl: normalizedBaseUrl
				} : void 0;
			},
			normalizeResolvedModel: ({ model }) => {
				const normalizedBaseUrl = normalizeOpencodeZenBaseUrl({
					api: model.api,
					baseUrl: model.baseUrl
				});
				return normalizedBaseUrl && normalizedBaseUrl !== model.baseUrl ? {
					...model,
					baseUrl: normalizedBaseUrl
				} : void 0;
			},
			normalizeTransport: ({ api: apiLocal, baseUrl }) => {
				const normalizedBaseUrl = normalizeOpencodeZenBaseUrl({
					api: apiLocal,
					baseUrl
				});
				return normalizedBaseUrl && normalizedBaseUrl !== baseUrl ? {
					api: apiLocal,
					baseUrl: normalizedBaseUrl
				} : void 0;
			},
			resolveDynamicModel: ({ modelId }) => resolveOpencodeZenModel(modelId),
			catalog: {
				order: "simple",
				run: async (ctx) => {
					const auth = resolveOpencodeZenCatalogAuth(ctx.resolveProviderApiKey);
					if (!auth) return null;
					if (!auth.discoveryApiKey) return { provider: buildStaticOpencodeZenProviderConfig(auth.apiKey) };
					return { provider: await buildOpencodeZenLiveProviderConfig({
						apiKey: auth.apiKey ?? auth.discoveryApiKey,
						discoveryApiKey: auth.discoveryApiKey
					}) };
				}
			},
			augmentModelCatalog: () => listOpencodeZenModelCatalogEntries(),
			...PASSTHROUGH_GEMINI_REPLAY_HOOKS,
			isModernModelRef: ({ modelId }) => isModernOpencodeModel(modelId),
			resolveThinkingProfile: ({ modelId }) => resolveClaudeThinkingProfile(modelId)
		});
		api.registerMediaUnderstandingProvider(opencodeMediaUnderstandingProvider);
	}
});
//#endregion
export { opencode_default as default };
