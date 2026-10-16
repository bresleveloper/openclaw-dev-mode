import fs from "node:fs";
import path from "node:path";
import { resolvePathPrefixSync } from "@openclaw/fs-safe/advanced";
import { hasNodeErrorCode } from "@openclaw/fs-safe/path";
import { tryReadJsonSync, writeJsonSync } from "@openclaw/fs-safe/json";
//#region src/infra/json-file.ts
function resolveJsonSaveTarget(pathname) {
	if (!fs.lstatSync(pathname, { throwIfNoEntry: false })?.isSymbolicLink()) return pathname;
	const resolved = resolvePathPrefixSync(pathname);
	const target = [resolved.existingPath, ...resolved.unresolvedSegments].join(path.sep);
	fs.statSync(path.dirname(target));
	return target;
}
function writeJsonTarget(pathname, data) {
	writeJsonSync(resolveJsonSaveTarget(pathname), data);
}
function loadJsonFileThroughSymlink(pathname) {
	let resolved;
	try {
		resolved = fs.realpathSync(pathname);
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ELOOP")) return;
		throw error;
	}
	return tryReadJsonSync(resolved) ?? void 0;
}
//#endregion
export { resolveJsonSaveTarget as n, writeJsonTarget as r, loadJsonFileThroughSymlink as t };
