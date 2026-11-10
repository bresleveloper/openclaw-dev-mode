import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { b as resolveProviderContext, l as getEnvApiKey, s as getApiProvider, y as PROVIDER_MODEL_INPUT } from "./llm-YCnSGJtn.mjs";
import { o as createProviderHttpError } from "./provider-http-errors-CjVOxCE5.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-WdycwKIG.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { r as providerOperationRetryConfig } from "./operation-retry-B2m6H7IT.mjs";
import { n as executeWithApiKeyRotation } from "./api-key-rotation-Dw4l5GMT.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { t as buildGuardedModelFetch } from "./ai-transport-host-BOghwVNz.mjs";
import { t as buildAssistantMessage } from "./stream-message-shared-CYuIJ_XF.mjs";
import { n as transformTransportMessages } from "./ai-transport-runtime-host-DG6Jnqf2.mjs";
import { F as isGoogleGemini25ThinkingBudgetModel, L as resolveGoogleGemini3ThinkingLevel, z as stripInvalidGoogleThinkingBudget } from "./provider-stream-shared-Ond8mlRx.mjs";
import "./provider-auth-runtime-CMRSW7VK.mjs";
import "./provider-http-BuV15s4V.mjs";
import { n as isGoogleGemini3ProModel, r as isGoogleGemini3ThinkingLevelModel, t as isGoogleGemini3FlashModel } from "./provider-thinking-runtime-DlkIARoV.mjs";
import { A as stripSystemPromptCacheBoundary, E as sanitizeTransportPayloadText, T as requiresGoogleToolCallId, a as convertGoogleTools, c as createGoogleVideoPlaceholder, i as consumeGoogleGenerateContentStream, l as createWritableTransportEventStream, p as failTransportStream, s as createEmptyTransportUsage, t as GOOGLE_VIDEO_SLOT_OMISSION, v as materializeGoogleVideoSlots, w as projectGoogleMessages, x as notifyProviderHttpResponse, y as mergeTransportHeaders } from "./provider-transport-runtime-DyX8vIBV.mjs";
import { t as stripGoogleProviderPrefix } from "./model-id-B1FKGbAg.mjs";
import { a as isOfficialGoogleAiStudioBaseUrl, o as normalizeGoogleApiBaseUrl } from "./google-api-base-url-BSKc6KBi.mjs";
import "./provider-policy-COnE2-la.mjs";
import "./thinking-api-1yQZuH50.mjs";
import { n as isGoogleNativeVideoModelId } from "./provider-models-D-n-Hu1B.mjs";
import { t as parseGeminiAuth } from "./gemini-auth-CUKsnejN.mjs";
import { t as isGoogleVertexCredentialsMarker } from "./vertex-adc-config-D9DGGSGC.mjs";
import { t as collectGoogleTransportApiKeys } from "./transport-api-keys-C8YfQwqZ.mjs";
import { n as parseGoogleSseChunks, t as hasGoogleFirstResponseActivity } from "./transport-stream-sse-DOdlxv7r.mjs";
import { t as resolveGoogleVertexAuthorizedUserHeaders } from "./vertex-adc-DuEe6_AM.mjs";
//#region extensions/google/transport-stream.ts
const GOOGLE_NATIVE_VIDEO_MIME = /* @__PURE__ */ new Set([
	"video/mp4",
	"video/mpeg",
	"video/quicktime",
	"video/avi",
	"video/x-flv",
	"video/mpg",
	"video/webm",
	"video/wmv",
	"video/3gpp"
]);
const GOOGLE_VIDEO_MIME_OMISSION = "(video omitted: unsupported Google video MIME type)";
const GOOGLE_REQUEST_BYTES_EXCLUSIVE = 2e7;
const GOOGLE_GEMINI3_FIRST_RESPONSE_RETRY_DEFAULT_MS = 45e3;
const GOOGLE_GEMINI3_FIRST_RESPONSE_RETRY_ENV = "OPENCLAW_GOOGLE_GEMINI_FIRST_RESPONSE_RETRY_MS";
const GOOGLE_VERTEX_MODEL_RESOURCE_PREFIX = /^(?:projects\/[^/]+\/locations\/[^/]+\/)?publishers\/google\/models\//u;
const GOOGLE_VERTEX_DEFAULT_API_VERSION = "v1";
let toolCallCounter = 0;
function normalizeGoogleTransportRouteApi(api) {
	switch (api) {
		case "google-generative-ai":
		case "openclaw-google-generative-ai-transport": return "google-generative-ai";
		case "google-vertex": return "google-vertex";
		default: return;
	}
}
function normalizeGoogleTransportModelRoute(model) {
	const api = normalizeGoogleTransportRouteApi(model.api);
	return api && api !== model.api ? Object.assign({}, model, { api }) : model;
}
function canonicalGoogleModel(model) {
	return {
		...model,
		input: model.input.filter((type) => type !== "video")
	};
}
function supportsGoogleNativeVideo(model) {
	return model.provider === "google" && normalizeGoogleTransportRouteApi(model.api) === "google-generative-ai" && isOfficialGoogleAiStudioBaseUrl(model.baseUrl) && isGoogleNativeVideoModelId(model.id) && model.input.includes("video");
}
function normalizeGoogleTransportMessageRoutes(messages) {
	return messages.map((msg) => {
		if (msg.role !== "assistant") return msg;
		const api = normalizeGoogleTransportRouteApi(msg.api);
		return api && api !== msg.api ? Object.assign({}, msg, { api }) : msg;
	});
}
function mapToolChoice(choice) {
	if (!choice) return;
	if (typeof choice === "object" && choice.type === "function") return {
		mode: "ANY",
		allowedFunctionNames: [choice.function.name]
	};
	switch (choice) {
		case "none": return { mode: "NONE" };
		case "any":
		case "required": return { mode: "ANY" };
		default: return { mode: "AUTO" };
	}
}
function mapStopReasonString(reason) {
	if (reason === "STOP") return "stop";
	return reason === "MAX_TOKENS" || reason === "CONTINUATION" ? "length" : "error";
}
function normalizeToolCallId(id) {
	return id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}
function resolveGoogleModelPath(modelId) {
	if (modelId.startsWith("models/") || modelId.startsWith("tunedModels/")) return modelId;
	return `models/${stripGoogleProviderPrefix(modelId)}`;
}
function buildGoogleGenerativeAiRequestUrl(model) {
	return `${normalizeGoogleApiBaseUrl(model.baseUrl)}/${resolveGoogleModelPath(model.id)}:streamGenerateContent?alt=sse`;
}
function resolveGoogleVertexProject(options) {
	const project = normalizeOptionalString(options?.project) || normalizeOptionalString(process.env.GOOGLE_CLOUD_PROJECT) || normalizeOptionalString(process.env.GCLOUD_PROJECT);
	if (!project) throw new Error("Vertex AI requires a project ID. Set GOOGLE_CLOUD_PROJECT/GCLOUD_PROJECT or pass project in options.");
	return project;
}
function resolveGoogleVertexLocation(options) {
	const location = normalizeOptionalString(options?.location) || normalizeOptionalString(process.env.GOOGLE_CLOUD_LOCATION);
	if (!location) throw new Error("Vertex AI requires a location. Set GOOGLE_CLOUD_LOCATION or pass location in options.");
	return location;
}
function resolveGoogleVertexBaseOrigin(model, location) {
	const configured = normalizeOptionalString(model.baseUrl);
	if (configured && !configured.includes("{location}")) try {
		const url = new URL(configured);
		url.pathname = "";
		url.search = "";
		url.hash = "";
		return url.toString().replace(/\/$/u, "");
	} catch {
		return configured.replace(/\/+$/u, "");
	}
	if (location === "global") return "https://aiplatform.googleapis.com";
	if (location === "eu" || location === "us") return `https://aiplatform.${location}.rep.googleapis.com`;
	return `https://${location}-aiplatform.googleapis.com`;
}
function buildGoogleVertexRequestUrl(model, options) {
	const project = encodeURIComponent(resolveGoogleVertexProject(options));
	const location = encodeURIComponent(resolveGoogleVertexLocation(options));
	const modelId = encodeURIComponent(stripGoogleProviderPrefix(model.id));
	return `${resolveGoogleVertexBaseOrigin(model, decodeURIComponent(location))}/${GOOGLE_VERTEX_DEFAULT_API_VERSION}/projects/${project}/locations/${location}/publishers/google/models/${modelId}:streamGenerateContent?alt=sse`;
}
function resolveThinkingLevel(level, modelId) {
	const resolved = resolveGoogleGemini3ThinkingLevel({
		modelId,
		thinkingLevel: level
	});
	if (resolved) return resolved;
	throw new Error("Unsupported thinking level");
}
function resolveExplicitThinkingLevel(level, modelId) {
	return resolveGoogleGemini3ThinkingLevel({
		modelId,
		thinkingLevel: level.toLowerCase()
	}) ?? level;
}
function getDisabledThinkingConfig(modelId) {
	const thinkingLevel = resolveGoogleGemini3ThinkingLevel({
		modelId,
		thinkingLevel: "off"
	});
	if (thinkingLevel) return { thinkingLevel };
	return normalizeGoogleThinkingConfig(modelId, { thinkingBudget: 0 });
}
function getGoogleThinkingBudget(modelId, effort, customBudgets) {
	const normalizedEffort = effort === "xhigh" || effort === "max" ? "high" : effort;
	if (customBudgets?.[normalizedEffort] !== void 0) return customBudgets[normalizedEffort];
	if (modelId.includes("2.5-pro")) return {
		minimal: 128,
		low: 2048,
		medium: 8192,
		high: 32768
	}[normalizedEffort];
	if (modelId.includes("2.5-flash-lite")) return {
		minimal: 512,
		low: 2048,
		medium: 8192,
		high: 24576
	}[normalizedEffort];
	if (modelId.includes("2.5-flash")) return {
		minimal: 128,
		low: 2048,
		medium: 8192,
		high: 24576
	}[normalizedEffort];
}
function isAdaptiveReasoningLevel(value) {
	return value === "adaptive";
}
function resolveGoogleThinkingConfig(model, options) {
	if (!model.reasoning) return;
	if (options?.thinking) {
		if (!options.thinking.enabled) return getDisabledThinkingConfig(model.id);
		const config = { includeThoughts: true };
		if (options.thinking.level) config.thinkingLevel = resolveExplicitThinkingLevel(options.thinking.level, model.id);
		else if (typeof options.thinking.budgetTokens === "number") {
			const thinkingLevel = resolveGoogleGemini3ThinkingLevel({
				modelId: model.id,
				thinkingBudget: options.thinking.budgetTokens
			});
			if (thinkingLevel) config.thinkingLevel = thinkingLevel;
			else config.thinkingBudget = options.thinking.budgetTokens;
		}
		return normalizeGoogleThinkingConfig(model.id, config);
	}
	if (!options?.reasoning || options.reasoning === "off") return getDisabledThinkingConfig(model.id);
	if (isAdaptiveReasoningLevel(options.reasoning)) {
		if (isGoogleGemini3ThinkingLevelModel(model.id)) return { includeThoughts: true };
		if (isGoogleGemini25ThinkingBudgetModel(model.id)) return normalizeGoogleThinkingConfig(model.id, {
			includeThoughts: true,
			thinkingBudget: -1
		});
	}
	if (isGoogleGemini3ThinkingLevelModel(model.id)) return {
		includeThoughts: true,
		thinkingLevel: resolveThinkingLevel(options.reasoning, model.id)
	};
	const budget = getGoogleThinkingBudget(model.id, options.reasoning, options.thinkingBudgets);
	return normalizeGoogleThinkingConfig(model.id, {
		includeThoughts: true,
		...typeof budget === "number" ? { thinkingBudget: budget } : {}
	});
}
function normalizeGoogleThinkingConfig(modelId, thinkingConfig) {
	stripInvalidGoogleThinkingBudget({
		thinkingConfig,
		modelId
	});
	return Object.keys(thinkingConfig).length > 0 ? thinkingConfig : void 0;
}
function convertGoogleMessages(model, context, videoSlots) {
	const routeModel = normalizeGoogleTransportModelRoute(model);
	return projectGoogleMessages({
		model: routeModel,
		messages: transformTransportMessages(normalizeGoogleTransportMessageRoutes(context.messages), canonicalGoogleModel(routeModel), (id) => requiresGoogleToolCallId(model.id) ? normalizeToolCallId(id) : id, { preserveCrossModelToolCallThoughtSignature: isGoogleGemini3ThinkingLevelModel(model.id) }),
		replay: "managed",
		requiresToolCallSignature: isGoogleGemini3ThinkingLevelModel(model.id),
		videoPart: (video) => createGoogleVideoPlaceholder(video, videoSlots, { text: GOOGLE_VIDEO_SLOT_OMISSION })
	});
}
function buildGoogleGenerativeAiParams(model, context, options, videoSlots) {
	const generationConfig = {};
	if (typeof options?.temperature === "number") generationConfig.temperature = options.temperature;
	if (typeof options?.maxTokens === "number") generationConfig.maxOutputTokens = options.maxTokens;
	if (typeof options?.topP === "number") generationConfig.topP = options.topP;
	if (options?.stop !== void 0 && options.stop.length > 0) generationConfig.stopSequences = options.stop;
	const thinkingConfig = resolveGoogleThinkingConfig(model, options);
	if (thinkingConfig) generationConfig.thinkingConfig = thinkingConfig;
	const params = { contents: convertGoogleMessages(model, context, videoSlots) };
	const cachedContent = typeof options?.cachedContent === "string" ? options.cachedContent.trim() : "";
	if (cachedContent) params.cachedContent = cachedContent;
	if (Object.keys(generationConfig).length > 0) params.generationConfig = generationConfig;
	if (!cachedContent && context.systemPrompt) params.systemInstruction = { parts: [{ text: sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(context.systemPrompt)) }] };
	if (!cachedContent && context.tools?.length) {
		params.tools = convertGoogleTools(context.tools);
		const toolChoice = mapToolChoice(options?.toolChoice);
		if (toolChoice) params.toolConfig = { functionCallingConfig: toolChoice };
	}
	return params;
}
function replaceGooglePartWithText(part, text) {
	Object.keys(part).forEach((key) => Reflect.deleteProperty(part, key));
	part.text = text;
}
function materializeGoogleRequestVideoSlots(request, slots) {
	const trusted = [];
	materializeGoogleVideoSlots(request, slots, (slot, video) => {
		if (!GOOGLE_NATIVE_VIDEO_MIME.has(video.mimeType)) {
			replaceGooglePartWithText(slot, GOOGLE_VIDEO_MIME_OMISSION);
			return;
		}
		slot.inlineData = {
			mimeType: video.mimeType,
			data: video.data
		};
		trusted.push(slot);
	}, (part) => {
		const inlineData = isRecord(part.inlineData) ? part.inlineData : void 0;
		if (normalizeLowercaseStringOrEmpty(inlineData?.mimeType).startsWith("video/")) replaceGooglePartWithText(part, GOOGLE_VIDEO_SLOT_OMISSION);
	});
	return trusted;
}
function serializeGoogleRequest(request, videoSlots) {
	let body = JSON.stringify(request);
	for (const slot of videoSlots.toReversed()) {
		if (Buffer.byteLength(body, "utf8") < GOOGLE_REQUEST_BYTES_EXCLUSIVE) break;
		replaceGooglePartWithText(slot, GOOGLE_VIDEO_SLOT_OMISSION);
		body = JSON.stringify(request);
	}
	if (Buffer.byteLength(body, "utf8") >= GOOGLE_REQUEST_BYTES_EXCLUSIVE) throw new Error(`Google request body must be smaller than ${GOOGLE_REQUEST_BYTES_EXCLUSIVE} bytes`);
	return body;
}
function buildGoogleHeaders(model, apiKey, optionHeaders) {
	const authHeaders = apiKey ? parseGeminiAuth(apiKey).headers : void 0;
	return resolveProviderRequestHeaders({
		provider: model.provider,
		api: normalizeGoogleTransportRouteApi(model.api),
		baseUrl: model.baseUrl,
		capability: "llm",
		transport: "stream",
		defaultHeaders: mergeTransportHeaders({
			"Content-Type": "application/json",
			accept: "text/event-stream"
		}, authHeaders, model.headers),
		callerHeaders: optionHeaders,
		precedence: "caller-wins"
	}) ?? {
		"Content-Type": "application/json",
		accept: "text/event-stream"
	};
}
async function buildGoogleVertexHeaders(model, apiKey, optionHeaders, fetchImpl) {
	const authHeaders = isGoogleVertexCredentialsMarker(apiKey) ? await resolveGoogleVertexAuthorizedUserHeaders(fetchImpl) : { "x-goog-api-key": apiKey };
	return mergeTransportHeaders({
		"Content-Type": "application/json",
		accept: "text/event-stream"
	}, authHeaders, model.headers, optionHeaders) ?? {
		"Content-Type": "application/json",
		accept: "text/event-stream"
	};
}
function buildGoogleTransportRequestUrl(kind, model, options) {
	return kind === "google-vertex" ? buildGoogleVertexRequestUrl(model, options) : buildGoogleGenerativeAiRequestUrl(model);
}
function resolveGoogleGemini3FirstResponseRetryMs() {
	const raw = process.env[GOOGLE_GEMINI3_FIRST_RESPONSE_RETRY_ENV];
	return parseStrictNonNegativeInteger(raw) ?? GOOGLE_GEMINI3_FIRST_RESPONSE_RETRY_DEFAULT_MS;
}
function shouldRetryGoogleGemini3FirstResponse(params) {
	if (params.kind !== "google-generative-ai") return false;
	if (!isOfficialGoogleAiStudioBaseUrl(params.model.baseUrl)) return false;
	return isGoogleGemini3ProModel(params.model.id) || isGoogleGemini3FlashModel(params.model.id);
}
function buildGoogleGemini3FirstResponseRetryParams(params) {
	const thinkingLevel = resolveGoogleGemini3ThinkingLevel({
		modelId: params.model.id,
		thinkingLevel: "off"
	});
	if (!thinkingLevel) return;
	const serializedRequest = JSON.stringify(params.request);
	const retryRequest = JSON.parse(serializedRequest);
	const generationConfig = retryRequest.generationConfig && typeof retryRequest.generationConfig === "object" ? retryRequest.generationConfig : {};
	const thinkingConfig = generationConfig.thinkingConfig && typeof generationConfig.thinkingConfig === "object" ? { ...generationConfig.thinkingConfig } : {};
	delete thinkingConfig.thinkingBudget;
	delete thinkingConfig.includeThoughts;
	thinkingConfig.thinkingLevel = thinkingLevel;
	generationConfig.thinkingConfig = thinkingConfig;
	retryRequest.generationConfig = generationConfig;
	return retryRequest;
}
function createChildSignal(parent, timeoutMs) {
	const controller = new AbortController();
	let timedOut = false;
	let timeout;
	const abortFromParent = () => {
		controller.abort(parent?.reason);
	};
	if (parent) {
		if (parent.aborted) abortFromParent();
		else parent.addEventListener("abort", abortFromParent, { once: true });
	}
	if (!controller.signal.aborted && timeoutMs > 0) {
		timeout = setTimeout(() => {
			timedOut = true;
			timeout = void 0;
			controller.abort(/* @__PURE__ */ new Error("Google Gemini first response retry deadline reached"));
		}, timeoutMs);
		timeout.unref?.();
	}
	const clearDeadline = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = void 0;
		}
	};
	return {
		signal: controller.signal,
		timedOut: () => timedOut,
		clearDeadline,
		cleanup: () => {
			clearDeadline();
			parent?.removeEventListener("abort", abortFromParent);
		}
	};
}
async function openGoogleSseAttempt(params) {
	const attemptSignal = params.firstResponseTimeoutMs > 0 ? createChildSignal(params.parentSignal, params.firstResponseTimeoutMs) : void 0;
	const signal = attemptSignal?.signal ?? params.parentSignal;
	try {
		const response = await params.guardedFetch(params.url, {
			method: "POST",
			headers: params.headers,
			body: serializeGoogleRequest(params.request, params.videoSlots),
			signal
		});
		await notifyProviderHttpResponse({
			options: params.options,
			response,
			model: canonicalGoogleModel(params.model),
			signal
		});
		if (!response.ok) throw await createProviderHttpError(response, params.errorPrefix);
		const chunks = parseGoogleSseChunks(response, signal);
		const prefetched = [];
		for (;;) {
			const first = await chunks.next();
			if (first.done) break;
			prefetched.push(first.value);
			if (!attemptSignal || hasGoogleFirstResponseActivity(first.value)) break;
		}
		attemptSignal?.clearDeadline();
		return {
			type: "ready",
			chunks: (async function* () {
				try {
					yield* prefetched;
					yield* chunks;
				} finally {
					attemptSignal?.cleanup();
					await chunks.return(void 0);
				}
			})()
		};
	} catch (error) {
		attemptSignal?.cleanup();
		if (attemptSignal?.timedOut() && !params.parentSignal?.aborted) return { type: "timeout" };
		throw error;
	}
}
async function openGoogleSseChunks(params) {
	const errorPrefix = params.kind === "google-vertex" ? "Google Vertex AI API error" : "Google Generative AI API error";
	const retryMs = shouldRetryGoogleGemini3FirstResponse(params) ? resolveGoogleGemini3FirstResponseRetryMs() : 0;
	const firstAttempt = await openGoogleSseAttempt({
		...params,
		parentSignal: params.options?.signal,
		firstResponseTimeoutMs: retryMs,
		errorPrefix
	});
	if (firstAttempt.type === "ready") return firstAttempt;
	const retryRequest = buildGoogleGemini3FirstResponseRetryParams({
		model: params.model,
		request: params.request
	});
	const retryAttempt = await openGoogleSseAttempt({
		...params,
		request: retryRequest,
		parentSignal: params.options?.signal,
		firstResponseTimeoutMs: 0,
		errorPrefix
	});
	if (retryAttempt.type === "timeout") throw new Error("Google Gemini first response retry timed out unexpectedly");
	return retryAttempt;
}
function createGoogleTransportStreamFn(kind) {
	return (rawModel, context, rawOptions) => {
		const model = rawModel;
		const canonicalModel = canonicalGoogleModel(model);
		const options = rawOptions;
		const { eventStream, stream } = createWritableTransportEventStream();
		(async () => {
			const output = buildAssistantMessage({
				model: {
					api: kind,
					provider: model.provider,
					id: model.id
				},
				content: [],
				usage: createEmptyTransportUsage(),
				stopReason: "stop"
			});
			try {
				const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? void 0;
				const guardedFetch = buildGuardedModelFetch(canonicalModel);
				const providerContext = supportsGoogleNativeVideo(model) ? await resolveProviderContext(context, options) : context;
				const videoSlots = /* @__PURE__ */ new Map();
				let params = buildGoogleGenerativeAiParams(model, providerContext, options, videoSlots);
				const nextParams = await options?.onPayload?.(params, canonicalModel);
				if (nextParams !== void 0) params = nextParams;
				const trustedVideoSlots = materializeGoogleRequestVideoSlots(params, videoSlots);
				const requestUrl = buildGoogleTransportRequestUrl(kind, model, options);
				const fetchImpl = options?.fetch;
				const openSse = async (apiKeyForRequest) => {
					const requestHeaders = kind === "google-vertex" ? await buildGoogleVertexHeaders(model, apiKeyForRequest, options?.headers, fetchImpl) : buildGoogleHeaders(model, apiKeyForRequest, options?.headers);
					return await openGoogleSseChunks({
						kind,
						model,
						options,
						guardedFetch,
						url: requestUrl,
						headers: requestHeaders,
						request: params,
						videoSlots: trustedVideoSlots
					});
				};
				const apiKeys = kind === "google-generative-ai" ? collectGoogleTransportApiKeys(model, options, apiKey) : [];
				const sse = apiKeys.length > 0 ? await executeWithApiKeyRotation({
					provider: model.provider,
					apiKeys,
					transientRetry: providerOperationRetryConfig("read"),
					execute: openSse
				}) : await openSse(apiKey);
				await consumeGoogleGenerateContentStream({
					chunks: sse.chunks,
					model: canonicalModel,
					output,
					stream,
					signal: options?.signal,
					nextToolCallId: (name) => `${name || "tool"}_${Date.now()}_${++toolCallCounter}`,
					profile: "managed",
					normalizeModelId: (id) => resolveGoogleModelPath(id.replace(GOOGLE_VERTEX_MODEL_RESOURCE_PREFIX, "")),
					resolveStopReason: mapStopReasonString
				});
			} catch (error) {
				failTransportStream({
					stream,
					output,
					signal: options?.signal,
					error
				});
			}
		})();
		return eventStream;
	};
}
function createGoogleGenerativeAiTransportStreamFn() {
	return createGoogleTransportStreamFn("google-generative-ai");
}
function createGoogleVertexTransportStreamFn() {
	return createGoogleTransportStreamFn("google-vertex");
}
function createGoogleInteractionsTransportStreamFn() {
	return (model, context, options) => {
		const { eventStream, stream } = createWritableTransportEventStream();
		(async () => {
			const output = buildAssistantMessage({
				model,
				content: [],
				usage: createEmptyTransportUsage(),
				stopReason: "stop"
			});
			try {
				const provider = getApiProvider("google-interactions");
				if (!provider) throw new Error("Google Interactions transport is unavailable");
				const apiKey = options?.apiKey ?? getEnvApiKey(model.provider);
				const openStream = async (requestApiKey) => {
					const bearer = requestApiKey ? parseGeminiAuth(requestApiKey).headers.Authorization : void 0;
					const requestOptions = {
						...options,
						apiKey: requestApiKey,
						[PROVIDER_MODEL_INPUT]: model.input,
						...bearer ? { headers: mergeTransportHeaders({ Authorization: bearer }, options?.headers) } : {}
					};
					const iterator = provider.streamSimple(model, context, requestOptions)[Symbol.asyncIterator]();
					const first = await iterator.next();
					if (!first.done && first.value.type === "error") {
						await iterator.return?.();
						throw new Error(first.value.error.errorMessage ?? "Google Interactions request failed");
					}
					return {
						first,
						iterator
					};
				};
				const apiKeys = collectGoogleTransportApiKeys(model, options, apiKey);
				const opened = apiKeys.length > 0 ? await executeWithApiKeyRotation({
					provider: model.provider,
					apiKeys,
					transientRetry: providerOperationRetryConfig("read"),
					execute: openStream
				}) : await openStream(apiKey);
				if (!opened.first.done) stream.push(opened.first.value);
				for (;;) {
					const next = await opened.iterator.next();
					if (next.done) break;
					stream.push(next.value);
				}
				stream.end();
			} catch (error) {
				failTransportStream({
					stream,
					output,
					signal: options?.signal,
					error
				});
			}
		})();
		return eventStream;
	};
}
//#endregion
export { createGoogleVertexTransportStreamFn as i, createGoogleGenerativeAiTransportStreamFn as n, createGoogleInteractionsTransportStreamFn as r, buildGoogleGenerativeAiParams as t };
