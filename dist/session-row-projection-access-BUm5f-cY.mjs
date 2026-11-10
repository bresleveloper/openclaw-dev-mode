import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as SessionRowProjectionBinding } from "./session-row-projection-binding-_jtkstu1.mjs";
//#region src/gateway/session-row-projection-access.ts
const projections = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowProjectionOwners"), () => /* @__PURE__ */ new WeakMap());
/** Context copies retain the original instance binding; the runtime owns disposal. */
function bindSessionRowProjection(context, read) {
	const binding = projections.get(context)?.binding ?? new SessionRowProjectionBinding(context, (query) => {
		return projections.get(context)?.read()?.readCapabilityEntry(query);
	});
	projections.set(context, {
		read,
		binding
	});
	return Object.assign(context, { sessionRowProjectionOwner: binding });
}
function getSessionRowProjection(context) {
	const binding = context?.sessionRowProjectionOwner;
	return binding instanceof SessionRowProjectionBinding ? projections.get(binding.owner)?.read() : void 0;
}
function requireSessionRowProjection(context) {
	const projection = getSessionRowProjection(context);
	if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
	return projection;
}
//#endregion
export { getSessionRowProjection as n, requireSessionRowProjection as r, bindSessionRowProjection as t };
