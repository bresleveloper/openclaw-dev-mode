import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./defaults-BbU4k6fu.mjs";
import { s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { r as resolveMoonshotThinkingType, t as createMoonshotThinkingWrapper } from "./moonshot-thinking-WDULA5E2.mjs";
import "./provider-model-shared-DwrT_ZjA.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { t as supportsOllamaCloudFullThinkingEffort } from "./model-reasoning-B-JcH6mc.mjs";
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
	if (!providers) return;
	const direct = providers[providerId];
	if (direct) return direct;
	const normalized = normalizeProviderId(providerId);
	for (const [candidateId, candidate] of Object.entries(providers)) if (normalizeProviderId(candidateId) === normalized) return candidate;
}
function isOllamaCompatProvider(model) {
	const providerId = normalizeProviderId(model.provider ?? "");
	if (providerId === "ollama") return true;
	if (!model.baseUrl) return false;
	try {
		const parsed = new URL(model.baseUrl);
		if (isLoopbackHost(parsed.hostname) && parsed.port === "11434") return true;
		const providerHintsOllama = providerId.includes("ollama");
		const isOllamaPort = parsed.port === "11434";
		const isOllamaCompatPath = parsed.pathname === "/" || /^\/v1\/?$/i.test(parsed.pathname);
		return providerHintsOllama && isOllamaPort && isOllamaCompatPath;
	} catch {
		return false;
	}
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
function createOllamaThinkingWrapper(baseFn, think) {
	return createLazyPayloadPatchStreamWrapper(baseFn, ({ payload }) => {
		payload.think = think;
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
function supportsNativeOllamaMax(model, providerId) {
	return (normalizeProviderId(model?.provider ?? "") === "ollama-cloud" || normalizeProviderId(providerId ?? "") === "ollama-cloud") && supportsOllamaCloudFullThinkingEffort(model?.id ?? "");
}
function shouldForwardNativeOllamaThink(model, think) {
	return think === false || model?.reasoning !== false;
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
	let injectNumCtx = false;
	const isNativeOllamaTransport = model?.api === "ollama";
	if (model) {
		const providerId = typeof model.provider === "string" && model.provider.trim().length > 0 ? model.provider : ctx.provider;
		if (shouldInjectOllamaCompatNumCtx({
			model,
			config: ctx.config,
			providerId
		})) injectNumCtx = true;
	}
	if (injectNumCtx && model) streamFn = wrapOllamaCompatNumCtx(streamFn, resolveOllamaNumCtx(model));
	const nativeMax = supportsNativeOllamaMax(model, ctx.provider);
	const configuredThinkValue = model ? resolveOllamaThinkParamValue(model.params, nativeMax) : void 0;
	const runtimeThinkValue = isNativeOllamaTransport ? normalizeOllamaThinkValue(ctx.thinkingLevel, nativeMax) : void 0;
	const ollamaThinkValue = runtimeThinkValue === false && configuredThinkValue !== void 0 ? void 0 : runtimeThinkValue;
	if (ollamaThinkValue !== void 0 && shouldForwardNativeOllamaThink(model, ollamaThinkValue)) streamFn = createOllamaThinkingWrapper(streamFn, ollamaThinkValue);
	if (normalizeProviderId(ctx.provider) === "ollama" && isOllamaCloudKimiModelRef(ctx.modelId)) {
		const thinkingType = resolveMoonshotThinkingType({
			configuredThinking: ctx.extraParams?.thinking,
			thinkingLevel: ctx.thinkingLevel
		});
		streamFn = createMoonshotThinkingWrapper(streamFn, thinkingType);
	}
	return streamFn;
}
//#endregion
export { resolveOllamaConfiguredNumCtx as a, shouldInjectOllamaCompatNumCtx as c, createKimiInlineReasoningSanitizer as d, isOllamaCloudKimiModelRef as f, resolveOllamaCompatNumCtxEnabled as i, supportsNativeOllamaMax as l, isOllamaCompatProvider as n, resolveOllamaThinkParamValue as o, resolveConfiguredOllamaProviderConfig as r, shouldForwardNativeOllamaThink as s, createConfiguredOllamaCompatStreamWrapper as t, wrapOllamaCompatNumCtx as u };
