// Manages reply session records, labels, ids, and route persistence.
import crypto from "node:crypto";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import { retireSessionMcpRuntime } from "../../agents/agent-bundle-mcp-tools.js";
import { resolveSessionAgentId } from "../../agents/agent-scope.js";
import { clearBootstrapSnapshotOnSessionRollover } from "../../agents/bootstrap-cache.js";
import { getCliSessionBinding } from "../../agents/cli-session.js";
import { resetRegisteredAgentHarnessSessions } from "../../agents/harness/registry.js";
import { cleanupBrowserSessionsForLifecycleEnd } from "../../browser-lifecycle-cleanup.js";
import { normalizeChatType } from "../../channels/chat-type.js";
import { resolveGroupSessionKey } from "../../config/sessions/group.js";
import {
  hasTerminalMainSessionTranscriptNewerThanRegistry,
  resolveSessionLifecycleTimestamps,
  resolveSessionWorkStartError,
} from "../../config/sessions/lifecycle.js";
import { canonicalizeMainSessionAlias } from "../../config/sessions/main-session.js";
import { deriveSessionMetaPatch } from "../../config/sessions/metadata.js";
import { resolveSessionTranscriptPath, resolveStorePath } from "../../config/sessions/paths.js";
import { resolveResetPreservedSelection } from "../../config/sessions/reset-preserved-selection.js";
import {
  evaluateSessionFreshness,
  resolveChannelResetConfig,
  resolveSessionResetPolicy,
  resolveSessionResetType,
  resolveThreadFlag,
  type SessionFreshness,
} from "../../config/sessions/reset.js";
import {
  commitReplySessionInitialization,
  loadReplySessionInitializationSnapshot,
} from "../../config/sessions/session-accessor.js";
import { resolveSessionKey } from "../../config/sessions/session-key.js";
import { resolveMaintenanceConfigFromInput } from "../../config/sessions/store-maintenance.js";
import { runExclusiveSessionStoreWrite } from "../../config/sessions/store-writer.js";
import { parseSessionThreadInfoFast } from "../../config/sessions/thread-info.js";
import {
  DEFAULT_RESET_TRIGGERS,
  type GroupKeyResolution,
  type SessionEntry,
  type SessionScope,
} from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { TtsAutoMode } from "../../config/types.tts.js";
import {
  forgetActiveSessionForShutdown,
  noteActiveSessionForShutdown,
} from "../../gateway/active-sessions-shutdown-tracker.js";
import { isDevMode } from "../../globals.js";
import { getSessionBindingService } from "../../infra/outbound/session-binding-service.js";
import { deliverSessionMaintenanceWarning } from "../../infra/session-maintenance-warning.js";
import { createSubsystemLogger } from "../../logging/subsystem.js";
import { getGlobalHookRunner } from "../../plugins/hook-runner-global.js";
import type { PluginHookSessionEndReason } from "../../plugins/hook-types.js";
import {
  buildAgentMainSessionKey,
  isAcpSessionKey,
  normalizeMainKey,
} from "../../routing/session-key.js";
import { isInterSessionInputProvenance } from "../../sessions/input-provenance.js";
import {
  SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
  interruptSessionWorkAdmissions,
  runExclusiveSessionLifecycleMutation,
} from "../../sessions/session-lifecycle-admission.js";
import {
  normalizeDeliveryChannelRoute,
  normalizeSessionDeliveryFields,
} from "../../utils/delivery-context.shared.js";
import { resolveCommandAuthorization } from "../command-auth.js";
import { resolveCommandTurnTargetSessionKey } from "../command-turn-context.js";
import { normalizeCommandBody } from "../commands-registry.js";
import type { MsgContext, TemplateContext } from "../templating.js";
import { resolveEffectiveResetTargetSessionKey } from "./acp-reset-target.js";
import { parseSoftResetCommand } from "./commands-reset-mode.js";
import { resolveConversationBindingContextFromMessage } from "./conversation-binding-input.js";
import { normalizeInboundTextNewlines } from "./inbound-text.js";
import { stripMentions, stripStructuralPrefixes } from "./mentions.js";
import { replyRunRegistry } from "./reply-run-registry.js";
import { isResetAuthorizedForContext } from "./reset-authorization.js";
import { resolveRuntimePolicySessionKey } from "./runtime-policy-session-key.js";
import {
  maybeRetireLegacyMainDeliveryRoute,
  resolveLastChannelRaw,
  resolveLastToRaw,
} from "./session-delivery.js";
import {
  createReplySessionEntryHandle,
  type ReplySessionEntryHandle,
} from "./session-entry-handle.js";
import { buildSessionEndHookPayload, buildSessionStartHookPayload } from "./session-hooks.js";
import { prepareReplySessionParentFork } from "./session-parent-fork-prepare.js";
import { clearSessionResetRuntimeState } from "./session-reset-cleanup.js";

const log = createSubsystemLogger("session-init");

function stripThreadFromSessionRoute(route: SessionEntry["route"]): SessionEntry["route"] {
  const normalized = normalizeDeliveryChannelRoute(route);
  if (!normalized?.thread) {
    return normalized;
  }
  const { thread: _drop, ...withoutThread } = normalized;
  return Object.keys(withoutThread).length > 0 ? withoutThread : undefined;
}

type ReplySessionEndReason = Extract<
  PluginHookSessionEndReason,
  "new" | "reset" | "idle" | "daily" | "unknown"
>;

function stripThreadIdFromDeliveryContext(
  context: SessionEntry["deliveryContext"],
): SessionEntry["deliveryContext"] {
  if (!context || context.threadId == null || context.threadId === "") {
    return context;
  }
  const { threadId: _threadId, ...rest } = context;
  return Object.keys(rest).length > 0 ? rest : undefined;
}

function stripThreadIdFromOrigin(origin: SessionEntry["origin"]): SessionEntry["origin"] {
  if (!origin || origin.threadId == null || origin.threadId === "") {
    return origin;
  }
  const { threadId: _threadId, ...rest } = origin;
  return Object.keys(rest).length > 0 ? rest : undefined;
}

function resolveExplicitSessionEndReason(matchedResetTriggerLower?: string): ReplySessionEndReason {
  return matchedResetTriggerLower === "/reset" ? "reset" : "new";
}

function resolveSessionDefaultAccountId(params: {
  cfg: OpenClawConfig;
  channelRaw?: string;
  accountIdRaw?: string;
  persistedLastAccountId?: string;
}): string | undefined {
  const explicit = normalizeOptionalString(params.accountIdRaw);
  if (explicit) {
    return explicit;
  }
  const persisted = normalizeOptionalString(params.persistedLastAccountId);
  if (persisted) {
    return persisted;
  }
  const channel = normalizeOptionalLowercaseString(params.channelRaw);
  if (!channel) {
    return undefined;
  }
  const channels = params.cfg.channels as Record<string, { defaultAccount?: unknown } | undefined>;
  const configuredDefault = channels?.[channel]?.defaultAccount;
  return normalizeOptionalString(configuredDefault);
}

function resolveStaleSessionEndReason(params: {
  entry: SessionEntry | undefined;
  freshness?: SessionFreshness;
}): ReplySessionEndReason | undefined {
  return params.entry ? params.freshness?.staleReason : undefined;
}

function hasProviderOwnedSession(entry: SessionEntry | undefined): boolean {
  const provider = normalizeOptionalString(entry?.providerOverride ?? entry?.modelProvider);
  return Boolean(provider && getCliSessionBinding(entry, provider));
}

// FIX-05: default auto-compact instructions for the dev-mode daily-boundary substitution
// (see devModeAutoCompact in initSessionStateAttemptLocked below). Value-only override via
// OPENCLAW_DEV_MODE_AUTO_COMPACT_PROMPT -- never a feature gate. The feature itself only
// requires OPENCLAW_DEV_MODE=1; per Ariel's rule, no secondary activation flag is added.
const DEV_MODE_AUTO_COMPACT_DEFAULT_PROMPT =
  "this is auto compact, so try to remember everything the user talked with you other than daily news or security or hub notifications";

function resolveDevModeAutoCompactPrompt(): string {
  return (
    normalizeOptionalString(process.env.OPENCLAW_DEV_MODE_AUTO_COMPACT_PROMPT) ??
    DEV_MODE_AUTO_COMPACT_DEFAULT_PROMPT
  );
}

function isRecoverableTerminalSessionStatus(status: SessionEntry["status"] | undefined): boolean {
  return status === "failed" || status === "timeout" || status === "killed";
}

function recoverTerminalSessionEntryForVisibleTurn(entry: SessionEntry): SessionEntry {
  return {
    ...entry,
    status: undefined,
    startedAt: undefined,
    endedAt: undefined,
    runtimeMs: undefined,
    abortedLastRun: undefined,
  };
}

export type SessionInitResult = {
  sessionCtx: TemplateContext;
  sessionEntry: SessionEntry;
  initialSessionEntry?: SessionEntry;
  previousSessionEntry?: SessionEntry;
  sessionEntryHandle: ReplySessionEntryHandle;
  sessionStore: Record<string, SessionEntry>;
  sessionKey: string;
  sessionId: string;
  isNewSession: boolean;
  resetTriggered: boolean;
  systemSent: boolean;
  abortedLastRun: boolean;
  storePath: string;
  sessionScope: SessionScope;
  groupResolution?: GroupKeyResolution;
  isGroup: boolean;
  bodyStripped?: string;
  triggerBodyNormalized: string;
};

export type InitSessionStateParams = {
  cfg: OpenClawConfig;
  commandAuthorized: boolean;
  ctx: MsgContext;
  requestedSessionId?: string;
  resumeRequestedSession?: boolean;
  signal?: AbortSignal;
};

type InitSessionStateAttemptContext = {
  agentId: string;
  conversationBindingContext: ReturnType<typeof resolveSessionConversationBindingContext>;
  isSystemEvent: boolean;
  sessionCtxForState: MsgContext;
  storePath: string;
};

type InitSessionStateAttemptOutcome =
  | { kind: "complete"; result: SessionInitResult }
  | { kind: "lifecycle-mutation"; sessionId: string; sessionKey: string };

function resolveSessionConversationBindingContext(
  cfg: OpenClawConfig,
  ctx: MsgContext,
): {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
} | null {
  const bindingContext = resolveConversationBindingContextFromMessage({
    cfg,
    ctx,
  });
  if (!bindingContext) {
    return null;
  }
  return {
    channel: bindingContext.channel,
    accountId: bindingContext.accountId,
    conversationId: bindingContext.conversationId,
    ...(bindingContext.parentConversationId
      ? { parentConversationId: bindingContext.parentConversationId }
      : {}),
  };
}

function resolveBoundConversationSessionKey(params: {
  cfg: OpenClawConfig;
  ctx: MsgContext;
  bindingContext?: {
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
  } | null;
}): string | undefined {
  const bindingContext =
    params.bindingContext === undefined
      ? resolveSessionConversationBindingContext(params.cfg, params.ctx)
      : params.bindingContext;
  if (!bindingContext) {
    return undefined;
  }
  const binding = getSessionBindingService().resolveByConversation({
    channel: bindingContext.channel,
    accountId: bindingContext.accountId,
    conversationId: bindingContext.conversationId,
    ...(bindingContext.parentConversationId
      ? { parentConversationId: bindingContext.parentConversationId }
      : {}),
  });
  if (!binding?.targetSessionKey) {
    return undefined;
  }
  getSessionBindingService().touch(binding.bindingId);
  return binding.targetSessionKey;
}

function resolveInitSessionStateAttemptContext(
  params: InitSessionStateParams,
): InitSessionStateAttemptContext {
  const { cfg, ctx } = params;
  // Automated system events must not reset sessions or retarget conversation bindings.
  const isSystemEvent =
    ctx.Provider === "heartbeat" || ctx.Provider === "cron-event" || ctx.Provider === "exec-event";
  const conversationBindingContext = isSystemEvent
    ? null
    : resolveSessionConversationBindingContext(cfg, ctx);
  // Slash/menu commands may arrive on a transport session while targeting the chat session.
  // Prefer explicit command target before binding lookup so command mutations land there.
  const commandTargetSessionKey = resolveCommandTurnTargetSessionKey(ctx);
  const targetSessionKey =
    commandTargetSessionKey ??
    resolveBoundConversationSessionKey({
      cfg,
      ctx,
      bindingContext: conversationBindingContext,
    });
  const sessionCtxForState =
    targetSessionKey && targetSessionKey !== ctx.SessionKey
      ? { ...ctx, SessionKey: targetSessionKey }
      : ctx;
  const agentId = resolveSessionAgentId({
    sessionKey: sessionCtxForState.SessionKey,
    config: cfg,
    fallbackAgentId: sessionCtxForState.AgentId,
  });
  return {
    agentId,
    conversationBindingContext,
    isSystemEvent,
    sessionCtxForState,
    storePath: resolveStorePath(cfg.session?.store, { agentId }),
  };
}

/** Initializes or reuses the reply session state for one inbound turn. */
export async function initSessionState(params: InitSessionStateParams): Promise<SessionInitResult> {
  return await initSessionStateAttempt(params, false);
}

async function initSessionStateAttempt(
  params: InitSessionStateParams,
  staleSnapshotRetried: boolean,
): Promise<SessionInitResult> {
  const attemptContext = resolveInitSessionStateAttemptContext(params);
  // Guarded revision checks only serialize correctly when the snapshot and
  // commit share the same writer lane.
  const attempt = await runExclusiveSessionStoreWrite(
    attemptContext.storePath,
    async () =>
      await initSessionStateAttemptLocked(params, attemptContext, staleSnapshotRetried, undefined),
  );
  if (attempt.kind === "complete") {
    return attempt.result;
  }

  let rollover = attempt;
  while (true) {
    const candidate = rollover;
    const identities = [candidate.sessionKey, candidate.sessionId];
    let preparedOutcome: InitSessionStateAttemptOutcome | undefined;
    // Drain foreign owners before the rollover takes the writer lane. Holding
    // that lane while waiting would deadlock owners that release after a write.
    const outcome = await runExclusiveSessionLifecycleMutation({
      scope: attemptContext.storePath,
      identities,
      signal: params.signal,
      prepare: async () => {
        // A queued rollover may change identity or become obsolete. Recheck
        // before interrupting, then reacquire any refreshed identity first.
        const revalidated = await runExclusiveSessionStoreWrite(
          attemptContext.storePath,
          async () => await initSessionStateAttemptLocked(params, attemptContext, false, undefined),
        );
        if (
          revalidated.kind === "complete" ||
          revalidated.sessionKey !== candidate.sessionKey ||
          revalidated.sessionId !== candidate.sessionId
        ) {
          preparedOutcome = revalidated;
          return;
        }
        const drained = await interruptSessionWorkAdmissions({
          scope: attemptContext.storePath,
          identities,
          timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
        });
        if (!drained) {
          throw new Error(
            `timed out draining work before reply session rollover: ${candidate.sessionKey}`,
          );
        }
      },
      run: async () => {
        if (preparedOutcome) {
          return preparedOutcome;
        }
        // Interrupted owners can rebind while draining. The locked attempt
        // must match this exact fenced identity before any rollover side effect.
        return await runExclusiveSessionStoreWrite(
          attemptContext.storePath,
          async () => await initSessionStateAttemptLocked(params, attemptContext, false, candidate),
        );
      },
    });
    if (outcome.kind === "complete") {
      return outcome.result;
    }
    rollover = outcome;
  }
}

async function initSessionStateAttemptLocked(
  params: InitSessionStateParams,
  attemptContext: InitSessionStateAttemptContext,
  staleSnapshotRetried: boolean,
  lifecycleMutationIdentity: { sessionId: string; sessionKey: string } | undefined,
): Promise<InitSessionStateAttemptOutcome> {
  const { ctx, cfg, commandAuthorized } = params;
  const { agentId, conversationBindingContext, isSystemEvent, sessionCtxForState, storePath } =
    attemptContext;
  const sessionCfg = cfg.session;
  const maintenanceConfig = resolveMaintenanceConfigFromInput(sessionCfg?.maintenance);
  const mainKey = normalizeMainKey(sessionCfg?.mainKey);
  const groupResolution = resolveGroupSessionKey(sessionCtxForState) ?? undefined;
  const resetTriggers = sessionCfg?.resetTriggers?.length
    ? sessionCfg.resetTriggers
    : DEFAULT_RESET_TRIGGERS;
  const sessionScope = sessionCfg?.scope ?? "per-sender";
  const ingressTimingEnabled = process.env.OPENCLAW_DEBUG_INGRESS_TIMING === "1";

  let sessionEntry: SessionEntry;

  let sessionId: string | undefined;
  let isNewSession = false;
  let bodyStripped: string | undefined;
  let systemSent;
  let abortedLastRun;
  let resetTriggered = false;

  let persistedThinking: string | undefined;
  let persistedVerbose: string | undefined;
  let persistedTrace: string | undefined;
  let persistedReasoning: string | undefined;
  let persistedTtsAuto: TtsAutoMode | undefined;
  let persistedResponseUsage: SessionEntry["responseUsage"];
  let persistedModelOverride: string | undefined;
  let persistedProviderOverride: string | undefined;
  let persistedModelOverrideSource: SessionEntry["modelOverrideSource"];
  let persistedAuthProfileOverride: string | undefined;
  let persistedAuthProfileOverrideSource: SessionEntry["authProfileOverrideSource"];
  let persistedAuthProfileOverrideCompactionCount: number | undefined;
  let persistedLabel: string | undefined;
  let persistedSpawnedBy: SessionEntry["spawnedBy"];
  let persistedSpawnedWorkspaceDir: SessionEntry["spawnedWorkspaceDir"];
  let persistedSpawnedCwd: SessionEntry["spawnedCwd"];
  let persistedParentSessionKey: SessionEntry["parentSessionKey"];
  let persistedForkedFromParent: SessionEntry["forkedFromParent"];
  let persistedSpawnDepth: SessionEntry["spawnDepth"];
  let persistedSubagentRole: SessionEntry["subagentRole"];
  let persistedSubagentControlScope: SessionEntry["subagentControlScope"];
  let persistedDisplayName: SessionEntry["displayName"];

  const normalizedChatType = normalizeChatType(ctx.ChatType);
  const isGroup =
    normalizedChatType != null && normalizedChatType !== "direct" ? true : Boolean(groupResolution);
  // Prefer CommandBody/RawBody (clean message) for command detection; fall back
  // to Body which may contain structural context (history, sender labels).
  const commandSource = ctx.BodyForCommands ?? ctx.CommandBody ?? ctx.RawBody ?? ctx.Body ?? "";
  // IMPORTANT: do NOT lowercase the entire command body.
  // Users often pass case-sensitive arguments (e.g. filesystem paths on Linux).
  // Command parsing downstream lowercases only the command token for matching.
  // FIX-05: reassigned below (see devModeAutoCompact) to a synthetic "/compact <prompt>"
  // trigger body when the daily boundary passed with no reset policy configured, so the
  // existing /compact command handler pipeline drives compaction, memory flush, and the
  // dev-mode greet-after-compact warm-up without any new command-dispatch machinery.
  let triggerBodyNormalized = stripStructuralPrefixes(commandSource).trim();

  // Use CommandBody/RawBody for reset trigger matching (clean message without structural context).
  const rawBody = commandSource;
  const trimmedBody = rawBody.trim();
  const resetAuthorized = isResetAuthorizedForContext({
    ctx,
    cfg,
    commandAuthorized,
  });
  // Timestamp/message prefixes (e.g. "[Dec 4 17:35] ") are added by the
  // web inbox before we get here. They prevented reset triggers like "/new"
  // from matching, so strip structural wrappers when checking for resets.
  const strippedForReset = isGroup
    ? stripMentions(triggerBodyNormalized, ctx, cfg, agentId)
    : triggerBodyNormalized;
  const normalizedResetBody = normalizeCommandBody(strippedForReset, {
    botUsername: ctx.BotUsername,
  });
  const softReset = parseSoftResetCommand(normalizedResetBody);
  // Reset triggers are configured as lowercased commands (e.g. "/new"), but users may type
  // "/NEW" etc. Match case-insensitively while keeping the original casing for any stripped body.
  const trimmedBodyLower = normalizeLowercaseStringOrEmpty(trimmedBody);
  const strippedForResetLower = normalizeLowercaseStringOrEmpty(normalizedResetBody);
  let matchedResetTriggerLower: string | undefined;

  for (const trigger of resetTriggers) {
    if (!trigger) {
      continue;
    }
    if (!resetAuthorized) {
      break;
    }
    const triggerLower = normalizeLowercaseStringOrEmpty(trigger);
    if (trimmedBodyLower === triggerLower || strippedForResetLower === triggerLower) {
      isNewSession = true;
      bodyStripped = "";
      resetTriggered = true;
      matchedResetTriggerLower = triggerLower;
      break;
    }
    const triggerPrefixLower = `${triggerLower} `;
    if (
      !softReset.matched &&
      (trimmedBodyLower.startsWith(triggerPrefixLower) ||
        strippedForResetLower.startsWith(triggerPrefixLower))
    ) {
      isNewSession = true;
      bodyStripped = normalizedResetBody.slice(trigger.length).trimStart();
      resetTriggered = true;
      matchedResetTriggerLower = triggerLower;
      break;
    }
  }

  // Canonicalize so the written key matches what all read paths produce.
  // resolveSessionKey uses DEFAULT_AGENT_ID="main"; the configured default
  // agent may differ, causing key mismatch and orphaned sessions (#29683).
  const sessionKey: string = canonicalizeMainSessionAlias({
    cfg,
    agentId,
    sessionKey: resolveSessionKey(sessionScope, sessionCtxForState, mainKey),
  });
  // CRITICAL: Skip cache to ensure fresh data when resolving session identity.
  // Stale cache (especially with multiple gateway processes or on Windows where
  // mtime granularity may miss rapid writes) can cause incorrect sessionId
  // generation, leading to orphaned transcript files. See #17971.
  const sessionStoreLoadStartMs = ingressTimingEnabled ? Date.now() : 0;
  const initializationSnapshot = loadReplySessionInitializationSnapshot({
    storePath,
    sessionKey,
  });
  if (ingressTimingEnabled) {
    log.info(
      `session-init store-load agent=${agentId} session=${sessionCtxForState.SessionKey ?? "(no-session)"} ` +
        `elapsedMs=${Date.now() - sessionStoreLoadStartMs} path=${storePath}`,
    );
  }
  const retiredLegacyMainDelivery = maybeRetireLegacyMainDeliveryRoute({
    sessionCfg,
    sessionKey,
    legacyMain: initializationSnapshot.readEntry(
      buildAgentMainSessionKey({
        agentId,
        mainKey,
      }),
    ),
    agentId,
    mainKey,
    isGroup,
    ctx,
  });
  const entry = initializationSnapshot.currentEntry;
  const archivedSessionError = resolveSessionWorkStartError(sessionKey, entry);
  if (archivedSessionError) {
    throw new Error(archivedSessionError);
  }
  const now = Date.now();
  const isThread = resolveThreadFlag({
    sessionKey,
    messageThreadId: ctx.MessageThreadId,
    threadLabel: ctx.ThreadLabel,
    threadStarterBody: ctx.ThreadStarterBody,
    parentSessionKey: ctx.ParentSessionKey,
  });
  const resetType = resolveSessionResetType({ sessionKey, isGroup, isThread });
  const channelReset = resolveChannelResetConfig({
    sessionCfg,
    channel:
      groupResolution?.channel ??
      (ctx.OriginatingChannel as string | undefined) ??
      ctx.Surface ??
      ctx.Provider,
  });
  const resetPolicy = resolveSessionResetPolicy({
    sessionCfg,
    resetType,
    resetOverride: channelReset,
  });
  const canReuseExistingEntry =
    Boolean(entry?.sessionId) &&
    typeof entry?.updatedAt === "number" &&
    Number.isFinite(entry.updatedAt);
  const requestedSessionId = params.requestedSessionId?.trim() || undefined;
  const requestedCurrentSession = Boolean(
    requestedSessionId && entry?.sessionId && entry.sessionId === requestedSessionId,
  );
  // Control UI sends sessionId on ordinary sends too, so only the one-shot reconnect
  // resume signal is allowed to suppress configured idle/daily rollover.
  const reconnectResumeRequested =
    params.resumeRequestedSession === true && requestedCurrentSession;
  // FIX-05: provider-owned (CLI) sessions keep their existing never-implicitly-expire
  // behavior. Dev-mode sessions with no configured reset policy no longer force
  // `{fresh: true}` here -- devModeAutoCompact below needs the real staleness result to
  // detect the daily boundary and substitute an in-place compaction for the reset.
  const skipImplicitExpiry = resetPolicy.configured !== true && hasProviderOwnedSession(entry);
  const lifecycleTimestamps = resolveSessionLifecycleTimestamps({
    entry,
    agentId,
    storePath,
  });
  const entryFreshness = entry
    ? skipImplicitExpiry
      ? ({ fresh: true } satisfies SessionFreshness)
      : evaluateSessionFreshness({
          updatedAt: entry.updatedAt,
          sessionStartedAt: lifecycleTimestamps.sessionStartedAt,
          lastInteractionAt: lifecycleTimestamps.lastInteractionAt,
          now,
          policy: resetPolicy,
        })
    : undefined;
  const softResetAllowed =
    softReset.matched &&
    resetAuthorized &&
    !isAcpSessionKey(
      resolveEffectiveResetTargetSessionKey({
        cfg,
        channel: conversationBindingContext?.channel,
        accountId: conversationBindingContext?.accountId,
        conversationId: conversationBindingContext?.conversationId,
        parentConversationId: conversationBindingContext?.parentConversationId,
        activeSessionKey: sessionKey,
        allowNonAcpBindingSessionKey: false,
        skipConfiguredFallbackWhenActiveSessionNonAcp: false,
      }) ?? "",
    );
  const terminalMainTranscriptNewerThanRegistry =
    !isSystemEvent &&
    (await hasTerminalMainSessionTranscriptNewerThanRegistry({
      entry,
      sessionScope,
      sessionKey,
      agentId,
      mainKey,
      storePath,
    }));
  const recoverTerminalVisibleEntry =
    canReuseExistingEntry &&
    !isSystemEvent &&
    !resetTriggered &&
    (entryFreshness?.fresh ?? false) &&
    isRecoverableTerminalSessionStatus(entry?.status);
  // FIX-05: dev-mode substitutes an in-place compaction for the daily-boundary reset when
  // no reset policy is configured (Ariel: "if no reset session value set DO NOT new session
  // but instead compact session" -- an absolute rule: the session must NEVER be hard-reset
  // on this path, for anyone, in any outcome). Keeping the entry "fresh" here (folded into
  // freshEntry below) means no new session is minted; the trigger body is rewritten to a
  // synthetic "/compact <prompt>" command below so the existing /compact command handler
  // (commands-compact.ts) drives everything: the forced memory flush (FIX-06,
  // runDevModeCommandMemoryFlush), the actual compaction with our custom instructions, and
  // then (see the DevModeAutoCompact marker on sessionCtx below) a continuation of the turn
  // with the user's real message. Excludes explicit /new, /reset, soft reset (which has its
  // own freshEntry-preserving arm below), system/heartbeat events (ditto, its own arm), and
  // provider-owned (CLI) sessions (protected earlier by skipImplicitExpiry, never go stale
  // at all under this policy) -- none of those exclusions can fall through to a hard reset;
  // each is independently kept fresh by a mechanism that predates this feature.
  const devModeAutoCompactEligible =
    isDevMode() &&
    resetPolicy.configured !== true &&
    !hasProviderOwnedSession(entry) &&
    !resetTriggered &&
    !softReset.matched &&
    !isSystemEvent &&
    canReuseExistingEntry &&
    entryFreshness?.fresh === false &&
    entryFreshness.staleReason === "daily" &&
    !terminalMainTranscriptNewerThanRegistry;
  // FIX-05: only actually substitute the compaction (rewrite the trigger body, set the
  // DevModeAutoCompact marker, advance sessionStartedAt) when the current sender would be
  // authorized to run /compact themselves -- handleCompactCommand (commands-compact.ts)
  // silently drops /compact from an unauthorized sender (`{ shouldContinue: false }`, no
  // reply), and that must not cost them their answer. Mirrors the exact predicate
  // CommandContext.isAuthorizedSender is built from (see commands-context.ts's
  // buildCommandContext / resolveCommandAuthorization); only evaluated once the cheaper
  // checks above already narrowed this down to "would otherwise trigger the daily-boundary
  // substitution". Deliberately NOT used for freshEntry below -- session preservation is
  // unconditional on eligibility (see devModeAutoCompactEligible in the freshEntry OR-chain),
  // independent of sender authorization; only the compaction attempt itself is gated on it.
  // An unauthorized sender is answered normally in the untouched, still-fresh session; an
  // authorized sender's next message picks up the auto-compact.
  const devModeAutoCompact =
    devModeAutoCompactEligible &&
    resolveCommandAuthorization({ ctx, cfg, commandAuthorized }).isAuthorizedSender;
  if (devModeAutoCompact) {
    // Only the command-matching / instruction-extraction surface is rewritten here.
    // sessionCtx.BodyStripped/BodyForAgent (see sessionCtx construction below) are left
    // holding the user's real message -- handleCompactCommand (commands-compact.ts) reads
    // them back via the DevModeAutoCompact marker to continue the turn with what the user
    // actually asked once compaction/memory-flush finish, instead of losing it or (for a
    // human-typed /compact) showing the manual greet-after-compact prompt.
    triggerBodyNormalized = `/compact ${resolveDevModeAutoCompactPrompt()}`;
  }
  const freshEntry =
    (isSystemEvent && canReuseExistingEntry) ||
    (((reconnectResumeRequested && canReuseExistingEntry) ||
      recoverTerminalVisibleEntry ||
      (entryFreshness?.fresh ?? false) ||
      // FIX-05: eligibility (not sender authorization) governs session preservation --
      // an unauthorized sender must never trigger a hard reset just because they happened
      // to be the first message after the daily boundary. See devModeAutoCompact above for
      // why the *compaction itself* stays gated on authorization while this does not.
      devModeAutoCompactEligible ||
      (softResetAllowed && canReuseExistingEntry)) &&
      !terminalMainTranscriptNewerThanRegistry);
  const activeReplyOperation = replyRunRegistry.get(sessionKey);
  const deferImplicitRolloverForActiveRun =
    !resetTriggered &&
    !freshEntry &&
    canReuseExistingEntry &&
    entryFreshness?.fresh === false &&
    entryFreshness.staleReason != null &&
    activeReplyOperation?.phase !== "queued" &&
    activeReplyOperation?.sessionId === entry?.sessionId;
  // Implicit daily/idle rollover must not rename a transcript while that exact
  // session's active writer is still running. Admission will steer/wait/queue;
  // queued pre-dispatch reservations still let the current turn roll over.
  const effectiveFreshEntry = deferImplicitRolloverForActiveRun ? true : freshEntry;
  // Capture the current session entry before any reset so its transcript can be
  // archived afterward.  We need to do this for both explicit resets (/new, /reset)
  // and for scheduled/daily resets where the session has become stale (!freshEntry).
  // Without this, daily-reset transcripts are left as orphaned files on disk (#35481).
  const previousSessionEntry =
    (resetTriggered || !effectiveFreshEntry) && entry ? { ...entry } : undefined;
  const previousSessionEndReason = resetTriggered
    ? resolveExplicitSessionEndReason(matchedResetTriggerLower)
    : resolveStaleSessionEndReason({
        entry,
        freshness: entryFreshness,
      });
  const lifecycleMutationMatches = Boolean(
    previousSessionEntry &&
    lifecycleMutationIdentity?.sessionKey === sessionKey &&
    lifecycleMutationIdentity.sessionId === previousSessionEntry.sessionId,
  );
  if (previousSessionEntry && !lifecycleMutationMatches) {
    return {
      kind: "lifecycle-mutation",
      sessionId: previousSessionEntry.sessionId,
      sessionKey,
    };
  }
  clearBootstrapSnapshotOnSessionRollover({
    sessionKey,
    previousSessionId: previousSessionEntry?.sessionId,
  });
  if (previousSessionEntry) {
    clearSessionResetRuntimeState([sessionKey, previousSessionEntry.sessionId], {
      activeReplySessionId: previousSessionEntry.sessionId,
    });
  }

  const recoveredTerminalEntry =
    entry && recoverTerminalVisibleEntry
      ? recoverTerminalSessionEntryForVisibleTurn(entry)
      : undefined;
  const reusableEntry = recoveredTerminalEntry ?? entry;

  if (!isNewSession && effectiveFreshEntry && canReuseExistingEntry && reusableEntry) {
    sessionId = reusableEntry.sessionId;
    systemSent = reusableEntry.systemSent ?? false;
    abortedLastRun = reusableEntry.abortedLastRun ?? false;
    persistedThinking = reusableEntry.thinkingLevel;
    persistedVerbose = reusableEntry.verboseLevel;
    persistedTrace = reusableEntry.traceLevel;
    persistedReasoning = reusableEntry.reasoningLevel;
    persistedTtsAuto = reusableEntry.ttsAuto;
    persistedResponseUsage = reusableEntry.responseUsage;
    persistedModelOverride = reusableEntry.modelOverride;
    persistedProviderOverride = reusableEntry.providerOverride;
    persistedModelOverrideSource = reusableEntry.modelOverrideSource;
    persistedAuthProfileOverride = reusableEntry.authProfileOverride;
    persistedAuthProfileOverrideSource = reusableEntry.authProfileOverrideSource;
    persistedAuthProfileOverrideCompactionCount = reusableEntry.authProfileOverrideCompactionCount;
    persistedLabel = reusableEntry.label;
  } else {
    sessionId = crypto.randomUUID();
    isNewSession = true;
    systemSent = false;
    abortedLastRun = false;
    // Preserve user-driven model/auth overrides across ANY rollover that mints
    // a new session from an existing entry — explicit /new and /reset AND
    // implicit stale rollovers (daily/idle reset boundary). Auto-created
    // fallback overrides (rate-limit auth rotation, model auto-pin) are still
    // cleared by resolveResetPreservedSelection so resets return to the
    // configured default. Previously this was gated on `resetTriggered`, so a
    // user `/model` override set after the daily reset hour was silently
    // dropped on the next turn (the rollover took this branch with
    // resetTriggered === false), reverting the session to the default model
    // despite the `Model set to ... for this session` ack (#90119, #69301).
    if (entry) {
      const preservedSelection = resolveResetPreservedSelection({ entry });
      persistedModelOverride = preservedSelection.modelOverride;
      persistedProviderOverride = preservedSelection.providerOverride;
      persistedModelOverrideSource = preservedSelection.modelOverrideSource;
      persistedAuthProfileOverride = preservedSelection.authProfileOverride;
      persistedAuthProfileOverrideSource = preservedSelection.authProfileOverrideSource;
      persistedAuthProfileOverrideCompactionCount =
        preservedSelection.authProfileOverrideCompactionCount;
      // Behavior overrides carry across ANY new-session mint (explicit /new AND
      // implicit daily/idle rollover), mirroring the model/auth carry above
      // (#90119). Any persisted level is safe to forward — user `/think` or a
      // spawn-applied default (subagent-spawn-thinking.ts) — so unlike model
      // overrides these need no fallback-provenance filtering (#92562).
      persistedThinking = entry.thinkingLevel;
      persistedVerbose = entry.verboseLevel;
      persistedTrace = entry.traceLevel;
      persistedReasoning = entry.reasoningLevel;
      persistedTtsAuto = entry.ttsAuto;
      persistedResponseUsage = entry.responseUsage;
      persistedLabel = entry.label;
      persistedDisplayName = entry.displayName;
    }
    // When a reset trigger (/new, /reset) starts a new session, also rotate the
    // underlying CLI conversation and carry forward spawn lineage.
    if (resetTriggered && entry) {
      // Explicit /new and /reset should rotate the underlying CLI conversation too.
      // Keep the model/auth choice, but force the next turn to mint a fresh CLI binding.
      persistedSpawnedBy = entry.spawnedBy;
      persistedSpawnedWorkspaceDir = entry.spawnedWorkspaceDir;
      persistedSpawnedCwd = entry.spawnedCwd;
      persistedParentSessionKey = entry.parentSessionKey;
      persistedForkedFromParent = entry.forkedFromParent;
      persistedSpawnDepth = entry.spawnDepth;
      persistedSubagentRole = entry.subagentRole;
      persistedSubagentControlScope = entry.subagentControlScope;
    }
  }

  const baseEntry = !isNewSession && effectiveFreshEntry ? reusableEntry : undefined;
  const usageFamilyKey = previousSessionEntry
    ? (previousSessionEntry.usageFamilyKey ?? sessionKey)
    : baseEntry?.usageFamilyKey;
  const usageFamilySessionIds = previousSessionEntry
    ? Array.from(
        new Set([
          ...(previousSessionEntry.usageFamilySessionIds ?? []),
          previousSessionEntry.sessionId,
          sessionId,
        ]),
      )
    : baseEntry?.usageFamilySessionIds;
  // Track the originating channel/to for announce routing (subagent announce-back).
  const originatingChannelRaw = ctx.OriginatingChannel as string | undefined;
  const isInterSession = isInterSessionInputProvenance(ctx.InputProvenance);
  // Automated heartbeat/cron/exec turns run inside the conversation session,
  // but they must not rewrite the session's remembered external delivery route.
  // Otherwise a heartbeat target like "group:..." or a synthetic sender like
  // "heartbeat" leaks into the shared session and later user replies route to
  // the wrong chat.
  const lastChannelRaw = isSystemEvent
    ? baseEntry?.lastChannel
    : resolveLastChannelRaw({
        originatingChannelRaw,
        persistedLastChannel: baseEntry?.lastChannel,
        sessionKey,
        isInterSession,
      });
  const lastToRaw = isSystemEvent
    ? baseEntry?.lastTo
    : resolveLastToRaw({
        originatingChannelRaw,
        originatingToRaw: ctx.OriginatingTo,
        toRaw: ctx.To,
        persistedLastTo: baseEntry?.lastTo,
        persistedLastChannel: baseEntry?.lastChannel,
        sessionKey,
        isInterSession,
      });
  const lastAccountIdRaw = isSystemEvent
    ? baseEntry?.lastAccountId
    : resolveSessionDefaultAccountId({
        cfg,
        channelRaw: lastChannelRaw,
        accountIdRaw: ctx.AccountId,
        persistedLastAccountId: baseEntry?.lastAccountId,
      });
  // Only fall back to persisted threadId for thread sessions. Non-thread
  // sessions (e.g. DM without topics) must not inherit a stale threadId from a
  // previous interaction that happened inside a topic/thread.
  const lastThreadIdRaw = isSystemEvent
    ? baseEntry?.lastThreadId
    : (ctx.MessageThreadId ??
      ctx.TransportThreadId ??
      (isThread ? baseEntry?.lastThreadId : undefined));
  const deliveryFields = isSystemEvent
    ? normalizeSessionDeliveryFields({
        route: isThread ? baseEntry?.route : stripThreadFromSessionRoute(baseEntry?.route),
        channel: baseEntry?.channel,
        lastChannel: baseEntry?.lastChannel,
        lastTo: baseEntry?.lastTo,
        lastAccountId: baseEntry?.lastAccountId,
        lastThreadId:
          baseEntry?.lastThreadId ??
          baseEntry?.deliveryContext?.threadId ??
          baseEntry?.origin?.threadId,
        deliveryContext: baseEntry?.deliveryContext,
      })
    : normalizeSessionDeliveryFields({
        deliveryContext: {
          channel: lastChannelRaw,
          to: lastToRaw,
          accountId: lastAccountIdRaw,
          threadId: lastThreadIdRaw,
        },
      });
  const lastChannel = deliveryFields.lastChannel ?? lastChannelRaw;
  const lastTo = deliveryFields.lastTo ?? lastToRaw;
  const lastAccountId = deliveryFields.lastAccountId ?? lastAccountIdRaw;
  const lastThreadId = deliveryFields.lastThreadId ?? lastThreadIdRaw;
  sessionEntry = {
    ...baseEntry,
    sessionId,
    updatedAt: Date.now(),
    // FIX-05: advance sessionStartedAt past the daily boundary when substituting an
    // auto-compact for the reset, exactly like a real reset would -- this is what stops
    // the session from re-triggering the auto-compact on every subsequent message today.
    sessionStartedAt: isNewSession
      ? now
      : devModeAutoCompact
        ? now
        : (baseEntry?.sessionStartedAt ?? lifecycleTimestamps.sessionStartedAt),
    lastInteractionAt: isSystemEvent ? baseEntry?.lastInteractionAt : now,
    systemSent,
    abortedLastRun: recoveredTerminalEntry ? undefined : abortedLastRun,
    // Persist previously stored thinking/verbose levels when present.
    thinkingLevel: persistedThinking ?? baseEntry?.thinkingLevel,
    verboseLevel: persistedVerbose ?? baseEntry?.verboseLevel,
    traceLevel: persistedTrace ?? baseEntry?.traceLevel,
    reasoningLevel: persistedReasoning ?? baseEntry?.reasoningLevel,
    ttsAuto: persistedTtsAuto ?? baseEntry?.ttsAuto,
    responseUsage: persistedResponseUsage ?? baseEntry?.responseUsage,
    pinnedAt: entry?.pinnedAt,
    usageFamilyKey,
    usageFamilySessionIds,
    modelOverride: persistedModelOverride ?? baseEntry?.modelOverride,
    providerOverride: persistedProviderOverride ?? baseEntry?.providerOverride,
    modelOverrideSource: persistedModelOverrideSource ?? baseEntry?.modelOverrideSource,
    authProfileOverride: persistedAuthProfileOverride ?? baseEntry?.authProfileOverride,
    authProfileOverrideSource:
      persistedAuthProfileOverrideSource ?? baseEntry?.authProfileOverrideSource,
    authProfileOverrideCompactionCount:
      persistedAuthProfileOverrideCompactionCount ?? baseEntry?.authProfileOverrideCompactionCount,
    cliSessionIds: baseEntry?.cliSessionIds,
    cliSessionBindings: baseEntry?.cliSessionBindings,
    claudeCliSessionId: baseEntry?.claudeCliSessionId,
    label: persistedLabel ?? baseEntry?.label,
    spawnedBy: persistedSpawnedBy ?? baseEntry?.spawnedBy,
    spawnedWorkspaceDir: persistedSpawnedWorkspaceDir ?? baseEntry?.spawnedWorkspaceDir,
    spawnedCwd: persistedSpawnedCwd ?? baseEntry?.spawnedCwd,
    parentSessionKey: persistedParentSessionKey ?? baseEntry?.parentSessionKey,
    forkedFromParent: persistedForkedFromParent ?? baseEntry?.forkedFromParent,
    spawnDepth: persistedSpawnDepth ?? baseEntry?.spawnDepth,
    subagentRole: persistedSubagentRole ?? baseEntry?.subagentRole,
    subagentControlScope: persistedSubagentControlScope ?? baseEntry?.subagentControlScope,
    sendPolicy: baseEntry?.sendPolicy,
    queueMode: baseEntry?.queueMode,
    queueDebounceMs: baseEntry?.queueDebounceMs,
    queueCap: baseEntry?.queueCap,
    queueDrop: baseEntry?.queueDrop,
    displayName: persistedDisplayName ?? baseEntry?.displayName,
    chatType: baseEntry?.chatType,
    channel: baseEntry?.channel,
    groupId: baseEntry?.groupId,
    subject: baseEntry?.subject,
    groupChannel: baseEntry?.groupChannel,
    space: baseEntry?.space,
    groupActivation: entry?.groupActivation,
    groupActivationNeedsSystemIntro: entry?.groupActivationNeedsSystemIntro,
    route: deliveryFields.route,
    deliveryContext: deliveryFields.deliveryContext,
    // Track originating channel for subagent announce routing.
    lastChannel,
    lastTo,
    lastAccountId,
    lastThreadId,
  };
  const metaPatch = deriveSessionMetaPatch({
    ctx: sessionCtxForState,
    sessionKey,
    existing: sessionEntry,
    groupResolution,
    skipSystemEventOrigin: isSystemEvent,
  });
  if (metaPatch) {
    sessionEntry = { ...sessionEntry, ...metaPatch };
  }
  if (isSystemEvent && !isThread) {
    sessionEntry = {
      ...sessionEntry,
      route: stripThreadFromSessionRoute(sessionEntry.route),
      lastThreadId: undefined,
      deliveryContext: stripThreadIdFromDeliveryContext(sessionEntry.deliveryContext),
      origin: stripThreadIdFromOrigin(sessionEntry.origin),
    };
  }
  if (!sessionEntry.chatType) {
    sessionEntry.chatType = "direct";
  }
  const threadLabel = normalizeOptionalString(ctx.ThreadLabel);
  if (threadLabel) {
    sessionEntry.displayName = threadLabel;
  }
  const parentSessionKey = normalizeOptionalString(ctx.ParentSessionKey);
  const alreadyForked = sessionEntry.forkedFromParent === true;
  const threadIdFromSessionKey = parseSessionThreadInfoFast(
    sessionCtxForState.SessionKey ?? sessionKey,
  ).threadId;
  const fallbackSessionFile = !sessionEntry.sessionFile
    ? resolveSessionTranscriptPath(
        sessionEntry.sessionId,
        agentId,
        ctx.MessageThreadId ?? threadIdFromSessionKey,
      )
    : undefined;
  if (isNewSession) {
    sessionEntry.compactionCount = 0;
    sessionEntry.memoryFlushCompactionCount = undefined;
    sessionEntry.memoryFlushAt = undefined;
    // Runtime model fields are persisted last-run cache, not user selection.
    // Reset must drop them so the next turn resolves current defaults or the
    // explicit providerOverride/modelOverride values preserved above.
    sessionEntry.modelProvider = undefined;
    sessionEntry.model = undefined;
    sessionEntry.fallbackNoticeSelectedModel = undefined;
    sessionEntry.fallbackNoticeActiveModel = undefined;
    sessionEntry.fallbackNoticeReason = undefined;
    sessionEntry.systemPromptReport = undefined;
    sessionEntry.memoryFlushFailureCount = undefined;
    sessionEntry.memoryFlushLastFailedAt = undefined;
    sessionEntry.memoryFlushLastFailureError = undefined;
    // Clear stale context hash so the first flush in the new session is not
    // incorrectly skipped due to a hash match with the old transcript (#30115).
    sessionEntry.memoryFlushContextHash = undefined;
    sessionEntry.startedAt = undefined;
    sessionEntry.endedAt = undefined;
    sessionEntry.runtimeMs = undefined;
    sessionEntry.status = undefined;
    // New empty transcripts have a known zero context. Parent-context forks
    // inherit history without a fresh count, so keep those explicitly unknown.
    sessionEntry.totalTokens = 0;
    sessionEntry.totalTokensFresh = true;
    sessionEntry.inputTokens = undefined;
    sessionEntry.outputTokens = undefined;
    sessionEntry.estimatedCostUsd = undefined;
    sessionEntry.cacheRead = undefined;
    sessionEntry.cacheWrite = undefined;
    sessionEntry.contextTokens = undefined;
    sessionEntry.contextBudgetStatus = undefined;
    sessionEntry.goal = undefined;
    // Skills snapshots are prompt/runtime caches. Do not preserve a stale
    // snapshot through /new; the next turn must rebuild the visible skill list.
    sessionEntry.skillsSnapshot = undefined;
  }
  // Archive old transcript so it doesn't accumulate on disk (#14869).
  const committed = await commitReplySessionInitialization({
    activeSessionKey: sessionKey,
    agentId,
    expectedRevision: initializationSnapshot.revision,
    fallbackSessionFile,
    maintenanceConfig,
    onArchiveError: (error, sourcePath) => {
      log.warn(
        `failed to archive previous session transcript ${sourcePath} for session ${previousSessionEntry?.sessionId}`,
        { error: String(error) },
      );
    },
    onMaintenanceWarning: (warning) =>
      deliverSessionMaintenanceWarning({
        cfg,
        sessionKey,
        entry: sessionEntry,
        warning,
      }),
    prepareSessionEntry: async ({ readEntry, sessionEntry: entryToCommit }) =>
      await prepareReplySessionParentFork({
        agentId,
        alreadyForked,
        parentSessionKey,
        readEntry,
        sessionEntry: entryToCommit,
        sessionKey,
        storePath,
        warn: (message) => log.warn(message),
      }),
    previousEntry: previousSessionEntry,
    retiredEntry: retiredLegacyMainDelivery,
    sessionEntry,
    sessionKey,
    snapshotEntry: initializationSnapshot.currentEntry,
    storePath,
  });
  if (!committed.ok) {
    if (!staleSnapshotRetried) {
      return await initSessionStateAttemptLocked(params, attemptContext, true, undefined);
    }
    throw new Error(`reply session initialization conflicted for ${sessionKey}`);
  }
  sessionEntry = committed.sessionEntry;
  sessionId = sessionEntry.sessionId;
  const sessionStore = committed.sessionStoreView;
  const sessionEntryHandle = createReplySessionEntryHandle({
    sessionEntry,
    sessionKey,
    sessionStore,
  });
  const previousSessionTranscript = committed.previousSessionTranscript;

  if (previousSessionEntry?.sessionId) {
    await retireSessionMcpRuntime({
      sessionId: previousSessionEntry.sessionId,
      reason: "reply-session-rollover",
      onError: (error, sessionIdLocal) => {
        log.warn(`failed to dispose bundle MCP runtime for session ${sessionIdLocal}`, {
          error: String(error),
        });
      },
    });
    await resetRegisteredAgentHarnessSessions({
      agentId,
      sessionId: previousSessionEntry.sessionId,
      sessionKey,
      sessionFile: previousSessionEntry.sessionFile,
      reason: previousSessionEndReason ?? "unknown",
    });
    // Direct-message browser tabs use a peer-scoped runtime identity even when
    // their transcript aliases main; cleanup must carry both exact keys.
    const runtimePolicySessionKey =
      resolveRuntimePolicySessionKey({ cfg, ctx: sessionCtxForState, sessionKey }) ?? sessionKey;
    void cleanupBrowserSessionsForLifecycleEnd({
      cfg,
      sessionKeys: [previousSessionEntry.sessionId, sessionKey, runtimePolicySessionKey],
      onWarn: (message) => log.warn(message),
      onError: (error) => log.warn(`browser tab cleanup failed: ${String(error)}`),
    });
  }

  const sessionCtx: TemplateContext = {
    ...sessionCtxForState,
    // FIX-05: rewrite only the command-matching/instruction-extraction surface to the
    // synthetic "/compact <prompt>" body computed above. BodyStripped below is left to
    // fall back to the real user message (see its own fallback chain), and BodyForAgent
    // is left untouched entirely -- handleCompactCommand (commands-compact.ts) uses both,
    // together with the DevModeAutoCompact marker just below, to answer the user's real
    // message once compaction/memory-flush finish instead of losing it.
    ...(devModeAutoCompact
      ? {
          Body: triggerBodyNormalized,
          RawBody: triggerBodyNormalized,
          CommandBody: triggerBodyNormalized,
          BodyForCommands: triggerBodyNormalized,
          DevModeAutoCompact: true,
        }
      : {}),
    // Keep BodyStripped aligned with Body (best default for agent prompts).
    // RawBody is reserved for command/directive parsing and may omit context.
    BodyStripped: normalizeInboundTextNewlines(
      bodyStripped ??
        sessionCtxForState.BodyForAgent ??
        sessionCtxForState.Body ??
        sessionCtxForState.CommandBody ??
        sessionCtxForState.RawBody ??
        sessionCtxForState.BodyForCommands ??
        "",
    ),
    SessionId: sessionId,
    IsNewSession: isNewSession ? "true" : "false",
  };

  // Run session plugin hooks (fire-and-forget)
  const hookRunner = getGlobalHookRunner();
  if (hookRunner && isNewSession) {
    const effectiveSessionId = sessionId ?? "";

    // If replacing an existing session, fire session_end for the old one
    if (previousSessionEntry?.sessionId && previousSessionEntry.sessionId !== effectiveSessionId) {
      // The shutdown finalizer must not re-fire session_end for a session
      // that is being replaced here; forget unconditionally so the next drain
      // skips this id even when no `session_end` plugin is currently attached.
      forgetActiveSessionForShutdown(previousSessionEntry.sessionId);
      if (hookRunner.hasHooks("session_end")) {
        const payload = buildSessionEndHookPayload({
          sessionId: previousSessionEntry.sessionId,
          sessionKey,
          cfg,
          reason: previousSessionEndReason,
          sessionFile: previousSessionTranscript.sessionFile,
          transcriptArchived: previousSessionTranscript.transcriptArchived,
          nextSessionId: effectiveSessionId,
        });
        void hookRunner.runSessionEnd(payload.event, payload.context).catch(() => {});
      }
    }

    // Fire session_start for the new session
    if (effectiveSessionId) {
      // Track the new session so the shutdown finalizer fires a typed
      // session_end with reason="shutdown"/"restart" if the gateway stops
      // while this session is still active (see #57790).
      noteActiveSessionForShutdown({
        cfg,
        sessionKey,
        sessionId: effectiveSessionId,
        storePath,
        sessionFile: sessionEntry?.sessionFile,
        agentId,
      });
    }
    if (hookRunner.hasHooks("session_start")) {
      const payload = buildSessionStartHookPayload({
        sessionId: effectiveSessionId,
        sessionKey,
        cfg,
        resumedFrom: previousSessionEntry?.sessionId,
      });
      void hookRunner.runSessionStart(payload.event, payload.context).catch(() => {});
    }
  }

  return {
    kind: "complete",
    result: {
      sessionCtx,
      sessionEntry,
      sessionEntryHandle,
      previousSessionEntry,
      sessionStore,
      sessionKey,
      sessionId: sessionId ?? crypto.randomUUID(),
      isNewSession,
      resetTriggered,
      systemSent,
      abortedLastRun,
      storePath,
      sessionScope,
      groupResolution,
      isGroup,
      bodyStripped,
      triggerBodyNormalized,
    },
  };
}
