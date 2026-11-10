import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import "./security-runtime-6domDoE8.mjs";
//#region extensions/browser/src/browser/pw-ai-module.ts
/**
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
		const { pwAi } = await import("./pw-ai-C90oGMqs.mjs");
		loadedPwAiModule = pwAi;
		return pwAi;
	} catch (err) {
		if (mode === "soft" || isModuleNotFoundError(err)) {
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
async function getPwAiModule(opts) {
	if ((opts?.mode ?? "soft") === "soft") return await (pwAiModuleSoft ??= loadPwAiModule("soft"));
	return await (pwAiModuleStrict ??= loadPwAiModule("strict"));
}
//#endregion
export { getPwAiModule as n, getLoadedPwAiModule as t };
