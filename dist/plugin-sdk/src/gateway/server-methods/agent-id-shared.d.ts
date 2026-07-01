import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { RespondFn } from "./types.js";
/**
 * Shared agent-id resolver for request handlers that accept optional agent ids.
 */
export declare function resolveAgentIdOrRespondError(params: {
    rawAgentId: unknown;
    respond: RespondFn;
    cfg: OpenClawConfig;
    normalize: (rawAgentId: unknown) => string | undefined;
}): {
    cfg: OpenClawConfig;
    agentId: string;
} | null;
