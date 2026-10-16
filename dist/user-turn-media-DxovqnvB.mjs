import { d as readPersistedMediaFacts, s as isMeaningfulMediaFact } from "./media-facts-CJdQ4R61.mjs";
//#region src/sessions/user-turn-media.ts
const MEDIA_ONLY_USER_TEXT = "[User sent media without caption]";
function hasPersistedMedia(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return false;
	return (readPersistedMediaFacts(message) ?? []).some(isMeaningfulMediaFact);
}
//#endregion
export { hasPersistedMedia as n, MEDIA_ONLY_USER_TEXT as t };
