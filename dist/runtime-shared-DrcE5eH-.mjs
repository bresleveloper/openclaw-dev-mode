import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { m as clampTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as parseProviderModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { i as DEFAULT_PROVIDER } from "./defaults-Bg930vxE.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-D43Pu6eG.mjs";
import { o as isFailoverError } from "./error-Bcp4ZyOv.mjs";
import { i as describeFailoverError } from "./failover-error-Bjf0VdY2.mjs";
import { n as isProviderApiKeyConfiguredAsync, t as isProviderApiKeyConfigured } from "./provider-auth-availability-CfYdMNuk.mjs";
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
//#region packages/media-generation-core/src/model-ref.ts
/** Parses strict generation model refs and rejects missing provider or model segments. */
function parseGenerationModelRef(raw) {
	return raw === void 0 ? null : parseProviderModelRef(raw);
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
	const candidates = await resolveCapabilityModelCandidatesAsync({
		...params.request,
		modelConfig: params.request.cfg.agents?.defaults?.mediaModels?.[params.capability],
		parseModelRef: parseGenerationModelRef,
		listProviders: params.listProviders
	});
	if (candidates.length === 0) throw new Error(buildNoCapabilityModelConfiguredMessage({
		capabilityLabel: `${params.capability}-generation`,
		modelConfigKey: `mediaModels.${params.capability}`,
		providers: params.listProviders(params.request.cfg),
		fallbackSampleRef: params.capability === "music" ? "google/lyria-3-clip-preview" : void 0,
		getProviderEnvVars: params.getProviderEnvVars
	}));
	const attempts = [];
	let lastError;
	for (const candidate of candidates) {
		const provider = params.getProvider(candidate.provider);
		const preparation = provider ? params.prepareCandidate(candidate, provider) : `No ${params.capability}-generation provider registered for ${candidate.provider}`;
		const prepared = preparation instanceof Promise ? await preparation : preparation;
		if (typeof prepared === "string") {
			const attempt = provider && params.capability !== "video" ? buildCapabilityCandidateFailure(candidate, prepared) : {
				provider: candidate.provider,
				model: candidate.model,
				error: prepared
			};
			attempts.push(attempt);
			lastError = new Error(prepared);
			if (!provider && params.capability === "image") params.onFailure?.(attempt);
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
function resolveMediaProviderDefaultTimeoutMs(timeoutMs) {
	return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? clampTimerTimeoutMs(timeoutMs) : void 0;
}
/** Resolves a request timeout, preferring per-request over provider defaults. */
function resolveMediaProviderRequestTimeoutMs(params) {
	return resolveMediaProviderDefaultTimeoutMs(params.timeoutMs) ?? resolveMediaProviderDefaultTimeoutMs(params.providerDefaultTimeoutMs);
}
function resolveCurrentDefaultProviderId(cfg) {
	const trimmed = resolveAgentModelPrimaryValue(cfg?.agents?.defaults?.model);
	if (!trimmed) return DEFAULT_PROVIDER;
	const slash = trimmed.indexOf("/");
	if (slash <= 0) return DEFAULT_PROVIDER;
	return normalizeOptionalString(trimmed.slice(0, slash)) || "openai";
}
function buildAutoCapabilityFallbackRefs(params, configuredProviders) {
	const providerDefaults = /* @__PURE__ */ new Map();
	for (const provider of configuredProviders) {
		const providerId = normalizeOptionalString(provider.id);
		const modelId = normalizeOptionalString(provider.defaultModel);
		if (!providerId || !modelId || providerDefaults.has(providerId)) continue;
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
function prepareCapabilityModelCandidates(params) {
	const candidates = [];
	const seen = /* @__PURE__ */ new Set();
	let providers;
	const getProviders = () => {
		providers ??= params.listProviders?.(params.cfg) ?? [];
		return providers;
	};
	const resolveCandidate = (raw, useProviderMetadata) => {
		const trimmed = normalizeOptionalString(raw);
		if (!trimmed) return null;
		if (!useProviderMetadata) return params.parseModelRef(raw);
		return resolveCapabilityModelRefForProviders({
			raw: trimmed,
			providers: getProviders(),
			parseModelRef: params.parseModelRef
		});
	};
	const add = (raw, useProviderMetadata) => {
		const candidate = resolveCandidate(raw, useProviderMetadata);
		if (!candidate) return;
		const key = `${candidate.provider}/${candidate.model}`;
		if (seen.has(key)) return;
		seen.add(key);
		candidates.push(candidate);
	};
	const override = resolveCandidate(params.modelOverride, true);
	if (override) return {
		candidates: [override],
		add
	};
	if (normalizeOptionalString(params.modelOverride)) throw new Error(`Unknown model override: ${params.modelOverride}. Use a provider/model reference or a model listed by a provider.`);
	const autoProviderFallbackEnabled = params.autoProviderFallback ?? true;
	add(resolveAgentModelPrimaryValue(params.modelConfig), autoProviderFallbackEnabled);
	for (const fallback of resolveAgentModelFallbackValues(params.modelConfig)) add(fallback, autoProviderFallbackEnabled);
	return {
		candidates,
		add,
		fallbackParams: autoProviderFallbackEnabled && params.listProviders ? {
			cfg: params.cfg,
			agentDir: params.agentDir,
			listProviders: () => getProviders()
		} : void 0
	};
}
/** @deprecated Use resolveCapabilityModelCandidatesAsync for worker-backed credential reads. Final compatibility day: 2026-12-31. */
function resolveCapabilityModelCandidates(params) {
	warnPluginSdkDeprecation({
		family: "provider-selection",
		method: "resolveCapabilityModelCandidates",
		replacement: "await resolveCapabilityModelCandidatesAsync()"
	});
	const prepared = prepareCapabilityModelCandidates(params);
	const fallbackParams = prepared.fallbackParams;
	if (fallbackParams) {
		const configuredProviders = [];
		for (const provider of fallbackParams.listProviders(params.cfg)) {
			if (!isAutoCapabilityFallbackCandidate(provider, configuredProviders)) continue;
			if (provider.isConfigured ? provider.isConfigured({
				cfg: params.cfg,
				agentDir: params.agentDir
			}) : isProviderApiKeyConfigured({
				provider: provider.id,
				cfg: params.cfg,
				agentDir: params.agentDir
			})) configuredProviders.push(provider);
		}
		for (const ref of buildAutoCapabilityFallbackRefs(fallbackParams, configuredProviders)) prepared.add(ref, false);
	}
	return prepared.candidates;
}
function isAutoCapabilityFallbackCandidate(provider, configuredProviders) {
	const id = normalizeOptionalString(provider.id);
	return Boolean(id && normalizeOptionalString(provider.defaultModel) && !configuredProviders.some((configured) => normalizeOptionalString(configured.id) === id));
}
async function resolveCapabilityModelCandidatesAsync(params) {
	const prepared = prepareCapabilityModelCandidates(params);
	const fallbackParams = prepared.fallbackParams;
	if (fallbackParams) {
		const configuredProviders = [];
		for (const provider of fallbackParams.listProviders(params.cfg)) {
			if (!isAutoCapabilityFallbackCandidate(provider, configuredProviders)) continue;
			const ctx = {
				cfg: params.cfg,
				agentDir: params.agentDir
			};
			if (!provider.isConfiguredAsync && provider.isConfigured) warnPluginSdkDeprecation({
				family: "provider-sync-configuration",
				method: "media provider isConfigured",
				replacement: "isConfiguredAsync"
			});
			if (provider.isConfiguredAsync ? await provider.isConfiguredAsync(ctx) : provider.isConfigured ? provider.isConfigured(ctx) : await isProviderApiKeyConfiguredAsync({
				provider: provider.id,
				...ctx
			})) configuredProviders.push(provider);
		}
		for (const ref of buildAutoCapabilityFallbackRefs(fallbackParams, configuredProviders)) prepared.add(ref, false);
	}
	return prepared.candidates;
}
function normalizeSupportedValues(values) {
	return (values ?? []).filter((entry) => Boolean(normalizeOptionalString(entry)));
}
function selectClosestValue(values, score) {
	let best;
	for (const value of values) {
		const next = score(value);
		if (next && (!best || (next.primary !== best.primary ? next.primary < best.primary : next.secondary !== best.secondary ? next.secondary < best.secondary : value.localeCompare(best.value) < 0))) best = {
			value,
			...next
		};
	}
	return best?.value;
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
function resolveClosestAspectRatio(params) {
	const supported = normalizeSupportedValues(params.supportedAspectRatios);
	if (supported.length === 0) return params.requestedAspectRatio ?? deriveAspectRatioFromSize(params.requestedSize);
	if (params.requestedAspectRatio && supported.includes(params.requestedAspectRatio)) return params.requestedAspectRatio;
	const requested = parseAspectRatioValue(params.requestedAspectRatio) ?? parseAspectRatioValue(deriveAspectRatioFromSize(params.requestedSize));
	if (!requested) return;
	return selectClosestValue(supported, (candidate) => {
		const parsed = parseAspectRatioValue(candidate);
		if (!parsed) return;
		return {
			primary: Math.abs(Math.log(parsed.value / requested.value)),
			secondary: Math.abs(parsed.width * requested.height - requested.width * parsed.height)
		};
	});
}
/** Chooses the closest supported size by aspect ratio and area. */
function resolveClosestSize(params) {
	const supported = normalizeSupportedValues(params.supportedSizes);
	if (supported.length === 0) return params.requestedSize;
	if (params.requestedSize && supported.includes(params.requestedSize)) return params.requestedSize;
	const requested = parseSizeValue(params.requestedSize);
	const requestedAspectRatio = parseAspectRatioValue(params.requestedAspectRatio);
	if (!requested && !requestedAspectRatio) return;
	return selectClosestValue(supported, (candidate) => {
		const parsed = parseSizeValue(candidate);
		if (!parsed) return;
		return {
			primary: Math.abs(Math.log(parsed.aspectRatio / (requested?.aspectRatio ?? requestedAspectRatio.value))),
			secondary: requested ? Math.abs(Math.log(parsed.area / requested.area)) : parsed.area
		};
	});
}
/** Chooses the closest supported resolution within the same numeric unit. */
function resolveClosestResolution(params) {
	const supported = normalizeSupportedValues(params.supportedResolutions);
	if (supported.length === 0) return params.requestedResolution;
	if (params.requestedResolution && supported.includes(params.requestedResolution)) return params.requestedResolution;
	const requestedNumeric = parseResolutionRank(params.requestedResolution);
	if (!requestedNumeric) return;
	return selectClosestValue(supported, (candidate) => {
		const candidateNumeric = parseResolutionRank(candidate);
		if (!candidateNumeric || candidateNumeric.unit !== requestedNumeric.unit) return;
		return {
			primary: Math.abs(candidateNumeric.value - requestedNumeric.value),
			secondary: candidateNumeric.value < requestedNumeric.value ? 1 : 0
		};
	});
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
	const failures = [];
	const aborted = [];
	for (const attempt of attempts) {
		const ref = `${attempt.provider}/${attempt.model}`;
		const message = attempt.error.trim().toLowerCase();
		if (message.includes("operation was aborted") || message.includes("request was aborted")) aborted.push(ref);
		else failures.push(`${ref}: ${attempt.error}`);
	}
	if (aborted.length) failures.push(`${aborted.length} fallback(s) aborted after the request was cancelled or timed out: ${aborted.join(", ")}`);
	return failures.join(" | ");
}
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
export { resolveCapabilityModelCandidates as a, resolveClosestResolution as c, resolveReferenceImageCapabilityError as d, runMediaGenerationCandidates as f, resolveCapabilityModelRefForProviders as g, findCapabilityProviderById as h, parseAspectRatioValue as i, resolveClosestSize as l, parseGenerationModelRef as m, buildNoCapabilityModelConfiguredMessage as n, resolveCapabilityModelCandidatesAsync as o, throwCapabilityGenerationFailure as p, normalizeDurationToClosestMax as r, resolveClosestAspectRatio as s, buildMediaGenerationNormalizationMetadata as t, resolveMediaProviderRequestTimeoutMs as u };
