import { decodeSystemOneResponse, encodeSystemOneQuestions, validateDecisionBatchV2, validateDecisionResultV2 } from "openclaw/plugin-sdk/decisions";
// extensions/liquid-ai/decision-codec.ts
const MAX_REQUEST_BYTES = 45e5;
function supportsLiquidDecisionBatch(batch) {
	if (!validateDecisionBatchV2(batch) || batch.state.type === "list") return false;
	if (batch.state.type === "json" && (batch.state.value === null || typeof batch.state.value !== "string" && typeof batch.state.value !== "object")) return false;
	return Object.values(batch.questions).every((question) => {
		if (question.type === "boolean") return question.instructions != null || Object.values(question.criteria ?? {}).some((value) => value != null);
		return question.type === "choice" || question.type === "score";
	});
}
function encodeLiquidDecisionRequest(batch, modelId) {
	const body = JSON.stringify({
		model: modelId,
		state: batch.state.type === "text" ? batch.state.text : batch.state.type === "json" ? batch.state.value : batch.state.type === "image" ? batch.state.text ?? "" : void 0,
		...batch.state.type === "image" ? { images: [batch.state.dataUri] } : {},
		questions: encodeSystemOneQuestions(batch)
	});
	return Buffer.byteLength(body) >= MAX_REQUEST_BYTES ? void 0 : body;
}
function supportsLiquidImageDimensions(metadata) {
	return !(!metadata || metadata.width <= 0 || metadata.height <= 0 || Math.max(metadata.width, metadata.height) > 100 * Math.min(metadata.width, metadata.height) || Math.ceil(metadata.width / 32) * Math.ceil(metadata.height / 32) > 1e4);
}
function decodeLiquidDecisionResult(batch, value, capabilities) {
	const result = decodeSystemOneResponse(batch, value);
	return validateDecisionResultV2(batch, result, capabilities) && result.usage?.outputTokens === 0 ? {
		status: "ok",
		result
	} : {
		status: "unavailable",
		reason: "invalid-response"
	};
}
export { decodeLiquidDecisionResult, encodeLiquidDecisionRequest, supportsLiquidDecisionBatch, supportsLiquidImageDimensions };
