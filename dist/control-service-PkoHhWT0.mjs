import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import "./logging-core-CsXmxYo2.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "./config-xjgIR3E-.mjs";
import { n as getGatewayExtensionRelayModule, t as getExtensionRelayModule } from "./extension-relay.runtime.js";
import { o as loadBrowserConfigForRuntimeRefresh } from "./server-context-CPt-k1G_.mjs";
import { n as stopBrowserScreencasts } from "./session-CtJJTzPi.mjs";
import { a as stopBrowserControlRuntime, n as ensureBrowserControlRuntime, o as withBrowserControlStart, r as getBrowserControlState } from "./browser-control-state-bUudnqjR.mjs";
import { n as resolveBrowserPluginEnableState } from "./plugin-enabled-BozM7gNo.mjs";
//#region extensions/browser/src/control-service.ts
const logService = createSubsystemLogger("browser").child("service");
async function startBrowserControlServiceUnlocked() {
	const current = getBrowserControlState();
	if (current) return current;
	const cfg = await captureRuntimeConfigAsyncReader()();
	const browserCfg = loadBrowserConfigForRuntimeRefresh();
	if (!resolveBrowserPluginEnableState(cfg).enabled) return null;
	const resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	const hasExtensionProfiles = Object.values(resolved.profiles).some((profile) => profile.driver === "extension");
	const state = await ensureBrowserControlRuntime({
		server: null,
		port: resolved.controlPort,
		resolved
	});
	if (hasExtensionProfiles) {
		const { startConfiguredExtensionRelays } = await getExtensionRelayModule();
		await startConfiguredExtensionRelays(state, (name) => resolveProfile(resolved, name), (message) => logService.warn(message));
	}
	logService.info(`Browser control service ready (profiles=${Object.keys(resolved.profiles).length})`);
	return state;
}
async function startBrowserControlServiceFromConfig() {
	return await withBrowserControlStart(startBrowserControlServiceUnlocked);
}
async function stopBrowserControlService() {
	try {
		await stopBrowserControlRuntime({
			requestedBy: "service",
			onWarn: (message) => logService.warn(message)
		});
	} finally {
		(await getGatewayExtensionRelayModule.peek())?.disposeGatewayExtensionRelay();
		await stopBrowserScreencasts();
	}
}
//#endregion
export { stopBrowserControlService as n, startBrowserControlServiceFromConfig as t };
