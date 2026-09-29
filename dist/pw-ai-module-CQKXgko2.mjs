import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./errors-DS4y5mrd.mjs";
//#region extensions/browser/src/browser/pw-ai-module.ts
/**
* Optional Playwright AI module loader.
*
* Lazily imports the Playwright-backed browser helpers while allowing routes to
* soft-fail when the dependency is unavailable in a gateway build.
*/
let pwAiModuleSoft = null;
let pwAiModuleStrict = null;
let loadedPwAiModule;
function isModuleNotFoundError(err) {
	if (extractErrorCode(err) === "ERR_MODULE_NOT_FOUND") return true;
	const msg = formatErrorMessage(err);
	return msg.includes("Cannot find module") || msg.includes("Cannot find package") || msg.includes("Failed to resolve import") || msg.includes("Failed to resolve entry for package") || msg.includes("Failed to load url");
}
async function loadPwAiModule(mode) {
	try {
		const { pwAi } = await import("./pw-ai-C7dr340g.mjs");
		loadedPwAiModule = pwAi;
		return pwAi;
	} catch (err) {
		if (mode === "soft") {
			loadedPwAiModule = null;
			return null;
		}
		if (isModuleNotFoundError(err)) {
			loadedPwAiModule = null;
			return null;
		}
		throw err;
	}
}
/** Return the already-resolved module without yielding during lifecycle invalidation. */
function getLoadedPwAiModule() {
	return loadedPwAiModule;
}
/** Load the Playwright AI helper module in soft or strict mode. */
async function getPwAiModule(opts) {
	if ((opts?.mode ?? "soft") === "soft") {
		if (!pwAiModuleSoft) pwAiModuleSoft = loadPwAiModule("soft");
		return await pwAiModuleSoft;
	}
	if (!pwAiModuleStrict) pwAiModuleStrict = loadPwAiModule("strict");
	return await pwAiModuleStrict;
}
//#endregion
export { getPwAiModule as n, getLoadedPwAiModule as t };
