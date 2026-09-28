import { h as stripReasoningTagsFromText } from "./assistant-visible-text-CVgfl6Gk.mjs";
//#region src/shared/text/formatted-reasoning-message.ts
/** Strip provider-formatted Reasoning/Thinking preambles from visible text. */
function stripFormattedReasoningMessage(text) {
	const stripped = stripReasoningTagsFromText(text, { trim: "none" });
	const preamble = stripped === text ? stripped : stripped.trimStart();
	const firstNewline = preamble.indexOf("\n");
	const prefix = (firstNewline === -1 ? preamble : preamble.slice(0, firstNewline)).trim();
	const thinking = /^Thinking\.{0,3}$/u.test(prefix);
	if (prefix !== "Reasoning:" && !thinking) return preamble ? stripped : "";
	let offset = firstNewline === -1 ? preamble.length : firstNewline + 1;
	let hasSummary = false;
	while (offset < preamble.length) {
		const newline = preamble.indexOf("\n", offset);
		const end = newline === -1 ? preamble.length : newline;
		const line = preamble.slice(offset, end).trim();
		const isSummary = line.length >= 2 && line.startsWith("_") && line.endsWith("_");
		if (line && !isSummary) break;
		hasSummary ||= isSummary;
		offset = end + 1;
	}
	return thinking && !hasSummary ? stripped : preamble.slice(offset).replace(/\r\n/g, "\n").replace(/\n+$/u, "");
}
//#endregion
export { stripFormattedReasoningMessage as t };
