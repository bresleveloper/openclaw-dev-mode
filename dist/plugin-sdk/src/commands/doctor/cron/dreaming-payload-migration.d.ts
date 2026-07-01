type UnknownRecord = Record<string, unknown>;
/** Rewrite managed dreaming jobs to the isolated light-context agent-turn shape. */
export declare function migrateLegacyDreamingPayloadShape(jobs: UnknownRecord[]): {
    changed: boolean;
    rewrittenCount: number;
};
/** Count managed dreaming jobs that still need payload/session/delivery migration. */
export declare function countStaleDreamingJobs(jobs: UnknownRecord[]): number;
export {};
