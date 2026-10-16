import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./memory-core-host-engine-knn-DTjLOT03.mjs";
//#region extensions/memory-core/src/memory/manager-search-shared.ts
function projectMemorySearchRow(row, snippetMaxChars, score) {
	return {
		id: row.id,
		path: row.path,
		startLine: row.start_line,
		endLine: row.end_line,
		score,
		snippet: truncateUtf16Safe(row.text, snippetMaxChars),
		source: row.source
	};
}
function buildMemoryModelFilter(column, models) {
	return models.length === 1 ? `${column} = ?` : `${column} IN (${models.map(() => "?").join(", ")})`;
}
function resolveSnippetProjection(column, snippetMaxChars) {
	const snippetByteLimit = Number.isSafeInteger(snippetMaxChars) && snippetMaxChars > 0 ? snippetMaxChars * 4 : void 0;
	return {
		sql: snippetByteLimit === void 0 ? column : `COALESCE(CAST(substr(CAST(${column} AS BLOB), 1, ?) AS TEXT), ${column})`,
		params: snippetByteLimit === void 0 ? [] : [snippetByteLimit]
	};
}
//#endregion
export { projectMemorySearchRow as n, resolveSnippetProjection as r, buildMemoryModelFilter as t };
