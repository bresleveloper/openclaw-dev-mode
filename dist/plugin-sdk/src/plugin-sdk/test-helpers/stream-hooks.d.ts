export declare function createCapturedThinkingConfigStream(): {
    streamFn: import("@openclaw/llm-core").StreamFn;
    getCapturedPayload: () => Record<string, unknown> | undefined;
};
