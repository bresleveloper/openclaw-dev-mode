import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import fs from "node:fs/promises";
import { ensureDurableDirectory, isHardlinkFallbackError, pinDirectory, publishFileExclusive, publishFileExclusive as publishFileExclusive$1, sha256File as sha256File$1, syncDirectory, syncDirectory as syncDirectory$1, syncDirectoryBestEffort, syncDirectoryBestEffortSync, syncDirectorySync } from "@openclaw/fs-safe/durability";
//#region src/infra/directory-durability.ts
function isUnsupportedDirectorySyncError(error) {
	const code = error.code;
	return code === "EINVAL" || code === "ENOTSUP" || code === "ENOSYS" || process.platform === "win32" && (code === "EISDIR" || code === "EPERM" || code === "EACCES");
}
/** Require a real directory sync at product commit boundaries. */
function requireDirectorySync(outcome, label) {
	if (outcome.status !== "unsupported" || process.platform === "win32") return;
	const code = outcome.code ? ` (${outcome.code})` : "";
	throw new Error(`${label} does not support crash-durable directory synchronization${code}.`);
}
function getPublishFileExclusiveFailureDetails(error) {
	if (!(error instanceof FsSafeError)) return;
	const details = error.details;
	if (!details || typeof details.targetCreated !== "boolean" || details.cleanup !== "removed" && details.cleanup !== "preserved" && details.cleanup !== "unknown") return;
	return details;
}
function postPublicationFailure(params) {
	const cause = params.error instanceof Error ? params.error : new Error(String(params.error));
	return new FsSafeError(params.error instanceof FsSafeError ? params.error.code : "helper-failed", `File publication failed after target creation: ${cause.message}`, {
		cause,
		details: {
			phase: params.phase,
			targetCreated: true,
			targetIdentity: {
				dev: params.published.identity.dev,
				ino: params.published.identity.ino
			},
			cleanup: "preserved"
		}
	});
}
/** Publish one file without replacement under OpenClaw's durability policy. */
async function publishFileNoClobber(sourcePath, targetPath, options) {
	const sourceIdentity = await fs.lstat(sourcePath);
	const published = await publishFileExclusive({
		sourcePath,
		targetPath,
		expectedSourceIdentity: sourceIdentity,
		strategy: options.strategy
	});
	const degraded = published.directorySync.status === "unsupported";
	if (options.durability === "fail-closed") try {
		requireDirectorySync(published.directorySync, "File publication directory");
	} catch (error) {
		throw postPublicationFailure({
			error,
			phase: "directory-sync",
			published
		});
	}
	if (options.moveSource) try {
		const currentSource = await fs.lstat(sourcePath);
		if (!currentSource.isFile() || !sameFileIdentity(currentSource, sourceIdentity)) throw new Error(`File publication source changed before removal: ${sourcePath}`);
		await fs.unlink(sourcePath);
	} catch (error) {
		throw postPublicationFailure({
			error,
			phase: published.method === "hardlink" ? "hardlink-verify" : "copy-verify",
			published
		});
	}
	return {
		...published,
		durability: degraded ? "degraded" : "durable"
	};
}
/** Compatibility adapter for former best-effort call sites. */
async function syncDirectoryIfSupported(directoryPath) {
	try {
		return await syncDirectory(directoryPath);
	} catch (error) {
		if (!isUnsupportedDirectorySyncError(error)) throw error;
		const code = error.code;
		return code ? {
			status: "unsupported",
			code
		} : { status: "unsupported" };
	}
}
//#endregion
export { publishFileExclusive$1 as a, sha256File$1 as c, syncDirectoryBestEffortSync as d, syncDirectoryIfSupported as f, pinDirectory as i, syncDirectory$1 as l, getPublishFileExclusiveFailureDetails as n, publishFileNoClobber as o, syncDirectorySync as p, isHardlinkFallbackError as r, requireDirectorySync as s, ensureDurableDirectory as t, syncDirectoryBestEffort as u };
