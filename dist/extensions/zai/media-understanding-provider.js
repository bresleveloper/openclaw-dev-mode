//#region extensions/zai/media-understanding-provider.ts
const zaiMediaUnderstandingProvider = {
	id: "zai",
	capabilities: ["image"],
	defaultModels: { image: "glm-4.6v" },
	autoPriority: { image: 60 },
	describeImage: void 0,
	describeImages: void 0
};
//#endregion
export { zaiMediaUnderstandingProvider };
