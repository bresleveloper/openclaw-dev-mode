import "./net-BOKtNTf8.js";
import "./auth-CrLWKxN2.js";
import "./client-CE2rtDfj.js";
import "./src-CToKmqGn.js";
import "./operator-approvals-client-DpFi-Ifv.js";
import "./gateway-rpc-X6FYVl58.js";
import "./hosted-plugin-surface-url-gF09az3Y.js";
import "./plugin-node-capability-CQtFV9Fn.js";
import "./node-command-policy-CDDCPmwi.js";
import "./nodes.helpers-BeMwLOux.js";
import "./startup-auth-CZok9CS6.js";
//#region src/gateway/channel-status-patches.ts
/** Creates a connected-channel status patch with matching connection/event timestamps. */
function createConnectedChannelStatusPatch(at = Date.now()) {
	return {
		connected: true,
		lastConnectedAt: at,
		lastEventAt: at
	};
}
/** Creates a transport-activity patch for health/activity monitors. */
function createTransportActivityStatusPatch(at = Date.now()) {
	return { lastTransportActivityAt: at };
}
//#endregion
//#region src/plugin-sdk/gateway-runtime.ts
async function resolveAdvertisedLanHost() {
	return await (await import("./advertised-lan-host-B4u-KD1P.js")).resolveAdvertisedLanHost();
}
//#endregion
export { createConnectedChannelStatusPatch as n, createTransportActivityStatusPatch as r, resolveAdvertisedLanHost as t };
