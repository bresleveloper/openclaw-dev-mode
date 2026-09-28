import { a as runWithPluginExecutionFrame, r as getPluginExecutionFrame } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { n as getPluginRuntimeExecutionFrame, t as PluginRuntimeExecutionFrame } from "./execution-frame-BFVLVBaA.mjs";
//#region src/plugins/runtime/generation-state.ts
function withPluginRuntimeGenerationRegistryScope(registry, run) {
	const current = getPluginExecutionFrame();
	return runWithPluginExecutionFrame(new PluginRuntimeExecutionFrame(current ?? {}, getPluginRuntimeExecutionFrame(current)?.gatewayScope, registry), run);
}
/** Exact registry owned by the prepared generation, including empty selections. */
function getPluginRuntimeGenerationRegistry() {
	return getPluginRuntimeExecutionFrame()?.generationRegistry;
}
function runOutsidePluginRuntimeGenerationRegistryScope(run) {
	const current = getPluginExecutionFrame();
	return runWithPluginExecutionFrame(new PluginRuntimeExecutionFrame(current ?? {}, getPluginRuntimeExecutionFrame(current)?.gatewayScope, void 0), run);
}
//#endregion
export { runOutsidePluginRuntimeGenerationRegistryScope as n, withPluginRuntimeGenerationRegistryScope as r, getPluginRuntimeGenerationRegistry as t };
