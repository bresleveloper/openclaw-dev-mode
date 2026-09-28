import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
//#region src/channels/plugins/conversation-bindings.ts
/**
* Channel conversation binding lifecycle helpers.
*
* Starts plugin binding managers and updates per-session binding idle/max-age limits.
*/
/**
* @deprecated Use setChannelConversationBindingIdleTimeoutBySessionKeyAsync. Retained through the next Plugin SDK major.
*
* Missing plugin support is a no-op because session commands fan out through
* generic channel helpers while only some channels keep conversation bindings.
*/
function setChannelConversationBindingIdleTimeoutBySessionKey(params) {
	const setIdleTimeoutBySessionKey = getChannelPlugin(params.channelId)?.conversationBindings?.setIdleTimeoutBySessionKey;
	if (!setIdleTimeoutBySessionKey) return [];
	return setIdleTimeoutBySessionKey({
		targetSessionKey: params.targetSessionKey,
		accountId: params.accountId,
		idleTimeoutMs: params.idleTimeoutMs
	});
}
/**
* @deprecated Use setChannelConversationBindingMaxAgeBySessionKeyAsync. Retained through the next Plugin SDK major.
*
* Returns the modified binding snapshots so command handlers can report the
* concrete sessions affected by the generic channel command.
*/
function setChannelConversationBindingMaxAgeBySessionKey(params) {
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
	return adapter?.setIdleTimeoutBySessionKeyAsync ? await adapter.setIdleTimeoutBySessionKeyAsync(input) : adapter?.setIdleTimeoutBySessionKey?.(input) ?? [];
}
/** Joins async lifecycle updates, with a synchronous fallback for legacy adapters. */
async function setChannelConversationBindingMaxAgeBySessionKeyAsync(params) {
	const adapter = getChannelPlugin(params.channelId)?.conversationBindings;
	const input = {
		targetSessionKey: params.targetSessionKey,
		accountId: params.accountId,
		maxAgeMs: params.maxAgeMs
	};
	return adapter?.setMaxAgeBySessionKeyAsync ? await adapter.setMaxAgeBySessionKeyAsync(input) : adapter?.setMaxAgeBySessionKey?.(input) ?? [];
}
//#endregion
export { setChannelConversationBindingMaxAgeBySessionKeyAsync as i, setChannelConversationBindingIdleTimeoutBySessionKeyAsync as n, setChannelConversationBindingMaxAgeBySessionKey as r, setChannelConversationBindingIdleTimeoutBySessionKey as t };
