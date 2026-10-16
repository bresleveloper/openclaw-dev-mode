import path from "node:path";
import fs from "node:fs/promises";
import { appendRegularFile as appendRegularFile$1, appendRegularFileSync as appendRegularFileSync$1, assertAbsolutePathInput, canonicalPathFromExistingAncestor as canonicalPathFromExistingAncestor$1, ensureDirectoryWithinRoot, findExistingAncestor, findExistingAncestor as findExistingAncestor$1, movePathToTrash, pathExists as pathExists$1, pathExistsSync, readLocalFileFromRoots, readRegularFile as readRegularFile$1, readRegularFileSync as readRegularFileSync$1, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveLocalPathFromRootsSync, resolveRegularFileAppendFlags, sanitizeUntrustedFileName as sanitizeUntrustedFileName$1, statRegularFile, statRegularFileSync, withTimeout as withTimeout$1 } from "@openclaw/fs-safe/advanced";
import { FsSafeError as FsSafeError$1 } from "@openclaw/fs-safe/errors";
import { writeExternalFileWithinRoot } from "@openclaw/fs-safe/output";
import { openLocalFileSafely as openLocalFileSafely$1, readLocalFileSafely, resolveOpenedFileRealPathForHandle, root } from "@openclaw/fs-safe/root";
import { isPathInside as isPathInside$1 } from "@openclaw/fs-safe/path";
import { readSecureFile } from "@openclaw/fs-safe/secure-file";
import { walkDirectory as walkDirectory$1, walkDirectorySync as walkDirectorySync$1 } from "@openclaw/fs-safe/walk";
//#region src/infra/fs-safe.ts
const readLocalFileFromRoots$1 = readLocalFileFromRoots;
async function root$1(rootDir, defaults) {
	return await root(rootDir, defaults);
}
async function ensureAbsoluteDirectory$1(dirPath, options) {
	const absolutePath = path.resolve(dirPath);
	const scopeLabel = options?.scopeLabel ?? "directory";
	const existingAncestor = await findExistingAncestor(absolutePath);
	if (!existingAncestor) return {
		ok: false,
		error: /* @__PURE__ */ new Error(`Invalid path: must stay within ${scopeLabel}`)
	};
	if (existingAncestor === absolutePath) {
		try {
			const stat = await fs.lstat(absolutePath);
			if (!stat.isSymbolicLink() && stat.isDirectory()) return {
				ok: true,
				path: absolutePath
			};
		} catch {}
		return {
			ok: false,
			error: /* @__PURE__ */ new Error(`Invalid path: must stay within ${scopeLabel}`)
		};
	}
	const result = await ensureDirectoryWithinRoot({
		rootDir: existingAncestor,
		requestedPath: path.relative(existingAncestor, absolutePath),
		scopeLabel,
		mode: options?.mode
	});
	if (result.ok) return result;
	return {
		ok: false,
		error: new Error(result.error)
	};
}
async function writeExternalFileWithinRoot$1(options) {
	const requestedPath = path.resolve(options.rootDir, options.path);
	const result = await writeExternalFileWithinRoot({
		rootDir: options.rootDir,
		path: options.path,
		write: options.write,
		staging: "sibling",
		producerIsolation: "private-directory",
		fallbackFileName: options.fallbackFileName ?? options.tempPrefix
	});
	return { path: path.join(path.dirname(requestedPath), path.basename(result.path)) };
}
/** @deprecated Use root(rootDir).read(relativePath, options). */
async function readFileWithinRoot(params) {
	return await (await root(params.rootDir)).read(params.relativePath, {
		hardlinks: params.rejectHardlinks === false ? "allow" : "reject",
		maxBytes: params.maxBytes,
		symlinks: params.allowSymlinkTargetWithinRoot === true ? "follow-within-root" : "reject"
	});
}
/** @deprecated Use root(rootDir).write(relativePath, data, options). */
async function writeFileWithinRoot(params) {
	await (await root$1(params.rootDir)).write(params.relativePath, params.data, {
		encoding: params.encoding,
		mkdir: params.mkdir
	});
}
//#endregion
export { withTimeout$1 as A, resolveRegularFileAppendFlags as C, statRegularFileSync as D, statRegularFile as E, writeFileWithinRoot as M, walkDirectory$1 as O, resolveOpenedFileRealPathForHandle as S, sanitizeUntrustedFileName$1 as T, readRegularFileSync$1 as _, canonicalPathFromExistingAncestor$1 as a, resolveAbsolutePathForWrite as b, isPathInside$1 as c, pathExists$1 as d, pathExistsSync as f, readRegularFile$1 as g, readLocalFileSafely as h, assertAbsolutePathInput as i, writeExternalFileWithinRoot$1 as j, walkDirectorySync$1 as k, movePathToTrash as l, readLocalFileFromRoots$1 as m, appendRegularFile$1 as n, ensureAbsoluteDirectory$1 as o, readFileWithinRoot as p, appendRegularFileSync$1 as r, findExistingAncestor$1 as s, FsSafeError$1 as t, openLocalFileSafely$1 as u, readSecureFile as v, root$1 as w, resolveLocalPathFromRootsSync as x, resolveAbsolutePathForRead as y };
