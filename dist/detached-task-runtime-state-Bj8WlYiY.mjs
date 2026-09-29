import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { a as capturePluginRegistryLifecycleEpoch, c as getPluginRecordRegistry, i as capturePluginLifecycleAuthority, p as isPluginRegistryLifecycleEpochActive } from "./registry-lifecycle-BhTDZAHB.mjs";
import { y as requireActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
//#region src/tasks/detached-task-runtime-state.ts
function getRegisteredDetachedTaskLifecycleRuntime() {
	return requireActivePluginRegistry().detachedTaskRuntimes[0]?.runtime;
}
/** Core creation retains its activation; plugin work follows its exact live instance. */
function captureDetachedTaskRuntimeOwner() {
	const registry = requireActivePluginRegistry();
	const registration = registry.detachedTaskRuntimes[0];
	const runtime = registration?.runtime;
	const pluginId = registration?.pluginId;
	const record = registration ? registry.plugins.find((candidate) => candidate.id === pluginId) : void 0;
	const authority = record ? capturePluginLifecycleAuthority(getPluginRecordRegistry(registry, record), record) : void 0;
	const epoch = registration ? void 0 : capturePluginRegistryLifecycleEpoch(registry);
	return {
		runtime,
		assertCurrent() {
			if (registration) {
				const owner = record ? getPluginRecordRegistry(registry, record) : void 0;
				if (authority?.() && owner?.detachedTaskRuntimes.some((candidate) => candidate.pluginId === pluginId && candidate.runtime === runtime)) return;
			} else if (epoch && isPluginRegistryLifecycleEpochActive(registry, epoch) && getPluginRegistryForContext() === registry && registry.detachedTaskRuntimes[0] === void 0) return;
			throw new Error("Detached task runtime owner changed before task creation settled.");
		}
	};
}
//#endregion
export { getRegisteredDetachedTaskLifecycleRuntime as n, captureDetachedTaskRuntimeOwner as t };
