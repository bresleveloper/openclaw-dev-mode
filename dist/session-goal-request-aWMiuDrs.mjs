import { i as loadOrCreateProcessDeviceIdentityAsync } from "./device-identity-async-BBs_AIYT.mjs";
import { createHmac } from "node:crypto";
//#region src/gateway/server-methods/session-goal-request.ts
/** Stable, keyed receipts do not retain another copy or an offline digest of prompt material. */
async function fingerprintSessionGoalRequest(value) {
	const canonical = JSON.stringify(value, (_key, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).toSorted(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) : item);
	const identity = await loadOrCreateProcessDeviceIdentityAsync();
	return createHmac("sha256", identity.privateKeyPem).update("openclaw.session-goal.v1\0").update(canonical).digest("hex");
}
//#endregion
export { fingerprintSessionGoalRequest as t };
