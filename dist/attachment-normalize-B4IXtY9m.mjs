import { l as asNonNegativeFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-DUxuqQz8.mjs";
import { d as normalizeMimeType, l as kindFromMime, r as extensionForMime, u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { n as estimateBase64DecodedBytes, r as isValidBase64 } from "./base64-B5EyWEOm.mjs";
import { t as probeMediaFilesWithinBudget } from "./media-probe-Bdg20gzZ.mjs";
import { f as saveMediaBuffer, i as deleteMediaBuffer } from "./store-BrX2xbJz.mjs";
import { a as parseInboundMediaUri } from "./media-reference-C0dWWfb0.mjs";
import { n as registerMediaCleanupDrain } from "./server-media-cleanup-lifecycle-FrwOsNwk.mjs";
import { t as sniffMimeFromBase64 } from "./sniff-mime-from-base64-dAleQJoG.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import "./chat-attachment-policy-3-T7Wh4j.mjs";
//#region src/gateway/chat-attachments.ts
/** Deletes prepared inbound files that never reached a durable owner. */
async function discardPreparedInboundMedia(refs, log) {
	const deletion = Promise.allSettled(refs.map((ref) => deleteMediaBuffer(ref.id, "inbound")));
	registerMediaCleanupDrain(deletion.then(() => void 0));
	const results = await deletion;
	for (const [index, result] of results.entries()) if (result.status === "rejected" && log) log.warn(`failed to discard prepared inbound media ${refs[index]?.id}: ${formatErrorMessage(result.reason)}`);
}
const INLINE_IMAGE_DURABLE_OMISSION_MARKER = "[image attachment omitted: durable managed media claim unavailable]";
const OFFLOAD_THRESHOLD_BYTES = 2e6;
const TEXT_ONLY_OFFLOAD_LIMIT = 10;
const MAX_CHAT_ATTACHMENT_MEDIA_PROBES = 8;
const CHAT_ATTACHMENT_MEDIA_PROBE_CONCURRENCY = 2;
const CHAT_ATTACHMENT_MEDIA_PROBE_BUDGET_MS = 3e3;
async function enrichOffloadedMediaMetadata(refs) {
	const candidates = refs.flatMap((ref) => {
		const kind = kindFromMime(ref.mimeType);
		return kind === "audio" || kind === "video" ? [{
			kind,
			ref
		}] : [];
	});
	const metadata = await probeMediaFilesWithinBudget(candidates.map(({ kind, ref }) => ({
		filePath: ref.path,
		kind
	})), {
		budgetMs: CHAT_ATTACHMENT_MEDIA_PROBE_BUDGET_MS,
		concurrency: CHAT_ATTACHMENT_MEDIA_PROBE_CONCURRENCY,
		maxProbes: MAX_CHAT_ATTACHMENT_MEDIA_PROBES
	});
	for (const [index, candidate] of candidates.entries()) Object.assign(candidate.ref, metadata[index]);
}
function logAttachmentFailure(log, label, err) {
	const primary = formatUncaughtError(err);
	const cause = err instanceof Error ? err.cause : void 0;
	const causeText = cause === void 0 ? "" : formatUncaughtError(cause);
	log.error(label, {
		error: !causeText || causeText === primary ? primary : `${primary}\nCaused by: ${causeText}`,
		consoleMessage: `${label}: ${formatForLog(err)}`
	});
}
function stripImageMediaMarkers(message, refs) {
	return refs.reduce((projected, ref) => {
		const marker = ref.mimeType.startsWith("image/") ? `\n[media attached: ${ref.mediaRef}]` : "";
		const index = marker ? projected.lastIndexOf(marker) : -1;
		return index < 0 ? projected : projected.slice(0, index) + projected.slice(index + marker.length);
	}, message);
}
async function persistInboundImagesForTranscript(params) {
	const entries = [];
	let omission = "none";
	for (const image of params.images) try {
		const saved = await saveMediaBuffer(Buffer.from(image.data, "base64"), image.mimeType, "inbound");
		const trusted = assertSavedMedia(saved, `inline image ${image.sourceIndex + 1}`);
		entries.push({
			id: trusted.id,
			path: trusted.path,
			sourceIndex: image.sourceIndex,
			imageKind: "inline",
			fact: {
				url: trusted.mediaRef,
				contentType: saved.contentType ?? image.mimeType,
				kind: "image",
				sizeBytes: saved.size
			}
		});
	} catch (err) {
		omission = "inline-image-save-failed";
		params.log.warn(`${params.logContext}: failed to persist inbound image (${image.mimeType}): ${formatErrorMessage(err)}`);
	}
	for (const ref of params.offloadedRefs) {
		const fact = {
			url: buildManagedInboundMediaRef(ref.id),
			contentType: ref.mimeType,
			kind: ref.kind,
			fileName: ref.label,
			...ref.origin ? { origin: ref.origin } : {},
			sizeBytes: ref.sizeBytes,
			...ref.durationMs !== void 0 ? { durationMs: ref.durationMs } : {},
			...ref.width !== void 0 ? { width: ref.width } : {},
			...ref.height !== void 0 ? { height: ref.height } : {},
			...ref.mimeType.startsWith("image/") ? {} : { hydrationSuppressed: true }
		};
		entries.push({
			id: ref.id,
			path: ref.path,
			sourceIndex: ref.sourceIndex,
			...ref.mimeType.startsWith("image/") ? { imageKind: "offloaded" } : {},
			fact
		});
	}
	entries.sort((left, right) => left.sourceIndex - right.sourceIndex);
	return {
		entries,
		omission
	};
}
var UnsupportedAttachmentError = class extends Error {
	constructor(reason, message) {
		super(message);
		this.name = "UnsupportedAttachmentError";
		this.reason = reason;
	}
};
var MediaOffloadError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "MediaOffloadError";
		this.cause = options?.cause;
	}
};
function isGenericContainerMime(mime) {
	return mime === "application/zip" || mime === "application/octet-stream";
}
function verifyDecodedSize(buffer, estimatedBytes, label) {
	if (Math.abs(buffer.byteLength - estimatedBytes) > 3) throw new Error(`attachment ${label}: base64 contains invalid characters (expected ~${estimatedBytes} bytes decoded, got ${buffer.byteLength})`);
}
function ensureExtension(label, mime) {
	if (/\.[a-zA-Z0-9]+$/.test(label)) return label;
	const ext = extensionForMime(mime) ?? "";
	return ext ? `${label}${ext}` : label;
}
function buildManagedInboundMediaRef(id) {
	const candidate = `media://inbound/${id}`;
	const parsed = parseInboundMediaUri(candidate);
	if (!parsed || parsed.id !== id) throw new Error("Saved media ID failed canonical validation");
	return parsed.normalizedSource;
}
function assertSavedMedia(value, label) {
	if (value === null || typeof value !== "object" || !("id" in value) || typeof value.id !== "string") throw new Error(`attachment ${label}: saveMediaBuffer returned an unexpected shape`);
	const id = value.id;
	const path = value.path;
	if (typeof path !== "string" || path.length === 0) throw new Error(`attachment ${label}: saveMediaBuffer returned no on-disk path`);
	return {
		id,
		mediaRef: buildManagedInboundMediaRef(id),
		path
	};
}
function normalizeAttachment(att, idx, opts) {
	const mime = att.mimeType ?? "";
	const content = att.content;
	const label = att.fileName || att.type || `attachment-${idx + 1}`;
	if (typeof content !== "string") throw new Error(`attachment ${label}: content must be base64 string`);
	if (opts.requireImageMime && !mime.startsWith("image/")) throw new Error(`attachment ${label}: only image/* supported`);
	let base64 = content.trim();
	if (opts.stripDataUrlPrefix) {
		const commaIndex = base64.indexOf(",");
		if (commaIndex >= 0 && /^data:[^;,]+;base64$/.test(base64.slice(0, commaIndex))) base64 = base64.slice(commaIndex + 1);
	}
	return {
		label,
		mime,
		base64
	};
}
async function parseMessageWithAttachments(message, attachments, opts) {
	const maxBytes = opts?.maxBytes ?? 20971520;
	const log = opts?.log;
	const supportsInlineImages = opts?.supportsInlineImages !== false;
	const acceptNonImage = opts?.acceptNonImage !== false;
	const supportsImagesOption = opts?.supportsImages;
	let resolvedSupportsImages = typeof supportsImagesOption === "boolean" ? supportsImagesOption : void 0;
	const resolveSupportsImages = async () => {
		if (resolvedSupportsImages !== void 0) return resolvedSupportsImages;
		resolvedSupportsImages = typeof supportsImagesOption === "function" ? await supportsImagesOption() : true;
		return resolvedSupportsImages;
	};
	if (!attachments || attachments.length === 0) return {
		message,
		images: [],
		imageOrder: [],
		media: [],
		offloadedRefs: []
	};
	const images = [];
	const imageOrder = [];
	const offloadedRefs = [];
	let updatedMessage = message;
	let textOnlyImageOffloadCount = 0;
	const savedMediaIds = [];
	try {
		for (const [idx, att] of attachments.entries()) {
			if (!att) continue;
			const { base64: b64, label, mime } = normalizeAttachment(att, idx, {
				stripDataUrlPrefix: true,
				requireImageMime: false
			});
			if (b64.length === 0) throw new UnsupportedAttachmentError("empty-payload", `attachment ${label}: empty payload`);
			if (!isValidBase64(b64)) throw new Error(`attachment ${label}: invalid base64 content`);
			const sizeBytes = estimateBase64DecodedBytes(b64);
			if (sizeBytes > maxBytes) throw new Error(`attachment ${label}: exceeds size limit (${sizeBytes} > ${maxBytes} bytes)`);
			const providedMime = normalizeMimeType(mime);
			const mimeHints = [providedMime, mimeTypeFromFilePath(label)];
			const finalMime = await sniffMimeFromBase64(b64, { additionalMimeHints: [...mimeHints.filter((hint) => !isGenericContainerMime(hint)), ...mimeHints] }) ?? "application/octet-stream";
			if (providedMime && !isGenericContainerMime(providedMime) && finalMime !== providedMime) log?.warn(`attachment ${label}: mime mismatch (${providedMime} -> ${finalMime})`);
			const isImage = finalMime.startsWith("image/");
			const shouldForceImageOffload = isImage && !await resolveSupportsImages();
			if (isImage && !supportsInlineImages && !shouldForceImageOffload) throw new UnsupportedAttachmentError("text-only-image", `attachment ${label}: active model does not accept image inputs`);
			if (!isImage && !acceptNonImage) throw new UnsupportedAttachmentError("unsupported-non-image", `attachment ${label}: non-image attachments (${finalMime}) are not supported on this entrypoint`);
			if (isImage && sizeBytes > 6291456) throw new Error(`attachment ${label}: image exceeds size limit (${sizeBytes} > ${MAX_IMAGE_BYTES} bytes)`);
			if (shouldForceImageOffload && isImage && textOnlyImageOffloadCount >= TEXT_ONLY_OFFLOAD_LIMIT) {
				log?.warn(`attachment ${label}: dropping image because text-only offload limit ${TEXT_ONLY_OFFLOAD_LIMIT} was reached`);
				updatedMessage += "\n[image attachment omitted: text-only attachment limit reached]";
				continue;
			}
			if (!(shouldForceImageOffload || !isImage || sizeBytes > OFFLOAD_THRESHOLD_BYTES)) {
				images.push({
					type: "image",
					data: b64,
					mimeType: finalMime,
					sourceIndex: idx
				});
				imageOrder.push("inline");
				continue;
			}
			const buffer = Buffer.from(b64, "base64");
			verifyDecodedSize(buffer, sizeBytes, label);
			let savedMedia;
			try {
				const labelWithExt = ensureExtension(label, finalMime);
				savedMedia = assertSavedMedia(await saveMediaBuffer(buffer, finalMime, "inbound", maxBytes, labelWithExt), label);
			} catch (err) {
				throw new MediaOffloadError(`[Gateway Error] Failed to save intercepted media to disk: ${formatErrorMessage(err)}`, { cause: err });
			}
			savedMediaIds.push(savedMedia.id);
			const mediaRef = savedMedia.mediaRef;
			updatedMessage += `\n[media attached: ${mediaRef}]`;
			log?.info?.(shouldForceImageOffload && isImage ? `[Gateway] Offloaded image for text-only model. Saved: ${mediaRef}` : `[Gateway] Offloaded attachment (${finalMime}). Saved: ${mediaRef}`);
			offloadedRefs.push({
				mediaRef,
				id: savedMedia.id,
				path: savedMedia.path,
				kind: kindFromMime(finalMime) ?? "unknown",
				mimeType: finalMime,
				label,
				sizeBytes,
				sourceIndex: idx,
				...att.origin === "paste" || att.origin === "file" ? { origin: att.origin } : {},
				...typeof att.durationMs === "number" && Number.isFinite(att.durationMs) && att.durationMs >= 0 ? { durationMs: att.durationMs } : {},
				...typeof att.width === "number" && Number.isFinite(att.width) && att.width >= 0 ? { width: att.width } : {},
				...typeof att.height === "number" && Number.isFinite(att.height) && att.height >= 0 ? { height: att.height } : {}
			});
			if (isImage) {
				imageOrder.push("offloaded");
				if (shouldForceImageOffload) textOnlyImageOffloadCount++;
			}
		}
	} catch (err) {
		if (savedMediaIds.length > 0) await Promise.allSettled(savedMediaIds.map((id) => deleteMediaBuffer(id, "inbound")));
		throw err;
	}
	await enrichOffloadedMediaMetadata(offloadedRefs);
	return {
		message: updatedMessage !== message ? updatedMessage.trimEnd() : message,
		images,
		imageOrder,
		media: offloadedRefs.map((ref) => ({
			path: ref.path,
			url: ref.mediaRef,
			contentType: ref.mimeType,
			kind: ref.kind,
			fileName: ref.label,
			...ref.origin ? { origin: ref.origin } : {},
			sizeBytes: ref.sizeBytes,
			...ref.durationMs ? { durationMs: ref.durationMs } : {},
			...ref.width ? { width: ref.width } : {},
			...ref.height ? { height: ref.height } : {}
		})),
		offloadedRefs
	};
}
//#endregion
//#region src/gateway/server-methods/attachment-normalize.ts
function normalizeAttachmentContent(content) {
	if (typeof content === "string") return content;
	if (ArrayBuffer.isView(content)) return Buffer.from(content.buffer, content.byteOffset, content.byteLength).toString("base64");
	if (content instanceof ArrayBuffer) return Buffer.from(content).toString("base64");
}
/** Convert permissive RPC attachment payloads into the bounded chat attachment shape. */
function normalizeRpcAttachmentsToChatAttachments(attachments) {
	return attachments?.map((a) => {
		const sourceRecord = a?.source && typeof a.source === "object" ? a.source : void 0;
		const sourceType = typeof sourceRecord?.type === "string" ? sourceRecord.type : void 0;
		const sourceMimeType = typeof sourceRecord?.media_type === "string" ? sourceRecord.media_type : void 0;
		const sourceContent = sourceType === "base64" ? normalizeAttachmentContent(sourceRecord?.data) : void 0;
		const sizeBytes = asNonNegativeFiniteNumber(a?.sizeBytes);
		const durationMs = asNonNegativeFiniteNumber(a?.durationMs);
		const width = asNonNegativeFiniteNumber(a?.width);
		const height = asNonNegativeFiniteNumber(a?.height);
		return {
			type: typeof a?.type === "string" ? a.type : void 0,
			mimeType: typeof a?.mimeType === "string" ? a.mimeType : sourceMimeType,
			fileName: typeof a?.fileName === "string" ? a.fileName : void 0,
			content: normalizeAttachmentContent(a?.content) ?? sourceContent,
			...a?.origin === "paste" || a?.origin === "file" ? { origin: a.origin } : {},
			...sizeBytes !== void 0 ? { sizeBytes } : {},
			...durationMs !== void 0 ? { durationMs } : {},
			...width !== void 0 ? { width } : {},
			...height !== void 0 ? { height } : {}
		};
	}).filter((a) => a.content !== void 0) ?? [];
}
//#endregion
export { discardPreparedInboundMedia as a, persistInboundImagesForTranscript as c, UnsupportedAttachmentError as i, stripImageMediaMarkers as l, INLINE_IMAGE_DURABLE_OMISSION_MARKER as n, logAttachmentFailure as o, MediaOffloadError as r, parseMessageWithAttachments as s, normalizeRpcAttachmentsToChatAttachments as t };
