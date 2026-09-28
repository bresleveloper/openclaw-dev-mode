import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-B2zZQffc.mjs";
import { f as getRuntimeAuthProfileStoreSnapshotRevision } from "./runtime-snapshots-CBozwlR0.mjs";
import { M as resolveUsableCustomProviderApiKey } from "./loader-runtime-load-DitY2Htf.mjs";
import { t as externalCliDiscoveryForConfigStatus } from "./external-cli-discovery-BbOBKQM3.mjs";
import { a as resolveAuthProfileOrder } from "./order-BQhYF772.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import { i as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-BqAtGSmm.mjs";
import { n as PROVIDER_USAGE_TIMEOUT_MS } from "./provider-usage.shared-DA20vxhR.mjs";
import { l as listProviderUsagePluginDescriptors } from "./provider-runtime-DTb_RnE4.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import "./model-auth-D3hh0-wa.mjs";
import { n as fingerprintAuthProfileOwnerShape, o as fingerprintResolvedProviderAuth, t as fingerprintAuthProfileCredential } from "./execution-auth-binding-DkIxPe6Z.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { t as loadProviderUsageSummary } from "./provider-usage.load-Bx9i3fWl.mjs";
//#region src/gateway/server-methods/provider-usage-runtime.ts
let current;
function sortedRecordEntries(value) {
	return Object.entries(value ?? {}).toSorted(([left], [right]) => left.localeCompare(right));
}
function fingerprintProviderUsageCredentials(params) {
	const profiles = Object.entries(params.store.profiles).toSorted(([left], [right]) => left.localeCompare(right)).map(([profileId, credential]) => {
		return fingerprintAuthProfileCredential({
			profileId,
			credential
		}) ?? fingerprintAuthProfileOwnerShape({
			profileId,
			credential
		}) ?? `${profileId}:${credential.type}:${credential.provider}`;
	});
	const direct = [...params.directApiKeys].toSorted(([left], [right]) => left.localeCompare(right)).map(([provider, resolved]) => [provider, fingerprintResolvedProviderAuth({
		...resolved,
		mode: "api-key"
	}) ?? null]);
	const selectedProfiles = params.providerIds.map((provider) => [provider, resolveAuthProfileOrder({
		cfg: params.cfg,
		store: params.store,
		provider
	})]);
	return JSON.stringify({
		profiles,
		direct,
		order: sortedRecordEntries(params.store.order),
		lastGood: sortedRecordEntries(params.store.lastGood),
		selectedProfiles
	});
}
function resolveDirectApiKeys(config, providerIds) {
	const directApiKeys = /* @__PURE__ */ new Map();
	for (const provider of providerIds) {
		const resolved = resolveUsableCustomProviderApiKey({
			cfg: config,
			provider,
			env: process.env
		}) ?? resolveEnvApiKey(provider, process.env, { config });
		if (!resolved) continue;
		directApiKeys.set(provider, resolved);
	}
	return directApiKeys;
}
function clearProviderUsageRuntimeSnapshot() {
	current = void 0;
}
function getProviderUsageRuntimeSnapshot(params) {
	const agentId = params.agentId ?? resolveLegacyInheritedAuthAgentId(params.config);
	const agentDir = params.agentDir ?? resolveAgentDir(params.config, agentId);
	const configRef = params.config;
	const pluginRegistryGeneration = getActivePluginRegistryVersion();
	const authStoreGeneration = getRuntimeAuthProfileStoreSnapshotRevision(agentDir);
	if (current?.configRef === configRef && (params.store === void 0 || current.store === params.store) && current.agentDir === agentDir && current.agentId === agentId && current.pluginRegistryGeneration === pluginRegistryGeneration && current.authStoreGeneration === authStoreGeneration) return current;
	const store = params.store ?? ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForConfigStatus({ cfg: configRef }) });
	const descriptors = listProviderUsagePluginDescriptors({
		config: configRef,
		env: process.env
	});
	const providerIds = descriptors.map((descriptor) => descriptor.provider);
	const directApiKeys = resolveDirectApiKeys(configRef, providerIds);
	current = {
		agentDir,
		agentId,
		configRef,
		credentialKey: fingerprintProviderUsageCredentials({
			cfg: configRef,
			directApiKeys,
			providerIds,
			store
		}),
		descriptors,
		directApiKeys,
		providerIds,
		store,
		authStoreGeneration: getRuntimeAuthProfileStoreSnapshotRevision(agentDir),
		pluginRegistryGeneration
	};
	return current;
}
//#endregion
//#region src/gateway/server-methods/models-auth-status-usage-cache.ts
const log = createSubsystemLogger("provider-usage-cache");
const USAGE_CACHE_TTL_MS = 6e4;
const usageCacheByAgentId = /* @__PURE__ */ new Map();
const usageRefreshByAgentId = /* @__PURE__ */ new Map();
let cacheGeneration = 0;
function clearModelAuthStatusUsageCache() {
	cacheGeneration += 1;
	usageCacheByAgentId.clear();
	usageRefreshByAgentId.clear();
	clearProviderUsageRuntimeSnapshot();
}
function scopeProviderUsageCredentialKey(credentialKey, providerIds) {
	const parsed = JSON.parse(credentialKey);
	const providers = new Set(providerIds);
	return JSON.stringify({
		...parsed,
		direct: parsed.direct.filter(([provider, fingerprint]) => providers.has(provider) && fingerprint !== null)
	});
}
function mapProviderUsage(usage) {
	const usageByProvider = /* @__PURE__ */ new Map();
	for (const snap of usage.providers) usageByProvider.set(snap.provider, {
		windows: snap.windows,
		...snap.summary ? { summary: snap.summary } : {},
		...snap.plan ? { plan: snap.plan } : {},
		...snap.billing?.length ? { billing: snap.billing } : {},
		...snap.accountEmail ? { accountEmail: snap.accountEmail } : {}
	});
	return usageByProvider;
}
function retainLastGoodOnTimeout(summary, lastGood) {
	if (!lastGood) return summary;
	const lastGoodByProvider = new Map(lastGood.providers.filter((provider) => provider.error === void 0).map((provider) => [provider.provider, provider]));
	const retainedLastGood = summary.providers.some((provider) => provider.error === "Timeout" && lastGoodByProvider.has(provider.provider));
	return {
		...summary,
		updatedAt: retainedLastGood ? lastGood.updatedAt : summary.updatedAt,
		providers: summary.providers.map((provider) => provider.error === "Timeout" ? lastGoodByProvider.get(provider.provider) ?? provider : provider)
	};
}
function scheduleProviderUsageRefresh(params) {
	const active = usageRefreshByAgentId.get(params.agentId);
	if (active?.agentDir === params.agentDir && active.configRef === params.configRef && active.credentialKey === params.credentialKey && active.providerKey === params.providerKey) return active.promise;
	const publishGeneration = cacheGeneration;
	const promise = trackAsyncWork(() => loadProviderUsageSummary({
		providers: params.providerIds,
		agentDir: params.agentDir,
		authStore: params.authStore,
		config: params.configRef,
		timeoutMs: PROVIDER_USAGE_TIMEOUT_MS
	}).then((freshUsage) => {
		const usage = retainLastGoodOnTimeout(freshUsage, params.lastGood);
		if (publishGeneration === cacheGeneration && usageRefreshByAgentId.get(params.agentId) === refresh) usageCacheByAgentId.set(params.agentId, {
			agentDir: params.agentDir,
			configRef: params.configRef,
			credentialKey: params.credentialKey,
			providerKey: params.providerKey,
			refreshedAt: Date.now(),
			summary: usage,
			usageByProvider: mapProviderUsage(usage)
		});
		return usage;
	}).catch((err) => {
		log.debug(`usage refresh failed: providers=${params.providerIds.join(",")} error=${formatForLog(err)}`);
		throw err;
	}).finally(() => {
		if (usageRefreshByAgentId.get(params.agentId) === refresh) usageRefreshByAgentId.delete(params.agentId);
	}));
	const refresh = {
		agentDir: params.agentDir,
		configRef: params.configRef,
		credentialKey: params.credentialKey,
		providerKey: params.providerKey,
		promise
	};
	usageRefreshByAgentId.set(params.agentId, refresh);
	return promise;
}
function resolveProviderUsageCacheRead(params) {
	const providerIds = params.providerIds.toSorted();
	const providerKey = providerIds.join("\0");
	const credentialKey = scopeProviderUsageCredentialKey(params.credentialKey, providerIds);
	const cached = usageCacheByAgentId.get(params.agentId);
	const matching = cached?.agentDir === params.agentDir && cached.configRef === params.configRef && cached.credentialKey === credentialKey && cached.providerKey === providerKey ? cached : void 0;
	return {
		credentialKey,
		matching,
		needsRefresh: params.forceRefresh === true || !matching || params.now - matching.refreshedAt >= USAGE_CACHE_TTL_MS,
		providerIds,
		providerKey
	};
}
function readProviderUsageStaleWhileRevalidate(params) {
	if (params.providerIds.length === 0) {
		usageCacheByAgentId.delete(params.agentId);
		return /* @__PURE__ */ new Map();
	}
	const { credentialKey, matching, needsRefresh, providerIds, providerKey } = resolveProviderUsageCacheRead(params);
	if (needsRefresh) scheduleProviderUsageRefresh({
		agentId: params.agentId,
		agentDir: params.agentDir,
		authStore: params.authStore,
		configRef: params.configRef,
		credentialKey,
		providerIds,
		providerKey,
		lastGood: matching?.summary
	}).catch(() => {});
	return matching?.usageByProvider ?? /* @__PURE__ */ new Map();
}
/** Shares the models.authStatus cache contract with the unscoped usage.status RPC. */
async function loadUsageStatusStaleWhileRevalidate(options) {
	const snapshot = getProviderUsageRuntimeSnapshot({ config: options.config });
	const params = {
		agentId: snapshot.agentId,
		agentDir: snapshot.agentDir,
		authStore: snapshot.store,
		configRef: snapshot.configRef,
		credentialKey: snapshot.credentialKey,
		providerIds: snapshot.providerIds,
		coldRead: options.coldRead,
		now: options.now ?? Date.now()
	};
	if (params.providerIds.length === 0) {
		usageCacheByAgentId.delete(params.agentId);
		return {
			updatedAt: params.now,
			providers: []
		};
	}
	const { credentialKey, matching, needsRefresh, providerIds, providerKey } = resolveProviderUsageCacheRead(params);
	if (matching && !needsRefresh) return matching.summary;
	const refresh = scheduleProviderUsageRefresh({
		agentId: params.agentId,
		agentDir: params.agentDir,
		authStore: params.authStore,
		configRef: params.configRef,
		credentialKey,
		providerIds,
		providerKey,
		lastGood: matching?.summary
	});
	if (matching) {
		refresh.catch(() => {});
		return matching.summary;
	}
	if (params.coldRead !== "refresh-marker") return await refresh;
	refresh.catch(() => {});
	return {
		updatedAt: params.now,
		providers: [],
		refreshing: true
	};
}
//#endregion
export { getProviderUsageRuntimeSnapshot as i, loadUsageStatusStaleWhileRevalidate as n, readProviderUsageStaleWhileRevalidate as r, clearModelAuthStatusUsageCache as t };
