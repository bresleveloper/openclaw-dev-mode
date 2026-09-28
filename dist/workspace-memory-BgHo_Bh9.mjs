import { r as createWorkspaceMemoryFileClient } from "./agent-workspace-runtime-8l4U0NcT.mjs";
import { t as runNodeWorkspaceWorker } from "./workspace-worker-DNLnIjz-.mjs";
//#region extensions/file-transfer/src/workspace-memory.ts
/** Only transport changes: the shared client and native worker own Memory semantics. */
function createNodeWorkspaceMemory(options) {
	return createWorkspaceMemoryFileClient({
		workspaceDir: options.workspaceDir,
		remoteWorkspaceDir: options.remoteRoot,
		signal: options.signal,
		request: (request, signal) => runNodeWorkspaceWorker(options, "workspace.memory", {
			request,
			watch: false
		}, signal),
		subscribe: async (request, onLine, signal) => {
			await runNodeWorkspaceWorker(options, "workspace.memory", {
				request,
				watch: true
			}, signal, onLine);
		}
	});
}
//#endregion
export { createNodeWorkspaceMemory };
