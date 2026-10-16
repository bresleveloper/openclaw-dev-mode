import { i as normalizeProviderIdForAuth } from "./provider-id-D1VImdKk.mjs";
import { r as resolveProviderModelRouteAuthRequirement } from "./provider-model-route-auth-Cbwct-ZM.mjs";
//#region src/agents/model-auth-selected-credential.ts
/** Normalize a selection made by availability or the physical attempt's auth owner. */
function resolveSelectedModelCredential(params) {
	if (params.runtimeAuth) return { source: "harness" };
	if (!params.profileId && !params.mode) return;
	const auth = {
		mode: params.mode,
		requirement: resolveProviderModelRouteAuthRequirement(params.mode, params.authRequirement)
	};
	return params.profileId ? {
		...auth,
		source: "profile",
		profileId: params.profileId,
		identityKey: `profile:${params.profileId}`
	} : {
		...auth,
		source: "direct",
		provider: normalizeProviderIdForAuth(params.provider),
		identityKey: `direct:${normalizeProviderIdForAuth(params.provider)}`
	};
}
//#endregion
export { resolveSelectedModelCredential as t };
