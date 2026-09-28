import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { l as normalizeMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { a as normalizeAttachments, n as isImageAttachment } from "./attachments.normalize-Bc-RMc93.mjs";
import { t as stripExtractedFileImageMetadata } from "./extracted-file-images-CdmNdoIK.mjs";
import { r as resolveAgentTurnAttachments, t as collectDescribedImageAttachmentIndexes } from "./agent-turn-attachments-CLfyUFPU.mjs";
//#region src/auto-reply/reply/current-turn-images.ts
function collectCurrentImageAttachments(ctx) {
	const hydrationSuppressedIndexes = new Set(normalizeMediaFacts(ctx.media).flatMap((fact, index) => fact.hydrationSuppressed === true ? [index] : []));
	return normalizeAttachments(ctx).flatMap((attachment) => {
		if (hydrationSuppressedIndexes.has(attachment.index)) return [];
		const mediaPath = normalizeOptionalString(attachment.path);
		return mediaPath && isImageAttachment(attachment) ? [{
			...attachment,
			path: mediaPath
		}] : [];
	});
}
function appendOrderedImages(params) {
	const images = params.images ?? [];
	if (!params.imageOrder || params.imageOrder.length === 0) {
		for (const image of images) params.entries.push({
			image,
			imageOrder: "inline",
			sourceIndex: params.sourceIndex,
			sequence: params.entries.length
		});
		return;
	}
	let inlineIndex = 0;
	for (const imageOrder of params.imageOrder) params.entries.push({
		image: imageOrder === "inline" ? images[inlineIndex++] : void 0,
		imageOrder,
		sourceIndex: params.sourceIndex,
		sequence: params.entries.length
	});
	while (inlineIndex < images.length) params.entries.push({
		image: images[inlineIndex++],
		imageOrder: "inline",
		sourceIndex: params.sourceIndex,
		sequence: params.entries.length
	});
}
function resolveMergedTurnImages(entries) {
	if (entries.length === 0) return {};
	const merged = entries.toSorted((left, right) => {
		if (left.sourceIndex !== void 0 && right.sourceIndex !== void 0) return left.sourceIndex - right.sourceIndex || left.sequence - right.sequence;
		return left.sequence - right.sequence;
	});
	const images = merged.flatMap((entry) => entry.image ? [entry.image] : []);
	const result = {
		...images.length > 0 ? { images } : {},
		imageOrder: merged.map((entry) => entry.imageOrder)
	};
	Object.defineProperty(result, "imageSourceIndexes", { value: merged.map((entry) => entry.sourceIndex) });
	return result;
}
/** Resolves current-turn image attachments that were not already described by media understanding. */
async function resolveCurrentTurnImages(params) {
	const entries = [];
	appendOrderedImages({
		entries,
		images: params.images,
		imageOrder: params.imageOrder
	});
	for (const image of params.extractedFileImages ?? []) appendOrderedImages({
		entries,
		images: [stripExtractedFileImageMetadata(image)],
		sourceIndex: image.attachmentIndex
	});
	const currentImageAttachments = collectCurrentImageAttachments(params.ctx);
	if (currentImageAttachments.length === 0) return resolveMergedTurnImages(entries);
	const describedImageIndexes = collectDescribedImageAttachmentIndexes(params.ctx);
	const undescribedImageAttachments = currentImageAttachments.filter((attachment) => !describedImageIndexes.has(attachment.index));
	if (undescribedImageAttachments.length === 0) return resolveMergedTurnImages(entries);
	try {
		const resolved = await resolveAgentTurnAttachments({
			ctx: params.ctx,
			cfg: params.cfg,
			includeRecentHistoryImages: false,
			includeAttachmentIndexes: true
		});
		const images = resolved.attachments.map((attachment) => ({
			type: "image",
			data: attachment.data,
			mimeType: attachment.mediaType
		}));
		const resolvedIndexes = resolved.attachmentIndexes ?? [];
		if (images.length < undescribedImageAttachments.length) logVerbose(`agent-runner: native OpenClaw media resolution produced ${images.length}/${undescribedImageAttachments.length} current image attachment(s); retaining resolved images`);
		const imageByResolvedIndex = new Map(resolvedIndexes.map((resolvedIndex, imageIndex) => [resolvedIndex, images[imageIndex]]));
		const unresolvedSourceIndexes = [];
		for (const attachment of undescribedImageAttachments) {
			const image = imageByResolvedIndex.get(attachment.index);
			if (image) appendOrderedImages({
				entries,
				images: [image],
				sourceIndex: attachment.index
			});
			else unresolvedSourceIndexes.push(attachment.index);
		}
		const merged = resolveMergedTurnImages(entries);
		return unresolvedSourceIndexes.length > 0 ? Object.assign(merged, { unresolvedSourceIndexes }) : merged;
	} catch (error) {
		logVerbose(`agent-runner: media attachment image resolution failed, proceeding without native images: ${formatErrorMessage(error)}`);
		const merged = resolveMergedTurnImages(entries);
		return undescribedImageAttachments.length > 0 ? Object.assign(merged, { unresolvedSourceIndexes: undescribedImageAttachments.map((attachment) => attachment.index) }) : merged;
	}
}
//#endregion
export { resolveCurrentTurnImages as t };
