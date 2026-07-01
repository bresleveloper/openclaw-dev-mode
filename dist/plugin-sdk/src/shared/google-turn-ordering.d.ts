import type { AgentMessage } from "../agents/runtime/index.js";
/** Add a synthetic user bootstrap when Google-style providers receive assistant-first turns. */
export declare function sanitizeGoogleAssistantFirstOrdering(messages: AgentMessage[]): AgentMessage[];
