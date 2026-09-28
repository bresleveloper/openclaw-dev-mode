import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { i as readErrorCause, t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./backoff-CszdOMiF.mjs";
import { t as hasRetryableConnectionErrorCode } from "./retryable-network-errors-D2gJmBqw.mjs";
//#region src/provider-runtime/operation-retry.ts
const DEFAULT_TRANSIENT_PROVIDER_RETRY_OPTIONS = {
	attempts: 2,
	baseDelayMs: 250,
	maxDelayMs: 1e3
};
function resolveTransientProviderRetryOptions(options) {
	if (!options) return;
	if (options === true) return DEFAULT_TRANSIENT_PROVIDER_RETRY_OPTIONS;
	return options;
}
function defaultTransientProviderRetryForStage(stage) {
	return stage === "create" ? void 0 : true;
}
function providerOperationRetryConfig(stage, options) {
	return options ?? defaultTransientProviderRetryForStage(stage);
}
function readErrorName(error) {
	if (typeof error !== "object" || error === null) return;
	const name = error.name;
	return typeof name === "string" ? name : void 0;
}
function isTimeoutNamedError(error) {
	const name = readErrorName(error);
	return name === "TimeoutError" || name === "RequestTimeoutError";
}
function readErrorStatus(error) {
	if (typeof error !== "object" || error === null) return;
	const record = error;
	for (const value of [
		record.status,
		record.statusCode,
		record.code
	]) {
		if (typeof value === "number" && Number.isInteger(value)) return value;
		if (typeof value === "string" && /^\d{3}$/.test(value.trim())) return Number(value.trim());
	}
}
function readErrorCode(error) {
	if (typeof error !== "object" || error === null) return;
	const code = error.code;
	return typeof code === "string" ? code : void 0;
}
const PROVIDER_RETRYABLE_DNS_ERROR_CODE_RE = /\bENOTFOUND\b/i;
function hasProviderRetryableNetworkCode(value) {
	return hasRetryableConnectionErrorCode(value) || PROVIDER_RETRYABLE_DNS_ERROR_CODE_RE.test(value);
}
function hasTransientNetworkSignal(error, message) {
	if (hasProviderRetryableNetworkCode(message)) return true;
	const code = readErrorCode(error);
	if (code && hasProviderRetryableNetworkCode(code)) return true;
	const cause = readErrorCause(error);
	if (!cause || cause === error) return false;
	const causeCode = readErrorCode(cause);
	if (causeCode && hasProviderRetryableNetworkCode(causeCode)) return true;
	return hasProviderRetryableNetworkCode(formatErrorMessage(cause));
}
function hasTimeoutSignal(error, message) {
	if (isTimeoutNamedError(error)) return true;
	if (/\b(?:request timeout|provider timeout|timed out|timeout)\b/i.test(message)) return true;
	const cause = readErrorCause(error);
	if (!cause || cause === error) return false;
	if (isTimeoutNamedError(cause)) return true;
	return /\b(?:request timeout|provider timeout|timed out|timeout)\b/i.test(formatErrorMessage(cause));
}
/**
* Canonical transient HTTP status predicate for provider operations.
* Shared by structured-error classification and the guarded POST gate so
* these paths cannot drift.
*/
function isTransientProviderHttpStatus(status) {
	return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}
function isTransientProviderOperationError(error, message) {
	const status = readErrorStatus(error);
	if (status !== void 0) return isTransientProviderHttpStatus(status);
	if (/\b(?:HTTP\s*)?(?:400|401|403|404)\b/i.test(message) || /\b(?:invalid api key|permission denied|model not found|validation|unsupported model)\b/i.test(message)) return false;
	if (/\b(?:HTTP\s*)?(?:429|500|502|503|504)\b/i.test(message)) return true;
	if (hasTransientNetworkSignal(error, message)) return true;
	if (hasTimeoutSignal(error, message)) return true;
	if (/\bfetch failed\b/i.test(message)) return hasTransientNetworkSignal(error, message);
	return false;
}
function resolveTransientProviderAttempts(options) {
	if (!options) return 1;
	if (!Number.isSafeInteger(options.attempts)) return 1;
	return Math.max(1, options.attempts);
}
function resolveTransientProviderDelayMs(options, attemptNumber) {
	const rawBaseDelayMs = options.baseDelayMs ?? 250;
	const baseDelayMs = Math.max(0, Math.round(Number.isFinite(rawBaseDelayMs) ? rawBaseDelayMs : 250));
	const rawMaxDelayMs = options.maxDelayMs ?? 1e3;
	return Math.min(Math.max(baseDelayMs, Math.round(Number.isFinite(rawMaxDelayMs) ? rawMaxDelayMs : 1e3)), baseDelayMs * 2 ** Math.max(attemptNumber - 1, 0));
}
function shouldRetrySameKeyProviderOperation(params) {
	if (params.attemptNumber >= params.maxAttempts) return false;
	if (params.options.signal?.aborted) return false;
	const retryParams = {
		error: params.error,
		message: params.message,
		provider: params.provider,
		apiKeyIndex: params.apiKeyIndex,
		attemptNumber: params.attemptNumber,
		...params.stage ? { stage: params.stage } : {}
	};
	return params.options.shouldRetry ? params.options.shouldRetry(retryParams) : isTransientProviderOperationError(params.error, params.message);
}
async function executeProviderOperationWithRetry(params) {
	const resolvedRetryOptions = resolveTransientProviderRetryOptions(providerOperationRetryConfig(params.stage, params.retry));
	const retrySignal = params.signal && resolvedRetryOptions?.signal ? AbortSignal.any([params.signal, resolvedRetryOptions.signal]) : params.signal ?? resolvedRetryOptions?.signal;
	const retryOptions = resolvedRetryOptions ? {
		...resolvedRetryOptions,
		...retrySignal ? { signal: retrySignal } : {}
	} : void 0;
	const maxAttempts = resolveTransientProviderAttempts(retryOptions);
	let lastError;
	for (let attemptNumber = 1; attemptNumber <= maxAttempts; attemptNumber += 1) {
		retrySignal?.throwIfAborted();
		try {
			return await params.operation();
		} catch (error) {
			retrySignal?.throwIfAborted();
			lastError = error;
			const message = formatErrorMessage(error);
			if (!retryOptions || !shouldRetrySameKeyProviderOperation({
				options: retryOptions,
				error,
				message,
				provider: params.provider,
				apiKeyIndex: 0,
				attemptNumber,
				maxAttempts,
				stage: params.stage
			})) throw error;
			const delayMs = resolveTransientProviderDelayMs(retryOptions, attemptNumber);
			await (retryOptions.sleep ?? sleepWithAbort)(delayMs, retryOptions.signal);
		}
	}
	throw lastError;
}
//#endregion
export { resolveTransientProviderDelayMs as a, resolveTransientProviderAttempts as i, isTransientProviderHttpStatus as n, resolveTransientProviderRetryOptions as o, providerOperationRetryConfig as r, shouldRetrySameKeyProviderOperation as s, executeProviderOperationWithRetry as t };
