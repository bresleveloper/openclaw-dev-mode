import { l as looksLikeIMessageTargetId, u as normalizeIMessageMessagingTarget } from "./.setup/targets-Cc9vthzI.mjs";
import { o as resolveIMessageAccount } from "./.setup/accounts-CUxZrTcY.mjs";
import { d as probeIMessage, r as resolveIMessageGroupToolPolicy, t as resolveIMessageGroupRequireMention, u as imessageMessageActions } from "./.setup/group-policy-Cjztkquv.mjs";
import { r as setIMessageRuntime } from "./.setup/runtime-Cza4CY5T.mjs";
import { n as IMessageConfigSchema } from "./.setup/config-schema-CCbTcJEV.mjs";
import { t as sendMessageIMessage } from "./.setup/send-odAfTQ2J.mjs";
import { t as monitorIMessageProvider } from "./.setup/monitor-BJ3Ozi6I.mjs";
import { formatTrimmedAllowFromEntries } from "openclaw/plugin-sdk/channel-config-helpers";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { buildComputedAccountStatusSnapshot, collectStatusIssuesFromLastError } from "openclaw/plugin-sdk/status-helpers";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
import { DEFAULT_ACCOUNT_ID, getChatChannelMeta } from "openclaw/plugin-sdk/core";
import { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
//#region extensions/imessage/src/config-accessors.ts
function resolveIMessageConfigAllowFrom(params) {
	return (resolveIMessageAccount(params).config.allowFrom ?? []).map((entry) => String(entry));
}
function resolveIMessageConfigDefaultTo(params) {
	const defaultTo = resolveIMessageAccount(params).config.defaultTo;
	if (defaultTo == null) return;
	return defaultTo.trim() || void 0;
}
//#endregion
export { DEFAULT_ACCOUNT_ID, IMessageConfigSchema, PAIRING_APPROVED_MESSAGE, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, chunkTextForOutbound, collectStatusIssuesFromLastError, formatTrimmedAllowFromEntries, getChatChannelMeta, imessageMessageActions, looksLikeIMessageTargetId, monitorIMessageProvider, normalizeIMessageMessagingTarget, probeIMessage, resolveChannelMediaMaxBytes, resolveIMessageConfigAllowFrom, resolveIMessageConfigDefaultTo, resolveIMessageGroupRequireMention, resolveIMessageGroupToolPolicy, sendMessageIMessage, setIMessageRuntime };
