/** Throttled draft-stream sender used by channels that edit in-progress replies. */
export type DraftStreamLoop = {
    update: (text: string) => void;
    flush: () => Promise<void>;
    stop: () => void;
    resetPending: () => void;
    resetThrottleWindow: () => void;
    waitForInFlight: () => Promise<void>;
};
/** Creates a single-flight draft stream loop that preserves the newest pending text. */
export declare function createDraftStreamLoop(params: {
    throttleMs: number;
    isStopped: () => boolean;
    sendOrEditStreamMessage: (text: string) => Promise<void | boolean>;
    onBackgroundFlushError?: (err: unknown) => void;
}): DraftStreamLoop;
