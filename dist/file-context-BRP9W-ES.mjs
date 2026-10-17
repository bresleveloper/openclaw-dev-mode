import { i as logVerbose, o as shouldLogVerbose } from "./globals-BXbZ1A_g.mjs";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-CGDYrRzL.mjs";
import { n as classifyMediaReferenceSource } from "./media-reference-BIOMSmeS.mjs";
import { a as resolveAttachmentKind } from "./attachments.normalize-BQ4LOjcC.mjs";
import "./attachments-CII4Jz1c.mjs";
import { t as attachmentClassFromMime } from "./attachment-classify-CnNuBUq0.mjs";
import { i as extractFileContentFromBuffer } from "./input-files-B2bsdmrJ.mjs";
import { n as normalizeMediaAttachments, r as resolveMediaAttachmentLocalRoots, t as createMediaAttachmentCache } from "./runner.attachments-DXXogrcC.mjs";
import { a as renderFileContextBlock, i as sanitizeMimeType, n as renderFileAttachmentOutcome, r as resolveFileExtractionOutcome, t as isSkippedFileOutcome } from "./file-attachment-outcomes-CQgRPzch.mjs";
import { t as resolveFileExtractionLimits } from "./file-extraction-limits-DhTTSSYi.mjs";
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
	const filename = attachment.fileName ?? bufferResult.fileName;
	const classification = bufferResult.classification;
	const mimeType = sanitizeMimeType(classification.mime);
	const binaryMime = sanitizeMimeType(normalizeMimeType(attachment.mime)) ?? mimeType;
	const selfServeLocalPath = bufferResult.localPath;
	if (classification.class !== "text" && !(classification.class === "document" && classification.mime === "application/pdf")) {
		if (limits.allowedMimesConfigured && !(mimeType && limits.allowedMimes.has(mimeType))) return {
			outcome: {
				kind: "policy-rejected",
				mime: mimeType ?? binaryMime
			},
			filename,
			mimeType: mimeType ?? binaryMime
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
	return {
		outcome: resolveFileExtractionOutcome({
			text: extracted?.text?.trim(),
			images: extracted?.images,
			metadata: extracted?.metadata
		}),
		filename,
		mimeType
	};
}
async function extractFileContext(params) {
	const { attachments, cache, cfg, limits, skipAttachmentIndexes } = params;
	const blocks = [];
	const images = [];
	const localPathSelfServeUpgrades = [];
	for (const attachment of attachments) {
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
export { renderMediaAttachmentDisposition as a, applyAttachmentMarkerBudget as i, prepareFileContextFromMedia as n, renderInboundDocumentContext as r, extractFileContext as t };
