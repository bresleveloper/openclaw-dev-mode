import "./config-contracts-hzlacViZ.js";
import { t as SchemaContract } from "./schema-contract-c2sTcmgZ.js";
import { Fn as SessionPerson, On as SessionsListParams } from "./index-DSy-_0fC.js";
import { r as DatabaseEngineInput } from "./types-C6Nim0qi.js";
import "./database-engine-worker-runtime-B6LH5KzA.js";
import { DatabaseSync } from "node:sqlite";
declare const OBSERVER_HEALTH: readonly ["on-track", "grinding", "stuck", "waiting-on-user", "wrapping-up", "done", "failed"];
type WorkboardSessionsObserverHealth = (typeof OBSERVER_HEALTH)[number];
type WorkboardSessionsColumn = SchemaContract<ReturnType<typeof normalizeColumn>>;
type WorkboardSessionsBoardSpec = {
  columns: WorkboardSessionsColumn[];
  scope?: SchemaContract<ReturnType<typeof normalizeScope>>;
  agentSessionKey?: string;
};
type WorkboardSessionsBoard = WorkboardBoardMetadata & {
  kind: "sessions";
  sessions: WorkboardSessionsBoardSpec;
};
type WorkboardSessionFacts = {
  key: string;
  sessionId: string;
  lifecycleRevision?: string;
  agentId: string;
  label?: string;
  derivedTitle?: string;
  lastMessagePreview?: string;
  run: "active" | "idle" | "failed";
  observerDigest?: {
    health: WorkboardSessionsObserverHealth;
    headline: string;
    assessment?: string;
    revision: number;
  };
  pullRequests: Array<{
    number: number;
    state: "open" | "draft" | "merged" | "closed";
    url?: string;
    title?: string;
  }>;
  pullRequestsUnavailable?: boolean;
  pullRequestsRateLimited?: true;
  archived: boolean;
  lastActivityAt: number;
};
type WorkboardSessionPlacement = {
  sessionKey: string;
  columnId: string;
  source: "state" | "operator";
  reason: string;
  factsHash: string;
  updatedAt: number;
};
type WorkboardSessionsBoardView = Pick<SessionsListParams, "involvingMe" | "involvingProfileId" | "includePeople">;
type WorkboardSessionsBoardRevision = WorkboardChange & {
  boardId: string;
  scope: string;
};
type WorkboardSessionsBoardRead = {
  revision?: WorkboardSessionsBoardRevision;
  board: WorkboardSessionsBoard;
  columns: WorkboardSessionsColumn[];
  sessions: Array<WorkboardSessionFacts & Pick<WorkboardSessionPlacement, "columnId" | "source" | "reason">>;
  nextCursor?: string;
  total?: number;
  people?: SessionPerson[];
  warning?: string;
};
declare function normalizeColumn(value: unknown): {
  id: string;
  label: string;
  color?: string | undefined;
  description: string;
  match?: {
    health?: ("done" | "failed" | "grinding" | "on-track" | "stuck" | "waiting-on-user" | "wrapping-up")[] | undefined;
    run?: ("active" | "failed" | "idle")[] | undefined;
    pullRequest?: ("closed" | "draft" | "merged" | "none" | "open")[] | undefined;
    archived?: boolean | undefined;
  }[] | {
    health?: ("done" | "failed" | "grinding" | "on-track" | "stuck" | "waiting-on-user" | "wrapping-up")[] | undefined;
    run?: ("active" | "failed" | "idle")[] | undefined;
    pullRequest?: ("closed" | "draft" | "merged" | "none" | "open")[] | undefined;
    archived?: boolean | undefined;
  } | undefined;
  fallback?: boolean | undefined;
};
declare function normalizeScope(value: unknown): {
  agentIds?: string[] | undefined;
  includeArchived?: boolean | undefined;
  includeAutomation?: boolean | undefined;
  includeHome?: boolean | undefined;
  maxAgeHours?: number | undefined;
};
type WorkboardDatabasePortApi<Database, Input> = {
  postgres: string;
  inspectWorkboardPortSource(db: Database): {
    version: number;
    migrationRequired: boolean;
    pendingColumns: Record<string, string[]>;
  };
  admitWorkboardPort(dbPath: string, input?: Input): void;
  WorkboardPortSchemaError: new (message?: string) => Error;
};
declare const WORKBOARD_STATUSES: readonly ["triage", "backlog", "todo", "scheduled", "ready", "running", "review", "blocked", "done"];
declare const WORKBOARD_PRIORITIES: readonly ["low", "normal", "high", "urgent"];
declare const WORKBOARD_EXECUTION_MODES: readonly ["autonomous", "manual"];
declare const WORKBOARD_EXECUTION_STATUSES: readonly ["idle", "running", "review", "blocked", "done"];
declare const WORKBOARD_EVENT_KINDS: readonly ["created", "edited", "moved", "linked", "specified", "decomposed", "claimed", "heartbeat", "execution_updated", "attempt_started", "attempt_updated", "comment_added", "link_added", "proof_added", "artifact_added", "attachment_added", "diagnostic", "notification", "dispatch", "orchestration", "protocol_violation", "archived", "unarchived", "stale"];
declare const WORKBOARD_ATTEMPT_STATUSES: readonly ["running", "succeeded", "failed", "blocked", "stopped"];
declare const WORKBOARD_LINK_TYPES: readonly ["parent", "child", "blocks", "blocked_by", "relates_to"];
declare const WORKBOARD_PROOF_STATUSES: readonly ["passed", "failed", "skipped", "unknown"];
declare const WORKBOARD_OBSERVATION_OUTCOMES: readonly ["succeeded", "failed"];
declare const WORKBOARD_VERIFICATION_OUTCOMES: readonly ["confirmed", "disputed", "inconclusive"];
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
type WorkboardObservationOutcome = (typeof WORKBOARD_OBSERVATION_OUTCOMES)[number];
type WorkboardVerificationOutcome = (typeof WORKBOARD_VERIFICATION_OUTCOMES)[number];
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
/**
 * Optional result evidence, kept apart by who produced it. None of these records gate
 * completion, change proof statuses, or affect dependency scheduling.
 */
type WorkboardResultClaim = {
  kind: "claim";
  id: string;
  recordedAt: number;
  /** Caller identity Workboard stamped when the worker completed the card. */
  claimedBy: string;
  statement: string;
  proofId?: string;
  runId?: string;
};
/** What the execution owner observed. Only Workboard's session lifecycle sync writes these. */
type WorkboardResultObservation = {
  kind: "observation";
  id: string;
  recordedAt: number;
  observedAt: number;
  source: "session-lifecycle";
  outcome: WorkboardObservationOutcome;
  sessionKey: string;
  runId?: string;
};
type WorkboardResultVerification = {
  kind: "verification";
  id: string;
  recordedAt: number;
  /** Caller identity Workboard stamped; never taken from the request. */
  checkerId: string;
  /**
   * True when the checker matches the card's assignee, claim owner, or a claim author.
   * False only means no match was found; it does not establish independence.
   */
  checkedOwnWork: boolean;
  /** What was checked, in the checker's words. */
  scope: string;
  outcome: WorkboardVerificationOutcome;
  /** The claim, proof, artifact, or run this check covered, when it named one. */
  claimId?: string;
  proofId?: string;
  artifactId?: string;
  runId?: string;
  note?: string;
  url?: string;
};
type WorkboardResultEvidence = WorkboardResultClaim | WorkboardResultObservation | WorkboardResultVerification;
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
declare const WORKBOARD_WORKER_STATES: readonly ["idle", "running", "completed", "blocked", "violated"];
type WorkboardWorkerProtocol = {
  state: (typeof WORKBOARD_WORKER_STATES)[number];
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
declare const WORKBOARD_DIAGNOSTIC_ACTION_KINDS: readonly ["claim", "unblock", "promote", "reclaim", "reassign", "add_proof", "open_session"];
type WorkboardDiagnosticAction = {
  kind: (typeof WORKBOARD_DIAGNOSTIC_ACTION_KINDS)[number];
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
  cardsRevision?: number;
  sessionsRevision?: number;
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
  /** Owned by Workboard's evidence writers; raw metadata patches cannot add entries. */
  evidence?: WorkboardResultEvidence[];
  createdCardIds?: string[];
  dispatchCount?: number;
  lastDispatchAt?: number;
  launch?: WorkboardLaunchState;
};
type WorkboardBoardMetadata = {
  id: string;
  kind?: "cards" | "sessions";
  sessions?: WorkboardSessionsBoardSpec;
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
type WorkboardBoardSummary = Omit<WorkboardBoardMetadata, "createdAt" | "updatedAt"> & {
  total: number;
  active: number;
  archived: number;
  byStatus: Partial<Record<WorkboardStatus, number>>;
  updatedAt?: number;
};
type WorkboardOrchestrationSettings = {
  autoDecompose?: boolean;
  autoDecomposePerDispatch?: number;
  /** Running or claimed cards one owner may hold while starting a card on this board. Default 1. */
  maxActivePerOwner?: number;
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
type WorkboardCardCursor = {
  position: number;
  createdAt: number;
  id: string;
};
type WorkboardListResult = {
  cards: WorkboardCard[];
  statuses: readonly WorkboardStatus[];
  nextCursor?: WorkboardCardCursor;
};
declare const workboardDatabasePortApi: WorkboardDatabasePortApi<DatabaseSync, DatabaseEngineInput>;
export { WorkboardSessionsBoardSpec as A, WorkboardStaleState as C, WorkboardSessionPlacement as D, WorkboardWorkspaceAccess as E, WorkboardSessionsBoard as O, WorkboardRunAttempt as S, WorkboardWorkspace as T, WorkboardNotification as _, WorkboardCard as a, WorkboardPriority as b, WorkboardClaim as c, WorkboardEvent as d, WorkboardExecution as f, WorkboardMetadata as g, WorkboardListResult as h, WorkboardBoardSummary as i, WorkboardSessionsBoardView as j, WorkboardSessionsBoardRead as k, WorkboardDeleteResult as l, WorkboardLaunchState as m, WorkboardAttachment as n, WorkboardCardCursor as o, WorkboardExecutionStatus as p, WorkboardBoardMetadata as r, WorkboardChange as s, workboardDatabasePortApi as t, WorkboardDiagnostic as u, WorkboardNotificationSubscription as v, WorkboardStatus as w, WorkboardResultEvidence as x, WorkboardObservationOutcome as y };