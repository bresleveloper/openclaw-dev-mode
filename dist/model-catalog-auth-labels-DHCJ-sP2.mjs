import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-AjjSfI-g.mjs";
import { l as isProfileInCooldown } from "./profile-usage-stats-BLwxBqRR.mjs";
import { _ as cloneAuthProfileStore } from "./oauth-shared-CFtD6sCU.mjs";
import { a as resolveAuthProfileOrder, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-B7W96aON.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-DFyGzV4n.mjs";
import { x as resolveUsableCustomProviderApiKey } from "./model-auth-provider-config-s9IgFbYq.mjs";
import "./model-selection-D3_rVb38.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-BIPn3mmc.mjs";
import { r as formatRemainingShort } from "./auth-health-CV7lXWjF.mjs";
import "./model-auth-efmtIdn2.mjs";
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
	if (parseSecretRef(params.refValue)) return "ref";
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
		return mode !== "oauth" && mode !== "token";
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
			source: `auth profile store: ${shortenHomePath(params.authStorePath)}`,
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
