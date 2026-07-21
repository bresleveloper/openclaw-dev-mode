import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
import { l as isSecretRef } from "./types.secrets-OocW4TQ1.js";
import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import "./agent-scope-B2Pk_xhT.js";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-BxAUeF6t.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-BMy8GnRz.js";
import { f as resolvePersistedAuthProfileOwnerAgentDir, i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore, t as clearRuntimeAuthProfileStoreSnapshots } from "./store-9jfx-1KO.js";
import "./auth-profiles-aoLBSIs2.js";
import { t as externalCliDiscoveryForConfigStatus } from "./external-cli-discovery-BA28IiyS.js";
import { i as removeProviderAuthProfilesWithLock } from "./profiles-Bs4Dh6yw.js";
import { n as listProfilesForProvider } from "./profile-list-DcdGY7PM.js";
import { r as clearCurrentProviderAuthState } from "./model-provider-auth-state-DW_JYm-o.js";
import { i as warmCurrentProviderAuthStateOffMainThread } from "./model-provider-auth-BEZv7x5V.js";
import "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import { n as abortChatRunsForProvider } from "./chat-abort-BIKxT7ef.js";
import { t as formatForLog } from "./ws-log-C5Rq9COn.js";
import { n as PROVIDER_LABELS, s as resolveUsageProviderId } from "./provider-usage.shared-B3BXN4xI.js";
import { t as loadProviderUsageSummary } from "./provider-usage.load-gK2l6PFx.js";
import { n as buildAuthHealthSummary, r as formatRemainingShort } from "./auth-health-DVoqBBjt.js";
import { s as refreshActiveSecretsRuntimeSnapshot } from "./runtime-BXhPvrVM.js";
//#region src/gateway/server-methods/models-auth-status.ts
const log = createSubsystemLogger("models-auth-status");
const apiKeyUsageStatusProviders = /* @__PURE__ */ new Set(["clawrouter", "deepseek"]);
const CACHE_TTL_MS = 6e4;
let cached = null;
/**
* Invalidate the in-memory cache. Reserved for future gateway-side auth
* mutation handlers (login, logout, token rotation) so the next read returns
* fresh data. Today those mutations happen via the CLI and the 60s TTL plus
* `{refresh: true}` param cover the stale-data window.
*/
function invalidateModelAuthStatusCache() {
	cached = null;
	clearCurrentProviderAuthState();
}
async function refreshModelAuthStatusRuntimeState() {
	invalidateModelAuthStatusCache();
	try {
		if (await refreshActiveSecretsRuntimeSnapshot()) return;
	} catch (err) {
		log.warn(`runtime auth snapshot refresh before auth status failed: ${formatForLog(err)}`);
		return;
	}
	clearRuntimeAuthProfileStoreSnapshots();
}
function readProviderParam(params) {
	const raw = params.provider;
	if (typeof raw !== "string") return null;
	return normalizeProviderId(raw) || null;
}
function createAuthLogoutAbortOps(context) {
	return {
		chatAbortControllers: context.chatAbortControllers,
		chatRunBuffers: context.chatRunBuffers,
		chatAbortedRuns: context.chatAbortedRuns,
		clearChatRunState: context.clearChatRunState,
		removeChatRun: context.removeChatRun,
		agentRunSeq: context.agentRunSeq,
		broadcast: context.broadcast,
		nodeSendToSession: context.nodeSendToSession
	};
}
async function removeProviderAuthProfilesAcrossOwnerStores(params) {
	const ownerAgentDirs = /* @__PURE__ */ new Set([params.agentDir]);
	for (const profileId of params.profileIds) ownerAgentDirs.add(resolvePersistedAuthProfileOwnerAgentDir({
		agentDir: params.agentDir,
		profileId
	}));
	for (const ownerAgentDir of ownerAgentDirs) if (!await removeProviderAuthProfilesWithLock({
		provider: params.provider,
		agentDir: ownerAgentDir
	})) return false;
	return true;
}
function buildExpiry(remainingMs, expiresAt) {
	const normalizedExpiresAt = asDateTimestampMs(expiresAt);
	if (normalizedExpiresAt === void 0 || typeof remainingMs !== "number") return;
	return {
		at: normalizedExpiresAt,
		remainingMs,
		label: formatRemainingShort(remainingMs)
	};
}
function providerDisplayName(provider) {
	const usageId = resolveUsageProviderId(provider);
	if (usageId && PROVIDER_LABELS[usageId]) return PROVIDER_LABELS[usageId];
	return provider;
}
/**
* Aggregate provider status from OAuth profiles only. `buildAuthHealthSummary`
* rolls up across both OAuth and token profiles, which mis-reports providers
* where a healthy OAuth sits alongside an expired/missing bearer token.
* For the dashboard's OAuth-health signal, token profiles are a separate
* concern — we want "is OAuth healthy?", not "is every credential healthy?"
* It also consumes the provider's effective profile subset when auth order
* excludes stale inventory from the runtime credential path.
*
* `expectsOAuth` surfaces the configured-OAuth-but-no-oauth-profile case as
* `missing` instead of silently falling back to the provider's rollup (which
* would report `static` if only api_key credentials exist). Without this,
* switching a provider from api_key to oauth in config but forgetting to
* login hides behind the residual api_key profile until runtime fails.
*
* Exported for direct unit testing of the rollup rules.
*/
function aggregateOAuthStatus(prov, now = Date.now(), expectsOAuth = false) {
	const oauth = (prov.effectiveProfiles ?? prov.profiles).filter((p) => p.type === "oauth");
	if (oauth.length === 0) {
		if (expectsOAuth) return { status: "missing" };
		return {
			status: prov.status,
			expiresAt: prov.expiresAt,
			remainingMs: prov.remainingMs
		};
	}
	const statuses = new Set(oauth.map((p) => p.status));
	let status;
	if (statuses.has("expired")) status = "expired";
	else if (statuses.has("missing")) status = "missing";
	else if (statuses.has("expiring")) status = "expiring";
	else if (statuses.has("ok")) status = "ok";
	else if (statuses.has("static")) status = "static";
	else {
		Array.from(statuses)[0];
		status = "static";
	}
	const expirable = oauth.map((p) => p.expiresAt).filter((v) => asDateTimestampMs(v) !== void 0);
	const expiresAt = expirable.length > 0 ? Math.min(...expirable) : void 0;
	const remainingMs = expiresAt !== void 0 ? expiresAt - now : void 0;
	return {
		status,
		expiresAt,
		remainingMs
	};
}
function mapProvider(prov, usageByProvider, expectsOAuthSet) {
	const usageProfile = prov.profiles.find((profile) => profile.type === "oauth" || profile.type === "token") ?? prov.profiles.find((profile) => profile.type === "api_key");
	const usageKey = resolveUsageProviderId(prov.provider, { credentialType: usageProfile?.type });
	const usage = usageKey ? usageByProvider.get(usageKey) : void 0;
	const rollup = aggregateOAuthStatus(prov, Date.now(), expectsOAuthSet.has(prov.provider));
	return {
		provider: prov.provider,
		displayName: providerDisplayName(prov.provider),
		status: rollup.status,
		expiry: buildExpiry(rollup.remainingMs, rollup.expiresAt),
		profiles: prov.profiles.map((prof) => ({
			profileId: prof.profileId,
			type: prof.type,
			status: prof.status,
			reasonCode: prof.reasonCode,
			expiry: buildExpiry(prof.remainingMs, prof.expiresAt)
		})),
		usage: usage ? {
			windows: usage.windows,
			...usage.summary ? { summary: usage.summary } : {},
			...usage.plan ? { plan: usage.plan } : {}
		} : void 0
	};
}
/**
* Collect provider IDs with refreshable credentials (OAuth or bearer token)
* so a configured-but-not-logged-in provider surfaces as `missing` rather
* than being silently absent. API-key and AWS-SDK providers are excluded —
* their credentials don't expire on a schedule this endpoint can meaningfully
* monitor, and surfacing them here would flash a red alert on a healthy
* API-key setup.
*
* Providers with `models.providers.<id>.apiKey` set (commonly via a
* SecretRef env binding) are excluded from the "missing" synthesis even
* when their `auth` mode is `oauth` or `token` — an env-backed credential
* is already present, so flagging the dashboard as missing would cry wolf
* for a working auth path. They can still show up with real status if the
* profile store has an entry for them.
*/
function resolveConfiguredProviders(cfg) {
	const out = /* @__PURE__ */ new Set();
	const expectsOAuth = /* @__PURE__ */ new Set();
	const envBacked = /* @__PURE__ */ new Set();
	for (const [id, provider] of Object.entries(cfg.models?.providers ?? {})) {
		const apiKey = provider?.apiKey;
		if (!id || apiKey === void 0 || apiKey === null) continue;
		let resolvable = false;
		if (typeof apiKey === "string" && apiKey.length > 0) resolvable = true;
		else if (isSecretRef(apiKey)) if (apiKey.source === "env") {
			const envValue = process.env[apiKey.id];
			resolvable = typeof envValue === "string" && envValue.length > 0;
		} else resolvable = true;
		if (resolvable) envBacked.add(normalizeProviderId(id));
	}
	for (const [id, provider] of Object.entries(cfg.models?.providers ?? {})) {
		if (!id) continue;
		const mode = provider?.auth;
		if (mode !== "oauth" && mode !== "token") continue;
		if (envBacked.has(normalizeProviderId(id))) continue;
		out.add(id);
		if (mode === "oauth") expectsOAuth.add(normalizeProviderId(id));
	}
	for (const profile of Object.values(cfg.auth?.profiles ?? {})) {
		const provider = profile?.provider;
		const mode = profile?.mode;
		if (typeof provider !== "string" || provider.length === 0 || mode !== "oauth" && mode !== "token") continue;
		if (envBacked.has(normalizeProviderId(provider))) continue;
		out.add(provider);
		if (mode === "oauth") expectsOAuth.add(normalizeProviderId(provider));
	}
	return {
		providers: Array.from(out),
		expectsOAuth
	};
}
const modelsAuthStatusHandlers = {
	"models.authLogout": async ({ params, respond, context }) => {
		const provider = readProviderParam(params);
		if (!provider) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "provider is required"));
			return;
		}
		try {
			const cfg = context.getRuntimeConfig();
			const agentDir = resolveDefaultAgentDir(cfg);
			const authProvider = resolveProviderIdForAuth(provider, { config: cfg });
			const removedProfiles = listProfilesForProvider(ensureAuthProfileStoreWithoutExternalProfiles(agentDir), provider);
			if (!await removeProviderAuthProfilesAcrossOwnerStores({
				provider,
				agentDir,
				profileIds: removedProfiles
			})) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `failed to remove saved auth profiles for provider ${provider}`));
				return;
			}
			await refreshActiveSecretsRuntimeSnapshot();
			invalidateModelAuthStatusCache();
			clearCurrentProviderAuthState();
			warmCurrentProviderAuthStateOffMainThread(context.getRuntimeConfig()).catch((err) => {
				log.warn(`provider auth state rewarm after logout failed: ${formatForLog(err)}`);
			});
			const { runIds: abortedRunIds } = abortChatRunsForProvider(createAuthLogoutAbortOps(context), {
				providerId: authProvider,
				stopReason: "auth-revoked"
			});
			respond(true, {
				provider,
				removedProfiles,
				abortedRunIds
			}, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"models.authStatus": async ({ params, respond, context }) => {
		const now = Date.now();
		const bypassCache = Boolean(params?.refresh);
		if (!bypassCache && cached && now - cached.ts < CACHE_TTL_MS) {
			respond(true, cached.result, void 0, { cached: true });
			return;
		}
		try {
			if (bypassCache) await refreshModelAuthStatusRuntimeState();
			const cfg = context.getRuntimeConfig();
			const agentDir = resolveDefaultAgentDir(cfg);
			const store = ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForConfigStatus({ cfg }) });
			const configured = resolveConfiguredProviders(cfg);
			const authHealth = buildAuthHealthSummary({
				store,
				cfg,
				providers: configured.providers.length > 0 ? configured.providers : void 0,
				allowKeychainPrompt: false
			});
			const usageProviderIds = [...new Set(authHealth.profiles.filter((p) => {
				if (p.type === "oauth" || p.type === "token") return true;
				const usageProvider = resolveUsageProviderId(p.provider, { credentialType: p.type });
				return usageProvider ? apiKeyUsageStatusProviders.has(usageProvider) : false;
			}).map((p) => resolveUsageProviderId(p.provider, { credentialType: p.type })).filter((id) => Boolean(id)))];
			const usageByProvider = /* @__PURE__ */ new Map();
			if (usageProviderIds.length > 0) try {
				const usage = await loadProviderUsageSummary({
					providers: usageProviderIds,
					agentDir,
					timeoutMs: 3500
				});
				for (const snap of usage.providers) usageByProvider.set(snap.provider, {
					windows: snap.windows,
					...snap.summary ? { summary: snap.summary } : {},
					...snap.plan ? { plan: snap.plan } : {}
				});
			} catch (err) {
				log.debug(`usage enrichment failed (auth status still returned): providers=${usageProviderIds.join(",")} error=${formatForLog(err)}`);
			}
			const result = {
				ts: now,
				providers: authHealth.providers.map((prov) => mapProvider(prov, usageByProvider, configured.expectsOAuth))
			};
			cached = {
				ts: now,
				result
			};
			respond(true, result, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	}
};
//#endregion
export { aggregateOAuthStatus, invalidateModelAuthStatusCache, modelsAuthStatusHandlers };
