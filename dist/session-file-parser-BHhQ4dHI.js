import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/agents/sessions/session-file-parser.ts
function isSessionFileEntry(value) {
	if (!isRecord(value) || typeof value.type !== "string") return false;
	if (value.type !== "message") return true;
	return isRecord(value.message) && typeof value.message.role === "string";
}
function parseSessionFileEntriesWithWarnings(content) {
	const entries = [];
	const warnings = [];
	const rowByEntry = /* @__PURE__ */ new Map();
	const rows = content.split(/\r?\n/u);
	for (const [index, rawLine] of rows.entries()) {
		const line = rawLine.trim();
		if (!line) continue;
		try {
			const entry = JSON.parse(line);
			if (!isSessionFileEntry(entry)) {
				warnings.push({
					code: "invalid-session-row",
					row: index + 1
				});
				continue;
			}
			entries.push(entry);
			rowByEntry.set(entry, index + 1);
		} catch {
			warnings.push({
				code: "invalid-session-json",
				row: index + 1
			});
		}
	}
	return {
		entries,
		warnings,
		rowByEntry
	};
}
//#endregion
export { parseSessionFileEntriesWithWarnings as t };
