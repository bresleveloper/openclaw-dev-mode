//#region src/agents/image-compression-policy.ts
const resolveModelAsyncDefault = async (...args) => {
	const { resolveModelAsync } = await import("./model-DZyxRJEJ.mjs");
	return await resolveModelAsync(...args);
};
/** Resolves the authoritative image limits for one selected provider/model. */
async function resolveImageCompressionModelPolicy(params) {
	const resolveModelAsync = params.deps?.resolveModelAsync ?? resolveModelAsyncDefault;
	async function resolvePolicyWithHooks(skipProviderRuntimeHooks) {
		try {
			return (await resolveModelAsync(params.provider, params.model, params.agentDir, params.cfg, {
				abortSignal: params.abortSignal,
				allowBundledStaticCatalogFallback: true,
				skipProviderRuntimeHooks,
				skipAgentDiscovery: true,
				workspaceDir: params.workspaceDir,
				...params.preparedModelRuntime ? { preparedModelRuntime: params.preparedModelRuntime } : {}
			})).model?.mediaInput?.image ?? {};
		} catch {
			params.abortSignal?.throwIfAborted();
			return {};
		}
	}
	const staticPolicy = await resolvePolicyWithHooks(true);
	if (typeof staticPolicy.maxSidePx === "number" || typeof staticPolicy.maxPixels === "number") return staticPolicy;
	return {
		...await resolvePolicyWithHooks(false),
		...staticPolicy
	};
}
//#endregion
export { resolveImageCompressionModelPolicy as t };
