import { Dt as GroupScope, Et as DmScope, n as OpenClawConfig } from "./types.openclaw-BGrO5JfP.js";
import { g as ChatType } from "./types-BNSWPjt2.js";
//#region src/routing/resolve-route.d.ts
type RoutePeer = {
  kind: ChatType;
  id: string;
};
type ResolveAgentRouteInput = {
  cfg: OpenClawConfig;
  channel: string;
  /** Known owner when no configured binding matches this route. */
  defaultAgentId?: string;
  accountId?: string | null;
  peer?: RoutePeer | null;
  dmScope?: DmScope;
  groupScope?: GroupScope;
  /** Parent peer for threads — used for binding inheritance when peer doesn't match directly. */
  parentPeer?: RoutePeer | null;
  guildId?: string | null;
  teamId?: string | null;
  /** Discord member role IDs — used for role-based agent routing. */
  memberRoleIds?: string[];
};
type ResolvedAgentRoute = {
  agentId: string;
  channel: string;
  accountId: string;
  /** Effective direct-message scope after a matching binding override. */
  dmScope?: DmScope;
  groupScope?: GroupScope;
  /** Internal session key used for persistence + concurrency. */
  sessionKey: string;
  /** Convenience alias for direct-chat collapse. */
  mainSessionKey: string;
  /** Which session should receive inbound last-route updates. */
  lastRoutePolicy: "main" | "session";
  /** Match description for debugging/logging. */
  matchedBy: "binding.peer" | "binding.peer.parent" | "binding.peer.wildcard" | "binding.guild+roles" | "binding.guild" | "binding.team" | "binding.account" | "binding.channel" | "default";
};
declare function buildAgentSessionKey(params: {
  agentId: string;
  mainKey?: string;
  channel: string;
  accountId?: string | null;
  peer?: RoutePeer | null;
  /** DM session scope. */
  dmScope?: DmScope;
  groupScope?: GroupScope;
  identityLinks?: Record<string, string[]>;
}): string;
declare function resolveAgentRoute(input: ResolveAgentRouteInput): ResolvedAgentRoute;
//#endregion
export { buildAgentSessionKey as n, resolveAgentRoute as r, ResolvedAgentRoute as t };