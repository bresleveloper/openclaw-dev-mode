import { a as loadOrCreateProcessDeviceIdentity } from "./device-identity-B_zMrBd6.mjs";
import { u as recordSessionGoalChanged } from "./session-state-events-CMg59EpB.mjs";
import { r as emitSessionsChanged } from "./session-change-event-DF8JnIsM.mjs";
import { createHmac } from "node:crypto";
//#region src/gateway/server-methods/session-goal-request.ts
/** Stable, keyed receipts do not retain another copy or an offline digest of prompt material. */
function fingerprintSessionGoalRequest(value) {
	const identity = loadOrCreateProcessDeviceIdentity();
	const canonical = JSON.stringify(value, (_key, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).toSorted(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) : item);
	return createHmac("sha256", identity.privateKeyPem).update("openclaw.session-goal.v1\0").update(canonical).digest("hex");
}
//#endregion
//#region src/gateway/server-methods/session-goal-change.ts
/** Publish a committed Goal without turning a notification failure into a mutation failure. */
async function publishCommittedSessionGoalChange(context, change) {
	try {
		const goalChanged = recordSessionGoalChanged(change);
		try {
			emitSessionsChanged(context, {
				sessionKey: change.sessionKey,
				agentId: change.agentId,
				reason: "goal"
			});
		} finally {
			await goalChanged;
		}
	} catch (error) {
		try {
			context.logGateway.warn(`Committed Goal notification failed: ${String(error)}`);
		} catch {}
	}
}
//#endregion
export { fingerprintSessionGoalRequest as n, publishCommittedSessionGoalChange as t };
