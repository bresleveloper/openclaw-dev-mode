import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "../../number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "../../provider-http-errors-DmewLLH7.mjs";
import { n as normalizeGooglePreviewModelId } from "../../provider-model-id-normalize-Bx8UgVVS.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "../../provider-request-config-By9R9pyt.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveGeneratedMediaMaxBytes } from "../../configured-max-bytes-CtwRSse3.mjs";
import { d as postJsonRequest } from "../../shared-DcnGQdHV.mjs";
import "../../number-runtime-CgyXj1A5.mjs";
import { t as isProviderApiKeyConfigured } from "../../provider-auth-availability-BmVs5Dky.mjs";
import "../../media-generation-runtime-D1HcnVCx.mjs";
import { a as resolveApiKeyForProvider } from "../../provider-auth-runtime-CpGmMxRN.mjs";
import "../../provider-http-CuRGJD0L.mjs";
import { c as resolveInlineImageJsonResponseMaxBytes, t as generatedImageAssetFromBase64 } from "../../image-assets-DT0442If.mjs";
import "../../image-generation-OBYa9Syc.mjs";
import "../../provider-auth-C3BBF7yn.mjs";
import "../../model-id-CPDOOOMu.mjs";
import { d as createGoogleImageGenerationProviderMetadata } from "../../generation-provider-metadata-D0HXeJwn.mjs";
import { t as resolveGoogleGenerativeAiHttpRequestConfig } from "../../http-request-Bp4RpyLy.mjs";
import { n as toStandardGoogleProviderBase64 } from "../../base64-CKISTF1b.mjs";
//#region extensions/google/image-generation-provider.ts
const DEFAULT_IMAGE_TIMEOUT_MS = 18e4;
const DEFAULT_OUTPUT_MIME = "image/png";
const GOOGLE_IMAGE_MALFORMED_RESPONSE = "Google image generation response malformed";
function mapSizeToImageConfig(size) {
	const normalized = normalizeLowercaseStringOrEmpty(size);
	const aspectRatio = (/* @__PURE__ */ new Map([
		["1024x1024", "1:1"],
		["1024x1536", "2:3"],
		["1536x1024", "3:2"],
		["1024x1792", "9:16"],
		["1792x1024", "16:9"]
	])).get(normalized);
	const [widthRaw, heightRaw] = normalized.split("x");
	const width = parseStrictPositiveInteger(widthRaw);
	const height = parseStrictPositiveInteger(heightRaw);
	if (width === void 0 || height === void 0) return;
	const longestEdge = Math.max(width, height);
	const imageSize = longestEdge >= 3072 ? "4K" : longestEdge >= 1536 ? "2K" : void 0;
	if (!aspectRatio && !imageSize) return;
	return {
		...aspectRatio ? { aspectRatio } : {},
		...imageSize ? { imageSize } : {}
	};
}
function googleResponseParts(payload) {
	if (!isRecord(payload)) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
	const candidates = payload.candidates;
	if (candidates === void 0 || candidates === null) return [];
	if (!Array.isArray(candidates)) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
	const parts = [];
	for (const candidate of candidates) {
		if (!isRecord(candidate)) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
		const content = candidate.content;
		if (content === void 0 || content === null) continue;
		if (!isRecord(content)) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
		const candidateParts = content.parts;
		if (candidateParts === void 0 || candidateParts === null) continue;
		if (!Array.isArray(candidateParts)) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
		parts.push(...candidateParts);
	}
	return parts;
}
function googleInlineDataFromPart(part) {
	if (!isRecord(part)) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
	const inline = part.inlineData ?? part.inline_data;
	if (inline === void 0 || inline === null) return;
	if (!isRecord(inline)) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
	return inline;
}
function buildGoogleImageGenerationProvider() {
	return {
		...createGoogleImageGenerationProviderMetadata(),
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "google",
			...ctx
		}),
		async generateImage(req) {
			const auth = await resolveApiKeyForProvider({
				provider: "google",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("Google API key missing");
			const model = normalizeGooglePreviewModelId(req.model?.trim() || "gemini-3.1-flash-image");
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveGoogleGenerativeAiHttpRequestConfig({
				apiKey: auth.apiKey,
				baseUrl: req.cfg?.models?.providers?.google?.baseUrl,
				request: sanitizeConfiguredModelProviderRequest(req.cfg?.models?.providers?.google?.request),
				capability: "image",
				transport: "http"
			});
			const imageConfig = mapSizeToImageConfig(req.size);
			const inputParts = (req.inputImages ?? []).map((image) => ({ inlineData: {
				mimeType: image.mimeType,
				data: image.buffer.toString("base64")
			} }));
			const resolvedImageConfig = {
				...imageConfig,
				...req.aspectRatio?.trim() ? { aspectRatio: req.aspectRatio.trim() } : {},
				...req.resolution ? { imageSize: req.resolution } : {}
			};
			const { response: res, release } = await postJsonRequest({
				url: `${baseUrl}/models/${model}:generateContent`,
				headers,
				body: {
					contents: [{
						role: "user",
						parts: [...inputParts, { text: req.prompt }]
					}],
					generationConfig: {
						responseModalities: ["TEXT", "IMAGE"],
						...Object.keys(resolvedImageConfig).length > 0 ? { imageConfig: resolvedImageConfig } : {}
					}
				},
				timeoutMs: req.timeoutMs ?? DEFAULT_IMAGE_TIMEOUT_MS,
				fetchFn: fetch,
				pinDns: false,
				allowPrivateNetwork,
				ssrfPolicy: req.ssrfPolicy,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(res, "Google image generation failed");
				const payload = await readProviderJsonResponse(res, "google.image-generation", { maxBytes: resolveInlineImageJsonResponseMaxBytes(4, resolveGeneratedMediaMaxBytes(req.cfg, "image")) });
				const images = [];
				for (const part of googleResponseParts(payload)) {
					const inline = googleInlineDataFromPart(part);
					if (!inline) continue;
					const data = normalizeOptionalString(inline.data);
					if (!data) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
					const standardData = toStandardGoogleProviderBase64(data);
					if (!standardData) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
					const image = generatedImageAssetFromBase64({
						base64: standardData,
						index: images.length,
						mimeType: normalizeOptionalString(inline.mimeType) ?? normalizeOptionalString(inline.mime_type) ?? DEFAULT_OUTPUT_MIME
					});
					if (!image) throw new Error(GOOGLE_IMAGE_MALFORMED_RESPONSE);
					images.push(image);
				}
				if (images.length === 0) throw new Error("Google image generation response missing image data");
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
export { buildGoogleImageGenerationProvider };
