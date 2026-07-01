import type { StreamFn } from "../../../agents/runtime/index.js";
import type { ThinkLevel } from "../../../auto-reply/thinking.js";
export { createMoonshotThinkingWrapper, resolveMoonshotThinkingKeep, resolveMoonshotThinkingType, } from "./moonshot-thinking.js";
/** Detects SiliconFlow Pro models that require thinking=null instead of thinking="off". */
export declare function shouldApplySiliconFlowThinkingOffCompat(params: {
    provider: string;
    modelId: string;
    thinkingLevel?: ThinkLevel;
}): boolean;
/** Wraps Moonshot-compatible requests to rewrite SiliconFlow thinking-off payloads. */
export declare function createSiliconFlowThinkingWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
