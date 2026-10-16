import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/cron/store/delivery-codec.ts
/** JSON codec for cron delivery configuration and explicit destination clears. */
const FAILURE_DESTINATION_FIELDS = [
	"channel",
	"to",
	"accountId",
	"mode"
];
const CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE = "cron delivery requires an explicit mode: \"none\", \"announce\", or \"webhook\"; run openclaw doctor --fix for legacy settings or explicitly edit delivery.mode";
function hasCanonicalCronDeliveryMode(delivery) {
	return delivery === void 0 || isRecord(delivery) && (delivery.mode === "none" || delivery.mode === "announce" || delivery.mode === "webhook");
}
/** Unrepaired definitions remain readable; execution and authored writes require a mode. */
function assertCanonicalCronDeliveryMode(delivery) {
	if (!hasCanonicalCronDeliveryMode(delivery)) throw new Error(CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE);
}
/** Encodes explicitly undefined failure overrides as durable JSON null values. */
function deliveryToJson(delivery) {
	const failureDestination = delivery.failureDestination;
	if (!failureDestination) return { ...delivery };
	return {
		...delivery,
		failureDestination: Object.fromEntries(FAILURE_DESTINATION_FIELDS.filter((field) => Object.hasOwn(failureDestination, field)).map((field) => [field, failureDestination[field] ?? null]))
	};
}
/** Restores JSON null overrides as present-but-undefined runtime properties. */
function deliveryFromJson(value) {
	if (!isRecord(value) || !hasCanonicalCronDeliveryMode(value)) return;
	const failureDestination = value.failureDestination;
	if (!isRecord(failureDestination)) return value;
	return {
		...value,
		failureDestination: Object.fromEntries(FAILURE_DESTINATION_FIELDS.filter((field) => Object.hasOwn(failureDestination, field)).map((field) => [field, failureDestination[field] ?? void 0]))
	};
}
function decodeCronJobConfig(jobJson) {
	const delivery = deliveryFromJson(jobJson.delivery);
	return delivery ? {
		...jobJson,
		delivery
	} : jobJson;
}
//#endregion
export { hasCanonicalCronDeliveryMode as a, deliveryToJson as i, assertCanonicalCronDeliveryMode as n, decodeCronJobConfig as r, CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE as t };
