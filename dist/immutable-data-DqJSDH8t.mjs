import { isProxy } from "node:util/types";
//#region src/shared/immutable-data.ts
const deeplyFrozenPlainData = /* @__PURE__ */ new WeakSet();
function isPlainDataObject(value) {
	if (isProxy(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype || Array.isArray(value) && prototype === Array.prototype;
}
function inspectPlainData(value, freeze, requireFrozen = true) {
	if (!value || typeof value !== "object") return typeof value !== "function";
	if (deeplyFrozenPlainData.has(value)) return true;
	if (!freeze && requireFrozen && (isProxy(value) || !Object.isFrozen(value))) return false;
	let plain = true;
	const inspected = /* @__PURE__ */ new Set();
	const pending = [value];
	while (pending.length) {
		const candidate = pending.pop();
		if (inspected.has(candidate)) continue;
		if (!isPlainDataObject(candidate)) {
			if (!freeze) return false;
			plain = false;
			continue;
		}
		if (!freeze && requireFrozen && !Object.isFrozen(candidate)) return false;
		inspected.add(candidate);
		for (const key of Reflect.ownKeys(candidate)) {
			const descriptor = Object.getOwnPropertyDescriptor(candidate, key);
			const member = descriptor.value;
			if (!("value" in descriptor) || typeof member === "function") {
				if (!freeze) return false;
				plain = false;
				continue;
			}
			if (member && typeof member === "object" && !deeplyFrozenPlainData.has(member)) pending.push(member);
		}
		if (freeze) Object.freeze(candidate);
	}
	if (plain && (freeze || requireFrozen)) for (const candidate of inspected) deeplyFrozenPlainData.add(candidate);
	return plain;
}
/** Inspect mutable plain graphs without caching them or reading accessors. */
function isPlainData(value) {
	return inspectPlainData(value, false, false);
}
/** Immutable graphs keep their classification for exactly as long as their objects live. */
function isDeeplyFrozenPlainData(value) {
	return inspectPlainData(value, false);
}
/** Freeze an owner's cloned JSON snapshot without executing opaque members. */
function freezeJsonSnapshot(value) {
	inspectPlainData(value, true);
	return value;
}
//#endregion
export { isDeeplyFrozenPlainData as n, isPlainData as r, freezeJsonSnapshot as t };
