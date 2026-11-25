import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
import { GROUP_POLICY_BLOCKED_LABEL, resolveAllowlistProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime, tryGetRuntime: getOptionalNextcloudTalkRuntime } = createPluginRuntimeStore({
	pluginId: "nextcloud-talk",
	errorMessage: "Nextcloud Talk runtime not initialized"
});
export { resolveAllowlistProviderRuntimeGroupPolicy as a, getNextcloudTalkRuntime as c, logInboundDrop as i, getOptionalNextcloudTalkRuntime as l, createChannelPairingController as n, resolveDefaultGroupPolicy as o, fetchWithSsrFGuard as r, warnMissingProviderGroupPolicyFallbackOnce as s, GROUP_POLICY_BLOCKED_LABEL as t, setNextcloudTalkRuntime as u };
