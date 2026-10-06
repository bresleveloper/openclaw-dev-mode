import { t as createBrowserControlContext } from "./browser-control-state-DJ5KV-fD.mjs";
import { t as createBrowserRouteDispatcher } from "./dispatcher-D0AiVnSt.mjs";
import { t as describeBrowserControlUnavailable } from "./plugin-enabled-DuVXhUcp.mjs";
import { t as startBrowserControlServiceFromConfig } from "./control-service-qDHR62mj.mjs";
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
