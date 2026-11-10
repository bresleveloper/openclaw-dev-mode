import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-CU53EX1R.mjs";
import { a as readToolResultDetails, n as isToolResultError, o as readToolResultStatus } from "./tool-result-error-IpvGgAny.mjs";
import { t as collectTextContentBlocks } from "./content-blocks-DDtxq3Ff.mjs";
import { t as readNodePermissionError } from "./node-permission-error-bAxchLQx.mjs";
//#region src/agents/embedded-agent-tool-results.ts
/** Sanitizes, extracts, and classifies embedded-agent tool execution results. */
const TOOL_RESULT_MAX_CHARS = 8e3;
const TOOL_ERROR_MAX_CHARS = 400;
const LIVE_EXEC_OUTPUT_MAX_CHARS = 8e3;
const TOOL_DENIAL_ERROR_CODES = ["SYSTEM_RUN_DENIED", "INVALID_REQUEST"];
const OPAQUE_STRUCTURED_RESULT_FIELDS = /* @__PURE__ */ new Set(["encrypted_content", "encrypted_stdout"]);
/** Recognize work accepted by a tool whose background task owns completion. */
function isAsyncStartedToolResult(result) {
	const details = readToolResultDetails(result);
	return details?.async === true && details.status === "started";
}
/** Preserve the accepted task's identity independently of result presentation. */
function readAsyncStartedTaskIds(result) {
	const details = readToolResultDetails(result);
	if (!details) return {};
	const nestedTask = asOptionalRecord(details.task);
	const asyncTaskRunId = readStringValue(details.runId) ?? readStringValue(nestedTask?.runId);
	const asyncTaskId = readStringValue(details.taskId) ?? readStringValue(nestedTask?.taskId);
	return {
		...asyncTaskRunId ? { asyncTaskRunId } : {},
		...asyncTaskId ? { asyncTaskId } : {}
	};
}
function truncateToolText(text, maxChars = TOOL_RESULT_MAX_CHARS, suffix = "\n…(truncated)…") {
	if (text.length <= maxChars) return text;
	return `${truncateUtf16Safe(text, maxChars)}${suffix}`;
}
function truncateLiveExecOutput(text) {
	return truncateToolText(text, LIVE_EXEC_OUTPUT_MAX_CHARS, "\n...(live output truncated)...");
}
function capLiveExecResult(result) {
	const details = readToolResultDetails(result);
	if (!details || typeof details.status !== "string" || typeof details.aggregated !== "string") return result;
	const aggregated = truncateLiveExecOutput(details.aggregated);
	if (aggregated === details.aggregated) return result;
	if (Array.isArray(result)) return result;
	return {
		...result,
		details: {
			...details,
			aggregated
		}
	};
}
function normalizeToolErrorText(text) {
	const firstLine = text.trimStart().split(/\r?\n/, 1)[0]?.trim();
	if (!firstLine) return;
	return truncateToolText(firstLine, TOOL_ERROR_MAX_CHARS, "…");
}
function readErrorCandidate(value) {
	if (typeof value === "string") return normalizeToolErrorText(value);
	const record = asOptionalObjectRecord(value);
	if (typeof record?.message === "string") return normalizeToolErrorText(record.message);
	if (typeof record?.error === "string") return normalizeToolErrorText(record.error);
}
function extractErrorField(value) {
	const record = asOptionalObjectRecord(value);
	if (!record) return;
	const direct = extractDirectErrorField(record);
	if (direct) return direct;
	const status = normalizeOptionalString(record.status);
	return status && /error|fail|timeout|timed[_\s-]?out|denied|cancel|invalid|forbidden/.test(status.toLowerCase()) ? normalizeToolErrorText(status) : void 0;
}
function extractDirectErrorField(value) {
	const record = asOptionalObjectRecord(value);
	return readErrorCandidate(record?.error) ?? readErrorCandidate(record?.message) ?? readErrorCandidate(record?.reason);
}
function readDenialErrorCodeFromMessage(value) {
	const message = normalizeOptionalString(value);
	if (!message) return;
	return TOOL_DENIAL_ERROR_CODES.find((code) => message === code || message.startsWith(`${code}:`));
}
function extractErrorCodeField(value, nested = false) {
	const record = asOptionalObjectRecord(value);
	return (nested ? readDenialErrorCodeFromMessage(record?.message) ?? readDenialErrorCodeFromMessage(record?.error) : extractErrorCodeField(record?.error, true) ?? extractErrorCodeField(record?.nodeError, true)) ?? normalizeOptionalString(record?.code) ?? normalizeOptionalString(record?.gatewayCode);
}
function buildToolLifecycleErrorResult(error) {
	const errorRecord = asOptionalRecord(error);
	const rawDetails = asOptionalRecord(errorRecord?.details);
	const nodeError = asOptionalRecord(rawDetails?.nodeError);
	const permissionMissing = readNodePermissionError(error);
	const gatewayCode = normalizeOptionalString(errorRecord?.gatewayCode) ?? normalizeOptionalString(errorRecord?.code);
	const message = error instanceof Error ? error.message : String(error);
	return {
		content: [{
			type: "text",
			text: message
		}],
		details: {
			status: "error",
			error: message,
			...gatewayCode ? { gatewayCode } : {},
			...nodeError ? { nodeError } : {},
			...permissionMissing ? { permissionMissing } : {}
		}
	};
}
function sanitizeToolResult(result) {
	if (!result || typeof result !== "object") return result;
	return sanitizeStructuredToolResult(result);
}
function prepareToolResult(result) {
	return () => sanitizeToolResult(result);
}
function sanitizeStructuredToolResult(result) {
	if (Array.isArray(result)) return result;
	const record = result;
	const out = { ...record };
	if (Array.isArray(record.content)) out.content = record.content.map((item) => {
		if (!item || typeof item !== "object") return item;
		const entry = item;
		if (readStringValue(entry.type) === "image") {
			const data = readStringValue(entry.data);
			const existingBytes = typeof entry.bytes === "number" ? entry.bytes : void 0;
			const bytes = data === void 0 ? existingBytes : estimateBase64DecodedBytes(data);
			const cleaned = { ...entry };
			delete cleaned.data;
			return Object.assign(cleaned, {
				bytes,
				omitted: true
			});
		}
		if (readStringValue(entry.type) === "text" && typeof entry.text === "string") return Object.assign({ ...entry }, { text: truncateToolText(entry.text) });
		return entry;
	});
	return out;
}
const INLINE_DATA_URI_VALUE_PATTERN = /^data:(?:[a-z][a-z0-9.+-]*\/[a-z0-9.+-]+)?(?:;[a-z0-9.+-]+(?:=[^,;"'\s]+)?)*,/i;
function omitInlineDataUriValue(value) {
	const trimmed = value.trimStart();
	if (!INLINE_DATA_URI_VALUE_PATTERN.test(trimmed)) return value;
	return `[inline data URI: ${value.length} chars]`;
}
function carriesBinaryData(record) {
	const type = normalizeOptionalLowercaseString(record.type);
	if (type === "audio" || type === "image" || type === "base64") return true;
	const mediaType = normalizeOptionalLowercaseString(record.media_type ?? record.mimeType);
	return mediaType?.startsWith("image/") === true || mediaType?.startsWith("audio/") === true || mediaType?.startsWith("video/") === true || mediaType === "application/pdf";
}
function prepareStructuredToolResultValue(value, key, parentCarriesBinaryData = false, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "string") {
		if (key === "blob" || key === "data" && parentCarriesBinaryData) return `[binary omitted: ${value.length} chars]`;
		if (key && OPAQUE_STRUCTURED_RESULT_FIELDS.has(key)) return `[opaque data omitted: ${value.length} chars]`;
		return truncateToolText(omitInlineDataUriValue(value));
	}
	if (typeof value === "bigint") return value.toString();
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return "[Circular]";
	seen.add(value);
	if (Array.isArray(value)) return value.map((item) => prepareStructuredToolResultValue(item, key, parentCarriesBinaryData, seen));
	const record = value;
	const hasBinaryData = carriesBinaryData(record);
	return Object.fromEntries(Object.entries(record).map(([childKey, child]) => [childKey, prepareStructuredToolResultValue(child, childKey, hasBinaryData, seen)]));
}
function stringifyStructuredToolResultContent(block) {
	if (!block || typeof block !== "object") return;
	const record = block;
	const type = readStringValue(record.type);
	if (type === "text" || type === "image" || type === "image_url" || type === "audio") return;
	try {
		const serialized = JSON.stringify(prepareStructuredToolResultValue(record));
		return serialized && serialized !== "{}" ? serialized : void 0;
	} catch {
		return;
	}
}
function resolveToolResultContentBlocks(result) {
	if (Array.isArray(result)) return result;
	const record = result;
	if (readStringValue(record.type)) return [record];
	if (Array.isArray(record.content)) return record.content;
	if (record.content && typeof record.content === "object") return [record.content];
	return [record];
}
function extractToolResultText(result) {
	if (typeof result === "string") {
		const trimmed = omitInlineDataUriValue(result).trim();
		return trimmed ? truncateToolText(trimmed) : void 0;
	}
	if (!result || typeof result !== "object") return;
	const content = resolveToolResultContentBlocks(result);
	const texts = collectTextContentBlocks(content).map((item) => item.trim()).filter(Boolean);
	const selected = texts.length > 0 ? texts : content.map(stringifyStructuredToolResultContent).filter(Boolean);
	return selected.length > 0 ? truncateToolText(selected.join("\n")) : void 0;
}
function extractToolErrorCode(result) {
	const record = asOptionalObjectRecord(result);
	return extractErrorCodeField(record?.details) ?? extractErrorCodeField(record);
}
function isToolResultTimedOut(result) {
	return readToolResultStatus(result) === "timeout" || readToolResultDetails(result)?.timedOut === true;
}
function extractToolErrorMessage(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	const direct = extractDirectErrorField(record.details) ?? readErrorCandidate(asOptionalObjectRecord(record.details)?.aggregated) ?? extractDirectErrorField(record);
	if (direct) return direct;
	const text = extractToolResultText(result);
	if (text) try {
		const fromJson = extractErrorField(JSON.parse(text));
		if (fromJson) return fromJson;
	} catch {}
	const fromStatus = extractErrorField(record.details) ?? extractErrorField(record);
	if (fromStatus) return fromStatus;
	if (readToolResultStatus(result) && !isToolResultError(result)) return;
	return text ? normalizeToolErrorText(text) : void 0;
}
//#endregion
export { extractToolResultText as a, prepareToolResult as c, truncateLiveExecOutput as d, extractToolErrorMessage as i, readAsyncStartedTaskIds as l, capLiveExecResult as n, isAsyncStartedToolResult as o, extractToolErrorCode as r, isToolResultTimedOut as s, buildToolLifecycleErrorResult as t, sanitizeToolResult as u };
