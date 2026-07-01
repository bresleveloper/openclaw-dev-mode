/**
 * Internal runtime event prompt formatting.
 * Sanitizes background task completion events into protected runtime-context
 * blocks or plain prompt text.
 */
import { type AgentGeneratedAttachment } from "./generated-attachments.js";
import { AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION, type AgentInternalEventSource, type AgentInternalEventStatus } from "./internal-event-contract.js";
import { INTERNAL_RUNTIME_CONTEXT_BEGIN, INTERNAL_RUNTIME_CONTEXT_END } from "./internal-runtime-context.js";
type AgentTaskCompletionInternalEvent = {
    type: typeof AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION;
    source: AgentInternalEventSource;
    childSessionKey: string;
    childSessionId?: string;
    announceType: string;
    taskLabel: string;
    status: AgentInternalEventStatus;
    statusLabel: string;
    result: string;
    attachments?: AgentGeneratedAttachment[];
    mediaUrls?: string[];
    statsLine?: string;
    replyInstruction: string;
};
/** Internal event variants that can be rendered into agent prompt context. */
export type AgentInternalEvent = AgentTaskCompletionInternalEvent;
export { INTERNAL_RUNTIME_CONTEXT_BEGIN, INTERNAL_RUNTIME_CONTEXT_END };
/** Format internal runtime events for the protected runtime-context prompt block. */
export declare function formatAgentInternalEventsForPrompt(events?: AgentInternalEvent[]): string;
/** Format internal runtime events for plain prompts that lack context delimiters. */
export declare function formatAgentInternalEventsForPlainPrompt(events?: AgentInternalEvent[]): string;
