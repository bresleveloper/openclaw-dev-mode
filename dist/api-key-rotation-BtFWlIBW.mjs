import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries, h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./backoff-CszdOMiF.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-BM4XH1SL.mjs";
import { n as classifyFailoverSignal } from "./classify-Bgiif0yb.mjs";
import { a as resolveTransientProviderDelayMs, i as resolveTransientProviderAttempts, o as resolveTransientProviderRetryOptions, s as shouldRetrySameKeyProviderOperation } from "./operation-retry-Dopl7EnK.mjs";
//#region src/agents/live-auth-keys.ts
/**
* Live-test provider API-key discovery.
* Reads provider-specific and manifest-declared env names without logging or
* exposing secret values, with explicit single-key pins for flaky live lanes.
*/
const KEY_SPLIT_RE = /[\s,;]+/g;
const GOOGLE_LIVE_SINGLE_KEY = "OPENCLAW_LIVE_GEMINI_KEY";
const PROVIDER_PREFIX_OVERRIDES = {
	google: "GEMINI",
	"google-vertex": "GEMINI"
};
const PROVIDER_API_KEY_CONFIG = {
	anthropic: {
		liveSingle: "OPENCLAW_LIVE_ANTHROPIC_KEY",
		listVar: "OPENCLAW_LIVE_ANTHROPIC_KEYS",
		primaryVar: "ANTHROPIC_API_KEY",
		prefixedVar: "ANTHROPIC_API_KEY_"
	},
	google: {
		liveSingle: GOOGLE_LIVE_SINGLE_KEY,
		listVar: "GEMINI_API_KEYS",
		primaryVar: "GEMINI_API_KEY",
		prefixedVar: "GEMINI_API_KEY_"
	},
	"google-vertex": {
		liveSingle: GOOGLE_LIVE_SINGLE_KEY,
		listVar: "GEMINI_API_KEYS",
		primaryVar: "GEMINI_API_KEY",
		prefixedVar: "GEMINI_API_KEY_"
	},
	openai: {
		liveSingle: "OPENCLAW_LIVE_OPENAI_KEY",
		listVar: "OPENAI_API_KEYS",
		primaryVar: "OPENAI_API_KEY",
		prefixedVar: "OPENAI_API_KEY_"
	}
};
function parseKeyList(raw) {
	if (!raw) return [];
	return normalizeStringEntries(raw.split(KEY_SPLIT_RE));
}
function collectEnvPrefixedKeys(prefix, env) {
	const keys = [];
	for (const [name, value] of Object.entries(env)) {
		if (!name.startsWith(prefix)) continue;
		const trimmed = normalizeOptionalString(value);
		if (!trimmed) continue;
		keys.push(trimmed);
	}
	return keys;
}
function resolveProviderApiKeyConfig(provider) {
	const normalized = normalizeProviderId(provider);
	const custom = PROVIDER_API_KEY_CONFIG[normalized];
	const base = PROVIDER_PREFIX_OVERRIDES[normalized] ?? normalized.toUpperCase().replace(/-/g, "_");
	const liveSingle = custom?.liveSingle ?? `OPENCLAW_LIVE_${base}_KEY`;
	const listVar = custom?.listVar ?? `${base}_API_KEYS`;
	const primaryVar = custom?.primaryVar ?? `${base}_API_KEY`;
	const prefixedVar = custom?.prefixedVar ?? `${base}_API_KEY_`;
	if (normalized === "google" || normalized === "google-vertex") return {
		liveSingle,
		listVar,
		primaryVar,
		prefixedVar,
		fallbackVars: ["GOOGLE_API_KEY"]
	};
	return {
		liveSingle,
		listVar,
		primaryVar,
		prefixedVar,
		fallbackVars: []
	};
}
/** Collect configured API keys for live provider tests without exposing values. */
function collectProviderApiKeys(provider, options = {}) {
	const env = options.env ?? process.env;
	const normalizedProvider = normalizeProviderId(provider);
	const config = resolveProviderApiKeyConfig(normalizedProvider);
	const forcedSingle = config.liveSingle ? normalizeOptionalString(env[config.liveSingle]) : void 0;
	if (forcedSingle) return [forcedSingle];
	const fromList = parseKeyList(config.listVar ? env[config.listVar] : void 0);
	const primary = config.primaryVar ? normalizeOptionalString(env[config.primaryVar]) : void 0;
	const fromPrefixed = config.prefixedVar ? collectEnvPrefixedKeys(config.prefixedVar, env) : [];
	const fallback = config.fallbackVars.map((envVar) => normalizeOptionalString(env[envVar])).filter(Boolean);
	const manifestFallback = (options.providerEnvVars ?? getProviderEnvVarsCore(normalizedProvider)).map((envVar) => normalizeOptionalString(env[envVar])).filter(Boolean);
	const seen = /* @__PURE__ */ new Set();
	const add = (value) => {
		if (!value) return;
		if (seen.has(value)) return;
		seen.add(value);
	};
	for (const value of fromList) add(value);
	add(primary);
	for (const value of fromPrefixed) add(value);
	for (const value of fallback) add(value);
	for (const value of manifestFallback) add(value);
	return Array.from(seen);
}
/** Return whether a provider error message indicates API-key rate limiting. */
function isApiKeyRateLimitError(message) {
	const classification = classifyFailoverSignal({ message });
	return classification?.kind === "reason" && classification.reason === "rate_limit";
}
//#endregion
//#region src/agents/api-key-rotation.ts
/**
* Provider API-key rotation wrapper.
* Runs provider calls across configured keys on rate-limit failures and keeps
* same-key transient retries separate from key rotation.
*/
/** Collect primary and live-discovered provider keys in stable de-duped order. */
function collectProviderApiKeysForExecution(params) {
	const { primaryApiKey, provider } = params;
	return normalizeUniqueStringEntries([primaryApiKey?.trim() ?? "", ...collectProviderApiKeys(provider)]);
}
/**
* Execute a provider operation with key rotation and optional same-key transient
* retries.
*/
async function executeWithApiKeyRotation(params) {
	const keys = normalizeUniqueStringEntries(params.apiKeys);
	if (keys.length === 0) throw new Error(`No API keys configured for provider "${params.provider}".`);
	let lastError;
	const transientRetry = resolveTransientProviderRetryOptions(params.transientRetry);
	keyLoop: for (const [apiKeyIndex, apiKey] of keys.entries()) {
		const maxOperationAttempts = resolveTransientProviderAttempts(transientRetry);
		for (let attempt = 1; attempt <= maxOperationAttempts; attempt += 1) {
			transientRetry?.signal?.throwIfAborted();
			try {
				return await params.execute(apiKey);
			} catch (error) {
				transientRetry?.signal?.throwIfAborted();
				lastError = error;
				const message = formatErrorMessage(error);
				const retry = {
					apiKey,
					error,
					attempt,
					apiKeyIndex,
					message
				};
				if (params.shouldRetry?.(retry) ?? isApiKeyRateLimitError(message)) {
					if (apiKeyIndex + 1 >= keys.length) break;
					params.onRetry?.(retry);
					break;
				}
				if (!transientRetry || !shouldRetrySameKeyProviderOperation({
					options: transientRetry,
					error,
					message,
					provider: params.provider,
					apiKeyIndex,
					attemptNumber: attempt,
					maxAttempts: maxOperationAttempts
				})) break keyLoop;
				const delayMs = resolveTransientProviderDelayMs(transientRetry, attempt);
				await (transientRetry.sleep ?? sleepWithAbort)(delayMs, transientRetry.signal);
			}
		}
	}
	if (lastError === void 0) throw new Error(`Failed to run API request for ${params.provider}.`);
	throw toErrorObject(lastError, "Non-Error thrown");
}
//#endregion
export { executeWithApiKeyRotation as n, collectProviderApiKeysForExecution as t };
