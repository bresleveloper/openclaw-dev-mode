import "./types.openclaw-LzSbb55e.js";
import { n as PinnedDispatcherPolicy, o as SsrFPolicy, t as LookupFn } from "./ssrf-CkjpArdF.js";
import { Dispatcher } from "undici";
import { IncomingMessage } from "node:http";
//#region src/infra/net/pinned-dispatcher-pool.d.ts
type PinnedDispatcherLease = {
  dispatcher: Dispatcher;
  reused: boolean;
  release: () => Promise<void>;
};
type PinnedDispatcherPoolOptions = {
  maxEntries: number;
  idleTtlMs: number;
};
/**
 * Bounded cache of reusable DNS-pinned dispatchers.
 *
 * Callers must perform fresh DNS and SSRF validation before every acquisition
 * and include the resulting origin, address set, and connection policy in the key.
 */
declare class PinnedDispatcherPool {
  private readonly entries;
  private readonly ownedEntries;
  private readonly maxEntries;
  private readonly idleTtlMs;
  private closed;
  constructor(options: PinnedDispatcherPoolOptions);
  acquire(params: {
    key: string;
    groupKey: string;
    createDispatcher: () => Dispatcher;
  }): PinnedDispatcherLease | undefined;
  closeAll(): Promise<void>;
  private createLease;
  private retireEntry;
  private startClose;
}
//#endregion
//#region src/infra/net/runtime-fetch.d.ts
type DispatcherAwareRequestInit = RequestInit & {
  dispatcher?: Dispatcher;
};
/** Uses the undici runtime fetch so callers can pass dispatcher-aware options. */
declare function fetchWithRuntimeDispatcher(input: RequestInfo | URL, init?: DispatcherAwareRequestInit): Promise<Response>;
//#endregion
//#region src/infra/net/fetch-guard.d.ts
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
declare const GUARDED_FETCH_MODE: {
  readonly STRICT: "strict";
  readonly TRUSTED_ENV_PROXY: "trusted_env_proxy";
  readonly TRUSTED_EXPLICIT_PROXY: "trusted_explicit_proxy";
};
type GuardedFetchMode = (typeof GUARDED_FETCH_MODE)[keyof typeof GUARDED_FETCH_MODE];
type GuardedFetchOptions = {
  url: string;
  fetchImpl?: FetchLike;
  /** Final synchronous check after transport preparation and before each request or redirect. */
  beforeRequest?: () => void | undefined;
  init?: RequestInit;
  capture?: false | {
    flowId?: string;
    meta?: Record<string, unknown>;
    sensitiveRequestHeaderNames?: readonly string[];
  };
  maxRedirects?: number;
  /**
   * Allow replaying unsafe request methods and bodies across cross-origin redirects.
   * Sensitive cross-origin headers (for example Authorization/Cookie) are still stripped.
   * Defaults to false.
   */
  allowCrossOriginUnsafeRedirectReplay?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  requireHttps?: boolean;
  policy?: SsrFPolicy;
  lookupFn?: LookupFn;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  /** Resolve a synchronous per-hop override so redirects can change proxy or direct routing. */
  resolveDispatcherPolicy?: (url: URL) => PinnedDispatcherPolicy | undefined;
  retainAuthorizationRedirectHostnameAllowlist?: string[];
  mode?: GuardedFetchMode;
  pinDns?: boolean;
  /** @deprecated use `mode: "trusted_env_proxy"` for trusted/operator-controlled URLs. */
  proxy?: "env";
  /**
   * @deprecated use `mode: "trusted_env_proxy"` instead.
   */
  dangerouslyAllowEnvProxyWithoutPinnedDns?: boolean;
  auditContext?: string;
  /** Internal opt-in for reusing freshly revalidated, direct pinned dispatchers. */
  dispatcherPool?: PinnedDispatcherPool;
};
type GuardedFetchResult = {
  response: Response;
  finalUrl: string;
  release: () => Promise<void>;
  refreshTimeout?: () => void;
  dispatcherReused?: boolean;
};
declare class GuardedFetchRedirectError extends Error {
  readonly status: number;
  readonly maxRedirects: number;
  constructor(params: {
    status: number;
    maxRedirects: number;
  });
}
type GuardedFetchPresetOptions = Omit<GuardedFetchOptions, "mode" | "proxy" | "dangerouslyAllowEnvProxyWithoutPinnedDns">;
declare function withStrictGuardedFetchMode(params: GuardedFetchPresetOptions): GuardedFetchOptions;
declare function withTrustedEnvProxyGuardedFetchMode(params: GuardedFetchPresetOptions): GuardedFetchOptions;
declare function withTrustedExplicitProxyGuardedFetchMode(params: GuardedFetchPresetOptions): GuardedFetchOptions;
declare function retainSafeHeadersForCrossOriginRedirectHeaders(headers?: HeadersInit): Record<string, string> | undefined;
declare function fetchWithSsrFGuard(params: GuardedFetchOptions): Promise<GuardedFetchResult>;
//#endregion
//#region src/gateway/net.d.ts
declare function isTrustedProxyAddress(ip: string | undefined, trustedProxies?: string[]): boolean;
declare function resolveClientIp(params: {
  remoteAddr?: string;
  forwardedFor?: string;
  realIp?: string;
  trustedProxies?: string[];
  /** Default false: only trust X-Real-IP when explicitly enabled. */
  allowRealIpFallback?: boolean;
}): string | undefined;
/**
 * Check if a hostname or IP refers to the local machine.
 * Handles: localhost, 127.x.x.x, ::1, [::1], ::ffff:127.x.x.x
 * Note: 0.0.0.0 and :: are NOT loopback - they bind to all interfaces.
 */
declare function isLoopbackHost(host: string): boolean;
/**
 * Check if a hostname or IP refers to a private or loopback address.
 * Handles the same hostname formats as isLoopbackHost, but also accepts
 * RFC 1918, link-local, CGNAT, and IPv6 ULA/link-local addresses.
 */
declare function isPrivateOrLoopbackHost(host: string): boolean;
//#endregion
export { GUARDED_FETCH_MODE as a, GuardedFetchRedirectError as c, retainSafeHeadersForCrossOriginRedirectHeaders as d, withStrictGuardedFetchMode as f, fetchWithRuntimeDispatcher as h, resolveClientIp as i, GuardedFetchResult as l, withTrustedExplicitProxyGuardedFetchMode as m, isPrivateOrLoopbackHost as n, GuardedFetchMode as o, withTrustedEnvProxyGuardedFetchMode as p, isTrustedProxyAddress as r, GuardedFetchOptions as s, isLoopbackHost as t, fetchWithSsrFGuard as u };