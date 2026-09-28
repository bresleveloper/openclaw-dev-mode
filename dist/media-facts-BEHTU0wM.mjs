import { c as asFiniteNumberInRange, d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeMimeType, i as getFileExtension, l as kindFromMime, u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
//#region src/media/media-facts.ts
const RUNTIME_PROMPT_MEDIA_FACTS = Symbol.for("openclaw.runtimePromptMediaFacts");
function normalizeNonNegativeNumber(value) {
	return asFiniteNumberInRange(value, { min: 0 });
}
/** Attaches facts to a runtime prompt message without changing serialized/model-visible bytes. */
function attachRuntimePromptMediaFacts(message, media, imageOrder) {
	const normalized = normalizeMediaFacts(media);
	if (imageOrder?.length) Object.defineProperty(normalized, "imageOrder", { value: [...imageOrder] });
	Object.defineProperty(message, RUNTIME_PROMPT_MEDIA_FACTS, {
		configurable: true,
		value: normalized
	});
	return message;
}
function readRuntimePromptMediaFacts(message) {
	const media = message[RUNTIME_PROMPT_MEDIA_FACTS];
	return Array.isArray(media) ? media : void 0;
}
/** Reads the canonical persisted media envelope without consulting legacy top-level fields. */
function readPersistedMediaFacts(message) {
	return readPersistedMediaFactInputs(message)?.map((entry, index) => normalizeMediaFact(entry, index));
}
function readPersistedMediaFactInputs(message) {
	const metadata = asNonArrayRecord(asNonArrayRecord(message)["__openclaw"]);
	return Array.isArray(metadata.media) ? metadata.media : void 0;
}
const LEGACY_MEDIA_CONTEXT_KEYS = [
	"MediaPath",
	"MediaPaths",
	"MediaUrl",
	"MediaUrls",
	"MediaType",
	"MediaTypes",
	"MediaDir",
	"MediaTranscribedIndexes",
	"MediaStaged",
	"MediaWorkspaceDir"
];
const PERSISTED_LEGACY_MEDIA_KEYS = [
	"MediaPath",
	"MediaPaths",
	"MediaUrl",
	"MediaUrls",
	"MediaType",
	"MediaTypes",
	"MediaTranscribedIndexes",
	"MediaStaged",
	"MediaWorkspaceDir"
];
/** Returns whether a top-level retired carrier contains an attachment fact worth migrating. */
function hasMeaningfulRetiredMediaCarrier(message) {
	const record = message;
	const retired = {};
	if (Array.isArray(record.media)) retired.media = record.media;
	for (const key of PERSISTED_LEGACY_MEDIA_KEYS) if (Object.hasOwn(record, key)) retired[key] = record[key];
	if (resolveMediaFacts(retired).some(isMeaningfulMediaFact)) return true;
	const canonical = readPersistedMediaFacts(message) ?? [];
	if (canonical.length === 0) return false;
	return (Array.isArray(record.MediaTranscribedIndexes) ? record.MediaTranscribedIndexes : []).some((index) => Number.isInteger(index) && index >= 0 && index < canonical.length) || Boolean(normalizeOptionalString(record.MediaWorkspaceDir)) || record.MediaStaged === true;
}
const LEGACY_MEDIA_KINDS = /* @__PURE__ */ new Set([
	"image",
	"audio",
	"video",
	"document",
	"sticker",
	"unknown"
]);
function hasAmbiguousSparseLegacyMediaAlignment(source) {
	const paths = Array.isArray(source.MediaPaths) ? source.MediaPaths : [];
	const urls = Array.isArray(source.MediaUrls) ? source.MediaUrls : [];
	const types = Array.isArray(source.MediaTypes) ? source.MediaTypes : [];
	const canonical = normalizeMediaFacts(source.media);
	const slotCount = Math.max(paths.length, urls.length);
	if (types.length === 0 || types.length >= slotCount) return false;
	return Array.from({ length: slotCount }, (_, index) => Boolean(normalizeOptionalString(paths[index]) ?? normalizeOptionalString(urls[index]))).some((meaningful, index) => {
		if (!meaningful) return false;
		const fact = canonical[index];
		const canonicalIdentity = normalizeOptionalString(fact?.path) ?? normalizeOptionalString(fact?.url);
		const canonicalClassification = normalizeOptionalString(fact?.contentType) ?? fact?.kind;
		return !canonicalIdentity || !canonicalClassification;
	});
}
function hasUnderCardinalLegacyTypes(source) {
	const paths = Array.isArray(source.MediaPaths) ? source.MediaPaths : [];
	const urls = Array.isArray(source.MediaUrls) ? source.MediaUrls : [];
	const types = Array.isArray(source.MediaTypes) ? source.MediaTypes : [];
	const slotCount = Math.max(paths.length, urls.length);
	return types.length > 0 && types.length < slotCount;
}
/** Canonicalizes persisted user-message media; ambiguous sparse legacy arrays are rejected. */
function canonicalizePersistedUserMessageMedia(message) {
	const record = message;
	const hadLegacy = PERSISTED_LEGACY_MEDIA_KEYS.some((key) => Object.hasOwn(record, key));
	const hadTopLevelMedia = Object.hasOwn(record, "media");
	const canonical = readPersistedMediaFactInputs(message);
	if (!hadLegacy && !hadTopLevelMedia && canonical === void 0) return {
		changed: false,
		hadLegacy: false,
		message
	};
	const topLevelMedia = Array.isArray(record.media) ? record.media : void 0;
	const source = {
		...record,
		media: canonical ?? topLevelMedia
	};
	const hasAmbiguousLegacyAlignment = hasAmbiguousSparseLegacyMediaAlignment(source);
	if (hadLegacy && hasAmbiguousLegacyAlignment) throw new Error("legacy media arrays have ambiguous sparse positional alignment");
	const resolvedSource = hasUnderCardinalLegacyTypes(source) && !hasAmbiguousLegacyAlignment ? {
		...source,
		MediaType: void 0,
		MediaTypes: []
	} : source;
	const resolvedMedia = resolveMediaFacts(resolvedSource);
	const stagedMedia = resolvedSource.MediaStaged === true ? resolveStagedMediaFacts(resolvedSource) : void 0;
	const legacyTypes = Array.isArray(resolvedSource.MediaTypes) ? resolvedSource.MediaTypes : [];
	const canonicalInputs = Array.isArray(resolvedSource.media) ? resolvedSource.media : [];
	const media = [];
	for (const [index, fact] of resolvedMedia.entries()) {
		const legacyType = normalizeOptionalString(legacyTypes[index] ?? (index === 0 ? resolvedSource.MediaType : void 0));
		const existing = canonicalInputs[index];
		const bareLegacyKind = legacyType && LEGACY_MEDIA_KINDS.has(legacyType) && !normalizeOptionalString(existing?.contentType) && existing?.kind === void 0;
		const explicitKind = existing?.kind ?? (bareLegacyKind ? legacyType : void 0);
		media.push({
			...fact.path ? { path: fact.path } : {},
			...fact.url ? { url: fact.url } : {},
			...fact.contentType && !bareLegacyKind ? { contentType: fact.contentType } : {},
			...explicitKind ? { kind: explicitKind } : {},
			...fact.fileName ? { fileName: fact.fileName } : {},
			...fact.origin ? { origin: fact.origin } : {},
			...fact.sizeBytes !== void 0 ? { sizeBytes: fact.sizeBytes } : {},
			...fact.durationMs ? { durationMs: fact.durationMs } : {},
			...fact.width ? { width: fact.width } : {},
			...fact.height ? { height: fact.height } : {},
			...fact.transcribed ? { transcribed: true } : {},
			...fact.messageId ? { messageId: fact.messageId } : {},
			...fact.workspaceDir ? { workspaceDir: fact.workspaceDir } : {},
			...fact.staged || stagedMedia?.[index]?.staged ? { staged: true } : {},
			...fact.hydrationSuppressed ? { hydrationSuppressed: true } : {}
		});
	}
	const next = { ...record };
	delete next.media;
	for (const key of PERSISTED_LEGACY_MEDIA_KEYS) delete next[key];
	const openclaw = { ...asNonArrayRecord(record["__openclaw"]) };
	if (media.length > 0 || canonical !== void 0 || topLevelMedia !== void 0) openclaw.media = media;
	if (Object.keys(openclaw).length > 0) next["__openclaw"] = openclaw;
	else delete next["__openclaw"];
	return {
		changed: JSON.stringify(next) !== JSON.stringify(record),
		hadLegacy,
		message: next
	};
}
function stripLegacyMediaContextFields(ctx) {
	for (const key of LEGACY_MEDIA_CONTEXT_KEYS) delete ctx[key];
}
function readRuntimePromptImageOrder(message) {
	const imageOrder = readRuntimePromptMediaFacts(message)?.imageOrder;
	return Array.isArray(imageOrder) ? imageOrder : void 0;
}
/** Returns whether a declared MIME only describes otherwise unclassified binary bytes. */
function isGenericBinaryMediaContentType(contentType) {
	const normalizedContentType = normalizeMimeType(contentType);
	return normalizedContentType === "application/octet-stream" || normalizedContentType === "binary/octet-stream";
}
/** Resolves attachment kind from authoritative facts before source or filename hints. */
function resolveMediaFactKind(fact) {
	if (fact.kind && fact.kind !== "unknown") return fact.kind;
	const normalizedContentType = normalizeMimeType(fact.contentType);
	if (normalizedContentType && !isGenericBinaryMediaContentType(normalizedContentType)) {
		const mimeKind = kindFromMime(normalizedContentType);
		if (mimeKind) return mimeKind;
		return LEGACY_MEDIA_KINDS.has(normalizedContentType) ? normalizedContentType : void 0;
	}
	const source = normalizeOptionalString(fact.path) ?? normalizeOptionalString(fact.url);
	if (!source) return;
	for (const candidate of [
		fact.path,
		fact.url,
		fact.fileName,
		source
	]) {
		const inferredMime = mimeTypeFromFilePath(candidate);
		if (inferredMime !== void 0) return inferredMime === "image/svg+xml" ? void 0 : kindFromMime(inferredMime);
		const extension = getFileExtension(candidate);
		if (extension === ".tif" || extension === ".tiff") return "image";
	}
}
/** Returns whether a fact can produce native image input. */
function isImageMediaFact(fact) {
	const kind = resolveMediaFactKind(fact);
	return kind === "image" || kind === "sticker";
}
/** Returns whether a fact can produce native video input. */
function isVideoMediaFact(fact) {
	return resolveMediaFactKind(fact) === "video";
}
function normalizeMediaFact(media, index, defaults = {}) {
	const input = asNonArrayRecord(media);
	const workspaceDir = normalizeOptionalString(input.workspaceDir) ?? defaults.workspaceDir;
	const contentType = normalizeOptionalString(input.contentType);
	const durationMs = asPositiveSafeInteger(input.durationMs);
	const width = asPositiveSafeInteger(input.width);
	const height = asPositiveSafeInteger(input.height);
	return {
		path: normalizeOptionalString(input.path),
		url: normalizeOptionalString(input.url),
		contentType,
		kind: input.kind ?? defaults.kind ?? (isGenericBinaryMediaContentType(contentType) ? void 0 : kindFromMime(contentType)),
		fileName: normalizeOptionalString(input.fileName),
		...input.origin === "paste" || input.origin === "file" ? { origin: input.origin } : {},
		sizeBytes: normalizeNonNegativeNumber(input.sizeBytes),
		...durationMs ? { durationMs } : {},
		...width ? { width } : {},
		...height ? { height } : {},
		transcribed: input.transcribed === true || defaults.transcribed?.(input, index) === true,
		messageId: normalizeOptionalString(input.messageId) ?? defaults.messageId,
		...workspaceDir ? { workspaceDir } : {},
		...input.staged === true ? { staged: true } : {},
		...input.hydrationSuppressed === true ? { hydrationSuppressed: true } : {}
	};
}
/** True when every path-bearing canonical fact has explicit staging proof. */
function hasStagedMediaFacts(media) {
	const stageable = normalizeMediaFacts(media).filter((fact) => Boolean(normalizeOptionalString(fact.path)));
	return stageable.length > 0 && stageable.every((fact) => Boolean(normalizeOptionalString(fact.workspaceDir)) || fact.staged === true);
}
function normalizeMediaFacts(media, defaults = {}) {
	return Array.isArray(media) ? media.map((entry, index) => normalizeMediaFact(entry, index, defaults)) : [];
}
function isMeaningfulMediaFact(fact) {
	return Boolean(fact.path?.trim() || fact.url?.trim() || fact.contentType || fact.kind && fact.kind !== "unknown");
}
function resolveMediaFactsWithPrecedence(source, legacyProjectionWins) {
	const canonical = normalizeMediaFacts(source.media);
	const paths = Array.isArray(source.MediaPaths) ? source.MediaPaths : [];
	const urls = Array.isArray(source.MediaUrls) ? source.MediaUrls : [];
	const types = Array.isArray(source.MediaTypes) ? source.MediaTypes : [];
	const count = Math.max(canonical.length, paths.length, urls.length, types.length, source.MediaPath || source.MediaUrl || source.MediaType ? 1 : 0);
	const transcribed = new Set(source.MediaTranscribedIndexes ?? []);
	const legacyHasPath = Boolean(normalizeOptionalString(source.MediaPath)) || paths.some((value) => Boolean(normalizeOptionalString(value)));
	return Array.from({ length: count }, (_, index) => {
		const fact = canonical[index];
		const legacyPath = paths[index] ?? (index === 0 ? source.MediaPath : void 0);
		const legacyUrl = urls[index] ?? (paths.length > 0 || index === 0 ? source.MediaUrl : void 0);
		const legacyContentType = normalizeOptionalString(types[index]) ?? (index === 0 ? source.MediaType : void 0);
		return normalizeMediaFact({
			path: legacyProjectionWins ? normalizeOptionalString(legacyPath) ?? fact?.path : fact?.path ?? legacyPath,
			url: legacyProjectionWins ? normalizeOptionalString(legacyUrl) ?? fact?.url : fact?.url ?? legacyUrl,
			contentType: legacyProjectionWins ? legacyContentType ?? fact?.contentType : fact?.contentType ?? legacyContentType,
			kind: fact?.kind,
			fileName: fact?.fileName,
			origin: fact?.origin,
			sizeBytes: fact?.sizeBytes,
			durationMs: fact?.durationMs,
			width: fact?.width,
			height: fact?.height,
			transcribed: legacyProjectionWins ? fact ? fact.transcribed === true : transcribed.has(index) : fact?.transcribed === true || transcribed.has(index),
			messageId: fact?.messageId,
			workspaceDir: normalizeOptionalString(fact?.workspaceDir) ?? normalizeOptionalString(source.MediaWorkspaceDir),
			staged: fact?.staged === true || legacyProjectionWins && source.MediaStaged === true && (!legacyHasPath || Boolean(normalizeOptionalString(legacyPath))),
			hydrationSuppressed: fact?.hydrationSuppressed
		}, index);
	});
}
/** Normalizes canonical facts or, for compatibility callers, legacy parallel fields. */
function resolveMediaFacts(source) {
	return resolveMediaFactsWithPrecedence(source, false);
}
/** Adopts staged legacy paths positionally while retaining canonical fact metadata and count. */
function resolveStagedMediaFacts(source) {
	return resolveMediaFactsWithPrecedence(source, true);
}
function projectStrings(values, compact, preserveEmptyLists) {
	const projected = compact ? values.filter((value) => Boolean(value)) : values.map((value) => value ?? "");
	if (projected.length === 0 || !preserveEmptyLists && !projected.some(Boolean)) return;
	return projected;
}
function projectMediaFacts(media, mode = "channel") {
	const entries = Array.isArray(media) ? media : [];
	const preserveEmptyLists = mode !== "channel";
	const mediaUrl = (entry) => (mode === "channel" ? entry.url ?? entry.path : entry.path) ?? void 0;
	const mediaType = (entry) => entry.contentType ?? (mode === "channel" ? entry.kind : void 0) ?? void 0;
	const transcribedIndexes = entries.flatMap((entry, index) => entry.transcribed ? [index] : []);
	return {
		MediaPath: entries[0]?.path ?? void 0,
		MediaUrl: entries[0] ? mediaUrl(entries[0]) : void 0,
		MediaType: entries[0] ? mediaType(entries[0]) : void 0,
		MediaPaths: projectStrings(entries.map((entry) => entry.path), false, preserveEmptyLists),
		MediaUrls: projectStrings(entries.map(mediaUrl), false, preserveEmptyLists),
		MediaTypes: projectStrings(entries.map(mediaType), mode === "compact", preserveEmptyLists),
		...mode !== "channel" ? {} : { MediaTranscribedIndexes: transcribedIndexes.length > 0 ? transcribedIndexes : void 0 }
	};
}
//#endregion
export { stripLegacyMediaContextFields as _, hasStagedMediaFacts as a, isVideoMediaFact as c, readPersistedMediaFacts as d, readRuntimePromptImageOrder as f, resolveStagedMediaFacts as g, resolveMediaFacts as h, hasMeaningfulRetiredMediaCarrier as i, normalizeMediaFacts as l, resolveMediaFactKind as m, attachRuntimePromptMediaFacts as n, isImageMediaFact as o, readRuntimePromptMediaFacts as p, canonicalizePersistedUserMessageMedia as r, isMeaningfulMediaFact as s, PERSISTED_LEGACY_MEDIA_KEYS as t, projectMediaFacts as u };
