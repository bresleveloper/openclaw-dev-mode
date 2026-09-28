import { $s as listAdoptedSessionCatalogSessions, Bs as SessionCatalogEntrySnapshot, Gs as SessionCatalogStartTerminalProviderParams, Hs as SessionCatalogListProviderParams, Js as SessionUpstreamJsonValue, Ks as SessionCatalogTerminalPlan, Ls as SessionCatalogArchiveProviderParams, Qs as isExternalUserText, Rs as SessionCatalogContinueProviderParams, Us as SessionCatalogProvider, Vs as SessionCatalogEntrySummary, Ws as SessionCatalogReadProviderParams, Xs as SessionUpstreamProbe, Ys as SessionUpstreamKind, Zs as createSessionCatalogAdoptionCoordinator, cc as OpenClawPluginNodeInvokePolicy, ec as listSessionCatalogEntries, nc as sessionCatalogAdoptedSessionKey, qs as SessionUpstreamActivity, rc as sessionCatalogAdoptedSourceKey, tc as normalizeUserText, th as OpenClawStateDatabaseOptions, ui as PluginRuntime, zs as SessionCatalogContinueProviderResult } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import "../openclaw-state-db-CMVCVfJm.js";
import { Ct as SessionsCatalogReadParams, Et as SessionsCatalogStartTerminalResult, St as SessionsCatalogListResult, Tt as SessionsCatalogStartTerminalParams, _t as SessionsCatalogArchiveParams, bt as SessionsCatalogContinueResult, ct as SessionCatalog, dt as SessionCatalogHost, ft as SessionCatalogLocator, gt as SessionCatalogTranscriptItem, lt as SessionCatalogCapabilities, mt as SessionCatalogSession, pt as SessionCatalogPullRequestSummary, ut as SessionCatalogDescriptor, vt as SessionsCatalogArchiveResult, wt as SessionsCatalogReadResult, x as TerminalUploadPathStyle, xt as SessionsCatalogListParams, yt as SessionsCatalogContinueParams } from "../index-hVvy_KTe.js";
import { v as OpenClawPluginNodeHostCommand, y as OpenClawPluginNodeHostCommandAvailabilityContext } from "../computer-use-contract-DHZnFt1X.js";
import "../kysely-sync-j49J-6_6.js";
import { DatabaseSync } from "node:sqlite";
import { Selectable } from "kysely";
//#region src/plugins/session-catalog-history-import.d.ts
export declare function importSessionCatalogHistory(params: {
  catalogId: string;
  threadId: string;
  read: (params: {
    cursor?: string;
    limit: number;
  }) => Promise<SessionsCatalogReadResult>;
  sessionId: string;
  sessionKey: string;
  agentId: string;
  cwd?: string;
  config: OpenClawConfig;
  continuationNotice?: string;
  commitGuard?: () => void;
}): Promise<void>;
//#endregion
//#region src/sessions/session-upstream-links.kernel.d.ts
type SessionUpstreamLink = {
  sessionKey: string;
  agentId: string;
  catalogId: string;
  hostId: string;
  threadId: string;
  upstreamKind: SessionUpstreamKind;
  upstreamRef: SessionUpstreamJsonValue;
  marker: SessionUpstreamJsonValue | null;
  lastScannedAt?: number;
  createdAt: number;
  updatedAt: number;
};
//#endregion
//#region src/sessions/session-upstream-links.d.ts
export declare function upsertSessionUpstreamLink(input: {
  sessionKey: string;
  agentId: string;
  catalogId: string;
  hostId: string;
  threadId: string;
  upstreamKind: SessionUpstreamKind;
  upstreamRef: SessionUpstreamJsonValue;
  marker: SessionUpstreamJsonValue;
}, options?: OpenClawStateDatabaseOptions & {
  now?: number;
  ifAbsent?: true;
  assertCommitAllowed?: () => void;
}): boolean;
export declare function deleteSessionUpstreamLink(sessionKey: string, agentId: string, options?: OpenClawStateDatabaseOptions & {
  expected?: SessionUpstreamLink;
  assertCommitAllowed?: () => void;
}): "deleted" | "absent" | "changed" | undefined;
//#endregion
//#region src/gateway/cli-session-history.claude-activity.d.ts
type ClaudeCliHistoryLineClassification = {
  humanTurn: boolean;
  occurredAt?: number;
  userText?: string;
};
/** Classifies one native JSONL row through the same filters used by history import. */
export declare function classifyClaudeCliHistoryLine(params: {
  line: string;
  cliSessionId: string;
  sourceLineNumber: number;
}): ClaudeCliHistoryLineClassification;
/** Applies native history filters to an already-decoded catalog user message. */
export declare function classifyClaudeCliHistoryMessage(params: {
  content: unknown;
  timestamp?: unknown;
  cliSessionId: string;
  sourceLineNumber: number;
}): ClaudeCliHistoryLineClassification;
//#endregion
//#region src/plugins/session-catalog-family.d.ts
type SessionCatalogPage = {
  sessions: SessionCatalogSession[];
  nextCursor?: string;
};
type CatalogNode = Awaited<ReturnType<PluginRuntime["nodes"]["list"]>>["nodes"][number];
type MaybePromise<T> = T | Promise<T>;
type SessionCatalogCapabilityProjection = {
  canContinue: boolean;
  canOpenTerminal: boolean;
};
type SessionCatalogFamilyMessages = {
  invalidNodeCursor: string;
  invalidNodeSessionPage: string;
  invalidNodeTranscriptPage: string;
  invalidHostId: string;
  localReadFailed: string;
  nodeInvokeFailed: string;
  nodeReadUnavailable: string;
  nodeTerminalUnavailable: string;
  sessionUnavailable: string;
};
type SessionCatalogTerminalOptions = {
  executable: string;
  uploadPathStyle?: TerminalUploadPathStyle;
  args: (threadId: string) => string[];
  title: (threadId: string) => string;
  requireLocalSession: (threadId: string) => Promise<SessionCatalogSession>;
  unavailableMessage: string;
};
type SessionCatalogContinuationOptions<TResult extends SessionCatalogContinueProviderResult> = {
  resolveAgentId: (requestedAgentId?: string) => string;
  availability: () => MaybePromise<{
    available: true;
  } | {
    available: false;
    message: string;
  }>;
  listAdopted: (agentId?: string, sessionEntries?: SessionCatalogEntrySnapshot) => MaybePromise<ReadonlyMap<string, string>>;
  loadSession: (threadId: string) => Promise<SessionCatalogSession>;
  validateSession: (session: SessionCatalogSession) => void;
  create: (params: {
    agentId: string;
    hostId: string;
    threadId: string;
    session: SessionCatalogSession;
  }) => Promise<{
    sessionKey: string;
  }>;
  complete: (continued: {
    sessionKey: string;
  }, threadId: string) => Promise<TResult>;
  nodeReadOnlyMessage: string;
};
type SessionCatalogFamilyOptions<TResult extends SessionCatalogContinueProviderResult = SessionCatalogContinueProviderResult> = {
  runtime: PluginRuntime;
  local: {
    hostId: string;
    label: string;
    available: (query: SessionCatalogListProviderParams) => MaybePromise<boolean>;
    list: (query: SessionCatalogListProviderParams) => Promise<SessionCatalogPage>;
    read: (request: Parameters<SessionCatalogProvider["read"]>[0]) => Promise<SessionsCatalogReadResult>;
    assertAccess: (hostId: string, allowProcessHomeFallback?: boolean) => void;
  };
  node: {
    listCommand: string;
    readCommand: string;
    terminalCommand: string;
    timeoutMs: number;
    maxHosts: number;
    maxPageLimit: number;
    sessionIdPattern: RegExp;
  };
  capabilities: {
    local: () => MaybePromise<SessionCatalogCapabilityProjection>;
    node: (node: CatalogNode) => SessionCatalogCapabilityProjection;
    project: (session: SessionCatalogSession, capabilities: SessionCatalogCapabilityProjection) => SessionCatalogSession;
  };
  messages: SessionCatalogFamilyMessages;
  continuation: SessionCatalogContinuationOptions<TResult>;
  terminal: SessionCatalogTerminalOptions;
  checkUpstreamActivity: NonNullable<SessionCatalogProvider["checkUpstreamActivity"]>;
};
/** Compose the shared local-plus-paired-node runtime for one CLI session-catalog family. */
export declare function createSessionCatalogFamily(options: SessionCatalogFamilyOptions, isExactCursor: (value: unknown) => value is string): Required<Pick<SessionCatalogProvider, "list" | "read" | "continueSession" | "checkUpstreamActivity" | "openTerminal">>;
type SessionCatalogNodeHostBindingsOptions = {
  capability: string;
  listCommand: string;
  readCommand: string;
  terminalCommand: string;
  sessionIdPattern: RegExp;
  executable: string;
  args: (threadId: string) => string[];
  listAvailable: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => boolean;
  terminalAvailable: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => boolean;
  parseParams: (paramsJSON?: string | null) => unknown;
  list: (params: unknown) => Promise<SessionCatalogPage>;
  read: (params: unknown) => Promise<SessionsCatalogReadResult>;
  requireSession: (threadId: string) => Promise<SessionCatalogSession>;
  /** Explicitly account for work that can outlive any of the catalog handlers. */
  hasActiveWork?: () => boolean;
  terminalIoRequiredMessage: string;
  terminalUnavailableMessage: string;
  invalidThreadIdMessage: string;
};
/** Build the three node-host commands and their explicit terminal-only invoke policy. */
export declare function createSessionCatalogNodeHostBindings(options: SessionCatalogNodeHostBindingsOptions): {
  commands: OpenClawPluginNodeHostCommand[];
  policies: OpenClawPluginNodeInvokePolicy[];
};
//#endregion
//#region src/plugin-sdk/session-catalog-paging.d.ts
/** Keep a host's publication owned until its callback finishes, even after a fail-soft list. */
export declare function publishSessionCatalogHost<T>(params: {
  onHost?: (host: T) => void;
  waitUntil?: (completion: Promise<void>) => void;
}, pendingHost: Promise<T>): void;
type SessionCatalogParameterMessages = {
  listNotObject: string;
  unknownListParameter: (key: string) => string;
  invalidSearchTerm: string;
  readNotObject: string;
  unknownReadParameter: (key: string) => string;
  invalidThreadId: string;
};
type SessionCatalogListParams = {
  searchTerm?: string;
  limit: number;
  cursor?: string;
};
type SessionCatalogReadParams = {
  threadId: string;
  limit: number;
  cursor?: string;
};
declare function boundedSessionCatalogLimit(value: unknown, fallback?: number): number;
declare function encodeSessionCatalogCursor(offset: number): string;
declare function optionalSessionCatalogCursor(value: unknown, maxLength?: number): string | undefined;
declare function parseSessionCatalogListParams(value: unknown, options: {
  searchMaxLength: number;
  messages: SessionCatalogParameterMessages;
}): SessionCatalogListParams;
declare function parseSessionCatalogReadParams(value: unknown, options: {
  threadIdMaxLength: number;
  threadIdPattern: RegExp;
  cursorMaxLength?: number;
  messages: SessionCatalogParameterMessages;
}): SessionCatalogReadParams;
declare function decodeSessionCatalogCursor(value: unknown): number;
declare function isExactSessionCatalogCursor(value: unknown): value is string;
/** Page chronological source items newest-first, bounding per-item and per-page byte budgets. */
declare function boundSessionCatalogTranscriptPage(items: SessionCatalogTranscriptItem[], limit: number, offset: number): {
  items: SessionCatalogTranscriptItem[];
  nextCursor?: string;
};
/** Canonical bounded parameter, base64url cursor, and UTF-8 transcript paging contract. */
export declare const sessionCatalogPaging: {
  readonly boundedLimit: typeof boundedSessionCatalogLimit;
  readonly encodeCursor: typeof encodeSessionCatalogCursor;
  readonly optionalCursor: typeof optionalSessionCatalogCursor;
  readonly parseListParams: typeof parseSessionCatalogListParams;
  readonly parseReadParams: typeof parseSessionCatalogReadParams;
  readonly decodeCursor: typeof decodeSessionCatalogCursor;
  readonly isExactCursor: typeof isExactSessionCatalogCursor;
  readonly boundTranscriptPage: typeof boundSessionCatalogTranscriptPage;
};
//#endregion
export { type ClaudeCliHistoryLineClassification, type SessionCatalog, type SessionCatalogArchiveProviderParams, type SessionCatalogCapabilities, type SessionCatalogContinueProviderParams, type SessionCatalogContinueProviderResult, type SessionCatalogDescriptor, type SessionCatalogEntrySnapshot, type SessionCatalogEntrySummary, type SessionCatalogFamilyOptions, type SessionCatalogHost, type SessionCatalogListProviderParams, type SessionCatalogLocator, type SessionCatalogNodeHostBindingsOptions, type SessionCatalogProvider, type SessionCatalogPullRequestSummary, type SessionCatalogReadProviderParams, type SessionCatalogSession, type SessionCatalogStartTerminalProviderParams, type SessionCatalogTerminalPlan, type SessionCatalogTranscriptItem, type SessionUpstreamActivity, type SessionUpstreamJsonValue, type SessionUpstreamKind, type SessionUpstreamProbe, type SessionsCatalogArchiveParams, type SessionsCatalogArchiveResult, type SessionsCatalogContinueParams, type SessionsCatalogContinueResult, type SessionsCatalogListParams, type SessionsCatalogListResult, type SessionsCatalogReadParams, type SessionsCatalogReadResult, type SessionsCatalogStartTerminalParams, type SessionsCatalogStartTerminalResult, createSessionCatalogAdoptionCoordinator, isExternalUserText, listAdoptedSessionCatalogSessions, listSessionCatalogEntries, normalizeUserText, sessionCatalogAdoptedSessionKey, sessionCatalogAdoptedSourceKey };