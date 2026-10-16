//#region src/infra/outbound/delivery-queue-types.ts
function hasActiveDeliveryOwner(entry, now) {
	return (typeof entry.completionRetention === "object" || entry.completionRetention === "permanent" || entry.requiresProducerClaim === true) && (entry.recoveryState === "producer_claimed" || (entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send") && entry.requiresProducerClaim === true) && typeof entry.availableAt === "number" && entry.availableAt > now;
}
//#endregion
export { hasActiveDeliveryOwner as t };
