import type { OutboundDeliveryResult } from "./deliver-types.js";
/** Callback attached to a delivery result and run after durable send commit. */
export type OutboundDeliveryCommitHook = () => Promise<void>;
/** Attaches an after-commit hook without changing the delivery result shape. */
export declare function attachOutboundDeliveryCommitHook<T extends OutboundDeliveryResult>(result: T, hook?: OutboundDeliveryCommitHook): T;
/** Runs after-commit hooks for delivered results while isolating hook failures. */
export declare function runOutboundDeliveryCommitHooks(results: readonly OutboundDeliveryResult[]): Promise<void>;
/** Type guard for batched outbound delivery results crossing loose boundaries. */
export declare function isOutboundDeliveryResultArray(value: unknown): value is OutboundDeliveryResult[];
