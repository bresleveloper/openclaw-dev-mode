//#region src/media/load-options.d.ts
/** Host callback used to read an already-authorized outbound media file. */
type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;
/** Host-provided file access used when a runtime can read outbound media from local disk. */
type OutboundMediaAccess = {
  localRoots?: readonly string[];
  readFile?: OutboundMediaReadFile;
  /** Agent workspace directory for resolving relative media paths. */
  workspaceDir?: string;
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
type OutboundMediaLoadOptions = {
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
/** Builds the canonical media load options shared by outbound attachment paths. */
declare function buildOutboundMediaLoadOptions(params?: OutboundMediaLoadParams): OutboundMediaLoadOptions;
//#endregion
export { OutboundMediaReadFile as n, buildOutboundMediaLoadOptions as r, OutboundMediaAccess as t };