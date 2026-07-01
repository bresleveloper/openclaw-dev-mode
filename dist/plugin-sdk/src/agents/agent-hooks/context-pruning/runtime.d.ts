import type { EffectiveContextPruningSettings } from "./settings.js";
/** Runtime inputs consumed by the context-pruning extension. */
type ContextPruningRuntimeValue = {
    settings: EffectiveContextPruningSettings;
    contextWindowTokens?: number | null;
    isToolPrunable: (toolName: string) => boolean;
    dropThinkingBlocks: boolean;
    lastCacheTouchAt?: number | null;
};
export declare const setContextPruningRuntime: (sessionManager: unknown, value: ContextPruningRuntimeValue | null) => void;
export declare const getContextPruningRuntime: (sessionManager: unknown) => ContextPruningRuntimeValue | null;
export {};
