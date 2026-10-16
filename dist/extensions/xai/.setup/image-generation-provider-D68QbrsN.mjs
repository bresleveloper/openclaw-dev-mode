import { t as XAI_BASE_URL } from "./model-definitions-BeXcawE4.mjs";
import { c as createXaiImageGenerationProviderMetadata, i as XAI_SUPPORTED_IMAGE_ASPECT_RATIOS, r as XAI_IMAGE_DEFAULT_TIMEOUT_MS } from "./capability-provider-metadata-factory-Hx0z45WX.mjs";
import "./capability-provider-metadata-BM9IhPac.mjs";
import { normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createOpenAiCompatibleImageGenerationProvider, toImageDataUrl } from "openclaw/plugin-sdk/image-generation";
//#region extensions/xai/image-generation-provider.ts
function resolveImageForEdit(input) {
	if (!input) throw new Error("xAI image edit requires an input image.");
	const url = normalizeOptionalString(input.url);
	if (url) return url;
	if (!input.buffer) throw new Error("xAI image edit input is missing both URL and buffer data.");
	return toImageDataUrl({
		buffer: input.buffer,
		mimeType: input.mimeType
	});
}
function buildRequest(params) {
	const body = {
		model: params.model,
		prompt: params.req.prompt,
		n: Math.min(params.count, 4),
		response_format: "b64_json"
	};
	const aspect = normalizeOptionalString(params.req.aspectRatio);
	if (aspect && XAI_SUPPORTED_IMAGE_ASPECT_RATIOS.includes(aspect)) body.aspect_ratio = aspect;
	const resolution = normalizeOptionalLowercaseString(params.req.resolution);
	if (resolution) body.resolution = resolution;
	if (params.inputImages.length > 0) {
		if (params.inputImages.length > 1) body.images = params.inputImages.map((input) => ({
			url: resolveImageForEdit(input),
			type: "image_url"
		}));
		else body.image = {
			url: resolveImageForEdit(params.inputImages[0]),
			type: "image_url"
		};
	}
	return {
		kind: "json",
		body
	};
}
function buildXaiImageGenerationProvider() {
	const metadata = createXaiImageGenerationProviderMetadata();
	return createOpenAiCompatibleImageGenerationProvider({
		...metadata,
		defaultBaseUrl: XAI_BASE_URL,
		resolveAllowPrivateNetwork: () => false,
		defaultTimeoutMs: XAI_IMAGE_DEFAULT_TIMEOUT_MS,
		buildGenerateRequest: buildRequest,
		buildEditRequest: buildRequest,
		missingApiKeyError: "xAI API key missing",
		failureLabels: {
			generate: "xAI image generation failed",
			edit: "xAI image edit failed"
		}
	});
}
//#endregion
export { buildXaiImageGenerationProvider };
