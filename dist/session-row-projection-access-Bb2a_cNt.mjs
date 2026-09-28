//#region src/gateway/session-row-projection-access.ts
const projections = /* @__PURE__ */ new WeakMap();
/** Context copies retain the original instance binding; the runtime owns disposal. */
function bindSessionRowProjection(context, read) {
	projections.set(context, read);
	return Object.assign(context, { sessionRowProjectionOwner: context });
}
function getSessionRowProjection(context) {
	const owner = context?.sessionRowProjectionOwner;
	return owner ? projections.get(owner)?.() : void 0;
}
//#endregion
export { getSessionRowProjection as n, bindSessionRowProjection as t };
