import { a as canonicalPathFromExistingAncestor, b as resolveAbsolutePathForWrite, t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { n as matchesFileIdentity, r as readPathBinding, t as fileIdentity } from "./path-binding-C1J9N7T4.mjs";
import { r as rejectCanonicalPathChange } from "./path-errors-nBD272aa.mjs";
import { a as symlinkRedirectError, i as openBoundWriteRoot, n as captureWriteBinding, o as writeFsSafeError, r as fileWriteError, t as canonicalTargetForSymlinkError } from "./file-write-path-DDwPb01l.mjs";
import { t as inspectStrictBase64 } from "./base64-DHgbKH6a.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { overwriteFileHandle } from "@openclaw/fs-safe/advanced";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/node-host/file-write.ts
const MAX_CONTENT_BYTES = 16777216;
function sha256Hex(buf) {
	return crypto.createHash("sha256").update(buf).digest("hex");
}
async function writeBoundTarget(input) {
	const expectedTarget = input.binding.targetDevice && input.binding.targetInode ? {
		device: input.binding.targetDevice,
		inode: input.binding.targetInode
	} : void 0;
	if (expectedTarget) {
		let handle;
		try {
			handle = await fs.open(input.canonicalTargetPath, "r+");
		} catch {
			return fileWriteError("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", input.canonicalTargetPath);
		}
		try {
			const stats = await handle.stat({ bigint: true });
			if (!stats.isFile() || !matchesFileIdentity(stats, expectedTarget)) return fileWriteError("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", input.canonicalTargetPath);
			if (input.rejectHardlinks && stats.nlink > 1n) return fileWriteError("HARDLINK_TARGET_DENIED", "refusing to overwrite a file with hard links");
			await overwriteFileHandle(handle, input.buffer);
			await handle.sync();
			return {
				ok: true,
				path: input.canonicalTargetPath,
				overwritten: true,
				identity: fileIdentity(stats)
			};
		} finally {
			await handle.close().catch(() => void 0);
		}
	}
	const anchor = await openBoundWriteRoot(input);
	if (!anchor.ok) return anchor;
	const { anchorRoot, relativeTarget } = anchor;
	try {
		await anchorRoot.create(relativeTarget, input.buffer, { mkdir: true });
		const opened = await anchorRoot.open(relativeTarget);
		try {
			const stats = await opened.handle.stat({ bigint: true });
			return {
				ok: true,
				path: opened.realPath,
				overwritten: false,
				identity: fileIdentity(stats)
			};
		} finally {
			await opened.handle.close().catch(() => void 0);
		}
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "already-exists") return fileWriteError("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", input.canonicalTargetPath);
		if (error instanceof FsSafeError) return writeFsSafeError(error, input.canonicalTargetPath);
		return fileWriteError("WRITE_ERROR", `failed to write file: ${String(error)}`);
	}
}
async function handleFileWrite(params) {
	const rawPath = typeof params?.path === "string" ? params.path : "";
	const hasContentBase64 = typeof params?.contentBase64 === "string";
	const contentBase64 = hasContentBase64 ? params.contentBase64 : "";
	const overwrite = params?.overwrite === true;
	const createParents = params?.createParents === true;
	const expectedSha256 = typeof params?.expectedSha256 === "string" ? params.expectedSha256 : void 0;
	const followSymlinks = params?.followSymlinks === true;
	const preflightOnly = params?.preflightOnly === true;
	const rejectHardlinks = params?.rejectHardlinks === true;
	if (!rawPath) return fileWriteError("INVALID_PATH", "path is required");
	if (rawPath.includes("\0")) return fileWriteError("INVALID_PATH", "path must not contain NUL bytes");
	if (!path.isAbsolute(rawPath)) return fileWriteError("INVALID_PATH", "path must be absolute");
	if (!hasContentBase64) return fileWriteError("INVALID_BASE64", "contentBase64 is required");
	const decodedBytes = inspectStrictBase64(contentBase64);
	if (decodedBytes === void 0) return fileWriteError("INVALID_BASE64", "contentBase64 is not valid base64");
	if (decodedBytes > MAX_CONTENT_BYTES) return fileWriteError("FILE_TOO_LARGE", `decoded content is ${decodedBytes} bytes; maximum is ${MAX_CONTENT_BYTES} bytes (16 MB)`);
	const buf = Buffer.from(contentBase64, "base64");
	const reEncoded = buf.toString("base64");
	const normalize = (s) => s.replace(/=+$/u, "").replace(/-/gu, "+").replace(/_/gu, "/");
	if (normalize(reEncoded) !== normalize(contentBase64)) return fileWriteError("INVALID_BASE64", "contentBase64 is not valid base64");
	let targetPath;
	let parentDir;
	let parentExists;
	try {
		const resolved = await resolveAbsolutePathForWrite(rawPath, { symlinks: followSymlinks ? "follow" : "reject" });
		targetPath = resolved.path;
		parentDir = resolved.parentDir;
		parentExists = resolved.parentExists;
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "symlink") return symlinkRedirectError("SYMLINK_REDIRECT", await canonicalTargetForSymlinkError(error, rawPath));
		throw error;
	}
	const canonicalTargetPath = await canonicalPathFromExistingAncestor(targetPath);
	const canonicalPathChange = rejectCanonicalPathChange(params.expectedCanonicalPath, canonicalTargetPath);
	if (canonicalPathChange) return canonicalPathChange;
	const expectedBinding = readPathBinding(params.expectedBinding);
	if (params.expectedBinding !== void 0 && expectedBinding?.kind !== "write") return fileWriteError("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", canonicalTargetPath);
	if (!parentExists) {
		if (!createParents) return fileWriteError("PARENT_NOT_FOUND", `parent directory does not exist: ${parentDir}`);
		if (preflightOnly) {
			const computedSha256 = sha256Hex(buf);
			if (expectedSha256 && expectedSha256.toLowerCase() !== computedSha256) return fileWriteError("INTEGRITY_FAILURE", `sha256 mismatch: expected ${expectedSha256.toLowerCase()}, got ${computedSha256}`, targetPath);
			return {
				ok: true,
				path: canonicalTargetPath,
				size: buf.length,
				sha256: computedSha256,
				overwritten: false,
				binding: await captureWriteBinding(canonicalTargetPath),
				...rejectHardlinks ? { rejectHardlinks: true } : {}
			};
		}
		if (!expectedBinding) try {
			await fs.mkdir(parentDir, { recursive: true });
		} catch (mkdirErr) {
			const message = mkdirErr instanceof Error ? mkdirErr.message : String(mkdirErr);
			return fileWriteError("WRITE_ERROR", `failed to create parent directories: ${message}`);
		}
	}
	try {
		await resolveAbsolutePathForWrite(targetPath, { symlinks: followSymlinks ? "follow" : "reject" });
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "symlink") return symlinkRedirectError("SYMLINK_REDIRECT", await canonicalTargetForSymlinkError(error, targetPath));
		throw error;
	}
	const targetFileName = path.basename(targetPath);
	let overwritten = false;
	let existingIdentity;
	try {
		const existingLStat = await fs.lstat(targetPath, { bigint: true });
		if (existingLStat.isSymbolicLink()) return fileWriteError("SYMLINK_TARGET_DENIED", `path is a symlink; refusing to write through it: ${targetPath}`);
		if (existingLStat.isDirectory()) return fileWriteError("IS_DIRECTORY", `path resolves to a directory: ${targetPath}`);
		if (!overwrite) return fileWriteError("EXISTS_NO_OVERWRITE", `file already exists and overwrite is false: ${targetPath}`);
		if (rejectHardlinks && existingLStat.nlink > 1n) return fileWriteError("HARDLINK_TARGET_DENIED", "refusing to overwrite a file with hard links");
		overwritten = true;
		existingIdentity = fileIdentity(existingLStat);
	} catch (statErr) {
		const statErrorCode = statErr instanceof FsSafeError ? statErr.code : statErr.code;
		if (statErrorCode !== "not-found" && statErrorCode !== "ENOENT") {
			const message = statErr instanceof Error ? statErr.message : String(statErr);
			if (message.toLowerCase().includes("permission")) return fileWriteError("PERMISSION_DENIED", `permission denied: ${targetPath}`);
			return fileWriteError("WRITE_ERROR", `unexpected stat error: ${message}`);
		}
	}
	const computedSha256 = sha256Hex(buf);
	if (expectedSha256 && expectedSha256.toLowerCase() !== computedSha256) return fileWriteError("INTEGRITY_FAILURE", `sha256 mismatch: expected ${expectedSha256.toLowerCase()}, got ${computedSha256}`, targetPath);
	if (preflightOnly) return {
		ok: true,
		path: canonicalTargetPath,
		size: buf.length,
		sha256: computedSha256,
		overwritten,
		binding: await captureWriteBinding(canonicalTargetPath, existingIdentity),
		...rejectHardlinks ? { rejectHardlinks: true } : {}
	};
	if (expectedBinding?.kind === "write") {
		const writeResult = await writeBoundTarget({
			binding: expectedBinding,
			buffer: buf,
			canonicalTargetPath,
			rejectHardlinks
		});
		if (!writeResult.ok) return writeResult;
		return {
			ok: true,
			path: writeResult.path,
			size: buf.length,
			sha256: computedSha256,
			overwritten: writeResult.overwritten,
			binding: {
				kind: "existing",
				...writeResult.identity
			}
		};
	}
	const parentRoot = await root(parentDir);
	try {
		if (overwrite) await parentRoot.write(targetFileName, buf);
		else await parentRoot.create(targetFileName, buf);
	} catch (writeErr) {
		if (writeErr instanceof FsSafeError) return writeFsSafeError(writeErr, targetPath);
		const message = writeErr instanceof Error ? writeErr.message : String(writeErr);
		if (message.toLowerCase().includes("permission") || message.toLowerCase().includes("access")) return fileWriteError("PERMISSION_DENIED", `permission denied writing to: ${parentDir}`);
		return fileWriteError("WRITE_ERROR", `failed to write file: ${message}`);
	}
	let canonicalPath = targetPath;
	let finalIdentity;
	try {
		const opened = await parentRoot.open(targetFileName);
		canonicalPath = opened.realPath;
		finalIdentity = fileIdentity(await opened.handle.stat({ bigint: true }));
		await opened.handle.close().catch(() => void 0);
	} catch (openErr) {
		if (openErr instanceof FsSafeError) return writeFsSafeError(openErr, targetPath);
	}
	return {
		ok: true,
		path: canonicalPath,
		size: buf.length,
		sha256: computedSha256,
		overwritten,
		binding: {
			kind: "existing",
			...finalIdentity ?? fileIdentity(await fs.stat(canonicalPath, { bigint: true }))
		}
	};
}
//#endregion
export { handleFileWrite };
