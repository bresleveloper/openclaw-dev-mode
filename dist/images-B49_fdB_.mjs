import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as MAX_VIDEO_BYTES } from "./constants-DUxuqQz8.mjs";
import { a as safeFileURLToPath, t as assertNoWindowsNetworkPath } from "./local-file-access-B6bU8SNO.mjs";
import { d as normalizeMimeType } from "./mime-1zBUMwu6.mjs";
import { c as isVideoMediaFact, d as readPersistedMediaFacts, f as readRuntimePromptImageOrder, l as normalizeMediaFacts, n as attachRuntimePromptMediaFacts, o as isImageMediaFact, p as readRuntimePromptMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-BNUXOhfF.mjs";
import { n as sanitizeImageBlocks } from "./tool-images-DaImiJKX.mjs";
import { n as readPersistedMediaImageLayout, t as readPersistedImageBlockFactIndexes } from "./prompt-image-metadata-DjWY92MN.mjs";
import { s as getMediaDir } from "./store-BrX2xbJz.mjs";
import { s as resolveMediaReferenceLocalPath } from "./media-reference-C0dWWfb0.mjs";
import { n as loadWebMedia } from "./web-media-BGRqIyLZ.mjs";
import { t as log } from "./logger-Cp6WXSpQ.mjs";
import { t as finalizeRuntimePromptImages } from "./runtime-prompt-image-provenance-a6jbLyXX.mjs";
import { n as resolveSandboxedBridgeMediaPath, t as createSandboxBridgeReadFile } from "./sandbox-media-paths-m1zt96Ur.mjs";
import { i as resolveMediaFactLocalRef, r as isOpenClawCliImageCachePath, t as collectMediaImageRefs } from "./images.media-refs-B62GCpdx.mjs";
import path from "node:path";
//#region src/agents/embedded-agent-runner/run/images.ts
const IMAGE_EXTENSION_NAMES = [
	"png",
	"jpg",
	"jpeg",
	"gif",
	"webp",
	"bmp",
	"tiff",
	"tif",
	"heic",
	"heif"
];
const IMAGE_EXTENSIONS = new Set(IMAGE_EXTENSION_NAMES.map((ext) => `.${ext}`));
const IMAGE_EXTENSION_PATTERN = IMAGE_EXTENSION_NAMES.join("|");
const FILE_URL_REGEX_SOURCE = "file://[^\\s<>\"'`\\]]+\\.(?:" + IMAGE_EXTENSION_PATTERN + ")";
const WINDOWS_DRIVE_PATH_REGEX_SOURCE = "(?:^|\\s|[\"'`(])([A-Za-z]:[\\\\/][^\\s\"'`()\\[\\]]*\\.(?:" + IMAGE_EXTENSION_PATTERN + "))";
const PATH_REGEX_SOURCE = "(?:^|\\s|[\"'`(])((\\.\\.?/|[~/])[^\\s\"'`()\\[\\]]*\\.(?:" + IMAGE_EXTENSION_PATTERN + "))";
const FILE_URL_PATTERN = new RegExp(FILE_URL_REGEX_SOURCE, "gi");
const WINDOWS_DRIVE_PATH_PATTERN = new RegExp(WINDOWS_DRIVE_PATH_REGEX_SOURCE, "gi");
const PATH_PATTERN = new RegExp(PATH_REGEX_SOURCE, "gi");
const LEGACY_ATTACHMENT_MARKER_PATTERN = /\[(?:media attached(?:\s+\d+\/\d+)?:|Image:\s*source:)\s*[^\]]+\]/gi;
function isImageExtension(filePath) {
	return IMAGE_EXTENSIONS.has(normalizeLowercaseStringOrEmpty(path.extname(filePath)));
}
function normalizeRefForDedupe(raw) {
	const projected = process.platform === "darwin" && raw.startsWith("/private/var/") ? raw.slice(8) : raw;
	return process.platform === "win32" ? normalizeLowercaseStringOrEmpty(projected) : projected;
}
async function sanitizeImageEntriesWithLog(entries, label, imageSanitization) {
	const sanitized = [];
	let dropped = 0;
	let failedMediaCount = 0;
	for (const entry of entries) {
		const result = await sanitizeImageBlocks([entry.image], label, imageSanitization);
		const image = result.images[0];
		if (image) sanitized.push({
			image,
			factIndex: entry.factIndex
		});
		dropped += result.dropped;
		if (result.dropped > 0 && entry.factIndex !== null) failedMediaCount++;
	}
	if (dropped > 0) log.warn(`Native image: dropped ${dropped} image(s) after sanitization (${label}).`);
	return {
		entries: sanitized,
		failedMediaCount
	};
}
/** Detects explicit local image paths and file URLs in user prompt text. */
function detectImageReferences(prompt) {
	const refs = [];
	const seen = /* @__PURE__ */ new Set();
	const pathPrompt = prompt.replace(LEGACY_ATTACHMENT_MARKER_PATTERN, (marker) => " ".repeat(marker.length));
	const addPathRef = (raw) => {
		const trimmed = raw.trim();
		const dedupeKey = normalizeRefForDedupe(trimmed);
		if (!trimmed || seen.has(dedupeKey)) return;
		if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return;
		if (!isImageExtension(trimmed)) return;
		try {
			assertNoWindowsNetworkPath(trimmed, "Image path");
		} catch {
			return;
		}
		const resolved = trimmed.startsWith("~") ? resolveUserPath(trimmed) : trimmed;
		if (isOpenClawCliImageCachePath(resolved)) return;
		seen.add(dedupeKey);
		refs.push({
			raw: trimmed,
			type: "path",
			resolved
		});
	};
	FILE_URL_PATTERN.lastIndex = 0;
	WINDOWS_DRIVE_PATH_PATTERN.lastIndex = 0;
	PATH_PATTERN.lastIndex = 0;
	let match;
	while ((match = FILE_URL_PATTERN.exec(pathPrompt)) !== null) {
		const raw = match[0];
		const dedupeKey = normalizeRefForDedupe(raw);
		if (seen.has(dedupeKey)) continue;
		try {
			const resolved = safeFileURLToPath(raw);
			if (isOpenClawCliImageCachePath(resolved)) continue;
			seen.add(dedupeKey);
			refs.push({
				raw,
				type: "path",
				resolved
			});
		} catch {
			continue;
		}
	}
	while ((match = WINDOWS_DRIVE_PATH_PATTERN.exec(pathPrompt)) !== null) if (match[1]) addPathRef(match[1]);
	while ((match = PATH_PATTERN.exec(pathPrompt)) !== null) if (match[1]) addPathRef(match[1]);
	return refs;
}
function refDedupeKey(ref, workspaceDir) {
	const resolved = ref.type === "path" && workspaceDir && !path.isAbsolute(ref.resolved) ? path.resolve(workspaceDir, ref.resolved) : ref.resolved;
	return `${ref.type}\0${normalizeRefForDedupe(resolved)}`;
}
function rawAliasDedupeKey(alias) {
	return path.isAbsolute(alias) || /^[A-Za-z]:[\\/]/.test(alias) || /^[a-z][a-z0-9+.-]*:/i.test(alias) ? normalizeRefForDedupe(alias) : void 0;
}
async function loadMediaFromRef(ref, workspaceDir, options) {
	options?.signal?.throwIfAborted();
	const redactedRef = redactSensitiveText(ref.raw || ref.resolved);
	try {
		let targetPath = ref.resolved;
		if (!options?.sandbox) targetPath = await resolveMediaReferenceLocalPath(targetPath);
		if (options?.sandbox) try {
			targetPath = (await resolveSandboxedBridgeMediaPath({
				sandbox: {
					root: options.sandbox.root,
					bridge: options.sandbox.bridge,
					workspaceOnly: options.workspaceOnly
				},
				mediaPath: targetPath,
				inboundFallbackDir: "media/inbound"
			})).resolved;
		} catch (err) {
			log.warn(`${options?.label ?? "Native media"}: sandbox validation failed for ${redactedRef}: ${redactSensitiveText(formatErrorMessage(err))}`);
			return null;
		}
		else if (!path.isAbsolute(targetPath)) targetPath = path.resolve(workspaceDir, targetPath);
		const media = options?.sandbox ? await loadWebMedia(targetPath, {
			maxBytes: options.maxBytes,
			sandboxValidated: true,
			readFile: createSandboxBridgeReadFile({ sandbox: options.sandbox })
		}) : await loadWebMedia(targetPath, options?.workspaceOnly || options?.localRoots ? {
			maxBytes: options.maxBytes,
			localRoots: options.localRoots ?? [workspaceDir]
		} : options?.maxBytes);
		options?.signal?.throwIfAborted();
		return media;
	} catch (err) {
		options?.signal?.throwIfAborted();
		log.warn(`${options?.label ?? "Native media"}: failed to load ${redactedRef}: ${redactSensitiveText(formatErrorMessage(err))}`);
		return null;
	}
}
async function loadImageFromRef(ref, workspaceDir, options) {
	const media = await loadMediaFromRef(ref, workspaceDir, {
		...options,
		label: "Native image"
	});
	if (!media || media.kind !== "image") return null;
	return {
		type: "image",
		data: media.buffer.toString("base64"),
		mimeType: media.contentType ?? "image/jpeg"
	};
}
async function detectAndLoadPromptImages(params) {
	if (!params.model.input?.includes("image")) return {
		images: [],
		imageFactIndexes: [],
		detectedRefs: [],
		failedMediaCount: 0,
		loadedCount: 0,
		skippedCount: 0
	};
	const message = await params.userTurnTranscriptRecorder?.resolveMessage();
	const media = normalizeMediaFacts((message ? readPersistedMediaFacts(message) : void 0) ?? params.media);
	const mediaImageLayout = (message ? readPersistedMediaImageLayout(message) : void 0) ?? params.mediaImageLayout;
	const suppressed = /* @__PURE__ */ new Set([...mediaImageLayout?.suppressedFactIndexes ?? [], ...media.flatMap((fact, index) => fact.hydrationSuppressed === true ? [index] : [])]);
	const imageFactIndexes = media.flatMap((fact, factIndex) => isImageMediaFact(fact) && !suppressed.has(factIndex) ? [factIndex] : []);
	const refs = collectMediaImageRefs(media);
	const refsByFact = new Map(refs.flatMap((ref) => ref ? [[ref.factIndex, ref]] : []));
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
		const exact = factIndex === void 0 ? -1 : unusedExisting.findIndex((entry) => entry.factIndex === factIndex);
		const index = exact >= 0 ? exact : allowUnowned ? unusedExisting.findIndex((entry) => entry.factIndex === null) : -1;
		return index >= 0 ? unusedExisting.splice(index, 1)[0] : void 0;
	};
	const availableRefs = refs.filter((ref) => Boolean(ref));
	const attachmentRefs = slots.flatMap((slot) => slot.kind === "offloaded" && slot.factIndex !== void 0 ? refsByFact.get(slot.factIndex) ?? [] : []);
	const attachmentKeys = new Set(attachmentRefs.map((ref) => refDedupeKey(ref, ref.workspaceDir ?? params.workspaceDir)));
	const attachmentRawKeys = new Set(attachmentRefs.flatMap((ref) => ref.aliases.flatMap((alias) => rawAliasDedupeKey(alias) ?? [])));
	const promptRefs = detectImageReferences(params.prompt).filter((ref) => !attachmentRawKeys.has(rawAliasDedupeKey(ref.raw) ?? "") && !attachmentKeys.has(refDedupeKey(ref, params.workspaceDir)));
	const detectedRefs = [...availableRefs.flatMap(({ detect, hydrate, raw, type, resolved }) => detect !== false && (hydrate || !resolved.startsWith("http://") && !resolved.startsWith("https://")) ? [{
		raw,
		type,
		resolved
	}] : []), ...promptRefs];
	let loadedCount = 0;
	let failedMediaCount = 0;
	let skippedCount = 0;
	const loadRef = async (ref, attachment = false) => {
		const gatewayAttachment = attachment && Boolean(getAgentWorkspaceAccess(params.agentWorkspaceDir ?? params.workspaceDir, "prepareTurnAttachments")?.prepareTurnAttachments);
		const image = await loadImageFromRef(ref, ref.workspaceDir ?? params.workspaceDir, {
			maxBytes: params.maxBytes,
			workspaceOnly: params.workspaceOnly,
			localRoots: gatewayAttachment ? [getMediaDir()] : params.localRoots ?? (params.workspaceOnly ? [params.workspaceDir] : void 0),
			sandbox: gatewayAttachment ? void 0 : params.sandbox
		});
		if (image) {
			loadedCount++;
			log.debug(`Native image: loaded ${ref.type} ${ref.resolved}`);
		} else skippedCount++;
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
		if ((ref?.hydrate || slot.kind === "inline") && !image) failedMediaCount++;
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
	const sanitizedPromptImages = await sanitizeImageEntriesWithLog(promptImages, "prompt:images", {
		maxBytes: params.maxBytes,
		maxDimensionPx: params.maxDimensionPx
	});
	return {
		...finalizeRuntimePromptImages(sanitizedPromptImages.entries),
		detectedRefs,
		failedMediaCount: failedMediaCount + sanitizedPromptImages.failedMediaCount,
		loadedCount,
		skippedCount
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
	const gatewayAttachment = Boolean(getAgentWorkspaceAccess(options.agentWorkspaceDir ?? options.workspaceDir, "prepareTurnAttachments")?.prepareTurnAttachments);
	const loaded = ref ? await loadMediaFromRef(ref, fact.workspaceDir ?? options.workspaceDir, {
		label: "Native video",
		maxBytes: budget.remaining,
		signal: options.signal,
		workspaceOnly: options.workspaceOnly,
		localRoots: gatewayAttachment ? [getMediaDir()] : options.localRoots ?? (options.workspaceOnly ? [options.workspaceDir] : void 0),
		sandbox: gatewayAttachment ? void 0 : options.sandbox
	}) : null;
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
			prompt: "",
			media: resolvedMedia,
			workspaceDir: options.workspaceDir,
			agentWorkspaceDir: options.agentWorkspaceDir,
			model: options.model,
			existingImages,
			existingImageFactIndexes: readPersistedImageBlockFactIndexes(message),
			mediaImageLayout,
			maxBytes: options.maxBytes,
			maxDimensionPx: options.maxDimensionPx,
			workspaceOnly: options.workspaceOnly,
			localRoots: options.localRoots,
			sandbox: options.sandbox
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
				...message.runtimeContextCarrier ? { runtimeContextCarrier: true } : {}
			};
			continue;
		}
		const nextMeta = meta && typeof meta === "object" && !Array.isArray(meta) ? { ...meta } : {};
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
		workspaceDir: params.workspaceDir,
		agentWorkspaceDir: params.agentWorkspaceDir,
		model: { input: ["text", "image"] },
		workspaceOnly: params.workspaceOnly,
		localRoots: params.localRoots,
		sandbox: params.sandbox,
		provider: true,
		signal: params.signal,
		onCurrentTurnImageFailure: params.onCurrentTurnImageFailure
	});
	params.signal?.throwIfAborted();
	return messages === params.context.messages ? params.context : {
		...params.context,
		messages
	};
}
//#endregion
export { materializeProviderContext as a, hydratePromptMediaMessages as i, detectAndLoadPromptImages as n, detectImageReferences as r, buildPromptImageFailureNotice as t };
