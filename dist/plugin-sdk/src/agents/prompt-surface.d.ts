import type { AgentPromptSurfaceKind } from "../plugins/types.js";
/** Builds fallback tool guidance when a runtime cannot render the structured tool list. */
export declare function buildOpenClawToolFallbackText(params: {
    surface: AgentPromptSurfaceKind;
    execToolName: string;
    processToolName: string;
}): string;
/** Returns whether the main OpenClaw prompt should include workflow hints around the tool list. */
export declare function shouldRenderOpenClawToolWorkflowHints(params: {
    surface: AgentPromptSurfaceKind;
    hasToolList: boolean;
}): boolean;
/** Maps a session key to the prompt surface used for tool guidance and runtime behavior. */
export declare function resolveAgentPromptSurfaceForSessionKey(sessionKey?: string): AgentPromptSurfaceKind;
