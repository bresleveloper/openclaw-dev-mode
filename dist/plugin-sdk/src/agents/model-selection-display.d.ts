/** Inputs used to choose the visible model ref/name for status surfaces. */
type ModelDisplaySelectionParams = {
    runtimeProvider?: unknown;
    runtimeModel?: unknown;
    overrideProvider?: unknown;
    overrideModel?: unknown;
    fallbackModel?: unknown;
};
/** Resolves the most specific provider/model ref for display. */
export declare function resolveModelDisplayRef(params: ModelDisplaySelectionParams): string | undefined;
/** Resolves the model name shown in compact status output. */
export declare function resolveModelDisplayName(params: ModelDisplaySelectionParams): string;
/** Inputs used to resolve model/provider values for session info. */
type SessionInfoModelSelectionParams = {
    currentProvider?: unknown;
    currentModel?: unknown;
    defaultProvider?: unknown;
    defaultModel?: unknown;
    entryProvider?: unknown;
    entryModel?: unknown;
    overrideProvider?: unknown;
    overrideModel?: unknown;
};
/** Resolves session-info model selection from entry, override, and fallback data. */
export declare function resolveSessionInfoModelSelection(params: SessionInfoModelSelectionParams): {
    modelProvider?: string;
    model?: string;
};
export {};
