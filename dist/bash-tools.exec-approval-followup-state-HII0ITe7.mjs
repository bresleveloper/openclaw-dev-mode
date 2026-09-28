import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/bash-tools.exec-approval-followup-state.ts
/**
* Runtime handoff state for exec approval follow-up turns.
* Stores short-lived elevated defaults so an approved async exec can resume in
* the same session without persisting approval capabilities.
*/
const EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_PREFIX = "exec-approval-followup:";
const EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_NONCE_MARKER = ":nonce:";
const EXEC_APPROVAL_FOLLOWUP_RUNTIME_HANDOFF_TTL_MS = 3e5;
const execApprovalFollowupRuntimeHandoffs = /* @__PURE__ */ new Map();
function cloneExecElevatedDefaults(value) {
	return {
		enabled: value.enabled,
		allowed: value.allowed,
		defaultLevel: value.defaultLevel,
		...value.fullAccessAvailable !== void 0 ? { fullAccessAvailable: value.fullAccessAvailable } : {},
		...value.fullAccessBlockedReason !== void 0 ? { fullAccessBlockedReason: value.fullAccessBlockedReason } : {}
	};
}
function cloneExecApprovalFollowupRuntimeHandoff(value) {
	return {
		kind: value.kind,
		approvalId: value.approvalId,
		sessionKey: value.sessionKey,
		idempotencyKey: value.idempotencyKey,
		...value.bashElevated ? { bashElevated: cloneExecElevatedDefaults(value.bashElevated) } : {},
		...value.resultText !== void 0 ? { resultText: value.resultText } : {}
	};
}
function pruneExpiredExecApprovalFollowupRuntimeHandoffs(nowMs) {
	for (const [handoffId, entry] of execApprovalFollowupRuntimeHandoffs) if (!isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })) execApprovalFollowupRuntimeHandoffs.delete(handoffId);
}
/** Build the idempotency key used for an exec approval follow-up. */
function buildExecApprovalFollowupIdempotencyKey(params) {
	const base = `${EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_PREFIX}${params.approvalId}`;
	const nonce = normalizeOptionalString(params.nonce);
	return nonce ? `${base}${EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_NONCE_MARKER}${nonce}` : base;
}
/** Parse the approval id embedded in a follow-up idempotency key. */
function parseExecApprovalFollowupApprovalId(idempotencyKey) {
	const normalized = normalizeOptionalString(idempotencyKey);
	if (!normalized?.startsWith(EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_PREFIX)) return;
	const body = normalized.slice(23);
	const nonceMarker = body.lastIndexOf(EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_NONCE_MARKER);
	return normalizeOptionalString(nonceMarker >= 0 ? body.slice(0, nonceMarker) : body);
}
/** Register a short-lived exec approval handoff for the next follow-up turn. */
function registerExecApprovalFollowupRuntimeHandoff(params) {
	const approvalId = normalizeOptionalString(params.approvalId);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!approvalId || !sessionKey || !params.bashElevated && params.resultText === void 0) return;
	const nowMs = params.nowMs ?? Date.now();
	pruneExpiredExecApprovalFollowupRuntimeHandoffs(nowMs);
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(EXEC_APPROVAL_FOLLOWUP_RUNTIME_HANDOFF_TTL_MS, { nowMs });
	if (expiresAtMs === void 0) return;
	const handoffId = randomUUID();
	const idempotencyKey = buildExecApprovalFollowupIdempotencyKey({
		approvalId,
		nonce: randomUUID()
	});
	execApprovalFollowupRuntimeHandoffs.set(handoffId, {
		kind: "exec-approval-followup",
		approvalId,
		sessionKey,
		idempotencyKey,
		...params.bashElevated ? { bashElevated: cloneExecElevatedDefaults(params.bashElevated) } : {},
		...params.resultText !== void 0 ? { resultText: params.resultText } : {},
		expiresAtMs
	});
	return {
		handoffId,
		idempotencyKey
	};
}
/** Claim a matching handoff while fallible run setup completes. */
function claimExecApprovalFollowupRuntimeHandoff(params) {
	const handoffId = normalizeOptionalString(params.handoffId);
	const approvalId = normalizeOptionalString(params.approvalId);
	const idempotencyKey = normalizeOptionalString(params.idempotencyKey);
	const claimId = normalizeOptionalString(params.claimId);
	if (!handoffId || !approvalId || !idempotencyKey || !claimId) return;
	const nowMs = params.nowMs ?? Date.now();
	pruneExpiredExecApprovalFollowupRuntimeHandoffs(nowMs);
	const entry = execApprovalFollowupRuntimeHandoffs.get(handoffId);
	if (!entry) return;
	if (!isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })) {
		execApprovalFollowupRuntimeHandoffs.delete(handoffId);
		return;
	}
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (entry.approvalId !== approvalId || entry.idempotencyKey !== idempotencyKey || entry.sessionKey !== sessionKey) return;
	if (entry.claimId && entry.claimId !== claimId) return;
	entry.claimId = claimId;
	return cloneExecApprovalFollowupRuntimeHandoff(entry);
}
/** Consume a claimed handoff at its final privileged use. */
function finalizeExecApprovalFollowupRuntimeHandoff(params) {
	const handoffId = normalizeOptionalString(params.handoffId);
	const claimId = normalizeOptionalString(params.claimId);
	if (!handoffId || !claimId) return false;
	const entry = execApprovalFollowupRuntimeHandoffs.get(handoffId);
	const nowMs = params.nowMs ?? Date.now();
	if (entry && !isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })) {
		execApprovalFollowupRuntimeHandoffs.delete(handoffId);
		return false;
	}
	if (entry?.claimId !== claimId) return false;
	execApprovalFollowupRuntimeHandoffs.delete(handoffId);
	return true;
}
/** Release a claimed handoff when setup fails before dispatch. */
function releaseExecApprovalFollowupRuntimeHandoff(params) {
	const handoffId = normalizeOptionalString(params.handoffId);
	const claimId = normalizeOptionalString(params.claimId);
	if (!handoffId || !claimId) return false;
	const entry = execApprovalFollowupRuntimeHandoffs.get(handoffId);
	if (entry?.claimId !== claimId) return false;
	delete entry.claimId;
	return true;
}
/**
* A persisted exec-approval followup is stale when the session key it targeted
* has since been rebound to a different session id (via `/new` or `/reset`).
* Delivering it would leak the old approval result into the new session, so the
* gateway drops the followup instead of resuming the rebound session.
*/
function isExecApprovalFollowupSessionRebound(params) {
	const expected = normalizeOptionalString(params.expectedSessionId);
	const resolved = normalizeOptionalString(params.resolvedSessionId);
	return Boolean(expected && resolved && expected !== resolved);
}
//#endregion
export { parseExecApprovalFollowupApprovalId as a, isExecApprovalFollowupSessionRebound as i, claimExecApprovalFollowupRuntimeHandoff as n, registerExecApprovalFollowupRuntimeHandoff as o, finalizeExecApprovalFollowupRuntimeHandoff as r, releaseExecApprovalFollowupRuntimeHandoff as s, buildExecApprovalFollowupIdempotencyKey as t };
