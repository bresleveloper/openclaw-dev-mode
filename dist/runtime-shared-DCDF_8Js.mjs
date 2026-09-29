import { m as clampTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-BM4XH1SL.mjs";
import { a as isFailoverError } from "./error-ON38hPhx.mjs";
import { i as describeFailoverError } from "./failover-error-C3SnWYBJ.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-BdVQKAmB.mjs";
//#region packages/media-generation-core/src/capability-model-ref.ts
function normalizeProviderForMatch(value, normalizeProviderId) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalizeProviderId ? normalizeProviderId(normalized) : normalized;
}
/** Finds a provider by id or alias using the caller's provider-id normalization rules. */
function findCapabilityProviderById(params) {
	const selectedProvider = normalizeProviderForMatch(params.providerId, params.normalizeProviderId);
	if (!selectedProvider) return;
	return params.providers.find((provider) => {
		return normalizeProviderForMatch(provider.id, params.normalizeProviderId) === selectedProvider || (provider.aliases ?? []).some((alias) => normalizeProviderForMatch(alias, params.normalizeProviderId) === selectedProvider);
	});
}
/** Resolves a bare model name to the provider that advertises it for this capability. */
function resolveCapabilityProviderModelOnlyRef(params) {
	const model = normalizeOptionalString(params.raw);
	if (!model) return null;
	const provider = params.providers.find((candidate) => {
		return [candidate.defaultModel, ...candidate.models ?? []].some((entry) => normalizeOptionalString(entry) === model);
	});
	return provider ? {
		provider: provider.id,
		model
	} : null;
}
/** Resolves provider/model refs first, then falls back to model-only catalog matching. */
function resolveCapabilityModelRefForProviders(params) {
	const raw = normalizeOptionalString(params.raw);
	if (!raw) return null;
	const parsed = params.parseModelRef(raw);
	if (parsed && findCapabilityProviderById({
		providers: params.providers,
		providerId: parsed.provider,
		normalizeProviderId: params.normalizeProviderId
	})) return parsed;
	return resolveCapabilityProviderModelOnlyRef({
		providers: params.providers,
		raw
	}) ?? parsed;
}
//#endregion
//#region src/media-generation/runtime-shared.ts
function buildCapabilityCandidateFailure(candidate, error) {
	const described = isFailoverError(error) ? describeFailoverError(error) : void 0;
	return {
		provider: candidate.provider,
		model: candidate.model,
		error: described?.message ?? formatErrorMessage(error),
		reason: described?.reason,
		status: described?.status,
		code: described?.code
	};
}
/** Keeps provider lookup and capability preflight outside the generation fallback catch. */
async function runMediaGenerationCandidates(params) {
	const attempts = [];
	let lastError;
	for (const candidate of params.candidates) {
		const provider = params.getProvider(candidate.provider);
		const preparation = provider ? params.prepareCandidate(candidate, provider) : `No ${params.capability}-generation provider registered for ${candidate.provider}`;
		const prepared = preparation instanceof Promise ? await preparation : preparation;
		if (typeof prepared === "string") {
			const attempt = provider && params.includeSkipFailureDetails ? buildCapabilityCandidateFailure(candidate, prepared) : {
				provider: candidate.provider,
				model: candidate.model,
				error: prepared
			};
			attempts.push(attempt);
			lastError = new Error(prepared);
			if (!provider) params.onMissingProvider?.(attempt);
			continue;
		}
		try {
			return await prepared(attempts);
		} catch (error) {
			lastError = error;
			const attempt = buildCapabilityCandidateFailure(candidate, error);
			attempts.push(attempt);
			params.onFailure?.(attempt);
		}
	}
	return throwCapabilityGenerationFailure({
		capabilityLabel: `${params.capability} generation`,
		attempts,
		lastError
	});
}
/** Reject edit requests before provider I/O, including providers with incomplete limits. */
function resolveReferenceImageCapabilityError(params) {
	if (params.inputImageCount === 0) return;
	if (!params.edit?.enabled) return `${params.candidateRef} does not support reference-image edit inputs`;
	const maxInputImages = params.edit.maxInputImages ?? 10;
	return params.inputImageCount > maxInputImages ? `${params.candidateRef} supports at most ${maxInputImages} reference image${maxInputImages === 1 ? "" : "s"}, ${params.inputImageCount} requested` : void 0;
}
const IMAGE_RESOLUTION_ORDER = [
	"1K",
	"2K",
	"4K"
];
function resolveMediaProviderDefaultTimeoutMs(timeoutMs) {
	return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? clampTimerTimeoutMs(timeoutMs) : void 0;
}
/** Resolves a request timeout, preferring per-request over provider defaults. */
function resolveMediaProviderRequestTimeoutMs(params) {
	return resolveMediaProviderDefaultTimeoutMs(params.timeoutMs) ?? resolveMediaProviderDefaultTimeoutMs(params.providerDefaultTimeoutMs);
}
function resolveCurrentDefaultProviderId(cfg) {
	const configured = resolveAgentModelPrimaryValue(cfg?.agents?.defaults?.model);
	const trimmed = normalizeOptionalString(configured);
	if (!trimmed) return DEFAULT_PROVIDER;
	const slash = trimmed.indexOf("/");
	if (slash <= 0) return DEFAULT_PROVIDER;
	return normalizeOptionalString(trimmed.slice(0, slash)) || "openai";
}
function isCapabilityProviderConfigured(params) {
	if (params.provider.isConfigured) return params.provider.isConfigured({
		cfg: params.cfg,
		agentDir: params.agentDir
	});
	return isProviderApiKeyConfigured({
		provider: params.provider.id,
		cfg: params.cfg,
		agentDir: params.agentDir
	});
}
function resolveAutoCapabilityFallbackRefs(params) {
	const providerDefaults = /* @__PURE__ */ new Map();
	for (const provider of params.listProviders(params.cfg)) {
		const providerId = normalizeOptionalString(provider.id);
		const modelId = normalizeOptionalString(provider.defaultModel);
		if (!providerId || !modelId || providerDefaults.has(providerId) || !isCapabilityProviderConfigured({
			provider,
			cfg: params.cfg,
			agentDir: params.agentDir
		})) continue;
		const aliases = (provider.aliases ?? []).flatMap((alias) => {
			const normalized = normalizeOptionalString(alias);
			return normalized ? [normalized] : [];
		});
		providerDefaults.set(providerId, {
			ref: `${providerId}/${modelId}`,
			aliases
		});
	}
	const defaultProvider = resolveCurrentDefaultProviderId(params.cfg);
	const providerIds = [...providerDefaults.keys()].toSorted();
	const matchesDefaultProvider = (providerId) => {
		const entry = providerDefaults.get(providerId);
		return providerId === defaultProvider || (entry?.aliases ?? []).includes(defaultProvider);
	};
	return [...providerIds.filter(matchesDefaultProvider), ...providerIds.filter((providerId) => !matchesDefaultProvider(providerId))].flatMap((providerId) => {
		const entry = providerDefaults.get(providerId);
		return entry ? [entry.ref] : [];
	});
}
/** Builds ordered provider/model candidates for one media capability request. */
function resolveCapabilityModelCandidates(params) {
	const candidates = [];
	const seen = /* @__PURE__ */ new Set();
	let providers;
	const getProviders = () => {
		providers ??= params.listProviders?.(params.cfg) ?? [];
		return providers;
	};
	const resolveCandidate = (raw, options) => {
		const trimmed = normalizeOptionalString(raw);
		if (!trimmed) return null;
		if (!options.useProviderMetadata) return params.parseModelRef(raw);
		return resolveCapabilityModelRefForProviders({
			raw: trimmed,
			providers: getProviders(),
			parseModelRef: params.parseModelRef
		});
	};
	const add = (raw, options) => {
		const candidate = resolveCandidate(raw, options);
		if (!candidate) return;
		const key = `${candidate.provider}/${candidate.model}`;
		if (seen.has(key)) return;
		seen.add(key);
		candidates.push(candidate);
	};
	const override = (() => {
		return resolveCandidate(params.modelOverride, { useProviderMetadata: true });
	})();
	if (override) return [override];
	const autoProviderFallbackEnabled = params.autoProviderFallback ?? true;
	add(params.modelOverride, { useProviderMetadata: true });
	add(resolveAgentModelPrimaryValue(params.modelConfig), { useProviderMetadata: autoProviderFallbackEnabled });
	for (const fallback of resolveAgentModelFallbackValues(params.modelConfig)) add(fallback, { useProviderMetadata: autoProviderFallbackEnabled });
	if (autoProviderFallbackEnabled && params.listProviders) for (const candidate of resolveAutoCapabilityFallbackRefs({
		cfg: params.cfg,
		agentDir: params.agentDir,
		listProviders: () => getProviders()
	})) add(candidate, { useProviderMetadata: false });
	return candidates;
}
function normalizeSupportedValues(values) {
	return (values ?? []).flatMap((entry) => {
		return normalizeOptionalString(entry) ? [entry] : [];
	});
}
function compareScores(next, best) {
	if (!best) return true;
	if (next.primary !== best.primary) return next.primary < best.primary;
	if (next.secondary !== best.secondary) return next.secondary < best.secondary;
	return next.tertiary.localeCompare(best.tertiary) < 0;
}
function parsePositiveDimensionPair(raw, pattern) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return null;
	const match = pattern.exec(trimmed);
	if (!match) return null;
	const width = Number(match[1]);
	const height = Number(match[2]);
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
	return {
		width,
		height
	};
}
function parseAspectRatioValue(raw) {
	const pair = parsePositiveDimensionPair(raw, /^(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)$/);
	if (!pair) return null;
	return {
		width: pair.width,
		height: pair.height,
		value: pair.width / pair.height
	};
}
function parseSizeValue(raw) {
	const pair = parsePositiveDimensionPair(raw, /^(\d+)\s*x\s*(\d+)$/i);
	if (!pair) return null;
	if (!Number.isSafeInteger(pair.width) || !Number.isSafeInteger(pair.height)) return null;
	return {
		width: pair.width,
		height: pair.height,
		aspectRatio: pair.width / pair.height,
		area: pair.width * pair.height
	};
}
function greatestCommonDivisor(a, b) {
	let left = Math.abs(a);
	let right = Math.abs(b);
	while (right !== 0) {
		const next = left % right;
		left = right;
		right = next;
	}
	return left || 1;
}
/** Derives a reduced aspect ratio string from a WIDTHxHEIGHT size. */
function deriveAspectRatioFromSize(size) {
	const parsed = parseSizeValue(size);
	if (!parsed) return;
	const divisor = greatestCommonDivisor(parsed.width, parsed.height);
	return `${parsed.width / divisor}:${parsed.height / divisor}`;
}
/** Chooses the closest supported aspect ratio for a request. */
function resolveClosestAspectRatio(params) {
	const supported = normalizeSupportedValues(params.supportedAspectRatios);
	if (supported.length === 0) return params.requestedAspectRatio ?? deriveAspectRatioFromSize(params.requestedSize);
	if (params.requestedAspectRatio && supported.includes(params.requestedAspectRatio)) return params.requestedAspectRatio;
	const requested = parseAspectRatioValue(params.requestedAspectRatio) ?? parseAspectRatioValue(deriveAspectRatioFromSize(params.requestedSize));
	if (!requested) return;
	let bestValue;
	let bestScore = null;
	for (const candidate of supported) {
		const parsed = parseAspectRatioValue(candidate);
		if (!parsed) continue;
		const score = {
			primary: Math.abs(Math.log(parsed.value / requested.value)),
			secondary: Math.abs(parsed.width * requested.height - requested.width * parsed.height),
			tertiary: candidate
		};
		if (compareScores(score, bestScore)) {
			bestValue = candidate;
			bestScore = score;
		}
	}
	return bestValue;
}
/** Chooses the closest supported size by aspect ratio and area. */
function resolveClosestSize(params) {
	const supported = normalizeSupportedValues(params.supportedSizes);
	if (supported.length === 0) return params.requestedSize;
	if (params.requestedSize && supported.includes(params.requestedSize)) return params.requestedSize;
	const requested = parseSizeValue(params.requestedSize);
	const requestedAspectRatio = parseAspectRatioValue(params.requestedAspectRatio);
	if (!requested && !requestedAspectRatio) return;
	let bestValue;
	let bestScore = null;
	for (const candidate of supported) {
		const parsed = parseSizeValue(candidate);
		if (!parsed) continue;
		const score = {
			primary: Math.abs(Math.log(parsed.aspectRatio / (requested?.aspectRatio ?? requestedAspectRatio.value))),
			secondary: requested ? Math.abs(Math.log(parsed.area / requested.area)) : parsed.area,
			tertiary: candidate
		};
		if (compareScores(score, bestScore)) {
			bestValue = candidate;
			bestScore = score;
		}
	}
	return bestValue;
}
/** Chooses the closest supported resolution by numeric rank or custom order. */
function resolveClosestResolution(params) {
	const supported = normalizeSupportedValues(params.supportedResolutions);
	if (supported.length === 0) return params.requestedResolution;
	if (params.requestedResolution && supported.includes(params.requestedResolution)) return params.requestedResolution;
	const requestedNumeric = parseResolutionRank(params.requestedResolution);
	if (requestedNumeric) {
		let bestValue;
		let bestScore = null;
		for (const candidate of supported) {
			const candidateNumeric = parseResolutionRank(candidate);
			if (!candidateNumeric || candidateNumeric.unit !== requestedNumeric.unit) continue;
			const score = {
				primary: Math.abs(candidateNumeric.value - requestedNumeric.value),
				secondary: candidateNumeric.value < requestedNumeric.value ? 1 : 0,
				tertiary: candidate
			};
			if (compareScores(score, bestScore)) {
				bestValue = candidate;
				bestScore = score;
			}
		}
		if (bestValue) return bestValue;
	}
	const order = params.order ?? IMAGE_RESOLUTION_ORDER;
	const requestedIndex = params.requestedResolution ? order.indexOf(params.requestedResolution) : -1;
	if (requestedIndex < 0) return;
	let bestValue;
	let bestScore = null;
	for (const candidate of supported) {
		const candidateIndex = order.indexOf(candidate);
		if (candidateIndex < 0) continue;
		const score = {
			primary: Math.abs(candidateIndex - requestedIndex),
			secondary: candidateIndex,
			tertiary: candidate
		};
		if (compareScores(score, bestScore)) {
			bestValue = candidate;
			bestScore = score;
		}
	}
	return bestValue;
}
function parseResolutionRank(resolution) {
	const match = resolution?.trim().match(/^(\d+(?:\.\d+)?)([kp])$/iu);
	if (!match) return;
	const value = Number(match[1]);
	if (!Number.isFinite(value)) return;
	const unit = match[2]?.toUpperCase() === "K" ? "K" : "P";
	return {
		value: unit === "K" ? value * 1e3 : value,
		unit
	};
}
/** Rounds duration and clamps it to a provider maximum when supplied. */
function normalizeDurationToClosestMax(durationSeconds, maxDurationSeconds) {
	if (typeof durationSeconds !== "number" || !Number.isFinite(durationSeconds)) return;
	const rounded = Math.max(1, Math.round(durationSeconds));
	if (typeof maxDurationSeconds !== "number" || !Number.isFinite(maxDurationSeconds) || maxDurationSeconds <= 0) return rounded;
	return Math.min(rounded, Math.max(1, Math.round(maxDurationSeconds)));
}
/** Builds user-visible metadata describing provider normalization decisions. */
function buildMediaGenerationNormalizationMetadata(params) {
	const metadata = {};
	const { normalization } = params;
	if (normalization?.size?.requested !== void 0 && normalization.size.applied !== void 0) {
		metadata.requestedSize = normalization.size.requested;
		metadata.normalizedSize = normalization.size.applied;
	}
	if (normalization?.aspectRatio?.applied !== void 0) {
		if (normalization.aspectRatio.requested !== void 0) metadata.requestedAspectRatio = normalization.aspectRatio.requested;
		metadata.normalizedAspectRatio = normalization.aspectRatio.applied;
		if (normalization.aspectRatio.derivedFrom === "size" && params.requestedSizeForDerivedAspectRatio) {
			metadata.requestedSize = params.requestedSizeForDerivedAspectRatio;
			metadata.aspectRatioDerivedFromSize = deriveAspectRatioFromSize(params.requestedSizeForDerivedAspectRatio);
		}
	}
	if (normalization?.resolution?.requested !== void 0 && normalization.resolution.applied !== void 0) {
		metadata.requestedResolution = normalization.resolution.requested;
		metadata.normalizedResolution = normalization.resolution.applied;
	}
	if (normalization?.durationSeconds?.requested !== void 0 && normalization.durationSeconds.applied !== void 0) {
		metadata.requestedDurationSeconds = normalization.durationSeconds.requested;
		metadata.normalizedDurationSeconds = normalization.durationSeconds.applied;
		if (params.includeSupportedDurationSeconds && normalization.durationSeconds.supportedValues?.length) metadata.supportedDurationSeconds = normalization.durationSeconds.supportedValues;
	}
	return metadata;
}
/** Throws a summarized error after all provider/model candidates fail. */
function throwCapabilityGenerationFailure(params) {
	if (params.attempts.length <= 1 && params.lastError) throw toErrorObject(params.lastError, "Non-Error thrown");
	const summary = formatCapabilityFailureAttempts(params.attempts);
	throw new Error(`All ${params.capabilityLabel} models failed (${params.attempts.length}): ${summary}`, { cause: params.lastError instanceof Error ? params.lastError : void 0 });
}
function formatCapabilityFailureAttempts(attempts) {
	if (attempts.length === 0) return "unknown";
	const abortedAttempts = attempts.filter(isAbortLikeFallbackAttempt);
	if (abortedAttempts.length === 0) return attempts.map(formatCapabilityFailureAttempt).join(" | ");
	if (abortedAttempts.length === attempts.length) return `${abortedAttempts.length} fallback(s) aborted after the request was cancelled or timed out: ${abortedAttempts.map(formatCapabilityAttemptRef).join(", ")}`;
	return [attempts.filter((attempt) => !isAbortLikeFallbackAttempt(attempt)).map(formatCapabilityFailureAttempt).join(" | "), `${abortedAttempts.length} fallback(s) aborted after the request was cancelled or timed out: ${abortedAttempts.map(formatCapabilityAttemptRef).join(", ")}`].join(" | ");
}
function formatCapabilityFailureAttempt(attempt) {
	return `${formatCapabilityAttemptRef(attempt)}: ${attempt.error}`;
}
function formatCapabilityAttemptRef(attempt) {
	return `${attempt.provider}/${attempt.model}`;
}
function isAbortLikeFallbackAttempt(attempt) {
	const message = attempt.error.trim().toLowerCase();
	return message === "this operation was aborted" || message === "operation was aborted" || message.includes("operation was aborted") || message.includes("request was aborted");
}
/** Formats setup guidance when no model is configured for a media capability. */
function buildNoCapabilityModelConfiguredMessage(params) {
	const getProviderEnvVars = params.getProviderEnvVars ?? getProviderEnvVarsCore;
	const sampleModel = params.providers.find((provider) => normalizeOptionalString(provider.id) && normalizeOptionalString(provider.defaultModel));
	const sampleRef = sampleModel ? `${sampleModel.id}/${sampleModel.defaultModel}` : params.fallbackSampleRef ?? "<provider>/<model>";
	const authHints = params.providers.flatMap((provider) => {
		const envVars = getProviderEnvVars(provider.id);
		if (envVars.length === 0) return [];
		return [`${provider.id}: ${envVars.join(" / ")}`];
	}).slice(0, 3);
	return [`No ${params.capabilityLabel} model configured. Set agents.defaults.${params.modelConfigKey}.primary to a provider/model like "${sampleRef}".`, authHints.length > 0 ? `If you want a specific provider, also configure that provider's auth/API key first (${authHints.join("; ")}).` : "If you want a specific provider, also configure that provider's auth/API key first."].join(" ");
}
//#endregion
export { resolveClosestAspectRatio as a, resolveMediaProviderRequestTimeoutMs as c, throwCapabilityGenerationFailure as d, findCapabilityProviderById as f, resolveCapabilityModelCandidates as i, resolveReferenceImageCapabilityError as l, buildNoCapabilityModelConfiguredMessage as n, resolveClosestResolution as o, resolveCapabilityModelRefForProviders as p, normalizeDurationToClosestMax as r, resolveClosestSize as s, buildMediaGenerationNormalizationMetadata as t, runMediaGenerationCandidates as u };
