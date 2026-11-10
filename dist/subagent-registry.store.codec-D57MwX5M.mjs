import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { _ as normalizeSubagentRunState } from "./subagent-session-read-scope-7jPlY84h.mjs";
//#region src/agents/subagents/registry/subagent-registry.store.codec.ts
const EXECUTION_STATUSES = new Set("queued running interrupted terminal".split(" "));
const DELIVERY_STATUSES = new Set("not_required pending in_progress delivered failed suspended discarded".split(" "));
function hasStateStatus(value, statuses) {
	return isRecord(value) && typeof value.status === "string" && statuses.has(value.status);
}
function isCanonicalSubagentRunRecord(value) {
	return isRecord(value) && hasStateStatus(value.execution, EXECUTION_STATUSES) && isRecord(value.completion) && typeof value.completion.required === "boolean" && hasStateStatus(value.delivery, DELIVERY_STATUSES) && !("handoffLeaseId" in value.delivery || "handoffLeasedAt" in value.delivery || "handoffInjectedAt" in value.delivery);
}
/** Rehydrates one sqlite row into the normalized subagent run record shape. */
function rowToSubagentRunRecord(row) {
	const stored = row.payload_json ? safeParseJson(row.payload_json) : void 0;
	const payload = isRecord(stored) && isRecord(stored.parentCompletion) && stored.parentCompletion.completionTarget === "parent" ? stored.parentCompletion : stored;
	if (!isCanonicalSubagentRunRecord(payload)) return null;
	payload.runId = row.run_id;
	payload.childSessionKey = row.child_session_key;
	payload.requesterSessionKey = row.requester_session_key;
	payload.requesterStorePath = row.requester_store_path ?? void 0;
	payload.controllerStorePath = row.controller_store_path ?? void 0;
	const controllerSessionKey = row.controller_session_key?.trim();
	if (controllerSessionKey) payload.controllerSessionKey = controllerSessionKey;
	else delete payload.controllerSessionKey;
	if (payload.requesterOrigin) payload.requesterOrigin = normalizeDeliveryContext(payload.requesterOrigin);
	if (payload.expectsCompletionMessage === false) payload.delivery.status = "not_required";
	const record = normalizeSubagentRunState(payload);
	if (!record.runId || !record.childSessionKey || !record.requesterSessionKey) return null;
	return record;
}
/** Canonically serializes a run before an outer transaction acquires the write lock. */
function bindSubagentRunRecord(entry) {
	const normalized = normalizeSubagentRunState(structuredClone(entry));
	if (!isCanonicalSubagentRunRecord(normalized)) throw new Error("subagent run is missing canonical nested state");
	return {
		run_id: normalized.runId,
		child_session_key: normalized.childSessionKey,
		controller_session_key: normalized.controllerSessionKey?.trim() || null,
		requester_session_key: normalized.requesterSessionKey,
		requester_store_path: normalized.requesterStorePath ?? null,
		controller_store_path: normalized.controllerStorePath ?? null,
		created_at: normalized.createdAt,
		payload_json: JSON.stringify(normalized.completionTarget === "parent" ? { parentCompletion: normalized } : normalized)
	};
}
function parseSubagentRegistryWriteReceipt(value, write) {
	if (!isRecord(value) || value.writeId !== write.writeId) throw new Error("Registry acknowledgement identifies another write");
	if (!Array.isArray(value.notices)) throw new Error("Registry acknowledgement is missing commit facts");
	const notices = value.notices.map((notice) => {
		if (!isRecord(notice) || typeof notice.watcherSessionKey !== "string" || notice.watcherStorePath !== null && typeof notice.watcherStorePath !== "string" || typeof notice.targetSessionKey !== "string" || typeof notice.lastSeenSequence !== "number" || typeof notice.queueOnly !== "boolean") throw new Error("Registry acknowledgement has an invalid terminal notice");
		return {
			watcherSessionKey: notice.watcherSessionKey,
			watcherStorePath: notice.watcherStorePath,
			targetSessionKey: notice.targetSessionKey,
			lastSeenSequence: notice.lastSeenSequence,
			queueOnly: notice.queueOnly
		};
	});
	return {
		writeId: write.writeId,
		notices
	};
}
//#endregion
export { rowToSubagentRunRecord as i, isCanonicalSubagentRunRecord as n, parseSubagentRegistryWriteReceipt as r, bindSubagentRunRecord as t };
