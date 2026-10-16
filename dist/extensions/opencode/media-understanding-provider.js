import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { describeImageWithModelPayloadTransform, describeImagesWithModelPayloadTransform } from "openclaw/plugin-sdk/media-understanding";
//#region extensions/opencode/media-understanding-provider.ts
const stripDisabledResponsesReasoning = (payload) => {
	if (!isRecord(payload)) return;
	const reasoning = payload.reasoning;
	if (reasoning === "none" || isRecord(reasoning) && reasoning.effort === "none") delete payload.reasoning;
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
