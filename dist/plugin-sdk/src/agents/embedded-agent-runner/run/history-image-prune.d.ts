/**
 * Prunes already-processed image payloads from replayed prompt history.
 */
import type { AgentMessage } from "../../runtime/index.js";
/** Replacement text for old image blocks that were already available to the model. */
export declare const PRUNED_HISTORY_IMAGE_MARKER = "[image data removed - already processed by model]";
/** Replacement text for old textual media references that would otherwise be reloaded. */
export declare const PRUNED_HISTORY_MEDIA_REFERENCE_MARKER = "[media reference removed - already processed by model]";
type PrunableContextAgent = {
    transformContext?: (messages: AgentMessage[], signal?: AbortSignal) => AgentMessage[] | Promise<AgentMessage[]>;
};
/**
 * Idempotent cleanup: prune persisted image blocks from completed turns older
 * than {@link PRESERVE_RECENT_COMPLETED_TURNS}. The delay also reduces
 * prompt-cache churn, though prefix stability additionally depends on the
 * replay sanitizer being idempotent. Textual media markers are scrubbed on the
 * same boundary because detectAndLoadPromptImages treats them as fresh prompt
 * image references when old history is replayed into a later prompt.
 */
export declare function pruneProcessedHistoryImages(messages: AgentMessage[]): AgentMessage[] | null;
/** Installs an agent context transform that prunes old image/media history before model input. */
export declare function installHistoryImagePruneContextTransform(agent: PrunableContextAgent): () => void;
export {};
