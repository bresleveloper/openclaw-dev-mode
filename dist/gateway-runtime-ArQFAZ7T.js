import "./net-DQvRbvSK.js";
import "./auth-C2Z6iDLc.js";
import "./client-C8-EgcVB.js";
import "./src-CSp7rUPX.js";
import "./operator-approvals-client-CLasR81w.js";
import "./gateway-rpc-U_rAVUBs.js";
import "./hosted-plugin-surface-url-DIYZ_g74.js";
import "./plugin-node-capability-CQtFV9Fn.js";
import "./node-command-policy-CsqLpOVt.js";
import "./nodes.helpers-DEkKdBJ_.js";
import "./startup-auth-DmC5VjK0.js";
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
export { createTransportActivityStatusPatch as n, createConnectedChannelStatusPatch as t };
