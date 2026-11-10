import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "../../number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { n as normalizeGooglePreviewModelId } from "../../provider-model-id-normalize-DjenOxD2.mjs";
import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "../../provider-http-errors-CjVOxCE5.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "../../provider-request-config-WdycwKIG.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import { r as resolveGeneratedImageDownloadMaxBytes } from "../../configured-max-bytes-BaCve0jk.mjs";
import { d as postJsonRequest } from "../../shared-BMUa_P4s.mjs";
import "../../number-runtime-D3v2w3D4.mjs";
import { n as isProviderApiKeyConfiguredAsync } from "../../provider-auth-availability-CfYdMNuk.mjs";
import "../../media-generation-runtime-BgMYgoiy.mjs";
import { a as resolveApiKeyForProvider } from "../../provider-auth-runtime-CMRSW7VK.mjs";
import "../../provider-http-BuV15s4V.mjs";
import { c as resolveInlineImageJsonResponseMaxBytes, t as generatedImageAssetFromBase64 } from "../../image-assets-PTBoX6Eo.mjs";
import "../../image-generation-DwjRbF_L.mjs";
import "../../provider-auth-JCvgbsWg.mjs";
import "../../model-id-B1FKGbAg.mjs";
import { d as createGoogleImageGenerationProviderMetadata } from "../../generation-provider-metadata-B7YiGEWb.mjs";
import { t as resolveGoogleGenerativeAiHttpRequestConfig } from "../../http-request-CMyW77KD.mjs";
import { n as toStandardGoogleProviderBase64 } from "../../base64-DXpT5ejD.mjs";
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
		isConfiguredAsync: (ctx) => isProviderApiKeyConfiguredAsync({
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
				const payload = await readProviderJsonResponse(res, "google.image-generation", { maxBytes: resolveInlineImageJsonResponseMaxBytes(4, resolveGeneratedImageDownloadMaxBytes(req.cfg)) });
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
