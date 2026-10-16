import { i as registerSignalExitBarrier } from "./signal-exit-barrier-BFniU76K.mjs";
//#region src/proxy-capture/runtime-cleanup.ts
const finalizers = /* @__PURE__ */ new Set();
function registerActiveDebugProxyCapture(finalize) {
	finalizers.add(finalize);
	const unregisterSignalBarrier = registerSignalExitBarrier(finalize);
	return () => {
		finalizers.delete(finalize);
		unregisterSignalBarrier();
	};
}
async function finalizeActiveDebugProxyCaptures() {
	const errors = (await Promise.allSettled([...finalizers].map(async (finalize) => await finalize()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length) throw new AggregateError(errors, "Capture finalization failed.");
}
//#endregion
export { registerActiveDebugProxyCapture as n, finalizeActiveDebugProxyCaptures as t };
