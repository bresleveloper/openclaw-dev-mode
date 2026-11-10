import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { s as resolveRestartRecoveryTerminalDeliveryDisposition } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { D as normalizeRestartRecoveryTerminalRunIds } from "./store-maintenance-BqMt1Twc.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as withSessionActor, r as runSessionActorCommand } from "./session-accessor.sqlite-transcript-turn-CoODj9qI.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
//#region src/config/sessions/restart-recovery-receipt.ts
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
function captureCurrent(input) {
	const memory = captureSessionActorStorageOwner(input, receiptAuthority);
	return {
		scope: {
			...input,
			storePath: memory?.path ?? path.resolve(input.storePath),
			env: captureSessionTranscriptStorageEnvironment(memory ? { OPENCLAW_STATE_DIR: path.resolve(memory.path, "../../../..") } : process.env)
		},
		absent: memory !== void 0 && !memory.owner && !memory.binding
	};
}
/** Persists ambiguity before a terminal external send is allowed to start. */
async function beginRestartRecoveryTerminalDelivery(input) {
	const current = captureCurrent(input);
	const scope = current.scope;
	const { sessionId, sourceTurnId, toolCallId } = scope;
	if (current.absent) return "stale";
	const result = await withSessionActor(scope, receiptLifetime, async (actor) => {
		const value = terminalValue(await runSessionActorCommand(actor, receiptAuthority, (snapshot) => actor.deliveryPending({
			commandId: randomUUID(),
			phaseId: randomUUID(),
			expected: snapshot?.version,
			claim: {
				sessionId,
				sourceTurnId,
				toolCallId
			},
			updatedAt: Date.now()
		}, receiptAuthority)));
		if (!value) return "stale";
		return value.disposition;
	});
	if (result !== void 0) return result;
	return "stale";
}
const receiptLifetime = {
	assertCurrent() {},
	assertReadable() {}
};
const receiptAuthority = {
	assertCurrent() {},
	authorize() {}
};
function terminalValue(outcome) {
	if (outcome.kind === "committed") {
		if (outcome.failure) throw new Error(outcome.failure.message);
		return outcome.value;
	}
	if (outcome.kind === "rolled-back" && outcome.reason === "stale-state") return;
	throw new SqliteWorkerError(outcome.error.message, outcome.kind === "unknown" ? "outcome-unknown" : "unavailable");
}
async function updatePendingTerminalDelivery(scope, outcome) {
	const { sessionId, sourceTurnId, toolCallId } = scope;
	const result = await withSessionActor(scope, receiptLifetime, async (actor) => {
		const value = terminalValue(await runSessionActorCommand(actor, receiptAuthority, (snapshot) => actor.deliverySettled({
			commandId: randomUUID(),
			phaseId: randomUUID(),
			expected: snapshot?.version,
			restart: {
				claim: {
					sessionId,
					sourceTurnId,
					toolCallId
				},
				outcome,
				updatedAt: Date.now()
			}
		}, receiptAuthority)));
		if (!value) return "stale";
		if (!("disposition" in value)) throw new Error("Restart delivery returned another settlement");
		return value.disposition;
	});
	if (result !== void 0) return result;
	return "stale";
}
/** Resolves a pre-send ambiguity only after the provider confirms delivery. */
async function completeRestartRecoveryTerminalDelivery(input) {
	const source = captureCurrent(input);
	if (source.absent) return "stale";
	const disposition = await updatePendingTerminalDelivery(source.scope, "confirmed");
	return disposition === "recorded" ? disposition : "stale";
}
/** Clears the pre-send intent only when the provider proves no delivery occurred. */
async function cancelRestartRecoveryTerminalDelivery(input) {
	const source = captureCurrent(input);
	if (source.absent) return "stale";
	const disposition = await updatePendingTerminalDelivery(source.scope, "not-sent");
	return disposition === "cleared" ? disposition : "stale";
}
//#endregion
export { resolveRestartRecoverySteeringBlockReason as i, cancelRestartRecoveryTerminalDelivery as n, completeRestartRecoveryTerminalDelivery as r, beginRestartRecoveryTerminalDelivery as t };
