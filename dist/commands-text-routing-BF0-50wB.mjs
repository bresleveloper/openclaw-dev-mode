import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as getLoadedChannelPluginById } from "./registry-loaded-BugfxX6l.mjs";
//#region src/auto-reply/commands-text-routing.ts
/** Text-command routing decisions for surfaces that may also support native commands. */
/** Decides whether text slash commands remain active for the current surface/config pair. */
function shouldHandleTextCommands(params) {
	if (params.commandSource === "native" || params.cfg.commands?.text !== false) return true;
	const surface = normalizeOptionalLowercaseString(params.surface);
	return !surface || getLoadedChannelPluginById(surface)?.capabilities?.nativeCommands !== true;
}
//#endregion
export { shouldHandleTextCommands as t };
