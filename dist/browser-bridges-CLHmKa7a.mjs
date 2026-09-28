import { t as loadActivatedBundledPluginPublicSurfaceModule } from "./facade-runtime-CSNstsFk.mjs";
//#region src/plugin-sdk/browser-bridge.ts
function loadFacadeModule() {
	return loadActivatedBundledPluginPublicSurfaceModule({
		dirName: "browser",
		artifactBasename: "bridge-api.js"
	});
}
/** Starts the browser bridge runtime from the activated browser plugin facade. */
async function startBrowserBridgeServer(params) {
	return await (await loadFacadeModule()).startBrowserBridgeServer(params);
}
/** Stops a browser bridge server previously returned by startBrowserBridgeServer. */
async function stopBrowserBridgeServer(server) {
	await (await loadFacadeModule()).stopBrowserBridgeServer(server);
}
//#endregion
//#region src/agents/sandbox/browser-bridges.ts
/**
* In-process browser bridge registry keyed by sandbox session.
*
* The prune path uses this table to stop bridge servers when backing containers expire.
*/
const BROWSER_BRIDGES = /* @__PURE__ */ new Map();
/** Stop and remove only the cached bridge instance the caller inspected. */
async function stopCachedBrowserBridge(sessionKey, expected) {
	if (BROWSER_BRIDGES.get(sessionKey) !== expected) return;
	await stopBrowserBridgeServer(expected.bridge.server);
	if (BROWSER_BRIDGES.get(sessionKey) === expected) BROWSER_BRIDGES.delete(sessionKey);
}
/** Drain every cached bridge that still owns one sandbox container. */
async function stopCachedBrowserBridgesForContainer(containerName) {
	for (;;) {
		const match = [...BROWSER_BRIDGES].find(([, cached]) => cached.containerName === containerName);
		if (!match) return;
		await stopCachedBrowserBridge(match[0], match[1]);
	}
}
//#endregion
export { startBrowserBridgeServer as i, stopCachedBrowserBridge as n, stopCachedBrowserBridgesForContainer as r, BROWSER_BRIDGES as t };
