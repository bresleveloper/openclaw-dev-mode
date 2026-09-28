import { a as ProviderPrepareDynamicModelContext, c as ProviderCatalogResult, d as ProviderAuthResult, f as SecretInputMode, l as ProviderAppGuidedSetupContext, m as WizardPrompter, o as ProviderRuntimeModel, s as ProviderCatalogContext, u as ProviderAuthMethodNonInteractiveContext } from "../../index-CAkAR5W-.js";
import { c as ModelProviderDeclarationConfig, n as OpenClawConfig } from "../../types.openclaw-BGrO5JfP.js";
import "../../types-BNSWPjt2.js";
import "../../config-Bk-rqMdT.js";
import { A as LMSTUDIO_PROVIDER_LABEL, C as LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, D as LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, E as LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL, O as LMSTUDIO_MODEL_PLACEHOLDER, S as LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, T as LMSTUDIO_DOCKER_HOST_BASE_URL, _ as resolveLmstudioServerBase, a as resolveLmstudioRuntimeApiKey, b as LMSTUDIO_DEFAULT_BASE_URL, c as buildLmstudioModelName, d as normalizeLmstudioConfiguredCatalogEntries, f as normalizeLmstudioConfiguredCatalogEntry, g as resolveLmstudioReasoningCompat, h as resolveLmstudioReasoningCapability, i as resolveLmstudioRequestContext, k as LMSTUDIO_PROVIDER_ID, l as mapLmstudioWireEntry, m as resolveLmstudioInferenceBase, n as resolveLmstudioConfiguredApiKey, o as LmstudioModelBase, p as normalizeLmstudioProviderConfig, r as resolveLmstudioProviderHeaders, s as LmstudioModelWire, t as buildLmstudioAuthHeaders, u as mapLmstudioWireModelsToConfig, v as resolveLoadedContextWindow, w as LMSTUDIO_DEFAULT_MODEL_ID, x as LMSTUDIO_DEFAULT_EMBEDDING_MODEL, y as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR } from "../../runtime-BTESOGwe.js";
//#region extensions/lmstudio/src/setup.d.ts
type ProviderPromptText = (params: {
  message: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string | undefined) => string | undefined;
}) => Promise<string | undefined>;
type ProviderPromptNote = (message: string, title?: string) => Promise<void> | void;
/** Read-only local discovery plus a success-gated config proposal for guided setup. */
export declare function prepareAppGuidedLmstudioSetup(ctx: ProviderAppGuidedSetupContext & {
  modelRef?: string;
}): Promise<ProviderAuthResult | null>;
/** Read-only reachability probe for app-guided setup when no loaded model qualifies. */
export declare function detectAppGuidedLmstudioAvailability(ctx: ProviderAppGuidedSetupContext): Promise<boolean>;
/** Interactive LM Studio setup with connectivity and model-availability checks. */
export declare function promptAndConfigureLmstudioInteractive(params: {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  prompter?: WizardPrompter;
  secretInputMode?: SecretInputMode;
  allowSecretRefPrompt?: boolean;
  isRemote?: boolean;
  signal?: AbortSignal;
  suppliedApiKey?: string;
  requestedModelId?: string;
  promptText?: ProviderPromptText;
  note?: ProviderPromptNote;
}): Promise<ProviderAuthResult>;
/** Non-interactive setup path backed by the shared self-hosted helper. */
export declare function configureLmstudioNonInteractive(ctx: ProviderAuthMethodNonInteractiveContext): Promise<OpenClawConfig | null>;
/** Discovers provider settings, merging explicit config with live model discovery. */
export declare function discoverLmstudioProvider(ctx: ProviderCatalogContext): Promise<{
  provider: ModelProviderDeclarationConfig;
} | null>;
export declare function discoverLmstudioProvider(ctx: ProviderCatalogContext, options: {
  discoveryMode: "strict";
}): Promise<ProviderCatalogResult>;
export declare function prepareLmstudioDynamicModel(ctx: ProviderPrepareDynamicModelContext): Promise<ProviderRuntimeModel | undefined>;
//#endregion
export { LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, LMSTUDIO_DEFAULT_BASE_URL, LMSTUDIO_DEFAULT_EMBEDDING_MODEL, LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, LMSTUDIO_DEFAULT_MODEL_ID, LMSTUDIO_DOCKER_HOST_BASE_URL, LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL, LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, LMSTUDIO_MODEL_PLACEHOLDER, LMSTUDIO_PROVIDER_ID, LMSTUDIO_PROVIDER_LABEL, type LmstudioModelBase, type LmstudioModelWire, buildLmstudioAuthHeaders, buildLmstudioModelName, mapLmstudioWireEntry, mapLmstudioWireModelsToConfig, normalizeLmstudioConfiguredCatalogEntries, normalizeLmstudioConfiguredCatalogEntry, normalizeLmstudioProviderConfig, resolveLmstudioConfiguredApiKey, resolveLmstudioInferenceBase, resolveLmstudioProviderHeaders, resolveLmstudioReasoningCapability, resolveLmstudioReasoningCompat, resolveLmstudioRequestContext, resolveLmstudioRuntimeApiKey, resolveLmstudioServerBase, resolveLoadedContextWindow };