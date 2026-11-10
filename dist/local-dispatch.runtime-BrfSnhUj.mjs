import { t as createBrowserRouteDispatcher } from "./dispatcher-DYRymHcZ.mjs";
import { t as createBrowserControlContext } from "./browser-control-state-bUudnqjR.mjs";
import { t as describeBrowserControlUnavailable } from "./plugin-enabled-BozM7gNo.mjs";
import { t as startBrowserControlServiceFromConfig } from "./control-service-PkoHhWT0.mjs";
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
