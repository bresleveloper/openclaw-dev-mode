import { i as OpenClawConfig, tn as AgentDefaultsConfig } from "./types.openclaw-DlpCUWMr.js";
import { t as PluginManifestRecord } from "./manifest-registry-CggWNHxH.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Ce8glgog.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import { o as SessionEntry } from "./types-DP8esrTo.js";
import { g as VerboseLevel, p as ThinkLevel } from "./commands-registry.types-BMJ8ysZi.js";
import { Iu as MessagingToolSend, Pu as EmbeddedAgentRunMeta } from "./types-BVLQjFJF.js";
import { t as ModelCatalogEntry } from "./model-catalog.types-BIKbx2Sy.js";
import { t as CliDeps } from "./deps.types-BdV6g6qp.js";
import { o as OutboundSessionContext } from "./delivery-queue-D23eXJef.js";
import { l as projectOutboundPayloadPlanForJson } from "./deliver-BLGooXMz.js";
import { d as ToolExecutorRef, m as ToolPlanEntry, o as ToolAvailabilityContext, p as ToolPlan, r as JsonObject, s as ToolAvailabilityDiagnostic, t as BuildToolPlanOptions, u as ToolDescriptor } from "./types-vMGofiDd.js";
import { s as AcpSessionResolution, t as AcpSessionManager } from "./manager.core-DuSV3R7G.js";
import { n as AgentCommandOpts, r as AgentCommandResultMetaOverrides, t as AgentCommandIngressOpts } from "./types-DfY684CR.js";
//#region src/agents/auth-profiles/path-resolve.d.ts
/** Resolve the user-facing auth profile database path. */
declare function resolveAuthStorePathForDisplay(agentDir?: string): string;
//#endregion
//#region src/agents/identity-avatar.d.ts
type AgentAvatarResolution = {
  kind: "none";
  reason: string;
  source?: string;
} | {
  kind: "local";
  filePath: string;
  source: string;
} | {
  kind: "remote";
  url: string;
  source: string;
} | {
  kind: "data";
  url: string;
  source: string;
};
type AgentAvatarPublicSourceInput = {
  kind: AgentAvatarResolution["kind"];
  source?: string | null;
};
/** Return a safe public description of the configured avatar source. */
declare function resolvePublicAgentAvatarSource(resolved: AgentAvatarPublicSourceInput): string | undefined;
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
declare function resolveAgentAvatar(cfg: OpenClawConfig, agentId: string, opts?: {
  includeUiOverride?: boolean;
}): AgentAvatarResolution;
//#endregion
//#region src/agents/model-catalog-scope.d.ts
/** Resolves provider/model refs used to scope model catalog discovery. */
declare function resolveModelCatalogScope(params: {
  cfg?: OpenClawConfig;
  provider: string;
  model: string;
}): {
  providerRefs: string[];
  modelRefs: string[];
};
/** Extracts provider ids from resolved catalog scope refs for discovery calls. */
declare function resolveProviderDiscoveryProviderIdsForCatalogScope(params: {
  providerRefs?: readonly string[];
  modelRefs?: readonly string[];
}): string[] | undefined;
//#endregion
//#region src/tools/availability.d.ts
/** Evaluate one descriptor against runtime context and return hidden-tool diagnostics. */
declare function evaluateToolAvailability(params: {
  descriptor: ToolDescriptor;
  context?: ToolAvailabilityContext;
}): readonly ToolAvailabilityDiagnostic[];
//#endregion
//#region src/tools/descriptors.d.ts
/**
 * Identity helpers for authoring tool descriptors with stable inferred types.
 *
 * Callers use these at declaration sites so descriptor arrays keep readonly
 * shapes while still validating against the public ToolDescriptor contract.
 */
/** Define one tool descriptor without changing its runtime shape. */
declare function defineToolDescriptor(descriptor: ToolDescriptor): ToolDescriptor;
/** Define a readonly descriptor list without changing runtime order or entries. */
declare function defineToolDescriptors(descriptors: readonly ToolDescriptor[]): readonly ToolDescriptor[];
//#endregion
//#region src/tools/diagnostics.d.ts
/**
 * Diagnostics used when descriptor planning violates tool contract invariants.
 *
 * These are programmer errors, not availability diagnostics, so callers can
 * distinguish broken tool registration from intentionally hidden tools.
 */
/** Stable contract error code emitted by the tool planner. */
type ToolPlanContractErrorCode = "duplicate-tool-name" | "missing-executor";
/** Error thrown when a visible tool plan cannot be built from descriptors. */
declare class ToolPlanContractError extends Error {
  readonly code: ToolPlanContractErrorCode;
  readonly toolName: string;
  constructor(params: {
    code: ToolPlanContractErrorCode;
    toolName: string;
    message: string;
  });
}
//#endregion
//#region src/tools/execution.d.ts
/**
 * Formatting helpers for tool executor references.
 *
 * Executor refs are closed discriminated unions; the formatted string is for
 * diagnostics/logging and must not become a parser contract.
 */
/** Render an executor ref as a compact diagnostic label. */
declare function formatToolExecutorRef(ref: ToolExecutorRef): string;
//#endregion
//#region src/tools/planner.d.ts
/** Build the visible and hidden tool plan for a runtime context. */
declare function buildToolPlan(options: BuildToolPlanOptions): ToolPlan;
//#endregion
//#region src/tools/protocol.d.ts
type ToolProtocolDescriptor = {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: JsonObject;
};
declare function toToolProtocolDescriptor(entry: ToolPlanEntry): ToolProtocolDescriptor;
declare function toToolProtocolDescriptors(entries: readonly ToolPlanEntry[]): readonly ToolProtocolDescriptor[];
//#endregion
//#region src/agents/agent-runtime-config.d.ts
/** Loads runtime/source config and resolves command SecretRefs when the agent path needs them. */
declare function resolveAgentRuntimeConfig(runtime: RuntimeEnv, params?: {
  runtimeTargetsChannelSecrets?: boolean;
}): Promise<{
  loadedRaw: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  cfg: OpenClawConfig;
}>;
//#endregion
//#region src/agents/agent-command.d.ts
declare function resolveExplicitAgentCommandSessionKey(params: {
  rawExplicitSessionKey?: string;
  agentIdOverride?: string;
  shouldScopeDefaultAgentKey?: boolean;
  cfg: OpenClawConfig;
}): string | undefined;
declare function prepareAgentCommandExecution(opts: AgentCommandOpts, runtime: RuntimeEnv): Promise<{
  opts: AgentCommandOpts;
  body: string;
  transcriptBody: string;
  cfg: OpenClawConfig;
  configuredThinkingCatalog: ModelCatalogEntry[];
  normalizedSpawned: {
    spawnedBy?: string;
    groupId?: string;
    groupChannel?: string;
    groupSpace?: string;
    workspaceDir?: string;
  };
  agentCfg: AgentDefaultsConfig | undefined;
  thinkOverride: ThinkLevel | undefined;
  thinkOnce: ThinkLevel | undefined;
  verboseOverride: VerboseLevel | undefined;
  timeoutMs: number;
  runTimeoutOverrideMs: number | undefined;
  sessionId: string;
  sessionKey: string | undefined;
  sessionEntry: SessionEntry | undefined;
  sessionStore: Record<string, SessionEntry> | undefined;
  storePath: string;
  isNewSession: boolean;
  persistedThinking: ThinkLevel | undefined;
  persistedVerbose: VerboseLevel | undefined;
  sessionAgentId: string;
  outboundSession: OutboundSessionContext | undefined;
  workspaceDir: string;
  cwd: string | undefined;
  agentDir: string;
  pluginsEnabled: boolean;
  manifestMetadataSnapshot: PluginMetadataSnapshot | undefined;
  modelManifestContext: {
    manifestPlugins: readonly PluginManifestRecord[];
  };
  runId: string;
  isSubagentLane: boolean;
  acpManager: AcpSessionManager;
  acpResolution: AcpSessionResolution | null;
}>;
/** Runs an agent turn from CLI/runtime options against the resolved session and model policy. */
declare function agentCommand(opts: AgentCommandOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
  payloads: ReturnType<typeof projectOutboundPayloadPlanForJson>;
  meta: EmbeddedAgentRunMeta & AgentCommandResultMetaOverrides;
  didSendViaMessagingTool?: boolean;
  messagingToolSentTexts?: string[];
  messagingToolSentMediaUrls?: string[];
  messagingToolSentTargets?: MessagingToolSend[];
  deliverySucceeded?: boolean;
  deliveryStatus?: {
    requested: true;
    attempted: boolean;
    status: "sent" | "suppressed" | "partial_failed" | "failed";
    succeeded: true | false | "partial";
    error?: true;
    errorMessage?: string;
    reason?: string;
    resultCount?: number;
    sentBeforeError?: true;
    payloadOutcomes?: {
      index: number;
      status: "failed" | "sent" | "suppressed";
      reason?: string;
      resultCount?: number;
      sentBeforeError?: boolean;
      stage?: string;
      error?: string;
      hookEffect?: {
        cancelReason?: string;
        metadata?: Record<string, unknown>;
      };
    }[];
  };
}>;
/** Runs an agent turn from an inbound channel/gateway ingress context. */
declare function agentCommandFromIngress(opts: AgentCommandIngressOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
  payloads: ReturnType<typeof projectOutboundPayloadPlanForJson>;
  meta: EmbeddedAgentRunMeta & AgentCommandResultMetaOverrides;
  didSendViaMessagingTool?: boolean;
  messagingToolSentTexts?: string[];
  messagingToolSentMediaUrls?: string[];
  messagingToolSentTargets?: MessagingToolSend[];
  deliverySucceeded?: boolean;
  deliveryStatus?: {
    requested: true;
    attempted: boolean;
    status: "sent" | "suppressed" | "partial_failed" | "failed";
    succeeded: true | false | "partial";
    error?: true;
    errorMessage?: string;
    reason?: string;
    resultCount?: number;
    sentBeforeError?: true;
    payloadOutcomes?: {
      index: number;
      status: "failed" | "sent" | "suppressed";
      reason?: string;
      resultCount?: number;
      sentBeforeError?: boolean;
      stage?: string;
      error?: string;
      hookEffect?: {
        cancelReason?: string;
        metadata?: Record<string, unknown>;
      };
    }[];
  };
}>;
declare const testing: {
  resolveAgentRuntimeConfig: typeof resolveAgentRuntimeConfig;
  prepareAgentCommandExecution: typeof prepareAgentCommandExecution;
  resolveExplicitAgentCommandSessionKey: typeof resolveExplicitAgentCommandSessionKey;
};
//#endregion
export { resolveAuthStorePathForDisplay as _, toToolProtocolDescriptors as a, ToolPlanContractError as c, evaluateToolAvailability as d, resolveModelCatalogScope as f, resolvePublicAgentAvatarSource as g, resolveAgentAvatar as h, toToolProtocolDescriptor as i, defineToolDescriptor as l, AgentAvatarResolution as m, agentCommandFromIngress as n, buildToolPlan as o, resolveProviderDiscoveryProviderIdsForCatalogScope as p, testing as r, formatToolExecutorRef as s, agentCommand as t, defineToolDescriptors as u };