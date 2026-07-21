import "./media-runtime-DIRKCpVy.js";
import "./text-chunking-D2ymAM_S.js";
import { t as createPluginRuntimeStore } from "./runtime-store-uAKGMqTs.js";
import "./channel-outbound-BopAOIGF.js";
import "./outbound-media-CUOQVZUK.js";
import "./ssrf-runtime-CyXpgbLM.js";
import "./dangerous-name-runtime-cJriWyuh.js";
import "./channel-status-D0V3ybJh.js";
import "./bundled-channel-config-schema-CkfMA6sO.js";
import "./channel-config-primitives-C06GtQX7.js";
import "./channel-actions-BCdRlnH7.js";
import "./channel-inbound-1OHg_l3i.js";
import "./channel-feedback-ChYFAgPX.js";
import "./channel-pairing-PoA7hMtC.js";
import "./webhook-request-guards-6tg5xzrX.js";
import "./webhook-ingress-AkkdLLGY.js";
import "./webhook-targets-BimOdvqE.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
