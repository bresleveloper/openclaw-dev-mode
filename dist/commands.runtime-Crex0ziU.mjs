import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { i as logVerbose, r as isDevMode } from "./globals-QODkv80i.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DDcHHhpX.mjs";
import { a as copyReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { n as isResetAuthorizedForContext } from "./command-auth-rFSl4uOZ.mjs";
import { t as clearAllCliSessions } from "./cli-session-binding-BhV_HbVa.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { l as resolveCommandTurnTargetSessionKey } from "./command-turn-context-a363iy71.mjs";
import { n as shouldHandleTextCommands } from "./commands-text-routing-BAYDrHHM.mjs";
import "./commands-registry-BUZjd6Tx.mjs";
import { t as parseSoftResetCommand } from "./commands-reset-mode-YSRuCbGF.mjs";
import { t as clearBootstrapSnapshot } from "./bootstrap-cache-D3fnu3yg.mjs";
import "./cli-session-CeXeyPue.mjs";
import { t as applyCommandTextToContext } from "./command-context-rewrite-DyA5NUca.mjs";
import { n as commandReply } from "./command-gates-DqpLd5XK.mjs";
import "./commands-context-DspJ6y5g.mjs";
import { t as emitResetCommandHooks } from "./commands-reset-hooks-gllsu6tF.mjs";
import { n as resetConfiguredBindingTargetInPlace } from "./binding-targets-By4zhSMx.mjs";
import { n as resolveBoundAcpThreadSessionKey } from "./targets-CTBR6TAg.mjs";
import { n as buildStatusReply } from "./commands-status-D1yEXpDN.mjs";
//#region src/auto-reply/reply/commands-reset.ts
/** Handles /new and /reset command flows, including soft reset and ACP-bound sessions. */
function applyAcpResetTailContext(ctx, resetTail) {
	applyCommandTextToContext(ctx, resetTail);
	ctx.AcpDispatchTailAfterReset = true;
}
function isResetAuthorized(params) {
	return isResetAuthorizedForContext({
		ctx: params.ctx,
		cfg: params.cfg,
		commandAuthorized: params.command.isAuthorizedSender || params.ctx.CommandAuthorized === true
	});
}
/** Handles reset/new commands or returns null when another command handler should continue. */
async function maybeHandleResetCommand(params) {
	const resetMatch = params.command.commandBodyNormalized.match(/^\/(new|reset)(?:\s|$)/i);
	if (!resetMatch) return null;
	if (!isResetAuthorized(params)) {
		logVerbose(`Ignoring /${resetMatch[1]} from unauthorized sender: ${params.command.senderId || "<unknown>"}`);
		return isInternalMessageChannel(params.ctx.Provider || params.ctx.Surface) && isInternalMessageChannel(params.command.channel) ? commandReply("⚠️ You are not authorized to reset this session. Gateway resets require operator.admin and command access. Ask your administrator to reset it, or send your message without the command.") : { shouldContinue: false };
	}
	const commandTargetSessionKey = resolveCommandTurnTargetSessionKey(params.ctx);
	const softReset = parseSoftResetCommand(params.command.commandBodyNormalized);
	if (softReset.matched) {
		const boundAcpSessionKey = await resolveBoundAcpThreadSessionKey(params, commandTargetSessionKey);
		params.opts?.abortSignal?.throwIfAborted();
		if (boundAcpSessionKey && isAcpSessionKey(boundAcpSessionKey) ? boundAcpSessionKey.trim() : void 0) return {
			shouldContinue: false,
			reply: { text: "Usage: /reset soft is not available for ACP-bound sessions yet." }
		};
		const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;
		const previousSessionEntry = params.previousSessionEntry ?? (targetSessionEntry ? { ...targetSessionEntry } : void 0);
		if (targetSessionEntry) {
			const now = Date.now();
			clearAllCliSessions(targetSessionEntry);
			if (params.sessionEntry && params.sessionEntry !== targetSessionEntry) {
				clearAllCliSessions(params.sessionEntry);
				params.sessionEntry.updatedAt = now;
				params.sessionEntry.lastInteractionAt = now;
			}
			if (params.sessionKey) clearBootstrapSnapshot(params.sessionKey);
			targetSessionEntry.updatedAt = now;
			targetSessionEntry.lastInteractionAt = now;
			if (params.sessionStore && params.sessionKey) params.sessionStore[params.sessionKey] = targetSessionEntry;
			if (params.storePath && params.sessionKey) await updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey
			}, async (entry) => {
				const next = { ...entry };
				clearAllCliSessions(next);
				return {
					cliSessionBindings: next.cliSessionBindings,
					cliSessionIds: next.cliSessionIds,
					claudeCliSessionId: next.claudeCliSessionId,
					updatedAt: now,
					lastInteractionAt: now
				};
			}, { consumePendingReset: true });
		}
		await emitResetCommandHooks({
			action: "reset",
			agentId: params.agentId,
			ctx: params.ctx,
			cfg: params.cfg,
			command: params.command,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			sessionEntry: targetSessionEntry,
			previousSessionEntry,
			previousSessionMemory: params.previousSessionMemory,
			previousSessionResetMessages: params.previousSessionResetMessages,
			onObservedReplyDelivery: params.opts?.onObservedReplyDelivery,
			workspaceDir: params.workspaceDir
		});
		params.command.softResetTriggered = true;
		params.command.softResetTail = softReset.tail;
		return null;
	}
	const commandAction = resetMatch[1]?.toLowerCase() === "reset" ? "reset" : "new";
	const resetTail = params.command.commandBodyNormalized.slice(resetMatch[0].length).trimStart();
	const boundAcpSessionKey = await resolveBoundAcpThreadSessionKey(params, commandTargetSessionKey);
	params.opts?.abortSignal?.throwIfAborted();
	const boundAcpKey = boundAcpSessionKey && isAcpSessionKey(boundAcpSessionKey) ? boundAcpSessionKey.trim() : void 0;
	if (boundAcpKey) {
		const resetResult = await resetConfiguredBindingTargetInPlace({
			cfg: params.cfg,
			sessionKey: boundAcpKey,
			reason: commandAction,
			commandSource: `${params.command.surface}:${params.ctx.CommandSource ?? "text"}`
		});
		if (!resetResult.ok) logVerbose(`acp reset failed for ${boundAcpKey}: ${resetResult.error ?? "unknown error"}`);
		if (resetResult.ok) {
			if (resetResult.sessionId) params.opts?.onSessionPrepared?.({
				sessionKey: resetResult.sessionKey ?? boundAcpKey,
				sessionId: resetResult.sessionId,
				storePath: resetResult.storePath
			});
			params.command.resetHookTriggered = true;
			if (resetTail) {
				applyAcpResetTailContext(params.ctx, resetTail);
				if (params.rootCtx && params.rootCtx !== params.ctx) applyAcpResetTailContext(params.rootCtx, resetTail);
				return { shouldContinue: false };
			}
			return {
				shouldContinue: false,
				reply: {
					text: "✅ ACP session reset in place.",
					isStatusNotice: true
				}
			};
		}
		return {
			shouldContinue: false,
			reply: {
				text: "⚠️ ACP session reset failed. Check /acp status and try again.",
				isStatusNotice: true
			}
		};
	}
	const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;
	const hookResult = await emitResetCommandHooks({
		action: commandAction,
		agentId: params.agentId,
		ctx: params.ctx,
		cfg: params.cfg,
		command: params.command,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		sessionEntry: targetSessionEntry,
		previousSessionEntry: params.previousSessionEntry,
		previousSessionMemory: params.previousSessionMemory,
		previousSessionResetMessages: params.previousSessionResetMessages,
		onObservedReplyDelivery: params.opts?.onObservedReplyDelivery,
		workspaceDir: params.workspaceDir
	});
	if (!isDevMode() && !resetTail) return {
		shouldContinue: false,
		...hookResult.routedReply ? {} : { reply: {
			text: commandAction === "reset" ? "✅ Session reset." : "✅ New session started.",
			isStatusNotice: true
		} }
	};
	return null;
}
//#endregion
//#region src/auto-reply/reply/commands-core.ts
const commandHandlersRuntimeLoader = createLazyImportLoader(() => import("./commands-handlers.runtime.js"));
function loadCommandHandlersRuntime() {
	return commandHandlersRuntimeLoader.load();
}
let HANDLERS = null;
function normalizeCommandHandlerResult(result) {
	if (!result.reply) return result;
	return {
		...result,
		reply: copyReplyPayloadMetadata(result.reply, {
			...result.reply,
			replyToId: void 0,
			replyToCurrent: false
		})
	};
}
async function handleCommands(params) {
	if (params.ctx.CommandInterpretationSuppressed === true) return { shouldContinue: true };
	const allowCreateSessionEntry = params.allowCreateSessionEntry === true;
	const initialSessionEntry = params.initialSessionEntry ?? (allowCreateSessionEntry ? void 0 : params.sessionEntry ? { ...params.sessionEntry } : void 0);
	const agentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg,
		fallbackAgentId: params.agentId
	});
	const { resolveModelLevels, ...dispatchParams } = params;
	const commandParams = {
		...dispatchParams,
		agentId,
		agentDir: agentId === params.agentId ? params.agentDir : resolveAgentDir(params.cfg, agentId),
		initialSessionEntry,
		allowCreateSessionEntry
	};
	const resetResult = await maybeHandleResetCommand(commandParams);
	if (resetResult) return normalizeCommandHandlerResult(resetResult);
	const handlerParams = {
		...commandParams,
		...await resolveModelLevels()
	};
	if (HANDLERS === null) HANDLERS = (await loadCommandHandlersRuntime()).loadCommandHandlers();
	const allowTextCommands = shouldHandleTextCommands({
		cfg: params.cfg,
		surface: params.command.surface,
		commandSource: params.ctx.CommandSource
	});
	for (const handler of HANDLERS) {
		const result = await handler(handlerParams, allowTextCommands);
		if (result) return normalizeCommandHandlerResult(result);
	}
	return { shouldContinue: true };
}
//#endregion
export { buildStatusReply, handleCommands };
