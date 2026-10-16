import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-DsPRn9Dz.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as normalizeProviderId, t as findNormalizedProviderKey } from "./provider-id-D1VImdKk.mjs";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { s as resolveProviderAuthLookupMaps } from "./provider-env-vars-C_lyIdYO.mjs";
import { d as hasGatewayAdminScope } from "./operator-scopes-DsrPoRc4.mjs";
import { Sn as validateModelsAuthSetApiKeyParams, xn as validateModelsAuthRefreshParams } from "./src-l2dWvEsN.mjs";
import { h as getRuntimeExternalCliProfileIds } from "./persisted-BVyWmvfF.mjs";
import { t as DEFAULT_OAUTH_REFRESH_MARGIN_MS } from "./credential-state-WXO5HScp.mjs";
import { C as isExternalCliAuthProfileInScope } from "./store-SwwRUDrm.mjs";
import { m as getRuntimeAuthProfileStoreSnapshotsRevision } from "./runtime-snapshots-CSLjByUx.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as externalCliDiscoveryForConfigStatus } from "./external-cli-discovery-CzdLbOjb.mjs";
import { f as listProfilesForProvider, m as resolveExplicitAuthOrderSelection } from "./order-B7W96aON.mjs";
import "./provider-credential-values-Cf7LMsFg.mjs";
import { f as listProviderEnvAuthLookupKeys, o as isKnownEnvApiKeyMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import { r as resolveProviderEnvAuthEvidence } from "./model-auth-env-CI3qSPg4.mjs";
import { _ as resolveProviderConfigSecretInput, x as resolveUsableCustomProviderApiKey, y as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-U8dA4bob.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-CzCCJ_Oe.mjs";
import { n as resolveAuthProfileMetadata } from "./identity-CkXDj4l-.mjs";
import { c as resolveUsageProviderId, o as providerUsageLabel } from "./provider-usage.shared-B2Q7uCr7.mjs";
import "./auth-profiles-DqHEfJ-y.mjs";
import { n as buildAuthHealthSummary, r as formatRemainingShort, t as DEFAULT_OAUTH_WARN_MS } from "./auth-health-BV-braTj.mjs";
import "./model-auth-DfAz5WFK.mjs";
import { n as abortChatRunsForProvider } from "./chat-abort-DsJ_Zmkt.mjs";
import { n as readPreparedCatalog, t as loadDeferredCatalog } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { u as refreshActiveProviderAuthRuntimeSnapshot } from "./runtime-I_zJ4x-o.mjs";
import { t as resolveModelAuthAgentScope } from "./model-auth-agent-scope-0oXdPDH7.mjs";
import { i as getProviderUsageRuntimeSnapshot, r as readProviderUsageStaleWhileRevalidate } from "./models-auth-status-usage-cache-Bo64DSVw.mjs";
import { t as refreshModelAuthStateAfterMutation } from "./model-auth-refresh-DdvP_AMz.mjs";
import { n as respondUnavailableOnThrow } from "./response-BKwLtoRW.mjs";
import { t as resolveConfigBoundProfileIds } from "./models-auth-status-config-DVwMcoFk.mjs";
import { t as resolveModelProviderCapabilities } from "./model-provider-capabilities-C6-cG1Ha.mjs";
//#region src/gateway/server-methods/models-auth-refresh.ts
const modelsAuthRefreshHandlers = { "models.authRefresh": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateModelsAuthRefreshParams, "models.authRefresh", respond)) return;
	const config = context.getRuntimeConfig();
	const scope = resolveModelAuthAgentScope(config, params.agentId === void 0 || params.agentId === "" ? tryResolveAmbientOwnerAgentId(config) : params.agentId);
	if (!scope.ok) {
		respond(false, void 0, scope.error);
		return;
	}
	await respondUnavailableOnThrow(respond, async () => {
		await refreshModelAuthStateAfterMutation(context.getRuntimeConfig, scope.agentId);
		respond(true, { refreshed: true }, void 0);
	});
} };
//#endregion
//#region src/gateway/server-methods/models-auth-status-api-keys.ts
function resolveEnvVarName(source) {
	return /^(?:shell env|env): ([A-Z][A-Z0-9_]*)$/u.exec(source)?.[1];
}
function resolveProviderApiKeys(cfg, store, authAliasLookupParams) {
	const lookupMaps = resolveProviderAuthLookupMaps({
		...authAliasLookupParams,
		config: cfg,
		env: process.env
	});
	const providerIds = /* @__PURE__ */ new Set([
		...Object.keys(cfg.models?.providers ?? {}),
		...Object.values(cfg.auth?.profiles ?? {}).map((profile) => profile?.provider).filter((provider) => typeof provider === "string"),
		...listProviderEnvAuthLookupKeys(lookupMaps)
	]);
	const apiKeys = /* @__PURE__ */ new Map();
	for (const rawProvider of providerIds) {
		const provider = normalizeProviderId(rawProvider);
		if (!provider) continue;
		const { providerConfig, ref } = resolveProviderConfigSecretInput(cfg, provider);
		if (hasConfiguredSecretInput(providerConfig?.apiKey, cfg.secrets?.defaults)) {
			const profileReference = resolveProviderEntryApiKeyProfileReference({
				cfg,
				authAliasLookupParams,
				provider,
				store
			});
			if (profileReference.kind !== "profile" && profileReference.kind !== "profile-incompatible") {
				if (ref && ref.source !== "env") {
					apiKeys.set(provider, { source: "config" });
					continue;
				}
				const available = resolveUsableCustomProviderApiKey({
					cfg,
					provider,
					env: process.env
				});
				if (available) {
					const rawKey = typeof providerConfig?.apiKey === "string" ? providerConfig.apiKey.trim() : "";
					if (rawKey && isNonSecretApiKeyMarker(rawKey, { includeEnvVarName: false })) continue;
					const envVar = ref?.source === "env" ? ref.id : profileReference.kind === "marker" && isKnownEnvApiKeyMarker(rawKey) ? rawKey : resolveEnvVarName(available.source);
					apiKeys.set(provider, envVar ? {
						source: "env",
						envVar
					} : { source: "config" });
					continue;
				}
			}
		}
		const envEvidence = resolveProviderEnvAuthEvidence(provider, process.env, {
			aliasMap: lookupMaps.aliasMap,
			candidateMap: lookupMaps.envCandidateMap,
			authEvidenceMap: lookupMaps.authEvidenceMap
		});
		if (envEvidence?.mode === "api-key") {
			const envVar = resolveEnvVarName(envEvidence.source);
			apiKeys.set(provider, {
				source: "env",
				...envVar ? { envVar } : {}
			});
		}
	}
	return apiKeys;
}
//#endregion
//#region src/gateway/server-methods/models-auth-status-facts.ts
const apiKeyUsageStatusProviders = /* @__PURE__ */ new Set(["clawrouter", "deepseek"]);
function resolveConfiguredProviders(cfg, apiKeys) {
	const out = /* @__PURE__ */ new Set();
	const expectsOAuth = /* @__PURE__ */ new Set();
	for (const [id, provider] of Object.entries(cfg.models?.providers ?? {})) {
		const normalized = normalizeProviderId(id);
		if (!normalized) continue;
		const rawKey = typeof provider?.apiKey === "string" ? provider.apiKey.trim() : "";
		const hasApiKey = hasConfiguredSecretInput(provider?.apiKey, cfg.secrets?.defaults) && (rawKey === "secretref-managed" || !isNonSecretApiKeyMarker(rawKey, { includeEnvVarName: false }));
		const mode = provider?.auth;
		if (mode !== "oauth" && mode !== "token" && !hasApiKey) continue;
		if (apiKeys.has(normalized)) continue;
		out.add(normalized);
		if (mode === "oauth") expectsOAuth.add(normalized);
	}
	for (const profile of Object.values(cfg.auth?.profiles ?? {})) {
		const provider = profile?.provider;
		const mode = profile?.mode;
		if (typeof provider !== "string" || provider.length === 0 || mode !== "oauth" && mode !== "token") continue;
		const normalized = normalizeProviderId(provider);
		if (!normalized) continue;
		if (apiKeys.has(normalized)) continue;
		out.add(normalized);
		if (mode === "oauth") expectsOAuth.add(normalized);
	}
	return {
		providers: Array.from(out),
		expectsOAuth
	};
}
const authStatusFacts = /* @__PURE__ */ new WeakMap();
function buildModelAuthStatusFacts(preparedSnapshot, now) {
	const { config: cfg, authStore: store, workspaceDir } = preparedSnapshot;
	const authAliasLookupParams = {
		config: cfg,
		workspaceDir,
		metadataSnapshot: preparedSnapshot.metadataSnapshot,
		includeUntrustedWorkspacePlugins: false
	};
	const apiKeys = resolveProviderApiKeys(cfg, store, authAliasLookupParams);
	const configured = resolveConfiguredProviders(cfg, apiKeys);
	const statusProviderIds = new Set(configured.providers);
	for (const provider of apiKeys.keys()) statusProviderIds.add(provider);
	for (const profile of Object.values(store.profiles)) {
		const provider = normalizeProviderId(profile.provider);
		if (provider) statusProviderIds.add(provider);
	}
	const readAuthHealth = () => buildAuthHealthSummary({
		store,
		cfg,
		providers: statusProviderIds.size > 0 ? [...statusProviderIds] : void 0,
		allowKeychainPrompt: false,
		authAliasLookupParams
	});
	const authHealth = readAuthHealth();
	const readsExternalAuth = authHealth.profiles.some((profile) => profile.type === "oauth" && isExternalCliAuthProfileInScope({
		store,
		profileId: profile.profileId
	}));
	const usageProviderIds = [...new Set(authHealth.profiles.flatMap((profile) => {
		const provider = resolveUsageProviderId(profile.provider, { credentialType: profile.type });
		return provider && (profile.type === "oauth" || profile.type === "token" || apiKeyUsageStatusProviders.has(provider)) ? [provider] : [];
	}))];
	const externalProfileIds = new Set(store.runtimeExternalProfileIds ?? []);
	const externalCliProfileIds = new Set(getRuntimeExternalCliProfileIds(store));
	const logoutProfileIds = new Set(Object.entries(store.profiles).filter(([profileId, profile]) => !externalProfileIds.has(profileId) && (profile.type !== "api_key" || !profile.keyRef)).map(([profileId]) => profileId));
	const configBoundProfileIds = resolveConfigBoundProfileIds(cfg, store, authAliasLookupParams);
	const configBoundAuthProviders = new Set(Object.entries(store.profiles).filter(([profileId]) => configBoundProfileIds.has(profileId)).map(([, profile]) => resolveProviderIdForAuth(profile.provider, {
		...authAliasLookupParams,
		storedCredential: true
	})));
	const providerCapabilities = resolveModelProviderCapabilities({
		config: cfg,
		workspaceDir,
		metadataSnapshot: preparedSnapshot.metadataSnapshot
	}).capabilities;
	let refreshAt = Infinity;
	for (const profile of authHealth.profiles) {
		if (profile.expiresAt === void 0) continue;
		for (const margin of [
			DEFAULT_OAUTH_WARN_MS,
			DEFAULT_OAUTH_REFRESH_MARGIN_MS,
			0
		]) {
			const at = profile.expiresAt - margin;
			if (at > now) refreshAt = Math.min(refreshAt, at);
		}
	}
	return {
		authAliasLookupParams,
		apiKeys,
		configured,
		authHealth,
		readAuthHealth: readsExternalAuth ? readAuthHealth : void 0,
		usageProviderIds,
		externalProfileIds,
		externalCliProfileIds,
		logoutProfileIds,
		configBoundProfileIds,
		configBoundAuthProviders,
		providerCapabilities,
		refreshAt
	};
}
function readModelAuthStatusFacts(snapshot, refresh, now) {
	let agents = authStatusFacts.get(snapshot.config);
	if (!agents) {
		agents = /* @__PURE__ */ new Map();
		authStatusFacts.set(snapshot.config, agents);
	}
	const revision = getRuntimeAuthProfileStoreSnapshotsRevision();
	const cached = agents.get(snapshot.agentId);
	if (!refresh && cached && cached.revision === revision && cached.profiles === snapshot.authStore.profiles && cached.owner === snapshot.isCurrent && cached.metadata === snapshot.metadataSnapshot && cached.agentDir === snapshot.agentDir && cached.workspaceDir === snapshot.workspaceDir && now < cached.facts.refreshAt) return cached.facts.readAuthHealth ? {
		...cached.facts,
		authHealth: cached.facts.readAuthHealth()
	} : cached.facts;
	const facts = buildModelAuthStatusFacts(snapshot, now);
	agents.set(snapshot.agentId, {
		profiles: snapshot.authStore.profiles,
		owner: snapshot.isCurrent,
		metadata: snapshot.metadataSnapshot,
		agentDir: snapshot.agentDir,
		workspaceDir: snapshot.workspaceDir,
		revision,
		facts
	});
	return facts;
}
//#endregion
//#region src/gateway/server-methods/models-auth-status.ts
const log = createSubsystemLogger("models-auth-status");
function resolveAuthRefreshScope(cfg) {
	const discovery = externalCliDiscoveryForConfigStatus({ cfg });
	if (discovery.mode !== "scoped") return { providerIds: [] };
	const providerIds = [...discovery.providerIds ?? []];
	const profileIds = [...discovery.profileIds ?? []];
	return {
		providerIds,
		...profileIds.length > 0 ? { profileIds } : {}
	};
}
function readProviderParam(params) {
	const raw = params.provider;
	if (typeof raw !== "string") return null;
	return normalizeProviderId(raw) || null;
}
function readLogoutProfileSelection(params) {
	if (!("profileIds" in params)) return { ok: true };
	if (!Array.isArray(params.profileIds) || params.profileIds.length === 0) return {
		ok: false,
		message: "profileIds must be a non-empty string array"
	};
	for (const value of params.profileIds) if (typeof value !== "string" || !value.trim()) return {
		ok: false,
		message: "profileIds must be a non-empty string array"
	};
	return {
		ok: true,
		profileIds: normalizeUniqueStringEntries(params.profileIds)
	};
}
function createAuthLogoutAbortOps(context) {
	return {
		chatAbortControllers: context.chatAbortControllers,
		chatRunState: context.chatRunState,
		removeChatRun: context.removeChatRun,
		agentRunSeq: context.agentRunSeq,
		broadcast: context.broadcast,
		nodeSendToSession: context.nodeSendToSession
	};
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
	return usageId && providerUsageLabel(usageId) || provider;
}
function aggregateProfileStatus(profiles, now) {
	const statuses = new Set(profiles.map((profile) => profile.status));
	const status = [
		"expired",
		"missing",
		"expiring",
		"ok",
		"static"
	].find((candidate) => statuses.has(candidate));
	const expirable = profiles.map((p) => p.expiresAt).filter((v) => asDateTimestampMs(v) !== void 0);
	const expiresAt = expirable.length > 0 ? Math.min(...expirable) : void 0;
	const remainingMs = expiresAt !== void 0 ? expiresAt - now : void 0;
	return {
		status: status ?? "static",
		expiresAt,
		remainingMs
	};
}
/**
* Aggregate the effective refreshable credential status for the dashboard.
* OAuth remains authoritative when present; token credentials are the
* supported fallback after an OAuth-to-token migration. Explicit auth-order
* exclusions remain authoritative through `effectiveProfiles`.
*
* `expectsOAuth` keeps an API-key-only provider `missing` after config switches
* to OAuth but login has not completed.
*/
function aggregateRefreshableAuthStatus(prov, now = Date.now(), expectsOAuth = false) {
	const profiles = prov.effectiveProfiles ?? prov.profiles;
	const oauth = profiles.filter((profile) => profile.type === "oauth");
	if (oauth.length > 0) return aggregateProfileStatus(oauth, now);
	const tokens = profiles.filter((profile) => profile.type === "token");
	if (tokens.length > 0) return aggregateProfileStatus(tokens, now);
	if (expectsOAuth) return { status: "missing" };
	return {
		status: prov.status,
		expiresAt: prov.expiresAt,
		remainingMs: prov.remainingMs
	};
}
function mapProvider(prov, cfg, store, authAliasLookupParams, usageByProvider, expectsOAuthSet, apiKeys, logoutProfileIds, configBoundProfileIds, configBoundAuthProviders, externalProfileIds, externalCliProfileIds, includeProfileIdentity) {
	const providerKey = normalizeProviderId(prov.provider);
	const authProviderKey = resolveProviderIdForAuth(prov.provider, authAliasLookupParams);
	const profileOrder = resolveExplicitAuthOrderSelection({
		storeOrder: store.order,
		configuredOrder: cfg.auth?.order,
		providerKey,
		providerAuthKey: authProviderKey
	});
	const storedOrderKey = findNormalizedProviderKey(store.order, authProviderKey) ?? findNormalizedProviderKey(store.order, providerKey);
	const localOrderStored = storedOrderKey !== void 0 && store.runtimeLocalOrderProviderIds?.includes(storedOrderKey);
	const localProfileIds = new Set(store.runtimeLocalProfileIds ?? Object.keys(store.profiles).filter((profileId) => !externalProfileIds.has(profileId)));
	const providerOrderLocked = configBoundAuthProviders.has(authProviderKey);
	const configuredOrderLocked = profileOrder.order !== void 0 && !profileOrder.fromStore;
	const usageProfile = prov.profiles.find((profile) => profile.type === "oauth" || profile.type === "token") ?? prov.profiles.find((profile) => profile.type === "api_key");
	const usageKey = resolveUsageProviderId(prov.provider, { credentialType: usageProfile?.type });
	const usage = usageKey ? usageByProvider.get(usageKey) : void 0;
	const rawRollup = aggregateRefreshableAuthStatus(prov, Date.now(), expectsOAuthSet.has(prov.provider));
	const refreshableProfiles = (prov.effectiveProfiles ?? prov.profiles).filter((profile) => profile.type === "oauth" || profile.type === "token");
	const rollup = refreshableProfiles.length > 0 && refreshableProfiles.every((profile) => profile.type === "oauth" && externalCliProfileIds.has(profile.profileId)) && (rawRollup.status === "expired" || rawRollup.status === "expiring") ? { status: "ok" } : rawRollup;
	const apiKey = apiKeys.get(normalizeProviderId(prov.provider));
	const hasRefreshableProfile = prov.profiles.some((profile) => profile.type === "oauth" || profile.type === "token");
	return {
		provider: prov.provider,
		authProvider: authProviderKey,
		displayName: providerDisplayName(prov.provider),
		status: apiKey && !hasRefreshableProfile && rollup.status === "missing" ? "static" : rollup.status,
		expiry: buildExpiry(rollup.remainingMs, rollup.expiresAt),
		profiles: prov.profiles.map((prof) => {
			const metadata = resolveAuthProfileMetadata({
				cfg,
				store,
				profileId: prof.profileId
			});
			const lastUsedAt = store.usageStats?.[prof.profileId]?.lastUsed;
			return {
				profileId: prof.profileId,
				type: prof.type,
				status: prof.status,
				reasonCode: prof.reasonCode,
				source: configBoundProfileIds.has(prof.profileId) ? "config" : externalProfileIds.has(prof.profileId) ? "external" : localProfileIds.has(prof.profileId) ? "saved" : "inherited",
				expiry: buildExpiry(prof.expiresAt === void 0 ? prof.remainingMs : prof.expiresAt - Date.now(), prof.expiresAt),
				...externalCliProfileIds.has(prof.profileId) ? { externallyManaged: true } : {},
				...includeProfileIdentity && metadata.displayName ? { displayName: metadata.displayName } : {},
				...prof.reasonCode === "setup_inactive" ? { displayName: "Saved sign-in (inactive)" } : {},
				...includeProfileIdentity && metadata.email ? { email: metadata.email } : {},
				...includeProfileIdentity && lastUsedAt ? { lastUsedAt } : {},
				...logoutProfileIds.has(prof.profileId) ? { logoutSupported: true } : {}
			};
		}),
		...profileOrder.order !== void 0 ? { profileOrder: profileOrder.order } : {},
		...profileOrder.fromStore && localOrderStored ? { profileOrderStored: true } : {},
		...providerOrderLocked ? { profileOrderLocked: "provider-config" } : configuredOrderLocked ? { profileOrderLocked: "auth-config" } : {},
		...apiKey ? { apiKey } : {},
		usage: usage && usageKey ? {
			providerId: usageKey,
			windows: usage.windows,
			...usage.summary ? { summary: usage.summary } : {},
			...usage.plan ? { plan: usage.plan } : {},
			...usage.billing?.length ? { billing: usage.billing } : {},
			...includeProfileIdentity && usage.accountEmail ? { accountEmail: usage.accountEmail } : {}
		} : void 0
	};
}
async function refreshAfterCredentialMutation(context, agentId) {
	try {
		await refreshModelAuthStateAfterMutation(context.getRuntimeConfig, agentId);
		return;
	} catch (error) {
		log.warn(`credential change saved but auth refresh failed: ${formatForLog(error)}`);
		return "Model auth changes were saved, but the Gateway could not refresh them. Run `openclaw gateway restart` to apply the saved changes.";
	}
}
const modelsAuthStatusHandlers = {
	...modelsAuthRefreshHandlers,
	"models.authSetApiKey": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateModelsAuthSetApiKeyParams, "models.authSetApiKey", respond)) return;
		const provider = normalizeProviderId(params.provider);
		await respondUnavailableOnThrow(respond, async () => {
			const config = context.getRuntimeConfig();
			const scope = resolveModelAuthAgentScope(config, params.agentId);
			if (!scope.ok) {
				respond(false, void 0, scope.error);
				return;
			}
			const { saveModelProviderApiKey } = await import("./auth-api-key-CLQBSFE2.mjs");
			const { profileId, warning: configWarning } = await saveModelProviderApiKey({
				config,
				provider,
				apiKey: params.apiKey,
				agentDir: scope.agentDir
			});
			const warning = [configWarning, await refreshAfterCredentialMutation(context, scope.agentId)].filter(Boolean).join(" ");
			respond(true, {
				provider,
				profileId,
				...warning ? { warning } : {}
			}, void 0);
		});
	},
	"models.authLogout": async ({ params, respond, context }) => {
		const provider = readProviderParam(params);
		if (!provider) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "provider is required"));
			return;
		}
		const selection = readLogoutProfileSelection(params);
		if (!selection.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selection.message));
			return;
		}
		if (params.credentialType !== void 0 && params.credentialType !== "api_key" || params.credentialType !== void 0 && selection.profileIds !== void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Choose either API keys or specific profiles"));
			return;
		}
		const apiKeyOnly = params.credentialType === "api_key";
		await respondUnavailableOnThrow(respond, async () => {
			const cfg = context.getRuntimeConfig();
			const scope = resolveModelAuthAgentScope(cfg, params.agentId);
			if (!scope.ok) {
				respond(false, void 0, scope.error);
				return;
			}
			const { agentDir } = scope;
			const authProvider = resolveProviderIdForAuth(provider, { config: cfg });
			const store = ensureAuthProfileStoreWithoutExternalProfiles(agentDir);
			const availableProfiles = listProfilesForProvider(store, provider);
			const removedProfiles = selection.profileIds ?? availableProfiles.filter((profileId) => {
				const credential = store.profiles[profileId];
				return !apiKeyOnly || credential?.type === "api_key" && !credential.keyRef;
			});
			if (selection.profileIds && selection.profileIds.some((profileId) => !availableProfiles.includes(profileId))) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "profileIds contain unavailable auth profiles"));
				return;
			}
			const { removeModelAuthCredentials } = await import("./auth-logout-BQgdGsoo.mjs");
			const configWarning = await removeModelAuthCredentials({
				cfg,
				agentDir,
				profileIds: removedProfiles,
				...apiKeyOnly ? { apiKeyProvider: provider } : {},
				...!apiKeyOnly && !selection.profileIds ? { provider } : {}
			});
			const { runIds: abortedRunIds } = selection.profileIds || apiKeyOnly ? { runIds: [] } : abortChatRunsForProvider(createAuthLogoutAbortOps(context), {
				cfg,
				providerId: authProvider,
				agentId: scope.agentId,
				stopReason: "auth-revoked"
			});
			const warning = [configWarning, await refreshAfterCredentialMutation(context, scope.agentId)].filter(Boolean).join(" ");
			respond(true, {
				provider,
				removedProfiles,
				abortedRunIds,
				...warning ? { warning } : {}
			}, void 0);
		});
	},
	"models.authStatus": async ({ params, respond, context, client }) => {
		const now = Date.now();
		const refreshRequested = Boolean(params.refresh);
		const includeProfileIdentity = hasGatewayAdminScope(client);
		const resolveScope = (cfg) => resolveModelAuthAgentScope(cfg, params.agentId === void 0 || params.agentId === "" ? tryResolveAmbientOwnerAgentId(cfg) : params.agentId);
		await respondUnavailableOnThrow(respond, async () => {
			let cfg = context.getRuntimeConfig();
			let scope = resolveScope(cfg);
			if (!scope.ok) {
				respond(false, void 0, scope.error);
				return;
			}
			if (refreshRequested) {
				await refreshActiveProviderAuthRuntimeSnapshot();
				cfg = context.getRuntimeConfig();
				scope = resolveScope(cfg);
				if (!scope.ok) {
					respond(false, void 0, scope.error);
					return;
				}
			}
			const preparedSnapshot = refreshRequested ? await loadDeferredCatalog(context, scope.agentId, {
				readOnly: true,
				authScope: resolveAuthRefreshScope(cfg),
				refreshAuth: true,
				refreshFullCatalog: false
			}) : await readPreparedCatalog(context, scope.agentId);
			if (!preparedSnapshot) {
				respond(true, {
					ts: now,
					providers: [],
					unavailable: {
						code: "PREPARED_MODEL_AUTH_UNAVAILABLE",
						message: "Model authentication status is unavailable. Refresh Models after setup finishes; restart the Gateway if it persists."
					}
				}, void 0);
				return;
			}
			cfg = preparedSnapshot.config;
			const { agentId, agentDir, authStore: store } = preparedSnapshot;
			const { authAliasLookupParams, apiKeys, configured, authHealth, usageProviderIds, externalProfileIds, externalCliProfileIds, logoutProfileIds, configBoundProfileIds, configBoundAuthProviders, providerCapabilities } = readModelAuthStatusFacts(preparedSnapshot, refreshRequested, now);
			const providerUsageRuntime = getProviderUsageRuntimeSnapshot({
				config: cfg,
				agentId,
				agentDir,
				store
			});
			const usageByProvider = readProviderUsageStaleWhileRevalidate({
				agentId,
				agentDir,
				authStore: providerUsageRuntime.store,
				configRef: cfg,
				credentialKey: providerUsageRuntime.credentialKey,
				forceRefresh: refreshRequested,
				providerIds: usageProviderIds,
				now
			});
			const providers = authHealth.providers.map((prov) => mapProvider(prov, cfg, store, authAliasLookupParams, usageByProvider, configured.expectsOAuth, apiKeys, logoutProfileIds, configBoundProfileIds, configBoundAuthProviders, externalProfileIds, externalCliProfileIds, includeProfileIdentity));
			respond(true, {
				ts: now,
				providers,
				providerCapabilities
			}, void 0);
		});
	}
};
//#endregion
export { modelsAuthStatusHandlers };
