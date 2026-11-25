import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { r as RoutePeer } from "./resolve-route-CcLRUGNL.js";
import { t as Result } from "./result-CJ6jzG61.js";
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
declare function normalizeAgentId(value: string | undefined | null): string;
/** Normalizes an explicitly supplied agent id without falling back to the default agent. */
declare function normalizeAgentIdStrict(value: string | undefined | null): Result<string, "unrepresentable">;
/**
 * Built-in aliases normalize through channel ids, while plugin-owned channel ids
 * stay accepted even when core has no bundled alias for them.
 */
declare function normalizeMessageChannel(raw?: string | null): string | undefined;
declare function resolveGatewayMessageChannel(raw?: string | null): string | undefined;
declare function listBoundAccountIds(cfg: OpenClawConfig, channelId: string): string[];
declare function resolveDefaultAgentBoundAccountId(cfg: OpenClawConfig, channelId: string): string | null;
declare function formatSetExplicitDefaultInstruction(channelKey: string): string;
declare function formatSetExplicitDefaultToConfiguredInstruction(params: {
  channelKey: string;
}): string;
/** Outbound-only sends use the routing owner's session scopes and identity links. */
declare function buildOutboundBaseSessionKey(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel: string;
  accountId?: string | null;
  peer: RoutePeer;
}): string;
/** Normalizes channel thread/topic ids before outbound payload construction. */
declare function normalizeOutboundThreadId(value?: string | number | null): string | undefined;
export { listBoundAccountIds as a, normalizeMessageChannel as c, formatSetExplicitDefaultToConfiguredInstruction as i, normalizeAgentId as l, buildOutboundBaseSessionKey as n, resolveDefaultAgentBoundAccountId as o, formatSetExplicitDefaultInstruction as r, resolveGatewayMessageChannel as s, normalizeOutboundThreadId as t, normalizeAgentIdStrict as u };