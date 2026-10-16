import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-BWIgBUDF.mjs";
import { n as listChatCommands, r as listChatCommandsForConfig } from "./commands-registry-list-DrLhyfgr.mjs";
import { n as normalizeCommandBody } from "./commands-registry-normalize-DjwhuBCy.mjs";
import { r as matchPluginCommand } from "./commands-ECfi7M74.mjs";
import { t as isAbortTrigger } from "./abort-trigger-text-DmDtxg5D.mjs";
//#region src/auto-reply/command-detection.ts
/** Command detectors used by inbound authorization and control-command routing. */
function normalizeControlCommandBody(text, options) {
	return normalizeCommandBody(stripInboundMetadata(text?.trim() ?? ""), options);
}
function hasNormalizedControlCommand(normalizedBody, cfg) {
	if (!normalizedBody) return false;
	const lowered = normalizeLowercaseStringOrEmpty(normalizedBody);
	return (cfg ? listChatCommandsForConfig(cfg) : listChatCommands()).some((command) => command.textAliases.some((alias) => {
		const normalized = normalizeOptionalLowercaseString(alias);
		return Boolean(normalized && (lowered === normalized || command.acceptsArgs && lowered.startsWith(normalized) && /\s/.test(normalizedBody.charAt(normalized.length))));
	}));
}
/** Returns true when text starts with a configured control command alias. */
function hasControlCommand(text, cfg, options) {
	return hasNormalizedControlCommand(normalizeControlCommandBody(text, options), cfg);
}
/** Returns true for exact control commands or abort triggers after metadata stripping. */
function isControlCommandMessage(text, cfg, options) {
	const normalizedBody = normalizeControlCommandBody(text, options);
	return hasNormalizedControlCommand(normalizedBody, cfg) || isAbortTrigger(normalizeLowercaseStringOrEmpty(normalizedBody));
}
/** Returns true when a command starts a new transcript rather than resetting in place. */
function isSessionBoundaryCommandText(text, options) {
	const normalized = normalizeControlCommandBody(text, options);
	return /^\/(?:new|reset)(?:\s|$)/i.test(normalized) && !/^\/reset\s+soft(?:\s|$)/i.test(normalized);
}
/**
* Coarse detection for inline directives/shortcuts (e.g. "hey /status") so channel monitors
* can decide whether to compute CommandAuthorized for a message.
*
* This intentionally errs on the side of false positives; CommandAuthorized only gates
* command/directive execution, not normal chat replies.
*/
function hasInlineCommandTokens(text) {
	return /(?:^|\s)[/!][a-z]/i.test(text ?? "");
}
function hasSpacedPluginCommand(text) {
	const commandBody = text?.match(/(?:^|\s)(\/\s+[a-z][\s\S]*)/i)?.[1];
	return commandBody ? matchPluginCommand(commandBody) !== null : false;
}
/** Returns true when a message may need command authorization metadata. */
function shouldComputeCommandAuthorized(text, cfg, options) {
	return isControlCommandMessage(text, cfg, options) || hasInlineCommandTokens(text) || hasSpacedPluginCommand(text);
}
//#endregion
export { shouldComputeCommandAuthorized as a, isSessionBoundaryCommandText as i, hasInlineCommandTokens as n, isControlCommandMessage as r, hasControlCommand as t };
