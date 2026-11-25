import { n as BASETEN_DECISION_MODEL_IDS, t as BASETEN_BASE_URL } from "./.setup/models-B0xCZcxx.mjs";
import { decodeBasetenDecisionResult, encodeBasetenDecisionRequest } from "./decision-codec.js";
import { evaluateDecisionHttp } from "openclaw/plugin-sdk/decisions-http-runtime";
// extensions/baseten/decision-provider.runtime.ts
async function evaluateBasetenDecision(batch, context) {
	context.signal.throwIfAborted();
	if (context.model.provider !== "baseten" || !BASETEN_DECISION_MODEL_IDS.has(context.model.id) || !["text", "json"].includes(batch.state.type) || Object.values(batch.questions).some((q) => ![
		"boolean",
		"choice",
		"score"
	].includes(q.type)) || context.reasoning !== void 0 && context.reasoning !== "auto") return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	return evaluateDecisionHttp(context, {
		provider: "baseten",
		baseUrl: context.model.baseUrl ?? BASETEN_BASE_URL,
		endpointPath: "systemone",
		body: encodeBasetenDecisionRequest(batch, context.model.id),
		decode: (payload) => decodeBasetenDecisionResult(batch, payload)
	});
}
export { evaluateBasetenDecision };
