import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { f as normalizeSecretInputString } from "./types.secrets-Dgbd2kyP.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { a as resolveTokenExpiryState, n as evaluateStoredCredentialEligibility, t as DEFAULT_OAUTH_REFRESH_MARGIN_MS } from "./credential-state-NmgqOc1o.mjs";
import { a as resolveAuthProfileOrder, m as resolveExplicitAuthOrderSelection } from "./order-CElLtwMu.mjs";
import { t as resolveEffectiveOAuthCredential } from "./effective-oauth-CUElNQ2u.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./display-D4lohsyV.mjs";
//#region src/agents/auth-health.ts
/**
* Auth profile health summarization.
* Classifies stored and runtime credentials into profile/provider rollups for
* status commands and doctor output without prompting keychain access.
*/
const DEFAULT_OAUTH_WARN_MS = 864e5;
/** Format a remaining-duration value for compact auth status displays. */
function formatRemainingShort(remainingMs, opts) {
	if (remainingMs === void 0 || Number.isNaN(remainingMs)) return "unknown";
	if (remainingMs <= 0) return "0m";
	const minutes = Math.round(remainingMs / 6e4);
	if (minutes < 1) return opts?.underMinuteLabel ?? "1m";
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.round(minutes / 60);
	if (hours < 48) return `${hours}h`;
	return `${Math.round(hours / 24)}d`;
}
function resolveOAuthStatus(expiresAt, now, expiringWithinMs) {
	const normalizedExpiresAt = asDateTimestampMs(expiresAt);
	if (normalizedExpiresAt === void 0 || normalizedExpiresAt <= 0) return { status: "missing" };
	const remainingMs = normalizedExpiresAt - now;
	const expiryState = resolveTokenExpiryState(normalizedExpiresAt, now, { expiringWithinMs });
	if (expiryState === "invalid_expires" || expiryState === "missing") return { status: "missing" };
	return {
		status: expiryState === "valid" ? "ok" : expiryState,
		expiresAt: normalizedExpiresAt,
		remainingMs
	};
}
function buildProfileHealth(params) {
	const { profileId, credential, runtimeCredential, store, cfg, now, warnAfterMs } = params;
	const label = resolveAuthProfileDisplayLabel({
		cfg,
		store,
		profileId
	});
	const healthCredential = runtimeCredential ?? credential;
	const profile = {
		profileId,
		provider: normalizeProviderId(healthCredential.provider),
		type: healthCredential.type,
		source: "store",
		label
	};
	const expiringProfileHealth = (expires, expiringWithinMs, includeExpiredReason = false) => {
		const { status, expiresAt, remainingMs } = resolveOAuthStatus(expires, now, expiringWithinMs);
		return {
			...profile,
			status,
			...includeExpiredReason ? { reasonCode: status === "expired" ? "expired" : void 0 } : {},
			expiresAt,
			remainingMs
		};
	};
	if (credential.setup?.replacement) return {
		...profile,
		type: credential.type,
		status: "missing",
		reasonCode: "setup_inactive",
		label: `${label} (saved, inactive)`
	};
	const storedEligibility = evaluateStoredCredentialEligibility({
		credential: healthCredential,
		now
	});
	if (!storedEligibility.eligible && (healthCredential.type !== "oauth" || storedEligibility.reasonCode === "unresolved_ref")) return {
		...profile,
		status: storedEligibility.reasonCode === "expired" ? "expired" : "missing",
		reasonCode: storedEligibility.reasonCode
	};
	if (healthCredential.type === "api_key") return {
		...profile,
		status: "static"
	};
	if (healthCredential.type === "token") {
		const expiresAt = resolveTokenExpiryState(healthCredential.expires, now) === "valid" ? healthCredential.expires : void 0;
		if (!expiresAt) return {
			...profile,
			status: "static"
		};
		return expiringProfileHealth(expiresAt, warnAfterMs ?? 864e5, true);
	}
	const effectiveCredential = resolveEffectiveOAuthCredential({
		profileId,
		credential: healthCredential
	});
	const eligibility = evaluateStoredCredentialEligibility({
		credential: effectiveCredential,
		now
	});
	if (!eligibility.eligible) return {
		...profile,
		status: eligibility.reasonCode === "expired" ? "expired" : "missing",
		reasonCode: eligibility.reasonCode
	};
	const oauthWarnAfterMs = Math.max(warnAfterMs ?? (normalizeSecretInputString(effectiveCredential.refresh) ? 0 : 864e5), DEFAULT_OAUTH_REFRESH_MARGIN_MS);
	return expiringProfileHealth(effectiveCredential.expires, oauthWarnAfterMs);
}
/** Build profile and provider auth health rollups from an auth profile store. */
function buildAuthHealthSummary(params) {
	const now = Date.now();
	const warnAfterMs = params.warnAfterMs ?? 864e5;
	const providerFilter = params.providers ? new Set(normalizeUniqueStringEntries(params.providers.map((p) => normalizeProviderId(p)))) : null;
	const profiles = Object.entries(params.store.profiles).filter(([, cred]) => providerFilter ? providerFilter.has(normalizeProviderId(cred.provider)) : true).map(([profileId, credential]) => buildProfileHealth({
		profileId,
		credential,
		runtimeCredential: params.runtimeCredentialsByProvider?.get(normalizeProviderId(credential.provider)),
		store: params.store,
		cfg: params.cfg,
		now,
		warnAfterMs: params.warnAfterMs
	})).toSorted((a, b) => {
		if (a.provider !== b.provider) return a.provider.localeCompare(b.provider);
		return a.profileId.localeCompare(b.profileId);
	});
	const providersMap = /* @__PURE__ */ new Map();
	const providerHealth = (provider) => {
		const health = providersMap.get(provider) ?? {
			provider,
			status: "missing",
			profiles: []
		};
		providersMap.set(provider, health);
		return health;
	};
	for (const profile of profiles) providerHealth(profile.provider).profiles.push(profile);
	for (const provider of providerFilter ?? []) providerHealth(provider);
	const resolveProviderStatusProfiles = (provider) => {
		const { order: explicitOrder } = resolveExplicitAuthOrderSelection({
			storeOrder: params.store.order,
			configuredOrder: params.cfg?.auth?.order,
			providerKey: provider.provider,
			providerAuthKey: resolveProviderIdForAuth(provider.provider, {
				config: params.cfg,
				...params.authAliasLookupParams,
				storedCredential: true
			})
		});
		if (explicitOrder && explicitOrder.length === 0) return [];
		const ordered = resolveAuthProfileOrder({
			cfg: params.cfg,
			store: params.store,
			provider: provider.provider,
			authAliasLookupParams: params.authAliasLookupParams
		});
		const profilesForOrder = (profileIds) => profileIds.flatMap((profileId) => provider.profiles.find((profile) => profile.profileId === profileId) ?? []);
		const orderedProfiles = profilesForOrder(ordered);
		if (orderedProfiles.length > 0) return orderedProfiles;
		return explicitOrder ? profilesForOrder(explicitOrder) : provider.profiles;
	};
	for (const provider of providersMap.values()) {
		const effectiveProfiles = resolveProviderStatusProfiles(provider);
		provider.effectiveProfiles = effectiveProfiles;
		if (effectiveProfiles.length === 0) {
			provider.status = "missing";
			provider.expiresAt = void 0;
			provider.remainingMs = void 0;
			continue;
		}
		const expirableProfiles = effectiveProfiles.filter((profile) => profile.type !== "api_key");
		const statuses = new Set(effectiveProfiles.map((profile) => profile.status));
		provider.status = [
			"expired",
			"missing",
			"expiring"
		].find((status) => statuses.has(status)) ?? (expirableProfiles.length > 0 ? "ok" : "static");
		let earliestExpiry;
		for (const profile of expirableProfiles) if (profile.expiresAt !== void 0) earliestExpiry = earliestExpiry === void 0 ? profile.expiresAt : Math.min(earliestExpiry, profile.expiresAt);
		if (earliestExpiry !== void 0) {
			provider.expiresAt = earliestExpiry;
			provider.remainingMs = provider.expiresAt - now;
		}
	}
	return {
		now,
		warnAfterMs,
		profiles,
		providers: Array.from(providersMap.values()).toSorted((a, b) => a.provider.localeCompare(b.provider))
	};
}
//#endregion
export { buildAuthHealthSummary as n, formatRemainingShort as r, DEFAULT_OAUTH_WARN_MS as t };
