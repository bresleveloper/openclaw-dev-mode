import { i as resolveCommandAuthorization } from "../command-auth-2PSSAYYJ.mjs";
import { n as resolveControlCommandGate, r as resolveDualTextControlCommandGate, t as resolveCommandAuthorizedFromAuthorizers } from "../command-gating-65fgTdwb.mjs";
import { a as parseAccessGroupAllowFromEntry, t as ACCESS_GROUP_ALLOW_FROM_PREFIX } from "../allow-from-Dq2DvsNl.mjs";
import { n as listChatCommands, r as listChatCommandsForConfig, t as isCommandEnabled } from "../commands-registry-list-dv4qVJuy.mjs";
import { i as resolveTextCommand, n as maybeResolveTextAlias, r as normalizeCommandBody, t as getCommandDetection } from "../commands-registry-normalize-DJeLLZwD.mjs";
import { a as shouldComputeCommandAuthorized, n as hasInlineCommandTokens, r as isControlCommandMessage, t as hasControlCommand } from "../command-detection-CBYe7EC-.mjs";
import { n as shouldHandleTextCommands, t as isNativeCommandSurface } from "../commands-text-routing-BAYDrHHM.mjs";
import { a as formatCommandArgMenuTitle, c as listNativeCommandSpecs, d as parseCommandArgs, f as resolveCommandArgChoices, i as findCommandByNativeName, l as listNativeCommandSpecsForConfig, m as serializeCommandArgs, n as buildCommandTextFromArgs, p as resolveCommandArgMenu, s as isCommandMessage, t as buildCommandText } from "../commands-registry-Dw3-bHwm.mjs";
import { n as resolveStoredModelOverride } from "../stored-model-overrides-Cd0DtWCi.mjs";
import { r as resolveDmGroupAccessWithLists } from "../dm-policy-shared-NwS6IC07.mjs";
import { i as listProviderPluginCommandSpecs, r as getPluginCommandSpecs } from "../command-specs-enEeJ24Y.mjs";
import { i as listReservedChatSlashCommandNames, o as resolveSkillCommandInvocation } from "../chat-command-invocation-C1oJ052R.mjs";
import { n as resolveAccessGroupAllowFromMatches, r as resolveAccessGroupAllowFromState, t as expandAllowFromWithAccessGroups } from "../access-groups-C6biHkvZ.mjs";
import "../channel-access-compat-DPCgli7T.mjs";
import { n as resolveInboundDirectDmAccessWithRuntime, t as createPreCryptoDirectDmAuthorizer } from "../direct-dm-access-SRroUKK-.mjs";
import { t as resolveNativeCommandSessionTargets } from "../native-command-session-targets-BtwIxFQ8.mjs";
import { n as listSkillCommandsForWorkspace, t as listSkillCommandsForAgents } from "../chat-commands-DZNqfvMX.mjs";
import { i as resolveModelsCommandReply, n as formatModelsAvailableHeader } from "../commands-models-Br8TkBOP.mjs";
import { t as buildModelsProviderData } from "../models-provider-runtime-BYDEv6xW.mjs";
//#region src/plugin-sdk/telegram-command-ui.ts
/**
* Telegram command UI helpers exposed for plugin command pagination.
*/
/** Builds an inline keyboard row for paginated Telegram command listings. */
function buildCommandsPaginationKeyboard(currentPage, totalPages, agentId) {
	const buttons = [];
	const suffix = agentId ? `:${agentId}` : "";
	if (currentPage > 1) buttons.push({
		text: "◀ Prev",
		callback_data: `commands_page_${currentPage - 1}${suffix}`
	});
	buttons.push({
		text: `${currentPage}/${totalPages}`,
		callback_data: `commands_page_noop${suffix}`
	});
	if (currentPage < totalPages) buttons.push({
		text: "Next ▶",
		callback_data: `commands_page_${currentPage + 1}${suffix}`
	});
	return [buttons];
}
//#endregion
//#region src/plugin-sdk/command-auth.ts
/**
* Classify direct-DM command handling after sender authorization has been computed.
*
* @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
*/
function resolveDirectDmAuthorizationOutcome(params) {
	if (params.isGroup) return "allowed";
	if (params.dmPolicy === "disabled") return "disabled";
	if (!params.senderAllowedForCommands) return "unauthorized";
	return "allowed";
}
/**
* Resolve legacy command authorization using an injected runtime object.
*
* @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
*/
async function resolveSenderCommandAuthorizationWithRuntime(params) {
	return resolveSenderCommandAuthorization({
		...params,
		shouldComputeCommandAuthorized: params.runtime.shouldComputeCommandAuthorized,
		resolveCommandAuthorizedFromAuthorizers: params.runtime.resolveCommandAuthorizedFromAuthorizers
	});
}
/**
* Resolve whether a sender may run slash/control commands under legacy DM/group policy.
* Returns effective allowlists so callers can report the exact source set used for authorization.
*
* @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
*/
async function resolveSenderCommandAuthorization(params) {
	const shouldComputeAuth = params.shouldComputeCommandAuthorized(params.rawBody, params.cfg);
	const storeAllowFrom = !params.isGroup && params.dmPolicy !== "allowlist" && params.dmPolicy !== "open" ? await params.readAllowFromStore().catch(() => []) : [];
	const channel = params.channel;
	const accountId = params.accountId ?? "default";
	let configuredAllowFrom = params.configuredAllowFrom;
	let configuredGroupAllowFrom = params.configuredGroupAllowFrom ?? [];
	let dmStoreAllowFrom = storeAllowFrom;
	if (channel) {
		[configuredAllowFrom, configuredGroupAllowFrom] = await Promise.all([expandAllowFromWithAccessGroups({
			cfg: params.cfg,
			allowFrom: params.configuredAllowFrom,
			channel,
			accountId,
			senderId: params.senderId,
			isSenderAllowed: params.isSenderAllowed,
			resolveMembership: params.resolveAccessGroupMembership
		}), expandAllowFromWithAccessGroups({
			cfg: params.cfg,
			allowFrom: params.configuredGroupAllowFrom ?? [],
			channel,
			accountId,
			senderId: params.senderId,
			isSenderAllowed: params.isSenderAllowed,
			resolveMembership: params.resolveAccessGroupMembership
		})]);
		if (!params.isGroup) dmStoreAllowFrom = await expandAllowFromWithAccessGroups({
			cfg: params.cfg,
			allowFrom: storeAllowFrom,
			channel,
			accountId,
			senderId: params.senderId,
			isSenderAllowed: params.isSenderAllowed,
			resolveMembership: params.resolveAccessGroupMembership
		});
	}
	const access = resolveDmGroupAccessWithLists({
		isGroup: params.isGroup,
		dmPolicy: params.dmPolicy,
		groupPolicy: "allowlist",
		allowFrom: configuredAllowFrom,
		groupAllowFrom: configuredGroupAllowFrom,
		storeAllowFrom: dmStoreAllowFrom,
		isSenderAllowed: (allowFrom) => params.isSenderAllowed(params.senderId, allowFrom)
	});
	const effectiveAllowFrom = access.effectiveAllowFrom;
	const effectiveGroupAllowFrom = access.effectiveGroupAllowFrom;
	const useAccessGroups = true;
	const senderAllowedForCommands = params.isSenderAllowed(params.senderId, params.isGroup ? effectiveGroupAllowFrom : effectiveAllowFrom);
	const ownerAllowedForCommands = params.isSenderAllowed(params.senderId, effectiveAllowFrom);
	const groupAllowedForCommands = params.isSenderAllowed(params.senderId, effectiveGroupAllowFrom);
	return {
		shouldComputeAuth,
		effectiveAllowFrom,
		effectiveGroupAllowFrom,
		senderAllowedForCommands,
		commandAuthorized: shouldComputeAuth ? params.resolveCommandAuthorizedFromAuthorizers?.({
			useAccessGroups,
			authorizers: [{
				configured: effectiveAllowFrom.length > 0,
				allowed: ownerAllowedForCommands
			}, {
				configured: effectiveGroupAllowFrom.length > 0,
				allowed: groupAllowedForCommands
			}]
		}) ?? senderAllowedForCommands : void 0
	};
}
//#endregion
export { ACCESS_GROUP_ALLOW_FROM_PREFIX, buildCommandText, buildCommandTextFromArgs, buildCommandsPaginationKeyboard, buildModelsProviderData, createPreCryptoDirectDmAuthorizer, expandAllowFromWithAccessGroups, findCommandByNativeName, formatCommandArgMenuTitle, formatModelsAvailableHeader, getCommandDetection, getPluginCommandSpecs, hasControlCommand, hasInlineCommandTokens, isCommandEnabled, isCommandMessage, isControlCommandMessage, isNativeCommandSurface, listChatCommands, listChatCommandsForConfig, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listReservedChatSlashCommandNames, listSkillCommandsForAgents, listSkillCommandsForWorkspace, maybeResolveTextAlias, normalizeCommandBody, parseAccessGroupAllowFromEntry, parseCommandArgs, resolveAccessGroupAllowFromMatches, resolveAccessGroupAllowFromState, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandAuthorization, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveDirectDmAuthorizationOutcome, resolveDualTextControlCommandGate, resolveInboundDirectDmAccessWithRuntime, resolveModelsCommandReply, resolveNativeCommandSessionTargets, resolveSenderCommandAuthorization, resolveSenderCommandAuthorizationWithRuntime, resolveSkillCommandInvocation, resolveStoredModelOverride, resolveTextCommand, serializeCommandArgs, shouldComputeCommandAuthorized, shouldHandleTextCommands };
