import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as assertOkOrThrowHttpError, p as readProviderJsonObjectResponse } from "./provider-http-errors-DmewLLH7.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-By9R9pyt.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CtwRSse3.mjs";
import { a as createProviderOperationTimeoutResolver, d as postJsonRequest, h as resolveProviderHttpRequestConfig, r as createProviderOperationDeadline, u as pollProviderOperationJson } from "./shared-DcnGQdHV.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-Xx9etrds.mjs";
import { t as downloadGeneratedVideoAsset } from "./media-generation-runtime-DVf13dFr.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-B-PBEJIo.mjs";
import "./provider-http-CuRGJD0L.mjs";
import "./provider-auth-BGYKg9mW.mjs";
import { a as prepareKieVideoRequest, i as kieVideoCapabilities, n as KIE_VIDEO_FAMILIES, r as findKieVideoFamily, t as DEFAULT_KIE_VIDEO_MODEL } from "./video-models-e7onR7ga.mjs";
//#region extensions/kie/video-generation-provider.ts
const BASE_URL = "https://api.kie.ai";
const UPLOAD_BASE_URL = "https://kieai.redpandaai.co";
const DEFAULT_TIMEOUT_MS = 6e5;
const POLL_INTERVAL_MS = 5e3;
function readKieData(payload) {
	if (payload.code !== 200 || payload.success === false) throw new Error(`Kie AI request failed: ${normalizeOptionalString(payload.msg) ?? `code ${String(payload.code)}`}`);
	if (!isRecord(payload.data)) throw new Error("Kie AI response missing data.");
	return payload.data;
}
function readTask(payload) {
	const data = readKieData(payload);
	switch (data.state) {
		case "waiting":
		case "queuing":
		case "generating":
		case "success": return data;
		case "fail": {
			const message = normalizeOptionalString(data.failMsg) ?? "generation failed";
			const code = typeof data.failCode === "string" || typeof data.failCode === "number" ? ` (${data.failCode})` : "";
			throw new Error(`Kie AI video generation failed${code}: ${message}`);
		}
		default: throw new Error(`Kie AI video status response has unknown state: ${String(data.state)}`);
	}
}
function readOutputUrls(data) {
	let result = data.response;
	if (typeof data.resultJson === "string") try {
		result = JSON.parse(data.resultJson);
	} catch (cause) {
		throw new Error("Kie AI video generation returned malformed resultJson.", { cause });
	}
	if (!isRecord(result) || !Array.isArray(result.resultUrls) || !result.resultUrls.length) throw new Error("Kie AI video generation completed without result URLs.");
	return result.resultUrls.map((value) => {
		const url = normalizeOptionalString(value);
		if (!url) throw new Error("Kie AI video generation returned a malformed result URL.");
		return url;
	});
}
function remoteImageUrl(value) {
	const url = URL.parse(value);
	if (!url || url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Kie AI image-to-video requires a remote http(s) image URL or a local buffer.");
	return url.href;
}
function imageUploadData(image, model) {
	if (!image.buffer?.length) throw new Error("Kie AI image-to-video input is missing image data.");
	if (image.buffer.length > 10485760) throw new Error("Kie AI image-to-video supports images up to 10 MB.");
	const mimeType = normalizeOptionalString(image.mimeType) ?? "image/png";
	const supported = model.startsWith("kling-") ? ["image/jpeg", "image/png"] : [
		"image/jpeg",
		"image/png",
		"image/webp"
	];
	if (!supported.includes(mimeType)) throw new Error(`Kie AI ${model} requires ${supported.join(" or ")} image data.`);
	return `data:${mimeType};base64,${image.buffer.toString("base64")}`;
}
function buildKieVideoGenerationProvider() {
	const models = [...new Set(KIE_VIDEO_FAMILIES.flatMap((family) => family.textModel ? [family.textModel, family.imageModel] : [family.imageModel]))];
	return {
		id: "kie",
		label: "Kie AI",
		defaultModel: DEFAULT_KIE_VIDEO_MODEL,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		models,
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "kie",
			...ctx
		}),
		capabilities: kieVideoCapabilities(findKieVideoFamily(DEFAULT_KIE_VIDEO_MODEL)),
		catalogByModel: Object.fromEntries(models.map((model) => {
			const family = findKieVideoFamily(model);
			return [model, {
				modes: family.textModel ? ["generate", "imageToVideo"] : ["imageToVideo"],
				capabilities: kieVideoCapabilities(family)
			}];
		})),
		resolveModelCapabilities: ({ model }) => kieVideoCapabilities(findKieVideoFamily(model)),
		async generateVideo(req) {
			const { model, input, image, imageField } = prepareKieVideoRequest(req);
			const imageUrl = image?.url ? remoteImageUrl(image.url) : void 0;
			const base64Data = image && !imageUrl ? imageUploadData(image, model) : void 0;
			const auth = await resolveApiKeyForProvider({
				provider: "kie",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("Kie AI API key missing");
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs ?? DEFAULT_TIMEOUT_MS,
				label: "Kie AI video generation"
			});
			const timeoutMs = createProviderOperationTimeoutResolver({
				deadline,
				defaultTimeoutMs: DEFAULT_TIMEOUT_MS
			});
			const configured = req.cfg.models?.providers?.kie;
			const request = sanitizeConfiguredModelProviderRequest(configured?.request);
			const defaultHeaders = {
				Authorization: `Bearer ${auth.apiKey}`,
				"Content-Type": "application/json"
			};
			const http = resolveProviderHttpRequestConfig({
				baseUrl: normalizeOptionalString(configured?.baseUrl) ?? BASE_URL,
				defaultBaseUrl: BASE_URL,
				defaultHeaders,
				request,
				provider: "kie",
				capability: "video",
				transport: "http"
			});
			const post = async (url, body, policy) => {
				const { response, release } = await postJsonRequest({
					url,
					body,
					headers: policy.headers,
					timeoutMs: timeoutMs(),
					fetchFn: fetch,
					allowPrivateNetwork: policy.allowPrivateNetwork,
					dispatcherPolicy: policy.dispatcherPolicy
				});
				try {
					await assertOkOrThrowHttpError(response, "Kie AI request failed");
					return readKieData(await readProviderJsonObjectResponse(response, "Kie AI response", { timeoutMs }));
				} finally {
					await release();
				}
			};
			if (image && imageField) {
				let url = imageUrl;
				if (base64Data) {
					const uploadHttp = resolveProviderHttpRequestConfig({
						baseUrl: UPLOAD_BASE_URL,
						defaultBaseUrl: UPLOAD_BASE_URL,
						defaultHeaders,
						request,
						provider: "kie",
						capability: "video",
						transport: "http"
					});
					const uploaded = await post(`${uploadHttp.baseUrl}/api/file-base64-upload`, {
						base64Data,
						uploadPath: "openclaw/video-inputs"
					}, uploadHttp);
					url = normalizeOptionalString(uploaded.downloadUrl);
					if (!url) throw new Error("Kie AI image upload response missing downloadUrl.");
					url = remoteImageUrl(url);
				}
				input[imageField] = imageField === "image_url" ? url : [url];
			}
			const submitted = await post(`${http.baseUrl}/api/v1/jobs/createTask`, {
				model,
				input
			}, http);
			const taskId = normalizeOptionalString(submitted.taskId);
			if (!taskId) throw new Error("Kie AI video generation response missing taskId.");
			const outputUrls = readOutputUrls(readKieData(await pollProviderOperationJson({
				url: `${http.baseUrl}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
				headers: http.headers,
				deadline,
				defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
				fetchFn: fetch,
				allowPrivateNetwork: http.allowPrivateNetwork,
				dispatcherPolicy: http.dispatcherPolicy,
				maxAttempts: Math.ceil((req.timeoutMs ?? DEFAULT_TIMEOUT_MS) / POLL_INTERVAL_MS),
				pollIntervalMs: POLL_INTERVAL_MS,
				requestFailedMessage: "Kie AI video status request failed",
				timeoutMessage: `Kie AI video generation task ${taskId} did not finish in time`,
				isComplete: (payload) => readTask(payload).state === "success"
			})));
			const maxBytes = resolveGeneratedMediaMaxBytes(req.cfg, "video");
			const videos = [];
			for (const [index, url] of outputUrls.entries()) videos.push(await downloadGeneratedVideoAsset({
				url,
				timeoutMs,
				defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
				fetchFn: fetch,
				provider: "kie",
				label: "Kie AI generated video download",
				requestFailedMessage: "Kie AI generated video download failed",
				index,
				maxBytes,
				validateBinaryResponse: true,
				metadata: { sourceUrl: url }
			}));
			return {
				videos,
				model,
				metadata: {
					taskId,
					outputUrls
				}
			};
		}
	};
}
//#endregion
export { buildKieVideoGenerationProvider as t };
