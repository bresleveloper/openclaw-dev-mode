import { $a as WorkboardDiagnostic, It as OpenClawPluginApi, Ja as WorkboardBoardSummary, Ka as WorkboardAttachment, Qa as WorkboardDeleteResult, Tg as OpenClawPluginService, Xa as WorkboardChange, Ya as WorkboardCard, Za as WorkboardClaim, _o as WorkboardSessionsBoardSpec, ao as WorkboardMetadata, co as WorkboardPriority, do as WorkboardStatus, eo as WorkboardEvent, fo as WorkboardWorkspace, go as WorkboardSessionsBoardRead, ho as WorkboardSessionsBoard, io as WorkboardListResult, lo as WorkboardRunAttempt, mo as WorkboardSessionPlacement, no as WorkboardExecutionStatus, oo as WorkboardNotification, po as WorkboardWorkspaceAccess, qa as WorkboardBoardMetadata, ro as WorkboardLaunchState, so as WorkboardNotificationSubscription, to as WorkboardExecution, uo as WorkboardStaleState, vo as WorkboardSessionsBoardView } from "../../config-contracts-CY87ANNp.js";
import { t as resolveDatabaseEngineInput } from "../../config-D5r1YFWG.js";
import "../../database-engine-runtime-sqz7OrBI.js";
//#region extensions/workboard/src/persistence-types.d.ts
/**
 * Guard the first accepted write (including CAS retries), then allow its settlement.
 * Independently authorized effects need separate scopes; settled scopes cannot be reused.
 */
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
type WorkboardSessionPlacementWrite = WorkboardSessionPlacement & {
  source: "operator";
  /** Undefined requires an absent row; otherwise compare the last observed revision. */
  expectedUpdatedAt?: number;
};
type WorkboardSessionsBoardStore = {
  get(boardId: string): Promise<WorkboardSessionsBoard>;
  update(boardId: string, patch: unknown): Promise<WorkboardSessionsBoard>;
  listPlacements(boardId: string): Promise<WorkboardSessionPlacement[]>;
  repairPlacements(): Promise<{
    placements: number;
    boards: number;
  }>;
  writePlacement(boardId: string, placement: WorkboardSessionPlacementWrite, expectedSpec: WorkboardSessionsBoardSpec): Promise<boolean>;
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
  kind: "session-links";
  sessionKey: string;
  boardId?: string;
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
type WorkboardPersistence = {
  cards: WorkboardCardStore;
  boards: WorkboardKeyedStore<PersistedWorkboardBoard>;
  sessionsBoard: WorkboardSessionsBoardStore;
  subscriptions: WorkboardSubscriptionStore;
  attachments: WorkboardKeyedStore<PersistedWorkboardAttachment>;
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
type WorkboardCardPatch = WorkboardCardInput;
/** Internal builders carry launch state separately from untrusted metadata. */
type WorkboardOwnedCardPatch = WorkboardCardPatch & {
  ownedLaunch?: WorkboardLaunchState;
};
type WorkboardUpdateCardOptions = {
  automationLaunch?: WorkboardLaunchState;
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
  preserveNotificationId?: string;
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
type WorkboardLinkedCreateInput = WorkboardCardInput;
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
  kind?: unknown;
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
//#region extensions/workboard/src/store-runtime.d.ts
declare class WorkboardStoreRuntime {
  private readonly closePersistence?;
  private readonly runWithWriteAuthority?;
  private readonly readWriteToken?;
  protected readonly cardLists: Map<string | undefined, Promise<WorkboardListResult & {
    boards: WorkboardBoardSummary[];
    revision: WorkboardChange & {
      boardId?: string;
      sessionKey?: string;
    };
  }>>;
  private readonly operationScope;
  private readonly operations;
  private mutationQueue;
  private closePromise;
  private sealed;
  protected cardsRevision: WorkboardChange;
  private sessionBoardRevision;
  private writeToken;
  private revision;
  private readonly listeners;
  private readonly initialization;
  constructor(closePersistence?: (() => void | Promise<void>) | undefined, ready?: Promise<void>, runWithWriteAuthority?: WorkboardWriteAuthority | undefined, readWriteToken?: (() => string | undefined) | undefined);
  ready(): Promise<void>;
  get sessionsRevision(): WorkboardChange;
  protected refreshWriteReceipt(): string | undefined;
  runOperation<T>(run: () => T | Promise<T>): Promise<T>;
  close(): Promise<void>;
  protected track<T>(store: WorkboardKeyedStore<T>, { notifyChanges, sessions }?: {
    notifyChanges?: boolean;
    sessions?: boolean;
  }): WorkboardKeyedStore<T>;
  protected trackCardStore(store: WorkboardCardStore): WorkboardCardStore;
  protected trackMutation<T>(run: () => Promise<T>, changed?: (result: T) => boolean, sessions?: boolean): Promise<T>;
  subscribeChanges(listener: (change: WorkboardChange) => void): () => void;
  invalidateSessionBoards(): void;
  announceChangeEpoch(): void;
  protected enqueueMutation<T>(run: () => Promise<T>, assertCurrent?: () => void): Promise<T>;
  protected withMutationAuthority<T>(run: () => Promise<T>, assertCurrent?: () => void): Promise<T>;
  private runMutation;
  private invalidateCards;
  private emit;
}
//#endregion
//#region extensions/workboard/src/store-boards.d.ts
declare class WorkboardBoardStore extends WorkboardStoreRuntime {
  protected readonly store: WorkboardCardStore;
  protected readonly boardStore: WorkboardKeyedStore<PersistedWorkboardBoard>;
  protected readonly subscriptionStore: WorkboardSubscriptionStore;
  protected readonly attachmentStore: WorkboardKeyedStore<PersistedWorkboardAttachment>;
  private readonly sessionsBoardStore;
  constructor(store: WorkboardCardStore, stores: {
    boards: WorkboardKeyedStore<PersistedWorkboardBoard>;
    sessionsBoard: WorkboardSessionsBoardStore;
    subscriptions: WorkboardSubscriptionStore;
    attachments: WorkboardKeyedStore<PersistedWorkboardAttachment>;
    ready?: Promise<void>;
    close?: () => void | Promise<void>;
    runWithWriteAuthority?: WorkboardWriteAuthority;
    readWriteToken?: () => string | undefined;
  });
  list(options?: WorkboardListOptions): Promise<WorkboardCard[]>;
  listCards(board: unknown, sessionKey?: string): Promise<WorkboardListResult & {
    boards: WorkboardBoardSummary[];
    revision: WorkboardChange & {
      boardId?: string;
      sessionKey?: string;
    };
  }>;
  listBoards(): Promise<{
    boards: WorkboardBoardSummary[];
  }>;
  upsertBoard(input: WorkboardBoardInput): Promise<WorkboardBoardMetadata>;
  getSessionsBoard(boardId: string): Promise<WorkboardSessionsBoard>;
  updateSessionsBoard(boardId: string, patch: unknown, assertCurrent?: () => void): Promise<WorkboardSessionsBoard>;
  listSessionPlacements(boardId: string): Promise<WorkboardSessionPlacement[]>;
  repairSessionPlacements(): Promise<{
    placements: number;
    boards: number;
  }>;
  writeSessionPlacement(boardId: string, placement: WorkboardSessionPlacementWrite, options: {
    expectedSpec: WorkboardSessionsBoardSpec;
    assertCurrent?: () => void;
  }): Promise<boolean>;
  assertCardsBoard(boardId: string): Promise<void>;
  archiveBoard(id: unknown, archived?: unknown): Promise<WorkboardBoardMetadata>;
  deleteBoard(id: unknown): Promise<{
    deleted: boolean;
  }>;
}
//#endregion
//#region extensions/workboard/src/sessions-board.d.ts
type CallerAuthority = {
  assertCurrent: () => void;
};
type Operations = {
  read: (boardId: string, view?: WorkboardSessionsBoardView, caller?: CallerAuthority) => Promise<WorkboardSessionsBoardRead>;
  update: (boardId: string, patch: unknown, caller?: CallerAuthority) => Promise<WorkboardSessionsBoard>;
  move: (boardId: string, sessionKey: string, columnId: string, caller?: CallerAuthority) => Promise<WorkboardSessionsBoardRead>;
};
type WorkboardSessionsBoardService = OpenClawPluginService & Operations & {
  stop: () => Promise<void>;
};
//#endregion
//#region extensions/workboard/src/sqlite-store.d.ts
type WorkboardSqliteStores = WorkboardPersistence & {
  ready: Promise<void>;
  readWriteToken(this: void): string | undefined;
  close(this: void): Promise<void>;
  runWithWriteAuthority: WorkboardWriteAuthority;
};
declare function createWorkboardSqliteStores(options: {
  config?: Parameters<typeof resolveDatabaseEngineInput>[0];
  dbPath?: string;
  workerModuleUrl: URL;
}): WorkboardSqliteStores;
//#endregion
//#region extensions/workboard/src/store-core.d.ts
declare class WorkboardCoreStore extends WorkboardBoardStore {
  private lastNotificationSequence;
  compensateWorkspaceMutation(before: WorkboardCard, after: WorkboardCard): Promise<void>;
  protected updateLatestCard(id: string, buildPatch: (current: WorkboardCard) => WorkboardOwnedCardPatch | undefined, options?: WorkboardUpdateCardOptions): Promise<{
    card: WorkboardCard;
    updated: boolean;
  }>;
  protected updateMetadata(id: string, mutate: (existing: WorkboardCard) => WorkboardMetadata, options?: {
    preserveProofId?: string;
    expectedUpdatedAt?: number;
  }): Promise<WorkboardCard>;
  protected deleteDetachedAttachments(existing: WorkboardCard, next: WorkboardCard): Promise<void>;
  protected nextNotificationSequence(now: number): number;
  stats(input?: WorkboardListOptions, now?: number): Promise<WorkboardStatsResult>;
  get(id: string): Promise<WorkboardCard | undefined>;
  protected requireCard(id: string): Promise<WorkboardCard>;
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
  protected updateCard(existing: WorkboardCard, patch: WorkboardCardPatch, options?: WorkboardUpdateCardOptions): Promise<WorkboardCard>;
  private assertActiveStatusAllowed;
  delete(id: string, options?: {
    expectedUpdatedAt?: number;
  }): Promise<WorkboardDeleteResult>;
  addComment(id: string, input: WorkboardCommentInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  addLink(id: string, input: WorkboardLinkInput): Promise<WorkboardCard>;
  linkCards(parentId: string, childId: string, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  protected linkCardsDirect(parentId: string, childId: string, now?: number, options?: {
    allowStatusOnlyActiveChild?: boolean;
    scope?: WorkboardMutationScope;
  }): Promise<WorkboardCard>;
  protected parentsDone(parentIds: readonly string[]): Promise<boolean>;
  private dependencyTargetStatus;
  private dependsOn;
  protected recordOrchestrationCandidate(card: WorkboardCard, now: number): Promise<WorkboardCard>;
  protected promoteDependencyReady(id: string, now?: number): Promise<WorkboardCard>;
}
//#endregion
//#region extensions/workboard/src/store-enrichment.d.ts
declare class WorkboardEnrichmentStore extends WorkboardCoreStore {
  protected appendNotification(metadata: WorkboardMetadata | undefined, now: number, notification: Omit<WorkboardNotification, "id" | "createdAt" | "sequence">): WorkboardNotification[];
  addProof(id: string, input: WorkboardProofInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  addProofWithArtifact(id: string, proofInput: WorkboardProofInput, artifactInput: WorkboardArtifactInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  addArtifact(id: string, input: WorkboardArtifactInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  private addEvidence;
  addAttachment(id: string, input: WorkboardAttachmentInput, scope?: WorkboardMutationScope, assertCurrent?: () => void): Promise<WorkboardCard>;
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
  readWithWorkerContext(id: string): Promise<{
    card: WorkboardCard;
    workerContext: string;
  }>;
  static openSqlite(workerModuleUrl: URL, config?: Parameters<typeof createWorkboardSqliteStores>[0]["config"]): WorkboardStore;
}
//#endregion
//#region extensions/workboard/src/gateway.d.ts
export declare function registerWorkboardGatewayMethods(params: {
  api: OpenClawPluginApi;
  store?: WorkboardStore;
  sessionsBoard?: Pick<WorkboardSessionsBoardService, "read" | "update" | "move">;
}): void;
//#endregion
export type { WorkboardCard, WorkboardClaim, WorkboardDiagnostic, WorkboardListResult, WorkboardPriority, WorkboardStatus };