import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
import { a as resolveAuthProfileOrder } from "./order-CElLtwMu.mjs";
import { c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { i as ensureAuthProfileStoreAsync, r as ensureAuthProfileStore } from "./store-runtime-CwqGD12G.mjs";
import { o as resolveModelAuthMode } from "./model-auth-CMoPmop7.mjs";
//#region src/agents/embedded-agent-runner/cli-backend-dispatch-eligibility.ts
function resolveDispatchProvider(params) {
	const backends = new Map(resolveRuntimeCliBackends("metadata").map((backend) => [normalizeProviderId(backend.id), backend]));
	const requestedProvider = normalizeProviderId(params.provider ?? "");
	const provider = backends.has(requestedProvider) ? requestedProvider : normalizeProviderId(resolveCliRuntimeExecutionProvider({
		provider: params.provider ?? "",
		cfg: params.config,
		agentId: params.agentId,
		modelId: params.model,
		authProfileId: params.authProfileId,
		preparedAuthStore: params.preparedAuthStore
	}) ?? "");
	return backends.get(provider)?.subscriptionAuthDispatch ? provider : void 0;
}
function canDispatchWithAuthStore(params, provider, store) {
	const pinnedType = params.authProfileId ? store.profiles[params.authProfileId.trim()]?.type : void 0;
	const [selectedProfileId] = resolveAuthProfileOrder({
		cfg: params.config,
		store,
		provider
	});
	const selectedType = pinnedType ?? (selectedProfileId ? store.profiles[selectedProfileId]?.type : void 0);
	const authMode = selectedType === "api_key" ? "api-key" : selectedType === "oauth" || selectedType === "token" ? selectedType : resolveModelAuthMode(provider, params.config, store, { workspaceDir: params.workspaceDir });
	return authMode !== "api-key" && authMode !== "mixed" && authMode !== "aws-sdk";
}
/** @deprecated Use resolveEmbeddedCliBackendDispatchEligibilityAsync for worker-owned reads. */
function resolveEmbeddedCliBackendDispatchEligibility(params) {
	const provider = resolveDispatchProvider(params);
	if (!provider) return;
	try {
		if (!canDispatchWithAuthStore(params, provider, params.preparedAuthStore ?? ensureAuthProfileStore(params.agentDir, { config: params.config }))) return;
	} catch {}
	return { provider };
}
/** Reads credential metadata through its worker without materializing or refreshing secrets. */
async function resolveEmbeddedCliBackendDispatchEligibilityAsync(params) {
	const provider = resolveDispatchProvider(params);
	if (!provider) return;
	try {
		if (!canDispatchWithAuthStore(params, provider, params.preparedAuthStore ?? await ensureAuthProfileStoreAsync(params.agentDir, { config: params.config }))) return;
	} catch {}
	return { provider };
}
//#endregion
export { resolveEmbeddedCliBackendDispatchEligibilityAsync as n, resolveEmbeddedCliBackendDispatchEligibility as t };
