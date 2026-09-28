import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as extractTextFromChatContent } from "./chat-content-DNdfeXZh.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext } from "./command-turn-context-a363iy71.mjs";
import { n as commandReply } from "./command-gates-DqpLd5XK.mjs";
import { t as formatRunLabel } from "./subagents-utils-uco3tjYq.mjs";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey } from "./sessions-helpers-0nPieSUh.mjs";
import { t as extractStoredAssistantText } from "./chat-history-text-ZJR9s0Sl.mjs";
//#region src/auto-reply/reply/commands-subagents-text.ts
/** Text extraction helpers for subagent command output. */
/** Extracts sanitized display text from a subagent chat message. */
function extractSubagentMessageText(message) {
	const role = typeof message.role === "string" ? message.role : "";
	const content = role === "assistant" ? extractStoredAssistantText(message) : message.content;
	const text = extractTextFromChatContent(content);
	return text ? {
		role,
		text
	} : null;
}
//#endregion
//#region src/auto-reply/reply/commands-subagents/shared.ts
function resolveSubagentEntryForToken(view, token) {
	const fail = (message) => ({ reply: commandReply(`⚠️ ${message}`) });
	const trimmed = normalizeOptionalString(token);
	if (!trimmed) return fail("Missing subagent id.");
	const { latest, active, recent } = view;
	if (trimmed === "last") {
		const entry = latest[0];
		return entry ? { entry } : fail("Unknown subagent.");
	}
	const numericOrder = [...active, ...recent];
	if (/^\d+$/.test(trimmed)) {
		const entry = numericOrder[Number.parseInt(trimmed, 10) - 1];
		return entry ? { entry } : fail(`Invalid subagent index: ${trimmed}`);
	}
	if (trimmed.includes(":")) {
		const entry = latest.find((run) => run.childSessionKey === trimmed);
		return entry ? { entry } : fail(`Unknown subagent session: ${trimmed}`);
	}
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	const match = (entries, ambiguity) => {
		if (entries.length > 1) return fail(`${ambiguity}: ${trimmed}`);
		const entry = entries[0];
		return entry ? { entry } : void 0;
	};
	return match(numericOrder.filter((entry) => normalizeLowercaseStringOrEmpty(entry.taskName) === lowered), "Ambiguous subagent label") ?? match(latest.filter((entry) => normalizeLowercaseStringOrEmpty(formatRunLabel(entry)) === lowered), "Ambiguous subagent label") ?? match(numericOrder.filter((entry) => normalizeLowercaseStringOrEmpty(entry.taskName).startsWith(lowered)), "Ambiguous subagent label prefix") ?? match(latest.filter((entry) => normalizeLowercaseStringOrEmpty(formatRunLabel(entry)).startsWith(lowered)), "Ambiguous subagent label prefix") ?? match(latest.filter((entry) => entry.runId.startsWith(trimmed)), "Ambiguous run id prefix") ?? fail(`Unknown subagent id: ${trimmed}`);
}
function resolveRequesterSessionKey(params, opts) {
	const commandTarget = normalizeOptionalString(params.ctx.CommandTargetSessionKey);
	const commandSession = normalizeOptionalString(params.sessionKey);
	const raw = opts?.preferCommandTarget ?? isNativeCommandTurn(resolveCommandTurnContext(params.ctx)) ? commandTarget || commandSession : commandSession || commandTarget;
	if (!raw) return;
	const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
	return resolveInternalSessionKey({
		key: raw,
		alias,
		mainKey
	});
}
function buildSubagentsHelp() {
	return [
		"Subagents",
		"Usage:",
		"- /subagents list",
		"- /subagents log <id|#> [limit] [tools]",
		"- /subagents info <id|#>",
		"- /session unbind",
		"- /agents",
		"- /session idle <duration|off>",
		"- /session max-age <duration|off>",
		"",
		"Ids: use the list index (#), runId/session prefix, label, or full session key."
	].join("\n");
}
function formatLogLines(messages) {
	const lines = [];
	for (const msg of messages) {
		const extracted = extractSubagentMessageText(msg);
		if (!extracted) continue;
		const label = extracted.role === "assistant" ? "Assistant" : "User";
		lines.push(`${label}: ${extracted.text}`);
	}
	return lines;
}
//#endregion
export { resolveSubagentEntryForToken as i, formatLogLines as n, resolveRequesterSessionKey as r, buildSubagentsHelp as t };
