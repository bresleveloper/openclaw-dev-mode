import type { ImageContent, Message, TextContent } from "../../../llm-core/src/index.js";
import type { AgentMessage, BashExecutionMessage, BranchSummaryMessage, CompactionSummaryMessage, CustomMessage } from "../types.js";
export type { BashExecutionMessage, BranchSummaryMessage, CompactionSummaryMessage, CustomMessage, } from "../types.js";
/** Harness-only transcript entries that can be normalized into LLM messages. */
export type HarnessMessage = AgentMessage | BashExecutionMessage | CustomMessage | BranchSummaryMessage | CompactionSummaryMessage;
export declare function asAgentMessage(message: HarnessMessage): AgentMessage;
export declare const COMPACTION_SUMMARY_PREFIX = "The conversation history before this point was compacted into the following summary:\n\n<summary>\n";
export declare const COMPACTION_SUMMARY_SUFFIX = "\n</summary>";
export declare const BRANCH_SUMMARY_PREFIX = "The following is a summary of a branch that this conversation came back from:\n\n<summary>\n";
export declare const BRANCH_SUMMARY_SUFFIX = "</summary>";
/** Render a shell execution record as user-visible context text for the model. */
export declare function bashExecutionToText(msg: BashExecutionMessage): string;
/** Build a persisted branch summary message from the repository timestamp string. */
export declare function createBranchSummaryMessage(summary: string, fromId: string, timestamp: string): BranchSummaryMessage;
/** Build a persisted compaction summary message from the repository timestamp string. */
export declare function createCompactionSummaryMessage(summary: string, tokensBefore: number, timestamp: string): CompactionSummaryMessage;
/** Build a custom transcript message that can be shown and replayed into context. */
export declare function createCustomMessage(customType: string, content: string | (TextContent | ImageContent)[], display: boolean, details: unknown, timestamp: string): CustomMessage;
/** Convert harness transcript messages into the LLM-facing message sequence. */
export declare function convertToLlm(messages: AgentMessage[]): Message[];
