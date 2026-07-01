import { i as OpenClawConfig } from "./types.openclaw-DlpCUWMr.js";
import { Ot as ProviderAuthMethod, pn as ProviderPluginWizardSetup } from "./types-BVLQjFJF.js";

//#region src/plugins/provider-api-key-auth.d.ts
type ProviderApiKeyAuthMethodOptions = {
  providerId: string;
  methodId: string;
  label: string;
  hint?: string;
  wizard?: ProviderPluginWizardSetup;
  optionKey: string;
  flagName: `--${string}`;
  envVar: string;
  promptMessage: string;
  profileId?: string;
  profileIds?: string[];
  allowProfile?: boolean;
  defaultModel?: string;
  expectedProviders?: string[];
  metadata?: Record<string, string>;
  noteMessage?: string;
  noteTitle?: string;
  applyConfig?: (cfg: OpenClawConfig) => OpenClawConfig;
};
/** Creates a provider auth method that captures, stores, and configures API-key credentials. */
declare function createProviderApiKeyAuthMethod(params: ProviderApiKeyAuthMethodOptions): ProviderAuthMethod;
//#endregion
export { createProviderApiKeyAuthMethod as t };