import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/reef/src/runtime.ts
const { setRuntime: setReefRuntime, tryGetRuntime: getOptionalReefRuntime, getRuntime: getReefRuntime } = createPluginRuntimeStore({
	pluginId: "reef",
	errorMessage: "Reef runtime unavailable"
});
const activeReefStore = createPluginRuntimeStore({
	key: "plugin-runtime:reef:active",
	errorMessage: "Reef channel is not running"
});
function createReefRuntimeAuthority(parentSignal) {
	const controller = new AbortController();
	const signal = parentSignal ? AbortSignal.any([parentSignal, controller.signal]) : controller.signal;
	let registration = null;
	return {
		signal,
		activate(value) {
			signal.throwIfAborted();
			const predecessor = activeReefStore.tryGetRuntime();
			registration = {
				value,
				controller,
				signal
			};
			activeReefStore.setRuntime(registration);
			predecessor?.controller.abort();
		},
		release() {
			controller.abort();
			if (activeReefStore.tryGetRuntime() === registration) activeReefStore.clearRuntime();
		}
	};
}
function getActiveReef() {
	const registration = activeReefStore.getRuntime();
	if (registration.signal.aborted) throw new Error("Reef channel is not running");
	return registration.value;
}
//#endregion
export { setReefRuntime as a, getReefRuntime as i, getActiveReef as n, getOptionalReefRuntime as r, createReefRuntimeAuthority as t };
