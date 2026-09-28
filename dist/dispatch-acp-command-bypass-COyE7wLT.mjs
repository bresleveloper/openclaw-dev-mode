import { t as isCommandEnabled } from "./commands-registry-list-dv4qVJuy.mjs";
import { t as hasControlCommand } from "./command-detection-CzqdezWl.mjs";
import { n as shouldHandleTextCommands } from "./commands-text-routing-BAYDrHHM.mjs";
import { n as resolveCommandContextText } from "./context-text-D3m6Fy9M.mjs";
//#region src/auto-reply/reply/dispatch-acp-command-bypass.ts
function isResetCommandCandidate(text) {
	return /^\/(?:new|reset)(?:\s|$)/i.test(text);
}
function isAcpCommandCandidate(text) {
	return /^\/acp(?:\s|$)/i.test(text);
}
function shouldBypassAcpDispatchForCommand(ctx, cfg) {
	const candidate = resolveCommandContextText(ctx);
	if (!candidate) return false;
	const allowTextCommands = shouldHandleTextCommands({
		cfg,
		surface: ctx.Surface ?? ctx.Provider ?? "",
		commandSource: ctx.CommandSource
	});
	if (isResetCommandCandidate(candidate)) return true;
	if (isAcpCommandCandidate(candidate)) return true;
	if (hasControlCommand(candidate, cfg)) return allowTextCommands;
	if (!candidate.startsWith("!")) return false;
	if (!ctx.CommandAuthorized) return false;
	if (!isCommandEnabled(cfg, "bash")) return false;
	return allowTextCommands;
}
//#endregion
export { shouldBypassAcpDispatchForCommand as t };
