import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/channels/thread-binding-id.ts
/** Parses an account-prefixed binding id back into a conversation id. */
function resolveThreadBindingConversationIdFromBindingId(params) {
	const bindingId = normalizeOptionalString(params.bindingId);
	if (!bindingId) return;
	const prefix = `${params.accountId}:`;
	if (!bindingId.startsWith(prefix)) return;
	return normalizeOptionalString(bindingId.slice(prefix.length)) || void 0;
}
//#endregion
export { resolveThreadBindingConversationIdFromBindingId as t };
