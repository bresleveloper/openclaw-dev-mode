import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as assertNoSymlinkParentsSync } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, Yt as discriminatedUnion, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-C_0BsNDD.mjs";
import { r as replaceFileAtomicSync } from "./replace-file-DJtj9VLX.mjs";
import { a as publishFileExclusive, l as syncDirectory, p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-BKe2aOQN.mjs";
import { o as isSessionSqliteMigrationWarning } from "./doctor-session-sqlite-types-Hd3T2UXj.mjs";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor-session-sqlite-artifact.ts
/** Exact original identity and no-copy publication for migration recovery artifacts. */
const IdentitySchema = object({
	dev: string(),
	ino: string(),
	mtimeNs: string(),
	size: number().int().nonnegative(),
	sha256: string().regex(/^[a-f0-9]{64}$/)
});
const MigrationArtifactSchema = object({
	identity: IdentitySchema,
	classification: _enum([
		"imported",
		"repair-original",
		"protected"
	]),
	reason: string(),
	dependencies: array(string()).default([]),
	disposal: discriminatedUnion("state", [
		object({ state: literal("retained") }),
		object({
			state: literal("pending-disposal"),
			claimPath: string(),
			intendedAt: string(),
			phase: _enum(["intent", "unlink-pending"])
		}),
		object({
			state: literal("disposed"),
			disposedAt: string()
		})
	])
});
function statMigrationPath(filePath) {
	try {
		return fs.lstatSync(filePath);
	} catch (error) {
		if ((isRecord(error) ? error.code : void 0) === "ENOENT") return;
		throw error;
	}
}
function isPendingMigrationArtifactClaim(archivePath, artifact) {
	if (artifact?.disposal.state !== "pending-disposal") return false;
	const original = statMigrationPath(archivePath);
	const claim = statMigrationPath(artifact.disposal.claimPath);
	return Boolean(original?.isFile() && claim?.isFile() && original.nlink === 2 && claim.nlink === 2 && original.dev === claim.dev && original.ino === claim.ino && String(original.ino) === artifact.identity.ino);
}
function formatMigrationArtifactRefusal(filePath, stat) {
	if (!stat.isFile() || stat.nlink <= 1n) return "artifact is not an unaliased regular file";
	return `Artifact ${filePath} is not an unaliased regular file (nlink=${stat.nlink}, dev=${stat.dev}, inode=${stat.ino}): another hard link references this inode; the migration refuses aliased inputs so a snapshot copy cannot be rewritten in place. Stop the Gateway and make a verified backup, then follow the recovery guidance: https://docs.openclaw.ai/cli/doctor/sqlite-maintenance#hard-linked-legacy-artifacts`;
}
/** Descriptor reads are bounded; identity and content are checked before and after hashing. */
function readMigrationArtifactIdentity(filePath, expectedLinks = 1n, importedFingerprint) {
	const before = fs.lstatSync(filePath, { bigint: true });
	if (!before.isFile() || before.nlink !== expectedLinks) throw new Error(formatMigrationArtifactRefusal(filePath, before));
	if (importedFingerprint && [
		"ctimeNs",
		"dev",
		"ino",
		"mtimeNs",
		"size"
	].some((key) => before[key] !== importedFingerprint[key])) throw new Error("Transcript changed after import; retaining the unverified original");
	const fd = fs.openSync(filePath, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0));
	try {
		const opened = fs.fstatSync(fd, { bigint: true });
		if (!opened.isFile() || opened.dev !== before.dev || opened.ino !== before.ino) throw new Error("artifact identity changed");
		const { sha256, sizeBytes: bytes } = hashFileDescriptorSync(fd);
		const after = fs.lstatSync(filePath, { bigint: true });
		if (after.dev !== before.dev || after.ino !== before.ino || after.mtimeNs !== before.mtimeNs || after.ctimeNs !== before.ctimeNs || after.size !== before.size || BigInt(bytes) !== before.size) throw new Error("artifact changed while hashing");
		return {
			dev: String(before.dev),
			ino: String(before.ino),
			mtimeNs: String(before.mtimeNs),
			size: bytes,
			sha256
		};
	} finally {
		fs.closeSync(fd);
	}
}
function sameMigrationArtifact(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size && left.sha256 === right.sha256;
}
/** Exclusive same-filesystem link publication, then unlink; never copies raw history. */
async function moveMigrationArtifact(sourcePath, targetPath, expected, onPublished, publishSourceRemoval) {
	let createdPublication = false;
	if (!fs.lstatSync(targetPath, {
		bigint: true,
		throwIfNoEntry: false
	})) {
		if (!sameMigrationArtifact(readMigrationArtifactIdentity(sourcePath), expected)) throw new Error("artifact changed before publication");
		const published = await publishFileExclusive({
			sourcePath,
			targetPath,
			expectedSourceIdentity: {
				dev: BigInt(expected.dev),
				ino: BigInt(expected.ino)
			},
			strategy: "link-required",
			onSyncFailure: "preserve"
		});
		requireDirectorySync(published.directorySync, "Recovery artifact publication");
		createdPublication = true;
	} else requireDirectorySync(await syncDirectory(path.dirname(targetPath)), "Recovery artifact publication");
	const removeSource = () => {
		assertMigrationArtifactPublication(sourcePath, targetPath, expected);
		if (onPublished) {
			onPublished();
			assertMigrationArtifactPublication(sourcePath, targetPath, expected);
		}
		fs.unlinkSync(sourcePath);
	};
	let retainedSource = false;
	const retainSource = () => {
		if (!createdPublication) throw new Error("Cannot discard a recovery publication created by an earlier run.");
		assertMigrationArtifactPublication(sourcePath, targetPath, expected);
		fs.unlinkSync(targetPath);
		retainedSource = true;
	};
	try {
		if (publishSourceRemoval) publishSourceRemoval(removeSource, retainSource);
		else removeSource();
	} finally {
		if (retainedSource) requireDirectorySync(await syncDirectory(path.dirname(targetPath)), "Recovery artifact deferral");
	}
	requireDirectorySync(await syncDirectory(path.dirname(sourcePath)), "Recovery artifact source");
	if (!sameMigrationArtifact(readMigrationArtifactIdentity(targetPath), expected)) throw new Error("artifact changed during publication");
}
/** Only the recorded exact two-name inode can finish or undo an interrupted publication. */
function assertMigrationArtifactPublication(sourcePath, targetPath, expected) {
	const target = fs.lstatSync(targetPath, { bigint: true });
	const source = fs.lstatSync(sourcePath, { bigint: true });
	if (!target.isFile() || !source.isFile() || target.dev !== source.dev || target.ino !== source.ino || source.nlink !== 2n || !sameMigrationArtifact(readMigrationArtifactIdentity(sourcePath, 2n), expected) || !sameMigrationArtifact(readMigrationArtifactIdentity(targetPath, 2n), expected)) throw new Error("publication paths changed or have unexpected aliases");
}
//#endregion
//#region src/commands/doctor-session-sqlite-migration-run.ts
/** Manifest and restore helpers for doctor-owned session SQLite migrations. */
const HISTORICAL_IMPORT_REASON = "indexed-historical-primary";
const SESSION_SQLITE_MIGRATION_RUNS_DIR = "session-sqlite-migration-runs";
const COMPLETED_MIGRATION_RUN_RETENTION = 50;
const AbsolutePathSchema = string().min(1).refine((value) => !value.includes("\0") && path.isAbsolute(value)).transform((value) => path.resolve(value));
const MigrationMoveSchema = object({
	archivePath: AbsolutePathSchema,
	artifact: MigrationArtifactSchema.optional(),
	kind: _enum([
		"legacy-store",
		"transcript",
		"trajectory",
		"unreferenced-jsonl"
	]),
	sessionKey: string().optional(),
	sourcePath: AbsolutePathSchema
}).superRefine((move, context) => {
	const disposal = move.artifact?.disposal;
	if (disposal?.state === "pending-disposal" && (path.dirname(disposal.claimPath) !== path.dirname(move.archivePath) || !/^\.cleanup-[a-f0-9-]{36}$/.test(path.basename(disposal.claimPath)))) context.addIssue({
		code: "custom",
		message: "disposal claim is outside its archive boundary"
	});
});
const MigrationIssueSchema = object({
	code: string().min(1),
	message: string(),
	sessionKey: string().optional()
});
const RestoreConflictSchema = object({
	archivePath: AbsolutePathSchema,
	reason: string(),
	sourcePath: AbsolutePathSchema
});
const GithubIssueMarkerSchema = string().regex(/^openclaw-report:[a-f0-9]{64}$/u);
const MigrationGithubIssueSchema = object({
	marker: GithubIssueMarkerSchema,
	status: literal("attempted"),
	title: string().min(1).max(512)
});
const MigrationTargetSchema = object({
	agentId: string().min(1),
	completedMoves: array(MigrationMoveSchema),
	issues: array(MigrationIssueSchema),
	plannedMoves: array(MigrationMoveSchema),
	sqlitePath: AbsolutePathSchema,
	storePath: AbsolutePathSchema,
	validationBeforeArchive: _enum([
		"not_run",
		"passed",
		"failed"
	])
}).superRefine((target, context) => {
	const plannedMoveKeys = /* @__PURE__ */ new Set();
	for (const move of target.plannedMoves) {
		if (!isRestoreMoveWithinTarget(move, target)) context.addIssue({
			code: "custom",
			message: "restore move is outside target paths"
		});
		if (move.artifact?.dependencies.some((source) => path.dirname(source) !== path.dirname(target.storePath))) context.addIssue({
			code: "custom",
			message: "artifact dependency is outside its source boundary"
		});
		const moveKey = migrationMoveKey(move);
		if (plannedMoveKeys.has(moveKey)) context.addIssue({
			code: "custom",
			message: "duplicate planned restore move"
		});
		plannedMoveKeys.add(moveKey);
	}
	const completedMoveKeys = /* @__PURE__ */ new Set();
	for (const move of target.completedMoves) {
		const moveKey = migrationMoveKey(move);
		if (!isRestoreMoveWithinTarget(move, target) || !plannedMoveKeys.has(moveKey) || completedMoveKeys.has(moveKey)) context.addIssue({
			code: "custom",
			message: "invalid completed restore move"
		});
		completedMoveKeys.add(moveKey);
	}
});
const MigrationManifestSchema = object({
	completedAt: string().optional(),
	failedAt: string().optional(),
	failureReports: object({
		githubIssue: MigrationGithubIssueSchema.optional(),
		jsonPath: AbsolutePathSchema,
		markdownPath: AbsolutePathSchema
	}).optional(),
	manifestVersion: union([
		literal(1),
		literal(2),
		literal(3),
		literal(4)
	]),
	openClawVersion: string().min(1),
	restore: object({
		attemptedAt: string().min(1),
		consumedArchives: array(AbsolutePathSchema).optional(),
		conflicts: array(RestoreConflictSchema),
		restoredFiles: array(AbsolutePathSchema),
		skippedFiles: array(AbsolutePathSchema),
		status: _enum([
			"restored",
			"partial",
			"conflicts",
			"failed",
			"noop"
		])
	}).optional(),
	runId: string().min(1),
	startedAt: string().min(1),
	targets: array(MigrationTargetSchema)
}).superRefine((manifest, context) => {
	if (manifest.failureReports?.githubIssue && manifest.manifestVersion !== 4) context.addIssue({
		code: "custom",
		message: "GitHub issue receipt requires manifest version 4",
		path: ["failureReports", "githubIssue"]
	});
	const targetKeys = /* @__PURE__ */ new Set();
	for (const target of manifest.targets) {
		const targetKey = sessionSqliteMigrationTargetKey(target);
		if (targetKeys.has(targetKey)) context.addIssue({
			code: "custom",
			message: "duplicate migration target"
		});
		targetKeys.add(targetKey);
	}
});
function createSessionSqliteMigrationRun(env, targets) {
	for (const target of targets) assertSafeMigrationTargetTopology(target);
	const runId = `session-sqlite-${Date.now()}-${randomUUID().slice(0, 8)}`;
	const manifestPath = path.join(resolveSessionSqliteMigrationRunsDir(env), `${runId}.json`);
	const activeRun = {
		manifest: {
			manifestVersion: 3,
			openClawVersion: VERSION,
			runId,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			targets: targets.map((target) => ({
				...normalizeMigrationTarget(target),
				completedMoves: [],
				issues: [],
				plannedMoves: [],
				validationBeforeArchive: "not_run"
			}))
		},
		manifestPath
	};
	writeSessionSqliteMigrationManifest(activeRun);
	pruneCompletedSessionSqliteMigrationRuns(env);
	return activeRun;
}
function resolveSessionSqliteMigrationRunsDir(env) {
	return canonicalMigrationFilePath(path.join(resolveStateDir(env), SESSION_SQLITE_MIGRATION_RUNS_DIR));
}
function writeSessionSqliteMigrationManifest(activeRun) {
	fs.mkdirSync(path.dirname(activeRun.manifestPath), {
		recursive: true,
		mode: 448
	});
	replaceFileAtomicSync({
		filePath: activeRun.manifestPath,
		content: `${JSON.stringify(activeRun.manifest, null, 2)}\n`,
		dirMode: 448,
		mode: 384,
		tempPrefix: path.basename(activeRun.manifestPath),
		copyFallbackOnPermissionError: false,
		syncTempFile: true
	});
	requireDirectorySync(syncDirectorySync(path.dirname(activeRun.manifestPath)), "Session SQLite migration manifest");
}
function updateMigrationManifestTarget(activeRun, target, issues, updates = {}) {
	const manifestTarget = findMigrationManifestTarget(activeRun, target);
	if (!activeRun || !manifestTarget) return;
	manifestTarget.issues = issues.map((issue) => ({ ...issue }));
	if (updates.validationBeforeArchive) manifestTarget.validationBeforeArchive = updates.validationBeforeArchive;
	writeSessionSqliteMigrationManifest(activeRun);
}
function recordPlannedMigrationMoves(activeRun, target, moves) {
	recordMigrationMoves(activeRun, target, "plannedMoves", moves);
}
function recordCompletedMigrationMoves(activeRun, target, moves) {
	recordMigrationMoves(activeRun, target, "completedMoves", moves);
}
function recordMigrationMoves(activeRun, target, listKey, moves) {
	const manifestTarget = findMigrationManifestTarget(activeRun, target);
	if (!activeRun || !manifestTarget || moves.length === 0) return;
	const targetMoves = manifestTarget[listKey];
	const knownMoves = new Set(targetMoves.map(migrationMoveKey));
	let changed = false;
	for (const move of moves) {
		const normalizedMove = normalizeMigrationMove(move);
		const key = migrationMoveKey(normalizedMove);
		if (knownMoves.has(key)) continue;
		knownMoves.add(key);
		targetMoves.push(normalizedMove);
		changed = true;
	}
	if (changed) writeSessionSqliteMigrationManifest(activeRun);
}
function migrationMoveKey(move) {
	return `${move.sourcePath}\u0000${move.archivePath}`;
}
function findLatestFailedSessionSqliteMigrationManifest(env, trustedTargets) {
	return listSessionSqliteMigrationManifestPaths(env).map((manifestPath) => {
		const manifest = readSessionSqliteMigrationManifest(manifestPath);
		return {
			manifest,
			manifestPath,
			targets: manifest ? filterRestoreManifestTargets(manifest, trustedTargets) : []
		};
	}).filter((item) => item.manifest !== void 0 && isFailedSessionSqliteMigrationManifest(item.manifest) && item.targets.length > 0).toSorted((left, right) => manifestSortTime(right.manifest) - manifestSortTime(left.manifest))[0];
}
function sessionSqliteMigrationTargetKey(target) {
	return `${target.agentId}\u0000${canonicalMigrationFilePath(target.storePath)}`;
}
function findMigrationManifestTarget(activeRun, target) {
	if (!activeRun) return;
	return activeRun.manifest.targets.find((item) => sessionSqliteMigrationTargetKey(item) === sessionSqliteMigrationTargetKey(target));
}
function assertSafeSessionSqliteMigrationMove(move, target) {
	if (!isRestoreMoveWithinTarget(move, target)) throw new Error(`Migration source is outside the target sessions directory: ${move.sourcePath}`);
	if (!isRegularFileWithoutFollowingSymlinks(move.sourcePath)) throw new Error(`Migration source is not a regular file: ${move.sourcePath}`);
	assertSafeSessionSqliteMigrationDirectory(path.dirname(move.sourcePath));
	assertSafeSessionSqliteMigrationDirectory(path.dirname(move.archivePath));
}
function assertSafeSessionSqliteMigrationDirectory(directoryPath) {
	if (hasSymbolicLinkInDirectoryPath(directoryPath)) throw new Error(`Refusing session SQLite migration through symbolic link: ${directoryPath}`);
}
function isRegularFileWithoutFollowingSymlinks(filePath) {
	try {
		return fs.lstatSync(filePath).isFile();
	} catch {
		return false;
	}
}
function hasSymbolicLinkInDirectoryPath(directoryPath, allowRootChildSymlink = false) {
	const resolvedPath = path.resolve(directoryPath);
	const root = path.parse(resolvedPath).root;
	const rootDir = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
	try {
		assertNoSymlinkParentsSync({
			rootDir,
			targetPath: resolvedPath === root ? rootDir : resolvedPath,
			allowRootChildSymlink
		});
		return false;
	} catch {
		return true;
	}
}
function filterRestoreManifestTargets(manifest, trustedTargets) {
	if (trustedTargets.length === 0) return [];
	const trustedSqlitePaths = new Map(trustedTargets.map((target) => [sessionSqliteMigrationTargetKey(target), canonicalMigrationFilePath(target.sqlitePath)]));
	return manifest.targets.filter((target) => trustedSqlitePaths.get(sessionSqliteMigrationTargetKey(target)) === canonicalMigrationFilePath(target.sqlitePath));
}
function listSessionSqliteMigrationManifestPaths(env) {
	const runsDir = resolveSessionSqliteMigrationRunsDir(env);
	let entries;
	try {
		entries = fs.readdirSync(runsDir);
	} catch (error) {
		if (isRecord(error) && error.code === "ENOENT") return [];
		throw error;
	}
	return entries.filter((entry) => entry.endsWith(".json")).filter((entry) => !entry.endsWith(".failure.json")).map((entry) => path.join(runsDir, entry)).toSorted((left, right) => right.localeCompare(left));
}
function readSessionSqliteMigrationManifest(manifestPath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
		const result = MigrationManifestSchema.safeParse(parsed);
		if (!result.success) return;
		if (result.data.manifestVersion === 1) {
			if (hasUnsupportedV1DirectorySymlink(result.data)) return;
			const normalized = {
				...result.data,
				targets: result.data.targets.map(normalizeMigrationTargetManifest)
			};
			const normalizedResult = MigrationManifestSchema.safeParse(normalized);
			return normalizedResult.success ? normalizedResult.data : void 0;
		}
		return result.data;
	} catch {
		return;
	}
}
function isRestoreMoveWithinTarget(move, target) {
	const sourcePath = path.resolve(move.sourcePath);
	const archivePath = path.resolve(move.archivePath);
	if (sourcePath === archivePath) return false;
	const storePath = path.resolve(target.storePath);
	const sessionsDir = path.dirname(storePath);
	const archiveDir = path.join(path.dirname(sessionsDir), "session-sqlite-import-archive");
	if (path.dirname(archivePath) !== archiveDir) return false;
	return move.kind === "legacy-store" ? sourcePath === storePath : path.dirname(sourcePath) === sessionsDir;
}
function normalizeMigrationTarget(target) {
	return {
		agentId: target.agentId,
		sqlitePath: canonicalMigrationFilePath(target.sqlitePath),
		storePath: canonicalMigrationFilePath(target.storePath)
	};
}
function normalizeMigrationTargetManifest(target) {
	return {
		...target,
		...normalizeMigrationTarget(target),
		completedMoves: target.completedMoves.map(normalizeMigrationMove),
		plannedMoves: target.plannedMoves.map(normalizeMigrationMove)
	};
}
function normalizeMigrationMove(move) {
	return {
		archivePath: canonicalMigrationFilePath(move.archivePath),
		...move.artifact ? { artifact: move.artifact } : {},
		kind: move.kind,
		...move.sessionKey ? { sessionKey: move.sessionKey } : {},
		sourcePath: canonicalMigrationFilePath(move.sourcePath)
	};
}
function hasUnsupportedV1DirectorySymlink(manifest) {
	return manifest.targets.flatMap((target) => [
		path.dirname(target.sqlitePath),
		path.dirname(target.storePath),
		...target.plannedMoves.flatMap((move) => [path.dirname(move.archivePath), path.dirname(move.sourcePath)]),
		...target.completedMoves.flatMap((move) => [path.dirname(move.archivePath), path.dirname(move.sourcePath)])
	]).some((directoryPath) => hasSymbolicLinkInDirectoryPath(directoryPath, true));
}
function canonicalMigrationFilePath(filePath) {
	const resolvedPath = path.resolve(filePath);
	const fileName = path.basename(resolvedPath);
	const directoryPath = path.dirname(resolvedPath);
	const suffix = [];
	let currentPath = directoryPath;
	while (true) try {
		return path.join(fs.realpathSync.native(currentPath), ...suffix, fileName);
	} catch (error) {
		const code = error.code;
		const parentPath = path.dirname(currentPath);
		if (code !== "ENOENT" && code !== "ENOTDIR" || parentPath === currentPath) return resolvedPath;
		suffix.unshift(path.basename(currentPath));
		currentPath = parentPath;
	}
}
function assertSafeMigrationTargetTopology(target) {
	for (const filePath of [target.storePath, target.sqlitePath]) if (isSymbolicLinkPath(filePath) || isSymbolicLinkPath(path.dirname(filePath))) throw new Error(`Refusing session SQLite migration through symbolic link: ${filePath}`);
	const sessionsDir = path.dirname(canonicalMigrationFilePath(target.storePath));
	assertSafeSessionSqliteMigrationDirectory(path.join(path.dirname(sessionsDir), "session-sqlite-import-archive"));
}
function isSymbolicLinkPath(filePath) {
	try {
		return fs.lstatSync(filePath).isSymbolicLink();
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
function isFailedSessionSqliteMigrationManifest(manifest) {
	return manifest.completedAt === void 0 || manifest.failedAt !== void 0 || manifest.failureReports !== void 0 || manifest.targets.some((target) => target.issues.some((issue) => !isSessionSqliteMigrationWarning(issue)));
}
function manifestSortTime(manifest) {
	const timestamp = manifest.failedAt ?? manifest.completedAt ?? manifest.startedAt;
	const parsed = Date.parse(timestamp);
	return Number.isFinite(parsed) ? parsed : 0;
}
function pruneCompletedSessionSqliteMigrationRuns(env) {
	const all = listSessionSqliteMigrationManifestPaths(env).map((manifestPath) => ({
		manifest: readSessionSqliteMigrationManifest(manifestPath),
		manifestPath
	}));
	const dependencies = new Set(all.flatMap(({ manifest }) => manifest?.targets.flatMap((target) => uniqueRestoreMoves(target).filter((move) => move.artifact?.disposal.state !== "disposed").flatMap((move) => [move.sourcePath].concat(move.artifact?.dependencies ?? []))) ?? []));
	const completed = all.filter((item) => item.manifest !== void 0 && item.manifest.completedAt !== void 0 && !isFailedSessionSqliteMigrationManifest(item.manifest) && item.manifest.targets.every((target) => uniqueRestoreMoves(target).every((move) => move.artifact?.disposal.state === "disposed" && !dependencies.has(move.sourcePath)))).toSorted((left, right) => manifestSortTime(right.manifest) - manifestSortTime(left.manifest));
	for (const item of completed.slice(COMPLETED_MIGRATION_RUN_RETENTION)) try {
		fs.rmSync(item.manifestPath, { force: true });
	} catch {}
}
function uniqueRestoreMoves(target) {
	const moves = /* @__PURE__ */ new Map();
	for (const move of [...target.completedMoves, ...target.plannedMoves]) moves.set(`${move.sourcePath}\u0000${move.archivePath}`, move);
	return [...moves.values()];
}
//#endregion
export { readMigrationArtifactIdentity as C, moveMigrationArtifact as S, statMigrationPath as T, uniqueRestoreMoves as _, createSessionSqliteMigrationRun as a, MigrationArtifactSchema as b, hasSymbolicLinkInDirectoryPath as c, migrationMoveKey as d, readSessionSqliteMigrationManifest as f, sessionSqliteMigrationTargetKey as g, resolveSessionSqliteMigrationRunsDir as h, canonicalMigrationFilePath as i, isRegularFileWithoutFollowingSymlinks as l, recordPlannedMigrationMoves as m, assertSafeSessionSqliteMigrationDirectory as n, filterRestoreManifestTargets as o, recordCompletedMigrationMoves as p, assertSafeSessionSqliteMigrationMove as r, findLatestFailedSessionSqliteMigrationManifest as s, HISTORICAL_IMPORT_REASON as t, listSessionSqliteMigrationManifestPaths as u, updateMigrationManifestTarget as v, sameMigrationArtifact as w, isPendingMigrationArtifactClaim as x, writeSessionSqliteMigrationManifest as y };
