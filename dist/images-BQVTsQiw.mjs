import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as MAX_VIDEO_BYTES } from "./constants-GzjKtFvA.mjs";
import { d as normalizeMimeType } from "./mime-C3j3dfQb.mjs";
import { f as readPersistedMediaFacts, l as isVideoMediaFact, m as readRuntimePromptMediaFacts, n as applyRunHydrationSuppression, p as readRuntimePromptImageOrder, r as attachRuntimePromptMediaFacts, s as isImageMediaFact, u as normalizeMediaFacts } from "./media-facts-BIPREXi-.mjs";
import { n as readPersistedMediaImageLayout, t as readPersistedImageBlockFactIndexes } from "./prompt-image-metadata-CXanuHpz.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { n as sanitizeImageBlocks } from "./tool-images-dsyNDL1H.mjs";
import { s as getMediaDir } from "./store-BOkrav0N.mjs";
import { i as resolveMediaReferenceLocalPath } from "./media-reference-Dlq4zAi4.mjs";
import { n as loadWebMedia } from "./web-media-Dv3ATZ34.mjs";
import { n as resolveSandboxedBridgeMediaPath, t as createSandboxBridgeReadFile } from "./sandbox-media-paths-BmuUpaoy.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { t as finalizeRuntimePromptImages } from "./runtime-prompt-image-provenance-DfZxZge1.mjs";
import { i as resolveMediaFactLocalRef, n as isOpenClawCliImageCachePath, r as mediaFactToImageRef } from "./images.media-refs-CKLFlAQM.mjs";
import path from "node:path";
import { assertNoWindowsNetworkPath, safeFileURLToPath } from "@openclaw/fs-safe/advanced";
//#region src/agents/embedded-agent-runner/run/images.ts
const IMAGE_EXTENSION_PATTERN = "png|jpg|jpeg|gif|webp|bmp|tiff|tif|heic|heif";
const FILE_URL_REGEX_SOURCE = "file://[^\\s<>\"'`\\]]+\\.(?:" + IMAGE_EXTENSION_PATTERN + ")";
const WINDOWS_DRIVE_PATH_REGEX_SOURCE = "(?:^|\\s|[\"'`(])([A-Za-z]:[\\\\/][^\\s\"'`()\\[\\]]*\\.(?:" + IMAGE_EXTENSION_PATTERN + "))";
const PATH_REGEX_SOURCE = "(?:^|\\s|[\"'`(])((\\.\\.?/|[~/])[^\\s\"'`()\\[\\]]*\\.(?:" + IMAGE_EXTENSION_PATTERN + "))";
const FILE_URL_PATTERN = new RegExp(FILE_URL_REGEX_SOURCE, "gi");
const WINDOWS_DRIVE_PATH_PATTERN = new RegExp(WINDOWS_DRIVE_PATH_REGEX_SOURCE, "gi");
const PATH_PATTERN = new RegExp(PATH_REGEX_SOURCE, "gi");
const LEGACY_ATTACHMENT_MARKER_PATTERN = /\[(?:media attached(?:\s+\d+\/\d+)?:|Image:\s*source:)\s*[^\]]+\]/gi;
function normalizeRefForDedupe(raw) {
	const projected = process.platform === "darwin" && raw.startsWith("/private/var/") ? raw.slice(8) : raw;
	return process.platform === "win32" ? normalizeLowercaseStringOrEmpty(projected) : projected;
}
/** Detects explicit local image paths and file URLs in user prompt text. */
function detectImageReferences(prompt) {
	const refs = [];
	const seen = /* @__PURE__ */ new Set();
	const pathPrompt = prompt.replace(LEGACY_ATTACHMENT_MARKER_PATTERN, (marker) => " ".repeat(marker.length));
	const addPathRef = (raw, fileUrl) => {
		const trimmed = raw.trim();
		const dedupeKey = normalizeRefForDedupe(trimmed);
		if (!trimmed || seen.has(dedupeKey)) return;
		if (!fileUrl && !path.extname(trimmed)) return;
		let resolved = trimmed;
		try {
			if (fileUrl) resolved = safeFileURLToPath(trimmed);
			else assertNoWindowsNetworkPath(trimmed, "Image path");
		} catch {
			return;
		}
		if (!fileUrl && trimmed.startsWith("~")) resolved = resolveUserPath(trimmed);
		if (isOpenClawCliImageCachePath(resolved)) return;
		seen.add(dedupeKey);
		refs.push({
			raw: trimmed,
			type: "path",
			resolved
		});
	};
	for (const [pattern, group, fileUrl] of [
		[
			FILE_URL_PATTERN,
			0,
			true
		],
		[
			WINDOWS_DRIVE_PATH_PATTERN,
			1,
			false
		],
		[
			PATH_PATTERN,
			1,
			false
		]
	]) {
		pattern.lastIndex = 0;
		let match;
		while ((match = pattern.exec(pathPrompt)) !== null) if (match[group]) addPathRef(match[group], fileUrl);
	}
	return refs;
}
function applySandboxStagedImagePaths(selected, attemptMedia) {
	const stagedByUrl = /* @__PURE__ */ new Map();
	for (const fact of attemptMedia ?? []) if (fact.staged === true && fact.path && fact.url?.startsWith("media://")) stagedByUrl.set(fact.url, fact.path);
	if (stagedByUrl.size === 0) return selected;
	return selected.map((fact) => {
		const stagedPath = fact.url ? stagedByUrl.get(fact.url) : void 0;
		if (!stagedPath || fact.hydrationSuppressed === true) return fact;
		return {
			...fact,
			path: stagedPath,
			staged: true
		};
	});
}
function refDedupeKey(ref, workspaceDir) {
	const resolved = ref.type === "path" && workspaceDir && !path.isAbsolute(ref.resolved) ? path.resolve(workspaceDir, ref.resolved) : ref.resolved;
	return `${ref.type}\0${normalizeRefForDedupe(resolved)}`;
}
function rawAliasDedupeKey(alias) {
	return path.isAbsolute(alias) || /^[A-Za-z]:[\\/]/.test(alias) || /^[a-z][a-z0-9+.-]*:/i.test(alias) ? normalizeRefForDedupe(alias) : void 0;
}
async function loadMediaFromRef(ref, options, label, attachment = false) {
	options.signal?.throwIfAborted();
	const gatewayAttachment = attachment && Boolean(getAgentWorkspaceAccess(options.agentWorkspaceDir ?? options.workspaceDir, "prepareTurnAttachments")?.prepareTurnAttachments);
	const sandbox = gatewayAttachment ? void 0 : options.sandbox;
	const localRoots = gatewayAttachment ? [getMediaDir()] : options.localRoots ?? (options.workspaceOnly ? [options.workspaceDir] : void 0);
	const redactedRef = redactSensitiveText(ref.raw || ref.resolved);
	try {
		let targetPath = ref.resolved;
		if (!sandbox) targetPath = await resolveMediaReferenceLocalPath(targetPath);
		if (sandbox) try {
			targetPath = (await resolveSandboxedBridgeMediaPath({
				sandbox: {
					...sandbox,
					workspaceOnly: options.workspaceOnly
				},
				mediaPath: targetPath,
				inboundFallbackDir: "media/inbound"
			})).resolved;
		} catch (err) {
			log.warn(`${label}: sandbox validation failed for ${redactedRef}: ${redactSensitiveText(formatErrorMessage(err))}`);
			return null;
		}
		else if (!path.isAbsolute(targetPath)) targetPath = path.resolve(ref.workspaceDir ?? options.workspaceDir, targetPath);
		const media = sandbox ? await loadWebMedia(targetPath, {
			maxBytes: options.maxBytes,
			sandboxValidated: true,
			readFile: createSandboxBridgeReadFile({ sandbox })
		}) : await loadWebMedia(targetPath, localRoots ? {
			maxBytes: options.maxBytes,
			localRoots
		} : options.maxBytes);
		options.signal?.throwIfAborted();
		return media;
	} catch (err) {
		options.signal?.throwIfAborted();
		log.warn(`${label}: failed to load ${redactedRef}: ${redactSensitiveText(formatErrorMessage(err))}`);
		return null;
	}
}
async function detectAndLoadPromptImages(params) {
	const counts = {
		failedMediaCount: 0,
		loadedCount: 0,
		skippedCount: 0
	};
	if (!params.model.input?.includes("image")) return {
		images: [],
		imageFactIndexes: [],
		detectedRefs: [],
		...counts
	};
	const message = await params.userTurnTranscriptRecorder?.resolveMessage();
	const recordedMedia = message ? readPersistedMediaFacts(message) : void 0;
	const media = applySandboxStagedImagePaths(normalizeMediaFacts(recordedMedia ? applyRunHydrationSuppression(recordedMedia, params.media) : params.media), params.sandbox ? params.media : void 0);
	const mediaImageLayout = (message ? readPersistedMediaImageLayout(message) : void 0) ?? params.mediaImageLayout;
	const suppressed = /* @__PURE__ */ new Set([...mediaImageLayout?.suppressedFactIndexes ?? [], ...media.flatMap((fact, index) => fact.hydrationSuppressed === true ? [index] : [])]);
	const imageFactIndexes = media.flatMap((fact, factIndex) => isImageMediaFact(fact) && !suppressed.has(factIndex) ? [factIndex] : []);
	const refs = media.map(mediaFactToImageRef).filter((ref) => Boolean(ref));
	const refsByFact = new Map(refs.map((ref) => [ref.factIndex, ref]));
	const inferredSlots = (() => {
		if (params.imageOrder?.length === imageFactIndexes.length) return params.imageOrder.map((kind, index) => ({
			kind,
			factIndex: imageFactIndexes[index]
		}));
		if (params.imageOrder?.length) {
			const pending = [...imageFactIndexes];
			return [...params.imageOrder.map((kind) => ({
				kind,
				...kind === "offloaded" && pending.length ? { factIndex: pending.shift() } : {}
			})), ...pending.map((factIndex) => ({
				kind: "offloaded",
				factIndex
			}))];
		}
		return imageFactIndexes.map((factIndex, imageIndex) => ({
			factIndex,
			kind: !media[factIndex]?.path && !media[factIndex]?.url && imageIndex < (params.existingImages?.length ?? 0) ? "inline" : "offloaded"
		}));
	})();
	const slots = mediaImageLayout?.slots.length ? mediaImageLayout.slots.filter((slot) => slot.factIndex === void 0 || !suppressed.has(slot.factIndex)) : inferredSlots;
	const layoutInlineIndexes = (mediaImageLayout?.slots ?? slots).flatMap((slot) => slot.kind === "inline" ? [slot.factIndex ?? null] : []);
	const existingIndexes = (message ? readPersistedImageBlockFactIndexes(message) : void 0) ?? params.existingImageFactIndexes ?? (layoutInlineIndexes.length === (params.existingImages?.length ?? 0) ? layoutInlineIndexes : params.existingImages?.map(() => null));
	const unusedExisting = (params.existingImages ?? []).map((image, index) => ({
		image,
		factIndex: existingIndexes?.[index] ?? null
	})).filter((entry) => entry.factIndex === null || !suppressed.has(entry.factIndex));
	const takeExisting = (factIndex, allowUnowned) => {
		const exact = unusedExisting.findIndex((entry) => entry.factIndex === factIndex);
		const index = exact >= 0 ? exact : allowUnowned ? unusedExisting.findIndex((entry) => entry.factIndex === null) : -1;
		return index >= 0 ? unusedExisting.splice(index, 1)[0] : void 0;
	};
	const attachmentRefs = slots.flatMap((slot) => slot.kind === "offloaded" && slot.factIndex !== void 0 ? refsByFact.get(slot.factIndex) ?? [] : []);
	const attachmentKeys = new Set(attachmentRefs.map((ref) => refDedupeKey(ref, ref.workspaceDir ?? params.workspaceDir)));
	const attachmentRawKeys = new Set(attachmentRefs.flatMap((ref) => ref.aliases.flatMap((alias) => rawAliasDedupeKey(alias) ?? [])));
	const promptRefs = detectImageReferences(params.prompt).filter((ref) => !attachmentRawKeys.has(rawAliasDedupeKey(ref.raw) ?? "") && !attachmentKeys.has(refDedupeKey(ref, params.workspaceDir)));
	const detectedRefs = [...refs.flatMap(({ detect, hydrate, raw, type, resolved }) => detect !== false && (hydrate || !resolved.startsWith("http://") && !resolved.startsWith("https://")) ? [{
		raw,
		type,
		resolved
	}] : []), ...promptRefs];
	const loadRef = async (ref, attachment = false) => {
		const loadedMedia = await loadMediaFromRef(ref, {
			...params,
			signal: void 0
		}, "Native image", attachment);
		if (!loadedMedia || loadedMedia.kind !== "image") {
			counts.skippedCount++;
			return null;
		}
		const image = {
			type: "image",
			data: loadedMedia.buffer.toString("base64"),
			mimeType: loadedMedia.contentType ?? "image/jpeg"
		};
		counts.loadedCount++;
		log.debug(`Native image: loaded ${ref.type} ${ref.resolved}`);
		return image;
	};
	const promptImages = [];
	for (const slot of slots) {
		const existing = takeExisting(slot.factIndex, slot.kind === "inline");
		if (existing) {
			promptImages.push(existing);
			continue;
		}
		const ref = slot.factIndex === void 0 ? void 0 : refsByFact.get(slot.factIndex);
		const image = ref?.hydrate ? await loadRef(ref, true) : null;
		if ((ref?.hydrate || slot.kind === "inline") && !image) counts.failedMediaCount++;
		if (image) promptImages.push({
			image,
			factIndex: ref?.factIndex ?? null
		});
	}
	promptImages.push(...unusedExisting);
	for (const ref of promptRefs) {
		const image = await loadRef(ref);
		if (image) promptImages.push({
			image,
			factIndex: null
		});
	}
	const imageSanitization = {
		maxBytes: params.maxBytes,
		maxDimensionPx: params.maxDimensionPx,
		verifyDecodability: true
	};
	const sanitized = [];
	let dropped = 0;
	for (const entry of promptImages) {
		const result = await sanitizeImageBlocks([entry.image], "prompt:images", imageSanitization);
		const image = result.images[0];
		if (image) sanitized.push({
			image,
			factIndex: entry.factIndex
		});
		dropped += result.dropped;
		if (result.dropped > 0 && entry.factIndex !== null) counts.failedMediaCount++;
	}
	if (dropped > 0) log.warn(`Native image: dropped ${dropped} image(s) after sanitization (prompt:images).`);
	return {
		...finalizeRuntimePromptImages(sanitized),
		detectedRefs,
		...counts
	};
}
function buildPromptImageFailureNotice(count) {
	return `System note: ${count} image attachment${count === 1 ? "" : "s"} could not be loaded; their image contents are unavailable. Tell the user and ask them to resend ${count === 1 ? "the image" : "the images"}; do not claim inspection.`;
}
const VIDEO_OMISSION = {
	unsupported: "(video omitted: provider does not support native video)",
	unavailable: "(video omitted: source unavailable)",
	invalid: "(video omitted: invalid video MIME type)",
	limit: "(video omitted: native video byte limit exceeded)"
};
async function materializeVideoFact(fact, budget, options) {
	if ((fact.sizeBytes ?? 0) > budget.remaining) return {
		type: "text",
		text: VIDEO_OMISSION.limit
	};
	const ref = resolveMediaFactLocalRef(fact);
	const loaded = ref ? await loadMediaFromRef({
		...ref,
		workspaceDir: fact.workspaceDir
	}, {
		...options,
		maxBytes: budget.remaining
	}, "Native video", true) : null;
	if (!loaded) return {
		type: "text",
		text: VIDEO_OMISSION.unavailable
	};
	const mimeType = normalizeMimeType(loaded.contentType);
	if (loaded.kind !== "video" || !mimeType?.startsWith("video/")) return {
		type: "text",
		text: VIDEO_OMISSION.invalid
	};
	if (loaded.buffer.length > budget.remaining) return {
		type: "text",
		text: VIDEO_OMISSION.limit
	};
	budget.remaining -= loaded.buffer.length;
	return {
		type: "video",
		data: loaded.buffer.toString("base64"),
		mimeType
	};
}
async function projectOrderedPromptMedia(params) {
	const generatedMarkers = new Set(Object.values(VIDEO_OMISSION));
	const projected = params.content.filter((block) => block.type === "text" && !generatedMarkers.has(block.text));
	if (!params.media.some(isVideoMediaFact)) return [...projected, ...params.images];
	const imagesByFact = /* @__PURE__ */ new Map();
	const factlessImages = [];
	params.images.forEach((image, index) => {
		const factIndex = params.imageFactIndexes[index];
		if (factIndex == null) factlessImages.push(image);
		else imagesByFact.set(factIndex, [...imagesByFact.get(factIndex) ?? [], image]);
	});
	for (const [factIndex, fact] of params.media.entries()) if (isImageMediaFact(fact)) projected.push(...imagesByFact.get(factIndex) ?? []);
	else if (isVideoMediaFact(fact)) projected.push(params.options.provider ? await materializeVideoFact(fact, params.budget, params.options) : {
		type: "text",
		text: VIDEO_OMISSION.unsupported
	});
	projected.push(...factlessImages);
	return projected;
}
/** Hydrates exact-message media facts for canonical replay or one provider call. */
async function materializePromptMediaMessages(messages, options) {
	let hydrated;
	const videoBudget = { remaining: MAX_VIDEO_BYTES };
	const activeUserIndex = messages.findLastIndex((message) => message.role === "user");
	for (const [index, message] of messages.entries()) {
		if (message.role !== "user") continue;
		const runtimeMedia = readRuntimePromptMediaFacts(message);
		const meta = Reflect.get(message, "__openclaw");
		const resolvedMedia = runtimeMedia ?? readPersistedMediaFacts(message) ?? [];
		const runtimeImageOrder = readRuntimePromptImageOrder(message);
		const mediaImageLayout = readPersistedMediaImageLayout(message);
		if (!resolvedMedia.length) continue;
		const content = Array.isArray(message.content) ? message.content : [{
			type: "text",
			text: message.content
		}];
		const existingImages = content.filter((block) => block.type === "image");
		const result = await detectAndLoadPromptImages({
			...options,
			prompt: "",
			media: resolvedMedia,
			existingImages,
			existingImageFactIndexes: readPersistedImageBlockFactIndexes(message),
			mediaImageLayout
		});
		const projectedContent = await projectOrderedPromptMedia({
			content,
			media: resolvedMedia,
			images: result.images,
			imageFactIndexes: result.imageFactIndexes,
			options,
			budget: videoBudget
		});
		if ((options.provider || options.onCurrentTurnImageFailure) && index === activeUserIndex && result.failedMediaCount > 0) {
			options.onCurrentTurnImageFailure?.(result.failedMediaCount);
			projectedContent.push({
				type: "text",
				text: buildPromptImageFailureNotice(result.failedMediaCount)
			});
		}
		hydrated ??= messages.slice();
		if (options.provider) {
			hydrated[index] = {
				role: "user",
				content: projectedContent,
				timestamp: message.timestamp,
				...message.runtimeContextCarrier ? { runtimeContextCarrier: true } : {},
				...message.runtimeContextCarrierRetained !== void 0 ? { runtimeContextCarrierRetained: message.runtimeContextCarrierRetained } : {}
			};
			continue;
		}
		const nextMeta = { ...asNonArrayRecord(meta) };
		if (result.images.length > 0) nextMeta.mediaImageBlockFactIndexes = result.imageFactIndexes;
		else delete nextMeta.mediaImageBlockFactIndexes;
		const hydratedMessage = {
			...message,
			content: projectedContent
		};
		if (Object.keys(nextMeta).length > 0) Reflect.set(hydratedMessage, "__openclaw", nextMeta);
		else Reflect.deleteProperty(hydratedMessage, "__openclaw");
		if (runtimeMedia) attachRuntimePromptMediaFacts(hydratedMessage, runtimeMedia, runtimeImageOrder);
		hydrated[index] = hydratedMessage;
	}
	return hydrated ?? messages;
}
/** Hydrates non-enumerable facts carried by queued user turns before canonical replay. */
async function hydratePromptMediaMessages(messages, options) {
	return await materializePromptMediaMessages(messages, options);
}
/** Materializes one transient provider context from exact-message media facts. */
async function materializeProviderContext(params) {
	const messages = await materializePromptMediaMessages(params.context.messages, {
		...params,
		model: { input: ["text", "image"] },
		provider: true
	});
	params.signal?.throwIfAborted();
	return messages === params.context.messages ? params.context : {
		...params.context,
		messages
	};
}
//#endregion
export { materializeProviderContext as a, hydratePromptMediaMessages as i, detectAndLoadPromptImages as n, detectImageReferences as r, buildPromptImageFailureNotice as t };
