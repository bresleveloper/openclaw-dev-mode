import { t as resolveMemoryBackendConfig } from "./backend-config-CNg8FV-B.js";
import "./memory-core-host-runtime-files-DhQaFj2Q.js";
import { n as closeMemorySearchManager, r as getMemorySearchManager, t as closeAllMemorySearchManagers } from "./memory-CjIUlc7a.js";
//#region extensions/memory-core/src/runtime-provider.ts
const memoryRuntime = {
	async getMemorySearchManager(params) {
		const { manager, error } = await getMemorySearchManager(params);
		return {
			manager,
			error
		};
	},
	resolveMemoryBackendConfig(params) {
		return resolveMemoryBackendConfig(params);
	},
	async closeAllMemorySearchManagers() {
		await closeAllMemorySearchManagers();
	},
	async closeMemorySearchManager(params) {
		await closeMemorySearchManager(params);
	}
};
//#endregion
export { memoryRuntime as t };
