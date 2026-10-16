import { FILE_HEADERS_ONLY, formatPatch, structuredPatch } from "diff";
//#region src/agents/sessions/tools/file-diff.ts
/** Both receipts describe the same hunks from one diff computation. */
function prepareFileDiff(path, oldContent, newContent, options = {}) {
	const patch = structuredPatch(path, path, oldContent, newContent, void 0, void 0, {
		context: 4,
		...options
	});
	if (!patch) return;
	return {
		...formatDiffString(oldContent, newContent, patch.hunks),
		patch: formatPatch(patch, FILE_HEADERS_ONLY)
	};
}
function formatDiffString(oldContent, newContent, hunks) {
	const oldLineCount = oldContent.split("\n").length;
	const newLineCount = newContent.split("\n").length;
	const lastNewLine = newContent === "" ? 0 : newLineCount - Number(newContent.endsWith("\n"));
	const lineNumWidth = String(Math.max(oldLineCount, newLineCount)).length;
	const ellipsis = ` ${"".padStart(lineNumWidth, " ")} ...`;
	const output = [];
	let firstChangedLine;
	for (const [hunkIndex, hunk] of hunks.entries()) {
		if (hunkIndex > 0 || hunk.newStart > 1) output.push(ellipsis);
		let oldLineNum = hunk.oldStart;
		let newLineNum = hunk.newStart;
		for (const line of hunk.lines) {
			const prefix = line[0];
			if (prefix === "\\") continue;
			if (firstChangedLine === void 0 && prefix !== " ") firstChangedLine = newLineNum;
			const lineNum = prefix === "-" ? oldLineNum : newLineNum;
			output.push(`${prefix}${String(lineNum).padStart(lineNumWidth, " ")} ${line.slice(1)}`);
			oldLineNum += prefix === "+" ? 0 : 1;
			newLineNum += prefix === "-" ? 0 : 1;
		}
		if (hunkIndex === hunks.length - 1 && hunk.newStart + hunk.newLines <= lastNewLine) output.push(ellipsis);
	}
	return {
		diff: output.join("\n"),
		firstChangedLine
	};
}
const WRITE_DIFF_MAX_BYTES = 1048576;
const WRITE_DIFF_MAX_COMBINED_LINES = 2e4;
const WRITE_DIFF_MAX_EDIT_LENGTH = 2e3;
function countNewlines(text) {
	let count = 0;
	for (let index = text.indexOf("\n"); index !== -1; index = text.indexOf("\n", index + 1)) count += 1;
	return count;
}
function prepareFileWriteDiff(params) {
	const beforeText = params.created ? "" : params.beforeText;
	if (beforeText === void 0 || beforeText.includes("�") || beforeText.includes("\0") || Buffer.byteLength(beforeText, "utf8") + Buffer.byteLength(params.content, "utf8") > 1048576 || countNewlines(beforeText) + countNewlines(params.content) > WRITE_DIFF_MAX_COMBINED_LINES) return;
	return prepareFileDiff(params.path, beforeText, params.content, params.created ? {} : { maxEditLength: WRITE_DIFF_MAX_EDIT_LENGTH });
}
//#endregion
export { prepareFileDiff as n, prepareFileWriteDiff as r, WRITE_DIFF_MAX_BYTES as t };
