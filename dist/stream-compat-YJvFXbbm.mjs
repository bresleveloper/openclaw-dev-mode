import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./defaults-Jag53zwP.mjs";
import { s as isLoopbackHost } from "./net-C6WEu3pd.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveMoonshotThinkingType, t as createMoonshotThinkingWrapper } from "./moonshot-thinking-JmWKqAlI.mjs";
import "./provider-model-shared-CgZ78XZA.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import "./provider-auth-BGYKg9mW.mjs";
import { m as isOllamaCloudOrigin } from "./defaults-Dkg1KktH.mjs";
import { n as supportsOllamaCloudFullThinkingEffort } from "./model-reasoning-BxIAfSxy.mjs";
import { n as resolveOllamaBaseUrlForRun, t as readProviderBaseUrl } from "./provider-base-url-Crmh7W8f.mjs";
//#region extensions/ollama/src/sanitizers/kimi-inline-reasoning.ts
const INLINE_REASONING_MIN_PREFIX_CHARS = 80;
const INLINE_REASONING_MAX_PENDING_CHARS = 512;
const INLINE_REASONING_BOUNDARY_RE = /(^|\s)\uFE0F\s*/u;
function isOllamaCloudKimiModelRef(modelId) {
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const slashIndex = normalizedModelId.indexOf("/");
	const normalizedWireModelId = slashIndex === -1 ? normalizedModelId : normalizedModelId.slice(slashIndex + 1);
	return normalizedWireModelId.startsWith("kimi-k") && normalizedWireModelId.includes(":cloud");
}
function resolveInlineReasoningVisibleText(params) {
	const match = INLINE_REASONING_BOUNDARY_RE.exec(params.text);
	if (!match || match[1] === void 0) {
		if (!params.final && params.text.length <= INLINE_REASONING_MAX_PENDING_CHARS) return { kind: "pending" };
		return {
			kind: "visible",
			text: params.text,
			bypassInlineReasoning: !params.final && params.text.length > INLINE_REASONING_MAX_PENDING_CHARS
		};
	}
	const boundaryStartIndex = match.index + match[1].length;
	const boundaryEndIndex = match.index + match[0].length;
	const prefix = params.text.slice(0, boundaryStartIndex).trim();
	const answer = params.text.slice(boundaryEndIndex).trim();
	if (prefix.length >= INLINE_REASONING_MIN_PREFIX_CHARS) return {
		kind: "visible",
		text: answer
	};
	return params.final ? {
		kind: "visible",
		text: params.text
	} : { kind: "pending" };
}
function createKimiInlineReasoningSanitizer() {
	let bypassInlineReasoning = false;
	return {
		resolveStreamText(params) {
			if (bypassInlineReasoning) return {
				kind: "visible",
				text: params.text
			};
			const resolution = resolveInlineReasoningVisibleText(params);
			if (resolution.kind === "pending") return resolution;
			if (resolution.bypassInlineReasoning) bypassInlineReasoning = true;
			return {
				kind: "visible",
				text: resolution.text
			};
		},
		sanitizeFinalText(text) {
			const resolution = resolveInlineReasoningVisibleText({
				text,
				final: true
			});
			return resolution.kind === "visible" ? resolution.text : text;
		}
	};
}
//#endregion
//#region extensions/ollama/src/stream-compat.ts
const loadProviderStreamRuntime = createLazyRuntimeModule(() => import("./plugin-sdk/provider-stream-shared.js"));
const loadToolNameAliases = createLazyRuntimeModule(() => import("./tool-name-aliases-qCdbdDZQ.mjs"));
function createLazyPayloadPatchStreamWrapper(baseFn, patchPayload) {
	const loadStream = createLazyRuntimeSurface(loadProviderStreamRuntime, (runtime) => runtime.createPayloadPatchStreamWrapper(baseFn, patchPayload));
	return async (model, context, options) => {
		options?.signal?.throwIfAborted();
		const stream = await loadStream();
		options?.signal?.throwIfAborted();
		return stream(model, context, options);
	};
}
function resolveConfiguredOllamaProviderConfig(params) {
	const providerId = params.providerId?.trim();
	if (!providerId) return;
	const providers = params.config?.models?.providers;
	return providers?.[providerId] ?? findNormalizedProviderValue(providers, providerId);
}
function isOllamaCompatProvider(model) {
	const providerId = normalizeProviderId(model.provider ?? "");
	if (providerId === "ollama") return true;
	if (!model.baseUrl) return false;
	const parsed = URL.parse(model.baseUrl);
	if (!parsed) return false;
	if (isLoopbackHost(parsed.hostname) && parsed.port === "11434") return true;
	const providerHintsOllama = providerId.includes("ollama");
	const isOllamaPort = parsed.port === "11434";
	const isOllamaCompatPath = parsed.pathname === "/" || /^\/v1\/?$/i.test(parsed.pathname);
	return providerHintsOllama && isOllamaPort && isOllamaCompatPath;
}
function resolveOllamaCompatNumCtxEnabled(params) {
	return resolveConfiguredOllamaProviderConfig(params)?.injectNumCtxForOpenAICompat ?? true;
}
function shouldInjectOllamaCompatNumCtx(params) {
	if (params.model.api !== "openai-completions") return false;
	if (!isOllamaCompatProvider(params.model)) return false;
	return resolveOllamaCompatNumCtxEnabled({
		config: params.config,
		providerId: params.providerId
	});
}
function wrapOllamaCompatNumCtx(baseFn, numCtx) {
	return createLazyPayloadPatchStreamWrapper(baseFn, ({ payload }) => {
		if (!payload.options || typeof payload.options !== "object") payload.options = {};
		payload.options.num_ctx = numCtx;
	});
}
function normalizeOllamaThinkValue(value, nativeMax) {
	if (typeof value === "boolean") return value;
	if (value === "off") return false;
	if (value === "low" || value === "medium" || value === "high") return value;
	if (value === "max") return nativeMax ? "max" : "high";
	if (value === "minimal") return "low";
	if (value === "xhigh" || value === "adaptive") return "high";
}
function resolveOllamaThinkParamValue(params, nativeMax = false) {
	return normalizeOllamaThinkValue(params?.think ?? params?.thinking, nativeMax);
}
function supportsNativeOllamaMax(model, baseUrl, providerId) {
	return (normalizeProviderId(model?.provider ?? "") === "ollama-cloud" || normalizeProviderId(providerId ?? "") === "ollama-cloud" || isOllamaCloudOrigin(baseUrl)) && supportsOllamaCloudFullThinkingEffort(model?.id ?? "");
}
function shouldForwardNativeOllamaThink(model, think) {
	return think === false || model?.reasoning !== false;
}
/** Configured `think` that the native transport sends, when the model accepts it. */
function resolveOllamaConfiguredThink(model, nativeMax) {
	const think = resolveOllamaThinkParamValue(model.params, nativeMax);
	return think !== void 0 && shouldForwardNativeOllamaThink(model, think) ? think : void 0;
}
function resolveOllamaConfiguredNumCtx(model) {
	const raw = model.params?.num_ctx;
	if (typeof raw !== "number" || !Number.isFinite(raw) || raw <= 0) return;
	return Math.floor(raw);
}
function resolveOllamaNumCtx(model) {
	return resolveOllamaConfiguredNumCtx(model) ?? Math.max(1, Math.floor(model.contextTokens ?? model.contextWindow ?? model.maxTokens ?? 2e5));
}
function createConfiguredOllamaCompatStreamWrapper(ctx) {
	let streamFn = ctx.streamFn;
	const model = ctx.model;
	const isNativeOllamaTransport = model?.api === "ollama";
	if (model) {
		const providerId = typeof model.provider === "string" && model.provider.trim().length > 0 ? model.provider : ctx.provider;
		if (shouldInjectOllamaCompatNumCtx({
			model,
			config: ctx.config,
			providerId
		})) streamFn = wrapOllamaCompatNumCtx(streamFn, resolveOllamaNumCtx(model));
	}
	const nativeMax = supportsNativeOllamaMax(model, resolveOllamaBaseUrlForRun({
		modelBaseUrl: model?.baseUrl,
		providerBaseUrl: readProviderBaseUrl(resolveConfiguredOllamaProviderConfig({
			config: ctx.config,
			providerId: ctx.provider
		}))
	}), ctx.provider);
	const configuredThinkValue = model ? resolveOllamaThinkParamValue(model.params, nativeMax) : void 0;
	const runtimeThinkValue = isNativeOllamaTransport ? normalizeOllamaThinkValue(ctx.thinkingLevel, nativeMax) : void 0;
	const ollamaThinkValue = runtimeThinkValue === false && configuredThinkValue !== void 0 ? void 0 : runtimeThinkValue;
	if (ollamaThinkValue !== void 0 && shouldForwardNativeOllamaThink(model, ollamaThinkValue)) streamFn = createLazyPayloadPatchStreamWrapper(streamFn, ({ payload }) => {
		payload.think = ollamaThinkValue;
	});
	if (normalizeProviderId(ctx.provider) === "ollama" && isOllamaCloudKimiModelRef(ctx.modelId)) {
		const thinkingType = resolveMoonshotThinkingType({
			configuredThinking: ctx.extraParams?.thinking,
			thinkingLevel: ctx.thinkingLevel
		});
		streamFn = createMoonshotThinkingWrapper(streamFn, thinkingType);
	}
	if (model?.api === "openai-completions" && isOllamaCompatProvider(model)) {
		const underlying = streamFn;
		const loadStream = createLazyRuntimeSurface(loadToolNameAliases, (runtime) => runtime.wrapOllamaToolNames(underlying));
		return async (selectedModel, context, options) => {
			options?.signal?.throwIfAborted();
			const stream = await loadStream();
			options?.signal?.throwIfAborted();
			return stream(selectedModel, context, options);
		};
	}
	return streamFn;
}
//#endregion
export { resolveOllamaConfiguredNumCtx as a, supportsNativeOllamaMax as c, isOllamaCloudKimiModelRef as d, resolveOllamaCompatNumCtxEnabled as i, wrapOllamaCompatNumCtx as l, isOllamaCompatProvider as n, resolveOllamaConfiguredThink as o, resolveConfiguredOllamaProviderConfig as r, shouldInjectOllamaCompatNumCtx as s, createConfiguredOllamaCompatStreamWrapper as t, createKimiInlineReasoningSanitizer as u };
