import { resolveAgentDir } from "../../agents/agent-scope-config.js";
import { resolveSessionAgentId } from "../../agents/agent-scope.js";
import type { SessionEntry } from "../../config/sessions.js";
import { isDevMode, logVerbose } from "../../globals.js";
import { resolveMemoryFlushPlan } from "../../plugins/memory-state.js";
import type { TemplateContext } from "../templating.js";
import { runMemoryFlushIfNeeded } from "./agent-runner-memory.js";
import type { HandleCommandsParams } from "./commands-types.js";
import type { FollowupRun } from "./queue/types.js";
import {
  createReplyOperation,
  replyRunRegistry,
  ReplyRunAlreadyActiveError,
} from "./reply-run-registry.js";

export async function runDevModeCommandMemoryFlush(
  params: HandleCommandsParams,
  targetSessionEntry: SessionEntry | undefined,
): Promise<void> {
  if (!isDevMode()) {
    return;
  }

  const sessionId = targetSessionEntry?.sessionId;
  if (!sessionId) {
    return;
  }

  const memoryFlushPlan = resolveMemoryFlushPlan({ cfg: params.cfg });
  if (!memoryFlushPlan) {
    return;
  }

  const sessionAgentId = params.sessionKey
    ? resolveSessionAgentId({ sessionKey: params.sessionKey, config: params.cfg })
    : (params.agentId ?? "main");
  const currentAgentId = params.agentId ?? "main";
  const agentDir =
    sessionAgentId === currentAgentId && params.agentDir
      ? params.agentDir
      : resolveAgentDir(params.cfg, sessionAgentId);

  const synthFollowupRun: FollowupRun = {
    prompt: "",
    enqueuedAt: Date.now(),
    run: {
      agentId: sessionAgentId,
      agentDir,
      sessionId,
      sessionKey: params.sessionKey,
      sessionFile: targetSessionEntry?.sessionFile ?? "",
      workspaceDir: params.workspaceDir,
      config: params.cfg,
      provider: params.provider,
      model: params.model,
      timeoutMs: 0,
      blockReplyBreak: "text_end",
      messageProvider: params.command.channel,
      groupId: targetSessionEntry?.groupId,
      groupChannel: targetSessionEntry?.groupChannel,
      groupSpace: targetSessionEntry?.space,
      senderId: params.command.senderId,
      senderName: params.ctx.SenderName,
      senderUsername: params.ctx.SenderUsername,
      senderE164: params.ctx.SenderE164,
      skillsSnapshot: targetSessionEntry?.skillsSnapshot,
      ownerNumbers: params.command.ownerList.length > 0 ? params.command.ownerList : undefined,
      thinkLevel: params.resolvedThinkLevel,
    },
  };

  const existingOp = replyRunRegistry.get(params.sessionKey);
  let flushReplyOperation;
  let ownsOperation = false;

  if (existingOp) {
    flushReplyOperation = existingOp;
  } else {
    try {
      flushReplyOperation = createReplyOperation({
        sessionKey: params.sessionKey,
        sessionId,
        resetTriggered: false,
      });
      ownsOperation = true;
    } catch (err) {
      if (err instanceof ReplyRunAlreadyActiveError) {
        logVerbose(`[dev-mode] memory flush: session lane busy for ${params.sessionKey}, skipping`);
        return;
      }
      throw err;
    }
  }

  // Clear memoryFlushCompactionCount so hasAlreadyFlushedForCurrentCompaction
  // doesn't block this explicit command-triggered flush.
  const entryForFlush: SessionEntry | undefined = targetSessionEntry
    ? { ...targetSessionEntry, memoryFlushCompactionCount: undefined }
    : undefined;

  try {
    await runMemoryFlushIfNeeded({
      cfg: params.cfg,
      followupRun: synthFollowupRun,
      sessionCtx: params.ctx as TemplateContext,
      opts: params.opts,
      defaultModel: params.model,
      agentCfgContextTokens: params.contextTokens,
      resolvedVerboseLevel: params.resolvedVerboseLevel,
      sessionEntry: entryForFlush,
      sessionStore: params.sessionStore,
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      isHeartbeat: false,
      replyOperation: flushReplyOperation,
    });
    logVerbose("[dev-mode] memory flush: completed");
  } catch (err) {
    logVerbose(
      `[dev-mode] memory flush failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    if (ownsOperation) {
      flushReplyOperation.complete();
    }
  }
}
