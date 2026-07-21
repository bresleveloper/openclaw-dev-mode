import { t as createAccountListHelpers } from "./account-helpers-BAtt8fRD.js";
import "./account-core-CZPaj9zK.js";
//#region extensions/whatsapp/src/account-ids.ts
const { listConfiguredAccountIds, listAccountIds, resolveDefaultAccountId: resolveDefaultWhatsAppAccountId } = createAccountListHelpers("whatsapp", { implicitDefaultAccount: { channelKeys: ["authDir"] } });
//#endregion
export { listConfiguredAccountIds as n, resolveDefaultWhatsAppAccountId as r, listAccountIds as t };
