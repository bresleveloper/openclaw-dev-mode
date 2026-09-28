import { r as OpenClawPluginApi } from "../../cli-backend.types-kTOThe9I.js";
//#region packages/workboard-contract/src/index.d.ts
declare const WORKBOARD_STATUSES: readonly ["triage", "backlog", "todo", "scheduled", "ready", "running", "review", "blocked", "done"];
declare const WORKBOARD_PRIORITIES: readonly ["low", "normal", "high", "urgent"];
declare const WORKBOARD_EXECUTION_MODES: readonly ["autonomous", "manual"];
declare const WORKBOARD_EXECUTION_STATUSES: readonly ["idle", "running", "review", "blocked", "done"];
declare const WORKBOARD_EVENT_KINDS: readonly ["created", "edited", "moved", "linked", "specified", "decomposed", "claimed", "heartbeat", "execution_updated", "attempt_started", "attempt_updated", "comment_added", "link_added", "proof_added", "artifact_added", "attachment_added", "diagnostic", "notification", "dispatch", "orchestration", "protocol_violation", "archived", "unarchived", "stale"];
declare const WORKBOARD_ATTEMPT_STATUSES: readonly ["running", "succeeded", "failed", "blocked", "stopped"];
declare const WORKBOARD_LINK_TYPES: readonly ["parent", "child", "blocks", "blocked_by", "relates_to"];
declare const WORKBOARD_PROOF_STATUSES: readonly ["passed", "failed", "skipped", "unknown"];
declare const WORKBOARD_TEMPLATE_IDS: readonly ["bugfix", "docs", "release", "pr_review", "plugin"];
declare const WORKBOARD_DIAGNOSTIC_KINDS: readonly ["stranded_ready", "running_without_heartbeat", "blocked_too_long", "repeated_failures", "missing_proof", "orphaned_session", "archived_but_active"];
declare const WORKBOARD_DIAGNOSTIC_SEVERITIES: readonly ["warning", "error", "critical"];
declare const WORKBOARD_NOTIFICATION_KINDS: readonly ["completed", "failed", "stale"];
type WorkboardDeleteResult = {
  deleted: boolean;
  referenceUpdates?: Array<{
    id: string;
    previousUpdatedAt: number;
    updatedAt: number;
  }>;
};
type WorkboardStatus = (typeof WORKBOARD_STATUSES)[number];
type WorkboardPriority = (typeof WORKBOARD_PRIORITIES)[number];
type WorkboardExecutionEngine = string;
type WorkboardExecutionMode = (typeof WORKBOARD_EXECUTION_MODES)[number];
type WorkboardExecutionStatus = (typeof WORKBOARD_EXECUTION_STATUSES)[number];
type WorkboardEventKind = (typeof WORKBOARD_EVENT_KINDS)[number];
type WorkboardAttemptStatus = (typeof WORKBOARD_ATTEMPT_STATUSES)[number];
type WorkboardLinkType = (typeof WORKBOARD_LINK_TYPES)[number];
type WorkboardProofStatus = (typeof WORKBOARD_PROOF_STATUSES)[number];
type WorkboardTemplateId = (typeof WORKBOARD_TEMPLATE_IDS)[number];
type WorkboardDiagnosticKind = (typeof WORKBOARD_DIAGNOSTIC_KINDS)[number];
type WorkboardDiagnosticSeverity = (typeof WORKBOARD_DIAGNOSTIC_SEVERITIES)[number];
type WorkboardNotificationKind = (typeof WORKBOARD_NOTIFICATION_KINDS)[number];
type WorkboardExecution = {
  id: string;
  kind: "agent-session";
  engine?: WorkboardExecutionEngine;
  mode: WorkboardExecutionMode;
  status: WorkboardExecutionStatus;
  model?: string;
  sessionKey?: string;
  runId?: string;
  startedAt: number;
  updatedAt: number;
};
type WorkboardEvent = {
  id: string;
  kind: WorkboardEventKind;
  at: number;
  fromStatus?: WorkboardStatus;
  toStatus?: WorkboardStatus;
  sessionKey?: string;
  runId?: string;
};
type WorkboardRunAttempt = {
  id: string;
  status: WorkboardAttemptStatus;
  startedAt: number;
  endedAt?: number;
  engine?: WorkboardExecutionEngine;
  mode?: WorkboardExecutionMode;
  model?: string;
  sessionKey?: string;
  runId?: string;
  error?: string;
};
type WorkboardComment = {
  id: string;
  body: string;
  createdAt: number;
  updatedAt?: number;
};
type WorkboardLink = {
  id: string;
  type: WorkboardLinkType;
  createdAt: number;
  targetCardId?: string;
  title?: string;
  url?: string;
};
type WorkboardProof = {
  id: string;
  status: WorkboardProofStatus;
  createdAt: number;
  label?: string;
  command?: string;
  url?: string;
  note?: string;
};
type WorkboardArtifact = {
  id: string;
  createdAt: number;
  label?: string;
  url?: string;
  path?: string;
  mimeType?: string;
};
type WorkboardAttachment = {
  id: string;
  cardId: string;
  createdAt: number;
  fileName: string;
  byteSize: number;
  mimeType?: string;
  note?: string;
};
type WorkboardWorkerLog = {
  id: string;
  createdAt: number;
  level: "info" | "warning" | "error";
  message: string;
  sessionKey?: string;
  runId?: string;
};
type WorkboardWorkerProtocol = {
  state: "idle" | "running" | "completed" | "blocked" | "violated";
  updatedAt: number;
  detail?: string;
};
type WorkboardStaleState = {
  detectedAt: number;
  lastSessionUpdatedAt?: number;
  reason: string;
};
type WorkboardClaim = {
  ownerId: string;
  token: string;
  claimedAt: number;
  lastHeartbeatAt: number;
  expiresAt?: number;
};
type WorkboardDiagnosticAction = {
  kind: "claim" | "unblock" | "promote" | "reclaim" | "reassign" | "add_proof" | "open_session";
  label: string;
};
type WorkboardDiagnostic = {
  kind: WorkboardDiagnosticKind;
  severity: WorkboardDiagnosticSeverity;
  title: string;
  detail: string;
  firstSeenAt: number;
  lastSeenAt: number;
  count: number;
  actions: WorkboardDiagnosticAction[];
};
type WorkboardNotification = {
  id: string;
  kind: WorkboardNotificationKind;
  createdAt: number;
  sequence?: number;
  message: string;
  sessionKey?: string;
  runId?: string;
};
type WorkboardChange = {
  epoch: string;
  revision: number;
};
type WorkboardWorkspace = {
  kind: "scratch" | "dir" | "worktree";
  path?: string;
  branch?: string;
  sourcePath?: string;
  sourceBranch?: string;
};
type WorkboardWorkspaceAccess = {
  unrestricted: true;
} | {
  unrestricted: false;
  roots: string[];
  writable: boolean;
};
type WorkboardLaunchIdentity = {
  requestedSessionKey: string;
  provisionalRunId: string;
  preparedAt: number;
};
type WorkboardLaunchState = (WorkboardLaunchIdentity & {
  phase: "prepared";
}) | (WorkboardLaunchIdentity & {
  phase: "accepted";
  acceptedAt: number;
  acceptedSessionKey: string;
  acceptedRunId?: string;
}) | (WorkboardLaunchIdentity & {
  phase: "failed";
  failedAt: number;
  reason: string;
});
type WorkboardAutomation = {
  tenant?: string;
  boardId?: string;
  createdByCardId?: string;
  idempotencyKey?: string;
  skills?: string[];
  workspace?: WorkboardWorkspace;
  workspaceAccess?: WorkboardWorkspaceAccess;
  maxRuntimeSeconds?: number;
  maxRetries?: number;
  scheduledAt?: number;
  summary?: string;
  createdCardIds?: string[];
  dispatchCount?: number;
  lastDispatchAt?: number;
  launch?: WorkboardLaunchState;
};
type WorkboardBoardMetadata = {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  automationJobId?: string;
  defaultWorkspace?: WorkboardWorkspace;
  orchestration?: WorkboardOrchestrationSettings;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number;
};
type WorkboardBoardSummary = {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  automationJobId?: string;
  defaultWorkspace?: WorkboardWorkspace;
  orchestration?: WorkboardOrchestrationSettings;
  total: number;
  active: number;
  archived: number;
  byStatus: Partial<Record<WorkboardStatus, number>>;
  updatedAt?: number;
  archivedAt?: number;
};
type WorkboardOrchestrationSettings = {
  autoDecompose?: boolean;
  autoDecomposePerDispatch?: number;
  defaultAssignee?: string;
  orchestratorProfile?: string;
};
type WorkboardNotificationSubscription = {
  id: string;
  boardId: string;
  cardId?: string;
  sessionKey?: string;
  runId?: string;
  target?: string;
  eventKinds?: WorkboardNotificationKind[];
  lastEventAt?: number;
  lastEventId?: string;
  lastEventSequence?: number;
  deliveredEventIds?: string[];
  createdAt: number;
  updatedAt: number;
};
type WorkboardMetadata = {
  attempts?: WorkboardRunAttempt[];
  comments?: WorkboardComment[];
  links?: WorkboardLink[];
  proof?: WorkboardProof[];
  artifacts?: WorkboardArtifact[];
  attachments?: WorkboardAttachment[];
  workerLogs?: WorkboardWorkerLog[];
  workerProtocol?: WorkboardWorkerProtocol;
  automation?: WorkboardAutomation;
  claim?: WorkboardClaim;
  diagnostics?: WorkboardDiagnostic[];
  notifications?: WorkboardNotification[];
  templateId?: WorkboardTemplateId;
  archivedAt?: number;
  stale?: WorkboardStaleState;
  lifecycleStatusSourceUpdatedAt?: number;
  failureCount?: number;
};
type WorkboardCard = {
  id: string;
  title: string;
  notes?: string;
  status: WorkboardStatus;
  priority: WorkboardPriority;
  labels: string[];
  agentId?: string;
  sessionKey?: string;
  runId?: string;
  taskId?: string;
  sourceUrl?: string;
  execution?: WorkboardExecution;
  position: number;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
  events?: WorkboardEvent[];
  metadata?: WorkboardMetadata;
};
type WorkboardListResult = {
  cards: WorkboardCard[];
  statuses: readonly WorkboardStatus[];
};
//#endregion
//#region extensions/workboard/src/store-inputs.d.ts
type WorkboardCardInput = {
  title?: unknown;
  notes?: unknown;
  status?: unknown;
  priority?: unknown;
  labels?: unknown;
  agentId?: unknown;
  sessionKey?: unknown;
  runId?: unknown;
  taskId?: unknown;
  sourceUrl?: unknown;
  execution?: unknown;
  metadata?: unknown;
  templateId?: unknown;
  position?: unknown;
  tenant?: unknown;
  boardId?: unknown;
  createdByCardId?: unknown;
  idempotencyKey?: unknown;
  skills?: unknown;
  workspace?: unknown;
  /** Trusted mutation provenance; not accepted from public tool schemas. */
  workspaceAccess?: unknown;
  maxRuntimeSeconds?: unknown;
  maxRetries?: unknown;
  scheduledAt?: unknown;
  startedAt?: unknown;
  completedAt?: unknown;
  parents?: unknown;
};
type WorkboardCardPatch = Partial<WorkboardCardInput>;
type WorkboardUpdateCardOptions = {
  allowAutomationLaunch?: boolean;
  allowMetadataDependencyLinks?: boolean;
  enforceStatusHolds?: boolean;
  event?: Omit<WorkboardEvent, "id" | "at">;
  eventAt?: number;
  expectedUpdatedAt?: number;
  ownerSlot?: {
    ownerId: string;
    now: number;
  };
  preserveProofId?: string;
};
type WorkboardCommentInput = {
  body?: unknown;
};
type WorkboardLinkInput = {
  type?: unknown;
  targetCardId?: unknown;
  title?: unknown;
  url?: unknown;
};
type WorkboardLinkedCreateInput = WorkboardCardInput & {
  parents?: unknown;
};
type WorkboardProofInput = {
  status?: unknown;
  label?: unknown;
  command?: unknown;
  url?: unknown;
  note?: unknown;
};
type WorkboardArtifactInput = {
  label?: unknown;
  url?: unknown;
  path?: unknown;
  mimeType?: unknown;
};
type WorkboardAttachmentInput = {
  fileName?: unknown;
  contentBase64?: unknown;
  mimeType?: unknown;
  note?: unknown;
};
type WorkboardWorkerLogInput = {
  level?: unknown;
  message?: unknown;
  sessionKey?: unknown;
  runId?: unknown;
};
type WorkboardProtocolViolationInput = {
  detail?: unknown;
  sessionKey?: unknown;
  runId?: unknown;
};
type WorkboardClaimInput = {
  ownerId?: unknown;
  token?: unknown;
  ttlSeconds?: unknown;
};
type WorkboardClaimOptions = {
  assertOwnerCurrent?: () => void;
  /** Trusted dispatcher guard; never accepted from public tool or gateway input. */
  expectedAuthority?: {
    boardId: string;
    status: WorkboardCard["status"];
    agentId?: string;
    workspace?: WorkboardWorkspace;
    workspaceAccess?: WorkboardWorkspaceAccess;
  };
  /** Trusted legacy-card adoption; applied only while expectedAuthority still matches. */
  adoptWorkspaceAccess?: WorkboardWorkspaceAccess;
};
type WorkboardHeartbeatInput = {
  token?: unknown;
  ownerId?: unknown;
  note?: unknown;
};
type WorkboardBulkInput = {
  ids?: unknown;
  patch?: unknown;
  archived?: unknown;
};
type WorkboardCompleteInput = {
  ownerId?: unknown;
  token?: unknown;
  summary?: unknown;
  proof?: unknown;
  proofId?: unknown;
  artifacts?: unknown;
  createdCardIds?: unknown;
};
type WorkboardBlockInput = {
  ownerId?: unknown;
  token?: unknown;
  reason?: unknown;
};
type WorkboardDispatchResult = {
  promoted: WorkboardCard[];
  reclaimed: WorkboardCard[];
  blocked: WorkboardCard[];
  orchestrated: WorkboardCard[];
  count: number;
};
type WorkboardListOptions = {
  boardId?: unknown;
};
type WorkboardDispatchOptions = WorkboardListOptions & {
  now?: unknown;
  assertOwnerCurrent?: () => void;
};
type WorkboardStatsResult = WorkboardBoardSummary & {
  byAgent: Record<string, number>;
  oldestReadyAgeMs?: number;
};
type WorkboardPromoteInput = {
  force?: unknown;
  reason?: unknown;
};
type WorkboardReassignInput = {
  agentId?: unknown;
  status?: unknown;
  resetFailures?: unknown;
  reason?: unknown;
};
type WorkboardReclaimInput = {
  status?: unknown;
  reason?: unknown;
};
type WorkboardBoardInput = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  icon?: unknown;
  color?: unknown;
  clearAppearance?: unknown;
  automationJobId?: unknown;
  defaultWorkspace?: unknown;
  orchestration?: unknown;
  archived?: unknown;
};
type WorkboardSpecifyInput = WorkboardCardPatch & {
  summary?: unknown;
};
type WorkboardDecomposeInput = {
  summary?: unknown;
  children?: unknown;
  completeParent?: unknown;
};
type WorkboardNotificationSubscribeInput = {
  boardId?: unknown;
  cardId?: unknown;
  sessionKey?: unknown;
  runId?: unknown;
  target?: unknown;
  eventKinds?: unknown;
};
type WorkboardNotificationListOptions = {
  boardId?: unknown;
  cardId?: unknown;
};
type WorkboardNotificationEventsInput = WorkboardNotificationListOptions & {
  subscriptionId?: unknown;
  limit?: unknown;
};
type WorkboardMutationScope = {
  ownerId?: unknown;
  token?: unknown;
};
type WorkboardDiagnosticsResult = {
  diagnostics: Array<{
    card: WorkboardCard;
    diagnostics: WorkboardDiagnostic[];
  }>;
  count: number;
};
//#endregion
//#region extensions/workboard/src/persistence-types.d.ts
type WorkboardWriteAuthority = <T>(assertCurrent: () => void, run: () => Promise<T>) => Promise<T>;
type PersistedWorkboardCard = {
  version: 1;
  card: WorkboardCard;
};
type PersistedWorkboardBoard = {
  version: 1;
  board: WorkboardBoardMetadata;
};
type PersistedWorkboardNotificationSubscription = {
  version: 1;
  subscription: WorkboardNotificationSubscription;
};
type PersistedWorkboardAttachment = {
  version: 1;
  attachment: WorkboardAttachment;
  contentBase64: string;
};
type WorkboardKeyedStore<T = PersistedWorkboardCard> = {
  register(key: string, value: T): Promise<void>;
  lookup(key: string): Promise<T | undefined>;
  delete(key: string): Promise<boolean>;
  entries(): Promise<Array<{
    key: string;
    value: T;
  }>>;
};
type WorkboardSubscriptionStore = Omit<WorkboardKeyedStore<PersistedWorkboardNotificationSubscription>, "entries"> & {
  entries(options?: {
    boardId?: string;
    cardId?: string;
  }): Promise<Array<{
    key: string;
    value: PersistedWorkboardNotificationSubscription;
  }>>;
};
type WorkboardBoardCardAggregate = {
  boardId: string;
  status: WorkboardCard["status"];
  total: number;
  archived: number;
  updatedAt: number;
};
type WorkboardCardStatsAggregate = {
  status: WorkboardCard["status"];
  agentId: string | undefined;
  total: number;
  archived: number;
  updatedAt: number;
  oldestReadyAt: number | undefined;
};
type WorkboardOwnerClaimResult = "updated" | "conflict" | "owner_busy";
type WorkboardCardReadScope = {
  kind: "board";
  boardId: string;
} | {
  kind: "session";
  sessionKey: string;
} | {
  kind: "worker-context";
  cardId: string;
  boardId: string;
  agentId?: string;
  parentIds: readonly string[];
};
type WorkboardCardStore = Omit<WorkboardKeyedStore, "entries"> & {
  entries(scope?: WorkboardCardReadScope): Promise<Array<{
    key: string;
    value: PersistedWorkboardCard;
  }>>;
  registerIfAbsent(key: string, value: PersistedWorkboardCard): Promise<boolean>;
  registerIfUpdatedAt(key: string, value: PersistedWorkboardCard, expectedUpdatedAt: number): Promise<boolean>;
  deleteIfUpdatedAt(key: string, expectedUpdatedAt: number): Promise<boolean>;
  claimIfOwnerAvailable(key: string, value: PersistedWorkboardCard, expectedUpdatedAt: number, ownerId: string, now: number): Promise<WorkboardOwnerClaimResult>;
  listCardStatuses(ids: readonly string[]): Promise<Array<{
    id: string;
    status: string;
  }>>;
  listBoardAggregates(): Promise<WorkboardBoardCardAggregate[]>;
  listStatsAggregates(boardId?: string): Promise<WorkboardCardStatsAggregate[]>;
  hasCards(boardId: string): Promise<boolean>;
};
//#endregion
//#region extensions/workboard/src/store-runtime.d.ts
declare class WorkboardStoreRuntime {
  private readonly readDataVersion?;
  private readonly closePersistence?;
  private readonly runWithWriteAuthority?;
  private readonly operationScope;
  private readonly operations;
  private mutationQueue;
  private closePromise;
  private sealed;
  private readonly epoch;
  private revision;
  private mutationRevision;
  private externalDataVersion;
  private readonly listeners;
  private readonly initialization;
  constructor(readDataVersion?: (() => number | Promise<number>) | undefined, closePersistence?: (() => void | Promise<void>) | undefined, ready?: Promise<number>, runWithWriteAuthority?: WorkboardWriteAuthority | undefined);
  ready(): Promise<void>;
  runOperation<T>(run: () => T | Promise<T>): Promise<T>;
  close(): Promise<void>;
  protected track<T>(store: WorkboardKeyedStore<T>, { notifyChanges }?: {
    notifyChanges?: boolean;
  }): WorkboardKeyedStore<T>;
  protected trackCardStore(store: WorkboardCardStore): WorkboardCardStore;
  subscribeChanges(listener: (change: WorkboardChange) => void): () => void;
  announceChangeEpoch(): void;
  reconcileExternalChanges(): Promise<boolean>;
  protected enqueueMutation<T>(run: () => Promise<T>, assertCurrent?: () => void): Promise<T>;
  protected withMutationAuthority<T>(run: () => Promise<T>, assertCurrent?: () => void): Promise<T>;
  private runMutation;
  private emit;
}
//#endregion
//#region extensions/workboard/src/store-core.d.ts
declare class WorkboardCoreStore extends WorkboardStoreRuntime {
  private lastNotificationSequence;
  private compensationJournal?;
  protected readonly store: WorkboardCardStore;
  protected readonly boardStore: WorkboardKeyedStore<PersistedWorkboardBoard>;
  protected readonly subscriptionStore: WorkboardSubscriptionStore;
  protected readonly attachmentStore: WorkboardKeyedStore<PersistedWorkboardAttachment>;
  constructor(store: WorkboardCardStore, stores: {
    boards: WorkboardKeyedStore<PersistedWorkboardBoard>;
    subscriptions: WorkboardSubscriptionStore;
    attachments: WorkboardKeyedStore<PersistedWorkboardAttachment>;
    ready?: Promise<number>;
    dataVersion?: () => number | Promise<number>;
    close?: () => void | Promise<void>;
    runWithWriteAuthority?: WorkboardWriteAuthority;
  });
  protected withCardCompensation<T>(run: () => Promise<T>): Promise<T>;
  private compensationError;
  private recordCardMutation;
  private rollbackCardMutations;
  compensateWorkspaceMutation(before: WorkboardCard, after: WorkboardCard): Promise<void>;
  private rollbackUpdatedCard;
  private rollbackCreatedCard;
  private registerCardIfUpdatedAt;
  private deleteCardIfUpdatedAt;
  protected updateLatestCard(id: string, buildPatch: (current: WorkboardCard) => WorkboardCardPatch | undefined, options?: WorkboardUpdateCardOptions): Promise<{
    card: WorkboardCard;
    updated: boolean;
  }>;
  protected updateMetadata(id: string, mutate: (existing: WorkboardCard) => WorkboardMetadata, options?: {
    preserveProofId?: string;
    expectedUpdatedAt?: number;
  }): Promise<WorkboardCard>;
  protected deleteDetachedAttachments(existing: WorkboardCard, next: WorkboardCard): Promise<void>;
  protected nextNotificationSequence(now: number): number;
  list(options?: WorkboardListOptions): Promise<WorkboardCard[]>;
  listBoards(): Promise<{
    boards: WorkboardBoardSummary[];
  }>;
  upsertBoard(input: WorkboardBoardInput): Promise<WorkboardBoardMetadata>;
  archiveBoard(id: unknown, archived?: unknown): Promise<WorkboardBoardMetadata>;
  deleteBoard(id: unknown): Promise<{
    deleted: boolean;
  }>;
  stats(input?: WorkboardListOptions, now?: number): Promise<WorkboardStatsResult>;
  get(id: string): Promise<WorkboardCard | undefined>;
  private removeReferencesToCard;
  create(input: WorkboardLinkedCreateInput, scope?: WorkboardMutationScope, assertOwnerCurrent?: () => void): Promise<WorkboardCard>;
  protected createDirect(input: WorkboardLinkedCreateInput, scope?: WorkboardMutationScope, options?: {
    cardId?: string;
    insertIfAbsent?: boolean;
  }): Promise<WorkboardCard>;
  captureSession(input: WorkboardLinkedCreateInput): Promise<WorkboardCard>;
  update(id: string, patch: WorkboardCardPatch, options?: {
    expectedUpdatedAt?: number;
  }): Promise<WorkboardCard>;
  protected updateCard(id: string, patch: WorkboardCardPatch, options?: WorkboardUpdateCardOptions): Promise<WorkboardCard>;
  private assertActiveStatusAllowed;
  delete(id: string, options?: {
    expectedUpdatedAt?: number;
  }): Promise<WorkboardDeleteResult>;
  protected deleteDirect(id: string, options?: {
    expectedUpdatedAt?: number;
  }): Promise<WorkboardDeleteResult>;
  addComment(id: string, input: WorkboardCommentInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  addLink(id: string, input: WorkboardLinkInput): Promise<WorkboardCard>;
  linkCards(parentId: string, childId: string, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  protected linkCardsDirect(parentId: string, childId: string, now?: number, options?: {
    allowStatusOnlyActiveChild?: boolean;
    scope?: WorkboardMutationScope;
  }): Promise<WorkboardCard>;
  private dependencyTargetStatus;
  private dependsOn;
  protected recordOrchestrationCandidate(card: WorkboardCard, now: number): Promise<WorkboardCard>;
  protected promoteDependencyReady(id: string, now?: number): Promise<WorkboardCard>;
}
//#endregion
//#region extensions/workboard/src/store-enrichment.d.ts
declare class WorkboardEnrichmentStore extends WorkboardCoreStore {
  addProof(id: string, input: WorkboardProofInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  addProofWithArtifact(id: string, proofInput: WorkboardProofInput, artifactInput: WorkboardArtifactInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  addArtifact(id: string, input: WorkboardArtifactInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  addAttachment(id: string, input: WorkboardAttachmentInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  listAttachments(id: string): Promise<{
    card: WorkboardCard;
    attachments: WorkboardAttachment[];
  }>;
  getAttachment(id: string): Promise<PersistedWorkboardAttachment | undefined>;
  deleteAttachment(cardId: string, attachmentId: string, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  addWorkerLog(id: string, input: WorkboardWorkerLogInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  recordProtocolViolation(id: string, input?: WorkboardProtocolViolationInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
}
//#endregion
//#region extensions/workboard/src/store-promote.d.ts
declare class WorkboardPromoteStore extends WorkboardEnrichmentStore {
  promoteReady(now?: number): Promise<{
    cards: WorkboardCard[];
    count: number;
  }>;
  move(id: string, status: unknown, position: unknown, scope?: WorkboardMutationScope, options?: {
    expectedUpdatedAt?: number;
    assertOwnerCurrent?: () => void;
  }): Promise<WorkboardCard>;
  promote(id: string, input?: WorkboardPromoteInput, scope?: WorkboardMutationScope | null): Promise<WorkboardCard>;
}
//#endregion
//#region extensions/workboard/src/store-workflow.d.ts
declare class WorkboardWorkflowStore extends WorkboardPromoteStore {
  claim(id: string, input: WorkboardClaimInput, options?: WorkboardClaimOptions): Promise<{
    card: WorkboardCard;
    token: string;
  }>;
  heartbeat(id: string, input: WorkboardHeartbeatInput): Promise<WorkboardCard>;
  releaseClaim(id: string, input?: WorkboardHeartbeatInput & {
    status?: unknown;
  }): Promise<WorkboardCard>;
  complete(id: string, input?: WorkboardCompleteInput, scope?: WorkboardMutationScope | null | undefined): Promise<WorkboardCard>;
  private completeDirect;
  protected buildBlockedCardPatch(existing: WorkboardCard, reason: string, now: number, options?: {
    clearExecutionAssociation?: boolean;
  }): WorkboardCardPatch & {
    metadata: WorkboardMetadata;
  };
  block(id: string, input?: WorkboardBlockInput, scope?: WorkboardMutationScope | null | undefined, options?: {
    clearExecutionAssociation?: boolean;
  }): Promise<WorkboardCard>;
  unblock(id: string, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  reassign(id: string, input?: WorkboardReassignInput, scope?: WorkboardMutationScope | null): Promise<WorkboardCard>;
  reclaim(id: string, input?: WorkboardReclaimInput, scope?: WorkboardMutationScope | null): Promise<WorkboardCard>;
  runs(id: string): Promise<{
    card: WorkboardCard;
    attempts: WorkboardRunAttempt[];
  }>;
  specify(id: string, input?: WorkboardSpecifyInput, scope?: WorkboardMutationScope | null): Promise<WorkboardCard>;
  decompose(id: string, input?: WorkboardDecomposeInput, scope?: WorkboardMutationScope | null): Promise<{
    parent: WorkboardCard;
    children: WorkboardCard[];
  }>;
}
//#endregion
//#region extensions/workboard/src/store-notifications.d.ts
declare class WorkboardNotificationStore extends WorkboardWorkflowStore {
  subscribeNotifications(input: WorkboardNotificationSubscribeInput): Promise<WorkboardNotificationSubscription>;
  listNotificationSubscriptions(input?: WorkboardNotificationListOptions): Promise<{
    subscriptions: WorkboardNotificationSubscription[];
  }>;
  deleteNotificationSubscription(id: string): Promise<{
    deleted: boolean;
  }>;
  private collectNotificationEvents;
  notificationEvents(input?: WorkboardNotificationEventsInput): Promise<{
    subscription?: WorkboardNotificationSubscription;
    events: WorkboardNotification[];
  }>;
  advanceNotificationEvents(input?: WorkboardNotificationEventsInput): Promise<{
    subscription?: WorkboardNotificationSubscription;
    events: WorkboardNotification[];
  }>;
}
//#endregion
//#region extensions/workboard/src/store.d.ts
type WorkboardExecutionAssociationInput = {
  expectedSessionKey?: string;
  expectedRunId?: string;
  sessionKey: string;
  runId?: string;
  execution: WorkboardExecution;
};
type WorkboardLifecycleAssociation = Omit<WorkboardExecutionAssociationInput, "execution"> & {
  acceptedAt?: number;
};
type WorkboardPreparedLaunch = Extract<WorkboardLaunchState, {
  phase: "prepared";
}>;
declare class WorkboardStore extends WorkboardNotificationStore {
  prepareExecutionLaunch(id: string, input: {
    requestedSessionKey: string;
    now: number;
    scope: WorkboardMutationScope;
    assertOwnerCurrent?: () => void;
  }): Promise<{
    card: WorkboardCard;
    launch: WorkboardPreparedLaunch;
  }>;
  acceptExecutionLaunch(id: string, input: WorkboardExecutionAssociationInput & {
    expectedLaunch: WorkboardPreparedLaunch;
    acceptedAt: number;
  }): Promise<WorkboardCard | undefined>;
  failPreparedLaunch(id: string, input: {
    expectedLaunch: WorkboardPreparedLaunch;
    reason: string;
    failedAt: number;
  }): Promise<boolean>;
  syncLifecycle(id: string, input: {
    targetStatus: WorkboardStatus | undefined;
    executionStatus: WorkboardExecutionStatus | undefined;
    sourceUpdatedAt: number | undefined;
    stale: WorkboardStaleState | undefined;
    now: number;
    association?: WorkboardLifecycleAssociation;
  }): Promise<boolean>;
  prepareStart(id: string, now?: number, assertOwnerCurrent?: () => void): Promise<WorkboardCard>;
  private getAutoOrchestrationBoard;
  dispatch(input?: number | WorkboardDispatchOptions): Promise<WorkboardDispatchResult>;
  bulkUpdate(input: WorkboardBulkInput): Promise<{
    cards: WorkboardCard[];
  }>;
  archive(id: string, archived: unknown, options?: {
    expectedUpdatedAt?: number;
  }): Promise<WorkboardCard>;
  exportCards(): Promise<{
    cards: WorkboardCard[];
    attachments: WorkboardAttachment[];
    exportedAt: number;
  }>;
  diagnostics(now?: number): Promise<WorkboardDiagnosticsResult>;
  refreshDiagnostics(now?: number): Promise<WorkboardDiagnosticsResult>;
  buildWorkerContext(id: string): Promise<string>;
  static openSqlite(workerModuleUrl: URL): WorkboardStore;
}
//#endregion
//#region extensions/workboard/src/gateway.d.ts
export declare function registerWorkboardGatewayMethods(params: {
  api: OpenClawPluginApi;
  store?: WorkboardStore;
}): void;
//#endregion
export type { WorkboardCard, WorkboardClaim, WorkboardDiagnostic, WorkboardListResult, WorkboardPriority, WorkboardStatus };