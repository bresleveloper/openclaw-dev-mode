import type { StreamFn } from "../../../agents/runtime/index.js";
import type { ThinkLevel } from "../../../auto-reply/thinking.js";
type DynamicFastMode = boolean | (() => boolean | undefined);
/** @deprecated MiniMax provider-owned stream helper; do not use from third-party plugins. */
export declare function createMinimaxFastModeWrapper(baseStreamFn: StreamFn | undefined, fastMode: DynamicFastMode): StreamFn;
/**
 * Legacy MiniMax (M2.x) Anthropic-compatible streaming endpoint returns
 * reasoning_content in OpenAI-style delta chunks ({delta: {content: "",
 * reasoning_content: "..."}}) rather than the native Anthropic thinking
 * block format. The shared Anthropic provider cannot process this format
 * and leaks the reasoning text as visible content. Disable thinking in the
 * outgoing payload so MiniMax does not produce reasoning_content deltas
 * during streaming.
 *
 * Skipped for MiniMax-M3 and M3.x, which emit proper Anthropic-shape thinking
 * blocks and require thinking enabled to produce any visible content.
 * The Anthropic transport builds `thinking: { type: "disabled" }` when no
 * resolved thinking level exists, so M3 removes that implicit disabled payload.
 * See {@link isMinimaxModelRequiringThinking}.
 */
export declare function createMinimaxThinkingDisabledWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: ThinkLevel): StreamFn;
export {};
