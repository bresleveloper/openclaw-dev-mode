// Implements compaction commands for session context and model state.
import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "@openclaw/normalization-core/string-coerce";
import { resolveAgentDir, resolveSessionAgentId } from "../../agents/agent-scope.js";
import { resolveContextTokensForModel } from "../../agents/context.js";
import { classifyCompactionReason } from "../../agents/embedded-agent-runner/compact-reasons.js";
import { resolveAgentHarnessPolicy } from "../../agents/harness/policy.js";
import {
  OPENAI_CODEX_PROVIDER_ID,
  OPENAI_PROVIDER_ID,
  resolveContextConfigProviderForRuntime,
} from "../../agents/openai-routing.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { isDevMode, logVerbose } from "../../globals.js";
import { createLazyImportLoader } from "../../shared/lazy-promise.js";
import type { TemplateContext } from "../templating.js";
import type { CommandHandler, CommandHandlerResult } from "./commands-types.js";
import { runDevModeCommandMemoryFlush } from "./dev-mode-memory-flush.js";
import { stripMentions, stripStructuralPrefixes } from "./mentions.js";

const compactRuntimeLoader = createLazyImportLoader(() => import("./commands-compact.runtime.js"));

function loadCompactRuntime(): Promise<typeof import("./commands-compact.runtime.js")> {
  return compactRuntimeLoader.load();
}

function extractCompactInstructions(params: {
  rawBody?: string;
  ctx: import("../templating.js").MsgContext;
  cfg: OpenClawConfig;
  agentId?: string;
  isGroup: boolean;
}): string | undefined {
  const raw = stripStructuralPrefixes(params.rawBody ?? "");
  const stripped = params.isGroup
    ? stripMentions(raw, params.ctx, params.cfg, params.agentId)
    : raw;
  const trimmed = stripped.trim();
  if (!trimmed) {
    return undefined;
  }
  const lowered = normalizeLowercaseStringOrEmpty(trimmed);
  const prefix = lowered.startsWith("/compact") ? "/compact" : null;
  if (!prefix) {
    return undefined;
  }
  let rest = trimmed.slice(prefix.length).trimStart();
  if (rest.startsWith(":")) {
    rest = rest.slice(1).trimStart();
  }
  return rest.length ? rest : undefined;
}

function isCompactionSkipReason(reason?: string): boolean {
  const classification = classifyCompactionReason(reason);
  // Manual /compact mirrors preflight semantics: already-small sessions are a
  // successful no-op, not a failed compaction.
  return (
    classification === "no_compactable_entries" ||
    classification === "below_threshold" ||
    classification === "already_compacted_recently"
  );
}

function formatCompactionReason(reason?: string): string | undefined {
  const text = normalizeOptionalString(reason);
  if (!text) {
    return undefined;
  }

  const classification = classifyCompactionReason(reason);
  const lower = normalizeLowercaseStringOrEmpty(reason);
  switch (classification) {
    case "no_compactable_entries":
      return "nothing compactable in this session yet";
    case "below_threshold":
      return lower.includes("already under target")
        ? "context is already under the compaction target"
        : "context is below the compaction threshold";
    case "already_compacted_recently":
      return "session was already compacted recently";
    default:
      return text;
  }
}

function resolveManualCompactContextTokenBudget(params: {
  cfg: OpenClawConfig;
  provider?: string;
  model?: string;
  agentId: string;
  sessionKey: string;
  liveContextTokens?: number;
  persistedContextTokens?: number;
}): number | undefined {
  const liveContextTokens =
    typeof params.liveContextTokens === "number" &&
    Number.isFinite(params.liveContextTokens) &&
    params.liveContextTokens > 0
      ? Math.floor(params.liveContextTokens)
      : undefined;

  const model = normalizeOptionalString(params.model);
  const provider = normalizeOptionalString(params.provider);
  if (!model || !provider) {
    return liveContextTokens ?? resolvePersistedContextTokens(params.persistedContextTokens);
  }

  const harnessPolicy = resolveAgentHarnessPolicy({
    provider,
    modelId: model,
    config: params.cfg,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
  const contextConfigProvider = resolveContextConfigProviderForRuntime({
    provider,
    runtimeId: harnessPolicy.runtime,
    config: params.cfg,
  });
  const configuredContextTokens = resolveContextTokensForModel({
    cfg: params.cfg,
    provider: contextConfigProvider,
    model: resolveManualCompactContextModelId({
      provider,
      contextConfigProvider,
      model,
    }),
    allowAsyncLoad: false,
  });
  if (typeof configuredContextTokens === "number" && configuredContextTokens > 0) {
    const configuredBudget = Math.floor(configuredContextTokens);
    return liveContextTokens !== undefined
      ? Math.min(liveContextTokens, configuredBudget)
      : configuredBudget;
  }

  if (liveContextTokens !== undefined) {
    return liveContextTokens;
  }

  return resolvePersistedContextTokens(params.persistedContextTokens);
}

function resolvePersistedContextTokens(value: number | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : undefined;
}

function resolveManualCompactContextModelId(params: {
  provider: string;
  contextConfigProvider: string;
  model: string;
}): string {
  const model = params.model.trim();
  const slashIndex = model.indexOf("/");
  if (slashIndex <= 0) {
    return model;
  }

  const modelProvider = normalizeProviderId(model.slice(0, slashIndex));
  const selectedProvider = normalizeProviderId(params.provider);
  const contextConfigProvider = normalizeProviderId(params.contextConfigProvider);
  const modelId = model.slice(slashIndex + 1).trim();
  if (!modelId) {
    return model;
  }

  if (
    modelProvider === selectedProvider ||
    modelProvider === contextConfigProvider ||
    (modelProvider === OPENAI_PROVIDER_ID && contextConfigProvider === OPENAI_CODEX_PROVIDER_ID)
  ) {
    return modelId;
  }

  return model;
}

export const handleCompactCommand: CommandHandler = async (params) => {
  const compactRequested =
    params.command.commandBodyNormalized === "/compact" ||
    params.command.commandBodyNormalized.startsWith("/compact ");
  if (!compactRequested) {
    return null;
  }
  if (!params.command.isAuthorizedSender) {
    logVerbose(
      `Ignoring /compact from unauthorized sender: ${params.command.senderId || "<unknown>"}`,
    );
    return { shouldContinue: false };
  }
  // FIX-05: session.ts sets DevModeAutoCompact on sessionCtx when it substituted this
  // /compact dispatch for the dev-mode daily-boundary reset -- the user never typed
  // /compact and has no idea compaction plumbing exists. session.ts deliberately left
  // BodyStripped/BodyForAgent holding the user's real original message (only Body/RawBody/
  // CommandBody/BodyForCommands were rewritten to the synthetic command, for matching).
  // Every early-exit and status-reply branch below must, for an auto-triggered dispatch,
  // swallow the compaction plumbing and answer that real message instead -- a failure or
  // skip must never cost the user their answer. hoisted here so both this function's early
  // bail-outs and the post-compaction result handling near the end share one definition.
  const isDevModeAutoCompact = (params.ctx as TemplateContext).DevModeAutoCompact === true;
  const originalUserBody =
    normalizeOptionalString((params.ctx as TemplateContext).BodyStripped) ??
    normalizeOptionalString(params.ctx.BodyForAgent) ??
    "";
  const continueWithOriginalMessage = (): CommandHandlerResult => {
    const mutableCtx = params.ctx as Record<string, unknown>;
    mutableCtx.Body = originalUserBody;
    mutableCtx.BodyForAgent = originalUserBody;
    mutableCtx.BodyStripped = originalUserBody;
    return { shouldContinue: true };
  };
  const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;
  if (!targetSessionEntry?.sessionId) {
    if (isDevModeAutoCompact) {
      logVerbose(`[dev-mode] auto-compact skipped (missing session id): ${params.sessionKey}`);
      return continueWithOriginalMessage();
    }
    return {
      shouldContinue: false,
      reply: {
        text: "⚙️ Compaction unavailable (missing session id).",
        isStatusNotice: true,
      },
    };
  }
  const runtime = await loadCompactRuntime();
  const sessionId = targetSessionEntry.sessionId;
  if (runtime.isEmbeddedAgentRunAbortableForCompaction(sessionId)) {
    runtime.abortEmbeddedAgentRun(sessionId);
    await runtime.waitForEmbeddedAgentRunEnd(sessionId, 15_000);
  }
  const sessionAgentId = params.sessionKey
    ? resolveSessionAgentId({ sessionKey: params.sessionKey, config: params.cfg })
    : (params.agentId ?? "main");
  const currentAgentId = params.agentId ?? "main";
  const sessionAgentDir =
    sessionAgentId === currentAgentId && params.agentDir
      ? params.agentDir
      : resolveAgentDir(params.cfg, sessionAgentId);
  const customInstructions = extractCompactInstructions({
    rawBody: params.ctx.CommandBody ?? params.ctx.RawBody ?? params.ctx.Body,
    ctx: params.ctx,
    cfg: params.cfg,
    agentId: sessionAgentId,
    isGroup: params.isGroup,
  });
  const contextTokenBudget = resolveManualCompactContextTokenBudget({
    cfg: params.cfg,
    provider: params.provider,
    model: params.model,
    agentId: sessionAgentId,
    sessionKey: params.sessionKey,
    liveContextTokens: params.contextTokens,
    persistedContextTokens: targetSessionEntry.contextTokens,
  });
  if (isDevMode()) {
    await runDevModeCommandMemoryFlush(params, targetSessionEntry);
  }
  const result = await runtime.compactEmbeddedAgentSession({
    abortSignal: params.opts?.abortSignal,
    sessionId,
    sessionKey: params.sessionKey,
    allowGatewaySubagentBinding: true,
    messageChannel: params.command.channel,
    groupId: targetSessionEntry.groupId,
    groupChannel: targetSessionEntry.groupChannel,
    groupSpace: targetSessionEntry.space,
    spawnedBy: targetSessionEntry.spawnedBy,
    senderId: params.command.senderId,
    senderName: params.ctx.SenderName,
    senderUsername: params.ctx.SenderUsername,
    senderE164: params.ctx.SenderE164,
    sessionFile: runtime.resolveSessionFilePath(
      sessionId,
      targetSessionEntry,
      runtime.resolveSessionFilePathOptions({
        agentId: sessionAgentId,
        storePath: params.storePath,
      }),
    ),
    workspaceDir: params.workspaceDir,
    agentDir: sessionAgentDir,
    config: params.cfg,
    skillsSnapshot: targetSessionEntry.skillsSnapshot,
    provider: params.provider,
    model: params.model,
    authProfileId: targetSessionEntry.authProfileOverride,
    contextTokenBudget,
    agentHarnessId:
      targetSessionEntry.sessionId === sessionId ? targetSessionEntry.agentHarnessId : undefined,
    thinkLevel: params.resolvedThinkLevel ?? (await params.resolveDefaultThinkingLevel()),
    bashElevated: {
      enabled: false,
      allowed: false,
      defaultLevel: "off",
    },
    customInstructions,
    trigger: "manual",
    ownerNumbers: params.command.ownerList.length > 0 ? params.command.ownerList : undefined,
  });

  const compactLabel =
    result.ok || isCompactionSkipReason(result.reason)
      ? result.compacted
        ? result.result?.tokensBefore != null && result.result?.tokensAfter != null
          ? `Compacted (${runtime.formatTokenCount(result.result.tokensBefore)} → ${runtime.formatTokenCount(result.result.tokensAfter)})`
          : result.result?.tokensBefore
            ? `Compacted (${runtime.formatTokenCount(result.result.tokensBefore)} before)`
            : "Compacted"
        : "Compaction skipped"
      : "Compaction failed";
  if (result.ok && result.compacted) {
    await runtime.incrementCompactionCount({
      cfg: params.cfg,
      sessionEntry: targetSessionEntry,
      sessionStore: params.sessionStore,
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      // Update token counts after compaction
      tokensAfter: result.result?.tokensAfter,
      newSessionId: result.result?.sessionId,
      newSessionFile: result.result?.sessionFile,
    });
  }
  // Use the post-compaction token count for context summary if available
  const tokensAfterCompaction = result.result?.tokensAfter;
  const totalTokens =
    result.ok && result.compacted
      ? tokensAfterCompaction
      : runtime.resolveFreshSessionTotalTokens(targetSessionEntry);
  const contextSummary = runtime.formatContextUsageShort(
    typeof totalTokens === "number" && totalTokens > 0 ? totalTokens : null,
    contextTokenBudget ?? null,
  );
  const reason = formatCompactionReason(result.reason);
  const line = reason
    ? `${compactLabel}: ${reason} • ${contextSummary}`
    : `${compactLabel} • ${contextSummary}`;
  runtime.enqueueSystemEvent(line, { sessionKey: params.sessionKey });
  // FIX-05: an auto-triggered compaction (see isDevModeAutoCompact above) always continues
  // the turn with the user's real message, regardless of outcome -- success, skip, or
  // failure. Answering what they actually asked, in the freshly-compacted session, is
  // itself the warm turn; a status reply or greeting here would either show them internal
  // plumbing they never asked about or, worse, silently eat their message. Checked before
  // the manual-path FIX-06 greet-after-compact branch below so the two never overlap.
  if (isDevModeAutoCompact) {
    if (!result.ok || !result.compacted) {
      logVerbose(`[dev-mode] auto-compact ${result.ok ? "skipped" : "failed"}: ${line}`);
    }
    return continueWithOriginalMessage();
  }
  // FIX-06 (dev-mode upgrade): upstream v2026.7.1 dropped the codexNativeCompactionStarted
  // distinction that existed at v2026.6.11 (isCodexNativeCompactionStartedResult() and its
  // compactLabel/"Codex compaction started" branch are both gone). Verified this is safe:
  // EmbeddedAgentCompactResult.compacted is a flat completion flag (types.ts) with no
  // started/pending/async variant. maybeCompactAgentHarnessSession() (harness/compaction.ts,
  // covers Codex + other native harnesses) is `await`ed synchronously inside
  // compactEmbeddedAgentSession() (compact.queued.ts ~line 311) before that function returns,
  // and compactEmbeddedAgentSession() is itself `await`ed above. The only background/deferred
  // compaction path (deferOwningContextEngineBudgetCompaction) is gated on
  // `trigger === "budget"`, but this manual /compact handler always passes `trigger: "manual"`
  // (see compactEmbeddedAgentSession call above), so that path never applies here. Bare
  // `result.ok && result.compacted` is therefore accurate for Codex-native compaction too —
  // no equivalent of the dropped started-flag gate is needed.
  if (isDevMode() && result.ok && result.compacted) {
    const greetPrompt =
      "The session context was just compacted. Briefly greet the user now. Be yourself — use your configured persona, voice, and mood. Keep it to 1-2 sentences. Do not mention compaction, technical details, internal steps, or files.";
    const mutableCtx = params.ctx as Record<string, unknown>;
    mutableCtx.Body = greetPrompt;
    mutableCtx.BodyForAgent = greetPrompt;
    mutableCtx.BodyStripped = greetPrompt;
    return { shouldContinue: true };
  }
  return {
    shouldContinue: false,
    reply: {
      text: `⚙️ ${line}`,
      isStatusNotice: true,
    },
  };
};
