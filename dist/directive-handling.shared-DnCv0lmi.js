import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { r as isInternalMessageChannel } from "./message-channel-B4LS2Kcc.js";
import { r as prefixSystemMessage, t as SYSTEM_MARK } from "./system-message-Dltw0_t9.js";
//#region src/auto-reply/reply/directive-handling.shared.ts
const formatDirectiveAck = (text) => {
	return prefixSystemMessage(text);
};
const formatOptionsLine = (options) => `Options: ${options}.`;
const withOptions = (line, options) => `${line}\n${formatOptionsLine(options)}`;
const formatElevatedRuntimeHint = () => `${SYSTEM_MARK} Runtime is direct; sandboxing does not apply.`;
const formatInternalExecPersistenceDeniedText = () => "Exec defaults require operator.admin for gateway callers; skipped persistence.";
const formatInternalVerbosePersistenceDeniedText = () => "Verbose defaults require operator.admin for gateway callers; skipped persistence.";
const formatInternalVerboseCurrentReplyOnlyText = () => "Verbose logging set for the current reply only.";
function canPersistSessionDirectiveDefaults(params) {
	const messageProvider = normalizeOptionalString(params.messageProvider);
	const surface = normalizeOptionalString(params.surface);
	const authoritativeChannel = messageProvider ?? surface;
	if (!authoritativeChannel) return true;
	if (isInternalMessageChannel(authoritativeChannel)) return params.gatewayClientScopes?.includes("operator.admin") === true;
	return params.commandAuthorized === true || params.senderIsOwner === true;
}
const formatElevatedEvent = (level) => {
	if (level === "full") return "Elevated FULL - exec runs on host with auto-approval.";
	if (level === "ask" || level === "on") return "Elevated ASK - exec runs on host; approvals may still apply.";
	return "Elevated OFF - exec stays in sandbox.";
};
const formatReasoningEvent = (level) => {
	if (level === "stream") return "Reasoning STREAM - emit live <think>.";
	if (level === "on") return "Reasoning ON - include <think>.";
	return "Reasoning OFF - hide <think>.";
};
function enqueueModeSwitchEvents(params) {
	if (params.elevatedChanged) {
		const nextElevated = params.sessionEntry.elevatedLevel ?? "off";
		params.enqueueSystemEvent(formatElevatedEvent(nextElevated), {
			sessionKey: params.sessionKey,
			contextKey: "mode:elevated"
		});
	}
	if (params.reasoningChanged) {
		const nextReasoning = params.sessionEntry.reasoningLevel ?? "off";
		params.enqueueSystemEvent(formatReasoningEvent(nextReasoning), {
			sessionKey: params.sessionKey,
			contextKey: "mode:reasoning"
		});
	}
}
function formatElevatedUnavailableText(params) {
	const lines = [];
	lines.push(`elevated is not available right now (runtime=${params.runtimeSandboxed ? "sandboxed" : "direct"}).`);
	const failures = params.failures ?? [];
	if (failures.length > 0) lines.push(`Failing gates: ${failures.map((f) => `${f.gate} (${f.key})`).join(", ")}`);
	else lines.push("Fix-it keys: tools.elevated.enabled, tools.elevated.allowFrom.<provider>, agents.list[].tools.elevated.*");
	if (params.sessionKey) lines.push(`See: ${formatCliCommand(`openclaw sandbox explain --session ${params.sessionKey}`)}`);
	return lines.join("\n");
}
//#endregion
export { formatElevatedUnavailableText as a, formatInternalVerbosePersistenceDeniedText as c, formatElevatedRuntimeHint as i, withOptions as l, enqueueModeSwitchEvents as n, formatInternalExecPersistenceDeniedText as o, formatDirectiveAck as r, formatInternalVerboseCurrentReplyOnlyText as s, canPersistSessionDirectiveDefaults as t };
