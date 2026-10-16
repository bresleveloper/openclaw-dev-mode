import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { u as toImageDataUrl } from "./image-assets-DT0442If.mjs";
import { t as createOpenAiCompatibleImageGenerationProvider } from "./image-generation-OBYa9Syc.mjs";
import { t as XAI_BASE_URL } from "./model-definitions-BTg9V4Hq.mjs";
import { c as createXaiImageGenerationProviderMetadata, i as XAI_SUPPORTED_IMAGE_ASPECT_RATIOS, r as XAI_IMAGE_DEFAULT_TIMEOUT_MS } from "./capability-provider-metadata-factory-C2QQ6-HN.mjs";
import "./capability-provider-metadata-DnlCiTAP.mjs";
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
export { buildXaiImageGenerationProvider as t };
