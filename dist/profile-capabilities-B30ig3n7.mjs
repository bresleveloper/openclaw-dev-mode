//#region extensions/browser/src/browser/profile-capabilities.ts
/** Return feature capabilities for a resolved browser profile. */
function getBrowserProfileCapabilities(profile) {
	const driverCapabilities = {
		supportsBatchActions: profile.driver !== "existing-session",
		supportsDownloads: profile.driver !== "existing-session",
		supportsPdf: profile.driver !== "existing-session",
		supportsRequests: profile.driver !== "existing-session",
		supportsErrors: profile.driver !== "existing-session",
		supportsPageText: profile.driver !== "existing-session",
		supportsEmulation: profile.driver !== "existing-session",
		requiresCompleteTargetEnumeration: profile.driver === "extension"
	};
	if (profile.driver === "existing-session") return {
		...driverCapabilities,
		mode: "local-existing-session",
		isRemote: false,
		browserFilesystemLocal: false,
		usesChromeMcp: true,
		usesPersistentPlaywright: false,
		supportsPerTabWs: false,
		supportsJsonTabEndpoints: false,
		supportsReset: false,
		supportsManagedTabLimit: false
	};
	if (profile.driver === "extension") return {
		...driverCapabilities,
		mode: "local-extension",
		isRemote: false,
		browserFilesystemLocal: true,
		usesChromeMcp: false,
		usesPersistentPlaywright: true,
		supportsPerTabWs: false,
		supportsJsonTabEndpoints: false,
		supportsReset: false,
		supportsManagedTabLimit: false
	};
	if (!profile.cdpIsLoopback) return {
		...driverCapabilities,
		mode: "remote-cdp",
		isRemote: true,
		browserFilesystemLocal: false,
		usesChromeMcp: false,
		usesPersistentPlaywright: true,
		supportsPerTabWs: false,
		supportsJsonTabEndpoints: false,
		supportsReset: false,
		supportsManagedTabLimit: false
	};
	return {
		...driverCapabilities,
		mode: "local-managed",
		isRemote: false,
		browserFilesystemLocal: !profile.attachOnly,
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
export { shouldUsePlaywrightForScreenshot as i, resolveDefaultSnapshotFormat as n, shouldUsePlaywrightForAriaSnapshot as r, getBrowserProfileCapabilities as t };
