import type { OAuthCredentials } from "../llm/oauth.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
type OpenAICodexOAuthLoginParams = {
    prompter: WizardPrompter;
    runtime: RuntimeEnv;
    isRemote: boolean;
    openUrl: (url: string) => Promise<void>;
    signal?: AbortSignal;
    onManualCodeInput?: () => Promise<string>;
    localBrowserMessage?: string;
};
/** @deprecated OpenAI Codex OAuth is owned by the OpenAI plugin auth hook. */
export declare function loginOpenAICodexOAuth(params: OpenAICodexOAuthLoginParams): Promise<OAuthCredentials | null>;
export {};
