import { STREAM_ERROR_FALLBACK_TEXT } from "@openclaw/ai/internal/shared";
//#region src/agents/stream-message-shared.ts
/**
* Assistant stream message builders.
*
* Centralizes zero-cost usage records and assistant message construction for simple stream transports.
*/
function buildUsageWithNoCost(params) {
	const input = params.input ?? 0;
	const output = params.output ?? 0;
	const cacheRead = params.cacheRead ?? 0;
	const cacheWrite = params.cacheWrite ?? 0;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		totalTokens: params.totalTokens ?? input + output + cacheRead + cacheWrite,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
}
function buildAssistantMessage(params) {
	return {
		role: "assistant",
		content: params.content,
		stopReason: params.stopReason,
		api: params.model.api,
		provider: params.model.provider,
		model: params.model.id,
		usage: params.usage,
		timestamp: params.timestamp ?? Date.now()
	};
}
function buildStreamErrorAssistantMessage(params) {
	return {
		...buildAssistantMessage({
			model: params.model,
			content: [{
				type: "text",
				text: STREAM_ERROR_FALLBACK_TEXT
			}],
			stopReason: "error",
			usage: buildUsageWithNoCost({}),
			timestamp: params.timestamp
		}),
		stopReason: "error",
		errorMessage: params.errorMessage
	};
}
//#endregion
export { buildStreamErrorAssistantMessage as n, buildUsageWithNoCost as r, buildAssistantMessage as t };
