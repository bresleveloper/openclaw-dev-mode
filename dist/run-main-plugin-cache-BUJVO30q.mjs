import { T as retirePluginCache, k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { n as pluginSourceCaptureMaintenance } from "./plugin-source-capture-context-BeR5LVZ8.mjs";
import { a as withCliCommandCleanup } from "./runtime-cleanup-scope-Dv2f28xK.mjs";
//#region src/cli/run-main-plugin-cache.ts
/** Executable commands own their inventory until Gateway publication adopts it. */
async function withCliPluginInvocation(gatewayRun, run) {
	return await withCliCommandCleanup(gatewayRun, async (cleanup) => {
		if (gatewayRun) return run();
		const cache = createPluginCache();
		cleanup?.pluginResources?.adopt({ async release() {
			if (cache.kind === "operation") {
				const result = await retirePluginCache(cache);
				if (result.failures.length > 0) throw new AggregateError(result.failures.map((failure) => failure.error), "CLI plugin inventory cleanup failed");
			}
		} });
		const invoke = () => withPluginCache(cache, () => run(cleanup));
		if (!cleanup?.pluginResources) return invoke();
		const resources = cleanup.pluginResources;
		return pluginSourceCaptureMaintenance.run({
			scheduler: cleanup.scheduler,
			run: (operation) => resources.run(operation)
		}, invoke);
	});
}
//#endregion
export { withCliPluginInvocation as t };
