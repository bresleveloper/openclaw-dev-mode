import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { t as resolveEnabledBundledManifestContractPlugins } from "./bundled-manifest-contract-plugins-DP4uyfAX.mjs";
import { t as loadBundledPublicArtifactEntries } from "./public-artifact-factories-Dpb70kPS.mjs";
import { n as sortPluginEntriesForAutoDetect } from "./plugin-entry-order-DxrT0ucv.mjs";
//#region src/plugins/document-extractor-public-artifacts.ts
function isDocumentExtractorPlugin(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.label === "string" && Array.isArray(value.mimeTypes) && value.mimeTypes.every((mimeType) => typeof mimeType === "string" && mimeType.trim()) && (value.autoDetectOrder === void 0 || typeof value.autoDetectOrder === "number") && typeof value.extract === "function";
}
/** Loads document extractor entries from a bundled plugin public artifact module. */
function loadBundledDocumentExtractorEntriesFromDir(params) {
	return loadBundledPublicArtifactEntries({
		...params,
		artifactCandidates: ["document-extractor.js", "document-extractor-api.js"],
		suffix: "DocumentExtractor",
		isArtifact: isDocumentExtractorPlugin,
		partialFailureLabel: "document extractors"
	});
}
//#endregion
//#region src/plugins/document-extractors.runtime.ts
/** Returns enabled document extractors in deterministic auto-detect order. */
function resolvePluginDocumentExtractors(params) {
	const extractors = [];
	const loadErrors = [];
	let onlyPluginIds = params?.onlyPluginIds;
	const allowlist = normalizePluginsConfig(params?.config?.plugins).allow;
	if (allowlist.length > 0) {
		const scope = createPluginIdScopeSet(onlyPluginIds);
		onlyPluginIds = allowlist.filter((pluginId) => !scope || scope.has(pluginId));
	}
	for (const plugin of resolveEnabledBundledManifestContractPlugins({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env: params?.env,
		onlyPluginIds,
		contract: "documentExtractors"
	})) {
		let loaded;
		try {
			loaded = loadBundledDocumentExtractorEntriesFromDir({
				dirName: plugin.id,
				pluginId: plugin.id,
				env: params?.env,
				owner: plugin
			});
		} catch (error) {
			loadErrors.push(error);
			continue;
		}
		if (loaded) extractors.push(...loaded);
	}
	if (extractors.length === 0 && loadErrors.length > 0) throw new Error("Unable to load document extractor plugins", { cause: loadErrors.length === 1 ? loadErrors[0] : new AggregateError(loadErrors) });
	return sortPluginEntriesForAutoDetect(extractors);
}
//#endregion
//#region src/media/document-extractors.runtime.ts
/** Runs the first matching plugin document extractor and tags successful results with its extractor id. */
async function extractDocumentContent(params) {
	const mimeType = normalizeLowercaseStringOrEmpty(params.mimeType);
	params.signal?.throwIfAborted();
	const extractors = resolvePluginDocumentExtractors({ config: params.config });
	params.signal?.throwIfAborted();
	const request = {
		buffer: params.buffer,
		mimeType: params.mimeType,
		maxPages: params.maxPages,
		maxPixels: params.maxPixels,
		minTextChars: params.minTextChars,
		...params.password ? { password: params.password } : {},
		...params.pageNumbers ? { pageNumbers: params.pageNumbers } : {},
		...params.signal ? { signal: params.signal } : {},
		...params.onImageExtractionError ? { onImageExtractionError: params.onImageExtractionError } : {}
	};
	const errors = [];
	for (const extractor of extractors) {
		if (!extractor.mimeTypes.map((entry) => normalizeLowercaseStringOrEmpty(entry)).includes(mimeType)) continue;
		try {
			const result = await extractor.extract(request);
			params.signal?.throwIfAborted();
			if (result) return {
				...result,
				extractor: extractor.id
			};
		} catch (error) {
			params.signal?.throwIfAborted();
			errors.push(error);
		}
	}
	if (errors.length > 0) throw new Error(`Document extraction failed for ${mimeType || "unknown MIME type"}`, { cause: errors.length === 1 ? errors[0] : new AggregateError(errors) });
	return null;
}
//#endregion
//#region src/media/pdf-extract.ts
/** Extracts PDF content through the configured document extractor and hides extractor metadata. */
async function extractPdfContent(params) {
	const extracted = await extractDocumentContent({
		...params,
		mimeType: "application/pdf"
	});
	if (!extracted) throw new Error("PDF extraction disabled or unavailable: enable the document-extract plugin to process application/pdf files.");
	return {
		text: extracted.text,
		images: extracted.images
	};
}
//#endregion
export { extractPdfContent as t };
