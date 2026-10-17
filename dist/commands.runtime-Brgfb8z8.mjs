import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { b as isAcpSessionKey } from "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { a as isInternalMessageChannel } from "./message-channel-j-k-Nup3.mjs";
import { i as logVerbose, r as isDevMode } from "./globals-BXbZ1A_g.mjs";
import { o as copyReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { n as isResetAuthorizedForContext } from "./command-auth-DyjyIT4u.mjs";
import { t as clearAllCliSessions } from "./cli-session-binding-CMk8AbZT.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { c as updateSessionEntry } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { l as resolveCommandTurnTargetSessionKey } from "./command-turn-context-B-DtktkV.mjs";
import { t as shouldHandleTextCommands } from "./commands-text-routing-BF0-50wB.mjs";
import "./commands-registry-DVONES7g.mjs";
import { t as parseSoftResetCommand } from "./commands-reset-mode-BR603SE5.mjs";
import { t as clearBootstrapSnapshot } from "./bootstrap-cache-BWoSWwko.mjs";
import "./cli-session-BGS0cWwl.mjs";
import { t as applyCommandTextToContext } from "./command-context-rewrite-mIwqCJE8.mjs";
import { n as commandReply } from "./command-gates-BzqqR9SG.mjs";
import "./commands-context-BGcpInDI.mjs";
import { t as emitResetCommandHooks } from "./commands-reset-hooks-CioV4Nqy.mjs";
import { n as resetConfiguredBindingTargetInPlace } from "./binding-targets-XIPa8ub-.mjs";
import { n as resolveBoundAcpThreadSessionKey } from "./targets-DlcxH53h.mjs";
import { n as buildStatusReply } from "./commands-status-D04tbSon.mjs";
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
	const commandAction = resetMatch[1]?.toLowerCase() === "reset" ? "reset" : "new";
	const resetTail = params.command.commandBodyNormalized.slice(resetMatch[0].length).trimStart();
	const boundAcpSessionKey = await resolveBoundAcpThreadSessionKey(params, commandTargetSessionKey);
	params.opts?.abortSignal?.throwIfAborted();
	const boundAcpKey = boundAcpSessionKey && isAcpSessionKey(boundAcpSessionKey) ? boundAcpSessionKey.trim() : void 0;
	if (softReset.matched) {
		if (boundAcpKey) return commandReply("Usage: /reset soft is not available for ACP-bound sessions yet.");
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
			}, (entry) => {
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
			...params,
			action: "reset",
			sessionEntry: targetSessionEntry,
			previousSessionEntry,
			onObservedReplyDelivery: params.opts?.onObservedReplyDelivery
		});
		params.command.softResetTriggered = true;
		params.command.softResetTail = softReset.tail;
		return null;
	}
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
		...params,
		action: commandAction,
		sessionEntry: targetSessionEntry,
		onObservedReplyDelivery: params.opts?.onObservedReplyDelivery
	});
	if (!resetTail) return {
		shouldContinue: false,
		...hookResult.routedReply || isDevMode() ? {} : { reply: {
			text: commandAction === "reset" ? "✅ Session reset." : "✅ New session started.",
			isStatusNotice: true
		} }
	};
	return null;
}
//#endregion
//#region src/auto-reply/reply/commands-core.ts
const commandHandlersRuntimeLoader = createLazyImportLoader(async () => (await import("./commands-handlers.runtime.js")).loadCommandHandlers());
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
	const handlers = await commandHandlersRuntimeLoader.load();
	const allowTextCommands = shouldHandleTextCommands({
		cfg: params.cfg,
		surface: params.command.surface,
		commandSource: params.ctx.CommandSource
	});
	for (const handler of handlers) {
		const result = await handler(handlerParams, allowTextCommands);
		if (result) return normalizeCommandHandlerResult(result);
	}
	return { shouldContinue: true };
}
//#endregion
export { buildStatusReply, handleCommands };
