import { r as MAX_IMAGE_BYTES } from "./constants-GzjKtFvA.mjs";
import { f as readPersistedMediaFacts, s as isImageMediaFact } from "./media-facts-BIPREXi-.mjs";
import { n as readPersistedMediaImageLayout, t as readPersistedImageBlockFactIndexes } from "./prompt-image-metadata-CXanuHpz.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-DhkMOJXD.mjs";
import { n as sanitizeImageBlocks } from "./tool-images-dsyNDL1H.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-B-x-73co.mjs";
import { n as prepareFileContextFromMedia } from "./file-context-DYgrkUoQ.mjs";
import { n as detectAndLoadPromptImages } from "./images-BQVTsQiw.mjs";
import { t as buildInboundMediaNoteProjection } from "./media-note-CSBAq1ih.mjs";
//#region src/agents/harness/context-media-runtime.ts
/** Restores model input without changing the canonical source row or invoking channel delivery. */
async function prepareHarnessContextMedia(params) {
	params.assertCurrent();
	if (params.message.role !== "user" || params.maxChars <= 0) return { images: [] };
	if (!Number.isFinite(params.maxChars)) throw new Error("Context media requires a finite character budget");
	const message = params.message;
	const media = readPersistedMediaFacts(message) ?? [];
	const inlineImages = Array.isArray(message.content) ? message.content.flatMap((part) => part.type === "image" ? [part] : []) : [];
	if (!media.length && !inlineImages.length) return { images: [] };
	const files = await prepareFileContextFromMedia({
		media,
		config: params.config ?? {},
		workspaceDir: params.workspaceDir,
		channelId: params.channelId,
		accountId: params.accountId,
		maxChars: params.maxChars,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent();
	const imageFacts = media.filter(isImageMediaFact);
	const hasImageAttachments = imageFacts.length > 0 || inlineImages.length > 0;
	const text = [files.text];
	if (hasImageAttachments) text.push(buildInboundMediaNoteProjection({ media: imageFacts }).text ?? "[Image attachment]");
	if (!params.modelInput.includes("image")) {
		if (hasImageAttachments || files.images.length) text.push("[Attachment images omitted: this model does not support image input]");
		return {
			text: text.filter(Boolean).join("\n\n"),
			images: []
		};
	}
	const limits = {
		...resolveImageSanitizationLimits(params.config),
		maxBytes: MAX_IMAGE_BYTES
	};
	const workspaceOnly = resolveEffectiveToolFsWorkspaceOnly({
		cfg: params.config,
		agentId: params.agentId
	});
	const inlineFactIndexes = readPersistedImageBlockFactIndexes(message);
	const rawImages = await detectAndLoadPromptImages({
		prompt: "",
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		model: { input: params.modelInput },
		media,
		mediaImageLayout: readPersistedMediaImageLayout(message),
		existingImages: inlineImages,
		existingImageFactIndexes: inlineFactIndexes,
		workspaceOnly,
		localRoots: workspaceOnly ? void 0 : getAgentScopedMediaLocalRoots(params.config ?? {}, params.agentId, params.workspaceDir),
		sandbox: params.sandbox,
		...limits
	});
	params.assertCurrent();
	const entries = rawImages.images.map((image, index) => ({
		image,
		sourceIndex: rawImages.imageFactIndexes[index] ?? media.length + index
	}));
	const unownedInlineCount = inlineImages.filter((_, index) => inlineFactIndexes?.[index] == null).length;
	const retainedUnownedCount = rawImages.imageFactIndexes.filter((index) => index === null).length;
	let failedImages = rawImages.failedMediaCount + Math.max(0, unownedInlineCount - retainedUnownedCount);
	for (const page of files.images) {
		params.assertCurrent();
		const sanitized = await sanitizeImageBlocks([page], "context:file", limits);
		params.assertCurrent();
		failedImages += sanitized.dropped;
		for (const image of sanitized.images) entries.push({
			image,
			sourceIndex: page.attachmentIndex
		});
	}
	if (failedImages) text.push(`[${failedImages} referenced image${failedImages === 1 ? "" : "s"} not included in this context]`);
	if (hasImageAttachments && !rawImages.images.length && !rawImages.failedMediaCount) text.push("[Referenced image contents are not included in this context]");
	return {
		text: text.filter(Boolean).join("\n\n"),
		images: entries.toSorted((left, right) => left.sourceIndex - right.sourceIndex).map(({ image }) => image)
	};
}
//#endregion
export { prepareHarnessContextMedia };
