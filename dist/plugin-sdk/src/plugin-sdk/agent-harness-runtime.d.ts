import type { CodexBundleMcpThreadConfig, LoadCodexBundleMcpThreadConfigParams } from "../agents/codex-mcp-config.types.js";
import type { EmbeddedRunAttemptResult } from "../agents/embedded-agent-runner/run/types.js";
import { abortAndDrainEmbeddedAgentRun, abortEmbeddedAgentRun, clearActiveEmbeddedRun, resolveActiveEmbeddedRunSessionId, setActiveEmbeddedRun, type AbortAndDrainEmbeddedAgentRunResult, type EmbeddedAgentQueueMessageOptions } from "../agents/embedded-agent-runner/runs.js";
import type { SandboxFsBridge } from "../agents/sandbox/fs-bridge.js";
import type { ImageContent } from "../llm/types.js";
import type { PromptImageOrderEntry } from "../media/prompt-image-order.js";
/** Default truncation limit for user-facing tool progress output. */
export declare const TOOL_PROGRESS_OUTPUT_MAX_CHARS = 8000;
export { FAST_MODE_AUTO_PROGRESS_KIND } from "../auto-reply/reply-payload.js";
export { formatFastModeAutoProgressText, resolveFastModeForElapsed } from "../shared/fast-mode.js";
export type { AgentMessage } from "../agents/runtime/index.js";
export type { FastModeAutoProgressState } from "../shared/fast-mode.js";
export type { AgentHarness, AgentHarnessAttemptParams, AgentHarnessAttemptResult, AgentHarnessCompactParams, AgentHarnessCompactResult, AgentHarnessDeliveryDefaults, AgentHarnessResultClassification, AgentHarnessSideQuestionParams, AgentHarnessSideQuestionResult, AgentHarnessResetParams, AgentHarnessSupport, AgentHarnessSupportContext, } from "../agents/harness/types.js";
export type { AgentHarnessUserInputAnswers, AgentHarnessUserInputOption, AgentHarnessUserInputPromptOptions, AgentHarnessUserInputQuestion, } from "../agents/harness/user-input-bridge.js";
export type { EmbeddedRunAttemptParams, EmbeddedRunAttemptResult, } from "../agents/embedded-agent-runner/run/types.js";
export type { ContextEngine as HarnessContextEngine, ContextEngineHostCapability, ContextEngineOperation, ContextEngineProjection, } from "../context-engine/types.js";
export type { CompactEmbeddedAgentSessionParams, 
/** @deprecated Use CompactEmbeddedAgentSessionParams. */
CompactEmbeddedAgentSessionParams as CompactEmbeddedPiSessionParams, } from "../agents/embedded-agent-runner/compact.js";
export type { EmbeddedAgentCompactResult, 
/** @deprecated Use EmbeddedAgentCompactResult. */
EmbeddedAgentCompactResult as EmbeddedPiCompactResult, } from "../agents/embedded-agent-runner/types.js";
export type { AnyAgentTool } from "../agents/tools/common.js";
export type { MessagingToolSend, MessagingToolSourceReplyPayload, } from "../agents/embedded-agent-messaging.types.js";
export type { HeartbeatToolResponse } from "../auto-reply/heartbeat-tool-response.js";
export type { AgentApprovalEventData, AgentEventPayload } from "../infra/agent-events.js";
export type { ExecApprovalDecision } from "../infra/exec-approvals.js";
export type { ExecAutoReviewDecision, ExecAutoReviewInput, ExecAutoReviewer, } from "../infra/exec-auto-review.js";
export type { NormalizedUsage } from "../agents/usage.js";
export type { AgentToolResultMiddleware, AgentToolResultMiddlewareContext, AgentToolResultMiddlewareEvent, AgentToolResultMiddlewareHarness, AgentToolResultMiddlewareOptions, AgentToolResultMiddlewareResult, AgentToolResultMiddlewareRuntime, OpenClawAgentToolResult, } from "../plugins/agent-tool-result-middleware-types.js";
export type { CodexAppServerExtensionContext, CodexAppServerExtensionFactory, CodexAppServerExtensionRuntime, CodexAppServerToolResultEvent, CodexAppServerToolResultHandlerResult, } from "../plugins/codex-app-server-extension-types.js";
export type { NativeHookRelayEvent, NativeHookRelayProcessResponse, NativeHookRelayProvider, NativeHookRelayRegistrationHandle, } from "../agents/harness/native-hook-relay.js";
export { VERSION as OPENCLAW_VERSION } from "../version.js";
export { formatErrorMessage } from "../infra/errors.js";
export { formatApprovalDisplayPath } from "../infra/approval-display-paths.js";
export { buildAgentHookContextChannelFields } from "../plugins/hook-agent-context.js";
export { emitAgentEvent, onAgentEvent, resetAgentEventsForTest } from "../infra/agent-events.js";
export { runAgentCleanupStep } from "../agents/run-cleanup-timeout.js";
export { log as embeddedAgentLog } from "../agents/embedded-agent-runner/logger.js";
export { buildAgentRuntimePlan } from "../agents/runtime-plan/build.js";
export { classifyEmbeddedAgentRunResultForModelFallback, 
/** @deprecated Use classifyEmbeddedAgentRunResultForModelFallback. */
classifyEmbeddedAgentRunResultForModelFallback as classifyEmbeddedPiRunResultForModelFallback, } from "../agents/embedded-agent-runner/result-fallback-classifier.js";
export { resolveEmbeddedAgentRuntime } from "../agents/agent-runtime-id.js";
export { resolveUserPath } from "../utils.js";
export { callGatewayTool } from "../agents/tools/gateway.js";
export type { NodeListNode } from "../agents/tools/nodes-utils.js";
export { listNodes, resolveNodeIdFromList, selectDefaultNodeFromList, } from "../agents/tools/nodes-utils.js";
export { formatToolAggregate } from "../auto-reply/tool-meta.js";
export { HEARTBEAT_RESPONSE_TOOL_NAME, normalizeHeartbeatToolResponse, } from "../auto-reply/heartbeat-tool-response.js";
export { isMessagingTool, isMessagingToolSendAction } from "../agents/embedded-agent-messaging.js";
export { extractMessagingToolSend, extractMessagingToolSendResult, extractToolErrorMessage, extractToolResultMediaArtifact, filterToolResultMediaUrls, isToolResultError, sanitizeToolResult, } from "../agents/embedded-agent-subscribe.tools.js";
export { normalizeUsage } from "../agents/usage.js";
export { resolveOpenClawAgentDir } from "./agent-dir-compat.js";
export { resolveAgentDir, resolveDefaultAgentDir, resolveSessionAgentIds, } from "../agents/agent-scope.js";
export { resolveModelAuthMode } from "../agents/model-auth.js";
export { supportsModelTools } from "../agents/model-tool-support.js";
export { isAgentToolReplaySafe } from "../agents/tool-replay-safety.js";
export { getChannelAgentToolMeta } from "../agents/channel-tool-metadata.js";
export { buildAgentHarnessUserInputAnswers, deliverAgentHarnessUserInputPrompt, emptyAgentHarnessUserInputAnswers, formatAgentHarnessUserInputPrompt, normalizeAgentHarnessUserInputAnswer, } from "../agents/harness/user-input-bridge.js";
export { buildSkillWorkshopPromptSection, SKILL_WORKSHOP_TOOL_NAME, } from "../agents/skill-workshop-prompt.js";
export { resolveAttemptFsWorkspaceOnly } from "../agents/embedded-agent-runner/run/attempt.prompt-helpers.js";
export { resolveAttemptSpawnWorkspaceDir } from "../agents/embedded-agent-runner/run/attempt.thread-helpers.js";
export { buildEmbeddedAttemptToolRunContext } from "../agents/embedded-agent-runner/run/attempt.tool-run-context.js";
export { applyEmbeddedAttemptToolsAllow, resolveEmbeddedAttemptToolConstructionPlan, } from "../agents/embedded-agent-runner/run/attempt-tool-construction-plan.js";
export { getPluginToolMeta } from "../plugins/tools.js";
export { abortAndDrainEmbeddedAgentRun as abortAndDrainAgentHarnessRun, abortEmbeddedAgentRun as abortAgentHarnessRun, clearActiveEmbeddedRun, resolveActiveEmbeddedRunSessionId, setActiveEmbeddedRun, };
export type { AbortAndDrainEmbeddedAgentRunResult as AbortAndDrainAgentHarnessRunResult };
/**
 * @deprecated Active-run queueing is an internal runtime concern. This legacy
 * boolean API only reports immediate queue eligibility and cannot observe async
 * runtime rejection; runtime-owned delivery paths should use acceptance-aware
 * steering instead of public SDK queueing.
 */
export declare function queueAgentHarnessMessage(sessionId: string, text: string, options?: EmbeddedAgentQueueMessageOptions): boolean;
export { disposeRegisteredAgentHarnesses } from "../agents/harness/registry.js";
export { logAgentRuntimeToolDiagnostics, normalizeAgentRuntimeTools, } from "../agents/runtime-plan/tools.js";
export { filterProviderNormalizableTools, inspectRuntimeToolInputSchemas, projectRuntimeToolInputSchema, type RuntimeToolInputSchemaJson, type RuntimeToolInputSchemaProjection, type RuntimeToolSchemaDiagnostic, } from "../agents/tool-schema-projection.js";
export type { CodexBundleMcpThreadConfig, LoadCodexBundleMcpThreadConfigParams, } from "../agents/codex-mcp-config.types.js";
export { normalizeProviderToolSchemas } from "../agents/embedded-agent-runner/tool-schema-runtime.js";
/** Detect prompt image references and load them through the same limits used by embedded runs. */
export declare function detectAndLoadAgentHarnessPromptImages(params: {
    prompt: string;
    workspaceDir: string;
    model: {
        input?: string[];
    };
    existingImages?: ImageContent[];
    imageOrder?: PromptImageOrderEntry[];
    config?: import("../config/types.openclaw.js").OpenClawConfig;
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
export declare function loadCodexBundleMcpThreadConfig(params: LoadCodexBundleMcpThreadConfigParams): Promise<CodexBundleMcpThreadConfig>;
export { resolveSandboxContext } from "../agents/sandbox.js";
export type { SandboxContext, SandboxWorkspaceAccess } from "../agents/sandbox.js";
export { hasSandboxBindContainerPathAliases, hasSandboxBindReadonlyHostShadows, resolveWritableSandboxBindHostRoots, } from "../agents/sandbox/fs-paths.js";
export { buildBootstrapContextForFiles, resolveBootstrapContextForRun, resolveBootstrapFilesForRun, } from "../agents/bootstrap-files.js";
export type { EmbeddedContextFile } from "../agents/embedded-agent-helpers/types.js";
export { isSubagentSessionKey } from "../routing/session-key.js";
export { acquireSessionWriteLock, resolveSessionWriteLockAcquireTimeoutMs, resolveSessionWriteLockOptions, type SessionWriteLockAcquireTimeoutConfig, } from "../agents/session-write-lock.js";
export { appendSessionTranscriptMessage } from "../config/sessions/transcript-append.js";
export { emitSessionTranscriptUpdate } from "../sessions/transcript-events.js";
export { consumeAdjustedParamsForToolCall, consumePreExecutionBlockedToolCall, finalizeToolTerminalPresentation, getBeforeToolCallPolicyDiagnosticState, hasBeforeToolCallPolicy, isToolWrappedWithBeforeToolCallHook, requestDeferredPluginToolApproval, runBeforeToolCallHook, setBeforeToolCallDiagnosticsEnabled, wrapToolWithBeforeToolCallHook, type BeforeToolCallPolicyDiagnosticState, type DeferredPluginToolApproval, } from "../agents/agent-tools.before-tool-call.js";
export { isReplaySafeToolCall } from "../agents/tool-mutation.js";
export { resolveAgentHarnessBeforePromptBuildResult, runAgentHarnessAfterCompactionHook, runAgentHarnessBeforeCompactionHook, } from "../agents/harness/prompt-compaction-hook-helpers.js";
export { createCodexAppServerToolResultExtensionRunner } from "../agents/harness/codex-app-server-extensions.js";
export { createAgentToolResultMiddlewareRunner } from "../agents/harness/tool-result-middleware.js";
export { assertContextEngineHostSupport, CODEX_APP_SERVER_CONTEXT_ENGINE_HOST, } from "../context-engine/host-compat.js";
export { assembleHarnessContextEngine, bootstrapHarnessContextEngine, buildHarnessContextEngineRuntimeContext, buildHarnessContextEngineRuntimeContextFromUsage, finalizeHarnessContextEngineTurn, isActiveHarnessContextEngine, runHarnessContextEngineMaintenance, } from "../agents/harness/context-engine-lifecycle.js";
export { compactWithSafetyTimeout, compactContextEngineWithSafetyTimeout, resolveCompactionTimeoutMs, } from "../agents/embedded-agent-runner/compaction-safety-timeout.js";
export { estimateRenderedLlmBoundaryTokenPressure, formatPrePromptPrecheckLog, PREEMPTIVE_OVERFLOW_ERROR_TEXT, shouldPreemptivelyCompactBeforePrompt, type LlmBoundaryTokenPressure, type PreemptiveCompactionDecision, } from "../agents/embedded-agent-runner/run/preemptive-compaction.js";
export { resolveContextEngineOwnerPluginId } from "../context-engine/registry.js";
export { runAgentHarnessAfterToolCallHook, runAgentHarnessBeforeMessageWriteHook, } from "../agents/harness/hook-helpers.js";
export { awaitAgentEndSideEffects, runAgentEndSideEffects, } from "../agents/harness/agent-end-side-effects.js";
export { awaitAgentHarnessAgentEndHook, getAgentHarnessHookRunner, runAgentHarnessBeforeAgentFinalizeHook, runAgentHarnessAgentEndHook, runAgentHarnessLlmInputHook, runAgentHarnessLlmOutputHook, } from "../agents/harness/lifecycle-hook-helpers.js";
export { buildNativeHookRelayCommand, hasNativeHookRelayInvocation, invokeNativeHookRelay, resolveNativeHookRelayDeferredToolApproval, testing as nativeHookRelayTesting, registerNativeHookRelay, } from "../agents/harness/native-hook-relay.js";
/**
 * Derive the same compact user-facing tool detail that embedded OpenClaw uses for progress logs.
 */
export type ToolProgressDetailMode = "explain" | "raw";
/** Infer compact display metadata for one tool invocation from its name and arguments. */
export declare function inferToolMetaFromArgs(toolName: string, args: unknown, options?: {
    detailMode?: ToolProgressDetailMode;
}): string | undefined;
/**
 * Prepare verbose tool output for user-facing progress messages.
 */
export declare function formatToolProgressOutput(output: string, options?: {
    maxChars?: number;
}): string | undefined;
/** Inputs used to classify a finished harness turn with little or no visible assistant output. */
export type AgentHarnessTerminalOutcomeInput = {
    assistantTexts: readonly string[];
    reasoningText?: string | null;
    planText?: string | null;
    promptError?: unknown;
    turnCompleted: boolean;
};
/** Terminal fallback classification emitted by agent harness adapters. */
export type AgentHarnessTerminalOutcomeClassification = NonNullable<EmbeddedRunAttemptResult["agentHarnessResultClassification"]>;
/**
 * Classify terminal harness turns that completed without assistant output that
 * should advance fallback. Deliberate silent replies such as NO_REPLY count as
 * intentional output, while whitespace-only text remains fallback-eligible.
 * This is intentionally SDK-level so plugin harness adapters such as Codex
 * preserve the same OpenClaw-owned fallback signals as the built-in OpenClaw path
 * without re-implementing terminal-result policy.
 */
export declare function classifyAgentHarnessTerminalOutcome(params: AgentHarnessTerminalOutcomeInput): AgentHarnessTerminalOutcomeClassification | undefined;
