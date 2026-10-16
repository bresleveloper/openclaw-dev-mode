import { ARCHIVE_LIMIT_ERROR_CODE, ArchiveEntryKind, ArchiveExtractLimits, ArchiveLimitError, ArchiveLogger, ExtractArchiveOptions, ExtractArchiveOptions as ExtractArchiveOptions$1, inspectTarArchive, readArchiveEntry } from "@openclaw/fs-safe/archive";
//#region src/infra/archive.d.ts
/** Retain OpenClaw's durable publication default; disposable extraction opts out explicitly. */
declare function extractArchive(params: ExtractArchiveOptions): Promise<void>;
//#endregion
export { ArchiveLogger as a, inspectTarArchive as c, ArchiveLimitError as i, readArchiveEntry as l, ArchiveEntryKind as n, ExtractArchiveOptions$1 as o, ArchiveExtractLimits as r, extractArchive as s, ARCHIVE_LIMIT_ERROR_CODE as t };