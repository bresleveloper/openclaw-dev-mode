import { c as BrowserProfileUnavailableError } from "./errors-BqlAThZX.mjs";
import { t as createBrowserRouteContext } from "./server-context-CPt-k1G_.mjs";
import { s as isBrowserRuntimeRunning } from "./server-context.lifecycle-BoKswvT1.mjs";
import { r as stopBrowserRuntime, t as createBrowserRuntimeState } from "./runtime-lifecycle-BTTOJAz6.mjs";
//#region extensions/browser/src/browser-control-state.ts
let state = null;
let lifecycleTail = Promise.resolve();
let pendingLifecycles = 0;
let pendingStops = 0;
/** Serialize complete Browser runtime start/stop workflows. */
function enqueueBrowserControlLifecycle(run) {
	pendingLifecycles += 1;
	const result = lifecycleTail.then(run, run).finally(() => {
		pendingLifecycles -= 1;
	});
	lifecycleTail = result.then(() => {}, () => {});
	return result;
}
/** Serialize startup with the runtime's stop workflow. */
function withBrowserControlStart(run) {
	if (pendingStops > 0) return Promise.reject(new BrowserProfileUnavailableError("Browser runtime is stopping."));
	return enqueueBrowserControlLifecycle(() => {
		if (state && !isBrowserRuntimeRunning(state)) throw new BrowserProfileUnavailableError("Browser runtime is stopping.");
		return run();
	});
}
function getBrowserControlState() {
	return state && isBrowserRuntimeRunning(state) ? state : null;
}
function hasBrowserControlWork() {
	return state !== null || pendingLifecycles > 0;
}
function createBrowserControlContext() {
	return createBrowserRouteContext({
		getState: () => state,
		refreshConfigFromDisk: true
	});
}
/**
* Start or attach the shared runtime. Call only from a queued `withBrowserControlStart` entry.
*/
async function ensureBrowserControlRuntime(params) {
	if (state && isBrowserRuntimeRunning(state)) {
		if (params.server) {
			state.server = params.server;
			state.port = params.port;
			state.resolved = {
				...params.resolved,
				controlPort: params.port
			};
		}
		return state;
	}
	if (state) throw new BrowserProfileUnavailableError("Browser runtime cleanup must finish before restart.");
	state = await createBrowserRuntimeState({
		server: params.server ?? null,
		port: params.port,
		resolved: params.resolved
	});
	return state;
}
/** Stop the shared browser runtime when the requesting owner is allowed to do so. */
function stopBrowserControlRuntime(params) {
	pendingStops += 1;
	return enqueueBrowserControlLifecycle(async () => {
		const current = state;
		if (!current) return null;
		if (params.requestedBy === "service" && current.server) return null;
		await stopBrowserRuntime({
			current,
			clearState: () => {
				state = null;
			},
			closeServer: params.closeServer,
			onWarn: params.onWarn
		});
		return current;
	}).finally(() => {
		pendingStops -= 1;
	});
}
//#endregion
export { stopBrowserControlRuntime as a, hasBrowserControlWork as i, ensureBrowserControlRuntime as n, withBrowserControlStart as o, getBrowserControlState as r, createBrowserControlContext as t };
