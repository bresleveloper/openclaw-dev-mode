import type { TypingCallbacks } from "../../channels/typing.js";
import type { HumanDelayConfig } from "../../config/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SilentReplyConversationType } from "../../shared/silent-reply-policy.js";
import type { GetReplyOptions, ReplyPayload } from "../types.js";
import { type NormalizeReplySkipReason } from "./normalize-reply.js";
import type { ReplyDispatchBeforeDeliver, ReplyDispatchKind, ReplyDispatchRuntimeInfo, ReplyDispatcher, ReplyFollowupAdmissionBarrierTimeoutPolicy } from "./reply-dispatcher.types.js";
import type { ResponsePrefixContext } from "./response-prefix-template.js";
export type { ReplyDispatchKind, ReplyDispatcher } from "./reply-dispatcher.types.js";
type ReplyDispatchErrorHandler = (err: unknown, info: ReplyDispatchRuntimeInfo) => Promise<void> | void;
type ReplyDispatchSkipHandler = (payload: ReplyPayload, info: ReplyDispatchRuntimeInfo & {
    reason: NormalizeReplySkipReason;
}) => void;
type ReplyDispatchCancelHandler = (payload: ReplyPayload, info: ReplyDispatchRuntimeInfo) => Promise<void> | void;
type ReplyDispatchDeliverer = (payload: ReplyPayload, info: ReplyDispatchRuntimeInfo) => Promise<unknown>;
export type { ReplyDispatchBeforeDeliver };
export type ReplyDispatcherOptions = {
    deliver: ReplyDispatchDeliverer;
    silentReplyContext?: {
        cfg?: OpenClawConfig;
        sessionKey?: string;
        surface?: string;
        conversationType?: SilentReplyConversationType;
    };
    responsePrefix?: string;
    transformReplyPayload?: (payload: ReplyPayload) => ReplyPayload | null;
    /** Static context for response prefix template interpolation. */
    responsePrefixContext?: ResponsePrefixContext;
    /** Dynamic context provider for response prefix template interpolation.
     * Called at normalization time, after model selection is complete. */
    responsePrefixContextProvider?: () => ResponsePrefixContext;
    onHeartbeatStrip?: () => void;
    onIdle?: () => Promise<void> | void;
    onError?: ReplyDispatchErrorHandler;
    onSkip?: ReplyDispatchSkipHandler;
    /** Human-like delay between block replies for natural rhythm. */
    humanDelay?: HumanDelayConfig;
    beforeDeliver?: ReplyDispatchBeforeDeliver;
    onBeforeDeliverCancelled?: ReplyDispatchCancelHandler;
    /** Observe each queued payload settling, including cancellation and delivery failure. */
    onDeliverySettled?: (info: ReplyDispatchRuntimeInfo) => void;
    /** Resolve an owner activity policy for holding queued follow-ups behind delivery. */
    resolveFollowupAdmissionBarrierTimeoutPolicy?: (context: {
        queuedCounts: Readonly<Record<ReplyDispatchKind, number>>;
        humanDelayBudgetMs: number;
    }) => ReplyFollowupAdmissionBarrierTimeoutPolicy | undefined;
};
export type ReplyDispatcherWithTypingOptions = Omit<ReplyDispatcherOptions, "onIdle"> & {
    typingCallbacks?: TypingCallbacks;
    onReplyStart?: () => Promise<void> | void;
    onIdle?: () => Promise<void> | void;
    onSettled?: () => unknown;
    onFreshSettledDelivery?: () => unknown;
    /** Called when the typing controller is cleaned up (e.g., on NO_REPLY). */
    onCleanup?: () => void;
};
type ReplyDispatcherWithTypingResult = {
    dispatcher: ReplyDispatcher;
    replyOptions: Pick<GetReplyOptions, "onReplyStart" | "onTypingController" | "onTypingCleanup">;
    markDispatchIdle: () => void;
    /** Signal that the model run is complete so the typing controller can stop. */
    markRunComplete: () => void;
};
export declare function createReplyDispatcher(options: ReplyDispatcherOptions): ReplyDispatcher;
export declare function waitForReplyDispatcherIdle(dispatcher: Pick<ReplyDispatcher, "waitForIdle">, abortSignal?: AbortSignal): Promise<void>;
export declare function createReplyDispatcherWithTyping(options: ReplyDispatcherWithTypingOptions): ReplyDispatcherWithTypingResult;
