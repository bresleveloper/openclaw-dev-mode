/**
 * Mutable finalization flags shared by draft stream controls and channel adapters.
 */
export type FinalizableDraftStreamState = {
    stopped: boolean;
    final: boolean;
};
type StopAndClearMessageIdParams<T> = {
    stopForClear: () => Promise<void>;
    readMessageId: () => T | undefined;
    clearMessageId: () => void;
};
type ClearFinalizableDraftMessageParams<T> = StopAndClearMessageIdParams<T> & {
    isValidMessageId: (value: unknown) => value is T;
    deleteMessage: (messageId: T) => Promise<void>;
    onDeleteSuccess?: (messageId: T) => void;
    warn?: (message: string) => void;
    warnPrefix: string;
};
type FinalizableDraftLifecycleParams<T> = Omit<ClearFinalizableDraftMessageParams<T>, "stopForClear"> & {
    throttleMs: number;
    state: FinalizableDraftStreamState;
    sendOrEditStreamMessage: (text: string) => Promise<boolean>;
};
/**
 * Creates controls for streaming preview messages that can be finalized, sealed, or cleared.
 */
export declare function createFinalizableDraftStreamControls(params: {
    throttleMs: number;
    isStopped: () => boolean;
    isFinal: () => boolean;
    markStopped: () => void;
    markFinal: () => void;
    sendOrEditStreamMessage: (text: string) => Promise<boolean>;
}): {
    loop: import("./draft-stream-loop.js").DraftStreamLoop;
    update: (text: string) => void;
    stop: () => Promise<void>;
    seal: () => Promise<void>;
    discardPending: () => Promise<void>;
    stopForClear: () => Promise<void>;
};
/**
 * Creates finalizable draft controls backed by a shared mutable state object.
 */
export declare function createFinalizableDraftStreamControlsForState(params: {
    throttleMs: number;
    state: FinalizableDraftStreamState;
    sendOrEditStreamMessage: (text: string) => Promise<boolean>;
}): {
    loop: import("./draft-stream-loop.js").DraftStreamLoop;
    update: (text: string) => void;
    stop: () => Promise<void>;
    seal: () => Promise<void>;
    discardPending: () => Promise<void>;
    stopForClear: () => Promise<void>;
};
/**
 * Stops a draft stream, reads the current preview message id, then clears the stored id.
 */
export declare function takeMessageIdAfterStop<T>(params: StopAndClearMessageIdParams<T>): Promise<T | undefined>;
/**
 * Stops a draft stream and deletes its preview message when the stored id is valid.
 */
export declare function clearFinalizableDraftMessage<T>(params: ClearFinalizableDraftMessageParams<T>): Promise<void>;
/**
 * Builds the standard draft lifecycle used by channel streaming preview implementations.
 */
export declare function createFinalizableDraftLifecycle<T>(params: FinalizableDraftLifecycleParams<T>): {
    loop: import("./draft-stream-loop.js").DraftStreamLoop;
    update: (text: string) => void;
    stop: () => Promise<void>;
    seal: () => Promise<void>;
    discardPending: () => Promise<void>;
    stopForClear: () => Promise<void>;
    clear: () => Promise<void>;
};
export {};
