import { y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { f as selectResetKeptEntries } from "./tool-result-pairing-Bky0eubt.mjs";
import { stripCompactionReplayCheckpoint } from "@openclaw/ai/transports";
//#region packages/agent-core/src/harness/messages.ts
function requireSessionTimestampMs(value, label) {
	const parsed = parseDateStringTimestampMs(value);
	if (parsed === void 0) throw new Error(`${label} must be a valid timestamp`);
	return parsed;
}
function normalizeCompactionSummaryTimestamp(timestamp) {
	if (typeof timestamp === "number") return timestamp;
	return parseDateStringTimestampMs(timestamp) ?? 0;
}
const COMPACTION_SUMMARY_PREFIX = `The conversation history before this point was compacted into the following summary:

<summary>
`;
const COMPACTION_SUMMARY_SUFFIX = `
</summary>`;
const BRANCH_SUMMARY_PREFIX = `The following is a summary of a branch that this conversation came back from:

<summary>
`;
const BRANCH_SUMMARY_SUFFIX = `</summary>`;
/** Render a shell execution record as user-visible context text for the model. */
function bashExecutionToText(msg) {
	let text = `Ran \`${msg.command}\`\n`;
	if (msg.output) text += `\`\`\`\n${msg.output}\n\`\`\``;
	else text += "(no output)";
	if (msg.cancelled) text += "\n\n(command cancelled)";
	else if (msg.exitCode !== null && msg.exitCode !== void 0 && msg.exitCode !== 0) text += `\n\nCommand exited with code ${msg.exitCode}`;
	if (msg.truncated && msg.fullOutputPath) text += `\n\n[Output truncated. Full output: ${msg.fullOutputPath}]`;
	return text;
}
/** Build a persisted branch summary message from the repository timestamp string. */
function createBranchSummaryMessage(summary, fromId, timestamp) {
	return {
		role: "branchSummary",
		summary,
		fromId,
		timestamp: requireSessionTimestampMs(timestamp, "branch summary timestamp")
	};
}
/** Build a persisted compaction summary message from the repository timestamp string. */
function createCompactionSummaryMessage(summary, tokensBefore, timestamp) {
	return {
		role: "compactionSummary",
		summary,
		tokensBefore,
		timestamp: requireSessionTimestampMs(timestamp, "compaction summary timestamp")
	};
}
/** Build a custom transcript message that can be shown and replayed into context. */
function createCustomMessage(customType, content, display, details, timestamp) {
	return {
		role: "custom",
		customType,
		content,
		display,
		details,
		timestamp: requireSessionTimestampMs(timestamp, "custom message timestamp")
	};
}
/** Recognize the structured carrier marker shared with provider replay. */
function isRuntimeContextCarrier(message) {
	return message.role === "custom" && asOptionalRecord(message.details)?.runtimeContextCarrier === true;
}
/** Convert harness transcript messages into the LLM-facing message sequence. */
function convertToLlm(messages) {
	const llmMessages = [];
	messages.forEach((message) => {
		switch (message.role) {
			case "bashExecution":
				if (message.excludeFromContext) return;
				llmMessages.push({
					role: "user",
					content: [{
						type: "text",
						text: bashExecutionToText(message)
					}],
					timestamp: message.timestamp
				});
				break;
			case "custom": {
				if (message.excludeFromContext) return;
				const content = typeof message.content === "string" ? [{
					type: "text",
					text: message.content
				}] : message.content;
				llmMessages.push({
					role: "user",
					content,
					timestamp: message.timestamp,
					...isRuntimeContextCarrier(message) ? { runtimeContextCarrier: true } : {}
				});
				break;
			}
			case "branchSummary":
				llmMessages.push({
					role: "user",
					content: [{
						type: "text",
						text: BRANCH_SUMMARY_PREFIX + message.summary + BRANCH_SUMMARY_SUFFIX
					}],
					timestamp: message.timestamp
				});
				break;
			case "compactionSummary":
				llmMessages.push({
					role: "user",
					content: [{
						type: "text",
						text: COMPACTION_SUMMARY_PREFIX + message.summary + COMPACTION_SUMMARY_SUFFIX
					}],
					timestamp: normalizeCompactionSummaryTimestamp(message.timestamp)
				});
				break;
			case "user":
			case "assistant":
			case "toolResult": llmMessages.push(message);
		}
	});
	return llmMessages;
}
//#endregion
//#region packages/agent-core/src/harness/session/session.ts
const SESSION_HISTORY_PRELUDE = Symbol.for("openclaw.sessionHistoryPrelude");
/** The same semantic cut is used before payload acquisition and when building messages. */
function resolveSessionContextWindow(entries) {
	const boundaryIndex = entries.findLastIndex((entry) => entry.type === "reset" || entry.type === "compaction");
	const firstKeptIndex = entries.findIndex((entry) => entry.id === entries[boundaryIndex]?.firstKeptEntryId);
	return {
		boundaryIndex,
		firstKeptIndex: firstKeptIndex >= 0 && firstKeptIndex < boundaryIndex ? firstKeptIndex : boundaryIndex
	};
}
/** Project persisted session entries into the message shared by replay and summarization. */
function projectSessionEntryMessage(entry) {
	switch (entry.type) {
		case "message": return "excludeFromContext" in entry.message && entry.message.excludeFromContext === true ? void 0 : entry.message;
		case "custom_message": return createCustomMessage(entry.customType, entry.content, entry.display, entry.details, entry.timestamp);
		case "branch_summary": return createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp);
		case "compaction": return createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp);
		default: return;
	}
}
/** Select the canonical window using only navigation and tool-pairing facts. */
function* iterateSessionContextEntries(pathEntries) {
	const { boundaryIndex, firstKeptIndex } = resolveSessionContextWindow(pathEntries);
	const boundary = pathEntries[boundaryIndex];
	const resetKept = boundary?.type === "reset" ? new Set(selectResetKeptEntries(pathEntries.slice(firstKeptIndex, boundaryIndex))) : void 0;
	if (boundary) yield {
		entry: boundary,
		context: "current"
	};
	let index = -1;
	for (const entry of pathEntries) {
		index += 1;
		const retained = index < boundaryIndex;
		if (index === boundaryIndex || retained && (index < firstKeptIndex || resetKept && !resetKept.has(entry))) continue;
		if (!(entry.type === "message" || entry.type === "custom_message" || entry.type === "branch_summary") || !resetKept?.has(entry) && entry.type === "message" && "excludeFromContext" in entry.message && entry.message.excludeFromContext === true) continue;
		yield {
			entry,
			context: retained ? resetKept ? "reset-retained" : "retained" : "current"
		};
	}
}
/** Hydrate selected messages lazily so bounded consumers can stop before later payloads. */
function* iterateSessionContextMessages(pathEntries, readEntry = (entry) => entry) {
	for (const { entry, context } of iterateSessionContextEntries(pathEntries)) {
		if (entry.type === "reset") continue;
		const hydrated = readEntry(entry);
		if (hydrated.type === "branch_summary" && !hydrated.summary) continue;
		let message = context === "reset-retained" && hydrated.type === "message" ? hydrated.message : projectSessionEntryMessage(hydrated);
		if (!message) continue;
		if (context !== "current" && message.role === "assistant") message = stripCompactionReplayCheckpoint(message);
		if (context === "reset-retained" && (message.role === "user" || message.role === "assistant")) {
			message = { ...message };
			Object.defineProperty(message, SESSION_HISTORY_PRELUDE, {
				configurable: true,
				enumerable: false,
				value: true
			});
		}
		yield message;
	}
}
/** Build model context from an ordered session branch and its latest state markers. */
function buildSessionContext(pathEntries) {
	let thinkingLevel = "off";
	let model = null;
	for (const entry of pathEntries) if (entry.type === "thinking_level_change") thinkingLevel = entry.thinkingLevel;
	else if (entry.type === "model_change") model = {
		provider: entry.provider,
		modelId: entry.modelId
	};
	else if (entry.type === "message" && entry.message.role === "assistant") model = {
		provider: entry.message.provider,
		modelId: entry.message.model
	};
	return {
		messages: Array.from(iterateSessionContextMessages(pathEntries)),
		thinkingLevel,
		model
	};
}
//#endregion
export { BRANCH_SUMMARY_PREFIX as a, COMPACTION_SUMMARY_SUFFIX as c, isRuntimeContextCarrier as d, projectSessionEntryMessage as i, bashExecutionToText as l, iterateSessionContextEntries as n, BRANCH_SUMMARY_SUFFIX as o, iterateSessionContextMessages as r, COMPACTION_SUMMARY_PREFIX as s, buildSessionContext as t, convertToLlm as u };
