import { c as BrowserProfileUnavailableError } from "./errors-CXz-2iKA.mjs";
import { s as isBrowserRuntimeRunning } from "./server-context.lifecycle-WXgkDTmm.mjs";
import { r as stopBrowserRuntime, t as createBrowserRuntimeState } from "./runtime-lifecycle-BMGB4Y9k.mjs";
import { t as createBrowserRouteContext } from "./server-context-7BYCvWe8.mjs";
//#region extensions/browser/src/browser-control-state.ts
let state = null;
let owner = null;
let lifecycleTail = Promise.resolve();
let completedEffectiveStops = 0;
let pendingLifecycles = 0;
/** Serialize complete Browser runtime start/stop workflows. */
function enqueueBrowserControlLifecycle(run) {
	pendingLifecycles += 1;
	const result = lifecycleTail.then(run, run).finally(() => {
		pendingLifecycles -= 1;
	});
	lifecycleTail = result.then(() => {}, () => {});
	return result;
}
/** Queue startup, but never turn a request made during shutdown into a post-stop restart. */
function withBrowserControlStart(run) {
	const effectiveStopsAtRequest = completedEffectiveStops;
	return enqueueBrowserControlLifecycle(() => {
		if (completedEffectiveStops !== effectiveStopsAtRequest || (state ? !isBrowserRuntimeRunning(state) : false)) throw new BrowserProfileUnavailableError("Browser runtime is stopping.");
		return run();
	});
}
function getBrowserControlState() {
	return state && isBrowserRuntimeRunning(state) ? state : null;
}
function hasBrowserControlWork() {
	return state !== null || pendingLifecycles > 0;
}
/** Create a route context bound to the current shared browser runtime. */
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
			owner = "server";
		}
		return state;
	}
	if (state) throw new BrowserProfileUnavailableError("Browser runtime cleanup must finish before restart.");
	state = await createBrowserRuntimeState({
		server: params.server ?? null,
		port: params.port,
		resolved: params.resolved,
		onWarn: params.onWarn
	});
	owner = params.owner;
	return state;
}
/** Stop the shared browser runtime when the requesting owner is allowed to do so. */
function stopBrowserControlRuntime(params) {
	return enqueueBrowserControlLifecycle(async () => {
		const current = state;
		if (!current) return null;
		if (params.requestedBy === "service" && current.server && owner === "server") return null;
		await stopBrowserRuntime({
			current,
			getState: () => state,
			clearState: () => {
				state = null;
				owner = null;
			},
			closeServer: params.closeServer,
			onWarn: params.onWarn
		});
		completedEffectiveStops += 1;
		return current;
	});
}
//#endregion
export { stopBrowserControlRuntime as a, hasBrowserControlWork as i, ensureBrowserControlRuntime as n, withBrowserControlStart as o, getBrowserControlState as r, createBrowserControlContext as t };
