import { a as listBindingsForAccount, i as listAllBindings, n as getMatrixThreadBindingManager, o as removeBindingRecord, s as resolveBindingKey } from "./thread-bindings-shared-oNPiyMWY.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getSessionBindingService } from "openclaw/plugin-sdk/conversation-binding-runtime";
//#region extensions/matrix/src/matrix/subagent-hooks.ts
async function handleMatrixSubagentEnded(event) {
	const accountId = normalizeOptionalString(event.accountId) || void 0;
	const matching = (accountId ? listBindingsForAccount(accountId) : listAllBindings()).filter((entry) => entry.targetSessionKey === event.targetSessionKey && entry.targetKind === "subagent");
	const removedBindingKeys = /* @__PURE__ */ new Set();
	if (event.sendFarewell) {
		const bindingService = getSessionBindingService();
		const reason = normalizeOptionalString(event.reason) || "subagent-ended";
		for (const binding of matching) {
			const bindingId = resolveBindingKey(binding);
			if ((await bindingService.unbind({
				bindingId,
				reason,
				scope: {
					channel: "matrix",
					accountId: binding.accountId
				}
			})).some((entry) => entry.bindingId === bindingId)) removedBindingKeys.add(bindingId);
		}
	}
	const affectedAccountIds = /* @__PURE__ */ new Set();
	for (const binding of matching) {
		if (removedBindingKeys.has(resolveBindingKey(binding))) continue;
		if (removeBindingRecord(binding)) affectedAccountIds.add(binding.accountId);
	}
	for (const acctId of affectedAccountIds) await getMatrixThreadBindingManager(acctId)?.persist();
}
function handleMatrixSubagentDeliveryTarget(event) {
	if (!event.expectsCompletionMessage) return;
	if (event.requesterOrigin?.channel?.trim().toLowerCase() !== "matrix") return;
	const requesterAccountId = normalizeOptionalString(event.requesterOrigin?.accountId);
	const requesterThreadId = event.requesterOrigin?.threadId != null && event.requesterOrigin.threadId !== "" ? String(event.requesterOrigin.threadId).trim() : "";
	const bindings = (requesterAccountId ? listBindingsForAccount(requesterAccountId) : listAllBindings()).filter((entry) => entry.targetSessionKey === event.childSessionKey && entry.targetKind === "subagent");
	if (bindings.length === 0) return;
	let binding;
	if (requesterThreadId) binding = bindings.find((entry) => entry.conversationId === requesterThreadId && (!requesterAccountId || entry.accountId === requesterAccountId));
	if (!binding && bindings.length === 1) binding = bindings[0];
	if (!binding) return;
	const roomId = binding.parentConversationId ?? binding.conversationId;
	const threadId = binding.parentConversationId && binding.parentConversationId !== binding.conversationId ? binding.conversationId : void 0;
	return { origin: {
		channel: "matrix",
		accountId: binding.accountId,
		to: `room:${roomId}`,
		...threadId ? { threadId } : {}
	} };
}
//#endregion
export { handleMatrixSubagentDeliveryTarget, handleMatrixSubagentEnded };
