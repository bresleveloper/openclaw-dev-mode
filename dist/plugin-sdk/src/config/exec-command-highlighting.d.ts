import type { OpenClawConfig } from "./types.openclaw.js";
/** Resolves whether exec command highlighting is enabled for the current agent scope. */
export declare function resolveExecCommandHighlighting(params: {
    config?: OpenClawConfig | null;
    agentId?: string | null;
}): boolean;
