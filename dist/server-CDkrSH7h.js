import "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import { t as createSubsystemLogger } from "./subsystem-CkDRqDzV.js";
import "./boolean-DTgd5CzD.js";
import { Lr as createBrowserRuntimeState, Oo as loadConfig, Rr as stopBrowserRuntime, Si as resolveBrowserControlAuth, Yr as resolveBrowserConfig, br as registerBrowserRoutes, vr as installBrowserAuthMiddleware, xi as ensureBrowserControlAuth, yr as installBrowserCommonMiddleware, zr as createBrowserRouteContext } from "./auth-profiles-CIqoN6FN.js";
import "./agent-scope-BAb0j1gt.js";
import "./utils-DMInpDZe.js";
import "./boundary-file-read-DM07oBuv.js";
import "./logger-GQFppKMT.js";
import "./exec-DDBrWr4H.js";
import "./github-copilot-token-B_S63apr.js";
import "./env-overrides-BD1bOZrq.js";
import "./version-BvA7WhZA.js";
import "./runtime-overrides-CGfXKBb_.js";
import "./registry-DznR2BDN.js";
import "./skills-DZCrHNdp.js";
import "./frontmatter-D1I3WE8J.js";
import "./plugins-CjLMQbHJ.js";
import "./windows-spawn-D2jCT_tt.js";
import "./redact-DnTfDLlu.js";
import "./path-alias-guards-BAfWVs88.js";
import "./errors-D6OHuY6d.js";
import "./paths-B52CESY4.js";
import "./chat-envelope-DZwp6OvC.js";
import express from "express";
//#region src/browser/server.ts
let state = null;
const logServer = createSubsystemLogger("browser").child("server");
async function startBrowserControlServerFromConfig() {
	if (state) return state;
	const cfg = loadConfig();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	if (!resolved.enabled) return null;
	let browserAuth = resolveBrowserControlAuth(cfg);
	let browserAuthBootstrapFailed = false;
	try {
		const ensured = await ensureBrowserControlAuth({ cfg });
		browserAuth = ensured.auth;
		if (ensured.generatedToken) logServer.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logServer.warn(`failed to auto-configure browser auth: ${String(err)}`);
		browserAuthBootstrapFailed = true;
	}
	if (browserAuthBootstrapFailed && !browserAuth.token && !browserAuth.password) {
		logServer.error("browser control startup aborted: authentication bootstrap failed and no fallback auth is configured.");
		return null;
	}
	const app = express();
	installBrowserCommonMiddleware(app);
	installBrowserAuthMiddleware(app, browserAuth);
	registerBrowserRoutes(app, createBrowserRouteContext({
		getState: () => state,
		refreshConfigFromDisk: true
	}));
	const port = resolved.controlPort;
	const server = await new Promise((resolve, reject) => {
		const s = app.listen(port, "127.0.0.1", () => resolve(s));
		s.once("error", reject);
	}).catch((err) => {
		logServer.error(`openclaw browser server failed to bind 127.0.0.1:${port}: ${String(err)}`);
		return null;
	});
	if (!server) return null;
	state = await createBrowserRuntimeState({
		server,
		port,
		resolved,
		onWarn: (message) => logServer.warn(message)
	});
	const authMode = browserAuth.token ? "token" : browserAuth.password ? "password" : "off";
	logServer.info(`Browser control listening on http://127.0.0.1:${port}/ (auth=${authMode})`);
	return state;
}
async function stopBrowserControlServer() {
	await stopBrowserRuntime({
		current: state,
		getState: () => state,
		clearState: () => {
			state = null;
		},
		closeServer: true,
		onWarn: (message) => logServer.warn(message)
	});
}
//#endregion
export { startBrowserControlServerFromConfig, stopBrowserControlServer };
