import { r as resolveDefaultWhatsAppAccountId } from "./account-ids-ENToBTTq.mjs";
import { r as getWhatsAppConnectionController } from "./connection-controller-runtime-context-BnT2FwBQ.mjs";
// extensions/whatsapp/src/active-listener.ts
function resolveWebAccountId(params) {
	return (params.accountId ?? "").trim() || resolveDefaultWhatsAppAccountId(params.cfg);
}
function getActiveWebListener(accountId) {
	return getWhatsAppConnectionController(accountId)?.getActiveListener() ?? null;
}
export { resolveWebAccountId as n, getActiveWebListener as t };
