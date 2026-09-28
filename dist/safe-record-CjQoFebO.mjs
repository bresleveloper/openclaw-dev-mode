//#region src/shared/safe-record.ts
/**
* Plugin values may use Proxy traps that throw during `Array.isArray`; keep this guard
* exception-safe so untrusted-plugin inspection cannot escape into the host.
*/
function isRecordWithoutThrowing(value) {
	try {
		return Boolean(value && typeof value === "object" && !Array.isArray(value));
	} catch {
		return false;
	}
}
/** Read one property from a record-like value without letting traps escape. */
function readRecordValue(value, key) {
	if (!isRecordWithoutThrowing(value)) return;
	try {
		return value[key];
	} catch {
		return;
	}
}
/** Copy array entries defensively from values that may throw on length/index access. */
function copyArrayEntries(value) {
	let isArray;
	try {
		isArray = Array.isArray(value);
	} catch {
		return [];
	}
	if (!isArray) return [];
	const arrayValue = value;
	let length;
	try {
		length = arrayValue.length;
	} catch {
		return [];
	}
	const entries = [];
	for (let index = 0; index < length; index += 1) try {
		entries.push(arrayValue[index]);
	} catch {
		continue;
	}
	return entries;
}
/** Copy record entries whose values are also record-shaped. */
function copyRecordEntries(value) {
	if (!isRecordWithoutThrowing(value)) return [];
	let keys;
	try {
		keys = Object.keys(value);
	} catch {
		return [];
	}
	const entries = [];
	for (const key of keys) {
		const entry = readRecordValue(value, key);
		if (isRecordWithoutThrowing(entry)) entries.push([key, entry]);
	}
	return entries;
}
//#endregion
export { readRecordValue as i, copyRecordEntries as n, isRecordWithoutThrowing as r, copyArrayEntries as t };
