/** Minimal OpenAI-compatible video response payload shape. */
export type OpenAiCompatibleVideoPayload = {
    choices?: Array<{
        message?: {
            content?: string | Array<{
                text?: string;
            }>;
            reasoning_content?: string;
        };
    }>;
};
/** Trim optional strings, falling back when empty. */
export declare function resolveMediaUnderstandingString(value: string | undefined, fallback: string): string;
/** Coerce text from OpenAI-compatible content or reasoning fields. */
export declare function coerceOpenAiCompatibleVideoText(payload: OpenAiCompatibleVideoPayload): string | null;
/** Build an OpenAI-compatible request body with an inline data URL video. */
export declare function buildOpenAiCompatibleVideoRequestBody(params: {
    model: string;
    prompt: string;
    mime: string;
    buffer: Buffer;
}): {
    model: string;
    messages: {
        role: string;
        content: ({
            type: string;
            text: string;
            video_url?: undefined;
        } | {
            text?: undefined;
            type: string;
            video_url: {
                url: string;
            };
        })[];
    }[];
};
