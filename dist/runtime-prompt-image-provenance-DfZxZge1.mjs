//#region src/media/runtime-prompt-image-provenance.ts
const RUNTIME_PROMPT_IMAGE_FACT_INDEXES = Symbol.for("openclaw.runtimePromptImageFactIndexes");
function finalizeRuntimePromptImages(entries) {
	const images = entries.map((entry) => entry.image);
	const imageFactIndexes = entries.map((entry) => entry.factIndex);
	Object.defineProperty(images, RUNTIME_PROMPT_IMAGE_FACT_INDEXES, {
		configurable: true,
		value: [...imageFactIndexes]
	});
	return {
		images,
		imageFactIndexes
	};
}
function readRuntimePromptImageFactIndexes(images) {
	if (!images?.length) return;
	const factIndexes = images[RUNTIME_PROMPT_IMAGE_FACT_INDEXES];
	return Array.isArray(factIndexes) && factIndexes.length === images.length && factIndexes.every((entry) => entry === null || typeof entry === "number" && Number.isSafeInteger(entry) && entry >= 0) ? factIndexes : void 0;
}
//#endregion
export { readRuntimePromptImageFactIndexes as n, finalizeRuntimePromptImages as t };
