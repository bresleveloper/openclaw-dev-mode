import { t as isCommandEnabled } from "./commands-registry-list-BBsEgVPc.mjs";
import { t as shouldHandleTextCommands } from "./commands-text-routing-BF0-50wB.mjs";
import { t as hasControlCommand } from "./command-detection-M8GOVwRi.mjs";
import { n as resolveCommandContextText } from "./context-text-D3m6Fy9M.mjs";
//#region src/auto-reply/reply/dispatch-acp-command-bypass.ts
function shouldBypassAcpDispatchForCommand(ctx, cfg) {
	const candidate = resolveCommandContextText(ctx);
	if (!candidate) return false;
	const allowTextCommands = shouldHandleTextCommands({
		cfg,
		surface: ctx.Surface ?? ctx.Provider ?? "",
		commandSource: ctx.CommandSource
	});
	if (/^\/(?:new|reset|acp)(?:\s|$)/i.test(candidate)) return true;
	if (hasControlCommand(candidate, cfg)) return allowTextCommands;
	if (!candidate.startsWith("!") || !ctx.CommandAuthorized || !isCommandEnabled(cfg, "bash")) return false;
	return allowTextCommands;
}
//#endregion
export { shouldBypassAcpDispatchForCommand as t };
