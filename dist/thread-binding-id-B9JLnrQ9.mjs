import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/channels/thread-binding-id.ts
function resolveThreadBindingConversationIdFromBindingId(params) {
	const bindingId = normalizeOptionalString(params.bindingId);
	if (!bindingId) return;
	const prefix = `${params.accountId}:`;
	if (!bindingId.startsWith(prefix)) return;
	return normalizeOptionalString(bindingId.slice(prefix.length));
}
//#endregion
export { resolveThreadBindingConversationIdFromBindingId as t };
