import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { r as OpenClawStateDatabaseOptions } from "../openclaw-state-db-Yba_0aSZ.js";
import { $ as SessionCatalogPullRequestSummary, J as SessionCatalog, Q as SessionCatalogLocator, X as SessionCatalogDescriptor, Y as SessionCatalogCapabilities, Z as SessionCatalogHost, at as SessionsCatalogContinueParams, ct as SessionsCatalogListResult, dt as SessionsCatalogStartTerminalParams, et as SessionCatalogSession, ft as SessionsCatalogStartTerminalResult, g as TerminalUploadPathStyle, it as SessionsCatalogArchiveResult, lt as SessionsCatalogReadParams, nt as SessionCatalogTranscriptItem, ot as SessionsCatalogContinueResult, rt as SessionsCatalogArchiveParams, st as SessionsCatalogListParams, ut as SessionsCatalogReadResult } from "../index-B4F-ENEv.js";
import { $i as OpenClawPluginNodeInvokePolicy, $l as SessionCatalogContinueProviderParams, Ql as SessionCatalogArchiveProviderParams, Zl as SessionUpstreamLink, _u as sessionCatalogAdoptedSessionKey, au as SessionCatalogReadProviderParams, cu as SessionUpstreamActivity, du as SessionUpstreamProbe, eu as SessionCatalogContinueProviderResult, fu as createSessionCatalogAdoptionCoordinator, gu as normalizeUserText, hu as listSessionCatalogEntries, iu as SessionCatalogProvider, lu as SessionUpstreamJsonValue, ma as PluginRuntime, mu as listAdoptedSessionCatalogSessions, nu as SessionCatalogEntrySummary, ou as SessionCatalogStartTerminalProviderParams, pu as isExternalUserText, ru as SessionCatalogListProviderParams, su as SessionCatalogTerminalPlan, tu as SessionCatalogEntrySnapshot, uu as SessionUpstreamKind, vu as sessionCatalogAdoptedSourceKey } from "../agent-harness-runtime-DZjstJNb.js";
import { n as OpenClawPluginNodeHostCommandAvailabilityContext, t as OpenClawPluginNodeHostCommand } from "../types.node-host-Dhzh5c5Z.js";
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
//#region src/sessions/session-upstream-links.d.ts
export declare function upsertSessionUpstreamLink(input: Omit<SessionUpstreamLink, "lastScannedAt" | "createdAt" | "updatedAt">, options?: OpenClawStateDatabaseOptions & {
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