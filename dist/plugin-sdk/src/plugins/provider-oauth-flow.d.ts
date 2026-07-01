/** Coordinates provider OAuth flows exposed by plugin-owned auth integrations. */
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
/** Prompt payload used when OAuth flow code entry needs user input. */
export type OAuthPrompt = {
    message: string;
    placeholder?: string;
};
/** Creates OAuth callbacks that use local browser auth locally and manual code entry on VPS hosts. */
export declare function createVpsAwareOAuthHandlers(params: {
    isRemote: boolean;
    prompter: WizardPrompter;
    runtime: RuntimeEnv;
    spin: ReturnType<WizardPrompter["progress"]>;
    openUrl: (url: string) => Promise<unknown>;
    localBrowserMessage: string;
    manualPromptMessage?: string;
}): {
    onAuth: (event: {
        url: string;
    }) => Promise<void>;
    onPrompt: (prompt: OAuthPrompt) => Promise<string>;
};
