import { M as OpenClawConfig, S as MemorySearchResult } from "./types-D7I_F5Ux.js";
import { pn as OpenClawPluginToolContext } from "./config-contracts-CY87ANNp.js";
import "./memory-core-host-runtime-core-uGyluBS6.js";
//#region extensions/memory-core/src/session-search-visibility.d.ts
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
//#endregion
export { filterMemorySearchHitsBySessionVisibility as t };