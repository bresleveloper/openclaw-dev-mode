import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { resolvePathViaExistingAncestorSync, resolveRootPath, resolveRootPathSync as resolveRootPathSync$1 } from "@openclaw/fs-safe/advanced";
import { safeRealpathSync, safeRealpathSync as safeRealpathSync$1 } from "@openclaw/fs-safe/path";
//#region src/infra/boundary-path.ts
const runInBoundaryPathContext = AsyncLocalStorage.snapshot();
function resolvePathViaExistingAncestorSync$1(targetPath) {
	return runInBoundaryPathContext(resolvePathViaExistingAncestorSync, targetPath);
}
/** Returns a canonical path when resolvable, otherwise an absolute lexical path. */
function resolveRealpathOrAbsolute(value) {
	return safeRealpathSync(value) ?? path.resolve(value);
}
function resolveIdentityPathViaExistingAncestorSync(targetPath) {
	const fallback = path.resolve(targetPath);
	const missingSegments = [];
	let cursor = fallback;
	while (true) try {
		return path.join(fs.realpathSync.native(cursor), ...missingSegments.toReversed());
	} catch {
		const parent = path.dirname(cursor);
		if (parent === cursor) return fallback;
		missingSegments.push(path.basename(cursor));
		cursor = parent;
	}
}
//#endregion
export { resolveRootPathSync$1 as a, resolveRootPath as i, resolvePathViaExistingAncestorSync$1 as n, safeRealpathSync$1 as o, resolveRealpathOrAbsolute as r, resolveIdentityPathViaExistingAncestorSync as t };
