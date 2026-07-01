import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage, r as extractErrorCode } from "./errors-DCRXIYSQ.js";
import "./string-coerce-runtime-BiZzULo_.js";
import "./errors-B25hu1RS.js";
//#region extensions/browser/src/browser/profile-capabilities.ts
/** Return feature capabilities for a resolved browser profile. */
function getBrowserProfileCapabilities(profile) {
	if (profile.driver === "existing-session") return {
		mode: "local-existing-session",
		isRemote: false,
		usesChromeMcp: true,
		usesPersistentPlaywright: false,
		supportsPerTabWs: false,
		supportsJsonTabEndpoints: false,
		supportsReset: false,
		supportsManagedTabLimit: false
	};
	if (!profile.cdpIsLoopback) return {
		mode: "remote-cdp",
		isRemote: true,
		usesChromeMcp: false,
		usesPersistentPlaywright: true,
		supportsPerTabWs: false,
		supportsJsonTabEndpoints: false,
		supportsReset: false,
		supportsManagedTabLimit: false
	};
	return {
		mode: "local-managed",
		isRemote: false,
		usesChromeMcp: false,
		usesPersistentPlaywright: false,
		supportsPerTabWs: true,
		supportsJsonTabEndpoints: true,
		supportsReset: true,
		supportsManagedTabLimit: true
	};
}
/** Resolve the default snapshot format for a profile and available drivers. */
function resolveDefaultSnapshotFormat(params) {
	if (params.explicitFormat) return params.explicitFormat;
	if (params.mode === "efficient") return "ai";
	if (getBrowserProfileCapabilities(params.profile).mode === "local-existing-session") return "ai";
	return params.hasPlaywright ? "ai" : "aria";
}
/** Return true when screenshots should use Playwright for the profile. */
function shouldUsePlaywrightForScreenshot(params) {
	return !params.wsUrl || Boolean(params.ref) || Boolean(params.element);
}
/** Return true when ARIA snapshots should use Playwright for the profile. */
function shouldUsePlaywrightForAriaSnapshot(params) {
	return !params.wsUrl;
}
//#endregion
//#region extensions/browser/src/browser/pw-ai-module.ts
/**
* Optional Playwright AI module loader.
*
* Lazily imports the Playwright-backed browser helpers while allowing routes to
* soft-fail when the dependency is unavailable in a gateway build.
*/
let pwAiModuleSoft = null;
let pwAiModuleStrict = null;
function isModuleNotFoundError(err) {
	if (extractErrorCode(err) === "ERR_MODULE_NOT_FOUND") return true;
	const msg = formatErrorMessage(err);
	return msg.includes("Cannot find module") || msg.includes("Cannot find package") || msg.includes("Failed to resolve import") || msg.includes("Failed to resolve entry for package") || msg.includes("Failed to load url");
}
async function loadPwAiModule(mode) {
	try {
		return await import("./pw-ai-D44CNocP.js");
	} catch (err) {
		if (mode === "soft") return null;
		if (isModuleNotFoundError(err)) return null;
		throw err;
	}
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
//#region extensions/browser/src/browser/target-id.ts
/**
* Target id resolution helpers for Browser tab aliases and user-facing ids.
*/
/** Resolves exact tab ids/labels first, then unique target-id prefixes. */
function resolveTargetIdFromTabs(input, tabs) {
	const needle = input.trim();
	if (!needle) return {
		ok: false,
		reason: "not_found"
	};
	const exact = tabs.find((t) => t.targetId === needle || t.suggestedTargetId === needle || t.tabId === needle || t.label === needle);
	if (exact) return {
		ok: true,
		targetId: exact.targetId
	};
	const lower = normalizeLowercaseStringOrEmpty(needle);
	const matches = tabs.map((t) => t.targetId).filter((id) => normalizeLowercaseStringOrEmpty(id).startsWith(lower));
	const only = matches.length === 1 ? matches[0] : void 0;
	if (only) return {
		ok: true,
		targetId: only
	};
	if (matches.length === 0) return {
		ok: false,
		reason: "not_found"
	};
	return {
		ok: false,
		reason: "ambiguous",
		matches
	};
}
//#endregion
export { shouldUsePlaywrightForAriaSnapshot as a, resolveDefaultSnapshotFormat as i, getPwAiModule as n, shouldUsePlaywrightForScreenshot as o, getBrowserProfileCapabilities as r, resolveTargetIdFromTabs as t };
