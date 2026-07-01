import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/types.js";
import type { MediaUnderstandingConfig, MediaUnderstandingModelConfig } from "../config/types.tools.js";
import { MediaAttachmentCache } from "./attachments.js";
import type { MediaUnderstandingCapability, MediaUnderstandingDecision, MediaUnderstandingModelDecision, MediaUnderstandingOutput, MediaUnderstandingProvider } from "./types.js";
type ProviderRegistry = Map<string, MediaUnderstandingProvider>;
/** Builds the normalized decision record for one provider or CLI model attempt. */
export declare function buildModelDecision(params: {
    entry: MediaUnderstandingModelConfig;
    entryType: "provider" | "cli";
    outcome: MediaUnderstandingModelDecision["outcome"];
    reason?: string;
}): MediaUnderstandingModelDecision;
/** Formats a compact operator-facing summary of a media-understanding decision. */
export declare function formatDecisionSummary(decision: MediaUnderstandingDecision): string;
/** Returns the first non-empty attempt reason, optionally filtered by outcome. */
export declare function findDecisionReason(decision: MediaUnderstandingDecision, outcome?: MediaUnderstandingModelDecision["outcome"]): string | undefined;
/** Trims provider/runtime error prefixes into a stable human-readable reason. */
export declare function normalizeDecisionReason(reason?: string): string | undefined;
/** Produces the short reason token used in status and decision summary output. */
export declare function summarizeDecisionReason(reason?: string): string | undefined;
/** Executes one provider-backed media-understanding entry for one attachment. */
export declare function runProviderEntry(params: {
    capability: MediaUnderstandingCapability;
    entry: MediaUnderstandingModelConfig;
    cfg: OpenClawConfig;
    ctx: MsgContext;
    attachmentIndex: number;
    cache: MediaAttachmentCache;
    agentDir?: string;
    workspaceDir?: string;
    providerRegistry: ProviderRegistry;
    config?: MediaUnderstandingConfig;
}): Promise<MediaUnderstandingOutput | null>;
/** Executes one CLI-backed media-understanding entry for one attachment. */
export declare function runCliEntry(params: {
    capability: MediaUnderstandingCapability;
    entry: MediaUnderstandingModelConfig;
    cfg: OpenClawConfig;
    ctx: MsgContext;
    attachmentIndex: number;
    cache: MediaAttachmentCache;
    config?: MediaUnderstandingConfig;
}): Promise<MediaUnderstandingOutput | null>;
export {};
