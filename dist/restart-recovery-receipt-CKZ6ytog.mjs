import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as loadSessionEntry } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { c as updateSessionEntry } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { a as hasRestartRecoveryTerminalRun, l as normalizeRestartRecoveryTerminalRunIds, r as hasActiveRestartRecoverySourceClaim } from "./restart-recovery-state-IiHiWzPq.mjs";
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
		if (hasClaimlessLiveDeliveryState(entry, scope)) return "not-applicable";
	}
	if (!entry || !hasActiveClaim(entry, scope)) return "stale";
	if (entry.restartRecoveryDeliveryReceiptState || entry.restartRecoveryDeliveryToolCallId) return entry.restartRecoveryDeliveryReceiptState === "delivered-terminal" ? "already-delivered" : "delivery-ambiguous";
	return "startable";
}
/** Keep steering eligibility aligned with terminal-send ownership, using the exact active source. */
function resolveRestartRecoverySteeringBlockReason(entry, sessionId, sourceTurnId) {
	if (!entry) return;
	if (entry.restartRecoveryDeliveryReceiptState) return entry.restartRecoveryDeliveryReceiptState;
	if (entry.restartRecoveryDeliveryToolCallId) return "unresolved-terminal-tool";
	const normalizedSourceTurnId = normalizeOptionalString(sourceTurnId) ?? "";
	const disposition = resolveRestartRecoveryTerminalDeliveryDisposition(entry, {
		sessionId,
		sourceTurnId: normalizedSourceTurnId
	});
	if (disposition === "not-applicable") {
		if (normalizedSourceTurnId === "" && (normalizeRestartRecoveryTerminalRunIds(entry.restartRecoveryTerminalRunIds)?.length ?? 0) > 0) return "unknown-source-with-terminal-history";
		return;
	}
	return disposition === "already-delivered" || disposition === "delivery-ambiguous" ? disposition : disposition === "stale" ? "stale-claim" : void 0;
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
	return disposition;
}
function updatePendingTerminalDelivery(scope, patch) {
	return updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (!hasExactDeliveryClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState !== "terminal-pending") return null;
		return {
			...patch,
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
}
/** Resolves a pre-send ambiguity only after the provider confirms delivery. */
async function completeRestartRecoveryTerminalDelivery(scope) {
	const updated = await updatePendingTerminalDelivery(scope, { restartRecoveryDeliveryReceiptState: "delivered-terminal" });
	if (updated !== null && hasExactDeliveryClaim(updated, scope) && updated.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "recorded";
	const current = loadCurrent(scope);
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (hasExactDeliveryClaim(current, scope) && current.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "recorded";
	throw new Error("failed to persist terminal delivery completion");
}
/** Clears the pre-send intent only when the provider proves no delivery occurred. */
async function cancelRestartRecoveryTerminalDelivery(scope) {
	const updated = await updatePendingTerminalDelivery(scope, {
		restartRecoveryDeliveryReceiptState: void 0,
		restartRecoveryDeliveryToolCallId: void 0
	});
	if (updated !== null && hasActiveClaim(updated, scope) && !updated.restartRecoveryDeliveryReceiptState && !updated.restartRecoveryDeliveryToolCallId) return "cleared";
	const current = loadCurrent(scope);
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (!current.restartRecoveryDeliveryReceiptState && !current.restartRecoveryDeliveryToolCallId) return "cleared";
	if (hasExactDeliveryClaim(current, scope) && current.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "stale";
	throw new Error("failed to clear terminal delivery intent");
}
//#endregion
export { resolveRestartRecoverySteeringBlockReason as i, cancelRestartRecoveryTerminalDelivery as n, completeRestartRecoveryTerminalDelivery as r, beginRestartRecoveryTerminalDelivery as t };
