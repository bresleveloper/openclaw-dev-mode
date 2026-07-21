import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { t as ActiveWebListener } from "./types-DMofNBEx.js";

//#region extensions/whatsapp/src/active-listener.d.ts
declare function resolveWebAccountId(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): string;
declare function getActiveWebListener(accountId: string): ActiveWebListener | null;
//#endregion
export { resolveWebAccountId as n, getActiveWebListener as t };