import { _ as LLAMA_CPP_PROVIDER_ID } from "./defaults-B-3wLNsP.mjs";
// extensions/llama-cpp/src/managed-provider-config.ts
const MANAGED_LLAMA_CPP_CONFIG_REQUIRED_MESSAGE = "Local embeddings need the managed llama.cpp server config (llama-server). The in-process node-llama-cpp runtime was removed; semantic memory recall is degraded until setup. Run `openclaw configure`, choose llama.cpp once, then retry `openclaw memory status --deep`.";
function resolveManagedLlamaCppProviderConfig(config) {
	const provider = config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (!provider?.localService || !provider.baseUrl) throw new Error(MANAGED_LLAMA_CPP_CONFIG_REQUIRED_MESSAGE);
	return provider;
}
export { resolveManagedLlamaCppProviderConfig as n, MANAGED_LLAMA_CPP_CONFIG_REQUIRED_MESSAGE as t };
