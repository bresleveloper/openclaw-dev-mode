import { MEMORY_TABLE_NAME, hasAgentScopeColumn, legacyMemorySchemaError, memoryAgentPredicate } from "./lancedb-schema.js";
import { memoryStatsRuntimeEntrypoint } from "./memory-stats-entrypoint.js";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveRuntimeWorkerArgv, resolveRuntimeWorkerUrl, runUtf8CommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
//#region extensions/memory-lancedb/memory-stats.ts
const STATS_READER = `
import { readFileSync } from "node:fs";
const input = JSON.parse(readFileSync(0, "utf8"));
let db;
let table;
const result = {};
try {
  const { loadLanceDbModule } = await import(input.moduleUrl);
  const lancedb = await loadLanceDbModule();
  db = await lancedb.connect(input.dbPath, { storageOptions: input.storageOptions });
  if ((await db.tableNames()).includes(input.tableName)) {
    table = await db.openTable(input.tableName);
    result.columns = (await table.schema()).fields.map((field) => field.name);
    result.count = await table.countRows(input.predicate);
  } else {
    result.count = 0;
  }
} catch (error) {
  result.error = String(error);
} finally {
  table?.close();
  db?.close();
}
process.stdout.write(JSON.stringify(result));
`;
async function readMemoryStats(source, agentId) {
	const moduleUrl = resolveRuntimeWorkerUrl(memoryStatsRuntimeEntrypoint);
	const preload = resolveRuntimeWorkerArgv(moduleUrl).slice(0, -1);
	const result = await runUtf8CommandWithTimeout([
		process.execPath,
		...preload,
		"--input-type=module",
		"--eval",
		STATS_READER
	], {
		input: JSON.stringify({
			...source,
			moduleUrl: moduleUrl.href,
			tableName: MEMORY_TABLE_NAME,
			predicate: memoryAgentPredicate(agentId)
		}),
		timeoutMs: 6e4,
		killProcessTree: true,
		requireProcessTreeExtinction: true,
		maxOutputBytes: 65536
	});
	if (result.cleanup === "uncertain") throw new Error("memory-lancedb: statistics reader stopped responding; process cleanup could not be confirmed. Check the local process before retrying.");
	if (result.termination === "timeout") throw new Error("memory-lancedb: statistics timed out after 60 seconds; the reader was stopped. Check database availability, then retry.");
	if (result.code !== 0 || result.termination !== "exit") throw new Error(`memory-lancedb: statistics reader failed (${result.termination}, exit ${result.code}). ${result.stderr.trim()}`);
	const reply = asOptionalRecord(JSON.parse(result.stdout));
	const columns = reply?.columns;
	if (Array.isArray(columns) && columns.every((column) => typeof column === "string") && !hasAgentScopeColumn({ fields: columns.map((name) => ({ name })) })) throw legacyMemorySchemaError();
	if (typeof reply?.error === "string") throw new Error(`memory-lancedb: statistics failed: ${reply.error}`);
	if (typeof reply?.count !== "number" || !Number.isSafeInteger(reply.count) || reply.count < 0) throw new Error("memory-lancedb: statistics reader returned an invalid count.");
	return reply.count;
}
//#endregion
export { readMemoryStats };
