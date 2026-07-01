import type { CompactionSummarizationInstructions } from "../compaction.js";
/** Wraps operator-provided compaction instruction text as untrusted prompt data. */
export declare function wrapUntrustedInstructionBlock(label: string, text: string): string;
/** Build the required structured summary instructions for compaction. */
export declare function buildCompactionStructureInstructions(customInstructions?: string, summarizationInstructions?: CompactionSummarizationInstructions): string;
/** Return a structured fallback summary when model output is missing/invalid. */
export declare function buildStructuredFallbackSummary(previousSummary: string | undefined, _summarizationInstructions?: CompactionSummarizationInstructions): string;
/** Append an already-formatted summary section without disturbing empty summaries. */
/** Appends a bounded post-compaction section to an existing summary. */
export declare function appendSummarySection(summary: string, section: string): string;
/** Extracts likely exact identifiers that summaries should preserve literally. */
export declare function extractOpaqueIdentifiers(text: string): string[];
/** Audit summary structure, exact identifier preservation, and latest-ask coverage. */
/** Audits a candidate summary for required sections, pending asks, and identifier preservation. */
export declare function auditSummaryQuality(params: {
    summary: string;
    identifiers: string[];
    latestAsk: string | null;
    identifierPolicy?: CompactionSummarizationInstructions["identifierPolicy"];
}): {
    ok: boolean;
    reasons: string[];
};
