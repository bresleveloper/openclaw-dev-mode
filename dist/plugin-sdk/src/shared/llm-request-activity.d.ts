export declare function notifyLlmRequestActivity(signal: AbortSignal | undefined): void;
export declare function onLlmRequestActivity(signal: AbortSignal, listener: () => void): () => void;
