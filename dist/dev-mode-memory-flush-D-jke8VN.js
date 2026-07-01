import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { a as resolveAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import { i as logVerbose, r as isDevMode } from "./globals-BWmHKFNH.js";
import { v as resolveMemoryFlushPlan } from "./memory-state-CH-VhZFM.js";
import { n as ReplyRunAlreadyActiveError, o as createReplyOperation } from "./reply-run-registry-BkKh9g6X.js";
import { t as runMemoryFlushIfNeeded } from "./agent-runner-memory-1TDZVtMV.js";
//#region src/auto-reply/reply/dev-mode-memory-flush.ts
async function runDevModeCommandMemoryFlush(params, targetSessionEntry) {
	if (!isDevMode()) return;
	const sessionId = targetSessionEntry?.sessionId;
	if (!sessionId) return;
	if (!resolveMemoryFlushPlan({ cfg: params.cfg })) return;
	const sessionAgentId = params.sessionKey ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	}) : params.agentId ?? "main";
	const agentDir = sessionAgentId === (params.agentId ?? "main") && params.agentDir ? params.agentDir : resolveAgentDir(params.cfg, sessionAgentId);
	const synthFollowupRun = {
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
			ownerNumbers: params.command.ownerList.length > 0 ? params.command.ownerList : void 0,
			thinkLevel: params.resolvedThinkLevel
		}
	};
	let flushReplyOperation;
	try {
		flushReplyOperation = createReplyOperation({
			sessionKey: params.sessionKey,
			sessionId,
			resetTriggered: false
		});
	} catch (err) {
		if (err instanceof ReplyRunAlreadyActiveError) {
			logVerbose(`[dev-mode] memory flush: session lane busy for ${params.sessionKey}, skipping`);
			return;
		}
		throw err;
	}
	try {
		await runMemoryFlushIfNeeded({
			cfg: params.cfg,
			followupRun: synthFollowupRun,
			sessionCtx: params.ctx,
			opts: params.opts,
			defaultModel: params.model,
			agentCfgContextTokens: params.contextTokens,
			resolvedVerboseLevel: params.resolvedVerboseLevel,
			sessionEntry: targetSessionEntry,
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			isHeartbeat: false,
			replyOperation: flushReplyOperation
		});
		logVerbose("[dev-mode] memory flush: completed");
	} catch (err) {
		logVerbose(`[dev-mode] memory flush failed: ${err instanceof Error ? err.message : String(err)}`);
	} finally {
		flushReplyOperation.complete();
	}
}
//#endregion
export { runDevModeCommandMemoryFlush as t };
