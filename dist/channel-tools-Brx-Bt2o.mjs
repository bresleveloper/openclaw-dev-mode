import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { r as listChannelPlugins, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { l as setChannelAgentToolMeta } from "./agent-tool-metadata-COcr-3AD.mjs";
import { a as listMessageActionDiscoveryChannels, c as resolveCurrentChannelMessageToolDiscoveryAdapter, l as resolveMessageActionDiscoveryChannelId, r as createMessageActionDiscoveryContext, u as resolveMessageActionDiscoveryForPlugin } from "./message-action-discovery-BGU5zkwY.mjs";
import { n as channelPluginHasNativeApprovalPromptUi, t as NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY } from "./native-approval-prompt-BTGukIvs.mjs";
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
	const capabilities = normalizePromptCapabilities(plugin?.agentPrompt?.messageToolCapabilities?.({
		cfg,
		accountId: params.accountId
	}));
	if (channelPluginHasNativeApprovalPromptUi(plugin)) capabilities.push(NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY);
	return capabilities;
}
function normalizePromptCapabilities(capabilities) {
	return normalizeStringEntries(capabilities ?? []);
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
