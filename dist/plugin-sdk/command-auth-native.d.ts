import { M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { AE as CommandAuthorization, B as resolveStoredModelOverrideAsync, ME as resolveCommandAuthorizationAsync, WD as ChannelMessagingAdapter, Xg as resolveCommandAuthorizedFromAuthorizers, Zg as resolveControlCommandGate, Zt as AgentRuntimePolicyScope, ay as formatFastModeStatusValue, iy as formatFastModeSourceSuffix, jE as resolveCommandAuthorization, lv as resolveFastModeState, n as SessionEntry, ny as formatFastModeCommandOptions, ry as formatFastModeCurrentStatus, z as resolveStoredModelOverride } from "../config-contracts-CY87ANNp.js";
import { c as CommandArgValues, i as CommandArgsParsing, l as CommandArgs, o as NativeCommandSpec, r as CommandArgDefinition, t as ChatCommandDefinition } from "../commands-registry.types-D2YR_-0H.js";
import "../model-selection-DoE_lu2k.js";
import { i as shouldComputeCommandAuthorized, t as hasControlCommand } from "../command-detection-DzcEpTU7.js";
import { a as listNativeCommandSpecs, c as parseCommandArgs, d as resolveCommandArgMenuAsync, f as serializeCommandArgs, h as listChatCommands, i as formatCommandArgMenuTitle, l as resolveCommandArgChoices, m as normalizeCommandBody, n as canResolveCommandArgMenu, o as listNativeCommandSpecsForConfig, p as maybeResolveTextAlias, r as findCommandByNativeName, t as buildCommandTextFromArgs, u as resolveCommandArgMenu } from "../commands-registry-OBm_Jl9b.js";
import { n as listProviderPluginCommandSpecs } from "../command-specs-19DIDUqH.js";
import { n as ModelsProviderData } from "../commands-models-catalog-DJDeWgJv.js";
import { r as prepareSkillCommandsForAgents, t as listSkillCommandsForAgents } from "../chat-commands-ytwC4Nof.js";
//#region src/channels/native-command-session-targets.d.ts
type ResolveNativeCommandSessionTargetsParams = {
  agentId: string;
  sessionPrefix: string;
  userId: string;
  targetSessionKey: string;
  boundSessionKey?: string;
  sessionKeyCase?: NonNullable<ChannelMessagingAdapter["targetIdComparison"]>;
};
export declare function resolveNativeCommandSessionTargets(params: ResolveNativeCommandSessionTargetsParams): {
  sessionKey: string;
  commandTargetSessionKey: string;
};
//#endregion
//#region src/agents/thinking-runtime.d.ts
/** Resolves an explicit session override before configured model/provider policy. */
export declare function resolveEffectiveAgentRuntime(params: {
  cfg: OpenClawConfig;
  provider: string;
  modelId: string;
  modelApi?: string | null;
  modelBaseUrl?: unknown;
  sessionEntry?: Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride" | "modelSelectionLocked">;
  /** Execution applies the implicit-runtime fallback that a turn would take. */
  mode?: "execution" | "projection";
} & AgentRuntimePolicyScope): string;
//#endregion
export { type ChatCommandDefinition, type CommandArgDefinition, type CommandArgValues, type CommandArgs, type CommandArgsParsing, type CommandAuthorization, type ModelsProviderData, type NativeCommandSpec, buildCommandTextFromArgs, canResolveCommandArgMenu, findCommandByNativeName, formatCommandArgMenuTitle, formatFastModeCommandOptions, formatFastModeCurrentStatus, formatFastModeSourceSuffix, formatFastModeStatusValue, hasControlCommand, listChatCommands, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listSkillCommandsForAgents, maybeResolveTextAlias, normalizeCommandBody, parseCommandArgs, prepareSkillCommandsForAgents, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandArgMenuAsync, resolveCommandAuthorization, resolveCommandAuthorizationAsync, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveFastModeState, resolveStoredModelOverride, resolveStoredModelOverrideAsync, serializeCommandArgs, shouldComputeCommandAuthorized };