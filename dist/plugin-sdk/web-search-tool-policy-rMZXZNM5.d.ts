import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { I as SandboxToolPolicy } from "./sandbox-DRzEQ5YS.js";

//#region src/agents/web-search-tool-policy.d.ts
type WebSearchToolPolicyParams = {
  config?: OpenClawConfig;
  modelProvider?: string;
  modelId?: string;
  agentId?: string;
  sessionKey?: string;
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
};
type WebSearchToolPolicyResolution = {
  allowed: boolean;
  persistentAllowed: boolean;
};
/** Resolves current and sender-independent policy for the managed web_search tool. */
declare function resolveWebSearchToolPolicy(params: WebSearchToolPolicyParams): WebSearchToolPolicyResolution;
//#endregion
export { resolveWebSearchToolPolicy as t };