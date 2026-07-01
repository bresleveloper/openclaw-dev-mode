import "./media-runtime-BGWQwoXi.js";
import "./text-chunking-nijjGL3g.js";
import { t as createPluginRuntimeStore } from "./runtime-store-uAKGMqTs.js";
import "./channel-outbound-BNKGCEf1.js";
import "./outbound-media-BtSFem1l.js";
import "./ssrf-runtime-CZi-6iMr.js";
import "./dangerous-name-runtime-cJriWyuh.js";
import "./channel-status-CxP0h-5H.js";
import "./bundled-channel-config-schema-CqRzCASC.js";
import "./channel-config-primitives-BgcfcRdI.js";
import "./channel-actions-CdLhqkfP.js";
import "./channel-inbound-Bc91Wbye.js";
import "./channel-feedback-Bo1DW6IF.js";
import "./channel-pairing-BhZI8NmU.js";
import "./webhook-request-guards-DsPJqnE8.js";
import "./webhook-ingress-CW_aYwbA.js";
import "./webhook-targets-DcjmmS1z.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
