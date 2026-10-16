import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { E as extractErrorHttpStatus, F as parseApiErrorInfo, j as formatTransportErrorCopy } from "./redact-DJ8j6ADa.mjs";
import { f as isServerErrorMessage, g as resolveExecutionApprovalFailureMessage, p as isSessionTranscriptValidationErrorMessage } from "./message-patterns-Oyttjfxg.mjs";
import { a as isContextOverflowErrorFromTables, n as classifyFailoverSignalCore } from "./classify-core-DvEr6ITj.mjs";
import { t as extractFailoverSignalDetails } from "./signal-details-D8vFMeoh.mjs";
//#region src/agents/failover/assistant-request-failure-copy.ts
const ERROR_PREFIX_RE = /^(?:error|(?:[a-z][\w-]*\s+)?api\s*error|openai\s*error|anthropic\s*error|gateway\s*error|codex\s*error|request failed|failed|exception)(?:\s+\d{3})?[:\s-]+/i;
const PROVIDER_SCHEMA_REJECTION_USER_TEXT = "The AI service couldn't accept this request. Try a new conversation with /new, or choose another model in the Control UI.";
const GATEWAY_SESSION_TRANSCRIPT_VALIDATION_USER_TEXT = "OpenClaw couldn't read this conversation's history. Try /compact, or start a new conversation with /new.";
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
	context_overflow: "This conversation is too long for the model. Try /compact, or start a new conversation with /new.",
	model_not_found: "This model was not found. Choose another model in the Control UI or run `openclaw configure`.",
	session_expired: "Your AI session expired. Start a new conversation with /new. If it happens again, sign in under Models in the Control UI.",
	empty_response: "The AI service returned an empty reply. Please try again.",
	no_error_details: "",
	unclassified: "",
	unknown: ""
};
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
/** Surface bounded rejection facts without arbitrary provider-controlled text. */
function renderFormatErrorCopy(raw) {
	const trimmed = raw.trim();
	const normalized = extractErrorHttpStatus(trimmed)?.rest ?? trimmed.replace(ERROR_PREFIX_RE, "").trim();
	const candidate = extractErrorHttpStatus(normalized)?.rest ?? normalized;
	if (isSessionTranscriptValidationErrorMessage(candidate)) return GATEWAY_SESSION_TRANSCRIPT_VALIDATION_USER_TEXT;
	if (candidate.match(PROVIDER_CACHE_CONTROL_LIMIT_RE)) return "The AI service couldn't accept this conversation. Start a new conversation with /new, or choose another model in the Control UI.";
	const [, value, maximum] = (candidate.length <= 300 ? candidate.match(PROVIDER_OUTPUT_TOKEN_LIMIT_RE) : null) ?? [];
	if (!value || !maximum) return PROVIDER_SCHEMA_REJECTION_USER_TEXT;
	return "The reply length is set too high for this model. Lower its reply limit in the Control UI settings, or choose another model.";
}
/** Share bounded request-limit facts between live failures and persisted chat history. */
function renderAssistantFormatFailureCopy(message) {
	for (const raw of [message.errorMessage, message.errorBody]) {
		if (typeof raw !== "string") continue;
		const info = parseApiErrorInfo(raw);
		const status = extractErrorHttpStatus(raw)?.code;
		if (!info?.type?.toLowerCase().includes("invalid_request") && status !== 400 && status !== 422) continue;
		const copy = renderFormatErrorCopy(info?.message ?? raw);
		if (copy !== "The AI service couldn't accept this request. Try a new conversation with /new, or choose another model in the Control UI.") return copy;
	}
}
/** Classify saved error facts without loading providers or publishing their raw diagnostics. */
function renderRecordedAssistantFailureCopy(message) {
	const approvalMessage = resolveExecutionApprovalFailureMessage(typeof message.errorMessage === "string" ? message.errorMessage : void 0);
	if (approvalMessage) return `⚠️ ${approvalMessage}`;
	const formatCopy = renderAssistantFormatFailureCopy(message);
	if (formatCopy) return formatCopy;
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
	].some((value) => typeof value === "string" && (normalizeLowercaseStringOrEmpty(value) === "context_overflow" || isContextOverflowErrorFromTables(value)))) return "This conversation is too long for the model. Try /compact, or start a new conversation with /new.";
	const classifiedCopy = renderAssistantRequestFailureCopy({
		code,
		status,
		reason: classification?.reason === "timeout" && isServerErrorMessage(raw) ? "server_error" : classification?.reason
	});
	if (status !== void 0 || classification && classification.reason !== "timeout") return classifiedCopy;
	return formatTransportErrorCopy([raw, code].filter(Boolean).join(" ")) ?? classifiedCopy;
}
//#endregion
export { renderAssistantRequestFailureCopy as a, renderRuntimeCoordinationFailureCopy as c, renderAssistantFormatFailureCopy as i, ERROR_PREFIX_RE as n, renderFormatErrorCopy as o, PROVIDER_SCHEMA_REJECTION_USER_TEXT as r, renderRecordedAssistantFailureCopy as s, ERROR_DETAILS_HINT as t };
