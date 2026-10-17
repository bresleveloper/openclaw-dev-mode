import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveAuthProfileOrder } from "./order-B7W96aON.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-Qx0DZ2Si.mjs";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-B5N-I0ib.mjs";
import { o as resolveModelAuthMode } from "./model-auth-efmtIdn2.mjs";
//#region src/agents/embedded-agent-runner/cli-backend-dispatch-eligibility.ts
/** Reads credential metadata only; never materializes or refreshes credentials per turn. */
function resolveEmbeddedCliBackendDispatchEligibility(params) {
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
	if (!backends.get(provider)?.subscriptionAuthDispatch) return;
	try {
		const store = params.preparedAuthStore ?? ensureAuthProfileStore(params.agentDir, { config: params.config });
		const pinnedType = params.authProfileId ? store.profiles[params.authProfileId.trim()]?.type : void 0;
		const [selectedProfileId] = resolveAuthProfileOrder({
			cfg: params.config,
			store,
			provider
		});
		const selectedType = pinnedType ?? (selectedProfileId ? store.profiles[selectedProfileId]?.type : void 0);
		const authMode = selectedType === "api_key" ? "api-key" : selectedType === "oauth" || selectedType === "token" ? selectedType : resolveModelAuthMode(provider, params.config, store, { workspaceDir: params.workspaceDir });
		if (authMode === "api-key" || authMode === "mixed" || authMode === "aws-sdk") return;
	} catch {}
	return { provider };
}
//#endregion
export { resolveEmbeddedCliBackendDispatchEligibility as t };
