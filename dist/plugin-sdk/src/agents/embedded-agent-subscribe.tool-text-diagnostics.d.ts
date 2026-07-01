import type { AssistantMessage } from "../llm/types.js";
import type { EmbeddedAgentSubscribeContext } from "./embedded-agent-subscribe.handlers.types.js";
/** Log a diagnostic when assistant text resembles a tool call but is not structured. */
export declare function warnIfAssistantEmittedToolText(ctx: EmbeddedAgentSubscribeContext, assistantMessage: AssistantMessage): void;
