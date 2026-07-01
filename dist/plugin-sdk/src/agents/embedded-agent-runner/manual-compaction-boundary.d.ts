/**
 * Hardens manual compaction transcript boundaries after explicit `/compact`.
 */
import type { AgentMessage } from "../runtime/index.js";
type HardenedManualCompactionBoundary = {
    applied: boolean;
    firstKeptEntryId?: string;
    leafId?: string;
    messages: AgentMessage[];
};
/** Rewrite the latest manual compaction leaf so replay starts from its summary. */
export declare function hardenManualCompactionBoundary(params: {
    sessionFile: string;
    preserveRecentTail?: boolean;
}): Promise<HardenedManualCompactionBoundary>;
export {};
