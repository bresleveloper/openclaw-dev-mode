import { c as getPluginCache, k as withPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { f as resolveAgentWorkspaceDir, w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as prepareBundledDiscoveryMode } from "./bundled-discovery-state-Bb6gGYEi.mjs";
import { i as preparePersistedInstalledPluginIndexCacheEntry } from "./installed-plugin-index-record-state-Cr6YHbHB.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { h as resolveDiscoverableScopedChannelPluginIds } from "./channel-presence-policy-hdzky3AO.mjs";
import "./channel-plugin-ids-Bgv12GOX.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DYmyl_xH.mjs";
import { n as withActivatedPluginIds } from "./activation-context-ZGPJ_bJQ.mjs";
import { n as loadPluginRegistryHandle } from "./loader-B8PRFJEU.mjs";
//#region src/infra/outbound/channel-bootstrap.runtime.ts
function resolveSendCapableRegistry(registry, channel) {
	const entry = registry?.channels?.find((candidate) => candidate?.plugin?.id === channel);
	return registry && (entry?.plugin?.outbound?.sendText ?? entry?.plugin?.message?.send?.text) ? registry : void 0;
}
function resolveBootstrapPlan(params) {
	const cfg = params.cfg;
	if (!cfg) return {
		kind: "resolved",
		registry: void 0
	};
	const scopedRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const activeSendRegistry = resolveSendCapableRegistry(scopedRegistry?.channels?.find((entry) => entry?.plugin?.id === params.channel) ? scopedRegistry : getActivePluginRegistry(), params.channel);
	if (activeSendRegistry) return {
		kind: "resolved",
		registry: activeSendRegistry
	};
	return {
		kind: "cold",
		cfg,
		agentId: tryResolveAmbientOwnerAgentId(cfg, params.agentId)
	};
}
function loadBootstrapPlan(channel, plan, discovery) {
	const { cfg, agentId } = plan;
	const env = discovery?.env;
	const autoEnabled = applyPluginAutoEnable({
		config: cfg,
		...env ? { env } : {}
	});
	const workspaceDir = discovery ? discovery.workspaceDir : agentId === void 0 ? void 0 : resolveAgentWorkspaceDir(cfg, agentId);
	const pluginIds = resolveDiscoverableScopedChannelPluginIds({
		config: autoEnabled.config,
		activationSourceConfig: cfg,
		channelIds: [channel],
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
		}), channel);
	} catch {}
	return sendRegistry;
}
/** Loads runtime plugins on demand when a selected outbound channel has only a setup shell. */
function bootstrapOutboundChannelPlugin(params) {
	const plan = resolveBootstrapPlan(params);
	return plan.kind === "resolved" ? plan.registry : loadBootstrapPlan(params.channel, plan);
}
/** Prepares cold SQLite metadata before the shared bootstrap decision and loader. */
async function bootstrapOutboundChannelPluginAsync(params) {
	params.assertCurrent?.();
	const initial = resolveBootstrapPlan(params);
	if (initial.kind === "resolved") return initial.registry;
	const cache = getPluginCache();
	const env = cloneEnvWithPlatformSemantics(process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const discovery = {
		env,
		workspaceDir: initial.agentId === void 0 ? void 0 : resolveAgentWorkspaceDir(initial.cfg, initial.agentId, env)
	};
	return withPluginCache(cache, async () => {
		const activateDiscovery = await prepareBundledDiscoveryMode(env);
		await preparePersistedInstalledPluginIndexCacheEntry({ env });
		params.assertCurrent?.();
		activateDiscovery();
		return loadBootstrapPlan(params.channel, initial, discovery);
	});
}
//#endregion
export { bootstrapOutboundChannelPluginAsync as n, bootstrapOutboundChannelPlugin as t };
