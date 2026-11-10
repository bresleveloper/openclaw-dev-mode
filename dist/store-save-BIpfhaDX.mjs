import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { a as coerceSecretRef, s as hasLegacySecretRefExtraFields } from "./types.secrets-Dgbd2kyP.mjs";
import { c as shouldPersistRuntimeExternalOAuthProfile, l as cloneAuthProfileStore } from "./oauth-shared-CiaJlx_D.mjs";
import { L as isLegacyOAuthRef, W as isUserModelAuthProfileId, v as coerceAuthProfileState } from "./user-model-account-authority-DFFjC5J5.mjs";
import { i as copyAuthProfileAuthorizationIntent, o as prepareAuthProfileAuthorizationWrite, r as copyAuthProfileAuthorizationInheritance } from "./authorization-lifetime-CLdd1God.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { d as removePersonalAuthProfileReferences, s as buildPersistedAuthProfileState, t as buildPersistedAuthProfileSecretsStore } from "./persisted-DbIYEoQ3.mjs";
import { G as pruneAuthProfileStoreReferences, K as runtimeAuthMetadataState, Q as isInheritedMainOAuthCredentialFromStores, u as getRuntimeAuthProfileStoreSnapshotAtDatabasePath } from "./runtime-snapshots-HRosak4u.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/credential-normalize.ts
/** Public SDK write ingress retains its legacy input contract and publishes canonical refs. */
function normalizeAuthProfileSecretRefs(credential) {
	if (credential.type !== "api_key" && credential.type !== "token") return credential;
	const value = credential.type === "api_key" ? credential.keyRef : credential.tokenRef;
	if (hasLegacySecretRefExtraFields(value)) throw new Error("Auth profile SecretRef contains unsupported fields. Preserve that metadata separately and explicitly call coerceSecretRef before saving a source/provider/id reference.");
	const ref = coerceSecretRef(value);
	if (!ref || ref === value) return credential;
	return credential.type === "api_key" ? {
		...credential,
		keyRef: ref
	} : {
		...credential,
		tokenRef: ref
	};
}
function normalizeAuthProfileCredential(input) {
	const credential = normalizeAuthProfileSecretRefs(input);
	if (credential.type !== "api_key" && credential.type !== "token") return credential;
	const value = credential.type === "api_key" ? credential.key : credential.token;
	if (typeof value !== "string") return credential;
	const normalized = normalizeSecretInput(value);
	if (credential.type === "api_key") {
		const { key: _key, ...rest } = credential;
		return {
			...rest,
			...normalized ? { key: normalized } : {}
		};
	}
	const { token: _token, ...rest } = credential;
	return {
		...rest,
		...normalized ? { token: normalized } : {}
	};
}
//#endregion
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
		copyAuthProfileAuthorizationInheritance(params.payload.profiles, nextProfiles);
		nextProfiles[profileId] = {
			...credential,
			oauthRef: existingCredential.oauthRef
		};
		copyAuthProfileAuthorizationIntent(credential, nextProfiles[profileId]);
	}
	return nextProfiles ? {
		...params.payload,
		profiles: nextProfiles
	} : params.payload;
}
/** Classify authoritative save inputs before their transaction publishes derived state. */
function prepareAuthProfileStoreMutation(params) {
	const { existingRaw, existingState, store, selectionProfiles } = params;
	const payload = prepareAuthProfileAuthorizationWrite(existingRaw, preserveLegacyOAuthRefsOnSave({
		payload: buildPersistedAuthProfileSecretsStore(store),
		existingRaw
	}));
	const existingProfiles = isRecord(existingRaw) && isRecord(existingRaw.profiles) ? existingRaw.profiles : {};
	const changedProfileIds = [.../* @__PURE__ */ new Set([...Object.keys(existingProfiles), ...Object.keys(payload.profiles)])].filter((profileId) => !isDeepStrictEqual(existingProfiles[profileId], payload.profiles[profileId]));
	const profileSetChanged = changedProfileIds.some((profileId) => Object.hasOwn(existingProfiles, profileId) !== Object.hasOwn(payload.profiles, profileId));
	const { statePayload, stateChanged, selectionChanged, availabilityOnly } = prepareAuthProfileStateMutation({
		existingState,
		store,
		selectionProfiles
	});
	const credentialsChanged = !isDeepStrictEqual(existingRaw, payload);
	return {
		payload,
		statePayload,
		publication: {
			profileIds: changedProfileIds,
			profileSetChanged,
			credentialsChanged,
			availabilityOnly: !credentialsChanged && availabilityOnly,
			stateChanged,
			selectionChanged
		}
	};
}
/** Classify state-only writes without changing credential ownership. */
function prepareAuthProfileStateMutation(params) {
	const { existingState, store, selectionProfiles } = params;
	const statePayload = buildPersistedAuthProfileState(store);
	const stateChanged = !isDeepStrictEqual(existingState, statePayload);
	const previousState = coerceAuthProfileState(existingState);
	const metadata = (state) => runtimeAuthMetadataState({
		...store,
		profiles: selectionProfiles,
		order: state?.order,
		usageStats: state?.usageStats
	});
	return {
		statePayload,
		stateChanged,
		selectionChanged: stateChanged && !isDeepStrictEqual(metadata(previousState), metadata(statePayload)),
		availabilityOnly: stateChanged && isDeepStrictEqual(previousState?.order, statePayload?.order)
	};
}
//#endregion
//#region src/agents/auth-profiles/store-save.ts
function buildLocalAuthProfileStoreForSave(params) {
	const localStore = cloneAuthProfileStore(removePersonalAuthProfileReferences(params.store));
	for (const [profileId, credential] of Object.entries(localStore.profiles)) {
		const normalized = normalizeAuthProfileSecretRefs(credential);
		copyAuthProfileAuthorizationIntent(credential, normalized);
		localStore.profiles[profileId] = normalized;
	}
	const { listRuntimeExternalAuthProfiles } = params;
	let externalProfiles;
	const getExternalProfiles = () => externalProfiles ??= listRuntimeExternalAuthProfiles({
		store: params.store,
		agentDir: params.agentDir
	});
	localStore.profiles = Object.fromEntries(Object.entries(localStore.profiles).filter(([profileId, credential]) => {
		const inherited = params.getScopedSharedAuthStore()?.profiles[profileId];
		if (inherited && !params.persistedStores.localStore?.profiles[profileId]) {
			const secrets = buildPersistedAuthProfileSecretsStore({
				version: 1,
				profiles: { [profileId]: credential }
			});
			if (isDeepStrictEqual(secrets.profiles[profileId], inherited)) return false;
		}
		if (credential.type !== "oauth") return true;
		if (isInheritedMainOAuthCredentialFromStores({
			profileId,
			credential,
			persistedStores: params.persistedStores
		})) return false;
		if (params.options?.filterExternalAuthProfiles === false) return true;
		if (params.store.runtimeExternalProfileIds?.includes(profileId) && !params.persistedStores.localStore?.profiles[profileId]) {
			const runtimeCredential = (params.runtimeStore ?? getRuntimeAuthProfileStoreSnapshotAtDatabasePath(params.owner.databasePath))?.profiles[profileId];
			if (!runtimeCredential || isDeepStrictEqual(runtimeCredential, credential)) return false;
		}
		return shouldPersistRuntimeExternalOAuthProfile({
			profileId,
			credential,
			profiles: getExternalProfiles()
		});
	}));
	copyAuthProfileAuthorizationInheritance(params.store.profiles, localStore.profiles);
	const keptProfileIds = new Set(Object.keys(localStore.profiles));
	const keptOrderProfileIds = new Set(keptProfileIds);
	for (const profileId of normalizeUniqueStringEntries(params.options?.preserveStateProfileIds)) {
		keptProfileIds.add(profileId);
		keptOrderProfileIds.add(profileId);
	}
	for (const profileIds of Object.values(params.persistedStores.localStore?.order ?? {})) for (const profileId of profileIds) keptOrderProfileIds.add(profileId);
	for (const profileId of normalizeUniqueStringEntries(params.options?.preserveOrderProfileIds)) keptOrderProfileIds.add(profileId);
	for (const profileId of normalizeUniqueStringEntries(params.options?.pruneOrderProfileIds)) keptOrderProfileIds.delete(profileId);
	for (const profileIds of [keptProfileIds, keptOrderProfileIds]) for (const profileId of profileIds) if (isUserModelAuthProfileId(profileId)) profileIds.delete(profileId);
	pruneAuthProfileStoreReferences(localStore, keptProfileIds, keptOrderProfileIds);
	if (params.options?.filterExternalAuthProfiles !== false) {
		localStore.runtimeExternalProfileIds = void 0;
		localStore.runtimeExternalProfileIdsAuthoritative = void 0;
	}
	return localStore;
}
//#endregion
export { normalizeAuthProfileSecretRefs as a, normalizeAuthProfileCredential as i, prepareAuthProfileStateMutation as n, prepareAuthProfileStoreMutation as r, buildLocalAuthProfileStoreForSave as t };
