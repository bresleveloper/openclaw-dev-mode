import { o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as sha256FileSync } from "./crypto-digest-D9Nqq3c7.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/sqlite-files.ts
/** SQLite main database plus every journal-mode sidecar that can contain database pages. */
const SQLITE_DATABASE_FILE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
const SQLITE_SIDECAR_SUFFIXES = SQLITE_DATABASE_FILE_SUFFIXES.slice(1);
const SQLITE_WAL_HEADER_BYTES = 32;
const APPLE_DOUBLE_MAGIC = Buffer.from([
	0,
	5,
	22,
	7
]);
/** AppleDouble files start with 00 05 16 07; the `._*.sqlite` name alone is not enough. */
function isAppleDoubleMetadataFile(pathname) {
	const basename = path.basename(pathname);
	if (!basename.startsWith("._") || !basename.endsWith(".sqlite")) return false;
	const opened = openRootFileSync({
		absolutePath: pathname,
		rootPath: path.dirname(pathname),
		boundaryLabel: "SQLite metadata directory",
		rejectHardlinks: false
	});
	if (!opened.ok) return false;
	try {
		const header = Buffer.alloc(APPLE_DOUBLE_MAGIC.length);
		return fs.readSync(opened.fd, header, 0, header.length, 0) === header.length && header.equals(APPLE_DOUBLE_MAGIC);
	} catch {
		return false;
	} finally {
		fs.closeSync(opened.fd);
	}
}
const sqliteFilesLog = createSubsystemLogger("state/sqlite");
var SqliteOrphanedSidecarsError = class extends Error {
	constructor(pathname, sidecarPaths, cause) {
		super(`SQLite database is missing at ${pathname}, and orphaned sidecars could not be copied: ${sidecarPaths.join(", ")}. Refusing to open because SQLite could delete orphan WAL or journal state. Preserve the sidecar bytes, restore the main database, and pair it with the matching sidecar before retrying.`, { cause });
		this.name = "SqliteOrphanedSidecarsError";
	}
};
/** Resolves the main database and all possible journal-mode sidecar paths. */
function resolveSqliteDatabaseFilePaths(pathname) {
	return SQLITE_DATABASE_FILE_SUFFIXES.map((suffix) => `${pathname}${suffix}`);
}
function findMatchingOrphanedSidecarCopy(sourcePath, sourceSize) {
	const directory = path.dirname(sourcePath);
	const prefix = `${path.basename(sourcePath)}.orphaned-`;
	const candidates = fs.readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.startsWith(prefix)).map((entry) => path.join(directory, entry.name)).filter((candidate) => fs.statSync(candidate).size === sourceSize);
	if (candidates.length === 0) return;
	const sourceHash = sha256FileSync(sourcePath);
	for (const candidate of candidates) if (sha256FileSync(candidate) === sourceHash) return candidate;
}
function copyOrphanedSidecar(sourcePath, epochMs) {
	const basePath = `${sourcePath}.orphaned-${epochMs}`;
	for (let suffix = 0;; suffix += 1) {
		const candidate = suffix === 0 ? basePath : `${basePath}-${suffix}`;
		try {
			fs.copyFileSync(sourcePath, candidate, fs.constants.COPYFILE_EXCL);
			return candidate;
		} catch (error) {
			if (error.code !== "EEXIST") throw error;
		}
	}
}
/** Preserve durable orphan sidecars before SQLite creates a replacement main database. */
function quarantineOrphanedSqliteSidecars(pathname) {
	if (fs.existsSync(pathname)) return;
	const sidecars = [{
		path: `${pathname}-wal`,
		minimumBytes: SQLITE_WAL_HEADER_BYTES
	}, {
		path: `${pathname}-journal`,
		minimumBytes: 0
	}].flatMap((sidecar) => {
		const stat = fs.statSync(sidecar.path, { throwIfNoEntry: false });
		return stat?.isFile() === true && stat.size > sidecar.minimumBytes ? [{
			path: sidecar.path,
			size: stat.size
		}] : [];
	});
	if (sidecars.length === 0) return;
	const epochMs = Date.now();
	const copied = [];
	try {
		for (const sidecar of sidecars) {
			if (findMatchingOrphanedSidecarCopy(sidecar.path, sidecar.size)) continue;
			const quarantinePath = copyOrphanedSidecar(sidecar.path, epochMs);
			copied.push({
				quarantinePath,
				sourcePath: sidecar.path
			});
		}
	} catch (error) {
		throw new SqliteOrphanedSidecarsError(pathname, sidecars.map((sidecar) => sidecar.path), error);
	}
	if (copied.length === 0) return;
	const copies = copied.map(({ sourcePath, quarantinePath }) => `${sourcePath} -> ${quarantinePath}`);
	sqliteFilesLog.warn(`SQLite database is missing at ${pathname}; copied orphaned sidecars: ${copies.join(", ")}. Committed frames could not be applied because the main database is missing. The bytes are preserved. Recovery requires restoring the main database and pairing it with the quarantined file.`, {
		databasePath: pathname,
		copiedSidecars: copied
	});
}
//#endregion
export { resolveSqliteDatabaseFilePaths as i, isAppleDoubleMetadataFile as n, quarantineOrphanedSqliteSidecars as r, SQLITE_SIDECAR_SUFFIXES as t };
