import { t as MODEL_APIS } from "./model-config-vocabulary-Cb5jWCSz.mjs";
import "./types.models-BqvzicE8.mjs";
import { r as normalizeCatalogRouteBaseUrl } from "./model-compat-catalog-Dfj3P1T4.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-mS12tkxj.mjs";
//#region src/agents/model-catalog-entry.ts
function isCatalogModelApi(value) {
	return value !== void 0 && MODEL_APIS.some((api) => api === value);
}
/** Shared metadata projection; keep transport headers and authoring fields out of catalog entries. */
function modelCatalogRowToEntry(row) {
	const contextWindow = row.contextWindow ?? row.contextTokens;
	return {
		id: row.id,
		name: row.name,
		provider: row.provider,
		...isCatalogModelApi(row.api) ? { api: row.api } : {},
		...row.baseUrl ? { baseUrl: row.baseUrl } : {},
		...contextWindow !== void 0 ? { contextWindow } : {},
		...row.contextWindowSource ? { contextWindowSource: row.contextWindowSource } : {},
		...row.contextWindows ? { contextWindows: row.contextWindows.map((option) => ({ ...option })) } : {},
		...row.contextWindowDefault ? { contextWindowDefault: row.contextWindowDefault } : {},
		...row.contextTokens !== void 0 ? { contextTokens: row.contextTokens } : {},
		reasoning: row.reasoning,
		...row.thinkingLevelMap ? { thinkingLevelMap: { ...row.thinkingLevelMap } } : {},
		...row.input ? { input: [...row.input] } : {},
		...row.params ? { params: { ...row.params } } : {},
		...row.compat ? { compat: row.compat } : {},
		...row.mediaInput ? { mediaInput: row.mediaInput } : {},
		status: row.status,
		...row.statusReason ? { statusReason: row.statusReason } : {},
		...row.replaces ? { replaces: [...row.replaces] } : {},
		...row.replacedBy ? { replacedBy: row.replacedBy } : {}
	};
}
function modelCatalogRouteVariantKey(entry, identityKey) {
	return JSON.stringify([
		identityKey,
		entry.nativeRuntime ?? "",
		entry.api ?? "",
		normalizeCatalogRouteBaseUrl(entry.baseUrl) ?? ""
	]);
}
function mergeHarnessCompat(observed, provider) {
	if (!observed && !provider) return;
	const compat = {
		...provider,
		...observed
	};
	if (observed?.supportedReasoningEfforts?.length === 0) return {
		...compat,
		supportsReasoningEffort: false,
		supportedReasoningEfforts: []
	};
	const efforts = [.../* @__PURE__ */ new Set([...provider?.supportedReasoningEfforts ?? [], ...observed?.supportedReasoningEfforts ?? []])];
	return efforts.length > 0 ? {
		...compat,
		supportsReasoningEffort: true,
		supportedReasoningEfforts: efforts
	} : compat;
}
function enrichHarnessRows(rows, snapshot) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	const routeDonors = /* @__PURE__ */ new Map();
	const identityDonors = /* @__PURE__ */ new Map();
	let donorsPrepared = false;
	return rows.map((entry) => {
		if (entry.nativeRuntime) return entry;
		if (!donorsPrepared) {
			for (const donor of [
				...snapshot.entries,
				...snapshot.routeVariants,
				...snapshot.staticEntries ?? []
			]) {
				if (donor.nativeRuntime) continue;
				const identityKey = keyOf(donor);
				const routeKey = modelCatalogRouteVariantKey(donor, identityKey);
				if (!routeDonors.has(routeKey)) routeDonors.set(routeKey, donor);
				if (!identityDonors.has(identityKey)) identityDonors.set(identityKey, donor);
			}
			donorsPrepared = true;
		}
		const identityKey = keyOf(entry);
		const donor = routeDonors.get(modelCatalogRouteVariantKey(entry, identityKey)) ?? (entry.api === void 0 && entry.baseUrl === void 0 ? identityDonors.get(identityKey) : void 0);
		if (!donor) return entry;
		const compat = mergeHarnessCompat(entry.compat, donor.compat);
		const mergedParams = donor.params || entry.params ? {
			...donor.params,
			...entry.params
		} : void 0;
		return {
			...donor,
			...entry,
			...mergedParams ? { params: mergedParams } : {},
			...compat ? { compat } : {}
		};
	});
}
//#endregion
export { modelCatalogRouteVariantKey as n, modelCatalogRowToEntry as r, enrichHarnessRows as t };
