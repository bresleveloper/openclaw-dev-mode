import { i as OpenClawConfig } from "../../types.openclaw-DlpCUWMr.js";
import { r as AnyAgentTool } from "../../common-DDc8qh0a.js";

//#region src/agents/embedded-agent-runner/effective-tool-policy.d.ts
/**
 * Identity inputs used by `resolveGroupToolPolicy` to look up channel/group
 * tool policy. These fields are an authorization signal (they can widen
 * bundled-tool availability via a group-scoped allowlist), so callers MUST
 * pass values derived from server-verified session metadata (session key,
 * inbound transport event), not from tool-call or model-controlled input.
 * The helper cross-checks caller-provided `groupId` against session-derived
 * group ids and drops the caller value when they disagree, but it cannot
 * detect drift on fields that have no session-bound counterpart.
 */
type FinalEffectiveToolPolicyParams = {
  bundledTools: AnyAgentTool[];
  config?: OpenClawConfig;
  sandboxToolPolicy?: {
    allow?: string[];
    deny?: string[];
  };
  sessionKey?: string;
  agentId?: string;
  modelProvider?: string;
  modelId?: string;
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
  warn: (message: string) => void;
  toolPolicyAuditLogLevel?: "info" | "debug";
};
declare function applyFinalEffectiveToolPolicy(params: FinalEffectiveToolPolicyParams): AnyAgentTool[];
//#endregion
export { applyFinalEffectiveToolPolicy };