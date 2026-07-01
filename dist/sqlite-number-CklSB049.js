//#region src/infra/sqlite-number.ts
/** Converts a SQLite number or bigint column into a JavaScript number. */
function normalizeSqliteNumber(value) {
	if (typeof value === "bigint") return Number(value);
	return typeof value === "number" ? value : void 0;
}
//#endregion
export { normalizeSqliteNumber as t };
