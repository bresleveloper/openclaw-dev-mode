import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { d as resolveCronJobGrantDefinitionGenerationFloor, f as resolveCronJobGrantDefinitionRevision, o as loadedCronStoreFromRows } from "./row-codec-mXerryYi.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DtL_Z8FS.mjs";
import { r as buildSystemRunApprovalEnvBinding } from "./system-run-approval-binding-BDEolZhR.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/operator-approval-standing-grants.ts
const STANDING_GRANT_TABLE = "operator_approval_standing_grants";
const STANDING_GRANT_GENERATION_TABLE = "operator_approval_standing_grant_generations";
const STANDING_GRANT_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS operator_approval_standing_grants (
  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),
  minted_by_approval_id TEXT NOT NULL
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),
  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),
  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),
  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER CHECK (expires_at_ms IS NULL OR expires_at_ms >= created_at_ms),
  revoked_at_ms INTEGER,
  revoked_by TEXT,
  last_used_at_ms INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding
  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);

CREATE TABLE IF NOT EXISTS operator_approval_standing_grant_generations (
  grant_id TEXT NOT NULL PRIMARY KEY
    REFERENCES operator_approval_standing_grants(grant_id) ON DELETE CASCADE,
  job_definition_generation INTEGER NOT NULL CHECK (job_definition_generation >= 1)
) STRICT;
`;
/**
* Exact gateway-exec operation binding: trimmed command text, cwd, and the
* env-override hash. Both mint (approval creation) and use (allowlist
* evaluation) derive it from the same raw inputs, so matching is byte-exact —
* the same semantics as systemRunBinding digest matching.
*/
function buildCronExecOperationBinding(params) {
	return stableStringify({
		v: 1,
		command: params.command.trim(),
		cwd: params.cwd?.trim() || null,
		envHash: buildSystemRunApprovalEnvBinding(params.env).envHash
	});
}
/** Parses a stored operation binding back into its display facts. */
function parseCronExecOperationBinding(binding) {
	try {
		const parsed = JSON.parse(binding);
		if (parsed.v !== 1 || typeof parsed.command !== "string") return null;
		return {
			command: parsed.command,
			cwd: typeof parsed.cwd === "string" ? parsed.cwd : null
		};
	} catch {
		return null;
	}
}
function ensureStandingGrantSchema(db) {
	if (tableExists(db, STANDING_GRANT_TABLE)) {
		if (db.prepare(`PRAGMA table_info(${STANDING_GRANT_TABLE})`).all().some((column) => column.name === "expires_at_ms" && column.notnull === 1)) db.exec(`DROP TABLE ${STANDING_GRANT_TABLE};`);
	}
	db.exec(STANDING_GRANT_SCHEMA_SQL);
}
function decodeDefinitionGeneration(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 1 ? value : null;
}
/**
* Mints one standing grant inside the caller's open write transaction — the
* same transaction that resolves the minting approval to allow-always. A
* re-mint for the same (agent, job, binding) replaces prior grants.
*/
function mintCronStandingGrantLocked(database, params) {
	ensureStandingGrantSchema(database.db);
	const stateDb = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, stateDb.deleteFrom(STANDING_GRANT_TABLE).where("expires_at_ms", "is not", null).where("expires_at_ms", "<=", params.nowMs));
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
	executeSqliteQuerySync(database.db, stateDb.deleteFrom(STANDING_GRANT_TABLE).where("agent_id", "=", params.agentId).where("cron_job_id", "=", params.cronJobId).where("operation_binding", "=", params.operationBinding));
	const grantId = randomUUID();
	executeSqliteQuerySync(database.db, stateDb.insertInto(STANDING_GRANT_TABLE).values({
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
	}));
	executeSqliteQuerySync(database.db, stateDb.insertInto(STANDING_GRANT_GENERATION_TABLE).values({
		grant_id: grantId,
		job_definition_generation: jobDefinitionGeneration
	}));
}
/**
* Validates a standing grant without recording a use. Callers that skip the
* prompt on this result must still call consumeCronStandingGrant at the final
* execution boundary: authority is recorded only where the process spawns, so
* a revocation or job edit during awaited pre-spawn work still fails closed.
*/
function validateCronStandingGrant(params) {
	return lookupCronStandingGrant(params, { recordUse: false });
}
/**
* Validates and consumes one standing grant for a cron-context exec. All
* revalidation happens against authoritative rows inside one synchronous write
* transaction: expiry, revocation, the cron job still existing with the same
* config revision, and the minting approval row still holding allow-always.
* Every non-consumed outcome means the caller falls through to prompting.
*/
function consumeCronStandingGrant(params) {
	return lookupCronStandingGrant(params, { recordUse: true });
}
function lookupCronStandingGrant(params, opts) {
	return runOpenClawStateWriteTransaction((database) => {
		if (!tableExists(database.db, STANDING_GRANT_TABLE)) return { outcome: "no-grant" };
		const nowMs = params.nowMs ?? Date.now();
		const stateDb = getNodeSqliteKysely(database.db);
		const grant = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom(STANDING_GRANT_TABLE).selectAll().where("agent_id", "=", params.agentId).where("cron_job_id", "=", params.cronJobId).where("operation_binding", "=", params.operationBinding).orderBy("created_at_ms", "desc").orderBy("grant_id", "desc").limit(1));
		if (!grant) return { outcome: "no-grant" };
		if (grant.revoked_at_ms !== null) return { outcome: "revoked" };
		if (grant.expires_at_ms !== null && grant.expires_at_ms <= nowMs) return { outcome: "expired" };
		if (grant.job_config_revision !== params.jobConfigRevision) return { outcome: "job-revision-changed" };
		const jobRows = executeSqliteQuerySync(database.db, stateDb.selectFrom("cron_jobs").selectAll().where("job_id", "=", params.cronJobId).limit(2)).rows;
		if (jobRows.length !== 1) return { outcome: "job-missing" };
		const job = loadedCronStoreFromRows(jobRows).store.jobs.find((entry) => entry.id === params.cronJobId);
		if (!job) return { outcome: "job-missing" };
		if (resolveCronJobConfigRevision(job) !== grant.job_config_revision) return { outcome: "job-revision-changed" };
		const jobRow = jobRows[0];
		if (jobRow.grant_definition_revision !== resolveCronJobGrantDefinitionRevision(job)) return { outcome: "job-revision-changed" };
		if (jobRow.grant_definition_updated_at !== jobRow.updated_at) return { outcome: "job-revision-changed" };
		const grantGeneration = decodeDefinitionGeneration((tableExists(database.db, STANDING_GRANT_GENERATION_TABLE) ? executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom(STANDING_GRANT_GENERATION_TABLE).select("job_definition_generation").where("grant_id", "=", grant.grant_id)) : void 0)?.job_definition_generation);
		const jobGeneration = decodeDefinitionGeneration(jobRow.grant_definition_generation);
		if (grantGeneration === null || jobGeneration === null || grantGeneration !== jobGeneration) return { outcome: "job-revision-changed" };
		const approvalRow = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("operator_approvals").select(["status", "decision"]).where("approval_id", "=", grant.minted_by_approval_id));
		if (!approvalRow) return { outcome: "approval-missing" };
		if (approvalRow.status !== "allowed" || approvalRow.decision !== "allow-always") return { outcome: "approval-not-allow-always" };
		if (!opts.recordUse) return {
			outcome: "consumed",
			grant: {
				grantId: grant.grant_id,
				mintedByApprovalId: grant.minted_by_approval_id,
				agentId: grant.agent_id,
				cronJobId: grant.cron_job_id,
				jobConfigRevision: grant.job_config_revision,
				operationBinding: grant.operation_binding,
				createdAtMs: grant.created_at_ms,
				expiresAtMs: grant.expires_at_ms,
				lastUsedAtMs: grant.last_used_at_ms,
				useCount: grant.use_count
			}
		};
		const nextUseCount = grant.use_count + 1;
		if (executeSqliteQuerySync(database.db, stateDb.updateTable(STANDING_GRANT_TABLE).set({
			last_used_at_ms: nowMs,
			use_count: nextUseCount
		}).where("grant_id", "=", grant.grant_id).where("revoked_at_ms", "is", null).where((eb) => eb.or([eb("expires_at_ms", "is", null), eb("expires_at_ms", ">", nowMs)]))).numAffectedRows !== 1n) return { outcome: "no-grant" };
		return {
			outcome: "consumed",
			grant: {
				grantId: grant.grant_id,
				mintedByApprovalId: grant.minted_by_approval_id,
				agentId: grant.agent_id,
				cronJobId: grant.cron_job_id,
				jobConfigRevision: grant.job_config_revision,
				operationBinding: grant.operation_binding,
				createdAtMs: grant.created_at_ms,
				expiresAtMs: grant.expires_at_ms,
				lastUsedAtMs: nowMs,
				useCount: nextUseCount
			}
		};
	}, params.databaseOptions);
}
/**
* Lists standing grants for operator surfaces, newest first. Includes revoked
* and expired rows so the ledger explains recent history; callers render the
* state from the row facts instead of filtering here.
*/
function listCronStandingGrants(params = {}) {
	const limit = Math.max(1, Math.min(params.limit ?? 200, 500));
	return runOpenClawStateWriteTransaction((database) => {
		if (!tableExists(database.db, STANDING_GRANT_TABLE)) return [];
		const stateDb = getNodeSqliteKysely(database.db);
		return executeSqliteQuerySync(database.db, stateDb.selectFrom(STANDING_GRANT_TABLE).leftJoin("cron_jobs", "cron_jobs.job_id", "operator_approval_standing_grants.cron_job_id").selectAll(STANDING_GRANT_TABLE).select("cron_jobs.name as cron_job_name").orderBy("operator_approval_standing_grants.created_at_ms", "desc").orderBy("operator_approval_standing_grants.grant_id", "desc").limit(limit)).rows.map((row) => ({
			grantId: row.grant_id,
			mintedByApprovalId: row.minted_by_approval_id,
			agentId: row.agent_id,
			cronJobId: row.cron_job_id,
			jobConfigRevision: row.job_config_revision,
			operationBinding: row.operation_binding,
			createdAtMs: row.created_at_ms,
			expiresAtMs: row.expires_at_ms,
			lastUsedAtMs: row.last_used_at_ms,
			useCount: row.use_count,
			cronJobName: row.cron_job_name ?? null,
			revokedAtMs: row.revoked_at_ms,
			revokedBy: row.revoked_by
		}));
	}, params.databaseOptions);
}
/**
* Revokes one standing grant. Idempotent: a second revoke reports
* already-revoked without touching the recorded revocation provenance. The
* consume path fails closed on revoked_at_ms, so this takes effect at the
* next occurrence's spawn boundary.
*/
function revokeCronStandingGrant(params) {
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
		return {
			outcome: "revoked",
			grant: {
				grantId: grant.grant_id,
				mintedByApprovalId: grant.minted_by_approval_id,
				agentId: grant.agent_id,
				cronJobId: grant.cron_job_id,
				jobConfigRevision: grant.job_config_revision,
				operationBinding: grant.operation_binding,
				createdAtMs: grant.created_at_ms,
				expiresAtMs: grant.expires_at_ms,
				lastUsedAtMs: grant.last_used_at_ms,
				useCount: grant.use_count,
				cronJobName: null,
				revokedAtMs: nowMs,
				revokedBy: params.revokedBy
			}
		};
	}, params.databaseOptions);
}
//#endregion
export { parseCronExecOperationBinding as a, mintCronStandingGrantLocked as i, consumeCronStandingGrant as n, revokeCronStandingGrant as o, listCronStandingGrants as r, validateCronStandingGrant as s, buildCronExecOperationBinding as t };
