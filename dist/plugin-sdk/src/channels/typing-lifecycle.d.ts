type AsyncTick = () => Promise<void> | void;
type TypingKeepaliveLoop = {
    tick: () => Promise<void>;
    start: () => void;
    stop: () => void;
    isRunning: () => boolean;
};
/** Creates a cancellable keepalive loop for channel typing indicators. */
export declare function createTypingKeepaliveLoop(params: {
    intervalMs: number;
    onTick: AsyncTick;
}): TypingKeepaliveLoop;
export {};
