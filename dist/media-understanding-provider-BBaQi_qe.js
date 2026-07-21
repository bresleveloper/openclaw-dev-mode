import { r as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-D7nHkmgM.js";
import "./media-understanding-B717fhuK.js";
//#region extensions/minimax/media-understanding-provider.ts
const minimaxMediaUnderstandingProvider = {
	id: "minimax",
	capabilities: ["image"],
	defaultModels: { image: "MiniMax-VL-01" },
	documentModels: { pdf: {
		textExtraction: "MiniMax-M2.7",
		image: false
	} },
	autoPriority: { image: 40 },
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
const minimaxPortalMediaUnderstandingProvider = {
	id: "minimax-portal",
	capabilities: ["image"],
	defaultModels: { image: "MiniMax-VL-01" },
	documentModels: { pdf: {
		textExtraction: "MiniMax-M2.7",
		image: false
	} },
	autoPriority: { image: 50 },
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { minimaxPortalMediaUnderstandingProvider as n, minimaxMediaUnderstandingProvider as t };
