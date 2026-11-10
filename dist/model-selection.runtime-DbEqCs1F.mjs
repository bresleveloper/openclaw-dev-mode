import "./model-ref-shared-BRJ3VRZV.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-BWMrcMOM.mjs";
import { T as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { n as resolvePluginProviderRegistryCore } from "./providers.runtime-CGIaZ9Jy.mjs";
//#region src/commands/models/model-selection.runtime.ts
/** Prepares only the provider owners needed by a model config mutation. */
function withModelCommandProviderRuntime(params, run) {
	const retainedRegistry = getPluginRuntimeGenerationRegistry();
	const config = params.runtimeConfig;
	const env = process.env;
	const workspaceDir = tryResolveConfiguredAgentWorkspaceDir(config, env);
	const metadataSnapshot = loadManifestMetadataSnapshot({
		config,
		env,
		workspaceDir
	});
	const providerRefs = /* @__PURE__ */ new Set();
	const modelRefs = /* @__PURE__ */ new Set();
	const selections = withPluginRuntimeGenerationScope({ metadataSnapshot }, params.selectModelRefs);
	for (const ref of selections) if (ref) {
		providerRefs.add(ref.provider);
		modelRefs.add(modelKey(ref.provider, ref.model));
	}
	const selected = providerRefs.size ? resolvePluginProviderRegistryCore({
		config,
		env,
		workspaceDir,
		pluginMetadataSnapshot: metadataSnapshot,
		providerRefs: [...providerRefs],
		modelRefs: [...modelRefs],
		registryScope: "exact",
		activate: false
	}) : void 0;
	return withPluginRuntimeGenerationScope({
		metadataSnapshot,
		pluginRegistry: selected?.registry
	}, () => run(!retainedRegistry || retainedRegistry.providers.length > 0));
}
//#endregion
export { withModelCommandProviderRuntime };
