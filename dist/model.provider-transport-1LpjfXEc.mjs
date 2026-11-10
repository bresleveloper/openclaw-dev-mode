import { p as normalizeProviderTransportWithPlugin } from "./provider-runtime-DZ8luukj.mjs";
import { r as normalizeResolvedTransportApi } from "./model.inline-provider-DwjZUIZW.mjs";
//#region src/agents/embedded-agent-runner/model.provider-transport.ts
function resolveProviderTransport(params) {
	const normalized = (params.runtimeHooks ?? { normalizeProviderTransportWithPlugin }).normalizeProviderTransportWithPlugin({
		provider: params.provider,
		...params.modelId ? { modelId: params.modelId } : {},
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			...params.modelId ? { modelId: params.modelId } : {},
			api: params.api,
			baseUrl: params.baseUrl
		}
	});
	return {
		api: normalizeResolvedTransportApi(normalized?.api ?? params.api),
		baseUrl: normalized?.baseUrl ?? params.baseUrl
	};
}
//#endregion
export { resolveProviderTransport as t };
