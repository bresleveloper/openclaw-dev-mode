import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./agent-workspace-runtime-x7RZOSxd.mjs";
import "./routing-Dl7FngGa.mjs";
import { n as resolveMemorySearchConfig } from "./memory-search-Fa28vl7G.mjs";
import "./memory-core-host-engine-foundation-Cj49LzJw.mjs";
//#region extensions/memory-core/src/memory/search-manager.ts
const loadManagerRuntime = createLazyRuntimeModule(() => import("./extensions/memory-core/manager-runtime.js"));
async function getMemorySearchManager(params) {
	const startedAt = Date.now();
	let result;
	try {
		const access = resolveMemorySearchConfig(params.cfg, params.agentId)?.sources.includes("memory") ? getAgentWorkspaceAccess(resolveAgentWorkspaceDir(params.cfg, params.agentId), "memoryFiles") : void 0;
		const { MemoryIndexManager } = await loadManagerRuntime();
		result = { manager: await MemoryIndexManager.get({
			...params,
			memoryFiles: access?.memoryFiles
		}) };
	} catch (err) {
		result = {
			manager: null,
			error: formatErrorMessage(err)
		};
	}
	return {
		...result,
		debug: {
			backend: "builtin",
			purpose: params.purpose ?? "default",
			managerMs: Math.max(0, Date.now() - startedAt)
		}
	};
}
async function closeAllMemorySearchManagers() {
	if (!loadManagerRuntime.peek()) return;
	const { closeAllMemoryIndexManagers } = await loadManagerRuntime();
	await closeAllMemoryIndexManagers();
}
async function closeMemorySearchManager(params) {
	if (!loadManagerRuntime.peek()) return;
	const { closeMemoryIndexManagersForAgent } = await loadManagerRuntime();
	await closeMemoryIndexManagersForAgent({ agentId: normalizeAgentId(params.agentId) });
}
//#endregion
export { closeMemorySearchManager as n, getMemorySearchManager as r, closeAllMemorySearchManagers as t };
