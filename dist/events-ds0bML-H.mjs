import { a as READ_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
//#region src/gateway/events.ts
const GATEWAY_EVENT_DEVICE_PAIR_CHANGED = "device.pair.changed";
const GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED = "node.runnerInventory.changed";
const GATEWAY_EVENT_UPDATE_AVAILABLE = "update.available";
/** Active update ledger progress; detailed records remain admin-scoped. */
const GATEWAY_EVENT_UPDATE_RUN_CHANGED = "update.run.changed";
function canReadDetailedUpdateMetadata(role, scopes) {
	return roleScopesAllow({
		role,
		requestedScopes: [READ_SCOPE],
		allowedScopes: scopes
	});
}
/** Projects update availability to the pre-detail wire shape for clients without read access. */
function projectUpdateAvailable(updateAvailable, includeDetails) {
	if (!updateAvailable || includeDetails) return updateAvailable;
	return {
		currentVersion: updateAvailable.currentVersion,
		latestVersion: updateAvailable.latestVersion,
		channel: updateAvailable.channel
	};
}
//#endregion
export { canReadDetailedUpdateMetadata as a, GATEWAY_EVENT_UPDATE_RUN_CHANGED as i, GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED as n, projectUpdateAvailable as o, GATEWAY_EVENT_UPDATE_AVAILABLE as r, GATEWAY_EVENT_DEVICE_PAIR_CHANGED as t };
