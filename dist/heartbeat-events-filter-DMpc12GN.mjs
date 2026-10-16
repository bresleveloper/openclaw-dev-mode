import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as HEARTBEAT_TOKEN, r as SILENT_REPLY_TOKEN } from "./tokens-D4ghQG_g.mjs";
import { o as isHeartbeatAcknowledgementText, r as HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS } from "./heartbeat-BjLIgeQc.mjs";
import "./user-facing-text-DC1sCo4O.mjs";
//#region src/infra/heartbeat-events-filter.ts
const MAX_EXEC_EVENT_PROMPT_CHARS = 8e3;
const HEARTBEAT_DELIVERY_CONTEXT_KEY_PREFIX = "heartbeat-delivery:";
const STRUCTURED_EXEC_COMPLETION_EVENT_RE = /^exec (completed|failed) \(([a-z0-9_-]{1,64}), (code -?\d+|signal [^)]+)\)(?: :: ([\s\S]*)|\n\n([\s\S]+))?$/i;
function parseStructuredExecCompletionEvent(evt) {
	const trimmed = evt.trim();
	const match = STRUCTURED_EXEC_COMPLETION_EVENT_RE.exec(trimmed);
	if (!match || match[5] !== void 0 && match[5] !== "The command was terminated, but external side effects may already have completed. Verify the resulting state before retrying. Do not automatically rerun non-idempotent commands. Use a higher timeout only when the command is known to be safe to retry.") return null;
	const action = match[1] ?? "";
	const result = match[3] ?? "";
	return {
		raw: trimmed,
		action,
		id: match[2] ?? "",
		result,
		output: (match[4] ?? "").trim(),
		notes: (match[5] ?? "").trim(),
		succeeded: action.toLowerCase() === "completed" && result.toLowerCase() === "code 0"
	};
}
function isRelayableExecCompletionEvent(evt) {
	const parsed = parseStructuredExecCompletionEvent(evt);
	if (!parsed) return isExecCompletionEvent(evt);
	return Boolean(parsed.output) || !parsed.succeeded;
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
			const missingOutput = `Exec ${parsed.action} (${parsed.id}, ${parsed.result}) without captured stdout/stderr.`;
			return [parsed.notes ? `${missingOutput}\n\n${parsed.notes}` : missingOutput];
		}).join("\n").trim(),
		hasMissingOutputFailure
	};
}
function buildCronEventPrompt(pendingEvents, opts) {
	const deliverToUser = opts?.deliverToUser ?? true;
	const useHeartbeatResponseTool = opts?.useHeartbeatResponseTool ?? false;
	const eventText = pendingEvents.join("\n").trim();
	if (!eventText) return `A scheduled cron event was triggered, but no event content was found. ${useHeartbeatResponseTool ? HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS : deliverToUser ? `Reply ${SILENT_REPLY_TOKEN}.` : `Handle this internally and reply ${SILENT_REPLY_TOKEN} when nothing needs user-facing follow-up.`}`;
	const instruction = deliverToUser ? "Please relay this reminder to the user in a helpful and friendly way." : "Handle this reminder internally. Do not relay it to the user unless explicitly requested.";
	return "A scheduled reminder has been triggered. The reminder content is:\n\n" + eventText + "\n\n" + instruction;
}
function buildExecEventPrompt(pendingEvents, opts) {
	const deliverToUser = opts?.deliverToUser ?? true;
	const useHeartbeatResponseTool = opts?.useHeartbeatResponseTool ?? false;
	const { text: rawEventText, hasMissingOutputFailure } = formatExecEventPromptText(pendingEvents);
	const eventText = rawEventText.length > MAX_EXEC_EVENT_PROMPT_CHARS ? `${truncateUtf16Safe(rawEventText, MAX_EXEC_EVENT_PROMPT_CHARS)}\n\n[truncated]` : rawEventText;
	if (!eventText) return `An async command completion event was triggered, but no command output was found. ${useHeartbeatResponseTool ? HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS : `Reply ${SILENT_REPLY_TOKEN} only.`} Do not mention, summarize, or reuse output from any earlier run.`;
	if (!deliverToUser) return `An async command completion event was triggered, but user delivery is disabled for this run. ${useHeartbeatResponseTool ? `Handle the result internally. ${HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS}` : `Handle the result internally and reply ${SILENT_REPLY_TOKEN} only.`} Do not mention, summarize, or reuse command output.`;
	const completionInstruction = useHeartbeatResponseTool ? HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS : `If no user-facing update is needed, reply ${SILENT_REPLY_TOKEN} only.`;
	const missingOutputInstruction = hasMissingOutputFailure ? " If reporting a failure without captured output, include the exit status or signal. Do not ask the user to provide missing logs, and do not try to retrieve logs from an exec/session id." : "";
	return "An async command you ran earlier has completed. The command completion details are:\n\n" + eventText + "\n\nTreat this completion as an internal continuation, not a new user request. Reconcile it with the conversation and continue any outstanding authorized work. Notify the user only if this provides a requested result not yet delivered, a meaningful change to the outcome, or a new unresolved failure, blocker, or decision they need to know about. Stay silent for routine output, duplicate or superseded results, and failures already recovered from; do not recap them or announce that nothing changed. " + completionInstruction + missingOutputInstruction;
}
const HEARTBEAT_OK_PREFIX = normalizeLowercaseStringOrEmpty(HEARTBEAT_TOKEN);
function isHeartbeatNoiseEvent(evt) {
	const lower = normalizeLowercaseStringOrEmpty(evt);
	if (!lower) return false;
	return isHeartbeatAcknowledgementText(evt, 0) || lower.startsWith(HEARTBEAT_OK_PREFIX) && !/[a-z0-9_]/.test(lower.charAt(HEARTBEAT_OK_PREFIX.length)) || lower.includes("heartbeat poll") || lower.includes("heartbeat wake");
}
/** Context-key prefix the restart sentinel gives a continuation queued for one session. */
const RESTART_CONTINUATION_CONTEXT_PREFIX = "task:restart-sentinel:";
/** A restart continuation event resumes a specific session's interrupted turn. */
function isRestartContinuationEvent(event) {
	return event.contextKey?.startsWith("task:restart-sentinel:") ?? false;
}
function isExecCompletionEvent(evt) {
	const trimmed = evt.trimStart();
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	return /^exec finished(?::|\s*\()/.test(normalized) || parseStructuredExecCompletionEvent(trimmed) !== null;
}
function isHeartbeatDeliveryAwarenessEvent(event) {
	return event.contextKey?.startsWith("heartbeat-delivery:") ?? false;
}
function isCronSystemEvent(evt) {
	if (!evt.trim()) return false;
	return !isHeartbeatNoiseEvent(evt) && !isExecCompletionEvent(evt);
}
//#endregion
export { isCronSystemEvent as a, isRelayableExecCompletionEvent as c, buildExecEventPrompt as i, isRestartContinuationEvent as l, RESTART_CONTINUATION_CONTEXT_PREFIX as n, isExecCompletionEvent as o, buildCronEventPrompt as r, isHeartbeatDeliveryAwarenessEvent as s, HEARTBEAT_DELIVERY_CONTEXT_KEY_PREFIX as t };
