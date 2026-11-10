import { ARCHIVE_LIMIT_ERROR_CODE, ArchiveLimitError, ArchiveSecurityError, DEFAULT_MAX_ARCHIVE_BYTES_ZIP, DEFAULT_MAX_ENTRIES, DEFAULT_MAX_ENTRY_BYTES, DEFAULT_MAX_EXTRACTED_BYTES, extractArchive, inspectTarArchive, readArchiveEntry, resolveArchiveKind, resolvePackedRootDir } from "@openclaw/fs-safe/archive";
//#region src/infra/archive.ts
/** Retain OpenClaw's durable publication default; disposable extraction opts out explicitly. */
async function extractArchive$1(params) {
	return await extractArchive({
		archivePath: params.archivePath,
		destDir: params.destDir,
		timeoutMs: params.timeoutMs,
		durable: params.durable ?? true,
		kind: params.kind,
		stripComponents: params.stripComponents,
		tarGzip: params.tarGzip,
		limits: params.limits,
		logger: params.logger,
		entryModes: params.entryModes,
		entryUmask: params.entryUmask,
		entryFilter: params.entryFilter,
		onFiltered: params.onFiltered
	});
}
//#endregion
export { DEFAULT_MAX_ENTRIES as a, extractArchive$1 as c, resolveArchiveKind as d, resolvePackedRootDir as f, DEFAULT_MAX_ARCHIVE_BYTES_ZIP as i, inspectTarArchive as l, ArchiveLimitError as n, DEFAULT_MAX_ENTRY_BYTES as o, ArchiveSecurityError as r, DEFAULT_MAX_EXTRACTED_BYTES as s, ARCHIVE_LIMIT_ERROR_CODE as t, readArchiveEntry as u };
