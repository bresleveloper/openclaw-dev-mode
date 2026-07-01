import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { a as SessionEntry } from "./types-CmP2mjUp.js";

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