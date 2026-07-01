/** Environment and terminal facts used to decide decorative emoji support. */
export type DecorativeEmojiOptions = {
    env?: NodeJS.ProcessEnv;
    isTty?: boolean;
    platform?: NodeJS.Platform;
    stream?: {
        isTTY?: boolean;
    };
};
/** Return true when decorative emoji should be emitted for the target terminal. */
export declare function supportsDecorativeEmoji(options?: DecorativeEmojiOptions): boolean;
/** Return the emoji only when decorative emoji output is supported. */
export declare function decorativeEmoji(emoji: string, options?: DecorativeEmojiOptions): string;
/** Prefix text with a decorative emoji when supported. */
export declare function decorativePrefix(emoji: string, text: string, options?: DecorativeEmojiOptions): string;
/** Strip decorative emoji for terminals that should not receive them. */
export declare function stripDecorativeEmojiForTerminal(text: string, options?: DecorativeEmojiOptions): string;
