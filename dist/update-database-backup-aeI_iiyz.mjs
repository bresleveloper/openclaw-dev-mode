import { n as resolvePathViaExistingAncestorSync$1 } from "./boundary-path-CAv_plX7.mjs";
import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { f as maintenanceOwnerHasSourceCustody, l as getOpenClawDatabaseMaintenanceScope, p as maintenanceOwnerMayCopySourcesInProcess } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number, Un as record, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as sameFileMutationFingerprint } from "./file-descriptor-BWLpOgrg.mjs";
import { d as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { m as openClawStateDatabaseCache } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { d as createPrivateSqliteDirectory } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { n as formatDiskSpaceBytes, r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { l as syncDirectory, s as requireDirectorySync, t as ensureDurableDirectory } from "./directory-durability-B2RKADOj.mjs";
import { a as discoverUpdateStateSchemaInspectionInProcess, g as runUpdateStateInspectionWorker, h as parseUpdateStateInspectionWorker, m as readUpdateStateDatabaseSizesInProcess, p as readUpdateStateDatabaseSizes, r as UpdateStateSchemaInspectionPlanSchema } from "./update-candidate-state-fXM6fMqw.mjs";
import { r as UpdateStateDatabaseOwnerSchema } from "./update-candidate-paths-C60j7F-O.mjs";
import { t as measureUpdateStateFiles } from "./update-candidate-io-BDP-YZR-.mjs";
import { t as isSqliteSnapshotFile } from "./sqlite-file-header-Bk5j3Cyt.mjs";
import { t as readUpdatePhysicalDatabaseGenerations } from "./update-physical-database-generations-CjYPyx5_.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
//#region src/infra/update-database-backup.ts
const UpdateDatabaseBackupSchema = object({
	directory: string(),
	databases: array(object({
		path: string(),
		snapshotPath: string(),
		userVersion: number().int().nonnegative(),
		sha256: string().regex(/^[a-f0-9]{64}$/u),
		sizeBytes: number().int().nonnegative(),
		engine: literal("postgres").optional(),
		storeId: string().uuid().optional(),
		namespace: string().optional(),
		exportDirectory: string().optional()
	})),
	missingPaths: array(string()),
	sourcePaths: array(string()),
	sourceGenerations: record(string(), string().nullable()),
	databaseOwners: array(UpdateStateDatabaseOwnerSchema.and(object({ path: string() }))).optional(),
	warnings: array(string())
});
async function loadUpdateDatabaseBackupRuntime() {
	const [{ discoverBackupDatabasePaths }, { readBackupEngine }] = await Promise.all([import("./backup-sqlite-snapshot-BsMn1C0h.mjs"), import("./database-backup-DtIZf0VT.mjs")]);
	return {
		discoverBackupDatabasePaths,
		readBackupEngine
	};
}
let backupRuntime;
/** Resolve the backup's lazy modules before an updater replaces its own dist tree. */
function prepareUpdateDatabaseBackupRuntime() {
	return backupRuntime ??= loadUpdateDatabaseBackupRuntime();
}
async function inspectRestorableDatabaseFiles(databases, previous, stopped = false) {
	const identities = /* @__PURE__ */ new Map();
	for (const database of databases) for (const suffix of [
		"",
		"-wal",
		"-journal"
	]) {
		const file = `${database}${suffix}`;
		let info;
		try {
			info = await fs.lstat(file, { bigint: true });
		} catch (error) {
			if (suffix && hasNodeErrorCode(error, "ENOENT")) continue;
			throw error;
		}
		if (!info.isFile() || info.nlink !== 1n) throw new Error(`Update database rollback requires a regular file with one link: ${file}. Resolve database aliases before retrying; the databases have not been migrated.`);
		if (suffix === "-wal" && info.size === 0n) continue;
		const before = previous?.get(file);
		if (before && !(stopped ? sameFileMutationFingerprint(before, info) : sameFileIdentity(before, info))) throw new Error(`Update database file changed during backup: ${file}.`);
		identities.set(file, info);
	}
	if (stopped && previous && (identities.size !== previous.size || [...identities.keys()].some((file) => !previous.has(file)))) {
		const changed = [.../* @__PURE__ */ new Set([...identities.keys(), ...previous.keys()])].find((file) => identities.has(file) !== previous.has(file));
		throw new Error(`Update database journal state changed during stopped backup: ${changed}.`);
	}
	return identities;
}
async function checkDatabaseBackupSpace(directory, files) {
	const { bytes, largest, families } = await measureUpdateStateFiles(files);
	const warnings = [];
	const check = (target, requiredBytes, purpose) => {
		const space = tryReadDiskSpace(target);
		if (space && space.availableBytes < requiredBytes) throw new Error(`${purpose} needs ${formatDiskSpaceBytes(requiredBytes)} near ${target}, but only ${formatDiskSpaceBytes(space.availableBytes)} is available. Free disk space before retrying; the databases have not been migrated.`);
		if (!space) warnings.push(`Available disk space could not be measured near ${target}; database backup will be attempted.`);
	};
	const reserve = 67108864;
	check(directory, bytes === 0 ? 0 : 2 * bytes + 3 * largest + reserve, "Update database backup");
	const backupDevice = (await fs.stat(directory, { bigint: true })).dev;
	const sources = /* @__PURE__ */ new Map();
	for (const family of families) {
		const sourceDirectory = path.dirname(family.path);
		const device = (await fs.stat(sourceDirectory, { bigint: true })).dev;
		if (device > 0n && device === backupDevice) continue;
		const key = device > 0n ? device : sourceDirectory;
		let source = sources.get(key);
		if (!source) {
			source = {
				directory: sourceDirectory,
				bytes: 0,
				largest: 0
			};
			sources.set(key, source);
			if (device === 0n) warnings.push(`Filesystem identity is unavailable near ${sourceDirectory}; restore space is checked separately.`);
		}
		source.bytes += family.bytes;
		source.largest = Math.max(source.largest, family.bytes);
	}
	for (const source of sources.values()) check(source.directory, source.bytes + source.largest + reserve, "Update database rollback");
	return warnings;
}
async function canonicalDatabaseInventory(plan, includeOwners, additionalPaths = [], additionalFiles = [], excludedDatabasePaths = []) {
	const present = /* @__PURE__ */ new Set();
	const missing = /* @__PURE__ */ new Set();
	const owners = /* @__PURE__ */ new Map();
	const excluded = new Set(excludedDatabasePaths.flatMap(resolveSqliteDatabaseFilePaths));
	const isExcluded = (file) => excluded.has(resolvePathViaExistingAncestorSync$1(file));
	const selectedPaths = new Set(additionalPaths.filter((file) => !isExcluded(file)).map((file) => path.resolve(file)));
	for (const file of additionalFiles) {
		if (isExcluded(file)) continue;
		const resolved = path.resolve(file);
		if (!selectedPaths.has(resolved) && await isSqliteSnapshotFile(resolved)) selectedPaths.add(resolved);
	}
	const sources = [...plan.files.map(([, database]) => database), ...[...selectedPaths].map((file) => ({
		spellings: [file],
		owners: void 0
	}))];
	for (const database of sources) for (const spelling of database.spellings) {
		if (isExcluded(spelling)) continue;
		let canonical;
		try {
			canonical = await fs.realpath(spelling);
			present.add(canonical);
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) throw error;
			if (await fs.lstat(spelling).catch((cause) => {
				if (!hasNodeErrorCode(cause, "ENOENT")) throw cause;
			})) throw new Error(`Update database path cannot be resolved: ${spelling}`, { cause: error });
			canonical = resolvePathViaExistingAncestorSync$1(spelling);
			missing.add(canonical);
		}
		for (const owner of database.owners ?? []) {
			const entry = {
				path: canonical,
				...owner
			};
			owners.set(JSON.stringify(entry), entry);
		}
	}
	return {
		present: [...present].toSorted(),
		missing: [...missing].toSorted(),
		sourcePaths: [...new Set(sources.flatMap((database) => database.spellings).filter((file) => !isExcluded(file)))].toSorted(),
		databaseOwners: includeOwners ? [...owners].toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, owner]) => owner) : void 0
	};
}
/** Read-only capture; the caller separately decides whether automatic restoration is safe. */
async function createUpdateDatabaseBackupInProcess(input) {
	const directory = await fs.realpath(`${input.backupRoot}.databases`);
	const inspectionPlan = input.inspectionPlan;
	const includeOwners = inspectionPlan.files.some(([, database]) => database.owners !== void 0);
	const inventoryFor = (plan) => canonicalDatabaseInventory(plan, includeOwners, input.additionalPaths, input.additionalFiles, input.excludedDatabasePaths);
	const inventory = await inventoryFor(inspectionPlan);
	const identities = await inspectRestorableDatabaseFiles(inventory.present);
	const warnings = await checkDatabaseBackupSpace(directory, inventory.present);
	const { buildBackupArchivePath } = await import("./backup-shared-B445TdW6.mjs");
	const { createStoppedSqliteSnapshot, createVerifiedSqliteSnapshot } = await import("./sqlite-snapshot-BjQFcr9G.mjs");
	const { AGENT_FTS_SCHEMAS } = await import("./openclaw-agent-fts-schema-UlFD-Dr9.mjs");
	const databases = [];
	const sourceGenerations = Object.fromEntries(inventory.missing.map((file) => [file, null]));
	const readGeneration = async (file) => {
		try {
			return (await readUpdatePhysicalDatabaseGenerations([file]))[file] ?? void 0;
		} catch (error) {
			warnings.push(`Database write generation unavailable for ${file}: ${formatErrorMessageWithCode(error)}`);
			return;
		}
	};
	const { readBackupEngine, capturePostgresBackup } = await import("./database-backup-DtIZf0VT.mjs");
	const engines = new Map(inventory.present.map((file) => [file, readBackupEngine(file)]));
	if ([...engines.values()].some((engine) => engine.engine === "postgres") && !input.postgresOffline && !input.stopped) throw new Error("PostgreSQL update capture requires exclusive ownership; stop through the service owner, then rerun.");
	for (const sourcePath of inventory.present) {
		input.onProgress?.({
			phase: "pre-migration database backup",
			path: sourcePath
		});
		const archivePath = buildBackupArchivePath("", sourcePath);
		let parent = directory;
		for (const component of path.posix.dirname(archivePath).split("/")) {
			parent = path.join(parent, component);
			await ensureDurableDirectory({
				directoryPath: parent,
				create: createPrivateSqliteDirectory
			});
		}
		const snapshotPath = path.join(directory, archivePath);
		const stopped = input.stopped && !identities.has(`${sourcePath}-journal`) && (identities.get(`${sourcePath}-wal`)?.size ?? 0n) === 0n;
		const before = input.stopped ? void 0 : await readGeneration(sourcePath);
		const snapshot = stopped ? await createStoppedSqliteSnapshot({
			sourcePath,
			targetPath: snapshotPath,
			sourceIdentity: identities.get(sourcePath)
		}) : await createVerifiedSqliteSnapshot({
			sourcePath,
			targetPath: snapshotPath,
			sourceAcquisition: {
				mode: "isolated-process",
				stagingRoot: input.stagingRoot,
				preserveSourceArtifacts: input.stopped || input.preserveSourceArtifacts
			},
			preserveRowIds: true,
			requireNonEmptySource: true,
			integrity: inventory.databaseOwners?.some((owner) => owner.path === sourcePath && owner.role === "agent") ? { ftsSchemas: AGENT_FTS_SCHEMAS } : void 0
		});
		if (!input.stopped) {
			const after = await readGeneration(sourcePath);
			if (after !== void 0 && before === after) sourceGenerations[sourcePath] = after;
			else warnings.push(`Database changed during capture; its snapshot requires manual recovery: ${sourcePath}`);
		}
		const engine = engines.get(sourcePath);
		let postgres;
		if (engine.engine === "postgres") {
			const exportDirectory = `${snapshotPath}.postgres`;
			await capturePostgresBackup({
				sourcePath,
				directory: exportDirectory,
				profile: "exact",
				config: input.config,
				assertCurrent: () => {}
			});
			postgres = {
				...engine,
				exportDirectory
			};
		}
		databases.push({
			path: sourcePath,
			snapshotPath,
			userVersion: snapshot.userVersion,
			sha256: snapshot.sha256,
			sizeBytes: snapshot.sizeBytes,
			...postgres
		});
	}
	const current = await inventoryFor(await discoverUpdateStateSchemaInspectionInProcess({
		...input,
		preserveSourceArtifacts: input.stopped || input.preserveSourceArtifacts
	}));
	if (JSON.stringify(current) !== JSON.stringify(inventory)) throw new Error("Update database inventory changed during backup; retry after writers stop.");
	await inspectRestorableDatabaseFiles(inventory.present, identities, input.stopped);
	return {
		directory,
		databases,
		missingPaths: inventory.missing,
		sourcePaths: inventory.sourcePaths,
		sourceGenerations,
		databaseOwners: inventory.databaseOwners,
		warnings
	};
}
/** Retain raw, verified database files separately from the old package fingerprint. */
async function createUpdateDatabaseBackup({ acquisition, nodeRunner = process.execPath, timeoutMs, signal: callerSignal, rehearsal, retryAdvice, ...input }) {
	const controller = new AbortController();
	const { discoverBackupDatabasePaths, readBackupEngine } = await prepareUpdateDatabaseBackupRuntime();
	const postgresPaths = (await discoverBackupDatabasePaths(input)).filter((file) => readBackupEngine(file).engine === "postgres");
	const additionalPaths = [...input.additionalPaths ?? [], ...postgresPaths].map((file) => path.resolve(file));
	const additionalFiles = input.additionalFiles?.map((file) => path.resolve(file));
	const signal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
	const work = (async () => {
		signal.throwIfAborted();
		const backupRoot = path.resolve(input.backupRoot);
		const directory = `${backupRoot}.databases`;
		await createPrivateSqliteDirectory(directory);
		const identity = await fs.lstat(directory, { bigint: true });
		try {
			const sourceEnv = input.env ?? process.env;
			const worker = {
				nodeRunner,
				timeoutMs,
				signal,
				sourceEnv,
				stagingRoot: directory
			};
			const workerInput = {
				...input,
				preserveSourceArtifacts: input.stopped || input.preserveSourceArtifacts,
				additionalPaths,
				additionalFiles,
				backupRoot,
				stagingRoot: directory
			};
			const shared = path.resolve(input.stateDir, "state", "openclaw.sqlite");
			const scope = getOpenClawDatabaseMaintenanceScope();
			const custody = acquisition?.mode === "maintenance-owner" && maintenanceOwnerHasSourceCustody(scope, shared) && !openClawStateDatabaseCache.isOpenClawStateDatabaseOpen(shared);
			const inspectionPlan = custody && maintenanceOwnerMayCopySourcesInProcess(scope, shared) ? await discoverUpdateStateSchemaInspectionInProcess({
				...workerInput,
				stagingRoot: directory,
				preserveSourceArtifacts: true
			}) : parseUpdateStateInspectionWorker(await runUpdateStateInspectionWorker({
				...worker,
				retryAdvice,
				input: {
					...workerInput,
					mode: "discover"
				},
				databases: custody ? await readUpdateStateDatabaseSizesInProcess([shared], signal) : await readUpdateStateDatabaseSizes([shared], worker)
			}), UpdateStateSchemaInspectionPlanSchema);
			rehearsal?.assertCurrent();
			const excludedDatabasePaths = rehearsal?.admit(inspectionPlan.files.flatMap(([, database]) => database.spellings));
			const capturedInput = {
				...workerInput,
				excludedDatabasePaths
			};
			const files = [
				...inspectionPlan.files.flatMap(([, database]) => database.spellings),
				...additionalPaths ?? [],
				...additionalFiles ?? []
			].filter((file) => !rehearsal?.excludes(file));
			rehearsal?.assertCurrent();
			const backup = parseUpdateStateInspectionWorker(await runUpdateStateInspectionWorker({
				...worker,
				retryAdvice,
				input: {
					...capturedInput,
					mode: "database-backup",
					inspectionPlan
				},
				...custody ? { ioBudget: "deadline" } : {},
				databases: custody ? await readUpdateStateDatabaseSizesInProcess(files, signal) : await readUpdateStateDatabaseSizes(files, worker)
			}), UpdateDatabaseBackupSchema);
			rehearsal?.assertCurrent();
			if (!sameFileIdentity(identity, await fs.lstat(directory, { bigint: true }))) throw new Error(`Database backup directory changed during capture: ${directory}.`);
			requireDirectorySync(await syncDirectory(path.dirname(directory)), "Database backup parent");
			return backup;
		} catch (error) {
			throw new Error(`${formatErrorMessageWithCode(error)}. Database backup files retained at ${directory}.`, { cause: error });
		}
	})();
	return retainSnapshotWork(work, () => controller.abort());
}
//#endregion
export { prepareUpdateDatabaseBackupRuntime as i, createUpdateDatabaseBackup as n, createUpdateDatabaseBackupInProcess as r, UpdateDatabaseBackupSchema as t };
