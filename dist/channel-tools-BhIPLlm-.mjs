import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { r as listChannelPlugins, t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { m as setChannelAgentToolMeta } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import { a as listMessageActionDiscoveryChannels, c as resolveCurrentChannelMessageToolDiscoveryAdapter, l as resolveMessageActionDiscoveryChannelId, r as createMessageActionDiscoveryContext, u as resolveMessageActionDiscoveryForPlugin } from "./message-action-discovery-DWmJ1tG-.mjs";
import { n as channelPluginHasNativeApprovalPromptUi, t as NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY } from "./native-approval-prompt-KYJ10NVF.mjs";
//#region src/agents/channel-tools.ts
/**
* Channel-owned agent tool and prompt helpers.
* Discovers channel tools, message actions, prompt capabilities, reaction
* guidance, and weakly-attached channel metadata for wrapped tools.
*/
/**
* Get the list of supported message actions for a specific channel.
* Returns an empty array if channel is not found or has no actions configured.
*/
function listChannelSupportedActions(params) {
	const channelId = resolveMessageActionDiscoveryChannelId(params.channel);
	if (!channelId) return [];
	const pluginActions = resolveCurrentChannelMessageToolDiscoveryAdapter(channelId, params.preparedMessageToolCatalog);
	if (!pluginActions?.actions) return [];
	return resolveMessageActionDiscoveryForPlugin({
		pluginId: pluginActions.pluginId,
		actions: pluginActions.actions,
		context: createMessageActionDiscoveryContext(params),
		includeActions: true
	}).actions;
}
/**
* Get the list of all supported message actions across all configured channels.
*/
function listAllChannelSupportedActions(params) {
	const actions = /* @__PURE__ */ new Set();
	const channels = listMessageActionDiscoveryChannels(params.preparedMessageToolCatalog);
	for (const plugin of channels) {
		const channelActions = resolveMessageActionDiscoveryForPlugin({
			pluginId: plugin.id,
			actions: plugin.actions,
			context: createMessageActionDiscoveryContext({
				...params,
				currentChannelProvider: plugin.id
			}),
			includeActions: true
		}).actions;
		for (const action of channelActions) actions.add(action);
	}
	return Array.from(actions);
}
/** List agent tools contributed by registered channel plugins. */
function listChannelAgentTools(params) {
	const tools = [];
	for (const plugin of listChannelPlugins()) {
		const entry = plugin.agentTools;
		if (!entry) continue;
		const resolved = typeof entry === "function" ? entry(params) : entry;
		if (Array.isArray(resolved)) {
			for (const tool of resolved) setChannelAgentToolMeta(tool, { channelId: plugin.id });
			tools.push(...resolved);
		}
	}
	return tools;
}
/** Resolve channel-specific message tool hints for system prompt assembly. */
function resolveChannelMessageToolHints(params) {
	const channelId = normalizeAnyChannelId(params.channel);
	if (!channelId) return [];
	const resolve = getChannelPlugin(channelId)?.agentPrompt?.messageToolHints;
	if (!resolve) return [];
	const cfg = params.cfg ?? {};
	return normalizeStringEntries(resolve({
		cfg,
		accountId: params.accountId
	}));
}
/** Resolve channel prompt capabilities, including native approval UI support. */
function resolveChannelPromptCapabilities(params) {
	const channelId = normalizeAnyChannelId(params.channel);
	if (!channelId) return [];
	const plugin = getChannelPlugin(channelId);
	const cfg = params.cfg ?? {};
	const capabilities = normalizeStringEntries(plugin?.agentPrompt?.messageToolCapabilities?.({
		cfg,
		accountId: params.accountId
	}) ?? []);
	if (channelPluginHasNativeApprovalPromptUi(plugin)) capabilities.push(NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY);
	return capabilities;
}
/** Resolve optional channel reaction guidance for assistant replies. */
function resolveChannelReactionGuidance(params) {
	const channelId = normalizeAnyChannelId(params.channel);
	if (!channelId) return;
	const resolve = getChannelPlugin(channelId)?.agentPrompt?.reactionGuidance;
	if (!resolve) return;
	const resolved = resolve({
		cfg: params.cfg ?? {},
		accountId: params.accountId
	});
	if (!resolved?.level) return;
	return {
		level: resolved.level,
		channel: resolved.channelLabel?.trim() || channelId
	};
}
//#endregion
export { resolveChannelPromptCapabilities as a, resolveChannelMessageToolHints as i, listChannelAgentTools as n, resolveChannelReactionGuidance as o, listChannelSupportedActions as r, listAllChannelSupportedActions as t };
