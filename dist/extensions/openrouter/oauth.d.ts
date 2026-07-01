import { jt as ProviderAuthResult } from "../../types-BVLQjFJF.js";
import { ft as ProviderAuthContext, mt as ProviderAuthMethod } from "../../plugin-entry-DpILbQ7M.js";
//#region extensions/openrouter/oauth.d.ts
declare const OPENROUTER_OAUTH_METHOD_ID = "oauth";
declare const OPENROUTER_OAUTH_CHOICE_ID = "openrouter-oauth";
declare const OPENROUTER_OAUTH_AUTHORIZE_URL = "https://openrouter.ai/auth";
declare const OPENROUTER_OAUTH_TOKEN_URL = "https://openrouter.ai/api/v1/auth/keys";
declare const OPENROUTER_OAUTH_CALLBACK_HOST = "localhost";
declare const OPENROUTER_OAUTH_CALLBACK_PORT = 3000;
declare const OPENROUTER_OAUTH_CALLBACK_PATH = "/openrouter-oauth/callback";
declare const OPENROUTER_OAUTH_REDIRECT_URI = "http://localhost:3000/openrouter-oauth/callback";
declare const OPENROUTER_OAUTH_CODE_CHALLENGE_METHOD = "S256";
type OpenRouterOAuthCallbackResult = {
  code: string;
  state: string;
};
type OpenRouterOAuthKeyResult = {
  key: string;
  userId?: string;
};
type OpenRouterOAuthLoginOptions = {
  createPkce?: () => {
    verifier: string;
    challenge: string;
  };
  createState?: () => string;
  fetchImpl?: typeof fetch;
  waitForCallback?: typeof waitForOpenRouterOAuthCallback;
};
declare function buildOpenRouterOAuthRedirectUri(params: {
  state: string;
}): string;
declare function buildOpenRouterOAuthAuthorizeUrl(params: {
  codeChallenge: string;
  state: string;
}): string;
declare function parseOpenRouterOAuthCallbackInput(input: string, expectedState: string): OpenRouterOAuthCallbackResult;
declare function exchangeOpenRouterOAuthCode(params: {
  code: string;
  codeVerifier: string;
  fetchImpl?: typeof fetch;
}): Promise<OpenRouterOAuthKeyResult>;
declare function waitForOpenRouterOAuthCallback(params: {
  expectedState: string;
  timeoutMs?: number;
  onProgress?: (message: string) => void;
}): Promise<OpenRouterOAuthCallbackResult>;
declare function loginOpenRouterOAuth(ctx: ProviderAuthContext, options?: OpenRouterOAuthLoginOptions): Promise<ProviderAuthResult>;
declare function createOpenRouterOAuthAuthMethod(): ProviderAuthMethod;
//#endregion
export { OPENROUTER_OAUTH_AUTHORIZE_URL, OPENROUTER_OAUTH_CALLBACK_HOST, OPENROUTER_OAUTH_CALLBACK_PATH, OPENROUTER_OAUTH_CALLBACK_PORT, OPENROUTER_OAUTH_CHOICE_ID, OPENROUTER_OAUTH_CODE_CHALLENGE_METHOD, OPENROUTER_OAUTH_METHOD_ID, OPENROUTER_OAUTH_REDIRECT_URI, OPENROUTER_OAUTH_TOKEN_URL, buildOpenRouterOAuthAuthorizeUrl, buildOpenRouterOAuthRedirectUri, createOpenRouterOAuthAuthMethod, exchangeOpenRouterOAuthCode, loginOpenRouterOAuth, parseOpenRouterOAuthCallbackInput, waitForOpenRouterOAuthCallback };