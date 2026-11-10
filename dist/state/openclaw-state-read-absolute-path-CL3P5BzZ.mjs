import { dt as realpathSync$1 } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { b as FsSafeError, d as assertNoWindowsPathAlias, g as resolvePathPreservingWindowsRoot, m as pathForWindowsFilesystem } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import fs from "node:fs";
import path from "node:path";
import "node:fs/promises";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/absolute-path.js
function assertAbsolutePathInput(filePath) {
	if (!filePath) throw new FsSafeError("invalid-path", "path is required");
	if (filePath.includes("\0")) throw new FsSafeError("invalid-path", "path must not contain NUL bytes");
	assertNoWindowsPathAlias(filePath);
	if (!path.isAbsolute(filePath)) throw new FsSafeError("invalid-path", "path must be absolute");
	const normalized = path.normalize(filePath);
	assertNoWindowsPathAlias(normalized);
	return normalized;
}
async function findExistingAncestor(filePath) {
	assertNoWindowsPathAlias(filePath);
	let current = resolvePathPreservingWindowsRoot(filePath);
	assertNoWindowsPathAlias(current);
	while (true) {
		try {
			fs.lstatSync(pathForWindowsFilesystem(current));
			return current;
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
		}
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
async function canonicalPathFromExistingAncestor(filePath) {
	assertNoWindowsPathAlias(filePath);
	const ancestor = await findExistingAncestor(filePath);
	if (!ancestor) {
		const resolved = resolvePathPreservingWindowsRoot(filePath);
		assertNoWindowsPathAlias(resolved);
		return resolved;
	}
	let canonicalAncestor = ancestor;
	let resolvedAncestor;
	try {
		resolvedAncestor = realpathSync$1.native(pathForWindowsFilesystem(ancestor));
	} catch {}
	if (resolvedAncestor !== void 0) {
		assertNoWindowsPathAlias(resolvedAncestor);
		canonicalAncestor = resolvedAncestor;
	}
	const relative = path.relative(ancestor, filePath);
	const canonicalPath = relative ? path.join(canonicalAncestor, relative) : canonicalAncestor;
	assertNoWindowsPathAlias(canonicalPath);
	return canonicalPath;
}
//#endregion
export { canonicalPathFromExistingAncestor as n, assertAbsolutePathInput as t };
