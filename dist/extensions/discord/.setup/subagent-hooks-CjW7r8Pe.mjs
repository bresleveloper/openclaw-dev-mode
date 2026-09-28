import { Ut as __exportAll } from "./discord-BXpHW-cu.mjs";
import { s as ensureBindingsLoadedAsync } from "./thread-bindings.state-BThFQEga.mjs";
import { o as unbindThreadBindingsBySessionKey, r as listThreadBindingsBySessionKey } from "./thread-bindings-CEh2dhqP.mjs";
import { normalizeOptionalLowercaseString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/discord/src/subagent-hooks.ts
var subagent_hooks_exports = /* @__PURE__ */ __exportAll({
	ensureBindingsLoadedAsync: () => ensureBindingsLoadedAsync,
	handleDiscordSubagentDeliveryTarget: () => handleDiscordSubagentDeliveryTarget,
	handleDiscordSubagentDeliveryTargetAsync: () => handleDiscordSubagentDeliveryTargetAsync,
	handleDiscordSubagentEnded: () => handleDiscordSubagentEnded
});
function normalizeThreadBindingTargetKind(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (normalized === "subagent" || normalized === "acp") return normalized;
}
function handleDiscordSubagentEnded(event) {
	unbindThreadBindingsBySessionKey({
		targetSessionKey: event.targetSessionKey,
		accountId: event.accountId,
		targetKind: normalizeThreadBindingTargetKind(event.targetKind),
		reason: event.reason,
		sendFarewell: event.sendFarewell
	});
}
function shouldResolveDiscordDeliveryTarget(event) {
	return Boolean(event.expectsCompletionMessage && normalizeOptionalLowercaseString(event.requesterOrigin?.channel) === "discord");
}
function handleDiscordSubagentDeliveryTarget(event) {
	return shouldResolveDiscordDeliveryTarget(event) ? resolveDiscordDeliveryTarget(event) : void 0;
}
async function handleDiscordSubagentDeliveryTargetAsync(event) {
	if (!shouldResolveDiscordDeliveryTarget(event)) return;
	await ensureBindingsLoadedAsync();
	return resolveDiscordDeliveryTarget(event);
}
function resolveDiscordDeliveryTarget(event) {
	const requesterAccountId = event.requesterOrigin?.accountId?.trim();
	const requesterThreadId = event.requesterOrigin?.threadId != null && event.requesterOrigin.threadId !== "" ? normalizeOptionalStringifiedId(event.requesterOrigin.threadId) ?? "" : "";
	const bindings = listThreadBindingsBySessionKey({
		targetSessionKey: event.childSessionKey,
		...requesterAccountId ? { accountId: requesterAccountId } : {},
		targetKind: "subagent"
	});
	if (bindings.length === 0) return;
	let binding;
	if (requesterThreadId) binding = bindings.find((entry) => {
		if (entry.threadId !== requesterThreadId) return false;
		if (requesterAccountId && entry.accountId !== requesterAccountId) return false;
		return true;
	});
	if (!binding && bindings.length === 1) binding = bindings[0];
	if (!binding) return;
	return { origin: {
		channel: "discord",
		accountId: binding.accountId,
		to: `channel:${binding.threadId}`,
		threadId: binding.threadId
	} };
}
//#endregion
export { handleDiscordSubagentEnded as n, subagent_hooks_exports as r, handleDiscordSubagentDeliveryTarget as t };
