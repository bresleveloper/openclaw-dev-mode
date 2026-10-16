import { AsyncLocalStorage } from "node:async_hooks";
//#region src/proxy-capture/runtime-deferral.ts
const captureDeferral = new AsyncLocalStorage();
/** Update entry points share one deferral until their owner preserves the original state. */
async function withDeferredDebugProxyCapture(run) {
	const inherited = captureDeferral.getStore();
	if (inherited && inherited.phase !== "released") return await run(inherited.resume);
	const scope = {
		phase: "deferred",
		resume: () => {
			if (scope.phase === "deferred") scope.phase = "released";
		}
	};
	return await captureDeferral.run(scope, async () => {
		try {
			return await run(scope.resume);
		} finally {
			if (scope.phase === "deferred") scope.phase = "closed";
		}
	});
}
function isDebugProxyCaptureDeferred() {
	const scope = captureDeferral.getStore();
	return scope !== void 0 && scope.phase !== "released";
}
//#endregion
export { withDeferredDebugProxyCapture as n, isDebugProxyCaptureDeferred as t };
