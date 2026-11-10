import { M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { Aa as abortEmbeddedAgentRun, En as EmbeddedRunAttemptParamsV2, Fa as SessionCapabilityStore, H as AgentHarness, Ia as DelegatedToolPolicy, Na as resolveActiveEmbeddedRunSessionId, Pa as PreparedSessionCapabilityEntry, SE as TrustedSubagentCompletionHandoff, Tn as EmbeddedRunAttemptParams, Yr as disposeRegisteredAgentHarnesses, _r as createCodexAppServerToolResultExtensionRunner, cg as OpenClawAgentToolResult, ev as SandboxToolPolicy, gr as createAgentToolResultMiddlewareRunner, ig as AgentToolResultMiddlewareEvent, ka as abortAndDrainEmbeddedAgentRun, lA as InputProvenance, mt as AgentHarnessV2, ng as AgentToolResultMiddleware, vt as createOpenClawCodingTools, wE as ScheduledToolPolicyContext, yt as createOpenClawCodingToolsAsync } from "../config-contracts-CY87ANNp.js";
import { n as AnyAgentTool } from "../common-CCG3ut4I.js";
//#region src/agents/requester-tool-policy.d.ts
type RequesterToolPolicySource = "current-request" | "persisted-child" | "completion-handoff";
type RequesterToolPolicyResolution = {
  delegated: boolean;
  /** Diagnostic fact identifying whether policy came from live ingress or delegated state. */
  requesterPolicySource: RequesterToolPolicySource;
  groupPolicy?: SandboxToolPolicy;
  senderPolicy?: SandboxToolPolicy;
  subagentPolicy?: SandboxToolPolicy;
  inheritedToolPolicy?: SandboxToolPolicy;
  /** Full ancestor ceiling retained by descendants and completion, even when execution differs. */
  inheritedToolPolicyForSpawn?: SandboxToolPolicy;
  delegatedToolPolicy?: DelegatedToolPolicy;
  inheritedToolPolicySource?: "sender";
  subagentStore?: SessionCapabilityStore;
};
type SenderPolicyMode = "always" | "when-sender-id" | "never";
type RequesterToolPolicyParams = {
  config?: OpenClawConfig;
  agentId?: string;
  sessionKey?: string;
  subagentSessionKey?: string;
  preparedSessionEntry?: PreparedSessionCapabilityEntry;
  preparedSessionCapabilityStore?: SessionCapabilityStore;
  spawnedBy?: string | null;
  messageProvider?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  accountId?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  inputProvenance?: InputProvenance;
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  sessionId?: string;
  modelProvider?: string;
  modelId?: string;
  senderPolicyMode?: SenderPolicyMode;
  /** Group session selected by a trusted scheduled authority envelope. */
  groupPolicySessionKey?: string;
  /** Fail closed when scheduled authority names a removed non-default account. */
  requireConfiguredGroupAccount?: boolean;
  /** Policy prepared by the trusted channel ingress owner for this conversation. */
  conversationPolicy?: SandboxToolPolicy;
};
/** Resolve sender/group policy or a verified inherited projection, never both. */
declare function resolveRequesterToolPolicies(params: RequesterToolPolicyParams): RequesterToolPolicyResolution;
//#endregion
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
  preparedRequesterPolicy?: Pick<ReturnType<typeof resolveRequesterToolPolicies>, "delegated" | "groupPolicy" | "senderPolicy" | "subagentPolicy" | "inheritedToolPolicy">;
};
type WebSearchToolPolicyResolution = {
  allowed: boolean;
  persistentAllowed: boolean;
};
/** Resolves current and sender-independent policy for the managed web_search tool. */
export declare function resolveWebSearchToolPolicy(params: WebSearchToolPolicyParams): WebSearchToolPolicyResolution;
//#endregion
export { type AgentHarness, type AgentHarnessV2, type AgentToolResultMiddleware, type AgentToolResultMiddlewareEvent, type AnyAgentTool, type EmbeddedRunAttemptParams, type EmbeddedRunAttemptParamsV2, type OpenClawAgentToolResult, abortEmbeddedAgentRun as abortAgentHarnessRun, abortAndDrainEmbeddedAgentRun as abortAndDrainAgentHarnessRun, createAgentToolResultMiddlewareRunner, createCodexAppServerToolResultExtensionRunner, createOpenClawCodingTools, createOpenClawCodingToolsAsync, disposeRegisteredAgentHarnesses, resolveActiveEmbeddedRunSessionId };