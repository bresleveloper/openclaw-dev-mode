import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { T as parseApiErrorInfo, g as extractErrorHttpStatus, m as CONTEXT_OVERFLOW_ERROR_MESSAGE, s as redactSensitiveText, x as formatTransportErrorCopy } from "./redact-BcXJu5HP.mjs";
import { g as isUnsupportedReasoningEffortParameterError, m as isSessionTranscriptValidationErrorMessage, p as isServerErrorMessage, v as resolveExecutionApprovalFailureMessage } from "./message-patterns-DSkmGYcR.mjs";
import { t as escapeMarkdownText } from "./escape-markdown-DuGqNHh1.mjs";
import { n as isContextOverflowErrorFromTables } from "./context-overflow-tables-Cn71vUg0.mjs";
import { n as classifyFailoverSignalCore } from "./classify-core-Y2V-pZHU.mjs";
//#region src/agents/failover/signal-details.ts
const MAX_FAILOVER_DETAIL_CANDIDATES = 12;
const MAX_FAILOVER_DETAIL_CHARS = 1e3;
function collectFailoverDetailCandidates(value, candidates, seen) {
	if (candidates.length >= MAX_FAILOVER_DETAIL_CANDIDATES) return;
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
		const normalized = truncateUtf16Safe(String(value).trim(), MAX_FAILOVER_DETAIL_CHARS);
		if (normalized && !candidates.includes(normalized)) candidates.push(normalized);
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (trimmed.startsWith("{") && trimmed.endsWith("}")) try {
				collectFailoverDetailCandidates(JSON.parse(trimmed), candidates, seen);
			} catch {}
		}
		return;
	}
	const record = asOptionalRecord(value);
	if (!record || seen.has(record)) return;
	seen.add(record);
	for (const key of [
		"message",
		"param",
		"code",
		"type",
		"error",
		"detail",
		"body"
	]) {
		collectFailoverDetailCandidates(record[key], candidates, seen);
		if (candidates.length >= MAX_FAILOVER_DETAIL_CANDIDATES) return;
	}
}
function extractFailoverSignalDetails(...values) {
	const candidates = [];
	const seen = /* @__PURE__ */ new Set();
	for (const value of values) {
		collectFailoverDetailCandidates(value, candidates, seen);
		if (candidates.length >= MAX_FAILOVER_DETAIL_CANDIDATES) break;
	}
	return candidates.length > 0 ? candidates : void 0;
}
//#endregion
//#region src/agents/failover/assistant-request-failure-copy.ts
const ERROR_PREFIX_RE = /^(?:error|(?:[a-z][\w-]*\s+)?api\s*error|openai\s*error|anthropic\s*error|gateway\s*error|codex\s*error|request failed|failed|exception)(?:\s+\d{3})?[:\s-]+/i;
const PROVIDER_SCHEMA_REJECTION_USER_TEXT = "The AI service couldn't accept this request. Try a new conversation with /new, or choose another model in the Control UI.";
const PROVIDER_OUTPUT_TOKEN_LIMIT_RE = /^['"]?max_(?:tokens|output_tokens|completion_tokens|new_tokens)['"]?\s*(?:[:=]\s*)?\(?(\d[\d,]*)\)?\s+exceeds?\b.{0,120}?\b(?:maximum|max|limit)\b(?:\s+(?:output\s+)?tokens?)?(?:\s+(?:is|of)|\s*[:=])?\s*\(?(\d[\d,]*)\)?(?:\D|$)/i;
const PROVIDER_CACHE_CONTROL_LIMIT_RE = /^A maximum of (\d{1,6}) blocks with cache_control may be provided\. Found (\d{1,6})\.$/i;
const ERROR_DETAILS_HINT = "For details, open Settings → Logs in the Control UI or run `openclaw logs --follow` in your terminal.";
const STORAGE_FAILURE_COPY = {
	SQLITE_BUSY: "OpenClaw is busy saving your conversation. Wait a moment, then check the conversation before trying again.",
	SQLITE_LOCKED: "OpenClaw is busy saving your conversation. Wait a moment, then check the conversation before trying again.",
	SQLITE_FULL: "OpenClaw couldn't save your conversation because the disk is full. Free up space on the computer running OpenClaw before continuing.",
	SQLITE_READONLY: "OpenClaw doesn't have permission to save your conversation. Check folder permissions on the computer running OpenClaw.",
	SQLITE_IOERR: "OpenClaw couldn't save your conversation. Check the storage on the computer running OpenClaw before continuing.",
	transcript_writer_fenced: "This conversation changed while OpenClaw was working. Check its latest messages before continuing."
};
const RUNTIME_COORDINATION_FAILURE_CODE_COPY = {
	codex_node_disconnected: "Codex execution node disconnected. Start a fresh attempt.",
	node_runner_update_required: "The device worker requires an update before it can host sessions. Run `openclaw update`, reconnect it, then run `openclaw node restart` on a headless node before trying again.",
	"runner-offline": "The device runner is offline. Reconnect it, retry later, or bring the session back to this gateway."
};
const ASSISTANT_REQUEST_FAILURE_COPY = {
	auth: "Couldn't sign in to the AI service. Sign in again under Models in the Control UI or run `openclaw configure`.",
	auth_permanent: "The AI service isn't accepting your login. Sign in again under Models in the Control UI or run `openclaw configure`.",
	format: PROVIDER_SCHEMA_REJECTION_USER_TEXT,
	rate_limit: "The AI service needs a short break. Please try again in a few minutes.",
	overloaded: "The AI service is busy. Please try again in a moment, or choose another model.",
	billing: "The AI service reported a billing problem. Check your account's credit balance and usage limits before trying again.",
	server_error: "The AI service is having trouble. Please try again in a moment.",
	timeout: "The request took too long. Check the conversation for any completed work before trying again.",
	tls_certificate: `Couldn't connect securely to the AI service. ${ERROR_DETAILS_HINT}`,
	context_overflow: CONTEXT_OVERFLOW_ERROR_MESSAGE,
	model_not_found: "This model was not found. Choose another model in the Control UI or run `openclaw configure`.",
	session_expired: "Your AI session expired. Start a new conversation with /new. If it happens again, sign in under Models in the Control UI.",
	empty_response: "The AI service returned an empty reply. Please try again.",
	no_error_details: "",
	unclassified: "",
	unknown: ""
};
/** Plain storage copy for length-limited surfaces such as session rows. */
function renderStorageFailureSummary(storageFailure) {
	return storageFailure ? STORAGE_FAILURE_COPY[storageFailure] : void 0;
}
/** Render classified facts without exposing raw provider response text. */
function renderAssistantRequestFailureCopy(facts) {
	if (facts.storageFailure) return `⚠️ ${STORAGE_FAILURE_COPY[facts.storageFailure]} ${ERROR_DETAILS_HINT}`;
	if (facts.code === "incomplete_tool_call") return "⚠️ The task couldn't finish. Some actions may have completed; check their results before continuing.";
	const reason = facts.reason === "timeout" && typeof facts.status === "number" && facts.status >= 500 ? "server_error" : facts.reason;
	const copy = reason ? ASSISTANT_REQUEST_FAILURE_COPY[reason] : void 0;
	if (copy) return `⚠️ ${copy}`;
	if (!(typeof facts.status === "number" && Number.isInteger(facts.status) && facts.status >= 100 && facts.status <= 599) && !facts.provider?.trim() && !facts.model?.trim()) return;
	return `⚠️ OpenClaw couldn't finish this reply. ${ERROR_DETAILS_HINT}`;
}
/** Render already-classified coordination facts without loading provider runtime. */
function renderRuntimeCoordinationFailureCopy(code) {
	const copy = code ? RUNTIME_COORDINATION_FAILURE_CODE_COPY[code] : void 0;
	return copy ? `⚠️ ${copy}` : void 0;
}
/** Preserve the rejection diagnostic without publishing the surrounding response body. */
function renderFormatErrorCopy(raw) {
	const trimmed = raw.trim();
	const normalized = extractErrorHttpStatus(trimmed)?.rest ?? trimmed.replace(ERROR_PREFIX_RE, "").trim();
	let candidate = extractErrorHttpStatus(normalized)?.rest ?? normalized;
	for (let depth = 0; depth < 4; depth++) {
		candidate = (extractErrorHttpStatus(candidate)?.rest ?? candidate).replace(/^(?:bad request|unprocessable (?:entity|content))\s*:?\s*(?=[{[<])/iu, "");
		const parsedMessage = parseApiErrorInfo(candidate)?.message?.trim();
		if (!parsedMessage || parsedMessage === candidate) break;
		candidate = parsedMessage;
	}
	if (isSessionTranscriptValidationErrorMessage(candidate)) return "OpenClaw couldn't read this conversation's history. Ask the Gateway operator to try `openclaw doctor --fix`. If it still fails, preserve the history and contact support with the Gateway logs.";
	const embeddingModel = candidate.match(/^"([\w./:-]{1,200})" does not support chat$/u)?.[1];
	if (embeddingModel) return `${escapeMarkdownText(redactSensitiveText(embeddingModel, { mode: "tools" }))} is an embedding model and cannot chat; pick a chat model with /model (or remove it from models.providers.ollama.models).`;
	if (PROVIDER_CACHE_CONTROL_LIMIT_RE.test(candidate)) return "The AI service couldn't accept this conversation. Start a new conversation with /new, or choose another model in the Control UI.";
	if (isUnsupportedReasoningEffortParameterError(candidate)) return "This model endpoint does not support reasoning_effort. Set compat.supportsReasoningEffort: false on this model in your custom provider configuration and try again.";
	if (candidate.length > 300 || !PROVIDER_OUTPUT_TOKEN_LIMIT_RE.test(candidate)) {
		if (!candidate || /^[{<]/u.test(candidate)) return PROVIDER_SCHEMA_REJECTION_USER_TEXT;
		if (candidate.startsWith("[")) try {
			JSON.parse(candidate);
			return PROVIDER_SCHEMA_REJECTION_USER_TEXT;
		} catch {
			if (!/^\[[a-z_$][\w$.-]*\](?:\s|:|$)/iu.test(candidate)) return PROVIDER_SCHEMA_REJECTION_USER_TEXT;
		}
		const detail = redactSensitiveText(candidate, { mode: "tools" }).replace(/[\p{Cc}\p{Cf}\s]+/gu, " ").trim();
		if (!detail) return PROVIDER_SCHEMA_REJECTION_USER_TEXT;
		const bounded = detail.length > 600 ? `${truncateUtf16Safe(detail, 600)}…` : detail;
		return `LLM request rejected: ${escapeMarkdownText(bounded)}`;
	}
	return "The reply length is set too high for this model. Lower its reply limit in the Control UI settings, or choose another model.";
}
/** Share bounded request-limit facts between live failures and persisted chat history. */
function renderAssistantFormatFailureCopy(message, reason) {
	for (const [isBody, raw] of [[true, message.errorBody], [false, message.errorMessage]]) {
		if (typeof raw !== "string") continue;
		const info = parseApiErrorInfo(raw);
		if (isBody && !info?.message) continue;
		const status = extractErrorHttpStatus(raw)?.code;
		if (reason !== "format" && !(typeof message.errorType === "string" && message.errorType.toLowerCase().includes("invalid_request")) && !info?.type?.toLowerCase().includes("invalid_request") && status !== 400 && status !== 422) continue;
		const copy = renderFormatErrorCopy(raw);
		if (copy !== "The AI service couldn't accept this request. Try a new conversation with /new, or choose another model in the Control UI.") return copy;
	}
}
/** Render loading facts without trusting provider diagnostics or recovery instructions. */
function renderModelLoadFailureCopy(message) {
	if (message.errorCode !== "model_load_failed" || typeof message.errorBody !== "string" || typeof message.model !== "string") return;
	const contextLength = asPositiveSafeInteger(safeParseJsonRecord(message.errorBody)?.requestedContextLength);
	const model = redactSensitiveText(message.model, { mode: "tools" }).replace(/[\p{Cc}\p{Cf}\s]+/gu, " ").trim();
	if (!contextLength || !model) return;
	return `Could not load model "${escapeMarkdownText(truncateUtf16Safe(model, 200))}" with ${contextLength} context tokens. Wait for loading to finish on the model server, then retry, or lower the model's configured context size.`;
}
/** Classify saved error facts without loading providers or publishing their raw diagnostics. */
function renderRecordedAssistantFailureCopy(message) {
	const modelLoadCopy = renderModelLoadFailureCopy(message);
	if (modelLoadCopy) return modelLoadCopy;
	const approvalMessage = resolveExecutionApprovalFailureMessage(typeof message.errorMessage === "string" ? message.errorMessage : void 0);
	if (approvalMessage) return `⚠️ ${approvalMessage}`;
	const raw = typeof message.errorMessage === "string" ? message.errorMessage.trim() : "";
	if (raw === "Worker inference result exceeds the transcript message limit.") return "The worker could not save the model response because it exceeded the message size limit. Retry with a smaller response or continue on the Gateway. Earlier actions may have completed; verify their results before continuing.";
	if (raw === "Cloud worker could not preserve authoritative provider replay. Stop or reclaim the cloud worker, then retry locally.") return "The worker could not preserve the model's continuation data. Stop or reclaim the worker, then retry on the Gateway. Earlier actions may have completed; verify their results before continuing.";
	const info = parseApiErrorInfo(raw);
	const code = typeof message.errorCode === "string" ? message.errorCode : info?.code;
	const status = extractErrorHttpStatus(raw)?.code;
	const classification = classifyFailoverSignalCore({
		message: raw,
		code,
		errorType: typeof message.errorType === "string" ? message.errorType : info?.type,
		status,
		details: extractFailoverSignalDetails(message.errorBody)
	});
	if (classification?.kind === "context_overflow" || [
		message.errorCode,
		message.errorType,
		raw
	].some((value) => typeof value === "string" && (normalizeLowercaseStringOrEmpty(value) === "context_overflow" || isContextOverflowErrorFromTables(value)))) return CONTEXT_OVERFLOW_ERROR_MESSAGE;
	const formatCopy = !classification?.reason || classification.reason === "format" ? renderAssistantFormatFailureCopy(message, classification?.reason) : void 0;
	if (formatCopy) return formatCopy;
	const classifiedCopy = renderAssistantRequestFailureCopy({
		code,
		status,
		reason: classification?.reason === "timeout" && isServerErrorMessage(raw) ? "server_error" : classification?.reason
	});
	if (status !== void 0 || classification && classification.reason !== "timeout") return classifiedCopy;
	return formatTransportErrorCopy([raw, code].filter(Boolean).join(" ")) ?? classifiedCopy;
}
//#endregion
export { renderAssistantRequestFailureCopy as a, renderRecordedAssistantFailureCopy as c, extractFailoverSignalDetails as d, renderAssistantFormatFailureCopy as i, renderRuntimeCoordinationFailureCopy as l, ERROR_PREFIX_RE as n, renderFormatErrorCopy as o, PROVIDER_SCHEMA_REJECTION_USER_TEXT as r, renderModelLoadFailureCopy as s, ERROR_DETAILS_HINT as t, renderStorageFailureSummary as u };
