export declare const OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
export declare const AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
export declare const OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE = "response.output_text.delta";
export declare const AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
export type ResponsesTextContentPartType = typeof OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE | typeof AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE;
export type ResponsesTextDeltaEventType = typeof OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE | typeof AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
export type AzureResponsesTextContentPart = {
    type: typeof AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE;
    text: string;
};
export type AzureResponsesTextDeltaEvent = {
    type: typeof AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
    delta: string;
};
export declare function isResponsesTextContentPartType(type: unknown): type is ResponsesTextContentPartType;
export declare function isResponsesTextDeltaEventType(type: unknown): type is ResponsesTextDeltaEventType;
export declare function isAzureResponsesTextDeltaEventType(type: unknown): type is typeof AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
export declare function isAzureResponsesTextDeltaEvent(event: {
    type?: unknown;
    delta?: unknown;
}): event is AzureResponsesTextDeltaEvent;
export type ResponsesMessageSnapshotCollapse = {
    kind: "extend";
    text: string;
} | {
    kind: "keep";
};
export declare function resolveResponsesMessageSnapshotCollapse(params: {
    prior: {
        text: string;
        phase: string | undefined;
    } | null;
    nextText: string;
    nextPhase: string | undefined;
}): ResponsesMessageSnapshotCollapse;
