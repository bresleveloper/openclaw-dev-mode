import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { f as runOpenClawAgentWriteTransaction, l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as getSessionKysely, v as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { c as measureSessionPhysicalDiskUsage, o as timeArchivePruningAsync, r as pruneSessionTranscriptArchivesToHighWater, s as timeArchivePruningSync } from "./disk-budget-CH7vIk-L.mjs";
import fs from "node:fs";
import path from "node:path";
import { setImmediate } from "node:timers/promises";
//#region src/config/sessions/session-history-archive-pruning.ts
async function withArchivePruningDatabase(options, diagnostics, operation) {
	const admission = diagnostics ? {} : void 0;
	try {
		return await withSqliteSessionDatabase(options, operation, void 0, admission);
	} finally {
		if (diagnostics && admission?.admissionMs !== void 0) {
			diagnostics.admissionMs = (diagnostics.admissionMs ?? 0) + admission.admissionMs;
			if (admission.admissionMode === "cached") diagnostics.cachedAdmissions = (diagnostics.cachedAdmissions ?? 0) + 1;
			else if (admission.admissionMode === "async") diagnostics.asyncAdmissions = (diagnostics.asyncAdmissions ?? 0) + 1;
		}
	}
}
async function reclaimSqliteFreePages(databaseOptions, diagnostics, limits) {
	let remaining;
	const maxPasses = limits?.maxPasses ?? Infinity;
	for (let pass = 0; pass < maxPasses && (remaining === void 0 || remaining > 0); pass++) {
		if (remaining !== void 0) await setImmediate();
		limits?.assertCurrent?.();
		const result = limits?.reclaimPages ? await limits.reclaimPages(remaining) : await withArchivePruningDatabase(databaseOptions, diagnostics, (database) => {
			limits?.assertCurrent?.();
			return database.walMaintenance.reclaimFreePages({ maxPages: remaining });
		});
		if (diagnostics) {
			for (const key of [
				"checkpointCalls",
				"checkpointIncomplete",
				"checkpointMs",
				"queryMs",
				"vacuumMs",
				"vacuumPasses",
				"vacuumPagesRequested"
			]) diagnostics[key] = (diagnostics[key] ?? 0) + result[key];
			diagnostics.checkpointMaxMs = Math.max(diagnostics.checkpointMaxMs ?? 0, result.checkpointMaxMs);
			diagnostics.checkpoint = result.checkpoint?.health;
		}
		if (!result.checkpointCompleted) {
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
function hasCanonicalSessionTranscriptArchives(databaseOptions) {
	return hasCanonicalSessionTranscriptArchivesInDatabase(openOpenClawAgentDatabase(databaseOptions));
}
function hasCanonicalSessionTranscriptArchivesInDatabase(database) {
	const db = getSessionKysely(database.db);
	if (!executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "=", "session_transcript_archives")).rows[0]) return false;
	return executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select("session_id").where("published_at", "is not", null).limit(1)).rows.length > 0;
}
function readUnpublishedSessionTranscriptArchiveNames(database) {
	const db = getSessionKysely(database.db);
	if (!executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "=", "session_transcript_archives")).rows[0]) return /* @__PURE__ */ new Set();
	return new Set(executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select("archive_name").where("published_at", "is", null)).rows.map((row) => row.archive_name));
}
async function pruneCanonicalSessionTranscriptArchivesToHighWater(params) {
	const { diagnostics } = params;
	let usage = await timeArchivePruningAsync(diagnostics, "measurementMs", () => measureSessionPhysicalDiskUsage(params.storePath));
	let removedFiles = 0;
	while (usage.totalBytes > params.highWaterBytes) {
		const row = await withArchivePruningDatabase(params.databaseOptions, diagnostics, (database) => timeArchivePruningSync(diagnostics, "queryMs", () => {
			const db = getSessionKysely(database.db);
			return executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select([
				"archive_name",
				"generation",
				"session_id"
			]).where("published_at", "is not", null).orderBy("created_at", "asc").orderBy("session_id", "asc").orderBy("generation", "asc").limit(1)).rows[0];
		}));
		if (!row) break;
		const archivePath = path.resolve(params.archiveDirectory, row.archive_name);
		if (path.dirname(archivePath) !== path.resolve(params.archiveDirectory) || path.basename(archivePath) !== row.archive_name) throw new Error(`Invalid canonical session archive name for ${row.session_id}`);
		try {
			await timeArchivePruningAsync(diagnostics, "fileRemovalMs", () => fs.promises.rm(archivePath));
			removedFiles += 1;
			if (diagnostics) diagnostics.removedFiles = (diagnostics.removedFiles ?? 0) + 1;
		} catch (error) {
			if (error.code !== "ENOENT") {
				if (diagnostics) diagnostics.failedRemovals = (diagnostics.failedRemovals ?? 0) + 1;
				break;
			}
			if (diagnostics) diagnostics.missingFiles = (diagnostics.missingFiles ?? 0) + 1;
		}
		await withArchivePruningDatabase(params.databaseOptions, diagnostics, () => timeArchivePruningSync(diagnostics, "rowDeletionMs", () => runOpenClawAgentWriteTransaction((transactionDb) => {
			const transactionKysely = getSessionKysely(transactionDb.db);
			executeSqliteQuerySync(transactionDb.db, transactionKysely.deleteFrom("session_transcript_archives").where("session_id", "=", row.session_id).where("generation", "=", row.generation));
		}, params.databaseOptions)));
		const checkpointCompleted = await reclaimSqliteFreePages(params.databaseOptions, diagnostics, params);
		usage = await timeArchivePruningAsync(diagnostics, "measurementMs", () => measureSessionPhysicalDiskUsage(params.storePath));
		if (!checkpointCompleted) break;
	}
	return {
		removedFiles,
		usage
	};
}
async function pruneAllSessionTranscriptArchivesToHighWater(input) {
	const diagnostics = input.diagnostics ?? { trigger: "initial" };
	const params = {
		...input,
		diagnostics
	};
	const measure = () => timeArchivePruningAsync(diagnostics, "measurementMs", () => measureSessionPhysicalDiskUsage(params.storePath));
	const before = await measure();
	diagnostics.totalBytesBefore = before.totalBytes;
	diagnostics.walBytesBefore = before.databaseWalBytes;
	const finish = (result) => {
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
	if (!await reclaimSqliteFreePages(params.databaseOptions, diagnostics, params)) return finish({
		removedFiles: 0,
		usage: await measure()
	});
	const canonical = await withArchivePruningDatabase(params.databaseOptions, diagnostics, (database) => timeArchivePruningSync(diagnostics, "queryMs", () => hasCanonicalSessionTranscriptArchivesInDatabase(database))) ? await pruneCanonicalSessionTranscriptArchivesToHighWater(params) : {
		removedFiles: 0,
		usage: await measure()
	};
	if (diagnostics.checkpointIncomplete || canonical.usage.totalBytes <= params.highWaterBytes) return finish(canonical);
	const legacy = await pruneSessionTranscriptArchivesToHighWater({
		diagnostics,
		excludeNames: await withArchivePruningDatabase(params.databaseOptions, diagnostics, (database) => timeArchivePruningSync(diagnostics, "queryMs", () => readUnpublishedSessionTranscriptArchiveNames(database))),
		highWaterBytes: params.highWaterBytes,
		storePath: params.storePath
	});
	return finish({
		removedFiles: canonical.removedFiles + legacy.removedFiles,
		usage: legacy.usage
	});
}
//#endregion
export { pruneAllSessionTranscriptArchivesToHighWater as n, reclaimSqliteFreePages as r, hasCanonicalSessionTranscriptArchives as t };
