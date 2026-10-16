import { Tn as resolveAccountEntry, r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { t as Result } from "../result-VHVNeWs6.js";
import { i as parseThreadSessionSuffix, n as isCronSessionKey, r as isSubagentSessionKey, t as isAcpSessionKey } from "../session-key-utils-GUKTYFFD.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-Dh6XMgGH.js";
import { i as sanitizeAgentId, n as resolveAgentIdFromSessionKey, r as resolveThreadSessionKeys, t as buildGroupHistoryKey } from "../session-key-B_WKkX2s.js";
import { a as buildAgentSessionKey, c as resolveInboundLastRouteSessionKey, i as RoutePeerKind, n as ResolvedAgentRoute, o as deriveLastRoutePolicy, r as RoutePeer, s as resolveAgentRoute } from "../resolve-route-Dv1zO_Td.js";
//#region packages/normalization-core/src/agent-id.d.ts
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
export declare function normalizeAgentId(value: string | undefined | null): string;
/** Normalizes an explicitly supplied agent id without falling back to the default agent. */
export declare function normalizeAgentIdStrict(value: string | undefined | null): Result<string, "unrepresentable">;
//#endregion
//#region packages/session-url-contract/src/session-key.d.ts
export declare const DEFAULT_MAIN_KEY = "main";
/** Classifies process-only agent session keys without consulting runtime registry state. */
export declare function isIncognitoSessionKey(sessionKey: string | undefined | null): boolean;
type ParsedAgentSessionKey = {
  agentId: string;
  rest: string;
};
export declare function normalizeMainKey(value: string | undefined | null): string;
export declare function buildAgentMainSessionKey(params: {
  agentId: string;
  mainKey?: string | undefined;
}): string;
//#endregion
//#region packages/session-url-contract/src/session-key-normalization.d.ts
/**
 * Parse agent-scoped session keys in a canonical, case-insensitive way.
 * Returned values are canonicalized for stable comparisons/routing while
 * preserving provider-owned opaque peer IDs.
 */
export declare function parseAgentSessionKey(sessionKey: string | undefined | null): ParsedAgentSessionKey | null;
//#endregion
//#region src/utils/message-channel-core.d.ts
/**
 * Shared message-channel normalization for delivery, routing, config, and gateway headers.
 *
 * Built-in aliases normalize through channel ids, while plugin-owned channel ids
 * stay accepted even when core has no bundled alias for them.
 */
/** Normalizes raw channel names, aliases, and internal webchat into canonical ids. */
export declare function normalizeMessageChannel(raw?: string | null): string | undefined;
//#endregion
//#region src/utils/message-channel-normalize.d.ts
/** Normalizes and validates a raw channel value for Gateway routing. */
export declare function resolveGatewayMessageChannel(raw?: string | null): string | undefined;
//#endregion
//#region src/routing/bindings.d.ts
export declare function listBoundAccountIds(cfg: OpenClawConfig, channelId: string): string[];
export declare function resolveDefaultAgentBoundAccountId(cfg: OpenClawConfig, channelId: string): string | null;
//#endregion
//#region src/routing/default-account-warnings.d.ts
export declare function formatSetExplicitDefaultInstruction(channelKey: string): string;
export declare function formatSetExplicitDefaultToConfiguredInstruction(params: {
  channelKey: string;
}): string;
//#endregion
//#region src/infra/outbound/base-session-key.d.ts
/** Outbound-only sends use the routing owner's session scopes and identity links. */
export declare function buildOutboundBaseSessionKey(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel: string;
  accountId?: string | null;
  peer: RoutePeer;
}): string;
//#endregion
//#region src/infra/outbound/thread-id.d.ts
/** Normalizes channel thread/topic ids before outbound payload construction. */
export declare function normalizeOutboundThreadId(value?: string | number | null): string | undefined;
//#endregion
export { DEFAULT_ACCOUNT_ID, type ResolvedAgentRoute, type RoutePeer, type RoutePeerKind, buildAgentSessionKey, buildGroupHistoryKey, deriveLastRoutePolicy, isAcpSessionKey, isCronSessionKey, isSubagentSessionKey, normalizeAccountId, normalizeOptionalAccountId, parseThreadSessionSuffix, resolveAccountEntry, resolveAgentIdFromSessionKey, resolveAgentRoute, resolveInboundLastRouteSessionKey, resolveThreadSessionKeys, sanitizeAgentId };