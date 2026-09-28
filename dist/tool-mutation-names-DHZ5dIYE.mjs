import { i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as extractApplyPatchTargetPaths } from "./apply-patch-paths-DztplzLA.mjs";
import path from "node:path";
//#region src/agents/file-mutation-args.ts
function readTarget(record) {
	const target = normalizeOptionalString(record.path ?? record.file_path ?? record.filePath);
	return target ? path.resolve(target) : void 0;
}
function readEdits(args) {
	return (Array.isArray(args.edits) ? args.edits : [args]).flatMap((candidate) => {
		const edit = asOptionalObjectRecord(candidate);
		return edit ? [edit] : [];
	});
}
function countNewlines(value) {
	if (typeof value !== "string") return 0;
	let count = 0;
	for (let index = value.indexOf("\n"); index >= 0; index = value.indexOf("\n", index + 1)) count += 1;
	return count;
}
function countCompletedLines(text) {
	if (!text) return 0;
	let count = countNewlines(text) + 1;
	for (let index = text.indexOf("\r"); index >= 0; index = text.indexOf("\r", index + 1)) if (text[index + 1] !== "\n") count += 1;
	return count;
}
/** Counts only newline-terminated content so partial streamed JSON never guesses a line. */
function countStreamingFileMutationLines(kind, args) {
	if (kind === "write") return {
		added: countNewlines(readStringField(args, "content")),
		removed: 0
	};
	if (kind === "edit") return readEdits(args).reduce((total, edit) => ({
		added: total.added + countNewlines(edit.newText ?? edit.new_string),
		removed: total.removed + countNewlines(edit.oldText ?? edit.old_string)
	}), {
		added: 0,
		removed: 0
	});
	const patch = args.input ?? args.patch;
	if (typeof patch !== "string") return {
		added: 0,
		removed: 0
	};
	let added = 0;
	let removed = 0;
	let lineStart = 0;
	for (let lineEnd = patch.indexOf("\n"); lineEnd >= 0; lineEnd = patch.indexOf("\n", lineStart)) {
		added += Number(patch[lineStart] === "+");
		removed += Number(patch[lineStart] === "-");
		lineStart = lineEnd + 1;
	}
	return {
		added,
		removed
	};
}
function readCodexChangeDelta(args) {
	const files = [];
	let added = 0;
	let removed = 0;
	for (const candidate of Array.isArray(args.changes) ? args.changes : []) {
		const change = asOptionalObjectRecord(candidate);
		const target = change ? readTarget(change) : void 0;
		if (!change || !target) continue;
		files.push(target);
		const stat = asOptionalObjectRecord(change.stat);
		added += typeof stat?.added === "number" && Number.isFinite(stat.added) ? Math.max(0, stat.added) : 0;
		removed += typeof stat?.removed === "number" && Number.isFinite(stat.removed) ? Math.max(0, stat.removed) : 0;
	}
	return files.length > 0 ? {
		files,
		added,
		removed
	} : void 0;
}
/** Reads complete tool arguments using task-fold line semantics. */
function readCompletedFileMutationDelta(kind, args) {
	if (kind === "apply_patch") {
		const patch = readStringField(args, "input");
		if (patch === void 0) return readCodexChangeDelta(args);
		const files = extractApplyPatchTargetPaths(args);
		if (files.length === 0) return;
		let added = 0;
		let removed = 0;
		let inBody = false;
		for (const line of patch.split(/\r\n|\r|\n/)) if (/^\s*\*\*\* (?:Add|Update|Delete) File: /.test(line)) inBody = true;
		else if (!/^\s*\*\* /.test(line) && inBody) {
			added += Number(line.startsWith("+"));
			removed += Number(line.startsWith("-"));
		}
		return {
			files,
			added,
			removed
		};
	}
	const target = readTarget(args);
	if (!target) return;
	if (kind === "write") {
		const content = readStringField(args, "content");
		return content === void 0 ? void 0 : {
			files: [target],
			added: countCompletedLines(content),
			removed: 0
		};
	}
	let added = 0;
	let removed = 0;
	let hasCompleteEdit = false;
	for (const edit of readEdits(args)) {
		const oldText = typeof edit.oldText === "string" ? edit.oldText : typeof edit.old_string === "string" ? edit.old_string : void 0;
		const newText = typeof edit.newText === "string" ? edit.newText : typeof edit.new_string === "string" ? edit.new_string : void 0;
		if (oldText === void 0 || newText === void 0) continue;
		hasCompleteEdit = true;
		added += countCompletedLines(newText);
		removed += countCompletedLines(oldText);
	}
	return hasCompleteEdit ? {
		files: [target],
		added,
		removed
	} : void 0;
}
//#endregion
//#region src/agents/tool-mutation-names.ts
const FILE_MUTATION_TOOL_NAMES = /* @__PURE__ */ new Set([
	"write",
	"edit",
	"apply_patch"
]);
function resolveFileMutationToolName(toolName) {
	const normalized = normalizeLowercaseStringOrEmpty(toolName);
	return FILE_MUTATION_TOOL_NAMES.has(normalized) ? normalized : void 0;
}
//#endregion
export { countStreamingFileMutationLines as n, readCompletedFileMutationDelta as r, resolveFileMutationToolName as t };
