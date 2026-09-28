import { Pu as EmbeddingInput, _u as SandboxFsBridge } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { c as MemoryEntryProvenance, d as MemoryReadResult, l as MemoryExtraPath } from "../paths-UINMFCfh.js";
import { C as UserTurnTranscriptRecorder } from "../templating-OpWn1DzT.js";
import { t as SkillLibraryFile } from "../skill-library-DVzEZ7Hi.js";
import "../index-hVvy_KTe.js";
import { n as MediaFact } from "../media-facts-BUTxYH1x.js";
import { t as Skill } from "../skill-contract-ChC4fiJP.js";
import { a as SkillInstallSpec, i as SkillEntry, o as SkillResourceSourceReader, u as SkillsInstallPreferences } from "../types-CHfKS7Qr.js";
import { K as PluginHookSkillChangedEvent, U as PluginHookSkillArtifact, d as createWorkspaceBootstrapFilePolicy } from "../hook-runner-global-D5VgWbSn.js";
import "../common-BCM4z2Iy.js";
import "../agent-scope-D4U2tjwQ.js";
import { a as MemoryMultimodalSettings, i as MemoryMultimodalModality, t as ResolvedMemorySearchConfig } from "../memory-search-CpX4fand.js";
import { a as ArchiveLogger } from "../archive-LnFcwSkz.js";
import { Static, Type } from "typebox";
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
  writeDreams: (filePath: string, content: string) => Promise<void>;
  replaceReport: (filePath: string, content: string) => Promise<void>;
  appendCorpus: (filePath: string, content: string) => Promise<number>;
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
//#region src/infra/clawhub-artifacts.d.ts
type ClawHubDownloadResult = {
  archivePath: string;
  integrity: string;
  sha256Hex: string;
  artifact: "archive" | "clawpack";
  clawpackHeaderSha256?: string;
  clawpackHeaderSpecVersion?: number;
  npmIntegrity?: string;
  npmShasum?: string;
  npmTarballName?: string;
  cleanup: () => Promise<void>;
};
//#endregion
//#region src/infra/clawhub-skills.d.ts
declare const CLAWHUB_SKILLS_SH_TRUST_STATE: "not-scanned-by-clawhub";
type ClawHubSkillsShTrustState = typeof CLAWHUB_SKILLS_SH_TRUST_STATE;
type ClawHubSkillVerificationDecision = "pass" | "fail" | (string & {});
type ClawHubSkillVerificationResponse = {
  schema: "clawhub.skill.verify.v1";
  ok: boolean;
  decision: ClawHubSkillVerificationDecision;
  reasons: string[];
  slug?: string | null;
  displayName?: string | null;
  pageUrl?: string | null;
  publisherHandle?: string | null;
  publisherDisplayName?: string | null;
  createdAt?: number | null;
  skill: unknown;
  publisher: unknown;
  version: unknown;
  card: unknown;
  artifact: unknown;
  provenance: unknown;
  security: unknown;
  signature: unknown;
};
//#endregion
//#region src/skills/lifecycle/install-types.d.ts
/** Normalized output returned by skill install flows and command wrappers. */
type SkillInstallSkipReason = "brew" | "go" | "uv";
type SkillInstallResult = {
  ok: boolean;
  message: string;
  stdout: string;
  stderr: string;
  code: number | null;
  skipReason?: SkillInstallSkipReason;
  warnings?: string[];
};
//#endregion
//#region src/skills/lifecycle/skill-tree-digest.d.ts
/** File fingerprints captured before a ClawHub update or removal. */
type ClawHubSkillFileState = {
  slug: string;
  skillFilePath: string;
  skillFileSha256: string;
  fileTreeSha256: string;
};
//#endregion
//#region src/skills/lifecycle/workspace-types.d.ts
/** Result shape for installing a skill archive into a workspace skills dir. */
type SkillArchiveInstallResult = {
  ok: true;
  targetDir: string;
} | {
  ok: false;
  error: string;
  failureKind: SkillArchiveInstallFailureKind;
  replacementBlocked?: string;
};
type SkillArchiveInstallFailureKind = "invalid-request" | "unavailable";
type SkillRootInstallFiles = {
  workspaceDir: string;
  slug: string;
  extractedRoot: string;
  mode: "install" | "update";
  timeoutMs?: number;
  logger?: ArchiveLogger;
  rootMarkers?: readonly string[];
  /** Undefined skips the native update guard; null means the install was absent. */
  expectedClawHubState?: ClawHubSkillFileState | null;
};
type SkillRootApplyResult = {
  ok: true;
  targetDir: string;
  mode: "install" | "update";
  before?: PluginHookSkillArtifact;
  after?: PluginHookSkillArtifact;
} | Extract<SkillArchiveInstallResult, {
  ok: false;
}>;
type ClawHubSkillDownloadedArtifactLock = {
  kind: ClawHubDownloadResult["artifact"];
  sha256: string;
  integrity: string;
};
type ClawHubSkillFileLock = {
  path: string;
  sha256: string;
};
type ClawHubSkillVerificationLock = {
  schema: ClawHubSkillVerificationResponse["schema"];
  ok: boolean;
  decision: ClawHubSkillVerificationResponse["decision"];
  reasons: string[];
  card?: unknown;
  artifact?: unknown;
  provenance?: unknown;
  security?: unknown;
  signature?: unknown;
};
type ClawHubSkillLockEntry = {
  version: string;
  installedAt: number;
  registry?: string;
  ownerHandle?: string;
  requestedReference?: string;
  trustState?: ClawHubSkillsShTrustState;
  sourceUrl?: string;
  artifact?: ClawHubSkillDownloadedArtifactLock;
  skillFile?: ClawHubSkillFileLock;
  fileTreeSha256?: string;
  verification?: ClawHubSkillVerificationLock;
};
type ClawHubSkillOrigin = {
  version: 1;
  registry: string;
  slug: string;
  ownerHandle?: string;
  requestedReference?: string;
  trustState?: ClawHubSkillsShTrustState;
  installedVersion: string;
  installedAt: number;
  sourceUrl?: string;
  artifact?: ClawHubSkillDownloadedArtifactLock;
  skillFile?: ClawHubSkillFileLock;
  fileTreeSha256?: string;
};
type ClawHubSkillsLockfile = {
  version: 1;
  skills: Record<string, ClawHubSkillLockEntry>;
};
type ClawHubSkillRef = {
  slug: string;
  ownerHandle?: string;
  requestedReference?: string;
  trustState?: ClawHubSkillsShTrustState;
};
type ClawHubSkillVerificationSelector = "installed-version" | "version" | "tag" | "latest";
type ClawHubSkillVerificationTargetResult = {
  ok: true;
  slug: string;
  ownerHandle?: string;
  requestedReference?: string;
  trustState?: ClawHubSkillsShTrustState;
  baseUrl: string;
  version: string | undefined;
  tag: string | undefined;
  resolution: {
    source: "installed" | "registry";
    selector: ClawHubSkillVerificationSelector;
    registry: string;
    skillDir: string | undefined;
    installedVersion: string | undefined;
  };
} | {
  ok: false;
  error: string;
};
type ClawHubSkillInstallPreflightResult = {
  ok: true;
  action: "install" | "reuse";
  integrity: string;
  warning?: string;
} | {
  ok: false;
  code: string;
  error: string;
};
type TrackedUpdateTarget = {
  ok: true;
  slug: string;
  ownerHandle?: string;
  requestedReference?: string;
  trustState?: ClawHubSkillsShTrustState;
  baseUrl?: string;
  previousVersion: string | null;
} | {
  ok: false;
  slug: string;
  error: string;
};
type ClawHubSkillUninstallPlan = {
  workspaceDir: string;
  requestedRef: string;
  slug: string;
  version: string;
  installedAt: number;
  targetDir: string;
  skillFilePath: string;
  skillFileSha256: string;
  fileTreeSha256: string;
};
type ClawHubSkillUninstallPlanResult = {
  ok: true;
  plan: ClawHubSkillUninstallPlan;
} | {
  ok: false;
  code: "missing" | "ambiguous" | "modified";
  error: string;
};
type SkillSourceOrigin = {
  version: 1;
  source: "path" | "git";
  spec: string;
  slug: string;
  installedAt: number;
  git?: {
    url: string;
    ref?: string;
    commit?: string;
    resolvedAt: string;
  };
};
type CommittedSkillChange = {
  action: PluginHookSkillChangedEvent["action"];
  source: PluginHookSkillChangedEvent["source"];
  workspaceDir: string;
  before?: PluginHookSkillArtifact;
  after?: PluginHookSkillArtifact;
  proposal?: PluginHookSkillChangedEvent["proposal"];
  logger?: {
    warn?: (message: string) => void;
  };
};
type WorkspaceSkillLifecycle = {
  installSkillDependencies: (params: {
    skillKey: string;
    spec: SkillInstallSpec;
    preferences: SkillsInstallPreferences;
    timeoutMs: number;
  }) => Promise<SkillInstallResult>;
  applyExtractedSkillRoot: (params: SkillRootInstallFiles & {
    changes?: {
      source: PluginHookSkillChangedEvent["source"];
      sourceVersion?: string;
    };
    beforeInstall?: (mode: "install" | "update") => Promise<{
      error: string;
      failureKind: SkillArchiveInstallFailureKind;
    } | undefined>;
  }) => Promise<SkillRootApplyResult>;
  recordSkillSourceInstall: (params: {
    workspaceDir: string;
    targetDir: string;
    origin: SkillSourceOrigin;
  }) => Promise<void>;
  resolveClawHubSkillVerificationTarget: (params: {
    workspaceDir: string;
    slug: string;
    version?: string;
    tag?: string;
    baseUrl?: string;
  }) => Promise<ClawHubSkillVerificationTargetResult>;
  preflightSkillOwnerState: (params: {
    workspaceDir: string;
    requested: ClawHubSkillRef;
    requestedLabel: string;
    version: string;
    integrity: string;
  }) => Promise<ClawHubSkillInstallPreflightResult>;
  resolveRequestedUpdateSlug: (params: {
    workspaceDir: string;
    requestedSlug: string;
    lock: ClawHubSkillsLockfile;
  }) => Promise<string>;
  resolveTrackedUpdateTarget: (params: {
    workspaceDir: string;
    slug: string;
    lock: ClawHubSkillsLockfile;
    baseUrl?: string;
  }) => Promise<TrackedUpdateTarget>;
  readClawHubSkillsLockfile: (workspaceDir: string) => Promise<ClawHubSkillsLockfile>;
  recordClawHubSkillInstall: (params: {
    workspaceDir: string;
    skillDir: string;
    origin: ClawHubSkillOrigin;
    verification?: ClawHubSkillVerificationLock;
  }) => Promise<void>;
  assertClawHubSkillInstallState: (params: {
    workspaceDir: string;
    slug: string;
    force?: boolean;
  }) => Promise<void>;
  readInstalledClawHubSkillFiles: (params: {
    skillDir: string;
  }) => Promise<{
    fileTreeSha256: string;
    skillFile?: ClawHubSkillFileLock;
  }>;
  planClawHubSkillUninstall: (params: {
    workspaceDir: string;
    slug: string;
    expectedVersion: string;
  }) => Promise<ClawHubSkillUninstallPlanResult>;
  guardTrackedSkillLocalState: (params: {
    workspaceDir: string;
    slug: string;
    previousVersion: string | null;
  }) => Promise<{
    ok: true;
    plan: ClawHubSkillUninstallPlan | undefined;
  } | {
    ok: false;
    error: string;
  }>;
  applyClawHubSkillUninstall: (plan: ClawHubSkillUninstallPlan, options: {
    beforePersistentApply?: () => void;
    beforeRollback?: () => void;
    onCommittedChange?: (params: CommittedSkillChange) => Promise<void>;
  }) => Promise<{
    ok: true;
  } | {
    ok: false;
    error: string;
  }>;
};
type ClawHubSkillStatusLink = {
  status: "linked";
  valid: true;
  registry: string;
  slug: string;
  ownerHandle?: string;
  requestedReference?: string;
  trustState?: ClawHubSkillsShTrustState;
  installedVersion: string;
  installedAt: number;
  originPath: string;
  lockPath: string;
  sourceUrl?: string;
  artifact?: ClawHubSkillDownloadedArtifactLock;
  skillFile?: ClawHubSkillFileLock;
  fileTreeSha256?: string;
} | {
  status: "invalid";
  valid: false;
  reason: string;
  registry?: string;
  slug?: string;
  installedVersion?: string;
  installedAt?: number;
  originPath?: string;
  lockPath?: string;
};
type LocalSkillCardStatus = {
  present: true;
  path: string;
  sizeBytes: number;
};
//#endregion
//#region src/skills/discovery/status.types.d.ts
/** Filesystem facts, separate from Gateway policy and execution-host requirements. */
type WorkspaceSkillStatusFacts = {
  workspaceDir: string;
  managedSkillsDir: string;
  files: Array<{
    name: string;
    filePath: string;
    clawhub?: ClawHubSkillStatusLink;
    skillCard?: LocalSkillCardStatus & {
      content?: string;
    };
  }>;
};
//#endregion
//#region src/skills/loading/plugin-skill-root.d.ts
type PluginSkillRoot = {
  dir: string;
  rejectHardlinks: boolean;
};
//#endregion
//#region src/skills/loading/workspace-skill-sources.types.d.ts
type ResolvedSkillDiscoveryLimits = {
  maxCandidatesPerRoot: number;
  maxSkillsLoadedPerSource: number;
  maxSkillFileBytes: number;
};
/** Native discovery facts from the workspace host; Gateway retains filtering and policy. */
type WorkspaceSkillSources = {
  entries: Array<SkillEntry & {
    sourceOrder?: number;
  }>;
  executionEntries: SkillEntry[];
  runtime: {
    platform: string;
    bins: string[];
  };
  status?: WorkspaceSkillStatusFacts;
};
type WorkspaceSkillSourceRequest = {
  sourcePlan: WorkspaceSkillSourcePlan;
  /** Direct bundled lookup, before workspace precedence is applied. */
  bundledSkillName?: string;
  executionWorkspaceDir?: string;
  limits: ResolvedSkillDiscoveryLimits;
  /** Requirements from Gateway-owned Library selections also run on the workspace host. */
  additionalBins: string[];
  status?: {
    skillCardKey?: string;
  };
};
type WorkspaceSkillSource = {
  dir: string;
  source: string;
  tier: "extra" | "bundled" | "workshop" | "managed" | "personal" | "workspace";
  rejectHardlinks?: boolean;
  /** Original root precedence, retained when discovery is split between hosts. */
  order?: number;
};
type WorkspaceSkillSourcePlan = {
  workspaceDir: string;
  /** Admitted paths; adapters map them along with the source roots. */
  allowSymlinkTargets?: string[];
  roots: WorkspaceSkillSource[];
  pluginSkillsDir?: string;
  pluginSkillRoots: PluginSkillRoot[];
  managedSkillsDir: string;
  bundledSkillsDir?: string;
  stateDir?: string;
  userHomeDir?: string;
};
//#endregion
//#region src/agents/workspace-access.d.ts
type WorkspaceAttachmentTurn = {
  abortSignal?: AbortSignal;
  config?: OpenClawConfig;
  media?: MediaFact[];
  timeoutMs: number;
};
/** Host-owned workspace files; callers keep their existing allowlists. */
type AgentWorkspaceAccess = {
  /** Native Memory file operations; indexing and session state remain on Gateway. */
  memoryFiles?: MemoryWorkspaceFiles;
  /** Execute a Gateway-approved dependency recipe on the workspace host. */
  installSkillDependencies?: WorkspaceSkillLifecycle["installSkillDependencies"];
  /** Read native source tiers and execution-host facts without applying Gateway policy. */
  loadSkills?: (request: WorkspaceSkillSourceRequest) => Promise<WorkspaceSkillSources>;
  /** Keep a host subscription alive until aborted; notify without transferring file contents. */
  watchSkills?: (request: Pick<WorkspaceSkillSourceRequest, "sourcePlan" | "executionWorkspaceDir">, onChange: (event: "change" | "unavailable") => void, signal: AbortSignal) => Promise<void>;
  skillResources?: SkillResourceSourceReader;
  /** Transfer the source tree and apply it on the host; run beforeInstall on Gateway. */
  applySkillRoot?: WorkspaceSkillLifecycle["applyExtractedSkillRoot"];
  recordSkillSourceInstall?: WorkspaceSkillLifecycle["recordSkillSourceInstall"];
  clawHubSkills?: Omit<WorkspaceSkillLifecycle, "installSkillDependencies" | "applyExtractedSkillRoot" | "recordSkillSourceInstall">;
  bridge: Pick<SandboxFsBridge, "readFile" | "readFileWithSource" | "readDirectory" | "writeFile" | "stat">;
  /** Purpose-scoped output reads; the document bridge need not allow attachment paths. */
  outboundMedia?: {
    localRoots: readonly string[];
    readFile: (filePath: string, maxBytes: number) => Promise<Buffer>;
  };
  /** Transfer admitted originals and return execution-only paths; leave recorded media unchanged. */
  prepareTurnAttachments?: (turn: WorkspaceAttachmentTurn, assertCurrent: () => void) => Promise<string | undefined>;
};
/** The configured workspace host cannot currently provide the requested data. */
export declare class WorkspaceAccessUnavailableError extends Error {
  readonly code = "WORKSPACE_ACCESS_UNAVAILABLE";
  constructor(message: string, options?: ErrorOptions);
}
/** Match wrapped errors and separate SDK module instances without parsing messages. */
export declare function isWorkspaceAccessUnavailableError(error: unknown): boolean;
/** Declare ownership during plugin registration so startup cannot fall back to a local copy. */
export declare function declareAgentWorkspaceAccess(workspaceDir: string): void;
/**
 * Bind host access independently of an active harness turn. Releasing rejects
 * subsequent calls and stale results; it cannot undo an already dispatched write.
 */
export declare function registerAgentWorkspaceAccess(workspaceDir: string, access: AgentWorkspaceAccess): () => void;
export declare function getAgentWorkspaceAccess(workspaceDir: string, capability?: keyof AgentWorkspaceAccess): AgentWorkspaceAccess | undefined;
/** Prepare execution-only paths while retaining canonical media and transcript facts. */
export declare function prepareAgentWorkspaceAttachments(params: {
  workspaceDir: string;
  turn: WorkspaceAttachmentTurn & {
    userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
  };
  assertCurrent: () => void;
}): Promise<string | undefined>;
//#endregion
//#region src/agents/workspace-attachment-preparer.d.ts
/** Reuse an owned filesystem transport for admitted inputs; this does not establish a backend. */
export declare function createWorkspaceAttachmentPreparer(params: {
  /** Wrap the same backend for this turn; check authority before every physical command. */
  createBridge: (assertCurrent: () => void, signal: AbortSignal) => Pick<SandboxFsBridge, "readFile" | "stat"> & Required<Pick<SandboxFsBridge, "createFileExclusive">>;
  remoteRoot: string;
}): NonNullable<AgentWorkspaceAccess["prepareTurnAttachments"]>;
//#endregion
//#region src/agents/workspace-memory-client.d.ts
/** Client for the packaged, same-version Memory file worker, independent of its transport. */
export declare function createWorkspaceMemoryFileClient(options: {
  workspaceDir: string;
  /** POSIX workspace path on the remote host. */
  remoteWorkspaceDir: string;
  signal: AbortSignal;
  /** Deliver one JSON request on stdin and return stdout; reject incomplete replies. */
  request: (request: string, signal: AbortSignal) => Promise<string>;
  /** Deliver one JSON line, stream reply lines, and close the remote worker on abort. */
  subscribe: (request: string, onLine: (line: string) => void, signal: AbortSignal) => Promise<void>;
}): MemoryWorkspaceFiles;
//#endregion
//#region src/skills/runtime/resources.d.ts
declare function readSkillResourceFiles(skill: Skill, options: {
  allowMissingRoot: boolean;
  assertFileAccess?: (requestedPath: string, canonicalPath: string) => void;
}): Promise<SkillLibraryFile[] | null>;
//#endregion
//#region src/agents/workspace-worker.d.ts
/** Resolve the installed or source worker without adapters depending on core file layout. */
export declare function resolveWorkspaceWorkerArgv(kind: "memory" | "skills"): string[];
/** Reuse the native bounded Skill reader with host-owned per-file authorization. */
export declare function readWorkspaceSkillResources(...args: Parameters<typeof readSkillResourceFiles>): Promise<{
  path: string;
  content: string;
  encoding?: "base64" | "utf8" | undefined;
  executable?: boolean | undefined;
}[] | null>;
//#endregion
export { type AgentWorkspaceAccess, createWorkspaceBootstrapFilePolicy };