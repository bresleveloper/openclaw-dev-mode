import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { _ as withMaintenanceOpenClawStateDatabaseReadOnly, u as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import "./session-key-C09ow4h0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as getCronStoreKysely } from "./schema-DOrtVteD.mjs";
import { n as inspectCronRowsForDoctor, t as inspectCronOwnerRowsForDoctor } from "./store-inventory-BNU8BqxX.mjs";
import { _ as upsertCronJobRow, f as resolveCronJobGrantDefinitionGenerationFloor, m as rowToCronJob, n as deleteCronJobRowInDatabase, o as loadCronRows } from "./row-codec-DgIrj0Uv.mjs";
import { t as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-c6hBDowh.mjs";
import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-uYw1RFJQ.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as inspectCronJobsReadOnly } from "./read-only-BnZqzQN0.mjs";
import { o as noteCronJobsStoreCommit } from "./store-ChPMJI5O.mjs";
import { n as sanitizeOpenClawStateLeaseRows } from "./openclaw-state-snapshot-sanitizer-B8rMlqrV.mjs";
import { existsSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor/cron/store-repair.ts
async function inspectCronJobOwnersForDoctor(scope, storePath) {
	return await withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(({ db }) => inspectCronOwnerRowsForDoctor(db, cronStoreKey(storePath)), scope) ?? [];
}
/** Pins only ownerless definitions, retaining every other authored and runtime field. */
async function repairLegacyCronJobOwnersForDoctor(scope, authority, storePath, legacyDefaultAgentId) {
	authority.assertCurrent();
	const rows = await inspectCronJobOwnersForDoctor(scope, storePath);
	authority.assertCurrent();
	const legacyAgentId = normalizeAgentId(legacyDefaultAgentId);
	const changes = [];
	for (const row of rows) {
		const job = safeParseJsonRecord(row.job_json);
		if (tryResolveCronJobEffectiveAgentId({
			agentId: normalizeOptionalString(job?.agentId),
			sessionKey: normalizeOptionalString(job?.sessionKey)
		})) continue;
		if (!job) throw new Error(`Cannot verify ownership of malformed cron job ${row.job_id}; repair its stored definition before retiring the legacy owner.`);
		const agentId = normalizeOptionalString(row.agent_id) ?? legacyAgentId;
		changes.push({
			jobId: row.job_id,
			agentId,
			definition: JSON.stringify({
				...job,
				agentId
			})
		});
	}
	if (changes.length === 0) return { changed: 0 };
	const storeKey = cronStoreKey(storePath);
	const backupPath = await commitCronDoctorRepair(scope, authority, {
		assertRowsUnchanged(db) {
			if (!isDeepStrictEqual(inspectCronOwnerRowsForDoctor(db, storeKey), rows)) throw new Error("Cron ownership changed during Doctor repair; inspect again before retrying.");
		},
		write(db) {
			for (const change of changes) {
				const retainedGenerationFloor = resolveCronJobGrantDefinitionGenerationFloor(db, change.jobId);
				executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("cron_jobs").set((eb) => ({
					agent_id: change.agentId,
					job_json: change.definition,
					grant_definition_revision: null,
					grant_definition_generation: eb.fn("max", [eb(eb.fn.coalesce("grant_definition_generation", eb.val(0)), "+", 1), eb.val(retainedGenerationFloor)]),
					grant_definition_updated_at: null
				})).where("store_key", "=", storeKey).where("job_id", "=", change.jobId));
			}
			deferSqlitePostCommitPublication(db, () => noteCronJobsStoreCommit(storeKey));
		}
	});
	return {
		changed: changes.length,
		backupPath
	};
}
async function inspectCronJobsForDoctor(scope) {
	const databasePath = resolveOpenClawStateSqlitePath(scope.env);
	if (!existsSync(databasePath)) return { jobs: [] };
	const reused = withMaintenanceOpenClawStateDatabaseReadOnly(({ db }) => inspectCronRowsForDoctor(db), databasePath);
	return { jobs: reused.reused ? reused.value : await inspectCronJobsReadOnly(scope.env) };
}
function definitionEvidence(jobs) {
	return jobs.map(({ storeKey, id, sortOrder, definitionJson }) => ({
		storeKey,
		id,
		sortOrder,
		definitionJson
	}));
}
/** One host-owned repair transaction; plugins choose rows, never database paths or SQL. */
async function repairCronJobsForDoctor(scope, authority, inspected, requested) {
	authority.assertCurrent();
	const inventory = structuredClone(inspected);
	const changes = structuredClone(requested).filter((change) => change.definition === null || !isDeepStrictEqual(change.job.definition, change.definition));
	if (changes.length === 0) return { changed: 0 };
	const seen = /* @__PURE__ */ new Set();
	for (const change of changes) {
		const key = JSON.stringify([change.job.storeKey, change.job.id]);
		if (seen.has(key) || !inventory.jobs.some((job) => isDeepStrictEqual(job, change.job))) throw new Error("Cron Doctor repair requires distinct inspected rows.");
		if (change.definition && change.definition.id !== change.job.id) throw new Error("Cron Doctor repair must preserve job IDs.");
		seen.add(key);
	}
	const expected = definitionEvidence(inventory.jobs);
	const assertRowsUnchanged = (db) => {
		if (!isDeepStrictEqual(definitionEvidence(inspectCronRowsForDoctor(db)), expected)) throw new Error("Cron definitions changed during Doctor repair; inspect again before retrying.");
	};
	const backupPath = await commitCronDoctorRepair(scope, authority, {
		assertRowsUnchanged,
		write(db) {
			for (const { job, definition } of changes) {
				if (!definition) {
					deleteCronJobRowInDatabase(db, job.storeKey, job.id);
					continue;
				}
				const row = loadCronRows(db, job.storeKey, /* @__PURE__ */ new Set([job.id]))[0];
				const replacement = row && rowToCronJob(row, definition);
				if (!replacement) throw new Error(`Cron Doctor repair cannot persist job ${job.id}.`);
				upsertCronJobRow(db, job.storeKey, replacement, job.sortOrder, { preserveRuntimeState: true });
			}
			for (const storeKey of new Set(changes.map(({ job }) => job.storeKey))) deferSqlitePostCommitPublication(db, () => noteCronJobsStoreCommit(storeKey));
		}
	});
	return {
		changed: changes.length,
		backupPath
	};
}
/** Shared pre-mutation backup for core and plugin cron repairs. */
async function backupCronStoreForDoctor(scope, repair) {
	repair.assertCurrent();
	const sourcePath = resolveOpenClawStateSqlitePath(scope.env);
	const backupPath = `${sourcePath}.doctor-cron-${Date.now()}-${randomUUID()}.bak`;
	await createVerifiedSqliteSnapshot({
		sourcePath,
		targetPath: backupPath,
		preserveRowIds: true,
		transform: sanitizeOpenClawStateLeaseRows,
		requireNonEmptySource: true,
		validate: repair.assertRowsUnchanged,
		beforePublish: repair.assertCurrent,
		afterPublish: (guard) => guard.assertTargetUnchanged(repair.assertCurrent)
	});
	return backupPath;
}
async function commitCronDoctorRepair(scope, authority, repair) {
	const backupPath = await backupCronStoreForDoctor(scope, {
		assertCurrent: () => authority.assertCurrent(),
		assertRowsUnchanged: repair.assertRowsUnchanged
	});
	try {
		authority.assertCurrent();
		runOpenClawStateWriteTransaction(({ db }) => {
			authority.assertOwnedInTransaction(db);
			repair.assertRowsUnchanged(db);
			repair.write(db);
		}, { env: scope.env }, { operationLabel: "cron.doctor-repair" });
	} catch (error) {
		throw new Error(`Cron Doctor repair failed; verified backup retained at ${backupPath}: ${String(error)}`, { cause: error });
	}
	return backupPath;
}
//#endregion
export { repairLegacyCronJobOwnersForDoctor as a, repairCronJobsForDoctor as i, inspectCronJobOwnersForDoctor as n, inspectCronJobsForDoctor as r, backupCronStoreForDoctor as t };
