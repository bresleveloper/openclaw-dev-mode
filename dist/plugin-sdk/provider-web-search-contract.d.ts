import { Il as WebSearchProviderPlugin, Ll as WebSearchProviderSetupContext, Nl as WebSearchCredentialResolutionSource, Rl as WebSearchProviderToolDefinition, zl as WebSearchProviderToolExecutionContext } from "./types-CXLy55Xw.js";
import { t as enablePluginInConfig } from "./provider-enable-config-Boz7XZ64.js";
import { a as setProviderWebSearchPluginConfigValue, i as resolveProviderWebSearchPluginConfig, n as getTopLevelCredentialValue, o as setScopedCredentialValue, r as mergeScopedSearchConfig, s as setTopLevelCredentialValue, t as getScopedCredentialValue } from "./web-search-provider-config-BE-mhLBl.js";
import { i as WebSearchProviderContractFields, n as WebSearchProviderConfiguredCredential, r as WebSearchProviderContractCredential, t as CreateWebSearchProviderContractFieldsOptions } from "./provider-web-search-contract-fields-DLziXpqO.js";

//#region src/plugin-sdk/provider-web-search-contract.d.ts
type CreateWebSearchProviderSelectionOptions = CreateWebSearchProviderContractFieldsOptions & {
  /** Plugin id to enable when this provider is selected through setup/configuration flows. */selectionPluginId?: string;
};
/** Build the public web-search provider hooks, including optional selection-time plugin enabling. */
declare function createWebSearchProviderContractFields(options: CreateWebSearchProviderSelectionOptions): Pick<WebSearchProviderPlugin, "inactiveSecretPaths" | "getCredentialValue" | "setCredentialValue"> & Partial<Pick<WebSearchProviderPlugin, "applySelectionConfig" | "getConfiguredCredentialValue" | "setConfiguredCredentialValue">>;
//#endregion
export { type CreateWebSearchProviderContractFieldsOptions, type WebSearchCredentialResolutionSource, type WebSearchProviderConfiguredCredential, type WebSearchProviderContractCredential, type WebSearchProviderContractFields, type WebSearchProviderPlugin, type WebSearchProviderSetupContext, type WebSearchProviderToolDefinition, type WebSearchProviderToolExecutionContext, createWebSearchProviderContractFields, enablePluginInConfig, getScopedCredentialValue, getTopLevelCredentialValue, mergeScopedSearchConfig, resolveProviderWebSearchPluginConfig, setProviderWebSearchPluginConfigValue, setScopedCredentialValue, setTopLevelCredentialValue };