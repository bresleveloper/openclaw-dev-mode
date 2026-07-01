import { i as loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-Dj-RntJ4.js";
import { f as wrapProviderSimpleCompletionStreamFn } from "./provider-hook-runtime-C6uU9bTJ.js";
import "./provider-runtime-D4NEMgBr.js";
import { i as streamSimple, o as getApiProvider } from "./stream-Bs1DzXcN.js";
import { T as streamWithPayloadPatch, y as sanitizeGoogleThinkingPayload } from "./provider-stream-shared-CDfVnM8B.js";
import { a as prepareTransportAwareSimpleModel, i as createOpenClawTransportStreamFnForModel, n as buildTransportAwareSimpleStreamFn, o as resolveTransportAwareSimpleApi, s as ensureCustomApiRegistered, t as registerProviderStreamForModel } from "./provider-stream-BSVCqT_P.js";
//#region src/agents/anthropic-vertex-stream.ts
/**
* Anthropic Vertex stream facade.
* Keeps Vertex-specific provider implementation in the bundled provider plugin
* while core imports a small stable factory.
*/
function loadAnthropicVertexStreamFacade() {
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: "anthropic-vertex",
		artifactBasename: "api.js"
	});
}
/** Creates an Anthropic Vertex stream function through the bundled provider facade. */
function createAnthropicVertexStreamFnForModel(model, env = process.env) {
	return loadAnthropicVertexStreamFacade().createAnthropicVertexStreamFnForModel(model, env);
}
//#endregion
//#region src/agents/google-simple-completion-stream.ts
/**
* Google simple-completion stream adapter.
*
* This registers a patched Google stream API that keeps the normal Google
* backend but sanitizes unsupported thinking payload options for simple models.
*/
/** Custom API id for the Google simple-completion stream adapter. */
const GOOGLE_SIMPLE_COMPLETION_API = "openclaw-google-generative-ai-simple";
const SOURCE_API = "google-generative-ai";
function resolveGoogleSimpleThinkingLevel(reasoning) {
	switch (reasoning) {
		case "off":
		case "minimal":
		case "low":
		case "medium":
		case "adaptive":
		case "high":
		case "max":
		case "xhigh": return reasoning;
		default: return;
	}
}
function buildGoogleSimpleCompletionStreamFn() {
	return (model, context, options) => {
		return streamWithPayloadPatch(streamSimple, {
			...model,
			api: SOURCE_API
		}, context, options, (payload) => {
			sanitizeGoogleThinkingPayload({
				payload,
				modelId: model.id,
				thinkingLevel: resolveGoogleSimpleThinkingLevel(options?.reasoning)
			});
		});
	};
}
/** Rewrites Google generative-ai models to the simple-completion adapter when needed. */
function prepareGoogleSimpleCompletionModel(model) {
	if (model.api !== SOURCE_API) return model;
	ensureCustomApiRegistered(GOOGLE_SIMPLE_COMPLETION_API, buildGoogleSimpleCompletionStreamFn());
	return {
		...model,
		api: GOOGLE_SIMPLE_COMPLETION_API
	};
}
//#endregion
//#region src/agents/simple-completion-transport.ts
const PROVIDER_SIMPLE_COMPLETION_API_PREFIX = "openclaw-provider-simple:";
function resolveAnthropicVertexSimpleApi(baseUrl) {
	return `openclaw-anthropic-vertex-simple:${baseUrl?.trim() ? encodeURIComponent(baseUrl.trim()) : "default"}`;
}
function normalizeCodexResponsesBaseUrlForOpenAISdk(baseUrl) {
	const normalized = baseUrl?.trim().replace(/\/+$/u, "") || "https://chatgpt.com/backend-api";
	try {
		const parsed = new URL(normalized);
		const path = parsed.pathname.replace(/\/+$/u, "").toLowerCase();
		if (parsed.hostname.toLowerCase() === "chatgpt.com" && [
			"/backend-api",
			"/backend-api/v1",
			"/backend-api/codex",
			"/backend-api/codex/v1",
			"/backend-api/codex/responses"
		].includes(path)) {
			parsed.pathname = "/backend-api/codex";
			parsed.search = "";
			parsed.hash = "";
			return parsed.toString().replace(/\/$/u, "");
		}
	} catch {}
	if (normalized.endsWith("/codex/responses")) return normalized.slice(0, -10);
	if (normalized.endsWith("/codex")) return normalized;
	return `${normalized}/codex`;
}
function resolveProviderSimpleCompletionApi(model) {
	return `${PROVIDER_SIMPLE_COMPLETION_API_PREFIX}${[
		model.provider,
		model.id,
		model.api,
		model.baseUrl || "default"
	].map((part) => encodeURIComponent(part)).join(":")}`;
}
function applyProviderSimpleCompletionWrapper(model, cfg) {
	if (model.api.startsWith(PROVIDER_SIMPLE_COMPLETION_API_PREFIX)) return model;
	const sourceProvider = getApiProvider(model.api);
	if (!sourceProvider) return model;
	const sourceApi = model.api;
	const sourceStreamFn = (runtimeModel, context, options) => sourceProvider.streamSimple({
		...runtimeModel,
		api: sourceApi
	}, context, options);
	const streamFn = wrapProviderSimpleCompletionStreamFn({
		provider: model.provider,
		config: cfg,
		context: {
			config: cfg,
			provider: model.provider,
			modelId: model.id,
			model,
			streamFn: sourceStreamFn
		}
	});
	if (!streamFn) return model;
	const api = resolveProviderSimpleCompletionApi(model);
	ensureCustomApiRegistered(api, streamFn);
	return {
		...model,
		api
	};
}
function prepareCodexSimpleTransportModel(model, cfg) {
	if (model.provider !== "openai" || model.api !== "openai-chatgpt-responses") return;
	const transportModel = {
		...model,
		baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(model.baseUrl)
	};
	const api = resolveTransportAwareSimpleApi(model.api);
	const streamFn = createOpenClawTransportStreamFnForModel(transportModel, { cfg });
	if (!api || !streamFn) return;
	ensureCustomApiRegistered(api, streamFn);
	return {
		...transportModel,
		api
	};
}
function prepareModelForSimpleCompletion(params) {
	const { model, cfg } = params;
	if (!getApiProvider(model.api) && registerProviderStreamForModel({
		model,
		cfg
	})) return applyProviderSimpleCompletionWrapper(model, cfg);
	const codexTransportModel = prepareCodexSimpleTransportModel(model, cfg);
	if (codexTransportModel) return applyProviderSimpleCompletionWrapper(codexTransportModel, cfg);
	const transportAwareModel = prepareTransportAwareSimpleModel(model, { cfg });
	if (transportAwareModel !== model) {
		const streamFn = buildTransportAwareSimpleStreamFn(model, { cfg });
		if (streamFn) {
			ensureCustomApiRegistered(transportAwareModel.api, streamFn);
			return applyProviderSimpleCompletionWrapper(transportAwareModel, cfg);
		}
	}
	if (model.api === "google-generative-ai") return applyProviderSimpleCompletionWrapper(prepareGoogleSimpleCompletionModel(model), cfg);
	if (model.provider === "anthropic-vertex") {
		const api = resolveAnthropicVertexSimpleApi(model.baseUrl);
		ensureCustomApiRegistered(api, createAnthropicVertexStreamFnForModel(model));
		return applyProviderSimpleCompletionWrapper({
			...model,
			api
		}, cfg);
	}
	return applyProviderSimpleCompletionWrapper(model, cfg);
}
//#endregion
export { createAnthropicVertexStreamFnForModel as n, prepareModelForSimpleCompletion as t };
