import { c as getReplyPayloadMetadata, y as isReplyPayloadTerminalContent } from "./reply-payload-BLX_BF2U.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-DHFPcfdZ.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
//#region src/agents/agent-run-result.ts
/** Agent-run result projections shared by execution owners and diagnostic probes. */
/** Only the transcript owner's receipt makes a final CLI reply durable. */
function hasCommittedCliFinalReply(result) {
	return result.meta.executionTrace?.runner === "cli" && result.meta.completion?.finishReason === "stop" && !result.meta.error && result.payloads?.some((payload) => {
		const metadata = getReplyPayloadMetadata(payload);
		return metadata?.assistantTranscriptOwned === true && Boolean(metadata.assistantTranscriptIdempotencyKey);
	}) === true;
}
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
//#endregion
export { hasCommittedCliFinalReply as i, extractAgentRunTerminalError as n, extractAgentRunText as r, appendAgentRunFailure as t };
