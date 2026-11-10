//#region extensions/x/src/work-origin.ts
const stores = /* @__PURE__ */ new WeakMap();
function createStore(runtime) {
	return runtime.state.openKeyedStore({
		namespace: "x.work-origin",
		maxEntries: 1e5,
		overflowPolicy: "reject-new"
	});
}
function openXWorkOrigins(runtime) {
	let store = stores.get(runtime);
	if (!store) {
		store = createStore(runtime);
		stores.set(runtime, store);
	}
	return store;
}
function originGuidance(origin) {
	return `This session was started from an X post by @${origin.authorHandle}: ${origin.postUrl}. Replies to X are manual. Never post to X on your own. When you have a result worth sharing (finding, fix, PR, or a clear "can't reproduce"), draft a reply of at most 280 characters with the key result and any PR link, show it to the user, and ask whether to post it. Post only after the user explicitly says so in this session, using the message tool with channel "x" and that post URL as the target. If the user has not answered, remind them once at the end of your final summary.\nUse accountId ${JSON.stringify(origin.accountId)} for that message-tool reply.`;
}
function registerXWorkOriginGuidance(api) {
	api.on("before_prompt_build", async (_event, ctx) => {
		if (!ctx.sessionKey) return;
		const origin = await openXWorkOrigins(api.runtime).lookup(ctx.sessionKey);
		return origin ? { appendSystemContext: originGuidance(origin) } : void 0;
	});
}
//#endregion
export { registerXWorkOriginGuidance as n, openXWorkOrigins as t };
