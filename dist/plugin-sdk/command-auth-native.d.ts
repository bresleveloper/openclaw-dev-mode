import { Bl as resolveFastModeState, Fw as formatFastModeSourceSuffix, HT as CommandAuthorization, Iw as formatFastModeStatusValue, Mi as resolveEffectiveAgentRuntime, Nw as formatFastModeCommandOptions, Pw as formatFastModeCurrentStatus, Rn as resolveStoredModelOverride, UT as resolveCommandAuthorization, WT as resolveCommandAuthorizationAsync, bj as ChannelMessagingAdapter, e_ as resolveCommandAuthorizedFromAuthorizers, t_ as resolveControlCommandGate, zn as resolveStoredModelOverrideAsync } from "../config-contracts-hzlacViZ.js";
import { c as CommandArgValues, i as CommandArgsParsing, l as CommandArgs, o as NativeCommandSpec, r as CommandArgDefinition, t as ChatCommandDefinition } from "../commands-registry.types-CyQYytP-.js";
import { a as listNativeCommandSpecs, c as parseCommandArgs, d as resolveCommandArgMenuAsync, f as serializeCommandArgs, g as listChatCommands, h as normalizeCommandBody, i as formatCommandArgMenuTitle, l as resolveCommandArgChoices, m as maybeResolveTextAlias, n as canResolveCommandArgMenu, o as listNativeCommandSpecsForConfig, r as findCommandByNativeName, t as buildCommandTextFromArgs, u as resolveCommandArgMenu } from "../commands-registry-DndyOQpp.js";
import { i as shouldComputeCommandAuthorized, t as hasControlCommand } from "../command-detection-pLCkOQjB.js";
import { n as listProviderPluginCommandSpecs } from "../command-specs-av4kFT2Y.js";
import { n as ModelsProviderData } from "../commands-models-catalog-CBQbtldN.js";
import { r as prepareSkillCommandsForAgents, t as listSkillCommandsForAgents } from "../chat-commands-DCbKtL8Z.js";
export declare function resolveNativeCommandSessionTargets(params: {
  agentId: string;
  sessionPrefix: string;
  userId: string;
  targetSessionKey: string;
  boundSessionKey?: string;
  sessionKeyCase?: NonNullable<ChannelMessagingAdapter["targetIdComparison"]>;
}): {
  sessionKey: string;
  commandTargetSessionKey: string;
};
export { type ChatCommandDefinition, type CommandArgDefinition, type CommandArgValues, type CommandArgs, type CommandArgsParsing, type CommandAuthorization, type ModelsProviderData, type NativeCommandSpec, buildCommandTextFromArgs, canResolveCommandArgMenu, findCommandByNativeName, formatCommandArgMenuTitle, formatFastModeCommandOptions, formatFastModeCurrentStatus, formatFastModeSourceSuffix, formatFastModeStatusValue, hasControlCommand, listChatCommands, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listSkillCommandsForAgents, maybeResolveTextAlias, normalizeCommandBody, parseCommandArgs, prepareSkillCommandsForAgents, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandArgMenuAsync, resolveCommandAuthorization, resolveCommandAuthorizationAsync, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveEffectiveAgentRuntime, resolveFastModeState, resolveStoredModelOverride, resolveStoredModelOverrideAsync, serializeCommandArgs, shouldComputeCommandAuthorized };