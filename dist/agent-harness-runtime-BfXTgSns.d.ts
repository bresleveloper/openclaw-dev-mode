import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { M as MemoryCitationsMode } from "./types.tools-CBCgJD1K.js";
import { l as ImageContent } from "./types-CFIUY_La.js";
import { o as ModelCompatConfig } from "./types.models-BvJnk7Su.js";
import { f as AgentToolResult, l as AgentTool, s as AgentMessage } from "./types-D0CdrmU4.js";
import { a as SourceReplyDeliveryMode, s as PromptImageOrderEntry } from "./types-C5Sz_b28.js";
import { _ as InboundEventKind, h as PluginHookChannelContext } from "./templating-Bl_fNKHX.js";
import { s as AuthProfileStore } from "./types-Dd5DQ7z0.js";
import { o as ChannelAgentTool } from "./types.core-TwXPgPau.js";
import { t as OperatorScope } from "./operator-scopes-Phea7r7e.js";
import { n as CrestodianToolOptions } from "./crestodian-tool-LuFL-64B.js";
import { r as AnyAgentTool } from "./common-CZ-od2BP.js";
import { P as PluginHookContextWindowSource, X as PluginHookLlmInputEvent, Z as PluginHookLlmOutputEvent, d as PluginHookAgentEndEvent, f as PluginHookBeforeAgentFinalizeEvent, ln as PluginHookBeforeAgentStartResult, u as PluginHookAgentContext } from "./hook-types-07I6fmma.js";
import { $c as ContextEngineRuntimeSettings, $f as MessagingToolSend, Ca as CodexAppServerExtensionFactory, Da as AgentToolResultMiddleware, Hc as ContextEngine, Hf as ProviderRuntimeModel, Ho as ToolOutcomeObserver, Io as AgentRuntimePlan, Lo as BuildAgentRuntimePlanParams, Mo as EmbeddedRunAttemptParams, No as EmbeddedRunAttemptResult, Oa as AgentToolResultMiddlewareContext, Pa as OpenClawAgentToolResult, Po as PreemptiveCompactionRoute, Ro as BeforeToolCallFailureDisposition, Sa as CodexAppServerExtensionContext, Ta as CodexAppServerToolResultEvent, Uf as ProviderRuntimePluginHandle, Vc as CompactResult, Xc as ContextEngineRuntimeContext, Xu as EmbeddedRunTrigger, Yc as ContextEnginePromptCacheInfo, do as EmbeddedAgentQueueMessageOptions, ka as AgentToolResultMiddlewareEvent, ld as BootstrapContextRunKind, qo as requestDeferredPluginToolApproval, ro as ProcessToolDefaults, ud as ExecToolDefaults, ul as TranscriptRewriteResult, yd as ModelAuthMode, zc as AssembleResult } from "./types-BpDhk2ev.js";
import { t as DiagnosticTraceContext } from "./diagnostic-trace-context-c5mRZYEt.js";
import { a as SkillUsagePath, r as SkillSnapshot } from "./types-DKGs3QG0.js";
import { g as SandboxFsBridge, n as SandboxContext } from "./types-34KlOMUq.js";
import { n as FailoverReason } from "./types-CF0DHR3y.js";
import { n as NormalizedUsage } from "./usage-DjdNXvuF.js";
import { t as SubsystemLogger } from "./subsystem-CfQVin8T.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-vsMUEMuJ.js";
import { n as ContextEngineHostSupport } from "./host-compat-D5HskTQa.js";
import { t as BundleMcpDiagnostic } from "./bundle-mcp-DABlFCpS.js";
import { t as ResolvedConversationCapabilityProfile } from "./conversation-capability-profile-DLr2mv9S.js";
import { n as ToolSearchCatalogToolExecutor, t as ToolSearchCatalogRef } from "./tool-search-DNdbXhbP.js";
import { t as SessionWriteLockAcquireTimeoutConfig } from "./session-write-lock-CTGMQVOj.js";
import { TSchema } from "typebox";
import { RuntimeToolInputSchemaJson, RuntimeToolInputSchemaProjection, projectRuntimeToolInputSchema as projectRuntimeToolInputSchema$1 } from "@openclaw/ai/internal/openai";

//#region src/agents/codex-mcp-config.types.d.ts
/** Codex app-server `mcp_servers` config map. */
type CodexMcpServersConfig = Record<string, Record<string, unknown>>;
/** Loaded Codex thread-config patch plus diagnostics and cache metadata. */
type CodexBundleMcpThreadConfig = {
  configPatch?: {
    mcp_servers: CodexMcpServersConfig;
  };
  diagnostics: BundleMcpDiagnostic[];
  evaluated: boolean;
  fingerprint?: string;
};
/** Inputs used to load a Codex bundle-MCP thread config patch. */
type LoadCodexBundleMcpThreadConfigParams = {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  toolsEnabled?: boolean;
  disableTools?: boolean;
  toolsAllow?: string[];
};
//#endregion
//#region src/agents/embedded-agent-message-tool-source-reply.d.ts
/** Return true only when a messaging tool result proves a real visible delivery. */
declare function isDeliveredMessagingToolResult(params: {
  toolName?: string;
  args?: unknown;
  result?: unknown;
  hookResult?: unknown;
  isError?: boolean;
}): boolean;
/**
 * Only implicit-route, non-dry-run, delivered `message.send` calls qualify.
 * Explicit routes and other messaging tools are outbound side effects, not source replies.
 */
declare function isDeliveredMessageToolOnlySourceReplyResult(params: {
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  toolName: string;
  args?: unknown;
  result?: unknown;
  hookResult?: unknown;
  isError?: boolean;
  allowExplicitSourceRoute?: boolean;
}): boolean;
//#endregion
//#region src/agents/harness/user-input-bridge.d.ts
type AgentHarnessUserInputOption = {
  label: string;
  description?: string;
};
type AgentHarnessUserInputQuestion = {
  id: string;
  header: string;
  question: string;
  isOther?: boolean;
  isSecret?: boolean;
  options?: readonly AgentHarnessUserInputOption[] | null;
};
type AgentHarnessUserInputAnswers = {
  answers: Record<string, {
    answers: string[];
  }>;
};
type AgentHarnessUserInputPromptOptions = {
  intro?: string;
  formatText?: (text: string) => string;
  secretWarning?: string;
  otherLabel?: string;
};
type PromptDeliveryParams = Pick<EmbeddedRunAttemptParams, "onBlockReply" | "onPartialReply">;
declare function emptyAgentHarnessUserInputAnswers(): AgentHarnessUserInputAnswers;
declare function formatAgentHarnessUserInputPrompt(questions: readonly AgentHarnessUserInputQuestion[], options?: AgentHarnessUserInputPromptOptions): string;
declare function deliverAgentHarnessUserInputPrompt(params: PromptDeliveryParams, questions: readonly AgentHarnessUserInputQuestion[], options?: AgentHarnessUserInputPromptOptions): Promise<void>;
declare function buildAgentHarnessUserInputAnswers(questions: readonly AgentHarnessUserInputQuestion[], inputText: string): AgentHarnessUserInputAnswers;
declare function normalizeAgentHarnessUserInputAnswer(answer: string, question: AgentHarnessUserInputQuestion): string | undefined;
//#endregion
//#region src/agents/harness/native-hook-relay.d.ts
type JsonValue = null | boolean | number | string | JsonValue[] | {
  [key: string]: JsonValue;
};
declare const NATIVE_HOOK_RELAY_EVENTS: readonly ["pre_tool_use", "post_tool_use", "permission_request", "before_agent_finalize"];
declare const NATIVE_HOOK_RELAY_PROVIDERS: readonly ["codex"];
type NativeHookRelayEvent = (typeof NATIVE_HOOK_RELAY_EVENTS)[number];
type NativeHookRelayProvider = (typeof NATIVE_HOOK_RELAY_PROVIDERS)[number];
type NativeHookRelayInvocation = {
  provider: NativeHookRelayProvider;
  relayId: string;
  event: NativeHookRelayEvent;
  nativeEventName?: string;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  runId: string;
  cwd?: string;
  model?: string;
  turnId?: string;
  transcriptPath?: string;
  permissionMode?: string;
  stopHookActive?: boolean;
  lastAssistantMessage?: string;
  toolName?: string;
  toolUseId?: string;
  rawPayload: JsonValue;
  receivedAt: string;
};
type NativeHookRelayProcessResponse = {
  stdout: string;
  stderr: string;
  exitCode: number;
  failureDisposition?: Exclude<BeforeToolCallFailureDisposition, "blocked">;
};
type NativeHookRelayRegistration = {
  relayId: string;
  provider: NativeHookRelayProvider;
  generationMismatchGraceExpiresAtMs?: number;
  generationMismatchGraceAcceptedGeneration?: string;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  config?: OpenClawConfig;
  runId: string;
  channelId?: string;
  allowedEvents: readonly NativeHookRelayEvent[];
  expiresAtMs: number;
  signal?: AbortSignal;
  onPreToolUseFailure?: (failure: {
    toolName: string;
    toolCallId: string;
    disposition: Exclude<BeforeToolCallFailureDisposition, "blocked">;
    durationMs: number;
  }) => void | Promise<void>;
};
type NativeHookRelayRegistrationHandle = NativeHookRelayRegistration & {
  generation?: string;
  shouldRelayEvent: (event: NativeHookRelayEvent) => boolean;
  commandForEvent: (event: NativeHookRelayEvent, options?: NativeHookRelayCommandForEventOptions) => string;
  renew: (ttlMs?: number) => void;
  unregister: () => void;
};
type RegisterNativeHookRelayParams = {
  provider: NativeHookRelayProvider;
  relayId?: string;
  generation?: string;
  generationMismatchGraceMs?: number;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  config?: OpenClawConfig;
  runId: string;
  channelId?: string;
  allowedEvents?: readonly NativeHookRelayEvent[];
  ttlMs?: number;
  command?: NativeHookRelayCommandOptions;
  signal?: AbortSignal;
  onPreToolUseFailure?: NativeHookRelayRegistration["onPreToolUseFailure"];
};
type NativeHookRelayCommandOptions = {
  executable?: string;
  nice?: number | false;
  nodeExecutable?: string;
  timeoutMs?: number;
};
type NativeHookRelayCommandForEventOptions = {
  timeoutMs?: number;
};
type InvokeNativeHookRelayParams = {
  provider: unknown;
  relayId: unknown;
  generation?: unknown;
  event: unknown;
  rawPayload: unknown;
  requireGeneration?: boolean;
};
type NativeHookRelayPermissionDecision = "allow" | "deny";
type NativeHookRelayPermissionApprovalResult = NativeHookRelayPermissionDecision | "allow-always" | "defer";
type ActiveNativeHookRelayRegistrationHandle = NativeHookRelayRegistrationHandle & {
  generation: string;
};
type NativeHookRelayPermissionApprovalRequest = {
  provider: NativeHookRelayProvider;
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
  runId: string;
  toolName: string;
  toolCallId?: string;
  cwd?: string;
  model?: string;
  toolInput: Record<string, JsonValue>;
  signal?: AbortSignal;
};
type NativeHookRelayPermissionApprovalRequester = (request: NativeHookRelayPermissionApprovalRequest) => Promise<NativeHookRelayPermissionApprovalResult>;
type NativeHookRelayDeferredToolApprovalRequester = typeof requestDeferredPluginToolApproval;
type NativeHookRelayDeferredApprovalOutcome = {
  handled: true;
  outcome: "approved-once";
} | {
  handled: true;
  outcome: "denied";
  reason: string;
  failureDisposition?: Exclude<BeforeToolCallFailureDisposition, "blocked">;
};
declare function registerNativeHookRelay(params: RegisterNativeHookRelayParams): ActiveNativeHookRelayRegistrationHandle;
declare function buildNativeHookRelayCommand(params: {
  provider: NativeHookRelayProvider;
  relayId: string;
  generation?: string;
  event: NativeHookRelayEvent;
  preToolUseUnavailable?: "noop";
  timeoutMs?: number;
  executable?: string;
  nice?: number | false;
  nodeExecutable?: string;
}): string;
declare function invokeNativeHookRelay(params: InvokeNativeHookRelayParams): Promise<NativeHookRelayProcessResponse>;
declare function hasNativeHookRelayInvocation(params: {
  relayId: string;
  event: NativeHookRelayEvent;
  toolUseId?: string;
}): boolean;
declare function resolveNativeHookRelayDeferredToolApproval(params: {
  relayId: string;
  toolUseId?: string;
  signal?: AbortSignal;
}): Promise<NativeHookRelayDeferredApprovalOutcome | undefined>;
declare const testing: {
  readonly clearNativeHookRelaysForTests: () => void;
  readonly getNativeHookRelayInvocationsForTests: () => NativeHookRelayInvocation[];
  readonly getNativeHookRelayRegistrationForTests: (relayId: string) => NativeHookRelayRegistration | undefined;
  readonly getNativeHookRelayBridgeDirForTests: () => string;
  readonly getNativeHookRelayBridgeRegistryPathForTests: (relayId: string) => string;
  readonly getNativeHookRelayBridgeRecordForTests: (relayId: string) => Record<string, unknown> | undefined;
  readonly isNativeHookRelayBridgeLookupRetryableForTests: (error: unknown, elapsedMs?: number) => boolean;
  readonly formatPermissionApprovalDescriptionForTests: (request: NativeHookRelayPermissionApprovalRequest) => string;
  readonly permissionRequestContentFingerprintForTests: (request: NativeHookRelayPermissionApprovalRequest) => string;
  readonly permissionRequestToolInputKeyFingerprintForTests: (toolInput: Record<string, unknown>) => string;
  readonly setNativeHookRelayPermissionApprovalRequesterForTests: (requester: NativeHookRelayPermissionApprovalRequester) => void;
  readonly setNativeHookRelayDeferredToolApprovalRequesterForTests: (requester: NativeHookRelayDeferredToolApprovalRequester) => void;
};
//#endregion
//#region src/plugins/hook-agent-context.d.ts
/** Builds channel/provider fields for plugin agent hook context. */
declare function buildAgentHookContextChannelFields(params: {
  sessionKey?: string | null;
  messageChannel?: string | null;
  messageProvider?: string | null;
  currentChannelId?: string | null;
  messageTo?: string | null;
  senderId?: string | null;
}): Pick<PluginHookAgentContext, "channel" | "channelId" | "chatId" | "messageProvider" | "senderId">;
//#endregion
//#region src/agents/run-cleanup-timeout.d.ts
type AgentCleanupLogger = {
  warn: (message: string) => void;
};
/** Run one cleanup step with timeout logging and late-rejection handling. */
declare function runAgentCleanupStep(params: {
  runId: string;
  sessionId: string;
  step: string;
  cleanup: () => Promise<void>;
  getTimeoutDetails?: () => string | undefined;
  log: AgentCleanupLogger;
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
}): Promise<void>;
//#endregion
//#region src/agents/run-termination.d.ts
/**
 * Shared agent run termination constants.
 *
 * Runtime and stream consumers use these stable literals to recognize user or
 * controller aborts without matching free-form error text.
 */
/** Stop reason emitted when an agent run is aborted. */
declare const AGENT_RUN_ABORTED_STOP_REASON: "aborted";
/** Error text used for aborted agent runs. */
declare const AGENT_RUN_RESTART_ABORT_STOP_REASON: "restart";
declare function resolveAgentRunAbortLifecycleFields(signal: AbortSignal | undefined): {
  aborted?: true;
  stopReason?: typeof AGENT_RUN_ABORTED_STOP_REASON | typeof AGENT_RUN_RESTART_ABORT_STOP_REASON | "timeout";
};
//#endregion
//#region src/agents/embedded-agent-runner/logger.d.ts
/**
 * Shared logger for embedded-agent runner internals.
 */
declare const log: SubsystemLogger;
//#endregion
//#region src/agents/runtime-plan/build.d.ts
/** Build the complete runtime plan for an embedded agent attempt. */
declare function buildAgentRuntimePlan(params: BuildAgentRuntimePlanParams): AgentRuntimePlan;
//#endregion
//#region src/agents/model-fallback.d.ts
type ModelFallbackResultClassification = {
  message: string;
  reason?: FailoverReason;
  status?: number;
  code?: string;
  rawError?: string;
  preserveResultOnExhaustion?: boolean;
  preserveResultPriority?: number;
} | {
  error: unknown;
} | null | undefined;
//#endregion
//#region src/agents/embedded-agent-runner/result-fallback-classifier.d.ts
/** Returns a fallback classification when an embedded run failed without user-visible output. */
declare function classifyEmbeddedAgentRunResultForModelFallback(params: {
  provider: string;
  model: string;
  result: unknown;
  hasDirectlySentBlockReply?: boolean;
  hasBlockReplyPipelineOutput?: boolean;
}): ModelFallbackResultClassification;
//#endregion
//#region src/agents/tools/gateway.d.ts
/** Optional gateway connection overrides accepted by agent tools. */
type GatewayCallOptions = {
  gatewayUrl?: string;
  gatewayToken?: string;
  timeoutMs?: number;
};
/**
 * Calls a gateway method as the agent-tool backend client with least-privilege scopes.
 */
declare function callGatewayTool<T = Record<string, unknown>>(method: string, opts: GatewayCallOptions, params?: unknown, extra?: {
  expectFinal?: boolean;
  scopes?: OperatorScope[];
}): Promise<T>;
//#endregion
//#region src/shared/node-list-types.d.ts
/** Node record returned by gateway node-list endpoints. */
type NodeListNode = {
  nodeId: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  clientId?: string;
  clientMode?: string;
  remoteIp?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  pathEnv?: string;
  caps?: string[];
  commands?: string[];
  permissions?: Record<string, boolean>;
  approvalState?: "approved" | "pending-approval" | "pending-reapproval" | "unapproved";
  pendingRequestId?: string;
  pendingDeclaredCaps?: string[];
  pendingDeclaredCommands?: string[];
  pendingDeclaredPermissions?: Record<string, boolean>;
  paired?: boolean;
  connected?: boolean;
  connectedAtMs?: number;
  lastSeenAtMs?: number;
  lastSeenReason?: string;
  approvedAtMs?: number;
};
//#endregion
//#region src/agents/tools/nodes-utils.d.ts
type DefaultNodeFallback = "none" | "first";
type DefaultNodeSelectionOptions = {
  capability?: string;
  fallback?: DefaultNodeFallback;
  preferLocalMac?: boolean;
};
/** Selects the implicit node target when a tool call omits an explicit node query. */
declare function selectDefaultNodeFromList(nodes: NodeListNode[], options?: DefaultNodeSelectionOptions): NodeListNode | null;
/** Lists Gateway nodes, falling back to paired-node records for older Gateway versions. */
declare function listNodes(opts: GatewayCallOptions): Promise<NodeListNode[]>;
/** Resolves a node id from an already-loaded node list using shared node matching rules. */
declare function resolveNodeIdFromList(nodes: NodeListNode[], query?: string, allowDefault?: boolean): string;
//#endregion
//#region src/auto-reply/tool-meta.d.ts
type ToolAggregateOptions = {
  markdown?: boolean;
};
/** Formats one grouped tool-progress label from a tool name and metadata entries. */
declare function formatToolAggregate(toolName?: string, metas?: string[], options?: ToolAggregateOptions): string;
//#endregion
//#region src/agents/embedded-agent-messaging.d.ts
/** Return true for core or channel-plugin messaging tool names. */
declare function isMessagingTool(toolName: string): boolean;
/** Return true when the specific tool invocation is an outbound send. */
declare function isMessagingToolSendAction(toolName: string, args: Record<string, unknown>): boolean;
//#endregion
//#region src/agents/tool-result-error.d.ts
declare function isToolResultError(result: unknown): boolean;
type ToolResultFailureKind = "blocked" | "cancelled" | "failed" | "timed_out";
/** Classify a thrown tool error without inferring cancellation from message text. */
declare function resolveToolExecutionErrorKind(error: unknown): "failed" | "timed_out";
/** Format a redacted tool error without allowing hostile getters to escape observability. */
declare function formatToolExecutionErrorMessage(error: unknown, fallback: string): string;
/** Classify a resolved structured tool result through the shared terminal contract. */
declare function resolveToolResultFailureKind(result: unknown): ToolResultFailureKind | undefined;
//#endregion
//#region src/agents/embedded-agent-subscribe.tools.d.ts
declare function sanitizeToolResult(result: unknown): unknown;
declare function filterToolResultMediaUrls(toolName: string | undefined, mediaUrls: string[], result?: unknown, trustedLocalMediaToolNames?: ReadonlySet<string>): string[];
/**
 * Extract media file paths from a tool result.
 *
 * Strategy (first match wins):
 * 1. Read structured `details.media` attachments from tool details.
 * 2. Fall back to `details.path` when image content exists (legacy imageResult).
 *
 * Returns an empty array when no media is found (e.g. embedded `read` tool
 * returns base64 image data but no file path; those need a different delivery
 * path like saving to a temp file).
 */
type ToolResultMediaArtifact = {
  mediaUrls: string[];
  audioAsVoice?: boolean;
  trustedLocalMedia?: boolean;
};
declare function extractToolResultMediaArtifact(result: unknown): ToolResultMediaArtifact | undefined;
declare function extractToolErrorMessage(result: unknown): string | undefined;
declare function extractMessagingToolSend(toolName: string, args: Record<string, unknown>, options?: {
  config?: OpenClawConfig;
  currentChannelId?: string;
  currentMessagingTarget?: string;
  currentThreadId?: string;
  currentMessageId?: string | number;
  replyToMode?: "off" | "first" | "all" | "batched";
  hasRepliedRef?: {
    value: boolean;
  };
}): MessagingToolSend | undefined;
/** Reconciles pending send evidence with the provider's successful action result. */
declare function extractMessagingToolSendResult(pending: MessagingToolSend, result: unknown): MessagingToolSend;
//#endregion
//#region src/agents/model-tool-support.d.ts
/**
 * Model capability helper for tool-use support.
 *
 * Provider catalogs can opt a model out via `compat.supportsTools === false`;
 * absent metadata remains permissive for older catalog entries.
 */
/** Returns whether a catalog model should be offered tool calls. */
declare function supportsModelTools(model: {
  compat?: unknown;
}): boolean;
//#endregion
//#region src/agents/tool-replay-safety.d.ts
/**
 * Tool names are not ownership boundaries. Callers must reject plugin/channel
 * instances before using this audited core-tool allowlist.
 */
declare function isAgentToolReplaySafe(tool: {
  name?: string;
}, options?: {
  declaredReplaySafe?: (tool: {
    name?: string;
  }) => boolean | undefined;
}): boolean;
//#endregion
//#region src/agents/channel-tool-metadata.d.ts
type ChannelAgentToolMeta = {
  channelId: string;
};
/** Read channel metadata attached to a channel-owned agent tool. */
declare function getChannelAgentToolMeta(tool: ChannelAgentTool): ChannelAgentToolMeta | undefined;
//#endregion
//#region src/agents/skill-workshop-prompt.d.ts
/**
 * System-prompt contribution for routing durable skill edits through the
 * Skill Workshop tool instead of direct filesystem writes.
 */
declare const SKILL_WORKSHOP_TOOL_NAME = "skill_workshop";
/** Build the system-prompt section for Skill Workshop routing rules. */
declare function buildSkillWorkshopPromptSection(): string[];
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.prompt-helpers.d.ts
declare function resolveAttemptFsWorkspaceOnly(params: {
  config?: OpenClawConfig;
  sessionAgentId: string;
}): boolean;
type AfterTurnRuntimeContextAttempt = Pick<EmbeddedRunAttemptParams, "sessionKey" | "sandboxSessionKey" | "messageChannel" | "messageProvider" | "agentAccountId" | "currentChannelId" | "currentThreadTs" | "currentMessageId" | "config" | "skillsSnapshot" | "senderId" | "provider" | "modelId" | "agentHarnessId" | "thinkLevel" | "reasoningLevel" | "bashElevated" | "extraSystemPrompt" | "ownerNumbers" | "authProfileId"> & {
  sessionId?: EmbeddedRunAttemptParams["sessionId"];
};
/** Build runtime context passed into context-engine afterTurn hooks. */
declare function buildAfterTurnRuntimeContext(params: {
  attempt: AfterTurnRuntimeContextAttempt;
  workspaceDir: string;
  cwd?: string;
  agentDir: string;
  activeAgentId?: string;
  contextEnginePluginId?: string;
  tokenBudget?: number;
  currentTokenCount?: number;
  promptCache?: ContextEnginePromptCacheInfo;
}): ContextEngineRuntimeContext;
declare function buildAfterTurnRuntimeContextFromUsage(params: Omit<Parameters<typeof buildAfterTurnRuntimeContext>[0], "currentTokenCount"> & {
  lastCallUsage?: NormalizedUsage;
}): ContextEngineRuntimeContext;
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.thread-helpers.d.ts
/**
 * Returns the workspace path that must be mounted for sandboxed spawn attempts.
 * Read-only sandbox modes need the resolved workspace explicitly; full rw
 * access uses the normal workspace wiring.
 */
declare function resolveAttemptSpawnWorkspaceDir(params: {
  sandbox?: {
    enabled?: boolean;
    workspaceAccess?: string;
  } | null;
  resolvedWorkspace: string;
}): string | undefined;
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.tool-run-context.d.ts
/**
 * Builds the stable tool-run context forwarded into an embedded-attempt execution.
 */
declare function buildEmbeddedAttemptToolRunContext(params: {
  trigger?: EmbeddedRunTrigger;
  jobId?: string;
  memoryFlushWritePath?: string;
  toolsAllow?: string[];
  trace?: DiagnosticTraceContext;
}): {
  trigger?: EmbeddedRunTrigger;
  jobId?: string;
  memoryFlushWritePath?: string;
  runtimeToolAllowlist?: string[];
  trace?: DiagnosticTraceContext;
};
//#endregion
//#region src/agents/tools/cron-tool.d.ts
type CronCreatorToolAllowlistEntry = string | {
  name: string;
  pluginId?: string;
};
//#endregion
//#region src/agents/agent-tools.d.ts
type OpenClawCodingToolConstructionPlan = {
  includeBaseCodingTools: boolean;
  includeShellTools: boolean;
  includeChannelTools: boolean;
  includeOpenClawTools: boolean;
  includePluginTools: boolean;
};
/** Build the runtime tool list for one agent run. */
declare function createOpenClawCodingTools(options?: {
  agentId?: string;
  exec?: ExecToolDefaults & ProcessToolDefaults;
  messageProvider?: string; /** Canonical transport channel when tool-policy provider differs from delivery channel. */
  messageChannel?: string; /** Normalized conversation kind when the caller already has channel metadata. */
  chatType?: ChatType; /** Specific ingress provider used only for transport tool availability. */
  toolPolicyMessageProvider?: string;
  agentAccountId?: string;
  messageTo?: string;
  messageThreadId?: string | number;
  sandbox?: SandboxContext | null;
  sessionKey?: string;
  /**
   * The actual live run session key. When the tool set is constructed with a
   * sandbox/policy session key, this allows `session_status({sessionKey:"current"})`
   * to resolve to the live run session instead of the stale sandbox key.
   */
  runSessionKey?: string; /** Ephemeral session UUID — regenerated on /new and /reset. */
  sessionId?: string;
  /**
   * Explicit one-shot local CLI runs should not keep plugin-owned process
   * resources alive after emitting their result.
   */
  oneShotCliRun?: boolean; /** Stable run identifier for this agent invocation. */
  runId?: string; /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string; /** Diagnostic trace context for hook/log correlation during this run. */
  trace?: DiagnosticTraceContext; /** What initiated this run (for trigger-specific tool restrictions). */
  trigger?: string; /** Stable cron job identifier populated for cron-triggered runs. */
  jobId?: string; /** Relative workspace path that memory-triggered writes may append to. */
  memoryFlushWritePath?: string;
  agentDir?: string; /** Task working directory for coding tools. Defaults to workspaceDir. */
  cwd?: string;
  workspaceDir?: string;
  /**
   * Workspace directory that spawned subagents should inherit.
   * When sandboxing uses a copied workspace (`ro` or `none`), workspaceDir is the
   * sandbox copy but subagents should inherit the real agent workspace instead.
   * Defaults to workspaceDir when not set.
   */
  spawnWorkspaceDir?: string;
  config?: OpenClawConfig;
  abortSignal?: AbortSignal; /** Disable hook-owned diagnostics when an outer runtime owns tool diagnostics. */
  emitBeforeToolCallDiagnostics?: boolean;
  /**
   * Provider of the currently selected model (used for provider-specific tool quirks).
   * Example: "anthropic", "openai", "google", "openai".
   */
  modelProvider?: string; /** Model id for the current provider (used for model-specific tool gating). */
  modelId?: string; /** Model API for the current provider (used for provider-native tool arbitration). */
  modelApi?: string; /** Model context window in tokens (used to scale read-tool output budget). */
  modelContextWindowTokens?: number; /** Resolved runtime model compatibility hints. */
  modelCompat?: ModelCompatConfig; /** If false, keep OpenClaw web_search even when a provider-native search tool is active. */
  suppressManagedWebSearch?: boolean;
  /**
   * Auth mode for the current provider. We only need this for Anthropic OAuth
   * tool-name blocking quirks.
   */
  modelAuthMode?: ModelAuthMode; /** Current channel ID for auto-threading (Slack). */
  currentChannelId?: string; /** Routable target for the current conversation when it differs from the native channel ID. */
  currentMessagingTarget?: string; /** Normalized conversation id exposed to tool hooks. Defaults to currentChannelId. */
  hookChannelId?: string; /** Channel-owned sender/chat metadata exposed to subprocess environments. */
  channelContext?: PluginHookChannelContext; /** Current thread timestamp for auto-threading (Slack). */
  currentThreadTs?: string; /** Current inbound message id for action fallbacks (e.g. Telegram react). */
  currentMessageId?: string | number; /** True when the current inbound turn carried audio media. */
  currentInboundAudio?: boolean; /** Dynamic audio state for runs that can accept steered input after tool creation. */
  hasCurrentInboundAudio?: () => boolean; /** Group id for channel-level tool policy resolution. */
  groupId?: string | null; /** Group channel label (e.g. #general) for channel-level tool policy resolution. */
  groupChannel?: string | null; /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */
  groupSpace?: string | null; /** Trusted provider role ids for the requester in this group turn. */
  memberRoleIds?: string[]; /** Parent session key for subagent group policy inheritance. */
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null; /** Reply-to mode for Slack auto-threading. */
  replyToMode?: "off" | "first" | "all" | "batched"; /** Mutable ref to track if a reply was sent (for "first" mode). */
  hasRepliedRef?: {
    value: boolean;
  }; /** Allow plugin tools for this run to late-bind the gateway subagent. */
  allowGatewaySubagentBinding?: boolean; /** Runtime-scoped explicit allowlist used to materialize matching plugin tools. */
  runtimeToolAllowlist?: string[]; /** Mutable cron creator cap ref for callers that append final runtime tools later. */
  cronCreatorToolAllowlistRef?: CronCreatorToolAllowlistEntry[]; /** If true, the model has native vision capability */
  modelHasVision?: boolean; /** Require explicit message targets (no implicit last-route sends). */
  requireExplicitMessageTarget?: boolean; /** Visible source replies must be sent through the message tool when set to message_tool_only. */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  inboundEventKind?: InboundEventKind; /** If true, omit the message tool from the tool list. */
  disableMessageTool?: boolean; /** Keep the message tool available even when the selected profile omits it. */
  forceMessageTool?: boolean; /** Include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean; /** Keep the heartbeat response tool available even when the selected profile omits it. */
  forceHeartbeatTool?: boolean; /** If false, build plugin tools only while preserving the shared policy pipeline. */
  includeCoreTools?: boolean; /** Include Tool Search control tools when enabled for this run. */
  includeToolSearchControls?: boolean; /** Executes cataloged tools through the active agent run lifecycle. */
  toolSearchCatalogExecutor?: ToolSearchCatalogToolExecutor; /** Runtime-local Tool Search catalog ref shared with attempt compaction. */
  toolSearchCatalogRef?: ToolSearchCatalogRef; /** Limits which tool families are materialized before the shared policy pipeline runs. */
  toolConstructionPlan?: OpenClawCodingToolConstructionPlan; /** Ring-zero Crestodian tool; set only by the Crestodian agent runner. */
  crestodianTool?: CrestodianToolOptions; /** Trusted sender identity bit for command/channel-action auth and owner-gated plugin tools. */
  senderIsOwner?: boolean; /** Auth profiles already loaded for this run; used for prompt-time tool availability. */
  authProfileStore?: AuthProfileStore; /** Callback invoked when sessions_yield tool is called. */
  onYield?: (message: string) => Promise<void> | void; /** Optional instrumentation callback for tool preparation stage timing. */
  recordToolPrepStage?: (name: string) => void; /** Lower routine policy-removal audits for diagnostic-only tool probes. */
  toolPolicyAuditLogLevel?: "info" | "debug"; /** Live observer called after wrapped tool outcomes are recorded. */
  onToolOutcome?: ToolOutcomeObserver; /** Supplies run-global model-call ordering for parallel tool outcomes. */
  allocateToolOutcomeOrdinal?: (toolCallId?: string) => number; /** Runtime-only resolved skill paths that the read tool may load under workspaceOnly. */
  skillsSnapshot?: SkillSnapshot; /** Original identities for sandbox-materialized skill instruction paths. */
  skillUsagePaths?: SkillUsagePath[]; /** Prepared conversation-scoped facts for callers that already resolved this run context. */
  conversationCapabilityProfile?: ResolvedConversationCapabilityProfile;
}): AnyAgentTool[];
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-construction-plan.d.ts
/**
 * Applies a runtime allowlist to a concrete tool list after expanding tool and
 * plugin groups. Undefined allowlists keep all tools; an explicit empty list
 * intentionally disables all runtime tools.
 */
declare function applyEmbeddedAttemptToolsAllow<T extends {
  name: string;
}>(tools: T[], toolsAllow?: string[], options?: {
  toolMeta?: (tool: T) => {
    pluginId: string;
  } | undefined;
}): T[];
/**
 * Decides which tool families need to be constructed for an embedded attempt.
 * This keeps allowlisted plugin/channel tools available without forcing every
 * local core tool factory to run for narrow plugin-only configurations.
 */
declare function resolveEmbeddedAttemptToolConstructionPlan(params: {
  disableTools?: boolean;
  isRawModelRun?: boolean;
  toolsEnabled?: boolean;
  toolsAllow?: string[];
  forceMessageTool?: boolean;
}): {
  constructTools: boolean;
  includeCoreTools: boolean;
  runtimeToolAllowlist?: string[];
  codingToolConstructionPlan: OpenClawCodingToolConstructionPlan;
};
//#endregion
//#region src/agents/harness/registry.d.ts
/** Calls each registered harness dispose hook during registry shutdown or reload. */
declare function disposeRegisteredAgentHarnesses(): Promise<void>;
//#endregion
//#region src/agents/tool-schema-projection.d.ts
/** Diagnostic for one incompatible runtime tool schema. */
type RuntimeToolSchemaDiagnostic = {
  readonly toolName: string;
  readonly toolIndex: number;
  readonly violations: readonly string[];
};
/** Runtime tool list split into compatible tools and schema diagnostics. */
type RuntimeToolSchemaInspection<TTool extends Pick<AnyAgentTool, "name" | "parameters">> = {
  readonly tools: readonly TTool[];
  readonly diagnostics: readonly RuntimeToolSchemaDiagnostic[];
};
/** Inspects runtime tool schemas and returns diagnostics without filtering tools. */
declare function inspectRuntimeToolInputSchemas(tools: readonly Pick<AnyAgentTool, "name" | "parameters">[]): RuntimeToolSchemaDiagnostic[];
/** Filters tools to those that providers can normalize before dispatch. */
declare function filterProviderNormalizableTools<TTool extends Pick<AnyAgentTool, "name" | "parameters">>(tools: readonly TTool[]): RuntimeToolSchemaInspection<TTool>;
//#endregion
//#region src/agents/runtime-plan/tools.d.ts
type AgentRuntimeToolPolicyParams<TSchemaType extends TSchema = TSchema, TResult = unknown> = {
  runtimePlan?: AgentRuntimePlan;
  tools: AgentTool<TSchemaType, TResult>[];
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  modelId?: string;
  modelApi?: string | null;
  model?: ProviderRuntimeModel;
  runtimeHandle?: ProviderRuntimePluginHandle;
  allowProviderRuntimePluginLoad?: boolean;
  /**
   * Invoked on every normalization, including with an empty list, so
   * consumers can observe the all-clear and retire stale quarantine state.
   */
  onPreNormalizationSchemaDiagnostics?: (diagnostics: readonly RuntimeToolSchemaDiagnostic[], tools: readonly AgentTool<TSchemaType, TResult>[]) => void;
};
/** Normalizes tool schemas through a runtime plan or provider fallback policy. */
declare function normalizeAgentRuntimeTools<TSchemaType extends TSchema = TSchema, TResult = unknown>(params: AgentRuntimeToolPolicyParams<TSchemaType, TResult>): AgentTool<TSchemaType, TResult>[];
/** Emits runtime-plan or provider fallback diagnostics for normalized tools. */
declare function logAgentRuntimeToolDiagnostics(params: AgentRuntimeToolPolicyParams): void;
//#endregion
//#region src/agents/embedded-agent-runner/tool-schema-runtime.d.ts
type ProviderToolSchemaParams<TSchemaType extends TSchema = TSchema, TResult = unknown> = {
  tools: AgentTool<TSchemaType, TResult>[];
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  modelId?: string;
  modelApi?: string | null;
  model?: ProviderRuntimeModel;
  runtimeHandle?: ProviderRuntimePluginHandle;
  allowRuntimePluginLoad?: boolean;
};
/**
 * Runs provider-owned tool-schema normalization without encoding provider
 * families in the embedded runner.
 */
declare function normalizeProviderToolSchemas<TSchemaType extends TSchema = TSchema, TResult = unknown>(params: ProviderToolSchemaParams<TSchemaType, TResult>): AgentTool<TSchemaType, TResult>[];
//#endregion
//#region src/agents/sandbox/fs-paths.d.ts
declare function resolveWritableSandboxBindHostRoots(binds: readonly string[] | undefined): string[];
declare function hasSandboxBindContainerPathAliases(binds: readonly string[] | undefined): boolean;
declare function hasSandboxBindReadonlyHostShadows(binds: readonly string[] | undefined): boolean;
//#endregion
//#region src/config/sessions/transcript-append.d.ts
type AppendSessionTranscriptMessageParams<TMessage = unknown> = {
  transcriptPath: string;
  message: TMessage;
  now?: number;
  sessionId?: string;
  cwd?: string;
  useRawWhenLinear?: boolean; /** Opt into transcript idempotency lookup; default append stays O(1) for fresh keyed messages. */
  idempotencyLookup?: "scan" | "caller-checked"; /** Runs under the transcript write lock after idempotency replay checks and before append. */
  prepareMessageAfterIdempotencyCheck?: (message: TMessage) => TMessage | undefined;
  config?: OpenClawConfig; /** Internal owned-batch hook for publishing a newly created transcript header. */
  onHeaderCreated?: (serializedHeader: string) => void;
};
type AppendSessionTranscriptMessageResult<TMessage> = {
  messageId: string;
  message: TMessage;
  appended: boolean;
};
declare function appendSessionTranscriptMessage<TMessage>(params: AppendSessionTranscriptMessageParams<TMessage> & {
  prepareMessageAfterIdempotencyCheck: (message: TMessage) => TMessage | undefined;
}): Promise<AppendSessionTranscriptMessageResult<TMessage> | undefined>;
declare function appendSessionTranscriptMessage<TMessage>(params: AppendSessionTranscriptMessageParams<TMessage>): Promise<AppendSessionTranscriptMessageResult<TMessage>>;
//#endregion
//#region src/agents/harness/hook-context.d.ts
/**
 * Input facts used to build the agent portion of plugin hook events.
 *
 * Only stable run/session/model facts are forwarded to plugin hooks; config remains a local
 * construction input so hooks do not accidentally depend on mutable raw configuration.
 */
type AgentHarnessHookContext = {
  runId?: string;
  trace?: DiagnosticTraceContext;
  jobId?: string;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  workspaceDir?: string;
  modelProviderId?: string;
  modelId?: string;
  messageProvider?: string;
  trigger?: string;
  channelId?: string;
  contextTokenBudget?: number;
  contextWindowSource?: PluginHookContextWindowSource;
  contextWindowReferenceTokens?: number;
  config?: OpenClawConfig;
  senderId?: string;
  chatId?: string;
  channel?: string;
  channelContext?: PluginHookChannelContext;
};
//#endregion
//#region src/agents/harness/prompt-compaction-hook-helpers.d.ts
/** Prompt/developer-instruction pair after harness prompt-build hooks run. */
type AgentHarnessPromptBuildResult = {
  prompt: string;
  developerInstructions: string; /** Span within prompt containing the original prompt input. */
  promptInputRange?: {
    start: number;
    end: number;
  };
};
/** Runs before-prompt hooks and returns the adjusted prompt fields. */
declare function resolveAgentHarnessBeforePromptBuildResult(params: {
  prompt: string;
  developerInstructions: string;
  messages: unknown[];
  ctx: AgentHarnessHookContext;
  beforeAgentStartResult?: PluginHookBeforeAgentStartResult;
  bootstrapContextRunKind?: BootstrapContextRunKind;
}): Promise<AgentHarnessPromptBuildResult>;
/** Runs best-effort before-compaction hooks for a harness session. */
declare function runAgentHarnessBeforeCompactionHook(params: {
  sessionFile: string;
  messages?: AgentMessage[];
  ctx: AgentHarnessHookContext;
}): Promise<void>;
/** Runs best-effort after-compaction hooks for a harness session. */
declare function runAgentHarnessAfterCompactionHook(params: {
  sessionFile: string;
  messages?: AgentMessage[];
  ctx: AgentHarnessHookContext;
  compactedCount: number;
}): Promise<void>;
//#endregion
//#region src/agents/harness/codex-app-server-extensions.d.ts
/** Creates a runner that applies registered Codex app-server tool-result extensions. */
declare function createCodexAppServerToolResultExtensionRunner(ctx: CodexAppServerExtensionContext, factories?: CodexAppServerExtensionFactory[]): {
  applyToolResultExtensions(event: CodexAppServerToolResultEvent): Promise<AgentToolResult<unknown>>;
};
//#endregion
//#region src/agents/harness/tool-result-middleware.d.ts
declare function createAgentToolResultMiddlewareRunner(ctx: AgentToolResultMiddlewareContext, handlers?: AgentToolResultMiddleware[]): {
  applyToolResultMiddleware(event: AgentToolResultMiddlewareEvent): Promise<OpenClawAgentToolResult>;
};
//#endregion
//#region src/agents/harness/context-engine-lifecycle.d.ts
type HarnessContextEngine = ContextEngine;
/**
 * Run optional bootstrap + bootstrap maintenance for a harness-owned context engine.
 */
declare function bootstrapHarnessContextEngine(params: {
  hadSessionFile: boolean;
  contextEngine?: HarnessContextEngine;
  sessionId: string;
  sessionKey?: string;
  sessionFile: string;
  sessionManager?: unknown;
  runtimeContext?: ContextEngineRuntimeContext;
  runtimeSettings?: ContextEngineRuntimeSettings;
  contextEngineHostSupport?: ContextEngineHostSupport;
  harnessId?: string | null;
  runtimeId?: string | null;
  providerId?: string | null;
  requestedModelId?: string | null;
  modelId?: string | null;
  maxOutputTokens?: number | null;
  fallbackReason?: string | null;
  degradedReason?: string | null;
  runMaintenance?: typeof runHarnessContextEngineMaintenance;
  config?: SessionWriteLockAcquireTimeoutConfig;
  warn: (message: string) => void;
}): Promise<void>;
/**
 * Assemble model context through the active harness-owned context engine.
 */
declare function assembleHarnessContextEngine(params: {
  contextEngine?: HarnessContextEngine;
  sessionId: string;
  sessionKey?: string;
  messages: AgentMessage[];
  tokenBudget?: number;
  availableTools?: Set<string>;
  citationsMode?: MemoryCitationsMode;
  modelId: string;
  prompt?: string;
  runtimeSettings?: ContextEngineRuntimeSettings;
  contextEngineHostSupport?: ContextEngineHostSupport;
  harnessId?: string | null;
  runtimeId?: string | null;
  providerId?: string | null;
  requestedModelId?: string | null;
  modelFamily?: string | null;
  maxOutputTokens?: number | null;
  fallbackReason?: string | null;
  degradedReason?: string | null;
}): Promise<AssembleResult | undefined>;
/**
 * Finalize a completed harness turn via afterTurn or ingest fallbacks.
 */
declare function finalizeHarnessContextEngineTurn(params: {
  contextEngine?: HarnessContextEngine;
  promptError: boolean;
  aborted: boolean;
  yieldAborted: boolean;
  sessionIdUsed: string;
  sessionKey?: string;
  sessionFile: string;
  messagesSnapshot: AgentMessage[];
  prePromptMessageCount: number;
  tokenBudget?: number;
  runtimeContext?: ContextEngineRuntimeContext;
  runtimeSettings?: ContextEngineRuntimeSettings;
  contextEngineHostSupport?: ContextEngineHostSupport;
  harnessId?: string | null;
  runtimeId?: string | null;
  providerId?: string | null;
  requestedModelId?: string | null;
  modelId?: string | null;
  maxOutputTokens?: number | null;
  fallbackReason?: string | null;
  degradedReason?: string | null;
  runMaintenance?: typeof runHarnessContextEngineMaintenance;
  sessionManager?: unknown;
  config?: SessionWriteLockAcquireTimeoutConfig;
  warn: (message: string) => void; /** True when this turn belongs to a heartbeat run. */
  isHeartbeat?: boolean;
}): Promise<{
  postTurnFinalizationSucceeded: boolean;
}>;
/**
 * Build runtime context passed into harness context-engine hooks.
 */
declare function buildHarnessContextEngineRuntimeContext(params: Parameters<typeof buildAfterTurnRuntimeContext>[0]): ContextEngineRuntimeContext;
/**
 * Build runtime context passed into harness context-engine hooks from usage data.
 */
declare function buildHarnessContextEngineRuntimeContextFromUsage(params: Parameters<typeof buildAfterTurnRuntimeContextFromUsage>[0]): ContextEngineRuntimeContext;
/**
 * Run optional transcript maintenance for a harness-owned context engine.
 */
declare function runHarnessContextEngineMaintenance(params: {
  contextEngine?: HarnessContextEngine;
  sessionId: string;
  sessionKey?: string;
  sessionFile: string;
  reason: "bootstrap" | "compaction" | "turn";
  sessionManager?: unknown;
  runtimeContext?: ContextEngineRuntimeContext;
  runtimeSettings?: ContextEngineRuntimeSettings;
  contextEngineHostSupport?: ContextEngineHostSupport;
  harnessId?: string | null;
  runtimeId?: string | null;
  providerId?: string | null;
  requestedModelId?: string | null;
  modelId?: string | null;
  tokenBudget?: number | null;
  maxOutputTokens?: number | null;
  fallbackReason?: string | null;
  degradedReason?: string | null;
  executionMode?: "foreground" | "background";
  onDeferredMaintenance?: (promise: Promise<void>) => void;
  config?: SessionWriteLockAcquireTimeoutConfig;
}): Promise<TranscriptRewriteResult | undefined>;
/**
 * Return true when a non-legacy context engine should affect plugin harness behavior.
 */
declare function isActiveHarnessContextEngine(contextEngine: ContextEngine | undefined): contextEngine is ContextEngine;
//#endregion
//#region src/agents/embedded-agent-runner/compaction-safety-timeout.d.ts
declare function resolveCompactionTimeoutMs(cfg?: OpenClawConfig): number;
declare function compactWithSafetyTimeout<T>(compact: (abortSignal?: AbortSignal) => Promise<T>, timeoutMs?: number, opts?: {
  abortSignal?: AbortSignal;
  onCancel?: () => void;
}): Promise<T>;
/** Parameters for a single {@link ContextEngine.compact} invocation. */
type ContextEngineCompactParams = Parameters<ContextEngine["compact"]>[0];
/**
 * Invoke a plugin-owned {@link ContextEngine.compact} bounded by the same
 * finite safety timeout that protects native runtime compaction.
 *
 * Plugin context engines that advertise `ownsCompaction` previously had their
 * `compact()` awaited with no timeout, no watchdog, and no abort signal — a
 * slow or hung plugin compaction would hang the agent turn indefinitely. This
 * wrapper closes that gap:
 *  - the call is bounded by `timeoutMs` (host-resolved, default
 *    {@link EMBEDDED_COMPACTION_TIMEOUT_MS}); on timeout it rejects with a
 *    "Compaction timed out" error so the caller's existing failure handling
 *    runs instead of hanging;
 *  - the timeout signal and caller `abortSignal` are both raced against the
 *    call (so a non-cooperating engine is still bounded) and threaded into the
 *    `compact()` params (so cooperating engines can cancel their own in-flight
 *    work).
 *
 * Callers keep their existing try/catch — a timeout or abort surfaces as a
 * thrown error, never a silent hang.
 */
declare function compactContextEngineWithSafetyTimeout(contextEngine: Pick<ContextEngine, "compact">, params: ContextEngineCompactParams, timeoutMs?: number, abortSignal?: AbortSignal): Promise<CompactResult>;
//#endregion
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.d.ts
declare const PREEMPTIVE_OVERFLOW_ERROR_TEXT = "Context overflow: prompt too large for the model (precheck).";
/** Pre-prompt routing decision plus the budget facts used to explain it in logs and session state. */
type PreemptiveCompactionDecision = {
  route: PreemptiveCompactionRoute;
  shouldCompact: boolean;
  estimatedPromptTokens: number;
  pressureSource?: string;
  promptBudgetBeforeReserve: number;
  overflowTokens: number;
  toolResultReducibleChars: number;
  effectiveReserveTokens: number;
};
/** Token pressure reported by the rendered provider-boundary prompt when available. */
type LlmBoundaryTokenPressure = {
  estimatedPromptTokens: number;
  source: string;
  renderedChars?: number;
};
/** Estimates only the rendered prompt/system portion when history has already been accounted for. */
declare function estimateRenderedLlmBoundaryTokenPressure(params: {
  systemPrompt?: string;
  prompt: string;
}): number;
/**
 * Decides whether a run should compact before submitting the prompt, and
 * whether reducible tool results can avoid or follow compaction. Rendered LLM
 * boundary pressure wins over local transcript estimates when supplied.
 */
declare function shouldPreemptivelyCompactBeforePrompt(params: {
  messages: AgentMessage[];
  unwindowedMessages?: AgentMessage[];
  systemPrompt?: string;
  prompt: string;
  contextTokenBudget: number;
  reserveTokens: number;
  toolResultMaxChars?: number;
  llmBoundaryTokenPressure?: LlmBoundaryTokenPressure;
}): PreemptiveCompactionDecision;
/** Formats the compact operator log line for one pre-prompt budget check. */
declare function formatPrePromptPrecheckLog(params: {
  result: PreemptiveCompactionDecision;
  sessionKey?: string;
  sessionId?: string;
  provider: string;
  modelId: string;
  messageCount: number;
  unwindowedMessageCount?: number;
  contextTokenBudget: number;
  reserveTokens: number;
  sessionFile?: string;
}): string;
//#endregion
//#region src/agents/harness/hook-helpers.d.ts
/** Runs best-effort after-tool-call hooks for a completed tool invocation. */
declare function runAgentHarnessAfterToolCallHook(params: {
  toolName: string;
  toolCallId: string;
  runId?: string;
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  channelId?: string;
  startArgs: Record<string, unknown>;
  result?: unknown;
  error?: string;
  startedAt?: number;
}): Promise<void>;
/** Runs before-message-write hooks and returns the possibly rewritten message. */
declare function runAgentHarnessBeforeMessageWriteHook(params: {
  message: AgentMessage;
  agentId?: string;
  sessionKey?: string;
}): AgentMessage | null;
//#endregion
//#region src/agents/harness/lifecycle-hook-helpers.d.ts
type AgentHarnessHookRunner = ReturnType<typeof getGlobalHookRunner>;
/** Returns the current global hook runner for harness lifecycle hooks. */
declare function getAgentHarnessHookRunner(): AgentHarnessHookRunner;
/** Dispatches best-effort LLM input hooks for a harness attempt. */
declare function runAgentHarnessLlmInputHook(params: {
  event: PluginHookLlmInputEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): void;
/** Dispatches best-effort LLM output hooks for a harness attempt. */
declare function runAgentHarnessLlmOutputHook(params: {
  event: PluginHookLlmOutputEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): void;
/** Starts agent_end hooks with unref timeout behavior. */
declare function runAgentHarnessAgentEndHook(params: {
  event: PluginHookAgentEndEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): void;
/** Runs agent_end hooks and waits for completion. */
declare function awaitAgentHarnessAgentEndHook(params: {
  event: PluginHookAgentEndEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): Promise<void>;
/** Normalized before-finalize hook decision consumed by harness loops. */
type AgentHarnessBeforeAgentFinalizeOutcome = {
  action: "continue";
} | {
  action: "revise";
  reason: string;
} | {
  action: "finalize";
  reason?: string;
};
/** Runs before-finalize hooks and normalizes finalize/revise/continue decisions. */
declare function runAgentHarnessBeforeAgentFinalizeHook(params: {
  event: PluginHookBeforeAgentFinalizeEvent;
  ctx: AgentHarnessHookContext;
  hookRunner?: AgentHarnessHookRunner;
}): Promise<AgentHarnessBeforeAgentFinalizeOutcome>;
//#endregion
//#region src/agents/harness/agent-end-side-effects.d.ts
type AgentEndSideEffectsParams = Parameters<typeof runAgentHarnessAgentEndHook>[0];
/** Starts agent-end side effects without waiting for completion. */
declare function runAgentEndSideEffects(params: AgentEndSideEffectsParams): void;
/** Runs agent-end side effects and waits for plugin/core completion. */
declare function awaitAgentEndSideEffects(params: AgentEndSideEffectsParams): Promise<void>;
//#endregion
//#region src/plugin-sdk/agent-harness-runtime.d.ts
/** Default truncation limit for user-facing tool progress output. */
declare const TOOL_PROGRESS_OUTPUT_MAX_CHARS = 8000;
/**
 * @deprecated Active-run queueing is an internal runtime concern. This legacy
 * boolean API only reports immediate queue eligibility and cannot observe async
 * runtime rejection; runtime-owned delivery paths should use acceptance-aware
 * steering instead of public SDK queueing.
 */
declare function queueAgentHarnessMessage(sessionId: string, text: string, options?: EmbeddedAgentQueueMessageOptions): boolean;
/** Detect prompt image references and load them through the same limits used by embedded runs. */
declare function detectAndLoadAgentHarnessPromptImages(params: {
  prompt: string;
  workspaceDir: string;
  model: {
    input?: string[];
  };
  existingImages?: ImageContent[];
  imageOrder?: PromptImageOrderEntry[];
  config?: OpenClawConfig;
  workspaceOnly?: boolean;
  localRoots?: readonly string[];
  sandbox?: {
    root: string;
    bridge: SandboxFsBridge;
  };
}): Promise<{
  images: ImageContent[];
  detectedRefs: Array<{
    raw: string;
    resolved: string;
    type: "path" | "media-uri";
  }>;
  loadedCount: number;
  skippedCount: number;
}>;
/** Load Codex bundle MCP thread config without forcing the heavy config module into SDK imports. */
declare function loadCodexBundleMcpThreadConfig(params: LoadCodexBundleMcpThreadConfigParams): Promise<CodexBundleMcpThreadConfig>;
/**
 * Derive the same compact user-facing tool detail that embedded OpenClaw uses for progress logs.
 */
type ToolProgressDetailMode = "explain" | "raw";
/** Infer compact display metadata for one tool invocation from its name and arguments. */
declare function inferToolMetaFromArgs(toolName: string, args: unknown, options?: {
  detailMode?: ToolProgressDetailMode;
}): string | undefined;
/**
 * Prepare verbose tool output for user-facing progress messages.
 */
declare function formatToolProgressOutput(output: string, options?: {
  maxChars?: number;
}): string | undefined;
/** Inputs used to classify a finished harness turn with little or no visible assistant output. */
type AgentHarnessTerminalOutcomeInput = {
  assistantTexts: readonly string[];
  reasoningText?: string | null;
  planText?: string | null;
  promptError?: unknown;
  turnCompleted: boolean;
};
/** Terminal fallback classification emitted by agent harness adapters. */
type AgentHarnessTerminalOutcomeClassification = NonNullable<EmbeddedRunAttemptResult["agentHarnessResultClassification"]>;
/**
 * Classify terminal harness turns that completed without assistant output that
 * should advance fallback. Deliberate silent replies such as NO_REPLY count as
 * intentional output, while whitespace-only text remains fallback-eligible.
 * This is intentionally SDK-level so plugin harness adapters such as Codex
 * preserve the same OpenClaw-owned fallback signals as the built-in OpenClaw path
 * without re-implementing terminal-result policy.
 */
declare function classifyAgentHarnessTerminalOutcome(params: AgentHarnessTerminalOutcomeInput): AgentHarnessTerminalOutcomeClassification | undefined;
//#endregion
export { inspectRuntimeToolInputSchemas as $, deliverAgentHarnessUserInputPrompt as $t, assembleHarnessContextEngine as A, NodeListNode as At, runAgentHarnessAfterCompactionHook as B, NativeHookRelayProvider as Bt, PreemptiveCompactionDecision as C, resolveToolResultFailureKind as Ct, compactContextEngineWithSafetyTimeout as D, listNodes as Dt, shouldPreemptivelyCompactBeforePrompt as E, formatToolAggregate as Et, isActiveHarnessContextEngine as F, resolveAgentRunAbortLifecycleFields as Ft, resolveWritableSandboxBindHostRoots as G, registerNativeHookRelay as Gt, appendSessionTranscriptMessage as H, buildNativeHookRelayCommand as Ht, runHarnessContextEngineMaintenance as I, runAgentCleanupStep as It, normalizeAgentRuntimeTools as J, AgentHarnessUserInputAnswers as Jt, normalizeProviderToolSchemas as K, resolveNativeHookRelayDeferredToolApproval as Kt, createAgentToolResultMiddlewareRunner as L, buildAgentHookContextChannelFields as Lt, buildHarnessContextEngineRuntimeContext as M, classifyEmbeddedAgentRunResultForModelFallback as Mt, buildHarnessContextEngineRuntimeContextFromUsage as N, buildAgentRuntimePlan as Nt, compactWithSafetyTimeout as O, resolveNodeIdFromList as Ot, finalizeHarnessContextEngineTurn as P, log as Pt, filterProviderNormalizableTools as Q, buildAgentHarnessUserInputAnswers as Qt, createCodexAppServerToolResultExtensionRunner as R, NativeHookRelayEvent as Rt, PREEMPTIVE_OVERFLOW_ERROR_TEXT as S, resolveToolExecutionErrorKind as St, formatPrePromptPrecheckLog as T, isMessagingToolSendAction as Tt, hasSandboxBindContainerPathAliases as U, hasNativeHookRelayInvocation as Ut, runAgentHarnessBeforeCompactionHook as V, NativeHookRelayRegistrationHandle as Vt, hasSandboxBindReadonlyHostShadows as W, invokeNativeHookRelay as Wt, RuntimeToolInputSchemaProjection as X, AgentHarnessUserInputPromptOptions as Xt, RuntimeToolInputSchemaJson as Y, AgentHarnessUserInputOption as Yt, RuntimeToolSchemaDiagnostic as Z, AgentHarnessUserInputQuestion as Zt, runAgentHarnessLlmInputHook as _, filterToolResultMediaUrls as _t, classifyAgentHarnessTerminalOutcome as a, CodexBundleMcpThreadConfig as an, buildEmbeddedAttemptToolRunContext as at, runAgentHarnessBeforeMessageWriteHook as b, formatToolExecutionErrorMessage as bt, inferToolMetaFromArgs as c, SKILL_WORKSHOP_TOOL_NAME as ct, awaitAgentEndSideEffects as d, isAgentToolReplaySafe as dt, emptyAgentHarnessUserInputAnswers as en, projectRuntimeToolInputSchema$1 as et, runAgentEndSideEffects as f, supportsModelTools as ft, runAgentHarnessBeforeAgentFinalizeHook as g, extractToolResultMediaArtifact as gt, runAgentHarnessAgentEndHook as h, extractToolErrorMessage as ht, ToolProgressDetailMode as i, isDeliveredMessagingToolResult as in, createOpenClawCodingTools as it, bootstrapHarnessContextEngine as j, callGatewayTool as jt, resolveCompactionTimeoutMs as k, selectDefaultNodeFromList as kt, loadCodexBundleMcpThreadConfig as l, buildSkillWorkshopPromptSection as lt, getAgentHarnessHookRunner as m, extractMessagingToolSendResult as mt, AgentHarnessTerminalOutcomeInput as n, normalizeAgentHarnessUserInputAnswer as nn, applyEmbeddedAttemptToolsAllow as nt, detectAndLoadAgentHarnessPromptImages as o, LoadCodexBundleMcpThreadConfigParams as on, resolveAttemptSpawnWorkspaceDir as ot, awaitAgentHarnessAgentEndHook as p, extractMessagingToolSend as pt, logAgentRuntimeToolDiagnostics as q, testing as qt, TOOL_PROGRESS_OUTPUT_MAX_CHARS as r, isDeliveredMessageToolOnlySourceReplyResult as rn, resolveEmbeddedAttemptToolConstructionPlan as rt, formatToolProgressOutput as s, resolveAttemptFsWorkspaceOnly as st, AgentHarnessTerminalOutcomeClassification as t, formatAgentHarnessUserInputPrompt as tn, disposeRegisteredAgentHarnesses as tt, queueAgentHarnessMessage as u, getChannelAgentToolMeta as ut, runAgentHarnessLlmOutputHook as v, sanitizeToolResult as vt, estimateRenderedLlmBoundaryTokenPressure as w, isMessagingTool as wt, LlmBoundaryTokenPressure as x, isToolResultError as xt, runAgentHarnessAfterToolCallHook as y, ToolResultFailureKind as yt, resolveAgentHarnessBeforePromptBuildResult as z, NativeHookRelayProcessResponse as zt };