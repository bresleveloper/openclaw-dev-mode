import { type ErrorShape, type SessionsPatchParams } from "../../packages/gateway-protocol/src/index.js";
import type { ModelCatalogEntry } from "../agents/model-catalog.js";
import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type SessionPatchProjectionEntry = {
    entry: SessionEntry;
    sessionKey: string;
};
/** Project a validated gateway session patch for one session entry. */
export declare function projectSessionsPatchEntry(params: {
    cfg: OpenClawConfig;
    entries: readonly SessionPatchProjectionEntry[];
    existingEntry?: SessionEntry;
    storeKey: string;
    agentId?: string;
    patch: SessionsPatchParams;
    loadGatewayModelCatalog?: () => Promise<ModelCatalogEntry[]>;
}): Promise<{
    ok: true;
    entry: SessionEntry;
} | {
    ok: false;
    error: ErrorShape;
}>;
/** Apply a validated gateway session patch to an in-memory session store entry. */
export declare function applySessionsPatchToStore(params: {
    cfg: OpenClawConfig;
    store: Record<string, SessionEntry>;
    storeKey: string;
    agentId?: string;
    patch: SessionsPatchParams;
    loadGatewayModelCatalog?: () => Promise<ModelCatalogEntry[]>;
}): Promise<{
    ok: true;
    entry: SessionEntry;
} | {
    ok: false;
    error: ErrorShape;
}>;
export {};
