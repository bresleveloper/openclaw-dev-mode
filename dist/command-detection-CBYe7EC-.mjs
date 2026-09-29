import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-Cqak81y4.mjs";
import { r as matchPluginCommand } from "./commands-CNifq--_.mjs";
import { n as listChatCommands, r as listChatCommandsForConfig } from "./commands-registry-list-dv4qVJuy.mjs";
import { r as normalizeCommandBody } from "./commands-registry-normalize-DJeLLZwD.mjs";
import { t as isAbortTrigger } from "./abort-trigger-text-CSrUnB7M.mjs";
//#region src/auto-reply/command-detection.ts
/** Command detectors used by inbound authorization and control-command routing. */
/** Returns true when text starts with a configured control command alias. */
function hasControlCommand(text, cfg, options) {
	if (!text) return false;
	const trimmed = text.trim();
	if (!trimmed) return false;
	const stripped = stripInboundMetadata(trimmed);
	if (!stripped) return false;
	const normalizedBody = normalizeCommandBody(stripped, options);
	if (!normalizedBody) return false;
	const lowered = normalizeLowercaseStringOrEmpty(normalizedBody);
	const commands = cfg ? listChatCommandsForConfig(cfg) : listChatCommands();
	for (const command of commands) for (const alias of command.textAliases) {
		const normalized = normalizeOptionalLowercaseString(alias);
		if (!normalized) continue;
		if (lowered === normalized) return true;
		if (command.acceptsArgs && lowered.startsWith(normalized)) {
			const nextChar = normalizedBody.charAt(normalized.length);
			if (nextChar && /\s/.test(nextChar)) return true;
		}
	}
	return false;
}
/** Returns true for exact control commands or abort triggers after metadata stripping. */
function isControlCommandMessage(text, cfg, options) {
	if (!text) return false;
	const trimmed = text.trim();
	if (!trimmed) return false;
	if (hasControlCommand(trimmed, cfg, options)) return true;
	const stripped = stripInboundMetadata(trimmed);
	const normalized = normalizeOptionalLowercaseString(normalizeCommandBody(stripped, options)) ?? "";
	return isAbortTrigger(normalized);
}
/** Returns true when a command starts a new transcript rather than resetting in place. */
function isSessionBoundaryCommandText(text, options) {
	const stripped = stripInboundMetadata(text?.trim() ?? "");
	const normalized = normalizeCommandBody(stripped, options);
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
	const body = text ?? "";
	if (!body.trim()) return false;
	return /(?:^|\s)[/!][a-z]/i.test(body);
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
