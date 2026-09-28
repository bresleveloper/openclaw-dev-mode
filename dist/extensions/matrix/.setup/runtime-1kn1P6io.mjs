import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/matrix/src/runtime.ts
const { setRuntime: setMatrixRuntime, getRuntime: getMatrixRuntime, tryGetRuntime: getOptionalMatrixRuntime } = createPluginRuntimeStore({
	pluginId: "matrix",
	errorMessage: "Matrix runtime not initialized"
});
const runtimeLifecycles = createPluginRuntimeStore({
	key: "matrix:runtime-lifecycles",
	errorMessage: "Matrix runtime lifecycle not initialized"
});
function setMatrixRuntimeLifecycle(runtime, lifecycle) {
	if (lifecycle.signal && lifecycle.onDispose) {
		let lifecycles = runtimeLifecycles.tryGetRuntime();
		if (!lifecycles) {
			lifecycles = /* @__PURE__ */ new WeakMap();
			runtimeLifecycles.setRuntime(lifecycles);
		}
		lifecycles.set(runtime, {
			signal: lifecycle.signal,
			onDispose: lifecycle.onDispose
		});
	}
}
function getMatrixRuntimeLifecycle() {
	const runtime = getOptionalMatrixRuntime();
	return runtime ? runtimeLifecycles.tryGetRuntime()?.get(runtime) : void 0;
}
//#endregion
export { setMatrixRuntimeLifecycle as a, setMatrixRuntime as i, getMatrixRuntimeLifecycle as n, getOptionalMatrixRuntime as r, getMatrixRuntime as t };
