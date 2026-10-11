import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CXaC-ufL.mjs";
import { i as resolveBrowserConfig } from "./config-fMVye_Fl.mjs";
import { r as setBridgeAuthForPort, t as deleteBridgeAuthForPort } from "./bridge-auth-registry-CS3DjOzO.mjs";
import { i as listenBrowserHttpServer, n as installBrowserAuthMiddleware, r as installBrowserCommonMiddleware } from "./server-middleware-D887snGq.mjs";
import "./subsystem-BJRy008q.mjs";
import "./config-BJPagvX2.mjs";
import { n as resolveBrowserControlAuth, r as shouldAutoGenerateBrowserAuth, t as ensureBrowserControlAuth } from "./control-auth-5f148hOr.mjs";
import { t as registerBrowserRoutes } from "./routes-BmqU2ILD.mjs";
import { a as loadBrowserConfigForRuntimeRefresh } from "./server-context-zGtV-U3z.mjs";
import { a as stopBrowserControlRuntime, n as ensureBrowserControlRuntime, o as withBrowserControlStart, r as getBrowserControlState, t as createBrowserControlContext } from "./browser-control-state-hl_UHxa3.mjs";
import { n as resolveBrowserPluginEnableState } from "./plugin-enabled-BGqGSxB8.mjs";
import express from "express";
//#region extensions/browser/src/server.ts
/**
* Browser control HTTP server startup and shutdown entrypoints.
*/
const logServer = createSubsystemLogger("browser").child("server");
async function startBrowserControlServerUnlocked() {
	const current = getBrowserControlState();
	if (current?.server) return current;
	const cfg = getRuntimeConfig();
	const browserCfg = loadBrowserConfigForRuntimeRefresh();
	if (!resolveBrowserPluginEnableState(cfg).enabled) return null;
	const resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	let browserAuth = resolveBrowserControlAuth(cfg);
	let browserAuthBootstrapFailed = false;
	try {
		const ensured = await ensureBrowserControlAuth({ cfg });
		browserAuth = ensured.auth;
		if (ensured.generatedToken) logServer.info("No browser auth configured; generated browser control auth credential automatically.");
	} catch (err) {
		logServer.warn(`failed to auto-configure browser auth: ${String(err)}`);
		browserAuthBootstrapFailed = true;
	}
	if ((browserAuthBootstrapFailed || shouldAutoGenerateBrowserAuth(process.env)) && !browserAuth.token && !browserAuth.password) {
		if (browserAuthBootstrapFailed) logServer.error("browser control startup aborted: authentication bootstrap failed and no fallback auth is configured.");
		else logServer.error("browser control startup aborted: no authentication configured.");
		return null;
	}
	const app = express();
	installBrowserCommonMiddleware(app);
	installBrowserAuthMiddleware(app, browserAuth);
	const ctx = createBrowserControlContext();
	registerBrowserRoutes(app, ctx);
	const port = resolved.controlPort;
	const server = await listenBrowserHttpServer(app, port, "127.0.0.1").catch((err) => {
		logServer.error(`openclaw browser server failed to bind 127.0.0.1:${port}: ${String(err)}`);
		return null;
	});
	if (!server) return null;
	let state;
	try {
		state = await ensureBrowserControlRuntime({
			server,
			port,
			resolved,
			owner: "server",
			onWarn: (message) => logServer.warn(message)
		});
	} catch (err) {
		await new Promise((resolve) => {
			server.close(() => resolve());
		});
		throw err;
	}
	setBridgeAuthForPort(port, browserAuth);
	const authMode = browserAuth.token ? "token" : browserAuth.password ? "password" : "off";
	logServer.info(`Browser control listening on http://127.0.0.1:${port}/ (auth=${authMode})`);
	return state;
}
/** Starts the Browser control HTTP server from runtime config. */
async function startBrowserControlServerFromConfig() {
	return await withBrowserControlStart(startBrowserControlServerUnlocked);
}
/** Stops the Browser control HTTP server and unregisters bridge auth. */
async function stopBrowserControlServer() {
	const stopped = await stopBrowserControlRuntime({
		requestedBy: "server",
		closeServer: true,
		onWarn: (message) => logServer.warn(message)
	});
	if (stopped?.port) deleteBridgeAuthForPort(stopped.port);
}
//#endregion
export { startBrowserControlServerFromConfig, stopBrowserControlServer };
