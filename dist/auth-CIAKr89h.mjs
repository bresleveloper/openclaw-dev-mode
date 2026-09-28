import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
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
	const providerAuthAliasesEnabled = params.providerAuthAliasesEnabled ?? params.config?.plugins?.enabled !== false;
	const metadataSnapshot = params.metadataSnapshot ?? (providerAuthAliasesEnabled ? void 0 : EMPTY_PROVIDER_AUTH_ALIAS_METADATA);
	const aliasLookupParams = {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...metadataSnapshot ? { metadataSnapshot } : {}
	};
	const providerForAuth = resolveProviderIdForAuth(params.provider, aliasLookupParams);
	const authProfileProviderForAuth = params.authProfileProvider !== void 0 ? resolveProviderIdForAuth(params.authProfileProvider, {
		...aliasLookupParams,
		storedCredential: true
	}) : providerForAuth;
	const harnessAuthProvider = resolveHarnessAuthProvider(params);
	const harnessProviderForAuth = harnessAuthProvider ? resolveProviderIdForAuth(harnessAuthProvider, aliasLookupParams) : void 0;
	const harnessCanForwardProfile = params.allowHarnessAuthProfileForwarding !== false && harnessProviderForAuth && harnessProviderForAuth === authProfileProviderForAuth;
	const canForwardProfile = !harnessProviderForAuth && providerForAuth === authProfileProviderForAuth || harnessCanForwardProfile;
	const forwardedAuthProfileId = canForwardProfile ? params.sessionAuthProfileId : void 0;
	return {
		providerForAuth,
		...params.modelId ? { modelId: params.modelId } : {},
		authProfileProviderForAuth,
		...harnessProviderForAuth ? { harnessAuthProvider: harnessProviderForAuth } : {},
		...canForwardProfile ? { forwardedAuthProfileId } : {},
		...canForwardProfile && params.sessionAuthProfileId && params.sessionAuthProfileSource ? { forwardedAuthProfileSource: params.sessionAuthProfileSource === "auto" ? "auto" : "user" } : {},
		...canForwardProfile && params.sessionAuthProfileCandidateIds?.length ? { forwardedAuthProfileCandidateIds: params.sessionAuthProfileCandidateIds } : {},
		...canForwardProfile && params.authProfileMode ? { selectedAuthMode: params.authProfileMode } : {},
		...params.modelRoute ? { modelRoute: params.modelRoute } : {},
		...params.deferredRouteSupport ? { deferredRouteSupport: params.deferredRouteSupport } : {},
		...params.credentialSource ? { credentialSource: params.credentialSource } : {}
	};
}
//#endregion
export { buildAgentRuntimeAuthPlan as t };
