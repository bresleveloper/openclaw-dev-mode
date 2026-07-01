/**
 * Agent message fixtures and casts for tests.
 *
 * These helpers keep fixture construction terse while still returning the
 * runtime message shapes expected by agent test harnesses.
 */
import type { AssistantMessage, UserMessage } from "openclaw/plugin-sdk/llm";
import type { AgentMessage } from "../runtime/index.js";
/** Casts an unknown fixture value to an agent message for tests. */
export declare function castAgentMessage(message: unknown): AgentMessage;
/** Casts unknown fixture values to agent messages for tests. */
export declare function castAgentMessages(messages: unknown[]): AgentMessage[];
/** Builds a user message fixture with a stable timestamp. */
export declare function makeAgentUserMessage(overrides: Partial<UserMessage> & Pick<UserMessage, "content">): UserMessage;
/** Builds an assistant message fixture with stable model/provider defaults. */
export declare function makeAgentAssistantMessage(overrides: Partial<AssistantMessage> & Pick<AssistantMessage, "content">): AssistantMessage;
