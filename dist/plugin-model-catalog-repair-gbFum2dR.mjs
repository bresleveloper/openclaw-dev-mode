import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/plugin-model-catalog-repair.ts
/** Pure repair rules for OpenClaw-generated plugin model catalogs. */
const PLUGIN_MODEL_CATALOG_GENERATED_BY = "openclaw-plugin-model-catalog-v1";
function hasCatalogApi(value) {
	return typeof value === "string" && value.length > 0;
}
/** Detects the existing generated-catalog marker without admitting arrays or null. */
function isGeneratedPluginModelCatalog(value) {
	return isRecord(value) && value.generatedBy === "openclaw-plugin-model-catalog-v1";
}
/** Removes model rows whose transport API cannot be derived without inventing semantics. */
function repairPluginModelCatalogTransportMetadata(contents) {
	let parsed;
	try {
		parsed = JSON.parse(contents);
	} catch {
		return {
			contents,
			removedModelCount: 0
		};
	}
	if (!isGeneratedPluginModelCatalog(parsed) || !isRecord(parsed.providers)) return {
		contents,
		removedModelCount: 0
	};
	let removedModelCount = 0;
	const providers = {};
	for (const [providerId, provider] of Object.entries(parsed.providers)) {
		if (!isRecord(provider) || !Array.isArray(provider.models) || hasCatalogApi(provider.api)) {
			providers[providerId] = provider;
			continue;
		}
		const models = provider.models.filter((model) => isRecord(model) && hasCatalogApi(model.api));
		removedModelCount += provider.models.length - models.length;
		providers[providerId] = models.length === provider.models.length ? provider : {
			...provider,
			models
		};
	}
	if (removedModelCount === 0) return {
		contents,
		removedModelCount
	};
	const trailingNewline = contents.endsWith("\n") ? "\n" : "";
	return {
		contents: `${JSON.stringify({
			...parsed,
			providers
		}, null, 2)}${trailingNewline}`,
		removedModelCount
	};
}
/** Returns null for unusable generated rows, which must not retain or export unknown secrets. */
function stripPluginModelCatalogCredentials(contents, credentials) {
	let parsed;
	try {
		parsed = JSON.parse(contents);
	} catch {
		return null;
	}
	if (!isGeneratedPluginModelCatalog(parsed) || !isRecord(parsed.providers)) return null;
	let changed = false;
	const matches = (value) => typeof value === "string" && (credentials === void 0 || credentials.has(value) || value.startsWith("Bearer ") && credentials.has(value.slice(7)));
	const strip = (entry) => {
		if (entry.apiKey !== void 0) {
			if (credentials !== void 0 && typeof entry.apiKey !== "string") return false;
			if (credentials === void 0 || matches(entry.apiKey)) {
				delete entry.apiKey;
				changed = true;
			}
		}
		if (entry.headers !== void 0) {
			if (credentials === void 0) {
				delete entry.headers;
				changed = true;
			} else {
				if (!isRecord(entry.headers)) return false;
				for (const [name, value] of Object.entries(entry.headers)) {
					if (typeof value !== "string") return false;
					if (matches(value)) {
						delete entry.headers[name];
						changed = true;
					}
				}
			}
		}
		return true;
	};
	for (const provider of Object.values(parsed.providers)) {
		if (!isRecord(provider) || !strip(provider)) return null;
		if (provider.models !== void 0) {
			if (!Array.isArray(provider.models)) return null;
			for (const model of provider.models) if (!isRecord(model) || !strip(model)) return null;
		}
	}
	return changed ? JSON.stringify(parsed) : contents;
}
//#endregion
export { stripPluginModelCatalogCredentials as i, isGeneratedPluginModelCatalog as n, repairPluginModelCatalogTransportMetadata as r, PLUGIN_MODEL_CATALOG_GENERATED_BY as t };
