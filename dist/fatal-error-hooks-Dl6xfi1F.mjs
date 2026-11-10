//#region src/infra/fatal-error-hooks.ts
const hooks = /* @__PURE__ */ new Set();
function registerFatalErrorHook(hook) {
	hooks.add(hook);
	return () => {
		hooks.delete(hook);
	};
}
function runFatalErrorHooks(context) {
	const messages = [];
	for (const hook of hooks) try {
		const message = hook(context);
		if (typeof message === "string" && message.trim()) messages.push(message);
	} catch (err) {
		const name = err instanceof Error && err.name ? err.name : "unknown";
		messages.push(`fatal-error hook failed: ${name}`);
	}
	return messages;
}
//#endregion
export { runFatalErrorHooks as n, registerFatalErrorHook as t };
