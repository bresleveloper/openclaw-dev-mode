//#region src/infra/sqlite-schema-issues.ts
/** A completed inspection proved schema drift; native read failures retain their own type. */
var SqliteSchemaMismatchError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SqliteSchemaMismatchError";
	}
};
function isSqliteSchemaMismatchError(error) {
	return error instanceof Error && error.name === "SqliteSchemaMismatchError";
}
const ISSUE_DESCRIPTIONS = {
	"missing-table": "missing table",
	"missing-column": "column definitions differ for",
	"unexpected-column": "column definitions differ for",
	"column-definition-drift": "column definitions differ for",
	"table-constraint-drift": "table constraints differ for",
	"table-definition-drift": "table definition differs for",
	"missing-or-drifted-index": "missing or drifted index",
	"unexpected-unique-index": "unexpected unique index",
	"missing-or-drifted-trigger": "missing or drifted trigger",
	"unexpected-trigger": "unexpected trigger",
	"virtual-table-definition-drift": "virtual table definition differs for",
	"table-options-drift": "table options differ for"
};
function isColumnIssue(code) {
	return code === "column-definition-drift" || code === "missing-column" || code === "unexpected-column";
}
function defaultIssueMessage(code, objectName) {
	if (!Object.hasOwn(ISSUE_DESCRIPTIONS, code)) throw new Error("Unsupported SQLite schema issue code", { cause: code });
	const target = isColumnIssue(code) ? objectName.split(".", 1)[0] : objectName;
	return `${ISSUE_DESCRIPTIONS[code]} ${target}`;
}
function createSqliteSchemaIssue(code, objectName, message) {
	return {
		code,
		objectName,
		message: message ?? defaultIssueMessage(code, objectName)
	};
}
function legacySqliteSchemaIssueMessages(issues) {
	const columnIssueTables = new Set(issues.filter((issue) => isColumnIssue(issue.code)).map((issue) => issue.objectName.split(".", 1)[0]));
	return [...new Set(issues.filter((issue) => issue.code !== "table-constraint-drift" || !columnIssueTables.has(issue.objectName)).map((issue) => issue.message))];
}
function throwSqliteSchemaMismatches(databaseLabel, mismatches) {
	const shown = mismatches.slice(0, 8);
	if (mismatches.length > shown.length) shown.push(`${mismatches.length - shown.length} additional mismatch(es)`);
	throw new SqliteSchemaMismatchError(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: ${shown.join("; ")}; run openclaw doctor --fix to repair it.`);
}
//#endregion
export { throwSqliteSchemaMismatches as a, legacySqliteSchemaIssueMessages as i, createSqliteSchemaIssue as n, isSqliteSchemaMismatchError as r, SqliteSchemaMismatchError as t };
