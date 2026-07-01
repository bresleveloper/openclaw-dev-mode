import { t as createBrowserRouteDispatcher } from "./dispatcher-Cssw3h3I.js";
import { n as createBrowserControlContext } from "./plugin-enabled-Bu_EnKAB.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-BzySCPwb.js";
//#region extensions/browser/src/browser/local-dispatch.runtime.ts
/**
* Local browser control dispatch bridge.
*
* Starts the browser control service when needed and dispatches requests
* through the in-process route dispatcher for local Browser tool calls.
*/
/** Dispatch one browser-control request through the local in-process router. */
async function dispatchBrowserControlRequest(req) {
	if (!await startBrowserControlServiceFromConfig()) throw new Error("browser control disabled");
	return await createBrowserRouteDispatcher(createBrowserControlContext()).dispatch(req);
}
//#endregion
export { dispatchBrowserControlRequest };
