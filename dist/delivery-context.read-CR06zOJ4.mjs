//#region src/utils/delivery-context.read.ts
/** Reads only the canonical persisted delivery record. */
function deliveryContextFromSession(entry) {
	return entry?.delivery?.kind === "external" ? entry.delivery.context : void 0;
}
function sessionDeliveryRoute(entry) {
	return entry?.delivery?.kind === "external" ? entry.delivery.route : void 0;
}
function sessionDeliveryOrigin(entry) {
	return entry?.delivery?.kind === "external" ? entry.delivery.origin : void 0;
}
function sessionDeliveryChannel(entry) {
	const delivery = entry?.delivery;
	return delivery?.kind === "external" ? delivery.context.channel ?? delivery.origin.provider : void 0;
}
//#endregion
export { sessionDeliveryRoute as i, sessionDeliveryChannel as n, sessionDeliveryOrigin as r, deliveryContextFromSession as t };
