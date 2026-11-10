import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as getLoadedChannelPluginById } from "./registry-loaded-B-WQB-l0.mjs";
//#region src/auto-reply/commands-text-routing.ts
function shouldHandleTextCommands(params) {
	if (params.commandSource === "native" || params.cfg.commands?.text !== false) return true;
	const surface = normalizeOptionalLowercaseString(params.surface);
	return !surface || getLoadedChannelPluginById(surface)?.capabilities?.nativeCommands !== true;
}
//#endregion
export { shouldHandleTextCommands as t };
