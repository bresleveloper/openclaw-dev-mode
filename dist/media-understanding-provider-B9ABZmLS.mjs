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
	describeImage: void 0,
	describeImages: void 0
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
	describeImage: void 0,
	describeImages: void 0
};
//#endregion
export { minimaxPortalMediaUnderstandingProvider as n, minimaxMediaUnderstandingProvider as t };
