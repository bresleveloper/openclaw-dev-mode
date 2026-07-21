import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import { S as resolveDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { g as resolveOAuthDir, s as resolveConfigPath, v as resolveStateDir } from "./paths-BMBAvkNf.js";
import { _ as shortenHomePath, m as resolveUserPath, p as resolveHomeDir, u as pathExists } from "./utils-CRO4LGEB.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
import { l as writeJson } from "./json-CI_xQ2Rw.js";
import "./json-files-Ce1pXdh3.js";
import { l as resolveOpenClawStateSqlitePath, m as requireNodeSqlite } from "./openclaw-state-db-CIiPwqG3.js";
import { u as readConfigFileSnapshot } from "./io-DxnOT4sF.js";
import "./config-Cc93keN1.js";
import { i as loadSqliteVecExtension } from "./engine-storage-CkR0WZTF.js";
import { n as isPathWithin, t as buildCleanupPlan } from "./cleanup-utils-CrwOtyV7.js";
import { constants, createWriteStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
//#region src/commands/backup-shared.ts
function backupAssetPriority(kind) {
	switch (kind) {
		case "state": return 0;
		case "config": return 1;
		case "credentials": return 2;
		case "workspace": return 3;
	}
	throw new Error("Unsupported backup asset kind");
}
/** Format a filesystem-safe local timestamp with explicit UTC offset for backup names. */
function formatBackupArchiveTimestamp(nowMs = Date.now(), offsetMinutes = -new Date(nowMs).getTimezoneOffset()) {
	const shifted = nowMs + offsetMinutes * 6e4;
	const local = new Date(shifted);
	const sign = offsetMinutes >= 0 ? "+" : "-";
	const absOffsetMinutes = Math.abs(offsetMinutes);
	const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(2, "0");
	const offsetMins = String(absOffsetMinutes % 60).padStart(2, "0");
	return `${String(local.getUTCFullYear()).padStart(4, "0")}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}T${String(local.getUTCHours()).padStart(2, "0")}-${String(local.getUTCMinutes()).padStart(2, "0")}-${String(local.getUTCSeconds()).padStart(2, "0")}.${String(local.getUTCMilliseconds()).padStart(3, "0")}${sign}${offsetHours}-${offsetMins}`;
}
/** Build the root directory name stored inside a backup tarball. */
function buildBackupArchiveRoot(nowMs = Date.now()) {
	return `${formatBackupArchiveTimestamp(nowMs)}-openclaw-backup`;
}
/** Build the default `.tar.gz` filename for a backup archive. */
function buildBackupArchiveBasename(nowMs = Date.now()) {
	return `${buildBackupArchiveRoot(nowMs)}.tar.gz`;
}
/** Encode an absolute or relative source path into a traversal-safe archive payload path. */
function encodeAbsolutePathForBackupArchive(sourcePath) {
	const normalized = sourcePath.replaceAll("\\", "/");
	const windowsMatch = normalized.match(/^([A-Za-z]):\/(.*)$/);
	if (windowsMatch) {
		const drive = windowsMatch[1]?.toUpperCase() ?? "UNKNOWN";
		const rest = windowsMatch[2] ?? "";
		return path.posix.join("windows", drive, rest);
	}
	if (normalized.startsWith("/")) return path.posix.join("posix", normalized.slice(1));
	return path.posix.join("relative", normalized);
}
/** Build the archive-relative payload path for one source path. */
function buildBackupArchivePath(archiveRoot, sourcePath) {
	return path.posix.join(archiveRoot, "payload", encodeAbsolutePathForBackupArchive(sourcePath));
}
/** Resolve a backup plan from explicit paths, deduplicating assets already covered by parents. */
async function resolveBackupPlanFromPaths(params) {
	const includeWorkspace = params.includeWorkspace ?? true;
	const onlyConfig = params.onlyConfig ?? false;
	const stateDir = params.stateDir;
	const configPath = params.configPath;
	const oauthDir = params.oauthDir;
	const archiveRoot = buildBackupArchiveRoot(params.nowMs);
	const workspaceDirs = includeWorkspace ? params.workspaceDirs ?? [] : [];
	const configInsideState = params.configInsideState ?? false;
	const oauthInsideState = params.oauthInsideState ?? false;
	if (onlyConfig) {
		const resolvedConfigPath = path.resolve(configPath);
		if (!await pathExists(resolvedConfigPath)) return {
			stateDir,
			configPath,
			oauthDir,
			workspaceDirs: [],
			included: [],
			skipped: [{
				kind: "config",
				sourcePath: resolvedConfigPath,
				displayPath: shortenHomePath(resolvedConfigPath),
				reason: "missing"
			}]
		};
		const canonicalConfigPath = await canonicalizeExistingPath(resolvedConfigPath);
		return {
			stateDir,
			configPath,
			oauthDir,
			workspaceDirs: [],
			included: [{
				kind: "config",
				sourcePath: canonicalConfigPath,
				displayPath: shortenHomePath(canonicalConfigPath),
				archivePath: buildBackupArchivePath(archiveRoot, canonicalConfigPath)
			}],
			skipped: []
		};
	}
	const rawCandidates = [
		{
			kind: "state",
			sourcePath: path.resolve(stateDir)
		},
		...configInsideState ? [] : [{
			kind: "config",
			sourcePath: path.resolve(configPath)
		}],
		...oauthInsideState ? [] : [{
			kind: "credentials",
			sourcePath: path.resolve(oauthDir)
		}],
		...workspaceDirs.map((workspaceDir) => ({
			kind: "workspace",
			sourcePath: path.resolve(workspaceDir)
		}))
	];
	const candidates = await Promise.all(rawCandidates.map(async (candidate) => {
		const exists = await pathExists(candidate.sourcePath);
		return Object.assign({}, candidate, {
			exists,
			canonicalPath: exists ? await canonicalizeExistingPath(candidate.sourcePath) : path.resolve(candidate.sourcePath)
		});
	}));
	const uniqueCandidates = [];
	const seenCanonicalPaths = /* @__PURE__ */ new Set();
	for (const candidate of [...candidates].toSorted(compareCandidates)) {
		if (seenCanonicalPaths.has(candidate.canonicalPath)) continue;
		seenCanonicalPaths.add(candidate.canonicalPath);
		uniqueCandidates.push(candidate);
	}
	const included = [];
	const skipped = [];
	for (const candidate of uniqueCandidates) {
		if (!candidate.exists) {
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.sourcePath,
				displayPath: shortenHomePath(candidate.sourcePath),
				reason: "missing"
			});
			continue;
		}
		const coveredBy = included.find((asset) => isPathWithin(candidate.canonicalPath, asset.sourcePath));
		if (coveredBy) {
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.canonicalPath,
				displayPath: shortenHomePath(candidate.canonicalPath),
				reason: "covered",
				coveredBy: coveredBy.displayPath
			});
			continue;
		}
		included.push({
			kind: candidate.kind,
			sourcePath: candidate.canonicalPath,
			displayPath: shortenHomePath(candidate.canonicalPath),
			archivePath: buildBackupArchivePath(archiveRoot, candidate.canonicalPath)
		});
	}
	return {
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs: workspaceDirs.map((entry) => path.resolve(entry)),
		included,
		skipped
	};
}
function compareCandidates(left, right) {
	const depthDelta = left.canonicalPath.length - right.canonicalPath.length;
	if (depthDelta !== 0) return depthDelta;
	const priorityDelta = backupAssetPriority(left.kind) - backupAssetPriority(right.kind);
	if (priorityDelta !== 0) return priorityDelta;
	return left.canonicalPath.localeCompare(right.canonicalPath);
}
async function canonicalizeExistingPath(targetPath) {
	try {
		return await fs$1.realpath(targetPath);
	} catch {
		return path.resolve(targetPath);
	}
}
/** Resolve the backup plan from the current OpenClaw state/config/workspace paths on disk. */
async function resolveBackupPlanFromDisk(params = {}) {
	const includeWorkspace = params.includeWorkspace ?? true;
	const onlyConfig = params.onlyConfig ?? false;
	const stateDir = resolveStateDir();
	const configPath = resolveConfigPath();
	const oauthDir = resolveOAuthDir();
	const configSnapshot = await readConfigFileSnapshot();
	if (includeWorkspace && configSnapshot.exists && !configSnapshot.valid) throw new Error(`Config invalid at ${shortenHomePath(configSnapshot.path)}. OpenClaw cannot reliably discover custom workspaces for backup. Fix the config or rerun with --no-include-workspace for a partial backup.`);
	const cleanupPlan = buildCleanupPlan({
		cfg: configSnapshot.config,
		stateDir,
		configPath,
		oauthDir
	});
	return await resolveBackupPlanFromPaths({
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs: includeWorkspace ? cleanupPlan.workspaceDirs : [],
		includeWorkspace,
		onlyConfig,
		configInsideState: cleanupPlan.configInsideState,
		oauthInsideState: cleanupPlan.oauthInsideState,
		nowMs: params.nowMs
	});
}
//#endregion
//#region src/infra/backup-volatile-filter.ts
/**
* Paths that are known to change during a live backup and commonly trigger
* tar EOF errors. These files are actively appended to (logs, sockets, pid
* markers) while `tar.c()` is reading them, which races with the size recorded
* at `lstat()` time.
*
* Skipping them is safe: they are either recreated on startup, are transient
* by nature, or have durable equivalents elsewhere in state. Snapshotting a
* partial tail of a live log has no restoration value.
*/
const STATE_TRANSIENT_EXTENSIONS = /* @__PURE__ */ new Set([
	".sock",
	".pid",
	".tmp"
]);
function normalizePosix(input) {
	if (!input) return input;
	return path.posix.normalize(input.replaceAll("\\", "/"));
}
function isUnder(childPosix, parentPosix) {
	if (!parentPosix) return false;
	const p = parentPosix.endsWith("/") ? parentPosix : `${parentPosix}/`;
	return childPosix === parentPosix || childPosix.startsWith(p);
}
function hasExtension(filePosix, extensions) {
	const ext = path.posix.extname(filePosix).toLowerCase();
	return extensions.includes(ext);
}
function hasExtensionInSet(filePosix, extensions) {
	return extensions.has(path.posix.extname(filePosix).toLowerCase());
}
function isAgentSessionTranscriptPath(filePosix, stateDirPosix) {
	const agentsRoot = path.posix.join(stateDirPosix, "agents");
	if (!isUnder(filePosix, agentsRoot)) return false;
	const parts = path.posix.relative(agentsRoot, filePosix).split("/").filter(Boolean);
	return parts.length >= 3 && parts[1] === "sessions";
}
function filePathCandidates(input) {
	const normalized = normalizePosix(input);
	if (normalized.startsWith("/") || /^[A-Za-z]:\//u.test(normalized)) return [normalized];
	return [normalized, normalizePosix(`/${normalized}`)];
}
/**
* Returns true if the given absolute path should be skipped during backup
* because it is a live-mutation target.
*
* Rules:
*   - `{stateDir}/sessions/**`/`*.{jsonl,log}` (legacy)
*   - `{stateDir}/agents/<agentId>/sessions/**`/`*.{jsonl,log}`
*   - `{stateDir}/cron/runs/**`/`*.{jsonl,log}`
*   - `{stateDir}/logs/**`/`*.{jsonl,log}`
*   - `{stateDir}/{delivery-queue,session-delivery-queue}/**`/`*.{json,delivered,tmp}`
*   - `{stateDir}/**`/`*.{sock,pid,tmp}`
*/
function isVolatileBackupPath(absolutePath, plan) {
	if (!absolutePath) return false;
	const candidates = filePathCandidates(absolutePath);
	for (const stateDir of plan.stateDirs) {
		if (!stateDir) continue;
		const stateDirPosix = normalizePosix(stateDir);
		for (const filePosix of candidates) {
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "sessions")) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			if (isAgentSessionTranscriptPath(filePosix, stateDirPosix) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "cron", "runs")) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			if (isUnder(filePosix, path.posix.join(stateDirPosix, "logs")) && hasExtension(filePosix, [".jsonl", ".log"])) return true;
			for (const queueDir of ["delivery-queue", "session-delivery-queue"]) if (isUnder(filePosix, path.posix.join(stateDirPosix, queueDir)) && hasExtension(filePosix, [
				".json",
				".delivered",
				".tmp"
			])) return true;
			if (isUnder(filePosix, stateDirPosix) && hasExtensionInSet(filePosix, STATE_TRANSIENT_EXTENSIONS)) return true;
		}
	}
	return false;
}
//#endregion
//#region src/infra/backup-create.ts
const loadTarRuntime = createLazyRuntimeModule(() => import("tar"));
var BackupLinkCache = class extends Map {
	get(_key) {}
	set(_key, _value) {
		return this;
	}
};
const VOLATILE_BACKUP_SYNTHETIC_STAT = {
	isBlockDevice: () => false,
	isCharacterDevice: () => false,
	isDirectory: () => false,
	isFIFO: () => false,
	isFile: () => false,
	isSocket: () => false,
	isSymbolicLink: () => false
};
var BackupVolatileStatCache = class extends Map {
	constructor(volatilePlan) {
		super();
		this.volatilePlan = volatilePlan;
	}
	get(key) {
		const cached = super.get(key);
		if (cached) return cached;
		return isVolatileBackupPath(key, this.volatilePlan) ? VOLATILE_BACKUP_SYNTHETIC_STAT : void 0;
	}
};
function createBackupVolatileStatCache(volatilePlan) {
	return new BackupVolatileStatCache(volatilePlan);
}
const BACKUP_TAR_MAX_ATTEMPTS = 3;
const BACKUP_TAR_BACKOFF_MS = [1e4, 2e4];
function isTarEofRaceError(err) {
	if (!err || typeof err !== "object") return false;
	if (err.code === "EOF") return true;
	const message = err.message ?? "";
	return /(did not encounter expected|encountered unexpected) EOF|TAR_BAD_ARCHIVE/i.test(message);
}
function resolveBackupTarAttemptTempPath(tempArchivePath, attempt) {
	return attempt === 1 ? tempArchivePath : `${tempArchivePath}.retry-${attempt}`;
}
function resolveBackupTarAttemptTempPaths(tempArchivePath) {
	return Array.from({ length: BACKUP_TAR_MAX_ATTEMPTS }, (_value, index) => resolveBackupTarAttemptTempPath(tempArchivePath, index + 1));
}
async function removeBackupTempArchiveBestEffort(tempArchivePath) {
	await fs$1.rm(tempArchivePath, { force: true }).catch(() => void 0);
}
async function writeArchiveStreamToFile(params) {
	await pipeline(params.archiveStream, createWriteStream(params.archivePath));
}
async function writeTarArchiveWithRetry(params) {
	const sleepFn = params.sleepMs ?? sleep;
	let lastErr;
	const attemptTempArchivePaths = [];
	for (let attempt = 1; attempt <= BACKUP_TAR_MAX_ATTEMPTS; attempt += 1) {
		const attemptTempArchivePath = resolveBackupTarAttemptTempPath(params.tempArchivePath, attempt);
		attemptTempArchivePaths.push(attemptTempArchivePath);
		try {
			await params.runTar(attemptTempArchivePath);
			for (const staleTempArchivePath of attemptTempArchivePaths.slice(0, -1)) await removeBackupTempArchiveBestEffort(staleTempArchivePath);
			return attemptTempArchivePath;
		} catch (err) {
			lastErr = err;
			if (!isTarEofRaceError(err) || attempt === BACKUP_TAR_MAX_ATTEMPTS) {
				for (const staleTempArchivePath of attemptTempArchivePaths) await removeBackupTempArchiveBestEffort(staleTempArchivePath);
				break;
			}
			try {
				await fs$1.rm(attemptTempArchivePath, { force: true });
			} catch (cleanupErr) {
				const code = cleanupErr.code;
				if (code && code !== "ENOENT") params.log?.(`Backup archiver could not remove temp archive ${attemptTempArchivePath} between retries: ${code}. Continuing.`);
			}
			const backoff = BACKUP_TAR_BACKOFF_MS[attempt - 1] ?? 0;
			const offendingPath = err.path;
			params.log?.(`Backup archiver hit a live-write race${offendingPath ? ` on ${offendingPath}` : ""} (attempt ${attempt}/${BACKUP_TAR_MAX_ATTEMPTS}); retrying in ${Math.round(backoff / 1e3)}s.`);
			await sleepFn(backoff);
		}
	}
	const final = lastErr instanceof Error ? lastErr : new Error(String(lastErr));
	const offendingPath = lastErr?.path;
	const suffix = offendingPath ? ` (last offending path: ${offendingPath}, after ${BACKUP_TAR_MAX_ATTEMPTS} attempts)` : ` (after ${BACKUP_TAR_MAX_ATTEMPTS} attempts)`;
	throw new Error(`Backup archive write failed: ${final.message}${suffix}`, { cause: final });
}
async function resolveOutputPath(params) {
	const basename = buildBackupArchiveBasename(params.nowMs);
	const rawOutput = params.output?.trim();
	if (!rawOutput) {
		const cwd = path.resolve(process.cwd());
		const canonicalCwd = await fs$1.realpath(cwd).catch(() => cwd);
		const defaultDir = params.includedAssets.some((asset) => isPathWithin(canonicalCwd, asset.sourcePath)) ? resolveHomeDir() ?? path.dirname(params.stateDir) : cwd;
		return path.resolve(defaultDir, basename);
	}
	const resolved = resolveUserPath(rawOutput);
	if (rawOutput.endsWith("/") || rawOutput.endsWith("\\")) return path.join(resolved, basename);
	try {
		if ((await fs$1.stat(resolved)).isDirectory()) return path.join(resolved, basename);
	} catch {}
	return resolved;
}
async function assertOutputPathReady(outputPath) {
	try {
		await fs$1.access(outputPath);
		throw new Error(`Refusing to overwrite existing backup archive: ${outputPath}`);
	} catch (err) {
		if (err?.code === "ENOENT") return;
		throw err;
	}
}
function buildTempArchivePath(outputPath) {
	return `${outputPath}.${randomUUID()}.tmp`;
}
async function chooseBackupTempRoot(params) {
	const systemTmp = os.tmpdir();
	const canonicalSystemTmp = await canonicalizePathForContainment(systemTmp);
	if (!params.assets.some((asset) => isPathWithin(canonicalSystemTmp, asset.sourcePath))) return systemTmp;
	const fallback = path.dirname(params.outputPath);
	const canonicalFallback = await canonicalizePathForContainment(fallback);
	const fallbackInsideAsset = params.assets.find((asset) => isPathWithin(canonicalFallback, asset.sourcePath));
	if (fallbackInsideAsset) throw new Error(`Backup temp root cannot be placed outside every source path: ${systemTmp} and ${fallback} both overlap ${fallbackInsideAsset.sourcePath}.`);
	return fallback;
}
function isLinkUnsupportedError(code) {
	return code === "ENOTSUP" || code === "EOPNOTSUPP" || code === "EPERM";
}
async function publishTempArchive(params) {
	try {
		await fs$1.link(params.tempArchivePath, params.outputPath);
	} catch (err) {
		const code = err?.code;
		if (code === "EEXIST") throw new Error(`Refusing to overwrite existing backup archive: ${params.outputPath}`, { cause: err });
		if (!isLinkUnsupportedError(code)) throw err;
		try {
			await fs$1.copyFile(params.tempArchivePath, params.outputPath, constants.COPYFILE_EXCL);
		} catch (copyErr) {
			const copyCode = copyErr?.code;
			if (copyCode !== "EEXIST") await fs$1.rm(params.outputPath, { force: true }).catch(() => void 0);
			if (copyCode === "EEXIST") throw new Error(`Refusing to overwrite existing backup archive: ${params.outputPath}`, { cause: copyErr });
			throw copyErr;
		}
	}
	await fs$1.rm(params.tempArchivePath, { force: true });
}
async function canonicalizePathForContainment(targetPath) {
	const resolved = path.resolve(targetPath);
	const suffix = [];
	let probe = resolved;
	while (true) try {
		const realProbe = await fs$1.realpath(probe);
		return suffix.length === 0 ? realProbe : path.join(realProbe, ...suffix.toReversed());
	} catch {
		const parent = path.dirname(probe);
		if (parent === probe) return resolved;
		suffix.push(path.basename(probe));
		probe = parent;
	}
}
function buildManifest(params) {
	return {
		schemaVersion: 1,
		createdAt: params.createdAt,
		archiveRoot: params.archiveRoot,
		runtimeVersion: resolveRuntimeServiceVersion(),
		platform: process.platform,
		nodeVersion: process.version,
		options: {
			includeWorkspace: params.includeWorkspace,
			onlyConfig: params.onlyConfig
		},
		paths: {
			stateDir: params.stateDir,
			configPath: params.configPath,
			oauthDir: params.oauthDir,
			workspaceDirs: params.workspaceDirs
		},
		assets: params.assets.map((asset) => ({
			kind: asset.kind,
			sourcePath: asset.sourcePath,
			archivePath: asset.archivePath
		})),
		skipped: params.skipped.map((entry) => ({
			kind: entry.kind,
			sourcePath: entry.sourcePath,
			reason: entry.reason,
			coveredBy: entry.coveredBy
		}))
	};
}
function formatBackupCreateSummary(result) {
	const lines = [`Backup archive: ${result.archivePath}`];
	lines.push(`Included ${result.assets.length} path${result.assets.length === 1 ? "" : "s"}:`);
	for (const asset of result.assets) lines.push(`- ${asset.kind}: ${asset.displayPath}`);
	if (result.skipped.length > 0) {
		lines.push(`Skipped ${result.skipped.length} path${result.skipped.length === 1 ? "" : "s"}:`);
		for (const entry of result.skipped) if (entry.reason === "covered" && entry.coveredBy) lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason} by ${entry.coveredBy})`);
		else lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason})`);
	}
	if (result.dryRun) lines.push("Dry run only; archive was not written.");
	else {
		lines.push(`Created ${result.archivePath}`);
		if (result.skippedVolatileCount > 0) lines.push(`Skipped ${result.skippedVolatileCount} volatile file${result.skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, sockets, pid/tmp).`);
		if (result.verified) lines.push("Archive verification: passed");
	}
	return lines;
}
function remapArchiveEntryPath(params) {
	const normalizedEntry = path.resolve(params.entryPath);
	if (normalizedEntry === params.manifestPath) return path.posix.join(params.archiveRoot, "manifest.json");
	const remappedSourcePath = params.sourcePathRemaps?.get(normalizedEntry);
	if (remappedSourcePath) return buildBackupArchivePath(params.archiveRoot, remappedSourcePath);
	return buildBackupArchivePath(params.archiveRoot, normalizedEntry);
}
function normalizeBackupFilterPath(value) {
	return value.replaceAll("\\", "/").replace(/\/+$/u, "");
}
function buildExtensionsNodeModulesFilter(stateDir) {
	const extensionsPrefix = `${normalizeBackupFilterPath(stateDir)}/extensions/`;
	return (filePath) => {
		const normalizedFilePath = normalizeBackupFilterPath(filePath);
		if (!normalizedFilePath.startsWith(extensionsPrefix)) return true;
		return !normalizedFilePath.slice(extensionsPrefix.length).split("/").includes("node_modules");
	};
}
const SQLITE_BACKUP_SOURCE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
const SQLITE_BACKUP_EXCLUDED_SUFFIXES = [".reindex-lock.sqlite"];
const SQLITE_BACKUP_REINDEX_TRANSIENT_PATTERN = /\.sqlite\.(?:backup|memory-reindex|tmp)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
function isStatePackageContentPath(sourcePath, stateDir) {
	const resolvedStateDir = path.resolve(stateDir);
	const resolvedSourcePath = path.resolve(sourcePath);
	return isPathWithin(resolvedSourcePath, resolvedStateDir) && path.relative(resolvedStateDir, resolvedSourcePath).split(path.sep).includes("node_modules");
}
function resolveSqliteBackupDatabasePath(sourcePath) {
	for (const suffix of SQLITE_BACKUP_SOURCE_SUFFIXES.slice(1)) if (sourcePath.endsWith(suffix)) {
		const databasePath = sourcePath.slice(0, -suffix.length);
		return databasePath.endsWith(".sqlite") ? databasePath : void 0;
	}
	return sourcePath.endsWith(".sqlite") ? sourcePath : void 0;
}
function resolveSqliteBackupBasePath(sourcePath) {
	for (const suffix of SQLITE_BACKUP_SOURCE_SUFFIXES.slice(1)) if (sourcePath.endsWith(suffix)) return sourcePath.slice(0, -suffix.length);
	return sourcePath;
}
function classifyStateSqliteBackupSourcePath(sourcePath, stateDir) {
	const resolvedSourcePath = path.resolve(sourcePath);
	if (!isPathWithin(resolvedSourcePath, stateDir)) return;
	if (isStatePackageContentPath(resolvedSourcePath, stateDir)) return;
	if (SQLITE_BACKUP_REINDEX_TRANSIENT_PATTERN.test(resolveSqliteBackupBasePath(resolvedSourcePath))) return "excluded";
	const databasePath = resolveSqliteBackupDatabasePath(resolvedSourcePath);
	if (!databasePath) return;
	return SQLITE_BACKUP_EXCLUDED_SUFFIXES.some((suffix) => databasePath.endsWith(suffix)) ? "excluded" : "sqlite";
}
function isBackupTarFilterFile(entry) {
	return "isFile" in entry ? entry.isFile() : entry.type === "File";
}
function tableExistsSql(db, tableName) {
	return db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)?.ok === 1;
}
function sanitizeGlobalStateSqliteSnapshot(db) {
	if (tableExistsSql(db, "delivery_queue_entries")) {
		db.prepare("DELETE FROM delivery_queue_entries").run();
		db.exec("VACUUM;");
	}
}
async function listStateSqlitePaths(params) {
	const snapshotPaths = /* @__PURE__ */ new Set();
	const discoveredSourcePaths = /* @__PURE__ */ new Set();
	const extensionsFilter = buildExtensionsNodeModulesFilter(params.stateDir);
	async function visit(dir) {
		let entries;
		try {
			entries = await fs$1.readdir(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			const entryPath = path.join(dir, entry.name);
			if (entry.isSymbolicLink()) continue;
			if (entry.isDirectory()) {
				if (extensionsFilter(entryPath) && !isStatePackageContentPath(entryPath, params.stateDir)) await visit(entryPath);
			} else if (entry.isFile() && extensionsFilter(entryPath)) {
				const resolvedEntryPath = path.resolve(entryPath);
				if (resolveSqliteBackupDatabasePath(resolvedEntryPath)) discoveredSourcePaths.add(resolvedEntryPath);
				if (entry.name.endsWith(".sqlite") && !SQLITE_BACKUP_EXCLUDED_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) snapshotPaths.add(resolvedEntryPath);
			}
		}
	}
	await visit(params.stateDir);
	const globalStateSqlitePath = path.resolve(params.globalStateSqlitePath);
	let globalStateEntry;
	try {
		globalStateEntry = await fs$1.lstat(globalStateSqlitePath);
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	if (globalStateEntry?.isFile()) {
		snapshotPaths.add(globalStateSqlitePath);
		discoveredSourcePaths.add(globalStateSqlitePath);
	} else if (globalStateEntry?.isSymbolicLink()) {
		let targetEntry;
		try {
			targetEntry = await fs$1.stat(globalStateSqlitePath);
		} catch (err) {
			throw new Error(`Canonical global SQLite symlink cannot be snapshotted: ${globalStateSqlitePath}`, { cause: err });
		}
		if (!targetEntry.isFile()) throw new Error(`Canonical global SQLite symlink must resolve to a regular file: ${globalStateSqlitePath}`);
		snapshotPaths.add(globalStateSqlitePath);
		discoveredSourcePaths.add(globalStateSqlitePath);
	} else if (globalStateEntry) throw new Error(`Canonical global SQLite path must be a regular file or symlink to one: ${globalStateSqlitePath}`);
	return {
		snapshotPaths: [...snapshotPaths].toSorted((left, right) => left.localeCompare(right)),
		discoveredSourcePaths
	};
}
async function createStateSqliteBackupPlan(params) {
	const globalStateSqlitePath = path.resolve(resolveOpenClawStateSqlitePath({
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	}));
	const discovery = await listStateSqlitePaths({
		stateDir: params.stateDir,
		globalStateSqlitePath
	});
	const sqlite = requireNodeSqlite();
	const snapshots = [];
	for (const archiveSourcePath of discovery.snapshotPaths) {
		const sourceDatabasePath = path.resolve(archiveSourcePath) === globalStateSqlitePath ? await fs$1.realpath(archiveSourcePath) : archiveSourcePath;
		const source = new sqlite.DatabaseSync(sourceDatabasePath, {
			allowExtension: true,
			readOnly: true
		});
		const sourcePath = path.join(params.tempDir, `openclaw-state-db-${snapshots.length}.sqlite`);
		try {
			source.exec("PRAGMA busy_timeout = 30000;");
			await loadSqliteVecExtension({ db: source });
			source.prepare("VACUUM INTO ?").run(sourcePath);
		} finally {
			source.close();
		}
		await fs$1.chmod(sourcePath, 384);
		if (path.resolve(archiveSourcePath) === globalStateSqlitePath) {
			const snapshot = new sqlite.DatabaseSync(sourcePath);
			try {
				sanitizeGlobalStateSqliteSnapshot(snapshot);
			} finally {
				snapshot.close();
			}
		}
		snapshots.push({
			sourcePath,
			archiveSourcePath,
			skippedSourcePaths: new Set([archiveSourcePath, sourceDatabasePath].flatMap((databasePath) => SQLITE_BACKUP_SOURCE_SUFFIXES.map((suffix) => path.resolve(`${databasePath}${suffix}`))))
		});
	}
	return {
		snapshots,
		discoveredSourcePaths: discovery.discoveredSourcePaths
	};
}
async function createBackupArchive(opts = {}) {
	const nowMs = resolveDateTimestampMs(opts.nowMs);
	const archiveRoot = buildBackupArchiveRoot(nowMs);
	const onlyConfig = Boolean(opts.onlyConfig);
	const includeWorkspace = onlyConfig ? false : opts.includeWorkspace ?? true;
	const plan = await resolveBackupPlanFromDisk({
		includeWorkspace,
		onlyConfig,
		nowMs
	});
	const outputPath = await resolveOutputPath({
		output: opts.output,
		nowMs,
		includedAssets: plan.included,
		stateDir: plan.stateDir
	});
	if (plan.included.length === 0) throw new Error(onlyConfig ? "No OpenClaw config file was found to back up." : "No local OpenClaw state was found to back up.");
	const canonicalOutputPath = await canonicalizePathForContainment(outputPath);
	const overlappingAsset = plan.included.find((asset) => isPathWithin(canonicalOutputPath, asset.sourcePath));
	if (overlappingAsset) throw new Error(`Backup output must not be written inside a source path: ${outputPath} is inside ${overlappingAsset.sourcePath}`);
	if (!opts.dryRun) await assertOutputPathReady(outputPath);
	const createdAt = new Date(nowMs).toISOString();
	const result = {
		createdAt,
		archiveRoot,
		archivePath: outputPath,
		dryRun: Boolean(opts.dryRun),
		includeWorkspace,
		onlyConfig,
		verified: false,
		assets: plan.included,
		skipped: plan.skipped,
		skippedVolatileCount: 0
	};
	if (opts.dryRun) return result;
	await fs$1.mkdir(path.dirname(outputPath), { recursive: true });
	const tempRoot = await chooseBackupTempRoot({
		assets: result.assets,
		outputPath
	});
	await fs$1.mkdir(tempRoot, { recursive: true });
	const tempDir = await fs$1.mkdtemp(path.join(tempRoot, "openclaw-backup-"));
	const manifestPath = path.join(tempDir, "manifest.json");
	const tempArchivePath = buildTempArchivePath(outputPath);
	const tempArchiveCleanupPaths = resolveBackupTarAttemptTempPaths(tempArchivePath);
	const stateAsset = result.assets.find((asset) => asset.kind === "state");
	try {
		const stateSqliteBackup = stateAsset ? await createStateSqliteBackupPlan({
			stateDir: stateAsset.sourcePath,
			tempDir
		}) : {
			snapshots: [],
			discoveredSourcePaths: /* @__PURE__ */ new Set()
		};
		const sourcePathRemaps = /* @__PURE__ */ new Map();
		const skippedSqliteSourcePaths = /* @__PURE__ */ new Set();
		for (const snapshot of stateSqliteBackup.snapshots) {
			sourcePathRemaps.set(path.resolve(snapshot.sourcePath), snapshot.archiveSourcePath);
			for (const skippedSourcePath of snapshot.skippedSourcePaths) skippedSqliteSourcePaths.add(skippedSourcePath);
		}
		await writeJson(manifestPath, buildManifest({
			createdAt,
			archiveRoot,
			includeWorkspace,
			onlyConfig,
			assets: result.assets,
			skipped: result.skipped,
			stateDir: plan.stateDir,
			configPath: plan.configPath,
			oauthDir: plan.oauthDir,
			workspaceDirs: plan.workspaceDirs
		}), { trailingNewline: true });
		const tar = await loadTarRuntime();
		const extensionsFilter = stateAsset ? buildExtensionsNodeModulesFilter(stateAsset.sourcePath) : void 0;
		const volatilePlan = { stateDirs: [stateAsset?.sourcePath ?? plan.stateDir] };
		let skippedVolatileCount = 0;
		const unexpectedSqliteSourcePaths = [];
		const tarFilter = (entryPath, entryStat) => {
			const resolvedEntryPath = path.resolve(entryPath);
			if (resolvedEntryPath === manifestPath) return true;
			if (extensionsFilter && !extensionsFilter(entryPath)) return false;
			const sqliteSourceKind = stateAsset ? classifyStateSqliteBackupSourcePath(resolvedEntryPath, stateAsset.sourcePath) : void 0;
			if (sqliteSourceKind === "excluded") return false;
			if (skippedSqliteSourcePaths.has(resolvedEntryPath)) return false;
			if (sqliteSourceKind === "sqlite" && stateSqliteBackup.discoveredSourcePaths.has(resolvedEntryPath)) return false;
			if (sqliteSourceKind === "sqlite" && isBackupTarFilterFile(entryStat)) {
				unexpectedSqliteSourcePaths.push(entryPath);
				return false;
			}
			if (isVolatileBackupPath(entryPath, volatilePlan)) {
				skippedVolatileCount += 1;
				return false;
			}
			return true;
		};
		const completedTempArchivePath = await writeTarArchiveWithRetry({
			tempArchivePath,
			log: opts.log,
			runTar: async (attemptTempArchivePath) => {
				skippedVolatileCount = 0;
				unexpectedSqliteSourcePaths.length = 0;
				await writeArchiveStreamToFile({
					archivePath: attemptTempArchivePath,
					archiveStream: tar.c({
						gzip: true,
						portable: true,
						preservePaths: true,
						linkCache: new BackupLinkCache(),
						statCache: createBackupVolatileStatCache(volatilePlan),
						filter: tarFilter,
						onWriteEntry: (entry) => {
							entry.path = remapArchiveEntryPath({
								entryPath: entry.path,
								manifestPath,
								archiveRoot,
								sourcePathRemaps
							});
						}
					}, [
						manifestPath,
						...stateSqliteBackup.snapshots.map((snapshot) => snapshot.sourcePath),
						...result.assets.map((asset) => asset.sourcePath)
					])
				});
				const unexpectedSqliteSourcePath = unexpectedSqliteSourcePaths[0];
				if (unexpectedSqliteSourcePath) throw new Error(`SQLite state appeared after snapshot discovery: ${unexpectedSqliteSourcePath}. Retry backup so it can be snapshotted.`);
			}
		});
		result.skippedVolatileCount = skippedVolatileCount;
		if (skippedVolatileCount > 0) opts.log?.(`Backup skipped ${skippedVolatileCount} volatile file${skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, sockets, pid/tmp).`);
		await publishTempArchive({
			tempArchivePath: completedTempArchivePath,
			outputPath
		});
	} finally {
		for (const cleanupPath of tempArchiveCleanupPaths) await removeBackupTempArchiveBestEffort(cleanupPath);
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
	return result;
}
//#endregion
export { formatBackupCreateSummary as n, createBackupArchive as t };
