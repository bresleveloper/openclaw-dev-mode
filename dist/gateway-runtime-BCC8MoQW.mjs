import "./gateway-rpc-DXO3PHhc.mjs";
import "./net-DU4aWKLv.mjs";
import "./auth-CRxiLJL8.mjs";
import "./call-C_MP4_Gs.mjs";
import "./client-CpsABkfT.mjs";
import "./node-command-policy-CnGfXM76.mjs";
import "./node-resolve-Cy3jnd18.mjs";
import "./operator-approvals-client-rt3rlZL2.mjs";
import "./hosted-plugin-surface-url-CXCFzZYR.mjs";
import "./plugin-node-capability-BUbmEXwy.mjs";
import "./startup-auth-Cnh-psTn.mjs";
import "./channel-status-patches-BS8oeT90.mjs";
//#region src/plugin-sdk/gateway-runtime.ts
async function resolveAdvertisedLanHost() {
	return await (await import("./advertised-lan-host-X9NYMS65.mjs")).resolveAdvertisedLanHostCore();
}
//#endregion
export { resolveAdvertisedLanHost as t };
