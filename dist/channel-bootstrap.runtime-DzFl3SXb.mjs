import { D as withPluginCache, c as getPluginCacheRetirementSignal, o as getPluginCache, x as retainPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { C as tryResolveAmbientOwnerAgentId, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as prepareBundledDiscoveryMode } from "./bundled-discovery-state-C2EXzdGy.mjs";
import { l as preparePersistedInstalledPluginIndexCacheEntry } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-BPH6mLZF.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { d as resolveDiscoverableScopedChannelPluginIds } from "./channel-presence-policy-BruI3Lbo.mjs";
import { C as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-DYptB0Cf.mjs";
import { b as isPluginRegistryRetired } from "./registry-lifecycle-Dekhrk9Y.mjs";
import { d as getActivePluginRegistryVersion, l as getActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import "./channel-plugin-ids-BIGwmSOe.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CSQ1bLlx.mjs";
import { n as withActivatedPluginIds } from "./activation-context-CUyk98mO.mjs";
import { n as loadPluginRegistryHandle } from "./loader-vjZ2aI5b.mjs";
//#region src/infra/outbound/channel-bootstrap.runtime.ts
const MAX_BOOTSTRAP_CONFIG_GENERATIONS = 64;
const MAX_BOOTSTRAP_CHANNEL_OUTCOMES_PER_CONFIG = 64;
let bootstrapRegistriesByScope = /* @__PURE__ */ new WeakMap();
function resolveBootstrapRegistries(cfg, env) {
	const cache = getPluginCache();
	if (getPluginCacheRetirementSignal(cache).aborted) return;
	const metadata = cache.metadata;
	const version = getActivePluginRegistryVersion();
	const snapshot = getCurrentPluginMetadataSnapshot({
		env,
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true,
		allowSynchronousPolicyRead: false
	});
	const scope = snapshot ?? metadata;
	let state = bootstrapRegistriesByScope.get(scope);
	if (!state || state.metadata !== metadata || state.version !== version) {
		state = {
			metadata,
			version,
			configs: new LruCache(MAX_BOOTSTRAP_CONFIG_GENERATIONS)
		};
		bootstrapRegistriesByScope.set(scope, state);
	}
	const configKey = resolveRuntimeConfigCacheKey(cfg);
	const key = snapshot ? configKey : JSON.stringify([configKey, resolvePluginMetadataEnvFingerprint(env)]);
	let registries = state.configs.get(key);
	if (!registries) {
		registries = new LruCache(MAX_BOOTSTRAP_CHANNEL_OUTCOMES_PER_CONFIG);
		state.configs.set(key, registries);
	}
	return registries;
}
/** Clears the per-generation channel bootstrap handle cache for isolated tests. */
function resetOutboundChannelBootstrapStateForTests() {
	bootstrapRegistriesByScope = /* @__PURE__ */ new WeakMap();
}
function resolveSendCapableRegistry(registry, channel) {
	const entry = registry?.channels?.find((candidate) => candidate?.plugin?.id === channel);
	return registry && (entry?.plugin?.outbound?.sendText ?? entry?.plugin?.message?.send?.text) ? registry : void 0;
}
function resolveBootstrapPlan(params, env = process.env) {
	const cfg = params.cfg;
	if (!cfg) return {
		kind: "resolved",
		registry: void 0
	};
	const scopedRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const scopedEntry = scopedRegistry?.channels?.find((entry) => entry?.plugin?.id === params.channel);
	const activeSendRegistry = resolveSendCapableRegistry(scopedEntry ? scopedRegistry : getActivePluginRegistry(), params.channel);
	if (activeSendRegistry) return {
		kind: "resolved",
		registry: activeSendRegistry
	};
	const agentId = tryResolveAmbientOwnerAgentId(cfg, params.agentId);
	const outcomeKey = `${agentId ?? ""}\0${params.channel}`;
	const registries = scopedEntry ? void 0 : resolveBootstrapRegistries(cfg, env);
	if (registries) {
		const cachedRegistry = registries.get(outcomeKey);
		if (cachedRegistry !== void 0 && (cachedRegistry === null || !isPluginRegistryRetired(cachedRegistry))) return {
			kind: "resolved",
			registry: resolveSendCapableRegistry(cachedRegistry, params.channel)
		};
	}
	return {
		kind: "cold",
		cfg,
		agentId,
		outcomeKey,
		registries
	};
}
function loadBootstrapPlan(params, plan, discovery) {
	const { cfg, agentId, outcomeKey, registries } = plan;
	const env = discovery?.env;
	const autoEnabled = applyPluginAutoEnable({
		config: cfg,
		...env ? { env } : {}
	});
	const workspaceDir = discovery ? discovery.workspaceDir : agentId === void 0 ? void 0 : resolveAgentWorkspaceDir(cfg, agentId);
	const pluginIds = resolveDiscoverableScopedChannelPluginIds({
		config: autoEnabled.config,
		activationSourceConfig: cfg,
		channelIds: [params.channel],
		workspaceDir,
		env: env ?? process.env
	});
	const activatedConfig = withActivatedPluginIds({
		config: autoEnabled.config,
		pluginIds
	}) ?? autoEnabled.config;
	const activatedSourceConfig = withActivatedPluginIds({
		config: cfg,
		pluginIds
	}) ?? cfg;
	let sendRegistry;
	try {
		sendRegistry = resolveSendCapableRegistry(loadPluginRegistryHandle({
			config: activatedConfig,
			activationSourceConfig: activatedSourceConfig,
			autoEnabledReasons: autoEnabled.autoEnabledReasons,
			onlyPluginIds: pluginIds,
			workspaceDir,
			...env ? { env } : {},
			runtimeOptions: { allowGatewaySubagentBinding: true }
		}), params.channel);
	} catch {}
	registries?.set(outcomeKey, sendRegistry ?? null);
	return sendRegistry;
}
/** Loads runtime plugins on demand when a selected outbound channel has only a setup shell. */
function bootstrapOutboundChannelPlugin(params) {
	const plan = resolveBootstrapPlan(params);
	return plan.kind === "resolved" ? plan.registry : loadBootstrapPlan(params, plan);
}
/** Prepares cold SQLite metadata before the shared bootstrap decision and loader. */
async function bootstrapOutboundChannelPluginAsync(params) {
	params.assertCurrent?.();
	const initial = resolveBootstrapPlan(params);
	if (initial.kind === "resolved") return initial.registry;
	const cache = getPluginCache();
	const namespaceEnv = cloneEnvWithPlatformSemantics(process.env);
	const env = cloneEnvWithPlatformSemantics(namespaceEnv);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const discovery = {
		env,
		workspaceDir: initial.agentId === void 0 ? void 0 : resolveAgentWorkspaceDir(initial.cfg, initial.agentId, env)
	};
	const release = retainPluginCache(cache);
	try {
		return await withPluginCache(cache, async () => {
			const activateDiscovery = await prepareBundledDiscoveryMode(env);
			params.assertCurrent?.();
			const installed = await preparePersistedInstalledPluginIndexCacheEntry({ env });
			params.assertCurrent?.();
			installed.assertCurrent();
			activateDiscovery();
			const plan = resolveBootstrapPlan(params, namespaceEnv);
			if (plan.kind === "resolved") return plan.registry;
			if (plan.agentId !== initial.agentId) throw new Error("Outbound plugin owner changed during metadata preparation; retry the operation.");
			return loadBootstrapPlan(params, plan, discovery);
		});
	} finally {
		release();
	}
}
//#endregion
export { bootstrapOutboundChannelPluginAsync as n, resetOutboundChannelBootstrapStateForTests as r, bootstrapOutboundChannelPlugin as t };
