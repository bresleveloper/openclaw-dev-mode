import "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { s as toSafeImportPath } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import "./hook-runner-global-DlvY8FQy.mjs";
import { a as claimPluginInteractiveCallbackDedupe, i as resolvePluginInteractiveRegistrationsMatch, o as commitPluginInteractiveCallbackDedupe, s as releasePluginInteractiveCallbackDedupe } from "./interactive-registry-BhiJMZBb.mjs";
import { c as getCurrentPluginConversationBinding, f as requestPluginConversationBinding, s as detachPluginConversationBinding } from "./conversation-binding-6xSU5aQc.mjs";
import "./commands-CNifq--_.mjs";
import "./command-specs-enEeJ24Y.mjs";
//#region src/plugins/interactive-binding-helpers.ts
/** Helpers for binding interactive plugin handlers to conversations and sessions. */
function createInteractiveConversationBindingHelpers(params) {
	const { registration, senderId, conversation } = params;
	const pluginRoot = registration.pluginRoot;
	return {
		requestConversationBinding: async (binding = {}) => {
			if (!pluginRoot) return {
				status: "error",
				message: "This interaction cannot bind the current conversation."
			};
			return requestPluginConversationBinding({
				pluginId: registration.pluginId,
				pluginName: registration.pluginName,
				pluginRoot,
				requestedBySenderId: senderId,
				conversation,
				binding
			});
		},
		detachConversationBinding: async () => {
			if (!pluginRoot) return { removed: false };
			return detachPluginConversationBinding({
				pluginRoot,
				conversation
			});
		},
		getCurrentConversationBinding: async () => {
			if (!pluginRoot) return null;
			return getCurrentPluginConversationBinding({
				pluginRoot,
				conversation
			});
		}
	};
}
//#endregion
//#region src/plugins/interactive.ts
function resolveActivePluginInteractiveNamespaceMatch(channel, data) {
	return resolvePluginInteractiveRegistrationsMatch(getActivePluginRegistry()?.interactiveHandlers ?? [], channel, data);
}
/** Dispatches one interactive callback payload to a matching plugin handler. */
async function dispatchPluginInteractiveHandler(params) {
	const match = resolveActivePluginInteractiveNamespaceMatch(params.channel, params.data);
	if (!match) return {
		matched: false,
		handled: false,
		duplicate: false
	};
	const dedupeKey = params.dedupeId?.trim();
	if (dedupeKey && !claimPluginInteractiveCallbackDedupe(dedupeKey)) return {
		matched: true,
		handled: true,
		duplicate: true
	};
	try {
		await params.onMatched?.();
		const resolved = await params.invoke(match);
		await params.afterInvoke?.(resolved);
		if (dedupeKey) commitPluginInteractiveCallbackDedupe(dedupeKey);
		const shouldExposeResult = Boolean(resolved) && typeof resolved === "object" && Object.keys(resolved).some((key) => key !== "handled");
		return {
			matched: true,
			handled: resolved?.handled ?? true,
			duplicate: false,
			...shouldExposeResult ? { result: resolved } : {}
		};
	} catch (error) {
		if (dedupeKey) releasePluginInteractiveCallbackDedupe(dedupeKey);
		throw error;
	}
}
/** Creates a channel dispatcher for plugin-owned interactive callbacks. */
function createChannelInteractiveDispatcher(config) {
	return async (params) => await dispatchPluginInteractiveHandler({
		channel: config.channel,
		data: params.data,
		dedupeId: params.dedupeId,
		onMatched: params.onMatched,
		afterInvoke: params.afterInvoke,
		invoke: ({ registration, namespace, payload }) => {
			const dispatchInteractiveKey = config.dispatchInteractiveKey ?? config.interactiveKey;
			const { [dispatchInteractiveKey]: interactiveContext, ...handlerContext } = params.ctx;
			const conversation = params.conversation ?? {
				channel: config.channel,
				accountId: params.ctx.accountId,
				conversationId: params.ctx.conversationId,
				parentConversationId: params.ctx.parentConversationId,
				threadId: params.ctx.threadId
			};
			const senderId = params.ctx.senderId?.trim();
			const accountId = params.ctx.accountId.trim();
			const conversationId = params.ctx.conversationId.trim();
			const bindingHelpers = createInteractiveConversationBindingHelpers({
				registration: params.ctx.auth.isAuthorizedSender && senderId && accountId && conversationId ? registration : {
					...registration,
					pluginRoot: void 0
				},
				senderId: params.ctx.senderId,
				conversation
			});
			return registration.handler({
				...handlerContext,
				channel: config.channel,
				[config.interactiveKey]: {
					...interactiveContext,
					data: params.data,
					namespace,
					payload
				},
				respond: params.respond,
				...bindingHelpers
			});
		}
	});
}
//#endregion
//#region src/plugins/lazy-service-module.ts
function resolveExport(mod, names) {
	for (const name of names) {
		const value = mod[name];
		if (typeof value === "function") return value;
	}
	return null;
}
async function defaultLoadOverrideModule(specifier, importModule = async (source) => await import(source)) {
	return importModule(toSafeImportPath(specifier));
}
async function startLazyPluginServiceModule(params) {
	const skipEnvVar = params.skipEnvVar?.trim();
	if (skipEnvVar && isTruthyEnvValue(process.env[skipEnvVar])) return null;
	const overrideEnvVar = params.overrideEnvVar?.trim();
	const override = overrideEnvVar ? process.env[overrideEnvVar]?.trim() : void 0;
	const loadOverrideModule = params.loadOverrideModule ?? defaultLoadOverrideModule;
	const validatedOverride = override && params.validateOverrideSpecifier ? params.validateOverrideSpecifier(override) : override;
	const mod = validatedOverride ? await loadOverrideModule(validatedOverride) : await params.loadDefaultModule();
	const start = resolveExport(mod, params.startExportNames);
	if (!start) return null;
	const stop = params.stopExportNames && params.stopExportNames.length > 0 ? resolveExport(mod, params.stopExportNames) : null;
	await start();
	return { stop: stop ?? (async () => {}) };
}
//#endregion
export { createInteractiveConversationBindingHelpers as i, createChannelInteractiveDispatcher as n, dispatchPluginInteractiveHandler as r, startLazyPluginServiceModule as t };
