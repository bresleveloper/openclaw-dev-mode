import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as operatorStandingGrantPublication } from "./operator-approval-store.publication-DMDGNuqi.mjs";
import { f as resolveCronJobGrantDefinitionGenerationFloor, p as resolveCronJobGrantDefinitionRevision, s as loadedCronStoreFromRows } from "./row-codec-Cnnqjh5r.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { n as readCronRunReceiptCurrentFactsInDatabase } from "./run-receipt-read-DF1n0U0f.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/operator-approval-standing-grants.worker.ts
const STANDING_GRANT_TABLE = "operator_approval_standing_grants";
const STANDING_GRANT_GENERATION_TABLE = "operator_approval_standing_grant_generations";
const STANDING_GRANT_SCHEMA_SQL = getOpenClawStateFeatureSchemaSql(STANDING_GRANT_TABLE);
function projectCronStandingGrant(row) {
	return {
		grantId: row.grant_id,
		mintedByApprovalId: row.minted_by_approval_id,
		agentId: row.agent_id,
		cronJobId: row.cron_job_id,
		jobConfigRevision: row.job_config_revision,
		operationBinding: row.operation_binding,
		createdAtMs: row.created_at_ms,
		expiresAtMs: row.expires_at_ms,
		lastUsedAtMs: row.last_used_at_ms,
		useCount: row.use_count
	};
}
const installStandingGrantSchema = createSqliteSchemaEnsurer(() => STANDING_GRANT_SCHEMA_SQL, { tables: [STANDING_GRANT_TABLE, STANDING_GRANT_GENERATION_TABLE] });
function ensureStandingGrantSchema(db) {
	const ddl = getAdmittedSqliteSchemaFacts(db)?.tableSql.get(STANDING_GRANT_TABLE);
	if (ddl && /\bexpires_at_ms\s+INTEGER\s+NOT\s+NULL\b/iu.test(ddl)) db.exec(`DROP TABLE ${STANDING_GRANT_TABLE};`);
	installStandingGrantSchema(db);
}
function decodeDefinitionGeneration(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 1 ? value : null;
}
/** Preserve derivative references when offline Doctor only narrows a legacy job to an account. */
function migrateCronInferenceStandingGrantReferences(db, previous, next, generation) {
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (!maintenance?.ownsSchemaMaintenance) throw new Error("Cron inference grant reference migration requires offline Doctor maintenance.");
	maintenance.assertAdmission();
	const { inferenceBinding, ...unchanged } = next;
	if (previous.inferenceBinding !== void 0 || !inferenceBinding || !isDeepStrictEqual(previous, unchanged)) throw new Error("Cron inference migration must preserve the entire approved job definition.");
	if (!tableExists(db, STANDING_GRANT_TABLE) || !tableExists(db, STANDING_GRANT_GENERATION_TABLE)) return;
	const stateDb = getNodeSqliteKysely(db);
	const migrated = executeSqliteQuerySync(db, stateDb.updateTable(STANDING_GRANT_TABLE).set({ job_config_revision: resolveCronJobConfigRevision(next) }).where("cron_job_id", "=", previous.id).where("job_config_revision", "=", resolveCronJobConfigRevision(previous)).where("revoked_at_ms", "is", null).where((eb) => eb.or([eb("expires_at_ms", "is", null), eb("expires_at_ms", ">", Date.now())])).where("minted_by_approval_id", "in", stateDb.selectFrom("operator_approvals").select("approval_id").where("status", "=", "allowed").where("decision", "=", "allow-always")).where("grant_id", "in", stateDb.selectFrom(STANDING_GRANT_GENERATION_TABLE).select("grant_id").where("job_definition_generation", "=", generation)).returningAll());
	operatorStandingGrantPublication.stagePostimages(db, migrated.rows);
}
/**
* Mints one standing grant inside the caller's open write transaction — the
* same transaction that resolves the minting approval to allow-always. A
* re-mint for the same (agent, job, binding) replaces prior grants.
*/
function mintCronStandingGrantLocked(database, params) {
	ensureStandingGrantSchema(database.db);
	const stateDb = getNodeSqliteKysely(database.db);
	const expired = executeSqliteQuerySync(database.db, stateDb.deleteFrom(STANDING_GRANT_TABLE).where("expires_at_ms", "is not", null).where("expires_at_ms", "<=", params.nowMs).returning("grant_id"));
	operatorStandingGrantPublication.stageDeletions(database.db, expired.rows.map((row) => row.grant_id));
	const jobRows = executeSqliteQuerySync(database.db, stateDb.selectFrom("cron_jobs").selectAll().where("job_id", "=", params.cronJobId).limit(2)).rows;
	if (jobRows.length !== 1) return;
	const jobRow = jobRows[0];
	const job = loadedCronStoreFromRows(jobRows).store.jobs.find((entry) => entry.id === params.cronJobId);
	if (!job || resolveCronJobConfigRevision(job) !== params.jobConfigRevision) return;
	const grantDefinitionRevision = resolveCronJobGrantDefinitionRevision(job);
	let jobDefinitionGeneration = decodeDefinitionGeneration(jobRow.grant_definition_generation);
	if (jobRow.grant_definition_revision !== grantDefinitionRevision || jobRow.grant_definition_updated_at !== jobRow.updated_at || jobDefinitionGeneration === null) {
		const retainedGenerationFloor = resolveCronJobGrantDefinitionGenerationFloor(database.db, params.cronJobId);
		jobDefinitionGeneration = decodeDefinitionGeneration(Math.max((jobDefinitionGeneration ?? 0) + 1, retainedGenerationFloor));
		if (jobDefinitionGeneration === null) return;
		executeSqliteQuerySync(database.db, stateDb.updateTable("cron_jobs").set({
			grant_definition_revision: grantDefinitionRevision,
			grant_definition_generation: jobDefinitionGeneration,
			grant_definition_updated_at: jobRow.updated_at
		}).where("store_key", "=", jobRow.store_key).where("job_id", "=", jobRow.job_id));
	}
	const replaced = executeSqliteQuerySync(database.db, stateDb.deleteFrom(STANDING_GRANT_TABLE).where("agent_id", "=", params.agentId).where("cron_job_id", "=", params.cronJobId).where("operation_binding", "=", params.operationBinding).returning("grant_id"));
	operatorStandingGrantPublication.stageDeletions(database.db, replaced.rows.map((row) => row.grant_id));
	const grantId = randomUUID();
	const inserted = executeSqliteQuerySync(database.db, stateDb.insertInto(STANDING_GRANT_TABLE).values({
		grant_id: grantId,
		minted_by_approval_id: params.approvalId,
		agent_id: params.agentId,
		cron_job_id: params.cronJobId,
		job_config_revision: params.jobConfigRevision,
		operation_binding: params.operationBinding,
		created_at_ms: params.nowMs,
		expires_at_ms: params.expiresAtMs,
		revoked_at_ms: null,
		revoked_by: null,
		last_used_at_ms: null,
		use_count: 0
	}).returningAll());
	operatorStandingGrantPublication.stagePostimages(database.db, inserted.rows);
	executeSqliteQuerySync(database.db, stateDb.insertInto(STANDING_GRANT_GENERATION_TABLE).values({
		grant_id: grantId,
		job_definition_generation: jobDefinitionGeneration
	}));
}
/** Worker snapshot lookup; only committed consumption authorizes a launch. */
function lookupCronStandingGrantInDatabase(db, params, recordUse) {
	return runSqliteDeferredTransactionSync(db, () => {
		if (!tableExists(db, STANDING_GRANT_TABLE)) return { outcome: "no-grant" };
		const nowMs = params.nowMs ?? Date.now();
		const stateDb = getNodeSqliteKysely(db);
		const grant = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom(STANDING_GRANT_TABLE).selectAll().where("agent_id", "=", params.agentId).where("cron_job_id", "=", params.cronJobId).where("operation_binding", "=", params.operationBinding).orderBy("created_at_ms", "desc").orderBy("grant_id", "desc").limit(1));
		if (!grant || params.expectedGrant && (grant.grant_id !== params.expectedGrant.grantId || grant.minted_by_approval_id !== params.expectedGrant.mintedByApprovalId)) return { outcome: "no-grant" };
		if (grant.revoked_at_ms !== null) return { outcome: "revoked" };
		if (grant.expires_at_ms !== null && grant.expires_at_ms <= nowMs) return { outcome: "expired" };
		if (grant.job_config_revision !== params.jobConfigRevision) return { outcome: "job-revision-changed" };
		const jobRows = executeSqliteQuerySync(db, stateDb.selectFrom("cron_jobs").selectAll().where("job_id", "=", params.cronJobId).limit(2)).rows;
		if (jobRows.length !== 1) return { outcome: "job-missing" };
		const job = loadedCronStoreFromRows(jobRows).store.jobs.find((entry) => entry.id === params.cronJobId);
		if (!job) return { outcome: "job-missing" };
		if (resolveCronJobConfigRevision(job) !== grant.job_config_revision) return { outcome: "job-revision-changed" };
		const jobRow = jobRows[0];
		if (jobRow.grant_definition_revision !== resolveCronJobGrantDefinitionRevision(job)) return { outcome: "job-revision-changed" };
		if (jobRow.grant_definition_updated_at !== jobRow.updated_at) return { outcome: "job-revision-changed" };
		const grantGeneration = decodeDefinitionGeneration((tableExists(db, STANDING_GRANT_GENERATION_TABLE) ? executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom(STANDING_GRANT_GENERATION_TABLE).select("job_definition_generation").where("grant_id", "=", grant.grant_id)) : void 0)?.job_definition_generation);
		const jobGeneration = decodeDefinitionGeneration(jobRow.grant_definition_generation);
		if (grantGeneration === null || jobGeneration === null || grantGeneration !== jobGeneration) return { outcome: "job-revision-changed" };
		const { handle } = params;
		const facts = readCronRunReceiptCurrentFactsInDatabase(db, {
			type: "cron.currentReceipt",
			handle,
			includeJob: false,
			includeAvailability: true
		});
		if (!isDeepStrictEqual(facts.receipt, handle) || facts.deletionBlocked || handle.agentId !== params.agentId || handle.jobId !== params.cronJobId || handle.storeKey !== jobRow.store_key || handle.configRevision !== params.jobConfigRevision || job.agentId !== void 0 && job.agentId !== handle.agentId) return { outcome: "receipt-not-current" };
		const approvalRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("operator_approvals").select(["status", "decision"]).where("approval_id", "=", grant.minted_by_approval_id));
		if (!approvalRow) return { outcome: "approval-missing" };
		if (approvalRow.status !== "allowed" || approvalRow.decision !== "allow-always") return { outcome: "approval-not-allow-always" };
		if (!recordUse) return {
			outcome: "consumed",
			grant: projectCronStandingGrant(grant)
		};
		const nextUseCount = grant.use_count + 1;
		if (executeSqliteQuerySync(db, stateDb.updateTable(STANDING_GRANT_TABLE).set({
			last_used_at_ms: nowMs,
			use_count: nextUseCount
		}).where("grant_id", "=", grant.grant_id).where("revoked_at_ms", "is", null).where((eb) => eb.or([eb("expires_at_ms", "is", null), eb("expires_at_ms", ">", nowMs)]))).numAffectedRows !== 1n) return { outcome: "no-grant" };
		operatorStandingGrantPublication.stagePostimages(db, [{
			...grant,
			last_used_at_ms: nowMs,
			use_count: nextUseCount
		}]);
		return {
			outcome: "consumed",
			grant: {
				...projectCronStandingGrant(grant),
				lastUsedAtMs: nowMs,
				useCount: nextUseCount
			}
		};
	});
}
/** Called only by the existing shared-state writer transaction. */
function consumeCronStandingGrantInDatabase(params) {
	return runOpenClawStateWriteTransaction(({ db }) => lookupCronStandingGrantInDatabase(db, params, params.recordUse), params.databaseOptions);
}
/** Repeated revocation preserves the original actor and timestamp. */
function revokeCronStandingGrantInDatabase(params) {
	return runOpenClawStateWriteTransaction((database) => {
		if (!tableExists(database.db, STANDING_GRANT_TABLE)) return { outcome: "not-found" };
		const nowMs = params.nowMs ?? Date.now();
		const stateDb = getNodeSqliteKysely(database.db);
		const grant = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom(STANDING_GRANT_TABLE).selectAll().where("grant_id", "=", params.grantId));
		if (!grant) return { outcome: "not-found" };
		if (grant.revoked_at_ms !== null) return { outcome: "already-revoked" };
		executeSqliteQuerySync(database.db, stateDb.updateTable(STANDING_GRANT_TABLE).set({
			revoked_at_ms: nowMs,
			revoked_by: params.revokedBy
		}).where("grant_id", "=", params.grantId).where("revoked_at_ms", "is", null));
		operatorStandingGrantPublication.stagePostimages(database.db, [{
			...grant,
			revoked_at_ms: nowMs,
			revoked_by: params.revokedBy
		}]);
		return {
			outcome: "revoked",
			grant: {
				...projectCronStandingGrant(grant),
				cronJobName: null,
				revokedAtMs: nowMs,
				revokedBy: params.revokedBy
			}
		};
	}, params.databaseOptions);
}
//#endregion
export { revokeCronStandingGrantInDatabase as i, migrateCronInferenceStandingGrantReferences as n, mintCronStandingGrantLocked as r, consumeCronStandingGrantInDatabase as t };
