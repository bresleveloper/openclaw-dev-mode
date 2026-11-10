import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { _ as normalizeUniqueTrimmedStringList, h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./backoff-N5Hi0doU.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-D43Pu6eG.mjs";
import { n as classifyFailoverSignal } from "./classify-PIr_bdgF.mjs";
import { a as resolveTransientProviderDelayMs, i as resolveTransientProviderAttempts, o as resolveTransientProviderRetryOptions, s as shouldRetrySameKeyProviderOperation } from "./operation-retry-B2m6H7IT.mjs";
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
/** Collect configured API keys for live provider tests without exposing values. */
function collectProviderApiKeys(provider, options = {}) {
	const env = options.env ?? process.env;
	const normalized = normalizeProviderId(provider);
	const base = PROVIDER_PREFIX_OVERRIDES[normalized] ?? normalized.toUpperCase().replace(/-/g, "_");
	const forcedSingle = normalizeOptionalString(env[`OPENCLAW_LIVE_${base}_KEY`]);
	if (forcedSingle) return [forcedSingle];
	const listVar = normalized === "anthropic" ? "OPENCLAW_LIVE_ANTHROPIC_KEYS" : `${base}_API_KEYS`;
	const manifestEnvVars = options.providerEnvVars ?? getProviderEnvVarsCore(normalized);
	return normalizeUniqueTrimmedStringList([
		...env[listVar]?.split(KEY_SPLIT_RE) ?? [],
		env[`${base}_API_KEY`],
		...Object.entries(env).filter(([name]) => name.startsWith(`${base}_API_KEY_`)).map(([, value]) => value),
		...normalized === "google" || normalized === "google-vertex" ? [env.GOOGLE_API_KEY] : [],
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
