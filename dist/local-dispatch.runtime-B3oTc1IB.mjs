import { t as createBrowserRouteDispatcher } from "./dispatcher-vGeVOdV2.mjs";
import { t as createBrowserControlContext } from "./browser-control-state-GDpb2Kjv.mjs";
import { t as describeBrowserControlUnavailable } from "./plugin-enabled-6OuZ5GNX.mjs";
import { t as startBrowserControlServiceFromConfig } from "./control-service-TYtFFvCT.mjs";
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
