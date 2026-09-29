import { n as PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE, r as PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE } from "./types-LFWwv0cF.mjs";
import { t as isProviderRefusalAssistantError } from "./diagnostics-CAGhEztD.mjs";
import { n as classifyFailoverSignal } from "./classify-DO9EO_30.mjs";
import { a as shouldRetryFailoverSignal, n as extractFailoverHttpStatus } from "./retry-evidence-eo_i1jCP.mjs";
import { WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE, resolveResponsesOutputIdentityRetry } from "@openclaw/ai/diagnostics";
//#region src/llm/utils/retry.ts
const TERMINAL_ASSISTANT_ERROR_CODES = /* @__PURE__ */ new Set([
	PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE,
	PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE,
	WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE
]);
/**
* Preserve structured terminal outcomes before text classification.
* Replay must not duplicate output or override refusals and permanent transport failures.
*/
function isTerminalAssistantError(message) {
	return Boolean(message?.errorCode && TERMINAL_ASSISTANT_ERROR_CODES.has(message.errorCode)) || message != null && resolveResponsesOutputIdentityRetry(message) === "stop" || isProviderRefusalAssistantError(message);
}
/** Classify transient provider/transport failures for session retries. */
function isRetryableAssistantError(message) {
	if (message.stopReason !== "error" || !message.errorMessage || isTerminalAssistantError(message)) return false;
	if (resolveResponsesOutputIdentityRetry(message) === "retry") return true;
	const errorMessage = message.errorMessage.trim();
	const status = extractFailoverHttpStatus(errorMessage);
	const signal = {
		message: errorMessage,
		provider: message.provider,
		code: message.errorCode,
		errorType: message.errorType,
		...status === void 0 ? {} : { status }
	};
	const classification = classifyFailoverSignal(signal);
	return shouldRetryFailoverSignal({
		classification,
		signal
	});
}
//#endregion
export { isTerminalAssistantError as n, isRetryableAssistantError as t };
