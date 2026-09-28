import "./config-api-CsD0IFxF.mjs";
import { extractToolSend as extractToolSend$1 } from "openclaw/plugin-sdk/tool-send";
import { fetchWithSsrFGuard as fetchWithSsrFGuard$1 } from "openclaw/plugin-sdk/ssrf-runtime";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { createActionGate, jsonResult as jsonResult$1, readNumberParam, readReactionParams, readStringParam as readStringParam$1 } from "openclaw/plugin-sdk/channel-actions";
import { missingTargetError } from "openclaw/plugin-sdk/channel-feedback";
import { createAccountStatusSink as createAccountStatusSink$1, createChannelMessageReplyPipeline, runPassiveAccountLifecycle as runPassiveAccountLifecycle$1 } from "openclaw/plugin-sdk/channel-outbound";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
import { GROUP_POLICY_BLOCKED_LABEL, resolveAllowlistProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { resolveInboundMentionDecision } from "openclaw/plugin-sdk/channel-inbound";
import { resolveWebhookPath } from "openclaw/plugin-sdk/webhook-ingress";
import { registerWebhookTargetWithPluginRoute as registerWebhookTargetWithPluginRoute$1, resolveWebhookTargetWithAuthOrReject as resolveWebhookTargetWithAuthOrReject$1, withResolvedWebhookRequestPipeline as withResolvedWebhookRequestPipeline$1 } from "openclaw/plugin-sdk/webhook-targets";
import { createWebhookInFlightLimiter as createWebhookInFlightLimiter$1, readJsonWebhookBodyOrReject as readJsonWebhookBodyOrReject$1 } from "openclaw/plugin-sdk/webhook-request-guards";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { resolveWebhookPath as C, withResolvedWebhookRequestPipeline$1 as D, warnMissingProviderGroupPolicyFallbackOnce as E, getGoogleChatRuntime as O, resolveInboundMentionDecision as S, runPassiveAccountLifecycle$1 as T, readReactionParams as _, createAccountStatusSink$1 as a, resolveAllowlistProviderRuntimeGroupPolicy as b, createChannelPairingController as c, fetchWithSsrFGuard$1 as d, isDangerousNameMatchingEnabled as f, readNumberParam as g, readJsonWebhookBodyOrReject$1 as h, chunkTextForOutbound as i, setGoogleChatRuntime as k, createWebhookInFlightLimiter$1 as l, missingTargetError as m, GROUP_POLICY_BLOCKED_LABEL as n, createActionGate as o, jsonResult$1 as p, PAIRING_APPROVED_MESSAGE as r, createChannelMessageReplyPipeline as s, DEFAULT_ACCOUNT_ID as t, extractToolSend$1 as u, readStringParam$1 as v, resolveWebhookTargetWithAuthOrReject$1 as w, resolveDefaultGroupPolicy as x, registerWebhookTargetWithPluginRoute$1 as y };
