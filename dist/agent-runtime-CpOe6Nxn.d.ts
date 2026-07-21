import { i as OpenClawConfig, on as AgentDefaultsConfig } from "./types.openclaw-B5gtuEn_.js";
import { t as PluginManifestRecord } from "./manifest-registry-CIZD-9A4.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-CW2n10_A.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import { s as SessionEntry } from "./types-r7E6AIEo.js";
import { o as VerboseLevel, r as ThinkLevel } from "./thinking.shared-0bZWY054.js";
import { $a as AgentCommandIngressOpts, $f as MessagingToolSend, Qf as EmbeddedAgentRunMeta, eo as AgentCommandOpts, to as AgentCommandResultMetaOverrides } from "./types-BpDhk2ev.js";
import { i as ModelCatalogEntry } from "./defaults-BMN5J5xk.js";
import { o as OutboundSessionContext } from "./delivery-queue-Cd5laaoQ.js";
import { l as projectOutboundPayloadPlanForJson } from "./deliver-ioR-uUD8.js";
import { t as CliDeps } from "./deps.types-BdV6g6qp.js";
import { s as AcpSessionResolution, t as AcpSessionManager } from "./manager.core-ByUL0fl0.js";
import { a as SerializedDurableMessagePayloadOutcome } from "./send-ru71i32k.js";
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
//#region src/tools/types.d.ts
/**
 * Public descriptor contracts for the generic OpenClaw tool planner.
 *
 * These types keep tool ownership, execution, availability, and protocol
 * metadata separate so core, plugins, channels, and MCP servers share one plan.
 */
/** JSON primitive accepted in descriptor schemas and availability context values. */
type JsonPrimitive = string | number | boolean | null;
/** Readonly JSON value accepted by public descriptor metadata. */
type JsonValue = JsonPrimitive | readonly JsonValue[] | {
  readonly [key: string]: JsonValue;
};
/** Readonly JSON object accepted by public descriptor metadata. */
type JsonObject = {
  readonly [key: string]: JsonValue;
};
/** Owner family responsible for defining a tool descriptor. */
type ToolOwnerRef = {
  readonly kind: "core";
} | {
  readonly kind: "plugin";
  readonly pluginId: string;
} | {
  readonly kind: "channel";
  readonly channelId: string;
  readonly pluginId?: string;
} | {
  readonly kind: "mcp";
  readonly serverId: string;
};
/** Runtime executor target used after a tool has passed availability planning. */
type ToolExecutorRef = {
  readonly kind: "core";
  readonly executorId: string;
} | {
  readonly kind: "plugin";
  readonly pluginId: string;
  readonly toolName: string;
} | {
  readonly kind: "channel";
  readonly channelId: string;
  readonly actionId: string;
} | {
  readonly kind: "mcp";
  readonly serverId: string;
  readonly toolName: string;
};
/** Atomic condition used to decide whether a tool is visible. */
type ToolAvailabilitySignal = {
  readonly kind: "always";
} | {
  readonly kind: "auth";
  readonly providerId: string;
} | {
  readonly kind: "config";
  readonly path: readonly string[];
  readonly check?: "exists" | "non-empty" | "available";
} | {
  readonly kind: "env";
  readonly name: string;
} | {
  readonly kind: "plugin-enabled";
  readonly pluginId: string;
} | {
  readonly kind: "context";
  readonly key: string;
  readonly equals?: JsonPrimitive;
};
/** Boolean expression over tool availability signals. */
type ToolAvailabilityExpression = ToolAvailabilitySignal | {
  readonly allOf: readonly ToolAvailabilityExpression[];
} | {
  readonly anyOf: readonly ToolAvailabilityExpression[];
};
/** Public descriptor for a tool before runtime availability planning. */
type ToolDescriptor = {
  readonly name: string;
  readonly title?: string;
  readonly description: string;
  readonly inputSchema: JsonObject;
  readonly outputSchema?: JsonObject;
  readonly owner: ToolOwnerRef;
  readonly executor?: ToolExecutorRef;
  readonly availability?: ToolAvailabilityExpression;
  readonly annotations?: JsonObject;
  readonly sortKey?: string;
};
/** Runtime facts used to evaluate descriptor availability expressions. */
type ToolAvailabilityContext = {
  readonly authProviderIds?: ReadonlySet<string>;
  readonly config?: JsonObject;
  readonly isConfigValueAvailable?: (params: {
    readonly value: JsonValue;
    readonly path: readonly string[];
    readonly signal: Extract<ToolAvailabilitySignal, {
      readonly kind: "config";
    }>;
  }) => boolean;
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly enabledPluginIds?: ReadonlySet<string>;
  readonly values?: Readonly<Record<string, JsonPrimitive | undefined>>;
};
/** Stable reason code for an unavailable descriptor. */
type ToolUnavailableReason = "auth-missing" | "config-missing" | "context-mismatch" | "env-missing" | "plugin-disabled" | "unsupported-signal";
/** Diagnostic explaining why a descriptor is hidden from the visible plan. */
type ToolAvailabilityDiagnostic = {
  readonly reason: ToolUnavailableReason;
  readonly signal?: ToolAvailabilitySignal;
  readonly message: string;
};
/** Visible, callable tool entry selected by the planner. */
type ToolPlanEntry = {
  readonly descriptor: ToolDescriptor;
  readonly executor: ToolExecutorRef;
};
/** Hidden descriptor plus diagnostics explaining why it is unavailable. */
type HiddenToolPlanEntry = {
  readonly descriptor: ToolDescriptor;
  readonly diagnostics: readonly ToolAvailabilityDiagnostic[];
};
/** Complete planner output split into visible and hidden descriptors. */
type ToolPlan = {
  readonly visible: readonly ToolPlanEntry[];
  readonly hidden: readonly HiddenToolPlanEntry[];
};
/** Inputs required to build a tool plan. */
type BuildToolPlanOptions = {
  readonly descriptors: readonly ToolDescriptor[];
  readonly availability?: ToolAvailabilityContext;
};
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
  runtimeChannelSecretScope?: {
    channel: string;
    accountId?: string;
  };
}): Promise<{
  loadedRaw: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  cfg: OpenClawConfig;
}>;
//#endregion
//#region src/agents/agent-command.d.ts
declare function resolveAgentRunLifecycleEndLogLevel(meta: {
  aborted?: unknown;
  error?: unknown;
  stopReason?: unknown;
  livenessState?: unknown;
  timeoutPhase?: unknown;
  providerStarted?: unknown;
}): "info" | "warn" | "error" | undefined;
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
declare function agentCommandInternal(initialOpts: AgentCommandOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
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
    payloadOutcomes?: SerializedDurableMessagePayloadOutcome[];
  };
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
    payloadOutcomes?: SerializedDurableMessagePayloadOutcome[];
  };
}>;
/** Resolve the channel label for model.usage diagnostics from ingress run options. */
declare function ingressDiagnosticChannel(opts: AgentCommandIngressOpts): string;
/**
 * Emit a model.usage diagnostic event after an ingress agent run completes.
 *
 * Unlike channel/cron paths which emit model.usage in runReplyAgent /
 * finalizeCronRun, the ingress path has no such existing emission — without
 * this every diagnostics consumer (Langfuse bridge, @openclaw/diagnostics-otel,
 * diagnostics-prometheus) sees usage/cost only for webchat/cli/cron turns
 * and is blind to HTTP API traffic (POST /v1/responses, POST /v1/chat/completions,
 * and node-event dispatch).
 */
declare function emitIngressModelUsageDiagnostic(result: NonNullable<Awaited<ReturnType<typeof agentCommandInternal>>>, opts: AgentCommandIngressOpts): void;
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
    payloadOutcomes?: SerializedDurableMessagePayloadOutcome[];
  };
}>;
declare const testing: {
  resolveAgentRuntimeConfig: typeof resolveAgentRuntimeConfig;
  prepareAgentCommandExecution: typeof prepareAgentCommandExecution;
  resolveExplicitAgentCommandSessionKey: typeof resolveExplicitAgentCommandSessionKey;
  resolveAgentRunLifecycleEndLogLevel: typeof resolveAgentRunLifecycleEndLogLevel;
  ingressDiagnosticChannel: typeof ingressDiagnosticChannel;
  emitIngressModelUsageDiagnostic: typeof emitIngressModelUsageDiagnostic;
};
//#endregion
export { resolveAgentAvatar as A, ToolOwnerRef as C, resolveModelCatalogScope as D, ToolUnavailableReason as E, resolveAuthStorePathForDisplay as M, resolveProviderDiscoveryProviderIdsForCatalogScope as O, ToolExecutorRef as S, ToolPlanEntry as T, ToolAvailabilityContext as _, toToolProtocolDescriptors as a, ToolAvailabilitySignal as b, ToolPlanContractError as c, evaluateToolAvailability as d, BuildToolPlanOptions as f, JsonValue as g, JsonPrimitive as h, toToolProtocolDescriptor as i, resolvePublicAgentAvatarSource as j, AgentAvatarResolution as k, defineToolDescriptor as l, JsonObject as m, agentCommandFromIngress as n, buildToolPlan as o, HiddenToolPlanEntry as p, testing as r, formatToolExecutorRef as s, agentCommand as t, defineToolDescriptors as u, ToolAvailabilityDiagnostic as v, ToolPlan as w, ToolDescriptor as x, ToolAvailabilityExpression as y };