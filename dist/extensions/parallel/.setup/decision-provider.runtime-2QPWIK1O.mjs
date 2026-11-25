import { resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
import { evaluateDecisionHttp } from "openclaw/plugin-sdk/decisions-http-runtime";
import { decodeSystemOneResponse, validateDecisionResultV2 } from "openclaw/plugin-sdk/decisions";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/parallel/src/decision-codec.ts
const text = (value) => value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
function encodeParallelDecisionRequest(batch) {
	const entries = Object.entries(batch.questions);
	if (batch.state.type !== "text" && batch.state.type !== "json" || entries.length < 1 || entries.length > 100 || entries.some(([id]) => !/^[A-Za-z0-9_-]+$/.test(id))) return;
	const questions = [];
	for (const [id, question] of entries) {
		if (![
			"boolean",
			"choice",
			"score"
		].includes(question.type)) return;
		if (question.type === "choice") {
			const options = Object.entries(question.criteria);
			if (options.length < 2 || options.length > 255) return;
			questions.push([id, {
				type: "choice",
				instructions: text(question.instructions),
				criteria: Object.fromEntries(options.map(([key, value]) => [key, text(value)]))
			}]);
		} else if (question.type === "score") {
			if (question.criteria.length < 2 || question.criteria.length > 10) return;
			questions.push([id, {
				type: "score",
				instructions: text(question.instructions),
				criteria: question.criteria.map(text)
			}]);
		} else if (question.type === "boolean") questions.push([id, {
			type: "noul",
			instructions: text(question.instructions),
			...question.criteria ? { criteria: {
				true: text(question.criteria.true),
				false: text(question.criteria.false)
			} } : {}
		}]);
	}
	return JSON.stringify({
		mode: "fast",
		state: batch.state.type === "text" ? batch.state.text : batch.state.value,
		questions: Object.fromEntries(questions)
	});
}
function decodeParallelDecisionResult(batch, responseValue, capabilities) {
	const invalid = {
		status: "unavailable",
		reason: "invalid-response"
	};
	const root = asOptionalRecord(responseValue);
	if (!root || root.mode !== "fast" || typeof root.decision_id !== "string" || !Array.isArray(root.citations)) return invalid;
	if (!root.citations.every((value) => {
		const citation = asOptionalRecord(value);
		return citation && typeof citation.url === "string" && (citation.title === void 0 || typeof citation.title === "string") && Array.isArray(citation.excerpts) && citation.excerpts.every((excerpt) => typeof excerpt === "string");
	})) return invalid;
	const decoded = asOptionalRecord(decodeSystemOneResponse(batch, {
		...root,
		model: "parallel/decisions-fast"
	}, { confidence: "optional" }));
	if (!decoded) return invalid;
	const result = {
		...decoded,
		usage: {
			...asOptionalRecord(decoded.usage),
			units: {
				unit: "requests",
				amount: 1
			}
		},
		metadata: {
			...asOptionalRecord(decoded.metadata),
			decisionId: root.decision_id,
			citations: root.citations
		}
	};
	return validateDecisionResultV2(batch, result, capabilities) ? {
		status: "ok",
		result
	} : invalid;
}
// extensions/parallel/src/decision-provider.runtime.ts
async function evaluateParallelDecision(batch, context) {
	context.signal.throwIfAborted();
	const providerConfig = context.config.models?.providers?.parallel;
	const agent = context.agentId ? resolveAgentConfig(context.config, context.agentId) : void 0;
	const modelRef = "parallel/" + context.model.id;
	const hasParams = [
		providerConfig?.params,
		context.model.params,
		context.config.agents?.defaults?.params,
		context.config.agents?.defaults?.models?.[modelRef]?.params,
		agent?.models?.[modelRef]?.params,
		agent?.params
	].some((params) => Object.values(params ?? {}).some((value) => value !== void 0));
	const body = encodeParallelDecisionRequest(batch);
	if (context.model.id !== "decisions-fast" || context.reasoning !== void 0 && context.reasoning !== "auto" || hasParams || !body) return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	return evaluateDecisionHttp(context, {
		provider: "parallel",
		baseUrl: context.model.baseUrl ?? providerConfig?.baseUrl ?? "https://api.parallel.ai/v1",
		endpointPath: "decisions",
		body,
		authHeaders: (apiKey) => ({ "x-api-key": apiKey }),
		decode: (payload) => decodeParallelDecisionResult(batch, payload, context.model.inference?.decision)
	});
}
export { evaluateParallelDecision };
