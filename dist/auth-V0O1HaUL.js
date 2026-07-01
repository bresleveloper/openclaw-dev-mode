import { s as normalizePluginsConfig } from "./config-state-6HQcbL-X.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-CNlVI3wV.js";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-DiL2DId7.js";
//#region src/agents/runtime-plan/auth.ts
const CODEX_HARNESS_AUTH_PROVIDER = "openai";
const EMPTY_PROVIDER_AUTH_ALIAS_METADATA = { plugins: [] };
function resolveHarnessAuthProvider(params) {
	const harnessId = normalizeOptionalAgentRuntimeId(params.harnessId);
	const runtime = normalizeOptionalAgentRuntimeId(params.harnessRuntime);
	return harnessId === "codex" || runtime === "codex" ? CODEX_HARNESS_AUTH_PROVIDER : void 0;
}
/** Builds the auth forwarding plan for one resolved agent runtime. */
function buildAgentRuntimeAuthPlan(params) {
	const providerAuthAliasesEnabled = params.providerAuthAliasesEnabled ?? (params.config ? normalizePluginsConfig(params.config.plugins).enabled : true);
	const metadataSnapshot = params.metadataSnapshot ?? (providerAuthAliasesEnabled ? void 0 : EMPTY_PROVIDER_AUTH_ALIAS_METADATA);
	const aliasLookupParams = {
		config: params.config,
		workspaceDir: params.workspaceDir,
		...metadataSnapshot ? { metadataSnapshot } : {}
	};
	const providerForAuth = resolveProviderIdForAuth(params.provider, aliasLookupParams);
	const authProfileProviderForAuth = resolveProviderIdForAuth(params.authProfileProvider ?? params.provider, aliasLookupParams);
	const harnessAuthProvider = resolveHarnessAuthProvider(params);
	const harnessProviderForAuth = harnessAuthProvider ? resolveProviderIdForAuth(harnessAuthProvider, aliasLookupParams) : void 0;
	const harnessCanForwardProfile = params.allowHarnessAuthProfileForwarding !== false && harnessProviderForAuth && harnessProviderForAuth === authProfileProviderForAuth;
	const canForwardProfile = !harnessProviderForAuth && providerForAuth === authProfileProviderForAuth || harnessCanForwardProfile;
	return {
		providerForAuth,
		authProfileProviderForAuth,
		...harnessProviderForAuth ? { harnessAuthProvider: harnessProviderForAuth } : {},
		...canForwardProfile ? { forwardedAuthProfileId: params.sessionAuthProfileId } : {},
		...canForwardProfile && params.sessionAuthProfileCandidateIds?.length ? { forwardedAuthProfileCandidateIds: params.sessionAuthProfileCandidateIds } : {}
	};
}
//#endregion
export { buildAgentRuntimeAuthPlan as t };
