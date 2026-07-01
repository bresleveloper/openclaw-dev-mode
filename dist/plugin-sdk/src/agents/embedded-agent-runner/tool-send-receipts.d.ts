type ToolSendReceiptResult = {
    details: {
        toolSend: unknown;
    };
};
export declare function recordEmbeddedToolSendReceipt(sessionManager: unknown, toolCallId: string, toolSend: unknown): void;
export declare function consumeEmbeddedToolSendReceipt(sessionManager: unknown, toolCallId: string): ToolSendReceiptResult | undefined;
export {};
