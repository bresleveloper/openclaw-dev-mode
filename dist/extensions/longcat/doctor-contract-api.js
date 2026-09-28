import { asObjectRecord } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/longcat/doctor-contract-api.ts
const MODELS_PATH = [
	"models",
	"providers",
	"longcat",
	"models"
];
const LEGACY_CACHE_WRITE_PRICE = .75;
function isStringArray(value, expected) {
	return Array.isArray(value) && value.length === expected.length && value.every((entry, index) => entry === expected[index]);
}
function isLegacyStockLongCatModel(value) {
	const model = asObjectRecord(value);
	const cost = asObjectRecord(model?.cost);
	const compatValue = model?.compat;
	const compat = asObjectRecord(compatValue);
	const hasHistoricalCompat = compatValue === void 0 || Boolean(compat && compat.supportsStore === false && compat.supportsDeveloperRole === false && compat.supportsReasoningEffort === false && compat.supportsUsageInStreaming === false && compat.supportsStrictMode === false && compat.maxTokensField === "max_tokens" && compat.requiresReasoningContentOnAssistantMessages === true && compat.thinkingFormat === "deepseek" && Object.keys(compat).length === 8);
	return Boolean(model && model.id === "LongCat-2.0" && model.name === "LongCat 2.0" && model.reasoning === true && isStringArray(model.input, ["text"]) && model.contextWindow === 1048576 && model.maxTokens === 131072 && cost?.input === .75 && cost.output === 2.95 && cost.cacheRead === .015 && cost.cacheWrite === LEGACY_CACHE_WRITE_PRICE && hasHistoricalCompat);
}
function hasLegacyStockLongCatModel(value) {
	return Array.isArray(value) && value.some(isLegacyStockLongCatModel);
}
const legacyConfigRules = [{
	path: MODELS_PATH,
	message: "models.providers.longcat.models contains the historical stock LongCat-2.0 cache-write price; run \"openclaw doctor --fix\" to update it without changing customized rows.",
	match: hasLegacyStockLongCatModel
}];
function normalizeCompatibilityConfig({ cfg }) {
	const models = cfg.models;
	const providers = models?.providers;
	const provider = providers?.longcat;
	const configuredModels = provider?.models;
	if (!provider || !hasLegacyStockLongCatModel(configuredModels) || !Array.isArray(configuredModels)) return {
		config: cfg,
		changes: []
	};
	const nextModels = configuredModels.map((model) => {
		if (!isLegacyStockLongCatModel(model)) return model;
		return Object.assign({}, model, { cost: Object.assign({}, model.cost, { cacheWrite: 0 }) });
	});
	return {
		config: {
			...cfg,
			models: {
				...models,
				providers: {
					...providers,
					longcat: {
						...provider,
						models: nextModels
					}
				}
			}
		},
		changes: ["Updated the historical stock LongCat-2.0 cache-write price from $0.75 to $0."]
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
