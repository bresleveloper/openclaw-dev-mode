import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { createHash } from "node:crypto";
//#region extensions/device-pair/notify-state.ts
const DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE = "notify-subscribers";
const DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE = "notify-seen-requests";
const DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES = 1024;
const DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES = 4096;
const DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS = 864e5;
function normalizeNotifyThreadKey(messageThreadId) {
	if (typeof messageThreadId === "number" && Number.isFinite(messageThreadId)) return String(Math.trunc(messageThreadId));
	if (typeof messageThreadId !== "string") return "";
	const normalized = normalizeOptionalString(messageThreadId);
	if (!normalized) return "";
	if (!/^-?\d+$/u.test(normalized)) return normalized;
	try {
		return BigInt(normalized).toString();
	} catch {
		return normalized;
	}
}
function notifySubscriberKey(subscriber) {
	return JSON.stringify([
		subscriber.to,
		subscriber.accountId ?? "",
		normalizeNotifyThreadKey(subscriber.messageThreadId)
	]);
}
function hashStoreKey(value) {
	return createHash("sha256").update(value).digest("hex");
}
function notifySubscriberStoreKey(subscriber) {
	return hashStoreKey(notifySubscriberKey(subscriber));
}
function notifyRequestStoreKey(requestId) {
	return hashStoreKey(requestId);
}
//#endregion
export { DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE as a, DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES as i, DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES as n, notifyRequestStoreKey as o, DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE as r, notifySubscriberStoreKey as s, DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS as t };
