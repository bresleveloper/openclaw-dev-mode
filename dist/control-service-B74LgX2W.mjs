import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./runtime-config-snapshot-DgZgcXUX.mjs";
import "./logging-core-LMmGpAHM.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "./config-DQZ6ubGi.mjs";
import { n as getGatewayExtensionRelayModule, t as getExtensionRelayModule } from "./extension-relay.runtime.js";
import { a as loadBrowserConfigForRuntimeRefresh } from "./server-context-BKNNv13O.mjs";
import { n as stopBrowserScreencasts } from "./session-C5w0l3tl.mjs";
import { t as ensureBrowserControlAuth } from "./control-auth-Be3ZqNsy.mjs";
import { a as stopBrowserControlRuntime, n as ensureBrowserControlRuntime, o as withBrowserControlStart, r as getBrowserControlState } from "./browser-control-state-ifva595C.mjs";
import { n as resolveBrowserPluginEnableState } from "./plugin-enabled-DyxIYAn3.mjs";
//#region extensions/browser/src/control-service.ts
const logService = createSubsystemLogger("browser").child("service");
async function startBrowserControlServiceUnlocked() {
	const current = getBrowserControlState();
	if (current) return current;
	const cfg = getRuntimeConfig();
	const browserCfg = loadBrowserConfigForRuntimeRefresh();
	if (!resolveBrowserPluginEnableState(cfg).enabled) return null;
	const resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	try {
		if ((await ensureBrowserControlAuth({ cfg })).generatedToken) logService.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logService.warn(`failed to auto-configure browser auth: ${String(err)}`);
	}
	const hasExtensionProfiles = Object.values(resolved.profiles).some((profile) => profile.driver === "extension");
	if (hasExtensionProfiles) {
		const { ensureExtensionRelayToken } = await import("./relay-auth-AaUpgoy2.mjs");
		await ensureExtensionRelayToken();
	}
	const state = await ensureBrowserControlRuntime({
		server: null,
		port: resolved.controlPort,
		resolved,
		owner: "service"
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
