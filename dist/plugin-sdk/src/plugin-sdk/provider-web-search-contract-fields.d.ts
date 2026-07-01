import type { WebSearchProviderPlugin } from "../plugins/types.js";
/** Credential storage mode advertised by a web-search-capable provider. */
export type WebSearchProviderContractCredential = {
    type: "none";
} | {
    type: "top-level";
} | {
    type: "scoped";
    scopeId: string;
};
/** Config location used when a provider also stores credentials in plugin config. */
export type WebSearchProviderConfiguredCredential = {
    /** Plugin id whose config entry owns the credential value. */
    pluginId: string;
    /** Field name under the plugin config entry. Defaults to `apiKey`. */
    field?: string;
};
/** Inputs for building the shared credential accessors on web-search providers. */
export type CreateWebSearchProviderContractFieldsOptions = {
    /** Legacy or inactive secret path that should be reported for migration/doctor flows. */
    credentialPath: string;
    /** Additional inactive secret paths when a provider retired more than one location. */
    inactiveSecretPaths?: string[];
    /** Search-config credential storage mode exposed through provider runtime hooks. */
    searchCredential: WebSearchProviderContractCredential;
    /** Optional plugin-config credential storage used by install/configuration flows. */
    configuredCredential?: WebSearchProviderConfiguredCredential;
};
/** Shared provider hooks produced by the web-search credential contract helper. */
export type WebSearchProviderContractFields = Pick<WebSearchProviderPlugin, "inactiveSecretPaths" | "getCredentialValue" | "setCredentialValue"> & Partial<Pick<WebSearchProviderPlugin, "getConfiguredCredentialValue" | "setConfiguredCredentialValue">>;
/** Create the common credential hooks that web-search provider plugins spread into their entry. */
export declare function createBaseWebSearchProviderContractFields(options: CreateWebSearchProviderContractFieldsOptions): WebSearchProviderContractFields;
