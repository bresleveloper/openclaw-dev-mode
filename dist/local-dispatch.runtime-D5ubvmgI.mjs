import { t as createBrowserControlContext } from "./browser-control-state-CZZejhmY.mjs";
import { t as createBrowserRouteDispatcher } from "./dispatcher-DesH8goE.mjs";
import { t as describeBrowserControlUnavailable } from "./plugin-enabled-FVHUTHv0.mjs";
import { t as startBrowserControlServiceFromConfig } from "./control-service-CaNBYCPw.mjs";
//#region extensions/browser/src/browser/local-dispatch.runtime.ts
/**
* Local browser control dispatch bridge.
*
* Starts the browser control service when needed and dispatches requests
* through the in-process route dispatcher for local Browser tool calls.
*/
/** Dispatch one browser-control request through the local in-process router. */
async function dispatchBrowserControlRequest(req) {
	if (!await startBrowserControlServiceFromConfig()) return {
		status: 503,
		body: { error: await describeBrowserControlUnavailable() }
	};
	const dispatcher = createBrowserRouteDispatcher(createBrowserControlContext());
	await req.assertCurrent?.();
	return await dispatcher.dispatch(req);
}
//#endregion
export { dispatchBrowserControlRequest };
