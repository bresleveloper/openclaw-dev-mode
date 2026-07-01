import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Inputs for generating a short conversation label from the active model. */
export type ConversationLabelParams = {
    userMessage: string;
    prompt: string;
    cfg: OpenClawConfig;
    agentId?: string;
    agentDir?: string;
    maxLength?: number;
};
/** Generates a bounded human-readable label for a session, or null on failure. */
export declare function generateConversationLabel(params: ConversationLabelParams): Promise<string | null>;
