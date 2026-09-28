import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/subagent-completion-tool-handoff.ts
const SUBAGENT_COMPLETION_TOOL_HANDOFF_TTL_MS = 3e5;
const handoffs = resolveGlobalMap(Symbol.for("openclaw.subagentCompletionToolHandoffs"), "close-and-restart");
function normalizeRegistration(params) {
	const sourceSessionKey = normalizeOptionalString(params.sourceSessionKey);
	const sourceSessionId = normalizeOptionalString(params.sourceSessionId);
	const targetSessionKey = normalizeOptionalString(params.targetSessionKey);
	const targetSessionId = normalizeOptionalString(params.targetSessionId);
	const idempotencyKey = normalizeOptionalString(params.idempotencyKey);
	if (!sourceSessionKey || !targetSessionKey || !targetSessionId || !idempotencyKey) return;
	return {
		sourceSessionKey,
		...sourceSessionId ? { sourceSessionId } : {},
		targetSessionKey,
		targetSessionId,
		idempotencyKey
	};
}
function pruneExpired(nowMs) {
	for (const [handoffId, entry] of handoffs) if (!isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })) handoffs.delete(handoffId);
}
/** Register one short-lived capability for the exact completion delivery request. */
function registerSubagentCompletionToolHandoff(params) {
	const normalized = normalizeRegistration(params);
	if (!normalized) return;
	const nowMs = params.nowMs ?? Date.now();
	pruneExpired(nowMs);
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(SUBAGENT_COMPLETION_TOOL_HANDOFF_TTL_MS, { nowMs });
	if (expiresAtMs === void 0) return;
	const handoffId = randomUUID();
	handoffs.set(handoffId, {
		...normalized,
		expiresAtMs
	});
	return handoffId;
}
/** Remove an unconsumed capability after its in-process dispatch finishes or fails. */
function cancelSubagentCompletionToolHandoff(handoffId) {
	const normalized = normalizeOptionalString(handoffId);
	return normalized ? handoffs.delete(normalized) : false;
}
/**
* Consume the capability once and bind it to the model route admitted for this run.
* Mismatches do not burn the capability; only the exact request may consume it.
*/
function consumeSubagentCompletionToolHandoff(params) {
	const handoffId = normalizeOptionalString(params.handoffId);
	const sourceSessionKey = normalizeOptionalString(params.sourceSessionKey);
	const sourceSessionId = normalizeOptionalString(params.sourceSessionId);
	const targetSessionKey = normalizeOptionalString(params.targetSessionKey);
	const targetSessionId = normalizeOptionalString(params.targetSessionId);
	const idempotencyKey = normalizeOptionalString(params.idempotencyKey);
	const provider = normalizeOptionalString(params.provider)?.toLowerCase();
	const model = normalizeOptionalString(params.model);
	if (!handoffId || !sourceSessionKey || !targetSessionKey || !targetSessionId || !idempotencyKey || !provider || !model) return;
	pruneExpired(params.nowMs ?? Date.now());
	const entry = handoffs.get(handoffId);
	if (!entry || entry.sourceSessionKey !== sourceSessionKey || entry.sourceSessionId !== sourceSessionId || entry.targetSessionKey !== targetSessionKey || entry.targetSessionId !== targetSessionId || entry.idempotencyKey !== idempotencyKey) return;
	handoffs.delete(handoffId);
	return {
		kind: "subagent-completion",
		sourceSessionKey,
		...sourceSessionId ? { sourceSessionId } : {},
		targetSessionKey,
		targetSessionId,
		provider,
		model
	};
}
//#endregion
export { consumeSubagentCompletionToolHandoff as n, registerSubagentCompletionToolHandoff as r, cancelSubagentCompletionToolHandoff as t };
