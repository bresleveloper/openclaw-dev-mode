type TranscriptRepairResult = {
    filePath: string;
    broken: boolean;
    repaired: boolean;
    originalEntries: number;
    activeEntries: number;
    legacyOpenAICodexEntries: number;
    backupPath?: string;
    reason?: string;
};
/** Repairs one transcript file by keeping the active branch and backing up the original file. */
export declare function repairBrokenSessionTranscriptFile(params: {
    filePath: string;
    shouldRepair: boolean;
}): Promise<TranscriptRepairResult>;
/** Scans session transcript files and reports or repairs legacy/broken transcript state. */
export declare function noteSessionTranscriptHealth(params?: {
    shouldRepair?: boolean;
    sessionDirs?: string[];
}): Promise<void>;
export {};
