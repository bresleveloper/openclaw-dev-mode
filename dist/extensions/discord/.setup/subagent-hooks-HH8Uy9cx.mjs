import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { x as ensureBindingsLoadedAsync } from "./thread-bindings.session-updates-Bu_CGr_O.mjs";
import { o as listThreadBindingsBySessionKey, u as unbindThreadBindingsBySessionKeyAsync } from "./thread-bindings-DjQCkmsd.mjs";
import { normalizeOptionalLowercaseString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/discord/src/subagent-hooks.ts
var subagent_hooks_exports = /* @__PURE__ */ __exportAll({
	handleDiscordSubagentDeliveryTarget: () => handleDiscordSubagentDeliveryTarget,
	handleDiscordSubagentDeliveryTargetAsync: () => handleDiscordSubagentDeliveryTargetAsync,
	handleDiscordSubagentEnded: () => handleDiscordSubagentEnded
});
function normalizeThreadBindingTargetKind(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (normalized === "subagent" || normalized === "acp") return normalized;
}
async function handleDiscordSubagentEnded(event) {
	await unbindThreadBindingsBySessionKeyAsync({
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
	const requesterThreadId = normalizeOptionalStringifiedId(event.requesterOrigin?.threadId);
	const bindings = listThreadBindingsBySessionKey({
		targetSessionKey: event.childSessionKey,
		...requesterAccountId ? { accountId: requesterAccountId } : {},
		targetKind: "subagent"
	});
	let binding;
	if (requesterThreadId) binding = bindings.find((entry) => entry.threadId === requesterThreadId && (!requesterAccountId || entry.accountId === requesterAccountId));
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
