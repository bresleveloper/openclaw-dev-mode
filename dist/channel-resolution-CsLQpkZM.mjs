import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as findChannelPluginInRegistry } from "./runtime-visible-channels-CiwNdke1.mjs";
import { n as bootstrapOutboundChannelPluginAsync, t as bootstrapOutboundChannelPlugin } from "./channel-bootstrap.runtime-ByBKBIcT.mjs";
//#region src/infra/outbound/channel-resolution.ts
/** Normalizes a raw channel id and rejects non-deliverable/internal channels. */
function normalizeDeliverableOutboundChannel(raw) {
	const normalized = normalizeMessageChannel(raw);
	if (!normalized || !isDeliverableMessageChannel(normalized)) return;
	return normalized;
}
function getOutboundRuntimeRegistry() {
	return getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry();
}
function* normalizeOutboundChannelForResolution(params) {
	const normalized = normalizeMessageChannel(params.channel);
	const deliverable = normalized && isDeliverableMessageChannel(normalized) ? normalized : void 0;
	if (deliverable || !normalized || normalized === "webchat") return {
		channel: deliverable,
		didBootstrap: false
	};
	const activeRuntimePlugin = resolveActivatedOutboundPluginFromRuntimeRegistry(normalized, getOutboundRuntimeRegistry() ?? void 0);
	if (activeRuntimePlugin) return {
		channel: activeRuntimePlugin.id,
		didBootstrap: false
	};
	if (params.allowBootstrap !== true) return {
		channel: void 0,
		didBootstrap: false
	};
	const bootstrapRegistry = yield {
		channel: normalized,
		cfg: params.cfg,
		agentId: params.agentId
	};
	return {
		channel: resolveActivatedOutboundPluginFromRuntimeRegistry(normalized, bootstrapRegistry)?.id ?? normalized,
		didBootstrap: true,
		...bootstrapRegistry ? { bootstrapRegistry } : {}
	};
}
function resolveSendCapableMessageAdapter(plugin) {
	const message = plugin?.message;
	return typeof message?.send?.text === "function" ? message : void 0;
}
function channelPluginHasRuntimeOutboundSurface(plugin) {
	return Boolean(plugin?.outbound ?? resolveSendCapableMessageAdapter(plugin));
}
function channelPluginHasActivatedOutboundSurface(plugin) {
	return Boolean(plugin?.outbound?.sendText || plugin?.outbound?.deliveryMode === "gateway" || resolveSendCapableMessageAdapter(plugin));
}
function resolveRuntimeOutboundPlugin(plugin) {
	return channelPluginHasRuntimeOutboundSurface(plugin) ? plugin : void 0;
}
function resolveActivatedOutboundPlugin(plugin) {
	return channelPluginHasActivatedOutboundSurface(plugin) ? plugin : void 0;
}
function resolveRuntimeOutboundPluginCandidate(params) {
	const hasRuntimeSurface = params.requireActivatedRuntime ? channelPluginHasActivatedOutboundSurface : channelPluginHasRuntimeOutboundSurface;
	if (hasRuntimeSurface(params.loaded)) return params.loaded;
	if (hasRuntimeSurface(params.runtime)) return params.runtime;
	if (hasRuntimeSurface(params.bundled)) return params.bundled;
	if (params.allowSetupShell) return params.loaded ?? params.setupFallback ?? params.bundled;
}
function resolveValueFromRuntimeRegistry(channel, resolveValue, registry = getOutboundRuntimeRegistry()) {
	const plugin = findChannelPluginInRegistry(registry, channel);
	return plugin ? resolveValue(plugin) : void 0;
}
function resolveDirectFromRuntimeRegistry(channel, registry) {
	return resolveValueFromRuntimeRegistry(channel, (plugin) => plugin, registry);
}
function resolveRuntimeOutboundPluginFromRuntimeRegistry(channel, registry) {
	return resolveValueFromRuntimeRegistry(channel, resolveRuntimeOutboundPlugin, registry);
}
function resolveActivatedOutboundPluginFromRuntimeRegistry(channel, registry) {
	return resolveValueFromRuntimeRegistry(channel, resolveActivatedOutboundPlugin, registry);
}
function* resolveOutboundChannelPluginSteps(params) {
	const { channel: normalized, didBootstrap, bootstrapRegistry } = yield* normalizeOutboundChannelForResolution(params);
	if (!normalized) return;
	const scopedPlugin = findChannelPluginInRegistry(bootstrapRegistry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry, normalized);
	if (scopedPlugin) {
		if (params.allowBootstrap !== true || channelPluginHasActivatedOutboundSurface(scopedPlugin)) return scopedPlugin;
		if (didBootstrap) return;
		return resolveActivatedOutboundPluginFromRuntimeRegistry(normalized, yield {
			...params,
			channel: normalized
		});
	}
	const resolveLoaded = () => getLoadedChannelPlugin(normalized);
	const resolve = () => getChannelPlugin(normalized);
	const current = resolveLoaded();
	const requireActivatedRuntime = params.allowBootstrap === true;
	const candidate = resolveRuntimeOutboundPluginCandidate({
		loaded: current,
		runtime: requireActivatedRuntime ? resolveActivatedOutboundPluginFromRuntimeRegistry(normalized, bootstrapRegistry) : resolveRuntimeOutboundPluginFromRuntimeRegistry(normalized, bootstrapRegistry),
		setupFallback: resolveDirectFromRuntimeRegistry(normalized, bootstrapRegistry),
		bundled: resolve(),
		allowSetupShell: params.allowBootstrap !== true,
		requireActivatedRuntime
	});
	if (candidate) return candidate;
	if (params.allowBootstrap !== true || didBootstrap) return;
	const registry = yield {
		channel: normalized,
		cfg: params.cfg,
		agentId: params.agentId
	};
	return resolveRuntimeOutboundPluginCandidate({
		loaded: resolveLoaded(),
		runtime: resolveActivatedOutboundPluginFromRuntimeRegistry(normalized, registry),
		setupFallback: resolveDirectFromRuntimeRegistry(normalized, registry),
		bundled: resolve(),
		requireActivatedRuntime: true
	});
}
/** Resolves a deliverable outbound channel plugin, optionally bootstrapping it. */
function resolveOutboundChannelPlugin(params) {
	const steps = resolveOutboundChannelPluginSteps(params);
	let step = steps.next();
	while (!step.done) step = steps.next(bootstrapOutboundChannelPlugin(step.value));
	return step.value;
}
async function resolveOutboundChannelPluginAsync(params) {
	params.assertCurrent?.();
	const steps = resolveOutboundChannelPluginSteps(params);
	let step = steps.next();
	while (!step.done) {
		const registry = await bootstrapOutboundChannelPluginAsync({
			...step.value,
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent?.();
		step = steps.next(registry);
	}
	return step.value;
}
/** Resolves the message adapter after any required bootstrap metadata is ready. */
async function resolveOutboundChannelMessageAdapter(params) {
	const plugin = await resolveOutboundChannelPluginAsync(params);
	params.assertCurrent?.();
	return resolveSendCapableMessageAdapter(plugin);
}
//#endregion
export { resolveOutboundChannelMessageAdapter as n, resolveOutboundChannelPlugin as r, normalizeDeliverableOutboundChannel as t };
