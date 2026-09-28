import { i as isSilentReplyPayloadText } from "./tokens-BTKQYTUd.mjs";
import { _ as isReplyPayloadTerminalContent } from "./reply-payload-B2ZQhznY.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
//#region src/agents/agent-run-result.ts
/** Agent-run result projections shared by execution owners and diagnostic probes. */
/** Adds an owner-bounded, redacted diagnostic without discarding returned work. */
function appendAgentRunFailure(result, diagnostic) {
	const primaryError = result.meta.error;
	return {
		...result,
		payloads: [...result.payloads ?? [], {
			text: diagnostic,
			isError: true
		}],
		meta: {
			...result.meta,
			replayInvalid: true,
			error: {
				...primaryError,
				kind: primaryError?.kind ?? "incomplete_turn",
				message: primaryError ? `${primaryError.message}\n${diagnostic}` : diagnostic,
				fallbackSafe: false
			}
		}
	};
}
function extractAgentRunText(result) {
	const visibleText = result.meta?.finalAssistantVisibleText?.trim();
	if (visibleText) return isSilentReplyPayloadText(visibleText) ? void 0 : visibleText;
	return result.payloads?.filter((payload) => payload.visible !== false && payload.isError !== true && isReplyPayloadTerminalContent(payload)).map((payload) => payload.text?.trim()).filter((text) => Boolean(text) && !isSilentReplyPayloadText(text)).join("\n") || void 0;
}
function extractAgentRunTerminalError(result) {
	const errorPayload = result.payloads?.find((payload) => payload.isError === true)?.text?.trim();
	const error = result.meta?.error?.message?.trim() || errorPayload;
	const outcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: errorPayload || result.meta?.error ? "error" : "end",
		data: {
			...result.meta,
			error
		}
	});
	if (outcome.status === "ok") return;
	return error || outcome.error || (outcome.status === "timeout" ? "Inference timed out." : `Inference ${outcome.reason}.`);
}
function agentRunHasVisibleReply(result) {
	return Boolean(extractAgentRunText(result));
}
//#endregion
export { extractAgentRunText as i, appendAgentRunFailure as n, extractAgentRunTerminalError as r, agentRunHasVisibleReply as t };
