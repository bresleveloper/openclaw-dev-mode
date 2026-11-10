import { g as extractErrorHttpStatus } from "./redact-BcXJu5HP.mjs";
import { f as isRateLimitErrorMessage, i as isAuthErrorMessage, o as isBillingErrorMessage } from "./message-patterns-DSkmGYcR.mjs";
import { a as failoverReasonFromClassification } from "./classification-rules-CaFCPBKV.mjs";
import { d as extractFailoverSignalDetails } from "./assistant-request-failure-copy-csnSONXK.mjs";
import { n as classifyFailoverSignal } from "./classify-PIr_bdgF.mjs";
import { o as resolveRetryAfterMs } from "./retry-evidence-BSh9bhDe.mjs";
import { n as isTerminalAssistantError } from "./retry-2KnjF4V1.mjs";
//#region src/agents/embedded-agent-helpers/assistant-message-failures.ts
function buildAssistantFailoverSignal(msg, opts) {
	const textRetryAfterMs = resolveRetryAfterMs(msg.errorMessage, Date.now(), msg.errorBody);
	const retryAfterMs = msg.retryAfterMs === null ? Infinity : msg.retryAfterMs === void 0 ? textRetryAfterMs : Math.max(msg.retryAfterMs, textRetryAfterMs ?? 0);
	return {
		status: extractErrorHttpStatus(msg.errorMessage?.trim() ?? "")?.code,
		...retryAfterMs === void 0 ? {} : { retryAfterMs },
		code: msg.errorCode,
		errorType: msg.errorType,
		message: msg.errorMessage?.trim() || void 0,
		provider: opts?.provider ?? msg.provider,
		details: extractFailoverSignalDetails(msg.errorBody)
	};
}
function classifyAssistantFailoverReason(msg, opts) {
	if (!msg || msg.stopReason !== "error" || isTerminalAssistantError(msg)) return null;
	const providerOwner = opts?.providerOwner;
	const classification = classifyFailoverSignal(buildAssistantFailoverSignal(msg, { provider: providerOwner?.id ?? opts?.provider }), { providerPlugin: providerOwner });
	return failoverReasonFromClassification(classification);
}
function isRateLimitAssistantError(msg) {
	return msg?.stopReason === "error" && isRateLimitErrorMessage(msg.errorMessage ?? "");
}
function isBillingAssistantError(msg) {
	return msg?.stopReason === "error" && isBillingErrorMessage(msg.errorMessage ?? "");
}
function isAuthAssistantError(msg) {
	return msg?.stopReason === "error" && isAuthErrorMessage(msg.errorMessage ?? "");
}
function isFailoverAssistantError(msg) {
	return classifyAssistantFailoverReason(msg) !== null;
}
//#endregion
export { isFailoverAssistantError as a, isBillingAssistantError as i, classifyAssistantFailoverReason as n, isRateLimitAssistantError as o, isAuthAssistantError as r, buildAssistantFailoverSignal as t };
