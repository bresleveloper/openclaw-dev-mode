import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
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
	const settleBatch = params.settleBatch;
	if (settleBatch && (!settleBatch.isCurrent() || settleBatch.sourceSessionKeys[0] !== sourceSessionKey || settleBatch.sourceSessionKeys.some((key) => !key.trim()))) return;
	return {
		sourceSessionKey,
		...sourceSessionId ? { sourceSessionId } : {},
		targetSessionKey,
		targetSessionId,
		idempotencyKey,
		...settleBatch ? { settleBatch: {
			...settleBatch,
			sourceSessionKeys: [...settleBatch.sourceSessionKeys]
		} } : {}
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
	const registration = normalizeRegistration(params);
	const provider = normalizeOptionalString(params.provider)?.toLowerCase();
	const model = normalizeOptionalString(params.model);
	if (!handoffId || !registration || !provider || !model) return;
	const { sourceSessionKey, sourceSessionId, targetSessionKey, targetSessionId, idempotencyKey } = registration;
	pruneExpired(params.nowMs ?? Date.now());
	const entry = handoffs.get(handoffId);
	if (!entry || params.sourceTool !== (entry.settleBatch ? "subagent_settle" : "subagent_announce") || entry.settleBatch?.isCurrent() === false || (entry.settleBatch ? !entry.settleBatch.sourceSessionKeys.includes(sourceSessionKey) : entry.sourceSessionKey !== sourceSessionKey) || entry.sourceSessionId !== sourceSessionId || entry.targetSessionKey !== targetSessionKey || entry.targetSessionId !== targetSessionId || entry.idempotencyKey !== idempotencyKey) return;
	handoffs.delete(handoffId);
	return {
		kind: "subagent-completion",
		sourceSessionKey,
		...sourceSessionId ? { sourceSessionId } : {},
		targetSessionKey,
		targetSessionId,
		provider,
		model,
		...entry.settleBatch ? { settleBatch: entry.settleBatch } : {}
	};
}
//#endregion
export { consumeSubagentCompletionToolHandoff as n, registerSubagentCompletionToolHandoff as r, cancelSubagentCompletionToolHandoff as t };
