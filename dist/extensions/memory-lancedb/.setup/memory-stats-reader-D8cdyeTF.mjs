import { t as acquireMemoryTableUsage } from "./lancedb-custody-BXEYogVG.mjs";
import { readFileSync } from "node:fs";
// extensions/memory-lancedb/memory-stats-reader.ts
async function runMemoryStatsReader(loadLanceDbModule) {
	const input = JSON.parse(readFileSync(0, "utf8"));
	let db;
	let table;
	let usage = null;
	const result = {};
	try {
		usage = await acquireMemoryTableUsage(input.dbPath, input.fileLockUrl ? await import(input.fileLockUrl) : void 0);
		db = await (await loadLanceDbModule()).connect(input.dbPath, { storageOptions: input.storageOptions });
		if ((await db.tableNames()).includes(input.tableName)) {
			table = await db.openTable(input.tableName);
			result.columns = (await table.schema()).fields.map((field) => field.name);
			result.count = await table.countRows(input.predicate);
		} else result.count = 0;
	} catch (error) {
		result.error = String(error);
	} finally {
		table?.close();
		db?.close();
		await usage?.release();
	}
	process.stdout.write(JSON.stringify(result));
}
export { runMemoryStatsReader as t };
