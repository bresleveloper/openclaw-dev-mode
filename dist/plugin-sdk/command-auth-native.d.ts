import { Uf as CommandAuthorization, Wf as resolveCommandAuthorization, _d as formatFastModeStatusValue, ad as resolveStoredModelOverride, gd as formatFastModeSourceSuffix, hd as formatFastModeCurrentStatus, md as formatFastModeCommandOptions, na as resolveCommandAuthorizedFromAuthorizers, ra as resolveControlCommandGate, rl as resolveFastModeState, yo as AgentRuntimePolicyScope } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { K as SessionEntry } from "../templating-OpWn1DzT.js";
import { n as CommandArgs, t as CommandArgValues } from "../commands-args.types-zglMcgeO.js";
import "../model-selection-BjQV-P1s.js";
import { a as CommandArgsParsing, l as NativeCommandSpec, r as CommandArgDefinition, t as ChatCommandDefinition } from "../commands-registry.types-D7aWP8HU.js";
import { i as shouldComputeCommandAuthorized, t as hasControlCommand } from "../command-detection-DZXbfVCk.js";
import { S as listChatCommands, a as findCommandByNativeName, c as listNativeCommandSpecs, d as parseCommandArgs, f as resolveCommandArgChoices, i as canResolveCommandArgMenu, l as listNativeCommandSpecsForConfig, m as serializeCommandArgs, o as formatCommandArgMenuTitle, p as resolveCommandArgMenu, r as buildCommandTextFromArgs, v as maybeResolveTextAlias, y as normalizeCommandBody } from "../commands-registry-CIZk0K9I.js";
import { n as resolveNativeCommandSessionTargets } from "../native-command-session-targets-BP3eEj-V.js";
import { n as ModelsProviderData } from "../commands-models-catalog-CqORffhx.js";
import { t as listSkillCommandsForAgents } from "../chat-commands-BCu4S1rS.js";
import { n as listProviderPluginCommandSpecs } from "../command-specs-Cdzft6IX.js";
//#region src/agents/thinking-runtime.d.ts
/** Resolves an explicit session override before configured model/provider policy. */
export declare function resolveEffectiveAgentRuntime(params: {
  cfg: OpenClawConfig;
  provider: string;
  modelId: string;
  modelApi?: string | null;
  modelBaseUrl?: unknown;
  sessionEntry?: Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride" | "modelSelectionLocked">;
} & AgentRuntimePolicyScope): string;
//#endregion
export { type ChatCommandDefinition, type CommandArgDefinition, type CommandArgValues, type CommandArgs, type CommandArgsParsing, type CommandAuthorization, type ModelsProviderData, type NativeCommandSpec, buildCommandTextFromArgs, canResolveCommandArgMenu, findCommandByNativeName, formatCommandArgMenuTitle, formatFastModeCommandOptions, formatFastModeCurrentStatus, formatFastModeSourceSuffix, formatFastModeStatusValue, hasControlCommand, listChatCommands, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listSkillCommandsForAgents, maybeResolveTextAlias, normalizeCommandBody, parseCommandArgs, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandAuthorization, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveFastModeState, resolveNativeCommandSessionTargets, resolveStoredModelOverride, serializeCommandArgs, shouldComputeCommandAuthorized };