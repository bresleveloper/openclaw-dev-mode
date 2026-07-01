import { type ChannelProgressDraftLine, type StreamingCompatEntry, type StreamingMode } from "./streaming.js";
export type ChannelProgressDraftMode = StreamingMode;
export type ChannelProgressDraftCompositor = ReturnType<typeof createChannelProgressDraftCompositor>;
export type ChannelProgressDraftCompositorLine = string | ChannelProgressDraftLine;
export type ChannelProgressDraftUpdateOptions = {
    flush?: boolean;
    lines?: readonly ChannelProgressDraftCompositorLine[];
};
/** Creates a stateful compositor for one streaming channel reply. */
export declare function createChannelProgressDraftCompositor(params: {
    entry: StreamingCompatEntry | null | undefined;
    mode: ChannelProgressDraftMode;
    active: boolean;
    seed: string;
    update: (text: string, options?: ChannelProgressDraftUpdateOptions) => Promise<void> | void;
    deleteCurrent?: () => Promise<void> | void;
    tryNativeUpdate?: (text: string) => Promise<boolean> | boolean;
    formatLine?: (line: string) => string;
    isEmptyLine?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
    shouldStartNow?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
}): {
    readonly previewToolProgressEnabled: boolean;
    readonly commentaryProgressEnabled: boolean;
    readonly suppressDefaultToolProgressMessages: boolean;
    readonly hasStarted: boolean;
    markFinalReplyStarted(): void;
    markFinalReplyDelivered(): void;
    reset(): void;
    resetReasoningProgress(): void;
    suppress(): void;
    cancel(): void;
    start(): Promise<void>;
    noteActivity(options?: {
        startImmediately?: boolean;
    }): Promise<boolean>;
    pushToolProgress: (line?: ChannelProgressDraftCompositorLine, options?: {
        toolName?: string;
        startImmediately?: boolean;
    }) => Promise<boolean>;
    pushReasoningProgress(text?: string, options?: {
        snapshot?: boolean;
    }): Promise<boolean>;
    pushCommentaryProgress(text?: string, options?: {
        itemId?: string;
    }): Promise<boolean>;
};
