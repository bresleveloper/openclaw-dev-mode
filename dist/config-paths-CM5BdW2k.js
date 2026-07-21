import { v as isPlainObject } from "./utils-CRO4LGEB.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
//#region src/config/config-paths.ts
function setOwnConfigProperty(node, key, value) {
	if (Object.hasOwn(node, key)) {
		node[key] = value;
		return;
	}
	Object.defineProperty(node, key, {
		configurable: true,
		enumerable: true,
		value,
		writable: true
	});
}
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
		const existing = Object.hasOwn(cursor, key) ? cursor[key] : void 0;
		const next = isPlainObject(existing) ? existing : {};
		if (next !== existing) setOwnConfigProperty(cursor, key, next);
		cursor = next;
	}
	setOwnConfigProperty(cursor, path[path.length - 1], value);
}
/** Removes a value at a config path and prunes empty parent objects created by setters. */
function unsetConfigValueAtPath(root, path) {
	const stack = [];
	let cursor = root;
	for (let idx = 0; idx < path.length - 1; idx += 1) {
		const key = path[idx];
		if (!Object.hasOwn(cursor, key)) return false;
		const next = cursor[key];
		if (!isPlainObject(next)) return false;
		stack.push({
			node: cursor,
			key
		});
		cursor = next;
	}
	const leafKey = path[path.length - 1];
	if (!Object.hasOwn(cursor, leafKey)) return false;
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
		if (!isPlainObject(cursor) || !Object.hasOwn(cursor, key)) return;
		cursor = cursor[key];
	}
	return cursor;
}
//#endregion
export { unsetConfigValueAtPath as i, parseConfigPath as n, setConfigValueAtPath as r, getConfigValueAtPath as t };
