import { c as asFiniteNumberInRange } from "./number-coercion-CLj0HTDM.mjs";
//#region src/channels/location.ts
function readOptionalLocationText(value, label) {
	if (value === void 0) return;
	if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be a non-empty string.`);
	return value.trim();
}
/** Normalize a portable location payload at an outbound/plugin boundary. */
function normalizeOutboundLocation(value, label = "location") {
	if (value == null) return;
	if (typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
	const raw = value;
	const rawLatitude = raw.latitude;
	const rawLongitude = raw.longitude;
	const latitude = asFiniteNumberInRange(rawLatitude, {
		min: -90,
		max: 90
	});
	if (latitude === void 0) throw new Error(`${label}.latitude must be a finite number between -90 and 90.`);
	const longitude = asFiniteNumberInRange(rawLongitude, {
		min: -180,
		max: 180
	});
	if (longitude === void 0) throw new Error(`${label}.longitude must be a finite number between -180 and 180.`);
	const rawAccuracy = raw.accuracy;
	const accuracy = asFiniteNumberInRange(rawAccuracy, {
		min: 0,
		max: 1500
	});
	if (rawAccuracy !== void 0 && accuracy === void 0) throw new Error(`${label}.accuracy must be a finite number between 0 and 1500.`);
	for (const unsupportedField of [
		"source",
		"isLive",
		"caption"
	]) if (raw[unsupportedField] !== void 0) throw new Error(`${label}.${unsupportedField} is not supported for outbound locations.`);
	const name = readOptionalLocationText(raw.name, `${label}.name`);
	const address = readOptionalLocationText(raw.address, `${label}.address`);
	return {
		latitude,
		longitude,
		...accuracy !== void 0 ? { accuracy } : {},
		...name ? { name } : {},
		...address ? { address } : {}
	};
}
function resolveLocation(location) {
	const source = location.source ?? (location.isLive ? "live" : location.name || location.address ? "place" : "pin");
	const isLive = location.isLive ?? source === "live";
	return {
		...location,
		source,
		isLive
	};
}
function formatAccuracy(accuracy) {
	if (!Number.isFinite(accuracy)) return "";
	return ` ±${Math.round(accuracy ?? 0)}m`;
}
function formatCoords(latitude, longitude) {
	return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}
/**
* Formats the safe inline location body shown to the model.
*
* Channel-provided labels, addresses, and captions are intentionally excluded
* here; `toLocationContext` carries them into the untrusted metadata block.
*/
function formatLocationText(location) {
	const resolved = resolveLocation(location);
	const coords = formatCoords(resolved.latitude, resolved.longitude);
	const accuracy = formatAccuracy(resolved.accuracy);
	if (resolved.source === "live" || resolved.isLive) return `🛰 Live location: ${coords}${accuracy}`;
	return `📍 ${coords}${accuracy}`;
}
/** Converts a normalized location into template context fields for prompt metadata. */
function toLocationContext(location) {
	const resolved = resolveLocation(location);
	return {
		LocationLat: resolved.latitude,
		LocationLon: resolved.longitude,
		LocationAccuracy: resolved.accuracy,
		LocationName: resolved.name,
		LocationAddress: resolved.address,
		LocationSource: resolved.source,
		LocationIsLive: resolved.isLive,
		LocationCaption: resolved.caption
	};
}
//#endregion
export { normalizeOutboundLocation as n, toLocationContext as r, formatLocationText as t };
