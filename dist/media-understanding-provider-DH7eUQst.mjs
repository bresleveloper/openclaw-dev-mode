//#region extensions/anthropic/media-understanding-provider.ts
const anthropicMediaUnderstandingProvider = {
	id: "anthropic",
	capabilities: ["image"],
	defaultModels: { image: "claude-opus-5-5" },
	autoPriority: { image: 20 },
	nativeDocumentInputs: ["pdf"],
	describeImage: void 0,
	describeImages: void 0
};
//#endregion
export { anthropicMediaUnderstandingProvider as t };
