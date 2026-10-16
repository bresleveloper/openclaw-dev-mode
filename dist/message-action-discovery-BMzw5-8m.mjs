import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { D as getPreparedMessageToolCatalog } from "./runtime-D4MkflNJ.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { n as getLoadedChannelPlugin, r as listChannelPlugins, t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as loadOptionalBundledChannelPublicArtifact } from "./optional-public-artifact-zmJDgaMd.mjs";
import { Type } from "typebox";
//#region src/channels/plugins/message-tool-api.ts
/**
* Resolves a bundled channel's message-tool discovery adapter without loading the full plugin.
*/
function resolveBundledChannelMessageToolDiscoveryAdapter(channelId) {
	const describeMessageTool = loadOptionalBundledChannelPublicArtifact({
		channelId,
		artifactBasename: "message-tool-api.js"
	})?.describeMessageTool;
	if (typeof describeMessageTool !== "function") return;
	return { describeMessageTool };
}
//#endregion
//#region src/channels/plugins/message-action-discovery.ts
/** Lists message-action adapters from the caller's exact prepared registry. */
const listMessageActionDiscoveryChannels = (preparedMessageToolCatalog) => (preparedMessageToolCatalog ?? getPreparedMessageToolCatalog())?.channels ?? listChannelPlugins();
const loggedMessageActionErrors = /* @__PURE__ */ new Set();
function resolveMessageActionDiscoveryChannelId(raw) {
	return normalizeAnyChannelId(raw) ?? normalizeOptionalString(raw);
}
function createMessageActionDiscoveryContext(params) {
	const currentChannelProvider = resolveMessageActionDiscoveryChannelId(params.channel ?? params.currentChannelProvider);
	return {
		cfg: params.cfg ?? {},
		...params.chatType ? { chatType: params.chatType } : {},
		currentChannelId: params.currentChannelId,
		currentChannelProvider,
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		accountId: params.accountId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId,
		requesterSenderId: params.requesterSenderId,
		senderIsOwner: params.senderIsOwner
	};
}
function logMessageActionError(params) {
	const message = formatErrorMessage(params.error);
	const key = `${params.pluginId}:describeMessageTool:${message}`;
	if (loggedMessageActionErrors.has(key)) return;
	loggedMessageActionErrors.add(key);
	const stack = params.error instanceof Error && params.error.stack ? params.error.stack : null;
	defaultRuntime.error?.(`[message-action-discovery] ${params.pluginId}.actions.describeMessageTool failed: ${stack ?? message}`);
}
function describeMessageToolSafely(params) {
	try {
		return params.describeMessageTool(params.context) ?? null;
	} catch (error) {
		logMessageActionError({
			pluginId: params.pluginId,
			error
		});
		return null;
	}
}
function normalizeToolSchemaContributions(value) {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}
function normalizeMessageToolMediaSourceParams(mediaSourceParams, action) {
	if (Array.isArray(mediaSourceParams)) return mediaSourceParams;
	if (!mediaSourceParams || typeof mediaSourceParams !== "object") return [];
	const scopedMediaSourceParams = mediaSourceParams;
	if (action) {
		const scoped = scopedMediaSourceParams[action];
		return Array.isArray(scoped) ? scoped : [];
	}
	return Object.values(scopedMediaSourceParams).flatMap((scoped) => Array.isArray(scoped) ? scoped : []);
}
function resolveCurrentChannelMessageToolDiscoveryAdapter(channel, preparedMessageToolCatalog) {
	const channelId = resolveMessageActionDiscoveryChannelId(channel);
	if (!channelId) return null;
	const catalog = preparedMessageToolCatalog ?? getPreparedMessageToolCatalog();
	const prepared = catalog?.getChannel(channelId);
	if (prepared?.actions) return {
		pluginId: prepared.id,
		actions: prepared.actions
	};
	if (!catalog) {
		const loadedPlugin = getLoadedChannelPlugin(channelId);
		if (loadedPlugin?.actions) return {
			pluginId: loadedPlugin.id,
			actions: loadedPlugin.actions
		};
	}
	const bundledActions = resolveBundledChannelMessageToolDiscoveryAdapter(channelId);
	if (bundledActions) return {
		pluginId: channelId,
		actions: bundledActions
	};
	const plugin = catalog ? void 0 : getChannelPlugin(channelId);
	return plugin?.actions ? {
		pluginId: plugin.id,
		actions: plugin.actions
	} : null;
}
function resolveMessageActionDiscoveryForPlugin(params) {
	const adapter = params.actions;
	const described = adapter ? describeMessageToolSafely({
		pluginId: params.pluginId,
		context: params.context,
		describeMessageTool: adapter.describeMessageTool
	}) : null;
	return {
		actions: params.includeActions && Array.isArray(described?.actions) ? [...described.actions] : [],
		capabilities: params.includeCapabilities && Array.isArray(described?.capabilities) ? described.capabilities : [],
		schemaContributions: params.includeSchema ? normalizeToolSchemaContributions(described?.schema) : [],
		mediaSourceParams: normalizeMessageToolMediaSourceParams(described?.mediaSourceParams, params.action)
	};
}
function listCrossChannelSchemaSupportedMessageActions(params) {
	const channelId = resolveMessageActionDiscoveryChannelId(params.channel);
	if (!channelId) return [];
	const pluginActions = resolveCurrentChannelMessageToolDiscoveryAdapter(channelId, params.preparedMessageToolCatalog);
	if (!pluginActions?.actions) return [];
	const resolved = resolveMessageActionDiscoveryForPlugin({
		pluginId: pluginActions.pluginId,
		actions: pluginActions.actions,
		context: createMessageActionDiscoveryContext(params),
		includeActions: true,
		includeSchema: true
	});
	const schemaBlockedActions = /* @__PURE__ */ new Set();
	for (const contribution of resolved.schemaContributions) {
		if ((contribution.visibility ?? "current-channel") !== "current-channel") continue;
		if (!Object.hasOwn(contribution, "actions")) return [];
		const actions = contribution.actions;
		if (!Array.isArray(actions)) return [];
		for (const action of actions) schemaBlockedActions.add(action);
	}
	return resolved.actions.filter((action) => !schemaBlockedActions.has(action));
}
/**
* Merges schema properties while preserving the first plugin to define a key.
*/
function mergeToolSchemaProperties(target, source) {
	if (!source) return;
	for (const [name, schema] of Object.entries(source)) {
		if (name in target) continue;
		target[name] = Type.IsOptional(schema) ? schema : Type.Optional(schema);
	}
}
function resolveChannelMessageToolSchemaProperties(params) {
	const properties = {};
	const currentChannel = resolveMessageActionDiscoveryChannelId(params.channel);
	const discoveryBase = createMessageActionDiscoveryContext(params);
	const contextForPlugin = (pluginId) => {
		const contextualAccountId = !currentChannel || resolveMessageActionDiscoveryChannelId(pluginId) === currentChannel ? params.accountId : void 0;
		return {
			...discoveryBase,
			accountId: params.resolveAccountIdForChannel ? params.resolveAccountIdForChannel(pluginId, contextualAccountId) : contextualAccountId
		};
	};
	const seenPluginIds = /* @__PURE__ */ new Set();
	const mergePluginSchema = (pluginId, actions) => {
		for (const contribution of resolveMessageActionDiscoveryForPlugin({
			pluginId,
			actions,
			context: contextForPlugin(pluginId),
			includeSchema: true
		}).schemaContributions) {
			const visibility = contribution.visibility ?? "current-channel";
			if (!currentChannel || visibility === "all-configured" || pluginId === currentChannel) mergeToolSchemaProperties(properties, contribution.properties);
		}
	};
	const channels = listMessageActionDiscoveryChannels(params.preparedMessageToolCatalog);
	for (const plugin of channels) {
		if (!plugin.actions) continue;
		seenPluginIds.add(plugin.id);
		mergePluginSchema(plugin.id, plugin.actions);
	}
	if (currentChannel && !seenPluginIds.has(currentChannel)) {
		const currentActions = resolveCurrentChannelMessageToolDiscoveryAdapter(currentChannel, params.preparedMessageToolCatalog);
		if (currentActions?.actions) mergePluginSchema(currentActions.pluginId, currentActions.actions);
	}
	return properties;
}
function resolveChannelMessageToolMediaSourceParamKeys(params) {
	const pluginActions = resolveCurrentChannelMessageToolDiscoveryAdapter(params.channel, params.preparedMessageToolCatalog);
	if (!pluginActions) return [];
	const described = resolveMessageActionDiscoveryForPlugin({
		pluginId: pluginActions.pluginId,
		actions: pluginActions.actions,
		context: createMessageActionDiscoveryContext(params),
		action: params.action,
		includeSchema: false
	});
	return uniqueStrings(described.mediaSourceParams);
}
function channelSupportsMessageCapability(cfg, capability, preparedMessageToolCatalog) {
	return listMessageActionDiscoveryChannels(preparedMessageToolCatalog).map((plugin) => resolveMessageActionDiscoveryForPlugin({
		pluginId: plugin.id,
		actions: plugin.actions,
		context: { cfg },
		includeCapabilities: true
	}).capabilities).some((pluginCapabilities) => pluginCapabilities.includes(capability));
}
function channelSupportsMessageCapabilityForChannel(params, capability) {
	const pluginActions = resolveCurrentChannelMessageToolDiscoveryAdapter(params.channel, params.preparedMessageToolCatalog);
	if (!pluginActions) return false;
	return resolveMessageActionDiscoveryForPlugin({
		pluginId: pluginActions.pluginId,
		actions: pluginActions.actions,
		context: createMessageActionDiscoveryContext(params),
		includeCapabilities: true
	}).capabilities.includes(capability);
}
//#endregion
export { listMessageActionDiscoveryChannels as a, resolveCurrentChannelMessageToolDiscoveryAdapter as c, listCrossChannelSchemaSupportedMessageActions as i, resolveMessageActionDiscoveryChannelId as l, channelSupportsMessageCapabilityForChannel as n, resolveChannelMessageToolMediaSourceParamKeys as o, createMessageActionDiscoveryContext as r, resolveChannelMessageToolSchemaProperties as s, channelSupportsMessageCapability as t, resolveMessageActionDiscoveryForPlugin as u };
