import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./message-channel-DmAdWHmL.mjs";
import "./plugins-CCVkYF8m.mjs";
import { t as findChannelPluginInRegistry } from "./runtime-visible-channels-GGZXKqeN.mjs";
import { n as bootstrapOutboundChannelPluginAsync, t as bootstrapOutboundChannelPlugin } from "./channel-bootstrap.runtime-CY5VWV1U.mjs";
//#region src/infra/outbound/channel-resolution.ts
/** Normalizes a raw channel id and rejects non-deliverable/internal channels. */
function normalizeDeliverableOutboundChannel(raw) {
	const normalized = normalizeMessageChannel(raw);
	return normalized && isDeliverableMessageChannel(normalized) ? normalized : void 0;
}
function getOutboundRuntimeRegistry() {
	return getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry();
}
function resolveSendCapableMessageAdapter(plugin) {
	const message = plugin?.message;
	return typeof message?.send?.text === "function" ? message : void 0;
}
function hasOutboundSurface(plugin, requireActivatedRuntime = false) {
	return requireActivatedRuntime ? Boolean(plugin?.outbound?.sendText || plugin?.outbound?.deliveryMode === "gateway" || resolveSendCapableMessageAdapter(plugin)) : Boolean(plugin?.outbound ?? resolveSendCapableMessageAdapter(plugin));
}
function resolveRuntimeOutboundPluginCandidate(params) {
	return [
		params.loaded,
		params.runtime,
		params.bundled
	].find((plugin) => hasOutboundSurface(plugin, params.requireActivatedRuntime)) ?? (params.requireActivatedRuntime ? void 0 : params.loaded ?? params.setupFallback ?? params.bundled);
}
function resolveOutboundPluginFromRuntimeRegistry(channel, registry = getOutboundRuntimeRegistry(), requireActivatedRuntime = false) {
	const plugin = findChannelPluginInRegistry(registry, channel);
	return hasOutboundSurface(plugin, requireActivatedRuntime) ? plugin : void 0;
}
function* resolveOutboundChannelPluginSteps(params) {
	const channel = normalizeMessageChannel(params.channel);
	let normalized = channel && isDeliverableMessageChannel(channel) ? channel : void 0;
	let didBootstrap = false;
	let bootstrapRegistry;
	if (!normalized && channel && channel !== "webchat") {
		const active = resolveOutboundPluginFromRuntimeRegistry(channel, getOutboundRuntimeRegistry() ?? void 0, true);
		if (active) normalized = active.id;
		else if (params.allowBootstrap === true) {
			bootstrapRegistry = yield {
				channel,
				cfg: params.cfg,
				agentId: params.agentId
			};
			normalized = resolveOutboundPluginFromRuntimeRegistry(channel, bootstrapRegistry, true)?.id ?? channel;
			didBootstrap = true;
		}
	}
	if (!normalized) return;
	const scopedPlugin = findChannelPluginInRegistry(bootstrapRegistry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry, normalized);
	if (scopedPlugin) {
		if (params.allowBootstrap !== true || hasOutboundSurface(scopedPlugin, true)) return scopedPlugin;
		if (didBootstrap) return;
		return resolveOutboundPluginFromRuntimeRegistry(normalized, yield {
			...params,
			channel: normalized
		}, true);
	}
	const current = getLoadedChannelPlugin(normalized);
	const requireActivatedRuntime = params.allowBootstrap === true;
	const candidate = resolveRuntimeOutboundPluginCandidate({
		loaded: current,
		runtime: resolveOutboundPluginFromRuntimeRegistry(normalized, bootstrapRegistry, requireActivatedRuntime),
		setupFallback: findChannelPluginInRegistry(bootstrapRegistry ?? getOutboundRuntimeRegistry(), normalized),
		bundled: getChannelPlugin(normalized),
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
		loaded: getLoadedChannelPlugin(normalized),
		runtime: resolveOutboundPluginFromRuntimeRegistry(normalized, registry, true),
		bundled: getChannelPlugin(normalized),
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
	const steps = resolveOutboundChannelPluginSteps(params);
	let step = steps.next();
	while (!step.done) {
		const registry = await bootstrapOutboundChannelPluginAsync({
			...step.value,
			assertCurrent: params.assertCurrent
		});
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
export { resolveOutboundChannelPluginAsync as i, resolveOutboundChannelMessageAdapter as n, resolveOutboundChannelPlugin as r, normalizeDeliverableOutboundChannel as t };
