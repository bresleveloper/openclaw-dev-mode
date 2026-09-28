import { a as TOKENPLAN_MODEL_CATALOG, n as TOKENHUB_MODEL_CATALOG, o as TOKENPLAN_PROVIDER_ID, r as TOKENHUB_PROVIDER_ID } from "./.setup/models-CeL6cmHz.mjs";
import { TOKENHUB_DEFAULT_MODEL_REF, TOKENPLAN_DEFAULT_MODEL_REF, applyTokenHubConfig, applyTokenPlanConfig } from "./onboard.js";
import { buildTokenHubProvider, buildTokenPlanProvider } from "./provider-catalog.js";
import { wrapTencentProviderStream } from "./stream.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { buildOpenAICompatibleProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
//#region extensions/tencent/index.ts
const TENCENT_PROVIDERS = [{
	providerId: TOKENHUB_PROVIDER_ID,
	label: "Tencent TokenHub",
	optionKey: "tokenhubApiKey",
	flagName: "--tokenhub-api-key",
	envVar: "TOKENHUB_API_KEY",
	defaultModel: TOKENHUB_DEFAULT_MODEL_REF,
	applyConfig: applyTokenHubConfig,
	choiceId: "tokenhub-api-key",
	buildProvider: buildTokenHubProvider,
	modelCatalog: TOKENHUB_MODEL_CATALOG
}, {
	providerId: TOKENPLAN_PROVIDER_ID,
	label: "Tencent TokenPlan",
	optionKey: "tokenplanApiKey",
	flagName: "--tokenplan-api-key",
	envVar: "TOKENPLAN_API_KEY",
	defaultModel: TOKENPLAN_DEFAULT_MODEL_REF,
	applyConfig: applyTokenPlanConfig,
	choiceId: "tokenplan-api-key",
	buildProvider: buildTokenPlanProvider,
	modelCatalog: TOKENPLAN_MODEL_CATALOG
}];
var tencent_default = definePluginEntry({
	id: "tencent",
	name: "Tencent Cloud Provider",
	description: "Bundled Tencent Cloud provider plugin (TokenHub, TokenPlan)",
	register(api) {
		for (const provider of TENCENT_PROVIDERS) api.registerProvider({
			id: provider.providerId,
			label: provider.label,
			docsPath: "/providers/tencent",
			envVars: [provider.envVar],
			auth: [createProviderApiKeyAuthMethod({
				providerId: provider.providerId,
				methodId: "api-key",
				label: provider.label,
				hint: `Hy via ${provider.label} Gateway`,
				optionKey: provider.optionKey,
				flagName: provider.flagName,
				envVar: provider.envVar,
				promptMessage: `Enter ${provider.label} API key`,
				defaultModel: provider.defaultModel,
				expectedProviders: [provider.providerId],
				applyConfig: provider.applyConfig,
				wizard: {
					choiceId: provider.choiceId,
					choiceLabel: provider.label,
					groupId: "tencent",
					groupLabel: "Tencent Cloud",
					groupHint: provider.label
				}
			})],
			catalog: {
				order: "simple",
				run: (ctx) => buildOpenAICompatibleProviderCatalog({
					discoveryMode: "strict",
					ctx,
					providerId: provider.providerId,
					buildProvider: provider.buildProvider
				})
			},
			staticCatalog: {
				order: "simple",
				run: async () => ({ provider: provider.buildProvider() })
			},
			augmentModelCatalog: () => provider.modelCatalog.map((entry) => ({
				provider: provider.providerId,
				id: entry.id,
				name: entry.name,
				reasoning: entry.reasoning,
				input: [...entry.input],
				contextWindow: entry.contextWindow
			})),
			wrapStreamFn: wrapTencentProviderStream
		});
	}
});
//#endregion
export { tencent_default as default };
