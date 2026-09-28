import "./fs-safe-defaults-D3xd3zKO.mjs";
import "./fs-safe-advanced-CJC-NYf3.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { appendRegularFile, appendRegularFileSync, assertAbsolutePathInput, canonicalPathFromExistingAncestor, ensureDirectoryWithinRoot, findExistingAncestor, findExistingAncestor as findExistingAncestor$1, movePathToTrash, pathExists, pathExistsSync, readLocalFileFromRoots, readRegularFile, readRegularFileSync, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveLocalPathFromRootsSync, resolveRegularFileAppendFlags, statRegularFile, statRegularFileSync, withTimeout as withTimeout$1 } from "@openclaw/fs-safe/advanced";
import { FsSafeError as FsSafeError$1 } from "@openclaw/fs-safe/errors";
import { writeExternalFileWithinRoot } from "@openclaw/fs-safe/output";
import { openLocalFileSafely, readLocalFileSafely, resolveOpenedFileRealPathForHandle, root } from "@openclaw/fs-safe/root";
import { isPathInside } from "@openclaw/fs-safe/path";
import { readSecureFile } from "@openclaw/fs-safe/secure-file";
import { walkDirectory as walkDirectory$1, walkDirectorySync } from "@openclaw/fs-safe/walk";
//#region src/infra/fs-safe.ts
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
		nonBlockingRead: params.nonBlockingRead,
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
export { writeExternalFileWithinRoot$1 as A, resolveRegularFileAppendFlags as C, walkDirectory$1 as D, statRegularFileSync as E, walkDirectorySync as O, resolveOpenedFileRealPathForHandle as S, statRegularFile as T, readRegularFileSync as _, canonicalPathFromExistingAncestor as a, resolveAbsolutePathForWrite as b, isPathInside as c, pathExists as d, pathExistsSync as f, readRegularFile as g, readLocalFileSafely as h, assertAbsolutePathInput as i, writeFileWithinRoot as j, withTimeout$1 as k, movePathToTrash as l, readLocalFileFromRoots as m, appendRegularFile as n, ensureAbsoluteDirectory$1 as o, readFileWithinRoot as p, appendRegularFileSync as r, findExistingAncestor$1 as s, FsSafeError$1 as t, openLocalFileSafely as u, readSecureFile as v, root$1 as w, resolveLocalPathFromRootsSync as x, resolveAbsolutePathForRead as y };
