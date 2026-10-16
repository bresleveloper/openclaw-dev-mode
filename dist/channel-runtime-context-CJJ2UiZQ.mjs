//#region src/infra/channel-runtime-context.ts
const NOOP_DISPOSE = () => {};
function resolveScopedRuntimeContextRegistry(params) {
	const runtimeContexts = params.channelRuntime?.runtimeContexts;
	if (runtimeContexts && typeof runtimeContexts.register === "function" && typeof runtimeContexts.get === "function" && typeof runtimeContexts.watch === "function") return runtimeContexts;
	throw new Error("channelRuntime must provide runtimeContexts.register/get/watch; pass createPluginRuntime().channel or omit channelRuntime.");
}
/** Registers a channel-scoped runtime context, returning null when no runtime registry exists. */
function registerChannelRuntimeContext(params) {
	return params.channelRuntime?.runtimeContexts?.register({
		channelId: params.channelId,
		accountId: params.accountId,
		capability: params.capability,
		context: params.context,
		abortSignal: params.abortSignal
	}) ?? null;
}
/** Reads a channel-scoped runtime context from the current runtime registry. */
function getChannelRuntimeContext(params) {
	return params.channelRuntime?.runtimeContexts?.get({
		channelId: params.channelId,
		accountId: params.accountId,
		capability: params.capability
	});
}
/** Watches context registration changes for one channel/account/capability key. */
function watchChannelRuntimeContexts(params) {
	return params.channelRuntime?.runtimeContexts?.watch({
		channelId: params.channelId,
		accountId: params.accountId,
		capability: params.capability,
		onEvent: params.onEvent
	}) ?? null;
}
/** Wraps a channel runtime so contexts registered during a task are disposed together. */
function createTaskScopedChannelRuntime(params) {
	const baseRuntime = params.channelRuntime;
	if (!baseRuntime) return {
		channelRuntime: void 0,
		dispose: NOOP_DISPOSE
	};
	const runtimeContexts = resolveScopedRuntimeContextRegistry({ channelRuntime: baseRuntime });
	const trackedLeases = /* @__PURE__ */ new Set();
	return {
		channelRuntime: {
			...baseRuntime,
			runtimeContexts: {
				...runtimeContexts,
				register: (registerParams) => {
					const lease = runtimeContexts.register(registerParams);
					const trackedLease = { dispose: () => {
						if (trackedLeases.delete(trackedLease)) lease.dispose();
					} };
					trackedLeases.add(trackedLease);
					return trackedLease;
				}
			}
		},
		dispose: () => {
			for (const lease of Array.from(trackedLeases)) lease.dispose();
		}
	};
}
//#endregion
export { watchChannelRuntimeContexts as i, getChannelRuntimeContext as n, registerChannelRuntimeContext as r, createTaskScopedChannelRuntime as t };
