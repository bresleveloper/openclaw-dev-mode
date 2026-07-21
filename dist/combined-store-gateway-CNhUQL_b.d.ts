import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { s as SessionEntry } from "./types-r7E6AIEo.js";

//#region src/config/sessions/combined-store-gateway.d.ts
/** Loads and canonicalizes session entries for gateway views across one or more agent stores. */
declare function loadCombinedSessionStoreForGateway(cfg: OpenClawConfig, opts?: {
  agentId?: string;
  configuredAgentsOnly?: boolean;
}): {
  storePath: string;
  store: Record<string, SessionEntry>;
};
//#endregion
export { loadCombinedSessionStoreForGateway as t };