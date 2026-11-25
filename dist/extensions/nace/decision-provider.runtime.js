import { evaluateOpenAICompatibleDecision } from "openclaw/plugin-sdk/decisions-openai-runtime";
// extensions/nace/decision-provider.runtime.ts
async function evaluateNaceDecision(batch, context) {
	context.signal.throwIfAborted();
	if (context.model.provider !== "nace" || context.model.id !== "drex-max-v1.1" || context.model.api !== void 0 || batch.state.type !== "text" && batch.state.type !== "json" || Object.values(batch.questions).some((question) => question.type === "score" && question.criteria.length > 255)) return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	return evaluateOpenAICompatibleDecision(batch, context, {
		provider: "nace",
		baseUrl: context.model.baseUrl ?? "https://console.nace.ai/v1"
	});
}
export { evaluateNaceDecision };
