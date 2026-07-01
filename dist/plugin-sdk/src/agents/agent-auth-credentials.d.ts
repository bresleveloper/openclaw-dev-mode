import type { AuthProfileStore } from "./auth-profiles.js";
type AgentApiKeyCredential = {
    type: "api_key";
    key: string;
};
type AgentOAuthCredential = {
    type: "oauth";
    access: string;
    refresh: string;
    expires: number;
};
/** Credential value shape consumed by agent runtimes after auth-profile normalization. */
type AgentCredential = AgentApiKeyCredential | AgentOAuthCredential;
export type AgentCredentialMap = Record<string, AgentCredential>;
type ResolveAgentCredentialMapOptions = {
    includeSecretRefPlaceholders?: boolean;
};
/** Build one credential per normalized provider from an auth profile store. */
export declare function resolveAgentCredentialMapFromStore(store: AuthProfileStore, options?: ResolveAgentCredentialMapOptions): AgentCredentialMap;
export {};
