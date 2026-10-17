import { y as parseDateStringTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { m as withSessionTranscriptWriteLock } from "./session-transcript-runtime-tIU02hJq.mjs";
import { o as createEmptyTransportUsage } from "./provider-transport-runtime-wQQsx9u_.mjs";
import { t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-D6douw4O.mjs";
//#region extensions/anthropic/session-catalog-history.ts
function importedClaudeMessage(item, fallbackTimestamp) {
	const timestamp = parseDateStringTimestampMs(item.timestamp) ?? fallbackTimestamp;
	const importedText = item.text?.trim();
	if (!importedText && item.type === "reasoning") return;
	const text = importedText || "[Unsupported Claude transcript item]";
	if (item.type === "userMessage") return {
		role: "user",
		content: text,
		timestamp,
		__openclaw: { mirrorOrigin: "claude-catalog-import" }
	};
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: `${item.type === "reasoning" ? "Thinking\n\n" : item.type === "toolCall" ? "Tool call\n\n" : item.type === "toolResult" ? "Tool result\n\n" : ""}${text}`
		}],
		timestamp,
		api: "anthropic-messages",
		provider: CLAUDE_CLI_BACKEND_ID,
		model: "native-history",
		usage: createEmptyTransportUsage(),
		stopReason: "stop"
	};
}
async function importClaudeHistory(params) {
	const items = params.items.toReversed();
	await withSessionTranscriptWriteLock(params, async (transcript) => {
		for (const [index, item] of items.entries()) {
			const imported = importedClaudeMessage(item, Date.now() + index);
			if (!imported) continue;
			const message = {
				...imported,
				idempotencyKey: `claude-catalog:${params.threadId}:${item.uuid ?? index}`
			};
			await transcript.appendMessage({
				message,
				idempotencyLookup: "scan",
				cwd: params.cwd
			});
		}
	});
}
//#endregion
export { importClaudeHistory as t };
