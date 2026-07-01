import type { OpenClawConfig } from "../types.openclaw.js";
import type { SessionEntry } from "./types.js";
/** Loads and canonicalizes session entries for gateway views across one or more agent stores. */
export declare function loadCombinedSessionStoreForGateway(cfg: OpenClawConfig, opts?: {
    agentId?: string;
    configuredAgentsOnly?: boolean;
}): {
    storePath: string;
    store: Record<string, SessionEntry>;
};
