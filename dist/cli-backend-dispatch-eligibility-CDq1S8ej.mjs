import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAuthProfileOrder } from "./order-BQhYF772.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import { o as resolveModelAuthMode } from "./model-auth-D3hh0-wa.mjs";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DZSSnYMd.mjs";
//#region src/agents/embedded-agent-runner/cli-backend-dispatch-eligibility.ts
/**
* Provider/backend/credential eligibility for CLI-backend dispatch of
* embedded runs. Shared by the dispatch itself and by callers that must
* budget for CLI latency before starting the run (active-memory recall's
* timeout default); both sides seeing one decision keeps timeouts and
* routing from drifting apart. Kept separate from the dispatch module so
* the plugin runtime surface does not eagerly load the run machinery.
*/
/**
* Decides whether an opted-in embedded run would execute through the CLI
* backend. Resolution stays on stored credential metadata — no credential
* materialization, refresh locks, or network calls on this per-turn path.
*/
function resolveEmbeddedCliBackendDispatchEligibility(params) {
	const backends = new Map(resolveRuntimeCliBackends("metadata").map((backend) => [normalizeProviderId(backend.id), backend]));
	const requestedProvider = normalizeProviderId(params.provider ?? "");
	const provider = backends.has(requestedProvider) ? requestedProvider : normalizeProviderId(resolveCliRuntimeExecutionProvider({
		provider: params.provider ?? "",
		cfg: params.config,
		agentId: params.agentId,
		modelId: params.model,
		authProfileId: params.authProfileId
	}) ?? "");
	if (!backends.get(provider)?.subscriptionAuthDispatch) return;
	const authMode = resolveAuthModeSafe(params, provider);
	if (authMode === "api-key" || authMode === "mixed" || authMode === "aws-sdk") return;
	return { provider };
}
function resolveAuthModeSafe(params, provider) {
	try {
		const store = ensureAuthProfileStore(params.agentDir, { config: params.config });
		const pinnedType = params.authProfileId ? store.profiles[params.authProfileId.trim()]?.type : void 0;
		const [selectedProfileId] = resolveAuthProfileOrder({
			cfg: params.config,
			store,
			provider
		});
		const selectedType = pinnedType ?? (selectedProfileId ? store.profiles[selectedProfileId]?.type : void 0);
		if (selectedType === "api_key") return "api-key";
		if (selectedType === "oauth" || selectedType === "token") return selectedType;
		return resolveModelAuthMode(provider, params.config, store, { workspaceDir: params.workspaceDir });
	} catch {
		return;
	}
}
//#endregion
export { resolveEmbeddedCliBackendDispatchEligibility as t };
