import "./src-CZ2wJvNB.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { E as extractErrorHttpStatus, F as parseApiErrorInfo, _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { n as formatErrorMessageWithCode, t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { projectProviderError } from "@openclaw/ai/internal/shared";
import { projectDiagnosticValue } from "@openclaw/ai/diagnostics";
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
/** Preserve provider classification inside the existing bounded inference error text. */
function formatWorkerInferenceError(error) {
	const snapshot = projectDiagnosticValue(error);
	const projected = projectProviderError(snapshot);
	const record = asOptionalRecord(snapshot);
	const response = asOptionalRecord(record?.response);
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
	if (!code && !type && status === void 0) return boundedWorkerError(snapshot, 256);
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
	return encoded;
}
//#endregion
export { boundedWorkerErrorWithCode as n, formatWorkerInferenceError as r, boundedWorkerError as t };
