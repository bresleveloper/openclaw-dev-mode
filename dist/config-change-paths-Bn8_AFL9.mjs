import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/config-change-paths.ts
function collectConfigWriteChangedPaths(base, target, explicitPaths) {
	const changedPaths = /* @__PURE__ */ new Set();
	collectChangedPaths(base, target, "", changedPaths);
	for (const changedPath of explicitPaths) {
		const normalizedPath = changedPath.filter((segment) => segment.length > 0).join(".");
		if (normalizedPath) changedPaths.add(normalizedPath);
	}
	return changedPaths;
}
function collectChangedPaths(base, target, path, output) {
	if (Object.is(base, target)) return;
	if (Array.isArray(base) && Array.isArray(target)) {
		const max = Math.max(base.length, target.length);
		for (let index = 0; index < max; index += 1) {
			const childPath = path ? `${path}[${index}]` : `[${index}]`;
			if (index >= base.length || index >= target.length) {
				output.add(childPath);
				continue;
			}
			collectChangedPaths(base[index], target[index], childPath, output);
		}
		return;
	}
	if (isRecord(base) && isRecord(target)) {
		const keys = /* @__PURE__ */ new Set([...Object.keys(base), ...Object.keys(target)]);
		for (const key of keys) {
			const childPath = path ? `${path}.${key}` : key;
			const hasBase = Object.hasOwn(base, key);
			if (!Object.hasOwn(target, key) || !hasBase) {
				output.add(childPath);
				continue;
			}
			collectChangedPaths(base[key], target[key], childPath, output);
		}
		return;
	}
	if (!isDeepStrictEqual(base, target)) output.add(path);
}
//#endregion
export { collectConfigWriteChangedPaths as n, collectChangedPaths as t };
