import { Fa as AgentHarness, Gc as OpenClawAgentToolResult, J as createCodexAppServerToolResultExtensionRunner, Jc as SandboxToolPolicy, Vc as AgentToolResultMiddlewareEvent, Zn as createOpenClawCodingTools, _r as resolveActiveEmbeddedRunSessionId, dt as disposeRegisteredAgentHarnesses, eh as ScheduledToolPolicyContext, fr as abortAndDrainEmbeddedAgentRun, i as EmbeddedRunAttemptParamsV2, il as TrustedSubagentCompletionHandoff, pr as abortEmbeddedAgentRun, q as createAgentToolResultMiddlewareRunner, r as EmbeddedRunAttemptParams, so as AgentHarnessV2, zc as AgentToolResultMiddleware } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { yt as InputProvenance } from "../templating-OpWn1DzT.js";
import { n as AnyAgentTool } from "../common-BCM4z2Iy.js";
//#region src/agents/web-search-tool-policy.d.ts
type WebSearchToolPolicyParams = {
  webSearchEnabled?: boolean;
  config?: OpenClawConfig;
  modelProvider?: string;
  modelId?: string;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  sandboxToolPolicy?: SandboxToolPolicy;
  messageProvider?: string;
  agentAccountId?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  inputProvenance?: InputProvenance;
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  scheduledToolPolicy?: ScheduledToolPolicyContext;
  runtimeToolAllowlist?: string[];
};
type WebSearchToolPolicyResolution = {
  allowed: boolean;
  persistentAllowed: boolean;
};
/** Resolves current and sender-independent policy for the managed web_search tool. */
export declare function resolveWebSearchToolPolicy(params: WebSearchToolPolicyParams): WebSearchToolPolicyResolution;
//#endregion
export { type AgentHarness, type AgentHarnessV2, type AgentToolResultMiddleware, type AgentToolResultMiddlewareEvent, type AnyAgentTool, type EmbeddedRunAttemptParams, type EmbeddedRunAttemptParamsV2, type OpenClawAgentToolResult, abortEmbeddedAgentRun as abortAgentHarnessRun, abortAndDrainEmbeddedAgentRun as abortAndDrainAgentHarnessRun, createAgentToolResultMiddlewareRunner, createCodexAppServerToolResultExtensionRunner, createOpenClawCodingTools, disposeRegisteredAgentHarnesses, resolveActiveEmbeddedRunSessionId };