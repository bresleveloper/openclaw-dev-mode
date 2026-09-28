import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { r as withTempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { r as ArchiveLimitError, t as ARCHIVE_LIMIT_ERROR_CODE, u as inspectTarArchive } from "./archive-BVJWOqLD.mjs";
import "./archive-C3OhMJzN.mjs";
import "./temp-path-PENdksor.mjs";
//#region extensions/file-transfer/src/shared/dir-fetch-limits.ts
const DIR_FETCH_DEFAULT_MAX_BYTES = 8388608;
const DIR_FETCH_HARD_MAX_BYTES = 16777216;
const DIR_FETCH_MAX_ENTRIES = 5e3;
const DIR_FETCH_ARCHIVE_LIMITS = {
	maxArchiveBytes: DIR_FETCH_HARD_MAX_BYTES,
	maxEntries: 5001,
	maxExtractedBytes: 67108864,
	maxEntryBytes: 16777216
};
//#endregion
//#region extensions/file-transfer/src/shared/dir-fetch-archive.ts
const DIR_FETCH_ARCHIVE_POLICY = {
	limits: DIR_FETCH_ARCHIVE_LIMITS,
	entryFilter: ({ kind }) => kind === "file" || kind === "directory" ? "extract" : "skip",
	onFiltered: "reject-archive"
};
async function inspectDirFetchArchive(bytes, timeoutMs) {
	if (bytes.byteLength > DIR_FETCH_ARCHIVE_LIMITS.maxArchiveBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ARCHIVE_SIZE_EXCEEDS_LIMIT);
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-dir-fetch-"
	}, async (workspace) => {
		const archivePath = await workspace.write("archive.tar.gz", bytes);
		return (await inspectTarArchive({
			archivePath,
			timeoutMs,
			...DIR_FETCH_ARCHIVE_POLICY
		})).map((entry) => entry.path).toSorted((left, right) => left.localeCompare(right));
	});
}
//#endregion
export { DIR_FETCH_MAX_ENTRIES as a, DIR_FETCH_HARD_MAX_BYTES as i, inspectDirFetchArchive as n, DIR_FETCH_DEFAULT_MAX_BYTES as r, DIR_FETCH_ARCHIVE_POLICY as t };
