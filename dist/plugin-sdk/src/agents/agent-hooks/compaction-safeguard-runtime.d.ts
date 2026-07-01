/** Session-manager scoped runtime state for compaction safeguard configuration. */
import type { AgentCompactionIdentifierPolicy } from "../../config/types.agent-defaults.js";
import type { Model } from "../../llm/types.js";
/** Runtime knobs consumed by the compaction safeguard extension. */
type CompactionSafeguardRuntimeValue = {
    maxHistoryShare?: number;
    contextWindowTokens?: number;
    identifierPolicy?: AgentCompactionIdentifierPolicy;
    identifierInstructions?: string;
    customInstructions?: string;
    /**
     * Model to use for compaction summarization.
     * Passed through runtime because `ctx.model` is undefined in the compact.ts workflow
     * (extensionRunner.initialize() is never called in that path).
     */
    model?: Model;
    recentTurnsPreserve?: number;
    workspaceDir?: string;
    postCompactionSections?: string[];
    qualityGuardEnabled?: boolean;
    qualityGuardMaxRetries?: number;
    /**
     * Id of a registered compaction provider plugin.
     * When set and found in the compaction provider registry, the provider's
     * `summarize()` is called instead of the built-in `summarizeInStages()`.
     */
    provider?: string;
    /**
     * Pending human-readable cancel reason from the current safeguard compaction
     * attempt. OpenClaw consumes this to replace the upstream generic
     * "Compaction cancelled" message.
     */
    cancelReason?: string;
};
export declare const setCompactionSafeguardRuntime: (sessionManager: unknown, value: CompactionSafeguardRuntimeValue | null) => void;
export declare const getCompactionSafeguardRuntime: (sessionManager: unknown) => CompactionSafeguardRuntimeValue | null;
/** Stores a human-readable compaction cancel reason on the session runtime state. */
export declare function setCompactionSafeguardCancelReason(sessionManager: unknown, reason: string | undefined): void;
/** Reads and clears the pending compaction cancel reason for one session manager. */
export declare function consumeCompactionSafeguardCancelReason(sessionManager: unknown): string | null;
export {};
