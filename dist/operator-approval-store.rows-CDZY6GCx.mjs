import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { n as isApprovalResolutionRef, t as buildApprovalResolutionRef } from "./approval-resolution-ref-DRRWcLCw.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.mjs";
import { r as validateApprovalPresentation } from "./approval-result-validators-BRCs0Xom.mjs";
//#region src/gateway/operator-approval-store.rows.ts
const OPERATOR_APPROVAL_TERMINAL_RETENTION_MS = 2592e6;
const OPERATOR_APPROVAL_MAX_LIST_LIMIT = 1001;
var OperatorApprovalHistoryCursorError = class extends Error {
	constructor() {
		super("invalid operator approval history cursor");
		this.name = "OperatorApprovalHistoryCursorError";
	}
};
/** Match an observed terminal row to this operation's separately retained commit receipt. */
function getOperatorApprovalResolutionKey(record) {
	return JSON.stringify([
		record.id,
		record.kind,
		record.runtimeEpoch,
		record.createdAtMs,
		record.resolvedAtMs,
		record.status,
		record.decision,
		record.terminalReason,
		record.resolver?.kind ?? null,
		record.resolver?.id ?? null
	]);
}
function parseOperatorApprovalKind(value) {
	return value === "exec" || value === "plugin" || value === "system-agent" ? value : null;
}
const OPERATOR_APPROVAL_EXECUTION_IDENTITY_SCHEMA_SQL = getOpenClawStateFeatureSchemaSql("operator_approval_execution_identities");
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
function matchesExpectedApprovalOwner(params) {
	return (params.expectedKind === void 0 || params.row.kind === params.expectedKind) && (params.runtimeEpoch === void 0 || params.row.runtime_epoch === params.runtimeEpoch);
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
//#endregion
export { clampAuditTimestamp as a, getOperatorApprovalResolutionKey as c, matchesExpectedApprovalOwner as d, normalizeExecutionIdentityBinding as f, stringifyPresentation as g, requireString as h, OperatorApprovalHistoryCursorError as i, inputMatchesExistingRow as l, requireDecodedRecord as m, OPERATOR_APPROVAL_MAX_LIST_LIMIT as n, decodeOperatorApprovalHistoryCursor as o, requireApprovalId as p, OPERATOR_APPROVAL_TERMINAL_RETENTION_MS as r, decodeOperatorApprovalRow as s, OPERATOR_APPROVAL_EXECUTION_IDENTITY_SCHEMA_SQL as t, isValidTimestamp as u };
