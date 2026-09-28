import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-BNUXOhfF.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import { t as resolveMemorySearchConfig } from "./memory-search-D02aykS-.mjs";
import "./routing-JKvWkBDR.mjs";
import "./agent-workspace-runtime-8l4U0NcT.mjs";
import "./memory-core-host-engine-foundation-DgtNHcIh.mjs";
//#region extensions/memory-core/src/memory/search-manager.ts
const loadManagerRuntime = createLazyRuntimeModule(() => import("./extensions/memory-core/manager-runtime.js"));
async function getMemorySearchManager(params) {
	const startedAt = Date.now();
	return {
		...await getBuiltinMemorySearchManager(params),
		debug: {
			backend: "builtin",
			purpose: params.purpose ?? "default",
			managerMs: Math.max(0, Date.now() - startedAt)
		}
	};
}
async function getBuiltinMemorySearchManager(params) {
	try {
		const access = resolveMemorySearchConfig(params.cfg, params.agentId)?.sources.includes("memory") ? getAgentWorkspaceAccess(resolveAgentWorkspaceDir(params.cfg, params.agentId), "memoryFiles") : void 0;
		const { MemoryIndexManager } = await loadManagerRuntime();
		return { manager: await MemoryIndexManager.get({
			...params,
			memoryFiles: access?.memoryFiles
		}) };
	} catch (err) {
		return {
			manager: null,
			error: formatErrorMessage(err)
		};
	}
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
