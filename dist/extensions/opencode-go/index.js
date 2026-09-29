import { c as resolveFirstProviderCatalogAuth } from "../../provider-catalog-DaDnKUnq.mjs";
import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-DwrT_ZjA.mjs";
import { h as runLiveProviderCatalog } from "../../provider-catalog-live-runtime-8rOzIDOV.mjs";
import "../../provider-catalog-shared-D7_lTYyN.mjs";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-D3wDLM3X.mjs";
import { t as opencodeGoMediaUnderstandingProvider } from "../../media-understanding-provider-Fpof7f9k.mjs";
import { t as OPENCODE_GO_DEFAULT_MODEL_REF } from "../../onboard-Bp8A_rOc.mjs";
import { a as normalizeOpencodeGoBaseUrl, c as resolveOpencodeGoStarterModel, i as listOpencodeGoModelCatalogEntries, l as openclaw_plugin_default, n as buildStaticOpencodeGoProviderConfig, o as normalizeOpencodeGoResolvedModel, s as resolveOpencodeGoModel, t as buildOpencodeGoLiveProviderConfig } from "../../provider-catalog-aVDNYbEe.mjs";
import { r as resolveThinkingProfile } from "../../provider-policy-api-DFDI0g_1.mjs";
import { n as createOpencodeGoWrapper, t as createOpencodeGoWireWrapper } from "../../stream-DDvIbOUJ.mjs";
//#region extensions/opencode-go/index.ts
const PROVIDER_ID = "opencode-go";
var opencode_go_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "OpenCode Go Provider",
	description: "Official OpenCode Go provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "OpenCode Go",
		docsPath: "/providers/models",
		envVars: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
		manifestAuth: {
			hint: "Shared API key infrastructure for Zen + Go",
			promptMessage: "Enter OpenCode API key",
			profileIds: ["opencode:default", "opencode-go:default"],
			defaultModel: OPENCODE_GO_DEFAULT_MODEL_REF,
			resolveDefaultModel: async ({ apiKey, signal }) => await resolveOpencodeGoStarterModel({
				apiKey,
				preferredModelRef: OPENCODE_GO_DEFAULT_MODEL_REF,
				...signal ? { signal } : {}
			}),
			expectedProviders: ["opencode", "opencode-go"],
			noteMessage: [
				"OpenCode Go is a separate paid subscription that uses the shared OpenCode API key.",
				"Go focuses on Kimi, GLM, and MiniMax coding models.",
				"Get your API key at: https://opencode.ai/auth"
			].join("\n"),
			noteTitle: "OpenCode"
		},
		normalizeConfig: ({ providerConfig }) => {
			const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
				api: providerConfig.api,
				baseUrl: providerConfig.baseUrl
			});
			return normalizedBaseUrl && normalizedBaseUrl !== providerConfig.baseUrl ? {
				...providerConfig,
				baseUrl: normalizedBaseUrl
			} : void 0;
		},
		normalizeResolvedModel: ({ model }) => {
			const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
				api: model.api,
				baseUrl: model.baseUrl
			});
			const baseUrlNormalized = normalizedBaseUrl && normalizedBaseUrl !== model.baseUrl ? {
				...model,
				baseUrl: normalizedBaseUrl
			} : model;
			const modelNormalized = normalizeOpencodeGoResolvedModel(baseUrlNormalized);
			if (modelNormalized) return modelNormalized;
			return baseUrlNormalized !== model ? baseUrlNormalized : void 0;
		},
		normalizeTransport: ({ api: apiLocal, baseUrl }) => {
			const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
				api: apiLocal,
				baseUrl
			});
			return normalizedBaseUrl && normalizedBaseUrl !== baseUrl ? {
				api: apiLocal,
				baseUrl: normalizedBaseUrl
			} : void 0;
		},
		resolveDynamicModel: ({ modelId }) => resolveOpencodeGoModel(modelId),
		catalog: {
			order: "simple",
			run: async (ctx) => {
				if (ctx.providerIds !== void 0 && !ctx.providerIds.includes(PROVIDER_ID)) return null;
				const auth = resolveFirstProviderCatalogAuth(ctx.resolveProviderApiKey, [PROVIDER_ID, "opencode"]);
				if (!auth) return null;
				if (!auth.discoveryApiKey) return { provider: buildStaticOpencodeGoProviderConfig(auth.apiKey) };
				return await runLiveProviderCatalog({
					providerId: PROVIDER_ID,
					profileId: auth.profileId,
					run: async () => ({ provider: await buildOpencodeGoLiveProviderConfig({
						apiKey: auth.apiKey ?? auth.discoveryApiKey,
						discoveryApiKey: auth.discoveryApiKey
					}) })
				});
			}
		},
		augmentModelCatalog: () => listOpencodeGoModelCatalogEntries(),
		...buildProviderReplayFamilyHooks({ family: "passthrough-gemini" }),
		resolveThinkingProfile,
		resolveTransportTurnState: (ctx) => {
			if (!normalizeOpencodeGoBaseUrl({
				api: ctx.model?.api,
				baseUrl: ctx.model?.baseUrl
			})) return;
			if (Object.keys(ctx.model?.headers ?? {}).some((name) => name.toLowerCase() === "x-opencode-session")) return;
			const sessionId = ctx.sessionId?.trim() || ctx.turnId.trim();
			return sessionId ? { headers: { "x-opencode-session": sessionId } } : void 0;
		},
		wrapStreamFn: createOpencodeGoWrapper,
		wrapSimpleCompletionStreamFn: createOpencodeGoWireWrapper,
		isModernModelRef: () => true
	},
	register(api) {
		api.registerMediaUnderstandingProvider(opencodeGoMediaUnderstandingProvider);
	}
});
//#endregion
export { opencode_go_default as default };
