//#region extensions/tencent/config-compat.ts
const TENCENT_TOKENHUB_HY3_MODEL_REF = "tencent-tokenhub/hy3";
const TENCENT_TOKENHUB_HY3_PREVIEW_MODEL_REF = "tencent-tokenhub/hy3-preview";
const TENCENT_TOKENHUB_HY4_PREVIEW_MODEL_REF = "tencent-tokenhub/hy4-preview";
const TENCENT_TOKENHUB_MIGRATION_TARGET_MODEL_REF = TENCENT_TOKENHUB_HY3_MODEL_REF;
const TENCENT_TOKENHUB_MANAGED_MODEL_REFS = [
	TENCENT_TOKENHUB_HY4_PREVIEW_MODEL_REF,
	TENCENT_TOKENHUB_HY3_MODEL_REF,
	TENCENT_TOKENHUB_HY3_PREVIEW_MODEL_REF
];
const TENCENT_TOKENHUB_MODEL_ALIASES = {
	[TENCENT_TOKENHUB_HY4_PREVIEW_MODEL_REF]: "Hy4 preview (TokenHub)",
	[TENCENT_TOKENHUB_HY3_MODEL_REF]: "Hy3 (TokenHub)",
	[TENCENT_TOKENHUB_HY3_PREVIEW_MODEL_REF]: "Hy3 preview (TokenHub)"
};
function isTokenHubModelMapConfigured(models) {
	return TENCENT_TOKENHUB_MANAGED_MODEL_REFS.some((ref) => Object.hasOwn(models, ref));
}
function withDefaultAlias(entry, alias) {
	return {
		...entry,
		alias: entry?.alias ?? alias
	};
}
function needsDefaultAlias(entry) {
	return entry?.alias === void 0;
}
function needsModelRepair(models, ref) {
	return !Object.hasOwn(models, ref) || needsDefaultAlias(models[ref]);
}
function migrateDefaultModel(model) {
	if (model === TENCENT_TOKENHUB_HY3_PREVIEW_MODEL_REF) return {
		model: { primary: TENCENT_TOKENHUB_MIGRATION_TARGET_MODEL_REF },
		changed: true
	};
	if (model && typeof model === "object" && "primary" in model && model.primary === TENCENT_TOKENHUB_HY3_PREVIEW_MODEL_REF) return {
		model: {
			...model,
			primary: TENCENT_TOKENHUB_MIGRATION_TARGET_MODEL_REF
		},
		changed: true
	};
	return {
		model,
		changed: false
	};
}
function migrateTencentTokenHubModelDefaults(cfg) {
	const existingModels = cfg.agents?.defaults?.models;
	if (!existingModels || !isTokenHubModelMapConfigured(existingModels)) return {
		config: cfg,
		changes: []
	};
	const needsModelMapRepair = TENCENT_TOKENHUB_MANAGED_MODEL_REFS.some((ref) => needsModelRepair(existingModels, ref));
	const migratedModel = migrateDefaultModel(cfg.agents?.defaults?.model);
	if (!needsModelMapRepair && !migratedModel.changed) return {
		config: cfg,
		changes: []
	};
	const nextModels = { ...existingModels };
	for (const ref of TENCENT_TOKENHUB_MANAGED_MODEL_REFS) nextModels[ref] = withDefaultAlias(existingModels[ref], TENCENT_TOKENHUB_MODEL_ALIASES[ref]);
	const nextConfig = {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models: nextModels,
				...migratedModel.model !== void 0 ? { model: migratedModel.model } : void 0
			}
		}
	};
	const changes = [`Updated Tencent TokenHub agent model defaults to include ${TENCENT_TOKENHUB_MANAGED_MODEL_REFS.join(", ")}.`];
	if (migratedModel.changed) changes.push(`Changed Tencent TokenHub primary default from ${TENCENT_TOKENHUB_HY3_PREVIEW_MODEL_REF} to ${TENCENT_TOKENHUB_MIGRATION_TARGET_MODEL_REF}.`);
	return {
		config: nextConfig,
		changes
	};
}
//#endregion
export { migrateTencentTokenHubModelDefaults };
