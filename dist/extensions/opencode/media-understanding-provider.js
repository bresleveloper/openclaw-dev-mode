import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { describeImageWithModelPayloadTransform, describeImagesWithModelPayloadTransform } from "openclaw/plugin-sdk/media-understanding";
//#region extensions/opencode/media-understanding-provider.ts
function stripOpencodeDisabledResponsesReasoningPayload(payload) {
	if (!isRecord(payload)) return;
	const reasoning = payload.reasoning;
	if (reasoning === "none") {
		delete payload.reasoning;
		return;
	}
	if (!isRecord(reasoning) || reasoning.effort !== "none") return;
	delete payload.reasoning;
}
const stripDisabledResponsesReasoning = (payload) => {
	stripOpencodeDisabledResponsesReasoningPayload(payload);
};
const opencodeMediaUnderstandingProvider = {
	id: "opencode",
	capabilities: ["image"],
	defaultModels: { image: "gpt-5-nano" },
	describeImage: (request) => describeImageWithModelPayloadTransform(request, stripDisabledResponsesReasoning),
	describeImages: (request) => describeImagesWithModelPayloadTransform(request, stripDisabledResponsesReasoning)
};
//#endregion
export { opencodeMediaUnderstandingProvider };
