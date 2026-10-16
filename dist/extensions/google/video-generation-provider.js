import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import { i as readResponseWithLimit } from "../../http-response-body-umfRGZ-E.mjs";
import { d as readProviderBinaryResponse, m as readProviderJsonResponse } from "../../provider-http-errors-DmewLLH7.mjs";
import { i as fetchWithSsrFGuard } from "../../fetch-guard-DI6biu8d.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveGeneratedMediaMaxBytes } from "../../configured-max-bytes-CtwRSse3.mjs";
import { t as executeProviderOperationWithRetry } from "../../operation-retry-Ci68Y-og.mjs";
import { _ as resolveProviderOperationTimeoutMs, r as createProviderOperationDeadline, v as waitProviderOperationPollInterval } from "../../shared-DcnGQdHV.mjs";
import "../../response-limit-runtime-CpfmMF5T.mjs";
import { r as selectSupportedVideoDuration } from "../../duration-support-BfgJ7oBc.mjs";
import "../../ssrf-runtime-BzkFo_VJ.mjs";
import "../../media-generation-runtime-D1HcnVCx.mjs";
import { a as resolveApiKeyForProvider } from "../../provider-auth-runtime-CpGmMxRN.mjs";
import "../../provider-http-CuRGJD0L.mjs";
import "../../video-generation-D5W8W7TP.mjs";
import { t as stripGoogleProviderPrefix } from "../../model-id-CPDOOOMu.mjs";
import { n as resolveGoogleGenerativeAiApiOrigin } from "../../provider-policy-4Ba5tPL0.mjs";
import { c as GOOGLE_VIDEO_ALLOWED_DURATION_SECONDS, l as GOOGLE_VIDEO_MAX_DURATION_SECONDS, m as createGoogleVideoGenerationProviderMetadata, u as GOOGLE_VIDEO_MIN_DURATION_SECONDS } from "../../generation-provider-metadata-D0HXeJwn.mjs";
import { t as parseGeminiAuth } from "../../gemini-auth-ms1_pxuH.mjs";
import { t as resolveGoogleApiClientHeaders } from "../../google-api-client-header-Dfv7yW-z.mjs";
import { t as canonicalizeGoogleProviderBase64 } from "../../base64-CKISTF1b.mjs";
import { t as createGoogleGenAI } from "../../google-genai-runtime-BvkO2YGf.mjs";
//#region extensions/google/video-generation-provider.ts
const DEFAULT_TIMEOUT_MS = 18e4;
const POLL_INTERVAL_MS = 1e4;
const MAX_POLL_ATTEMPTS = 120;
const GOOGLE_VIDEO_OPERATION_RESPONSE_MAX_BYTES = 16777216;
const GOOGLE_VIDEO_EMPTY_RESULT_MESSAGE = "Google video generation response missing generated videos";
function assertGeneratedVideoBufferWithinLimit(buffer, maxBytes) {
	if (buffer.length > maxBytes) throw new Error(`Google generated video download exceeds ${maxBytes} bytes`);
}
function resolveGoogleVideoRestBaseUrl(configuredBaseUrl) {
	return `${configuredBaseUrl ?? "https://generativelanguage.googleapis.com"}/v1beta`;
}
function resolveGoogleVideoRestModelPath(model) {
	const id = stripGoogleProviderPrefix(normalizeOptionalString(model) || "veo-3.1-fast-generate-preview");
	return id.startsWith("models/") ? id : `models/${id}`;
}
function parseVideoSize(size) {
	const trimmed = normalizeOptionalString(size);
	if (!trimmed) return;
	const match = /^(\d+)x(\d+)$/u.exec(trimmed);
	if (!match) return;
	const width = Number.parseInt(match[1] ?? "", 10);
	const height = Number.parseInt(match[2] ?? "", 10);
	if (!Number.isFinite(width) || !Number.isFinite(height)) return;
	return {
		width,
		height
	};
}
function resolveAspectRatio(params) {
	const direct = normalizeOptionalString(params.aspectRatio);
	if (direct === "16:9" || direct === "9:16") return direct;
	const parsedSize = parseVideoSize(params.size);
	if (!parsedSize) return;
	return parsedSize.width >= parsedSize.height ? "16:9" : "9:16";
}
function resolveResolution(params) {
	if (params.resolution === "720P") return "720p";
	if (params.resolution === "1080P") return "1080p";
	const parsedSize = parseVideoSize(params.size);
	if (!parsedSize) return;
	const maxEdge = Math.max(parsedSize.width, parsedSize.height);
	return maxEdge >= 1920 ? "1080p" : maxEdge >= 1280 ? "720p" : void 0;
}
function resolveDurationSeconds(durationSeconds) {
	if (typeof durationSeconds !== "number" || !Number.isFinite(durationSeconds)) return;
	return selectSupportedVideoDuration(Math.min(GOOGLE_VIDEO_MAX_DURATION_SECONDS, Math.max(GOOGLE_VIDEO_MIN_DURATION_SECONDS, Math.round(durationSeconds))), GOOGLE_VIDEO_ALLOWED_DURATION_SECONDS);
}
function resolveInputImage(req) {
	const input = req.inputImages?.[0];
	if (!input?.buffer) return;
	return {
		imageBytes: input.buffer.toString("base64"),
		mimeType: normalizeOptionalString(input.mimeType) || "image/png"
	};
}
function resolveInputVideo(req) {
	const input = req.inputVideos?.[0];
	if (!input?.buffer) return;
	return {
		videoBytes: input.buffer.toString("base64"),
		mimeType: normalizeOptionalString(input.mimeType) || "video/mp4"
	};
}
function resolveGoogleGeneratedVideoDownloadUrl(params) {
	const trimmed = normalizeOptionalString(params.uri);
	if (!trimmed) return;
	const url = URL.parse(trimmed);
	if (url?.protocol !== "https:") return;
	const allowedOrigins = /* @__PURE__ */ new Set(["https://generativelanguage.googleapis.com"]);
	const configuredOrigin = URL.parse(params.configuredBaseUrl ?? "")?.origin;
	if (configuredOrigin?.startsWith("https://")) allowedOrigins.add(configuredOrigin);
	if (!allowedOrigins.has(url.origin)) return;
	if (!url.searchParams.has("key")) url.searchParams.set("key", params.apiKey);
	return url.toString();
}
function resolveGoogleGeneratedVideoFileDownloadUrl(params) {
	const resource = params.file;
	const name = normalizeOptionalString(resource?.name) ?? normalizeOptionalString(resource?.uri);
	if (!name || !/^files\/[^/?#]+$/u.test(name)) return;
	const baseUrl = resolveGoogleVideoRestBaseUrl(params.configuredBaseUrl);
	const url = new URL(`${baseUrl}/${name}:download`);
	url.searchParams.set("alt", "media");
	url.searchParams.set("key", params.apiKey);
	return url.toString();
}
async function downloadGeneratedVideoFromUri(params) {
	const downloadUrl = resolveGoogleGeneratedVideoDownloadUrl({
		uri: params.uri,
		apiKey: params.apiKey,
		configuredBaseUrl: params.configuredBaseUrl
	});
	if (!downloadUrl) return;
	return await executeProviderOperationWithRetry({
		provider: "google",
		stage: "download",
		operation: async () => {
			const { response, release } = await fetchWithSsrFGuard({
				url: downloadUrl,
				timeoutMs: params.timeoutMs
			});
			try {
				if (!response.ok) {
					response.body?.cancel().catch(() => void 0);
					throw new Error(`Failed to download Google generated video: ${response.status} ${response.statusText}`);
				}
				const downloadLabel = "Google generated video download";
				return {
					buffer: await readProviderBinaryResponse(response, downloadLabel, "video", {
						maxBytes: params.maxBytes,
						chunkTimeoutMs: params.timeoutMs,
						onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`${downloadLabel} exceeds ${maxBytes} bytes`),
						onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`${downloadLabel} stalled after ${chunkTimeoutMs}ms`)
					}),
					mimeType: normalizeOptionalString(response.headers.get("content-type")) || normalizeOptionalString(params.mimeType) || "video/mp4",
					fileName: `video-${params.index + 1}.mp4`
				};
			} finally {
				await release();
			}
		}
	});
}
function extractGoogleApiErrorCode(error) {
	const status = error?.status;
	if (typeof status === "number") return status;
	const message = error instanceof Error ? error.message : String(error);
	try {
		const parsed = JSON.parse(message);
		const code = typeof parsed.code === "number" ? parsed.code : parsed.error?.code;
		return typeof code === "number" ? code : void 0;
	} catch {
		return /\b404\b/u.test(message) ? 404 : void 0;
	}
}
function extractGeneratedVideos(operation) {
	const response = operation.response;
	const generatedVideos = response?.generatedVideos;
	if (Array.isArray(generatedVideos) && generatedVideos.length > 0) return generatedVideos;
	const generatedSamples = (response?.generateVideoResponse)?.generatedSamples;
	return Array.isArray(generatedSamples) ? generatedSamples : [];
}
async function requestGoogleVideoJson(params) {
	function createHttpError(response, detail) {
		const parts = [`HTTP ${response.status}`];
		const statusText = response.statusText.trim();
		if (statusText) parts.push(statusText);
		if (typeof detail === "string") {
			const trimmed = detail.trim();
			if (trimmed) parts.push(trimmed);
		} else if (detail && typeof detail === "object") parts.push(JSON.stringify(detail));
		const error = new Error(parts.join(": "));
		Object.assign(error, {
			status: response.status,
			statusCode: response.status
		});
		return error;
	}
	return await executeProviderOperationWithRetry({
		provider: "google",
		stage: params.stage,
		operation: async () => {
			const controller = new AbortController();
			const timeout = setTimeout(() => {
				const error = /* @__PURE__ */ new Error("request timed out");
				error.name = "TimeoutError";
				controller.abort(error);
			}, resolveProviderOperationTimeoutMs({
				deadline: params.deadline,
				defaultTimeoutMs: DEFAULT_TIMEOUT_MS
			}));
			try {
				const { response, release } = await fetchWithSsrFGuard({
					url: params.url,
					init: {
						method: params.method,
						headers: params.headers,
						...params.body === void 0 ? {} : { body: JSON.stringify(params.body) }
					},
					signal: controller.signal
				});
				try {
					if (!response.ok) {
						const text = new TextDecoder().decode(await readResponseWithLimit(response, GOOGLE_VIDEO_OPERATION_RESPONSE_MAX_BYTES, { onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Google video operation response exceeds ${maxBytes} bytes`) }));
						let detail = text;
						if (text) try {
							detail = JSON.parse(text);
						} catch {
							detail = text;
						}
						throw createHttpError(response, detail);
					}
					return await readProviderJsonResponse(response, "Google video operation response", { maxBytes: GOOGLE_VIDEO_OPERATION_RESPONSE_MAX_BYTES });
				} finally {
					await release();
				}
			} finally {
				clearTimeout(timeout);
			}
		}
	});
}
async function generateGoogleVideoViaRest(params) {
	let operation = await requestGoogleVideoJson({
		url: `${params.baseUrl}/${resolveGoogleVideoRestModelPath(params.model)}:predictLongRunning`,
		method: "POST",
		headers: params.headers,
		deadline: params.deadline,
		stage: "create",
		body: {
			instances: [{ prompt: params.prompt }],
			parameters: {
				...typeof params.durationSeconds === "number" ? { durationSeconds: params.durationSeconds } : {},
				...params.aspectRatio ? { aspectRatio: params.aspectRatio } : {},
				...params.resolution ? { resolution: params.resolution } : {}
			}
		}
	});
	for (let attempt = 0; !(operation.done ?? false); attempt += 1) {
		if (attempt >= MAX_POLL_ATTEMPTS) throw new Error("Google video generation did not finish in time");
		await waitProviderOperationPollInterval({
			deadline: params.deadline,
			pollIntervalMs: POLL_INTERVAL_MS
		});
		const operationName = operation.name;
		if (typeof operationName !== "string" || !operationName) throw new Error("Google video operation response missing name for polling");
		operation = await requestGoogleVideoJson({
			url: `${params.baseUrl}/${operationName}`,
			method: "GET",
			headers: params.headers,
			deadline: params.deadline,
			stage: "poll"
		});
	}
	const error = operation.error;
	if (error) throw new Error(JSON.stringify(error));
	return operation;
}
function buildGoogleVideoGenerationProvider() {
	return {
		...createGoogleVideoGenerationProviderMetadata(),
		async generateVideo(req) {
			if ((req.inputImages?.length ?? 0) > 1) throw new Error("Google video generation supports at most one input image.");
			if ((req.inputVideos?.length ?? 0) > 1) throw new Error("Google video generation supports at most one input video.");
			if ((req.inputImages?.length ?? 0) > 0 && (req.inputVideos?.length ?? 0) > 0) throw new Error("Google video generation does not support image and video inputs together.");
			const auth = await resolveApiKeyForProvider({
				provider: "google",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("Google API key missing");
			const apiKey = auth.apiKey;
			const configuredUrl = normalizeOptionalString(req.cfg?.models?.providers?.google?.baseUrl);
			const configuredBaseUrl = configuredUrl ? resolveGoogleGenerativeAiApiOrigin(configuredUrl) : void 0;
			const restBaseUrl = resolveGoogleVideoRestBaseUrl(configuredBaseUrl);
			const authHeaders = {
				...parseGeminiAuth(apiKey).headers,
				...resolveGoogleApiClientHeaders({
					baseUrl: restBaseUrl,
					api: "google-generative-ai",
					capability: "video",
					transport: "http"
				})
			};
			const durationSeconds = resolveDurationSeconds(req.durationSeconds);
			const model = normalizeOptionalString(req.model) || "veo-3.1-fast-generate-preview";
			const aspectRatio = resolveAspectRatio({
				aspectRatio: req.aspectRatio,
				size: req.size
			});
			const resolution = resolveResolution({
				resolution: req.resolution,
				size: req.size
			});
			const hasReferenceInputs = (req.inputImages?.length ?? 0) > 0 || (req.inputVideos?.length ?? 0) > 0;
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "Google video generation"
			});
			const client = createGoogleGenAI({
				apiKey,
				httpOptions: {
					...configuredBaseUrl ? { baseUrl: configuredBaseUrl } : {},
					timeout: resolveProviderOperationTimeoutMs({
						deadline,
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS
					})
				}
			});
			const generateViaRest = () => generateGoogleVideoViaRest({
				baseUrl: restBaseUrl,
				headers: authHeaders,
				deadline,
				model,
				prompt: req.prompt,
				durationSeconds,
				aspectRatio,
				resolution
			});
			let usedRestFallback = false;
			let operation;
			try {
				operation = await client.models.generateVideos({
					model,
					prompt: req.prompt,
					image: resolveInputImage(req),
					video: resolveInputVideo(req),
					config: {
						...typeof durationSeconds === "number" ? { durationSeconds } : {},
						...aspectRatio ? { aspectRatio } : {},
						...resolution ? { resolution } : {}
					}
				});
			} catch (error) {
				if (hasReferenceInputs || extractGoogleApiErrorCode(error) !== 404) throw error;
				usedRestFallback = true;
				operation = await generateViaRest();
			}
			if (!usedRestFallback) {
				let sdkOperation = operation;
				for (let attempt = 0; !(sdkOperation.done ?? false); attempt += 1) {
					if (attempt >= MAX_POLL_ATTEMPTS) throw new Error("Google video generation did not finish in time");
					await waitProviderOperationPollInterval({
						deadline,
						pollIntervalMs: POLL_INTERVAL_MS
					});
					resolveProviderOperationTimeoutMs({
						deadline,
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS
					});
					sdkOperation = await executeProviderOperationWithRetry({
						provider: "google",
						stage: "poll",
						operation: () => client.operations.getVideosOperation({ operation: sdkOperation })
					});
				}
				operation = sdkOperation;
			}
			const finalOperation = operation;
			if (finalOperation.error) throw new Error(JSON.stringify(finalOperation.error));
			let generatedVideos = extractGeneratedVideos(operation);
			if (generatedVideos.length === 0 && !hasReferenceInputs && !usedRestFallback) {
				operation = await generateViaRest();
				generatedVideos = extractGeneratedVideos(operation);
			}
			if (generatedVideos.length === 0) throw new Error(GOOGLE_VIDEO_EMPTY_RESULT_MESSAGE);
			const maxVideoBytes = resolveGeneratedMediaMaxBytes(req.cfg, "video");
			return {
				videos: await Promise.all(generatedVideos.map(async (entry, index) => {
					const inline = entry.video;
					if (inline?.videoBytes) {
						const canonicalVideo = canonicalizeGoogleProviderBase64(inline.videoBytes);
						if (!canonicalVideo) throw new Error("Google video generation returned malformed base64 video data");
						const buffer = Buffer.from(canonicalVideo, "base64");
						assertGeneratedVideoBufferWithinLimit(buffer, maxVideoBytes);
						return {
							buffer,
							mimeType: normalizeOptionalString(inline.mimeType) || "video/mp4",
							fileName: `video-${index + 1}.mp4`
						};
					}
					const download = (uri) => downloadGeneratedVideoFromUri({
						uri,
						apiKey,
						configuredBaseUrl,
						mimeType: inline?.mimeType,
						index,
						maxBytes: maxVideoBytes,
						timeoutMs: resolveProviderOperationTimeoutMs({
							deadline,
							defaultTimeoutMs: DEFAULT_TIMEOUT_MS
						})
					});
					const directDownload = await download(inline?.uri);
					if (directDownload) return directDownload;
					if (!inline) throw new Error("Google generated video missing file handle");
					const fileDownload = await download(resolveGoogleGeneratedVideoFileDownloadUrl({
						file: inline,
						apiKey,
						configuredBaseUrl
					}));
					if (!fileDownload) throw new Error("Google generated video missing bounded download URL");
					return fileDownload;
				})),
				model,
				metadata: finalOperation.name ? { operationName: finalOperation.name } : void 0
			};
		}
	};
}
//#endregion
export { buildGoogleVideoGenerationProvider };
