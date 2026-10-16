import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { $t as InputProvenance } from "../reply-payload-DazZPys5.js";
import { Io as SandboxToolPolicy, J as createCodexAppServerToolResultExtensionRunner, Pr as AgentHarness, Uo as TrustedSubagentCompletionHandoff, Zf as ScheduledToolPolicyContext, Zn as resolveActiveEmbeddedRunSessionId, bt as disposeRegisteredAgentHarnesses, cl as AgentToolResultMiddleware, gr as createOpenClawCodingTools, i as EmbeddedRunAttemptParamsV2, ml as OpenClawAgentToolResult, nr as abortEmbeddedAgentRun, oi as AgentHarnessV2, q as createAgentToolResultMiddlewareRunner, r as EmbeddedRunAttemptParams, tr as abortAndDrainEmbeddedAgentRun, ul as AgentToolResultMiddlewareEvent } from "../agent-harness-runtime-DZjstJNb.js";
import { n as AnyAgentTool } from "../common-K-HB_vKp.js";
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