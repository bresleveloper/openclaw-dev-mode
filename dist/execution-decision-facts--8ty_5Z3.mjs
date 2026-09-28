import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import "./sqlite-number-DM1AypRG.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as validateDecisionReceiptV1 } from "./audit-run-validators-DIyIA-46.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-DBVCGotT.mjs";
import { createHmac, randomBytes } from "node:crypto";
//#region src/audit/audit-identity.ts
/** Stable installation-local pseudonyms for sensitive audit identifiers. */
const AUDIT_IDENTITY_SINGLETON_ID = 1;
const AUDIT_IDENTITY_KEY_BYTES = 32;
const AUDIT_IDENTITY_KEY_ID_BYTES = 16;
const AUDIT_IDENTITY_KEY_ID_RE = /^[a-f0-9]{32}$/u;
const AUDIT_IDENTITY_DOMAIN = "openclaw.audit.identity.v1";
const identityByDatabase = /* @__PURE__ */ new WeakMap();
function registerAuditIdentityKeyForRedaction(key) {
	const bytes = Buffer.from(key);
	registerSecretValueForRedaction(bytes.toString("hex"));
	registerSecretValueForRedaction(bytes.toString("base64url"));
}
function parseAuditIdentityKey(row) {
	if (typeof row.key_id !== "string" || !AUDIT_IDENTITY_KEY_ID_RE.test(row.key_id) || !(row.key instanceof Uint8Array) || row.key.byteLength !== AUDIT_IDENTITY_KEY_BYTES) throw new Error("audit identity key is corrupt");
	const key = Buffer.from(row.key);
	registerAuditIdentityKeyForRedaction(key);
	return {
		keyId: row.key_id,
		key
	};
}
/** Load the stable audit identity key or create it transactionally on first use. */
function loadOrCreateAuditIdentityKey(db) {
	const cached = identityByDatabase.get(db);
	if (cached) return cached;
	const kysely = getNodeSqliteKysely(db);
	const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("audit_identity_keys").select(["key_id", "key"]).where("id", "=", AUDIT_IDENTITY_SINGLETON_ID));
	if (existing) {
		const identity = parseAuditIdentityKey(existing);
		identityByDatabase.set(db, identity);
		return identity;
	}
	const retainedMessage = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("audit_events").select("sequence").where("kind", "=", "message").limit(1));
	const retainedExecutionContext = Boolean(db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get("execution_identity_contexts")) ? executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("execution_identity_contexts").select("context_id").limit(1)) : void 0;
	if (retainedMessage || retainedExecutionContext) throw new Error("audit identity key is missing");
	const candidate = {
		id: AUDIT_IDENTITY_SINGLETON_ID,
		key_id: randomBytes(AUDIT_IDENTITY_KEY_ID_BYTES).toString("hex"),
		key: randomBytes(AUDIT_IDENTITY_KEY_BYTES),
		created_at: Date.now()
	};
	executeSqliteQuerySync(db, kysely.insertInto("audit_identity_keys").values(candidate).onConflict((conflict) => conflict.column("id").doNothing()));
	const stored = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("audit_identity_keys").select(["key_id", "key"]).where("id", "=", AUDIT_IDENTITY_SINGLETON_ID));
	if (!stored) throw new Error("audit identity key could not be created");
	const identity = parseAuditIdentityKey(stored);
	identityByDatabase.set(db, identity);
	return identity;
}
/** Forget transaction-local key state after a failed or rolled-back write. */
function clearAuditIdentityKeyCacheForDatabase(db) {
	identityByDatabase.delete(db);
}
/** Produce a stable, domain-separated pseudonym without retaining raw identity bytes. */
function pseudonymizeAuditIdentity(params) {
	if (params.value === void 0 || params.value.length === 0) return;
	const digest = createHmac("sha256", params.identity.key).update(JSON.stringify([
		AUDIT_IDENTITY_DOMAIN,
		params.kind,
		params.channel,
		params.accountId ?? null,
		params.kind === "message" ? params.conversationId ?? null : null,
		params.value
	]), "utf8").digest("hex");
	return `hmac-sha256:v1:${params.identity.keyId}:${digest}`;
}
/** Project one execution-identity ref without retaining its raw owner value. */
function pseudonymizeExecutionIdentityRef(params) {
	if (!params.scope || !params.value) throw new Error("execution identity HMAC scope and value must be non-empty");
	const identity = loadOrCreateAuditIdentityKey(params.db);
	const digest = createHmac("sha256", identity.key).update(JSON.stringify([
		"openclaw.audit.execution-identity.v1",
		params.kind,
		params.scope,
		params.value
	]), "utf8").digest("hex");
	return `hmac-sha256:v1:${identity.keyId}:${digest}`;
}
//#endregion
//#region src/audit/execution-decision-facts.ts
const EXECUTION_DECISION_FACT_MAX_BYTES = 16384;
const EXECUTION_DECISION_FACT_RETENTION_MS = 2592e6;
const EXECUTION_DECISION_FACT_MAX_ROWS = 25e4;
const EXECUTION_DECISION_FACT_PRUNE_BATCH_ROWS = 1024;
const ensureExecutionDecisionFactSchema = createOpenClawStateSchemaEnsurer({
	table: "execution_decision_facts",
	endMarker: "  ON execution_decision_facts (run_id, occurred_at, receipt_id);\n",
	operationLabel: "audit.execution-decision.schema.ensure"
});
function decisionDb(db) {
	return getNodeSqliteKysely(db);
}
function hasExactExecutionContext(db, context) {
	if (!tableExists(db, "execution_identity_contexts")) return false;
	return Boolean(executeSqliteQueryTakeFirstSync(db, decisionDb(db).selectFrom("execution_identity_contexts").select("context_id").where("context_id", "=", context.contextId).where("execution_id", "=", context.executionId).where("run_id", "=", context.runId)));
}
function deleteExpiredDecisionFacts(db, now, limit) {
	const kysely = decisionDb(db);
	const expiredIds = kysely.selectFrom("execution_decision_facts").select("receipt_id").where("occurred_at", "<", now - EXECUTION_DECISION_FACT_RETENTION_MS).orderBy("occurred_at", "asc").orderBy("receipt_id", "asc").limit(limit);
	return executeSqliteQuerySync(db, kysely.deleteFrom("execution_decision_facts").where("receipt_id", "in", expiredIds));
}
function pruneDecisionFactsAfterInsert(db, now, limits) {
	const kysely = decisionDb(db);
	const expired = deleteExpiredDecisionFacts(db, now, limits.pruneBatchRows);
	const remaining = Math.max(0, limits.pruneBatchRows - Number(expired.numAffectedRows ?? 0n));
	if (remaining === 0) return;
	const retainedIds = kysely.selectFrom("execution_decision_facts").select("receipt_id").orderBy("occurred_at", "desc").orderBy("receipt_id", "desc").limit(limits.maxRows);
	const overflowIds = kysely.selectFrom("execution_decision_facts").select("receipt_id").where("receipt_id", "not in", retainedIds).orderBy("occurred_at", "asc").orderBy("receipt_id", "asc").limit(remaining);
	executeSqliteQuerySync(db, kysely.deleteFrom("execution_decision_facts").where("receipt_id", "in", overflowIds));
}
/** Record one immutable fact only when its action owner has no native durable record. */
function recordExecutionDecisionFactInDatabase(receipt, options) {
	if (!validateDecisionReceiptV1(receipt)) throw new Error("execution decision fact must match DecisionReceiptV1");
	if (receipt.source.owner === "operator_approvals") throw new Error("operator approvals must be read from their owner-native table");
	if (!hasExactExecutionContext(openOpenClawStateDatabase(options).db, receipt)) throw new Error("execution decision fact requires an exact retained execution context");
	const receiptJson = JSON.stringify(receipt);
	const receiptBytes = Buffer.byteLength(receiptJson, "utf8");
	if (receiptBytes > EXECUTION_DECISION_FACT_MAX_BYTES) throw new Error("execution decision fact exceeds 16 KiB");
	ensureExecutionDecisionFactSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = decisionDb(db);
		if (!hasExactExecutionContext(db, receipt)) throw new Error("execution decision fact requires an exact retained execution context");
		const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("execution_decision_facts").select(["receipt_json"]).where("receipt_id", "=", receipt.receiptId));
		if (existing) {
			if (existing.receipt_json !== receiptJson) throw new Error("execution decision fact id conflicts with retained state");
			return "existing";
		}
		executeSqliteQuerySync(db, kysely.insertInto("execution_decision_facts").values({
			receipt_id: receipt.receiptId,
			context_id: receipt.contextId,
			execution_id: receipt.executionId,
			run_id: receipt.runId,
			action_id: receipt.actionId ?? null,
			action_family: receipt.action.family,
			decision_outcome: receipt.decision.outcome,
			coverage_state: receipt.enforcement.coverageState,
			reason_code: receipt.decision.reasonCode,
			owner: receipt.source.owner,
			source_ref: receipt.source.recordRef,
			occurred_at: receipt.occurredAt,
			receipt_bytes: receiptBytes,
			receipt_json: receiptJson
		}));
		pruneDecisionFactsAfterInsert(db, options.now ?? Date.now(), options.limits ?? {
			maxRows: EXECUTION_DECISION_FACT_MAX_ROWS,
			pruneBatchRows: EXECUTION_DECISION_FACT_PRUNE_BATCH_ROWS
		});
		return "inserted";
	}, options, { operationLabel: "audit.execution-decision.record" });
}
/** Delete one bounded batch without creating the optional table. */
function pruneExpiredExecutionDecisionFactsInDatabase(params) {
	const databaseOptions = params.database;
	const database = openOpenClawStateDatabase(databaseOptions);
	if (!tableExists(database.db, "execution_decision_facts")) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => Number(deleteExpiredDecisionFacts(db, params.now ?? Date.now(), EXECUTION_DECISION_FACT_PRUNE_BATCH_ROWS).numAffectedRows ?? 0n), {
		...databaseOptions,
		database
	}, { operationLabel: "audit.execution-decision.maintenance" });
}
//#endregion
export { pseudonymizeAuditIdentity as a, loadOrCreateAuditIdentityKey as i, recordExecutionDecisionFactInDatabase as n, pseudonymizeExecutionIdentityRef as o, clearAuditIdentityKeyCacheForDatabase as r, pruneExpiredExecutionDecisionFactsInDatabase as t };
