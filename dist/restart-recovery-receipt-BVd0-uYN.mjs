import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-0gTJAhVB.mjs";
import { a as hasRestartRecoveryTerminalRun, l as normalizeRestartRecoveryTerminalRunIds, r as hasActiveRestartRecoverySourceClaim } from "./restart-recovery-state-CVOwSXMV.mjs";
//#region src/config/sessions/restart-recovery-receipt.ts
function hasActiveClaim(entry, scope) {
	return entry.sessionId === scope.sessionId && hasActiveRestartRecoverySourceClaim(entry, scope.sourceTurnId);
}
function hasExactDeliveryClaim(entry, scope) {
	return hasActiveClaim(entry, scope) && entry.restartRecoveryDeliveryToolCallId === scope.toolCallId;
}
function hasClaimlessLiveDeliveryState(entry, scope) {
	return entry.sessionId === scope.sessionId && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === void 0 && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === void 0 && entry.restartRecoveryDeliveryReceiptState === void 0 && normalizeOptionalString(entry.restartRecoveryDeliveryToolCallId) === void 0;
}
/**
* Pure decision mirror of `beginRestartRecoveryTerminalDelivery`: the
* disposition a terminal source-reply send on `scope.sourceTurnId` resolves
* to against the given session entry. The send path and the steering fence
* classify every entry through this single decision surface so they can
* never drift apart.
*/
function resolveRestartRecoveryTerminalDeliveryDisposition(entry, scope) {
	if (entry) {
		if (entry.sessionId === scope.sessionId && hasRestartRecoveryTerminalRun(entry, scope.sourceTurnId)) return "already-delivered";
		if (entry.sessionId === scope.sessionId && hasClaimlessLiveDeliveryState(entry, scope)) return "not-applicable";
	}
	if (!entry || entry.sessionId !== scope.sessionId || !hasActiveClaim(entry, scope)) return "stale";
	if (entry.restartRecoveryDeliveryReceiptState || entry.restartRecoveryDeliveryToolCallId) return entry.restartRecoveryDeliveryReceiptState === "delivered-terminal" ? "already-delivered" : "delivery-ambiguous";
	return "startable";
}
/**
* True when the session's active run can no longer own another terminal
* source-reply send: it already holds a delivery receipt (terminal-pending or
* delivered-terminal), an unresolved terminal tool-call id, a terminal-source
* tombstone for the exact active source turn after claim cleanup, or a stale
* claim. This is the fail-closed classification of
* `beginRestartRecoveryTerminalDelivery` (already-delivered /
* delivery-ambiguous / stale) narrowed to the entry the fence can observe, so
* steering never accepts an inbound into a turn whose terminal send would be
* refused. Callers must supply the active source-turn identity: terminal run
* ids are accumulated session history, so a tombstone may only fail-close the
* fence when it belongs to the target source turn itself — except an unknown
* (empty) source identity, which fail-closes on any retained tombstone.
*/
function isRestartRecoveryTerminalDeliveryFailClosed(entry, sessionId, sourceTurnId) {
	if (!entry) return false;
	if (entry.restartRecoveryDeliveryReceiptState || entry.restartRecoveryDeliveryToolCallId) return true;
	const normalizedSourceTurnId = normalizeOptionalString(sourceTurnId) ?? "";
	const disposition = resolveRestartRecoveryTerminalDeliveryDisposition(entry, {
		sessionId,
		sourceTurnId: normalizedSourceTurnId
	});
	if (disposition === "not-applicable") {
		if (normalizedSourceTurnId === "" && (normalizeRestartRecoveryTerminalRunIds(entry.restartRecoveryTerminalRunIds)?.length ?? 0) > 0) return true;
		return hasRestartRecoveryTerminalRun(entry, normalizedSourceTurnId);
	}
	return disposition === "already-delivered" || disposition === "delivery-ambiguous" || disposition === "stale";
}
function loadCurrent(scope) {
	return loadSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath,
		readConsistency: "latest"
	});
}
/**
* Persists ambiguity before a terminal external send is allowed to start.
* Arms the receipt only when the full disposition is "startable", so the
* fail-closed classification stays shared with the steering fence.
*/
async function beginRestartRecoveryTerminalDelivery(scope) {
	let started = false;
	const updated = await updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (resolveRestartRecoveryTerminalDeliveryDisposition(entry, scope) !== "startable") return null;
		started = true;
		return {
			restartRecoveryDeliveryReceiptState: "terminal-pending",
			restartRecoveryDeliveryToolCallId: scope.toolCallId,
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	if (started && updated !== null && hasExactDeliveryClaim(updated, scope) && updated.restartRecoveryDeliveryReceiptState === "terminal-pending") return "started";
	const disposition = resolveRestartRecoveryTerminalDeliveryDisposition(loadCurrent(scope), scope);
	if (disposition === "startable") throw new Error("failed to persist terminal delivery intent");
	if (disposition === "not-applicable") return "not-applicable";
	return disposition;
}
/** Resolves a pre-send ambiguity only after the provider confirms delivery. */
async function completeRestartRecoveryTerminalDelivery(scope) {
	const updated = await updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (!hasExactDeliveryClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState !== "terminal-pending") return null;
		return {
			restartRecoveryDeliveryReceiptState: "delivered-terminal",
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	if (updated !== null && hasExactDeliveryClaim(updated, scope) && updated.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "recorded";
	const current = loadCurrent(scope);
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (hasExactDeliveryClaim(current, scope) && current.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "recorded";
	throw new Error("failed to persist terminal delivery completion");
}
/** Clears the pre-send intent only when the provider proves no delivery occurred. */
async function cancelRestartRecoveryTerminalDelivery(scope) {
	const updated = await updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (!hasExactDeliveryClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState !== "terminal-pending") return null;
		return {
			restartRecoveryDeliveryReceiptState: void 0,
			restartRecoveryDeliveryToolCallId: void 0,
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	if (updated !== null && hasActiveClaim(updated, scope) && !updated.restartRecoveryDeliveryReceiptState && !updated.restartRecoveryDeliveryToolCallId) return "cleared";
	const current = loadCurrent(scope);
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (!current.restartRecoveryDeliveryReceiptState && !current.restartRecoveryDeliveryToolCallId) return "cleared";
	if (hasExactDeliveryClaim(current, scope) && current.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "stale";
	throw new Error("failed to clear terminal delivery intent");
}
//#endregion
export { isRestartRecoveryTerminalDeliveryFailClosed as i, cancelRestartRecoveryTerminalDelivery as n, completeRestartRecoveryTerminalDelivery as r, beginRestartRecoveryTerminalDelivery as t };
