import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
//#region src/agents/sessions/session-persistence-deprecation.ts
const warned = resolveGlobalSingleton(Symbol.for("openclaw.sessionPersistenceDeprecations"), () => /* @__PURE__ */ new Set());
function warnSessionPersistenceDeprecation(method, replacement, options) {
	const key = options ? JSON.stringify([options.pluginId, method]) : method;
	if (warned.has(key)) return;
	warned.add(key);
	process.emitWarning(`${options ? `Plugin ${options.pluginId}: ` : ""}${method} is deprecated; await ${replacement} instead. Removal: next Plugin SDK major.`, {
		code: "DEP_SESSION_PERSISTENCE",
		type: "DeprecationWarning"
	});
}
//#endregion
export { warnSessionPersistenceDeprecation as t };
