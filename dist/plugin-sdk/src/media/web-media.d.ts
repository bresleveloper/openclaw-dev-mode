import { type MediaKind } from "@openclaw/media-core/constants";
import type { SsrFPolicy } from "../infra/net/ssrf.js";
import { getDefaultLocalRoots, LocalMediaAccessError, type LocalMediaAccessErrorCode } from "./local-media-access.js";
export { getDefaultLocalRoots, LocalMediaAccessError };
export type { LocalMediaAccessErrorCode };
/** Loaded media bytes plus resolved MIME kind and filename metadata for outbound/plugin callers. */
export type WebMediaResult = {
    buffer: Buffer;
    contentType?: string;
    kind: MediaKind | undefined;
    fileName?: string;
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
    readFile?: (filePath: string) => Promise<Buffer>;
    /** Host-local fs-policy read piggyback; rejects plaintext-like document sends. */
    hostReadCapability?: boolean;
};
/** Compression preference used to tune image size/quality search grids. */
export type ImageQualityPreference = "auto" | "efficient" | "balanced" | "high";
/** Per-model image compression constraints merged into outbound media policy. */
export type ImageCompressionModelPolicy = {
    maxBytes?: number;
    maxPixels?: number;
    maxSidePx?: number;
    preferredSidePx?: number;
};
/** Image compression policy for model/tool callers that need bounded media payloads. */
export type ImageCompressionPolicy = {
    quality?: ImageQualityPreference;
    models?: ImageCompressionModelPolicy[];
    imageCount?: number;
};
/** Returns the stricter byte cap between caller limits and image compression policy limits. */
export declare function effectiveImageBytesCap(baseCap: number | undefined, policy?: ImageCompressionPolicy): number | undefined;
/** Resolves the ordered max-side and JPEG quality search grid for an image compression policy. */
export declare function resolveImageCompressionGrid(policy?: ImageCompressionPolicy): {
    sides: number[];
    qualities: number[];
};
/** Optimizes image bytes for web-media delivery while preserving accepted original formats when possible. */
export declare function optimizeImageBufferForWebMedia(params: {
    buffer: Buffer;
    contentType?: string;
    fileName?: string;
    maxBytes?: number;
    imageCompression?: ImageCompressionPolicy;
}): Promise<WebMediaResult>;
/** Loads local, remote, hosted, or media-store media and optimizes images by default. */
export declare function loadWebMedia(mediaUrl: string, maxBytesOrOptions?: number | WebMediaOptions, options?: {
    ssrfPolicy?: SsrFPolicy;
    localRoots?: readonly string[] | "any";
}): Promise<WebMediaResult>;
/** Loads local, remote, hosted, or media-store media without image optimization. */
export declare function loadWebMediaRaw(mediaUrl: string, maxBytesOrOptions?: number | WebMediaOptions, options?: {
    ssrfPolicy?: SsrFPolicy;
    localRoots?: readonly string[] | "any";
}): Promise<WebMediaResult>;
/** Optimizes image bytes to JPEG under a target byte cap using the shared compression grid. */
export declare function optimizeImageToJpeg(buffer: Buffer, maxBytes: number, opts?: {
    contentType?: string;
    fileName?: string;
    imageCompression?: ImageCompressionPolicy;
}): Promise<{
    buffer: Buffer;
    optimizedSize: number;
    resizeSide: number;
    quality: number;
}>;
export { optimizeImageToPng } from "./media-services.js";
