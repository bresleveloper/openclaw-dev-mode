import { createAccountListHelpers } from "openclaw/plugin-sdk/account-core";
// extensions/whatsapp/src/account-ids.ts
const { listConfiguredAccountIds, listAccountIds, resolveDefaultAccountId: resolveDefaultWhatsAppAccountId } = createAccountListHelpers("whatsapp", { implicitDefaultAccount: { channelKeys: ["authDir"] } });
export { listConfiguredAccountIds as n, resolveDefaultWhatsAppAccountId as r, listAccountIds as t };
