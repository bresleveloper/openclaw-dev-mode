import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, o as normalizeNullableString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { n as isAbortError } from "./unhandled-rejections-QMGVkiWd.js";
import { g as sortUniqueStrings, l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { m as FsSafeError } from "./path-BlG8lhgR.js";
import { S as safeFileURLToPath, r as writeExternalFileWithinRoot, v as assertNoWindowsNetworkPath, w as pathExists } from "./fs-safe-aqmM_n6V.js";
import { r as openLocalFileSafely } from "./secure-temp-dir-XAWcZnE2.js";
import { n as readResponseWithLimit } from "./read-response-with-limit-MDCSJrlg.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { t as buildRandomTempFilePath } from "./temp-download-BObIC861.js";
import { n as createConfigScopedPromiseLoader } from "./plugin-cache-primitives-BaxqicKH.js";
import { l as resolveEffectivePluginActivationState, n as createPluginActivationSource, s as normalizePluginsConfig } from "./config-state-6HQcbL-X.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-Dxs7o6SG.js";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-BWmHKFNH.js";
import { a as logWarn } from "./logger-p_Dm5cGu.js";
import { i as runExec } from "./exec-CIJxrT1J.js";
import { a as loadManifestContractSnapshot } from "./manifest-contract-eligibility-CqVcoNpy.js";
import { n as resolveBundledPluginCompatibleLoadValues } from "./activation-context-DIeg2QAR.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Behn5ZPn.js";
import { c as kindFromMime, i as getFileExtension, n as detectMime, o as isAudioFileName } from "./mime-C8mVE2Bw.js";
import "./local-file-access-CBe_wA_B.js";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-l6yrCyHc.js";
import { a as mergeModelProviderRequestOverrides, d as sanitizeConfiguredProviderRequest, u as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-B7N9imAw.js";
import { n as CUSTOM_LOCAL_AUTH_MARKER } from "./model-auth-markers-C4s6SbvA.js";
import { a as convertHeicToJpeg } from "./image-ops-DdUL3po0.js";
import { c as runFfmpeg } from "./media-services-CvavqnxN.js";
import { t as parseMediaContentLength } from "./content-length-DZY9SBS5.js";
import { i as readRemoteMediaBuffer, n as MediaFetchError } from "./fetch-UNNW3Fm6.js";
import { r as mergeInboundPathRoots, t as isInboundPathAllowed } from "./inbound-path-policy-CYWsER5a.js";
import { a as getDefaultMediaLocalRoots } from "./local-roots-ChiBnsqP.js";
import { n as normalizeMediaProviderId, t as normalizeMediaExecutionProviderId } from "./provider-id-DSbuCFIb.js";
import { t as describeImageWithModel } from "./image-runtime-BQzspu3i.js";
import { c as DEFAULT_VIDEO_MAX_BASE64_BYTES, d as getMediaUnderstandingProvider, l as MIN_AUDIO_FILE_BYTES, n as DEFAULT_MAX_BYTES, s as DEFAULT_TIMEOUT_SECONDS, t as CLI_OUTPUT_MAX_BUFFER } from "./defaults.constants-CdFDqUvQ.js";
import { c as resolveTimeoutMs, n as resolveMaxBytes, o as resolvePrompt, r as resolveMaxChars } from "./resolve-D7kPUIzQ.js";
import { n as resolveOpenAiAudioAuthModelApi } from "./openai-audio-api-BEkNYRPi.js";
import { n as providerOperationRetryConfig } from "./operation-retry-Dwqo1Pzf.js";
import "./temp-path-BbDdjtr4.js";
import { n as executeWithApiKeyRotation, t as collectProviderApiKeysForExecution } from "./api-key-rotation-CoUrO4uz.js";
import { t as applyTemplate } from "./templating-CLmjS51i.js";
import { i as resolveProxyFetchFromEnv } from "./proxy-fetch-dlAuw1Au.js";
import { realpathSync, statSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/plugins/bundled-manifest-contract-plugins.ts
function createPluginIdSet(pluginIds) {
	return pluginIds && pluginIds.length > 0 ? new Set(pluginIds) : null;
}
/** Lists bundled plugin ids with a non-empty contract contribution in a manifest snapshot. */
function listBundledManifestContractPluginIds(params) {
	const onlyPluginIdSet = createPluginIdSet(params.onlyPluginIds);
	return params.plugins.filter((plugin) => plugin.origin === "bundled" && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) && (plugin.contracts?.[params.contract]?.length ?? 0) > 0).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
/** Applies config activation and compatibility rules before returning bundled contract owners. */
function resolveEnabledBundledManifestContractPlugins(params) {
	if (params.config?.plugins?.enabled === false) return [];
	let manifestRecords;
	const loadManifestRecords = (config) => {
		manifestRecords ??= loadManifestContractSnapshot({
			config,
			workspaceDir: params.workspaceDir,
			env: params.env
		}).plugins;
		return manifestRecords;
	};
	const activation = resolveBundledPluginCompatibleLoadValues({
		rawConfig: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: params.onlyPluginIds,
		applyAutoEnable: true,
		compatMode: params.compatMode,
		resolveCompatPluginIds: (compatParams) => listBundledManifestContractPluginIds({
			plugins: loadManifestRecords(compatParams.config),
			contract: params.contract,
			onlyPluginIds: compatParams.onlyPluginIds
		})
	});
	const normalizedPlugins = normalizePluginsConfig(activation.config?.plugins);
	const activationSource = createPluginActivationSource({ config: activation.activationSourceConfig });
	const onlyPluginIdSet = createPluginIdSet(params.onlyPluginIds);
	return loadManifestRecords(activation.config).filter((plugin) => {
		if (plugin.origin !== "bundled" || onlyPluginIdSet && !onlyPluginIdSet.has(plugin.id) || (plugin.contracts?.[params.contract]?.length ?? 0) === 0) return false;
		return resolveEffectivePluginActivationState({
			id: plugin.id,
			origin: plugin.origin,
			config: normalizedPlugins,
			rootConfig: activation.config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin),
			activationSource
		}).enabled;
	});
}
//#endregion
//#region src/plugins/document-extractor-public-artifacts.ts
const DOCUMENT_EXTRACTOR_ARTIFACT_CANDIDATES = ["document-extractor.js", "document-extractor-api.js"];
function isDocumentExtractorPlugin(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.label === "string" && Array.isArray(value.mimeTypes) && value.mimeTypes.every((mimeType) => typeof mimeType === "string" && mimeType.trim()) && (value.autoDetectOrder === void 0 || typeof value.autoDetectOrder === "number") && typeof value.extract === "function";
}
function collectExtractorFactories(mod) {
	const extractors = [];
	const errors = [];
	for (const [name, exported] of Object.entries(mod).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (typeof exported !== "function" || exported.length !== 0 || !name.startsWith("create") || !name.endsWith("DocumentExtractor")) continue;
		let candidate;
		try {
			candidate = exported();
		} catch (error) {
			errors.push(error);
			continue;
		}
		if (isDocumentExtractorPlugin(candidate)) extractors.push(candidate);
	}
	return {
		extractors,
		errors
	};
}
/** Loads document extractor entries from a bundled plugin public artifact module. */
function loadBundledDocumentExtractorEntriesFromDir(params) {
	const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: params.dirName,
		artifactCandidates: DOCUMENT_EXTRACTOR_ARTIFACT_CANDIDATES
	});
	if (!mod) return null;
	const { extractors, errors } = collectExtractorFactories(mod);
	if (extractors.length === 0) {
		if (errors.length > 0) throw new Error(`Unable to initialize document extractors for plugin ${params.pluginId}`, { cause: errors.length === 1 ? errors[0] : new AggregateError(errors) });
		return null;
	}
	return extractors.map((extractor) => Object.assign({}, extractor, { pluginId: params.pluginId }));
}
//#endregion
//#region src/plugins/document-extractors.runtime.ts
/** Resolves bundled document extractor providers from enabled manifest contracts. */
function compareExtractors(left, right) {
	const leftOrder = left.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
	const rightOrder = right.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
	if (leftOrder !== rightOrder) return leftOrder - rightOrder;
	return left.id.localeCompare(right.id) || left.pluginId.localeCompare(right.pluginId);
}
function resolveExplicitAllowedDocumentExtractorPluginIds(params) {
	const allow = params.config?.plugins?.allow;
	if (!Array.isArray(allow) || allow.length === 0) return null;
	const onlyPluginIdSet = params.onlyPluginIds && params.onlyPluginIds.length > 0 ? new Set(params.onlyPluginIds) : null;
	const deniedPluginIds = new Set(params.config?.plugins?.deny ?? []);
	const entries = params.config?.plugins?.entries ?? {};
	return sortUniqueStrings(normalizeStringEntries(allow).filter((pluginId) => !onlyPluginIdSet || onlyPluginIdSet.has(pluginId)).filter((pluginId) => !deniedPluginIds.has(pluginId)).filter((pluginId) => entries[pluginId]?.enabled !== false));
}
/** Returns enabled document extractors in deterministic auto-detect order. */
function resolvePluginDocumentExtractors(params) {
	const extractors = [];
	const loadErrors = [];
	const pluginIds = resolveExplicitAllowedDocumentExtractorPluginIds({
		config: params?.config,
		onlyPluginIds: params?.onlyPluginIds
	}) ?? resolveEnabledBundledManifestContractPlugins({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env: params?.env,
		onlyPluginIds: params?.onlyPluginIds,
		contract: "documentExtractors",
		compatMode: {
			enablement: "always",
			vitest: true
		}
	}).map((plugin) => plugin.id);
	for (const pluginId of pluginIds) {
		let loaded;
		try {
			loaded = loadBundledDocumentExtractorEntriesFromDir({
				dirName: pluginId,
				pluginId
			});
		} catch (error) {
			loadErrors.push(error);
			continue;
		}
		if (loaded) extractors.push(...loaded);
	}
	if (extractors.length === 0 && loadErrors.length > 0) throw new Error("Unable to load document extractor plugins", { cause: loadErrors.length === 1 ? loadErrors[0] : new AggregateError(loadErrors) });
	return extractors.toSorted(compareExtractors);
}
//#endregion
//#region src/media/document-extractors.runtime.ts
const documentExtractorLoader = createConfigScopedPromiseLoader((config) => resolvePluginDocumentExtractors(config ? { config } : void 0));
/** Runs the first matching plugin document extractor and tags successful results with its extractor id. */
async function extractDocumentContent(params) {
	const mimeType = normalizeLowercaseStringOrEmpty(params.mimeType);
	const extractors = await documentExtractorLoader.load(params.config);
	const request = {
		buffer: params.buffer,
		mimeType: params.mimeType,
		maxPages: params.maxPages,
		maxPixels: params.maxPixels,
		minTextChars: params.minTextChars,
		...params.password ? { password: params.password } : {},
		...params.pageNumbers ? { pageNumbers: params.pageNumbers } : {},
		...params.onImageExtractionError ? { onImageExtractionError: params.onImageExtractionError } : {}
	};
	const errors = [];
	for (const extractor of extractors) {
		if (!extractor.mimeTypes.map((entry) => normalizeLowercaseStringOrEmpty(entry)).includes(mimeType)) continue;
		try {
			const result = await extractor.extract(request);
			if (result) return {
				...result,
				extractor: extractor.id
			};
		} catch (error) {
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
		buffer: params.buffer,
		mimeType: "application/pdf",
		maxPages: params.maxPages,
		maxPixels: params.maxPixels,
		minTextChars: params.minTextChars,
		...params.password ? { password: params.password } : {},
		...params.pageNumbers ? { pageNumbers: params.pageNumbers } : {},
		...params.config ? { config: params.config } : {},
		...params.onImageExtractionError ? { onImageExtractionError: params.onImageExtractionError } : {}
	});
	if (!extracted) throw new Error("PDF extraction disabled or unavailable: enable the document-extract plugin to process application/pdf files.");
	return {
		text: extracted.text,
		images: extracted.images
	};
}
//#endregion
//#region src/media-understanding/attachments.normalize.ts
/** Normalizes a local attachment path while rejecting remote file URLs and Windows UNC paths. */
function normalizeAttachmentPath(raw) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	if (value.startsWith("file://")) try {
		return safeFileURLToPath(value);
	} catch {
		return;
	}
	try {
		assertNoWindowsNetworkPath(value, "Attachment path");
	} catch {
		return;
	}
	return value;
}
/** Flattens legacy single-value and array media fields into indexed attachment records. */
function normalizeAttachments(ctx) {
	const pathsFromArray = Array.isArray(ctx.MediaPaths) ? ctx.MediaPaths : void 0;
	const urlsFromArray = Array.isArray(ctx.MediaUrls) ? ctx.MediaUrls : void 0;
	const typesFromArray = Array.isArray(ctx.MediaTypes) ? ctx.MediaTypes : void 0;
	const transcribedIndexes = new Set(Array.isArray(ctx.MediaTranscribedIndexes) ? ctx.MediaTranscribedIndexes.filter((index) => Number.isInteger(index) && index >= 0) : []);
	const resolveMime = (count, index) => {
		const typeHint = normalizeOptionalString(typesFromArray?.[index]);
		if (typeHint) return typeHint;
		return count === 1 ? ctx.MediaType : void 0;
	};
	if (pathsFromArray && pathsFromArray.length > 0) {
		const count = pathsFromArray.length;
		const urls = urlsFromArray && urlsFromArray.length > 0 ? urlsFromArray : void 0;
		return pathsFromArray.map((value, index) => ({
			path: normalizeOptionalString(value),
			url: urls?.[index] ?? ctx.MediaUrl,
			mime: resolveMime(count, index),
			index,
			alreadyTranscribed: transcribedIndexes.has(index)
		})).filter((entry) => Boolean(entry.path ?? normalizeOptionalString(entry.url)));
	}
	if (urlsFromArray && urlsFromArray.length > 0) {
		const count = urlsFromArray.length;
		return urlsFromArray.map((value, index) => ({
			path: void 0,
			url: normalizeOptionalString(value),
			mime: resolveMime(count, index),
			index,
			alreadyTranscribed: transcribedIndexes.has(index)
		})).filter((entry) => Boolean(entry.url));
	}
	const pathValue = normalizeOptionalString(ctx.MediaPath);
	const url = normalizeOptionalString(ctx.MediaUrl);
	if (!pathValue && !url) return [];
	return [{
		path: pathValue || void 0,
		url: url || void 0,
		mime: ctx.MediaType,
		index: 0,
		alreadyTranscribed: transcribedIndexes.has(0)
	}];
}
/** Classifies an attachment by MIME first, then by filename/URL extension fallback. */
function resolveAttachmentKind(attachment) {
	const kind = kindFromMime(attachment.mime);
	if (kind === "image" || kind === "audio" || kind === "video") return kind;
	const ext = getFileExtension(attachment.path ?? attachment.url);
	if (!ext) return "unknown";
	if ([
		".mp4",
		".mov",
		".mkv",
		".webm",
		".avi",
		".m4v"
	].includes(ext)) return "video";
	if (isAudioFileName(attachment.path ?? attachment.url)) return "audio";
	if ([
		".png",
		".jpg",
		".jpeg",
		".webp",
		".gif",
		".bmp",
		".tiff",
		".tif"
	].includes(ext)) return "image";
	return "unknown";
}
/** Returns true when the attachment is classified as video media. */
function isVideoAttachment(attachment) {
	return resolveAttachmentKind(attachment) === "video";
}
/** Returns true when the attachment is classified as audio media. */
function isAudioAttachment(attachment) {
	return resolveAttachmentKind(attachment) === "audio";
}
/** Returns true when the attachment is classified as image media. */
function isImageAttachment(attachment) {
	return resolveAttachmentKind(attachment) === "image";
}
//#endregion
//#region src/media-understanding/attachments.select.ts
const DEFAULT_MAX_ATTACHMENTS = 1;
function orderAttachments(attachments, prefer) {
	const list = Array.isArray(attachments) ? attachments.filter(isAttachmentRecord) : [];
	if (!prefer || prefer === "first") return list;
	if (prefer === "last") return [...list].toReversed();
	if (prefer === "path") {
		const withPath = list.filter((item) => item.path);
		const withoutPath = list.filter((item) => !item.path);
		return [...withPath, ...withoutPath];
	}
	if (prefer === "url") {
		const withUrl = list.filter((item) => item.url);
		const withoutUrl = list.filter((item) => !item.url);
		return [...withUrl, ...withoutUrl];
	}
	return list;
}
function isAttachmentRecord(value) {
	if (!value || typeof value !== "object") return false;
	const entry = value;
	if (typeof entry.index !== "number") return false;
	if (entry.path !== void 0 && typeof entry.path !== "string") return false;
	if (entry.url !== void 0 && typeof entry.url !== "string") return false;
	if (entry.mime !== void 0 && typeof entry.mime !== "string") return false;
	if (entry.alreadyTranscribed !== void 0 && typeof entry.alreadyTranscribed !== "boolean") return false;
	return true;
}
/** Selects attachments for a media-understanding capability under configured ordering limits. */
function selectAttachments(params) {
	const { capability, attachments, policy } = params;
	const matches = (Array.isArray(attachments) ? attachments.filter(isAttachmentRecord) : []).filter((item) => {
		if (capability === "audio" && item.alreadyTranscribed) return false;
		if (capability === "image") return isImageAttachment(item);
		if (capability === "audio") return isAudioAttachment(item);
		return isVideoAttachment(item);
	});
	if (matches.length === 0) return [];
	const ordered = orderAttachments(matches, policy?.prefer);
	const mode = policy?.mode ?? "first";
	const maxAttachments = policy?.maxAttachments ?? DEFAULT_MAX_ATTACHMENTS;
	if (mode === "all") return ordered.slice(0, Math.max(1, maxAttachments));
	return ordered.slice(0, 1);
}
//#endregion
//#region packages/media-understanding-common/src/errors.ts
/** Error used when a media attachment should be skipped without failing the whole request. */
var MediaUnderstandingSkipError = class extends Error {
	constructor(reason, message) {
		super(message);
		this.reason = reason;
		this.name = "MediaUnderstandingSkipError";
	}
};
/** Narrow unknown errors to media-understanding skip errors. */
function isMediaUnderstandingSkipError(err) {
	return err instanceof MediaUnderstandingSkipError;
}
//#endregion
//#region src/media-understanding/attachments.cache.ts
const REMOTE_MEDIA_FETCH_RETRY = {
	attempts: 3,
	minDelayMs: 500,
	maxDelayMs: 3e3,
	jitter: .2
};
let defaultLocalPathRoots;
function concreteMime(mime) {
	const normalized = mime?.trim();
	if (!normalized || normalized.endsWith("/*")) return;
	return normalized;
}
function getDefaultLocalPathRoots() {
	defaultLocalPathRoots ??= mergeInboundPathRoots(getDefaultMediaLocalRoots());
	return defaultLocalPathRoots;
}
function resolveUsableLocalCandidate(candidate, roots) {
	try {
		const realPath = realpathSync(candidate);
		const canonicalRoots = roots.map((root) => {
			if (root.includes("*")) return root;
			try {
				return realpathSync(root);
			} catch {
				return root;
			}
		});
		return statSync(realPath).isFile() && isInboundPathAllowed({
			filePath: realPath,
			roots: canonicalRoots
		}) ? candidate : void 0;
	} catch {
		return;
	}
}
/**
* Lazy resolver for media-understanding attachments.
*
* The cache prefers allowed local paths, falls back to remote URLs when a local path is blocked
* or missing, and owns any temporary files created for providers that require a filesystem path.
*/
var MediaAttachmentCache = class {
	constructor(attachments, options) {
		this.entries = /* @__PURE__ */ new Map();
		this.attachments = attachments;
		this.ssrfPolicy = options?.ssrfPolicy;
		this.localPathRoots = options?.includeDefaultLocalPathRoots === false ? mergeInboundPathRoots(options.localPathRoots) : mergeInboundPathRoots(options?.localPathRoots, getDefaultLocalPathRoots());
		this.workspaceDir = options?.workspaceDir ? path.resolve(options.workspaceDir) : void 0;
		for (const attachment of attachments) this.entries.set(attachment.index, { attachment });
	}
	/** Returns attachment bytes, MIME hint, filename, and size within the requested byte limit. */
	async getBuffer(params) {
		const entry = await this.ensureEntry(params.attachmentIndex);
		const url = entry.attachment.url?.trim();
		if (entry.buffer) {
			if (entry.buffer.length > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			return {
				buffer: entry.buffer,
				mime: entry.bufferMime,
				fileName: entry.bufferFileName ?? `media-${params.attachmentIndex + 1}`,
				size: entry.buffer.length
			};
		}
		if (entry.resolvedPath) try {
			const size = await this.ensureLocalStat(entry);
			if (entry.resolvedPath) {
				if (size !== void 0 && size > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
				const { buffer, filePath } = await this.readLocalBuffer({
					attachmentIndex: params.attachmentIndex,
					filePath: entry.resolvedPath,
					maxBytes: params.maxBytes
				});
				entry.resolvedPath = filePath;
				entry.buffer = buffer;
				entry.bufferMime = entry.bufferMime ?? concreteMime(entry.attachment.mime) ?? await detectMime({
					buffer,
					filePath
				});
				entry.bufferFileName = path.basename(filePath) || `media-${params.attachmentIndex + 1}`;
				return {
					buffer,
					mime: entry.bufferMime,
					fileName: entry.bufferFileName,
					size: buffer.length
				};
			}
		} catch (err) {
			if (!(err instanceof MediaUnderstandingSkipError) || !url || err.reason !== "blocked" && err.reason !== "empty") throw err;
		}
		if (!url) throw new MediaUnderstandingSkipError("empty", `Attachment ${params.attachmentIndex + 1} has no path or URL.`);
		try {
			const fetched = await readRemoteMediaBuffer({
				url,
				timeoutMs: params.timeoutMs,
				maxBytes: params.maxBytes,
				ssrfPolicy: this.ssrfPolicy,
				retry: REMOTE_MEDIA_FETCH_RETRY
			});
			entry.buffer = fetched.buffer;
			entry.bufferMime = concreteMime(entry.attachment.mime) ?? fetched.contentType ?? await detectMime({
				buffer: fetched.buffer,
				filePath: fetched.fileName ?? url
			});
			entry.bufferFileName = fetched.fileName ?? `media-${params.attachmentIndex + 1}`;
			return {
				buffer: fetched.buffer,
				mime: entry.bufferMime,
				fileName: entry.bufferFileName,
				size: fetched.buffer.length
			};
		} catch (err) {
			if (err instanceof MediaFetchError && err.code === "max_bytes") throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			if (isAbortError(err)) throw new MediaUnderstandingSkipError("timeout", `Attachment ${params.attachmentIndex + 1} timed out while fetching.`);
			throw err;
		}
	}
	/** Returns a local path for providers that cannot accept buffers, creating a temp file if needed. */
	async getPath(params) {
		const entry = await this.ensureEntry(params.attachmentIndex);
		if (entry.resolvedPath) {
			if (params.maxBytes) try {
				const size = await this.ensureLocalStat(entry);
				if (entry.resolvedPath) {
					if (size !== void 0 && size > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
				}
			} catch (err) {
				if (!(err instanceof MediaUnderstandingSkipError) || err.reason !== "blocked" && err.reason !== "empty") throw err;
			}
			if (entry.resolvedPath) return { path: entry.resolvedPath };
		}
		if (entry.tempPath) {
			if (params.maxBytes && entry.buffer && entry.buffer.length > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			return {
				path: entry.tempPath,
				cleanup: entry.tempCleanup
			};
		}
		const maxBytes = params.maxBytes ?? Number.POSITIVE_INFINITY;
		const bufferResult = await this.getBuffer({
			attachmentIndex: params.attachmentIndex,
			maxBytes,
			timeoutMs: params.timeoutMs
		});
		const tmpPath = buildRandomTempFilePath({
			prefix: "openclaw-media",
			extension: path.extname(bufferResult.fileName || "") || ""
		});
		await fs$1.writeFile(tmpPath, bufferResult.buffer);
		entry.tempPath = tmpPath;
		entry.tempCleanup = async () => {
			await fs$1.unlink(tmpPath).catch(() => {});
		};
		return {
			path: tmpPath,
			cleanup: entry.tempCleanup
		};
	}
	/** Removes temporary files created by `getPath`; callers should run this after provider use. */
	async cleanup() {
		const cleanups = [];
		for (const entry of this.entries.values()) if (entry.tempCleanup) {
			cleanups.push(entry.tempCleanup());
			entry.tempCleanup = void 0;
		}
		await Promise.all(cleanups);
	}
	async ensureEntry(attachmentIndex) {
		const existing = this.entries.get(attachmentIndex);
		if (existing) {
			if (!existing.resolvedPath) existing.resolvedPath = this.resolveLocalPath(existing.attachment);
			return existing;
		}
		const attachment = this.attachments.find((item) => item.index === attachmentIndex) ?? { index: attachmentIndex };
		const entry = {
			attachment,
			resolvedPath: this.resolveLocalPath(attachment)
		};
		this.entries.set(attachmentIndex, entry);
		return entry;
	}
	resolveLocalPath(attachment) {
		const rawPath = normalizeAttachmentPath(attachment.path);
		if (!rawPath) return;
		if (this.workspaceDir) return path.resolve(this.workspaceDir, rawPath);
		if (!path.isAbsolute(rawPath)) {
			const usableCwdCandidate = resolveUsableLocalCandidate(path.resolve(rawPath), this.localPathRoots);
			if (usableCwdCandidate) return usableCwdCandidate;
			const usableStateCandidate = resolveUsableLocalCandidate(path.resolve(resolveStateDir(), rawPath), this.localPathRoots);
			if (usableStateCandidate) return usableStateCandidate;
		}
		return path.resolve(rawPath);
	}
	async ensureLocalStat(entry) {
		if (!entry.resolvedPath) return;
		if (!isInboundPathAllowed({
			filePath: entry.resolvedPath,
			roots: this.localPathRoots
		})) {
			entry.resolvedPath = void 0;
			if (shouldLogVerbose()) logVerbose(`Blocked attachment path outside allowed roots: ${entry.attachment.path ?? entry.attachment.url ?? "(unknown)"}`);
			throw new MediaUnderstandingSkipError("blocked", `Attachment ${entry.attachment.index + 1} path is outside allowed roots.`);
		}
		if (entry.statSize !== void 0) return entry.statSize;
		try {
			const currentPath = entry.resolvedPath;
			const opened = await openLocalFileSafely({ filePath: currentPath });
			let canonicalRoots;
			try {
				canonicalRoots = await this.getCanonicalLocalPathRoots();
			} finally {
				await opened.handle.close().catch(() => {});
			}
			if (!isInboundPathAllowed({
				filePath: opened.realPath,
				roots: canonicalRoots
			})) {
				entry.resolvedPath = void 0;
				if (shouldLogVerbose()) logVerbose(`Blocked canonicalized attachment path outside allowed roots: ${opened.realPath}`);
				throw new MediaUnderstandingSkipError("blocked", `Attachment ${entry.attachment.index + 1} path is outside allowed roots.`);
			}
			entry.resolvedPath = opened.realPath;
			entry.statSize = opened.stat.size;
			return opened.stat.size;
		} catch (err) {
			if (err instanceof MediaUnderstandingSkipError) throw err;
			if (err instanceof FsSafeError) {
				entry.resolvedPath = void 0;
				if (err.code === "not-file") throw new MediaUnderstandingSkipError("empty", `Attachment ${entry.attachment.index + 1} path is not a regular file.`);
				if (err.code !== "not-found") throw new MediaUnderstandingSkipError("blocked", `Attachment ${entry.attachment.index + 1} path is outside allowed roots.`);
			} else throw new MediaUnderstandingSkipError("blocked", `Attachment ${entry.attachment.index + 1} could not be canonicalized.`);
			entry.resolvedPath = void 0;
			if (shouldLogVerbose()) logVerbose(`Failed to read attachment ${entry.attachment.index + 1}: ${String(err)}`);
			return;
		}
	}
	async getCanonicalLocalPathRoots() {
		if (this.canonicalLocalPathRoots) return await this.canonicalLocalPathRoots;
		this.canonicalLocalPathRoots = (async () => mergeInboundPathRoots(this.localPathRoots, await Promise.all(this.localPathRoots.map(async (root) => {
			if (root.includes("*")) return root;
			return await fs$1.realpath(root).catch(() => root);
		}))))();
		return await this.canonicalLocalPathRoots;
	}
	async readLocalBuffer(params) {
		let opened;
		try {
			opened = await openLocalFileSafely({ filePath: params.filePath });
			if (opened.stat.size > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			const canonicalRoots = await this.getCanonicalLocalPathRoots();
			if (!isInboundPathAllowed({
				filePath: opened.realPath,
				roots: canonicalRoots
			})) throw new MediaUnderstandingSkipError("blocked", `Attachment ${params.attachmentIndex + 1} path is outside allowed roots.`);
			const buffer = await opened.handle.readFile();
			if (buffer.length > params.maxBytes) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
			return {
				buffer,
				filePath: opened.realPath
			};
		} catch (err) {
			if (err instanceof FsSafeError) {
				if (err.code === "too-large") throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${params.maxBytes}`);
				if (err.code === "not-file" || err.code === "not-found") throw new MediaUnderstandingSkipError("empty", `Attachment ${params.attachmentIndex + 1} path is not a regular file.`);
				throw new MediaUnderstandingSkipError("blocked", `Attachment ${params.attachmentIndex + 1} path is outside allowed roots.`);
			}
			throw err;
		} finally {
			await opened?.handle.close().catch(() => {});
		}
	}
};
//#endregion
//#region src/media-understanding/fs.ts
/** Safely checks optional media file paths without throwing on empty input. */
async function fileExists(filePath) {
	return filePath ? await pathExists(filePath) : false;
}
//#endregion
//#region packages/media-understanding-common/src/output-extract.ts
/** Parse the last JSON object in a noisy provider output string. */
function extractLastJsonObject(raw) {
	const trimmed = raw.trim();
	const start = trimmed.lastIndexOf("{");
	if (start === -1) return null;
	const slice = trimmed.slice(start);
	try {
		return JSON.parse(slice);
	} catch {
		return null;
	}
}
/** Extract Gemini CLI-style response text from the last JSON object in output. */
function extractGeminiResponse(raw) {
	const payload = extractLastJsonObject(raw);
	if (!payload || typeof payload !== "object") return null;
	const response = payload.response;
	if (typeof response !== "string") return null;
	return response.trim() || null;
}
//#endregion
//#region packages/media-understanding-common/src/video.ts
/** Estimate base64 size for a byte count. */
function estimateBase64Size(bytes) {
	return Math.ceil(bytes / 3) * 4;
}
/** Resolve video base64 byte limit from raw byte limit and global cap. */
function resolveVideoMaxBase64Bytes(maxBytes) {
	const expanded = Math.floor(maxBytes * (4 / 3));
	return Math.min(expanded, DEFAULT_VIDEO_MAX_BASE64_BYTES);
}
//#endregion
//#region src/media/input-files.ts
/** Default MIME allowlist for input_image sources. */
const DEFAULT_INPUT_IMAGE_MIMES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/heic",
	"image/heif"
];
/** Default MIME allowlist for input_file text/PDF extraction. */
const DEFAULT_INPUT_FILE_MIMES = [
	"text/plain",
	"text/markdown",
	"text/html",
	"text/csv",
	"application/json",
	"application/pdf"
];
/** Default decoded-byte cap for input_image payloads. */
const DEFAULT_INPUT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
/** Default timeout for guarded input source URL fetches. */
const DEFAULT_INPUT_TIMEOUT_MS = 1e4;
const NORMALIZED_INPUT_IMAGE_MIME = "image/jpeg";
const HEIC_INPUT_IMAGE_MIMES = new Set(["image/heic", "image/heif"]);
function rejectOversizedBase64Payload(params) {
	const estimated = estimateBase64DecodedBytes(params.data);
	if (estimated > params.maxBytes) throw new Error(`${params.label} too large: ${estimated} bytes (limit: ${params.maxBytes} bytes)`);
}
/** Normalizes a MIME value by stripping parameters and lowercasing the media type. */
function normalizeMimeType(value) {
	const [raw] = value?.split(";") ?? [];
	return normalizeOptionalLowercaseString(raw);
}
/** Parses a Content-Type header into normalized MIME and optional charset values. */
function parseContentType(value) {
	if (!value) return {};
	const parts = value.split(";").map((part) => part.trim());
	return {
		mimeType: normalizeMimeType(parts[0]),
		charset: parts.map((part) => normalizeOptionalString(part.match(/^charset=(.+)$/i)?.[1])).find((part) => part && part.length > 0)
	};
}
/** Converts configured MIME lists into a normalized allowlist, using fallback defaults when empty. */
function normalizeMimeList(values, fallback) {
	const input = values && values.length > 0 ? values : fallback;
	return new Set(input.flatMap((value) => normalizeMimeType(value) ?? []));
}
/** Resolves input_file extraction limits from partial config and stable defaults. */
function resolveInputFileLimits(config) {
	return {
		allowUrl: config?.allowUrl ?? true,
		allowedMimes: normalizeMimeList(config?.allowedMimes, DEFAULT_INPUT_FILE_MIMES),
		maxBytes: config?.maxBytes ?? 5242880,
		maxChars: config?.maxChars ?? 6e4,
		maxRedirects: config?.maxRedirects ?? 3,
		timeoutMs: config?.timeoutMs ?? 1e4,
		pdf: {
			maxPages: config?.pdf?.maxPages ?? 4,
			maxPixels: config?.pdf?.maxPixels ?? 4e6,
			minTextChars: config?.pdf?.minTextChars ?? 200
		}
	};
}
/** Fetches an input source URL through SSRF, redirect, timeout, and byte-limit guards. */
async function fetchWithGuard(params) {
	const { response, release } = await fetchWithSsrFGuard({
		url: params.url,
		maxRedirects: params.maxRedirects,
		timeoutMs: params.timeoutMs,
		policy: params.policy,
		auditContext: params.auditContext,
		init: { headers: { "User-Agent": "OpenClaw-Gateway/1.0" } }
	});
	try {
		if (!response.ok) {
			await discardIgnoredResponseBody(response);
			throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
		}
		let contentLength;
		try {
			contentLength = parseMediaContentLength(response.headers.get("content-length"));
		} catch (err) {
			await discardIgnoredResponseBody(response);
			throw err;
		}
		if (contentLength !== null && contentLength > params.maxBytes) {
			await discardIgnoredResponseBody(response);
			throw new Error(`Content too large: ${contentLength} bytes (limit: ${params.maxBytes} bytes)`);
		}
		const buffer = await readResponseWithLimit(response, params.maxBytes);
		const contentType = response.headers.get("content-type") || void 0;
		return {
			buffer,
			mimeType: parseContentType(contentType).mimeType ?? "application/octet-stream",
			contentType
		};
	} finally {
		await release();
	}
}
async function discardIgnoredResponseBody(response) {
	const body = response.body;
	if (!body) return;
	try {
		await body.cancel();
	} catch {}
}
function decodeTextContent(buffer, charset) {
	const encoding = normalizeOptionalLowercaseString(charset) || "utf-8";
	try {
		return new TextDecoder(encoding).decode(buffer);
	} catch {
		return new TextDecoder("utf-8").decode(buffer);
	}
}
function clampText(text, maxChars) {
	if (text.length <= maxChars) return text;
	return text.slice(0, maxChars);
}
async function normalizeInputImage(params) {
	const declaredMime = normalizeMimeType(params.mimeType) ?? "application/octet-stream";
	const detectedMime = normalizeMimeType(await detectMime({
		buffer: params.buffer,
		headerMime: params.mimeType
	}));
	if (declaredMime.startsWith("image/") && detectedMime && !detectedMime.startsWith("image/")) throw new Error(`Unsupported image MIME type: ${detectedMime}`);
	const sourceMime = detectedMime && HEIC_INPUT_IMAGE_MIMES.has(detectedMime) || HEIC_INPUT_IMAGE_MIMES.has(declaredMime) && !detectedMime ? detectedMime ?? declaredMime : declaredMime;
	if (!params.limits.allowedMimes.has(sourceMime)) throw new Error(`Unsupported image MIME type: ${sourceMime}`);
	if (!HEIC_INPUT_IMAGE_MIMES.has(sourceMime)) return {
		type: "image",
		data: params.buffer.toString("base64"),
		mimeType: sourceMime
	};
	const normalizedBuffer = await convertHeicToJpeg(params.buffer);
	if (normalizedBuffer.byteLength > params.limits.maxBytes) throw new Error(`Image too large after HEIC conversion: ${normalizedBuffer.byteLength} bytes (limit: ${params.limits.maxBytes} bytes)`);
	return {
		type: "image",
		data: normalizedBuffer.toString("base64"),
		mimeType: NORMALIZED_INPUT_IMAGE_MIME
	};
}
async function resolveInputFileMime(params) {
	const sniffedMime = normalizeMimeType(await detectMime({ buffer: params.buffer }));
	if (!sniffedMime) return params.declaredMime;
	if (sniffedMime === "application/octet-stream") return params.declaredMime ?? sniffedMime;
	return sniffedMime;
}
/** Extracts and normalizes an input_image source from base64 or guarded URL input. */
async function extractImageContentFromSource(source, limits) {
	if (source.type === "base64") {
		rejectOversizedBase64Payload({
			data: source.data,
			maxBytes: limits.maxBytes,
			label: "Image"
		});
		const canonicalData = canonicalizeBase64(source.data);
		if (!canonicalData) throw new Error("input_image base64 source has invalid 'data' field");
		const buffer = Buffer.from(canonicalData, "base64");
		if (buffer.byteLength > limits.maxBytes) throw new Error(`Image too large: ${buffer.byteLength} bytes (limit: ${limits.maxBytes} bytes)`);
		return await normalizeInputImage({
			buffer,
			mimeType: normalizeMimeType(source.mediaType) ?? "image/png",
			limits
		});
	}
	if (source.type === "url") {
		if (!limits.allowUrl) throw new Error("input_image URL sources are disabled by config");
		const result = await fetchWithGuard({
			url: source.url,
			maxBytes: limits.maxBytes,
			timeoutMs: limits.timeoutMs,
			maxRedirects: limits.maxRedirects,
			policy: {
				allowPrivateNetwork: false,
				hostnameAllowlist: limits.urlAllowlist
			},
			auditContext: "openresponses.input_image"
		});
		return await normalizeInputImage({
			buffer: result.buffer,
			mimeType: result.mimeType,
			limits
		});
	}
	throw new Error(`Unsupported input_image source type: ${source.type}`);
}
/** Extracts model-visible text and images from an input_file source after MIME validation. */
async function extractFileContentFromSource(params) {
	const { source, limits } = params;
	const filename = source.filename || "file";
	let buffer;
	let mimeType;
	let charset;
	if (source.type === "base64") {
		rejectOversizedBase64Payload({
			data: source.data,
			maxBytes: limits.maxBytes,
			label: "File"
		});
		const canonicalData = canonicalizeBase64(source.data);
		if (!canonicalData) throw new Error("input_file base64 source has invalid 'data' field");
		const parsed = parseContentType(source.mediaType);
		mimeType = parsed.mimeType;
		charset = parsed.charset;
		buffer = Buffer.from(canonicalData, "base64");
	} else {
		if (!limits.allowUrl) throw new Error("input_file URL sources are disabled by config");
		const result = await fetchWithGuard({
			url: source.url,
			maxBytes: limits.maxBytes,
			timeoutMs: limits.timeoutMs,
			maxRedirects: limits.maxRedirects,
			policy: {
				allowPrivateNetwork: false,
				hostnameAllowlist: limits.urlAllowlist
			},
			auditContext: "openresponses.input_file"
		});
		const parsed = parseContentType(result.contentType);
		mimeType = parsed.mimeType ?? normalizeMimeType(result.mimeType);
		charset = parsed.charset;
		buffer = result.buffer;
	}
	if (buffer.byteLength > limits.maxBytes) throw new Error(`File too large: ${buffer.byteLength} bytes (limit: ${limits.maxBytes} bytes)`);
	mimeType = await resolveInputFileMime({
		buffer,
		declaredMime: mimeType
	});
	if (!mimeType) throw new Error("input_file missing media type");
	if (!limits.allowedMimes.has(mimeType)) throw new Error(`Unsupported file MIME type: ${mimeType}`);
	if (mimeType === "application/pdf") {
		const extracted = await extractPdfContent({
			buffer,
			maxPages: limits.pdf.maxPages,
			maxPixels: limits.pdf.maxPixels,
			minTextChars: limits.pdf.minTextChars,
			...params.config ? { config: params.config } : {},
			onImageExtractionError: (err) => {
				logWarn(`media: PDF image extraction skipped, ${String(err)}`);
			}
		});
		return {
			filename,
			text: extracted.text ? clampText(extracted.text, limits.maxChars) : "",
			images: extracted.images.length > 0 ? extracted.images : void 0
		};
	}
	return {
		filename,
		text: clampText(decodeTextContent(buffer, charset), limits.maxChars)
	};
}
//#endregion
//#region src/media-understanding/image-input-normalize.ts
const HEIC_MIME_RE = /^image\/hei[cf]$/i;
const HEIC_EXT_RE = /\.(heic|heif)$/i;
function isHeicInput(params) {
	const mime = normalizeMimeType(params.mime);
	if (mime && HEIC_MIME_RE.test(mime)) return true;
	const fileName = params.fileName?.trim();
	return Boolean(fileName && HEIC_EXT_RE.test(fileName));
}
/** Normalizes image bytes before provider execution, converting HEIC/HEIF inputs to JPEG. */
async function normalizeImageDescriptionInput(params) {
	if (!isHeicInput(params)) return {
		buffer: params.buffer,
		mime: params.mime
	};
	const sourceMime = normalizeMimeType(params.mime) ?? "image/heic";
	const image = await extractImageContentFromSource({
		type: "base64",
		data: params.buffer.toString("base64"),
		mediaType: sourceMime
	}, {
		allowUrl: false,
		allowedMimes: new Set([
			sourceMime.toLowerCase(),
			"image/heic",
			"image/heif",
			"image/jpeg"
		]),
		maxBytes: params.maxBytes ?? DEFAULT_MAX_BYTES.image,
		maxRedirects: 0,
		timeoutMs: 0
	});
	return {
		buffer: Buffer.from(image.data, "base64"),
		mime: image.mimeType
	};
}
//#endregion
//#region src/media-understanding/runner.entries.ts
let cachedModelAuth = null;
async function loadModelAuth() {
	cachedModelAuth ??= await import("./model-auth-BiBudBmg.js");
	return cachedModelAuth;
}
function resolveLiteralProviderApiKey(params) {
	return normalizeNullableString(params.cfg.models?.providers?.[params.providerId]?.apiKey);
}
function sanitizeProviderHeaders(headers) {
	if (!headers) return;
	const next = {};
	for (const [key, value] of Object.entries(headers)) {
		if (typeof value !== "string") continue;
		next[key] = value;
	}
	return Object.keys(next).length > 0 ? next : void 0;
}
function trimOutput(text, maxChars) {
	const trimmed = text.trim();
	if (!maxChars || trimmed.length <= maxChars) return trimmed;
	return trimmed.slice(0, maxChars).trim();
}
function extractSherpaOnnxText(raw) {
	const noMatch = {
		matched: false,
		text: ""
	};
	const tryParse = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return noMatch;
		const head = trimmed[0];
		if (head !== "{" && head !== "\"") return noMatch;
		try {
			const parsed = JSON.parse(trimmed);
			if (typeof parsed === "string") return tryParse(parsed);
			if (parsed && typeof parsed === "object") {
				const text = parsed.text;
				if (typeof text === "string") return {
					matched: true,
					text: text.trim()
				};
			}
		} catch {}
		return noMatch;
	};
	const direct = tryParse(raw);
	if (direct.matched) return direct;
	const lines = normalizeStringEntries(raw.split("\n"));
	for (let i = lines.length - 1; i >= 0; i -= 1) {
		const parsed = tryParse(lines[i] ?? "");
		if (parsed.matched) return parsed;
	}
	return noMatch;
}
function commandBase(command) {
	return path.parse(command).name;
}
function isAntigravityCliCommand(command) {
	const commandId = commandBase(command);
	return commandId === "agy" || commandId === "antigravity";
}
function findArgValue(args, keys) {
	for (let i = 0; i < args.length; i += 1) if (keys.includes(args[i] ?? "")) {
		const value = args[i + 1];
		if (value) return value;
	}
}
function hasArg(args, keys) {
	return args.some((arg) => keys.includes(arg));
}
function resolveWhisperOutputPath(args, mediaPath) {
	const outputDir = findArgValue(args, ["--output_dir", "-o"]);
	const outputFormat = findArgValue(args, ["--output_format"]);
	if (!outputDir || !outputFormat) return null;
	if (!outputFormat.split(",").map((value) => value.trim()).includes("txt")) return null;
	const base = path.parse(mediaPath).name;
	return path.join(outputDir, `${base}.txt`);
}
function resolveWhisperCppOutputPath(args) {
	if (!hasArg(args, ["-otxt", "--output-txt"])) return null;
	const outputBase = findArgValue(args, ["-of", "--output-file"]);
	if (!outputBase) return null;
	return `${outputBase}.txt`;
}
function resolveParakeetOutputPath(args, mediaPath) {
	const outputDir = findArgValue(args, ["--output-dir"]);
	const outputFormat = findArgValue(args, ["--output-format"]);
	if (!outputDir) return null;
	if (outputFormat && outputFormat !== "txt") return null;
	const base = path.parse(mediaPath).name;
	return path.join(outputDir, `${base}.txt`);
}
async function resolveCliOutput(params) {
	const commandId = commandBase(params.command);
	const fileOutput = commandId === "whisper-cli" ? resolveWhisperCppOutputPath(params.args) : commandId === "whisper" ? resolveWhisperOutputPath(params.args, params.mediaPath) : commandId === "parakeet-mlx" ? resolveParakeetOutputPath(params.args, params.mediaPath) : null;
	if (fileOutput && await fileExists(fileOutput)) try {
		const content = await fs$1.readFile(fileOutput, "utf8");
		if (content.trim()) return content.trim();
	} catch {}
	if (commandId === "gemini") {
		const response = extractGeminiResponse(params.stdout);
		if (response) return response;
	}
	if (commandId === "sherpa-onnx-offline") {
		const response = extractSherpaOnnxText(params.stdout);
		if (response.matched) return response.text;
	}
	return params.stdout.trim();
}
async function resolveCliMediaPath(params) {
	const commandId = commandBase(params.command);
	if (params.capability !== "audio" || commandId !== "whisper-cli") return params.mediaPath;
	if (normalizeLowercaseStringOrEmpty(path.extname(params.mediaPath)) === ".wav") return params.mediaPath;
	const wavPath = path.join(params.outputDir, `${path.parse(params.mediaPath).name}.wav`);
	await fs$1.mkdir(params.outputDir, { recursive: true });
	await writeExternalFileWithinRoot({
		rootDir: params.outputDir,
		path: path.basename(wavPath),
		write: async (outputPath) => {
			await runFfmpeg([
				"-y",
				"-i",
				params.mediaPath,
				"-ac",
				"1",
				"-ar",
				"16000",
				"-c:a",
				"pcm_s16le",
				"-f",
				"wav",
				outputPath
			]);
		}
	});
	return wavPath;
}
function normalizeProviderQuery(options) {
	if (!options) return;
	const query = {};
	for (const [key, value] of Object.entries(options)) {
		if (value === void 0) continue;
		query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : void 0;
}
function buildDeepgramCompatQuery(options) {
	if (!options) return;
	const query = {};
	if (typeof options.detectLanguage === "boolean") query.detect_language = options.detectLanguage;
	if (typeof options.punctuate === "boolean") query.punctuate = options.punctuate;
	if (typeof options.smartFormat === "boolean") query.smart_format = options.smartFormat;
	return Object.keys(query).length > 0 ? query : void 0;
}
function normalizeDeepgramQueryKeys(query) {
	const normalized = { ...query };
	if ("detectLanguage" in normalized) {
		normalized.detect_language = normalized.detectLanguage;
		delete normalized.detectLanguage;
	}
	if ("smartFormat" in normalized) {
		normalized.smart_format = normalized.smartFormat;
		delete normalized.smartFormat;
	}
	return normalized;
}
function resolveProviderQuery(params) {
	const { providerId, config, entry } = params;
	const mergedOptions = normalizeProviderQuery({
		...config?.providerOptions?.[providerId],
		...entry.providerOptions?.[providerId]
	});
	if (providerId !== "deepgram") return mergedOptions;
	const query = normalizeDeepgramQueryKeys(mergedOptions ?? {});
	const compat = buildDeepgramCompatQuery({
		...config?.deepgram,
		...entry.deepgram
	});
	for (const [key, value] of Object.entries(compat ?? {})) if (query[key] === void 0) query[key] = value;
	return Object.keys(query).length > 0 ? query : void 0;
}
/** Builds the normalized decision record for one provider or CLI model attempt. */
function buildModelDecision(params) {
	if (params.entryType === "cli") {
		const command = params.entry.command?.trim();
		return {
			type: "cli",
			provider: command ?? "cli",
			model: params.entry.model ?? command,
			outcome: params.outcome,
			reason: params.reason
		};
	}
	const providerIdRaw = params.entry.provider?.trim();
	return {
		type: "provider",
		provider: (providerIdRaw ? normalizeMediaProviderId(providerIdRaw) : void 0) ?? providerIdRaw,
		model: params.entry.model,
		outcome: params.outcome,
		reason: params.reason
	};
}
function resolveEntryRunOptions(params) {
	const { capability, entry, cfg } = params;
	const maxBytes = resolveMaxBytes({
		capability,
		entry,
		cfg,
		config: params.config
	});
	const maxChars = resolveMaxChars({
		capability,
		entry,
		cfg,
		config: params.config
	});
	return {
		maxBytes,
		maxChars,
		timeoutMs: resolveTimeoutMs(entry.timeoutSeconds ?? params.config?.timeoutSeconds ?? cfg.tools?.media?.[capability]?.timeoutSeconds, DEFAULT_TIMEOUT_SECONDS[capability]),
		prompt: resolvePrompt(capability, entry.prompt ?? params.config?.prompt ?? cfg.tools?.media?.[capability]?.prompt, maxChars)
	};
}
function resolveMediaRequestOverrides(config) {
	const overrides = config ?? {};
	return {
		prompt: overrides["_requestPromptOverride"],
		language: overrides["_requestLanguageOverride"]
	};
}
function resolveProviderExecutionAuthModelApi(params) {
	return resolveOpenAiAudioAuthModelApi(params);
}
async function resolveProviderExecutionAuth(params) {
	const providerConfig = params.cfg.models?.providers?.[params.providerId];
	const modelApi = resolveProviderExecutionAuthModelApi({
		capability: params.capability,
		providerId: params.providerId
	});
	const literalApiKey = resolveLiteralProviderApiKey({
		cfg: params.cfg,
		providerId: params.providerId
	});
	if (literalApiKey) return {
		kind: "api-key",
		apiKeys: collectProviderApiKeysForExecution({
			provider: params.providerId,
			primaryApiKey: literalApiKey
		}),
		source: `models.providers.${params.providerId}.apiKey`,
		providerConfig
	};
	const resolveMediaProviderAuth = () => {
		const context = {
			config: params.cfg,
			provider: params.providerId,
			providerConfig
		};
		const providerAuth = params.provider?.resolveAuth?.(context);
		if (!providerAuth) {
			const syntheticAuth = params.provider?.resolveSyntheticAuth?.(context);
			const syntheticApiKey = syntheticAuth?.apiKey.trim();
			const syntheticSource = syntheticAuth?.source;
			return syntheticApiKey ? {
				kind: "api-key",
				apiKeys: collectProviderApiKeysForExecution({
					provider: params.providerId,
					primaryApiKey: syntheticApiKey
				}),
				source: syntheticSource,
				providerConfig
			} : void 0;
		}
		if (providerAuth.kind === "none") return {
			kind: "none",
			source: providerAuth.source,
			providerConfig
		};
		const apiKey = providerAuth.apiKey.trim();
		if (!apiKey) return;
		return {
			kind: "api-key",
			apiKeys: collectProviderApiKeysForExecution({
				provider: params.providerId,
				primaryApiKey: apiKey
			}),
			source: providerAuth.source,
			providerConfig
		};
	};
	const { isProviderAuthError, requireApiKey, resolveApiKeyForProvider } = await loadModelAuth();
	try {
		const auth = await resolveApiKeyForProvider({
			provider: params.providerId,
			cfg: params.cfg,
			profileId: params.entry.profile,
			preferredProfile: params.entry.preferredProfile,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			modelApi
		});
		const apiKey = requireApiKey(auth, params.providerId);
		return {
			kind: "api-key",
			apiKeys: collectProviderApiKeysForExecution({
				provider: params.providerId,
				primaryApiKey: apiKey
			}),
			source: auth.source,
			providerConfig
		};
	} catch (err) {
		if (!isProviderAuthError(err, "missing-provider-auth") && !isProviderAuthError(err, "missing-api-key")) throw err;
		const mediaAuth = resolveMediaProviderAuth();
		if (mediaAuth) return mediaAuth;
		throw err;
	}
}
async function resolveProviderExecutionContext(params) {
	const auth = await resolveProviderExecutionAuth({
		capability: params.capability,
		providerId: params.providerId,
		provider: params.provider,
		cfg: params.cfg,
		entry: params.entry,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	const providerConfig = auth.providerConfig;
	const baseUrl = params.entry.baseUrl ?? params.config?.baseUrl ?? providerConfig?.baseUrl;
	const mergedHeaders = {
		...sanitizeProviderHeaders(providerConfig?.headers),
		...sanitizeProviderHeaders(params.config?.headers),
		...sanitizeProviderHeaders(params.entry.headers)
	};
	return {
		auth,
		baseUrl,
		headers: Object.keys(mergedHeaders).length > 0 ? mergedHeaders : void 0,
		request: mergeModelProviderRequestOverrides(sanitizeConfiguredModelProviderRequest(providerConfig?.request), sanitizeConfiguredProviderRequest(params.config?.request), sanitizeConfiguredProviderRequest(params.entry.request))
	};
}
/** Formats a compact operator-facing summary of a media-understanding decision. */
function formatDecisionSummary(decision) {
	const attachments = Array.isArray(decision.attachments) ? decision.attachments : [];
	const total = attachments.length;
	const success = attachments.filter((entry) => entry?.chosen?.outcome === "success").length;
	const chosen = attachments.find((entry) => entry?.chosen)?.chosen;
	const provider = typeof chosen?.provider === "string" ? chosen.provider.trim() : void 0;
	const model = typeof chosen?.model === "string" ? chosen.model.trim() : void 0;
	const modelLabel = provider ? model ? `${provider}/${model}` : provider : void 0;
	const shortReason = summarizeDecisionReason(findDecisionReason(decision, decision.outcome === "failed" ? "failed" : void 0));
	const countLabel = total > 0 ? ` (${success}/${total})` : "";
	const viaLabel = modelLabel ? ` via ${modelLabel}` : "";
	const reasonLabel = shortReason ? ` reason=${shortReason}` : "";
	return `${decision.capability}: ${decision.outcome}${countLabel}${viaLabel}${reasonLabel}`;
}
/** Returns the first non-empty attempt reason, optionally filtered by outcome. */
function findDecisionReason(decision, outcome) {
	const attachments = Array.isArray(decision.attachments) ? decision.attachments : [];
	for (const attachment of attachments) {
		const attempts = Array.isArray(attachment?.attempts) ? attachment.attempts : [];
		for (const attempt of attempts) {
			if (outcome && attempt.outcome !== outcome) continue;
			if (typeof attempt.reason !== "string" || attempt.reason.trim().length === 0) continue;
			return attempt.reason;
		}
	}
}
/** Trims provider/runtime error prefixes into a stable human-readable reason. */
function normalizeDecisionReason(reason) {
	const trimmed = typeof reason === "string" ? reason.trim() : "";
	if (!trimmed) return;
	return trimmed.replace(/^Error:\s*/i, "").trim() || void 0;
}
/** Produces the short reason token used in status and decision summary output. */
function summarizeDecisionReason(reason) {
	const normalized = normalizeDecisionReason(reason);
	if (!normalized) return;
	return normalized.split(":")[0]?.trim() || void 0;
}
function assertMinAudioSize(params) {
	if (params.size >= 1024) return;
	throw new MediaUnderstandingSkipError("tooSmall", `Audio attachment ${params.attachmentIndex + 1} is too small (${params.size} bytes, minimum ${MIN_AUDIO_FILE_BYTES})`);
}
/** Executes one provider-backed media-understanding entry for one attachment. */
async function runProviderEntry(params) {
	const { entry, capability, cfg } = params;
	const providerIdRaw = entry.provider?.trim();
	if (!providerIdRaw) throw new Error(`Provider entry missing provider for ${capability}`);
	const providerId = normalizeMediaProviderId(providerIdRaw);
	const requestProviderId = normalizeMediaExecutionProviderId(providerIdRaw);
	const { maxBytes, maxChars, timeoutMs, prompt } = resolveEntryRunOptions({
		capability,
		entry,
		cfg,
		config: params.config
	});
	if (capability === "image") {
		if (!params.agentDir) throw new Error("Image understanding requires agentDir");
		const modelId = entry.model?.trim();
		if (!modelId) throw new Error("Image understanding requires model id");
		const media = await params.cache.getBuffer({
			attachmentIndex: params.attachmentIndex,
			maxBytes,
			timeoutMs
		});
		const normalizedMedia = await normalizeImageDescriptionInput({
			buffer: media.buffer,
			fileName: media.fileName,
			mime: media.mime,
			maxBytes
		});
		const requestOverrides = resolveMediaRequestOverrides(params.config);
		const provider = getMediaUnderstandingProvider(requestProviderId, params.providerRegistry);
		const imageInput = {
			buffer: normalizedMedia.buffer,
			fileName: media.fileName,
			mime: normalizedMedia.mime,
			model: modelId,
			provider: requestProviderId,
			prompt: requestOverrides.prompt ?? prompt,
			timeoutMs,
			profile: entry.profile,
			preferredProfile: entry.preferredProfile,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			cfg: params.cfg
		};
		const result = await (provider?.describeImage ?? describeImageWithModel)(imageInput);
		return {
			kind: "image.description",
			attachmentIndex: params.attachmentIndex,
			text: trimOutput(result.text, maxChars),
			provider: requestProviderId,
			model: result.model ?? modelId
		};
	}
	const provider = getMediaUnderstandingProvider(providerId, params.providerRegistry);
	if (!provider) throw new Error(`Media provider not available: ${providerId}`);
	const fetchFn = resolveProxyFetchFromEnv();
	if (capability === "audio") {
		if (!provider.transcribeAudio) throw new Error(`Audio transcription provider "${providerId}" not available.`);
		const transcribeAudio = provider.transcribeAudio;
		const requestOverrides = resolveMediaRequestOverrides(params.config);
		const media = await params.cache.getBuffer({
			attachmentIndex: params.attachmentIndex,
			maxBytes,
			timeoutMs
		});
		assertMinAudioSize({
			size: media.size,
			attachmentIndex: params.attachmentIndex
		});
		const { auth, baseUrl, headers, request } = await resolveProviderExecutionContext({
			capability,
			providerId,
			provider,
			cfg,
			entry,
			config: params.config,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		});
		const providerQuery = resolveProviderQuery({
			providerId,
			config: params.config,
			entry
		});
		const model = entry.model?.trim() || (await import("./defaults-IodENLup.js")).resolveDefaultMediaModel({
			cfg,
			providerId,
			capability: "audio",
			workspaceDir: params.workspaceDir
		}) || entry.model;
		const authSource = auth.source ?? `provider:${providerId}`;
		const buildRequest = (requestAuth) => ({
			buffer: media.buffer,
			fileName: media.fileName,
			mime: media.mime,
			apiKey: requestAuth.kind === "api-key" ? requestAuth.apiKey : CUSTOM_LOCAL_AUTH_MARKER,
			auth: requestAuth.kind === "api-key" ? {
				kind: "api-key",
				apiKey: requestAuth.apiKey,
				source: auth.source
			} : {
				kind: "none",
				source: authSource
			},
			baseUrl,
			headers,
			request,
			model,
			language: requestOverrides.language ?? entry.language ?? params.config?.language ?? cfg.tools?.media?.audio?.language,
			prompt: requestOverrides.prompt ?? prompt,
			query: providerQuery,
			timeoutMs,
			fetchFn
		});
		const result = auth.kind === "api-key" ? await executeWithApiKeyRotation({
			provider: providerId,
			apiKeys: auth.apiKeys,
			transientRetry: providerOperationRetryConfig("read"),
			execute: async (apiKey) => transcribeAudio(buildRequest({
				kind: "api-key",
				apiKey
			}))
		}) : await transcribeAudio(buildRequest({ kind: "none" }));
		return {
			kind: "audio.transcription",
			attachmentIndex: params.attachmentIndex,
			text: trimOutput(result.text, maxChars),
			provider: providerId,
			model: result.model ?? model
		};
	}
	if (!provider.describeVideo) throw new Error(`Video understanding provider "${providerId}" not available.`);
	const describeVideo = provider.describeVideo;
	const media = await params.cache.getBuffer({
		attachmentIndex: params.attachmentIndex,
		maxBytes,
		timeoutMs
	});
	const estimatedBase64Bytes = estimateBase64Size(media.size);
	const maxBase64Bytes = resolveVideoMaxBase64Bytes(maxBytes);
	if (estimatedBase64Bytes > maxBase64Bytes) throw new MediaUnderstandingSkipError("maxBytes", `Video attachment ${params.attachmentIndex + 1} base64 payload ${estimatedBase64Bytes} exceeds ${maxBase64Bytes}`);
	const { auth, baseUrl, headers, request } = await resolveProviderExecutionContext({
		capability,
		providerId,
		provider,
		cfg,
		entry,
		config: params.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	const authSource = auth.source ?? `provider:${providerId}`;
	const buildRequest = (requestAuth) => ({
		buffer: media.buffer,
		fileName: media.fileName,
		mime: media.mime,
		apiKey: requestAuth.kind === "api-key" ? requestAuth.apiKey : CUSTOM_LOCAL_AUTH_MARKER,
		auth: requestAuth.kind === "api-key" ? {
			kind: "api-key",
			apiKey: requestAuth.apiKey,
			source: auth.source
		} : {
			kind: "none",
			source: authSource
		},
		baseUrl,
		headers,
		request,
		model: entry.model,
		prompt,
		timeoutMs,
		fetchFn
	});
	const result = auth.kind === "api-key" ? await executeWithApiKeyRotation({
		provider: providerId,
		apiKeys: auth.apiKeys,
		transientRetry: providerOperationRetryConfig("read"),
		execute: (apiKey) => describeVideo(buildRequest({
			kind: "api-key",
			apiKey
		}))
	}) : await describeVideo(buildRequest({ kind: "none" }));
	return {
		kind: "video.description",
		attachmentIndex: params.attachmentIndex,
		text: trimOutput(result.text, maxChars),
		provider: providerId,
		model: result.model ?? entry.model
	};
}
/** Executes one CLI-backed media-understanding entry for one attachment. */
async function runCliEntry(params) {
	const { entry, capability, cfg, ctx } = params;
	const command = entry.command?.trim();
	const args = entry.args ?? [];
	if (!command) throw new Error(`CLI entry missing command for ${capability}`);
	const requestOverrides = resolveMediaRequestOverrides(params.config);
	const { maxBytes, maxChars, timeoutMs, prompt } = resolveEntryRunOptions({
		capability,
		entry,
		cfg,
		config: params.config
	});
	const pathResult = await params.cache.getPath({
		attachmentIndex: params.attachmentIndex,
		maxBytes,
		timeoutMs
	});
	if (capability === "audio") assertMinAudioSize({
		size: (await fs$1.stat(pathResult.path)).size,
		attachmentIndex: params.attachmentIndex
	});
	const outputDir = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-media-cli-"));
	const mediaPath = await resolveCliMediaPath({
		capability,
		command,
		mediaPath: pathResult.path,
		outputDir
	});
	const outputBase = path.join(outputDir, path.parse(mediaPath).name);
	const templCtx = {
		...ctx,
		MediaPath: mediaPath,
		MediaDir: path.dirname(mediaPath),
		OutputDir: outputDir,
		OutputBase: outputBase,
		Prompt: requestOverrides.prompt ?? prompt,
		...requestOverrides.language ? { Language: requestOverrides.language } : {},
		MaxChars: maxChars
	};
	const argv = [command, ...args].map((part, index) => index === 0 ? part : applyTemplate(part, templCtx));
	try {
		if (shouldLogVerbose()) logVerbose(`Media understanding via CLI: ${argv.join(" ")}`);
		const { stdout } = await runExec(argv[0], argv.slice(1), {
			timeoutMs,
			maxBuffer: CLI_OUTPUT_MAX_BUFFER,
			cwd: isAntigravityCliCommand(command) ? path.dirname(mediaPath) : void 0
		});
		const text = trimOutput(await resolveCliOutput({
			command,
			args: argv.slice(1),
			stdout,
			mediaPath
		}), maxChars);
		if (!text) return null;
		return {
			kind: capability === "audio" ? "audio.transcription" : `${capability}.description`,
			attachmentIndex: params.attachmentIndex,
			text,
			provider: "cli",
			model: command
		};
	} finally {
		await fs$1.rm(outputDir, {
			recursive: true,
			force: true
		}).catch(() => {});
	}
}
//#endregion
export { resolveAttachmentKind as C, normalizeAttachments as S, resolveEnabledBundledManifestContractPlugins as T, fileExists as _, runCliEntry as a, selectAttachments as b, normalizeImageDescriptionInput as c, DEFAULT_INPUT_TIMEOUT_MS as d, extractFileContentFromSource as f, resolveInputFileLimits as g, normalizeMimeType as h, normalizeDecisionReason as i, DEFAULT_INPUT_IMAGE_MAX_BYTES as l, normalizeMimeList as m, findDecisionReason as n, runProviderEntry as o, extractImageContentFromSource as p, formatDecisionSummary as r, summarizeDecisionReason as s, buildModelDecision as t, DEFAULT_INPUT_IMAGE_MIMES as u, MediaAttachmentCache as v, extractPdfContent as w, isAudioAttachment as x, isMediaUnderstandingSkipError as y };
