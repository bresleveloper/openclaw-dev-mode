import { B as resolveGlobalSingleton } from "./utils-c2rFzEZe.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-instance-invocation.ts
var InvocationFrame = class InvocationFrame {
	constructor(scopes, invocation = scopes.invocation) {
		this.invocation = invocation;
		this.metadataScope = scopes.metadataScope;
		this.cacheScope = scopes.cacheScope;
		this.sourceCaptureStorage = scopes.sourceCaptureStorage;
	}
	get runtimePluginId() {}
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
pluginExecutionContext.invocation;
const getPluginExecutionFrame = pluginExecutionContext.getFrame;
pluginExecutionContext.runFrame;
//#endregion
//#region src/shared/listeners.ts
/** Notifies every registered listener while isolating individual listener failures. */
function notifyListeners(listeners, event, onError) {
	for (const listener of listeners) try {
		listener(event);
	} catch (error) {
		onError?.(error);
	}
}
/** Registers a listener in a Set and returns an idempotent unsubscribe handle. */
function registerListener(listeners, listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
//#endregion
export { getPluginExecutionFrame as i, registerListener as n, InvocationFrame as r, notifyListeners as t };
