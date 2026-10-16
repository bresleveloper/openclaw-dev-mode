import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Fn as object, Lt as boolean, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { t as resolveEnabledBundledManifestContractPlugins } from "./bundled-manifest-contract-plugins-CNQjdqe8.mjs";
import { t as loadBundledPublicArtifactEntries } from "./public-artifact-factories-BiUc7WE9.mjs";
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
const extractionIntegerSchema = number().int().max(Number.MAX_SAFE_INTEGER);
const extractionMetadataSchema = object({
	pages: object({
		processed: array(extractionIntegerSchema.positive()),
		total: extractionIntegerSchema.nonnegative(),
		selection: _enum(["automatic", "explicit"]),
		truncated: boolean()
	}).optional(),
	textTruncated: boolean(),
	imagesTruncated: boolean()
});
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
			if (result) {
				const { metadata, ...content } = result;
				const validatedMetadata = extractionMetadataSchema.safeParse(metadata);
				const parsedMetadata = validatedMetadata.success ? validatedMetadata.data : void 0;
				const pages = parsedMetadata?.pages;
				const requestedPageSet = request.pageNumbers ? new Set(request.pageNumbers) : void 0;
				const hasOmittedPages = (pages?.processed.length ?? 0) < (requestedPageSet?.size ?? pages?.total ?? 0);
				const trustedMetadata = parsedMetadata && (!pages || pages.selection === (request.pageNumbers ? "explicit" : "automatic") && pages.processed.length <= request.maxPages && new Set(pages.processed).size === pages.processed.length && pages.processed.every((page) => page <= pages.total && (!requestedPageSet || requestedPageSet.has(page))) && (pages.truncated === hasOmittedPages || hasOmittedPages && parsedMetadata.textTruncated)) ? parsedMetadata : void 0;
				return {
					...content,
					...trustedMetadata ? { metadata: trustedMetadata } : {},
					extractor: extractor.id
				};
			}
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
/** Extracts PDF content through the configured document extractor without exposing its owner id. */
async function extractPdfContent(params) {
	const extracted = await extractDocumentContent({
		...params,
		mimeType: "application/pdf"
	});
	if (!extracted) throw new Error("PDF extraction disabled or unavailable: enable the document-extract plugin to process application/pdf files.");
	const { extractor: _extractor, ...content } = extracted;
	return content;
}
//#endregion
export { extractPdfContent as t };
