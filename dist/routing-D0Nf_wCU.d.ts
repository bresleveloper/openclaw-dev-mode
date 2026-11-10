import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { t as Result } from "./result-VHVNeWs6.js";
import { r as RoutePeer } from "./resolve-route-C19qE71T.js";
import { u as ParsedAgentSessionKey } from "./session-key-CXlXkZeh.js";
//#region packages/normalization-core/src/agent-id.d.ts
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
declare function normalizeAgentId(value: string | undefined | null): string;
/** Normalizes an explicitly supplied agent id without falling back to the default agent. */
declare function normalizeAgentIdStrict(value: string | undefined | null): Result<string, "unrepresentable">;
//#endregion
//#region packages/session-url-contract/src/session-key-normalization.d.ts
/**
 * Parse agent-scoped session keys in a canonical, case-insensitive way.
 * Returned values are canonicalized for stable comparisons/routing while
 * preserving provider-owned opaque peer IDs.
 */
declare function parseAgentSessionKey(sessionKey: string | undefined | null): ParsedAgentSessionKey | null;
//#endregion
//#region src/utils/message-channel-core.d.ts
/**
 * Built-in aliases normalize through channel ids, while plugin-owned channel ids
 * stay accepted even when core has no bundled alias for them.
 */
declare function normalizeMessageChannel(raw?: string | null): string | undefined;
//#endregion
//#region src/utils/message-channel-normalize.d.ts
declare function resolveGatewayMessageChannel(raw?: string | null): string | undefined;
//#endregion
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
/** Outbound-only sends use the routing owner's session scopes and identity links. */
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
export { listBoundAccountIds as a, normalizeMessageChannel as c, normalizeAgentIdStrict as d, formatSetExplicitDefaultToConfiguredInstruction as i, parseAgentSessionKey as l, buildOutboundBaseSessionKey as n, resolveDefaultAgentBoundAccountId as o, formatSetExplicitDefaultInstruction as r, resolveGatewayMessageChannel as s, normalizeOutboundThreadId as t, normalizeAgentId as u };