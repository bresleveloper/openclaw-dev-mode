export type ReasoningTagTextDelta = {
    kind: "text";
    text: string;
} | {
    kind: "thinking";
    text: string;
};
export interface ReasoningTagTextPartitioner {
    markStrict(): void;
    push(chunk: string): ReasoningTagTextDelta[];
    pushVisible(chunk: string): ReasoningTagTextDelta[];
    flush(): ReasoningTagTextDelta[];
    hasPending(): boolean;
    isInsideReasoning(): boolean;
}
export declare function createReasoningTagTextPartitioner(): ReasoningTagTextPartitioner;
