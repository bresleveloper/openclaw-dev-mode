/**
 * Shared usage fixtures for agent tests.
 *
 * Message fixtures reuse this zero-usage object when a test only cares about
 * message shape and not token accounting.
 */
import type { Usage } from "openclaw/plugin-sdk/llm";
/** Usage fixture with every token and cost counter set to zero. */
export declare const ZERO_USAGE_FIXTURE: Usage;
