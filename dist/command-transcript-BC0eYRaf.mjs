import { n as parseConfigPath, r as setConfigValueAtPath, t as getConfigValueAtPath } from "./config-paths-BvomE-N1.mjs";
import { t as REDACTED_SENTINEL } from "./redact-sentinel-f_PhnHTI.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-BSOdHT4f.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { a as parseSlashCommandOrNull } from "./commands-registry.data-CPKKYobJ.mjs";
import { n as normalizeCommandBody } from "./commands-registry-normalize-BI2t-DKf.mjs";
import { n as parseConfigCommand, t as parseDebugCommand } from "./debug-commands-CRt_OQaq.mjs";
//#region src/config/sessions/command-transcript.ts
function scopeCommandTranscriptId(messageId, context) {
	return messageId ? JSON.stringify([
		context.channelId ?? "",
		context.accountId ?? "",
		context.conversationId ?? "",
		messageId
	]) : void 0;
}
async function redactConfigCommandInput(text) {
	const name = parseSlashCommandOrNull(text, "/config") ? "/config" : "/debug";
	if (parseSlashCommandOrNull(text, name)?.action !== "set") return text;
	const command = name === "/config" ? parseConfigCommand(text) : parseDebugCommand(text);
	if (command?.action !== "set") return `${name} set ${REDACTED_SENTINEL}`;
	const path = parseConfigPath(command.path);
	if (!path.ok) return `${name} set ${REDACTED_SENTINEL}`;
	const [{ redactConfigObject }, { loadGatewayRuntimeConfigSchema }] = await Promise.all([import("./redact-snapshot-Cgb6a6AH.mjs"), import("./runtime-schema-DhPInqNO.mjs")]);
	const preview = {};
	setConfigValueAtPath(preview, path.path, command.value);
	const redacted = redactConfigObject(preview, loadGatewayRuntimeConfigSchema().uiHints);
	return `${name} set ${command.path}=${JSON.stringify(getConfigValueAtPath(redacted, path.path))}`;
}
/** Records only settled command output; callers must first confirm delivery. */
async function recordDeliveredCommandExchange(params) {
	const commandText = normalizeCommandBody(params.commandText, {
		targetedCommandMode: "pre-identity",
		preserveArguments: true
	}).trim();
	if (/^\/(?:btw|side)(?:@\S+)?(?:\s|$)/i.test(commandText)) return {
		ok: false,
		reason: "ephemeral command"
	};
	const redact = (text) => {
		const withoutCodes = text.replace(/\b((?:device|pairing|verification|login|setup)\s+code|code)\s*:\s*(?:<code>)?[^\s<]+(?:<\/code>)?/gi, "$1: [login code redacted]");
		return (/^\/pair(?:@\S+)?(?:\s|$)/i.test(commandText) ? withoutCodes.replace(/\beyJ[A-Za-z0-9_-]{32,}={0,2}\b/g, "[pairing code redacted]") : withoutCodes).replace(/https?:\/\/[^\s<>]+/gi, (url) => /^\/login(?:@\S+)?(?:\s|$)/i.test(commandText) || /[?&](?:[\w-]*token|state|code|user_code|device_code|secret|key)=/i.test(url) ? "[login URL redacted]" : url);
	};
	try {
		return await appendAssistantMessageToSessionTranscript({
			...params,
			text: redact(params.replyText),
			command: {
				text: redact(await redactConfigCommandInput(commandText)),
				idempotencyKey: `command-input:${params.commandId}`
			},
			idempotencyKey: `command-reply:${params.commandId}:${params.replyId}`
		});
	} catch {
		logVerbose("Command transcript recording failed after delivery");
		return {
			ok: false,
			reason: "transcript recording failed"
		};
	}
}
//#endregion
export { scopeCommandTranscriptId as n, recordDeliveredCommandExchange as t };
