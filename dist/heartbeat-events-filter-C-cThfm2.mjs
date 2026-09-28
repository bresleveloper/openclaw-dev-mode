import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as SILENT_REPLY_TOKEN, t as HEARTBEAT_TOKEN } from "./tokens-BTKQYTUd.mjs";
import { o as isHeartbeatAcknowledgementText, r as HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS } from "./heartbeat-vWflpIwS.mjs";
//#region src/infra/heartbeat-events-filter.ts
const MAX_EXEC_EVENT_PROMPT_CHARS = 8e3;
const HEARTBEAT_DELIVERY_CONTEXT_KEY_PREFIX = "heartbeat-delivery:";
const STRUCTURED_EXEC_COMPLETION_EVENT_RE = /^exec (completed|failed) \(([a-z0-9_-]{1,64}), (code -?\d+|signal [^)]+)\)(?: :: ([\s\S]*))?$/i;
function parseStructuredExecCompletionEvent(evt) {
	const trimmed = evt.trim();
	const match = STRUCTURED_EXEC_COMPLETION_EVENT_RE.exec(trimmed);
	if (!match) return null;
	const action = match[1] ?? "";
	const result = match[3] ?? "";
	return {
		raw: trimmed,
		action,
		id: match[2] ?? "",
		result,
		output: (match[4] ?? "").trim(),
		succeeded: action.toLowerCase() === "completed" && result.toLowerCase() === "code 0"
	};
}
function isRelayableExecCompletionEvent(evt) {
	const parsed = parseStructuredExecCompletionEvent(evt);
	if (!parsed) return isExecCompletionEvent(evt);
	if (parsed.output) return true;
	return !parsed.succeeded;
}
function formatExecEventPromptText(pendingEvents) {
	let hasMissingOutputFailure = false;
	return {
		text: pendingEvents.flatMap((event) => {
			const parsed = parseStructuredExecCompletionEvent(event);
			if (!parsed) {
				const trimmed = event.trim();
				return trimmed ? [trimmed] : [];
			}
			if (parsed.output) return [parsed.raw];
			if (parsed.succeeded) return [];
			hasMissingOutputFailure = true;
			return [`Exec ${parsed.action} (${parsed.id}, ${parsed.result}) without captured stdout/stderr.`];
		}).join("\n").trim(),
		hasMissingOutputFailure
	};
}
function buildCronEventPrompt(pendingEvents, opts) {
	const deliverToUser = opts?.deliverToUser ?? true;
	const useHeartbeatResponseTool = opts?.useHeartbeatResponseTool ?? false;
	const eventText = pendingEvents.join("\n").trim();
	if (!eventText) return `A scheduled cron event was triggered, but no event content was found. ${useHeartbeatResponseTool ? HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS : deliverToUser ? `Reply ${SILENT_REPLY_TOKEN}.` : `Handle this internally and reply ${SILENT_REPLY_TOKEN} when nothing needs user-facing follow-up.`}`;
	if (!deliverToUser) return "A scheduled reminder has been triggered. The reminder content is:\n\n" + eventText + "\n\nHandle this reminder internally. Do not relay it to the user unless explicitly requested.";
	return "A scheduled reminder has been triggered. The reminder content is:\n\n" + eventText + "\n\nPlease relay this reminder to the user in a helpful and friendly way.";
}
function buildExecEventPrompt(pendingEvents, opts) {
	const deliverToUser = opts?.deliverToUser ?? true;
	const useHeartbeatResponseTool = opts?.useHeartbeatResponseTool ?? false;
	const { text: rawEventText, hasMissingOutputFailure } = formatExecEventPromptText(pendingEvents);
	const eventText = rawEventText.length > MAX_EXEC_EVENT_PROMPT_CHARS ? `${truncateUtf16Safe(rawEventText, MAX_EXEC_EVENT_PROMPT_CHARS)}\n\n[truncated]` : rawEventText;
	if (!eventText) return `An async command completion event was triggered, but no command output was found. ${useHeartbeatResponseTool ? HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS : `Reply ${SILENT_REPLY_TOKEN} only.`} Do not mention, summarize, or reuse output from any earlier run.`;
	if (!deliverToUser) {
		if (useHeartbeatResponseTool) return `An async command completion event was triggered, but user delivery is disabled for this run. Handle the result internally. ${HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS} Do not mention, summarize, or reuse command output.`;
		return `An async command completion event was triggered, but user delivery is disabled for this run. Handle the result internally and reply ${SILENT_REPLY_TOKEN} only. Do not mention, summarize, or reuse command output.`;
	}
	if (hasMissingOutputFailure) return "An async command you ran earlier completed without captured stdout/stderr. The completion details are:\n\n" + eventText + "\n\nTell the user the command completed without captured output and include the exit status or signal. Do not ask the user to provide missing logs, and do not try to retrieve logs from an exec/session id.";
	return "An async command you ran earlier has completed. The command completion details are:\n\n" + eventText + "\n\nPlease relay the command output to the user in a helpful way. If the command succeeded, share the relevant output. If it failed, explain what went wrong.";
}
const HEARTBEAT_OK_PREFIX = normalizeLowercaseStringOrEmpty(HEARTBEAT_TOKEN);
function isHeartbeatNoiseEvent(evt) {
	const lower = normalizeLowercaseStringOrEmpty(evt);
	if (!lower) return false;
	return isHeartbeatAcknowledgementText(evt, 0) || lower.startsWith(HEARTBEAT_OK_PREFIX) && !/[a-z0-9_]/.test(lower.charAt(HEARTBEAT_OK_PREFIX.length)) || lower.includes("heartbeat poll") || lower.includes("heartbeat wake");
}
function isExecCompletionEvent(evt) {
	const trimmed = evt.trimStart();
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	return /^exec finished(?::|\s*\()/.test(normalized) || STRUCTURED_EXEC_COMPLETION_EVENT_RE.test(trimmed);
}
function isHeartbeatDeliveryAwarenessEvent(event) {
	return event.contextKey?.startsWith("heartbeat-delivery:") ?? false;
}
function isCronSystemEvent(evt) {
	if (!evt.trim()) return false;
	return !isHeartbeatNoiseEvent(evt) && !isExecCompletionEvent(evt);
}
//#endregion
export { isExecCompletionEvent as a, isCronSystemEvent as i, buildCronEventPrompt as n, isHeartbeatDeliveryAwarenessEvent as o, buildExecEventPrompt as r, isRelayableExecCompletionEvent as s, HEARTBEAT_DELIVERY_CONTEXT_KEY_PREFIX as t };
