import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
//#region src/channels/plugins/conversation-bindings.ts
/**
* @deprecated Use setChannelConversationBindingIdleTimeoutBySessionKeyAsync; final compatibility day: 2026-12-31.
*
* Missing plugin support is a no-op because session commands fan out through
* generic channel helpers while only some channels keep conversation bindings.
*/
function setChannelConversationBindingIdleTimeoutBySessionKey(params) {
	warnPluginSdkDeprecation({
		family: "channel-conversation-bindings",
		method: "setChannelConversationBindingIdleTimeoutBySessionKey",
		replacement: "setChannelConversationBindingIdleTimeoutBySessionKeyAsync"
	});
	const setIdleTimeoutBySessionKey = getChannelPlugin(params.channelId)?.conversationBindings?.setIdleTimeoutBySessionKey;
	if (!setIdleTimeoutBySessionKey) return [];
	return setIdleTimeoutBySessionKey({
		targetSessionKey: params.targetSessionKey,
		accountId: params.accountId,
		idleTimeoutMs: params.idleTimeoutMs
	});
}
/**
* @deprecated Use setChannelConversationBindingMaxAgeBySessionKeyAsync; final compatibility day: 2026-12-31.
*
* Returns the modified binding snapshots so command handlers can report the
* concrete sessions affected by the generic channel command.
*/
function setChannelConversationBindingMaxAgeBySessionKey(params) {
	warnPluginSdkDeprecation({
		family: "channel-conversation-bindings",
		method: "setChannelConversationBindingMaxAgeBySessionKey",
		replacement: "setChannelConversationBindingMaxAgeBySessionKeyAsync"
	});
	const setMaxAgeBySessionKey = getChannelPlugin(params.channelId)?.conversationBindings?.setMaxAgeBySessionKey;
	if (!setMaxAgeBySessionKey) return [];
	return setMaxAgeBySessionKey({
		targetSessionKey: params.targetSessionKey,
		accountId: params.accountId,
		maxAgeMs: params.maxAgeMs
	});
}
/** Joins async lifecycle updates, with a synchronous fallback for legacy adapters. */
async function setChannelConversationBindingIdleTimeoutBySessionKeyAsync(params) {
	const adapter = getChannelPlugin(params.channelId)?.conversationBindings;
	const input = {
		targetSessionKey: params.targetSessionKey,
		accountId: params.accountId,
		idleTimeoutMs: params.idleTimeoutMs
	};
	if (adapter?.setIdleTimeoutBySessionKeyAsync) return await adapter.setIdleTimeoutBySessionKeyAsync(input);
	if (adapter?.setIdleTimeoutBySessionKey) {
		warnPluginSdkDeprecation({
			family: "channel-conversation-bindings",
			method: "ChannelConversationBindingSupport.setIdleTimeoutBySessionKey",
			replacement: "ChannelConversationBindingSupport.setIdleTimeoutBySessionKeyAsync"
		});
		return adapter.setIdleTimeoutBySessionKey(input);
	}
	return [];
}
/** Joins async lifecycle updates, with a synchronous fallback for legacy adapters. */
async function setChannelConversationBindingMaxAgeBySessionKeyAsync(params) {
	const adapter = getChannelPlugin(params.channelId)?.conversationBindings;
	const input = {
		targetSessionKey: params.targetSessionKey,
		accountId: params.accountId,
		maxAgeMs: params.maxAgeMs
	};
	if (adapter?.setMaxAgeBySessionKeyAsync) return await adapter.setMaxAgeBySessionKeyAsync(input);
	if (adapter?.setMaxAgeBySessionKey) {
		warnPluginSdkDeprecation({
			family: "channel-conversation-bindings",
			method: "ChannelConversationBindingSupport.setMaxAgeBySessionKey",
			replacement: "ChannelConversationBindingSupport.setMaxAgeBySessionKeyAsync"
		});
		return adapter.setMaxAgeBySessionKey(input);
	}
	return [];
}
//#endregion
export { setChannelConversationBindingMaxAgeBySessionKeyAsync as i, setChannelConversationBindingIdleTimeoutBySessionKeyAsync as n, setChannelConversationBindingMaxAgeBySessionKey as r, setChannelConversationBindingIdleTimeoutBySessionKey as t };
