import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as createProviderHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-DOrVD029.mjs";
import { g as resolveProviderContext, l as getEnvApiKey } from "./llm-CLV5ZXaS.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { r as providerOperationRetryConfig } from "./operation-retry-Dopl7EnK.mjs";
import { t as buildGuardedModelFetch } from "./provider-transport-fetch-DnNw-XtJ.mjs";
import { n as executeWithApiKeyRotation, t as collectProviderApiKeysForExecution } from "./api-key-rotation-BmnkFDjk.mjs";
import "./number-runtime-CGwowceO.mjs";
import { F as resolveGoogleGemini3ThinkingLevel, L as stripInvalidGoogleThinkingBudget, N as isGoogleGemini25ThinkingBudgetModel } from "./provider-stream-shared-CuBHNQvM.mjs";
import { n as transformTransportMessages } from "./ai-transport-runtime-host-BgxyBsLi.mjs";
import "./provider-auth-runtime-CYwZwijM.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { n as isGoogleGemini3ProModel, t as isGoogleGemini3FlashModel } from "./provider-thinking-runtime-BjDyROFK.mjs";
import { C as sanitizeTransportPayloadText, E as stripSystemPromptCacheBoundary, S as requiresGoogleToolCallId, d as failTransportStream, g as mergeTransportHeaders, i as convertGoogleTools, o as createEmptyTransportUsage, r as consumeGoogleGenerateContentStream, s as createWritableTransportEventStream, v as notifyProviderHttpResponse, x as projectGoogleMessages } from "./provider-transport-runtime-BWh0ty1f.mjs";
import { r as stripGoogleProviderPrefix } from "./model-id-CAmKILzd.mjs";
import { d as isOfficialGoogleAiStudioBaseUrl, f as normalizeGoogleApiBaseUrl } from "./provider-policy-BWkzSuhk.mjs";
import "./thinking-api-DfyXXC-Y.mjs";
import { t as isGoogleNativeVideoModelId } from "./provider-models-C7kay9Ti.mjs";
import { t as parseGeminiAuth } from "./gemini-auth-CGSaK1is.mjs";
import { t as isGoogleVertexCredentialsMarker } from "./vertex-adc-config-DuKAthGG.mjs";
import { t as resolveGoogleVertexAuthorizedUserHeaders } from "./vertex-adc-B-APcgQ7.mjs";
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
const GOOGLE_VIDEO_SLOT_OMISSION = "(video omitted: native video slot unavailable)";
const GOOGLE_VIDEO_MIME_OMISSION = "(video omitted: unsupported Google video MIME type)";
const GOOGLE_REQUEST_BYTES_EXCLUSIVE = 2e7;
const GOOGLE_GEMINI3_FIRST_RESPONSE_RETRY_DEFAULT_MS = 45e3;
const GOOGLE_GEMINI3_FIRST_RESPONSE_RETRY_ENV = "OPENCLAW_GOOGLE_GEMINI_FIRST_RESPONSE_RETRY_MS";
const GOOGLE_SSE_EVENT_BOUNDARY_RE = /(?:\r\n|\r(?!\n)|\n){2}/u;
const GOOGLE_VERTEX_MODEL_RESOURCE_PREFIX = /^(?:projects\/[^/]+\/locations\/[^/]+\/)?publishers\/google\/models\//u;
const GOOGLE_VERTEX_DEFAULT_API_VERSION = "v1";
let toolCallCounter = 0;
function requiresToolCallThoughtSignature(modelId) {
	return isGoogleGemini3ProModel(modelId) || isGoogleGemini3FlashModel(modelId);
}
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
	switch (reason) {
		case "STOP": return "stop";
		case "MAX_TOKENS": return "length";
		default: return "error";
	}
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
		if (isGoogleGemini3ProModel(model.id) || isGoogleGemini3FlashModel(model.id)) return { includeThoughts: true };
		if (isGoogleGemini25ThinkingBudgetModel(model.id)) return normalizeGoogleThinkingConfig(model.id, {
			includeThoughts: true,
			thinkingBudget: -1
		});
	}
	if (isGoogleGemini3ProModel(model.id) || isGoogleGemini3FlashModel(model.id)) return {
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
		messages: transformTransportMessages(normalizeGoogleTransportMessageRoutes(context.messages), canonicalGoogleModel(routeModel), (id) => requiresGoogleToolCallId(model.id) ? normalizeToolCallId(id) : id, { preserveCrossModelToolCallThoughtSignature: requiresToolCallThoughtSignature(model.id) }),
		replay: "managed",
		requiresToolCallSignature: requiresToolCallThoughtSignature(model.id),
		videoPart: (video) => {
			const placeholder = { text: GOOGLE_VIDEO_SLOT_OMISSION };
			videoSlots?.set(placeholder, video);
			return placeholder;
		}
	});
}
function buildGoogleGenerativeAiParams(model, context, options, videoSlots) {
	const generationConfig = {};
	if (typeof options?.temperature === "number") generationConfig.temperature = options.temperature;
	if (typeof options?.maxTokens === "number") generationConfig.maxOutputTokens = options.maxTokens;
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
function materializeGoogleVideoSlots(request, slots) {
	const trusted = [];
	const visit = (value) => {
		if (Array.isArray(value)) {
			value.forEach(visit);
			return;
		}
		if (!isRecord(value)) return;
		const video = slots.get(value);
		if (video) {
			if (!GOOGLE_NATIVE_VIDEO_MIME.has(video.mimeType)) {
				replaceGooglePartWithText(value, GOOGLE_VIDEO_MIME_OMISSION);
				return;
			}
			Object.keys(value).forEach((key) => Reflect.deleteProperty(value, key));
			value.inlineData = {
				mimeType: video.mimeType,
				data: video.data
			};
			trusted.push(value);
			return;
		}
		const inlineData = isRecord(value.inlineData) ? value.inlineData : void 0;
		if (normalizeLowercaseStringOrEmpty(inlineData?.mimeType).startsWith("video/")) {
			replaceGooglePartWithText(value, GOOGLE_VIDEO_SLOT_OMISSION);
			return;
		}
		Object.values(value).forEach(visit);
	};
	visit(request);
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
function isGoogleOauthApiKey(apiKey) {
	return Boolean(apiKey?.trimStart().startsWith("{") && parseGeminiAuth(apiKey).headers.Authorization);
}
function hasGoogleAuthHeader(headers) {
	return Object.keys(headers ?? {}).some((name) => {
		const normalized = name.trim().toLowerCase();
		return normalized === "authorization" || normalized === "x-goog-api-key";
	});
}
function collectGoogleTransportApiKeys(params) {
	if (params.kind !== "google-generative-ai" || !isOfficialGoogleAiStudioBaseUrl(params.model.baseUrl) || isGoogleOauthApiKey(params.primaryApiKey) || hasGoogleAuthHeader(params.model.headers) || hasGoogleAuthHeader(params.options?.headers)) return [];
	return collectProviderApiKeysForExecution({
		provider: params.model.provider,
		primaryApiKey: params.primaryApiKey
	});
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
function resolveGoogleGemini3FirstResponseRetryMs(env = process.env) {
	const raw = env[GOOGLE_GEMINI3_FIRST_RESPONSE_RETRY_ENV];
	if (raw === void 0 || raw.trim() === "") return GOOGLE_GEMINI3_FIRST_RESPONSE_RETRY_DEFAULT_MS;
	return parseStrictNonNegativeInteger(raw) ?? GOOGLE_GEMINI3_FIRST_RESPONSE_RETRY_DEFAULT_MS;
}
function shouldRetryGoogleGemini3FirstResponse(params) {
	if (params.kind !== "google-generative-ai") return false;
	if (!isOfficialGoogleAiStudioBaseUrl(params.model.baseUrl)) return false;
	return isGoogleGemini3ProModel(params.model.id) || isGoogleGemini3FlashModel(params.model.id);
}
function cloneGoogleGenerateContentRequest(params) {
	const serialized = JSON.stringify(params);
	return JSON.parse(serialized);
}
function buildGoogleGemini3FirstResponseRetryParams(params) {
	const thinkingLevel = resolveGoogleGemini3ThinkingLevel({
		modelId: params.model.id,
		thinkingLevel: "off"
	});
	if (!thinkingLevel) return;
	const retryRequest = cloneGoogleGenerateContentRequest(params.request);
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
function iteratorToAsyncGenerator(iterator, cleanup) {
	return (async function* () {
		try {
			for (;;) {
				const next = await iterator.next();
				if (next.done) return;
				yield next.value;
			}
		} finally {
			cleanup?.();
			await iterator.return?.();
		}
	})();
}
async function notifyGoogleTransportHttpResponse(model, options, response, signal) {
	await notifyProviderHttpResponse({
		options,
		response,
		model: canonicalGoogleModel(model),
		signal
	});
}
async function openGoogleSseAttempt(params) {
	const attemptSignal = params.firstResponseTimeoutMs > 0 ? createChildSignal(params.parentSignal, params.firstResponseTimeoutMs) : void 0;
	const signal = attemptSignal?.signal ?? params.parentSignal;
	const handleTimedOperationError = (error) => {
		attemptSignal?.cleanup();
		if (attemptSignal?.timedOut() && !params.parentSignal?.aborted) return { type: "timeout" };
		throw error;
	};
	let response;
	try {
		response = await params.guardedFetch(params.url, {
			method: "POST",
			headers: params.headers,
			body: serializeGoogleRequest(params.request, params.videoSlots),
			signal
		});
	} catch (error) {
		return handleTimedOperationError(error);
	}
	try {
		await notifyGoogleTransportHttpResponse(params.model, params.options, response, signal);
	} catch (error) {
		return handleTimedOperationError(error);
	}
	if (!response.ok) {
		attemptSignal?.cleanup();
		throw await createProviderHttpError(response, params.errorPrefix);
	}
	const iterator = parseGoogleSseChunks(response, signal)[Symbol.asyncIterator]();
	let first;
	try {
		first = await iterator.next();
	} catch (error) {
		return handleTimedOperationError(error);
	}
	attemptSignal?.clearDeadline();
	if (first.done) return {
		type: "ready",
		chunks: iteratorToAsyncGenerator(iterator, attemptSignal?.cleanup)
	};
	return {
		type: "ready",
		firstChunk: first.value,
		chunks: iteratorToAsyncGenerator(iterator, attemptSignal?.cleanup)
	};
}
async function openGoogleSseChunks(params) {
	const errorPrefix = params.kind === "google-vertex" ? "Google Vertex AI API error" : "Google Generative AI API error";
	if (!shouldRetryGoogleGemini3FirstResponse({
		kind: params.kind,
		model: params.model
	})) {
		const response = await params.guardedFetch(params.url, {
			method: "POST",
			headers: params.headers,
			body: serializeGoogleRequest(params.request, params.videoSlots),
			signal: params.options?.signal
		});
		await notifyGoogleTransportHttpResponse(params.model, params.options, response, params.options?.signal);
		if (!response.ok) throw await createProviderHttpError(response, errorPrefix);
		return {
			type: "ready",
			chunks: parseGoogleSseChunks(response, params.options?.signal)
		};
	}
	const retryMs = resolveGoogleGemini3FirstResponseRetryMs();
	if (retryMs <= 0) {
		const response = await params.guardedFetch(params.url, {
			method: "POST",
			headers: params.headers,
			body: serializeGoogleRequest(params.request, params.videoSlots),
			signal: params.options?.signal
		});
		await notifyGoogleTransportHttpResponse(params.model, params.options, response, params.options?.signal);
		if (!response.ok) throw await createProviderHttpError(response, errorPrefix);
		return {
			type: "ready",
			chunks: parseGoogleSseChunks(response, params.options?.signal)
		};
	}
	const firstAttempt = await openGoogleSseAttempt({
		guardedFetch: params.guardedFetch,
		url: params.url,
		headers: params.headers,
		request: params.request,
		videoSlots: params.videoSlots,
		parentSignal: params.options?.signal,
		firstResponseTimeoutMs: retryMs,
		errorPrefix,
		model: params.model,
		options: params.options
	});
	if (firstAttempt.type === "ready") return firstAttempt;
	const retryRequest = buildGoogleGemini3FirstResponseRetryParams({
		model: params.model,
		request: params.request
	});
	const retryAttempt = await openGoogleSseAttempt({
		guardedFetch: params.guardedFetch,
		url: params.url,
		headers: params.headers,
		request: retryRequest,
		videoSlots: params.videoSlots,
		parentSignal: params.options?.signal,
		firstResponseTimeoutMs: 0,
		errorPrefix,
		model: params.model,
		options: params.options
	});
	if (retryAttempt.type === "timeout") throw new Error("Google Gemini first response retry timed out unexpectedly");
	return retryAttempt;
}
async function buildGoogleTransportHeaders(params) {
	return params.kind === "google-vertex" ? await buildGoogleVertexHeaders(params.model, params.apiKey, params.optionHeaders, params.fetchImpl) : buildGoogleHeaders(params.model, params.apiKey, params.optionHeaders);
}
async function* parseGoogleSseChunks(response, signal) {
	if (!response.body) throw new Error("No response body");
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let completed = false;
	const abortHandler = () => {
		reader.cancel().catch(() => void 0);
	};
	signal?.addEventListener("abort", abortHandler);
	try {
		while (true) {
			signal?.throwIfAborted();
			const { done, value } = await reader.read();
			signal?.throwIfAborted();
			if (done) {
				buffer += decoder.decode();
				const trailingData = buffer.split(/\r\n|\n|\r/u).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
				const trailingPayload = trailingData || buffer.trim();
				if (!trailingPayload || !trailingData && !trailingPayload.startsWith("{")) {
					completed = true;
					break;
				}
				let trailingChunk;
				try {
					trailingChunk = JSON.parse(trailingPayload);
				} catch {
					throw new Error("Google SSE stream ended with an incomplete frame");
				}
				if (!isRecord(trailingChunk) || !isRecord(trailingChunk.error)) throw new Error("Google SSE stream ended with an incomplete frame");
				buffer = `data: ${JSON.stringify(trailingChunk)}\n\n`;
			} else buffer += decoder.decode(value, { stream: true });
			let boundary = GOOGLE_SSE_EVENT_BOUNDARY_RE.exec(buffer);
			while (boundary) {
				const rawEvent = buffer.slice(0, boundary.index);
				buffer = buffer.slice(boundary.index + boundary[0].length);
				boundary = GOOGLE_SSE_EVENT_BOUNDARY_RE.exec(buffer);
				const data = rawEvent.split(/\r\n|\n|\r/u).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
				if (!data || data === "[DONE]") continue;
				let chunk;
				try {
					chunk = JSON.parse(data);
				} catch {
					throw new Error("Google SSE stream returned malformed JSON");
				}
				if (isRecord(chunk) && isRecord(chunk.error)) {
					const providerError = chunk.error;
					throw Object.assign(new Error(normalizeOptionalString(providerError.message) ?? "Google stream failed"), {
						code: normalizeOptionalString(providerError.status) ?? "GOOGLE_STREAM_ERROR",
						status: typeof providerError.code === "number" ? providerError.code : void 0,
						type: "google_stream_failed"
					});
				}
				yield chunk;
			}
		}
	} finally {
		signal?.removeEventListener("abort", abortHandler);
		if (!completed) await reader.cancel(signal?.reason).catch(() => void 0);
		reader.releaseLock();
	}
}
function createGoogleTransportStreamFn(kind) {
	return (rawModel, context, rawOptions) => {
		const model = rawModel;
		const canonicalModel = canonicalGoogleModel(model);
		const options = rawOptions;
		const { eventStream, stream } = createWritableTransportEventStream();
		(async () => {
			const output = {
				role: "assistant",
				content: [],
				api: kind,
				provider: model.provider,
				model: model.id,
				usage: createEmptyTransportUsage(),
				stopReason: "stop",
				timestamp: Date.now()
			};
			try {
				const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? void 0;
				const guardedFetch = buildGuardedModelFetch(canonicalModel);
				const providerContext = supportsGoogleNativeVideo(model) ? await resolveProviderContext(context, options) : context;
				const videoSlots = /* @__PURE__ */ new Map();
				let params = buildGoogleGenerativeAiParams(model, providerContext, options, videoSlots);
				const nextParams = await options?.onPayload?.(params, canonicalModel);
				if (nextParams !== void 0) params = nextParams;
				const trustedVideoSlots = materializeGoogleVideoSlots(params, videoSlots);
				const requestUrl = buildGoogleTransportRequestUrl(kind, model, options);
				const fetchImpl = options?.fetch;
				const openSse = async (apiKeyForRequest) => {
					const requestHeaders = await buildGoogleTransportHeaders({
						kind,
						model,
						apiKey: apiKeyForRequest,
						optionHeaders: options?.headers,
						fetchImpl
					});
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
				const apiKeys = collectGoogleTransportApiKeys({
					kind,
					model,
					options,
					primaryApiKey: apiKey
				});
				const sse = apiKeys.length > 0 ? await executeWithApiKeyRotation({
					provider: model.provider,
					apiKeys,
					transientRetry: providerOperationRetryConfig("read"),
					execute: openSse
				}) : await openSse(apiKey);
				const chunks = sse.firstChunk === void 0 ? sse.chunks : (async function* (firstChunk) {
					yield firstChunk;
					yield* sse.chunks;
				})(sse.firstChunk);
				await consumeGoogleGenerateContentStream({
					chunks,
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
//#endregion
export { createGoogleGenerativeAiTransportStreamFn as n, createGoogleVertexTransportStreamFn as r, buildGoogleGenerativeAiParams as t };
