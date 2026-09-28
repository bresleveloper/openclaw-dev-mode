import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { o as isAudioFileName } from "./mime-1zBUMwu6.mjs";
import { l as normalizeMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { s as getMediaDir } from "./store-BrX2xbJz.mjs";
import path from "node:path";
//#region src/auto-reply/media-note.ts
/** Builds compact prompt notes for inbound media attachments. */
function stripDarwinPrivatePrefix(value) {
	return value.startsWith("/private/var/") ? value.slice(8) : value;
}
function normalizeManagedInboundMediaRef(value) {
	if (!path.isAbsolute(value)) return value;
	const mediaDir = stripDarwinPrivatePrefix(path.resolve(getMediaDir()));
	const candidate = stripDarwinPrivatePrefix(path.resolve(value));
	const inboundDir = path.join(mediaDir, "inbound");
	const relativeToInbound = path.relative(inboundDir, candidate);
	if (!relativeToInbound || relativeToInbound.startsWith("..") || path.isAbsolute(relativeToInbound)) return value;
	return `media://inbound/${path.basename(candidate)}`;
}
function sanitizeInlineMediaNoteValue(value) {
	const trimmed = value?.trim();
	if (!trimmed) return "";
	return normalizeManagedInboundMediaRef(trimmed).replace(/[\p{Cc}\]]+/gu, " ").replace(/\s+/g, " ").trim();
}
function formatMediaAttachedLine(params) {
	const prefix = typeof params.index === "number" && typeof params.total === "number" ? `[media attached ${params.index}/${params.total}: ` : "[media attached: ";
	const pathValue = sanitizeInlineMediaNoteValue(params.fact.path);
	const typeRaw = sanitizeInlineMediaNoteValue(params.fact.contentType ?? params.fact.kind);
	const typePart = typeRaw ? ` (${typeRaw})` : "";
	const urlRaw = sanitizeInlineMediaNoteValue(params.fact.url);
	const urlPart = urlRaw && urlRaw !== pathValue ? ` | ${urlRaw}` : "";
	const fileName = truncateUtf16Safe(sanitizeInlineMediaNoteValue(basenameFromAnyPath(params.fact.fileName ?? "")), 256);
	return `${prefix}${pathValue}${typePart}${urlPart}${fileName ? ` ${JSON.stringify(fileName)}` : ""}]`;
}
const AUDIO_EXTENSIONS_WITHOUT_CANONICAL_MIME = [
	".webm",
	".wma",
	".alac"
];
function isAudioPath(pathLocal) {
	if (!pathLocal) return false;
	if (isAudioFileName(pathLocal)) return true;
	const lower = normalizeLowercaseStringOrEmpty(pathLocal);
	return AUDIO_EXTENSIONS_WITHOUT_CANONICAL_MIME.some((extension) => lower.endsWith(extension));
}
function isValidAttachmentIndex(index, attachmentCount) {
	return Number.isSafeInteger(index) && index >= 0 && index < attachmentCount;
}
function collectTranscribedAudioAttachmentIndices(ctx, attachmentCount) {
	const transcribedAudioIndices = /* @__PURE__ */ new Set();
	if (Array.isArray(ctx.MediaUnderstanding)) {
		for (const output of ctx.MediaUnderstanding) if (output.kind === "audio.transcription" && isValidAttachmentIndex(output.attachmentIndex, attachmentCount)) transcribedAudioIndices.add(output.attachmentIndex);
	}
	if (Array.isArray(ctx.MediaUnderstandingDecisions)) for (const decision of ctx.MediaUnderstandingDecisions) {
		if (decision.capability !== "audio" || decision.outcome !== "success") continue;
		for (const attachment of decision.attachments) if (attachment.chosen?.outcome === "success" && isValidAttachmentIndex(attachment.attachmentIndex, attachmentCount)) transcribedAudioIndices.add(attachment.attachmentIndex);
	}
	return transcribedAudioIndices;
}
function collectDescribedImageAttachmentIndices(ctx) {
	return new Set(ctx.MediaUnderstanding?.flatMap((output) => output.kind === "image.description" ? [output.attachmentIndex] : []) ?? []);
}
/** Formats prompt-visible attachment text and retains facts that still need native hydration. */
function buildInboundMediaNoteProjection(ctx) {
	const facts = normalizeMediaFacts(ctx.media);
	const entries = facts.flatMap((fact, index) => {
		const mediaPath = fact.path?.trim() ?? "";
		return mediaPath || fact.url?.trim() ? [{
			fact,
			path: mediaPath,
			index
		}] : [];
	});
	if (entries.length === 0) return {
		media: [],
		mediaIndexes: []
	};
	const transcribedAudioIndices = collectTranscribedAudioAttachmentIndices(ctx, facts.length);
	const canStripSingleAttachmentByTranscript = Boolean(ctx.Transcript?.trim()) && facts.length === 1;
	const visibleEntries = entries.filter((entry) => {
		const normalizedType = normalizeLowercaseStringOrEmpty(entry.fact.contentType ?? entry.fact.kind);
		const isAudioByMime = normalizedType === "audio" || normalizedType.startsWith("audio/");
		if (!(entry.fact.kind === "audio" || isAudioPath(entry.path) || isAudioByMime)) return true;
		if (entry.fact.transcribed === true || transcribedAudioIndices.has(entry.index) || canStripSingleAttachmentByTranscript && entry.index === 0) return false;
		return true;
	});
	if (visibleEntries.length === 0) return {
		media: [],
		mediaIndexes: []
	};
	const describedImageIndices = collectDescribedImageAttachmentIndices(ctx);
	const media = visibleEntries.map((entry) => ({
		...entry.fact,
		...describedImageIndices.has(entry.index) ? { hydrationSuppressed: true } : {}
	}));
	const mediaIndexes = visibleEntries.map((entry) => entry.index);
	const firstVisibleEntry = visibleEntries[0];
	if (visibleEntries.length === 1 && firstVisibleEntry) return {
		text: formatMediaAttachedLine({ fact: firstVisibleEntry.fact }),
		media,
		mediaIndexes
	};
	const count = visibleEntries.length;
	const lines = [`[media attached: ${count} files]`];
	for (const [idx, entry] of visibleEntries.entries()) lines.push(formatMediaAttachedLine({
		fact: entry.fact,
		index: idx + 1,
		total: count
	}));
	return {
		text: lines.join("\n"),
		media,
		mediaIndexes
	};
}
//#endregion
export { buildInboundMediaNoteProjection as t };
