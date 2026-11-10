//#region src/infra/outbound/delivery-queue-types.ts
function hasActiveDeliveryOwner(entry, now) {
	if (typeof entry.availableAt !== "number" || !(entry.availableAt > now)) return false;
	return entry.requiresProducerClaim === true ? entry.recoveryState === "producer_claimed" || entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send" : (typeof entry.completionRetention === "object" || entry.completionRetention === "permanent") && entry.recoveryState === "producer_claimed";
}
//#endregion
export { hasActiveDeliveryOwner as t };
