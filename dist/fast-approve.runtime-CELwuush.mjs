import { a as resolveCommandAuthorizationAsync } from "./command-auth-D8Y1MxJm.mjs";
import { t as shouldHandleTextCommands } from "./commands-text-routing-C0zJ6oP2.mjs";
import { n as resolveCommandContextText } from "./context-text-XBr5_KXU.mjs";
import { t as buildCommandContext } from "./commands-context-61z87VY8.mjs";
import { t as handleApproveCommandFromContext } from "./commands-approve-D0utkCWr.mjs";
//#region src/auto-reply/reply/fast-approve.ts
/** Resolve /approve before session admission so it can release the active run it reviews. */
async function tryFastApproveFromMessage(params) {
	const triggerBodyNormalized = resolveCommandContextText(params.ctx);
	if (!/^\/approve(?:@[^\s]+)?(?:\s|$)/i.test(triggerBodyNormalized)) return { handled: false };
	const commandContext = {
		ctx: params.ctx,
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		isGroup: params.ctx.ChatType === "group" || params.ctx.ChatType === "channel",
		triggerBodyNormalized,
		commandAuthorized: params.ctx.CommandAuthorized
	};
	const command = buildCommandContext(commandContext, await resolveCommandAuthorizationAsync(commandContext));
	const result = await handleApproveCommandFromContext({
		cfg: params.cfg,
		ctx: params.ctx,
		command
	}, shouldHandleTextCommands({
		cfg: params.cfg,
		surface: command.surface,
		commandSource: params.ctx.CommandSource
	}));
	return result && !result.shouldContinue ? {
		handled: true,
		...result.reply ? { reply: result.reply } : {}
	} : { handled: false };
}
//#endregion
export { tryFastApproveFromMessage };
