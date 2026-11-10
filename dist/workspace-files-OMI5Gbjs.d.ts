import { _ as MemoryExtraPath, b as MemoryReadResult, g as MemoryEntryProvenance } from "./types-D7I_F5Ux.js";
import { Wm as EmbeddingInput } from "./config-contracts-CY87ANNp.js";
import "./common-CCG3ut4I.js";
import { a as MemoryMultimodalSettings, i as MemoryMultimodalModality, t as ResolvedMemorySearchConfig } from "./memory-search-UMUE5u-D.js";
//#region packages/memory-host-sdk/src/host/markdown-chunks.d.ts
type MemoryChunk = {
  startLine: number;
  endLine: number;
  entryStartLine?: number;
  entryEndLine?: number;
  text: string;
  hash: string;
  embeddingInput?: EmbeddingInput;
  provenance?: MemoryEntryProvenance;
};
//#endregion
//#region packages/memory-host-sdk/src/host/internal.d.ts
type MemoryFileEntry = {
  path: string;
  absPath: string;
  mtimeMs: number;
  size: number;
  hash: string;
  dataHash?: string;
  kind?: "markdown" | "multimodal";
  contentText?: string;
  modality?: MemoryMultimodalModality;
  mimeType?: string;
};
type MultimodalMemoryChunk = {
  chunk: MemoryChunk;
  structuredInputBytes: number;
};
declare function listMemoryFiles(workspaceDir: string, extraPaths?: MemoryExtraPath[], multimodal?: MemoryMultimodalSettings, onSkippedSymlinkRoot?: (root: string) => void): Promise<string[]>;
declare function buildFileEntry(absPath: string, workspaceDir: string, multimodal?: MemoryMultimodalSettings): Promise<MemoryFileEntry | null>;
declare function buildMultimodalChunkForIndexing(entry: Pick<MemoryFileEntry, "absPath" | "contentText" | "mimeType" | "kind" | "hash" | "size" | "dataHash">): Promise<MultimodalMemoryChunk | null>;
//#endregion
//#region packages/memory-host-sdk/src/host/config-utils.d.ts
type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
type MemoryCitationsMode = "auto" | "on" | "off";
type MemoryConfig = {
  citations?: MemoryCitationsMode;
  search?: MemorySearchConfig;
};
type MemorySearchConfig = {
  enabled?: boolean;
  rememberAcrossConversations?: boolean;
  extraPaths?: MemoryExtraPath[];
};
type AgentContextLimitsConfig = {
  memoryGetMaxChars?: number;
};
/** Secret reference accepted by provider header config. */
type SecretInput = string | {
  source: string;
  provider: string;
  id: string;
};
type AgentConfig = {
  workspace?: string;
  memory?: {
    search?: MemorySearchConfig;
  };
  contextLimits?: AgentContextLimitsConfig;
};
/** Narrow OpenClaw config shape consumed by memory host utilities. */
type OpenClawConfig = {
  agents?: {
    ownership?: "explicit";
    defaults?: {
      workspace?: string;
      contextLimits?: AgentContextLimitsConfig;
    };
    entries?: Record<string, AgentConfig>;
  };
  session?: {
    dmScope?: DmScope;
  };
  bindings?: unknown[];
  memory?: MemoryConfig;
  models?: {
    providers?: Record<string, {
      api?: string;
      baseUrl?: string;
      headers?: Record<string, SecretInput>;
    }>;
  };
};
//#endregion
//#region packages/memory-host-sdk/src/host/read-file.d.ts
/** Read a validated memory markdown file from workspace or configured extra paths. */
declare function readMemoryFile(params: {
  workspaceDir: string;
  extraPaths?: MemoryExtraPath[];
  relPath: string;
  from?: number;
  lines?: number;
  defaultLines?: number;
  maxChars?: number;
}): Promise<MemoryReadResult>;
//#endregion
//#region packages/memory-host-sdk/src/host/workspace-files.d.ts
type MemoryFileMetadata = {
  isFile: boolean;
  isDirectory: boolean;
  isSymbolicLink: boolean;
  size: number;
  mtimeMs: number;
  mode: number;
};
type MemoryFileCommit = {
  filePath: string;
  tempPrefix: string;
  expectedHash?: string;
  allowInPlaceFallback?: boolean;
  conflictMessage?: string;
} & ({
  content: string;
  expectedContent?: string;
} | {
  content: null;
  expectedContent: string;
});
/** File operations used by existing Gateway maintenance, without its state or locks. */
type MemoryWorkspaceMaintenance = {
  readFile: (filePath: string) => Promise<Buffer>;
  stat: (filePath: string, followSymlinks: boolean) => Promise<MemoryFileMetadata>;
  listDirectory: (directory: string) => Promise<Array<Pick<MemoryFileMetadata, "isFile" | "isDirectory" | "isSymbolicLink"> & {
    name: string;
  }>>;
  mkdir: (directory: string) => Promise<void>;
  rename: (from: string, to: string) => Promise<void>;
  resolveWritePath: (filePath: string) => Promise<string>;
  /** Preserve native publication errors; a lost reply must report publication: "uncertain". */
  commitContent: (params: MemoryFileCommit) => Promise<void>;
  resolveDreamsPath: () => Promise<string>;
  readDreams: (filePath: string) => Promise<string>;
  /** Carry caller authority through transport preparation to the remote start boundary. */
  writeDreams: (filePath: string, content: string, assertCurrent?: () => void) => Promise<void>;
  replaceReport: (filePath: string, content: string) => Promise<void>;
  appendCorpus: (filePath: string, content: string, assertCurrent?: () => void) => Promise<number>;
};
type MemoryWorkspaceWatchRequest = {
  agentId: string;
  settings: Pick<ResolvedMemorySearchConfig, "extraPaths" | "multimodal"> & {
    sync: Pick<ResolvedMemorySearchConfig["sync"], "watchDebounceMs">;
  };
};
/** File operations only. The Gateway retains the index, embeddings and sessions. */
type MemoryWorkspaceFiles = {
  maintenance?: MemoryWorkspaceMaintenance;
  listFiles: typeof listMemoryFiles;
  inspectFile: typeof buildFileEntry;
  readFile: typeof readMemoryFile;
  readForIndexing: (filePath: string) => Promise<{
    content: string;
    /** Canonical source from the read on the host, not a Gateway realpath lookup. */
    canonicalRelativePath?: string;
  }>;
  buildMultimodalChunk: (entry: Parameters<typeof buildMultimodalChunkForIndexing>[0]) => Promise<(NonNullable<Awaited<ReturnType<typeof buildMultimodalChunkForIndexing>>> & {
    canonicalRelativePath?: string;
  }) | null>;
  /** Subscription ends when aborted. A lost subscription must report unavailable. */
  watch: (request: MemoryWorkspaceWatchRequest, onChange: (event: "change" | "unavailable") => void, signal: AbortSignal) => Promise<void>;
  /** Bound by the workspace registration owner, including retained managers. */
  assertCurrent: () => void;
};
//#endregion
export { MemoryCitationsMode as n, OpenClawConfig as r, MemoryWorkspaceFiles as t };