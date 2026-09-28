import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-Dij_chYC.mjs";
import { d as cloneAuthProfileStore } from "./oauth-shared-CVbJLd-k.mjs";
import { b as resolveAuthStorePathForDisplay } from "./profiles-B-MkhBI8.mjs";
import { M as resolveUsableCustomProviderApiKey } from "./loader-runtime-load-DitY2Htf.mjs";
import { a as resolveAuthProfileOrder, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-BQhYF772.mjs";
import { c as isProfileInCooldown } from "./usage-state-Bm5iXGhR.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-BFAOd5yW.mjs";
import { r as formatRemainingShort } from "./auth-health-DwPnNcSg.mjs";
import "./model-auth-D3hh0-wa.mjs";
import "./model-selection-CFnUi6iD.mjs";
//#region src/security/secret-mask.ts
/** Masks credential-like values without splitting UTF-16 surrogate pairs at the edges. */
function maskApiKey(value) {
	const trimmed = stripControlCharacters(value).trim();
	if (!trimmed) return "missing";
	if (trimmed.length <= 6) return `${sliceUtf16Safe(trimmed, 0, 1)}...${sliceUtf16Safe(trimmed, -1)}`;
	if (trimmed.length <= 16) return `${sliceUtf16Safe(trimmed, 0, 2)}...${sliceUtf16Safe(trimmed, -2)}`;
	return `${sliceUtf16Safe(trimmed, 0, 8)}...${sliceUtf16Safe(trimmed, -8)}`;
}
function stripControlCharacters(value) {
	let result = "";
	for (const character of value) {
		const code = character.charCodeAt(0);
		if (!(code >= 0 && code <= 31 || code >= 127 && code <= 159)) result += character;
	}
	return result;
}
//#endregion
//#region src/agents/model-catalog-auth-labels.ts
function resolveStoredCredentialLabel(params) {
	const masked = maskApiKey(typeof params.value === "string" ? params.value : "");
	if (masked !== "missing") return masked;
	if (coerceSecretRef(params.refValue)) return "ref";
	return "missing";
}
/** Reuses time-dependent ordering against captured facts without reopening auth sources. */
function formatModelCatalogAuthLabel(label, context) {
	if (typeof label === "string") return label;
	const { cfg, metadataSnapshot } = context;
	const store = cloneAuthProfileStore(context.store);
	const now = Date.now();
	const order = resolveAuthProfileOrder({
		cfg,
		store,
		provider: label.provider,
		authAliasLookupParams: { metadataSnapshot }
	}).filter((id) => {
		if (!label.apiKeyOnly) return true;
		const mode = store.profiles[id]?.type ?? cfg.auth?.profiles?.[id]?.mode;
		return !isStoredAuthProfileType(mode) || mode === "api_key";
	});
	if (!order.length) return label.fallback;
	const lastGood = findNormalizedProviderValue(store.lastGood, label.provider);
	return `${order.map((profileId, index) => {
		const flags = [];
		if (index === 0) flags.push("next");
		if (lastGood === profileId) flags.push("lastGood");
		if (isProfileInCooldown(store, profileId)) {
			const until = store.usageStats?.[profileId]?.cooldownUntil;
			flags.push(typeof until === "number" && Number.isFinite(until) && until > now ? `cooldown ${formatRemainingShort(until - now, { underMinuteLabel: "soon" })}` : "cooldown");
		}
		const profile = store.profiles[profileId];
		const expires = profile && profile.type !== "api_key" ? asDateTimestampMs(profile.expires) : void 0;
		if (expires !== void 0 && expires > 0) flags.push(expires <= now ? "expired" : ` exp ${formatRemainingShort(expires - now, { underMinuteLabel: "soon" })}`);
		return `${label.profiles[profileId]}${flags.length ? ` (${flags.join(", ")})` : ""}`;
	}).join(", ")} (${label.source})`;
}
function isStoredAuthProfileType(value) {
	return value === "api_key" || value === "oauth" || value === "token";
}
function captureProfileLabel(profileId, cfg, store) {
	const profile = store.profiles[profileId];
	const configProfile = cfg.auth?.profiles?.[profileId];
	if (!profile || configProfile?.provider && configProfile.provider !== profile.provider || configProfile?.mode && configProfile.mode !== profile.type && !(configProfile.mode === "oauth" && profile.type === "token")) return `${profileId}=missing`;
	if (profile.type === "api_key") return `${profileId}=${resolveStoredCredentialLabel({
		value: profile.key,
		refValue: profile.keyRef
	})}`;
	if (profile.type === "token") return `${profileId}=token:${resolveStoredCredentialLabel({
		value: profile.token,
		refValue: profile.tokenRef
	})}`;
	const display = resolveAuthProfileDisplayLabel({
		cfg,
		store,
		profileId
	});
	const suffix = display === profileId ? "" : display.startsWith(profileId) ? display.slice(profileId.length).trim() : `(${display})`;
	return `${profileId}=OAuth${suffix ? ` ${suffix}` : ""}`;
}
function captureFallbackLabel(provider, cfg, agentDir, env, workspaceDir) {
	const envKey = resolveEnvApiKey(provider, env, {
		config: cfg,
		workspaceDir
	});
	if (envKey) {
		const label = envKey.source.includes("ANTHROPIC_OAUTH_TOKEN") || normalizeLowercaseStringOrEmpty(envKey.source).includes("oauth") ? "OAuth (env)" : maskApiKey(envKey.apiKey);
		return envKey.source && envKey.source !== label && envKey.source !== "missing" ? `${label} (${envKey.source})` : label;
	}
	const customKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider
	})?.apiKey;
	if (customKey) return `${maskApiKey(customKey)} (models.json: ${shortenHomePath(`${agentDir}/models.json`)})`;
	return "missing";
}
/** Captures display labels from the generation's auth store and workspace environment. */
function prepareModelCatalogAuthLabels(params) {
	const labels = /* @__PURE__ */ new Map();
	const profileIds = /* @__PURE__ */ new Set([
		...Object.keys(params.store.profiles),
		...Object.keys(params.config.auth?.profiles ?? {}),
		...Object.values(params.store.order ?? {}).flat(),
		...Object.values(params.config.auth?.order ?? {}).flat()
	]);
	const providers = new Set([...params.providers].map(normalizeProviderId));
	if (providers.size === 0) return labels;
	const profileLabels = [...profileIds].map((id) => [id, captureProfileLabel(id, params.config, params.store)]);
	for (const provider of providers) {
		const all = {
			provider,
			profiles: Object.fromEntries(profileLabels.map(([id, label]) => [id, !params.store.profiles[id] && isConfiguredAwsSdkAuthProfileForProvider({
				cfg: params.config,
				provider,
				profileId: id
			}) ? `${id}=aws-sdk` : label])),
			source: `auth profile store: ${shortenHomePath(resolveAuthStorePathForDisplay(params.agentDir))}`,
			fallback: captureFallbackLabel(provider, params.config, params.agentDir, params.env, params.workspaceDir),
			apiKeyOnly: false
		};
		labels.set(provider, {
			all,
			apiKey: provider === "openai" ? {
				...all,
				apiKeyOnly: true
			} : all
		});
	}
	return labels;
}
//#endregion
export { prepareModelCatalogAuthLabels as n, maskApiKey as r, formatModelCatalogAuthLabel as t };
