import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as getPluginExecutionFrame, t as InvocationFrame } from "./plugin-instance-invocation-DjfKDZW8.mjs";
//#region src/plugins/runtime/execution-frame.ts
const PluginRuntimeExecutionFrame = resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeExecutionFrame"), () => class RuntimeFrame extends InvocationFrame {
	constructor(scopes, gatewayScope, generationRegistry, invocation = scopes.invocation) {
		super(scopes, invocation);
		this.gatewayScope = gatewayScope;
		this.generationRegistry = generationRegistry;
	}
	get runtimePluginId() {
		return this.gatewayScope?.pluginId;
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
