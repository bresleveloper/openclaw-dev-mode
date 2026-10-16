import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { k as SessionEntry } from "../reply-payload-DazZPys5.js";
import "../defaults-D0SAbcb2.js";
import { Fu as formatFastModeCurrentStatus, Iu as formatFastModeSourceSuffix, Lu as formatFastModeStatusValue, Pu as formatFastModeCommandOptions, Td as resolveCommandAuthorization, Vo as resolveFastModeState, hi as AgentRuntimePolicyScope, oo as resolveCommandAuthorizedFromAuthorizers, so as resolveControlCommandGate, wd as CommandAuthorization, ys as resolveStoredModelOverride } from "../agent-harness-runtime-DZjstJNb.js";
import { n as CommandArgs, t as CommandArgValues } from "../commands-args.types-zglMcgeO.js";
import { b as ChannelMessagingAdapter } from "../types.core-Bra2QBA5.js";
import { i as CommandArgsParsing, o as NativeCommandSpec, r as CommandArgDefinition, t as ChatCommandDefinition } from "../commands-registry.types-jZJZUR9T.js";
import { i as shouldComputeCommandAuthorized, t as hasControlCommand } from "../command-detection-CHU9Z4Wq.js";
import { a as listNativeCommandSpecs, c as parseCommandArgs, d as serializeCommandArgs, f as maybeResolveTextAlias, i as formatCommandArgMenuTitle, l as resolveCommandArgChoices, m as listChatCommands, n as canResolveCommandArgMenu, o as listNativeCommandSpecsForConfig, p as normalizeCommandBody, r as findCommandByNativeName, t as buildCommandTextFromArgs, u as resolveCommandArgMenu } from "../commands-registry-BaDuTseL.js";
import { n as ModelsProviderData } from "../commands-models-catalog-tFbmIe35.js";
import { t as listSkillCommandsForAgents } from "../chat-commands-CV1BrTct.js";
import { n as listProviderPluginCommandSpecs } from "../command-specs-DfHc1c3k.js";
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
export { type ChatCommandDefinition, type CommandArgDefinition, type CommandArgValues, type CommandArgs, type CommandArgsParsing, type CommandAuthorization, type ModelsProviderData, type NativeCommandSpec, buildCommandTextFromArgs, canResolveCommandArgMenu, findCommandByNativeName, formatCommandArgMenuTitle, formatFastModeCommandOptions, formatFastModeCurrentStatus, formatFastModeSourceSuffix, formatFastModeStatusValue, hasControlCommand, listChatCommands, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listSkillCommandsForAgents, maybeResolveTextAlias, normalizeCommandBody, parseCommandArgs, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandAuthorization, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveFastModeState, resolveStoredModelOverride, serializeCommandArgs, shouldComputeCommandAuthorized };