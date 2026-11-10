import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as providerModelEntries, s as resolveConfiguredModelCatalogOwnership } from "./legacy-config-migrations.runtime.models.catalog-B5nuEm7q.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
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
function directlyAuthoredModel(params) {
	const provider = asNullableRecord(asNullableRecord(asNullableRecord(params.authoredRoot)?.models)?.providers)?.[params.providerId];
	const models = asNullableRecord(provider)?.models;
	if (!Array.isArray(models)) return;
	const model = asNullableRecord(models[params.modelIndex]);
	return model?.id === params.modelId ? model : void 0;
}
function isHistoricalMaterializingWriter(record) {
	const updateFinalize = record.argv.some((arg, index) => arg === "update" && record.argv[index + 1] === "finalize");
	const repairDoctor = record.origin === "doctor" && record.argv.includes("doctor") && (record.argv.includes("--fix") || record.argv.includes("--yes"));
	return updateFinalize || repairDoctor;
}
function hasAuditProvenance(params) {
	if (!params.currentHash) return false;
	const configPath = path.resolve(params.configPath);
	const prefix = `models.providers.${params.providerId}.models[${params.modelIndex}].`;
	return params.auditRecords.some((record) => record.event === "config.write" && (record.result === "rename" || record.result === "copy-fallback") && path.resolve(record.configPath) === configPath && record.nextHash === params.currentHash && isHistoricalMaterializingWriter(record) && GENERATED_MODEL_FIELDS.every((field) => record.changedPaths?.some((changedPath) => changedPath === `${prefix}${field}` || changedPath.startsWith(`${prefix}${field}.`))));
}
/** Repairs audit-proven model metadata written by the historical runtime-materialization bug. */
function repairGeneratedModelMetadataCorruption(params) {
	const next = structuredClone(params.config);
	const providers = asNullableRecord(asNullableRecord(next.models)?.providers);
	if (!providers) return {
		config: params.config,
		changes: [],
		warnings: []
	};
	const changes = [];
	const warnings = [];
	for (const { providerId, provider, modelIndex, model } of providerModelEntries(providers)) {
		const modelId = typeof model.id === "string" ? model.id : "";
		if (!modelId || !hasGeneratedFallbackFingerprint(model)) continue;
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
		if (!catalog || GENERATED_MODEL_FIELDS.every((field) => isDeepStrictEqual(catalog.catalogRow[field], GENERATED_MODEL_FALLBACK[field]))) continue;
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
	return {
		config: changes.length > 0 ? next : params.config,
		changes,
		warnings
	};
}
//#endregion
export { MODEL_METADATA_CORRUPTION_AUDIT_LIMIT, repairGeneratedModelMetadataCorruption };
