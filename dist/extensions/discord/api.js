import { a as listEnabledDiscordAccounts, c as resolveDiscordAccount, o as mergeDiscordAccountConfig, p as resolveDiscordMaxLinesPerMessage, r as listDiscordAccountIds, s as resolveDefaultDiscordAccountId, t as createDiscordActionGate, u as resolveDiscordAccountConfig } from "./.setup/accounts-HE9-mj1L.mjs";
import { t as inspectDiscordAccount } from "./.setup/account-inspect-DsER5ILV.mjs";
import { d as normalizeDiscordMessagingTarget, f as normalizeDiscordOutboundTarget, l as looksLikeDiscordTargetId, m as resolveDiscordChannelId, p as parseDiscordTarget } from "./.setup/send.receipt-DVOg2Oaw.mjs";
import { i as requestDiscord, n as DiscordApiError, r as fetchDiscord } from "./.setup/api-DlNUkDqj.mjs";
import { n as resolveDiscordTarget } from "./.setup/target-resolver-CSFoPQ12.mjs";
import { i as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, r as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS } from "./.setup/timeouts-pun7VJ02.mjs";
import "./.setup/targets-bqXQENmX.mjs";
import { D as parseDiscordModalCustomIdForInteraction, E as parseDiscordModalCustomId, T as parseDiscordComponentCustomIdForInteraction, _ as DISCORD_COMPONENT_CUSTOM_ID_KEY, b as buildDiscordComponentCustomId, d as buildDiscordComponentMessage, f as buildDiscordComponentMessageFlags, g as resolveDiscordComponentAttachmentName, h as readDiscordComponentSpec, l as DiscordFormModal, n as formatDiscordComponentEventText, p as DISCORD_COMPONENT_ATTACHMENT_PREFIX, r as buildDiscordInteractiveComponents, u as createDiscordFormModal, v as DISCORD_MODAL_CUSTOM_ID_KEY, w as parseDiscordComponentCustomId, x as buildDiscordModalCustomId } from "./.setup/components-DLJR0xU-.mjs";
import { D as isDiscordExecApprovalClientEnabled, E as isDiscordExecApprovalApprover, O as shouldSuppressLocalDiscordExecApprovalPrompt, T as getDiscordExecApprovalApprovers } from "./.setup/outbound-session-route-BvBH4LC6.mjs";
import { i as resolveDiscordGroupToolPolicy, n as collectDiscordStatusIssues, r as resolveDiscordGroupRequireMention, t as discordPlugin } from "./.setup/channel-Dr-AUnGt.mjs";
import { t as normalizeExplicitDiscordSessionKey } from "./.setup/session-key-normalization-CCHGNSQw.mjs";
import { t as discordSetupPlugin } from "./.setup/channel.setup-BmNvkidb.mjs";
import { n as handleDiscordSubagentEnded, t as handleDiscordSubagentDeliveryTarget } from "./.setup/subagent-hooks-HH8Uy9cx.mjs";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "./.setup/handle-action.guild-admin-CB4sc9VV.mjs";
import { n as listDiscordDirectoryGroupsFromConfig, r as listDiscordDirectoryPeersFromConfig } from "./.setup/directory-config-gqsdcplU.mjs";
import { t as fetchPluralKitMessageInfo } from "./.setup/pluralkit-a6_NLfH9.mjs";
import { i as probeDiscord, n as fetchDiscordApplicationSummary, r as parseApplicationIdFromToken, s as resolveDiscordPrivilegedIntentsFromFlags, t as fetchDiscordApplicationId } from "./.setup/probe-BwSKpnZf.mjs";
import { t as collectDiscordSecurityAuditFindings } from "./.setup/security-audit-D42cp5N7.mjs";
import { resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
//#region extensions/discord/api.ts
const handleDiscordMessageAction = async (...args) => (await import("./.setup/handle-action-UmkjXBfo.mjs")).handleDiscordMessageAction(...args);
/**
* @deprecated Shipped `@openclaw/discord/api` compatibility only. Use native
* `AbortSignal.any` after filtering optional signals. Removal with the next
* plugin-SDK major.
*/
function mergeAbortSignals(signals) {
	const activeSignals = signals.filter((signal) => Boolean(signal));
	return activeSignals.length > 1 ? AbortSignal.any(activeSignals) : activeSignals[0];
}
//#endregion
export { DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, DISCORD_COMPONENT_ATTACHMENT_PREFIX, DISCORD_COMPONENT_CUSTOM_ID_KEY, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, DISCORD_MODAL_CUSTOM_ID_KEY, DiscordApiError, DiscordFormModal, buildDiscordComponentCustomId, buildDiscordComponentMessage, buildDiscordComponentMessageFlags, buildDiscordInteractiveComponents, buildDiscordModalCustomId, collectDiscordSecurityAuditFindings, collectDiscordStatusIssues, createDiscordActionGate, createDiscordFormModal, discordPlugin, discordSetupPlugin, fetchDiscord, fetchDiscordApplicationId, fetchDiscordApplicationSummary, fetchPluralKitMessageInfo, formatDiscordComponentEventText, getDiscordExecApprovalApprovers, handleDiscordMessageAction, handleDiscordSubagentDeliveryTarget, handleDiscordSubagentEnded, inspectDiscordAccount, isDiscordExecApprovalApprover, isDiscordExecApprovalClientEnabled, listDiscordAccountIds, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig, listEnabledDiscordAccounts, looksLikeDiscordTargetId, mergeAbortSignals, mergeDiscordAccountConfig, normalizeDiscordMessagingTarget, normalizeDiscordOutboundTarget, normalizeExplicitDiscordSessionKey, parseApplicationIdFromToken, parseDiscordComponentCustomId, parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon, parseDiscordComponentCustomIdForInteraction, parseDiscordModalCustomId, parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon, parseDiscordModalCustomIdForInteraction, parseDiscordTarget as parseDiscordSendTarget, parseDiscordTarget, probeDiscord, readDiscordComponentSpec, requestDiscord, resolveDefaultDiscordAccountId, resolveDiscordAccount, resolveDiscordAccountConfig, resolveDiscordChannelId, resolveDiscordComponentAttachmentName, resolveDiscordGroupRequireMention, resolveDiscordGroupToolPolicy, resolveDiscordMaxLinesPerMessage, resolveDiscordPrivilegedIntentsFromFlags, resolveDiscordRuntimeGroupPolicy, resolveDiscordTarget, shouldSuppressLocalDiscordExecApprovalPrompt, tryHandleDiscordMessageActionGuildAdmin };
