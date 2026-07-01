/**
 * Subagent delivery state migration.
 *
 * Normalizes legacy flat registry rows into nested execution, completion, and delivery state.
 */
import type { PendingFinalDeliveryPayload, SubagentCompletionDeliveryState, SubagentCompletionState, SubagentRunRecord } from "./subagent-registry.types.js";
/** Legacy flat fields accepted while restoring older subagent registry rows. */
export type LegacySubagentRunRecord = SubagentRunRecord & {
    announceRetryCount?: number;
    lastAnnounceRetryAt?: number;
    lastAnnounceDeliveryError?: string;
    frozenResultText?: string | null;
    frozenResultCapturedAt?: number;
    fallbackFrozenResultText?: string | null;
    fallbackFrozenResultCapturedAt?: number;
    pendingFinalDelivery?: boolean;
    pendingFinalDeliveryCreatedAt?: number;
    pendingFinalDeliveryLastAttemptAt?: number;
    pendingFinalDeliveryAttemptCount?: number;
    pendingFinalDeliveryLastError?: string | null;
    pendingFinalDeliveryPayload?: PendingFinalDeliveryPayload;
    deliverySuspendedAt?: number;
    deliverySuspendedReason?: "retry-limit" | "expiry";
    deliveryDiscardedAt?: number;
    deliveryDiscardReason?: "expired" | "pressure-pruned";
    deliveryDiscardedPayloadSummary?: SubagentCompletionDeliveryState["discardedPayloadSummary"];
    completionEnqueuedAt?: number;
    completionDeliveredAt?: number;
    completionAnnouncedAt?: number;
    lastAnnounceDropReason?: SubagentCompletionDeliveryState["lastDropReason"];
};
/** Normalizes legacy subagent run fields into nested execution/completion/delivery state. */
export declare function normalizeSubagentRunState(entry: SubagentRunRecord): SubagentRunRecord;
/** Ensures a run has a nested completion state object. */
export declare function ensureCompletionState(entry: SubagentRunRecord): SubagentCompletionState;
/** Ensures a run has a nested delivery state object. */
export declare function ensureDeliveryState(entry: SubagentRunRecord): SubagentCompletionDeliveryState;
/** Resets delivery state to its initial status for the run's completion requirement. */
export declare function clearDeliveryState(entry: SubagentRunRecord): void;
/** Returns true when delivery is suspended with a durable timestamp. */
export declare function isDeliverySuspended(entry: SubagentRunRecord): boolean;
/** Reads the current delivery attempt count. */
export declare function getDeliveryAttemptCount(entry: SubagentRunRecord): number;
/** Reads the timestamp of the last delivery attempt. */
export declare function getDeliveryLastAttemptAt(entry: SubagentRunRecord): number | undefined;
/** Reads the non-empty last delivery error. */
export declare function getDeliveryLastError(entry: SubagentRunRecord): string | undefined;
