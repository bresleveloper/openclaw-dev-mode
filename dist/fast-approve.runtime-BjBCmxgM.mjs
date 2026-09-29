import { n as shouldHandleTextCommands } from "./commands-text-routing-BAYDrHHM.mjs";
import { t as buildCommandContext } from "./commands-context-BUNzFOLm.mjs";
import { n as resolveCommandContextText } from "./context-text-D3m6Fy9M.mjs";
import { n as handleApproveCommandFromContext } from "./commands-approve-CPOoJGYd.mjs";
//#region src/auto-reply/reply/fast-approve.ts
/** Resolve /approve before session admission so it can release the active run it reviews. */
async function tryFastApproveFromMessage(params) {
	const triggerBodyNormalized = resolveCommandContextText(params.ctx);
	if (!/^\/approve(?:@[^\s]+)?(?:\s|$)/i.test(triggerBodyNormalized)) return { handled: false };
	const command = buildCommandContext({
		ctx: params.ctx,
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		isGroup: params.ctx.ChatType === "group" || params.ctx.ChatType === "channel",
		triggerBodyNormalized,
		commandAuthorized: params.ctx.CommandAuthorized
	});
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
