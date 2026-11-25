import { a as legacyMemorySchemaError, i as hasAgentScopeColumn, o as memoryAgentPredicate, r as MEMORY_TABLE_NAME } from "./.setup/lancedb-schema-Cn7oifJZ.mjs";
import { t as memoryStatsRuntimeEntrypoint } from "./.setup/memory-stats-entrypoint-C9mmwK31.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveRuntimeWorkerArgv, resolveRuntimeWorkerUrl, runUtf8CommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { isStringArray } from "openclaw/plugin-sdk/collection-input-runtime";
// extensions/memory-lancedb/memory-stats.ts
async function readMemoryStats(source, agentId) {
	const moduleUrl = resolveRuntimeWorkerUrl(memoryStatsRuntimeEntrypoint);
	const result = await runUtf8CommandWithTimeout([process.execPath, ...resolveRuntimeWorkerArgv(moduleUrl)], {
		input: JSON.stringify({
			...source,
			fileLockUrl: moduleUrl.pathname.endsWith(".ts") ? import.meta.resolve("openclaw/plugin-sdk/file-lock") : void 0,
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
	if (isStringArray(columns) && !hasAgentScopeColumn({ fields: columns.map((name) => ({ name })) })) throw legacyMemorySchemaError();
	if (typeof reply?.error === "string") throw new Error(`memory-lancedb: statistics failed: ${reply.error}`);
	if (typeof reply?.count !== "number" || !Number.isSafeInteger(reply.count) || reply.count < 0) throw new Error("memory-lancedb: statistics reader returned an invalid count.");
	return reply.count;
}
export { readMemoryStats };
