//#region src/plugins/runtime/gateway-context-binding-owner.ts
const gatewayContextBindingOwnerKey = Symbol("gatewayContextBindingOwner");
var GatewayContextBindingOwner = class {
	#owner;
	constructor(owner) {
		this.#owner = owner;
		Object.setPrototypeOf(this, null);
	}
	static read(value, owner) {
		return typeof value === "object" && value !== null && #owner in value && value.#owner === owner ? value : void 0;
	}
};
function getGatewayContextBindingSlot(owner) {
	const slot = Object.getOwnPropertyDescriptor(owner, gatewayContextBindingOwnerKey)?.value;
	return GatewayContextBindingOwner.read(slot, owner);
}
/** Reserve exact-owner storage before admission freezes the public context. */
function prepareGatewayContextBindingOwner(owner) {
	if (!getGatewayContextBindingSlot(owner)) Object.defineProperty(owner, gatewayContextBindingOwnerKey, { value: new GatewayContextBindingOwner(owner) });
	return owner;
}
//#endregion
export { prepareGatewayContextBindingOwner as n, getGatewayContextBindingSlot as t };
