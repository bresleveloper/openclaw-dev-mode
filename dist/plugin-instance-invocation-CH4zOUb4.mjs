import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-instance-invocation.ts
var InvocationFrame = class InvocationFrame {
	constructor(scopes, invocation = scopes.invocation) {
		this.invocation = invocation;
		this.metadataScope = scopes.metadataScope;
		this.cacheScope = scopes.cacheScope;
		this.sourceCaptureStorage = scopes.sourceCaptureStorage;
	}
	withScopes(scopes) {
		return new InvocationFrame(scopes);
	}
};
/** Copy core scopes through the current owner so runtime-only fields survive. */
function createPluginExecutionFrame(scopes, current) {
	return current ? current.withScopes(scopes) : new InvocationFrame(scopes);
}
const pluginExecutionContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceInvocation"), () => {
	const frames = new AsyncLocalStorage();
	return {
		invocation: {
			getStore() {
				return frames.getStore()?.invocation;
			},
			run(invocation, run) {
				const current = frames.getStore();
				return frames.run(current?.invocation === invocation ? current : createPluginExecutionFrame({
					...current,
					invocation
				}, current), run);
			},
			exit(run) {
				const current = frames.getStore();
				return current?.invocation ? frames.run(current.withScopes({
					...current,
					invocation: void 0
				}), run) : run();
			}
		},
		getFrame() {
			return frames.getStore();
		},
		runFrame(frame, run) {
			return frames.run(frame, run);
		}
	};
});
const pluginInstanceInvocation = pluginExecutionContext.invocation;
const getPluginExecutionFrame = pluginExecutionContext.getFrame;
const runWithPluginExecutionFrame = pluginExecutionContext.runFrame;
//#endregion
export { runWithPluginExecutionFrame as a, pluginInstanceInvocation as i, createPluginExecutionFrame as n, getPluginExecutionFrame as r, InvocationFrame as t };
