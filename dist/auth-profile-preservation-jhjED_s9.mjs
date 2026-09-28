import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-B84_9MMh.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { a as findPersistedAuthProfileCredential, s as getRuntimeAuthProfileStoreSnapshot } from "./store-CTvq6MSF.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-qM_24l0u.mjs";
import { a as applyModelOverrideToSessionEntry } from "./model-overrides-FXSJttoI.mjs";
//#region src/sessions/auth-profile-preservation.ts
function resolvePinnedAuthProfileProvider(params) {
	return getRuntimeAuthProfileStoreSnapshot(params.agentDir)?.profiles[params.profileId]?.provider ?? findPersistedAuthProfileCredential({
		agentDir: params.agentDir,
		profileId: params.profileId
	})?.provider ?? params.cfg.auth?.profiles?.[params.profileId]?.provider;
}
/** Checks whether a pinned session auth profile can authenticate the selected provider. */
function shouldPreserveSessionAuthProfileOverride(params) {
	const profileOverride = normalizeOptionalString(params.entry.authProfileOverride);
	const provider = normalizeOptionalLowercaseString(params.provider);
	if (!profileOverride || !provider) return false;
	const resolvesToTargetProvider = (rawProvider, storedCredential = false) => {
		const candidate = normalizeOptionalLowercaseString(rawProvider);
		const lookupParams = {
			config: params.cfg,
			...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
		};
		return Boolean(candidate && resolveProviderIdForAuth(candidate, {
			...lookupParams,
			storedCredential
		}) === resolveProviderIdForAuth(provider, lookupParams));
	};
	const recordedProvider = resolvePinnedAuthProfileProvider({
		cfg: params.cfg,
		agentDir: params.agentDir,
		profileId: profileOverride
	});
	if (recordedProvider) return resolvesToTargetProvider(recordedProvider, true);
	const delimiterIndex = profileOverride.indexOf(":");
	if (delimiterIndex < 0 || isUserModelAuthProfileId(profileOverride)) return resolvesToTargetProvider(params.currentProvider);
	return resolvesToTargetProvider(profileOverride.slice(0, delimiterIndex), true);
}
/** Missing credentials preserve explicit same-provider intent until authentication reports recovery. */
function shouldPreserveUnavailableSessionAuthProfileOverride(params) {
	const profileId = normalizeOptionalString(params.entry.authProfileOverride);
	return Boolean(profileId && !params.store.profiles[profileId] && resolveCollapsedSessionAuthPinSource(params.entry) === "user" && shouldPreserveSessionAuthProfileOverride(params));
}
/** Applies a user model selection without dropping a compatible pinned auth profile. */
function applyModelOverrideWithAuthProfileCompatibility(params) {
	return applyModelOverrideToSessionEntry({
		entry: params.entry,
		selection: params.selection,
		...params.profileOverride ? { profileOverride: params.profileOverride } : {},
		...params.profileOverrideSource ? { profileOverrideSource: params.profileOverrideSource } : {},
		...params.selectionSource ? { selectionSource: params.selectionSource } : {},
		...params.explicitDefaultSelection ? { explicitDefaultSelection: params.explicitDefaultSelection } : {},
		...params.markLiveSwitchPending !== void 0 ? { markLiveSwitchPending: params.markLiveSwitchPending } : {},
		preserveAuthProfileOverride: !params.profileOverride && shouldPreserveSessionAuthProfileOverride({
			cfg: resolveModelProviderAuthConfig({
				config: params.cfg,
				provider: params.selection.provider,
				modelId: params.selection.model,
				metadataSnapshot: params.metadataSnapshot
			}),
			agentDir: params.agentDir,
			entry: params.entry,
			currentProvider: params.currentProvider,
			provider: params.selection.provider,
			...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
		})
	});
}
//#endregion
export { shouldPreserveSessionAuthProfileOverride as n, shouldPreserveUnavailableSessionAuthProfileOverride as r, applyModelOverrideWithAuthProfileCompatibility as t };
