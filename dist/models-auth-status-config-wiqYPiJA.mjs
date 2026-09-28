import { j as resolveProviderEntryApiKeyProfileReference } from "./loader-runtime-load-DitY2Htf.mjs";
import "./model-auth-D3hh0-wa.mjs";
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
