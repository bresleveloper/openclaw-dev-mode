import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import { i as resolveProfile, n as resolveBrowserConfig } from "./config-C25IwRz4.js";
import "./config-C80tapLO.js";
import { t as ensureBrowserControlAuth } from "./control-auth-w_MLk8mu.js";
import { i as loadBrowserConfigForRuntimeRefresh, r as getExtensionRelayModule } from "./server-context-Cghc1sGT.js";
import "./subsystem-DN018rQU.js";
import { a as stopBrowserControlRuntime, i as getBrowserControlState, r as ensureBrowserControlRuntime, t as isDefaultBrowserPluginEnabled } from "./plugin-enabled-C7puELLN.js";
//#region extensions/browser/src/control-service.ts
/**
* Browser control service lifecycle for plugin-managed, in-process operation.
*/
const logService = createSubsystemLogger("browser").child("service");
/** Starts Browser control without binding the HTTP server when config enables it. */
async function startBrowserControlServiceFromConfig() {
	const current = getBrowserControlState();
	if (current) return current;
	const cfg = getRuntimeConfig();
	const browserCfg = loadBrowserConfigForRuntimeRefresh();
	if (!isDefaultBrowserPluginEnabled(browserCfg)) return null;
	let resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	try {
		if ((await ensureBrowserControlAuth({ cfg })).generatedToken) logService.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logService.warn(`failed to auto-configure browser auth: ${String(err)}`);
	}
	const hasExtensionProfiles = Object.values(resolved.profiles).some((profile) => profile.driver === "extension");
	if (hasExtensionProfiles) {
		const { ensureExtensionRelayToken } = await import("./relay-auth-SURJEeiO.js");
		ensureExtensionRelayToken();
		const refreshed = loadBrowserConfigForRuntimeRefresh();
		resolved = resolveBrowserConfig(refreshed.browser, refreshed);
	}
	const state = await ensureBrowserControlRuntime({
		server: null,
		port: resolved.controlPort,
		resolved,
		owner: "service",
		onWarn: (message) => logService.warn(message)
	});
	if (hasExtensionProfiles) {
		const { startConfiguredExtensionRelays } = await getExtensionRelayModule();
		await startConfiguredExtensionRelays(state, (name) => resolveProfile(resolved, name), (message) => logService.warn(message));
	}
	logService.info(`Browser control service ready (profiles=${Object.keys(resolved.profiles).length})`);
	return state;
}
/** Stops the in-process Browser control service runtime. */
async function stopBrowserControlService() {
	await stopBrowserControlRuntime({
		requestedBy: "service",
		onWarn: (message) => logService.warn(message)
	});
}
//#endregion
export { stopBrowserControlService as n, startBrowserControlServiceFromConfig as t };
