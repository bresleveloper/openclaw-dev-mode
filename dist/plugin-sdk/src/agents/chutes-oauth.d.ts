import type { OAuthCredentials } from "../llm/oauth.js";
export declare const CHUTES_AUTHORIZE_ENDPOINT = "https://api.chutes.ai/idp/authorize";
export declare const CHUTES_TOKEN_ENDPOINT = "https://api.chutes.ai/idp/token";
export declare const CHUTES_USERINFO_ENDPOINT = "https://api.chutes.ai/idp/userinfo";
type ChutesPkce = {
    verifier: string;
    challenge: string;
};
/** OAuth client settings for the Chutes authorization-code flow. */
export type ChutesOAuthAppConfig = {
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    scopes: string[];
};
type ChutesStoredOAuth = OAuthCredentials & {
    clientId?: string;
};
/** Generates a PKCE verifier/challenge pair for Chutes login. */
export declare function generateChutesPkce(): ChutesPkce;
/** Parses pasted Chutes redirect input and enforces the expected OAuth state. */
export declare function parseOAuthCallbackInput(input: string, expectedState: string): {
    code: string;
    state: string;
} | {
    error: string;
};
/** Exchanges an authorization code for stored Chutes OAuth credentials. */
export declare function exchangeChutesCodeForTokens(params: {
    app: ChutesOAuthAppConfig;
    code: string;
    codeVerifier: string;
    fetchFn?: typeof fetch;
    now?: number;
}): Promise<ChutesStoredOAuth>;
/** Refreshes stored Chutes OAuth credentials, preserving refresh tokens when absent. */
export declare function refreshChutesTokens(params: {
    credential: ChutesStoredOAuth;
    fetchFn?: typeof fetch;
    now?: number;
}): Promise<ChutesStoredOAuth>;
export {};
