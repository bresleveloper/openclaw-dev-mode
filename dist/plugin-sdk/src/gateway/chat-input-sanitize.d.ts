/** Normalize chat text and reject null bytes before routing to channels. */
export declare function sanitizeChatSendMessageInput(message: string): {
    ok: true;
    message: string;
} | {
    ok: false;
    error: string;
};
