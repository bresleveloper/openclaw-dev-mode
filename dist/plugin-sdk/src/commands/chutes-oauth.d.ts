import type { ChutesOAuthAppConfig } from "../agents/chutes-oauth.js";
import { generateChutesPkce } from "../agents/chutes-oauth.js";
import type { OAuthCredentials } from "../llm/oauth.js";
type OAuthPrompt = {
    message: string;
    placeholder?: string;
};
/** Run a PKCE OAuth login for Chutes and exchange the resulting code for credentials. */
export declare function loginChutes(params: {
    app: ChutesOAuthAppConfig;
    manual?: boolean;
    timeoutMs?: number;
    createPkce?: typeof generateChutesPkce;
    createState?: () => string;
    onAuth: (event: {
        url: string;
    }) => Promise<void>;
    onPrompt: (prompt: OAuthPrompt) => Promise<string>;
    onProgress?: (message: string) => void;
    fetchFn?: typeof fetch;
}): Promise<OAuthCredentials>;
export {};
