import type { ReplyDispatcher } from "./reply/reply-dispatcher.types.js";
/** Mark a dispatcher complete, wait for pending work, then run optional cleanup. */
export declare function settleReplyDispatcher(params: {
    dispatcher: ReplyDispatcher;
    onSettled?: () => void | Promise<void>;
}): Promise<void>;
/** Run work with a dispatcher and always drain it before returning or throwing. */
export declare function withReplyDispatcher<T>(params: {
    dispatcher: ReplyDispatcher;
    run: () => Promise<T>;
    onSettled?: () => void | Promise<void>;
}): Promise<T>;
