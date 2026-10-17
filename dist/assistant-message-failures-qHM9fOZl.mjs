import { E as extractErrorHttpStatus } from "./redact-DJ8j6ADa.mjs";
import { a as isBillingErrorMessage, d as isRateLimitErrorMessage, r as isAuthErrorMessage } from "./message-patterns-Oyttjfxg.mjs";
import { a as failoverReasonFromClassification } from "./classification-rules-CID2woQZ.mjs";
import { t as extractFailoverSignalDetails } from "./signal-details-D8vFMeoh.mjs";
import { n as classifyFailoverSignal } from "./classify-DEnvBJey.mjs";
import { a as resolveRetryAfterMs } from "./retry-evidence-KUnZJ93Z.mjs";
import { n as isTerminalAssistantError } from "./retry-BdOwk_ol.mjs";
//#region src/agents/embedded-agent-helpers/assistant-message-failures.ts
function buildAssistantFailoverSignal(msg, opts) {
	const retryAfterMs = resolveRetryAfterMs(msg.errorMessage, Date.now(), msg.errorBody);
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
