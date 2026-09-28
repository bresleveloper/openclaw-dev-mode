import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import "./sqlite-number-DM1AypRG.mjs";
import { n as isApprovalResolutionRef, t as buildApprovalResolutionRef } from "./approval-resolution-ref-BMBlVd2b.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { r as validateApprovalPresentation } from "./approval-result-validators-_fnoR1Wq.mjs";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.mjs";
import { a as mintMcpToolGrantLocked } from "./exec-approvals-sqlite-B0xu2OwW.mjs";
import { i as mintCronStandingGrantLocked } from "./operator-approval-standing-grants-Cj6F9npo.mjs";
import "node:crypto";
//#region src/gateway/operator-approval-store.rows.ts
const OPERATOR_APPROVAL_TERMINAL_RETENTION_MS = 2592e6;
const OPERATOR_APPROVAL_MAX_LIST_LIMIT = 1001;
var OperatorApprovalHistoryCursorError = class extends Error {
	constructor() {
		super("invalid operator approval history cursor");
		this.name = "OperatorApprovalHistoryCursorError";
	}
};
function parseOperatorApprovalKind(value) {
	return value === "exec" || value === "plugin" || value === "system-agent" ? value : null;
}
const OPERATOR_APPROVAL_EXECUTION_IDENTITY_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS operator_approval_execution_identities (
  approval_id TEXT NOT NULL PRIMARY KEY
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  source_context_id TEXT NOT NULL CHECK (
    length(source_context_id) BETWEEN 1 AND 256 AND source_context_id = trim(source_context_id)
  ),
  source_execution_id TEXT NOT NULL CHECK (
    length(source_execution_id) BETWEEN 1 AND 256 AND source_execution_id = trim(source_execution_id)
  )
) STRICT;
`;
function normalizeExecutionIdentityBinding(input) {
	const binding = input.executionIdentityToken;
	const sourceRunId = normalizeNullableString(input.source?.runId);
	if (!binding || normalizeNullableString(binding.runId) !== sourceRunId) return;
	const sourceContextId = normalizeNullableString(binding.contextId);
	const sourceExecutionId = normalizeNullableString(binding.executionId);
	if (!sourceContextId || !sourceExecutionId || sourceContextId.length > 256 || sourceExecutionId.length > 256) return;
	return {
		sourceContextId,
		sourceExecutionId
	};
}
function parseApprovalPresentation(raw) {
	const value = safeParseJson(raw);
	return validateApprovalPresentation(value) ? value : null;
}
function parseStringArray(raw) {
	const value = safeParseJson(raw);
	if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string" && Boolean(entry.trim()))) return null;
	return value;
}
function requireString(value, label) {
	const normalized = normalizeNullableString(value);
	if (!normalized) throw new Error(`${label} must not be empty`);
	return normalized;
}
function requireApprovalId(value) {
	if (!isWellFormedApprovalId(value)) throw new Error("operator approval id must be non-empty, well-formed Unicode, and not . or ..");
	return value;
}
function encodeOperatorApprovalHistoryCursor(cursor) {
	return Buffer.from(JSON.stringify({
		v: 1,
		...cursor
	}), "utf8").toString("base64url");
}
function decodeOperatorApprovalHistoryCursor(raw) {
	try {
		const bytes = Buffer.from(raw, "base64url");
		if (bytes.toString("base64url") !== raw) throw new OperatorApprovalHistoryCursorError();
		const parsed = JSON.parse(bytes.toString("utf8"));
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed) || !("v" in parsed) || parsed.v !== 1 || !("resolvedAtMs" in parsed) || typeof parsed.resolvedAtMs !== "number" || !Number.isSafeInteger(parsed.resolvedAtMs) || parsed.resolvedAtMs < 0 || !("id" in parsed) || typeof parsed.id !== "string" || !isWellFormedApprovalId(parsed.id)) throw new OperatorApprovalHistoryCursorError();
		const cursor = {
			resolvedAtMs: parsed.resolvedAtMs,
			id: parsed.id
		};
		if (encodeOperatorApprovalHistoryCursor(cursor) !== raw) throw new OperatorApprovalHistoryCursorError();
		return cursor;
	} catch (error) {
		if (error instanceof OperatorApprovalHistoryCursorError) throw error;
		throw new OperatorApprovalHistoryCursorError();
	}
}
function stringifyPresentation(presentation) {
	if (!validateApprovalPresentation(presentation)) throw new Error("operator approval presentation must match the safe protocol schema");
	let raw;
	try {
		raw = JSON.stringify(presentation);
	} catch (error) {
		throw new Error(`operator approval presentation is not JSON serializable: ${String(error)}`, { cause: error });
	}
	if (!parseApprovalPresentation(raw)) throw new Error("operator approval presentation must serialize to the safe protocol schema");
	return raw;
}
function isValidTimestamp(value) {
	return Number.isSafeInteger(value) && value >= 0;
}
function clampAuditTimestamp(nowMs, ...minimums) {
	return Math.max(nowMs, ...minimums.filter((value) => value !== null));
}
function hasValidLifecycleTuple(params) {
	const { row, status, decision, terminalReason, resolverKind } = params;
	const noConsumption = row.consumed_at_ms === null && row.consumed_by === null;
	if (status === "pending") return decision === null && terminalReason === null && row.resolved_at_ms === null && resolverKind === null && row.resolver_id === null && noConsumption;
	if (row.resolved_at_ms === null || resolverKind === null) return false;
	if (status === "allowed") {
		const validConsumption = decision === "allow-once" ? noConsumption || row.consumed_at_ms !== null && Boolean(row.consumed_by?.trim()) : noConsumption;
		return (decision === "allow-once" || decision === "allow-always") && terminalReason === "user" && validConsumption;
	}
	if (decision !== "deny" || !noConsumption) return false;
	if (status === "denied") return terminalReason === "user" || terminalReason === "malformed-verdict" || terminalReason === "no-route" || terminalReason === "storage-corrupt";
	if (status === "expired") return terminalReason === "timeout";
	return status === "cancelled" && (terminalReason === "run-aborted" || terminalReason === "gateway-restart");
}
function decodeOperatorApprovalRow(row) {
	const presentation = parseApprovalPresentation(row.presentation_json);
	const reviewerDeviceIds = parseStringArray(row.reviewer_device_ids_json);
	const audienceSessionKeys = parseStringArray(row.audience_session_keys_json);
	const kind = parseOperatorApprovalKind(row.kind);
	const status = row.status;
	const decision = row.decision;
	const terminalReason = row.terminal_reason;
	const resolverKind = row.resolver_kind;
	if (!presentation || !isWellFormedApprovalId(row.approval_id) || !isApprovalResolutionRef(row.resolution_ref) || !reviewerDeviceIds || !audienceSessionKeys || audienceSessionKeys.length > 64 || !kind || status !== "pending" && status !== "allowed" && status !== "denied" && status !== "expired" && status !== "cancelled" || !isValidTimestamp(row.created_at_ms) || !isValidTimestamp(row.expires_at_ms) || !isValidTimestamp(row.updated_at_ms) || row.expires_at_ms < row.created_at_ms || row.updated_at_ms < row.created_at_ms || row.resolved_at_ms !== null && (!isValidTimestamp(row.resolved_at_ms) || row.resolved_at_ms < row.created_at_ms || row.resolved_at_ms > row.updated_at_ms) || row.consumed_at_ms !== null && (!isValidTimestamp(row.consumed_at_ms) || row.resolved_at_ms === null || row.consumed_at_ms < row.resolved_at_ms || row.consumed_at_ms > row.updated_at_ms) || row.requested_by_device_token_auth !== 0 && row.requested_by_device_token_auth !== 1 || decision !== null && decision !== "allow-once" && decision !== "allow-always" && decision !== "deny" || terminalReason !== null && terminalReason !== "user" && terminalReason !== "timeout" && terminalReason !== "malformed-verdict" && terminalReason !== "no-route" && terminalReason !== "run-aborted" && terminalReason !== "gateway-restart" && terminalReason !== "storage-corrupt" || resolverKind !== null && resolverKind !== "device" && resolverKind !== "channel" && resolverKind !== "runtime" && resolverKind !== "system") return null;
	if (presentation.kind !== kind || row.resolution_ref !== buildApprovalResolutionRef({
		approvalId: row.approval_id,
		approvalKind: kind
	}) || !hasValidLifecycleTuple({
		row,
		status,
		decision,
		terminalReason,
		resolverKind
	}) || status === "allowed" && (!decision || !Array.prototype.includes.call(presentation.allowedDecisions, decision))) return null;
	return {
		id: row.approval_id,
		resolutionRef: row.resolution_ref,
		kind,
		status,
		presentation,
		requester: {
			deviceId: row.requested_by_device_id,
			clientId: row.requested_by_client_id,
			deviceTokenAuth: row.requested_by_device_token_auth === 1
		},
		reviewerDeviceIds,
		source: {
			agentId: row.source_agent_id,
			sessionKey: row.source_session_key,
			sessionId: row.source_session_id,
			runId: row.source_run_id,
			toolCallId: row.source_tool_call_id,
			toolName: row.source_tool_name
		},
		audienceSessionKeys,
		runtimeEpoch: row.runtime_epoch,
		createdAtMs: row.created_at_ms,
		expiresAtMs: row.expires_at_ms,
		updatedAtMs: row.updated_at_ms,
		decision,
		terminalReason,
		resolvedAtMs: row.resolved_at_ms,
		resolver: resolverKind === null ? null : {
			kind: resolverKind,
			id: row.resolver_id
		},
		consumedAtMs: row.consumed_at_ms,
		consumedBy: row.consumed_by
	};
}
function selectOperatorApprovalRow(database, id) {
	const stateDb = getNodeSqliteKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("operator_approvals").selectAll().where("approval_id", "=", id));
}
function selectOperatorApprovalRowByLocator(database, locator) {
	const stateDb = getNodeSqliteKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, stateDb.selectFrom("operator_approvals").selectAll().where((eb) => eb.or([eb("approval_id", "=", locator), eb("resolution_ref", "=", locator)])).limit(2)).rows;
	return rows.length === 1 ? rows[0] : void 0;
}
function hasApprovalLocatorNamespaceConflict(params) {
	const stateDb = getNodeSqliteKysely(params.database.db);
	return executeSqliteQueryTakeFirstSync(params.database.db, stateDb.selectFrom("operator_approvals").select("approval_id").where((eb) => eb.or([eb("approval_id", "=", params.resolutionRef), eb("resolution_ref", "=", params.id)])).where("approval_id", "!=", params.id)) !== void 0;
}
function matchesExpectedApprovalOwner(params) {
	return (params.expectedKind === void 0 || params.row.kind === params.expectedKind) && (params.runtimeEpoch === void 0 || params.row.runtime_epoch === params.runtimeEpoch);
}
function denyCorruptPendingRow(params) {
	const auditTimestampMs = clampAuditTimestamp(params.nowMs, params.createdAtMs);
	const stateDb = getNodeSqliteKysely(params.database.db);
	executeSqliteQuerySync(params.database.db, stateDb.updateTable("operator_approvals").set({
		status: "denied",
		decision: "deny",
		terminal_reason: "storage-corrupt",
		resolved_at_ms: auditTimestampMs,
		resolver_kind: "system",
		resolver_id: null,
		updated_at_ms: auditTimestampMs
	}).where("approval_id", "=", params.id).where("status", "=", "pending"));
}
function expirePendingRow(params) {
	const auditTimestampMs = clampAuditTimestamp(params.nowMs, params.createdAtMs);
	const stateDb = getNodeSqliteKysely(params.database.db);
	executeSqliteQuerySync(params.database.db, stateDb.updateTable("operator_approvals").set({
		status: "expired",
		decision: "deny",
		terminal_reason: "timeout",
		resolved_at_ms: auditTimestampMs,
		resolver_kind: "system",
		resolver_id: null,
		updated_at_ms: auditTimestampMs
	}).where("approval_id", "=", params.id).where("status", "=", "pending").where("expires_at_ms", "<=", params.nowMs));
	return selectOperatorApprovalRow(params.database, params.id);
}
function requireDecodedRecord(row) {
	const record = decodeOperatorApprovalRow(row);
	if (!record) throw new Error(`operator approval '${row.approval_id}' became corrupt during a transaction`);
	return record;
}
function inputMatchesExistingRow(input, row, serialized) {
	const source = input.source ?? {};
	return row.status === "pending" && row.kind === input.kind && row.presentation_json === serialized.presentationJson && row.requested_by_device_id === normalizeNullableString(input.requester?.deviceId) && row.requested_by_client_id === normalizeNullableString(input.requester?.clientId) && row.requested_by_device_token_auth === (input.requester?.deviceTokenAuth === true ? 1 : 0) && row.reviewer_device_ids_json === serialized.reviewerDeviceIdsJson && row.source_agent_id === normalizeNullableString(source.agentId) && row.source_session_key === normalizeNullableString(source.sessionKey) && row.source_session_id === normalizeNullableString(source.sessionId) && row.source_run_id === normalizeNullableString(source.runId) && row.source_tool_call_id === normalizeNullableString(source.toolCallId) && row.source_tool_name === normalizeNullableString(source.toolName) && row.audience_session_keys_json === serialized.audienceSessionKeysJson && row.runtime_epoch === input.runtimeEpoch.trim() && row.created_at_ms === input.createdAtMs && row.expires_at_ms === input.expiresAtMs;
}
sql`operator_approvals.presentation_json`, sql`operator_approvals.reviewer_device_ids_json`, sql`operator_approvals.audience_session_keys_json`;
//#endregion
//#region src/gateway/operator-approval-store.transitions.ts
function resolveOperatorApprovalInDatabase(params) {
	const id = requireApprovalId(params.id);
	const resolverId = normalizeNullableString(params.resolver.id);
	const runtimeEpoch = params.runtimeEpoch === void 0 ? void 0 : requireString(params.runtimeEpoch, "operator approval runtime epoch");
	return runOpenClawStateWriteTransaction((database) => {
		const nowMs = params.nowMs ?? Date.now();
		let row = selectOperatorApprovalRow(database, id);
		if (!row) return { outcome: "not-found" };
		if (!matchesExpectedApprovalOwner({
			row,
			expectedKind: params.expectedKind,
			runtimeEpoch
		})) return { outcome: "not-found" };
		let record = decodeOperatorApprovalRow(row);
		if (!record) {
			denyCorruptPendingRow({
				database,
				id,
				nowMs,
				createdAtMs: row.created_at_ms
			});
			return { outcome: "corrupt" };
		}
		if (record.status !== "pending") return {
			outcome: "already-resolved",
			retry: record.decision === params.decision ? "same" : "conflict",
			record
		};
		if (record.expiresAtMs <= nowMs) {
			row = expirePendingRow({
				database,
				id,
				nowMs,
				createdAtMs: row.created_at_ms
			});
			if (!row) return { outcome: "not-found" };
			record = requireDecodedRecord(row);
			return {
				outcome: "expired",
				record
			};
		}
		if (!Array.prototype.includes.call(record.presentation.allowedDecisions, params.decision)) return {
			outcome: "decision-not-allowed",
			record
		};
		const auditTimestampMs = clampAuditTimestamp(nowMs, record.createdAtMs);
		let resolveQuery = getNodeSqliteKysely(database.db).updateTable("operator_approvals").set({
			status: params.decision === "deny" ? "denied" : "allowed",
			decision: params.decision,
			terminal_reason: "user",
			resolved_at_ms: auditTimestampMs,
			resolver_kind: params.resolver.kind,
			resolver_id: resolverId,
			updated_at_ms: auditTimestampMs
		}).where("approval_id", "=", id).where("status", "=", "pending").where("expires_at_ms", ">", nowMs);
		if (params.expectedKind !== void 0) resolveQuery = resolveQuery.where("kind", "=", params.expectedKind);
		if (runtimeEpoch !== void 0) resolveQuery = resolveQuery.where("runtime_epoch", "=", runtimeEpoch);
		const result = executeSqliteQuerySync(database.db, resolveQuery);
		row = selectOperatorApprovalRow(database, id);
		if (!row) return { outcome: "not-found" };
		record = requireDecodedRecord(row);
		if (result.numAffectedRows === 1n) {
			if (params.decision === "allow-always" && params.mcpToolGrant && record.kind === "plugin" && record.source.agentId === params.mcpToolGrant.agentId) mintMcpToolGrantLocked(database.db, params.mcpToolGrant, auditTimestampMs);
			if (params.decision === "allow-always" && params.standingGrant) mintCronStandingGrantLocked(database, {
				...params.standingGrant,
				approvalId: id,
				nowMs: auditTimestampMs
			});
			return {
				outcome: "resolved",
				record
			};
		}
		if (record.status === "pending" && record.expiresAtMs <= nowMs) {
			const expiredRow = expirePendingRow({
				database,
				id,
				nowMs,
				createdAtMs: record.createdAtMs
			});
			if (!expiredRow) return { outcome: "not-found" };
			return {
				outcome: "expired",
				record: requireDecodedRecord(expiredRow)
			};
		}
		return {
			outcome: "already-resolved",
			retry: record.decision === params.decision ? "same" : "conflict",
			record
		};
	}, params.databaseOptions);
}
function forceDenyOperatorApprovalInDatabase(params) {
	const id = requireApprovalId(params.id);
	const runtimeEpoch = params.runtimeEpoch === void 0 ? void 0 : requireString(params.runtimeEpoch, "operator approval runtime epoch");
	return runOpenClawStateWriteTransaction((database) => {
		const nowMs = params.nowMs ?? Date.now();
		const row = selectOperatorApprovalRow(database, id);
		if (!row) return { outcome: "not-found" };
		if (!matchesExpectedApprovalOwner({
			row,
			expectedKind: params.expectedKind,
			runtimeEpoch
		})) return { outcome: "not-found" };
		if (row.status === "pending" && row.expires_at_ms <= nowMs) {
			const expiredRow = expirePendingRow({
				database,
				id,
				nowMs,
				createdAtMs: row.created_at_ms
			});
			if (!expiredRow) return { outcome: "not-found" };
			const expiredRecord = decodeOperatorApprovalRow(expiredRow);
			return expiredRecord ? {
				outcome: "expired",
				record: expiredRecord
			} : { outcome: "corrupt" };
		}
		const record = decodeOperatorApprovalRow(row);
		if (!record) {
			denyCorruptPendingRow({
				database,
				id,
				nowMs,
				createdAtMs: row.created_at_ms
			});
			return { outcome: "corrupt" };
		}
		if (record.status !== "pending") return {
			outcome: "already-terminal",
			record
		};
		if (params.status === "expired" && params.requireDue === true && record.expiresAtMs > nowMs) return {
			outcome: "not-due",
			record
		};
		const auditTimestampMs = clampAuditTimestamp(nowMs, record.createdAtMs);
		let denyQuery = getNodeSqliteKysely(database.db).updateTable("operator_approvals").set({
			status: params.status ?? "denied",
			decision: "deny",
			terminal_reason: params.reason,
			resolved_at_ms: auditTimestampMs,
			resolver_kind: params.resolver.kind,
			resolver_id: normalizeNullableString(params.resolver.id),
			updated_at_ms: auditTimestampMs
		}).where("approval_id", "=", id).where("status", "=", "pending");
		if (params.expectedKind !== void 0) denyQuery = denyQuery.where("kind", "=", params.expectedKind);
		if (runtimeEpoch !== void 0) denyQuery = denyQuery.where("runtime_epoch", "=", runtimeEpoch);
		executeSqliteQuerySync(database.db, denyQuery);
		const terminalRow = selectOperatorApprovalRow(database, id);
		if (!terminalRow) return { outcome: "not-found" };
		return {
			outcome: "denied",
			record: requireDecodedRecord(terminalRow)
		};
	}, params.databaseOptions);
}
function expireDueOperatorApprovalsInDatabase(params) {
	return runOpenClawStateWriteTransaction((database) => {
		const nowMs = params.nowMs ?? Date.now();
		const stateDb = getNodeSqliteKysely(database.db);
		const dueRows = executeSqliteQuerySync(database.db, stateDb.selectFrom("operator_approvals").selectAll().where("status", "=", "pending").where("expires_at_ms", "<=", nowMs).orderBy("expires_at_ms", "asc").orderBy("approval_id", "asc")).rows;
		if (dueRows.length === 0) return {
			affected: 0,
			records: []
		};
		const result = executeSqliteQuerySync(database.db, stateDb.updateTable("operator_approvals").set({
			status: "expired",
			decision: "deny",
			terminal_reason: "timeout",
			resolved_at_ms: nowMs,
			resolver_kind: "system",
			resolver_id: null,
			updated_at_ms: nowMs
		}).where("status", "=", "pending").where("expires_at_ms", "<=", nowMs));
		const terminalRows = [];
		for (const row of dueRows) terminalRows.push({
			...row,
			status: "expired",
			decision: "deny",
			terminal_reason: "timeout",
			resolved_at_ms: nowMs,
			resolver_kind: "system",
			resolver_id: null,
			updated_at_ms: nowMs
		});
		return {
			affected: Number(result.numAffectedRows ?? 0n),
			records: terminalRows.map((row) => decodeOperatorApprovalRow(row)).filter((record) => record !== null)
		};
	}, params.databaseOptions);
}
function closeOrphanedOperatorApprovals(params) {
	const runtimeEpoch = requireString(params.runtimeEpoch, "operator approval runtime epoch");
	return runOpenClawStateWriteTransaction((database) => {
		const nowMs = params.nowMs ?? Date.now();
		const stateDb = getNodeSqliteKysely(database.db);
		const orphanRows = executeSqliteQuerySync(database.db, stateDb.selectFrom("operator_approvals").selectAll().where("status", "=", "pending").where("runtime_epoch", "!=", runtimeEpoch).orderBy("created_at_ms", "asc").orderBy("approval_id", "asc")).rows;
		if (orphanRows.length === 0) return {
			affected: 0,
			records: []
		};
		let affected = 0;
		const terminalRows = [];
		for (const row of orphanRows) {
			const auditTimestampMs = clampAuditTimestamp(nowMs, row.created_at_ms);
			const result = executeSqliteQuerySync(database.db, stateDb.updateTable("operator_approvals").set({
				status: "cancelled",
				decision: "deny",
				terminal_reason: "gateway-restart",
				resolved_at_ms: auditTimestampMs,
				resolver_kind: "system",
				resolver_id: null,
				updated_at_ms: auditTimestampMs
			}).where("approval_id", "=", row.approval_id).where("status", "=", "pending"));
			const rowAffected = Number(result.numAffectedRows ?? 0n);
			affected += rowAffected;
			if (rowAffected === 1) terminalRows.push({
				...row,
				status: "cancelled",
				decision: "deny",
				terminal_reason: "gateway-restart",
				resolved_at_ms: auditTimestampMs,
				resolver_kind: "system",
				resolver_id: null,
				updated_at_ms: auditTimestampMs
			});
		}
		return {
			affected,
			records: terminalRows.map((row) => decodeOperatorApprovalRow(row)).filter((record) => record !== null)
		};
	}, params.databaseOptions);
}
function consumeOperatorApprovalAllowOnceInDatabase(params) {
	const id = requireApprovalId(params.id);
	const consumerId = requireString(params.consumerId, "operator approval consumer id");
	const runtimeEpoch = params.runtimeEpoch === void 0 ? void 0 : requireString(params.runtimeEpoch, "operator approval runtime epoch");
	if (params.redemptionWindowMs !== void 0 && !isValidTimestamp(params.redemptionWindowMs)) throw new Error("operator approval redemption window must be a non-negative safe integer");
	return runOpenClawStateWriteTransaction((database) => {
		const nowMs = params.nowMs ?? Date.now();
		const redemptionThresholdMs = params.redemptionWindowMs === void 0 ? void 0 : nowMs - params.redemptionWindowMs;
		let row = selectOperatorApprovalRow(database, id);
		if (!row) return { outcome: "not-found" };
		if (!matchesExpectedApprovalOwner({
			row,
			expectedKind: params.expectedKind,
			runtimeEpoch
		})) return { outcome: "not-found" };
		if (row.status === "pending" && row.expires_at_ms <= nowMs) {
			row = expirePendingRow({
				database,
				id,
				nowMs,
				createdAtMs: row.created_at_ms
			});
			if (!row) return { outcome: "not-found" };
		}
		let record = decodeOperatorApprovalRow(row);
		if (!record) {
			denyCorruptPendingRow({
				database,
				id,
				nowMs,
				createdAtMs: row.created_at_ms
			});
			return { outcome: "corrupt" };
		}
		if (record.status !== "allowed" || record.decision !== "allow-once") return {
			outcome: "not-allow-once",
			record
		};
		if (record.consumedAtMs !== null) return {
			outcome: "already-consumed",
			record
		};
		if (record.resolvedAtMs === null) return { outcome: "corrupt" };
		if (redemptionThresholdMs !== void 0 && record.resolvedAtMs <= redemptionThresholdMs) return {
			outcome: "redemption-expired",
			record
		};
		const auditTimestampMs = clampAuditTimestamp(nowMs, record.createdAtMs, record.resolvedAtMs, record.updatedAtMs);
		let consumeQuery = getNodeSqliteKysely(database.db).updateTable("operator_approvals").set({
			consumed_at_ms: auditTimestampMs,
			consumed_by: consumerId,
			updated_at_ms: auditTimestampMs
		}).where("approval_id", "=", id).where("status", "=", "allowed").where("decision", "=", "allow-once").where("consumed_at_ms", "is", null);
		if (redemptionThresholdMs !== void 0) consumeQuery = consumeQuery.where("resolved_at_ms", ">", redemptionThresholdMs);
		if (params.expectedKind !== void 0) consumeQuery = consumeQuery.where("kind", "=", params.expectedKind);
		if (runtimeEpoch !== void 0) consumeQuery = consumeQuery.where("runtime_epoch", "=", runtimeEpoch);
		const result = executeSqliteQuerySync(database.db, consumeQuery);
		row = selectOperatorApprovalRow(database, id);
		if (!row) return { outcome: "not-found" };
		record = requireDecodedRecord(row);
		if (result.numAffectedRows === 1n) return {
			outcome: "consumed",
			record
		};
		if (redemptionThresholdMs !== void 0 && record.resolvedAtMs !== null && record.resolvedAtMs <= redemptionThresholdMs) return {
			outcome: "redemption-expired",
			record
		};
		return {
			outcome: "already-consumed",
			record
		};
	}, params.databaseOptions);
}
function pruneTerminalOperatorApprovals(params) {
	const retentionMs = params.retentionMs ?? 2592e6;
	if (!Number.isSafeInteger(retentionMs) || retentionMs < 0) throw new Error("operator approval retention must be a non-negative safe integer");
	return runOpenClawStateWriteTransaction((database) => {
		const cutoffMs = (params.nowMs ?? Date.now()) - retentionMs;
		const stateDb = getNodeSqliteKysely(database.db);
		const result = executeSqliteQuerySync(database.db, stateDb.deleteFrom("operator_approvals").where("status", "!=", "pending").where("resolved_at_ms", "is not", null).where("resolved_at_ms", "<=", cutoffMs));
		return Number(result.numAffectedRows ?? 0n);
	}, params.databaseOptions);
}
//#endregion
//#region src/gateway/operator-approval-store.ts
function execute(type, input, { databaseOptions, assertCurrent }) {
	const context = captureOpenClawStateWorkerContext({
		...databaseOptions,
		path: databaseOptions?.database?.path ?? databaseOptions?.path
	});
	const captured = structuredClone(input);
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type,
		input: captured
	}), {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Operator approval mutation requires transaction admission");
				context.admission.assertCurrent();
				assertCurrent?.();
				grant();
			})
		})
	});
}
function insertOperatorApproval(params) {
	const { databaseOptions, assertCurrent, ...input } = params;
	return execute("operatorApprovals.insert", input, {
		databaseOptions,
		assertCurrent
	});
}
function getOperatorApprovalDetailed(params) {
	const { databaseOptions, assertCurrent, ...input } = params;
	return execute("operatorApprovals.get", input, {
		databaseOptions,
		assertCurrent
	});
}
function listPendingOperatorApprovals(params = {}) {
	const { databaseOptions, assertCurrent, ...input } = params;
	return execute("operatorApprovals.pending", input, {
		databaseOptions,
		assertCurrent
	});
}
function resolveOperatorApproval(params) {
	const { databaseOptions, assertCurrent, ...input } = params;
	return execute("operatorApprovals.resolve", input, {
		databaseOptions,
		assertCurrent
	});
}
function forceDenyOperatorApproval(params) {
	const { databaseOptions, assertCurrent, ...input } = params;
	return execute("operatorApprovals.deny", input, {
		databaseOptions,
		assertCurrent
	});
}
function expireDueOperatorApprovals(params) {
	const { databaseOptions, assertCurrent, ...input } = params;
	return execute("operatorApprovals.expire", input, {
		databaseOptions,
		assertCurrent
	});
}
function consumeOperatorApprovalAllowOnce(params) {
	const { databaseOptions, assertCurrent, ...input } = params;
	return execute("operatorApprovals.consume", input, {
		databaseOptions,
		assertCurrent
	});
}
async function listTerminalOperatorApprovals(params = {}) {
	const { databaseOptions, assertCurrent, ...input } = params;
	if (input.cursor !== void 0) decodeOperatorApprovalHistoryCursor(input.cursor);
	const context = captureOpenClawStateWorkerContext({
		...databaseOptions,
		path: databaseOptions?.database?.path ?? databaseOptions?.path
	});
	await runOpenClawStateWorkerOperation(context, async () => {}, { assertCurrent });
	const result = await executeExistingOpenClawStateRead({
		env: context.environment,
		path: context.admission.databasePath
	}, {
		type: "operatorApprovals.history",
		input
	});
	context.admission.assertCurrent();
	assertCurrent?.();
	if (result?.ok && result.type === "operatorApprovals.history") return result.history;
	throw new Error("Operator approval history database became unavailable");
}
//#endregion
export { stringifyPresentation as A, inputMatchesExistingRow as C, requireString as D, requireApprovalId as E, selectOperatorApprovalRow as O, hasApprovalLocatorNamespaceConflict as S, normalizeExecutionIdentityBinding as T, OPERATOR_APPROVAL_TERMINAL_RETENTION_MS as _, insertOperatorApproval as a, denyCorruptPendingRow as b, resolveOperatorApproval as c, expireDueOperatorApprovalsInDatabase as d, forceDenyOperatorApprovalInDatabase as f, OPERATOR_APPROVAL_MAX_LIST_LIMIT as g, OPERATOR_APPROVAL_EXECUTION_IDENTITY_SCHEMA_SQL as h, getOperatorApprovalDetailed as i, selectOperatorApprovalRowByLocator as k, closeOrphanedOperatorApprovals as l, resolveOperatorApprovalInDatabase as m, expireDueOperatorApprovals as n, listPendingOperatorApprovals as o, pruneTerminalOperatorApprovals as p, forceDenyOperatorApproval as r, listTerminalOperatorApprovals as s, consumeOperatorApprovalAllowOnce as t, consumeOperatorApprovalAllowOnceInDatabase as u, OperatorApprovalHistoryCursorError as v, isValidTimestamp as w, expirePendingRow as x, decodeOperatorApprovalRow as y };
