import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as stripInboundMetadata } from "./strip-inbound-meta-D65t0FgP.mjs";
import { n as listChatCommands, r as listChatCommandsForConfig } from "./commands-registry-list-BWZj-KCw.mjs";
import { n as normalizeCommandBody } from "./commands-registry-normalize-BI2t-DKf.mjs";
import { r as matchPluginCommand } from "./commands-DQ5ePK9w.mjs";
import { t as isAbortTrigger } from "./abort-trigger-text-ptqrLO20.mjs";
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
	return hasNormalizedControlCommand(normalizedBody, cfg) || isAbortTrigger(normalizedBody);
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
/** Returns true when a message may need command authorization metadata. */
function shouldComputeCommandAuthorized(text, cfg, options) {
	if (isControlCommandMessage(text, cfg, options) || hasInlineCommandTokens(text)) return true;
	const commandBody = text?.match(/(?:^|\s)(\/\s+[a-z][\s\S]*)/i)?.[1];
	return commandBody ? matchPluginCommand(commandBody) !== null : false;
}
//#endregion
export { shouldComputeCommandAuthorized as a, isSessionBoundaryCommandText as i, hasInlineCommandTokens as n, isControlCommandMessage as r, hasControlCommand as t };
