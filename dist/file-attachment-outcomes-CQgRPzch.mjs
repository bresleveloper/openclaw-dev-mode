import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as wrapExternalContent } from "./external-content-Bkm4w5qo.mjs";
import { n as escapeXml } from "./xml-mfWEXuUN.mjs";
import { t as renderDocumentTruncationNotice } from "./document-extraction-metadata-dXxmZ0ie.mjs";
import { sanitizeUntrustedFileName } from "@openclaw/fs-safe/advanced";
//#region src/media/file-context.ts
function escapeFileBlockContent(value) {
	return value.replace(/<\s*\/\s*file\s*>/gi, "&lt;/file&gt;").replace(/<\s*file\b/gi, "&lt;file");
}
function sanitizeFileName(value, fallbackName) {
	const normalized = normalizeOptionalString(typeof value === "string" ? value.replace(/[\r\n\t]+/g, " ") : void 0) ?? "";
	return sanitizeUntrustedFileName(normalized, fallbackName);
}
/** Renders sanitized attachment text as a model-visible file block without allowing file-tag injection. */
function renderFileContextBlock(params) {
	const fallbackName = normalizeOptionalString(params.fallbackName) ?? "attachment";
	const safeName = sanitizeFileName(params.filename, fallbackName);
	const safeContent = escapeFileBlockContent(params.content);
	const mimeType = normalizeOptionalString(params.mimeType);
	const attrs = [`name="${escapeXml(safeName)}"`, mimeType ? `mime="${escapeXml(mimeType)}"` : void 0].filter(Boolean).join(" ");
	if (params.surroundContentWithNewlines === false) return `<file ${attrs}>${safeContent}</file>`;
	return `<file ${attrs}>\n${safeContent}\n</file>`;
}
//#endregion
//#region src/media-understanding/file-attachment-outcomes.ts
const MIME_TYPE = String.raw`([a-z0-9!#$&^_.+-]+/[a-z0-9!#$&^_.+-]+)`;
const HTTP_TOKEN = String.raw`[a-z0-9!#$%&'*+.^_\x60|~-]+`;
const HTTP_QUOTED_STRING = String.raw`"(?:[\t !#-\[\]-~]|\\[\t -~])*"`;
const MIME_PARAMETER = String.raw`[ \t]*;[ \t]*${HTTP_TOKEN}=(?:${HTTP_TOKEN}|${HTTP_QUOTED_STRING})`;
const MIME_TYPE_WITH_OPTIONAL_PARAMS = new RegExp(String.raw`^${MIME_TYPE}(?:${MIME_PARAMETER})*$`, "i");
const MARKER_MIME_MAX_CHARS = 100;
function sanitizeMimeType(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return trimmed.match(MIME_TYPE_WITH_OPTIONAL_PARAMS)?.[1]?.toLowerCase();
}
function markerSafeMime(value) {
	const mime = sanitizeMimeType(value);
	return mime && mime.length <= MARKER_MIME_MAX_CHARS ? mime : void 0;
}
function resolveFileExtractionOutcome(extraction) {
	const text = extraction.text ?? "";
	const images = extraction.images ?? [];
	const metadata = extraction.metadata ? { metadata: extraction.metadata } : {};
	if (text.trim() || extraction.metadata?.textTruncated) return {
		kind: "extracted",
		text,
		images,
		...metadata
	};
	return images.length > 0 ? {
		kind: "rendered-to-images",
		images,
		...metadata
	} : {
		kind: "no-extractable-text",
		...metadata
	};
}
function wrapUntrustedAttachmentContent(content) {
	return wrapExternalContent(content, {
		source: "unknown",
		includeWarning: false
	});
}
const MARKER_LOCAL_PATH_MAX_CHARS = 300;
const POSIX_ABSOLUTE_PATH = /^\//;
const WINDOWS_ABSOLUTE_PATH = /^[A-Za-z]:\\/;
const MARKER_PATH_SAFE = /^[\p{L}\p{M}\p{N} /\\:._-]+$/u;
function markerSafeLocalPath(value, allowWorkspaceRelative = false) {
	if (!value || value.length > MARKER_LOCAL_PATH_MAX_CHARS) return;
	if (!(POSIX_ABSOLUTE_PATH.test(value) || WINDOWS_ABSOLUTE_PATH.test(value)) && (!allowWorkspaceRelative || value.includes("\\") || value.split("/").some((segment) => !segment || segment === "." || segment === ".."))) return;
	return MARKER_PATH_SAFE.test(value) ? value : void 0;
}
const SKIPPED_FILE_OUTCOME_KINDS = /* @__PURE__ */ new Set([
	"unsupported-format",
	"policy-rejected",
	"read-failure",
	"url-sources-disabled"
]);
function isSkippedFileOutcome(outcome) {
	return SKIPPED_FILE_OUTCOME_KINDS.has(outcome.kind);
}
function renderFileAttachmentOutcome(outcome, options) {
	switch (outcome.kind) {
		case "extracted": return [renderDocumentTruncationNotice(outcome.metadata), wrapUntrustedAttachmentContent(outcome.text)].filter(Boolean).join("\n");
		case "rendered-to-images": return [renderDocumentTruncationNotice(outcome.metadata), "[PDF content rendered to images]"].filter(Boolean).join("\n");
		case "no-extractable-text": return [renderDocumentTruncationNotice(outcome.metadata), "[No extractable text]"].filter(Boolean).join("\n");
		case "unsupported-format": {
			const mime = markerSafeMime(outcome.mime);
			const formatClause = mime ? `Unsupported document format: ${mime}.` : "Unsupported document format.";
			const localPath = markerSafeLocalPath(options?.selfServeLocalPath === false ? void 0 : options?.selfServeLocalPath ?? outcome.localPath, typeof options?.selfServeLocalPath === "string");
			const formatHint = outcome.mime?.startsWith("application/vnd.openxmlformats-officedocument") ? " (this Office file is a zip archive containing XML)" : "";
			return localPath ? [`[${formatClause} The approved local file path follows as external attachment metadata. Its text is not extracted automatically. Read the file yourself with your tools before answering${formatHint}; do not ask the user to paste the contents.]`, wrapUntrustedAttachmentContent(localPath)].join("") : `[${formatClause} PDF and plain-text attachments can be read.]`;
		}
		case "policy-rejected": {
			const mime = markerSafeMime(outcome.mime);
			return mime ? `[Attachment type not allowed: ${mime}]` : "[Attachment type not allowed]";
		}
		case "read-failure": return "[Attachment could not be read]";
		case "url-sources-disabled": return "[Attachment skipped: URL file sources are disabled]";
		case "claimed-elsewhere": return null;
		default: return outcome;
	}
}
//#endregion
export { renderFileContextBlock as a, sanitizeMimeType as i, renderFileAttachmentOutcome as n, resolveFileExtractionOutcome as r, isSkippedFileOutcome as t };
