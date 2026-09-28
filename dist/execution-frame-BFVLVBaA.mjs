import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as getPluginExecutionFrame, t as InvocationFrame } from "./plugin-instance-invocation-CGmhv_zp.mjs";
//#region src/plugins/runtime/execution-frame.ts
const PluginRuntimeExecutionFrame = resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeExecutionFrame"), () => class RuntimeFrame extends InvocationFrame {
	constructor(scopes, gatewayScope, generationRegistry) {
		super(scopes);
		this.gatewayScope = gatewayScope;
		this.generationRegistry = generationRegistry;
	}
	withScopes(scopes) {
		return new RuntimeFrame(scopes, this.gatewayScope, this.generationRegistry);
	}
});
function getPluginRuntimeExecutionFrame(frame = getPluginExecutionFrame()) {
	return frame instanceof PluginRuntimeExecutionFrame ? frame : void 0;
}
//#endregion
export { getPluginRuntimeExecutionFrame as n, PluginRuntimeExecutionFrame as t };
