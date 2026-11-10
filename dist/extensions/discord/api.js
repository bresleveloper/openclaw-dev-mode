import { c as resolveDefaultDiscordAccountId, d as resolveDiscordAccountConfig, i as listDiscordAccountIds, l as resolveDiscordAccount, m as resolveDiscordMaxLinesPerMessage, o as listEnabledDiscordAccounts, s as mergeDiscordAccountConfig, t as createDiscordActionGate } from "./.setup/accounts-ljrzXBJi.mjs";
import { t as inspectDiscordAccount } from "./.setup/account-inspect-8cCu6uPG.mjs";
import { d as normalizeDiscordMessagingTarget, f as normalizeDiscordOutboundTarget, l as looksLikeDiscordTargetId } from "./.setup/send.receipt-C18khRYH.mjs";
import { i as requestDiscord, n as DiscordApiError, r as fetchDiscord } from "./.setup/api-DqmMUZau.mjs";
import { n as resolveDiscordChannelId, t as parseDiscordTarget } from "./.setup/target-parsing-C-HyNxcE.mjs";
import { n as resolveDiscordTarget } from "./.setup/target-resolver-CApivu3G.mjs";
import { i as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, r as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS } from "./.setup/timeouts-CuNARfyw.mjs";
import "./.setup/targets-UWWZ6gF7.mjs";
import { D as parseDiscordModalCustomIdForInteraction, E as parseDiscordModalCustomId, T as parseDiscordComponentCustomIdForInteraction, _ as DISCORD_COMPONENT_CUSTOM_ID_KEY, b as buildDiscordComponentCustomId, d as buildDiscordComponentMessage, f as buildDiscordComponentMessageFlags, g as resolveDiscordComponentAttachmentName, h as readDiscordComponentSpec, l as DiscordFormModal, n as formatDiscordComponentEventText, p as DISCORD_COMPONENT_ATTACHMENT_PREFIX, r as buildDiscordInteractiveComponents, u as createDiscordFormModal, v as DISCORD_MODAL_CUSTOM_ID_KEY, w as parseDiscordComponentCustomId, x as buildDiscordModalCustomId } from "./.setup/components-Du9NhD8h.mjs";
import { A as isDiscordExecApprovalClientEnabled, O as getDiscordExecApprovalApprovers, j as shouldSuppressLocalDiscordExecApprovalPrompt, k as isDiscordExecApprovalApprover } from "./.setup/outbound-session-route-BtUpGBTb.mjs";
import { i as resolveDiscordGroupToolPolicy, n as collectDiscordStatusIssues, r as resolveDiscordGroupRequireMention, t as discordPlugin } from "./.setup/channel-ZilgdF5e.mjs";
import { t as normalizeExplicitDiscordSessionKey } from "./.setup/session-key-normalization-CCHGNSQw.mjs";
import { t as discordSetupPlugin } from "./.setup/channel.setup-DaDQdctj.mjs";
import { n as handleDiscordSubagentDeliveryTargetAsync, r as handleDiscordSubagentEnded, t as handleDiscordSubagentDeliveryTarget } from "./.setup/subagent-hooks-CIu2TFz3.mjs";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "./.setup/handle-action.guild-admin-B6g31cwt.mjs";
import { n as listDiscordDirectoryGroupsFromConfig, r as listDiscordDirectoryPeersFromConfig } from "./.setup/directory-config-3iVub-3m.mjs";
import { t as fetchPluralKitMessageInfo } from "./.setup/pluralkit-B64dfq_j.mjs";
import { i as probeDiscord, n as fetchDiscordApplicationSummary, r as parseApplicationIdFromToken, s as resolveDiscordPrivilegedIntentsFromFlags, t as fetchDiscordApplicationId } from "./.setup/probe-CBaoCs-c.mjs";
import { t as collectDiscordSecurityAuditFindings } from "./.setup/security-audit-BFT84Uny.mjs";
import { resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
//#region extensions/discord/api.ts
const handleDiscordMessageAction = async (...args) => (await import("./.setup/handle-action-B1lmt4ms.mjs")).handleDiscordMessageAction(...args);
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
export { DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, DISCORD_COMPONENT_ATTACHMENT_PREFIX, DISCORD_COMPONENT_CUSTOM_ID_KEY, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, DISCORD_MODAL_CUSTOM_ID_KEY, DiscordApiError, DiscordFormModal, buildDiscordComponentCustomId, buildDiscordComponentMessage, buildDiscordComponentMessageFlags, buildDiscordInteractiveComponents, buildDiscordModalCustomId, collectDiscordSecurityAuditFindings, collectDiscordStatusIssues, createDiscordActionGate, createDiscordFormModal, discordPlugin, discordSetupPlugin, fetchDiscord, fetchDiscordApplicationId, fetchDiscordApplicationSummary, fetchPluralKitMessageInfo, formatDiscordComponentEventText, getDiscordExecApprovalApprovers, handleDiscordMessageAction, handleDiscordSubagentDeliveryTarget, handleDiscordSubagentDeliveryTargetAsync, handleDiscordSubagentEnded, inspectDiscordAccount, isDiscordExecApprovalApprover, isDiscordExecApprovalClientEnabled, listDiscordAccountIds, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig, listEnabledDiscordAccounts, looksLikeDiscordTargetId, mergeAbortSignals, mergeDiscordAccountConfig, normalizeDiscordMessagingTarget, normalizeDiscordOutboundTarget, normalizeExplicitDiscordSessionKey, parseApplicationIdFromToken, parseDiscordComponentCustomId, parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon, parseDiscordComponentCustomIdForInteraction, parseDiscordModalCustomId, parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon, parseDiscordModalCustomIdForInteraction, parseDiscordTarget as parseDiscordSendTarget, parseDiscordTarget, probeDiscord, readDiscordComponentSpec, requestDiscord, resolveDefaultDiscordAccountId, resolveDiscordAccount, resolveDiscordAccountConfig, resolveDiscordChannelId, resolveDiscordComponentAttachmentName, resolveDiscordGroupRequireMention, resolveDiscordGroupToolPolicy, resolveDiscordMaxLinesPerMessage, resolveDiscordPrivilegedIntentsFromFlags, resolveDiscordRuntimeGroupPolicy, resolveDiscordTarget, shouldSuppressLocalDiscordExecApprovalPrompt, tryHandleDiscordMessageActionGuildAdmin };
