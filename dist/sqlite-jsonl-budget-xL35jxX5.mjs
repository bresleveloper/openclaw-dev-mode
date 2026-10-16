import { a as getNodeSqliteKysely, o as iterateSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { Buffer } from "node:buffer";
//#region src/infra/sqlite-jsonl-budget.ts
var SqliteJsonlReadBudgetExceededError = class extends Error {};
/** Admit a filtered JSONL source inside the caller's payload-read transaction. */
function assertSqliteJsonlReadBudget(database, source, budget, label, options = {}) {
	const db = getNodeSqliteKysely(database);
	const rejectOverflow = (bytes) => {
		if (bytes > budget) throw new SqliteJsonlReadBudgetExceededError(`${label} is too large to export (at least ${bytes} bytes; limit ${budget})`);
	};
	const sizes = iterateSqliteQuerySync(database, db.selectFrom(source).select((eb) => [
		eb.fn("octet_length", ["event_json"]).as("bytes"),
		(options.hasExactUtf8Bytes ? eb.ref("event_utf8_bytes") : eb.val(null)).as("utf8_bytes"),
		eb.selectFrom("pragma_encoding").select("encoding").as("encoding")
	]).$if(options.maxRows !== void 0, (query) => query.limit(options.maxRows + 1)));
	let rowCount = 0;
	let bytes = 0;
	let separator = 0;
	let knownBytes = 0;
	let separators = 0;
	let unknownRows = 0;
	for (const row of sizes) {
		rowCount += 1;
		if (options.maxRows !== void 0 && rowCount > options.maxRows) throw new SqliteJsonlReadBudgetExceededError(`${label} has too many rows to export (at least ${rowCount}; limit ${options.maxRows})`);
		const exact = row.utf8_bytes ?? (row.encoding === "UTF-8" ? row.bytes : null);
		if (exact === null && row.bytes === null) throw new Error(`${label} has a transcript row without byte metadata or identity text`);
		if (exact !== null) knownBytes += exact;
		else unknownRows += 1;
		bytes += (exact ?? Math.ceil(row.bytes / 2)) + separator;
		separators += separator;
		rejectOverflow(bytes);
		separator = options.separatorBytes ?? 1;
	}
	if (unknownRows === 0) return;
	bytes = knownBytes + separators;
	const unknown = db.selectFrom(source).select("event_json").$if(options.hasExactUtf8Bytes === true, (query) => query.where("event_utf8_bytes", "is", null));
	for (const row of iterateSqliteQuerySync(database, unknown)) {
		if (row.event_json === null) throw new Error(`${label} has a transcript row without identity text`);
		bytes += Buffer.byteLength(row.event_json, "utf8");
		rejectOverflow(bytes);
	}
}
//#endregion
export { assertSqliteJsonlReadBudget as n, SqliteJsonlReadBudgetExceededError as t };
