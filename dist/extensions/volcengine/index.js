import { t as definePluginEntry } from "../../plugin-entry-CM_XK0Yw.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-D1y9mweV.js";
import { m as ensureModelAllowlistEntry } from "../../provider-onboard-D9NRtC_7.js";
import "../../provider-auth-api-key-BOUlq9ab.js";
import { t as VOLCENGINE_PROVIDER_CATALOG_ENTRIES } from "../../provider-catalog-bYe5-o5H.js";
import { n as applyVolcengineToolSchemaCompat } from "../../api-fuSlz7HK.js";
import { t as buildVolcengineSpeechProvider } from "../../speech-provider-poLSvvFC2.js";
//#region extensions/volcengine/index.ts
const PROVIDER_ID = "volcengine";
const VOLCENGINE_DEFAULT_MODEL_REF = "volcengine-plan/ark-code-latest";
var volcengine_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "Volcengine Provider",
	description: "Bundled Volcengine provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "Volcengine",
			docsPath: "/concepts/model-providers#volcano-engine-doubao",
			envVars: ["VOLCANO_ENGINE_API_KEY"],
			hookAliases: ["volcengine-plan"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: PROVIDER_ID,
				methodId: "api-key",
				label: "Volcano Engine API key",
				hint: "API key",
				optionKey: "volcengineApiKey",
				flagName: "--volcengine-api-key",
				envVar: "VOLCANO_ENGINE_API_KEY",
				promptMessage: "Enter Volcano Engine API key",
				defaultModel: VOLCENGINE_DEFAULT_MODEL_REF,
				expectedProviders: ["volcengine"],
				applyConfig: (cfg) => ensureModelAllowlistEntry({
					cfg,
					modelRef: VOLCENGINE_DEFAULT_MODEL_REF
				}),
				wizard: {
					choiceId: "volcengine-api-key",
					choiceLabel: "Volcano Engine API key",
					groupId: "volcengine",
					groupLabel: "Volcano Engine",
					groupHint: "API key"
				}
			})],
			catalog: {
				order: "paired",
				run: async (ctx) => {
					const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
					if (!apiKey) return null;
					return { providers: Object.fromEntries(VOLCENGINE_PROVIDER_CATALOG_ENTRIES.map(({ id, buildProvider }) => [id, {
						...buildProvider(),
						apiKey
					}])) };
				}
			},
			augmentModelCatalog: () => VOLCENGINE_PROVIDER_CATALOG_ENTRIES.flatMap(({ id: provider, models }) => models.map((entry) => ({
				provider,
				id: entry.id,
				name: entry.name,
				reasoning: entry.reasoning,
				input: [...entry.input],
				contextWindow: entry.contextWindow
			}))),
			normalizeResolvedModel: ({ model }) => applyVolcengineToolSchemaCompat(model)
		});
		api.registerSpeechProvider(buildVolcengineSpeechProvider());
	}
});
//#endregion
export { volcengine_default as default };
