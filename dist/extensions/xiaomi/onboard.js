import { a as buildXiaomiProvider, i as XIAOMI_TOKEN_PLAN_PROVIDER_ID, n as XIAOMI_PROVIDER_ID, o as buildXiaomiTokenPlanProvider, r as XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID, s as resolveXiaomiTokenPlanBaseUrl, t as XIAOMI_DEFAULT_MODEL_ID } from "./.setup/provider-catalog-v9-9qyII.mjs";
import { createDefaultModelsConnectionPresetAppliers, createDefaultModelsPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/xiaomi/onboard.ts
const XIAOMI_DEFAULT_MODEL_REF = `${XIAOMI_PROVIDER_ID}/${XIAOMI_DEFAULT_MODEL_ID}`;
const XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_REF = `${XIAOMI_TOKEN_PLAN_PROVIDER_ID}/${XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID}`;
const xiaomiPreset = {
	primaryModelRef: XIAOMI_DEFAULT_MODEL_REF,
	resolveParams: () => {
		const defaultProvider = buildXiaomiProvider();
		return {
			providerId: XIAOMI_PROVIDER_ID,
			api: defaultProvider.api ?? "openai-completions",
			baseUrl: defaultProvider.baseUrl,
			defaultModels: () => defaultProvider.models ?? [],
			defaultModelId: XIAOMI_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: XIAOMI_DEFAULT_MODEL_REF,
				alias: "Xiaomi"
			}]
		};
	}
};
const { applyConfig: applyXiaomiConfig, applyProviderConfig: applyXiaomiProviderConfig } = createDefaultModelsPresetAppliers(xiaomiPreset);
const { applyConfig: applyXiaomiConnectionConfig } = createDefaultModelsConnectionPresetAppliers(xiaomiPreset);
const xiaomiTokenPlanPresetAppliers = createDefaultModelsPresetAppliers({
	primaryModelRef: XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => {
		const defaultProvider = buildXiaomiTokenPlanProvider();
		return {
			providerId: XIAOMI_TOKEN_PLAN_PROVIDER_ID,
			api: defaultProvider.api ?? "openai-completions",
			baseUrl: defaultProvider.baseUrl,
			defaultModels: cfg.models?.mode === "replace" ? defaultProvider.models ?? [] : [],
			defaultModelId: XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID,
			aliases: (() => {
				const defaultModel = defaultProvider.models?.find((m) => m.id === XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID);
				return [{
					modelRef: XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_REF,
					alias: defaultModel?.name ?? "Xiaomi MiMo V2.6 Pro"
				}];
			})()
		};
	}
});
function withProviderBaseUrl(cfg, providerId, baseUrl) {
	const providers = {
		...cfg.models?.providers,
		[providerId]: {
			...cfg.models?.providers?.[providerId],
			baseUrl
		}
	};
	return {
		...cfg,
		models: {
			...cfg.models,
			providers
		}
	};
}
function applyXiaomiTokenPlanConfig(cfg, region) {
	return withProviderBaseUrl(xiaomiTokenPlanPresetAppliers.applyConfig(cfg), XIAOMI_TOKEN_PLAN_PROVIDER_ID, resolveXiaomiTokenPlanBaseUrl(region));
}
//#endregion
export { XIAOMI_DEFAULT_MODEL_REF, XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_REF, applyXiaomiConfig, applyXiaomiConnectionConfig, applyXiaomiProviderConfig, applyXiaomiTokenPlanConfig };
