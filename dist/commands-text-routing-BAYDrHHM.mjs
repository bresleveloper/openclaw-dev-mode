import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as getLoadedChannelPluginById } from "./registry-loaded-CYq2sa_C.mjs";
//#region src/auto-reply/commands-text-routing.ts
/** Text-command routing decisions for surfaces that may also support native commands. */
/** Returns whether a surface can receive provider-native slash commands. */
function isNativeCommandSurface(surface) {
	const normalized = normalizeOptionalLowercaseString(surface);
	if (!normalized) return false;
	return getLoadedChannelPluginById(normalized)?.capabilities?.nativeCommands === true;
}
/** Decides whether text slash commands remain active for the current surface/config pair. */
function shouldHandleTextCommands(params) {
	if (params.commandSource === "native") return true;
	if (params.cfg.commands?.text !== false) return true;
	return !isNativeCommandSurface(params.surface);
}
//#endregion
export { shouldHandleTextCommands as n, isNativeCommandSurface as t };
