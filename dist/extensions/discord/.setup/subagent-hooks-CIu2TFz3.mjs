import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { d as unbindThreadBindingsBySessionKeyAsync, o as listThreadBindingsBySessionKey, s as listThreadBindingsBySessionKeyAsync } from "./thread-bindings-DcvT_JgI.mjs";
import { normalizeOptionalLowercaseString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { warnPluginSdkDeprecation } from "openclaw/plugin-sdk/thread-bindings-session-runtime";
//#region extensions/discord/src/subagent-hooks.ts
var subagent_hooks_exports = /* @__PURE__ */ __exportAll({
	handleDiscordSubagentDeliveryTarget: () => handleDiscordSubagentDeliveryTarget,
	handleDiscordSubagentDeliveryTargetAsync: () => handleDiscordSubagentDeliveryTargetAsync,
	handleDiscordSubagentEnded: () => handleDiscordSubagentEnded
});
async function handleDiscordSubagentEnded(event) {
	const targetKind = normalizeOptionalLowercaseString(event.targetKind);
	await unbindThreadBindingsBySessionKeyAsync({
		targetSessionKey: event.targetSessionKey,
		accountId: event.accountId,
		targetKind: targetKind === "subagent" || targetKind === "acp" ? targetKind : void 0,
		reason: event.reason,
		sendFarewell: event.sendFarewell
	});
}
function shouldResolveDiscordDeliveryTarget(event) {
	return Boolean(event.expectsCompletionMessage && normalizeOptionalLowercaseString(event.requesterOrigin?.channel) === "discord");
}
/** @deprecated Use handleDiscordSubagentDeliveryTargetAsync; compatible through 2026-12-31, removed in the first January 2027 stable. */
function handleDiscordSubagentDeliveryTarget(event) {
	warnPluginSdkDeprecation({
		family: "conversation-bindings",
		method: "handleDiscordSubagentDeliveryTarget",
		replacement: "handleDiscordSubagentDeliveryTargetAsync"
	});
	if (!shouldResolveDiscordDeliveryTarget(event)) return;
	return resolveDiscordDeliveryTarget(event, listThreadBindingsBySessionKey({
		targetSessionKey: event.childSessionKey,
		accountId: event.requesterOrigin?.accountId?.trim() || void 0,
		targetKind: "subagent"
	}));
}
async function handleDiscordSubagentDeliveryTargetAsync(event) {
	if (!shouldResolveDiscordDeliveryTarget(event)) return;
	return resolveDiscordDeliveryTarget(event, await listThreadBindingsBySessionKeyAsync({
		targetSessionKey: event.childSessionKey,
		accountId: event.requesterOrigin?.accountId?.trim() || void 0,
		targetKind: "subagent"
	}));
}
function resolveDiscordDeliveryTarget(event, bindings) {
	const requesterAccountId = event.requesterOrigin?.accountId?.trim();
	const requesterThreadId = normalizeOptionalStringifiedId(event.requesterOrigin?.threadId);
	const binding = (requesterThreadId ? bindings.find((entry) => entry.threadId === requesterThreadId && (!requesterAccountId || entry.accountId === requesterAccountId)) : void 0) ?? (bindings.length === 1 ? bindings[0] : void 0);
	if (!binding) return;
	return { origin: {
		channel: "discord",
		accountId: binding.accountId,
		to: `channel:${binding.threadId}`,
		threadId: binding.threadId
	} };
}
//#endregion
export { subagent_hooks_exports as i, handleDiscordSubagentDeliveryTargetAsync as n, handleDiscordSubagentEnded as r, handleDiscordSubagentDeliveryTarget as t };
