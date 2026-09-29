import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CWCWnxsU.mjs";
import { l as postJsonRequest } from "./shared-BLFkM12I.mjs";
import "./number-runtime-CGwowceO.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-BdVQKAmB.mjs";
import "./media-generation-runtime-qNqD21TK.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { c as parseOpenAiCompatibleImageResponse, d as toImageDataUrl, l as resolveInlineImageJsonResponseMaxBytes, n as generatedImageAssetFromBase64, r as generatedImageAssetFromDataUrl } from "./image-generation-1hdRJmv4.mjs";
import "./provider-auth-eHeoP8se.mjs";
import { i as normalizeOpenRouterBaseUrl } from "./provider-catalog-CAdWJvAA.mjs";
import { t as resolveOpenRouterGenerationRequestContext } from "./generation-request-context-CgMoW5yv.mjs";
//#region extensions/openrouter/image-generation-provider.ts
const DEFAULT_MODEL = "google/gemini-3.1-flash-image-preview";
const DEFAULT_TIMEOUT_MS = 18e4;
const MAX_IMAGE_RESULTS = 4;
const SUPPORTED_MODELS = [
	DEFAULT_MODEL,
	"google/gemini-3-pro-image-preview",
	"openai/gpt-5.4-image-2"
];
const SUPPORTED_ASPECT_RATIOS = [
	"1:1",
	"2:3",
	"3:2",
	"3:4",
	"4:3",
	"4:5",
	"5:4",
	"9:16",
	"16:9",
	"21:9"
];
const OPENROUTER_IMAGE_MALFORMED_RESPONSE = "OpenRouter image generation response malformed";
function throwMalformedOpenRouterImageResponse() {
	throw new Error(OPENROUTER_IMAGE_MALFORMED_RESPONSE);
}
function requireOpenRouterImageRecord(value) {
	if (!isRecord(value)) throwMalformedOpenRouterImageResponse();
	return value;
}
function requireOpenRouterImageUrl(value) {
	const url = normalizeOptionalString(requireOpenRouterImageRecord(value).url);
	if (!url) throwMalformedOpenRouterImageResponse();
	return url;
}
function pushDataUrlImage(images, dataUrl, strict = true) {
	const image = generatedImageAssetFromDataUrl({
		dataUrl,
		index: images.length
	});
	if (!image) {
		if (strict) throwMalformedOpenRouterImageResponse();
		return;
	}
	images.push(image);
}
function extractImagesFromPart(images, value) {
	const part = requireOpenRouterImageRecord(value);
	if (part.type === "text") return;
	if (part.type === "image_url") {
		pushDataUrlImage(images, requireOpenRouterImageUrl(part.image_url ?? part.imageUrl));
		return;
	}
	const rawBase64 = normalizeOptionalString(part.b64_json);
	if (rawBase64) {
		const image = generatedImageAssetFromBase64({
			base64: rawBase64,
			index: images.length
		});
		if (image) {
			images.push(image);
			return;
		}
		throwMalformedOpenRouterImageResponse();
	}
	if ("b64_json" in part) throwMalformedOpenRouterImageResponse();
	const inlineData = part.inlineData ?? part.inline_data;
	if (inlineData === void 0 || inlineData === null) return;
	const inline = requireOpenRouterImageRecord(inlineData);
	const data = normalizeOptionalString(inline.data);
	if (!data) throwMalformedOpenRouterImageResponse();
	const mimeType = normalizeOptionalString(inline.mimeType) ?? normalizeOptionalString(inline.mime_type) ?? "image/png";
	const image = generatedImageAssetFromBase64({
		base64: data,
		index: images.length,
		mimeType
	});
	if (image) {
		images.push(image);
		return;
	}
	throwMalformedOpenRouterImageResponse();
}
function extractOpenRouterImagesFromResponse(body) {
	const choices = requireOpenRouterImageRecord(body).choices;
	if (choices === void 0 || choices === null) return [];
	if (!Array.isArray(choices)) throwMalformedOpenRouterImageResponse();
	const images = [];
	for (const choiceValue of choices) {
		const messageValue = requireOpenRouterImageRecord(choiceValue).message;
		if (messageValue === void 0 || messageValue === null) continue;
		const message = requireOpenRouterImageRecord(messageValue);
		const messageImages = message.images;
		if (messageImages !== void 0 && messageImages !== null) {
			if (!Array.isArray(messageImages)) throwMalformedOpenRouterImageResponse();
			for (const entryValue of messageImages) {
				const entry = requireOpenRouterImageRecord(entryValue);
				pushDataUrlImage(images, requireOpenRouterImageUrl(entry.image_url ?? entry.imageUrl));
			}
		}
		const content = message.content;
		if (typeof content === "string" && content.length > 0) for (const match of content.matchAll(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g)) pushDataUrlImage(images, match[0], false);
		else if (Array.isArray(content)) for (const part of content) extractImagesFromPart(images, part);
		else if (content !== void 0 && content !== null) throwMalformedOpenRouterImageResponse();
	}
	return images;
}
function resolveImageCount(count) {
	return resolveIntegerOption(count, 1, {
		min: 1,
		max: MAX_IMAGE_RESULTS
	});
}
function isGeminiImageModel(model) {
	return model.startsWith("google/gemini-");
}
function buildInputReferences(req) {
	return (req.inputImages ?? []).map((image) => ({
		type: "image_url",
		image_url: { url: toImageDataUrl(image) }
	}));
}
function buildDedicatedImageBody(req, model, count) {
	const body = {
		model,
		prompt: req.prompt,
		n: count
	};
	if (isGeminiImageModel(model)) {
		const aspectRatio = normalizeOptionalString(req.aspectRatio);
		if (aspectRatio) body.aspect_ratio = aspectRatio;
		const resolution = normalizeOptionalString(req.resolution);
		if (resolution) body.resolution = resolution;
	}
	const inputReferences = buildInputReferences(req);
	if (inputReferences.length > 0) body.input_references = inputReferences;
	return body;
}
function normalizeDedicatedImageResponse(payload) {
	if (!isRecord(payload) || !Array.isArray(payload.data)) return payload;
	return {
		...payload,
		data: payload.data.map((entry) => {
			if (!isRecord(entry) || entry.mime_type !== void 0 || entry.media_type === void 0) return entry;
			return {
				...entry,
				mime_type: entry.media_type
			};
		})
	};
}
function buildMessageContent(req) {
	const inputImages = req.inputImages ?? [];
	if (inputImages.length === 0) return req.prompt;
	return [{
		type: "text",
		text: req.prompt
	}, ...inputImages.map((image) => ({
		type: "image_url",
		image_url: { url: toImageDataUrl(image) }
	}))];
}
function buildImageConfig(req, model) {
	if (!isGeminiImageModel(model)) return {};
	const imageConfig = {};
	const aspectRatio = normalizeOptionalString(req.aspectRatio);
	if (aspectRatio) imageConfig.aspect_ratio = aspectRatio;
	const resolution = normalizeOptionalString(req.resolution);
	if (resolution) imageConfig.image_size = resolution;
	return imageConfig;
}
function buildOpenRouterImageGenerationProvider() {
	return {
		id: "openrouter",
		label: "OpenRouter",
		defaultModel: DEFAULT_MODEL,
		models: [...SUPPORTED_MODELS],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "openrouter",
			...ctx
		}),
		capabilities: {
			generate: {
				maxCount: MAX_IMAGE_RESULTS,
				supportsSize: false,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			edit: {
				enabled: true,
				maxCount: MAX_IMAGE_RESULTS,
				maxInputImages: 5,
				supportsSize: false,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			geometry: {
				aspectRatios: [...SUPPORTED_ASPECT_RATIOS],
				resolutions: [
					"1K",
					"2K",
					"4K"
				]
			}
		},
		async generateImage(req) {
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = await resolveOpenRouterGenerationRequestContext({
				cfg: req.cfg,
				agentDir: req.agentDir,
				authStore: req.authStore,
				capability: "image",
				jsonContentType: false
			});
			const model = normalizeOptionalString(req.model) ?? DEFAULT_MODEL;
			const imageConfig = buildImageConfig(req, model);
			const count = resolveImageCount(req.count);
			const canonicalBaseUrl = normalizeOpenRouterBaseUrl(baseUrl);
			if (canonicalBaseUrl) return {
				images: (await Promise.all(Array.from({ length: count }, async () => {
					const requestCount = 1;
					const { response, release } = await postJsonRequest({
						url: `${canonicalBaseUrl}/images`,
						headers,
						body: buildDedicatedImageBody(req, model, requestCount),
						timeoutMs: req.timeoutMs ?? DEFAULT_TIMEOUT_MS,
						fetchFn: fetch,
						allowPrivateNetwork,
						ssrfPolicy: req.ssrfPolicy,
						dispatcherPolicy
					});
					try {
						await assertOkOrThrowHttpError(response, "OpenRouter image generation failed");
						const payload = await readProviderJsonResponse(response, "openrouter.image-generation", { maxBytes: resolveInlineImageJsonResponseMaxBytes(requestCount, resolveGeneratedMediaMaxBytes(req.cfg, "image")) });
						const images = parseOpenAiCompatibleImageResponse(normalizeDedicatedImageResponse(payload), {
							malformedResponseError: OPENROUTER_IMAGE_MALFORMED_RESPONSE,
							sniffMimeType: true
						});
						if (images.length === 0) throw new Error("OpenRouter image generation response missing image data");
						return images;
					} finally {
						await release();
					}
				}))).flat(),
				model
			};
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/chat/completions`,
				headers,
				body: {
					model,
					messages: [{
						role: "user",
						content: buildMessageContent(req)
					}],
					modalities: ["image", "text"],
					n: count,
					...Object.keys(imageConfig).length > 0 ? { image_config: imageConfig } : {}
				},
				timeoutMs: req.timeoutMs ?? DEFAULT_TIMEOUT_MS,
				fetchFn: fetch,
				allowPrivateNetwork,
				ssrfPolicy: req.ssrfPolicy,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(response, "OpenRouter image generation failed");
				const images = extractOpenRouterImagesFromResponse(await readProviderJsonResponse(response, "openrouter.image-generation", { maxBytes: resolveInlineImageJsonResponseMaxBytes(count, resolveGeneratedMediaMaxBytes(req.cfg, "image")) }));
				if (images.length === 0) throw new Error("OpenRouter image generation response missing image data");
				return {
					images,
					model
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildOpenRouterImageGenerationProvider as t };
