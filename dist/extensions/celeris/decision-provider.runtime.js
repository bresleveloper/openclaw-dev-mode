import { evaluateOpenAICompatibleDecision } from "openclaw/plugin-sdk/decisions-openai-runtime";
// extensions/celeris/decision-provider.runtime.ts
async function evaluateCelerisDecision(batch, context) {
	context.signal.throwIfAborted();
	if (context.model.provider !== "celeris" || context.model.id !== "celeris-1.1-decision" || context.model.api !== void 0 || batch.state.type !== "text" && batch.state.type !== "json" || Object.values(batch.questions).some((question) => question.type === "score" && question.criteria.length > 64)) return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	return evaluateOpenAICompatibleDecision(batch, context, {
		provider: "celeris",
		baseUrl: context.model.baseUrl ?? "https://inference.celeris.ai/celeris-1-decision/v1"
	});
}
export { evaluateCelerisDecision };
