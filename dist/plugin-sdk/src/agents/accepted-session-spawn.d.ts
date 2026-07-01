export type AcceptedSessionSpawn = {
    runId: string;
    childSessionKey: string;
};
/** Normalize a tool result that accepted a child session spawn. */
export declare function normalizeAcceptedSessionSpawnResult(result: unknown): AcceptedSessionSpawn | null;
/** Return true when a collection contains at least one accepted child spawn. */
export declare function hasAcceptedSessionSpawn(acceptedSessionSpawns?: readonly unknown[]): boolean;
