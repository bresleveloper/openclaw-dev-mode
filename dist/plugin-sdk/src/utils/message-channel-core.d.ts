/**
 * Shared message-channel normalization for delivery, routing, config, and gateway headers.
 *
 * Built-in aliases normalize through channel ids, while plugin-owned channel ids
 * stay accepted even when core has no bundled alias for them.
 */
/** Normalizes raw channel names, aliases, and internal webchat into canonical ids. */
export declare function normalizeMessageChannel(raw?: string | null): string | undefined;
/** Returns true only when a value is already a normalized, non-internal delivery channel id. */
export declare function isDeliverableMessageChannel(value: string): boolean;
