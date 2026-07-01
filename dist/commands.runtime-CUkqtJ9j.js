import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
import { n as isAcpSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { i as logVerbose, r as isDevMode } from "./globals-BWmHKFNH.js";
import { P as updateSessionEntry } from "./session-accessor-Dx6KDG0K.js";
import { t as clearBootstrapSnapshot } from "./bootstrap-cache-CEvmuUUq.js";
import { t as clearAllCliSessions } from "./cli-session-Despdu3U.js";
import { n as shouldHandleTextCommands } from "./commands-text-routing-yfcSW2yD.js";
import "./commands-registry-gLExuKrZ.js";
import { t as parseSoftResetCommand } from "./commands-reset-mode-CyVYz7U7.js";
import { t as isResetAuthorizedForContext } from "./reset-authorization-rWcgEFHn.js";
import { r as resetConfiguredBindingTargetInPlace } from "./binding-targets-dl8QeQuz.js";
import { n as resolveBoundAcpThreadSessionKey } from "./targets-Dk55n54e.js";
import { t as emitResetCommandHooks } from "./commands-reset-hooks-DKGFD7yu.js";
import { t as runDevModeCommandMemoryFlush } from "./dev-mode-memory-flush-Dr5D1CaF.js";
import { n as buildStatusReply } from "./commands-status-lw0RrorL.js";
//#region src/auto-reply/reply/commands-reset.ts
/** Handles /new and /reset command flows, including soft reset and ACP-bound sessions. */
function applyAcpResetTailContext(ctx, resetTail) {
	const mutableCtx = ctx;
	mutableCtx.Body = resetTail;
	mutableCtx.RawBody = resetTail;
	mutableCtx.CommandBody = resetTail;
	mutableCtx.BodyForCommands = resetTail;
	mutableCtx.BodyForAgent = resetTail;
	mutableCtx.BodyStripped = resetTail;
	mutableCtx.AcpDispatchTailAfterReset = true;
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
	const softReset = parseSoftResetCommand(params.command.commandBodyNormalized);
	if (softReset.matched) {
		if (!isResetAuthorized(params)) {
			logVerbose(`Ignoring /reset soft from unauthorized sender: ${params.command.senderId || "<unknown>"}`);
			return { shouldContinue: false };
		}
		const boundAcpSessionKey = resolveBoundAcpThreadSessionKey(params);
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
			});
		}
		await emitResetCommandHooks({
			action: "reset",
			ctx: params.ctx,
			cfg: params.cfg,
			command: params.command,
			sessionKey: params.sessionKey,
			sessionEntry: targetSessionEntry,
			previousSessionEntry,
			workspaceDir: params.workspaceDir
		});
		params.command.softResetTriggered = true;
		params.command.softResetTail = softReset.tail;
		return null;
	}
	const resetMatch = params.command.commandBodyNormalized.match(/^\/(new|reset)(?:\s|$)/i);
	if (!resetMatch) return null;
	if (!isResetAuthorized(params)) {
		logVerbose(`Ignoring /reset from unauthorized sender: ${params.command.senderId || "<unknown>"}`);
		return { shouldContinue: false };
	}
	const commandAction = resetMatch[1]?.toLowerCase() === "reset" ? "reset" : "new";
	const resetTail = params.command.commandBodyNormalized.slice(resetMatch[0].length).trimStart();
	const boundAcpSessionKey = resolveBoundAcpThreadSessionKey(params);
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
				reply: { text: "✅ ACP session reset in place." }
			};
		}
		return {
			shouldContinue: false,
			reply: { text: "⚠️ ACP session reset failed. Check /acp status and try again." }
		};
	}
	const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;
	if (isDevMode()) await runDevModeCommandMemoryFlush(params, targetSessionEntry);
	const hookResult = await emitResetCommandHooks({
		action: commandAction,
		ctx: params.ctx,
		cfg: params.cfg,
		command: params.command,
		sessionKey: params.sessionKey,
		sessionEntry: targetSessionEntry,
		previousSessionEntry: params.previousSessionEntry,
		workspaceDir: params.workspaceDir
	});
	if (!isDevMode() && !resetTail) return {
		shouldContinue: false,
		...hookResult.routedReply ? {} : { reply: { text: commandAction === "reset" ? "✅ Session reset." : "✅ New session started." } }
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
		reply: {
			...result.reply,
			replyToId: void 0,
			replyToCurrent: false
		}
	};
}
async function handleCommands(params) {
	if (HANDLERS === null) HANDLERS = (await loadCommandHandlersRuntime()).loadCommandHandlers();
	const resetResult = await maybeHandleResetCommand(params);
	if (resetResult) return normalizeCommandHandlerResult(resetResult);
	const allowTextCommands = shouldHandleTextCommands({
		cfg: params.cfg,
		surface: params.command.surface,
		commandSource: params.ctx.CommandSource
	});
	for (const handler of HANDLERS) {
		const result = await handler(params, allowTextCommands);
		if (result) return normalizeCommandHandlerResult(result);
	}
	return { shouldContinue: true };
}
//#endregion
export { buildStatusReply, handleCommands };
