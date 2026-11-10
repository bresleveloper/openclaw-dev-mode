//#region src/auto-reply/command-owner-authority.ts
const COMMAND_OWNER_AUTHORITY = Symbol("openclaw.commandOwnerAuthority");
var CommandOwnerRevokedError = class extends Error {};
const capabilities = /* @__PURE__ */ new WeakMap();
/** Host ingress binds a live check; ordinary context copies retain it, wire data cannot. */
function bindCommandOwnerAuthority(context, authority) {
	const checkCurrent = authority.isCurrent.bind(authority);
	const operatorAuthority = authority.operatorAuthority;
	const capability = {
		recoveryReference: authority.recoveryReference && Object.freeze({ ...authority.recoveryReference }),
		operatorAuthority,
		isCurrent: () => checkCurrent()
	};
	Object.setPrototypeOf(capability, null);
	Object.freeze(capability);
	capabilities.set(capability, capability);
	Object.assign(context, { [COMMAND_OWNER_AUTHORITY]: capability });
}
function getCommandOwnerAuthority(context) {
	const value = Reflect.get(context, COMMAND_OWNER_AUTHORITY);
	return typeof value === "object" && value !== null ? capabilities.get(value) : void 0;
}
/** Fence a turn that admitted owner tools against later identity or role revocation. */
function captureCommandOwnerAssertion(context) {
	const authority = getCommandOwnerAuthority(context);
	if (!authority) return;
	return Object.assign(() => {
		if (!authority.isCurrent()) throw new CommandOwnerRevokedError("Channel operator authority changed; send a new request.");
	}, { recoveryReference: authority.recoveryReference ?? null });
}
//#endregion
export { getCommandOwnerAuthority as i, bindCommandOwnerAuthority as n, captureCommandOwnerAssertion as r, CommandOwnerRevokedError as t };
