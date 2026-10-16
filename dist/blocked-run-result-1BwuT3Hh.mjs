//#region src/agents/embedded-agent-runner/run/blocked-run-result.ts
function buildEmbeddedRunBlockedResult(input) {
	return {
		payloads: [{
			text: input.text,
			isError: true
		}],
		meta: {
			durationMs: input.durationMs,
			agentMeta: input.agentMeta,
			systemPromptReport: input.attempt?.systemPromptReport,
			finalAssistantVisibleText: input.text,
			finalAssistantRawText: input.text,
			finalPromptText: input.finalPromptText,
			replayInvalid: input.replayInvalid,
			livenessState: "blocked",
			error: {
				kind: input.errorKind,
				message: input.errorMessage
			}
		}
	};
}
//#endregion
export { buildEmbeddedRunBlockedResult as t };
