import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { t as resolveAccountEntry } from "./account-lookup-AwHuXBzh.js";
import { a as normalizeMainKey, c as sanitizeAgentId, d as isCronSessionKey, f as isSubagentSessionKey, i as normalizeAgentId, m as parseThreadSessionSuffix, n as buildAgentMainSessionKey, o as resolveAgentIdFromSessionKey, p as parseAgentSessionKey, r as buildGroupHistoryKey, s as resolveThreadSessionKeys, t as DEFAULT_MAIN_KEY, u as isAcpSessionKey } from "./session-key-fJM_U9Lv.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-Dh6XMgGH.js";
import { a as deriveLastRoutePolicy, i as buildAgentSessionKey, n as RoutePeer, o as resolveAgentRoute, r as RoutePeerKind, s as resolveInboundLastRouteSessionKey, t as ResolvedAgentRoute } from "./resolve-route-lbgjeqKd.js";
import { i as resolveGatewayMessageChannel, r as normalizeMessageChannel } from "./message-channel-normalize-IwuTHJHT.js";

//#region src/routing/bindings.d.ts
declare function listBoundAccountIds(cfg: OpenClawConfig, channelId: string): string[];
declare function resolveDefaultAgentBoundAccountId(cfg: OpenClawConfig, channelId: string): string | null;
//#endregion
//#region src/routing/default-account-warnings.d.ts
declare function formatSetExplicitDefaultInstruction(channelKey: string): string;
declare function formatSetExplicitDefaultToConfiguredInstruction(params: {
  channelKey: string;
}): string;
//#endregion
//#region src/infra/outbound/base-session-key.d.ts
/**
 * Builds the canonical outbound base-session key for a resolved route peer.
 *
 * Mirrors the routing layer's session-scope rules so outbound-only sends and
 * inbound route resolution keep the same `dmScope` and identity-link behavior.
 */
declare function buildOutboundBaseSessionKey(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel: string;
  accountId?: string | null;
  peer: RoutePeer;
}): string;
//#endregion
//#region src/infra/outbound/thread-id.d.ts
/** Normalizes channel thread/topic ids before outbound payload construction. */
declare function normalizeOutboundThreadId(value?: string | number | null): string | undefined;
//#endregion
export { DEFAULT_ACCOUNT_ID, DEFAULT_MAIN_KEY, type ResolvedAgentRoute, type RoutePeer, type RoutePeerKind, buildAgentMainSessionKey, buildAgentSessionKey, buildGroupHistoryKey, buildOutboundBaseSessionKey, deriveLastRoutePolicy, formatSetExplicitDefaultInstruction, formatSetExplicitDefaultToConfiguredInstruction, isAcpSessionKey, isCronSessionKey, isSubagentSessionKey, listBoundAccountIds, normalizeAccountId, normalizeAgentId, normalizeMainKey, normalizeMessageChannel, normalizeOptionalAccountId, normalizeOutboundThreadId, parseAgentSessionKey, parseThreadSessionSuffix, resolveAccountEntry, resolveAgentIdFromSessionKey, resolveAgentRoute, resolveDefaultAgentBoundAccountId, resolveGatewayMessageChannel, resolveInboundLastRouteSessionKey, resolveThreadSessionKeys, sanitizeAgentId };