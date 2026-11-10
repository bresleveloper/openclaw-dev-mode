import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { D as getPreparedMessageToolCatalog } from "./runtime-DkPagH0y.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { n as getLoadedChannelPlugin, r as listChannelPlugins, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { t as loadOptionalBundledChannelPublicArtifact } from "./optional-public-artifact-Sag1ZGk8.mjs";
import { Type } from "typebox";
//#region src/channels/plugins/message-tool-api.ts
/**
* Resolves a bundled channel's message-tool discovery adapter without loading the full plugin.
*/
function resolveBundledChannelMessageToolDiscoveryAdapter(channelId) {
	const api = loadOptionalBundledChannelPublicArtifact({
		channelId,
		artifactBasename: "message-tool-api.js"
	});
	const describeMessageTool = api?.describeMessageTool;
	if (typeof describeMessageTool !== "function") return;
	return {
		describeMessageTool,
		describeMessageToolAsync: api?.describeMessageToolAsync
	};
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
function describeMessageToolSafely(params) {
	try {
		return params.actions.describeMessageTool(params.context) ?? null;
	} catch (error) {
		reportDiscoveryError(params.pluginId, error);
		return null;
	}
}
function reportDiscoveryError(pluginId, error) {
	const message = formatErrorMessage(error);
	const key = `${pluginId}:describeMessageTool:${message}`;
	if (!loggedMessageActionErrors.has(key)) {
		loggedMessageActionErrors.add(key);
		const stack = error instanceof Error && error.stack ? error.stack : null;
		defaultRuntime.error?.(`[message-action-discovery] ${pluginId}.actions.describeMessageTool failed: ${stack ?? message}`);
	}
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
function runMessageActionDiscovery(steps) {
	let next = steps.next();
	while (!next.done) next = steps.next(resolveMessageActionDiscoveryForPlugin(next.value));
	return next.value;
}
async function runMessageActionDiscoveryAsync(steps) {
	const descriptions = /* @__PURE__ */ new Map();
	let next = steps.next();
	while (!next.done) {
		const request = next.value;
		const { cfg, ...contextFacts } = request.context;
		const contextKey = JSON.stringify(Object.entries(contextFacts).filter(([, value]) => value !== void 0).toSorted(([left], [right]) => left.localeCompare(right)));
		const adapterDescriptions = request.actions ? descriptions.get(request.actions) ?? [] : [];
		let prepared = adapterDescriptions.find((entry) => entry.cfg === cfg && entry.contextKey === contextKey);
		if (!prepared) {
			prepared = {
				cfg,
				contextKey,
				described: await describeMessageToolAsync(request)
			};
			if (request.actions) {
				adapterDescriptions.push(prepared);
				descriptions.set(request.actions, adapterDescriptions);
			}
		}
		next = steps.next(projectMessageActionDiscovery(request, prepared.described));
	}
	return next.value;
}
function resolveMessageActionDiscoveryForPlugin(params) {
	const adapter = params.actions;
	return projectMessageActionDiscovery(params, adapter ? describeMessageToolSafely({
		pluginId: params.pluginId,
		context: params.context,
		actions: adapter
	}) : null);
}
async function resolveMessageActionDiscoveryForPluginAsync(params) {
	return projectMessageActionDiscovery(params, await describeMessageToolAsync(params));
}
async function describeMessageToolAsync(params) {
	if (!params.actions) return null;
	if (!params.actions.describeMessageToolAsync) return describeMessageToolSafely({
		...params,
		actions: params.actions
	});
	try {
		return await params.actions.describeMessageToolAsync(params.context);
	} catch (error) {
		reportDiscoveryError(params.pluginId, error);
		return null;
	}
}
function projectMessageActionDiscovery(params, described) {
	const schema = params.includeSchema ? described?.schema : void 0;
	return {
		actions: params.includeActions && Array.isArray(described?.actions) ? [...described.actions] : [],
		capabilities: params.includeCapabilities && Array.isArray(described?.capabilities) ? described.capabilities : [],
		schemaContributions: schema ? Array.isArray(schema) ? schema : [schema] : [],
		mediaSourceParams: normalizeMessageToolMediaSourceParams(described?.mediaSourceParams, params.action)
	};
}
function* listCrossChannelSchemaSupportedMessageActionsSteps(params) {
	const resolved = yield* resolveCurrentMessageActionDiscoverySteps(params, {
		includeActions: true,
		includeSchema: true
	});
	if (!resolved) return [];
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
function* resolveChannelMessageToolSchemaPropertiesSteps(params) {
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
	function* mergePluginSchema(pluginId, actions) {
		const discovered = yield {
			pluginId,
			actions,
			context: contextForPlugin(pluginId),
			includeSchema: true
		};
		for (const contribution of discovered.schemaContributions) {
			const visibility = contribution.visibility ?? "current-channel";
			if (!currentChannel || visibility === "all-configured" || pluginId === currentChannel) mergeToolSchemaProperties(properties, contribution.properties);
		}
	}
	const channels = params.channels ?? listMessageActionDiscoveryChannels(params.preparedMessageToolCatalog);
	for (const plugin of channels) {
		if (!plugin.actions) continue;
		seenPluginIds.add(plugin.id);
		yield* mergePluginSchema(plugin.id, plugin.actions);
	}
	if (currentChannel && !seenPluginIds.has(currentChannel)) {
		const currentActions = resolveCurrentChannelMessageToolDiscoveryAdapter(currentChannel, params.preparedMessageToolCatalog);
		if (currentActions?.actions) yield* mergePluginSchema(currentActions.pluginId, currentActions.actions);
	}
	return properties;
}
function* resolveCurrentMessageActionDiscoverySteps(params, selection = {}) {
	const pluginActions = resolveCurrentChannelMessageToolDiscoveryAdapter(params.channel, params.preparedMessageToolCatalog);
	return pluginActions ? yield {
		...pluginActions,
		context: createMessageActionDiscoveryContext(params),
		action: params.action,
		...selection
	} : null;
}
async function resolveChannelMessageToolMediaSourceParamKeysAsync(params) {
	const discovered = await runMessageActionDiscoveryAsync(resolveCurrentMessageActionDiscoverySteps(params));
	return uniqueStrings(discovered?.mediaSourceParams ?? []);
}
//#endregion
export { resolveChannelMessageToolSchemaPropertiesSteps as a, resolveMessageActionDiscoveryChannelId as c, runMessageActionDiscoveryAsync as d, resolveChannelMessageToolMediaSourceParamKeysAsync as i, resolveMessageActionDiscoveryForPluginAsync as l, listCrossChannelSchemaSupportedMessageActionsSteps as n, resolveCurrentChannelMessageToolDiscoveryAdapter as o, listMessageActionDiscoveryChannels as r, resolveCurrentMessageActionDiscoverySteps as s, createMessageActionDiscoveryContext as t, runMessageActionDiscovery as u };
