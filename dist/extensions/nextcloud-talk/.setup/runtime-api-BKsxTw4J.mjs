import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
import { GROUP_POLICY_BLOCKED_LABEL, resolveAllowlistProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
import { deliverFormattedTextWithAttachments } from "openclaw/plugin-sdk/reply-payload";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime } = createPluginRuntimeStore({
	pluginId: "nextcloud-talk",
	errorMessage: "Nextcloud Talk runtime not initialized"
});
//#endregion
export { fetchWithSsrFGuard as a, resolveDefaultGroupPolicy as c, setNextcloudTalkRuntime as d, deliverFormattedTextWithAttachments as i, warnMissingProviderGroupPolicyFallbackOnce as l, createChannelMessageReplyPipeline as n, logInboundDrop as o, createChannelPairingController as r, resolveAllowlistProviderRuntimeGroupPolicy as s, GROUP_POLICY_BLOCKED_LABEL as t, getNextcloudTalkRuntime as u };
