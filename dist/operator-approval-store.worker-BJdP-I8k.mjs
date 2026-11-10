import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-DRRWcLCw.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as execApprovalsPublication } from "./exec-approvals-publication-BPITitc6.mjs";
import { i as mintMcpToolGrantLocked } from "./exec-approvals-sqlite-BKYjiJeV.mjs";
import { n as operatorStandingGrantPublication, t as operatorApprovalPublication } from "./operator-approval-store.publication-DMDGNuqi.mjs";
import { a as clampAuditTimestamp, c as getOperatorApprovalResolutionKey, d as matchesExpectedApprovalOwner, f as normalizeExecutionIdentityBinding, g as stringifyPresentation, h as requireString, l as inputMatchesExistingRow, m as requireDecodedRecord, n as OPERATOR_APPROVAL_MAX_LIST_LIMIT, p as requireApprovalId, r as OPERATOR_APPROVAL_TERMINAL_RETENTION_MS, s as decodeOperatorApprovalRow, t as OPERATOR_APPROVAL_EXECUTION_IDENTITY_SCHEMA_SQL, u as isValidTimestamp } from "./operator-approval-store.rows-CDZY6GCx.mjs";
import { i as revokeCronStandingGrantInDatabase, r as mintCronStandingGrantLocked, t as consumeCronStandingGrantInDatabase } from "./operator-approval-standing-grants.worker-Coqtxo-t.mjs";
import { t as matchesOperatorApprovalReviewerBinding } from "./operator-approval-reviewer-binding-Bwb8-kfM.mjs";
//#region src/gateway/operator-approval-store.fields.ts
function operatorApprovalTerminalFields(status, terminalReason, nowMs, decision = "deny", resolver = {
	kind: "system",
	id: null
}) {
	return {
		status,
		decision,
		terminal_reason: terminalReason,
		resolved_at_ms: nowMs,
		resolver_kind: resolver.kind,
		resolver_id: resolver.id,
		updated_at_ms: nowMs
	};
}
//#endregion
//#region src/gateway/operator-approval-store.rows.worker.ts
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
function denyCorruptPendingRow(params) {
	const auditTimestampMs = clampAuditTimestamp(params.nowMs, params.createdAtMs);
	const stateDb = getNodeSqliteKysely(params.database.db);
	const changed = executeSqliteQuerySync(params.database.db, stateDb.updateTable("operator_approvals").set(operatorApprovalTerminalFields("denied", "storage-corrupt", auditTimestampMs)).where("approval_id", "=", params.id).where("status", "=", "pending").returningAll());
	operatorApprovalPublication.stagePostimages(params.database.db, changed.rows);
}
function expirePendingRow(params) {
	const auditTimestampMs = clampAuditTimestamp(params.nowMs, params.createdAtMs);
	const stateDb = getNodeSqliteKysely(params.database.db);
	const changed = executeSqliteQuerySync(params.database.db, stateDb.updateTable("operator_approvals").set(operatorApprovalTerminalFields("expired", "timeout", auditTimestampMs)).where("approval_id", "=", params.id).where("status", "=", "pending").where("expires_at_ms", "<=", params.nowMs).returningAll());
	operatorApprovalPublication.stagePostimages(params.database.db, changed.rows);
	return changed.rows[0];
}
//#endregion
//#region src/gateway/operator-approval-store.kernel.worker.ts
const ensureExecutionIdentitySchema = createSqliteSchemaEnsurer(() => OPERATOR_APPROVAL_EXECUTION_IDENTITY_SCHEMA_SQL, { tables: ["operator_approval_execution_identities"] });
function insertOperatorApprovalInDatabase(params) {
	const input = params.approval;
	const id = requireApprovalId(input.id);
	const resolutionRef = buildApprovalResolutionRef({
		approvalId: id,
		approvalKind: input.kind
	});
	const runtimeEpoch = requireString(input.runtimeEpoch, "operator approval runtime epoch");
	if (!isValidTimestamp(input.createdAtMs) || !isValidTimestamp(input.expiresAtMs)) throw new Error("operator approval timestamps must be non-negative safe integers");
	if (input.expiresAtMs < input.createdAtMs) throw new Error("operator approval expiry cannot precede creation");
	const presentationJson = stringifyPresentation(input.presentation);
	if (input.presentation.kind !== input.kind) throw new Error("operator approval kind must match its safe presentation");
	const reviewerDeviceIdsJson = JSON.stringify(normalizeUniqueTrimmedStringList(input.reviewerDeviceIds));
	const audienceSessionKeys = normalizeUniqueTrimmedStringList(input.audienceSessionKeys);
	if (audienceSessionKeys.length > 64) throw new Error(`operator approval audience exceeds 64 sessions`);
	const audienceSessionKeysJson = JSON.stringify(audienceSessionKeys);
	const serialized = {
		presentationJson,
		reviewerDeviceIdsJson,
		audienceSessionKeysJson
	};
	const executionIdentityBinding = normalizeExecutionIdentityBinding(input);
	return runOpenClawStateWriteTransaction((database) => {
		const stateDb = getNodeSqliteKysely(database.db);
		const pruned = executeSqliteQuerySync(database.db, stateDb.deleteFrom("operator_approvals").where("status", "!=", "pending").where("resolved_at_ms", "is not", null).where("resolved_at_ms", "<=", input.createdAtMs - OPERATOR_APPROVAL_TERMINAL_RETENTION_MS).returning("approval_id"));
		operatorApprovalPublication.stageDeletions(database.db, pruned.rows.map((row) => row.approval_id));
		if (hasApprovalLocatorNamespaceConflict({
			database,
			id,
			resolutionRef
		})) return { outcome: "conflict" };
		const source = input.source ?? {};
		const result = executeSqliteQuerySync(database.db, stateDb.insertInto("operator_approvals").values((eb) => ({
			cursor_id: eb.selectFrom("operator_approvals").select((inner) => inner(inner.fn.coalesce(inner.fn.max("cursor_id"), inner.val(0)), "+", 1).as("cursor_id")),
			approval_id: id,
			resolution_ref: resolutionRef,
			kind: input.kind,
			status: "pending",
			presentation_json: presentationJson,
			requested_by_device_id: normalizeNullableString(input.requester?.deviceId),
			requested_by_client_id: normalizeNullableString(input.requester?.clientId),
			requested_by_device_token_auth: input.requester?.deviceTokenAuth === true ? 1 : 0,
			reviewer_device_ids_json: reviewerDeviceIdsJson,
			source_agent_id: normalizeNullableString(source.agentId),
			source_session_key: normalizeNullableString(source.sessionKey),
			source_session_id: normalizeNullableString(source.sessionId),
			source_run_id: normalizeNullableString(source.runId),
			source_tool_call_id: normalizeNullableString(source.toolCallId),
			source_tool_name: normalizeNullableString(source.toolName),
			audience_session_keys_json: audienceSessionKeysJson,
			runtime_epoch: runtimeEpoch,
			created_at_ms: input.createdAtMs,
			expires_at_ms: input.expiresAtMs,
			updated_at_ms: input.createdAtMs,
			decision: null,
			terminal_reason: null,
			resolved_at_ms: null,
			resolver_kind: null,
			resolver_id: null,
			consumed_at_ms: null,
			consumed_by: null
		})).onConflict((conflict) => conflict.column("approval_id").doNothing()).returningAll());
		const row = result.rows[0] ?? selectOperatorApprovalRow(database, id);
		if (!row) throw new Error(`operator approval '${id}' was not readable after insert`);
		if (result.rows.length === 1) operatorApprovalPublication.stagePostimages(database.db, [row]);
		const record = decodeOperatorApprovalRow(row);
		if (!record) {
			denyCorruptPendingRow({
				database,
				id,
				nowMs: input.createdAtMs,
				createdAtMs: row.created_at_ms
			});
			return { outcome: "conflict" };
		}
		if (result.rows.length === 1) {
			if (executionIdentityBinding) {
				ensureExecutionIdentitySchema(database.db);
				executeSqliteQuerySync(database.db, stateDb.insertInto("operator_approval_execution_identities").values({
					approval_id: id,
					source_context_id: executionIdentityBinding.sourceContextId,
					source_execution_id: executionIdentityBinding.sourceExecutionId
				}));
			}
			return {
				outcome: "inserted",
				record
			};
		}
		if (!inputMatchesExistingRow(input, row, serialized)) return { outcome: "conflict" };
		if (executionIdentityBinding) {
			if (!tableExists(database.db, "operator_approval_execution_identities")) return { outcome: "conflict" };
			const existingBinding = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("operator_approval_execution_identities").select(["source_context_id", "source_execution_id"]).where("approval_id", "=", id));
			if (existingBinding?.source_context_id !== executionIdentityBinding.sourceContextId || existingBinding.source_execution_id !== executionIdentityBinding.sourceExecutionId) return { outcome: "conflict" };
		}
		return {
			outcome: "existing",
			record
		};
	}, params.databaseOptions);
}
function getOperatorApprovalDetailedInDatabase(params) {
	const locator = requireApprovalId(params.id);
	return runOpenClawStateWriteTransaction((database) => {
		const nowMs = params.nowMs ?? Date.now();
		let row = params.allowTransportRef ? selectOperatorApprovalRowByLocator(database, locator) : selectOperatorApprovalRow(database, locator);
		if (!row) return { outcome: "not-found" };
		const id = row.approval_id;
		if (row.status === "pending" && row.expires_at_ms <= nowMs) {
			row = expirePendingRow({
				database,
				id,
				nowMs,
				createdAtMs: row.created_at_ms
			});
			if (!row) return { outcome: "not-found" };
		}
		const record = decodeOperatorApprovalRow(row);
		if (record) return {
			outcome: "found",
			record
		};
		denyCorruptPendingRow({
			database,
			id,
			nowMs,
			createdAtMs: row.created_at_ms
		});
		return params.allowTransportRef ? {
			outcome: "corrupt",
			id
		} : { outcome: "corrupt" };
	}, params.databaseOptions);
}
function readPendingOperatorApprovalsInDatabase(params, db) {
	const nowMs = params.nowMs ?? Date.now();
	const stateDb = getNodeSqliteKysely(db);
	const resultLimit = Math.max(1, Math.min(params.limit ?? 1e3, OPERATOR_APPROVAL_MAX_LIST_LIMIT));
	const audienceSessionKey = params.audienceSessionKey === void 0 ? void 0 : requireString(params.audienceSessionKey, "operator approval audience session key");
	const requiresPostFilter = audienceSessionKey !== void 0 || params.reviewerDeviceId !== void 0;
	const records = [];
	let query = stateDb.selectFrom("operator_approvals").selectAll().where("status", "=", "pending").where("expires_at_ms", ">", nowMs).orderBy("created_at_ms", "asc").orderBy("approval_id", "asc");
	if (params.kind) query = query.where("kind", "=", params.kind);
	if (params.sourceSessionKey) query = query.where("source_session_key", "=", params.sourceSessionKey);
	if (!requiresPostFilter) query = query.limit(resultLimit);
	const corrupt = [];
	for (const row of iterateSqliteQuerySync(db, query)) {
		const record = decodeOperatorApprovalRow(row);
		if (!record) {
			corrupt.push({
				id: row.approval_id,
				createdAtMs: row.created_at_ms
			});
			continue;
		}
		const matchesAudience = !audienceSessionKey || record.audienceSessionKeys.includes(audienceSessionKey);
		const matchesReviewer = params.reviewerDeviceId === void 0 || matchesOperatorApprovalReviewerBinding(record, params.reviewerDeviceId);
		if (matchesAudience && matchesReviewer) {
			records.push(record);
			if (records.length === resultLimit) break;
		}
	}
	return {
		records,
		corrupt
	};
}
function listPendingOperatorApprovalsInDatabase(params = {}) {
	return runOpenClawStateWriteTransaction((database) => {
		const nowMs = params.nowMs ?? Date.now();
		const { records, corrupt } = readPendingOperatorApprovalsInDatabase({
			...params,
			nowMs
		}, database.db);
		for (const row of corrupt) denyCorruptPendingRow({
			database,
			nowMs,
			...row
		});
		return records;
	}, params.databaseOptions);
}
//#endregion
//#region src/gateway/operator-approval-store.transitions.worker.ts
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
		const stateDb = getNodeSqliteKysely(database.db);
		row = executeSqliteQuerySync(database.db, stateDb.updateTable("operator_approvals").set(operatorApprovalTerminalFields(params.decision === "deny" ? "denied" : "allowed", "user", auditTimestampMs, params.decision, {
			kind: params.resolver.kind,
			id: resolverId
		})).where("approval_id", "=", id).returningAll()).rows[0];
		record = requireDecodedRecord(row);
		operatorApprovalPublication.stagePostimages(database.db, [row]);
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
		const stateDb = getNodeSqliteKysely(database.db);
		const terminalRow = executeSqliteQuerySync(database.db, stateDb.updateTable("operator_approvals").set(operatorApprovalTerminalFields(params.status ?? "denied", params.reason, auditTimestampMs, "deny", {
			kind: params.resolver.kind,
			id: normalizeNullableString(params.resolver.id)
		})).where("approval_id", "=", id).returningAll()).rows[0];
		operatorApprovalPublication.stagePostimages(database.db, [terminalRow]);
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
		const terminalFields = operatorApprovalTerminalFields("expired", "timeout", nowMs);
		const result = executeSqliteQuerySync(database.db, stateDb.updateTable("operator_approvals").set(terminalFields).where("status", "=", "pending").where("expires_at_ms", "<=", nowMs).returningAll());
		operatorApprovalPublication.stagePostimages(database.db, result.rows);
		return {
			affected: result.rows.length,
			records: result.rows.toSorted((a, b) => a.expires_at_ms - b.expires_at_ms || (a.approval_id < b.approval_id ? -1 : a.approval_id > b.approval_id ? 1 : 0)).map((row) => decodeOperatorApprovalRow(row)).filter((record) => record !== null)
		};
	}, params.databaseOptions);
}
function recoverOperatorApprovalsInDatabase(params) {
	const runtimeEpoch = requireString(params.runtimeEpoch, "operator approval runtime epoch");
	const { database } = params;
	const nowMs = params.nowMs ?? Date.now();
	const stateDb = getNodeSqliteKysely(database.db);
	const orphanRows = executeSqliteQuerySync(database.db, stateDb.selectFrom("operator_approvals").selectAll().where("status", "=", "pending").where("runtime_epoch", "!=", runtimeEpoch).orderBy("created_at_ms", "asc").orderBy("approval_id", "asc")).rows;
	let affected = 0;
	const terminalRows = [];
	for (const row of orphanRows) {
		const terminalFields = operatorApprovalTerminalFields("cancelled", "gateway-restart", clampAuditTimestamp(nowMs, row.created_at_ms));
		const result = executeSqliteQuerySync(database.db, stateDb.updateTable("operator_approvals").set(terminalFields).where("approval_id", "=", row.approval_id).where("status", "=", "pending"));
		const rowAffected = Number(result.numAffectedRows ?? 0n);
		affected += rowAffected;
		if (rowAffected === 1) terminalRows.push({
			...row,
			...terminalFields
		});
	}
	operatorApprovalPublication.stagePostimages(database.db, terminalRows);
	const prunedRows = executeSqliteQuerySync(database.db, stateDb.deleteFrom("operator_approvals").where("status", "!=", "pending").where("resolved_at_ms", "is not", null).where("resolved_at_ms", "<=", nowMs - OPERATOR_APPROVAL_TERMINAL_RETENTION_MS).returning("approval_id")).rows;
	operatorApprovalPublication.stageDeletions(database.db, prunedRows.map((row) => row.approval_id));
	return {
		affected,
		pruned: prunedRows.length,
		records: terminalRows.map((row) => decodeOperatorApprovalRow(row)).filter((record) => record !== null)
	};
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
		const stateDb = getNodeSqliteKysely(database.db);
		row = executeSqliteQuerySync(database.db, stateDb.updateTable("operator_approvals").set({
			consumed_at_ms: auditTimestampMs,
			consumed_by: consumerId,
			updated_at_ms: auditTimestampMs
		}).where("approval_id", "=", id).returningAll()).rows[0];
		record = requireDecodedRecord(row);
		operatorApprovalPublication.stagePostimages(database.db, [row]);
		return {
			outcome: "consumed",
			record
		};
	}, params.databaseOptions);
}
//#endregion
//#region src/gateway/operator-approval-store.worker.ts
function transact(input, context, apply, receiptOf) {
	const options = {
		...context.stateOptions(),
		database: context.open()
	};
	return runOpenClawStateWriteTransaction((database) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const approval = operatorApprovalPublication.capture(database.db, () => operatorStandingGrantPublication.capture(database.db, () => execApprovalsPublication.capture(database.db, () => apply({
			...input,
			databaseOptions: {
				...options,
				database
			}
		}))));
		const standing = approval.result;
		const exec = standing.result;
		const result = exec.result;
		const receipt = {
			...receiptOf?.(result),
			approvalFacts: operatorApprovalPublication.bound(approval.receipt),
			standingGrantFacts: operatorStandingGrantPublication.bound(standing.receipt),
			execFacts: execApprovalsPublication.bound(exec.receipt)
		};
		const changed = approval.receipt.facts.size + standing.receipt.facts.size + exec.receipt.facts.size > 0;
		deferSqliteWorkerCommitReceipt(database.db, receipt, changed || receipt.resolutionKey || receipt.grantUse ? "commit" : "settlement");
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, options);
}
const operatorApprovalOperations = {
	"operatorApprovals.recoverStartup": (input, context) => transact(input, context, (params) => recoverOperatorApprovalsInDatabase({
		...params,
		database: params.databaseOptions.database
	})),
	"operatorApprovals.insert": (input, context) => transact(input, context, insertOperatorApprovalInDatabase),
	"operatorApprovals.get": (input, context) => transact(input, context, getOperatorApprovalDetailedInDatabase),
	"operatorApprovals.pending": (input, context) => transact(input, context, listPendingOperatorApprovalsInDatabase),
	"operatorApprovals.resolve": (input, context) => transact(input, context, resolveOperatorApprovalInDatabase, (result) => result.outcome === "resolved" ? {
		type: "operatorApprovals.resolve",
		resolutionKey: getOperatorApprovalResolutionKey(result.record)
	} : void 0),
	"operatorApprovals.deny": (input, context) => transact(input, context, forceDenyOperatorApprovalInDatabase),
	"operatorApprovals.expire": (input, context) => transact(input, context, expireDueOperatorApprovalsInDatabase),
	"operatorApprovals.consume": (input, context) => transact(input, context, consumeOperatorApprovalAllowOnceInDatabase),
	"operatorApprovals.consumeCronGrant": (input, context) => transact(input, context, consumeCronStandingGrantInDatabase, (result) => result.outcome === "consumed" ? { grantUse: result.grant } : void 0),
	"operatorApprovals.revokeCronGrant": (input, context) => transact(input, context, revokeCronStandingGrantInDatabase)
};
//#endregion
export { operatorApprovalOperations };
