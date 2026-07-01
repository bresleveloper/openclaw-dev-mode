/** Reason a media-understanding attachment was skipped. */
type MediaUnderstandingSkipReason = "maxBytes" | "timeout" | "unsupported" | "empty" | "blocked" | "tooSmall";
/** Error used when a media attachment should be skipped without failing the whole request. */
export declare class MediaUnderstandingSkipError extends Error {
    readonly reason: MediaUnderstandingSkipReason;
    constructor(reason: MediaUnderstandingSkipReason, message: string);
}
/** Narrow unknown errors to media-understanding skip errors. */
export declare function isMediaUnderstandingSkipError(err: unknown): err is MediaUnderstandingSkipError;
export {};
