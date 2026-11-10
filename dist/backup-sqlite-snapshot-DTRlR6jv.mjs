import { r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { v as resolveGatewayLockDir } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { a as resolveOpenClawRegisteredAgentDatabasePath, c as resolveOpenClawStateSqlitePath, l as resolveQuarantineStorePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { a as sameFileMutationFingerprint } from "./file-descriptor-BWLpOgrg.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { a as resolveSqliteDatabaseFilePaths, r as isAppleDoubleMetadataFile, t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-N5UzY_DG.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { w as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import "./session-key-CSDERtm3.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { g as readOpenClawAgentDatabaseRegistryRows } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { n as CONFIG_AUDIT_SCOPE } from "./io.audit-CCHda99t.mjs";
import { n as assertOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-maintenance-DIdAFgIX.mjs";
import { _ as listDefaultAgentDatabasePaths, i as collectStateDatabasePaths } from "./update-candidate-state-fXM6fMqw.mjs";
import { n as isTransientSqliteBackupPath } from "./backup-volatile-filter-60qK_QQY.mjs";
import { t as assertNotUpdateCapturePath } from "./update-capture-paths-KB4ru3JI.mjs";
import { r as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-u13JUemz.mjs";
import { n as inspectLegacyMigrationLinkedMove } from "./state-migrations.no-replace-move-CE5iXCsS.mjs";
import { n as SYSTEM_AGENT_AUDIT_SCOPE } from "./audit-DxyhTU4L.mjs";
import { r as sealBackupResourceInventory, t as createBackupResourcePlan } from "./backup-resource-inventory-Cw2aamVQ.mjs";
import { t as embedSessionColdArchivesInSnapshot } from "./session-cold-storage-backup-C62shack.mjs";
import { c as readBackupEngineImage, i as capturePostgresBackup } from "./database-backup-EzQ2PUMu.mjs";
import { n as sanitizeOpenClawStateLeaseRows, t as sanitizeOpenClawGlobalStateSnapshot } from "./openclaw-state-snapshot-sanitizer-rntdA4KE.mjs";
import { t as listDatabaseEngineStores } from "./registry-Pq69ANKA.mjs";
import { a as readLegacyAuditSourcePrefixSnapshotForBackup, d as serializePreparedAuditRecords, g as detectLegacyAuditLogs, i as readLegacyAuditRecoverySourceForBackup, m as legacyAuditMoveCandidates, r as findPreviousLegacyAuditRawCheckpoint, u as prepareLegacyAuditRecords, v as legacyAuditSourceGenerationKey } from "./state-migrations.audit-recovery-B7OnWUd5.mjs";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import childProcess from "node:child_process";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { isPathInside } from "@openclaw/fs-safe/path";
import { walkDirectory } from "@openclaw/fs-safe/walk";
//#region src/infra/backup-sqlite-source-groups.ts
function hasKnownIdentity(identity) {
	return process.platform !== "win32" || identity.dev !== 0n && identity.ino !== 0n;
}
async function readRegularSidecar(pathname) {
	let identity;
	try {
		identity = await fs.lstat(pathname, { bigint: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	}
	if (!identity.isFile()) throw new Error(`SQLite hardlink sidecar must be a regular file: ${pathname}`);
	return identity;
}
async function assertGroupPaths(group) {
	for (const source of group.sources) {
		const current = await fs.lstat(source.path, { bigint: true });
		if (!current.isFile() || !sameFileIdentity(source.identity, current) || group.sources.length > 1 && !hasKnownIdentity(current) || await fs.realpath(source.path) !== source.path) throw new Error(`SQLite backup source identity changed: ${source.path}`);
		if (current.nlink !== BigInt(group.sources.length)) throw new Error(`SQLite hardlink journal owner may be outside the backup inventory: ${source.path} has ${current.nlink} links, but ${group.sources.length} paths were admitted. Include every database hardlink before retrying.`);
	}
}
async function readGroupWalOwners(group) {
	const owners = [];
	for (const source of group.sources) {
		const wal = await readRegularSidecar(`${source.path}-wal`);
		const journal = await readRegularSidecar(`${source.path}-journal`);
		await readRegularSidecar(`${source.path}-shm`);
		if (journal && journal.size > 0n) throw new Error(`SQLite hardlink journal ownership cannot be established safely while a rollback journal is present: ${source.path}. Close the database cleanly before retrying.`);
		if (wal && wal.size > 0n) {
			if (!hasKnownIdentity(wal)) throw new Error(`SQLite hardlink WAL identity cannot be verified: ${source.path}-wal`);
			owners.push({
				path: source.path,
				identity: wal
			});
		}
	}
	if (owners.length > 1) throw new Error(`Ambiguous SQLite hardlink journal ownership: multiple non-empty WAL files for ${group.sources.map((source) => source.path).join(", ")}. Close the database writers before retrying.`);
	return owners;
}
async function assertBackupSqliteSourceGroup(group) {
	await assertGroupPaths(group);
	if (group.sources.length === 1) return;
	const [owner] = await readGroupWalOwners(group);
	if (group.walIdentity ? !owner || owner.path !== group.sourcePath || !sameFileIdentity(group.walIdentity, owner.identity) : owner !== void 0) throw new Error(`SQLite hardlink journal ownership changed during backup: ${group.sourcePath}`);
	if (!sameFileMutationFingerprint(group.databaseFingerprint, await fs.stat(group.sourcePath, { bigint: true }))) throw new Error(`SQLite hardlink database changed during backup: ${group.sourcePath}. Close database writers cleanly before retrying.`);
}
/** Resolve journal ownership after canonical role validation and physical path resolution. */
async function planBackupSqliteSourceGroups(sources) {
	const groups = /* @__PURE__ */ new Map();
	for (const source of sources) {
		const knownIdentity = hasKnownIdentity(source.identity);
		if (!knownIdentity && source.identity.nlink > 1n) throw new Error(`SQLite hardlink identity cannot be verified: ${source.path}`);
		const key = knownIdentity ? `${source.identity.dev}:${source.identity.ino}` : source.path;
		const group = groups.get(key);
		if (group) {
			if (!group.sources.some((entry) => entry.path === source.path)) group.sources.push(source);
		} else groups.set(key, {
			sources: [source],
			sourcePath: source.path,
			walIdentity: null,
			databaseFingerprint: await fs.stat(source.path, { bigint: true })
		});
	}
	const byPath = /* @__PURE__ */ new Map();
	for (const group of groups.values()) {
		await assertGroupPaths(group);
		if (group.sources.length > 1) {
			const [owner] = await readGroupWalOwners(group);
			if (owner) {
				group.sourcePath = owner.path;
				group.walIdentity = owner.identity;
			}
		}
		for (const source of group.sources) byPath.set(source.path, group);
	}
	return byPath;
}
async function captureBackupSqliteSourceGroup(group, capture) {
	await assertBackupSqliteSourceGroup(group);
	await capture();
	await assertBackupSqliteSourceGroup(group);
}
//#endregion
//#region src/infra/sqlite-header-probe.ts
const SQLITE_HEADER_PROBE_BATCH_SIZE = 4096;
const SQLITE_HEADER_PROBE_TIMEOUT_MS = 1e4;
function probeSqliteHeaderBatch(workerArgv, batch, results) {
	const result = childProcess.spawnSync(process.execPath, workerArgv, {
		input: JSON.stringify(batch),
		encoding: "utf8",
		maxBuffer: 67108864,
		timeout: SQLITE_HEADER_PROBE_TIMEOUT_MS
	});
	if (result.error) {
		if (hasErrnoCode(result.error, "ETIMEDOUT") && batch.length > 1) {
			const middle = Math.ceil(batch.length / 2);
			probeSqliteHeaderBatch(workerArgv, batch.slice(0, middle), results);
			probeSqliteHeaderBatch(workerArgv, batch.slice(middle), results);
			return;
		}
		throw result.error;
	}
	if (result.status !== 0) throw new Error(`Header probe exited with status ${result.status}: ${result.stderr.trim()}`);
	const answers = JSON.parse(result.stdout);
	if (!Array.isArray(answers) || answers.length !== batch.length || !answers.every((answer) => typeof answer === "boolean")) throw new Error("Header probe returned an incomplete result");
	for (let index = 0; index < batch.length; index++) results.set(batch[index], answers[index]);
}
/** Probe discovery batches without disturbing live SQLite file locks. */
function probeSqliteDatabaseHeaders(pathnames) {
	const paths = [...new Set(pathnames)];
	if (paths.length === 0) return /* @__PURE__ */ new Map();
	const results = /* @__PURE__ */ new Map();
	try {
		const workerArgv = resolveRuntimeWorkerArgv(resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sqliteHeaderProbe));
		for (let start = 0; start < paths.length; start += SQLITE_HEADER_PROBE_BATCH_SIZE) probeSqliteHeaderBatch(workerArgv, paths.slice(start, start + SQLITE_HEADER_PROBE_BATCH_SIZE), results);
		return results;
	} catch (cause) {
		throw new Error(hasErrnoCode(cause, "ETIMEDOUT") ? `SQLite header probe timed out after ${SQLITE_HEADER_PROBE_TIMEOUT_MS} ms while checking ${paths.length} backup paths. For a blocked update, preserve a verified backup and follow the manual package-manager hop: https://docs.openclaw.ai/install/updating/update-methods#alternative-manual-npm-pnpm-or-bun` : "Could not determine whether backup files are SQLite databases. Check that the backup worker can run and the source files are readable, then retry the backup.", { cause });
	}
}
//#endregion
//#region src/infra/state-migrations.audit-backup.ts
var LegacyAuditBackupStateChangedError = class extends Error {
	constructor(message = "Legacy audit state changed while backup was capturing it") {
		super(message);
		this.name = "LegacyAuditBackupStateChangedError";
	}
};
const LEGACY_AUDIT_RAW_CHECKPOINT_SCOPE = "migration.legacy-audit-raw";
function createLegacyAuditDatabaseWitness(database) {
	const rows = database.prepare(`SELECT scope, event_key, payload_json, created_at, sequence
       FROM diagnostic_events
       WHERE (scope IN (?, ?) AND event_key GLOB 'legacy:*') OR scope = ?
       ORDER BY scope, event_key, sequence`).all(CONFIG_AUDIT_SCOPE, SYSTEM_AGENT_AUDIT_SCOPE, LEGACY_AUDIT_RAW_CHECKPOINT_SCOPE);
	return createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}
function legacyAuditBackupCapturesMatch(left, right) {
	return left.filesystemWitness === right.filesystemWitness && left.databaseWitness === right.databaseWitness;
}
/** Replaces live raw checkpoints with metadata for the transformed backup files. */
function rewriteLegacyAuditBackupCheckpoints(database, snapshots) {
	if (database.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get("diagnostic_events")?.ok !== 1) return;
	const scope = LEGACY_AUDIT_RAW_CHECKPOINT_SCOPE;
	database.prepare("DELETE FROM diagnostic_events WHERE scope = ?").run(scope);
	const insert = database.prepare(`INSERT INTO diagnostic_events (
        scope, event_key, payload_json, created_at, sequence
      ) VALUES (?, ?, ?, ?, ?)`);
	let sequence = 1;
	for (const snapshot of snapshots) {
		if (!snapshot.checkpoint) continue;
		insert.run(scope, snapshot.checkpoint.key, JSON.stringify(snapshot.checkpoint.value), 0, sequence);
		sequence += 1;
	}
}
async function createLegacyAuditBackupSnapshotsOnce(params) {
	const detected = detectLegacyAuditLogs({
		stateDir: params.stateDir,
		doctorOnlyStateMigrations: true
	});
	if (detected.sources.length === 0) return {
		snapshots: [],
		filesystemWitness: createHash("sha256").digest("hex")
	};
	const root$1 = await root(params.stateDir, {
		hardlinks: "reject",
		maxBytes: Number.MAX_SAFE_INTEGER,
		mkdir: false,
		mode: 384,
		symlinks: "reject"
	});
	const snapshots = [];
	const filesystemWitness = createHash("sha256");
	for (const [index, source] of detected.sources.entries()) {
		const sourceRelativePath = path.relative(path.resolve(params.stateDir), source.sourcePath);
		let linkedMove;
		for (const candidate of await legacyAuditMoveCandidates(root$1, source)) if ((candidate.retained === sourceRelativePath || candidate.removed === sourceRelativePath) && await inspectLegacyMigrationLinkedMove(root$1, candidate.retained, candidate.removed)) {
			linkedMove = candidate;
			break;
		}
		if (linkedMove && linkedMove.retained !== sourceRelativePath) continue;
		const snapshot = source.storage === "raw-archive" ? await readLegacyAuditRecoverySourceForBackup(root$1, sourceRelativePath, linkedMove?.removed) : await readLegacyAuditSourcePrefixSnapshotForBackup(root$1, sourceRelativePath, linkedMove?.removed);
		const sourceGeneration = legacyAuditSourceGenerationKey(sourceRelativePath);
		const previousCheckpoint = source.storage === "raw-archive" ? findPreviousLegacyAuditRawCheckpoint(params.stateDir, sourceRelativePath) : void 0;
		const prepared = prepareLegacyAuditRecords(source, snapshot.raw, sourceGeneration, previousCheckpoint?.recordOrdinalBase ?? 0);
		if (!prepared.ok) throw new Error(`Legacy ${source.label} append archive cannot be sanitized for backup: ${prepared.warnings.join("; ")}`);
		const sourcePath = path.join(params.tempDir, `legacy-audit-raw-${index}.jsonl`);
		await fs.writeFile(sourcePath, prepared.sanitizedJsonl, { mode: 384 });
		let checkpoint;
		if (previousCheckpoint) {
			if (previousCheckpoint.recordCount > prepared.records.length) throw new Error(`Legacy ${source.label} append archive is shorter than its durable checkpoint`);
			const transformedPrefix = Buffer.from(serializePreparedAuditRecords(prepared.records.slice(0, previousCheckpoint.recordCount)), "utf8");
			const value = {
				...previousCheckpoint,
				dev: "0",
				ino: "0",
				mtimeMs: 0,
				size: transformedPrefix.length,
				contentHash: createHash("sha256").update(transformedPrefix).digest("hex")
			};
			checkpoint = {
				key: value.generationKey,
				value
			};
		}
		const backupSnapshot = {
			sourcePath,
			archiveSourcePath: source.sourcePath,
			...checkpoint ? { checkpoint } : {},
			skippedSourcePaths: /* @__PURE__ */ new Set([
				path.resolve(source.sourcePath),
				...linkedMove ? [path.resolve(params.stateDir, linkedMove.removed)] : [],
				path.resolve(`${source.sourcePath}.doctor-scrub-progress`),
				path.resolve(`${source.sourcePath}.doctor-scrub-restore`),
				path.resolve(`${source.sourcePath}.doctor-scrub-staging`)
			])
		};
		const witnessMetadata = JSON.stringify([
			backupSnapshot.archiveSourcePath,
			snapshot.dev,
			snapshot.ino,
			snapshot.mtimeMs,
			snapshot.size,
			backupSnapshot.checkpoint
		]);
		for (const value of [witnessMetadata, prepared.sanitizedJsonl]) filesystemWitness.update(String(Buffer.byteLength(value))).update(":").update(value);
		snapshots.push(backupSnapshot);
	}
	return {
		snapshots,
		filesystemWitness: filesystemWitness.digest("hex")
	};
}
async function createLegacyAuditBackupCapture(params) {
	let capture;
	for (let attempt = 0;; attempt += 1) try {
		capture = await createLegacyAuditBackupSnapshotsOnce(params);
		break;
	} catch (error) {
		if (attempt === 2) throw error;
		await new Promise((resolve) => {
			setTimeout(resolve, 25);
		});
	}
	const databaseWitness = withExistingOpenClawStateDatabaseReadOnly(({ db }) => createLegacyAuditDatabaseWitness(db), { env: {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} }) ?? createHash("sha256").digest("hex");
	return {
		...capture,
		databaseWitness
	};
}
//#endregion
//#region src/infra/backup-sqlite-snapshot.ts
function ignoreMissingSource(error) {
	if (!hasErrnoCode(error, "ENOENT")) throw error;
}
function findLegacyAuditBackupStateChange(error) {
	return collectErrorGraphCandidates(error, (candidate) => candidate instanceof Error ? [candidate.cause] : []).find((candidate) => candidate instanceof LegacyAuditBackupStateChangedError);
}
const sqliteHeaderAnswers = /* @__PURE__ */ new WeakMap();
function stripSqliteSidecarSuffix(sourcePath) {
	const sidecarSuffix = SQLITE_SIDECAR_SUFFIXES.find((suffix) => sourcePath.endsWith(suffix));
	return sidecarSuffix ? sourcePath.slice(0, -sidecarSuffix.length) : sourcePath;
}
function headerAnswers(inventory) {
	let answers = sqliteHeaderAnswers.get(inventory);
	if (!answers) {
		answers = /* @__PURE__ */ new Map();
		sqliteHeaderAnswers.set(inventory, answers);
	}
	return answers;
}
function classifyBackupSqliteSource(sourcePath, inventory) {
	const resolvedSourcePath = path.resolve(sourcePath);
	if (!(isPathInside(inventory.stateDir, resolvedSourcePath) || inventory.agentRoots.some(({ sourcePath: agentRoot }) => isPathInside(agentRoot, resolvedSourcePath))) || inventory.isPackageContent(resolvedSourcePath)) return;
	const transient = isTransientSqliteBackupPath(resolvedSourcePath);
	const databasePath = stripSqliteSidecarSuffix(resolvedSourcePath);
	const nameTrusted = databasePath.endsWith(".sqlite");
	if (!inventory.isIncludedByOwner(resolvedSourcePath)) return nameTrusted ? "excluded" : void 0;
	if (!transient && !nameTrusted) {
		const answers = headerAnswers(inventory);
		if (!answers.has(databasePath)) for (const [pathname, sqlite] of probeSqliteDatabaseHeaders([databasePath])) answers.set(pathname, sqlite);
		if (!answers.get(databasePath)) return;
	}
	if (transient) return "excluded";
	if (!inventory.isIncluded(resolvedSourcePath)) return nameTrusted ? "excluded" : void 0;
	if (isAppleDoubleMetadataFile(resolvedSourcePath)) return "excluded";
	const source = inventory.resolveSqliteSource(databasePath);
	if (source && source.role === "unresolvable-link") return resolvedSourcePath === databasePath ? "opaque-skip" : "opaque";
	return source ? "sqlite" : "opaque";
}
async function discoverBackupSqliteSources(params) {
	const snapshotPaths = /* @__PURE__ */ new Set();
	const discoveredSourcePaths = /* @__PURE__ */ new Set();
	const visitedDirectories = /* @__PURE__ */ new Set();
	const candidates = [];
	const gatewayLockDir = resolveGatewayLockDir(params.inventory.stateDir);
	const isRetainedPath = (pathname) => !isPathInside(gatewayLockDir, pathname) && !params.inventory.isVolatile(pathname);
	for (const directory of [params.inventory.stateDir, ...params.inventory.agentRoots.map(({ sourcePath }) => sourcePath)]) {
		const root = path.resolve(directory);
		if (visitedDirectories.has(root)) continue;
		visitedDirectories.add(root);
		const { entries, failedDirs } = await walkDirectory(root, {
			symlinks: "include",
			include: (entry) => (entry.kind === "file" || entry.kind === "symlink") && isRetainedPath(entry.path) && params.inventory.isIncludedByOwner(entry.path),
			descend: (entry) => {
				if (visitedDirectories.has(entry.path) || !isRetainedPath(entry.path) || !params.inventory.isTraversable(entry.path) || params.inventory.isPackageContent(entry.path)) return false;
				visitedDirectories.add(entry.path);
				return true;
			}
		});
		const failure = failedDirs.find(({ error }) => !hasErrnoCode(error, "ENOENT"));
		if (failure) throw failure.error;
		for (const entry of entries) candidates.push(entry);
	}
	const answers = headerAnswers(params.inventory);
	const probePaths = [...candidates.map((entry) => entry.path), ...visitedDirectories].map(stripSqliteSidecarSuffix).filter((pathname) => !pathname.endsWith(".sqlite"));
	for (const [pathname, sqlite] of probeSqliteDatabaseHeaders(probePaths)) answers.set(pathname, sqlite);
	for (const entry of candidates) {
		if (classifyBackupSqliteSource(entry.path, params.inventory) !== "sqlite") continue;
		discoveredSourcePaths.add(entry.path);
		if (!SQLITE_SIDECAR_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))) snapshotPaths.add(entry.path);
	}
	for (const sourcePath of params.inventory.coreDatabaseSourcePaths) if (params.inventory.isIncluded(sourcePath)) {
		snapshotPaths.add(sourcePath);
		discoveredSourcePaths.add(sourcePath);
	}
	return {
		snapshotPaths: [...snapshotPaths].toSorted((left, right) => left.localeCompare(right)),
		discoveredSourcePaths
	};
}
async function discoverBackupDatabasePaths(params) {
	const paths = [...(await collectStateDatabasePaths(params)).values()].flatMap((database) => database.spellings);
	const plugins = resolvePluginMetadataSnapshot(params);
	const capable = new Set(listDatabaseEngineStores().filter((store) => store.postgres).map((store) => store.id));
	const retained = plugins.plugins.flatMap((plugin) => capable.has(plugin.id) ? (plugin.backupResources ?? []).map((resource) => Object.assign({}, resource, { pluginId: plugin.id })) : []);
	const resources = await createBackupResourcePlan({
		stateDir: params.stateDir,
		configPaths: [],
		oauthDirs: [],
		workspaceDirs: [],
		excludedWorkspaceDirs: [],
		agentRoots: [],
		pluginResources: retained,
		pluginRoots: plugins.plugins.map((plugin) => plugin.rootDir)
	});
	const inventory = sealBackupResourceInventory(resources, []);
	paths.push(...(await discoverBackupSqliteSources({ inventory })).snapshotPaths);
	const existing = [];
	for (const file of new Set(paths)) if ((await fs.stat(file).catch(ignoreMissingSource))?.isFile()) existing.push(await fs.realpath(file));
	return [...new Set(existing)].toSorted();
}
async function planBackupSqliteSources(inventory, snapshotPaths) {
	const sources = [];
	for (const archiveSourcePath of snapshotPaths) {
		const identity = await fs.stat(archiveSourcePath, { bigint: true });
		const owner = inventory.resolveSqliteSource(archiveSourcePath, identity);
		if (!owner || owner.role === "unresolvable-link") throw new Error(`SQLite ownership changed after discovery: ${archiveSourcePath}`);
		let canonicalSource;
		if (owner.role !== "plugin") {
			if (!owner.identity || !sameFileIdentity(owner.identity, identity)) throw new Error(`Canonical SQLite path changed after discovery: ${archiveSourcePath}`);
			canonicalSource = {
				...owner,
				archiveSourcePath: owner.sourcePath,
				sourcePath: await fs.realpath(owner.sourcePath),
				identity: owner.identity
			};
			assertNotUpdateCapturePath(canonicalSource.sourcePath, inventory.stateDir);
		}
		sources.push({
			archiveSourcePath,
			path: canonicalSource ? await fs.realpath(archiveSourcePath) : archiveSourcePath,
			identity,
			canonicalSource
		});
	}
	return {
		sources,
		groups: await planBackupSqliteSourceGroups(sources)
	};
}
async function createBackupSqliteSnapshotPlan(params) {
	const capturedSnapshots = /* @__PURE__ */ new Map();
	const snapshots = [];
	let capturedAgents = [];
	async function captureSource(archiveSourcePath, sourceGroup, canonicalSource) {
		if (!sourceGroup) throw new Error(`SQLite ownership changed after discovery: ${archiveSourcePath}`);
		if (canonicalSource && !sameFileIdentity(canonicalSource.identity, await fs.stat(archiveSourcePath, { bigint: true }))) throw new Error(`Canonical SQLite path changed after discovery: ${archiveSourcePath}`);
		const sourceDatabasePath = sourceGroup.sourcePath;
		assertNotUpdateCapturePath(archiveSourcePath, params.resources.stateDir);
		assertNotUpdateCapturePath(sourceDatabasePath, params.resources.stateDir);
		const sourcePath = path.join(params.tempDir, `openclaw-state-db-${snapshots.length}.sqlite`);
		try {
			const capture = () => createVerifiedSqliteSnapshot({
				sourcePath: sourceDatabasePath,
				targetPath: sourcePath,
				requireNonEmptySource: Boolean(canonicalSource),
				validate: canonicalSource?.role === "global" ? (database, pathname) => assertOpenClawStateDatabaseOwner(database, { pathname }) : canonicalSource?.role === "agent" ? (database, pathname) => assertOpenClawAgentDatabaseOwner(database, {
					agentId: canonicalSource.agentId,
					pathname
				}) : void 0,
				transform: async (database) => {
					if (canonicalSource?.role === "global") {
						capturedAgents = readOpenClawAgentDatabaseRegistryRows(database, canonicalSource.archiveSourcePath).map((row) => ({
							role: "agent",
							agentId: normalizeAgentId(row.agent_id),
							sourcePath: resolveOpenClawRegisteredAgentDatabasePath(canonicalSource.archiveSourcePath, row.path)
						}));
						if (params.legacyAuditDatabaseWitness !== void 0 && createLegacyAuditDatabaseWitness(database) !== params.legacyAuditDatabaseWitness) throw new LegacyAuditBackupStateChangedError("Legacy audit database rows changed during SQLite backup");
						sanitizeOpenClawGlobalStateSnapshot(database);
						rewriteLegacyAuditBackupCheckpoints(database, params.legacyAuditSnapshots);
					} else if (canonicalSource?.role === "agent") sanitizeOpenClawStateLeaseRows(database);
					await embedSessionColdArchivesInSnapshot({
						database,
						sourceStorePath: canonicalSource?.archiveSourcePath ?? sourceDatabasePath
					});
				}
			});
			const capturedPath = capturedSnapshots.get(sourceGroup);
			await captureBackupSqliteSourceGroup(sourceGroup, () => capturedPath ? fs.copyFile(capturedPath, sourcePath, fs.constants.COPYFILE_EXCL) : capture());
			capturedSnapshots.set(sourceGroup, sourcePath);
		} catch (error) {
			const stateChange = findLegacyAuditBackupStateChange(error);
			if (stateChange) throw stateChange;
			throw new Error(`SQLite database cannot be compacted safely for backup: ${archiveSourcePath}. ${formatErrorMessage(error)}. The source must pass full integrity checks, online SQLite backup, and offline compaction with its required SQLite capabilities; a direct file copy was refused because it can retain deleted data. For a plugin-owned database, restore the required SQLite capabilities or use the plugin's own backup procedure before retrying.`, { cause: error });
		}
		if (readBackupEngineImage(sourcePath, sourceDatabasePath).engine === "postgres") {
			const directory = path.join(`${sourcePath}.postgres`, path.basename(`${archiveSourcePath}.postgres`));
			await fs.mkdir(path.dirname(directory), { mode: 448 });
			await capturePostgresBackup({
				sourcePath: sourceDatabasePath,
				directory
			});
			for (const name of [
				"anchor.sqlite",
				"database.sqlite",
				"manifest.json"
			]) snapshots.push({
				sourcePath: path.join(directory, name),
				archiveSourcePath: `${archiveSourcePath}.postgres/${name}`,
				skippedSourcePaths: /* @__PURE__ */ new Set()
			});
			const anchorPath = `${sourcePath}.anchor`;
			await fs.copyFile(path.join(directory, "anchor.sqlite"), anchorPath, fs.constants.COPYFILE_EXCL);
			snapshots.push({
				sourcePath: anchorPath,
				archiveSourcePath,
				skippedSourcePaths: new Set(resolveSqliteDatabaseFilePaths(sourceDatabasePath))
			});
			return;
		}
		snapshots.push({
			sourcePath,
			archiveSourcePath,
			skippedSourcePaths: new Set([archiveSourcePath, sourceDatabasePath].flatMap((databasePath) => resolveSqliteDatabaseFilePaths(databasePath).map((pathname) => path.resolve(pathname))))
		});
	}
	const globalPath = resolveOpenClawStateSqlitePath({
		...process.env,
		OPENCLAW_STATE_DIR: params.resources.stateDir
	});
	const globalEntry = await fs.lstat(globalPath, { bigint: true }).catch(ignoreMissingSource);
	let globalIdentity;
	let globalGroup;
	if (globalEntry) {
		globalIdentity = globalEntry.isSymbolicLink() ? await fs.stat(globalPath, { bigint: true }) : globalEntry;
		if (!globalIdentity.isFile()) throw new Error(`Canonical global SQLite path must be a regular file or symlink to one: ${globalPath}`);
		const globalSource = {
			role: "global",
			archiveSourcePath: globalPath,
			sourcePath: await fs.realpath(globalPath),
			identity: globalIdentity
		};
		const globalInventory = sealBackupResourceInventory(params.resources, [{
			role: "global",
			sourcePath: globalPath,
			identity: globalIdentity
		}]);
		const { snapshotPaths } = await discoverBackupSqliteSources({ inventory: globalInventory });
		const { groups } = await planBackupSqliteSources(globalInventory, snapshotPaths.filter((sourcePath) => globalInventory.resolveSqliteSource(sourcePath)?.role === "global"));
		globalGroup = groups.get(globalSource.sourcePath);
		await captureSource(globalPath, globalGroup, globalSource);
	} else for (const sidecar of resolveSqliteDatabaseFilePaths(globalPath).slice(1)) if (await fs.lstat(sidecar).catch(ignoreMissingSource)) throw new Error(`Canonical global SQLite database is missing but a sidecar remains: ${sidecar}`);
	const coreDatabases = [{
		role: "global",
		sourcePath: globalPath,
		identity: globalIdentity
	}];
	const defaultDatabases = await listDefaultAgentDatabasePaths(params.resources.stateDir);
	const discoveredDatabasePaths = [];
	const candidates = [
		{
			role: "quarantine",
			sourcePath: resolveQuarantineStorePath({
				...process.env,
				OPENCLAW_STATE_DIR: params.resources.stateDir
			})
		},
		...capturedAgents,
		...params.resources.agentRoots.map(({ agentId, databasePath }) => ({
			role: "agent",
			agentId,
			sourcePath: databasePath
		})),
		...defaultDatabases.toSorted((a, b) => a.path.localeCompare(b.path)).map(({ agentId, path: sourcePath }) => ({
			role: "agent",
			agentId: normalizeAgentId(agentId),
			sourcePath,
			discoveredPath: sourcePath
		}))
	];
	for (const { discoveredPath, ...database } of candidates) {
		const identity = await fs.stat(database.sourcePath, { bigint: true }).catch(ignoreMissingSource);
		if (identity && !identity.isFile()) throw new Error(`Core SQLite path must resolve to a regular file: ${database.sourcePath}`);
		if (discoveredPath && !identity) continue;
		if (discoveredPath) {
			discoveredDatabasePaths.push(discoveredPath);
			database.sourcePath = await fs.realpath(database.sourcePath);
		}
		coreDatabases.push(Object.freeze({
			...database,
			identity
		}));
	}
	const inventory = sealBackupResourceInventory({
		...params.resources,
		protectedPaths: [...params.resources.protectedPaths, ...discoveredDatabasePaths]
	}, coreDatabases);
	const discovery = await discoverBackupSqliteSources({ inventory });
	const { sources, groups } = await planBackupSqliteSources(inventory, discovery.snapshotPaths);
	for (const source of sources) if (source.archiveSourcePath !== globalPath) await captureSource(source.archiveSourcePath, source.canonicalSource?.role === "global" ? globalGroup : groups.get(source.path), source.canonicalSource);
	if (globalGroup) await assertBackupSqliteSourceGroup(globalGroup);
	for (const source of coreDatabases) if (source.identity && !sameFileIdentity(source.identity, await fs.stat(source.sourcePath, { bigint: true }))) throw new Error(`Canonical SQLite path changed after discovery: ${source.sourcePath}`);
	return {
		inventory,
		snapshots,
		discoveredSourcePaths: discovery.discoveredSourcePaths
	};
}
//#endregion
export { createLegacyAuditBackupCapture as a, LegacyAuditBackupStateChangedError as i, createBackupSqliteSnapshotPlan as n, legacyAuditBackupCapturesMatch as o, discoverBackupDatabasePaths as r, classifyBackupSqliteSource as t };
