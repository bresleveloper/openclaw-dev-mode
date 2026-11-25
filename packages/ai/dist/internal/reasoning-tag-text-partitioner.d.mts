type ReasoningTagTextDelta = {
  kind: "text";
  text: string;
} | {
  kind: "thinking";
  text: string;
};
interface ReasoningTagTextPartitioner {
  markStrict(): void;
  push(chunk: string): ReasoningTagTextDelta[];
  pushVisible(chunk: string): ReasoningTagTextDelta[];
  flush(options?: {
    recoverUnclosed?: boolean;
  }): ReasoningTagTextDelta[];
  hasPending(): boolean;
  /** Whether more input can change buffered Markdown or reasoning-tag ownership. */
  hasPendingSyntax(): boolean;
  isInsideReasoning(): boolean;
}
/** Creates a block-incremental parser that emits only Markdown-stable text. */
export declare function createReasoningTagTextPartitioner(): ReasoningTagTextPartitioner;
export {};