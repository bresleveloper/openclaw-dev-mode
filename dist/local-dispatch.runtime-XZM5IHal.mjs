import { t as createBrowserRouteDispatcher } from "./dispatcher-DyQH5j96.mjs";
import { t as createBrowserControlContext } from "./browser-control-state-ifva595C.mjs";
import { t as describeBrowserControlUnavailable } from "./plugin-enabled-DyxIYAn3.mjs";
import { t as startBrowserControlServiceFromConfig } from "./control-service-B74LgX2W.mjs";
//#region extensions/browser/src/browser/local-dispatch.runtime.ts
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
