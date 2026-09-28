import { a as canonicalPathFromExistingAncestor, w as root } from "./fs-safe-BAPek8At.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { n as matchesFileIdentity, t as fileIdentity } from "./path-binding-C1J9N7T4.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/file-transfer/src/node-host/file-write-path.ts
function fileWriteError(code, message, canonicalPath) {
	return {
		ok: false,
		code,
		message,
		...canonicalPath ? { canonicalPath } : {}
	};
}
async function canonicalTargetForSymlinkError(error, targetPath) {
	const causeCanonical = error.cause && typeof error.cause === "object" && "canonicalPath" in error.cause && typeof error.cause.canonicalPath === "string" ? error.cause.canonicalPath : void 0;
	if (causeCanonical) return causeCanonical;
	try {
		return await fs.realpath(targetPath);
	} catch {
		return await canonicalPathFromExistingAncestor(targetPath).catch(() => void 0);
	}
}
function symlinkRedirectError(code, canonicalPath) {
	return fileWriteError(code, "path traverses a symlink; refusing because followSymlinks=false (set plugins.entries.file-transfer.config.nodes.<node>.followSymlinks=true to allow, or update allowWritePaths to the canonical path)", canonicalPath);
}
function writeFsSafeError(error, targetPath) {
	if (error.code === "symlink") return fileWriteError("SYMLINK_TARGET_DENIED", `path is a symlink; refusing to write through it: ${targetPath}`);
	if (error.code === "not-file") return fileWriteError("IS_DIRECTORY", `path resolves to a directory: ${targetPath}`);
	if (error.code === "already-exists") return fileWriteError("EXISTS_NO_OVERWRITE", `file already exists and overwrite is false: ${targetPath}`);
	return fileWriteError("WRITE_ERROR", error.message, targetPath);
}
async function captureWriteBinding(canonicalTargetPath, targetIdentity) {
	let anchorPath = path.dirname(canonicalTargetPath);
	for (;;) try {
		const stats = await fs.stat(anchorPath, { bigint: true });
		if (!stats.isDirectory()) throw new Error(`write anchor is not a directory: ${anchorPath}`);
		const anchor = fileIdentity(stats);
		return {
			kind: "write",
			anchorPath,
			anchorDevice: anchor.device,
			anchorInode: anchor.inode,
			...targetIdentity ? {
				targetDevice: targetIdentity.device,
				targetInode: targetIdentity.inode
			} : {}
		};
	} catch (error) {
		if ((error && typeof error === "object" && "code" in error ? error.code : void 0) !== "ENOENT") throw error;
		const parent = path.dirname(anchorPath);
		if (parent === anchorPath) throw error;
		anchorPath = parent;
	}
}
async function openBoundWriteRoot(input) {
	let anchorRoot;
	try {
		anchorRoot = await root(input.binding.anchorPath);
		const anchorStats = await fs.stat(anchorRoot.rootReal, { bigint: true });
		if (!matchesFileIdentity(anchorStats, {
			device: input.binding.anchorDevice,
			inode: input.binding.anchorInode
		})) throw new Error("write anchor changed");
	} catch {
		return fileWriteError("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", input.canonicalTargetPath);
	}
	const relativeTarget = path.relative(anchorRoot.rootReal, input.canonicalTargetPath);
	if (!relativeTarget || path.isAbsolute(relativeTarget) || relativeTarget === ".." || relativeTarget.startsWith(`..${path.sep}`)) return fileWriteError("WRITE_ERROR", "write target is outside the authorized anchor");
	return {
		ok: true,
		anchorRoot,
		relativeTarget
	};
}
//#endregion
export { symlinkRedirectError as a, openBoundWriteRoot as i, captureWriteBinding as n, writeFsSafeError as o, fileWriteError as r, canonicalTargetForSymlinkError as t };
