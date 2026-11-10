import { a as isSafeToAdoptBootstrapOAuthIdentity } from "./oauth-shared-CiaJlx_D.mjs";
import { H as authProfilesLog, W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { i as readExternalCliBootstrapCredential } from "./external-cli-sync-Bmw7gpgm.mjs";
//#region src/agents/auth-profiles/effective-oauth.ts
/** Select local OAuth unless a safe external bootstrap credential should win. */
function resolveEffectiveOAuthCredentialCore(params) {
	if (isUserModelAuthProfileId(params.profileId)) return params.credential;
	const imported = params.readBootstrapCredential({
		profileId: params.profileId,
		credential: params.credential
	});
	if (!imported) return params.credential;
	if (hasUsableOAuthCredential(params.credential)) {
		authProfilesLog.debug("resolved oauth credential from canonical local store", {
			profileId: params.profileId,
			provider: params.credential.provider,
			localExpires: params.credential.expires,
			externalExpires: imported.expires
		});
		return params.credential;
	}
	if (!isSafeToAdoptBootstrapOAuthIdentity(params.credential, imported)) {
		authProfilesLog.warn("refused external oauth bootstrap credential: identity mismatch or missing binding", {
			profileId: params.profileId,
			provider: params.credential.provider
		});
		return params.credential;
	}
	if (hasUsableOAuthCredential(imported)) {
		authProfilesLog.debug("resolved oauth credential from external cli bootstrap", {
			profileId: params.profileId,
			provider: imported.provider,
			localExpires: params.credential.expires,
			externalExpires: imported.expires
		});
		return imported;
	}
	return params.credential;
}
function resolveEffectiveOAuthCredential(params) {
	return resolveEffectiveOAuthCredentialCore({
		...params,
		readBootstrapCredential: readExternalCliBootstrapCredential
	});
}
//#endregion
export { resolveEffectiveOAuthCredentialCore as n, resolveEffectiveOAuthCredential as t };
