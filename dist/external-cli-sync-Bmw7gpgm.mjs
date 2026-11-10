import { a as resolveRequiredOsHomeDir } from "./home-dir-CtsdYvX3.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as isSafeToAdoptBootstrapOAuthIdentity } from "./oauth-shared-CiaJlx_D.mjs";
import { H as authProfilesLog, z as EXTERNAL_CLI_SYNC_TTL_MS } from "./user-model-account-authority-DFFjC5J5.mjs";
import { r as MINIMAX_CLI_PROFILE_ID } from "./profile-ids-B9fFWPvP.mjs";
import { r as isOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { a as readMiniMaxCliCredentialsCached } from "./cli-credentials-DmMCeh52.mjs";
//#region src/agents/auth-profiles/external-cli-sync.ts
/** MiniMax CLI bootstrap and persisted ownership; provider plugins own other external auth. */
const PERSISTED_EXTERNAL_CLI_AUTH_FLOW = "external-cli";
const MINIMAX_PROVIDER = "minimax-portal";
const MINIMAX_PROVIDER_IDS = [
	MINIMAX_PROVIDER,
	"minimax",
	"minimax-cli"
];
function isMiniMaxCliProfile(params) {
	return params.profileId === "minimax-portal:minimax-cli" && (!params.credential || MINIMAX_PROVIDER_IDS.includes(params.credential.provider));
}
function readMiniMaxCredential(env, provider) {
	const credential = readMiniMaxCliCredentialsCached({
		ttlMs: EXTERNAL_CLI_SYNC_TTL_MS,
		...env ? { homeDir: resolveRequiredOsHomeDir(env) } : {}
	});
	return credential && provider !== void 0 ? {
		...credential,
		provider
	} : credential;
}
/** True when durable metadata assigns this stored profile to an external CLI owner. */
function isPersistedExternalCliAuthProfile(params) {
	if (!isMiniMaxCliProfile(params)) return false;
	return params.credential.authFlow === PERSISTED_EXTERNAL_CLI_AUTH_FLOW;
}
function markPersistedExternalCliCredential(credential) {
	return {
		...credential,
		authFlow: PERSISTED_EXTERNAL_CLI_AUTH_FLOW
	};
}
/** Provider ids whose external CLI credentials can be refreshed by this owner. */
function listExternalCliSyncProviderIds() {
	return [...MINIMAX_PROVIDER_IDS];
}
/** Read a CLI credential only for safe bootstrap of an unusable local profile. */
function readExternalCliBootstrapCredential(params) {
	if (!isMiniMaxCliProfile(params)) return null;
	const imported = readMiniMaxCredential(void 0, params.credential.provider);
	if (imported && isOAuthRefreshFence(params.credential)) return null;
	return imported;
}
function normalizeProviderScope(values) {
	return values === void 0 ? void 0 : new Set(Array.from(values, normalizeProviderId).filter(Boolean));
}
function isMiniMaxCliInScope(params) {
	const { options, store } = params;
	const providerScope = normalizeProviderScope(options?.providerIds);
	if (providerScope === void 0 && options?.profileIds === void 0) {
		const existing = store.profiles[MINIMAX_CLI_PROFILE_ID];
		return Object.hasOwn(store.profiles, "minimax-portal:minimax-cli") && existing?.type === "oauth" && MINIMAX_PROVIDER_IDS.includes(existing.provider);
	}
	if (Array.from(options?.profileIds ?? []).some((profileId) => "minimax-portal:minimax-cli" === profileId.trim())) return true;
	return MINIMAX_PROVIDER_IDS.some((alias) => providerScope?.has(alias));
}
/** True when the built-in CLI owns a refreshable profile slot. */
function isExternalCliAuthProfileInScope(params) {
	return params.profileId === "minimax-portal:minimax-cli" && isMiniMaxCliInScope({ store: params.store });
}
function backfillExternalCliIdentity(params) {
	const creds = readMiniMaxCredential(params.env);
	if (!(creds?.refresh === params.existingOAuth.refresh)) return null;
	const credential = markPersistedExternalCliCredential({
		...params.existingOAuth,
		...params.existingOAuth.email || !creds.email ? {} : { email: creds.email }
	});
	return credential.authFlow === params.existingOAuth.authFlow && credential.email === params.existingOAuth.email ? null : credential;
}
/** Resolve scoped external CLI auth profiles available to overlay or persist. */
function resolveExternalCliAuthProfiles(store, options) {
	const now = Date.now();
	if (!isMiniMaxCliInScope({
		store,
		options
	})) return [];
	const profileId = MINIMAX_CLI_PROFILE_ID;
	const existing = store.profiles[profileId];
	const existingOAuth = existing?.type === "oauth" && MINIMAX_PROVIDER_IDS.includes(existing.provider) ? existing : void 0;
	if (existing && !existingOAuth) {
		authProfilesLog.debug("kept explicit local auth over external cli bootstrap", {
			profileId,
			provider: MINIMAX_PROVIDER,
			localType: existing.type,
			localProvider: existing.provider
		});
		return [];
	}
	if (existingOAuth && hasUsableOAuthCredential(existingOAuth, { now })) {
		const backfilled = backfillExternalCliIdentity({
			existingOAuth,
			env: options?.env
		});
		return backfilled ? [{
			profileId,
			credential: backfilled,
			persistence: "persisted"
		}] : [];
	}
	const creds = readMiniMaxCredential(options?.env, existingOAuth?.provider ?? MINIMAX_PROVIDER);
	if (!creds) return [];
	if (existingOAuth && isOAuthRefreshFence(existingOAuth)) {
		authProfilesLog.warn("refused unordered external cli oauth recovery for a fenced profile", {
			profileId,
			provider: MINIMAX_PROVIDER
		});
		return [];
	}
	if (existingOAuth && !isSafeToAdoptBootstrapOAuthIdentity(existingOAuth, creds)) {
		authProfilesLog.warn("refused external cli oauth bootstrap: identity mismatch", {
			profileId,
			provider: MINIMAX_PROVIDER
		});
		return [];
	}
	if (!hasUsableOAuthCredential(creds, { now })) return [];
	authProfilesLog.debug("used external cli oauth bootstrap because local oauth was missing or unusable", {
		profileId,
		provider: MINIMAX_PROVIDER,
		localExpires: existingOAuth?.expires,
		externalExpires: creds.expires
	});
	return [{
		profileId,
		credential: markPersistedExternalCliCredential(creds),
		persistence: "persisted"
	}];
}
//#endregion
export { resolveExternalCliAuthProfiles as a, readExternalCliBootstrapCredential as i, isPersistedExternalCliAuthProfile as n, listExternalCliSyncProviderIds as r, isExternalCliAuthProfileInScope as t };
