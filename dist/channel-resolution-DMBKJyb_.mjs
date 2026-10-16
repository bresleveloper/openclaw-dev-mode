import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { l as getActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as findChannelPluginInRegistry } from "./runtime-visible-channels-NjzJcucv.mjs";
import { n as bootstrapOutboundChannelPluginAsync, t as bootstrapOutboundChannelPlugin } from "./channel-bootstrap.runtime-DzFl3SXb.mjs";
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
	const activeRuntimePlugin = resolveOutboundPluginFromRuntimeRegistry(normalized, getOutboundRuntimeRegistry() ?? void 0, true);
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
		channel: resolveOutboundPluginFromRuntimeRegistry(normalized, bootstrapRegistry, true)?.id ?? normalized,
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
function resolveRuntimeOutboundPluginCandidate(params) {
	const hasRuntimeSurface = params.requireActivatedRuntime ? channelPluginHasActivatedOutboundSurface : channelPluginHasRuntimeOutboundSurface;
	return [
		params.loaded,
		params.runtime,
		params.bundled
	].find(hasRuntimeSurface) ?? (params.allowSetupShell ? params.loaded ?? params.setupFallback ?? params.bundled : void 0);
}
function resolveOutboundPluginFromRuntimeRegistry(channel, registry = getOutboundRuntimeRegistry(), requireActivatedRuntime = false) {
	const plugin = findChannelPluginInRegistry(registry, channel);
	return (requireActivatedRuntime ? channelPluginHasActivatedOutboundSurface : channelPluginHasRuntimeOutboundSurface)(plugin) ? plugin : void 0;
}
function* resolveOutboundChannelPluginSteps(params) {
	const { channel: normalized, didBootstrap, bootstrapRegistry } = yield* normalizeOutboundChannelForResolution(params);
	if (!normalized) return;
	const scopedPlugin = findChannelPluginInRegistry(bootstrapRegistry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry, normalized);
	if (scopedPlugin) {
		if (params.allowBootstrap !== true || channelPluginHasActivatedOutboundSurface(scopedPlugin)) return scopedPlugin;
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
