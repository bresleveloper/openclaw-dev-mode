import { y as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-U8dA4bob.mjs";
import "./model-auth-DfAz5WFK.mjs";
//#region src/gateway/server-methods/models-auth-status-config.ts
function resolveConfigBoundProfileIds(cfg, store, authAliasLookupParams) {
	const profileIds = /* @__PURE__ */ new Set();
	for (const provider of Object.keys(cfg.models?.providers ?? {})) {
		const reference = resolveProviderEntryApiKeyProfileReference({
			cfg,
			authAliasLookupParams,
			provider,
			store
		});
		if (reference.kind === "profile" || reference.kind === "profile-incompatible") profileIds.add(reference.profileId);
	}
	return profileIds;
}
//#endregion
export { resolveConfigBoundProfileIds as t };
