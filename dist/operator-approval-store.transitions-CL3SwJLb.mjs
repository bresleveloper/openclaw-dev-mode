import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as mintMcpToolGrantLocked } from "./exec-approvals-sqlite-BRXIFW7Z.mjs";
import { r as mintCronStandingGrantLocked } from "./operator-approval-standing-grants-pk0FVWgH.mjs";
import { _ as requireDecodedRecord, a as clampAuditTimestamp, c as denyCorruptPendingRow, g as requireApprovalId, l as expirePendingRow, m as matchesExpectedApprovalOwner, p as isValidTimestamp, s as decodeOperatorApprovalRow, v as requireString, y as selectOperatorApprovalRow } from "./operator-approval-store.rows-CUyuQiIg.mjs";
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
		const terminalFields = {
			status: "expired",
			decision: "deny",
			terminal_reason: "timeout",
			resolved_at_ms: nowMs,
			resolver_kind: "system",
			resolver_id: null,
			updated_at_ms: nowMs
		};
		const result = executeSqliteQuerySync(database.db, stateDb.updateTable("operator_approvals").set(terminalFields).where("status", "=", "pending").where("expires_at_ms", "<=", nowMs));
		return {
			affected: Number(result.numAffectedRows ?? 0n),
			records: dueRows.map((row) => decodeOperatorApprovalRow({
				...row,
				...terminalFields
			})).filter((record) => record !== null)
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
			const terminalFields = {
				status: "cancelled",
				decision: "deny",
				terminal_reason: "gateway-restart",
				resolved_at_ms: auditTimestampMs,
				resolver_kind: "system",
				resolver_id: null,
				updated_at_ms: auditTimestampMs
			};
			const result = executeSqliteQuerySync(database.db, stateDb.updateTable("operator_approvals").set(terminalFields).where("approval_id", "=", row.approval_id).where("status", "=", "pending"));
			const rowAffected = Number(result.numAffectedRows ?? 0n);
			affected += rowAffected;
			if (rowAffected === 1) terminalRows.push({
				...row,
				...terminalFields
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
export { pruneTerminalOperatorApprovals as a, forceDenyOperatorApprovalInDatabase as i, consumeOperatorApprovalAllowOnceInDatabase as n, resolveOperatorApprovalInDatabase as o, expireDueOperatorApprovalsInDatabase as r, closeOrphanedOperatorApprovals as t };
