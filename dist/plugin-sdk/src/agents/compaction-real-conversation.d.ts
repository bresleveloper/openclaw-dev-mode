import type { AgentMessage } from "./runtime/index.js";
/** Returns whether a message has content worth preserving as conversation. */
export declare function hasMeaningfulConversationContent(message: AgentMessage): boolean;
/** Returns whether a transcript message should count as real conversation. */
export declare function isRealConversationMessage(message: AgentMessage, messages: AgentMessage[], index: number): boolean;
