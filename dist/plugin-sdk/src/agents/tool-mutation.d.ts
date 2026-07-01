export type FileTarget = {
    path?: string;
    oldpath?: string;
};
type ToolMutationState = {
    mutatingAction: boolean;
    replaySafe: boolean;
    actionFingerprint?: string;
    fileTarget?: FileTarget;
};
type ToolActionRef = {
    toolName: string;
    meta?: string;
    actionFingerprint?: string;
    fileTarget?: FileTarget;
};
export declare function isLikelyMutatingToolName(toolName: string): boolean;
export declare function isMutatingToolCall(toolName: string, args: unknown): boolean;
/** Return true only for tool calls whose structured contract proves replay safety. */
export declare function isReplaySafeToolCall(toolName: string, args: unknown): boolean;
export declare function buildToolMutationState(toolName: string, args: unknown, meta?: string): ToolMutationState;
export declare function isSameToolMutationAction(existing: ToolActionRef, next: ToolActionRef): boolean;
export {};
