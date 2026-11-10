import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as createStateDomainPublication } from "./state-domain-publication-CEKqcWHX.mjs";
//#region src/gateway/operator-approval-store.publication.ts
const operatorApprovalPublication = createStateDomainPublication({
	domain: "operator-approvals",
	keyOf: (row) => row.approval_id,
	isValue: (value) => isRecord(value) && [
		"approval_id",
		"resolution_ref",
		"kind",
		"status",
		"presentation_json",
		"reviewer_device_ids_json",
		"audience_session_keys_json",
		"runtime_epoch"
	].every((key) => typeof value[key] === "string") && [
		"requested_by_device_id",
		"requested_by_client_id",
		"source_agent_id",
		"source_session_key",
		"source_session_id",
		"source_run_id",
		"source_tool_call_id",
		"source_tool_name",
		"decision",
		"terminal_reason",
		"resolver_kind",
		"resolver_id",
		"consumed_by"
	].every((key) => value[key] === null || typeof value[key] === "string") && [
		"created_at_ms",
		"expires_at_ms",
		"updated_at_ms",
		"requested_by_device_token_auth"
	].every((key) => typeof value[key] === "number") && ["resolved_at_ms", "consumed_at_ms"].every((key) => value[key] === null || typeof value[key] === "number")
});
const operatorStandingGrantPublication = createStateDomainPublication({
	domain: "operator-standing-grants",
	keyOf: (row) => row.grant_id,
	isValue: (value) => isRecord(value) && [
		"grant_id",
		"minted_by_approval_id",
		"agent_id",
		"cron_job_id",
		"job_config_revision",
		"operation_binding"
	].every((key) => typeof value[key] === "string") && ["created_at_ms", "use_count"].every((key) => typeof value[key] === "number") && [
		"expires_at_ms",
		"revoked_at_ms",
		"last_used_at_ms"
	].every((key) => value[key] === null || typeof value[key] === "number") && (value.revoked_by === null || typeof value.revoked_by === "string")
});
//#endregion
export { operatorStandingGrantPublication as n, operatorApprovalPublication as t };
