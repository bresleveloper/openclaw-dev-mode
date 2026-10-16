import { y as parseDateStringTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as hasLegacyRuntimeContextEnvelope, m as labelRuntimeContextContent } from "./types-CQc6JNG4.mjs";
import "./src-UF9QYDzr.mjs";
//#region packages/agent-core/src/operator-messages.ts
const SYSTEM_UPDATE_MESSAGE_CUSTOM_TYPE = "openclaw.system-update";
/** The same kind survives raw messages, transcript entries, and bounded navigation. */
function getOpenClawSystemUpdateKind(value) {
	const entry = asOptionalRecord(value);
	const message = entry?.type === "message" ? asOptionalRecord(entry.message) : entry;
	if (!message || message.role !== "custom" && message.type !== "custom_message" || message.customType !== "openclaw.system-update") return;
	const kind = asOptionalRecord(message.details)?.kind;
	return kind === "prompt-update" || kind === "runtime-context" ? kind : void 0;
}
function isOpenClawSystemUpdateMessage(message) {
	return message.role === "custom" && message.customType === "openclaw.system-update";
}
/** Order only a newly admitted batch; previously sent operator positions are immutable. */
function orderSystemUpdateMessages(messages) {
	if (!messages.some(isOpenClawSystemUpdateMessage)) return messages;
	return [...messages.filter((message) => !isOpenClawSystemUpdateMessage(message)), ...messages.filter(isOpenClawSystemUpdateMessage)];
}
//#endregion
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
	const candidate = asOptionalRecord(message);
	const details = candidate?.role === "custom" ? asOptionalRecord(candidate.details) : void 0;
	return candidate?.role === "custom" && (candidate.customType === "openclaw.runtime-context" && (details?.source === "openclaw-runtime-context" && details.runtimeContextCarrier !== false || details?.source === void 0 && details?.runtimeContextCarrier === true) || getOpenClawSystemUpdateKind(message) === "runtime-context");
}
/** Convert harness transcript messages into the LLM-facing message sequence. */
function convertToLlm(messages) {
	const llmMessages = [];
	messages.forEach((message) => {
		let content;
		switch (message.role) {
			case "bashExecution":
				if (message.excludeFromContext) return;
				content = [{
					type: "text",
					text: bashExecutionToText(message)
				}];
				break;
			case "custom":
				if (message.excludeFromContext) return;
				content = typeof message.content === "string" ? [{
					type: "text",
					text: message.content
				}] : message.content;
				break;
			case "branchSummary":
				content = [{
					type: "text",
					text: BRANCH_SUMMARY_PREFIX + message.summary + BRANCH_SUMMARY_SUFFIX
				}];
				break;
			case "compactionSummary":
				content = [{
					type: "text",
					text: COMPACTION_SUMMARY_PREFIX + message.summary + COMPACTION_SUMMARY_SUFFIX
				}];
				break;
			case "user":
			case "assistant":
			case "toolResult":
				llmMessages.push(message);
				return;
			default: return;
		}
		const timestamp = message.role === "compactionSummary" ? normalizeCompactionSummaryTimestamp(message.timestamp) : message.timestamp;
		if (isRuntimeContextCarrier(message)) {
			if (content.some((block) => block.type === "image")) {
				llmMessages.push({
					role: "user",
					content,
					timestamp,
					runtimeContextCarrier: true
				});
				return;
			}
			const textContent = content.filter((block) => block.type === "text");
			const legacyContent = hasLegacyRuntimeContextEnvelope(textContent.map((block) => block.text).join("")) ? textContent : void 0;
			const runtimeContent = legacyContent ?? (typeof message.content === "string" ? message.content : textContent);
			llmMessages.push({
				role: "user",
				content: legacyContent ?? labelRuntimeContextContent(runtimeContent),
				timestamp,
				runtimeContext: {},
				runtimeContextCarrier: true
			});
		} else llmMessages.push({
			role: "user",
			content,
			timestamp
		});
	});
	return llmMessages;
}
//#endregion
export { bashExecutionToText as a, createCompactionSummaryMessage as c, SYSTEM_UPDATE_MESSAGE_CUSTOM_TYPE as d, getOpenClawSystemUpdateKind as f, COMPACTION_SUMMARY_SUFFIX as i, createCustomMessage as l, orderSystemUpdateMessages as m, BRANCH_SUMMARY_SUFFIX as n, convertToLlm as o, isOpenClawSystemUpdateMessage as p, COMPACTION_SUMMARY_PREFIX as r, createBranchSummaryMessage as s, BRANCH_SUMMARY_PREFIX as t, isRuntimeContextCarrier as u };
