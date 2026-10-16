import { r as MediaKind } from "./constants-BCpSHoXd.js";
import { n as OutboundMediaReadFile } from "./load-options-v9K2x1AC.js";
import { i as SsrFPolicy } from "./ssrf-Df8OYfGp.js";
import "./fs-safe-D1a5zN4L.js";
import "./local-roots-C-kCnqYW.js";
import "./media-services-BZ6OdWKs.js";
//#region src/media/local-media-access.d.ts
/** Machine-readable reasons local media path validation can fail. */
type LocalMediaAccessErrorCode = "path-not-allowed" | "invalid-root" | "invalid-file-url" | "network-path-not-allowed" | "unsafe-bypass" | "unsupported-media-type" | "not-found" | "invalid-path" | "not-file";
/** Error raised when a local media path escapes the configured allowlist. */
declare class LocalMediaAccessError extends Error {
  code: LocalMediaAccessErrorCode;
  constructor(code: LocalMediaAccessErrorCode, message: string, options?: ErrorOptions);
}
//#endregion
//#region src/media/web-media.d.ts
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
//#endregion
export { LocalMediaAccessError as a, optimizeImageToJpeg as i, loadWebMedia as n, LocalMediaAccessErrorCode as o, loadWebMediaRaw as r, WebMediaResult as t };