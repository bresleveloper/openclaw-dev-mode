import { D as parseDiscordModalCustomIdForInteraction, E as parseDiscordModalCustomId, T as parseDiscordComponentCustomIdForInteraction, _ as DISCORD_COMPONENT_CUSTOM_ID_KEY, b as buildDiscordComponentCustomId, d as buildDiscordComponentMessage, f as buildDiscordComponentMessageFlags, g as resolveDiscordComponentAttachmentName, h as readDiscordComponentSpec, l as DiscordFormModal, n as formatDiscordComponentEventText, p as DISCORD_COMPONENT_ATTACHMENT_PREFIX, r as buildDiscordInteractiveComponents, u as createDiscordFormModal, v as DISCORD_MODAL_CUSTOM_ID_KEY, w as parseDiscordComponentCustomId, x as buildDiscordModalCustomId } from "./.setup/components-yBEb75bB.mjs";
import { a as listEnabledDiscordAccounts, c as resolveDiscordAccount, o as mergeDiscordAccountConfig, p as resolveDiscordMaxLinesPerMessage, r as listDiscordAccountIds, s as resolveDefaultDiscordAccountId, t as createDiscordActionGate, u as resolveDiscordAccountConfig } from "./.setup/accounts-CwJQoLjM.mjs";
import { i as requestDiscord, n as DiscordApiError, r as fetchDiscord } from "./.setup/api-CBK9zcq5.mjs";
import { _ as normalizeDiscordMessagingTarget, b as resolveDiscordChannelId, h as looksLikeDiscordTargetId, v as normalizeDiscordOutboundTarget, y as parseDiscordTarget } from "./.setup/retry-BEYkDy0P.mjs";
import { i as parseDiscordSendTarget, n as resolveDiscordTarget } from "./.setup/target-resolver-BXpy6VT8.mjs";
import { t as inspectDiscordAccount } from "./.setup/account-inspect-BwQj24ht.mjs";
import { i as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, r as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS } from "./.setup/timeouts-D86uWLt_.mjs";
import "./.setup/targets-CvemhN3i.mjs";
import { D as isDiscordExecApprovalClientEnabled, E as isDiscordExecApprovalApprover, O as shouldSuppressLocalDiscordExecApprovalPrompt, T as getDiscordExecApprovalApprovers } from "./.setup/outbound-session-route-VulUE0yV.mjs";
import { i as resolveDiscordGroupToolPolicy, n as collectDiscordStatusIssues, r as resolveDiscordGroupRequireMention, t as discordPlugin } from "./.setup/channel-Dv4e3Jpc.mjs";
import { t as normalizeExplicitDiscordSessionKey } from "./.setup/session-key-normalization-wJgsKPNF.mjs";
import { t as discordSetupPlugin } from "./.setup/channel.setup-0NX6FFwi.mjs";
import { n as handleDiscordSubagentEnded, t as handleDiscordSubagentDeliveryTarget } from "./.setup/subagent-hooks-CjW7r8Pe.mjs";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "./.setup/handle-action.guild-admin-DcFa8NwA.mjs";
import { n as listDiscordDirectoryGroupsFromConfig, r as listDiscordDirectoryPeersFromConfig } from "./.setup/directory-config-BytTftz-.mjs";
import { t as fetchPluralKitMessageInfo } from "./.setup/pluralkit-CdAt1G0P.mjs";
import { i as probeDiscord, n as fetchDiscordApplicationSummary, o as resolveDiscordPrivilegedIntentsFromFlags, r as parseApplicationIdFromToken, t as fetchDiscordApplicationId } from "./.setup/probe-CupW4we4.mjs";
import { t as collectDiscordSecurityAuditFindings } from "./.setup/security-audit-s5w50-Ly.mjs";
import { resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
//#region extensions/discord/api.ts
const handleDiscordMessageAction = async (...args) => (await import("./.setup/channel-actions.runtime-leZuw01r.mjs")).handleDiscordMessageAction(...args);
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
export { DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, DISCORD_COMPONENT_ATTACHMENT_PREFIX, DISCORD_COMPONENT_CUSTOM_ID_KEY, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, DISCORD_MODAL_CUSTOM_ID_KEY, DiscordApiError, DiscordFormModal, buildDiscordComponentCustomId, buildDiscordComponentMessage, buildDiscordComponentMessageFlags, buildDiscordInteractiveComponents, buildDiscordModalCustomId, collectDiscordSecurityAuditFindings, collectDiscordStatusIssues, createDiscordActionGate, createDiscordFormModal, discordPlugin, discordSetupPlugin, fetchDiscord, fetchDiscordApplicationId, fetchDiscordApplicationSummary, fetchPluralKitMessageInfo, formatDiscordComponentEventText, getDiscordExecApprovalApprovers, handleDiscordMessageAction, handleDiscordSubagentDeliveryTarget, handleDiscordSubagentEnded, inspectDiscordAccount, isDiscordExecApprovalApprover, isDiscordExecApprovalClientEnabled, listDiscordAccountIds, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig, listEnabledDiscordAccounts, looksLikeDiscordTargetId, mergeAbortSignals, mergeDiscordAccountConfig, normalizeDiscordMessagingTarget, normalizeDiscordOutboundTarget, normalizeExplicitDiscordSessionKey, parseApplicationIdFromToken, parseDiscordComponentCustomId, parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon, parseDiscordComponentCustomIdForInteraction, parseDiscordModalCustomId, parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon, parseDiscordModalCustomIdForInteraction, parseDiscordSendTarget, parseDiscordTarget, probeDiscord, readDiscordComponentSpec, requestDiscord, resolveDefaultDiscordAccountId, resolveDiscordAccount, resolveDiscordAccountConfig, resolveDiscordChannelId, resolveDiscordComponentAttachmentName, resolveDiscordGroupRequireMention, resolveDiscordGroupToolPolicy, resolveDiscordMaxLinesPerMessage, resolveDiscordPrivilegedIntentsFromFlags, resolveDiscordRuntimeGroupPolicy, resolveDiscordTarget, shouldSuppressLocalDiscordExecApprovalPrompt, tryHandleDiscordMessageActionGuildAdmin };
