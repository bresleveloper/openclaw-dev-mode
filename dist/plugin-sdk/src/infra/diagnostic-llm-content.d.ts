/** Per-field policy for diagnostic traces that may include model-visible content. */
export type DiagnosticModelContentCapturePolicy = {
    /** Capture chat/message payloads sent to a model. */
    inputMessages: boolean;
    /** Capture model response messages. */
    outputMessages: boolean;
    /** Capture tool invocation arguments. */
    toolInputs: boolean;
    /** Capture tool result payloads. */
    toolOutputs: boolean;
    /** Capture the system prompt or instruction block. */
    systemPrompt: boolean;
    /** Capture tool schemas/definitions presented to a model. */
    toolDefinitions: boolean;
    /** Whether any model-visible prompt/response/schema content is enabled. */
    anyModelContent: boolean;
};
export declare function cloneDiagnosticContentValue(value: unknown): unknown;
/** Resolves model-content diagnostic capture from config, defaulting to no content capture. */
export declare function resolveDiagnosticModelContentCapturePolicy(config: unknown): DiagnosticModelContentCapturePolicy;
