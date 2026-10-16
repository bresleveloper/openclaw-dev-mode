import { LookupAddress, lookup } from "node:dns";
import { Dispatcher } from "undici";
//#region src/infra/net/ssrf.d.ts
declare class SsrFBlockedError extends Error {
  constructor(message: string);
}
type LookupFn = (hostname: string, options: {
  all: true;
}) => Promise<LookupAddress[]>;
type SsrFPolicy = {
  allowPrivateNetwork?: boolean;
  dangerouslyAllowPrivateNetwork?: boolean;
  allowRfc2544BenchmarkRange?: boolean;
  /**
   * Exempt addresses in `fc00::/7` (IPv6 Unique Local Address block, RFC 4193)
   * from the SSRF private-IP block. Companion to
   * `allowRfc2544BenchmarkRange` for fake-ip proxy stacks (sing-box, Clash,
   * Surge) that resolve foreign domains to ULA addresses alongside the IPv4
   * 198.18.0.0/15 range. See #74351.
   */
  allowIpv6UniqueLocalRange?: boolean;
  allowedHostnames?: string[];
  /**
   * Exact HTTP origins that may promote only the current request hostname into
   * `allowedHostnames`. Evaluated per URL inside the redirect loop.
   */
  allowedOrigins?: string[];
  hostnameAllowlist?: string[];
  /** Deny exact hosts or wildcard subdomains; "*.example.com" excludes the apex. */
  blockedHostnames?: string[];
};
declare function mergeSsrFPolicies(...policies: Array<SsrFPolicy | undefined>): SsrFPolicy | undefined;
declare function ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl: string): SsrFPolicy | undefined;
declare function ssrfPolicyFromHttpBaseUrlAllowedOrigin(baseUrl: string): SsrFPolicy | undefined;
declare function isPrivateNetworkAllowedByPolicy(policy?: SsrFPolicy): boolean;
declare function resolveSsrFPolicyForUrl(url: URL, policy?: SsrFPolicy): SsrFPolicy | undefined;
declare function matchesHostnameAllowlist(hostname: string, allowlist: string[]): boolean;
declare function isPrivateIpAddress(address: string, policy?: SsrFPolicy): boolean;
declare function isBlockedHostnameOrIp(hostname: string, policy?: SsrFPolicy): boolean;
type PinnedHostname = {
  hostname: string;
  addresses: string[];
  lookup: typeof lookup;
};
type PinnedHostnameOverride = {
  hostname: string;
  addresses: string[];
};
type PinnedDispatcherPolicy = {
  mode: "direct";
  connect?: Record<string, unknown>;
  pinnedHostname?: PinnedHostnameOverride;
} | {
  mode: "env-proxy";
  connect?: Record<string, unknown>;
  proxyTls?: Record<string, unknown>;
  pinnedHostname?: PinnedHostnameOverride;
} | {
  mode: "explicit-proxy";
  proxyUrl: string;
  allowPrivateProxy?: boolean;
  proxyTls?: Record<string, unknown>;
  pinnedHostname?: PinnedHostnameOverride;
};
declare function resolvePinnedHostnameWithPolicy(hostname: string, params?: {
  lookupFn?: LookupFn;
  policy?: SsrFPolicy;
  signal?: AbortSignal;
}): Promise<PinnedHostname>;
declare function resolvePinnedHostname(hostname: string, lookupFn?: LookupFn): Promise<PinnedHostname>;
declare function createPinnedDispatcher(pinned: PinnedHostname, policy?: PinnedDispatcherPolicy, ssrfPolicy?: SsrFPolicy, timeoutMs?: number): Dispatcher;
declare function closeDispatcher(dispatcher?: Dispatcher | null): Promise<void>;
//#endregion
export { closeDispatcher as a, isPrivateIpAddress as c, mergeSsrFPolicies as d, resolvePinnedHostname as f, ssrfPolicyFromHttpBaseUrlAllowedOrigin as g, ssrfPolicyFromHttpBaseUrlAllowedHostname as h, SsrFPolicy as i, isPrivateNetworkAllowedByPolicy as l, resolveSsrFPolicyForUrl as m, PinnedDispatcherPolicy as n, createPinnedDispatcher as o, resolvePinnedHostnameWithPolicy as p, SsrFBlockedError as r, isBlockedHostnameOrIp as s, LookupFn as t, matchesHostnameAllowlist as u };