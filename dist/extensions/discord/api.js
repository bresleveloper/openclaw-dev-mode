import { c as resolveDefaultDiscordAccountId, d as resolveDiscordAccountConfig, i as listDiscordAccountIds, l as resolveDiscordAccount, m as resolveDiscordMaxLinesPerMessage, o as listEnabledDiscordAccounts, s as mergeDiscordAccountConfig, t as createDiscordActionGate } from "./.setup/accounts-DtjvhJUj.mjs";
import { t as inspectDiscordAccount } from "./.setup/account-inspect-CSz5Qodj.mjs";
import { c as normalizeDiscordMessagingTarget, l as normalizeDiscordOutboundTarget, o as looksLikeDiscordTargetId } from "./.setup/send.receipt-CZ7ks6g7.mjs";
import { i as requestDiscord, n as DiscordApiError, r as fetchDiscord } from "./.setup/api-C4j_kC-2.mjs";
import { n as resolveDiscordChannelId, t as parseDiscordTarget } from "./.setup/target-parsing-BiuhcK9Q.mjs";
import { n as resolveDiscordTarget } from "./.setup/target-resolver-48znkzky.mjs";
import { i as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, r as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS } from "./.setup/timeouts-CT9hnmo4.mjs";
import { _ as parseDiscordModalCustomId, c as DISCORD_COMPONENT_CUSTOM_ID_KEY, d as buildDiscordComponentCustomId, f as buildDiscordModalCustomId, g as parseDiscordComponentCustomIdForInteraction, h as parseDiscordComponentCustomId, l as DISCORD_MODAL_CUSTOM_ID_KEY, t as buildDiscordInteractiveComponents, v as parseDiscordModalCustomIdForInteraction } from "./.setup/shared-interactive-DKBw4SNV.mjs";
import { a as buildDiscordComponentMessage, i as createDiscordFormModal, l as readDiscordComponentSpec, n as formatDiscordComponentEventText, o as buildDiscordComponentMessageFlags, r as DiscordFormModal, s as DISCORD_COMPONENT_ATTACHMENT_PREFIX, u as resolveDiscordComponentAttachmentName } from "./.setup/components-GePlato3.mjs";
import { A as shouldSuppressLocalDiscordExecApprovalPrompt, D as getDiscordExecApprovalApprovers, O as isDiscordExecApprovalApprover, k as isDiscordExecApprovalClientEnabled, l as resolveDiscordGroupRequireMention, u as resolveDiscordGroupToolPolicy } from "./.setup/outbound-session-route-G_fK5RAh.mjs";
import { n as collectDiscordStatusIssues, t as discordPlugin } from "./.setup/channel-C0GMDf_u.mjs";
import { t as normalizeExplicitDiscordSessionKey } from "./.setup/session-key-normalization-Cfvze5hd.mjs";
import { t as discordSetupPlugin } from "./.setup/channel.setup-DmGdG9BH.mjs";
import { n as handleDiscordSubagentDeliveryTargetAsync, r as handleDiscordSubagentEnded, t as handleDiscordSubagentDeliveryTarget } from "./.setup/subagent-hooks-CVmIOrAR.mjs";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "./.setup/handle-action.guild-admin-CxYfg02j.mjs";
import { n as listDiscordDirectoryGroupsFromConfig, r as listDiscordDirectoryPeersFromConfig } from "./.setup/directory-config-BXJuh9-J.mjs";
import { t as fetchPluralKitMessageInfo } from "./.setup/pluralkit-DcXbHTpQ.mjs";
import { i as probeDiscord, n as fetchDiscordApplicationSummary, r as parseApplicationIdFromToken, s as resolveDiscordPrivilegedIntentsFromFlags, t as fetchDiscordApplicationId } from "./.setup/probe-CfGMZwFD.mjs";
import { t as collectDiscordSecurityAuditFindings } from "./.setup/security-audit-CTwisG7c.mjs";
import { resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
// extensions/discord/api.ts
const handleDiscordMessageAction = async (...args) => (await import("./.setup/handle-action-El1ok7Ak.mjs")).handleDiscordMessageAction(...args);
/**
* @deprecated Shipped `@openclaw/discord/api` compatibility only. Use native
* `AbortSignal.any` after filtering optional signals. Removal with the next
* plugin-SDK major.
*/
function mergeAbortSignals(signals) {
	const activeSignals = signals.filter((signal) => Boolean(signal));
	return activeSignals.length > 1 ? AbortSignal.any(activeSignals) : activeSignals[0];
}
export { DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, DISCORD_COMPONENT_ATTACHMENT_PREFIX, DISCORD_COMPONENT_CUSTOM_ID_KEY, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, DISCORD_MODAL_CUSTOM_ID_KEY, DiscordApiError, DiscordFormModal, buildDiscordComponentCustomId, buildDiscordComponentMessage, buildDiscordComponentMessageFlags, buildDiscordInteractiveComponents, buildDiscordModalCustomId, collectDiscordSecurityAuditFindings, collectDiscordStatusIssues, createDiscordActionGate, createDiscordFormModal, discordPlugin, discordSetupPlugin, fetchDiscord, fetchDiscordApplicationId, fetchDiscordApplicationSummary, fetchPluralKitMessageInfo, formatDiscordComponentEventText, getDiscordExecApprovalApprovers, handleDiscordMessageAction, handleDiscordSubagentDeliveryTarget, handleDiscordSubagentDeliveryTargetAsync, handleDiscordSubagentEnded, inspectDiscordAccount, isDiscordExecApprovalApprover, isDiscordExecApprovalClientEnabled, listDiscordAccountIds, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig, listEnabledDiscordAccounts, looksLikeDiscordTargetId, mergeAbortSignals, mergeDiscordAccountConfig, normalizeDiscordMessagingTarget, normalizeDiscordOutboundTarget, normalizeExplicitDiscordSessionKey, parseApplicationIdFromToken, parseDiscordComponentCustomId, parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon, parseDiscordComponentCustomIdForInteraction, parseDiscordModalCustomId, parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon, parseDiscordModalCustomIdForInteraction, parseDiscordTarget as parseDiscordSendTarget, parseDiscordTarget, probeDiscord, readDiscordComponentSpec, requestDiscord, resolveDefaultDiscordAccountId, resolveDiscordAccount, resolveDiscordAccountConfig, resolveDiscordChannelId, resolveDiscordComponentAttachmentName, resolveDiscordGroupRequireMention, resolveDiscordGroupToolPolicy, resolveDiscordMaxLinesPerMessage, resolveDiscordPrivilegedIntentsFromFlags, resolveDiscordRuntimeGroupPolicy, resolveDiscordTarget, shouldSuppressLocalDiscordExecApprovalPrompt, tryHandleDiscordMessageActionGuildAdmin };
