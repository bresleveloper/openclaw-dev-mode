import { t as createAccountListHelpers } from "./account-helpers-DihevCTm.js";
import "./account-core-Dpb-yXIR.js";
//#region extensions/whatsapp/src/account-ids.ts
const { listConfiguredAccountIds, listAccountIds, resolveDefaultAccountId: resolveDefaultWhatsAppAccountId } = createAccountListHelpers("whatsapp", { implicitDefaultAccount: { channelKeys: ["authDir"] } });
//#endregion
export { listConfiguredAccountIds as n, resolveDefaultWhatsAppAccountId as r, listAccountIds as t };
