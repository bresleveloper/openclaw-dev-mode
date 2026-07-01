import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { f as ModelProviderConfig } from "./types.models-C597Wbu7.js";
import { i as WizardPrompter } from "./prompts-DgKIGa-v.js";
import { C as OpenClawPluginApi, Rt as ProviderCatalogContext, Tt as ProviderAuthContext, Wt as ProviderDiscoveryContext, hn as ProviderPrepareDynamicModelContext, jt as ProviderAuthResult, kt as ProviderAuthMethodNonInteractiveContext, qd as ProviderRuntimeModel } from "./types-CXLy55Xw.js";
import { LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, LMSTUDIO_DEFAULT_BASE_URL, LMSTUDIO_DEFAULT_EMBEDDING_MODEL, LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, LMSTUDIO_DEFAULT_MODEL_ID, LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, LMSTUDIO_MODEL_PLACEHOLDER, LMSTUDIO_PROVIDER_ID, LMSTUDIO_PROVIDER_LABEL, LmstudioModelBase, LmstudioModelWire, buildLmstudioAuthHeaders, discoverLmstudioModels, ensureLmstudioModelLoaded, fetchLmstudioModels, mapLmstudioWireEntry, normalizeLmstudioProviderConfig, resolveLmstudioConfiguredApiKey, resolveLmstudioInferenceBase, resolveLmstudioProviderHeaders, resolveLmstudioReasoningCapability, resolveLmstudioRuntimeApiKey, resolveLmstudioServerBase, resolveLoadedContextWindow } from "./lmstudio-runtime.js";

//#region src/plugin-sdk/lmstudio.d.ts
type LmstudioInteractiveParams = {
  config: OpenClawConfig;
  prompter?: WizardPrompter;
  secretInputMode?: unknown;
  allowSecretRefPrompt?: boolean;
  promptText?: (params: {
    message: string;
    initialValue?: string;
    placeholder?: string;
    validate?: (value: string | undefined) => string | undefined;
  }) => Promise<string | undefined>;
  note?: (message: string, title?: string) => Promise<void> | void;
};
type FacadeModule = {
  promptAndConfigureLmstudioInteractive: (params: LmstudioInteractiveParams) => Promise<ProviderAuthResult>;
  configureLmstudioNonInteractive: (ctx: ProviderAuthMethodNonInteractiveContext) => Promise<OpenClawConfig | null>;
  discoverLmstudioProvider: (ctx: ProviderCatalogContext) => Promise<{
    provider: ModelProviderConfig;
  } | null>;
  prepareLmstudioDynamicModels: (ctx: ProviderPrepareDynamicModelContext) => Promise<ProviderRuntimeModel[]>;
};
/** Prompts for LM Studio configuration through the activated bundled provider facade. */
declare const promptAndConfigureLmstudioInteractive: FacadeModule["promptAndConfigureLmstudioInteractive"];
/** Applies non-interactive LM Studio auth/configuration through the provider facade. */
declare const configureLmstudioNonInteractive: FacadeModule["configureLmstudioNonInteractive"];
/** Discovers LM Studio provider config through the activated provider facade. */
declare const discoverLmstudioProvider: FacadeModule["discoverLmstudioProvider"];
/** Prepares dynamic LM Studio models through the activated provider facade. */
declare const prepareLmstudioDynamicModels: FacadeModule["prepareLmstudioDynamicModels"];
//#endregion
export { LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, LMSTUDIO_DEFAULT_BASE_URL, LMSTUDIO_DEFAULT_EMBEDDING_MODEL, LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, LMSTUDIO_DEFAULT_MODEL_ID, LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, LMSTUDIO_MODEL_PLACEHOLDER, LMSTUDIO_PROVIDER_ID, LMSTUDIO_PROVIDER_LABEL, type LmstudioModelBase, type LmstudioModelWire, type OpenClawPluginApi, type ProviderAuthContext, type ProviderAuthMethodNonInteractiveContext, type ProviderAuthResult, type ProviderCatalogContext, type ProviderDiscoveryContext, type ProviderPrepareDynamicModelContext, type ProviderRuntimeModel, buildLmstudioAuthHeaders, configureLmstudioNonInteractive, discoverLmstudioModels, discoverLmstudioProvider, ensureLmstudioModelLoaded, fetchLmstudioModels, mapLmstudioWireEntry, normalizeLmstudioProviderConfig, prepareLmstudioDynamicModels, promptAndConfigureLmstudioInteractive, resolveLmstudioConfiguredApiKey, resolveLmstudioInferenceBase, resolveLmstudioProviderHeaders, resolveLmstudioReasoningCapability, resolveLmstudioRuntimeApiKey, resolveLmstudioServerBase, resolveLoadedContextWindow };