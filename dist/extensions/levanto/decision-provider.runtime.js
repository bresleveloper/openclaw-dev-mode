import { decodeSageDecisionResult, encodeSageDecisionInput, encodeSageDecisionRequest } from "./decision-codec.js";
import { parseSageBatchResponse, parseSageResponse, validateSageImage } from "./sage-validation.js";
import { evaluateDecisionHttp } from "openclaw/plugin-sdk/decisions-http-runtime";
// extensions/levanto/decision-provider.runtime.ts
async function evaluateLevantoDecision(batch, context, probeImage) {
	let encoded;
	try {
		encoded = encodeSageDecisionInput(batch);
	} catch {
		return {
			status: "unavailable",
			reason: "unsupported-input"
		};
	}
	const request = encoded && encodeSageDecisionRequest(encoded.nativeContent, encoded.questions, context.reasoning);
	if (!encoded || !request) return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	const { nativeContent, questions } = encoded;
	if (typeof nativeContent !== "string" && nativeContent.kind === "image") try {
		await validateSageImage(nativeContent.media, probeImage);
	} catch {
		return {
			status: "unavailable",
			reason: "unsupported-input"
		};
	}
	return evaluateDecisionHttp(context, {
		provider: "levanto",
		baseUrl: context.model.baseUrl ?? "https://sage.levanto.ai",
		endpointPath: "requests" in request ? "decide/batch" : "decide",
		body: JSON.stringify(request),
		decode: (payload) => decodeSageDecisionResult(batch, questions, "requests" in request ? parseSageBatchResponse(payload, request) : parseSageResponse(payload, request.question, request.content), context.model.id, context.model.inference?.decision)
	});
}
export { evaluateLevantoDecision };
