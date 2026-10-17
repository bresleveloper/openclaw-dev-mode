import { w as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./model-ref-shared-KBg0y299.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { n as resolvePluginProviderRegistryCore } from "./providers.runtime-BsABoqOU.mjs";
//#region src/commands/models/model-selection.runtime.ts
/** Prepares only the provider owners needed by a model config mutation. */
function withModelCommandProviderRuntime(params, run) {
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
	}, run);
}
//#endregion
export { withModelCommandProviderRuntime };
