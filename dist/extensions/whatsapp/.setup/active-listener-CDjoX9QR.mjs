import { r as resolveDefaultWhatsAppAccountId } from "./account-ids-CB5SOWjc.mjs";
import { r as getWhatsAppConnectionController } from "./connection-controller-runtime-context-hgLJoRc8.mjs";
//#region extensions/whatsapp/src/active-listener.ts
function resolveWebAccountId(params) {
	return (params.accountId ?? "").trim() || resolveDefaultWhatsAppAccountId(params.cfg);
}
function getActiveWebListener(accountId) {
	return getWhatsAppConnectionController(accountId)?.getActiveListener() ?? null;
}
//#endregion
export { resolveWebAccountId as n, getActiveWebListener as t };
