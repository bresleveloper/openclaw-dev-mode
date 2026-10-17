import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-DjFUgH7e.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./agent-workspace-runtime-B_2-8Yo6.mjs";
import "./routing-CEr1aXk1.mjs";
import { t as resolveMemorySearchConfig } from "./memory-search-DFCytBn0.mjs";
import "./memory-core-host-engine-foundation-CsHcvVQs.mjs";
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
