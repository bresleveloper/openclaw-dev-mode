import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as resolveMemorySearchConfig } from "./memory-search-Fa28vl7G.mjs";
import { r as resolveSharedMemoryStatusSnapshot } from "./status.scan.shared-nZYaXUN8.mjs";
//#region src/commands/status.scan-memory.ts
/** Returns the owning agent database path for built-in memory. */
function resolveDefaultMemoryDatabasePath(agentId) {
	return resolveOpenClawAgentSqlitePath({ agentId });
}
/** Resolves memory index/cache status for the current status scan. */
async function resolveStatusMemoryStatusSnapshot(params) {
	const { getMemoryProvider, getMemorySearchManager, isMemoryProviderNative } = await import("./status.scan.deps.runtime.js");
	return await resolveSharedMemoryStatusSnapshot({
		cfg: params.cfg,
		agentStatus: params.agentStatus,
		memoryPlugin: params.memoryPlugin,
		resolveMemoryConfig: resolveMemorySearchConfig,
		getMemorySearchManager,
		getMemoryProvider,
		isMemoryProviderNative,
		requireDefaultDatabasePath: params.requireDefaultDatabasePath
	});
}
//#endregion
export { resolveDefaultMemoryDatabasePath, resolveStatusMemoryStatusSnapshot };
