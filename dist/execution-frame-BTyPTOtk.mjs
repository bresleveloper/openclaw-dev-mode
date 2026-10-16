import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as getPluginExecutionFrame, t as InvocationFrame } from "./plugin-instance-invocation-CH4zOUb4.mjs";
//#region src/plugins/runtime/execution-frame.ts
const PluginRuntimeExecutionFrame = resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeExecutionFrame"), () => class RuntimeFrame extends InvocationFrame {
	constructor(scopes, gatewayScope, generationRegistry, invocation = scopes.invocation) {
		super(scopes, invocation);
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
