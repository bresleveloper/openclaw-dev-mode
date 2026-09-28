import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import "./defaults-BbU4k6fu.mjs";
//#region src/plugins/provider-model-construction.ts
/** Constructs a dynamic model from the first available template, without host policy by default. */
function buildFirstTemplateModel(params, normalizeConstructedModel) {
	return buildFamilyForwardCompatModel({
		providerId: params.providerId,
		modelId: params.modelId,
		ctx: params.ctx,
		cases: [{
			match: () => true,
			templateIds: params.templateIds
		}],
		patch: params.patch
	}, normalizeConstructedModel);
}
function buildFamilyForwardCompatModel(params, normalizeConstructedModel = (model) => model) {
	const modelId = (params.modelId ?? params.ctx.modelId).trim();
	const normalizedModelId = params.normalizedModelId ?? normalizeLowercaseStringOrEmpty(modelId);
	const family = params.cases.find((candidate) => typeof candidate.match === "function" ? candidate.match(normalizedModelId) : candidate.match.includes(normalizedModelId));
	if (!family) return;
	const existing = params.preserveExisting ? params.ctx.modelRegistry.find(params.providerId, modelId) : null;
	if (existing) return existing;
	const context = {
		modelId,
		normalizedModelId,
		providerId: params.providerId
	};
	const resolvePatch = (template) => {
		const patchContext = {
			...context,
			template
		};
		const familyPatch = typeof family.patch === "function" ? family.patch(patchContext) : family.patch;
		return {
			...params.patch,
			...familyPatch
		};
	};
	const templateSources = family.templateSources ?? [{ templateIds: family.templateIds ?? [] }];
	for (const source of templateSources) for (const templateId of uniqueStrings(source.templateIds).filter(Boolean)) {
		const template = params.ctx.modelRegistry.find(source.providerId ?? params.providerId, templateId);
		if (template) return normalizeConstructedModel({
			...template,
			id: modelId,
			name: modelId,
			...resolvePatch(template)
		});
	}
	if (!params.synthesize) return;
	const patch = resolvePatch();
	return normalizeConstructedModel({
		id: modelId,
		name: modelId,
		...patch,
		cost: patch?.cost ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: patch?.contextWindow ?? 2e5,
		maxTokens: patch?.maxTokens ?? 2e5
	});
}
//#endregion
//#region src/plugins/provider-model-id-match.ts
/** True when an id matches a normalized exact value or value prefix. */
function matchesExactOrPrefix(id, values) {
	const normalizedId = normalizeLowercaseStringOrEmpty(id);
	return values.some((value) => {
		const normalizedValue = normalizeLowercaseStringOrEmpty(value);
		return normalizedId === normalizedValue || normalizedId.startsWith(normalizedValue);
	});
}
//#endregion
export { buildFamilyForwardCompatModel as n, buildFirstTemplateModel as r, matchesExactOrPrefix as t };
