import { type OutboundMediaAccess } from "../media/load-options.js";
import type { PluginStateKeyedStore } from "./plugin-state-runtime.js";
/** Media loading policy used before plugin media is handed to channel delivery. */
export type OutboundMediaLoadOptions = {
    /** Maximum allowed media payload size before the load is rejected. */
    maxBytes?: number;
    /** Whether callers may load remote URLs, local files, or both. */
    mediaAccess?: OutboundMediaAccess;
    /** Approved local roots for file/path media; `"any"` disables root restriction. */
    mediaLocalRoots?: readonly string[] | "any";
    /** Optional local file reader used by tests or plugin-specific filesystem adapters. */
    mediaReadFile?: (filePath: string) => Promise<Buffer>;
    /** Workspace root used when resolving relative local media paths. */
    workspaceDir?: string;
    /** Explicit proxy URL forwarded to shared outbound media loading policy. */
    proxyUrl?: string;
    /** Fetch implementation for remote media loads. */
    fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    /** Extra fetch options merged into remote media requests. */
    requestInit?: RequestInit;
    /** Allows explicit proxy DNS behavior to be trusted by the media fetch guard. */
    trustExplicitProxyDns?: boolean;
};
/** Load outbound media from a remote URL or approved local path using the shared web-media policy. */
export declare function loadOutboundMediaFromUrl(mediaUrl: string, options?: OutboundMediaLoadOptions): Promise<import("./web-media.js").WebMediaResult>;
export type HostedOutboundMediaMetadata = {
    routePath: string;
    token: string;
    contentType?: string;
    expiresAt: number;
    byteLength: number;
};
export type HostedOutboundMediaEntry = {
    metadata: HostedOutboundMediaMetadata;
    buffer: Buffer;
};
export type HostedOutboundMediaMetaRecord = HostedOutboundMediaMetadata & {
    id: string;
    chunkCount: number;
};
export type HostedOutboundMediaChunkRecord = {
    id: string;
    index: number;
    dataBase64: string;
};
export type HostedOutboundMediaStore = {
    prepareUrl: (params: {
        mediaUrl: string;
        routePath: string;
        publicBaseUrl: string;
        maxBytes: number;
        proxyUrl?: string;
    }) => Promise<string>;
    read: (id: string, nowMs?: number) => Promise<HostedOutboundMediaEntry | null>;
    delete: (id: string) => Promise<void>;
    cleanupExpired: (nowMs?: number) => Promise<void>;
    clear: () => Promise<void>;
};
export type CreateHostedOutboundMediaStoreOptions = {
    metadataStore: PluginStateKeyedStore<HostedOutboundMediaMetaRecord>;
    chunkStore: PluginStateKeyedStore<HostedOutboundMediaChunkRecord>;
    ttlMs: number;
    resolveExpiresAtMs: (ttlMs: number) => number | undefined;
    createId?: () => string;
    createToken?: () => string;
    rawChunkBytes?: number;
    maxEntries?: number;
    maxChunkRows?: number;
    chunkRowsPerEntryBudget?: number;
};
export declare function createHostedOutboundMediaStore(options: CreateHostedOutboundMediaStoreOptions): HostedOutboundMediaStore;
