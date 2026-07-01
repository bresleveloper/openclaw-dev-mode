type TransportUsage = {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    totalTokens: number;
    cost: {
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
        total: number;
    };
};
export type WritableTransportStream = {
    push(event: unknown): void;
    end(): void;
};
type TransportOutputShape = {
    stopReason: string;
    errorMessage?: string;
    errorCode?: string;
    errorType?: string;
    errorBody?: string;
};
export declare function sanitizeTransportPayloadText(text: string): string;
export declare function sanitizeNonEmptyTransportPayloadText(text: string, fallback?: string): string;
export declare function coerceTransportToolCallArguments(argumentsValue: unknown): Record<string, unknown>;
export declare function mergeTransportHeaders(...headerSources: Array<Record<string, string> | undefined>): Record<string, string> | undefined;
export declare function mergeTransportMetadata<T extends Record<string, unknown>>(payload: T, metadata?: Record<string, string>): T;
export declare function createEmptyTransportUsage(): TransportUsage;
export declare function createWritableTransportEventStream(): {
    eventStream: import("@openclaw/llm-core/event-stream").AssistantMessageEventStream;
    stream: WritableTransportStream;
};
export declare function finalizeTransportStream(params: {
    stream: WritableTransportStream;
    output: TransportOutputShape;
    signal?: AbortSignal;
}): void;
export declare function assignTransportErrorDetails(output: TransportOutputShape, error: unknown, signal?: AbortSignal): void;
export declare function failTransportStream(params: {
    stream: WritableTransportStream;
    output: TransportOutputShape;
    signal?: AbortSignal;
    error: unknown;
    cleanup?: () => void;
}): void;
export {};
