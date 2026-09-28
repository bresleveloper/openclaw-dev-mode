import { u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-QODkv80i.mjs";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { a as wrapExternalContent } from "./external-content-CLufk6dK.mjs";
import { r as classifyMediaReferenceSource } from "./media-reference-C0dWWfb0.mjs";
import { o as resolveAttachmentKind } from "./attachments.normalize-Bc-RMc93.mjs";
import "./attachments-C_tU3ipE.mjs";
import { t as attachmentClassFromMime } from "./attachment-classify-BJQ0y7ye.mjs";
import { i as extractFileContentFromBuffer, l as resolveInputFileLimits } from "./input-files-CJ_O6M0_.mjs";
import { n as normalizeMediaAttachments, r as resolveMediaAttachmentLocalRoots, t as createMediaAttachmentCache } from "./runner.attachments-DvjOaABk.mjs";
import { t as renderFileContextBlock } from "./file-context-DFxrXkdd.mjs";
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
		case "extracted": return wrapUntrustedAttachmentContent(outcome.text);
		case "rendered-to-images": return "[PDF content rendered to images]";
		case "no-extractable-text": return "[No extractable text]";
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
//#region src/media-understanding/file-extraction-limits.ts
const INBOUND_FILE_EXTRACTION_DEFAULT_MAX_MB = 20;
const INBOUND_FILE_EXTRACTION_MAX_BYTES_CAP = 26214400;
const INBOUND_FILE_EXTRACTION_DEFAULT_MAX_PAGES = 20;
const INBOUND_FILE_EXTRACTION_MAX_PAGES_CAP = 150;
function resolveInboundFileExtractionMaxBytes(defaults) {
	const maxMb = asPositiveFiniteNumber(defaults?.mediaMaxMb) ?? INBOUND_FILE_EXTRACTION_DEFAULT_MAX_MB;
	return Math.min(Math.floor(maxMb * 1024 * 1024), INBOUND_FILE_EXTRACTION_MAX_BYTES_CAP);
}
function resolveInboundFileExtractionMaxPages(defaults) {
	const pages = asPositiveFiniteNumber(defaults?.pdfMaxPages) ?? INBOUND_FILE_EXTRACTION_DEFAULT_MAX_PAGES;
	return Math.min(Math.trunc(pages), INBOUND_FILE_EXTRACTION_MAX_PAGES_CAP);
}
/** Builds inbound attachment extraction limits, sized to the agent's media/PDF config. */
function resolveFileExtractionLimits(cfg) {
	const files = cfg.gateway?.http?.endpoints?.responses?.files;
	const allowedMimesConfigured = Boolean(files?.allowedMimes?.length);
	const defaults = cfg.agents?.defaults;
	const inboundFiles = {
		...files,
		maxBytes: files?.maxBytes ?? resolveInboundFileExtractionMaxBytes(defaults),
		pdf: {
			...files?.pdf,
			maxPages: files?.pdf?.maxPages ?? resolveInboundFileExtractionMaxPages(defaults)
		}
	};
	return {
		...resolveInputFileLimits(inboundFiles),
		allowedMimesConfigured
	};
}
//#endregion
//#region src/media-understanding/media-attachment-outcomes.ts
const MAX_SKIPPED_FILE_MARKERS = 5;
function renderSkippedFileOverflowSummary(count) {
	return `[${count} more attachment${count === 1 ? "" : "s"} skipped]`;
}
function renderMediaAttachmentDisposition(capability, disposition) {
	const label = `${capability[0]?.toUpperCase()}${capability.slice(1)}`;
	switch (disposition.kind) {
		case "handled":
		case "handed-to-native-vision": return null;
		case "not-selected": return `[${label} attachment not processed: attachment limit reached]`;
		case "capability-disabled": return `[${label} attachment not analyzed: ${capability} understanding is disabled]`;
		case "no-model": return `[${label} attachment not analyzed: no ${capability}-understanding model is configured]`;
		case "scope-denied": return `[${label} attachment not analyzed in this chat]`;
		case "failed": return `[${label} attachment could not be analyzed]`;
		default: return disposition;
	}
}
function applyAttachmentMarkerBudget(blocks) {
	const rendered = [];
	let markers = 0;
	let overflow = 0;
	for (const block of blocks) {
		if (block.consumesMarkerBudget && markers >= MAX_SKIPPED_FILE_MARKERS) {
			overflow += 1;
			continue;
		}
		markers += Number(block.consumesMarkerBudget);
		rendered.push(block.text);
	}
	return overflow > 0 ? [...rendered, renderSkippedFileOverflowSummary(overflow)] : rendered;
}
//#endregion
//#region src/media-understanding/file-context.ts
function attachmentUrlDisplayName(url) {
	try {
		return new URL(url).pathname.split("/").findLast((segment) => segment.length > 0) || void 0;
	} catch {
		return;
	}
}
async function classifyFileAttachment(params) {
	const { attachment, cache, cfg, limits, skipAttachmentIndexes } = params;
	params.assertCurrent?.();
	const attachmentFilename = attachment.path ?? (attachment.url ? attachmentUrlDisplayName(attachment.url) : void 0);
	const displayFilename = attachment.fileName ?? attachmentFilename;
	if (skipAttachmentIndexes?.has(attachment.index)) return { outcome: { kind: "claimed-elsewhere" } };
	const extensionMime = mimeTypeFromFilePath(attachmentFilename);
	const forcedTextMime = attachmentClassFromMime(extensionMime) === "text" ? extensionMime : void 0;
	const kind = forcedTextMime ? "document" : resolveAttachmentKind(attachment);
	if (!forcedTextMime && (kind === "image" || kind === "video" || kind === "audio")) return { outcome: { kind: "claimed-elsewhere" } };
	if (!limits.allowUrl && attachment.url && !attachment.path && !classifyMediaReferenceSource(attachment.url).isMediaStoreUrl) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (url disabled) index=${attachment.index}`);
		return {
			outcome: { kind: "url-sources-disabled" },
			filename: displayFilename
		};
	}
	let bufferResult;
	try {
		bufferResult = await cache.getBuffer({
			attachmentIndex: attachment.index,
			maxBytes: limits.maxBytes,
			timeoutMs: limits.timeoutMs
		});
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (buffer): ${String(err)}`);
		return {
			outcome: { kind: "read-failure" },
			filename: displayFilename
		};
	}
	params.assertCurrent?.();
	const filename = attachment.fileName ?? bufferResult?.fileName;
	const classification = bufferResult.classification;
	const classifiedMime = sanitizeMimeType(classification.mime);
	const binaryMime = sanitizeMimeType(normalizeMimeType(attachment.mime)) ?? classifiedMime;
	const selfServeLocalPath = bufferResult.localPath;
	if (classification.class !== "text" && !(classification.class === "document" && classification.mime === "application/pdf")) {
		if (limits.allowedMimesConfigured && !(classifiedMime && limits.allowedMimes.has(classifiedMime))) return {
			outcome: {
				kind: "policy-rejected",
				mime: classifiedMime ?? binaryMime
			},
			filename,
			mimeType: classifiedMime ?? binaryMime
		};
		return {
			outcome: {
				kind: "unsupported-format",
				mime: binaryMime,
				...selfServeLocalPath ? { localPath: selfServeLocalPath } : {}
			},
			filename,
			mimeType: binaryMime
		};
	}
	const mimeType = sanitizeMimeType(classification.mime);
	if (classification.class === "text" && attachment.mime && normalizeMimeType(attachment.mime) !== classification.mime) logVerbose(`media: MIME override from "${attachment.mime}" to "${classification.mime}" for index=${attachment.index}`);
	if (!mimeType) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (unknown mime) index=${attachment.index}`);
		return {
			outcome: { kind: "unsupported-format" },
			filename
		};
	}
	const allowedMimes = new Set(limits.allowedMimes);
	if (!limits.allowedMimesConfigured && classification.class === "text") allowedMimes.add(mimeType);
	if (!allowedMimes.has(mimeType)) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (unsupported mime ${mimeType}) index=${attachment.index}`);
		return {
			outcome: limits.allowedMimesConfigured ? {
				kind: "policy-rejected",
				mime: mimeType
			} : {
				kind: "unsupported-format",
				mime: mimeType,
				...selfServeLocalPath ? { localPath: selfServeLocalPath } : {}
			},
			filename,
			mimeType
		};
	}
	let extracted;
	try {
		const { allowedMimesConfigured: _allowedMimesConfigured, ...baseLimits } = limits;
		extracted = await extractFileContentFromBuffer({
			buffer: mimeType === "application/pdf" ? Buffer.from(bufferResult.buffer) : bufferResult.buffer,
			filename: bufferResult.fileName,
			limits: {
				...baseLimits,
				allowedMimes
			},
			config: cfg,
			classification
		});
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (extract): ${String(err)}`);
		return {
			outcome: { kind: "read-failure" },
			filename,
			mimeType
		};
	}
	params.assertCurrent?.();
	const text = extracted?.text?.trim() ?? "";
	const extractedImages = extracted?.images ?? [];
	if (text) return {
		outcome: {
			kind: "extracted",
			text,
			images: extractedImages
		},
		filename,
		mimeType
	};
	if (extractedImages.length > 0) return {
		outcome: {
			kind: "rendered-to-images",
			images: extractedImages
		},
		filename,
		mimeType
	};
	return {
		outcome: { kind: "no-extractable-text" },
		filename,
		mimeType
	};
}
async function extractFileContext(params) {
	const { attachments, cache, cfg, limits, skipAttachmentIndexes } = params;
	if (!attachments || attachments.length === 0) return {
		blocks: [],
		images: [],
		localPathSelfServeUpgrades: []
	};
	const blocks = [];
	const images = [];
	const localPathSelfServeUpgrades = [];
	for (const attachment of attachments) {
		if (!attachment) continue;
		const { outcome, filename, mimeType } = await classifyFileAttachment({
			attachment,
			cache,
			cfg,
			limits,
			skipAttachmentIndexes,
			assertCurrent: params.assertCurrent
		}).finally(() => cache.releaseBuffer(attachment.index));
		params.assertCurrent?.();
		if (outcome.kind === "extracted" || outcome.kind === "rendered-to-images") images.push(...outcome.images.map((image) => ({
			...image,
			attachmentIndex: attachment.index
		})));
		const blockText = renderFileAttachmentOutcome(outcome, { selfServeLocalPath: params.selfServePathsEnabled ? void 0 : false });
		if (blockText === null) continue;
		const renderBlock = (content) => renderFileContextBlock({
			filename,
			fallbackName: `file-${attachment.index + 1}`,
			mimeType,
			content
		});
		const text = renderBlock(blockText);
		blocks.push({
			text,
			consumesMarkerBudget: isSkippedFileOutcome(outcome)
		});
		if (outcome.kind === "unsupported-format" && outcome.localPath) {
			const fallback = renderFileAttachmentOutcome(outcome, { selfServeLocalPath: false });
			const selfServe = renderFileAttachmentOutcome(outcome);
			if (fallback && selfServe) localPathSelfServeUpgrades.push({
				attachmentIndex: attachment.index,
				fallback: renderBlock(fallback),
				render: (path) => {
					const rendered = renderFileAttachmentOutcome(outcome, path ? { selfServeLocalPath: path } : void 0);
					return rendered ? renderBlock(rendered) : void 0;
				}
			});
		}
	}
	return {
		blocks,
		images,
		localPathSelfServeUpgrades
	};
}
/** Prepares retained document context under the same admission policy as live attachments. */
async function prepareFileContextFromMedia(params) {
	return await renderInboundDocumentContext({
		ctx: {
			media: [...params.media],
			Provider: params.channelId,
			AccountId: params.accountId
		},
		cfg: params.config,
		workspaceDir: params.workspaceDir,
		maxChars: params.maxChars,
		assertCurrent: params.assertCurrent
	});
}
/** Keep prompt expansion separate from inbound state so rejected steers can dispatch normally. */
async function renderInboundDocumentContext(params) {
	params.assertCurrent?.();
	const { ctx, cfg } = params;
	const limits = resolveFileExtractionLimits(cfg);
	const attachments = normalizeMediaAttachments(ctx);
	const cache = createMediaAttachmentCache(attachments, {
		localPathRoots: resolveMediaAttachmentLocalRoots({
			cfg,
			ctx,
			workspaceDir: params.workspaceDir
		}),
		includeDefaultLocalPathRoots: false,
		ssrfPolicy: cfg.tools?.web?.fetch?.ssrfPolicy,
		workspaceDir: params.workspaceDir
	});
	try {
		const context = await extractFileContext({
			attachments,
			cache,
			cfg,
			limits: params.maxChars === void 0 ? limits : {
				...limits,
				maxChars: Math.min(limits.maxChars, params.maxChars)
			},
			selfServePathsEnabled: false,
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent?.();
		return {
			text: applyAttachmentMarkerBudget(context.blocks).join("\n\n"),
			images: context.images
		};
	} finally {
		await cache.cleanup();
	}
}
//#endregion
export { renderMediaAttachmentDisposition as a, applyAttachmentMarkerBudget as i, prepareFileContextFromMedia as n, resolveFileExtractionLimits as o, renderInboundDocumentContext as r, extractFileContext as t };
