/** Host callback used to read an already-authorized outbound media file. */
export type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;
/** Host-provided file access used when a runtime can read outbound media from local disk. */
export type OutboundMediaAccess = {
    localRoots?: readonly string[];
    readFile?: OutboundMediaReadFile;
    /** Agent workspace directory for resolving relative media paths. */
    workspaceDir?: string;
};
/** Legacy and current knobs accepted by outbound media loaders before normalization. */
export type OutboundMediaLoadParams = {
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
export type OutboundMediaLoadOptions = {
    maxBytes?: number;
    localRoots?: readonly string[] | "any";
    readFile?: (filePath: string) => Promise<Buffer>;
    proxyUrl?: string;
    fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    requestInit?: RequestInit;
    trustExplicitProxyDns?: boolean;
    hostReadCapability?: boolean;
    optimizeImages?: boolean;
    /** Agent workspace directory for resolving relative media paths. */
    workspaceDir?: string;
};
/** Normalizes empty root lists while preserving the explicit all-roots opt-in sentinel. */
export declare function resolveOutboundMediaLocalRoots(mediaLocalRoots?: readonly string[] | "any"): readonly string[] | "any" | undefined;
/** Collapses legacy read/root parameters into the current host media access shape. */
export declare function resolveOutboundMediaAccess(params?: {
    mediaAccess?: OutboundMediaAccess;
    mediaLocalRoots?: readonly string[];
    mediaReadFile?: OutboundMediaReadFile;
}): OutboundMediaAccess | undefined;
/** Builds the canonical media load options shared by outbound attachment paths. */
export declare function buildOutboundMediaLoadOptions(params?: OutboundMediaLoadParams): OutboundMediaLoadOptions;
