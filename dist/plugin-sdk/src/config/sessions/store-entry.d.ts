import type { SessionEntry } from "./types.js";
export declare function normalizeStoreSessionKey(sessionKey: string): string;
export declare function foldedSessionKeyAliasCandidates(normalizedKey: string): string[];
/** Tail-preserved keys like Matrix rooms need delivery-target proof before a
 *  folded key is treated as a legacy alias. Segment-preserved legacy keys
 *  (Signal groups) keep their old permissive lowercase fallback. */
export declare function isConfirmedLowercasedLegacyAlias(entry: SessionEntry | undefined, normalizedKey: string): boolean;
export declare function hasMismatchedCaseSensitiveDeliveryProof(entry: SessionEntry | undefined, normalizedKey: string): boolean;
export declare function resolveSessionStoreEntry(params: {
    store: Record<string, SessionEntry>;
    sessionKey: string;
}): {
    normalizedKey: string;
    existing: SessionEntry | undefined;
    legacyKeys: string[];
};
