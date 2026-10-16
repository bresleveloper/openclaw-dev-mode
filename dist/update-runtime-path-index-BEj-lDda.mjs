import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import path from "node:path";
//#region src/infra/update-runtime-path-index.ts
/**
* Index immutable lexical roots for one inventory/materialization operation.
* Ancestors select candidates, but the existing guard still decides containment.
* Input order, not the nearest ancestor, owns overlapping-root precedence.
*/
function createRuntimePathLookup(entries) {
	const paths = process.platform === "win32" ? path.win32 : path.posix;
	const windows = process.platform === "win32";
	const keyFor = (value) => {
		if (!paths.isAbsolute(value)) return;
		const resolved = paths.resolve(value);
		if (windows) {
			if (!/^[a-z]:\\/iu.test(resolved) && !/^\\\\[^?.\\][^\\]*\\[^\\]+/u.test(resolved) || resolved.includes(":", 2)) return;
			return resolved.toLowerCase();
		}
		return resolved;
	};
	const roots = Array.from(entries, ([root, value], order) => ({
		root,
		value,
		order
	}));
	const indexed = /* @__PURE__ */ new Map();
	const fallback = [];
	for (const entry of roots) {
		const key = keyFor(entry.root);
		if (key === void 0) fallback.push(entry);
		else {
			const bucket = indexed.get(key);
			if (bucket) bucket.push(entry);
			else indexed.set(key, [entry]);
		}
	}
	return (value) => {
		const key = keyFor(value);
		if (key === void 0) return roots.find((entry) => isPathInside(entry.root, value))?.value;
		let first;
		const consider = (candidates) => {
			for (const entry of candidates) {
				if (first && entry.order >= first.order) break;
				if (isPathInside(entry.root, value)) {
					first = entry;
					break;
				}
			}
		};
		for (let ancestor = key;; ancestor = paths.dirname(ancestor)) {
			const bucket = indexed.get(ancestor);
			if (bucket) consider(bucket);
			if (paths.dirname(ancestor) === ancestor) break;
		}
		consider(fallback);
		return first?.value;
	};
}
//#endregion
export { createRuntimePathLookup as t };
