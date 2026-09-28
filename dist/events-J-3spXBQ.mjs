import { a as READ_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
//#region src/gateway/events.ts
/** Event name emitted when the paired-device projection changes. */
const GATEWAY_EVENT_DEVICE_PAIR_CHANGED = "device.pair.changed";
/** Event name emitted when a node's private runner declaration changes. */
const GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED = "node.runnerInventory.changed";
/** Event name emitted when a newer OpenClaw version is available. */
const GATEWAY_EVENT_UPDATE_AVAILABLE = "update.available";
/** Active update ledger progress; detailed records remain admin-scoped. */
const GATEWAY_EVENT_UPDATE_RUN_CHANGED = "update.run.changed";
/** Returns whether this authenticated client may receive detailed update metadata. */
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
