//#region extensions/browser/src/browser/pw-ai-state.ts
/**
* Playwright AI load-state marker.
*
* Tracks whether the Playwright-backed browser helper barrel has been imported
* so diagnostics can distinguish unloaded from unavailable modules.
*/
let pwAiLoaded = false;
/** Mark the Playwright AI helper module as loaded. */
function markPwAiLoaded() {
	pwAiLoaded = true;
}
/** Return true once the Playwright AI helper module has been imported. */
function isPwAiLoaded() {
	return pwAiLoaded;
}
//#endregion
export { markPwAiLoaded as n, isPwAiLoaded as t };
