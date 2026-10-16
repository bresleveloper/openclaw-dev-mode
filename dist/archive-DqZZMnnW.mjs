import { ARCHIVE_LIMIT_ERROR_CODE, ArchiveFormatError, ArchiveLimitError, ArchiveSecurityError, DEFAULT_MAX_ARCHIVE_BYTES_ZIP, DEFAULT_MAX_ENTRIES, DEFAULT_MAX_ENTRY_BYTES, DEFAULT_MAX_EXTRACTED_BYTES, extractArchive, inspectTarArchive, readArchiveEntry, resolveArchiveKind, resolvePackedRootDir } from "@openclaw/fs-safe/archive";
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
export { DEFAULT_MAX_ARCHIVE_BYTES_ZIP as a, DEFAULT_MAX_EXTRACTED_BYTES as c, readArchiveEntry as d, resolveArchiveKind as f, ArchiveSecurityError as i, extractArchive$1 as l, ArchiveFormatError as n, DEFAULT_MAX_ENTRIES as o, resolvePackedRootDir as p, ArchiveLimitError as r, DEFAULT_MAX_ENTRY_BYTES as s, ARCHIVE_LIMIT_ERROR_CODE as t, inspectTarArchive as u };
