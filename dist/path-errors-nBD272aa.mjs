import { t as FsSafeError, y as resolveAbsolutePathForRead } from "./fs-safe-BAPek8At.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { r as readPathBinding, t as fileIdentity } from "./path-binding-C1J9N7T4.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/file-transfer/src/node-host/path-errors.ts
const SYMLINK_REJECTED_MESSAGE = "path traverses a symlink; refusing because followSymlinks=false (set plugins.entries.file-transfer.config.nodes.<node>.followSymlinks=true to allow, or update allowReadPaths to the canonical path)";
function classifyFsSafeReadError(err) {
	if (!(err instanceof FsSafeError)) return;
	if (err.code === "not-found") return "NOT_FOUND";
	if (err.code === "symlink") return "SYMLINK_REDIRECT";
	if (err.code === "invalid-path") return "INVALID_PATH";
}
function readAbsolutePath(input) {
	if (typeof input !== "string" || input.length === 0) return {
		ok: false,
		code: "INVALID_PATH",
		message: "path required"
	};
	if (input.includes("\0")) return {
		ok: false,
		code: "INVALID_PATH",
		message: "path contains NUL byte"
	};
	if (!path.isAbsolute(input)) return {
		ok: false,
		code: "INVALID_PATH",
		message: "path must be absolute"
	};
	return input;
}
function rejectCanonicalPathChange(expected, actual) {
	if (typeof expected !== "string" || expected === actual) return;
	return {
		ok: false,
		code: "CANONICAL_PATH_CHANGED",
		message: "canonical path differs from the authorized target",
		canonicalPath: actual
	};
}
function canonicalPathFromFsSafeError(err) {
	if (!(err instanceof FsSafeError) || !err.cause || typeof err.cause !== "object") return;
	return "canonicalPath" in err.cause && typeof err.cause.canonicalPath === "string" ? err.cause.canonicalPath : void 0;
}
async function resolveCanonicalReadPath(input) {
	try {
		return (await resolveAbsolutePathForRead(input.requestedPath, { symlinks: input.followSymlinks ? "follow" : "reject" })).canonicalPath;
	} catch (err) {
		const code = input.classifyError(err);
		const canonicalPath = canonicalPathFromFsSafeError(err);
		return {
			ok: false,
			code,
			message: code === "NOT_FOUND" ? input.notFoundMessage : code === "SYMLINK_REDIRECT" ? SYMLINK_REJECTED_MESSAGE : `realpath failed: ${String(err)}`,
			...canonicalPath ? { canonicalPath } : {}
		};
	}
}
async function statRequiredDirectory(canonicalPath, classifyError) {
	let stats;
	try {
		stats = await fs.stat(canonicalPath, { bigint: true });
	} catch (err) {
		return {
			ok: false,
			code: classifyError(err),
			message: `stat failed: ${String(err)}`,
			canonicalPath
		};
	}
	if (!stats.isDirectory()) return {
		ok: false,
		code: "IS_FILE",
		message: "path is not a directory",
		canonicalPath
	};
	return {
		ok: true,
		identity: fileIdentity(stats)
	};
}
async function resolveBoundReadDirectory(input) {
	const canonicalPath = await resolveCanonicalReadPath(input);
	if (typeof canonicalPath !== "string") return canonicalPath;
	const canonicalPathChange = rejectCanonicalPathChange(input.expectedCanonicalPath, canonicalPath);
	if (canonicalPathChange) return canonicalPathChange;
	const directory = await statRequiredDirectory(canonicalPath, input.classifyError);
	if (!directory.ok) return directory;
	const expectedBinding = readPathBinding(input.expectedBinding);
	if (input.expectedBinding !== void 0 && (expectedBinding?.kind !== "existing" || expectedBinding.device !== directory.identity.device || expectedBinding.inode !== directory.identity.inode)) return {
		ok: false,
		code: "CANONICAL_PATH_CHANGED",
		message: "filesystem identity differs from the authorized target",
		canonicalPath
	};
	return {
		...directory,
		canonicalPath
	};
}
//#endregion
export { resolveCanonicalReadPath as a, resolveBoundReadDirectory as i, readAbsolutePath as n, statRequiredDirectory as o, rejectCanonicalPathChange as r, classifyFsSafeReadError as t };
