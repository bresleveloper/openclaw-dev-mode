import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { T as retirePluginCache, k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CjTFYNkp.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-BWMrcMOM.mjs";
import { i as getPluginRuntimeLoadContext } from "./load-context-YqkPeFye.mjs";
//#region src/plugins/tool-inspection-state.ts
const inspectionToolOwners = /* @__PURE__ */ new WeakMap();
function createPluginToolInspection(acquisition, manifests) {
	const current = capturePluginLifecycleAuthority(acquisition.registry, void 0, { scopedRuntime: true });
	let supplementalCache;
	let release;
	const assertCurrent = () => {
		if (release || !current?.()) throw new Error("Plugin tool inspection has been released");
	};
	inspectionToolOwners.set(acquisition.registry, {
		manifests,
		assertCurrent,
		withSupplementalCache: (run) => {
			assertCurrent();
			return withPluginCache(supplementalCache ??= createPluginCache(), run);
		}
	});
	return {
		registry: acquisition.registry,
		release: () => {
			if (release) return release;
			const completion = createDeferredCore();
			release = completion.promise;
			Promise.allSettled([(async () => await acquisition.release())(), (async () => {
				if (supplementalCache) {
					const { failures } = await retirePluginCache(supplementalCache);
					if (failures.length === 1) throw failures[0].error;
					if (failures.length > 0) throw new AggregateError(failures.map((failure) => failure.error), "Supplemental plugin inspection cleanup failed");
				}
			})()]).then((cleanup) => {
				const failures = cleanup.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
				if (failures.length === 1) throw failures[0];
				if (failures.length > 0) throw new AggregateError(failures, "Plugin tool inspection cleanup failed");
			}).then(completion.resolve, completion.reject);
			return release;
		}
	};
}
function getCurrentPluginToolInspection(config, env, workspaceDir) {
	const registry = getPluginRuntimeGenerationRegistry() ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const inspection = registry && inspectionToolOwners.get(registry);
	const loadContext = inspection && getPluginRuntimeLoadContext(registry);
	if (!registry || !inspection || loadContext?.env !== env || workspaceDir !== void 0 && workspaceDir !== loadContext.workspaceDir || config !== loadContext.rawConfig && config !== loadContext.config && config !== loadContext.activationSourceConfig) return;
	inspection.assertCurrent();
	return {
		registry,
		inspection,
		loadContext
	};
}
function samePluginToolSource(left, right) {
	return Boolean(left && right && left.origin === right.origin && left.rootDir === right.rootDir && left.source === right.source && left.setupSource === right.setupSource && left.sourcePreferred === true === (right.sourcePreferred === true) && left.packageManifest?.build?.bundledDist === false === (right.packageManifest?.build?.bundledDist === false));
}
//#endregion
export { samePluginToolSource as i, getCurrentPluginToolInspection as n, inspectionToolOwners as r, createPluginToolInspection as t };
