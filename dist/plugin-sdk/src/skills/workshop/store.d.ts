import { type SkillProposalManifest, type SkillProposalReadResult, type SkillProposalRecord, type SkillProposalRollback, type SkillProposalSupportFile, type SkillProposalSupportFileInput } from "./types.js";
export declare const MAX_PROPOSAL_SUPPORT_FILES = 64;
type SkillWorkshopStoreOptions = {
    env?: NodeJS.ProcessEnv;
    stateDir?: string;
};
export type PreparedSkillProposalSupportFile = SkillProposalSupportFile & {
    content: string;
};
type SkillProposalWriteGuard = (manifest: SkillProposalManifest) => Promise<void> | void;
/** Creates a stable proposal id from skill name, date, and random suffix. */
export declare function createSkillProposalId(name: string, now?: Date): string;
export declare function hashSkillProposalContent(content: string): string;
export declare function prepareSkillProposalSupportFiles(input: readonly SkillProposalSupportFileInput[] | undefined): PreparedSkillProposalSupportFile[];
export declare function resolveSkillProposalTarget(params: {
    workspaceDir: string;
    skillName: string;
}): {
    skillKey: string;
    skillDir: string;
    skillFile: string;
};
export declare function readSkillProposal(proposalId: string, options?: SkillWorkshopStoreOptions): Promise<SkillProposalReadResult | null>;
export declare function readSkillProposalRecord(proposalId: string, options?: SkillWorkshopStoreOptions): Promise<SkillProposalRecord | null>;
export declare function writeSkillProposal(params: {
    record: SkillProposalRecord;
    content: string;
    supportFiles?: readonly PreparedSkillProposalSupportFile[];
    beforeWrite?: SkillProposalWriteGuard;
    store?: SkillWorkshopStoreOptions;
}): Promise<void>;
export declare function replaceSkillProposalDraft(params: {
    record: SkillProposalRecord;
    previousSupportFiles?: readonly SkillProposalSupportFile[];
    content: string;
    supportFiles?: readonly PreparedSkillProposalSupportFile[];
    store?: SkillWorkshopStoreOptions;
}): Promise<void>;
export declare function updateSkillProposalRecord(params: {
    record: SkillProposalRecord;
    store?: SkillWorkshopStoreOptions;
}): Promise<void>;
export declare function withSkillProposalTargetLock<T>(record: SkillProposalRecord, fn: () => Promise<T>, options?: SkillWorkshopStoreOptions): Promise<T>;
export declare function writeSkillProposalRollback(params: {
    proposalId: string;
    rollback: SkillProposalRollback;
    store?: SkillWorkshopStoreOptions;
}): Promise<void>;
export declare function readSkillProposalManifest(options?: SkillWorkshopStoreOptions): Promise<SkillProposalManifest>;
export declare function refreshSkillProposalManifest(options?: SkillWorkshopStoreOptions): Promise<SkillProposalManifest>;
export declare function readProposalSupportFiles(record: SkillProposalRecord, options?: SkillWorkshopStoreOptions): Promise<PreparedSkillProposalSupportFile[]>;
export declare function createSkillProposalRollback(params: {
    proposalId: string;
    targetSkillFile: string;
    action: "create" | "update";
    previousContent?: string;
    supportFiles?: SkillProposalRollback["supportFiles"];
}): SkillProposalRollback;
export {};
