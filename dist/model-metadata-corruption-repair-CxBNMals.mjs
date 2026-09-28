import { r as getRecord } from "./legacy.shared-DAhNAggz.mjs";
import { a as resolveConfiguredModelCatalogOwnership } from "./legacy-config-migrations.runtime.models.catalog-C9fiKqXE.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
//#region src/commands/doctor/shared/model-metadata-corruption-repair.ts
const GENERATED_MODEL_FALLBACK = {
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0
	},
	input: ["text"],
	maxTokens: 8192,
	reasoning: false
};
const GENERATED_MODEL_FIELDS = [
	"cost",
	"input",
	"maxTokens",
	"reasoning"
];
const MODEL_METADATA_CORRUPTION_AUDIT_LIMIT = 2048;
function hasGeneratedFallbackFingerprint(model) {
	return GENERATED_MODEL_FIELDS.every((field) => Object.hasOwn(model, field) && isDeepStrictEqual(model[field], GENERATED_MODEL_FALLBACK[field]));
}
function catalogDisagreesWithFallback(catalogRow) {
	return GENERATED_MODEL_FIELDS.some((field) => !isDeepStrictEqual(catalogRow[field], GENERATED_MODEL_FALLBACK[field]));
}
function directlyAuthoredModel(params) {
	const provider = getRecord(getRecord(getRecord(params.authoredRoot)?.models)?.providers)?.[params.providerId];
	const models = getRecord(provider)?.models;
	if (!Array.isArray(models)) return;
	const model = getRecord(models[params.modelIndex]);
	return model?.id === params.modelId ? model : void 0;
}
function isSuccessfulWrite(record) {
	return record.result === "rename" || record.result === "copy-fallback";
}
function isHistoricalMaterializingWriter(record) {
	const updateFinalize = record.argv.some((arg, index) => arg === "update" && record.argv[index + 1] === "finalize");
	const repairDoctor = record.origin === "doctor" && record.argv.includes("doctor") && (record.argv.includes("--fix") || record.argv.includes("--yes"));
	return updateFinalize || repairDoctor;
}
function hasCandidateMetadataPaths(params) {
	if (!params.record.changedPaths) return false;
	const fields = /* @__PURE__ */ new Set();
	const prefix = `models.providers.${params.providerId}.models[${params.modelIndex}].`;
	for (const changedPath of params.record.changedPaths) {
		if (!changedPath.startsWith(prefix)) continue;
		const field = changedPath.slice(prefix.length).split(".", 1)[0];
		if (field && GENERATED_MODEL_FIELDS.some((candidate) => candidate === field)) fields.add(field);
	}
	return fields.size === GENERATED_MODEL_FIELDS.length;
}
function hasAuditProvenance(params) {
	if (!params.currentHash) return false;
	const configPath = path.resolve(params.configPath);
	return params.auditRecords.some((record) => record.event === "config.write" && isSuccessfulWrite(record) && path.resolve(record.configPath) === configPath && record.nextHash === params.currentHash && isHistoricalMaterializingWriter(record) && hasCandidateMetadataPaths({
		record,
		providerId: params.providerId,
		modelIndex: params.modelIndex
	}));
}
/** Repairs audit-proven model metadata written by the historical runtime-materialization bug. */
function repairGeneratedModelMetadataCorruption(params) {
	const next = structuredClone(params.config);
	const providers = getRecord(getRecord(next.models)?.providers);
	if (!providers) return {
		config: params.config,
		changes: [],
		warnings: []
	};
	const changes = [];
	const warnings = [];
	for (const [providerId, providerValue] of Object.entries(providers)) {
		const provider = getRecord(providerValue);
		const models = provider?.models;
		if (!provider || !Array.isArray(models)) continue;
		for (const [modelIndex, modelValue] of models.entries()) {
			const model = getRecord(modelValue);
			const modelId = typeof model?.id === "string" ? model.id : "";
			if (!model || !modelId || !hasGeneratedFallbackFingerprint(model)) continue;
			const authoredModel = directlyAuthoredModel({
				authoredRoot: params.authoredRoot,
				providerId,
				modelIndex,
				modelId
			});
			const catalog = resolveConfiguredModelCatalogOwnership({
				providerId,
				provider,
				model
			});
			if (!catalog || !catalogDisagreesWithFallback(catalog.catalogRow)) continue;
			const modelPath = `models.providers.${providerId}.models[${modelIndex}]`;
			if (!catalog.ownsRoute) {
				warnings.push(`${modelPath} matches the historical generated model-metadata fingerprint, but its configured API route is not owned by the shipped provider catalog. It was left unchanged.`);
				continue;
			}
			const auditProven = hasAuditProvenance({
				auditRecords: params.auditRecords,
				configPath: params.configPath,
				currentHash: params.currentHash,
				providerId,
				modelIndex
			});
			if (!authoredModel || !hasGeneratedFallbackFingerprint(authoredModel) || !auditProven) {
				warnings.push(`${modelPath} matches the historical generated model-metadata fingerprint, but Doctor could not prove the responsible config write. It was left unchanged. If the provider catalog should own these capabilities, remove cost, input, maxTokens, and reasoning from this model entry.`);
				continue;
			}
			for (const field of GENERATED_MODEL_FIELDS) delete model[field];
			changes.push(`Removed audit-proven generated model metadata from ${modelPath}: cost, input, maxTokens, reasoning.`);
		}
	}
	return {
		config: changes.length > 0 ? next : params.config,
		changes,
		warnings
	};
}
//#endregion
export { MODEL_METADATA_CORRUPTION_AUDIT_LIMIT, repairGeneratedModelMetadataCorruption };
