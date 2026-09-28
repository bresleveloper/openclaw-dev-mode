import { Uf as CommandAuthorization, Wf as resolveCommandAuthorization, ad as resolveStoredModelOverride, ea as CommandAuthorizer, ia as resolveDualTextControlCommandGate, id as StoredModelOverride, na as resolveCommandAuthorizedFromAuthorizers, ra as resolveControlCommandGate, ta as CommandGatingModeWhenAccessGroupsOff } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { n as CommandArgs, t as CommandArgValues } from "../commands-args.types-zglMcgeO.js";
import { t as ChannelId } from "../channel-id.types-CjcGKHk0.js";
import { n as SkillCommandSpec } from "../types-CHfKS7Qr.js";
import "../types.public-B8oQ1D30.js";
import { a as CommandArgsParsing, c as CommandScope, i as CommandArgMenuSpec, l as NativeCommandSpec, n as CommandArgChoiceContext, o as CommandDetection, r as CommandArgDefinition, s as CommandNormalizeOptions, t as ChatCommandDefinition, u as ShouldHandleTextCommandsParams } from "../commands-registry.types-D7aWP8HU.js";
import { i as shouldComputeCommandAuthorized, n as hasInlineCommandTokens, r as isControlCommandMessage, t as hasControlCommand } from "../command-detection-DZXbfVCk.js";
import { a as parseAccessGroupAllowFromEntry, t as ACCESS_GROUP_ALLOW_FROM_PREFIX } from "../allow-from-Bdiy2LH6.js";
import { a as resolveAccessGroupAllowFromMatches, i as expandAllowFromWithAccessGroups, n as AccessGroupMembershipResolver, o as resolveAccessGroupAllowFromState, r as ResolvedAccessGroupAllowFromState, t as AccessGroupMembershipLookup } from "../access-groups-DN0bv1gV.js";
import { i as resolveInboundDirectDmAccessWithRuntime, n as ResolvedInboundDirectDmAccess, r as createPreCryptoDirectDmAuthorizer, t as DirectDmCommandAuthorizationRuntime } from "../direct-dm-access-CLim9Yo5.js";
import { C as listChatCommandsForConfig, S as listChatCommands, _ as getCommandDetection, a as findCommandByNativeName, b as resolveTextCommand, c as listNativeCommandSpecs, d as parseCommandArgs, f as resolveCommandArgChoices, g as shouldHandleTextCommands, h as isNativeCommandSurface, l as listNativeCommandSpecsForConfig, m as serializeCommandArgs, n as buildCommandText, o as formatCommandArgMenuTitle, p as resolveCommandArgMenu, r as buildCommandTextFromArgs, s as isCommandMessage, t as ResolvedCommandArgChoice, v as maybeResolveTextAlias, x as isCommandEnabled, y as normalizeCommandBody } from "../commands-registry-CIZk0K9I.js";
import { n as resolveNativeCommandSessionTargets, t as ResolveNativeCommandSessionTargetsParams } from "../native-command-session-targets-BP3eEj-V.js";
import { n as ModelsProviderData } from "../commands-models-catalog-CqORffhx.js";
import { i as resolveSkillCommandInvocation, n as listSkillCommandsForWorkspace, r as listReservedChatSlashCommandNames, t as listSkillCommandsForAgents } from "../chat-commands-BCu4S1rS.js";
import { n as listProviderPluginCommandSpecs, t as getPluginCommandSpecs } from "../command-specs-Cdzft6IX.js";
import { i as resolveModelsCommandReply, r as formatModelsAvailableHeader, t as buildModelsProviderData } from "../models-provider-runtime-DIUk9j8i.js";
//#region src/plugin-sdk/telegram-command-ui.d.ts
/**
 * Telegram command UI helpers exposed for plugin command pagination.
 */
/** Builds an inline keyboard row for paginated Telegram command listings. */
export declare function buildCommandsPaginationKeyboard(currentPage: number, totalPages: number, agentId?: string): Array<Array<{
  text: string;
  callback_data: string;
}>>;
//#endregion
//#region src/plugin-sdk/command-auth.d.ts
/**
 * Inputs for legacy sender command authorization.
 * Kept for plugins that still compose command auth from DM/group allowlists instead of channel ingress.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export type ResolveSenderCommandAuthorizationParams = {
  cfg: OpenClawConfig;
  rawBody: string;
  isGroup: boolean;
  dmPolicy: string;
  configuredAllowFrom: string[];
  configuredGroupAllowFrom?: string[];
  senderId: string;
  isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
  channel?: ChannelId;
  accountId?: string;
  resolveAccessGroupMembership?: AccessGroupMembershipResolver;
  readAllowFromStore: () => Promise<string[]>;
  shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean;
  /** @deprecated Command authorization is resolved by channel ingress. Kept for runtime injection compatibility. */
  resolveCommandAuthorizedFromAuthorizers?: (params: {
    useAccessGroups: boolean;
    authorizers: Array<{
      configured: boolean;
      allowed: boolean;
    }>;
  }) => boolean;
};
/**
 * Injectable runtime hooks for legacy command authorization tests and channel adapters.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export type CommandAuthorizationRuntime = {
  shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean;
  resolveCommandAuthorizedFromAuthorizers: (params: {
    useAccessGroups: boolean;
    authorizers: Array<{
      configured: boolean;
      allowed: boolean;
    }>;
  }) => boolean;
};
/**
 * Legacy command authorization params with runtime hooks grouped for dependency injection.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export type ResolveSenderCommandAuthorizationWithRuntimeParams = Omit<ResolveSenderCommandAuthorizationParams, "shouldComputeCommandAuthorized" | "resolveCommandAuthorizedFromAuthorizers"> & {
  runtime: CommandAuthorizationRuntime;
};
/**
 * Classify direct-DM command handling after sender authorization has been computed.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export declare function resolveDirectDmAuthorizationOutcome(params: {
  isGroup: boolean;
  dmPolicy: string;
  senderAllowedForCommands: boolean;
}): "disabled" | "unauthorized" | "allowed";
/**
 * Resolve legacy command authorization using an injected runtime object.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export declare function resolveSenderCommandAuthorizationWithRuntime(params: ResolveSenderCommandAuthorizationWithRuntimeParams): ReturnType<typeof resolveSenderCommandAuthorization>;
/**
 * Resolve whether a sender may run slash/control commands under legacy DM/group policy.
 * Returns effective allowlists so callers can report the exact source set used for authorization.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
export declare function resolveSenderCommandAuthorization(params: ResolveSenderCommandAuthorizationParams): Promise<{
  shouldComputeAuth: boolean;
  effectiveAllowFrom: string[];
  effectiveGroupAllowFrom: string[];
  senderAllowedForCommands: boolean;
  commandAuthorized: boolean | undefined;
}>;
//#endregion
export { ACCESS_GROUP_ALLOW_FROM_PREFIX, type AccessGroupMembershipLookup, type AccessGroupMembershipResolver, type ChatCommandDefinition, type CommandArgChoiceContext, type CommandArgDefinition, type CommandArgMenuSpec, type CommandArgValues, type CommandArgs, type CommandArgsParsing, type CommandAuthorization, type CommandAuthorizer, type CommandDetection, type CommandGatingModeWhenAccessGroupsOff, type CommandNormalizeOptions, type CommandScope, type DirectDmCommandAuthorizationRuntime, type ModelsProviderData, type NativeCommandSpec, type ResolveNativeCommandSessionTargetsParams, type ResolvedAccessGroupAllowFromState, type ResolvedCommandArgChoice, type ResolvedInboundDirectDmAccess, type ShouldHandleTextCommandsParams, type SkillCommandSpec, type StoredModelOverride, buildCommandText, buildCommandTextFromArgs, buildModelsProviderData, createPreCryptoDirectDmAuthorizer, expandAllowFromWithAccessGroups, findCommandByNativeName, formatCommandArgMenuTitle, formatModelsAvailableHeader, getCommandDetection, getPluginCommandSpecs, hasControlCommand, hasInlineCommandTokens, isCommandEnabled, isCommandMessage, isControlCommandMessage, isNativeCommandSurface, listChatCommands, listChatCommandsForConfig, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listReservedChatSlashCommandNames, listSkillCommandsForAgents, listSkillCommandsForWorkspace, maybeResolveTextAlias, normalizeCommandBody, parseAccessGroupAllowFromEntry, parseCommandArgs, resolveAccessGroupAllowFromMatches, resolveAccessGroupAllowFromState, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandAuthorization, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveDualTextControlCommandGate, resolveInboundDirectDmAccessWithRuntime, resolveModelsCommandReply, resolveNativeCommandSessionTargets, resolveSkillCommandInvocation, resolveStoredModelOverride, resolveTextCommand, serializeCommandArgs, shouldComputeCommandAuthorized, shouldHandleTextCommands };