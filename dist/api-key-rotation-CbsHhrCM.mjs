import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { _ as normalizeUniqueTrimmedStringList, d as normalizeStringEntries, h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import "./backoff-BrzXG7iD.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-C_lyIdYO.mjs";
import { n as classifyFailoverSignal } from "./classify-kizCSGkY.mjs";
import { a as resolveTransientProviderDelayMs, i as resolveTransientProviderAttempts, o as resolveTransientProviderRetryOptions, s as shouldRetrySameKeyProviderOperation } from "./operation-retry-Ci68Y-og.mjs";
//#region src/agents/live-auth-keys.ts
/**
* Live-test provider API-key discovery.
* Reads provider-specific and manifest-declared env names without logging or
* exposing secret values, with explicit single-key pins for flaky live lanes.
*/
const KEY_SPLIT_RE = /[\s,;]+/g;
const PROVIDER_PREFIX_OVERRIDES = {
	google: "GEMINI",
	"google-vertex": "GEMINI"
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
	const base = PROVIDER_PREFIX_OVERRIDES[normalized] ?? normalized.toUpperCase().replace(/-/g, "_");
	return {
		liveSingle: `OPENCLAW_LIVE_${base}_KEY`,
		listVar: normalized === "anthropic" ? "OPENCLAW_LIVE_ANTHROPIC_KEYS" : `${base}_API_KEYS`,
		primaryVar: `${base}_API_KEY`,
		prefixedVar: `${base}_API_KEY_`,
		fallbackVars: normalized === "google" || normalized === "google-vertex" ? ["GOOGLE_API_KEY"] : []
	};
}
/** Collect configured API keys for live provider tests without exposing values. */
function collectProviderApiKeys(provider, options = {}) {
	const env = options.env ?? process.env;
	const normalizedProvider = normalizeProviderId(provider);
	const config = resolveProviderApiKeyConfig(normalizedProvider);
	const forcedSingle = normalizeOptionalString(env[config.liveSingle]);
	if (forcedSingle) return [forcedSingle];
	const fromList = parseKeyList(env[config.listVar]);
	const primary = env[config.primaryVar];
	const fromPrefixed = collectEnvPrefixedKeys(config.prefixedVar, env);
	const fallback = config.fallbackVars.map((envVar) => env[envVar]);
	const manifestEnvVars = options.providerEnvVars ?? getProviderEnvVarsCore(normalizedProvider);
	return normalizeUniqueTrimmedStringList([
		...fromList,
		primary,
		...fromPrefixed,
		...fallback,
		...manifestEnvVars.map((envVar) => env[envVar])
	]);
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
