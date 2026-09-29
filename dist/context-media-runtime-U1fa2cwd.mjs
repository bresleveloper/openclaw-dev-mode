import { r as MAX_IMAGE_BYTES } from "./constants-DUxuqQz8.mjs";
import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-BEHTU0wM.mjs";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-DhkMOJXD.mjs";
import { n as sanitizeImageBlocks } from "./tool-images-DaImiJKX.mjs";
import { n as readPersistedMediaImageLayout, t as readPersistedImageBlockFactIndexes } from "./prompt-image-metadata-DjWY92MN.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DkN5in9o.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-CfRBR4Iu.mjs";
import { n as prepareFileContextFromMedia } from "./file-context-DOBCPO5g.mjs";
import { t as buildInboundMediaNoteProjection } from "./media-note-CZLRM5qk.mjs";
import { n as detectAndLoadPromptImages, t as buildPromptImageFailureNotice } from "./images-YAaF7CDR.mjs";
//#region src/agents/harness/context-media-runtime.ts
/** Restores model input without changing the canonical source row or invoking channel delivery. */
async function prepareHarnessContextMedia(params) {
	params.assertCurrent();
	if (params.message.role !== "user" || params.maxChars <= 0) return { images: [] };
	if (!Number.isFinite(params.maxChars)) throw new Error("Context media requires a finite character budget");
	const message = params.message;
	const media = readPersistedMediaFacts(message) ?? [];
	const inlineImages = Array.isArray(message.content) ? message.content.filter((part) => part.type === "image") : [];
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
	const text = [files.text];
	if (imageFacts.length || inlineImages.length) text.push(buildInboundMediaNoteProjection({ media: imageFacts }).text ?? "[Image attachment]");
	if (!params.modelInput.includes("image")) {
		if (imageFacts.length || inlineImages.length || files.images.length) text.push("[Attachment images omitted: this model does not support image input]");
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
		sourceIndex: rawImages.imageFactIndexes[index] ?? media.length + index,
		sequence: index
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
			sourceIndex: page.attachmentIndex,
			sequence: entries.length
		});
	}
	if (failedImages) text.push(buildPromptImageFailureNotice(failedImages));
	if ((imageFacts.length || inlineImages.length) && !rawImages.images.length && !rawImages.failedMediaCount) text.push("[Referenced image contents are not included in this context]");
	return {
		text: text.filter(Boolean).join("\n\n"),
		images: entries.toSorted((left, right) => left.sourceIndex - right.sourceIndex || left.sequence - right.sequence).map(({ image }) => image)
	};
}
//#endregion
export { prepareHarnessContextMedia };
