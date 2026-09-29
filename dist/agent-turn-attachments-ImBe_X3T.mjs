import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { n as hasInboundMedia } from "./inbound-media-CetKPfK2.mjs";
//#region src/auto-reply/reply/history-media.ts
const RECENT_HISTORY_IMAGE_TTL_MS = 18e5;
const RECENT_HISTORY_IMAGE_LIMIT = 4;
function isRemotePath(value) {
	if (/^[a-z]:[\\/]/i.test(value)) return false;
	try {
		return new URL(value).protocol !== "file:";
	} catch {
		return false;
	}
}
function resolveTimestamp(value) {
	return asFiniteNumber(value);
}
function resolveHistoryEntries(ctx) {
	return Array.isArray(ctx.InboundHistory) ? ctx.InboundHistory : [];
}
function resolveRecentInboundHistoryImages(params) {
	const nowMs = params.nowMs ?? resolveTimestamp(params.ctx.Timestamp) ?? Date.now();
	const ttlMs = params.ttlMs ?? RECENT_HISTORY_IMAGE_TTL_MS;
	const limit = Math.max(0, params.limit ?? RECENT_HISTORY_IMAGE_LIMIT);
	if (limit === 0) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const entries = resolveHistoryEntries(params.ctx);
	for (let index = entries.length - 1; index >= 0 && out.length < limit; index -= 1) {
		const entry = expectDefined(entries[index], "entries entry at index");
		const timestamp = resolveTimestamp(entry?.timestamp);
		if (timestamp === void 0 || Math.abs(nowMs - timestamp) > ttlMs) continue;
		const mediaEntries = Array.isArray(entry.media) ? entry.media : [];
		for (let mediaIndex = mediaEntries.length - 1; mediaIndex >= 0 && out.length < limit; mediaIndex -= 1) {
			const media = mediaEntries[mediaIndex];
			if (!media || !params.isImageAttachment({
				path: media.path,
				url: media.url,
				mime: media.contentType,
				kind: media.kind,
				index: mediaIndex
			})) continue;
			const mediaPath = normalizeOptionalString(media.path);
			if (!mediaPath || isRemotePath(mediaPath)) continue;
			const contentType = normalizeOptionalString(media.contentType) ?? mimeTypeFromFilePath(mediaPath);
			const messageId = normalizeOptionalString(media.messageId) ?? entry.messageId;
			const key = [messageId ?? "", mediaPath].join("\0");
			if (seen.has(key)) continue;
			seen.add(key);
			out.push({
				path: mediaPath,
				...contentType ? { contentType } : {},
				...media.kind ? { kind: media.kind } : {},
				sender: entry.sender,
				sentAtMs: timestamp,
				messagePosition: index + 1,
				messageCount: entries.length,
				...messageId ? { messageId } : {}
			});
		}
	}
	return out.toReversed();
}
function formatRecentHistoryImageSentAt(sentAtMs) {
	const date = new Date(sentAtMs);
	return Number.isFinite(date.getTime()) ? date.toISOString() : `${sentAtMs}ms since epoch`;
}
function appendRecentHistoryImageContext(params) {
	if (params.images.length === 0) return params.promptText;
	const notes = params.images.map((image, index) => {
		const message = image.messageId ? `, message ${image.messageId}` : "";
		const sentAt = formatRecentHistoryImageSentAt(image.sentAtMs);
		return `[Recent image ${index + 1} from ${image.sender}${message}, sent at ${sentAt}, message ${image.messagePosition} of ${image.messageCount} in available history, attached as media.]`;
	});
	return [params.promptText, notes.join("\n")].filter((part) => part.trim().length > 0).join("\n\n");
}
//#endregion
//#region src/auto-reply/reply/agent-turn-attachments.ts
/** Resolves media attachments available to the current agent turn. */
const agentTurnMediaRuntimeLoader = createLazyImportLoader(() => import("./dispatch-acp-media.runtime.js"));
/** Lazily loads media runtime dependencies for agent-turn attachments. */
function loadAgentTurnMediaRuntime() {
	return agentTurnMediaRuntimeLoader.load();
}
const AGENT_TURN_ATTACHMENT_MAX_BYTES = 10485760;
const AGENT_TURN_ATTACHMENT_TIMEOUT_MS = 1e3;
function hasInboundHistoryMedia(ctx) {
	return Array.isArray(ctx.InboundHistory) && ctx.InboundHistory.some((entry) => Array.isArray(entry.media) && entry.media.length > 0);
}
/** Current-turn image indexes already represented by media-understanding text. */
function collectDescribedImageAttachmentIndexes(ctx) {
	return new Set(ctx.MediaUnderstanding?.filter((output) => output.kind === "image.description").map((output) => output.attachmentIndex) ?? []);
}
/** Resolves image attachments for the current agent turn and recent image history. */
async function resolveAgentTurnAttachments(params) {
	const includeRecentHistoryImages = params.includeRecentHistoryImages ?? true;
	if (!hasInboundMedia(params.ctx) && !(includeRecentHistoryImages && hasInboundHistoryMedia(params.ctx))) return {
		attachments: [],
		recentHistoryImages: []
	};
	const runtime = params.runtime ?? await loadAgentTurnMediaRuntime();
	const currentAttachments = runtime.normalizeAttachments(params.ctx).map((attachment) => normalizeOptionalString(attachment.path) ? Object.assign({}, attachment, { url: void 0 }) : attachment);
	const recentHistoryImages = includeRecentHistoryImages ? resolveRecentInboundHistoryImages({
		ctx: params.ctx,
		isImageAttachment: runtime.isImageAttachment
	}) : [];
	const firstHistoryAttachmentIndex = currentAttachments.reduce((maxIndex, attachment) => Number.isFinite(attachment.index) ? Math.max(maxIndex, attachment.index) : maxIndex, -1) + 1;
	const historyAttachments = recentHistoryImages.map((image, index) => ({
		path: image.path,
		mime: image.contentType,
		kind: image.kind,
		index: firstHistoryAttachmentIndex + index
	}));
	const historyAttachmentByIndex = new Map(historyAttachments.map((attachment, index) => [attachment.index, recentHistoryImages[index]]));
	const mediaAttachments = [...currentAttachments, ...historyAttachments];
	const cache = new runtime.MediaAttachmentCache(mediaAttachments, {
		localPathRoots: runtime.resolveMediaAttachmentLocalRoots({
			cfg: params.cfg,
			ctx: params.ctx
		}),
		includeDefaultLocalPathRoots: false
	});
	const results = [];
	const resultIndexes = [];
	const resolvedHistoryImages = [];
	const resolveImageAttachment = async (attachment) => {
		if (!runtime.isImageAttachment(attachment)) return false;
		if (!normalizeOptionalString(attachment.path)) return false;
		try {
			const { buffer, mime: mediaType } = await cache.getBuffer({
				attachmentIndex: attachment.index,
				maxBytes: AGENT_TURN_ATTACHMENT_MAX_BYTES,
				timeoutMs: AGENT_TURN_ATTACHMENT_TIMEOUT_MS
			});
			if (!mediaType?.startsWith("image/")) return false;
			results.push({
				mediaType,
				data: buffer.toString("base64")
			});
			resultIndexes.push(attachment.index);
			const historyImage = historyAttachmentByIndex.get(attachment.index);
			if (historyImage) resolvedHistoryImages.push(historyImage);
			return true;
		} catch (error) {
			if (runtime.isMediaUnderstandingSkipError(error)) logVerbose(`agent-turn-attachments: skipping attachment #${attachment.index + 1} (${error.reason})`);
			else {
				const errorName = error instanceof Error ? error.name : typeof error;
				logVerbose(`agent-turn-attachments: failed to read attachment #${attachment.index + 1} (${errorName})`);
			}
			return false;
		}
	};
	const describedImageIndexes = collectDescribedImageAttachmentIndexes(params.ctx);
	let currentImageResolved = false;
	const hasCurrentImageCandidate = currentAttachments.some(runtime.isImageAttachment);
	for (const attachment of currentAttachments) {
		if (describedImageIndexes.has(attachment.index) && runtime.isImageAttachment(attachment)) {
			currentImageResolved = true;
			continue;
		}
		currentImageResolved = await resolveImageAttachment(attachment) || currentImageResolved;
	}
	if (includeRecentHistoryImages && !currentImageResolved && (currentAttachments.length === 0 || hasCurrentImageCandidate)) for (const attachment of historyAttachments) await resolveImageAttachment(attachment);
	return {
		attachments: results,
		...params.includeAttachmentIndexes ? { attachmentIndexes: resultIndexes } : {},
		recentHistoryImages: resolvedHistoryImages
	};
}
/** Converts inline image content into ACP attachment payloads. */
function resolveInlineAgentImageAttachments(images) {
	if (!Array.isArray(images)) return [];
	return images.map((image) => ({
		mediaType: image.mimeType,
		data: image.data
	})).filter((image) => image.mediaType.startsWith("image/") && image.data.trim().length > 0);
}
//#endregion
export { appendRecentHistoryImageContext as a, resolveInlineAgentImageAttachments as i, loadAgentTurnMediaRuntime as n, resolveAgentTurnAttachments as r, collectDescribedImageAttachmentIndexes as t };
