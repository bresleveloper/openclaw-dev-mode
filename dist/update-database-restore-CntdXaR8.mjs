import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { Fn as object, Jn as string, Pn as number } from "./schemas-BOYIvvln.mjs";
import { n as adoptPreparedLocation, s as releaseSnapshotTempDirectory } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { r as drainAgentDatabaseResources } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { h as prepareOpenClawStateDatabaseRemoval } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { n as createSqliteSnapshotStagingDirectory } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { n as formatDiskSpaceBytes, r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { a as publishFileExclusive, c as sha256File, n as getPublishFileExclusiveFailureDetails } from "./directory-durability-B2RKADOj.mjs";
import { a as closeOpenClawAgentDatabaseByPathAsync } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { r as acquireGatewayLock } from "./gateway-lock-OT1e72lx.mjs";
import { g as runUpdateStateInspectionWorker, h as parseUpdateStateInspectionWorker, p as readUpdateStateDatabaseSizes, s as readUpdateDatabaseGenerationsIsolated } from "./update-candidate-state-fXM6fMqw.mjs";
import { i as prepareVerifiedSqliteFile } from "./sqlite-snapshot-u13JUemz.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/update-database-restore.ts
async function existingFile(file) {
	try {
		const info = await fs.lstat(file, { bigint: true });
		if (!info.isFile() || info.nlink !== 1n) throw new Error(`Database recovery requires a regular, unaliased file: ${file}`);
		return info;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
async function withDatabaseExclusion(env, paths, sourcePaths, assertCurrent, operation) {
	assertCurrent();
	const owner = await acquireGatewayLock({
		env,
		role: "sqlite-maintenance",
		allowInTests: true,
		timeoutMs: 0
	});
	if (!owner) throw new Error("Database rollback requires exclusive state ownership");
	const exclusions = [];
	const assertOwned = () => {
		assertCurrent();
		owner.assertCurrent();
		for (const exclusion of exclusions) exclusion.assertCurrent();
	};
	const drain = async (index) => {
		const pathname = sourcePaths[index];
		if (pathname === void 0) {
			for (const databasePath of paths) {
				exclusions.push(await prepareOpenClawStateDatabaseRemoval(databasePath, assertCurrent));
				assertOwned();
			}
			return operation(assertOwned);
		}
		return drainAgentDatabaseResources({ path: pathname }, async () => {
			await closeOpenClawAgentDatabaseByPathAsync(pathname);
			assertOwned();
			return drain(index + 1);
		});
	};
	let outcome;
	try {
		outcome = { value: await owner.run(() => drain(0)) };
	} catch (error) {
		outcome = { error };
	}
	if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) throw outcome.error;
	try {
		await owner.release();
		for (const exclusion of exclusions.toReversed()) exclusion.release();
	} catch (cleanupError) {
		if ("error" in outcome) throw createSqliteLifecycleAggregateError([outcome.error, cleanupError], "Database rollback and ownership cleanup both failed", outcome.error);
		throw cleanupError;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
/** The caller owns a settled failed candidate that has never admitted user work. */
async function restoreUpdateDatabaseBackup(params) {
	if (!/^[a-zA-Z0-9_-]{1,128}$/u.test(params.runId)) throw new Error("Database rollback requires its original update run identity.");
	const { backup, assertCurrent } = params;
	const paths = [.../* @__PURE__ */ new Set([...backup.databases.map((entry) => entry.path), ...backup.missingPaths])].toSorted();
	const displaced = [];
	let preparedCopy;
	let retainPreparedCopy = false;
	let outcome;
	const outputs = [];
	try {
		const result = await withDatabaseExclusion(params.env, paths, [.../* @__PURE__ */ new Set([...backup.sourcePaths, ...paths])], assertCurrent, async (assertOwned) => {
			if (params.expectedGenerations) {
				assertOwned();
				const generations = await readUpdateDatabaseGenerationsIsolated(paths, { env: params.env });
				assertOwned();
				if (!isDeepStrictEqual(generations, params.expectedGenerations)) {
					const changed = paths.filter((file) => generations[file] !== params.expectedGenerations?.[file]);
					backup.restoreRefusal = `Databases changed after ${backup.migration?.name ?? "snapshot capture"}: ${changed.join(", ")}; restoring the backup would discard later writes`;
					return null;
				}
			}
			assertOwned();
			for (const entry of backup.databases) {
				const source = await fs.open(entry.snapshotPath, "r");
				try {
					const content = await sha256File(source);
					if (content.digest !== entry.sha256 || content.bytes !== entry.sizeBytes) throw new Error(`Database snapshot changed: ${entry.snapshotPath}`);
				} finally {
					await source.close();
				}
				assertOwned();
			}
			const sharedPath = resolvePathViaExistingAncestorSync(resolveOpenClawStateSqlitePath(params.env));
			const shared = backup.databases.find((entry) => entry.path === sharedPath);
			const sources = [...backup.databases];
			for (const entry of sources) {
				if (entry.engine !== "postgres") continue;
				if (!entry.exportDirectory || !entry.storeId || !entry.namespace) throw new Error("PostgreSQL rollback is missing its matched capture identity.");
				const { createConfigIO } = await import("./io-Cwio_qp9.mjs");
				const { config } = await createConfigIO({
					env: params.env,
					observe: false,
					pluginValidation: "core-only",
					shellEnvFallback: "defer"
				}).readConfigFileSnapshot();
				const { preparePostgresRestore } = await import("./database-backup-DtIZf0VT.mjs");
				const snapshotPath = `${entry.snapshotPath}.restored-${params.runId}`;
				const prepared = await preparePostgresRestore({
					directory: entry.exportDirectory,
					anchorPath: snapshotPath,
					config,
					profile: "exact",
					expectedSource: {
						storeId: entry.storeId,
						namespace: entry.namespace
					},
					assertCurrent: assertOwned
				});
				sources[sources.indexOf(entry)] = {
					...entry,
					...prepared,
					snapshotPath
				};
				displaced.push(`PostgreSQL namespace ${entry.namespace}`);
			}
			if (paths.includes(sharedPath)) {
				if (!shared) throw new Error("Database rollback cannot preserve update history without its shared snapshot.");
				const stagingRoot = await createSqliteSnapshotStagingDirectory(backup.directory);
				const targetPath = path.join(stagingRoot, "shared.sqlite");
				preparedCopy = adoptPreparedLocation(targetPath, stagingRoot);
				const worker = {
					nodeRunner: process.execPath,
					sourceEnv: params.env,
					stagingRoot
				};
				assertOwned();
				const databases = await readUpdateStateDatabaseSizes([sharedPath, shared.snapshotPath], worker);
				assertOwned();
				const prepared = parseUpdateStateInspectionWorker(await runUpdateStateInspectionWorker({
					...worker,
					databases,
					input: {
						mode: "database-restore-preparation",
						stateDir: resolveStateDir(params.env),
						config: {},
						baseline: shared,
						currentPath: sharedPath,
						targetPath,
						stagingRoot
					}
				}), object({
					sha256: string().regex(/^[a-f0-9]{64}$/u),
					sizeBytes: number().int().nonnegative(),
					userVersion: number().int().nonnegative()
				}));
				assertOwned();
				sources[sources.indexOf(shared)] = {
					...shared,
					...prepared,
					snapshotPath: targetPath
				};
			}
			const moves = [];
			for (const databasePath of paths) for (const suffix of [
				"",
				"-wal",
				"-shm",
				"-journal"
			]) {
				const source = `${databasePath}${suffix}`;
				const target = `${databasePath}.migrated-${params.runId}${suffix}`;
				if (await existingFile(target)) throw new Error(`Migrated database recovery file already exists: ${target}`);
				const identity = await existingFile(source);
				if (identity) moves.push({
					source,
					target,
					identity
				});
			}
			for (const entry of sources) {
				assertOwned();
				const sourceIdentity = await fs.lstat(entry.snapshotPath, { bigint: true });
				assertOwned();
				outputs.push(await prepareVerifiedSqliteFile({
					sourcePath: entry.snapshotPath,
					sourceIdentity,
					targetPath: entry.path,
					expectedContent: {
						sha256: entry.sha256,
						sizeBytes: entry.sizeBytes
					},
					requireAtomicPublication: true,
					beforeByteCopy: (sizeBytes) => {
						const directory = path.dirname(entry.path);
						const space = tryReadDiskSpace(directory);
						const requiredBytes = sizeBytes + 67108864;
						if (!space || space.availableBytes < requiredBytes) throw new Error(`Database rollback needs ${formatDiskSpaceBytes(requiredBytes)} near ${directory} for a writable copy; ${space ? `${formatDiskSpaceBytes(space.availableBytes)} is available` : "available space could not be measured"}. Current databases have not been moved.`);
						assertOwned();
					},
					beforePublish: assertOwned,
					afterPublish: (guard) => guard.assertTargetMatchesExpectedContent(assertOwned)
				}));
				assertOwned();
			}
			for (const move of moves) {
				assertOwned();
				try {
					await publishFileExclusive({
						sourcePath: move.source,
						targetPath: move.target,
						expectedSourceIdentity: move.identity,
						strategy: "rename-noreplace"
					});
				} catch (error) {
					retainPreparedCopy ||= getPublishFileExclusiveFailureDetails(error)?.targetCreated === true;
					throw error;
				}
				retainPreparedCopy = true;
				displaced.push(move.target);
				assertOwned();
			}
			for (const output of outputs) {
				assertOwned();
				retainPreparedCopy = true;
				await output.publish();
				assertOwned();
			}
			return displaced;
		});
		retainPreparedCopy = false;
		outcome = { value: result };
	} catch (error) {
		outcome = { error };
		retainPreparedCopy ||= hasCommandProcessCleanupError(error);
	}
	if (retainPreparedCopy) {
		if (preparedCopy) releaseSnapshotTempDirectory(path.dirname(preparedCopy.location));
	} else {
		const failures = (await Promise.allSettled([...outputs.map((output) => output.cleanup()), ...preparedCopy ? [preparedCopy.cleanupAsync()] : []])).filter((result) => result.status === "rejected");
		if (failures.length > 0) {
			const errors = [..."error" in outcome ? [outcome.error] : [], ...failures.map((result) => result.reason)];
			throw createSqliteLifecycleAggregateError(errors, "Database rollback output cleanup failed", errors[0]);
		}
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
//#endregion
export { restoreUpdateDatabaseBackup as t };
