import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { f as normalizeSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { r as resolveEffectiveOAuthCredential } from "./oauth-DPCtruSK.mjs";
import { a as resolveTokenExpiryState, n as evaluateStoredCredentialEligibility, t as DEFAULT_OAUTH_REFRESH_MARGIN_MS } from "./credential-state-WXO5HScp.mjs";
import { a as resolveAuthProfileOrder, m as resolveExplicitAuthOrderSelection } from "./order-B7W96aON.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-DqHEfJ-y.mjs";
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
	const { profileId, credential, runtimeCredential, store, cfg, now, warnAfterMs, allowKeychainPrompt } = params;
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
		const { status, expiresAt: normalizedExpiresAt, remainingMs } = resolveOAuthStatus(expiresAt, now, warnAfterMs ?? 864e5);
		return {
			...profile,
			status,
			reasonCode: status === "expired" ? "expired" : void 0,
			expiresAt: normalizedExpiresAt,
			remainingMs
		};
	}
	const effectiveCredential = resolveEffectiveOAuthCredential({
		store,
		profileId,
		credential: healthCredential,
		allowKeychainPrompt
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
	const { status, expiresAt, remainingMs } = resolveOAuthStatus(effectiveCredential.expires, now, oauthWarnAfterMs);
	return {
		...profile,
		status,
		expiresAt,
		remainingMs
	};
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
		warnAfterMs: params.warnAfterMs,
		allowKeychainPrompt: params.allowKeychainPrompt
	})).toSorted((a, b) => {
		if (a.provider !== b.provider) return a.provider.localeCompare(b.provider);
		return a.profileId.localeCompare(b.profileId);
	});
	const providersMap = /* @__PURE__ */ new Map();
	for (const profile of profiles) {
		const existing = providersMap.get(profile.provider);
		if (!existing) providersMap.set(profile.provider, {
			provider: profile.provider,
			status: "missing",
			profiles: [profile]
		});
		else existing.profiles.push(profile);
	}
	if (providerFilter) {
		for (const provider of providerFilter) if (!providersMap.has(provider)) providersMap.set(provider, {
			provider,
			status: "missing",
			profiles: []
		});
	}
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
		const orderedProfiles = resolveAuthProfileOrder({
			cfg: params.cfg,
			store: params.store,
			provider: provider.provider,
			authAliasLookupParams: params.authAliasLookupParams
		}).map((profileId) => provider.profiles.find((profile) => profile.profileId === profileId)).filter((profile) => Boolean(profile));
		if (orderedProfiles.length > 0) return orderedProfiles;
		if (explicitOrder) return explicitOrder.map((profileId) => provider.profiles.find((profile) => profile.profileId === profileId)).filter((profile) => Boolean(profile));
		return provider.profiles;
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
