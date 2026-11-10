import "./src-Djeo9OvP.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { T as parseApiErrorInfo, g as extractErrorHttpStatus, s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { n as formatErrorMessageWithCode, t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as resolveRetryAfterMs } from "./retry-evidence-BSh9bhDe.mjs";
import { projectDiagnosticValue } from "@openclaw/ai/diagnostics";
import { projectProviderError } from "@openclaw/ai/internal/shared";
//#region src/gateway/worker-environments/worker-error.ts
function boundWorkerErrorText(text, maxChars) {
	const message = redactSensitiveText(text, { mode: "tools" }).replace(/\s+/g, " ").trim() || "unknown error";
	const limit = Math.max(0, Math.floor(maxChars));
	const marker = " ... ";
	if (message.length <= limit || limit <= 5) return truncateUtf16Safe(message, limit);
	const headChars = Math.floor((limit - 5) / 2);
	const tailChars = limit - 5 - headChars;
	return `${sliceUtf16Safe(message, 0, headChars).trimEnd()}${marker}${sliceUtf16Safe(message, -tailChars).trimStart()}`.trim();
}
/** Formats a redacted worker error graph within a fixed display bound. */
function boundedWorkerError(error, maxChars = 1024) {
	return boundWorkerErrorText(formatErrorMessage(error), maxChars);
}
/** Includes the outer error code while preserving the standard worker diagnostic bound. */
function boundedWorkerErrorWithCode(error, maxChars = 1024) {
	return boundWorkerErrorText(formatErrorMessageWithCode(error), maxChars);
}
/** Preserve provider retry facts before bounding the display-only error text. */
function projectWorkerInferenceError(error) {
	const snapshot = projectDiagnosticValue(error, { omitField: (key) => key === "stack" });
	const projected = projectProviderError(error);
	const record = asOptionalRecord(snapshot);
	const response = asOptionalRecord(record?.response);
	const retryFloor = resolveRetryAfterMs(projected.errorMessage, Date.now(), snapshot);
	const retryFloors = [
		projected.retryAfterMs,
		record?.retryAfterMs,
		retryFloor
	].filter((value) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0);
	const timing = projected.retryAfterMs === null || record?.retryAfterMs === null || retryFloor === Infinity ? { retryAfterMs: null } : retryFloors.length > 0 ? { retryAfterMs: Math.max(...retryFloors) } : {};
	const status = [
		record?.status,
		record?.statusCode,
		response?.status,
		response?.statusCode,
		extractErrorHttpStatus(projected.errorMessage)?.code
	].find((value) => typeof value === "number" && Number.isInteger(value) && value >= 100 && value <= 599);
	const body = record?.errorBody ?? record?.body ?? response?.body ?? response?.data ?? record?.error;
	const info = parseApiErrorInfo(projected.errorMessage) ?? parseApiErrorInfo(typeof body === "string" ? body : stableStringify(body)) ?? parseApiErrorInfo(projected.errorBody);
	const code = info?.code ?? projected.errorCode;
	const type = projected.errorType ?? info?.type;
	if (!code && !type && status === void 0) return {
		message: boundedWorkerError(snapshot, 256),
		...timing
	};
	const details = {
		...code ? { code: boundedWorkerError(code, 64) } : {},
		...type ? { type: boundedWorkerError(type, 64) } : {},
		message: boundedWorkerError(info?.message ?? extractErrorHttpStatus(projected.errorMessage)?.rest ?? projected.errorMessage, 256)
	};
	const prefix = status === void 0 ? "" : `${status}: `;
	const encode = () => `${prefix}${JSON.stringify({ error: details })}`;
	let encoded = encode();
	for (const field of [
		"message",
		"type",
		"code"
	]) {
		const value = details[field];
		if (encoded.length > 256 && value) {
			details[field] = boundWorkerErrorText(value, Math.max(0, value.length - (encoded.length - 256)));
			encoded = encode();
		}
	}
	return {
		message: encoded,
		...timing
	};
}
//#endregion
export { boundedWorkerErrorWithCode as n, projectWorkerInferenceError as r, boundedWorkerError as t };
