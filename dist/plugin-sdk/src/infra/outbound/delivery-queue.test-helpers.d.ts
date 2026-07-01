import { vi } from "vitest";
import type { DeliverFn, RecoveryLogger } from "./delivery-queue.js";
/** Installs Vitest hooks that provide a fresh delivery-queue state dir per case. */
export declare function installDeliveryQueueTmpDirHooks(): {
    readonly tmpDir: () => string;
};
export declare function readQueuedEntry(tmpDir: string, id: string): Record<string, unknown>;
export declare function readQueuedEntries(tmpDir: string): Record<string, unknown>[];
export declare function setQueuedEntryState(tmpDir: string, id: string, state: {
    retryCount: number;
    lastAttemptAt?: number;
    lastError?: string;
    enqueuedAt?: number;
    platformSendStartedAt?: number;
    recoveryState?: "send_attempt_started" | "unknown_after_send";
}): void;
export declare function createRecoveryLog(): RecoveryLogger & {
    info: ReturnType<typeof vi.fn<(msg: string) => void>>;
    warn: ReturnType<typeof vi.fn<(msg: string) => void>>;
    error: ReturnType<typeof vi.fn<(msg: string) => void>>;
};
export declare function asDeliverFn(deliver: ReturnType<typeof vi.fn>): DeliverFn;
