declare const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
export type OpenAICodexJwtPayload = {
    [OPENAI_CODEX_AUTH_CLAIM]?: {
        chatgpt_account_id?: unknown;
    };
    [key: string]: unknown;
};
export declare function decodeOpenAICodexJwtPayload(token: string): OpenAICodexJwtPayload | null;
export declare function resolveOpenAICodexAccountId(token: string): string | null;
export {};
