import { type RuntimeEnv } from "../runtime.js";
type AgentsAddOptions = {
    name?: string;
    workspace?: string;
    model?: string;
    agentDir?: string;
    bind?: string[];
    nonInteractive?: boolean;
    json?: boolean;
};
declare function copyPortableAuthProfiles(params: {
    destAgentDir: string;
    sourceAgentDir: string;
}): Promise<{
    copied: number;
    skipped: number;
}>;
declare function formatSkippedOAuthProfilesMessage(params: {
    sourceAgentId: string;
    sourceIsInheritedMain: boolean;
}): string;
/** Create or update an agent through the non-interactive path or guided wizard. */
export declare function agentsAddCommand(opts: AgentsAddOptions, runtime?: RuntimeEnv, params?: {
    hasFlags?: boolean;
}): Promise<void>;
export declare const testing: {
    copyPortableAuthProfiles: typeof copyPortableAuthProfiles;
    formatSkippedOAuthProfilesMessage: typeof formatSkippedOAuthProfilesMessage;
};
export { testing as __testing };
