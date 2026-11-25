import { decodeSystemOneResponse, encodeSystemOneQuestions, validateDecisionBatchV2, validateDecisionResultV2 } from "openclaw/plugin-sdk/decisions";
import { evaluateDecisionHttp } from "openclaw/plugin-sdk/decisions-http-runtime";
// extensions/perplexity/decision-provider.runtime.ts
async function evaluatePerplexityDecision(batch, context) {
	context.signal.throwIfAborted();
	if (context.model.provider !== "perplexity-decisions" || context.model.id !== "pplx-decider-v1.2" || context.model.api !== void 0 || !validateDecisionBatchV2(batch) || batch.state.type !== "text" && batch.state.type !== "json" || context.reasoning !== void 0 && context.reasoning !== "auto" || Object.keys(batch.questions).length > 128 || Object.values(batch.questions).some((q) => q.type !== "boolean" && q.type !== "choice" && q.type !== "score" || q.type === "choice" && Object.keys(q.criteria).length > 255 || q.type === "score" && q.criteria.length > 10)) return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	return evaluateDecisionHttp(context, {
		provider: "perplexity-decisions",
		baseUrl: context.model.baseUrl ?? "https://api.perplexity.ai/v1",
		endpointPath: "decisions",
		body: JSON.stringify({
			model: context.model.id,
			state: batch.state.type === "text" ? batch.state.text : JSON.stringify(batch.state.value),
			questions: encodeSystemOneQuestions(batch)
		}),
		decode: (payload) => {
			const result = decodeSystemOneResponse(batch, payload);
			return validateDecisionResultV2(batch, result) ? {
				status: "ok",
				result
			} : {
				status: "unavailable",
				reason: "invalid-response"
			};
		}
	});
}
export { evaluatePerplexityDecision };
