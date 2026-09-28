import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/agents/accepted-session-spawn.ts
/** Normalizes accepted child-session spawn results from loose tool payloads. */
const acceptedSpawnsByRun = resolveGlobalSingleton(Symbol.for("openclaw.acceptedSessionSpawnsByRun"), () => /* @__PURE__ */ new WeakMap());
function mergeAcceptedSessionSpawnsForRun(instance, accepted = []) {
	let receipts = acceptedSpawnsByRun.get(instance);
	if (!receipts && accepted.length > 0) {
		receipts = /* @__PURE__ */ new Map();
		acceptedSpawnsByRun.set(instance, receipts);
	}
	for (const spawn of accepted) receipts?.set(spawn.runId, receipts.get(spawn.runId) ?? spawn);
	return receipts ? [...receipts.values()] : [];
}
/** Normalize a tool result that accepted a child session spawn. */
function normalizeAcceptedSessionSpawnResult(result) {
	const details = asOptionalRecord(asOptionalRecord(result)?.details);
	if (!details || details.status !== "accepted") return null;
	const runId = normalizeOptionalString(details.runId);
	const childSessionKey = normalizeOptionalString(details.childSessionKey);
	if (!runId || !childSessionKey) return null;
	return {
		runId,
		childSessionKey,
		expectsCompletionMessage: details.expectsCompletionMessage === true
	};
}
/** Return true when a collection contains at least one accepted child spawn. */
function hasAcceptedSessionSpawn(acceptedSessionSpawns) {
	return Boolean(acceptedSessionSpawns?.length);
}
/** Return true when an accepted child owns the requester's terminal completion. */
function hasCompletionMessageSessionSpawn(acceptedSessionSpawns) {
	return acceptedSessionSpawns?.some((spawn) => spawn.expectsCompletionMessage === true) === true;
}
//#endregion
export { normalizeAcceptedSessionSpawnResult as i, hasCompletionMessageSessionSpawn as n, mergeAcceptedSessionSpawnsForRun as r, hasAcceptedSessionSpawn as t };
