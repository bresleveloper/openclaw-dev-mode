import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-BEHTU0wM.mjs";
import { n as readPersistedMediaImageLayout } from "./prompt-image-metadata-DjWY92MN.mjs";
//#region src/media/prompt-image-input.ts
/** Stored images require vision; facts already replaced by text descriptions do not. */
function hasPromptImageInput(input) {
	const message = input?.userTurnTranscriptRecorder?.message;
	const suppressed = message ? readPersistedMediaImageLayout(message)?.suppressedFactIndexes : void 0;
	const needsImageBytes = (fact) => isImageMediaFact(fact) && fact.hydrationSuppressed !== true;
	return Boolean(input?.images?.length || input?.imageOrder?.length || input?.media?.some(needsImageBytes) || message && readPersistedMediaFacts(message)?.some((fact, index) => needsImageBytes(fact) && !suppressed?.includes(index)));
}
//#endregion
export { hasPromptImageInput as t };
