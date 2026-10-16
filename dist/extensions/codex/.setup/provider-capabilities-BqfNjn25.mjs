import { h as releaseLeasedSharedCodexAppServerClient } from "./shared-client-r9NcV_GJ.mjs";
//#region extensions/codex/src/app-server/provider-capabilities.ts
function resolveOverriddenProviderWebSearchSupport(modelProviderOverride) {
	const provider = modelProviderOverride?.trim().toLowerCase();
	if (!provider) return;
	return provider === "openai" ? "supported" : "unsupported";
}
async function resolveCodexProviderWebSearchSupportForClient(params) {
	const overrideSupport = resolveOverriddenProviderWebSearchSupport(params.modelProviderOverride);
	if (overrideSupport) return overrideSupport;
	try {
		const options = {
			timeoutMs: params.timeoutMs,
			signal: params.signal
		};
		if (params.expectedNativeModelProvider) {
			if (((await params.client.request("config/read", { includeLayers: false }, options)).config.model_provider ?? "openai") !== params.expectedNativeModelProvider) return "unknown";
		}
		return (await params.client.request("modelProvider/capabilities/read", {}, options)).webSearch ? "supported" : "unsupported";
	} catch {
		return "unknown";
	}
}
async function resolveCodexProviderWebSearchSupport(params) {
	const overrideSupport = resolveOverriddenProviderWebSearchSupport(params.modelProviderOverride);
	if (overrideSupport) return overrideSupport;
	let client;
	try {
		client = await params.clientFactory({
			startOptions: params.appServer.start,
			...params.preparedAuth ? { preparedAuth: params.preparedAuth } : { authProfileId: params.authProfileId },
			agentDir: params.agentDir,
			config: params.config,
			timeoutMs: params.appServer.requestTimeoutMs
		});
		return await resolveCodexProviderWebSearchSupportForClient({
			client,
			timeoutMs: params.appServer.requestTimeoutMs,
			modelProviderOverride: params.modelProviderOverride,
			expectedNativeModelProvider: params.expectedNativeModelProvider,
			signal: params.signal
		});
	} catch {
		return "unknown";
	} finally {
		if (client) releaseLeasedSharedCodexAppServerClient(client);
	}
}
//#endregion
export { resolveCodexProviderWebSearchSupportForClient as n, resolveCodexProviderWebSearchSupport as t };
