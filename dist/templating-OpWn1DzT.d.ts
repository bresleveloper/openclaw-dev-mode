import { Et as TtsAutoMode, Ht as BroadcastStrategy, Pt as GroupToolPolicyConfig, g as ImageContent } from "./types.openclaw-LzSbb55e.js";
import { C as ReplyToMode, T as SessionMaintenanceMode, h as DmScope } from "./types.base-CA0_JvyZ.js";
import { s as AgentMessage } from "./types-BRvdDyOm.js";
import { C as SessionRestartRecoveryState, E as SourceReplyDeliveryMode, T as ChannelRouteRef, h as ReplyPayload, j as AgentPlanStep, w as DeliveryContext } from "./reply-payload-Dv0rYqXd.js";
import { n as SkillLibrarySelection } from "./skill-library-DVzEZ7Hi.js";
import { F as QueueMode, I as HumanMention, Mt as SessionRunStatus, cn as SessionsGoalMutationResult, jt as SessionRow, kt as SessionEntryArchiveReason, ln as SessionParticipant, sn as SessionGoal, un as SessionParticipantIdentity, w as SessionObserverDigest } from "./index-hVvy_KTe.js";
import { c as MediaUnderstandingDecision, j as MediaUnderstandingOutput } from "./types-Bl4TRRJl.js";
import { n as MediaFact, r as MediaFactInput } from "./media-facts-BUTxYH1x.js";
import { n as CommandArgs } from "./commands-args.types-zglMcgeO.js";
import { t as HistoryEntry } from "./history.types-gAzBXfec.js";
import { t as FastMode } from "./string-coerce-DjUc69CC.js";
import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { t as Skill } from "./skill-contract-ChC4fiJP.js";
import { Static, Type } from "typebox";
import { z } from "zod";
import { ColumnType, Selectable } from "kysely";
//#region packages/llm-core/src/utils/provider-refusal.d.ts
/** Provider-authored findings; continuation is offered only after explicit user review. */
type ProviderRefusalReview = {
  explanation: string;
  continuation?: {
    message: string;
  };
  errorType?: string;
};
//#endregion
//#region packages/gateway-protocol/src/client-info.d.ts
/** Canonical client ids accepted in gateway hello/connect payloads. */
declare const GATEWAY_CLIENT_IDS: {
  readonly WEBCHAT_UI: "webchat-ui";
  readonly CONTROL_UI: "openclaw-control-ui";
  readonly BROWSER_COPILOT: "openclaw-browser-copilot";
  readonly TUI: "openclaw-tui";
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly GATEWAY_CLIENT: "gateway-client";
  readonly MACOS_APP: "openclaw-macos";
  readonly LINUX_APP: "openclaw-linux";
  readonly IOS_APP: "openclaw-ios";
  readonly WATCHOS_APP: "openclaw-watchos";
  readonly ANDROID_APP: "openclaw-android";
  readonly NODE_HOST: "node-host";
  readonly WORKER: "openclaw-worker";
  readonly TEST: "test";
  readonly FINGERPRINT: "fingerprint";
  readonly PROBE: "openclaw-probe";
};
/** Stable gateway client ids used on the wire during hello/connect handshakes. */
type GatewayClientId = (typeof GATEWAY_CLIENT_IDS)[keyof typeof GATEWAY_CLIENT_IDS];
/** Compatibility alias for internal callers that still use "name" terminology. */
type GatewayClientName = GatewayClientId;
/** Coarse modes let policy group clients without matching every product id. */
declare const GATEWAY_CLIENT_MODES: {
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly UI: "ui";
  readonly BACKEND: "backend";
  readonly NODE: "node";
  readonly WORKER: "worker";
  readonly PROBE: "probe";
  readonly TEST: "test";
};
/** Coarse client category used for gateway policy and diagnostics. */
type GatewayClientMode = (typeof GATEWAY_CLIENT_MODES)[keyof typeof GATEWAY_CLIENT_MODES];
/** Client metadata sent during gateway connection setup. */
type GatewayClientInfo = {
  /** Stable product/client identifier from `GATEWAY_CLIENT_IDS`. */
  id: GatewayClientId;
  /** Human-readable label for diagnostics; not used for policy decisions. */
  displayName?: string;
  /** Client app or package version reported by the connecting process. */
  version: string;
  /** Exact immutable artifact identity when the client can report one. */
  buildId?: string;
  /** Runtime platform string, such as `darwin`, `ios`, `android`, or `web`. */
  platform: string;
  /** Optional device family used by native clients for display and routing hints. */
  deviceFamily?: string;
  /** Native hardware/model identifier when available. */
  modelIdentifier?: string;
  /** Self-reported IANA time zone, such as `Europe/Vienna`, for presence display. */
  timeZone?: string;
  /** Coarse category from `GATEWAY_CLIENT_MODES` for policy and diagnostics. */
  mode: GatewayClientMode;
  /** Per-installation or per-process id used to distinguish same-product clients. */
  instanceId?: string;
};
//#endregion
//#region src/security/external-content-source.d.ts
/** Hook session sources that carry untrusted external content into agent prompts. */
type HookExternalContentSource = "email" | "gmail" | "webhook";
//#endregion
//#region src/config/sessions/session-entry-provenance.d.ts
/** Kept aligned with SessionStateActorType (src/sessions/session-state-event-kinds.ts); not imported to avoid layering config/sessions onto src/sessions. */
type SessionActor = {
  type: "human" | "agent" | "system";
  id?: string;
  label?: string;
};
/** Only trusted creation owners may stamp a Gateway profile namespace. */
type SessionCreatedActor = SessionActor & ({
  type: "human";
  source: "profile" | "channel" | "unknown";
} | {
  type: "agent" | "system";
});
type SessionOwnerAssignment = {
  actor: SessionActor;
  assignedBy?: SessionActor;
  assignedAt?: number;
};
type SessionCreatedVia = "operator" | "spawn" | "channel" | "cron" | "talk" | "run" | "plugin" | "internal";
type SessionEntryProvenance = {
  /** Plugin id that owns this session through a trusted runtime creation seam. */
  pluginOwnerId?: string;
  /** External hook source that has contributed content to this transcript. */
  hookExternalContentSource?: HookExternalContentSource;
};
//#endregion
//#region src/channels/inbound-event/kind.d.ts
/**
 * High-level inbound event class used to separate actionable user requests from room activity.
 */
type InboundEventKind = "user_request" | "room_event";
//#endregion
//#region src/gateway/ui-command-target.types.d.ts
/** Presentation destination captured from the requesting Control UI, never model arguments. */
type GatewayUiCommandTarget = Readonly<{
  connId: string;
  profileId?: string;
}>;
//#endregion
//#region src/media/prompt-image-order.d.ts
/** Tracks whether prompt images stayed inline or were offloaded while preserving model order. */
type PromptImageOrderEntry = "inline" | "offloaded";
//#endregion
//#region src/plugins/hook-channel-context.types.d.ts
interface PluginHookChannelSenderContext {
  /** Channel-scoped sender ID, matching `ctx.senderId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelChatContext {
  /** Transport-native conversation ID, matching `ctx.chatId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelContext {
  /** Sender metadata supplied by the originating channel. */
  sender?: PluginHookChannelSenderContext;
  /** Chat/conversation metadata supplied by the originating channel. */
  chat?: PluginHookChannelChatContext;
}
//#endregion
//#region src/sessions/input-provenance.d.ts
declare const INPUT_PROVENANCE_KIND_VALUES: readonly ["external_user", "inter_session", "internal_system"];
type InputProvenanceKind = (typeof INPUT_PROVENANCE_KIND_VALUES)[number];
type InputProvenance = {
  kind: InputProvenanceKind;
  originSessionId?: string;
  sourceSessionKey?: string;
  sourceChannel?: string;
  sourceTool?: string;
  sourceRole?: "subagent";
  sourcePromptPrefix?: string;
  jobId?: string;
  runId?: string;
};
//#endregion
//#region src/auto-reply/command-turn-context.d.ts
type CommandTurnKind = "native" | "text-slash" | "normal";
/** Transport-level source labels carried through auto-reply dispatch. */
type CommandTurnSource = "native" | "text" | "message";
type BaseCommandTurnContext = {
  commandName?: string;
  body?: string;
};
type NativeCommandTurnContext = BaseCommandTurnContext & {
  kind: "native";
  source: "native";
  authorized: boolean;
};
type TextSlashCommandTurnContext = BaseCommandTurnContext & {
  kind: "text-slash";
  source: "text";
  authorized: boolean;
};
type NormalCommandTurnContext = BaseCommandTurnContext & {
  kind: "normal";
  source: "message";
  authorized: false;
};
type CommandTurnContext = NativeCommandTurnContext | TextSlashCommandTurnContext | NormalCommandTurnContext;
/** Builds a normalized command-turn context and forces normal messages to unauthorized. */
declare function createCommandTurnContext(source: CommandTurnSource, input: {
  authorized: boolean;
  commandName?: string;
  body?: string;
}): CommandTurnContext;
/** Returns true for channel-native command turns. */
declare function isNativeCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
/** Returns true for text slash-command turns regardless of authorization. */
declare function isTextSlashCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
declare function isAuthorizedTextSlashCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
/** Returns true when a turn was explicitly invoked by a native or authorized text command. */
declare function isExplicitCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
//#endregion
//#region src/auto-reply/group-thread.types.d.ts
type ResolvedGroupThreadConfig = {
  agents: string[];
  unknownAgentIds: string[];
  qualified: boolean;
  configuredAgentCount: number;
  mentionGating: boolean;
  maxRounds: number;
  maxTurns: number;
  strategy: BroadcastStrategy;
};
type GroupThreadMentionFacts = {
  channel: string;
  peerId: string;
  group: ResolvedGroupThreadConfig;
  mentionedAgentIds: string[];
};
//#endregion
//#region src/config/sessions/provider-review.types.d.ts
/** Runtime-authored precaution for one failed turn in this session generation. */
type SessionProviderReview = {
  id: string;
  sessionId: string;
  runId: string;
  provider: string;
  model: string;
  runtimeId: string;
  api?: string;
  review?: ProviderRefusalReview;
  nativeThreadId?: string;
  nativeTurnId?: string;
};
//#endregion
//#region src/config/sessions/activity-summary.d.ts
declare const ActivitySummarySchema: z.ZodObject<{
  version: z.ZodLiteral<1>;
  formatRevision: z.ZodOptional<z.ZodNumber>;
  text: z.ZodString;
  updatedAt: z.ZodNumber;
  sessionId: z.ZodString;
  lifecycleRevision: z.ZodOptional<z.ZodString>;
  generation: z.ZodNullable<z.ZodString>;
  maxSeq: z.ZodNullable<z.ZodNumber>;
  leafEntryId: z.ZodNullable<z.ZodString>;
  coveredMessages: z.ZodNumber;
  totalMessages: z.ZodNumber;
  omittedContent: z.ZodBoolean;
}, z.core.$strip>;
type SessionActivitySummary = z.infer<typeof ActivitySummarySchema>;
//#endregion
//#region src/config/sessions/goals-operations.types.d.ts
type SessionGoalOperationResult = Omit<SessionsGoalMutationResult, "replayed">;
type SessionTranscriptTurnMutationResult = {
  result: SessionGoalOperationResult;
  replayed: boolean;
};
//#endregion
//#region src/config/sessions/session-transcript-turn-lifecycle.types.d.ts
/** Authoritative lifecycle snapshot required for an atomic transcript admission. */
type SessionTranscriptTurnExpectedState = {
  /** Rejects a run-owned turn after another admitted run takes writer ownership. */
  expectedWriterRunId?: string;
  abortedLastRun: boolean | undefined;
  /** Fences recovery-only transcript writes against concurrent ownership changes. */
  mainRestartRecoveryCycleId: string | undefined;
  mainRestartRecoveryRevision: number | undefined;
  restartRecoveryBeforeAgentReplyState: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryRequestFingerprint: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryTerminalRunIds: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  status: PersistedSessionRunStatus | undefined;
};
/** Lifecycle fields committed with an accepted transcript turn. */
type SessionTranscriptTurnLifecyclePatch = {
  abortedLastRun?: boolean;
  endedAt?: number;
  lifecycleRunId?: InternalSessionEntry["lifecycleRunId"];
  lastRunId?: InternalSessionEntry["lastRunId"];
  lastRunError?: InternalSessionEntry["lastRunError"];
  pendingFinalDelivery?: InternalSessionEntry["pendingFinalDelivery"];
  mainRestartRecovery?: InternalSessionEntry["mainRestartRecovery"];
  restartRecoveryBeforeAgentReplyState?: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState?: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId?: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryContext?: SessionRestartRecoveryState["restartRecoveryDeliveryContext"];
  restartRecoveryDeliveryRequestFingerprint?: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId?: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId?: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId?: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId?: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired?: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress?: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode?: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryForceSafeTools?: InternalSessionEntry["restartRecoveryForceSafeTools"];
  restartRecoveryRuns?: InternalSessionEntry["restartRecoveryRuns"];
  /** Durable tombstones merged with the fresh row inside the SQLite write transaction. */
  restartRecoveryTerminalRunIds?: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  runtimeMs?: number;
  startedAt?: number;
  status?: PersistedSessionRunStatus;
  updatedAt?: number;
};
//#endregion
//#region src/config/sessions/store-maintenance.d.ts
type ResolvedSessionMaintenanceConfig = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  archiveDashboardAfterMs: number | null;
  maxEntries: number;
  modelRunPruneAfterMs: number;
  preserveRecentMs?: number | null;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};
type ResolvedSessionMaintenanceConfigInput = Omit<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs"> & Partial<Pick<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs">>;
//#endregion
//#region src/config/sessions/transcript-entry-anchor.d.ts
/** Immutable transcript identity issued by the SQLite append transaction. */
type TranscriptEntryAnchor = Readonly<{
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
  generation: string;
  entryId: string;
  rawSeq: number;
  effectiveParentId: string | null;
  activeMessagePosition: number;
  idempotencyKey?: string;
}>;
/** Current user row bound to one recorder-owned logical turn. */
type TranscriptTurnAdmission = TranscriptEntryAnchor & Readonly<{
  logicalTurnId: string;
  role: "user";
}>;
/** Exact accepted transcript range, inclusive of admission and terminal. */
type TranscriptTurnBoundary = Readonly<{
  admission: TranscriptTurnAdmission;
  terminal: TranscriptEntryAnchor;
}>;
//#endregion
//#region src/config/sessions/session-accessor.types.d.ts
/**
 * Session access API for callers that need entries or transcripts without
 * depending on the persisted store layout. Callers provide stable session
 * identity, and this module resolves the current entry/transcript target while
 * preserving canonical-key, transcript-linking, and update-notification rules.
 *
 * This accessor is the permanent storage-neutral domain boundary for
 * session/transcript runtime access. Legacy JSON import remains doctor-only.
 */
type SessionAccessScope = {
  /** Agent owner used when the session key does not already encode one. */
  agentId?: string;
  /**
   * Set false only for internal read-only hot paths that will not retain or
   * mutate the returned entry.
   */
  clone?: boolean;
  /** Configured default owner for fixed-store SQLite target derivation. */
  defaultAgentId?: string;
  /** Environment override used when resolving agent-scoped store paths in tests/tools. */
  env?: NodeJS.ProcessEnv;
  /** Set false for metadata-only reads that do not need hydrated prompt refs. */
  hydrateSkillPromptRefs?: boolean;
  /** Use latest when the caller must bypass any in-process metadata snapshot. */
  readConsistency?: "latest";
  /** Canonical or alias session key for the entry being read or written. */
  sessionKey: string;
  /** Explicit store path for callers that already resolved the owning store. */
  storePath?: string;
};
type SessionTranscriptAccessScope = Omit<SessionAccessScope, "sessionKey"> & {
  /** Deprecated transcript locator from older file-backed call sites. */
  sessionFile?: string;
  /** Runtime session id used to resolve the transcript identity. */
  sessionId: string;
  /** Required when resolving through session metadata; optional for legacy locators. */
  sessionKey?: string;
  /** Channel thread suffix used when deriving topic transcript paths. */
  threadId?: string | number;
};
type SessionTranscriptRuntimeScope = SessionAccessScope & {
  /** Deprecated transcript locator from older file-backed call sites. */
  sessionFile?: string;
  sessionId: string;
  threadId?: string | number;
};
type SessionTranscriptReadScope = Omit<SessionTranscriptRuntimeScope, "sessionKey"> & {
  /** Canonical key when the caller has a session-store identity for this read. */
  sessionKey?: string;
  /** Entry already loaded by hot callers; avoids rereading the session store. */
  sessionEntry?: Partial<Pick<InternalSessionEntry, "sessionId">>;
  /** Byte budget enforced via SQL before parsing transcript event rows. */
  maxEventBytes?: number;
};
/** Raw transcript record for non-message events; message records use appendTranscriptMessage. */
type TranscriptEvent = unknown;
interface SessionTranscriptRuntimeTarget {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
}
//#endregion
//#region src/config/sessions/cli-history-boundary.d.ts
/** Private proof of the account that owns every covered transcript event. */
type CliHistoryBoundary = {
  version: 1;
  sessionId: string;
  state: "unknown";
} | {
  version: 1;
  sessionId: string;
  state: "known";
  authFingerprint: string;
  generation: string | null;
  maxSeq: number | null;
  writerRunId: string;
};
//#endregion
//#region src/config/sessions/session-diff-baseline-capture.d.ts
type SessionDiffBaselineCapture = {
  version: 1;
  captureId: string;
  status: "pending" | "unavailable";
};
//#endregion
//#region packages/acp-core/src/types.d.ts
type SessionAcpIdentitySource = "ensure" | "status" | "event";
type SessionAcpIdentityState = "pending" | "resolved";
type SessionAcpIdentity = {
  /** Pending identities may expose provisional ids; resolved identities are safe for resume output. */
  state: SessionAcpIdentityState;
  acpxRecordId?: string;
  acpxSessionId?: string;
  agentSessionId?: string;
  /** Runtime lifecycle point that last supplied the identity fields. */
  source: SessionAcpIdentitySource;
  lastUpdatedAt: number;
};
type AcpSessionRuntimeOptions = {
  /**
   * ACP runtime mode set via session/set_mode (for example: "plan", "normal", "auto").
   */
  runtimeMode?: string;
  /** ACP runtime config option: model id. */
  model?: string;
  /** ACP runtime config option: thinking/reasoning effort. */
  thinking?: string;
  /** Working directory override for ACP session turns. */
  cwd?: string;
  /** ACP runtime config option: permission profile id. */
  permissionProfile?: string;
  /** ACP runtime config option: per-turn timeout in seconds. */
  timeoutSeconds?: number;
  /** Backend-specific option bag mapped through session/set_config_option. */
  backendExtras?: Record<string, string>;
};
type SessionAcpMeta = {
  backend: string;
  agent: string;
  runtimeSessionName: string;
  /** Canonical backend/agent ids used for resume hints and thread/status details. */
  identity?: SessionAcpIdentity;
  mode: "persistent" | "oneshot";
  runtimeOptions?: AcpSessionRuntimeOptions;
  cwd?: string;
  state: "idle" | "running" | "error";
  lastActivityAt: number;
  lastError?: string;
};
//#endregion
//#region packages/gateway-protocol/src/session-agent-status.d.ts
declare const SESSION_AGENT_ATTENTION_ICON_IDS: readonly ["hand", "key", "alert", "flag", "lock", "hourglass"];
type SessionAgentAttentionIconId = (typeof SESSION_AGENT_ATTENTION_ICON_IDS)[number];
type SessionAgentStatus = {
  note: string;
  expiresAt: number;
  attention?: SessionAgentAttentionIconId;
};
//#endregion
//#region src/cron/scheduled-tool-policy.d.ts
/** Closed, server-authored origin of an account-scoped scheduled tool cap. */
type CronScheduledToolCallerOrigin = {
  kind: "external";
  channel: string;
} | {
  kind: "local";
} | {
  kind: "unknown";
};
/**
 * Restrict-only execution target for a job's exec grant, captured from a
 * creator surface whose only exec capability was host-pinned. New pinned jobs
 * persist this as part of a grant-coupled envelope; unmarked legacy jobs keep
 * baseline exec behavior.
 */
type CronToolsAllowExecTarget = {
  version: 1;
  host: "gateway";
  /** Mandatory approval floor inherited from the captured creator surface. */
  ask?: "always";
};
/** Persisted proof that this job was created with an exact exec restriction. */
type CronToolsAllowExecTargetRequirement = {
  version: 1;
  target: CronToolsAllowExecTarget;
  grantIndex: number;
  recoveryRequired?: never;
} | {
  version: 1;
  target?: never;
  recoveryRequired: true;
};
/** Server-authored provenance for a persisted scheduled tool-cap authority envelope. */
type CronScheduledToolPolicy = {
  version: 1;
  mode: "trusted";
  ownerSessionKey?: never;
  ownerAccountId?: never;
} | {
  version: 1;
  mode: "account";
  ownerSessionKey: string;
  ownerAccountId: string;
};
//#endregion
//#region src/shared/session-types.d.ts
/** Per-session Control UI face preference carried by session list rows. */
type SessionBoardFace = "chat" | "dashboard";
//#endregion
//#region src/config/sessions/main-session-recovery.types.d.ts
type MainRestartRecoveryState = {
  /** Stable identity for one interrupted episode; prevents clear-and-rewedge ABA matches. */
  cycleId: string;
  /** Monotonic identity for observations within the current recovery cycle. */
  revision: number;
  /** Attempts charged when their reservation is persisted, before dispatch. */
  chargedAttempts: number;
  /** Last attempt observed starting a backend turn; later startup failures get a fresh budget. */
  startedAttempt?: number;
  /** Private safe token for one recovered outer turn; raw identity refs never enter session state. */
  executionIdentity?: {
    tokenVersion: 1;
    contextId: string;
    executionId: string;
    runId: string;
    createdAt: number;
  };
  reservation?: {
    runId: string;
    attempt: number;
    lifecycleGeneration: string;
  };
  foregroundClaims?: {
    lifecycleGeneration: string;
    tokens: string[];
    /** Run identity for claims that have crossed the actual agent-run boundary. */
    runIdsByClaimId?: Record<string, string>;
  };
  tombstone?: {
    reason: string;
    /** Durable successor returned when an explicit rollover request is retried. */
    recoveredSessionId?: string;
    recoveredSessionKey?: string;
  };
};
//#endregion
//#region src/config/sessions/pending-final-delivery-types.d.ts
type PendingFinalDeliveryState = {
  createdAt: number;
  context?: DeliveryContext;
  intentId?: string;
  deliveries?: Array<{
    id: string;
    state: "prepared" | "queued" | "delivered" | "suppressed" | "unknown";
  }>;
} & ({
  kind: "replayable";
  text: string;
} | {
  kind: "transport-only";
});
/**
 * Owed user-visible notice that a final's delivery outcome stayed unknown.
 * Settled unknown custody records the debt here; the next same-route turn
 * sends it once, so an ambiguous loss never ends silently.
 */
type PendingDeliveryNoticeState = {
  createdAt: number;
  context: DeliveryContext;
  intentId: string;
  state: "owed" | "unresolved" | "acknowledged";
};
//#endregion
//#region src/config/sessions/session-model-fallback.d.ts
type AgentPatchedSessionModelFallback = {
  prevModel: string;
  prevProvider: string;
  prevModelOverride?: string;
  prevProviderOverride?: string;
  prevModelOverrideSource?: "auto" | "user" | "default";
  prevModelOverrideRouteResolution?: "resolved";
  prevModelOverrideFallbackOriginProvider?: string;
  prevModelOverrideFallbackOriginModel?: string;
  prevAuthProfileOverride?: string;
  prevAuthProfileOverrideSource?: "auto" | "user" | "user-link";
  prevAuthProfileOverrideCompactionCount?: number;
  prevContextWindow?: string;
  prevThinkingLevel?: string;
  lastValidatedPatchTs?: number;
  ts: number;
  source: "agent-patch";
};
//#endregion
//#region src/config/sessions/session-prompt-types.d.ts
type SessionSkillPromptRef = {
  version: 1;
  algorithm: "sha256";
  hash: string;
  bytes: number;
};
type SessionSkillSnapshot = {
  librarySelections?: SkillLibrarySelection[];
  prompt: string;
  /** Persisted stores may replace large duplicate prompts with a content-addressed blob ref. */
  promptRef?: SessionSkillPromptRef;
  skills: Array<{
    name: string;
    primaryEnv?: string;
    requiredEnv?: string[];
  }>;
  /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */
  skillFilter?: string[];
  /** Effective node-exec eligibility used to select connected node-hosted skills. */
  nodeSkillsEligibility?: {
    canExec: boolean;
    node?: string;
  };
  /**
   * Runtime-only, never persisted. Carries the full parsed Skill[] (including
   * each SKILL.md body) so the embedded runner can skip a workspace skill
   * scan within a turn. Persistence projections strip it before committing
   * session state. On a cold session resume this is undefined and
   * src/skills/runtime/embedded-run-entries.ts rebuilds it from disk.
   */
  resolvedSkills?: Skill[];
  version?: number;
};
//#endregion
//#region src/config/sessions/session-system-prompt-report.d.ts
/** Persisted size and provenance summary for one assembled system prompt. */
type SessionSystemPromptReport = {
  source: "run" | "estimate";
  generatedAt: number;
  sessionId?: string;
  sessionKey?: string;
  provider?: string;
  model?: string;
  workspaceDir?: string;
  bootstrapMaxChars?: number;
  bootstrapTotalMaxChars?: number;
  bootstrapTruncation?: {
    warningMode?: "off" | "once" | "always";
    warningShown?: boolean;
    promptWarningSignature?: string;
    warningSignaturesSeen?: string[];
    truncatedFiles?: number;
    nearLimitFiles?: number;
    totalNearLimit?: boolean;
  };
  sandbox?: {
    mode?: string;
    sandboxed?: boolean;
  };
  systemPrompt: {
    chars: number;
    projectContextChars: number;
    nonProjectContextChars: number;
    hash?: string;
  };
  currentTurn?: {
    kind?: "user_request" | "room_event";
    promptChars: number;
    runtimeContextChars: number;
    modelOnlyPromptChars?: number;
  };
  injectedWorkspaceFiles: Array<{
    name: string;
    path: string;
    missing: boolean;
    rawChars: number;
  } & ({
    injectionStatus?: "verified";
    injectedChars: number;
    truncated: boolean;
  } | {
    injectionStatus: "native_unverified";
    injectedChars: null;
    truncated: null;
  })>;
  skills: {
    promptChars: number;
    hash?: string;
    entries: Array<{
      name: string;
      blockChars: number;
    }>;
  };
  tools: {
    listChars: number;
    schemaChars: number;
    entries: Array<{
      name: string;
      summaryChars: number;
      summaryHash?: string;
      schemaChars: number;
      schemaHash?: string;
      propertiesCount?: number | null;
    }>;
  };
};
//#endregion
//#region src/config/sessions/session-tool-overrides.d.ts
type SessionToolOverrides = {
  mcpServers?: Record<string, boolean>;
  mcpToolsDeny?: Record<string, string[]>;
  skills?: Record<string, boolean>;
  webSearch?: boolean;
};
//#endregion
//#region src/config/sessions/session-worktree-intent.d.ts
/** Private source selection accepted under the session creation lifecycle lock. */
type PendingSessionWorktree = {
  workspace?: string;
  /** Source custody accepted by the locked creation owner, not public request input. */
  source?: {
    kind: "project" | "worktree";
    id: string;
  };
  name?: string;
  baseRef?: string;
  /** Verified commit used for checkout while baseRef remains user-facing metadata. */
  baseCommit?: string;
  titleSource: string;
};
//#endregion
//#region src/config/sessions/types.d.ts
type SessionScope = "per-sender" | "global";
type SessionChatType = ChatType;
type PersistedSessionRunStatus = SessionRunStatus | "interrupted";
declare const SESSION_TOTAL_TOKENS_VERSION: 1;
type SessionOrigin = {
  label?: string;
  provider?: string;
  surface?: string;
  chatType?: SessionChatType;
  from?: string;
  to?: string;
  nativeChannelId?: string;
  nativeDirectUserId?: string;
  avatar?: string;
  accountId?: string;
  threadId?: string | number;
};
/** Canonical persisted delivery ownership for one session. */
type SessionDeliveryState = {
  kind: "none";
} | {
  kind: "internal";
} | {
  kind: "external";
  route: ChannelRouteRef;
  context: DeliveryContext;
  origin: SessionOrigin;
};
/**
 * Durable transcript-repair record: an assistant final that was delivered to
 * the user but could not be appended to the canonical transcript. Kept
 * separate from `pendingFinalDelivery` so transport-replay cleanup never drops
 * the only copy of the missing assistant turn.
 */
type PendingTranscriptRepairState = {
  /** Stable identity for retry-safe transcript insertion. */
  id: string;
  text: string;
  provider?: string;
  model?: string;
  createdAt: number;
};
type FallbackNoticeState = {
  kind: "active";
  selectedModel: string;
  activeModel: string;
  reason?: string;
};
type MemoryFlushState = {
  kind: "succeeded";
  compactionCount: number;
} | {
  kind: "failed";
  compactionCount?: number;
  failureCount: number;
};
type CliSessionReseedReceipt = {
  version: 1;
  promptHash: string;
  localSessionId: string;
  userTurnDisposition: "persisted" | "omitted";
};
type SessionDiffBaseline = {
  version: 1;
  sessionId: string;
  root: string;
  files: Array<{
    path: string;
    fingerprint: string;
  }>;
  /** Some checkout entries could not be fingerprinted without exceeding diff safety caps. */
  truncated?: true;
};
type CliSessionBinding = {
  sessionId: string;
  /** Last successful assistant boundary accepted by the backend's resume contract. */
  resumeCheckpointId?: string;
  /** Resume with the backend's fork argument once, then clear before process start. */
  forkNextResume?: true;
  /** Trust an explicitly attached CLI session even when auth, prompt, or MCP fingerprints drift. */
  forceReuse?: boolean;
  authProfileId?: string;
  authEpoch?: string;
  authEpochVersion?: number;
  extraSystemPromptHash?: string;
  messageToolPolicyHash?: string;
  promptToolNamesHash?: string;
  cwdHash?: string;
  mcpConfigHash?: string;
  mcpResumeHash?: string;
  /** Identifies one synthetic history prompt and the trusted local handling of its user turn. */
  reseedReceipt?: CliSessionReseedReceipt;
};
type AcpSessionBinding = {
  acpBackendId: string;
  acpAgentId: string;
  agentSessionId: string;
};
type SessionContextBudgetStatusRoute = "fits" | "compact_only" | "truncate_tool_results_only" | "compact_then_truncate";
type SessionContextBudgetStatus = {
  schemaVersion: 1;
  source: "pre-prompt-estimate";
  updatedAt: number;
  provider: string;
  model: string;
  route: SessionContextBudgetStatusRoute;
  shouldCompact: boolean;
  estimatedPromptTokens: number;
  contextTokenBudget: number;
  promptBudgetBeforeReserve: number;
  reserveTokens: number;
  effectiveReserveTokens: number;
  remainingPromptBudgetTokens: number;
  overflowTokens: number;
  toolResultReducibleChars: number;
  messageCount: number;
  unwindowedMessageCount: number;
  sessionId?: string;
};
type AmbientTranscriptWatermark = {
  sessionId: string;
  messageId: string;
  timestampMs?: number;
  updatedAt: number;
};
type SessionPluginDebugEntry = {
  pluginId: string;
  lines: string[];
};
type SessionPluginJsonValue = string | number | boolean | null | SessionPluginJsonValue[] | {
  [key: string]: SessionPluginJsonValue;
};
type SessionPluginNextTurnInjection = {
  id: string;
  pluginId: string;
  pluginName?: string;
  text: string;
  idempotencyKey?: string;
  placement: "prepend_context" | "append_context";
  ttlMs?: number;
  createdAt: number;
  metadata?: SessionPluginJsonValue;
};
type SubagentRecoveryState = {
  /** Consecutive accepted automatic orphan-recovery resumes in the rapid re-wedge window. */
  automaticAttempts?: number;
  /** Timestamp (ms) of the latest accepted automatic orphan-recovery resume. */
  lastAttemptAt?: number;
  /** Registry run id that triggered the latest automatic orphan-recovery resume. */
  lastRunId?: string;
  /** Visible execution retained while the recovered run uses an internal transcript. */
  sessionLifecycleRunId?: string;
  /** Timestamp (ms) when automatic recovery was tombstoned for this session. */
  wedgedAt?: number;
  /** Human-readable reason automatic recovery was tombstoned. */
  wedgedReason?: string;
};
type LaneExecutionState = "active" | "draining" | "suspended" | "resuming" | "circuit_open" | "failed_handoff";
interface QuotaSuspension {
  schemaVersion: 1;
  suspendedAt: number;
  reason: "quota_exhausted" | "manual" | "circuit_open";
  failedProvider: string;
  failedModel: string;
  /** Recovery briefing text injected into the next attempt when state === "resuming". */
  summary?: string;
  /** Opaque pointer to an external snapshot blob (path/key); not the briefing text itself. */
  snapshotRef?: string;
  /**
   * @deprecated Lane suspension was removed; nothing writes this anymore. Kept only to
   * hold the shipped SDK surface stable; drop at the next surface window.
   */
  laneId?: string;
  expectedResumeBy?: number;
  state: LaneExecutionState;
}
type RestartRecoveryRun = {
  runId: string;
  lifecycleGeneration: string;
};
type SessionEntryCore = SessionRestartRecoveryState & SessionEntryProvenance & Pick<SessionRow, "permissionMode" | "sandboxMode" | "nativeRuntimeConsent" | "sessionRoot"> & {
  /** Collaboration mode. Missing legacy values are equivalent to "shared". */
  visibility?: NonNullable<SessionRow["visibility"]>;
  /**
   * Last delivered heartbeat payload (used to suppress duplicate heartbeat notifications).
   * Stored on the main session entry.
   */
  lastHeartbeatText?: string;
  /** Timestamp (ms) when lastHeartbeatText was delivered. */
  lastHeartbeatSentAt?: number;
  /**
   * Base session key for heartbeat-created isolated sessions.
   * When present, `<base>:heartbeat` is a synthetic isolated session rather than
   * a real user/session-scoped key that merely happens to end with `:heartbeat`.
   */
  heartbeatIsolatedBaseSessionKey?: string;
  /** Legacy heartbeat task timestamps consumed and cleared only by doctor migration. */
  heartbeatTaskState?: Record<string, number>;
  /** Plugin-owned session state, grouped by plugin id then extension namespace. */
  pluginExtensions?: Record<string, Record<string, SessionPluginJsonValue>>;
  /** Trusted session initialization is incomplete; all work admission stays blocked. */
  initializationPending?: true;
  /** Top-level SessionEntry mirror slots owned by plugin session extensions. */
  pluginExtensionSlotKeys?: Record<string, Record<string, string>>;
  /** Durable one-shot prompt additions drained before the next agent turn. */
  pluginNextTurnInjections?: Record<string, SessionPluginNextTurnInjection[]>;
  sessionId: string;
  updatedAt: number;
  /** Process-lifetime session whose entry and transcript stay in the in-memory agent database. */
  incognito?: true;
  /** Opaque owner revision used to reject stale lifecycle mutations. */
  lifecycleRevision?: string;
  /** Current provider precaution; only its acknowledged continuation may start work. */
  providerReview?: SessionProviderReview;
  /** Timestamp (ms) when the session was archived from active session lists. */
  archivedAt?: number;
  /** Actor that archived the session; cleared when the session is restored. */
  archivedBy?: SessionActor;
  /** Stable lifecycle cause; absent values are legacy archives and remain manually protected. */
  archiveReason?: SessionEntryArchiveReason;
  /** Timestamp (ms) when the session was pinned for quick access. */
  pinnedAt?: number;
  /** Timestamp (ms) when an operator client last marked the session read. */
  lastReadAt?: number;
  /** Agent-declared sidebar presence; projection drops it after expiresAt. */
  agentStatus?: SessionAgentStatus;
  /** Latest utility-model status judgment for idle session status surfaces. */
  observerDigest?: SessionObserverDigest;
  /** Versioned, reconstructible Activity recap; never authoritative task status. */
  activitySummary?: SessionActivitySummary;
  /** Timestamp (ms) when an operator explicitly marked the session unread; cleared on read. */
  markedUnreadAt?: number;
  /** Timestamp (ms) of the latest completed agent run; metadata patches do not update it. */
  lastActivityAt?: number;
  /** Parent session key that spawned this session (used for sandbox session-tool scoping). */
  spawnedBy?: string;
  /** Immutable session key authorized to receive this child's completion handoff. */
  completionOwnerSessionKey?: string;
  /** Workspace inherited by spawned sessions and reused on later turns for the same child session. */
  spawnedWorkspaceDir?: string;
  /** Task working directory inherited by spawned sessions and reused on later turns. */
  spawnedCwd?: string;
  /** Content-free fingerprints for checkout changes that predate this session generation. */
  sessionDiffBaseline?: SessionDiffBaseline;
  /**
   * Managed worktree bound to this session; set with spawnedCwd at worktree
   * creation and cleared together when a plain New Chat detaches the checkout.
   */
  worktree?: {
    id: string;
    branch: string;
    repoRoot: string;
    /** Durable skill workspace prepared when this session runs from a managed worktree. */
    canonicalWorkspaceDir?: string;
  };
  /** Project registry id selected when this logical session node was created. */
  projectId?: string;
  /** Durable cloud repository owner; never identifies a Gateway filesystem path. */
  repositoryWorkspaceId?: string;
  /** Explicit parent session linkage for dashboard-created child sessions. */
  parentSessionKey?: string;
  /** Exact parent incarnation captured when this child was created. */
  parentSessionId?: string;
  /** How this session node came to exist; written once and retained across sessionId rotations. */
  createdVia?: SessionCreatedVia;
  /** Actor that caused node creation, with an optional profile, session, or sender id; written once. */
  createdActor?: SessionCreatedActor;
  /** Creation-only sandbox requirement; existing unstamped sessions always remain unstamped. */
  sandbox?: "required";
  /** Mutable responsibility, projected from SQLite; absent means createdActor owns the session. */
  owner?: SessionOwnerAssignment;
  /** Retained identities, projected from the participant table before display truncation. */
  participants?: SessionParticipant[];
  /** Raw retained identity count, including the owner, for admission-bound coverage. */
  participantCount?: number;
  /** Node creation time (ms); unlike sessionStartedAt, survives sessionId rotations. */
  createdAt?: number;
  /** Exact source generation and optional cut entry for an actual transcript-copy fork. */
  forkSource?: {
    sessionKey: string;
    sessionId: string;
    entryId?: string;
  };
  /** Session id of the prior transcript generation under this same session key. */
  previousSessionId?: string;
  /** Thread parent-seeding settled marker; also set when seeding is deliberately skipped. */
  forkedFromParent?: boolean;
  /** Subagent spawn depth (0 = main, 1 = sub-agent, 2 = sub-sub-agent). */
  spawnDepth?: number;
  /** Explicit role assigned at spawn time for subagent tool policy/control decisions. */
  subagentRole?: "orchestrator" | "leaf";
  /** Explicit control scope assigned at spawn time for subagent control decisions. */
  subagentControlScope?: "children" | "none";
  /** Version of the requester tool-policy snapshot captured when this child was spawned. */
  inheritedToolPolicyVersion?: 1;
  /** Session-scoped tool deny entries inherited from the caller that created this session. */
  inheritedToolDeny?: string[];
  /** Session-scoped tool allow entries inherited from the caller that created this session. */
  inheritedToolAllow?: string[];
  systemSent?: boolean;
  abortedLastRun?: boolean;
  /** Interrupted run generations whose late lifecycle events must be ignored. */
  restartRecoveryRuns?: RestartRecoveryRun[];
  /** Keeps automatic restart recovery limited to replay-safe tools until the run terminates. */
  restartRecoveryForceSafeTools?: true;
  /** Durable guard state for automatic subagent orphan recovery. */
  subagentRecovery?: SubagentRecoveryState;
  /** Quota cascade protection and state-aware failover status. */
  quotaSuspension?: QuotaSuspension;
  /** Core-owned durable goal state for this thread/session. */
  goal?: SessionGoal;
  /** Timestamp (ms) when the current sessionId first became active. */
  sessionStartedAt?: number;
  /** Stable usage lineage key for transcript-backed rollups across sessionId rotations. */
  usageFamilyKey?: string;
  /** Session ids known to belong to this usage lineage, including archived predecessors. */
  usageFamilySessionIds?: string[];
  /** Timestamp (ms) of the last user/channel interaction that should extend idle lifetime. */
  lastInteractionAt?: number;
  /** Stable first-run start time for subagent sessions, persisted after completion. */
  startedAt?: number;
  /** Latest completed run end time for subagent sessions, persisted after completion. */
  endedAt?: number;
  /** Accumulated runtime across subagent follow-up runs, persisted after completion. */
  runtimeMs?: number;
  /** Final persisted subagent run status, used after in-memory run archival. */
  status?: PersistedSessionRunStatus;
  /** Compact user-facing reason for the latest failed or timed-out run. */
  lastRunError?: string;
  /**
   * Session-level stop cutoff captured when /stop is received.
   * Messages at/before this boundary are skipped to avoid replaying
   * queued pre-stop backlog.
   */
  abortCutoffMessageSid?: string;
  /** Epoch ms cutoff paired with abortCutoffMessageSid when available. */
  abortCutoffTimestamp?: number;
  chatType?: SessionChatType;
  contextWindow?: string;
  thinkingLevel?: string;
  /**
   * Exact isolated-cron continuation policy. Only hidden `:run:` session rows
   * carry this while detached generated-media work may still wake the run.
   */
  cronRunContinuation?: {
    lifecycleRevision: string;
    phase: "running" | "ready" | "continuing";
    /** True only after this row's session changes were projected to the stable cron row. */
    basePersisted?: boolean;
    ownerRunId?: string;
    /** Gateway lifecycle generation that owns a continuing claim. */
    ownerLifecycleGeneration?: string;
    /** CLI backend whose native session must exist before media work detaches. */
    cliExecutionProvider?: string;
    toolsAllow?: string[];
    toolsAllowIsDefault?: boolean;
    /** Exact server-stamped authority provenance copied from the owning cron job. */
    scheduledToolPolicy?: CronScheduledToolPolicy;
    /** Restrict-only exec pin copied from the owning cron job's cap. */
    toolsAllowExecTarget?: CronToolsAllowExecTarget;
    /** Expected pin copied with the cap so detached continuation loss fails closed. */
    toolsAllowExecTargetRequirement?: CronToolsAllowExecTargetRequirement;
    /** Store-private origin paired with an account scheduled-tool policy. */
    scheduledToolCallerOrigin?: CronScheduledToolCallerOrigin;
    cliSessionBindingFacts?: {
      extraSystemPromptStatic?: string;
      sourceReplyDeliveryMode?: "automatic" | "message_tool_only";
      requireExplicitMessageTarget?: boolean;
    };
  };
  fastMode?: FastMode;
  toolOverrides?: SessionToolOverrides;
  /** Swarm group for collector-mode child sessions. */
  swarmGroupId?: string;
  /** Marks non-interactive collector-mode child sessions. */
  swarmCollector?: boolean;
  /** JSON Schema exposed through the synthetic structured_output tool. */
  swarmOutputSchema?: Record<string, unknown>;
  verboseLevel?: string;
  traceLevel?: string;
  reasoningLevel?: string;
  elevatedLevel?: string;
  ttsAuto?: TtsAutoMode;
  /** Hash of the latest assistant reply that was sent through `/tts latest`. */
  lastTtsReadLatestHash?: string;
  /** Timestamp (ms) when `/tts latest` last sent audio for this session. */
  lastTtsReadLatestAt?: number;
  execHost?: string;
  execNode?: string;
  /** Working directory interpreted only by the bound exec node. */
  execCwd?: string;
  responseUsage?: "on" | "off" | "tokens" | "full";
  providerOverride?: string;
  modelOverride?: string;
  /** Session-scoped agent runtime/harness override selected with the model picker. */
  agentRuntimeOverride?: string;
  /**
   * Tracks whether the persisted model selection came from an explicit user
   * action (`/model`, `sessions.patch`), a temporary runtime fallback, or an
   * explicit configured-default selection that blocks parent inheritance.
   */
  modelOverrideSource?: "auto" | "user" | "default";
  /** Present only when providerOverride/modelOverride are a canonical route pair. */
  modelOverrideRouteResolution?: "resolved";
  /** Selected model that produced the current auto fallback override. */
  modelOverrideFallbackOriginProvider?: string;
  modelOverrideFallbackOriginModel?: string;
  /** One-run rollback guard for a model selected by the agent sessions tool. */
  modelFallback?: AgentPatchedSessionModelFallback;
  authProfileOverride?: string;
  authProfileOverrideSource?: "auto" | "user" | "user-link";
  authProfileOverrideCompactionCount?: number;
  /**
   * Set on explicit user-driven session model changes (for example `/model`
   * and `sessions.patch`) during an active run. The embedded runner checks
   * this flag to decide whether to throw `LiveSessionModelSwitchError`.
   * System-initiated fallbacks (rate-limit retry rotation) never set this
   * flag, so they are never mistaken for user-initiated switches.
   */
  liveModelSwitchPending?: boolean;
  groupActivation?: "mention" | "always";
  groupActivationNeedsSystemIntro?: boolean;
  sendPolicy?: "allow" | "deny";
  queueMode?: QueueMode;
  queueDebounceMs?: number;
  queueCap?: number;
  queueDrop?: "old" | "new" | "summarize";
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  pendingFinalDelivery?: PendingFinalDeliveryState;
  pendingDeliveryNotice?: PendingDeliveryNoticeState;
  /**
   * Ordered durable backlog of delivered assistant finals that failed to
   * reach the canonical transcript. Session admission restores each item
   * before another turn can extend that transcript. Kept as a list so
   * independently admitted writers never overwrite an earlier reply.
   */
  pendingTranscriptRepair?: PendingTranscriptRepairState[];
  /**
   * Whether totalTokens reflects a fresh context snapshot for the latest run.
   * Undefined means legacy/unknown freshness; false forces consumers to treat
   * totalTokens as stale/unknown for context-utilization displays.
   */
  totalTokensFresh?: boolean;
  /** Version 1 records totalTokens as the current prompt/context snapshot only. */
  totalTokensVersion?: typeof SESSION_TOTAL_TOKENS_VERSION;
  estimatedCostUsd?: number;
  cacheRead?: number;
  cacheWrite?: number;
  modelProvider?: string;
  model?: string;
  /**
   * Prevents OpenClaw model changes and automatic maintenance eviction until
   * the owning harness explicitly retires the session.
   */
  modelSelectionLocked?: boolean;
  /**
   * Embedded agent harness selected for this session id.
   * Prevents config/env changes from moving an existing transcript between
   * incompatible runtime harnesses.
   */
  agentHarnessId?: string;
  fallbackNotice?: FallbackNoticeState;
  contextTokens?: number;
  /** Origin of the persisted context window; `resolved` is legacy/unverified. */
  contextTokensSource?: "runtime" | "runtime-configured" | "resolved" | "resolved-v1";
  contextBudgetStatus?: SessionContextBudgetStatus;
  compactionCount?: number;
  memoryFlush?: MemoryFlushState;
  cliSessionIds?: Record<string, string>;
  cliSessionBindings?: Record<string, CliSessionBinding>;
  /** Initialization fence for seeding canonical ACP metadata; cleared after creation. */
  acpSessionBinding?: AcpSessionBinding;
  claudeCliSessionId?: string;
  label?: string;
  /** Automatic device name; never claims a custom label or overrides a generated title. */
  autoLabel?: string;
  /** Persistent sidebar emoji, named glyph, or canonical SVG image data URL. */
  icon?: string;
  /** Named sidebar tint (SESSION_COLOR_IDS); palette mirrors Claude Code /color for import. */
  color?: string;
  /** User-defined organization bucket for session lists; unrelated to chat groupId/groupChannel. */
  category?: string;
  /** Preferred Control UI face when a caller opens this session without explicit face intent. */
  boardFace?: SessionBoardFace;
  /** Shared dashboard presentation default; absence uses the built-in split view. */
  boardPresentation?: NonNullable<SessionRow["boardPresentation"]>;
  displayName?: string;
  /** Canonical delivery state. Legacy delivery fields are migrated by `openclaw doctor --fix`. */
  delivery?: SessionDeliveryState;
  groupId?: string;
  subject?: string;
  /** Display-only topic name; subject remains the group name used for routing. */
  topicName?: string;
  groupChannel?: string;
  space?: string;
  /** Last ambient room message durably appended to this transcript, keyed by channel scope. */
  ambientTranscriptWatermarks?: Record<string, AmbientTranscriptWatermark>;
  skillsSnapshot?: SessionSkillSnapshot;
  /** Explicit authorized immutable library pins; current speakers never replace this selection. */
  skillLibrarySelections?: SkillLibrarySelection[];
  systemPromptReport?: SessionSystemPromptReport;
  /**
   * Generic plugin-owned runtime debug entries shown in verbose status surfaces.
   * Each plugin owns and may overwrite only its own entry between turns.
   */
  pluginDebugEntries?: SessionPluginDebugEntry[];
  acp?: SessionAcpMeta;
};
interface SessionEntry extends SessionEntryCore {}
/** Internal durable fields excluded from public/plugin session projections. */
type SessionProfileInvolvement = {
  hidden: boolean;
  updatedAt: number;
  /** Original committed source ordering, retained when the person hides the session. */
  lastMention?: {
    generation: string;
    sequence: number;
    timestamp: number;
  };
};
type InternalSessionEntryCore = SessionEntryCore & {
  /** Personal discovery state, never participation, attribution, or sharing authority. */
  profileInvolvement?: {
    key: string;
    profiles: Record<string, SessionProfileInvolvement>;
  };
  /** Transcript-wide account provenance; native binding replacement must not replace it. */
  cliHistoryBoundary?: CliHistoryBoundary;
  /** Explicit world-readable publication, bound to one transcript generation. */
  publicShare?: {
    id: string;
    sessionId: string;
    createdAt: number;
  };
  /** Run that owns the current non-terminal Gateway lifecycle projection. */
  lifecycleRunId?: string;
  /** Exact run that produced the latest terminal Gateway lifecycle projection. */
  lastRunId?: string;
  /** Run admitted by the session lane; overwritten at admission and checked by transcript writes. */
  activeWriterRunId?: string;
  /** Canonical remote repository awaiting preparation by this exact session generation. */
  pendingProjectGitUrl?: string;
  /** Authorized worktree intent awaiting preparation by an admitted turn. */
  pendingWorktree?: PendingSessionWorktree;
  /** Suppresses repeated byte-triggered compaction after an oversized successor was observed. */
  transcriptByteCompactionLatch?: {
    activeBytes: number;
    sessionId: string;
    maxBytes: number;
  };
  /** Private per-generation ownership for the pre-runtime checkout baseline capture. */
  sessionDiffBaselineCapture?: SessionDiffBaselineCapture;
  mainRestartRecovery?: MainRestartRecoveryState;
};
interface InternalSessionEntry extends InternalSessionEntryCore {}
type GroupKeyResolution = {
  key: string;
  channel?: string;
  id?: string;
  chatType?: SessionChatType;
};
//#endregion
//#region src/sessions/provider-review.d.ts
declare const acknowledgmentBrand: unique symbol;
/** Host-issued capability; serialized request metadata cannot create one. */
interface ProviderReviewAcknowledgment {
  readonly [acknowledgmentBrand]: true;
  readonly read: () => Readonly<{
    review: Readonly<SessionProviderReview>;
    phase: "pending" | "accepted";
  }>;
  readonly assertRuntime: (runtime: {
    provider: string;
    model: string;
    runtimeId: string;
    api?: string;
    assertCurrent: () => void;
  }) => Promise<void>;
  readonly acceptNativeTurn: (accepted: {
    nativeThreadId: string;
    nativeTurnId: string;
    assertCurrent: () => void;
  }) => Promise<void>;
}
//#endregion
//#region packages/normalization-core/src/agent-run-terminal-outcome.d.ts
declare const AGENT_RUN_ABORTED_STOP_REASON: "aborted";
declare const AGENT_RUN_RESTART_ABORT_STOP_REASON: "restart";
declare const AGENT_RUN_SUPERSEDED_STOP_REASON: "superseded";
declare const AGENT_RUN_TIMEOUT_PHASES: readonly ["queue", "preflight", "provider", "post_turn", "gateway_draining"];
type AgentRunTimeoutPhase = (typeof AGENT_RUN_TIMEOUT_PHASES)[number];
type AgentRunWaitStatus = "ok" | "error" | "timeout";
type AgentRunTerminalReason = "completed" | "hard_timeout" | "timed_out" | "superseded" | "cancelled" | "aborted" | "blocked" | "abandoned" | "failed";
type AgentRunTerminalFacts = {
  reason: AgentRunTerminalReason;
  status: AgentRunWaitStatus;
  stopReason?: string;
  livenessState?: string;
  timeoutPhase?: AgentRunTimeoutPhase;
  providerStarted?: boolean;
};
//#endregion
//#region src/agents/agent-run-terminal-outcome.types.d.ts
/** Normalized terminal outcome for an agent run. */
type AgentRunTerminalOutcome = AgentRunTerminalFacts & {
  error?: string;
  startedAt?: number;
  endedAt?: number;
};
//#endregion
//#region src/audit/execution-identity-admission.d.ts
declare const ExecutionIdentityAdmissionEnvelopeSchema: Type.TObject<{
  envelopeVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
  runtimeInstanceId: Type.TString;
  agentId: Type.TString;
  ingress: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"local-cli">, Type.TLiteral<"gateway-client">, Type.TLiteral<"channel">, Type.TLiteral<"api">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"task">, Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"worker">, Type.TLiteral<"plugin">, Type.TLiteral<"recovery">, Type.TLiteral<"system">]>;
    boundary: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
    rawSourceRef: Type.TOptional<Type.TString>;
  }>;
  runtime: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"embedded">, Type.TLiteral<"worker">, Type.TLiteral<"plugin-harness">, Type.TLiteral<"acp">]>;
  }>;
  invoker: Type.TOptional<Type.TUnion<[Type.TObject<{
    state: Type.TLiteral<"present">;
    kind: Type.TUnion<[Type.TLiteral<"person">, Type.TLiteral<"agent">, Type.TLiteral<"service">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"system">, Type.TLiteral<"local-account">, Type.TLiteral<"runtime">]>;
    rawPrincipalRef: Type.TString;
    displayLabel: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    state: Type.TLiteral<"unknown">;
  }>]>>;
  applicableGrants: Type.TArray<Type.TObject<{
    rawGrantRef: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
  }>>;
  assurance: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"durable-profile">, Type.TLiteral<"trusted-proxy">, Type.TLiteral<"tailscale-whois">, Type.TLiteral<"device-proof">, Type.TLiteral<"channel-admission">, Type.TLiteral<"local-process">, Type.TLiteral<"spawn-lineage">, Type.TLiteral<"worker-admission">, Type.TLiteral<"runtime-binding">, Type.TLiteral<"other">]>;
    rawEvidenceRef: Type.TString;
    strength: Type.TUnion<[Type.TLiteral<"self-asserted">, Type.TLiteral<"boundary-verified">, Type.TLiteral<"cryptographic">]>;
  }>>;
}>;
declare const ExecutionIdentityAdmissionTokenSchema: Type.TObject<{
  tokenVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
}>;
type ExecutionIdentityAdmissionEnvelope = Static<typeof ExecutionIdentityAdmissionEnvelopeSchema>;
type ExecutionIdentityAdmissionFacts = Omit<ExecutionIdentityAdmissionEnvelope, "envelopeVersion" | "contextId" | "executionId" | "createdAt" | "runtimeInstanceId" | "ingress" | "applicableGrants" | "assurance"> & {
  ingress: Omit<ExecutionIdentityAdmissionEnvelope["ingress"], "state"> & {
    state?: ExecutionIdentityAdmissionEnvelope["ingress"]["state"];
  };
  applicableGrants?: ExecutionIdentityAdmissionEnvelope["applicableGrants"];
  assurance?: ExecutionIdentityAdmissionEnvelope["assurance"];
};
type ExecutionIdentityAdmissionToken = Static<typeof ExecutionIdentityAdmissionTokenSchema>;
//#endregion
//#region src/infra/outbound/reply-payload-parts.d.ts
/** Derived sendability facts for text/media outbound payload delivery. */
type SendableOutboundReplyParts = {
  /** Raw text selected for delivery before trimming. */
  text: string;
  /** Text after trimming whitespace for sendability checks. */
  trimmedText: string;
  /** Normalized non-empty media URLs. */
  mediaUrls: string[];
  /** Number of normalized media URLs. */
  mediaCount: number;
  /** Whether trimmed text is sendable. */
  hasText: boolean;
  /** Whether at least one media URL is sendable. */
  hasMedia: boolean;
  /** Whether the payload has any sendable text or media. */
  hasContent: boolean;
};
/** Prepared payload entry that keeps source indexing plus reusable projections. */
type OutboundPayloadPlan = {
  sourceIndex: number;
  payload: ReplyPayload;
  parts: SendableOutboundReplyParts;
  hasPresentation: boolean;
  hasInteractive: boolean;
  hasChannelData: boolean;
};
/** Prefer multi-attachment payloads, then fall back to the legacy single-media field. */
declare function resolveOutboundMediaUrls(payload: {
  mediaUrls?: string[];
  mediaUrl?: string;
}): string[];
/** Count outbound media items after legacy single-media fallback normalization. */
declare function countOutboundMedia(payload: {
  mediaUrls?: string[];
  mediaUrl?: string;
}): number;
/** Check whether an outbound payload includes any media after normalization. */
declare function hasOutboundMedia(payload: {
  mediaUrls?: string[];
  mediaUrl?: string;
}): boolean;
/** Check whether an outbound payload includes text, optionally trimming whitespace first. */
declare function hasOutboundText(payload: {
  text?: string;
}, options?: {
  trim?: boolean;
}): boolean;
/** Normalize reply payload text/media into a trimmed, sendable shape for delivery paths. */
declare function resolveSendableOutboundReplyParts(payload: {
  text?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
}, options?: {
  text?: string;
}): SendableOutboundReplyParts;
//#endregion
//#region src/chat/message-client-source.d.ts
/** Reported transport facts, separate from authenticated sender identity. */
type MessageClientSource = Pick<GatewayClientInfo, "id" | "mode" | "displayName">;
//#endregion
//#region src/chat/sender-identity.d.ts
type TranscriptSenderIdentity = Extract<SessionParticipantIdentity, {
  type: "profile" | "remote" | "observation";
}>;
//#endregion
//#region packages/gateway-protocol/src/chat-work-context.d.ts
/** Bounded, untrusted send-time reference data; never routing or authorization. */
declare const CHAT_WORK_CONTEXT_LIMITS: {
  readonly page: 64;
  readonly title: 96;
  readonly sessionKey: 192;
  readonly sessionId: 64;
  readonly agentId: 64;
  readonly workspace: 224;
  readonly file: 224;
  readonly selection: 640;
};
type ChatWorkContext = {
  page: string;
} & Partial<Record<Exclude<keyof typeof CHAT_WORK_CONTEXT_LIMITS, "page">, string>>;
//#endregion
//#region src/chat/work-context.d.ts
type AttachedChatWorkContext = {
  snapshot: ChatWorkContext;
  text: string;
};
//#endregion
//#region src/sessions/user-turn-transcript.types.d.ts
type UserTurnSessionEntry = SessionEntry;
type PersistedUserTurnMediaInput = Pick<MediaFactInput, "contentType" | "durationMs" | "fileName" | "origin" | "height" | "hydrationSuppressed" | "messageId" | "path" | "sizeBytes" | "transcribed" | "url" | "width"> & {
  kind?: string | null;
  workspaceDir?: string | null;
};
type PersistedUserTurnMessage = Extract<AgentMessage, {
  role: "user";
}> & {
  display?: false;
  excludeFromContext?: true;
  /** Private transcript correlation; never authorizes an execution. */
  idempotencyKey?: string;
  provenance?: InputProvenance;
  __openclaw?: Record<string, unknown> & {
    humanMentions?: readonly HumanMention[];
  };
};
type UserTurnInput = Pick<PersistedUserTurnMessage, "display" | "excludeFromContext"> & {
  text?: string | null;
  /** Authored text and its captured reference; model content stays unchanged. */
  workContext?: AttachedChatWorkContext;
  /** Explicit human selections bound to UTF-16 offsets in text. */
  mentions?: readonly HumanMention[];
  media?: readonly PersistedUserTurnMediaInput[] | null;
  /** Restart-safe native image placement; model-visible prompt bytes remain separate. */
  mediaImageLayout?: {
    slots: readonly {
      kind: "inline" | "offloaded";
      factIndex?: number;
    }[];
    suppressedFactIndexes?: readonly number[];
  } | null;
  timestamp?: number;
  idempotencyKey?: string;
  /** Durable transcript message reference used to render and hydrate replies. */
  replyToId?: string;
  /** Bounded display fallback for replies whose target is outside loaded history. */
  replyToPreview?: {
    text: string;
    senderLabel?: string | null;
  } | null;
  senderIsOwner?: boolean;
  provenance?: InputProvenance;
  /** Identity is producer-owned attribution; labels remain editable display metadata. */
  sender?: {
    id?: string | null;
    name?: string | null;
    username?: string | null;
    identity?: TranscriptSenderIdentity;
  } | null;
  /** Durable transport correlation; stored privately and never rendered into model input. */
  transport?: {
    /** Reported client sources retained through collection; never sender authority. */
    clients?: readonly MessageClientSource[];
    channel?: string;
    conversationRef?: string;
    messageId?: string;
    replyToId?: string;
    threadId?: string;
  };
};
type UserTurnTranscriptUpdateMode = "inline" | "none";
type UserTurnBeforeMessageWrite = (params: {
  message: PersistedUserTurnMessage;
  agentId?: string;
  sessionKey?: string;
}) => AgentMessage | null;
type UserTurnTranscriptPersistenceTarget = {
  sessionId: string;
  expectedSessionId?: string;
  initialSessionEntry?: SessionEntry;
  sessionKey: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  sessionStore?: Record<string, UserTurnSessionEntry>;
  storePath?: string;
  agentId: string;
  threadId?: string | number;
  cwd?: string;
  config?: unknown;
  beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type UserTurnTranscriptTarget = UserTurnTranscriptPersistenceTarget;
type UserTurnTranscriptAdmissionReceipt = TranscriptTurnAdmission;
/** Native producer facts for the current host-admitted prompt; never a message replacement. */
type UserTurnTranscriptAnnotation = Readonly<{
  mirrorIdentity: string;
  upstreamUserText: string;
  mirrorOrigin: string;
  mirrorSourceFingerprint: string;
}>;
type UserTurnTranscriptPersistResult = {
  sessionTurnMutationResult?: SessionTranscriptTurnMutationResult;
  /** True only when this call inserted the transcript message. */
  appended?: boolean;
  sessionFile: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  messageId: string;
  message: PersistedUserTurnMessage;
  admission: UserTurnTranscriptAdmissionReceipt;
};
type UserTurnTranscriptTargetResolver = UserTurnTranscriptTarget | (() => UserTurnTranscriptTarget | undefined | Promise<UserTurnTranscriptTarget | undefined>);
type UserTurnTranscriptRecorder = {
  readonly message: PersistedUserTurnMessage | undefined;
  resolveMessage: () => Promise<PersistedUserTurnMessage | undefined>;
  /** Committed input, accepted pending custody, and blocked notices are exempt. */
  assertOriginalInputCommit?: () => void;
  /** Durable input custody leaves the active transcript unchanged until execution owns it. */
  stageApproved?: (options: {
    runId: string;
    assertCurrent: () => void;
    assertAdmittedCurrent?: () => void;
    assertCompletionCurrent?: () => void;
  }) => Promise<boolean>;
  getProcessingCompletion?: () => AgentRunTerminalOutcome | undefined;
  completeProcessing?: (outcome: AgentRunTerminalOutcome) => AgentRunTerminalOutcome | undefined;
  getPendingInputMessage?: () => PersistedUserTurnMessage | undefined;
  isPendingInputConsumed?: () => boolean;
  withPendingInput?: <T>(run: () => T) => T;
  finishPendingInput?: (disposition: "cancelled" | "interrupted") => void;
  /** Replaces generated current-turn text before runtime persistence/provider submission. */
  replaceTextBeforePersistence?: (text: string) => void;
  /** Confirms exact-run steering provenance after transcript commitment is proven. */
  confirmSteerTargetRunIdForPersistence?: (targetRunId: string) => Promise<void>;
  getPersistedMessage?: () => PersistedUserTurnMessage | undefined;
  getAdmissionReceipt: () => UserTurnTranscriptAdmissionReceipt | undefined;
  setAdmissionHandler?: (handler: (admission: UserTurnTranscriptAdmissionReceipt) => void) => void;
  markSentToProvider?: () => void;
  markRuntimePersistencePending: (pending: Promise<void>) => void;
  markRuntimePersisted: (message?: PersistedUserTurnMessage, anchor?: TranscriptEntryAnchor | UserTurnTranscriptAdmissionReceipt, persistence?: {
    appended: boolean;
  }) => void;
  markBlocked: () => void;
  hasPersisted: () => boolean;
  isBlocked: () => boolean;
  hasRuntimePersistencePending: () => boolean;
  waitForRuntimePersistence: () => Promise<void>;
  persistApproved: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
    expectedSessionId?: string;
    expectedSessionState?: SessionTranscriptTurnExpectedState;
    sessionLifecyclePatch?: SessionTranscriptTurnLifecyclePatch;
    /** Allow a later explicit persistence attempt when this attempt appends nothing. */
    retryIfUnpersisted?: boolean;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistBlocked: (message: PersistedUserTurnMessage, params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistFallback: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
};
//#endregion
//#region src/auto-reply/reply/typing.d.ts
/** Controller for channel typing indicator lifecycle during a reply run. */
type TypingController = {
  onReplyStart: () => Promise<void>;
  startTypingLoop: () => Promise<void>;
  startTypingOnText: (text?: string) => Promise<void>;
  refreshTypingTtl: () => void;
  isActive: () => boolean;
  markRunComplete: () => void;
  markDispatchIdle: () => void;
  cleanup: () => void;
};
//#endregion
//#region src/auto-reply/get-reply-options.types.d.ts
/** A successful runtime append, independent of optional active-path projection anchors. */
type ReplyDispatchAssistantTranscript = Pick<TranscriptEntryAnchor, "agentId" | "sessionId" | "sessionKey" | "storePath"> & {
  messageId: string;
  anchor?: TranscriptEntryAnchor;
  idempotencyKey: string;
};
type ReplyDispatchRun = {
  completionSource: "reply-dispatch";
  getResult: () => {
    assistantTranscript?: ReplyDispatchAssistantTranscript;
    terminalOutcome?: AgentRunTerminalOutcome;
  };
};
type BlockReplyContext = {
  abortSignal?: AbortSignal;
  timeoutMs?: number;
  /** Source assistant message index from the upstream stream, when available. */
  assistantMessageIndex?: number;
  /** @internal Stable durable outbound intent owned by the producing runtime. */
  deliveryIntentId?: string;
};
/** Context passed to onModelSelected callback with actual model used. */
type ModelSelectedContext = {
  provider: string;
  model: string;
  thinkLevel: string | undefined;
};
/** Typing indicator class for channel-owned UX policy. */
type TypingPolicy = "auto" | "user_message" | "system_event" | "internal_webchat" | "heartbeat";
/** Per-turn policy for source-message reply threading. */
type ReplyThreadingPolicy = {
  /** Override implicit reply-to-current behavior for the current turn. */
  implicitCurrentMessage?: "default" | "allow" | "deny";
};
/** Action sink available for model-proposed follow-up tasks during this turn. */
type TaskSuggestionDeliveryMode = "gateway";
/** Correlates queued reply ownership transfer with later delivery drains. */
type QueuedReplyDeliveryCorrelation = {
  begin: () => (() => void) | void;
};
/**
 * Exclusive: each lifecycle is its own collect-admission identity.
 * Cancel-only: share collect identity via ownerKey (gateway chat.send).
 */
type TurnAdoptionAdmission = "exclusive" | "cancel-only";
/**
 * Canonical turn-ownership lifecycle (adopt / defer / abandon / settle).
 * Single surface for durable ingress, gateway cancel identity, and reply-lane transfer.
 */
type TurnAdoptionLifecycle = {
  /**
   * Admission isolation mode (closed). Exclusive isolates collect identity per
   * lifecycle; cancel-only shares via ownerKey. Never inferred from onAbandoned.
   * Durable ingress sets exclusive; gateway cancel identity sets cancel-only.
   */
  admission?: TurnAdoptionAdmission;
  /** Transcript branch leaf from which this turn was admitted. */
  originatingLeafEntryId?: string | null;
  onAdopted: () => void | Promise<void>;
  /** Return false to reject followup enqueue. */
  onDeferred?: () => boolean | void;
  /** Pre-adoption liveness while waiting for reply-lane admission or preflight compaction. */
  onDeferredHeartbeat?: () => void;
  /** Requested cadence for pre-adoption heartbeats. */
  deferredHeartbeatIntervalMs?: number;
  /** Deferred turn finished without owning the reply lane. */
  onAbandoned?: () => void;
  /** Always fires when the followup ownership cycle ends (admitted or not). Gateway cleanup. */
  onSettled?: () => void;
  /** Retires cancellation ownership while retaining live identity. */
  onCancellationRetired?: () => void;
  /** Stable cancellation owner for collect-mode batches. */
  ownerKey?: string;
  abortSignal?: AbortSignal;
  /** Ephemeral fact: a direct local operator turn lost fresh cron authority when queued. */
  cronCreatorAuthorityUnavailable?: "queued-local-operator";
};
/** Partial assistant payload emitted during streaming or replacement updates. */
type PartialReplyPayload = {
  /**
   * Sanitized text, which may be an enumerable memoized getter. Content materializes on first
   * read: direct-delivery consumers pay per partial, while throttled consumers pay per flush.
   */
  text?: ReplyPayload["text"];
  mediaUrls?: ReplyPayload["mediaUrls"];
  delta?: string;
  replace?: true;
};
type ReasoningStreamPayload = Pick<ReplyPayload, "text" | "mediaUrls" | "isReasoning" | "isReasoningSnapshot"> & {
  requiresReasoningProgressOptIn?: boolean;
};
type ReasoningProgressPayload = {
  progressTokens: number;
};
/** Return false until the channel has accepted operator-visible progress. */
type ProgressCallbackResult = boolean | void;
/** Reply generation options shared by auto-reply, webchat, channels, and tests. */
type GetReplyOptions = {
  /** Host-issued capability for the exact findings acknowledged by the current operator. */
  providerReviewAcknowledgment?: ProviderReviewAcknowledgment;
  /** Channel-owned participant name encoding for source replies sent through message actions. */
  groupThreadReplyFormatter?: (text: string, participant: {
    agentId: string;
    name: string;
  }) => string;
  /** Override run id for agent events (defaults to random UUID). */
  runId?: string;
  /** Stable provider prompt-cache affinity key; distinct from run id/idempotency. */
  promptCacheKey?: string;
  /** Abort signal for the underlying agent run. */
  abortSignal?: AbortSignal;
  /** Ephemeral channel owner check for a targeted Stop; never serialized as authority. */
  isCommandTargetCurrent?: () => boolean;
  /** Optional inbound images (used for webchat attachments). */
  images?: ImageContent[];
  /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[];
  /** Ordered media facts whose model-facing text projection is already present in the prompt. */
  media?: MediaFact[];
  /**
   * Notifies when an agent run starts. Return "reply-dispatch" synchronously to accept
   * completion ownership offered in options; all other legacy callback results are ignored.
   */
  onAgentRunStart?: (runId: string, executionIdentityToken?: ExecutionIdentityAdmissionToken, options?: ReplyDispatchRun) => unknown;
  /** Reports the terminal agent-run classification to the shared dispatch owner. */
  onAgentRunTerminalOutcome?: (outcome: "completed" | "failed") => void;
  /**
   * Canonical adoption lifecycle (adopted / deferred / abandoned / settled + pre-adoption abort).
   */
  turnAdoptionLifecycle?: TurnAdoptionLifecycle;
  /** Shared lifecycle owner for the current user-turn transcript append. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
  /** Gateway-owned start-or-steer decision for this turn. */
  messageInjectionDisposition?: "none" | "accepted" | "rejected";
  /** Current user turn is already durable; replay it without appending another copy. */
  suppressNextUserMessagePersistence?: boolean;
  onReplyStart?: () => Promise<void> | void;
  /** Called when the typing controller cleans up (e.g., run ended with NO_REPLY). */
  onTypingCleanup?: () => void;
  onTypingController?: (typing: TypingController) => void;
  /** If false, send only the initial typing signal without periodic keepalive refreshes. */
  typingKeepalive?: boolean;
  isHeartbeat?: boolean;
  /** Policy-level typing control for run classes (user/system/internal/heartbeat). */
  typingPolicy?: TypingPolicy;
  /** Force-disable typing indicators for this run (system/internal/cross-channel routes). */
  suppressTyping?: boolean;
  /** Resolved heartbeat model override (provider/model string from merged per-agent config). */
  heartbeatModelOverride?: string;
  /** One-shot thinking level override for this run; does not persist to the session. */
  thinkingLevelOverride?: string;
  /** One-shot fast-mode override for this run; does not persist to the session. */
  fastModeOverride?: FastMode;
  /** One-shot auto fast-mode cutoff override in seconds; does not persist to the session. */
  fastModeAutoOnSecondsOverride?: number;
  /** Controls bootstrap workspace context injection (default: full). */
  bootstrapContextMode?: "full" | "lightweight";
  /** If true, run the model without OpenClaw tools for this turn. */
  disableTools?: boolean;
  /** Runtime tool allow-list for this turn. Empty means no tools. */
  toolsAllow?: string[];
  /** If true, include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean;
  /** If true, keep the heartbeat response tool available even under narrow tool profiles. */
  forceHeartbeatTool?: boolean;
  /**
   * @deprecated Ignored. The tool-failure warning is delivered whenever a run ends
   * without a reply and cannot be suppressed. Kept only so plugin-sdk callers that
   * still pass it keep compiling; removed in the first stable release after 2026.10.
   */
  suppressToolErrorWarnings?: boolean;
  /**
   * If true, dispatch skips default tool/progress text messages and expects the
   * channel to surface progress via its own streaming/edit UX.
   */
  suppressDefaultToolProgressMessages?: boolean;
  /** Suppress standalone tool/progress text even when verbose progress is enabled. */
  suppressToolProgressMessages?: boolean;
  /** Allow channel-owned tool lifecycle feedback while text progress remains hidden. */
  allowToolLifecycleWhenProgressHidden?: boolean;
  /**
   * Called before dispatch with a live getter for whether verbose standalone
   * progress messages are active for this run. Channels that render tool or
   * commentary progress inside an ephemeral streaming draft should yield those
   * draft lines while the getter returns true, so progress is not rendered in
   * both lanes at once.
   */
  onVerboseProgressVisibility?: (isActive: () => boolean) => void;
  /** Preserve source-event callback start order for stateful channel progress renderers. */
  preserveProgressCallbackStartOrder?: boolean;
  onPartialReply?: (payload: PartialReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningStream?: (payload: ReasoningStreamPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningProgress?: (payload: ReasoningProgressPayload) => Promise<void> | void;
  streamReasoningInNonStreamModes?: boolean;
  /** Called when a thinking/reasoning block ends. */
  onReasoningEnd?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a new assistant message starts (e.g., after tool call or thinking block). */
  onAssistantMessageStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called synchronously when a block reply is logically emitted, before async
   * delivery drains. Useful for channels that need to rotate preview state at
   * block boundaries without waiting for transport acks. */
  onBlockReplyQueued?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onBlockReply?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
  /** Receives a block whose producer has already resolved inline directives. */
  onPreparedBlockReply?: (plan: OutboundPayloadPlan, context?: BlockReplyContext) => Promise<void> | void;
  onToolResult?: (payload: ReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a tool phase starts/updates, before summary payloads are emitted. */
  onToolStart?: (payload: {
    itemId?: string;
    toolCallId?: string;
    name?: string;
    phase?: string;
    args?: Record<string, unknown>;
    detailMode?: "explain" | "raw";
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a concrete work item starts, updates, or completes. */
  onItemEvent?: (payload: {
    itemId?: string;
    toolCallId?: string;
    kind?: string;
    title?: string;
    name?: string;
    phase?: string;
    status?: string;
    summary?: string;
    progressText?: string;
    meta?: string;
    commandBearing?: boolean;
    approvalId?: string;
    approvalSlug?: string;
    suppressDurableProgress?: true;
    hideFromChannelProgress?: boolean;
    suppressChannelProgress?: boolean;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /**
   * Called when the utility-model narration of the in-progress turn changes.
   * Providing this callback opts the channel into progress narration; core
   * only generates narration when a utility model resolves (explicit
   * config or the provider-declared default; utilityModel: "" disables).
   * An empty text clears narration; a retained model preamble still wins before
   * the channel falls back to raw tool progress.
   */
  onNarrationUpdate?: (payload: {
    text: string;
  }) => Promise<void> | void;
  /** Channel-owned final and queued-turn boundaries for the current narrator. */
  onProgressNarratorLifecycle?: (lifecycle: {
    beginTurn: () => void;
    stopTurn: () => void;
  }) => void;
  /** False while utility-model narration has no visible progress draft. */
  isProgressDraftVisible?: () => boolean;
  /**
   * Omit exec/bash command text from narration model input, mirroring the
   * channel's `streaming.progress.commandText: "status"` display policy so
   * narration never receives more command detail than the draft shows.
   */
  narrationHideCommandText?: boolean;
  /** In progress mode, classify Claude pre-tool text; true also renders it as commentary. */
  commentaryProgressEnabled?: boolean;
  /** Bridge typed preambles to a channel-owned progress headline without commentary. */
  progressPreambleEnabled?: boolean;
  /** Deliver durable reasoning payloads to channels that own a separate reasoning lane. */
  reasoningPayloadsEnabled?: boolean;
  /** Deliver durable commentary (💬) payloads to channels that own a separate commentary lane. */
  commentaryPayloadsEnabled?: boolean;
  /** Optional turn-frozen commentary owner; visibility is live by default.
   * With the static opt-in and this callback, core freezes, evaluates once, and snapshots. */
  shouldDeliverCommentaryPayloads?: () => boolean;
  /** Called when the agent emits a structured plan update. */
  onPlanUpdate?: (payload: {
    phase?: string;
    title?: string;
    explanation?: string;
    /** Prepared literal text; unmarked explanations retain authored Markdown. */
    explanationFormat?: "plain";
    steps?: AgentPlanStep[];
    source?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when an approval becomes pending or resolves. */
  onApprovalEvent?: (payload: {
    phase?: string;
    kind?: string;
    status?: string;
    title?: string;
    itemId?: string;
    toolCallId?: string;
    approvalId?: string;
    approvalSlug?: string;
    command?: string;
    host?: string;
    reason?: string;
    scope?: "turn" | "session";
    message?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when command output streams or completes. */
  onCommandOutput?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    output?: string;
    status?: string;
    exitCode?: number | null;
    durationMs?: number;
    cwd?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a patch completes with a file summary. */
  onPatchSummary?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    added?: string[];
    modified?: string[];
    deleted?: string[];
    summary?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction starts (allows UX feedback during the pause). */
  onCompactionStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction ends; omitted outcome means completed for legacy callers. */
  onCompactionEnd?: (payload?: {
    completed: boolean;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when the actual model is selected (including after fallback).
   * Use this to get model/provider/thinkLevel for responsePrefix template interpolation. */
  onModelSelected?: (ctx: ModelSelectedContext) => void;
  /**
   * Controls whether normal assistant replies are automatically delivered to
   * the source conversation. `message_tool_only` prefers message-tool visible
   * delivery and keeps normal final text, block output, and preview output
   * private unless dispatch explicitly marks a source reply as deliverable.
   */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  /** Enables task-suggestion tools only when the initiating surface can action Gateway events. */
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  /** Starts delivery tracking when this turn later drains as a queued followup. */
  queuedDeliveryCorrelations?: QueuedReplyDeliveryCorrelation[];
  /** Called after a queued followup owns the reply lane, before its model run starts. */
  onQueuedFollowupAdmitted?: () => Promise<void> | void;
  /** Called after an admitted queued followup finishes, including failed attempts. */
  onQueuedFollowupSettled?: () => Promise<void> | void;
  /** Allow channel-owned progress UI while final/source reply delivery remains message-tool-only. */
  allowProgressCallbacksWhenSourceDeliverySuppressed?: boolean;
  /** Called when a suppressed source reply mode observes visible delivery through another path. */
  onObservedReplyDelivery?: () => Promise<void> | void;
  /** Emit tool result summaries for channel-owned progress UI even when verbose is off. */
  forceToolResultProgress?: boolean;
  disableBlockStreaming?: boolean;
  /** Timeout for block reply delivery (ms). */
  blockReplyTimeoutMs?: number;
  /** If provided, only load these skills for this session (empty = no skills). */
  skillFilter?: string[];
  /** Mutable ref to track if a reply was sent (for Slack "first" threading mode). */
  hasRepliedRef?: {
    value: boolean;
  };
  /** Override agent timeout in seconds (0 = no timeout). Threads through to resolveAgentTimeoutMs. */
  timeoutOverrideSeconds?: number;
  /** Millisecond run timeout override; takes precedence over seconds (0 = no timeout). */
  timeoutOverrideMs?: number;
};
//#endregion
//#region src/auto-reply/templating.d.ts
/** Valid message channels for routing. */
type OriginatingChannelType = string & {
  readonly __originatingChannelBrand?: never;
};
type MentionSource = "explicit_bot" | "subteam" | "mention_pattern" | "implicit_thread" | "command_bypass" | "none";
type InboundSourceModality = "text" | "voice" | "audio" | "image" | "video" | "document";
type StickerContextMetadata = {
  cachedDescription?: string;
  emoji?: string;
  setName?: string;
  description?: string;
  fileId?: string;
  fileUniqueId?: string;
  uniqueFileId?: string;
  isAnimated?: boolean;
  isVideo?: boolean;
} & Record<string, unknown>;
type ChannelStructuredContextEntry = {
  label: string;
  source?: string;
  type?: string;
  payload: unknown;
  /** Keeps this provider-owned window independent of bounded canonical transcript enrichment. */
  sessionTranscriptMode?: "preserve";
  /** Internal exact-id hints for canonical transcript/live-cache deduplication. */
  sessionTranscriptDedupeMessageIds?: string[];
  /** Internal visible-text hints for legacy assistant rows without transcript ids. */
  sessionTranscriptAssistantTextDedupeKeys?: string[];
};
type SessionTranscriptContext = {
  chatWindow?: boolean;
  historyLimit: number;
  /** A platform-selected recent window keeps its configured bound and does not merge transcript rows. */
  historyKind?: "pending" | "recent";
  beforeTimestampMs?: number;
  minTimestampMs?: number;
  senderLabels?: {
    assistant: string;
    user: string;
  };
};
/** @deprecated Use ChannelStructuredContextEntry. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
type UntrustedStructuredContextEntry = ChannelStructuredContextEntry;
/** Structured supplemental facts projected into prompt context by inbound finalization. */
type SupplementalContextFacts = {
  quote?: {
    id?: string;
    fullId?: string;
    body?: string;
    sender?: string;
    senderAllowed?: boolean;
    isExternal?: boolean;
    isQuote?: boolean;
  };
  forwarded?: {
    from?: string;
    fromType?: string;
    fromId?: string;
    date?: number;
    senderAllowed?: boolean;
  };
  thread?: {
    id?: string;
    starterBody?: string;
    historyBody?: string;
    label?: string;
    parentSessionKey?: string;
    modelParentSessionKey?: string;
    senderAllowed?: boolean;
  };
  channelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use channelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  untrustedContext?: ChannelStructuredContextEntry[];
  groupSystemPrompt?: string;
  /** Prompt-like group metadata from user-controlled sources; never enters the system prompt. */
  untrustedGroupSystemPrompt?: string;
};
/** Canonical normalized inbound text populated once by `finalizeInboundContext`. */
type CanonicalInboundText = {
  /** Clean text used for command and directive parsing. */
  commandText: string;
  /** Prompt-facing text used for the agent turn. */
  agentText: string;
  /** Normalized visible/raw inbound text before command-specific projection. */
  rawText: string;
};
/** Raw inbound message context accepted from channels before finalization. */
type MsgContext = Partial<CanonicalInboundText> & {
  Body?: string;
  InboundEventKind?: InboundEventKind;
  /**
   * Agent prompt body (may include envelope/history/context). Prefer this for prompt shaping.
   * Should use real newlines (`\n`), not escaped `\\n`.
   */
  BodyForAgent?: string;
  /**
   * Recent chat history for context (untrusted user content). Prefer passing this
   * as structured context blocks in the user prompt rather than rendering plaintext envelopes.
   */
  InboundHistory?: HistoryEntry[];
  /** Internal facts used to merge canonical transcript turns before dispatch. */
  SessionTranscriptContext?: SessionTranscriptContext;
  /**
   * @deprecated Use CommandBody.
   *
   * Raw message body without structural context (history, sender labels).
   * Legacy alias for CommandBody. Falls back to Body if not set.
   */
  RawBody?: string;
  /**
   * Prefer for command detection; RawBody is treated as legacy alias.
   */
  CommandBody?: string;
  /**
   * Command parsing body. Prefer this over CommandBody/RawBody when set.
   * Should be the "clean" text (no history/sender context).
   */
  BodyForCommands?: string;
  CommandArgs?: CommandArgs;
  From?: string;
  To?: string;
  SessionKey?: string;
  /**
   * Resolved agent scope for canonical session keys that do not encode the agent
   * id, such as selected-agent global sessions.
   */
  AgentId?: string;
  /** Participant mention facts prepared once from the physical inbound message. */
  GroupThread?: GroupThreadMentionFacts;
  /** Effective routed DM scope, including binding overrides. */
  DmScope?: DmScope;
  /**
   * Session-like key used for runtime policy (sandbox/tool policy) when the
   * conversation key intentionally remains broader, such as a main-session DM.
   */
  RuntimePolicySessionKey?: string;
  /** Provider account id (multi-account). */
  AccountId?: string;
  ParentSessionKey?: string;
  /**
   * Session key used only for inheriting session-scoped model/provider
   * overrides. Unlike ParentSessionKey, this must not trigger transcript
   * forking or parent-session lifecycle behavior.
   */
  ModelParentSessionKey?: string;
  MessageSid?: string;
  /** Provider-specific full message id when MessageSid is a shortened alias. */
  MessageSidFull?: string;
  MessageSids?: string[];
  MessageSidFirst?: string;
  MessageSidLast?: string;
  AmbientTranscriptWatermarkKey?: string;
  AmbientTranscriptBody?: string;
  AmbientTranscriptMessageId?: string;
  AmbientTranscriptTimestampMs?: number;
  AmbientTranscriptPreviousMessageId?: string;
  AmbientTranscriptPreviousTimestampMs?: number;
  /** Per-turn reply-threading overrides. */
  ReplyThreading?: ReplyThreadingPolicy;
  /** Effective channel reply mode prepared for this turn. */
  ReplyToMode?: ReplyToMode;
  ReplyToId?: string;
  /**
   * Root message id for thread reconstruction (used by Feishu for root_id).
   * When a message is part of a thread, this is the id of the first message.
   */
  RootMessageId?: string;
  /** Provider-specific full reply-to id when ReplyToId is a shortened alias. */
  ReplyToIdFull?: string;
  ReplyToBody?: string;
  ReplyToQuoteText?: string;
  ReplyToSender?: string;
  ReplyChain?: Array<{
    messageId?: string;
    threadId?: string;
    sender?: string;
    senderId?: string;
    senderUsername?: string;
    timestamp?: number;
    body?: string;
    isQuote?: boolean;
    mediaType?: string;
    mediaPath?: string;
    mediaRef?: string;
    replyToId?: string;
    forwardedFrom?: string;
    forwardedFromId?: string;
    forwardedFromUsername?: string;
    forwardedDate?: number;
  }>;
  ReplyToIsQuote?: boolean;
  /** Forward origin from the reply target (when reply_to_message is a forwarded message). */
  ReplyToForwardedFrom?: string;
  ReplyToForwardedFromType?: string;
  ReplyToForwardedFromId?: string;
  ReplyToForwardedFromUsername?: string;
  ReplyToForwardedFromTitle?: string;
  ReplyToForwardedDate?: number;
  ForwardedFrom?: string;
  ForwardedFromType?: string;
  ForwardedFromId?: string;
  ForwardedFromUsername?: string;
  ForwardedFromTitle?: string;
  ForwardedFromSignature?: string;
  ForwardedFromChatType?: string;
  ForwardedFromMessageId?: number;
  ForwardedDate?: number;
  ThreadStarterBody?: string;
  /** Full thread history when starting a new thread session. */
  ThreadHistoryBody?: string;
  IsFirstThreadTurn?: boolean;
  ThreadLabel?: string;
  /** @deprecated Use `media?.[0]?.path`. */
  MediaPath?: string;
  /** @deprecated Use `media?.[0]?.url`. */
  MediaUrl?: string;
  /** @deprecated Use `media?.[0]?.contentType` or `.kind`. */
  MediaType?: string;
  /** @deprecated Derive the directory from `media?.[0]?.path` at the consuming boundary. */
  MediaDir?: string;
  /** @deprecated Use `media?.map((entry) => entry.path)`. */
  MediaPaths?: string[];
  /** @deprecated Use `media?.map((entry) => entry.url)`. */
  MediaUrls?: string[];
  /** @deprecated Use `media?.map((entry) => entry.contentType ?? entry.kind)`. */
  MediaTypes?: string[];
  /** Ordered current-turn media facts; array position is attachment identity. */
  media?: MediaFact[];
  /** Original message modality before transcription or other media normalization. */
  SourceModality?: InboundSourceModality;
  /** @deprecated Use each media fact's `workspaceDir`. */
  MediaWorkspaceDir?: string;
  /** Attachment indexes whose audio was already transcribed before media understanding runs. */
  /** @deprecated Use each media fact's `transcribed` field. */
  MediaTranscribedIndexes?: number[];
  /**
   * Marker: skip downstream stageSandboxMedia. chat.send RPC sets this so
   * staging runs synchronously before respond() and surfaces 5xx to the
   * client; any later failure only reaches the broadcast channel.
   */
  /** @deprecated Use each media fact's `workspaceDir` or `staged` proof. */
  MediaStaged?: boolean;
  /** Telegram sticker metadata (emoji, set name, file IDs, cached description). */
  Sticker?: StickerContextMetadata;
  /** True when current-turn sticker media is present in structured facts. */
  StickerMediaIncluded?: boolean;
  /** Skip automatic understanding for the current sticker because its cached description is used. */
  SkipStickerMediaUnderstanding?: boolean;
  OutputDir?: string;
  OutputBase?: string;
  /** Remote host for SCP when media lives on a different machine (e.g., openclaw@192.168.64.3). */
  MediaRemoteHost?: string;
  Transcript?: string;
  MediaUnderstanding?: MediaUnderstandingOutput[];
  MediaUnderstandingDecisions?: MediaUnderstandingDecision[];
  LinkUnderstanding?: string[];
  Prompt?: string;
  MaxChars?: number;
  ChatType?: string;
  /** Trusted channel-configured policy for this admitted conversation turn. */
  ConversationToolPolicy?: GroupToolPolicyConfig;
  /** Human label for envelope headers (conversation label, not sender). */
  ConversationLabel?: string;
  GroupSubject?: string;
  /** Human label for channel-like group conversations (e.g. #general, #support). */
  GroupChannel?: string;
  GroupSpace?: string;
  /** Trusted provider role ids for the sender in this group turn. */
  MemberRoleIds?: string[];
  GroupMembers?: string;
  GroupSystemPrompt?: string;
  /**
   * Canonical inbound supplemental facts for new channel code. `finalizeInboundContext`
   * projects these to the existing flat reply/forward/thread/group prompt fields.
   */
  SupplementalContext?: SupplementalContextFacts;
  /** Channel-provided metadata that must not be treated as system instructions. */
  ChannelPromptContext?: string[];
  /** @deprecated Use ChannelPromptContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedContext?: string[];
  /** Structured channel metadata rendered by prompt assembly as fenced JSON. */
  ChannelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use ChannelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedStructuredContext?: UntrustedStructuredContextEntry[];
  /** System-attached provenance for the current inbound message. */
  InputProvenance?: InputProvenance;
  /** Internal wake cause, independent of transport, transcript provenance, and execution authority. */
  InternalTurnSource?: "heartbeat" | "cron" | "exec" | "progress-card-refresh";
  /** Explicit owner allowlist overrides (trusted, configuration-derived). */
  OwnerAllowFrom?: Array<string | number>;
  SenderName?: string;
  SenderId?: string;
  /** Trusted in-process creation provenance; never populated from channel payloads. */
  SessionCreation?: {
    skillLibrarySelections?: SkillLibrarySelection[];
    via: SessionCreatedVia;
    actor?: SessionCreatedActor;
    sandbox?: "required";
  };
  SenderUsername?: string;
  SenderTag?: string;
  SenderE164?: string;
  SenderIsBot?: boolean;
  /** Channel-ingress fact: sender is the operator's own account (from-me). */
  SenderIsSelf?: boolean;
  Timestamp?: number;
  LocationLat?: number;
  LocationLon?: number;
  LocationAccuracy?: number;
  LocationName?: string;
  LocationAddress?: string;
  LocationSource?: string;
  LocationIsLive?: boolean;
  LocationLivePeriodSeconds?: number;
  LocationCaption?: string;
  /** Stable identity of the provider update that carried this message. */
  ProviderUpdateId?: string;
  /** Provider update kind, for example `message` or `edited_message`. */
  ProviderUpdateKind?: string;
  /** Provider-native timestamp for the original message. */
  ProviderMessageTimestamp?: number;
  /** Provider-native timestamp for an edited message update. */
  ProviderEditTimestamp?: number;
  /** Provider label. */
  Provider?: string;
  /** Provider surface label. Prefer this over `Provider` when available. */
  Surface?: string;
  /** Platform bot username when command mentions should be normalized. */
  BotUsername?: string;
  WasMentioned?: boolean;
  /** Effective channel-owned mention policy before any plugin-binding bypass. */
  GroupRequireMention?: boolean;
  /** True when this turn explicitly mentioned the current bot target. */
  ExplicitlyMentionedBot?: boolean;
  /** Provider-native explicit user mention ids present on this turn. */
  MentionedUserIds?: string[];
  /** Provider-native explicit user-group/subteam mention ids present on this turn. */
  MentionedSubteamIds?: string[];
  /** Provider-native implicit mention wake reasons present on this turn. */
  ImplicitMentionKinds?: string[];
  /** Provider-native source that caused the current mention decision. */
  MentionSource?: MentionSource;
  CommandAuthorized?: boolean;
  CommandTurn?: CommandTurnContext;
  CommandSource?: "text" | "native";
  CommandInterpretationSuppressed?: boolean;
  CommandTargetSessionKey?: string;
  /**
   * Internal flag: command handling prepared trailing prompt text for ACP dispatch.
   * Used for `/new <prompt>` and `/reset <prompt>` on ACP-bound sessions.
   */
  AcpDispatchTailAfterReset?: boolean;
  /** Gateway client scopes when the message originates from the gateway. */
  GatewayClientScopes?: string[];
  /** Gateway client capabilities when the message originates from the gateway. */
  GatewayClientCaps?: string[];
  /** Server-bound requesting browser; never sourced from message text or rendered into prompts. */
  GatewayUiCommandTarget?: GatewayUiCommandTarget;
  /** Run-scoped plugin tool bindings; never rendered into prompt text. */
  GatewayRunToolBindings?: Readonly<Record<string, unknown>>;
  /** Gateway device id allowed to review approvals initiated by this turn. */
  ApprovalReviewerDeviceId?: string;
  /** Thread identifier (Telegram topic id or Matrix thread event id). */
  MessageThreadId?: string | number;
  /** Provider-native thread target for reply delivery without making the session thread-scoped. */
  TransportThreadId?: string | number;
  /** Platform-native channel/conversation id (e.g. Slack DM channel "D…" id). */
  NativeChannelId?: string;
  /** Channel-owned local conversation image reference; never rendered into prompt text. */
  ConversationAvatar?: string;
  /** Channel-owned metadata exposed to plugin hook context, not prompt text. */
  ChannelContext?: PluginHookChannelContext;
  /** Provider-native chat/conversation id used by channel plugins that expose `chat_id`. */
  ChatId?: string;
  /** Stable provider-native direct-peer id when a DM room/user mapping must survive later writes. */
  NativeDirectUserId?: string;
  /** Telegram forum supergroup marker. */
  IsForum?: boolean;
  /** Human-readable Telegram forum topic name (cached from service messages). */
  TopicName?: string;
  /** Warning: DM has topics enabled but this message is not in a topic. */
  TopicRequiredButMissing?: boolean;
  /**
   * Originating channel for reply routing.
   * When set, replies should be routed back to this provider
   * instead of using lastChannel from the session.
   */
  OriginatingChannel?: OriginatingChannelType;
  /**
   * Originating destination for reply routing.
   * The chat/channel/user ID where the reply should be sent.
   */
  OriginatingTo?: string;
  /**
   * True when the current turn intentionally requested external delivery to
   * OriginatingChannel/OriginatingTo, rather than inheriting stale session route metadata.
   */
  ExplicitDeliverRoute?: boolean;
  /**
   * Internal proof that the channel ingress owner admitted this sender/event.
   * Correlation interceptors must fail closed when this proof is absent.
   */
  InboundAccessAuthorized?: boolean;
  /** Internal marker that channel ingress authoritatively observed route-context facts. */
  ConversationRouteContextObserved?: boolean;
  /** Canonical peer used by route selection; delivery targets may use a different namespace. */
  ConversationRoutePeerId?: string;
  /**
   * Internal flag for channels that emit message_received through a channel-specific
   * privacy gate before entering the shared reply dispatcher.
   */
  SuppressMessageReceivedHooks?: boolean;
  /**
   * Provider-specific parent conversation id for threaded contexts.
   * For Discord threads, this is the parent channel id.
   */
  ThreadParentId?: string;
  /**
   * Messages from hooks to be included in the response.
   * Used for hook confirmation messages like "Session context saved to memory".
   */
  HookMessages?: string[];
};
type FinalizedMsgContext = Omit<MsgContext, "CommandAuthorized"> & {
  /**
   * Always set by finalizeInboundContext().
   * Default-deny: missing/undefined becomes false.
   */
  CommandAuthorized: boolean;
  /**
   * Populated by finalizeInboundContext(); optional for public SDK
   * compatibility with existing plugin-constructed finalized contexts.
   */
  CommandTurn?: CommandTurnContext;
};
type RuntimeMediaContextKey = "MediaPath" | "MediaUrl" | "MediaType" | "MediaDir" | "MediaPaths" | "MediaUrls" | "MediaTypes" | "MediaWorkspaceDir" | "MediaTranscribedIndexes" | "MediaStaged";
/** Internal inbound context; legacy media fields exist only on the shipped SDK adapter. */
type RuntimeMsgContext = Omit<MsgContext, RuntimeMediaContextKey>;
type FinalizedRuntimeMsgContext = Omit<RuntimeMsgContext, "CommandAuthorized" | keyof CanonicalInboundText> & CanonicalInboundText & {
  CommandAuthorized: boolean;
  CommandTurn?: CommandTurnContext;
};
type NonTemplateContextKey = "ConversationAvatar";
type TemplateContext = Omit<RuntimeMsgContext, NonTemplateContextKey> & {
  BodyStripped?: string;
  SessionId?: string;
  IsNewSession?: string;
  /** Local path for the attachment currently being processed. */
  AttachmentPath?: string;
  /** Original URL/reference for the attachment currently being processed. */
  AttachmentUrl?: string;
  /** MIME content type for the attachment currently being processed. */
  AttachmentContentType?: string;
  /** Directory containing AttachmentPath. */
  AttachmentDir?: string;
  /** Stable zero-based source fact index for the attachment currently being processed. */
  AttachmentIndex?: number;
  /** @deprecated Use AttachmentPath. */
  MediaPath?: string;
  /** @deprecated Use AttachmentUrl. */
  MediaUrl?: string;
  /** @deprecated Use AttachmentContentType. */
  MediaType?: string;
  /** @deprecated Use AttachmentDir. */
  MediaDir?: string;
};
//#endregion
export { CronScheduledToolPolicy as $, resolveOutboundMediaUrls as A, GatewayClientMode as At, CliSessionBinding as B, UserTurnTranscriptRecorder as C, PromptImageOrderEntry as Ct, countOutboundMedia as D, SessionCreatedVia as Dt, SendableOutboundReplyParts as E, SessionCreatedActor as Et, AGENT_RUN_RESTART_ABORT_STOP_REASON as F, SessionDeliveryState as G, InternalSessionEntry as H, AGENT_RUN_SUPERSEDED_STOP_REASON as I, SessionPluginJsonValue as J, SessionEntry as K, AgentRunTimeoutPhase as L, ExecutionIdentityAdmissionFacts as M, ProviderRefusalReview as Mt, ExecutionIdentityAdmissionToken as N, hasOutboundMedia as O, HookExternalContentSource as Ot, AGENT_RUN_ABORTED_STOP_REASON as P, CronScheduledToolCallerOrigin as Q, ProviderReviewAcknowledgment as R, UserTurnTranscriptAnnotation as S, PluginHookChannelSenderContext as St, OutboundPayloadPlan as T, InboundEventKind as Tt, SessionChatType as U, GroupKeyResolution as V, SessionContextBudgetStatus as W, SessionToolOverrides as X, SessionScope as Y, SessionSystemPromptReport as Z, TaskSuggestionDeliveryMode as _, isNativeCommandTurn as _t, InboundSourceModality as a, TranscriptEvent as at, UserTurnInput as b, PluginHookChannelChatContext as bt, OriginatingChannelType as c, TranscriptTurnBoundary as ct, SupplementalContextFacts as d, ResolvedGroupThreadConfig as dt, CronToolsAllowExecTarget as et, TemplateContext as f, CommandTurnContext as ft, PartialReplyPayload as g, isExplicitCommandTurn as gt, GetReplyOptions as h, isAuthorizedTextSlashCommandTurn as ht, FinalizedRuntimeMsgContext as i, SessionTranscriptRuntimeTarget as it, resolveSendableOutboundReplyParts as j, GatewayClientName as jt, hasOutboundText as k, GATEWAY_CLIENT_IDS as kt, RuntimeMsgContext as l, ResolvedSessionMaintenanceConfigInput as lt, BlockReplyContext as m, createCommandTurnContext as mt, ChannelStructuredContextEntry as n, SessionTranscriptAccessScope as nt, MentionSource as o, TranscriptEntryAnchor as ot, UntrustedStructuredContextEntry as p, CommandTurnKind as pt, SessionOrigin as q, FinalizedMsgContext as r, SessionTranscriptReadScope as rt, MsgContext as s, TranscriptTurnAdmission as st, CanonicalInboundText as t, CronToolsAllowExecTargetRequirement as tt, SessionTranscriptContext as u, GroupThreadMentionFacts as ut, TurnAdoptionLifecycle as v, isTextSlashCommandTurn as vt, TranscriptSenderIdentity as w, GatewayUiCommandTarget as wt, UserTurnTranscriptAdmissionReceipt as x, PluginHookChannelContext as xt, PersistedUserTurnMessage as y, InputProvenance as yt, AmbientTranscriptWatermark as z };