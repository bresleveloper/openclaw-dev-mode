import { Li as OpenClawPluginToolContext } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { u as MemorySearchResult } from "./types-D2yUynI0.js";
import "./memory-core-host-runtime-core-B6UF-6o1.js";
type ConversationRecallContext = NonNullable<OpenClawPluginToolContext["conversationRecall"]>;
declare function filterMemorySearchHitsBySessionVisibility(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  requesterSessionKey: string | undefined;
  sandboxed: boolean;
  hits: MemorySearchResult[];
  conversationRecall?: ConversationRecallContext;
  /** Trusted control-plane calls may authorize only hits already scoped to this agent. */
  trustedAgentScope?: boolean;
}): Promise<MemorySearchResult[]>;
export { filterMemorySearchHitsBySessionVisibility as t };