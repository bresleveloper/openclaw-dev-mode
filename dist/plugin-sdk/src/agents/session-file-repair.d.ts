type RepairReport = {
    repaired: boolean;
    droppedLines: number;
    validatedSnapshot?: SessionRepairFileSnapshot;
    rewrittenAssistantMessages?: number;
    droppedBlankUserMessages?: number;
    rewrittenUserMessages?: number;
    removedCorruptedImageBlocks?: number;
    insertedToolResults?: number;
    backupPath?: string;
    reason?: string;
};
type SessionRepairFileSnapshot = {
    dev: bigint;
    ino: bigint;
    size: bigint;
    mtimeNs: bigint;
    ctimeNs: bigint;
};
export declare function invalidateSessionFileRepairCache(sessionFile: string): void;
/** Repair a persisted session JSONL file in place when replay-breaking corruption is found. */
export declare function repairSessionFileIfNeeded(params: {
    sessionFile: string;
    trustedSnapshot?: SessionRepairFileSnapshot;
    debug?: (message: string) => void;
    warn?: (message: string) => void;
}): Promise<RepairReport>;
export {};
