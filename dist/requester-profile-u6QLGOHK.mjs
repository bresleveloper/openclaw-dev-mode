//#region src/auto-reply/requester-profile.ts
const REQUESTER_PROFILE = Symbol("openclaw.requesterProfile");
function requesterBinding(context) {
	return [
		context.SenderId,
		context.AccountId,
		context.Provider,
		context.Surface,
		context.OriginatingChannel
	];
}
var RequesterProfile = class {
	#profile;
	#binding;
	constructor(context, profile) {
		this.#profile = Object.freeze({ ...profile });
		this.#binding = Object.freeze(requesterBinding(context));
		Object.setPrototypeOf(this, null);
		Object.freeze(this);
	}
	static read(value, context) {
		if (typeof value !== "object" || value === null || !(#profile in value)) return;
		const binding = context && requesterBinding(context);
		return (!binding || value.#binding.every((part, index) => part === binding[index])) && value.#profile.isCurrent() ? value.#profile : void 0;
	}
};
/** Host-only, live identity fact: survives context copies, never JSON or plugin-authored fields. */
function bindRequesterProfile(context, profile) {
	Object.assign(context, { [REQUESTER_PROFILE]: new RequesterProfile(context, profile) });
}
function getRequesterProfile(context) {
	return RequesterProfile.read(Reflect.get(context, REQUESTER_PROFILE), context);
}
/** Transfer verified ingress identity to its runtime carrier, never serialized requester facts. */
function transferRequesterProfile(context, carrier) {
	if (getRequesterProfile(context)) Object.assign(carrier, { [REQUESTER_PROFILE]: Reflect.get(context, REQUESTER_PROFILE) });
}
function readTransferredRequesterProfile(carrier) {
	return RequesterProfile.read(Reflect.get(carrier, REQUESTER_PROFILE));
}
//#endregion
export { transferRequesterProfile as i, getRequesterProfile as n, readTransferredRequesterProfile as r, bindRequesterProfile as t };
