import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as openRootFile } from "./boundary-file-read-D-Aa04On.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import { n as matchesFileIdentity, r as readPathBinding, t as fileIdentity } from "./path-binding-C1J9N7T4.mjs";
import { a as resolveCanonicalReadPath, n as readAbsolutePath, r as rejectCanonicalPathChange, t as classifyFsSafeReadError } from "./path-errors-nBD272aa.mjs";
import fs from "node:fs";
import path from "node:path";
//#region extensions/file-transfer/src/node-host/file-stat.ts
function classifyError(error) {
	const safeCode = classifyFsSafeReadError(error);
	if (safeCode) return safeCode;
	const code = asOptionalRecord(error)?.code;
	if (code === "ENOENT" || code === "ENOTDIR") return "NOT_FOUND";
	return code === "EACCES" || code === "EPERM" ? "PERMISSION_DENIED" : "READ_ERROR";
}
async function handleFileStat(params) {
	const requestedPath = readAbsolutePath(params.path);
	if (typeof requestedPath !== "string") return requestedPath;
	const canonicalPath = await resolveCanonicalReadPath({
		requestedPath,
		followSymlinks: params.followSymlinks === true,
		classifyError,
		notFoundMessage: "path not found"
	});
	if (typeof canonicalPath !== "string") return canonicalPath;
	const changed = rejectCanonicalPathChange(params.expectedCanonicalPath, canonicalPath);
	if (changed) return changed;
	try {
		const candidate = await fs.promises.lstat(canonicalPath);
		if (!candidate.isFile() && !candidate.isDirectory()) return {
			ok: false,
			code: "UNSUPPORTED_FILE_TYPE",
			message: "only regular files and directories are supported",
			canonicalPath
		};
		const opened = await openRootFile({
			absolutePath: canonicalPath,
			rootPath: path.dirname(canonicalPath),
			boundaryLabel: "file.stat",
			allowedType: candidate.isDirectory() ? "directory" : "file",
			rejectHardlinks: false
		});
		if (!opened.ok) return {
			ok: false,
			code: classifyError(opened.error),
			message: "could not open the metadata target",
			canonicalPath
		};
		try {
			const openedPathChange = rejectCanonicalPathChange(canonicalPath, opened.path);
			if (openedPathChange) return openedPathChange;
			const stats = fs.fstatSync(opened.fd, { bigint: true });
			const expected = readPathBinding(params.expectedBinding);
			if (params.expectedBinding !== void 0 && (expected?.kind !== "existing" || !matchesFileIdentity(stats, expected))) return {
				ok: false,
				code: "CANONICAL_PATH_CHANGED",
				message: "filesystem identity differs from the authorized target",
				canonicalPath
			};
			return {
				ok: true,
				path: opened.path,
				type: stats.isDirectory() ? "directory" : "file",
				size: Number(stats.size),
				mtimeMs: Number(stats.mtimeNs) / 1e6,
				binding: {
					kind: "existing",
					...fileIdentity(stats)
				},
				...params.preflightOnly === true ? { preflightOnly: true } : {}
			};
		} finally {
			fs.closeSync(opened.fd);
		}
	} catch (error) {
		return {
			ok: false,
			code: classifyError(error),
			message: "could not read file metadata",
			canonicalPath
		};
	}
}
//#endregion
export { handleFileStat };
