import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as buildPersistedAuthProfileState, f as coerceAuthProfileState, t as buildPersistedAuthProfileSecretsStore } from "./persisted-BVyWmvfF.mjs";
import { o as captureOAuthRefreshClaimPublication } from "./credential-state-WXO5HScp.mjs";
import { n as isLegacyOAuthRef } from "./legacy-oauth-ref-B5rOFWjL.mjs";
import { h as runtimeAuthMetadataState } from "./runtime-snapshot-owner-Dm2mqUH2.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/store-mutation.ts
const INLINE_OAUTH_TOKEN_FIELDS = [
	"access",
	"refresh",
	"idToken"
];
function hasChangedInlineOAuthTokenMaterial(params) {
	return INLINE_OAUTH_TOKEN_FIELDS.some((field) => {
		const credentialValue = Reflect.get(params.credential, field);
		if (credentialValue === void 0) return false;
		return !isDeepStrictEqual(credentialValue, Reflect.get(params.existingCredential, field));
	});
}
function preserveLegacyOAuthRefsOnSave(params) {
	if (!isRecord(params.existingRaw) || !isRecord(params.existingRaw.profiles)) return params.payload;
	let nextProfiles;
	for (const [profileId, credential] of Object.entries(params.payload.profiles)) {
		if (credential.type !== "oauth" || credential.oauthRef !== void 0) continue;
		const existingCredential = params.existingRaw.profiles[profileId];
		if (!isRecord(existingCredential) || !isLegacyOAuthRef(existingCredential.oauthRef) || existingCredential.type !== "oauth") continue;
		if (hasChangedInlineOAuthTokenMaterial({
			credential,
			existingCredential
		})) continue;
		nextProfiles ??= { ...params.payload.profiles };
		nextProfiles[profileId] = {
			...credential,
			oauthRef: existingCredential.oauthRef
		};
	}
	return nextProfiles ? {
		...params.payload,
		profiles: nextProfiles
	} : params.payload;
}
/** Classify authoritative save inputs before their transaction publishes derived state. */
function prepareAuthProfileStoreMutation(params) {
	const { existingRaw, existingState, store, selectionProfiles } = params;
	const payload = preserveLegacyOAuthRefsOnSave({
		payload: buildPersistedAuthProfileSecretsStore(store),
		existingRaw
	});
	const existingProfiles = isRecord(existingRaw) && isRecord(existingRaw.profiles) ? existingRaw.profiles : {};
	const changedProfileIds = [.../* @__PURE__ */ new Set([...Object.keys(existingProfiles), ...Object.keys(payload.profiles)])].filter((profileId) => !isDeepStrictEqual(existingProfiles[profileId], payload.profiles[profileId]));
	const profileSetChanged = changedProfileIds.some((profileId) => Object.hasOwn(existingProfiles, profileId) !== Object.hasOwn(payload.profiles, profileId));
	const { statePayload, stateChanged, selectionChanged } = prepareAuthProfileStateMutation({
		existingState,
		store,
		selectionProfiles
	});
	return {
		payload,
		statePayload,
		publication: {
			profileIds: changedProfileIds,
			profileSetChanged,
			credentialsChanged: !isDeepStrictEqual(existingRaw, payload),
			stateChanged,
			selectionChanged,
			oauthRefreshClaimIds: captureOAuthRefreshClaimPublication(payload.profiles, changedProfileIds)
		}
	};
}
/** Classify state-only writes without changing credential ownership. */
function prepareAuthProfileStateMutation(params) {
	const { existingState, store, selectionProfiles } = params;
	const statePayload = buildPersistedAuthProfileState(store);
	const stateChanged = !isDeepStrictEqual(existingState, statePayload);
	const previousState = coerceAuthProfileState(existingState);
	return {
		statePayload,
		stateChanged,
		selectionChanged: stateChanged && !isDeepStrictEqual(runtimeAuthMetadataState({
			...store,
			profiles: selectionProfiles,
			order: previousState.order,
			usageStats: previousState.usageStats
		}), runtimeAuthMetadataState({
			...store,
			profiles: selectionProfiles,
			order: statePayload?.order,
			usageStats: statePayload?.usageStats
		}))
	};
}
//#endregion
export { prepareAuthProfileStoreMutation as n, prepareAuthProfileStateMutation as t };
