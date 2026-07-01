import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { n as resolveBrowserConfig } from "./config-Bq1Kc57-.js";
import "./config-C_TBAZgp.js";
import { t as ensureBrowserControlAuth } from "./control-auth-XaF9Nk9I.js";
import { r as loadBrowserConfigForRuntimeRefresh } from "./server-context-BYm9msDH.js";
import "./subsystem-Cdg2K6_Z.js";
import { a as stopBrowserControlRuntime, i as getBrowserControlState, r as ensureBrowserControlRuntime, t as isDefaultBrowserPluginEnabled } from "./plugin-enabled-Bu_EnKAB.js";
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
	const resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	try {
		if ((await ensureBrowserControlAuth({ cfg })).generatedToken) logService.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logService.warn(`failed to auto-configure browser auth: ${String(err)}`);
	}
	const state = await ensureBrowserControlRuntime({
		server: null,
		port: resolved.controlPort,
		resolved,
		owner: "service",
		onWarn: (message) => logService.warn(message)
	});
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
