/**
 * Branch-summary bridge from session managers to the shared agent-core summarizer.
 *
 * Keeps session-manager branch traversal local while delegating summary generation to agent-core.
 */
import type { Model } from "../../../llm/types.js";
import { prepareBranchEntries, type BranchPreparation, type BranchSummaryDetails, type FileOperations } from "../../runtime/index.js";
import type { SessionEntry, ReadonlySessionManager } from "../session-manager.js";
export type { BranchPreparation, BranchSummaryDetails, FileOperations };
export { prepareBranchEntries };
export interface CollectEntriesResult {
    entries: SessionEntry[];
    commonAncestorId: string | null;
}
export interface BranchSummaryResult {
    summary?: string;
    readFiles?: string[];
    modifiedFiles?: string[];
    aborted?: boolean;
    error?: string;
}
export interface GenerateBranchSummaryOptions {
    model: Model;
    apiKey: string;
    headers?: Record<string, string>;
    signal: AbortSignal;
    customInstructions?: string;
    replaceInstructions?: boolean;
    reserveTokens?: number;
}
/** Collects entries that differ between two session branches for summarization. */
export declare function collectEntriesForBranchSummary(session: ReadonlySessionManager, oldLeafId: string | null, targetId: string): CollectEntriesResult;
/** Generates a human-readable branch summary through the shared agent-core runtime. */
export declare function generateBranchSummary(entries: SessionEntry[], options: GenerateBranchSummaryOptions): Promise<BranchSummaryResult>;
