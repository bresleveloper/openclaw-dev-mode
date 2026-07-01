import { x as isPlainObject } from "./utils-BApvfmPs.js";
import { t as isBlockedObjectKey } from "./prototype-keys-D2nJOZIy.js";
//#region src/config/config-paths.ts
/** Parses CLI/config dot-notation paths and rejects unsafe object-key segments. */
function parseConfigPath(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return {
		ok: false,
		error: "Invalid path. Use dot notation (e.g. foo.bar)."
	};
	const parts = trimmed.split(".").map((part) => part.trim());
	if (parts.some((part) => !part)) return {
		ok: false,
		error: "Invalid path. Use dot notation (e.g. foo.bar)."
	};
	if (parts.some((part) => isBlockedObjectKey(part))) return {
		ok: false,
		error: "Invalid path segment."
	};
	return {
		ok: true,
		path: parts
	};
}
/** Sets a value at a validated config path, creating missing plain-object parents. */
function setConfigValueAtPath(root, path, value) {
	let cursor = root;
	for (let idx = 0; idx < path.length - 1; idx += 1) {
		const key = path[idx];
		const next = cursor[key];
		if (!isPlainObject(next)) cursor[key] = {};
		cursor = cursor[key];
	}
	cursor[path[path.length - 1]] = value;
}
/** Removes a value at a config path and prunes empty parent objects created by setters. */
function unsetConfigValueAtPath(root, path) {
	const stack = [];
	let cursor = root;
	for (let idx = 0; idx < path.length - 1; idx += 1) {
		const key = path[idx];
		const next = cursor[key];
		if (!isPlainObject(next)) return false;
		stack.push({
			node: cursor,
			key
		});
		cursor = next;
	}
	const leafKey = path[path.length - 1];
	if (!(leafKey in cursor)) return false;
	delete cursor[leafKey];
	for (let idx = stack.length - 1; idx >= 0; idx -= 1) {
		const { node, key } = stack[idx];
		const child = node[key];
		if (isPlainObject(child) && Object.keys(child).length === 0) delete node[key];
		else break;
	}
	return true;
}
/** Reads a value from a config path, stopping at the first non-plain-object parent. */
function getConfigValueAtPath(root, path) {
	let cursor = root;
	for (const key of path) {
		if (!isPlainObject(cursor)) return;
		cursor = cursor[key];
	}
	return cursor;
}
//#endregion
export { unsetConfigValueAtPath as i, parseConfigPath as n, setConfigValueAtPath as r, getConfigValueAtPath as t };
