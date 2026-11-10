import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { i as publishSqliteWalCheckpointObservation } from "./sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { d as withSqliteSessionDatabase, l as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { c as maintenanceLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as createSessionWorkerExecutionSource } from "./session-worker-execution-source-CQwDQ8va.mjs";
import { a as runExclusiveSqliteTranscriptArchiveWorker, f as withSqliteMutationWorkerLifetime } from "./session-accessor.sqlite-archive-C60vk-we.mjs";
import { c as resolveSessionReclamationDatabaseOptions } from "./session-accessor.sqlite-reclamation-CdzHU4X_.mjs";
import { c as measureSessionPhysicalDiskUsage, o as observeSessionArchivePruning, r as pruneSessionTranscriptArchivesToHighWater, s as timeArchivePruningAsync } from "./disk-budget-3DpjwM_1.mjs";
import fs from "node:fs";
import path from "node:path";
import { setImmediate } from "node:timers/promises";
//#region src/config/sessions/session-accessor.sqlite-page-reclamation.ts
/** Preview reads share the history reader without waiting for archive or writer admission. */
async function readSqliteSessionArchivePruning(input) {
	if (captureSessionActorStorageOwner({
		...input,
		storePath: input.path
	}, {
		assertCurrent() {},
		authorize() {}
	})) return null;
	const options = resolveSessionReclamationDatabaseOptions(input);
	if (!supportsOpenClawAgentDatabaseExecution(options)) {
		const { readSessionArchivePruningInDatabase } = await import("./session-history-archive-pruning.worker-B9Ahif9p.mjs");
		return withSqliteSessionDatabase(options, (database) => readSessionArchivePruningInDatabase(database));
	}
	const physical = readDatabasePathIdentitySync(options.path);
	if (!physical.key.startsWith("file:")) return null;
	const databaseOptions = {
		...options,
		path: physical.canonicalPath
	};
	const expectedIdentity = {
		kind: "file",
		physicalIdentity: physical.key.slice(5),
		nativeLocation: physical.canonicalPath
	};
	assertExistingDatabaseIdentity(options.path, physical.key);
	return withSessionHistoryWorkerDatabase({
		...databaseOptions,
		requestedPaths: [options.path]
	}, async (reader) => {
		assertExistingDatabaseIdentity(options.path, physical.key);
		const result = await reader.readArchivePruning({
			env: databaseOptions.env,
			expectedIdentity
		});
		reader.assertCurrent();
		assertExistingDatabaseIdentity(options.path, physical.key);
		return result;
	});
}
/** Retain source custody across the sweep; archive removals and page units admit separately. */
async function withSqliteSessionPageReclamation(input, run) {
	if (captureSessionActorStorageOwner({
		...input,
		storePath: input.path
	}, {
		assertCurrent() {},
		authorize() {}
	})) throw new Error("Incognito sessions have no disk pages or archives to reclaim");
	const options = resolveSessionReclamationDatabaseOptions(input);
	const nativeOwner = !supportsOpenClawAgentDatabaseExecution(options);
	const physical = readDatabasePathIdentitySync(options.path);
	if (physical && !physical.key.startsWith("file:")) throw new Error("SQLite archive pruning requires its existing database");
	return withSqliteMutationWorkerLifetime(options, async ({ assertCurrent, signal }) => {
		const withArchiveWriter = (databaseOptions, assertWriterCurrent, operation) => {
			const write = () => runExclusiveSqliteSessionWrite(databaseOptions, async () => {
				assertWriterCurrent();
				return operation();
			}, "session.history.archive-prune");
			return physical ? runExclusiveSqliteTranscriptArchiveWorker(write, signal) : write();
		};
		if (nativeOwner) {
			const { readSessionArchivePruningInDatabase, deletePublishedSessionArchiveInDatabase, removeLegacySessionArchiveInDatabase, pruneSessionArchivesByRetentionInDatabase } = await import("./session-history-archive-pruning.worker-B9Ahif9p.mjs");
			const databaseOptions = physical ? {
				...options,
				path: physical.canonicalPath
			} : options;
			const assertNativeCurrent = () => {
				assertCurrent();
				if (physical) {
					assertExistingDatabaseIdentity(options.path, physical.key);
					assertExistingDatabaseIdentity(databaseOptions.path, physical.key);
				}
			};
			assertNativeCurrent();
			return run((maxPages) => runExclusiveSqliteSessionWrite(databaseOptions, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
				assertNativeCurrent();
				return database.walMaintenance.reclaimFreePages({
					maxPages,
					beforeMutation: assertNativeCurrent,
					onCommit: assertNativeCurrent
				});
			}, assertNativeCurrent), "session.history.free-pages"), assertNativeCurrent, databaseOptions, {
				withWriter: (operation) => withArchiveWriter(databaseOptions, assertNativeCurrent, operation),
				read: async () => await withSqliteSessionDatabase(databaseOptions, (database) => {
					assertNativeCurrent();
					return readSessionArchivePruningInDatabase(database).archives[0] ?? null;
				}, assertNativeCurrent),
				readRetentionCandidates: async (offset = 0) => withSqliteSessionDatabase(databaseOptions, (database) => readSessionArchivePruningInDatabase(database, 256, offset).archives, assertNativeCurrent),
				pruneRetention: async (retention) => withSqliteSessionDatabase(databaseOptions, (database) => pruneSessionArchivesByRetentionInDatabase(database, databaseOptions, retention, assertNativeCurrent), assertNativeCurrent),
				removeLegacy: async (filePath) => await withSqliteSessionDatabase(databaseOptions, (database) => removeLegacySessionArchiveInDatabase(database, databaseOptions, filePath, assertNativeCurrent), assertNativeCurrent),
				deletePublished: async (row) => await withSqliteSessionDatabase(databaseOptions, (database) => {
					deletePublishedSessionArchiveInDatabase(database, databaseOptions, row, assertNativeCurrent);
				}, assertNativeCurrent)
			});
		}
		if (!physical) throw new Error("SQLite archive pruning requires its existing file owner");
		const databaseOptions = {
			...options,
			path: physical.canonicalPath
		};
		const expectedIdentity = {
			kind: "file",
			physicalIdentity: physical.key.slice(5),
			nativeLocation: physical.canonicalPath
		};
		assertExistingDatabaseIdentity(options.path, physical.key);
		const execution = captureOpenClawAgentDatabaseExecution(databaseOptions, {
			expectedIdentity,
			requestedPath: options.path
		});
		const assertPruningCurrent = () => {
			assertCurrent();
			execution.assertCurrent();
			assertExistingDatabaseIdentity(options.path, physical.key);
			assertExistingDatabaseIdentity(databaseOptions.path, physical.key);
		};
		const source = createSessionWorkerExecutionSource(assertPruningCurrent, "SQLite archive pruning authority expired");
		const write = async (operation, label) => {
			const result = await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
				assertPruningCurrent();
				return execution.runExisting(source, async (worker) => ({ value: await operation(worker) }), { retireNativeOnFailure: true });
			}, label, void 0, "worker");
			assertPruningCurrent();
			if (!result) throw new Error("SQLite archive pruning lost its prepared database");
			return result.value;
		};
		try {
			assertPruningCurrent();
			return await withSessionHistoryWorkerDatabase({
				...databaseOptions,
				requestedPaths: [options.path]
			}, async (reader) => {
				assertPruningCurrent();
				return run(async (maxPages) => {
					const result = await write((worker) => worker.execute({
						type: "session.archivePruning.reclaimPages",
						input: { maxPages }
					}), "session.history.free-pages");
					if (result.checkpoint) result.checkpoint = publishSqliteWalCheckpointObservation(databaseOptions.path, result.checkpoint);
					return result;
				}, assertPruningCurrent, databaseOptions, {
					withWriter: (operation) => withArchiveWriter(databaseOptions, assertPruningCurrent, operation),
					read: async () => {
						assertPruningCurrent();
						const result = await reader.readArchivePruning({
							env: databaseOptions.env,
							expectedIdentity
						});
						assertPruningCurrent();
						return result.archives[0] ?? null;
					},
					readRetentionCandidates: async (offset = 0) => {
						assertPruningCurrent();
						const result = await reader.readArchivePruning({
							env: databaseOptions.env,
							expectedIdentity,
							limit: 256,
							offset
						});
						assertPruningCurrent();
						return result.archives;
					},
					pruneRetention: (retention) => write((worker) => worker.execute({
						type: "session.archivePruning.pruneRetention",
						input: retention
					}), "session.history.archive-prune"),
					removeLegacy: (filePath) => write((worker) => worker.execute({
						type: "session.archivePruning.removeLegacy",
						input: { filePath }
					}), "session.history.archive-prune"),
					deletePublished: (row) => write((worker) => worker.execute({
						type: "session.archivePruning.deletePublished",
						input: row
					}), "session.history.archive-prune")
				});
			}, maintenanceLane);
		} finally {
			await execution.release();
		}
	});
}
//#endregion
//#region src/config/sessions/session-history-archive-pruning.ts
async function reclaimSqliteFreePages(databaseOptions, diagnostics, limits) {
	const reclaimPages = limits?.reclaimPages;
	if (!reclaimPages) return withSqliteSessionPageReclamation(databaseOptions, (reclaim, assertCurrent, preparedOptions) => reclaimSqliteFreePages(preparedOptions, diagnostics, {
		...limits,
		reclaimPages: reclaim,
		assertCurrent: () => {
			limits?.assertCurrent?.();
			assertCurrent();
		}
	}));
	let remaining = limits?.maxPages;
	const gate = limits?.checkpointGate ?? {
		afterNs: process.hrtime.bigint(),
		completedAtNs: 0n
	};
	for (let pass = 0; remaining === void 0 || remaining > 0; pass++) {
		if (pass > 0) await setImmediate();
		limits?.assertCurrent?.();
		const result = await reclaimPages(remaining);
		if (result.vacuumPasses > 0) gate.afterNs = result.checkpoint?.observedAtNs ?? process.hrtime.bigint();
		const completedAtNs = result.checkpoint?.lastCompletedAtNs ?? 0n;
		if (completedAtNs > gate.completedAtNs) gate.completedAtNs = completedAtNs;
		const checkpointCompleted = result.checkpointCompleted || gate.completedAtNs >= gate.afterNs;
		if (diagnostics) {
			for (const key of [
				"checkpointCalls",
				"checkpointMs",
				"queryMs",
				"vacuumMs",
				"vacuumPasses",
				"vacuumPagesRequested"
			]) diagnostics[key] = (diagnostics[key] ?? 0) + result[key];
			diagnostics.checkpointMaxMs = Math.max(diagnostics.checkpointMaxMs ?? 0, result.checkpointMaxMs);
			diagnostics.checkpoint = result.checkpoint?.health;
			diagnostics.checkpointIncomplete = (diagnostics.checkpointIncomplete ?? 0) + Number(!checkpointCompleted);
		}
		if (!checkpointCompleted) {
			limits?.onCheckpointIncomplete?.(result.checkpoint);
			return false;
		}
		const before = result.freePagesBefore;
		const after = result.remainingFreePages;
		if (before === null || after === null || before <= 0 || after >= before) return true;
		remaining = Math.min(remaining ?? before, before) - (before - after);
	}
	return true;
}
async function pruneCanonicalSessionTranscriptArchivesToHighWater(params) {
	const { diagnostics } = params;
	const measure = () => timeArchivePruningAsync(diagnostics, "measurementMs", () => measureSessionPhysicalDiskUsage(params.storePath));
	let usage = await measure();
	let removedFiles = 0;
	while (usage.totalBytes > params.highWaterBytes) {
		if (!await params.archives.withWriter(async () => {
			const row = await timeArchivePruningAsync(diagnostics, "queryMs", () => params.archives.read());
			params.assertCurrent();
			if (!row) return false;
			const archivePath = path.resolve(params.archiveDirectory, row.archive_name);
			if (path.dirname(archivePath) !== path.resolve(params.archiveDirectory) || path.basename(archivePath) !== row.archive_name) throw new Error(`Invalid canonical session archive name for ${row.session_id}`);
			params.assertCurrent();
			try {
				await timeArchivePruningAsync(diagnostics, "fileRemovalMs", () => fs.promises.rm(archivePath));
				removedFiles += 1;
				if (diagnostics) diagnostics.removedFiles = (diagnostics.removedFiles ?? 0) + 1;
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) {
					if (diagnostics) diagnostics.failedRemovals = (diagnostics.failedRemovals ?? 0) + 1;
					return false;
				}
				if (diagnostics) diagnostics.missingFiles = (diagnostics.missingFiles ?? 0) + 1;
			}
			await timeArchivePruningAsync(diagnostics, "rowDeletionMs", () => params.archives.deletePublished(row));
			if (params.checkpointGate) params.checkpointGate.afterNs = process.hrtime.bigint();
			return true;
		})) break;
		const checkpointCompleted = await reclaimSqliteFreePages(params.databaseOptions, diagnostics, params);
		usage = await measure();
		if (!checkpointCompleted) break;
	}
	return {
		removedFiles,
		usage
	};
}
function pruneAllSessionTranscriptArchivesToHighWater(input) {
	const diagnostics = input.diagnostics ?? { trigger: "initial" };
	diagnostics.highWaterBytes = input.highWaterBytes;
	return observeSessionArchivePruning(diagnostics, () => withSqliteSessionPageReclamation(input.databaseOptions, (reclaimPages, assertCurrent, databaseOptions, archives) => pruneSessionArchivesWithOwner({
		...input,
		diagnostics,
		reclaimPages,
		assertCurrent,
		databaseOptions,
		archives
	})));
}
async function pruneSessionArchivesWithOwner(params) {
	const { diagnostics } = params;
	const measure = () => timeArchivePruningAsync(diagnostics, "measurementMs", () => measureSessionPhysicalDiskUsage(params.storePath));
	const before = await measure();
	diagnostics.totalBytesBefore = before.totalBytes;
	diagnostics.walBytesBefore = before.databaseWalBytes;
	const finish = (result) => {
		params.assertCurrent();
		diagnostics.totalBytesAfter = result.usage.totalBytes;
		diagnostics.walBytesAfter = result.usage.databaseWalBytes;
		const checkpointIncomplete = diagnostics.checkpointIncomplete ?? 0;
		diagnostics.completed = checkpointIncomplete === 0 && !diagnostics.failedRemovals;
		return {
			...result,
			completed: diagnostics.completed,
			checkpointIncomplete,
			checkpoint: diagnostics.checkpoint
		};
	};
	if (before.totalBytes <= params.highWaterBytes) return finish({
		removedFiles: 0,
		usage: before
	});
	if (!await reclaimSqliteFreePages(params.databaseOptions, diagnostics, params)) return finish({
		removedFiles: 0,
		usage: await measure()
	});
	const canonical = await pruneCanonicalSessionTranscriptArchivesToHighWater(params);
	if (diagnostics.checkpointIncomplete || canonical.usage.totalBytes <= params.highWaterBytes) return finish(canonical);
	const legacy = await pruneSessionTranscriptArchivesToHighWater({
		diagnostics,
		highWaterBytes: params.highWaterBytes,
		storePath: params.storePath,
		removeFile: async (file) => {
			const usage = await measure();
			params.assertCurrent();
			if (usage.totalBytes <= params.highWaterBytes) return "preserved";
			return params.archives.withWriter(() => timeArchivePruningAsync(diagnostics, "fileRemovalMs", () => params.archives.removeLegacy(file.path)));
		}
	});
	return finish({
		removedFiles: canonical.removedFiles + legacy.removedFiles,
		usage: legacy.usage
	});
}
//#endregion
export { withSqliteSessionPageReclamation as i, reclaimSqliteFreePages as n, readSqliteSessionArchivePruning as r, pruneAllSessionTranscriptArchivesToHighWater as t };
