/**
 * Wraps stream object events with mutable assistant-message transforms.
 */
import type { MutableAssistantMessageEventStream } from "../../stream-compat.js";
/**
 * Mutates a stream so every object event passes through `onEvent` before the
 * consumer receives it. Used by stream adapters that need to normalize partial
 * and final message snapshots without replacing the stream object.
 */
export declare function wrapStreamObjectEvents(stream: MutableAssistantMessageEventStream, onEvent: (event: Record<string, unknown>) => void | Promise<void>): MutableAssistantMessageEventStream;
