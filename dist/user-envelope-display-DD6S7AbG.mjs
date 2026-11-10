import { t as stripEnvelope } from "./chat-envelope-J_kChd5G.mjs";
import { n as findMarkdownCodeRegions } from "./reasoning-tags-DOZ8HVZL.mjs";
import { a as isInsideCode } from "./code-regions-Cy_WAn7O.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-DM667iyR.mjs";
//#region src/shared/subagent-task-display.ts
const SUBAGENT_TASK_PREFIX = /^\[Subagent Context\] You are running as a subagent \(depth \d+\/\d+\)\. Complete the current \[Subagent Task\]; inherited conversation is background context, not your assignment\.\n\n(?:\[Subagent Context\] This subagent session is persistent and remains available for thread follow-up messages\.\n\n)?\[Subagent Task\]\n\n/u;
const SUBAGENT_TASK_SUFFIX = "\n\nBegin. Execute the assigned task to completion.";
/** Projects a legacy generated task envelope without rewriting transcript bytes. */
function stripSubagentTaskEnvelopeForDisplay(text) {
	const prefix = text.match(SUBAGENT_TASK_PREFIX);
	if (!prefix) return text;
	const task = text.slice(prefix[0].length);
	return task.endsWith(SUBAGENT_TASK_SUFFIX) ? task.slice(0, -49) : task;
}
//#endregion
//#region src/shared/text/message-id-hints.ts
const MESSAGE_ID_LINE = /^\s*\[message_id:\s*[^\]]+\]\s*$/i;
/** Removes standalone message-id hint lines without touching inline user mentions. */
function stripMessageIdHints(text) {
	if (!/\[message_id:/i.test(text)) return text;
	const normalized = text.replace(/\r\n/g, "\n");
	const lines = normalized.split("\n");
	let offset = 0;
	let regions;
	const filtered = lines.filter((line) => {
		const markerOffset = line.search(/\[message_id:/i);
		const shouldRemove = markerOffset >= 0 && MESSAGE_ID_LINE.test(line) && !isInsideCode(offset + markerOffset, regions ??= findMarkdownCodeRegions(normalized));
		offset += line.length + 1;
		return !shouldRemove;
	});
	return filtered.length === lines.length ? text : filtered.join("\n");
}
//#endregion
//#region src/auto-reply/reply/user-envelope-display.ts
function stripUserEnvelopeForDisplay(text) {
	return stripSubagentTaskEnvelopeForDisplay(stripMessageIdHints(stripEnvelope(stripInternalMetadataForDisplay(text))));
}
//#endregion
export { stripUserEnvelopeForDisplay as t };
