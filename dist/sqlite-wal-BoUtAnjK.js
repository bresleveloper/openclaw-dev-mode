import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
import fs from "node:fs";
import path from "node:path";
import childProcess from "node:child_process";
const LINUX_NFS_SUPER_MAGIC = 26985;
const LINUX_SMB_SUPER_MAGIC = 20859;
const LINUX_CIFS_SUPER_MAGIC = 4283649346;
const LINUX_SMB2_SUPER_MAGIC = 4266872130;
const PROC_MOUNTINFO_PATH = "/proc/self/mountinfo";
const NETWORK_FILESYSTEM_TYPES = new Set([
	"cifs",
	"smbfs",
	"smb2",
	"smb3"
]);
function normalizeNonNegativeInteger(value, label) {
	if (!Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`);
	return value;
}
function findExistingVolumePaths(targetPath) {
	let current = path.resolve(targetPath);
	while (true) {
		let stats;
		try {
			stats = fs.statSync(current);
		} catch {
			const parent = path.dirname(current);
			if (parent === current) return null;
			current = parent;
			continue;
		}
		const existingPath = fs.realpathSync(current);
		return {
			canonicalPath: stats.isDirectory() ? existingPath : path.dirname(existingPath),
			originalPath: stats.isDirectory() ? current : path.dirname(current)
		};
	}
}
function decodeMountPath(value) {
	return value.replace(/\\([0-7]{3})/g, (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8)));
}
function parseProcMountInfoEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const separator = line.indexOf(" - ");
		if (separator === -1) continue;
		const fields = line.slice(0, separator).split(" ");
		const suffixFields = line.slice(separator + 3).split(" ");
		const mountPoint = fields[4];
		const fsType = suffixFields[0];
		if (mountPoint && fsType) entries.push({
			mountPoint: decodeMountPath(mountPoint),
			fsType,
			...suffixFields[1] ? { source: decodeMountPath(suffixFields[1]) } : {}
		});
	}
	return entries;
}
function parseMountCommandEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const linuxMatch = /^(.+) on (.+) type ([^,\s)]+) \(/.exec(line);
		if (linuxMatch) {
			entries.push({
				source: linuxMatch[1],
				mountPoint: linuxMatch[2],
				fsType: linuxMatch[3]
			});
			continue;
		}
		const bsdMatch = /^(.+) on (.+) \(([^,\s)]+)/.exec(line);
		if (bsdMatch) entries.push({
			source: bsdMatch[1],
			mountPoint: bsdMatch[2],
			fsType: bsdMatch[3]
		});
	}
	return entries;
}
function readMountEntries() {
	try {
		return parseProcMountInfoEntries(fs.readFileSync(PROC_MOUNTINFO_PATH, "utf8"));
	} catch {}
	try {
		return parseMountCommandEntries(String(childProcess.execFileSync("mount", [])));
	} catch {
		return [];
	}
}
function isPathWithinMount(targetPath, mountPoint) {
	const resolvedTarget = path.resolve(targetPath);
	const resolvedMountPoint = path.resolve(mountPoint);
	return resolvedTarget === resolvedMountPoint || resolvedMountPoint === path.parse(resolvedMountPoint).root || resolvedTarget.startsWith(`${resolvedMountPoint}${path.sep}`);
}
function isSshfsMountSource(source) {
	if (!source) return false;
	const normalized = source.toLowerCase();
	return normalized === "sshfs" || normalized.startsWith("sshfs#") || normalized.startsWith("sshfs@") || /^(?:[^/\s:]+@)?[^/\s:]+:.*/u.test(source);
}
function resolveMountTypeJournalPolicy(entry) {
	const normalized = entry.fsType.toLowerCase();
	if (normalized.startsWith("nfs") || NETWORK_FILESYSTEM_TYPES.has(normalized)) return "rollback";
	if (normalized === "fuse.sshfs") return "unsupported";
	if ((normalized === "macfuse" || normalized === "osxfuse") && isSshfsMountSource(entry.source)) return "unsupported";
	return "wal";
}
function resolveMountEntryJournalPolicy(targetPath, mountEntries) {
	const mountEntry = mountEntries.filter((entry) => isPathWithinMount(targetPath, entry.mountPoint)).toSorted((a, b) => b.mountPoint.length - a.mountPoint.length)[0];
	return mountEntry ? resolveMountTypeJournalPolicy(mountEntry) : "wal";
}
function combineMountEntryJournalPolicies(targetPaths) {
	const mountEntries = readMountEntries();
	const policies = new Set(targetPaths.map((targetPath) => resolveMountEntryJournalPolicy(targetPath, mountEntries)));
	if (policies.has("unsupported")) return "unsupported";
	return policies.has("rollback") ? "rollback" : "wal";
}
function isWindowsUncPath(targetPath) {
	return /^\\\\\?\\UNC\\[^\\]+\\[^\\]+/i.test(targetPath) || /^\\\\(?![?.]\\)[^\\]+\\[^\\]+/.test(targetPath);
}
function isWindowsDrivePath(targetPath) {
	return /^[A-Za-z]:[\\/]/.test(targetPath) || /^\\\\\?\\[A-Za-z]:[\\/]/i.test(targetPath);
}
function resolvePathJournalPolicy(targetPath) {
	if (process.platform === "win32") {
		const normalizedTargetPath = path.win32.normalize(targetPath);
		if (isWindowsUncPath(normalizedTargetPath)) return "rollback";
		if (isWindowsDrivePath(normalizedTargetPath)) try {
			return isWindowsUncPath(path.win32.normalize(fs.realpathSync.native(targetPath))) ? "rollback" : "wal";
		} catch {
			return "rollback";
		}
	}
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return "wal";
	const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
	if (typeof fs.statfsSync !== "function") return combineMountEntryJournalPolicies(mountLookupPaths);
	try {
		const filesystemType = fs.statfsSync(checkedPaths.canonicalPath).type;
		if (filesystemType === LINUX_NFS_SUPER_MAGIC || filesystemType === LINUX_SMB_SUPER_MAGIC || filesystemType === LINUX_CIFS_SUPER_MAGIC || filesystemType === LINUX_SMB2_SUPER_MAGIC) return "rollback";
	} catch {
		return combineMountEntryJournalPolicies(mountLookupPaths);
	}
	return combineMountEntryJournalPolicies(mountLookupPaths);
}
function readJournalModeResult(row) {
	if (!row || typeof row !== "object") return null;
	const record = row;
	const value = record.journal_mode ?? Object.values(record)[0];
	return typeof value === "string" ? value.toLowerCase() : null;
}
function requireRollbackJournalMode(db, options) {
	const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode = DELETE;").get());
	if (journalMode !== "delete") {
		const label = options.databaseLabel ?? "sqlite database";
		const location = options.databasePath ? ` at ${options.databasePath}` : "";
		throw new Error(`${label}${location} is on a network-backed volume but SQLite kept journal_mode=${journalMode ?? "unknown"}; refusing to continue with WAL on network storage.`);
	}
}
function refuseUnsupportedFilesystem(options) {
	const label = options.databaseLabel ?? "sqlite database";
	const location = options.databasePath ? ` at ${options.databasePath}` : "";
	throw new Error(`${label}${location} is on SSHFS, which cannot safely coordinate SQLite writes across mounts; refusing to open the database.`);
}
/** Configure safe journaling pragmas and return a handle for checkpoint/close maintenance. */
function configureSqliteWalMaintenance(db, options = {}) {
	const autoCheckpointPages = normalizeNonNegativeInteger(options.autoCheckpointPages ?? 1e3, "autoCheckpointPages");
	const checkpointIntervalMs = normalizeNonNegativeInteger(options.checkpointIntervalMs ?? 18e5, "checkpointIntervalMs");
	const timerIntervalMs = Math.min(checkpointIntervalMs, MAX_TIMER_TIMEOUT_MS);
	const checkpointMode = options.checkpointMode ?? "TRUNCATE";
	const periodicCheckpointMode = options.checkpointMode ?? "PASSIVE";
	const journalPolicy = options.databasePath ? resolvePathJournalPolicy(options.databasePath) : "wal";
	if (journalPolicy === "unsupported") refuseUnsupportedFilesystem(options);
	if (journalPolicy === "rollback") {
		requireRollbackJournalMode(db, options);
		return {
			checkpoint: () => true,
			close: () => true
		};
	}
	db.exec("PRAGMA journal_mode = WAL;");
	db.exec(`PRAGMA wal_autocheckpoint = ${autoCheckpointPages};`);
	const runCheckpoint = (mode) => {
		try {
			db.exec(`PRAGMA wal_checkpoint(${mode});`);
			return true;
		} catch (error) {
			options.onCheckpointError?.(error);
			return false;
		}
	};
	const checkpoint = () => runCheckpoint(checkpointMode);
	let timer = null;
	if (timerIntervalMs > 0) {
		timer = setInterval(() => runCheckpoint(periodicCheckpointMode), timerIntervalMs);
		timer.unref?.();
	}
	return {
		checkpoint,
		close: () => {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
			return checkpoint();
		}
	};
}
/** Configure per-connection SQLite pragmas in the safe lock-retry/WAL order. */
function configureSqliteConnectionPragmas(db, options = {}) {
	const { busyTimeoutMs, foreignKeys, synchronous, ...walOptions } = options;
	if (busyTimeoutMs !== void 0) db.exec(`PRAGMA busy_timeout = ${normalizeNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs")};`);
	const maintenance = configureSqliteWalMaintenance(db, walOptions);
	if (synchronous) db.exec(`PRAGMA synchronous = ${synchronous};`);
	if (foreignKeys) db.exec("PRAGMA foreign_keys = ON;");
	return maintenance;
}
//#endregion
export { configureSqliteWalMaintenance as n, configureSqliteConnectionPragmas as t };
