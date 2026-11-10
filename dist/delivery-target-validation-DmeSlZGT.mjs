//#region src/cron/delivery-target-validation.ts
/** Returns whether a delivery plan names a concrete channel, recipient, thread, or account. */
function hasExplicitCronDeliveryTarget(plan) {
	return Boolean(plan.channel && plan.channel !== "last" || plan.to || plan.threadId != null || plan.accountId);
}
function assertNonBlankStringField(field, value) {
	if (value === void 0 || value === null) return;
	if (typeof value !== "string" || !value.trim()) throw new Error(`${field} must be a non-empty string`);
}
function assertCronDeliveryInputNonBlankFields(delivery, fieldPrefix = "delivery") {
	if (!delivery || typeof delivery !== "object") return;
	const deliveryRecord = delivery;
	assertNonBlankStringField(`${fieldPrefix}.channel`, deliveryRecord.channel);
	assertNonBlankStringField(`${fieldPrefix}.to`, deliveryRecord.to);
	const failureDestination = deliveryRecord.failureDestination;
	if (failureDestination && typeof failureDestination === "object") {
		const failureRecord = failureDestination;
		assertNonBlankStringField(`${fieldPrefix}.failureDestination.channel`, failureRecord.channel);
		assertNonBlankStringField(`${fieldPrefix}.failureDestination.to`, failureRecord.to);
	}
	const completionDestination = deliveryRecord.completionDestination;
	if (completionDestination && typeof completionDestination === "object") {
		const completionRecord = completionDestination;
		assertNonBlankStringField(`${fieldPrefix}.completionDestination.to`, completionRecord.to);
	}
}
//#endregion
export { hasExplicitCronDeliveryTarget as n, assertCronDeliveryInputNonBlankFields as t };
