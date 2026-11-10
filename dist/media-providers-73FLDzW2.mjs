import { s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { t as resolveModelRefOverride } from "./model-ref-override-smHu15tb.mjs";
import { i as providerHasGenericConfig } from "./shared-5qXqUkfk.mjs";
//#region src/cli/capability-cli/media-providers.ts
async function listGenerationProviders(kind, cfg, agentId) {
	const list = kind === "image" ? (await import("./runtime-B3pd61LP.mjs")).listRuntimeImageGenerationProviders : (await import("./runtime-BbxFCquo.mjs")).listRuntimeVideoGenerationProviders;
	const selectedProvider = resolveModelRefOverride(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.mediaModels?.[kind])).provider;
	return list({ config: cfg }).map((provider) => ({
		available: true,
		configured: selectedProvider === provider.id || providerHasGenericConfig({
			cfg,
			providerId: provider.id,
			agentId
		}),
		selected: selectedProvider === provider.id,
		id: provider.id,
		label: provider.label,
		defaultModel: provider.defaultModel,
		models: provider.models ?? [],
		capabilities: provider.capabilities
	}));
}
async function listUnderstandingProviders(kind, cfg, agentId) {
	const { buildMediaUnderstandingRegistry } = await import("./provider-registry-wh0S3g1D.mjs");
	return [...buildMediaUnderstandingRegistry(void 0, cfg).values()].filter((provider) => provider.capabilities?.includes(kind)).map((provider) => ({
		available: true,
		configured: providerHasGenericConfig({
			cfg,
			providerId: provider.id,
			agentId
		}),
		selected: false,
		id: provider.id,
		capabilities: provider.capabilities,
		defaultModels: provider.defaultModels
	}));
}
//#endregion
export { listGenerationProviders, listUnderstandingProviders };
