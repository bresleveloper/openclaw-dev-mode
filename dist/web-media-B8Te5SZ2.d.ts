import "./types.openclaw-D8uW-XQA.js";
import { r as MediaKind } from "./constants-CsRVvQpz.js";
import "./fs-safe-DlrPy6P_.js";
import "./local-roots-D8-jSmbR.js";
import { LookupAddress, lookup } from "node:dns";
import { Dispatcher } from "undici";
import { ImageMetadata } from "rastermill";
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
declare function createPinnedDispatcher(pinned: PinnedHostname, policy?: PinnedDispatcherPolicy, ssrfPolicy?: SsrFPolicy, timeoutMs?: number, streamTimeoutMs?: number): Dispatcher;
declare function closeDispatcher(dispatcher?: Dispatcher | null): Promise<void>;
/** Host callback used to read an already-authorized outbound media file. */
type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;
/** Host-provided file access used when a runtime can read outbound media from local disk. */
type OutboundMediaAccess = {
  localRoots?: readonly string[];
  readFile?: OutboundMediaReadFile;
  /** Agent workspace directory for resolving relative media paths. */
  workspaceDir?: string;
  /** Operator hostname deny list applied to remote outbound media downloads. */
  blockedHostnames?: readonly string[];
};
/** Legacy and current knobs accepted by outbound media loaders before normalization. */
type OutboundMediaLoadParams = {
  maxBytes?: number;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[] | "any";
  mediaReadFile?: OutboundMediaReadFile;
  proxyUrl?: string;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  requestInit?: RequestInit;
  trustExplicitProxyDns?: boolean;
  optimizeImages?: boolean;
  /** Agent workspace directory for resolving relative media paths. */
  workspaceDir?: string;
};
/** Normalized outbound media loader options consumed by fetch/local media helpers. */
type OutboundMediaLoadOptions = Omit<OutboundMediaLoadParams, "mediaAccess" | "mediaLocalRoots" | "mediaReadFile"> & {
  localRoots?: readonly string[] | "any";
  readFile?: OutboundMediaReadFile;
  hostReadCapability?: boolean;
  ssrfPolicy?: SsrFPolicy;
};
/** Builds the canonical media load options shared by outbound attachment paths. */
declare function buildOutboundMediaLoadOptions(params?: OutboundMediaLoadParams): OutboundMediaLoadOptions;
type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
  /** Widens source admission for an owner whose output is a bounded downscale. */
  maxInputPixels?: number;
};
declare const IMAGE_REDUCE_QUALITY_STEPS: readonly [85, 75, 65, 55, 45, 35];
declare function isImageProcessorUnavailableError(err: unknown): boolean;
/** Builds a descending, de-duplicated max-side search grid for iterative image resizing. */
declare function buildImageResizeSideGrid(maxSide: number, sideStart: number): number[];
/** Fully probes display dimensions through Rastermill when header-only metadata is insufficient. */
declare function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null>;
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
declare function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer>;
/** Optimizes PNG bytes under a target size and returns the chosen search parameters. */
declare function optimizeImageToPng(buffer: Buffer, maxBytes: number, options?: {
  sides?: readonly number[];
}): Promise<{
  buffer: Buffer;
  optimizedSize: number;
  resizeSide: number;
  compressionLevel: number;
}>;
type LocalMediaAccessErrorCode = "path-not-allowed" | "invalid-root" | "invalid-file-url" | "network-path-not-allowed" | "unsafe-bypass" | "unsupported-media-type" | "not-found" | "invalid-path" | "not-file";
declare class LocalMediaAccessError extends Error {
  code: LocalMediaAccessErrorCode;
  constructor(code: LocalMediaAccessErrorCode, message: string, options?: ErrorOptions);
}
/** Loaded media bytes plus resolved MIME kind and filename metadata for outbound/plugin callers. */
type WebMediaResult = {
  buffer: Buffer;
  contentType?: string;
  kind: MediaKind | undefined;
  fileName?: string;
  /** Source bytes came from a generated-HTML trust boundary. */
  trustedGeneratedHtmlSource?: boolean;
};
type WebMediaOptions = {
  maxBytes?: number;
  optimizeImages?: boolean;
  imageCompression?: ImageCompressionPolicy;
  ssrfPolicy?: SsrFPolicy;
  proxyUrl?: string;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  requestInit?: RequestInit;
  readIdleTimeoutMs?: number;
  trustExplicitProxyDns?: boolean;
  workspaceDir?: string;
  /** Allowed root directories for local path reads. "any" is deprecated; prefer sandboxValidated + readFile. */
  localRoots?: readonly string[] | "any";
  /** Channel inbound attachment root patterns checked with inbound path policy semantics. */
  inboundRoots?: readonly string[];
  /** Caller already validated the local path (sandbox/other guards); requires readFile override. */
  sandboxValidated?: boolean;
  readFile?: OutboundMediaReadFile;
  /** Host-local fs-policy read piggyback; rejects plaintext-like document sends. */
  hostReadCapability?: boolean;
  /** Host-authored send intent; ordinary file access checks still apply. */
  htmlPublication?: "explicit";
};
type ImageQualityPreference = "auto" | "efficient" | "balanced" | "high";
type ImageCompressionModelPolicy = {
  maxBytes?: number;
  maxPixels?: number;
  maxSidePx?: number;
  preferredSidePx?: number;
};
type ImageCompressionPolicy = {
  quality?: ImageQualityPreference;
  models?: ImageCompressionModelPolicy[];
  imageCount?: number;
};
/** Loads local, remote, hosted, or media-store media and optimizes images by default. */
declare function loadWebMedia(mediaUrl: string, maxBytesOrOptions?: number | WebMediaOptions, options?: {
  ssrfPolicy?: SsrFPolicy;
  localRoots?: readonly string[] | "any";
}): Promise<WebMediaResult>;
/** Loads local, remote, hosted, or media-store media without image optimization. */
declare function loadWebMediaRaw(mediaUrl: string, maxBytesOrOptions?: number | WebMediaOptions, options?: {
  ssrfPolicy?: SsrFPolicy;
  localRoots?: readonly string[] | "any";
}): Promise<WebMediaResult>;
/** Optimizes image bytes to JPEG under a target byte cap using the shared compression grid. */
declare function optimizeImageToJpeg(buffer: Buffer, maxBytes: number, opts?: {
  contentType?: string;
  fileName?: string;
  imageCompression?: ImageCompressionPolicy;
}): Promise<{
  buffer: Buffer;
  optimizedSize: number;
  resizeSide: number;
  quality: number;
}>;
export { ssrfPolicyFromHttpBaseUrlAllowedHostname as A, isPrivateIpAddress as C, resolvePinnedHostname as D, mergeSsrFPolicies as E, resolvePinnedHostnameWithPolicy as O, isBlockedHostnameOrIp as S, matchesHostnameAllowlist as T, PinnedDispatcherPolicy as _, LocalMediaAccessError as a, closeDispatcher as b, buildImageResizeSideGrid as c, optimizeImageToPng as d, resizeToJpeg as f, LookupFn as g, buildOutboundMediaLoadOptions as h, optimizeImageToJpeg as i, ssrfPolicyFromHttpBaseUrlAllowedOrigin as j, resolveSsrFPolicyForUrl as k, getImageMetadata as l, OutboundMediaReadFile as m, loadWebMedia as n, LocalMediaAccessErrorCode as o, OutboundMediaAccess as p, loadWebMediaRaw as r, IMAGE_REDUCE_QUALITY_STEPS as s, WebMediaResult as t, isImageProcessorUnavailableError as u, SsrFBlockedError as v, isPrivateNetworkAllowedByPolicy as w, createPinnedDispatcher as x, SsrFPolicy as y };