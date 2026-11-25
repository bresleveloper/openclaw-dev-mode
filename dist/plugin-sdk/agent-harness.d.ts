import { Bt as createOpenClawCodingToolsAsync, DE as ScheduledToolPolicyContext, Ga as createCodexAppServerToolResultExtensionRunner, Gc as abortAndDrainEmbeddedAgentRun, Jt as AgentHarness, Kc as abortEmbeddedAgentRun, LE as TrustedSubagentCompletionHandoff, So as disposeRegisteredAgentHarnesses, UE as SandboxToolPolicy, Vl as resolveActiveSessionRunId, Wa as createAgentToolResultMiddlewareRunner, Wl as resolveRequesterToolPolicies, Xi as EmbeddedRunAttemptParamsV2, Yi as EmbeddedRunAttemptParams, bn as AgentHarnessV2, nN as InputProvenance, rc as AgentToolResultMiddlewareEvent, sc as OpenClawAgentToolResult, tc as AgentToolResultMiddleware, zt as createOpenClawCodingTools } from "../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import { n as AnyAgentTool } from "../common-SasPqPvU.js";
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
  preparedRequesterPolicy?: Pick<ReturnType<typeof resolveRequesterToolPolicies>, "delegated" | "groupPolicy" | "senderPolicy" | "subagentPolicy" | "inheritedToolPolicy">;
};
type WebSearchToolPolicyResolution = {
  allowed: boolean;
  persistentAllowed: boolean;
};
/** Prepares stored session capability facts, so callers need no warm Gateway projection. */
export declare function resolveWebSearchToolPolicyAsync(params: WebSearchToolPolicyParams): Promise<WebSearchToolPolicyResolution>;
/** Resolves current and sender-independent policy for the managed web_search tool. */
export declare function resolveWebSearchToolPolicy(params: WebSearchToolPolicyParams): WebSearchToolPolicyResolution;
export { type AgentHarness, type AgentHarnessV2, type AgentToolResultMiddleware, type AgentToolResultMiddlewareEvent, type AnyAgentTool, type EmbeddedRunAttemptParams, type EmbeddedRunAttemptParamsV2, type OpenClawAgentToolResult, abortEmbeddedAgentRun as abortAgentHarnessRun, abortAndDrainEmbeddedAgentRun as abortAndDrainAgentHarnessRun, createAgentToolResultMiddlewareRunner, createCodexAppServerToolResultExtensionRunner, createOpenClawCodingTools, createOpenClawCodingToolsAsync, disposeRegisteredAgentHarnesses, resolveActiveSessionRunId as resolveActiveEmbeddedRunSessionId };