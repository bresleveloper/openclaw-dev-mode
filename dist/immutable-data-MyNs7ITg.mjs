import { isProxy } from "node:util/types";
//#region src/shared/immutable-data.ts
const deeplyFrozenPlainData = /* @__PURE__ */ new WeakSet();
function isPlainDataObject(value) {
	if (isProxy(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype || Array.isArray(value) && prototype === Array.prototype;
}
/** Immutable graphs keep their classification for exactly as long as their objects live. */
function isDeeplyFrozenPlainData(value) {
	if (!value || typeof value !== "object") return typeof value !== "function";
	if (deeplyFrozenPlainData.has(value)) return true;
	if (!isPlainDataObject(value) || !Object.isFrozen(value)) return false;
	const inspected = /* @__PURE__ */ new Set();
	const pending = [value];
	while (pending.length) {
		const candidate = pending.pop();
		if (inspected.has(candidate)) continue;
		if (!isPlainDataObject(candidate) || !Object.isFrozen(candidate)) return false;
		inspected.add(candidate);
		const childStart = pending.length;
		for (const key of Reflect.ownKeys(candidate)) {
			const descriptor = Object.getOwnPropertyDescriptor(candidate, key);
			if (!("value" in descriptor) || typeof descriptor.value === "function") return false;
			if (descriptor.value && typeof descriptor.value === "object" && !deeplyFrozenPlainData.has(descriptor.value)) pending.push(descriptor.value);
		}
		for (let left = childStart, right = pending.length - 1; left < right; left++, right--) {
			const child = pending[left];
			pending[left] = pending[right];
			pending[right] = child;
		}
	}
	for (const candidate of inspected) deeplyFrozenPlainData.add(candidate);
	return true;
}
/** Freeze an owner's cloned JSON snapshot without executing opaque members. */
function freezeJsonSnapshot(value) {
	const seen = /* @__PURE__ */ new Set();
	const visit = (candidate) => {
		if (!candidate || typeof candidate !== "object" || seen.has(candidate) || deeplyFrozenPlainData.has(candidate) || !isPlainDataObject(candidate)) return;
		seen.add(candidate);
		for (const key of Reflect.ownKeys(candidate)) {
			const descriptor = Object.getOwnPropertyDescriptor(candidate, key);
			if ("value" in descriptor) visit(descriptor.value);
		}
		Object.freeze(candidate);
	};
	visit(value);
	return value;
}
//#endregion
export { isDeeplyFrozenPlainData as n, freezeJsonSnapshot as t };
