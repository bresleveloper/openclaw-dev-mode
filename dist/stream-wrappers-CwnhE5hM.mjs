import { a as normalizeFastMode, g as readStringValue, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as resolveProviderEndpoint } from "./provider-attribution-DUtJJsHV.mjs";
import { h as supportsClaude1MContext } from "./anthropic-Cy4mTngV.mjs";
import { l as getEnvApiKey } from "./llm-DOLzmv8G.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import { i as streamSimple } from "./stream-V1Shd8lY.mjs";
import { E as resolveAnthropicServerCompactionPlan, T as resolveAnthropicPayloadPolicy, a as createAnthropicThinkingPrefillPayloadWrapper, d as createPayloadPatchStreamWrapper, h as isAnthropicOAuthApiKey, i as composeProviderStreamWrappers, t as applyAnthropicPayloadPolicyToParams } from "./provider-stream-shared-BtT7wZpQ.mjs";
import "./provider-model-shared-DUNuGxOQ.mjs";
import { i as supportsAnthropicPriorityTier, n as resolveAnthropicFastModePlan, t as normalizeAnthropicServiceTier } from "./fast-mode-policy-gV8RHRpC.mjs";
//#region extensions/anthropic/stream-wrappers.ts
const log = createSubsystemLogger("anthropic-stream");
const ANTHROPIC_CONTEXT_1M_BETA_LEGACY = "context-1m-2025-08-07";
const ANTHROPIC_COMPACTION_BETA = "compact-2026-01-12";
const ANTHROPIC_FAST_MODE_BETA = "fast-mode-2026-02-01";
const ANTHROPIC_FAST_MODE_COST_MULTIPLIER = 2;
const OPENCLAW_DEFAULT_ANTHROPIC_BETAS = ["fine-grained-tool-streaming-2025-05-14", "interleaved-thinking-2025-05-14"];
const OPENCLAW_OAUTH_ANTHROPIC_BETAS = [
	"claude-code-20250219",
	"oauth-2025-04-20",
	...OPENCLAW_DEFAULT_ANTHROPIC_BETAS
];
/** Publish installed-version evidence; the transport owns the floor and billing snapshot. */
function createAnthropicClaudeCodeIdentityWrapper(baseStreamFn, resolveVersion, sourceApi) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.provider !== "anthropic" || (sourceApi ?? model.api) !== "anthropic-messages" || !isAnthropicOAuthApiKey(options?.apiKey ?? getEnvApiKey(model.provider))) return underlying(model, context, options);
		return resolveVersion().then((version) => underlying(model, context, version ? {
			...options,
			headers: {
				...options?.headers,
				"user-agent": `claude-cli/${version}`
			}
		} : options));
	};
}
function isAnthropic1MModel(modelId) {
	return supportsClaude1MContext({ id: modelId });
}
function parseHeaderList(value) {
	if (typeof value !== "string") return [];
	return value.split(",").map((item) => item.trim()).filter(Boolean);
}
function mergeAnthropicBetaHeader(headers, betas) {
	const merged = { ...headers };
	const existingKey = Object.keys(merged).find((key) => normalizeLowercaseStringOrEmpty(key) === "anthropic-beta");
	const existing = existingKey ? parseHeaderList(merged[existingKey]) : [];
	const values = Array.from(/* @__PURE__ */ new Set([...existing, ...betas]));
	const key = existingKey ?? "anthropic-beta";
	merged[key] = values.join(",");
	return merged;
}
function resolveAnthropicFastServiceTier(enabled) {
	return enabled ? "auto" : "standard_only";
}
function applyAnthropicFastModePricing(model) {
	const scaleRates = (rates) => ({
		input: rates.input * ANTHROPIC_FAST_MODE_COST_MULTIPLIER,
		output: rates.output * ANTHROPIC_FAST_MODE_COST_MULTIPLIER,
		cacheRead: rates.cacheRead * ANTHROPIC_FAST_MODE_COST_MULTIPLIER,
		cacheWrite: rates.cacheWrite * ANTHROPIC_FAST_MODE_COST_MULTIPLIER
	});
	return {
		...model,
		cost: {
			...scaleRates(model.cost),
			...model.cost.tieredPricing ? { tieredPricing: model.cost.tieredPricing.map((tier) => ({
				...tier,
				...scaleRates(tier)
			})) } : {}
		}
	};
}
function hasConfiguredAnthropicBeta(extraParams) {
	const configured = extraParams?.anthropicBeta;
	if (typeof configured === "string") return configured.trim().length > 0;
	if (!Array.isArray(configured)) return false;
	return configured.some((beta) => typeof beta === "string" && beta.trim().length > 0);
}
/** Resolve configured Anthropic beta headers from extra model params. */
function resolveAnthropicBetas(extraParams, _modelId) {
	const betas = /* @__PURE__ */ new Set();
	const configured = extraParams?.anthropicBeta;
	if (typeof configured === "string" && configured.trim()) for (const beta of parseHeaderList(configured)) betas.add(beta);
	else if (Array.isArray(configured)) {
		for (const beta of configured) if (typeof beta === "string" && beta.trim()) for (const betaValue of parseHeaderList(beta)) betas.add(betaValue);
	}
	betas.delete(ANTHROPIC_CONTEXT_1M_BETA_LEGACY);
	return betas.size > 0 ? [...betas] : void 0;
}
/** Wrap a stream function to merge OpenClaw and configured Anthropic beta headers. */
function createAnthropicBetaHeadersWrapper(baseStreamFn, betas) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const isOauth = isAnthropicOAuthApiKey(options?.apiKey);
		const effectiveBetas = betas.filter((beta) => beta !== ANTHROPIC_CONTEXT_1M_BETA_LEGACY);
		const allBetas = [.../* @__PURE__ */ new Set([...isOauth ? OPENCLAW_OAUTH_ANTHROPIC_BETAS : OPENCLAW_DEFAULT_ANTHROPIC_BETAS, ...effectiveBetas])];
		return underlying(model, context, {
			...options,
			headers: mergeAnthropicBetaHeader(options?.headers, allBetas)
		});
	};
}
/** Wrap a stream function with native fast mode or the legacy Priority Tier mapping. */
function createAnthropicFastModeWrapper(baseStreamFn, enabled, extraParams) {
	const underlying = baseStreamFn ?? streamSimple;
	const fastPayloadWrapper = createPayloadPatchStreamWrapper(underlying, ({ payload }) => {
		delete payload.service_tier;
		payload.speed = "fast";
	});
	return (model, context, options) => {
		const resolved = typeof enabled === "function" ? enabled() : enabled;
		if (resolved === void 0) return underlying(model, context, options);
		const plan = resolveAnthropicFastModePlan({
			provider: model.provider,
			modelId: model.id,
			api: model.api,
			baseUrl: model.baseUrl,
			modelParams: model.params,
			params: extraParams,
			authMode: isAnthropicOAuthApiKey(options?.apiKey) ? "oauth" : "api_key",
			requestCapabilities: {
				endpointClass: resolveProviderEndpoint(model.baseUrl).endpointClass,
				allowsAnthropicServiceTier: resolveAnthropicPayloadPolicy({
					provider: model.provider,
					api: model.api,
					baseUrl: model.baseUrl
				}).allowsServiceTier
			}
		});
		if (plan === "native") {
			if (!resolved) return underlying(model, context, options);
			return fastPayloadWrapper(applyAnthropicFastModePricing(model), context, {
				...options,
				headers: mergeAnthropicBetaHeader(options?.headers, [ANTHROPIC_FAST_MODE_BETA])
			});
		}
		return plan === "service-tier" ? createAnthropicServiceTierWrapper(underlying, resolveAnthropicFastServiceTier(resolved))(model, context, options) : underlying(model, context, options);
	};
}
/** Pass opt-in server compaction to the shared request payload policy. */
function createAnthropicCompactionWrapper(baseStreamFn, extraParams) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const compaction = resolveAnthropicServerCompactionPlan(model, extraParams, options?.apiKey);
		if (!compaction.enabled) return underlying(model, context, options);
		const requestOptions = {
			...options,
			anthropicServerCompaction: true,
			anthropicCompactThreshold: compaction.threshold,
			headers: mergeAnthropicBetaHeader(options?.headers, [ANTHROPIC_COMPACTION_BETA])
		};
		return underlying(model, context, requestOptions);
	};
}
/** Wrap a stream function with an explicit Anthropic service tier when allowed. */
function createAnthropicServiceTierWrapper(baseStreamFn, serviceTier) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, model }) => {
		const payloadPolicy = resolveAnthropicPayloadPolicy({
			provider: readStringValue(model.provider),
			api: readStringValue(model.api),
			baseUrl: readStringValue(model.baseUrl),
			serviceTier
		});
		applyAnthropicPayloadPolicyToParams(payload, payloadPolicy, /* @__PURE__ */ new Set());
	}, { shouldPatch: ({ model, options }) => {
		if (isAnthropicOAuthApiKey(options?.apiKey) || !supportsAnthropicPriorityTier(model)) return false;
		return resolveAnthropicPayloadPolicy({
			provider: readStringValue(model.provider),
			api: readStringValue(model.api),
			baseUrl: readStringValue(model.baseUrl),
			serviceTier
		}).allowsServiceTier;
	} });
}
/** Wrap a stream function to strip trailing assistant prefill before thinking requests. */
function createAnthropicThinkingPrefillWrapper(baseStreamFn) {
	return createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn, (stripped) => {
		log.warn(`removed ${stripped} trailing assistant prefill message${stripped === 1 ? "" : "s"} because Anthropic extended thinking requires conversations to end with a user turn`);
	});
}
/** Resolve Anthropic fast-mode setting from model extra params. */
function resolveAnthropicFastMode(extraParams) {
	const raw = extraParams?.fastMode ?? extraParams?.fast_mode;
	const fastMode = typeof raw === "function" ? normalizeFastMode(raw()) : normalizeFastMode(raw);
	return fastMode === "auto" ? void 0 : fastMode;
}
/** Resolve Anthropic service tier from model extra params. */
function resolveAnthropicServiceTier(extraParams) {
	const raw = extraParams?.serviceTier ?? extraParams?.service_tier;
	const normalized = normalizeAnthropicServiceTier(raw);
	if (raw !== void 0 && normalized === void 0) {
		const rawSummary = typeof raw === "string" ? raw : typeof raw;
		log.warn(`ignoring invalid Anthropic service tier param: ${rawSummary}`);
	}
	return normalized;
}
/** Compose all Anthropic stream wrappers for one provider/model context. */
function wrapAnthropicProviderStream(ctx) {
	const anthropicBetas = resolveAnthropicBetas(ctx.extraParams, ctx.modelId);
	const needsAnthropicBetaWrapper = anthropicBetas !== void 0 || hasConfiguredAnthropicBeta(ctx.extraParams) || ctx.extraParams?.context1m === true && isAnthropic1MModel(ctx.modelId);
	const serviceTier = resolveAnthropicServiceTier(ctx.extraParams);
	const hasFastModeParam = ctx.extraParams !== void 0 && (Object.hasOwn(ctx.extraParams, "fastMode") || Object.hasOwn(ctx.extraParams, "fast_mode"));
	return composeProviderStreamWrappers(ctx.streamFn, needsAnthropicBetaWrapper ? (streamFn) => createAnthropicBetaHeadersWrapper(streamFn, anthropicBetas ?? []) : void 0, serviceTier ? (streamFn) => createAnthropicServiceTierWrapper(streamFn, serviceTier) : void 0, hasFastModeParam ? (streamFn) => createAnthropicFastModeWrapper(streamFn, () => resolveAnthropicFastMode(ctx.extraParams), ctx.extraParams) : void 0, ctx.extraParams?.anthropicServerCompaction === true ? (streamFn) => createAnthropicCompactionWrapper(streamFn, ctx.extraParams) : void 0, (streamFn) => createAnthropicThinkingPrefillWrapper(streamFn));
}
//#endregion
export { resolveAnthropicBetas as a, wrapAnthropicProviderStream as c, createAnthropicServiceTierWrapper as i, createAnthropicClaudeCodeIdentityWrapper as n, resolveAnthropicFastMode as o, createAnthropicFastModeWrapper as r, resolveAnthropicServiceTier as s, createAnthropicBetaHeadersWrapper as t };
