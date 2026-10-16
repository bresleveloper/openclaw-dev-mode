import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
import { GROUP_POLICY_BLOCKED_LABEL, resolveAllowlistProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { deliverFormattedTextWithAttachments } from "openclaw/plugin-sdk/reply-payload";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime, tryGetRuntime: getOptionalNextcloudTalkRuntime } = createPluginRuntimeStore({
	pluginId: "nextcloud-talk",
	errorMessage: "Nextcloud Talk runtime not initialized"
});
//#endregion
export { logInboundDrop as a, warnMissingProviderGroupPolicyFallbackOnce as c, setNextcloudTalkRuntime as d, fetchWithSsrFGuard as i, getNextcloudTalkRuntime as l, createChannelPairingController as n, resolveAllowlistProviderRuntimeGroupPolicy as o, deliverFormattedTextWithAttachments as r, resolveDefaultGroupPolicy as s, GROUP_POLICY_BLOCKED_LABEL as t, getOptionalNextcloudTalkRuntime as u };
