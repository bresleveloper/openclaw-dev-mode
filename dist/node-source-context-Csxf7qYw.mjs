//#region src/gateway/desktop/node-source-context.ts
const NODE_DESKTOP_SERVICE_CONTEXT = Symbol("openclaw.nodeDesktopService");
function getNodeDesktopService(context) {
	return context[NODE_DESKTOP_SERVICE_CONTEXT];
}
//#endregion
export { getNodeDesktopService as n, NODE_DESKTOP_SERVICE_CONTEXT as t };
