import { i as parseModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { n as normalizeBuiltInProviderModelId, s as stripSelfProviderModelPrefix } from "./provider-model-id-normalization-CO2R6uEC.mjs";
//#region src/plugins/model-allowlist.ts
function compileModelAllowlist(params) {
	const models = /* @__PURE__ */ new Set();
	let allowAny = false;
	for (const raw of params.values ?? []) {
		const trimmed = raw.trim();
		if (trimmed === "*") {
			allowAny = true;
			continue;
		}
		const parsed = parseModelCatalogRef(trimmed);
		if (!parsed) continue;
		const modelId = normalizeBuiltInProviderModelId(parsed.provider, stripSelfProviderModelPrefix(parsed.provider, parsed.modelId));
		models.add(params.formatKey(parsed.provider, modelId));
	}
	return {
		configured: params.configured,
		allowAny,
		models
	};
}
//#endregion
export { compileModelAllowlist as t };
