import { n as resolveManagedLlamaCppProviderConfig, t as MANAGED_LLAMA_CPP_CONFIG_REQUIRED_MESSAGE } from "./.setup/managed-provider-config-BYvyYdAs.mjs";
//#region extensions/llama-cpp/provider-policy-api.ts
function inspectEmbeddingProviderSetup(params) {
	if (params.provider !== "local") return null;
	const fixHint = `Run \`openclaw models --agent ${params.agentId} auth login --provider llama-cpp --method local\` in an interactive terminal, then rerun this check.`;
	try {
		resolveManagedLlamaCppProviderConfig(params.config);
	} catch {
		return {
			provider: params.provider,
			reason: MANAGED_LLAMA_CPP_CONFIG_REQUIRED_MESSAGE,
			requirement: "managed-llama-cpp-setup",
			fixHint
		};
	}
	return null;
}
//#endregion
export { inspectEmbeddingProviderSetup };
